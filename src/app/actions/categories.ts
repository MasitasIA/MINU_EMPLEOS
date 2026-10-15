"use server";

import { createPublicClient } from "@/lib/supabase/server";
import { createCachedFunction } from "@/lib/cache";

/**
 * Consulta cacheada de categorías (1 hora de revalidación).
 * Utiliza cliente público para no interactuar con cookies ni sesión de usuario.
 */
export const getAllCategories = createCachedFunction(
  async () => {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, icon")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error obteniendo categorías:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error inesperado en getAllCategories:", error);
      return [];
    }
  },
  ["all-categories-v1"],
  { revalidate: 3600, tags: ["categories"] }
);

/**
 * Consulta cacheada de categorías populares (1 hora de revalidación).
 */
export const getPopularCategories = createCachedFunction(
  async (limit: number = 5) => {
    try {
      const supabase = createPublicClient();
      
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, icon, jobs(count)");
        
      if (error) {
        console.error("Error obteniendo categorías populares:", error);
        return [];
      }
      
      const categoriesWithCount = (data || []).map((cat: any) => ({
        ...cat,
        jobCount: cat.jobs && cat.jobs[0] ? cat.jobs[0].count : 0
      }));
      
      const categoriesWithJobs = categoriesWithCount.filter(cat => cat.jobCount > 0);
      categoriesWithJobs.sort((a, b) => b.jobCount - a.jobCount);
      
      return categoriesWithJobs.slice(0, limit);
    } catch (error) {
      console.error("Error inesperado en getPopularCategories:", error);
      return [];
    }
  },
  ["popular-categories-v1"],
  { revalidate: 3600, tags: ["categories"] }
);

