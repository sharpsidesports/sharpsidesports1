// server / service‑role helper 
// Only imported by Node code (Express, Vercel Serverless Functions, scripts).
// Never import this in front‑end code (it would leak the secret).
// ───────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase.js';
import * as dotenv from 'dotenv';

// Optional: load .env when running locally (Vercel/Render/… already inject envs)
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  throw new Error('Missing Supabase env vars for admin helper');
}

export const supabaseAdmin = createClient<Database>(supabaseUrl, serviceKey, {
  auth: {
    // No sessions or cookies for server helpers
    persistSession: false,
    autoRefreshToken: false,
  },
});