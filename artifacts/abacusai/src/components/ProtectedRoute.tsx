import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export function ProtectedRoute({ children, requireRole }: { children: React.ReactNode, requireRole?: string[] }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    } else if (!isLoading && isAuthenticated && requireRole && user) {
      if (!requireRole.includes(user.role)) {
        // Redirect to their respective dashboards if role doesn't match
        if (user.role === 'STUDENT') setLocation('/dashboard');
        else if (user.role === 'PARENT') setLocation('/parent');
        else if (user.role === 'TEACHER') setLocation('/teacher');
        else if (user.role === 'ADMIN') setLocation('/admin');
        else setLocation('/');
      }
    }
  }, [isAuthenticated, isLoading, setLocation, requireRole, user]);

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (requireRole && user && !requireRole.includes(user.role)) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
