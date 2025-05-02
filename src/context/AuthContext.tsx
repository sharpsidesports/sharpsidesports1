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
  refetchUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user data and update state
  const fetchAndSetUser = async () => {
    const { data: { user: supaUser } } = await supabase.auth.getUser();
    if (supaUser) {
      // We need the latest metadata which might have been updated by the webhook
      // Refresh the session to potentially get updated metadata, or re-map if getUser includes it
      // Note: Supabase client behavior on metadata freshness can vary. Explicit refresh might be safer.
      await supabase.auth.refreshSession(); // Attempt to refresh to get latest metadata
      const { data: { user: refreshedSupaUser } } = await supabase.auth.getUser(); // Get user data again after refresh
      setUser(refreshedSupaUser ? mapSupaUser(refreshedSupaUser) : null);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Fetch initial user data
    fetchAndSetUser();

    // Set up listener for auth state changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Re-fetch user data on auth change too, to ensure consistency
      fetchAndSetUser(); 
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Define the refetch function for external use
  const refetchUserData = async () => {
    setLoading(true); // Optionally set loading state
    await fetchAndSetUser();
  };

  const signIn = async (email: string, password: string) => {
    // setLoading(true); // setLoading is handled by fetchAndSetUser via onAuthStateChange
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // setUser state update is handled by onAuthStateChange listener
  };

  const signUp = async (email: string, password: string) => {
    // setLoading(true); // setLoading is handled by fetchAndSetUser via onAuthStateChange
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    // setUser state update is handled by onAuthStateChange listener
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    // setUser state update is handled by onAuthStateChange listener
  };

  const updateProfile = async (updates: Partial<User>) => {
    // This updates Supabase auth user metadata directly
    const { data, error } = await supabase.auth.updateUser({
      data: updates as Record<string, unknown>
    });
    if (error) throw error;
    // Update local state immediately after successful API call
    if (data.user) setUser(mapSupaUser(data.user)); 
  };

  const value = { user, loading, signIn, signUp, signOut, updateProfile, refetchUserData }; // Add refetch to context value

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