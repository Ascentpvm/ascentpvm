import { createClient } from '@supabase/supabase-js';
import { serverConstants } from '@/config/constants.server';

// Client with anon key (respects RLS)
export const supabase = createClient(
  serverConstants.supabase.url,
  serverConstants.supabase.anonKey
);

// Admin client with service role key (bypasses RLS)
export const supabaseAdmin = createClient(
  serverConstants.supabase.url,
  serverConstants.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);