import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import type { User } from '../types/auth.js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async (userId: string) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status, stripe_customer_id')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return { 
        subscription_tier: 'free', 
        subscription_status: 'active',
        stripe_customer_id: null
      };
    }

    return profile;
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setUser({
          id: session.user.id,
          email: session.user.email!,
          subscription_tier: profile.subscription_tier || 'free',
          subscription_status: profile.subscription_status || 'active',
          created_at: session.user.created_at,
          stripe_customer_id: profile.stripe_customer_id
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setUser({
          id: session.user.id,
          email: session.user.email!,
          subscription_tier: profile.subscription_tier || 'free',
          subscription_status: profile.subscription_status || 'active',
          created_at: session.user.created_at,
          stripe_customer_id: profile.stripe_customer_id
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return { user, loading, error, signOut };
}