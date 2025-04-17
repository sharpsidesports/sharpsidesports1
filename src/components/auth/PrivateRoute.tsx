import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext.js';

interface PrivateRouteProps {
  children: React.ReactNode | ((props: { user: any }) => React.ReactNode);
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (typeof children === 'function') {
    return <>{children({ user })}</>;
  }

  return <>{children}</>;
} 