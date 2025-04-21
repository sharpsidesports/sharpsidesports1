import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext.js';
import { SubscriptionTier } from '../../types/auth.js';
import BlurredPreview from './BlurredPreview.js';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredSubscription?: SubscriptionTier;
  showPreview?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requiredSubscription = 'free',
  showPreview = true 
}: ProtectedRouteProps) {
  const { user, loading } = useAuthContext();
  const userTier = user?.subscription_tier || 'free';
  const subscriptionLevels = { free: 0, basic: 1, pro: 2 };

  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is not authenticated and preview is disabled, redirect to auth
  if (!user && !showPreview) {
    return <Navigate to="/auth" />;
  }

  // If user has sufficient subscription level, show content
  if (user && subscriptionLevels[userTier] >= subscriptionLevels[requiredSubscription]) {
    return <>{children}</>;
  }

  // If preview is enabled, show blurred preview
  if (showPreview) {
    return (
      <BlurredPreview requiredSubscription={requiredSubscription}>
        {children}
      </BlurredPreview>
    );
  }

  // Otherwise redirect to subscription page
  return <Navigate to="/subscription" />;
}