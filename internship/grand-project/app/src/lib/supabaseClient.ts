import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log environment variable status (for debugging)
console.log('Supabase URL available:', !!supabaseUrl);
console.log('Supabase Anon Key available:', !!supabaseAnonKey);

// Validate environment variables
if (!supabaseUrl) {
  console.error('SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL environment variable is required');
  throw new Error('SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL environment variable is required');
}

if (!supabaseAnonKey) {
  console.error('SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is required');
  throw new Error('SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is required');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 