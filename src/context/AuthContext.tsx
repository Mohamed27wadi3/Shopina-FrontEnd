import { createContext, useContext, useState, ReactNode, useEffect } from "react";

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
} 

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

function getAuthHeaders() {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log("🔐 AuthProvider rendering");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE}/api/users/profile/`, { headers: { ...getAuthHeaders() } });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          console.warn('Failed to fetch profile');
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadProfile();
  }, []);

  const login = async (email: string, password: string) => {
    // Try with email first, then username if it fails
    let res = await fetch(`${API_BASE}/api/users/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    });
    
    if (!res.ok) {
      // Retry without modifying the input
      res = await fetch(`${API_BASE}/api/users/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
    }
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Authentication failed');
    }
    
    const data = await res.json();
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    
    // Fetch profile
    const profileRes = await fetch(`${API_BASE}/api/users/profile/`, { 
      headers: { Authorization: `Bearer ${data.access}` }
    });
    if (profileRes.ok) {
      const profile = await profileRes.json();
      setUser(profile);
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
      });
      
      console.log('📡 Signup response status:', res.status);
      
      if (!res.ok) {
        const err = await res.json();
        console.error('❌ Signup error:', err);
        
        // Format error message for user
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
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) setUser({ ...user, ...data });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile }}>
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
