import { createClient } from '@supabase/supabase-js'

// Live Supabase credentials
const SUPABASE_URL = 'https://jgvijzcmdksxtiifeeki.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpndmlqemNtZGtzeHRpaWZlZWtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3OTY0MzcsImV4cCI6MjA2NjM3MjQzN30.jSyntcD8xHDYmPtQWZMmn6fJtJUtzgXA4AAWfXASpvU'

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

console.log('✅ Supabase connected successfully!')

export default supabase