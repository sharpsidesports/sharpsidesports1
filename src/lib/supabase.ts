import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage
    }
  }
);

// Export a function to check if the client is properly initialized
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    console.log('Supabase connection successful', data.session?.user?.id);
    return true;
  } catch (err) {
    console.error('Supabase connection error:', err);
    return false;
  }
};