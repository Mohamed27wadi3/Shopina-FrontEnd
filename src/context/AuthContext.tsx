import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { API_BASE } from "../utils/apiBase";

interface User {
  id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  avatar?: string;
  phone_number?: string;
  street_address?: string;
  city?: string;
  country?: string;
  plan: "free" | "starter" | "pro" | "enterprise";
  shop_name?: string;
  shop_slug?: string;
  last_password_change?: string;
  two_factor_enabled?: boolean;
  email_verified?: boolean;
  stores?: Array<{
    id: string;
    name: string;
    slug: string;
    status: 'draft' | 'live';
    template_id?: string;
  }>;
  active_store_id?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (identifier: string, password: string, remember?: boolean) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  refreshProfile: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function getAuthHeaders() {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  return Date.now() >= decoded.exp * 1000;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log("🔐 AuthProvider rendering");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshTokenValue = localStorage.getItem('refresh_token');
      if (!refreshTokenValue) {
        return false;
      }

      const response = await fetch(`${API_BASE}/api/users/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshTokenValue }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        console.log('✅ Token refreshed successfully');
        return true;
      } else {
        console.warn('❌ Failed to refresh token - clearing auth');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      return false;
    }
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          console.log('📭 No token found - user not authenticated');
          setUser(null);
          return;
        }

        if (isTokenExpired(token)) {
          console.log('⏰ Token expired - attempting refresh');
          const refreshed = await refreshToken();
          if (!refreshed) {
            console.log('❌ Token refresh failed - logging out');
            setUser(null);
            return;
          }
        }

        let retryCount = 0;
        const maxRetries = 2;
        
        while (retryCount <= maxRetries) {
          try {
            const res = await fetch(`${API_BASE}/api/users/profile/`, { 
              headers: { ...getAuthHeaders() },
              credentials: 'include',
            });

            if (res.ok) {
              const data = await res.json();
              console.log('✅ Profile loaded:', data.username);
              const savedStoreId = localStorage.getItem('active_store_id');
              if (savedStoreId) {
                data.active_store_id = savedStoreId;
              }
              setUser(data);
              return;
            } else if (res.status === 401 && retryCount === 0) {
              console.log('🔄 Unauthorized - attempting token refresh');
              const refreshed = await refreshToken();
              if (!refreshed) {
                console.log('❌ Token refresh failed');
                setUser(null);
                return;
              }
              retryCount++;
              continue;
            } else {
              console.warn('❌ Failed to fetch profile:', res.status);
              setUser(null);
              return;
            }
          } catch (fetchError) {
            console.error('❌ Profile fetch error:', fetchError);
            if (retryCount < maxRetries) {
              retryCount++;
              await new Promise(resolve => setTimeout(resolve, 1000));
              continue;
            }
            setUser(null);
            return;
          }
        }
      } catch (error) {
        console.error('❌ Profile load error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();

    const tokenRefreshInterval = setInterval(async () => {
      const token = localStorage.getItem('access_token');
      if (token && isTokenExpired(token)) {
        console.log('⏰ Token about to expire - refreshing');
        await refreshToken();
      }
    }, 50 * 60 * 1000);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token' && !e.newValue) {
        console.log('🔄 Token removed in another tab - logging out');
        setUser(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(tokenRefreshInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshToken]);

  const login = async (identifier: string, password: string, remember: boolean = false) => {
    try {
      const endpoint = remember
        ? `${API_BASE}/api/users/auth/remember-me/`
        : `${API_BASE}/api/users/token/`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(remember ? { identifier, password, remember: true } : { identifier, password }),
        credentials: 'include',
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        let err: any = {};
        try { err = JSON.parse(text); } catch {}
        throw new Error(err.detail || err.error || text || 'Authentication failed');
      }

      const data = await res.json().catch(() => ({}));
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      if (data.user) {
        setUser(data.user);
        return;
      }

      const profileRes = await fetch(`${API_BASE}/api/users/profile/`, {
        headers: { Authorization: `Bearer ${data.access}` },
        credentials: 'include',
      });
      if (profileRes.ok) {
        const profile = await profileRes.json();
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setUser(null);
      throw error;
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    console.log('🔐 Signup attempt:', { username, email });
    try {
      const payload = { username, email, password, password_confirm: password };
      console.log('📤 Sending payload:', payload);
      
      const res = await fetch(`${API_BASE}/api/users/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      
      console.log('📡 Signup response status:', res.status);
      
      if (!res.ok) {
        const err = await res.json();
        console.error('❌ Signup error:', err);
        
        let errorMsg = 'Erreur lors de la création du compte';
        if (err.error?.details?.password) {
          errorMsg = err.error.details.password.join(' ');
        } else if (err.error?.details?.username) {
          errorMsg = err.error.details.username.join(' ');
        } else if (err.error?.details?.email) {
          errorMsg = err.error.details.email.join(' ');
        } else if (err.error?.message) {
          errorMsg = err.error.message;
        }
        
        throw new Error(errorMsg);
      }
      
      const data = await res.json();
      console.log('✅ Signup success, tokens received:', { hasAccess: !!data.access, hasRefresh: !!data.refresh });
      
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      setUser(data.user);
    } catch (error) {
      console.error('❌ Signup exception:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('🚪 Logging out - clearing tokens and user data');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('active_store_id');
    setUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      if (data.active_store_id) {
        localStorage.setItem('active_store_id', data.active_store_id);
      }
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users/profile/`, { 
        headers: { ...getAuthHeaders() },
        credentials: 'include',
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log('✅ Profil rafraîchi depuis le serveur:', data.plan);
        setUser(data);
      } else {
        console.error('❌ Erreur rafraîchissement profil:', res.status);
      }
    } catch (error) {
      console.error('❌ Erreur rafraîchissement profil:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, signup, logout, updateProfile, refreshProfile, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
