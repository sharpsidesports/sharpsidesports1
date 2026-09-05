// Admin client for the reception model's own Supabase project — separate
// from the main app's project (src/lib/supabaseAdmin.ts). Only imported by
// Node code (Vercel Serverless Functions, scripts); never import in
// front-end code, it would leak the secret.
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/receptionModelSupabase.js';
import * as dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const supabaseUrl = process.env.RECEPTION_MODEL_SUPABASE_URL;
const serviceKey = process.env.RECEPTION_MODEL_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  throw new Error('Missing RECEPTION_MODEL_SUPABASE_* env vars for reception model admin helper');
}

export const receptionModelSupabaseAdmin = createClient<Database>(supabaseUrl, serviceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
