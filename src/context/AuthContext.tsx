import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase.js';
import type { User as SupaUser } from '@supabase/supabase-js';
import type { User } from '../types/auth.js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // we're searching public.profiles for user.id, but we shouldn't do this
    // eventually we should use the user_metadata field in the auth.users table
    // ----------------------------------------------------------------------
    supabase.auth.getSession().then(async ({ data }) => {
      const sessionUser = data.session?.user;
    
      if (sessionUser) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sessionUser.id)
          .single();
    
        if (error || !profile) {
          console.warn('Failed to fetch profile:', error?.message);
          setUser(mapSupaUser(sessionUser)); // fallback to metadata
        } else {
          setUser({
            id: sessionUser.id,
            email: sessionUser.email || '',
            created_at: sessionUser.created_at,
            is_admin: profile.is_admin ?? false,
            subscription_tier: profile.subscription_tier ?? 'free',
            subscription_status: profile.subscription_status ?? 'inactive',
          });
        }
      }
    
      setLoading(false);
    });
// ------------------------------------------------^^^^^^^^^^^------- replace this with metadata
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? mapSupaUser(session.user) : null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) setUser(mapSupaUser(data.user));
    setLoading(false);
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user) setUser(mapSupaUser(data.user));
    setLoading(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    const { data, error } = await supabase.auth.updateUser({
      data: updates as Record<string, unknown>
    });
    if (error) throw error;
    if (data.user) setUser(mapSupaUser(data.user));
  };

  const value = { user, loading, signIn, signUp, signOut, updateProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be inside AuthProvider');
  return ctx;
}

// Map Supabase User into your app's User shape
function mapSupaUser(u: SupaUser): User {
  return {
    id: u.id,
    email: u.email || '',
    created_at: u.created_at,
    is_admin: (u.user_metadata as any)?.is_admin ?? false,
    subscription_tier: (u.user_metadata as any)?.subscription_tier ?? 'free',
    subscription_status: (u.user_metadata as any)?.subscription_status ?? 'inactive',
  };
}