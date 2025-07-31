import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mapbjmeaqputjfpnuehu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcGJqbWVhcXB1dGpmcG51ZWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NTgxNDcsImV4cCI6MjA2NzIzNDE0N30.ybpR_K_t9knwKZ6m3Ulrk5qxsLo26kbB4UepUjR5ZrA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);