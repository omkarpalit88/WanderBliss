  // src/supabase.ts
  import { createClient } from '@supabase/supabase-js'

  // Replace with your actual Supabase Project URL and Anon Key
  const supabaseUrl = 'https://qnqukxfchilujalwfrvx.supabase.co'
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucXVreGZjaGlsdWphbHdmcnZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MzIwNzMsImV4cCI6MjA2NzEwODA3M30.HORQgyVrl6O4QswWhsrgxbqnfi2LDIlMe7a59fT5xvQ'

  export const supabase = createClient(supabaseUrl, supabaseAnonKey)