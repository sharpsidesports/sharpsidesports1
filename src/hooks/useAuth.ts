import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '../types/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          subscription_tier: session.user.user_metadata.subscription_tier || 'free',
          subscription_status: session.user.user_metadata.subscription_status || 'active',
          created_at: session.user.created_at
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          subscription_tier: session.user.user_metadata.subscription_tier || 'free',
          subscription_status: session.user.user_metadata.subscription_status || 'active',
          created_at: session.user.created_at
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