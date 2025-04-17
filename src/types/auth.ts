export type SubscriptionTier = 'free' | 'basic' | 'pro';

export interface User {
  id: string;
  email: string;
  subscription_tier: SubscriptionTier;
  subscription_status: string;
  created_at: string;
  stripe_customer_id?: string;
  is_admin: boolean;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}