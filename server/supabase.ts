import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const supabaseServiceKey=process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseUrl=process.env.SUPABASE_URL

if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Server-side client with service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Client configuration for frontend
export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey
};