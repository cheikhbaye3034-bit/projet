import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://alyrucyihkxczwzgoxzu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFseXJ1Y3lpaGt4Y3p3emdveHp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNDM4MzgsImV4cCI6MjEwMjYxOTgzOH0.dmnpsEiV-Bcqz2YQm3AbLgRQDeaWtSan0krk_QcWlxA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
