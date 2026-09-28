import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '@/hooks/use-app';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: ('funcionario' | 'gestor')[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user } = useApp();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'gestor' ? '/dashboard' : '/minha-area'} replace />;
  }

  return <>{children}</>;
}
