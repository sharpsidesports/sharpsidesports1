import { ReactNode } from 'react';
import BlurredPreview from './BlurredPreview';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredSubscription?: 'free' | 'pro' | 'enterprise';
  allowPreview?: boolean;
}

export default function ProtectedRoute({ 
  children,
  requiredSubscription,
  allowPreview = true 
}: ProtectedRouteProps) {
  // Temporarily allow full access by returning children directly
  return <>{children}</>;
}