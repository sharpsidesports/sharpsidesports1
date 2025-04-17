import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase.js'

const isBrowser = typeof window !== 'undefined'

// Ensure that the environment variables are set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  // Only supply the browser‐only auth/storage options when window is present
  isBrowser
    ? {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: window.localStorage,
        },
      }
    : undefined
)

// Optional helper to smoke‑test your auth setup
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    console.log('Supabase connected; current user:', data.session?.user?.id)
    return true
  } catch (err) {
    console.error('Supabase connection error:', err)
    return false
  }
}