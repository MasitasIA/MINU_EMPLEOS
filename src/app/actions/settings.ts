"use server";

import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

// Creamos un cliente anonimo y simple sin cookies ya que esto es información pública
// y queremos aprovechar el fetch cache de Next.js
export const getSiteSettings = unstable_cache(
  async () => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cfwhoovpxhzjojstxrgx.supabase.co';
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmd2hvb3ZweGh6am9qc3R4cmd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1NDYyMDQsImV4cCI6MjEwNDEyMjIwNH0.MLdDSwQJY6pFQCcYpehot9bSNFc8uj7Oswyiguz2Lv0';
      
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching site settings:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Unexpected error in getSiteSettings:", error);
      return null;
    }
  },
  ['site_settings'],
  { revalidate: 300, tags: ['settings'] }
);
    

