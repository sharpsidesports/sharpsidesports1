// browser / public helper
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase.js';

const isBrowser = typeof window !== 'undefined';

// ───────────────────────────────────────────────────────────
// These vars **must** be present in any place Vite builds the
// front‑end bundle ( .env , .env.local , Vercel Project vars … )
const supabaseUrl      = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey  = import.meta.env.VITE_SUPABASE_ANON_KEY;
// ───────────────────────────────────────────────────────────

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars for client helper');
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  // Only attach browser‑specific auth options when running in the browser:
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
);