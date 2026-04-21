import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

// Admin client — uses service role key, bypasses RLS
export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);