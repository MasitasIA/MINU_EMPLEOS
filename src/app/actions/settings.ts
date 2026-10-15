"use server";

import { createClient } from "@supabase/supabase-js";
import { createCachedFunction } from "@/lib/cache";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/lib/supabase/config";

// Creamos un cliente anonimo y simple sin cookies ya que esto es información pública
export const getSiteSettings = createCachedFunction(
  async () => {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

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
    

