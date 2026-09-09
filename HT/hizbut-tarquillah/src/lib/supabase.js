import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Attention: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY non défini dans le fichier .env.");
}

export const supabase = createClient(
  supabaseUrl || 'https://alyrucyihkxczwzgoxzu.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFseXJ1Y3lpaGt4Y3p3emdveHp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNDM4MzgsImV4cCI6MjEwMjYxOTgzOH0.dmnpsEiV-Bcqz2YQm3AbLgRQDeaWtSan0krk_QcWlxA'
);
