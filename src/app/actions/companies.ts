"use server";

// Importaciones
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

// Función auxiliar para generar el slug (ID de la empresa) a partir del nombre
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD") // Descompone acentos
    .replace(/[\u0300-\u036f]/g, "") // Remueve acentos
    .replace(/[^a-z0-9\s-]/g, "") // Remueve caracteres especiales
    .trim()
    .replace(/\s+/g, "-"); // Reemplaza espacios por guiones
}

/**
 * Obtiene la empresa del usuario actualmente logueado.
 */
export async function getCompanyByOwner(userId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("owner_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error obteniendo empresa:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error inesperado en getCompanyByOwner:", error);
    return null;
  }
}

/**
 * Crea una nueva empresa para el usuario actual.
 */
export async function createCompany(companyData: {
  name: string;
  description: string;
  detailed_description?: string;
  locality_id: string;
  address?: string;
  phone?: string;
  website?: string;
}) {
  try {
    const user = await getUser();
    if (!user) {
      return {
        success: false,
        error: "Debes iniciar sesión para crear una empresa.",
      };
    }

    const supabase = await createClient();

    // Verificamos si ya tiene una empresa
    const existingCompany = await getCompanyByOwner(user.id);
    if (existingCompany) {
      return { success: false, error: "Ya tienes una empresa registrada." };
    }

    let slug = generateSlug(companyData.name);

    // Verificamos si el slug ya existe (búsqueda de colisiones)
    const { data: slugExists } = await supabase
      .from("companies")
      .select("id")
      .eq("id", slug)
      .maybeSingle();

    if (slugExists) {
      // Si el slug existe, le agregamos números aleatorios para hacerlo único
      slug = `${slug}-${Math.floor(Math.random() * 10000)}`;
    }

    const { error: insertError } = await supabase.from("companies").insert({
      id: slug,
      name: companyData.name,
      owner_id: user.id,
      description: companyData.description,
      detailed_description: companyData.detailed_description || null,
      locality_id: companyData.locality_id,
      address: companyData.address || null,
      phone: companyData.phone || null,
      website: companyData.website || null,
    });

    if (insertError) {
      console.error("Error creando empresa:", insertError);
      return {
        success: false,
        error:
          "Ocurrió un error al crear la empresa. Por favor intenta de nuevo.",
      };
    }

    revalidatePath("/panel-empresa");
    return { success: true };
  } catch (error) {
    console.error("Error inesperado en createCompany:", error);
    return { success: false, error: "Error interno del servidor." };
  }
}

/**
 * Obtiene todas las empresas (para el inicio y el directorio de empresas).
 */
export async function getAllCompanies() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("companies")
      .select("*, categories(name)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error obteniendo empresas:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error inesperado en getAllCompanies:", error);
    return [];
  }
}

/**
 * Obtiene una empresa especifica por su ID (slug).
 */
export async function getCompanyById(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("id", slug)
      .maybeSingle();

    if (error) {
      console.error("Error obteniendo empresa:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error inesperado en getCompanyById:", error);
    return null;
  }
}

/**
 * Actualiza los datos de la empresa, incluyendo la posibilidad de cambiar el ID (slug).
 */
export async function updateCompany(oldSlug: string, companyData: {
  id: string; // Nuevo slug
  name: string;
  description: string;
  detailed_description?: string;
  category_id?: string;
  image_url?: string;
  cover_url?: string;
  phone?: string;
  website?: string;
}) {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "No autorizado." };
    }

    const supabase = await createClient();

    // Validar que la empresa le pertenezca
    const { data: currentCompany } = await supabase
      .from("companies")
      .select("owner_id")
      .eq("id", oldSlug)
      .maybeSingle();

    if (!currentCompany || currentCompany.owner_id !== user.id) {
      return { success: false, error: "No tienes permiso para editar esta empresa." };
    }

    // Si est cambiando el slug, verificar que el nuevo no exista
    if (oldSlug !== companyData.id) {
      const { data: slugExists } = await supabase
        .from("companies")
        .select("id")
        .eq("id", companyData.id)
        .maybeSingle();

      if (slugExists) {
        return { success: false, error: "Ese identificador (URL) ya está en uso por otra empresa." };
      }
    }

    const { error: updateError } = await supabase
      .from("companies")
      .update({
        id: companyData.id,
        name: companyData.name,
        description: companyData.description,
        detailed_description: companyData.detailed_description || null,
        category_id: companyData.category_id || null,
        image_url: companyData.image_url || null,
        cover_url: companyData.cover_url || null,
        phone: companyData.phone || null,
        website: companyData.website || null,
      })
      .eq("id", oldSlug);

    if (updateError) {
      console.error("Error actualizando empresa:", updateError);
      return { success: false, error: "Error al actualizar la empresa." };
    }

    revalidatePath("/panel-empresa");
    revalidatePath("/panel-empresa/ajustes");
    return { success: true };
  } catch (error) {
    console.error("Error inesperado en updateCompany:", error);
    return { success: false, error: "Error interno del servidor." };
  }
}

/**
 * Elimina una empresa definitivamente (requiere confirmacin en UI).
 */
export async function deleteCompany(slug: string) {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "No autorizado." };
    }

    const supabase = await createClient();

    // Validar que la empresa le pertenezca
    const { data: currentCompany } = await supabase
      .from("companies")
      .select("owner_id")
      .eq("id", slug)
      .maybeSingle();

    if (!currentCompany || currentCompany.owner_id !== user.id) {
      return { success: false, error: "No tienes permiso para eliminar esta empresa." };
    }

    const { error } = await supabase
      .from("companies")
      .delete()
      .eq("id", slug);

    if (error) {
      console.error("Error eliminando empresa:", error);
      return { success: false, error: "Error al eliminar la empresa." };
    }

    revalidatePath("/panel-empresa");
    return { success: true };
  } catch (error) {
    console.error("Error inesperado en deleteCompany:", error);
    return { success: false, error: "Error interno del servidor." };
  }
}
