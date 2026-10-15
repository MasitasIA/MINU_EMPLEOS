"use server";

import { createPublicClient } from "@/lib/supabase/server";
import { createCachedFunction } from "@/lib/cache";

/**
 * Consulta cacheada de localidades (1 hora de revalidación).
 * Utiliza cliente público para no interactuar con cookies ni sesión de usuario.
 */
export const getAllLocalities = createCachedFunction(
  async () => {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("localities")
        .select("id, ciudad, slug")
        .order("ciudad", { ascending: true });

      if (error) {
        console.error("Error obteniendo localidades:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error inesperado en getAllLocalities:", error);
      return [];
    }
  },
  ["all-localities-v1"],
  { revalidate: 3600, tags: ["localities"] }
);

