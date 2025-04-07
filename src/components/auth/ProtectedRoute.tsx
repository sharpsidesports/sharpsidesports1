import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import BlurredPreview from './BlurredPreview';
import { User } from '@supabase/supabase-js';

type SubscriptionTier = 'free' | 'pro' | 'enterprise';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredSubscription?: SubscriptionTier;
  allowPreview?: boolean;
}

export default function ProtectedRoute({ 
  children,
  requiredSubscription = 'free',
  allowPreview = false 
}: ProtectedRouteProps) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // If preview is allowed and user is not authenticated, show blurred preview
  if (!user && allowPreview) {
    return <BlurredPreview>{children}</BlurredPreview>;
  }

  // If no user and preview not allowed, redirect to auth
  if (!user) {
    return <Navigate to="/auth" state={{ from: window.location.pathname }} replace />;
  }

  // Check subscription requirements
  const userSubscription = (user.user_metadata?.subscription_tier || 'free') as SubscriptionTier;
  const subscriptionLevels: Record<SubscriptionTier, number> = { 
    free: 0, 
    pro: 1, 
    enterprise: 2 
  };
  
  if (subscriptionLevels[userSubscription] < subscriptionLevels[requiredSubscription]) {
    return <Navigate to="/subscription" replace />;
  }

  return <>{children}</>;
}