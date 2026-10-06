import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cfwhoovpxhzjojstxrgx.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmd2hvb3ZweGh6am9qc3R4cmd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1NDYyMDQsImV4cCI6MjEwNDEyMjIwNH0.MLdDSwQJY6pFQCcYpehot9bSNFc8uj7Oswyiguz2Lv0'
  )
}
