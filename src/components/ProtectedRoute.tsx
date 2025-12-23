import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ProtectedRoute component - redirects to login if user is not authenticated
 * @param children - Component to render if authenticated
 * @param fallback - Component to render while checking authentication (loading state)
 */
export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user } = useAuth();
  const token = localStorage.getItem('access_token');

  // Still loading authentication state
  if (!user && token) {
    return fallback || <div>Loading...</div>;
  }

  // Not authenticated
  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated - render the protected component
  return <>{children}</>;
}
