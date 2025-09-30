import { createClient } from '@supabase/supabase-js';
import { serverConstants } from '@/config/constants.server';

export const supabase = createClient(
  serverConstants.supabase.url,
  serverConstants.supabase.anonKey
);