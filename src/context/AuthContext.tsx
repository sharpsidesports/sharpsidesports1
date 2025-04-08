import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, checkSupabaseConnection } from '../lib/supabase';
import { User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Check Supabase connection first
        const isConnected = await checkSupabaseConnection();
        if (!isConnected) {
          throw new Error('Unable to connect to Supabase');
        }

        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (mounted) {
          if (session?.user) {
            // Get user's profile data
            const { data: profile } = await supabase
              .from('profiles')
              .select('subscription_tier, subscription_status')
              .eq('id', session.user.id)
              .single();

            // Create user object with profile data
            setUser({
              id: session.user.id,
              email: session.user.email!,
              subscription_tier: profile?.subscription_tier || 'free',
              subscription_status: profile?.subscription_status || 'active',
              created_at: session.user.created_at
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        }

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.id);
          if (mounted) {
            if (session?.user) {
              // Get user's profile data
              const { data: profile } = await supabase
                .from('profiles')
                .select('subscription_tier, subscription_status')
                .eq('id', session.user.id)
                .single();

              // Create user object with profile data
              setUser({
                id: session.user.id,
                email: session.user.email!,
                subscription_tier: profile?.subscription_tier || 'free',
                subscription_status: profile?.subscription_status || 'active',
                created_at: session.user.created_at
              });
            } else {
              setUser(null);
            }
            setLoading(false);
          }
        });

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize auth');
          setLoading(false);
        }
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // Get user's profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier, subscription_status')
        .eq('id', data.user.id)
        .single();

      // Create user object with profile data
      setUser({
        id: data.user.id,
        email: data.user.email!,
        subscription_tier: profile?.subscription_tier || 'free',
        subscription_status: profile?.subscription_status || 'active',
        created_at: data.user.created_at
      });
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign in');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            subscription_tier: 'free',
            subscription_status: 'active'
          }
        }
      });
      if (error) throw error;

      // Get user's profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier, subscription_status')
        .eq('id', data.user?.id)
        .single();

      // Create user object with profile data
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          subscription_tier: profile?.subscription_tier || 'free',
          subscription_status: profile?.subscription_status || 'active',
          created_at: data.user.created_at
        });
      }
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign up');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign out');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
} 