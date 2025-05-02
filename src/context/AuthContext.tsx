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
  refreshAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Renamed function, will be exposed via context
  const refreshAuthStatus = async () => {
    console.log('Explicitly refreshing auth status...');
    setLoading(true); // Indicate loading during refresh
    try {
      const { data: { user: supaUser } } = await supabase.auth.getUser();
      setUser(supaUser ? mapSupaUser(supaUser) : null);
    } catch (error) {
       console.error("Error refreshing auth status:", error); 
    } finally {
      setLoading(false); // Ensure loading is false after refresh attempt
    }
  };

  useEffect(() => {
    setLoading(true); // Set loading true at the start
    // Fetch the initial session and user data
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
         setUser(mapSupaUser(session.user));
      }
      setLoading(false);
    });

    // Set up listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth State Change Event:', _event, session);
      setUser(session?.user ? mapSupaUser(session.user) : null);
      setLoading(false); 
    });

    // Listener for window focus (kept as a fallback/general refresh mechanism)
    const handleFocus = () => {
      console.log('Window focused, refreshing user state...');
      refreshAuthStatus(); // Use the renamed function
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('focus', handleFocus);
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

  // Expose refreshAuthStatus in the context value
  const value = { user, loading, signIn, signUp, signOut, updateProfile, refreshAuthStatus };

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