"use server";

// Importaciones
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { CompanyCreateSchema, CompanyUpdateSchema } from "@/lib/validations";

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
export async function createCompany(companyData: any) {
  try {
    const user = await getUser();
    if (!user) {
      return {
        success: false,
        error: "Debes iniciar sesión para crear una empresa.",
      };
    }

    const parsedData = CompanyCreateSchema.safeParse(companyData);
    if (!parsedData.success) {
      return { success: false, error: "Datos de empresa inválidos." };
    }

    const supabase = await createClient();

    // Verificamos si ya tiene una empresa
    const existingCompany = await getCompanyByOwner(user.id);
    if (existingCompany) {
      return { success: false, error: "Ya tienes una empresa registrada." };
    }

    let slug = generateSlug(parsedData.data.name);

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
      name: parsedData.data.name,
      owner_id: user.id,
      description: parsedData.data.description,
      detailed_description: parsedData.data.detailed_description || null,
      locality_id: parsedData.data.locality_id,
      address: parsedData.data.address || null,
      phone: parsedData.data.phone || null,
      website: parsedData.data.website || null,
      size: parsedData.data.size || null,
      linkedin_url: parsedData.data.linkedin_url || null,
      social_urls: parsedData.data.social_urls || {},
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
      .eq("is_active", true)
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
      .select("*, localities(ciudad), categories(name)")
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
export async function updateCompany(oldSlug: string, companyData: any) {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "No autorizado." };
    }

    const parsedData = CompanyUpdateSchema.safeParse(companyData);
    if (!parsedData.success) {
      return { success: false, error: "Datos de empresa inválidos." };
    }

    const supabase = await createClient();

    // Validar que la empresa le pertenezca
    const { data: currentCompany } = await supabase
      .from("companies")
      .select("owner_id")
      .eq("id", oldSlug)
      .maybeSingle();

    if (!currentCompany || currentCompany.owner_id !== user.id) {
      return {
        success: false,
        error: "No tienes permiso para editar esta empresa.",
      };
    }

    // Si est cambiando el slug, verificar que el nuevo no exista
    if (oldSlug !== parsedData.data.id) {
      const { data: slugExists } = await supabase
        .from("companies")
        .select("id")
        .eq("id", parsedData.data.id)
        .maybeSingle();

      if (slugExists) {
        return {
          success: false,
          error: "Ese identificador (URL) ya está en uso por otra empresa.",
        };
      }
    }

    const { error: updateError } = await supabase
      .from("companies")
      .update({
        id: parsedData.data.id,
        name: parsedData.data.name,
        description: parsedData.data.description,
        detailed_description: parsedData.data.detailed_description || null,
        category_id: parsedData.data.category_id || null,
        locality_id: parsedData.data.locality_id || null,
        image_url: parsedData.data.image_url || null,
        cover_url: parsedData.data.cover_url || null,
        address: parsedData.data.address || null,
        phone: parsedData.data.phone || null,
        website: parsedData.data.website || null,
        size: parsedData.data.size || null,
        linkedin_url: parsedData.data.linkedin_url || null,
        social_urls: parsedData.data.social_urls || {},
        is_active:
          parsedData.data.is_active !== undefined
            ? parsedData.data.is_active
            : true,
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
      return {
        success: false,
        error: "No tienes permiso para eliminar esta empresa.",
      };
    }

    const { error } = await supabase.from("companies").delete().eq("id", slug);

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

/**
 * Solicita la verificación de una empresa.
 * Sube el documento probatorio y registra la solicitud en company_verifications.
 */
export async function requestCompanyVerification(formData: FormData) {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: "No autorizado." };

    const companyId = formData.get("companyId") as string;
    const taxId = formData.get("taxId") as string;
    const legalName = formData.get("legalName") as string;
    const comments = formData.get("comments") as string;
    const file = formData.get("document") as File;

    if (!companyId || !taxId || !legalName || !file) {
      return { success: false, error: "Faltan campos requeridos." };
    }

    const supabase = await createClient();

    // 1. Validar que la empresa sea del usuario
    const { data: company } = await supabase
      .from("companies")
      .select("owner_id")
      .eq("id", companyId)
      .maybeSingle();

    if (!company || company.owner_id !== user.id) {
      return {
        success: false,
        error: "No tienes permisos sobre esta empresa.",
      };
    }

    // 2. Subir documento (Asegurarse que el bucket COMPANY_VERIFICATIONS exista y sea privado)
    // Para simplificar, si no hay bucket, asumo que usaremos otro, o asumiremos que ya lo creará el dev
    const fileExt = file.name.split(".").pop();
    const fileName = `${companyId}-${Date.now()}.${fileExt}`;
    const filePath = `verifications/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("COMPANY_VERIFICATIONS")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Error subiendo documento:", uploadError);
      return {
        success: false,
        error: "Error al subir el documento. Revisa si el bucket existe.",
      };
    }

    // 3. Insertar registro en company_verifications
    const { error: insertError } = await supabase
      .from("company_verifications")
      .insert({
        company_id: companyId,
        tax_id: taxId,
        legal_name: legalName,
        document_url: filePath,
        comments: comments || null,
        status: "pending",
      });

    if (insertError) {
      console.error("Error insertando verificacion:", insertError);
      return { success: false, error: "Error al registrar la solicitud." };
    }

    // Simular el envío de un correo electrónico
    console.log(
      `[SIMULACIÓN DE EMAIL] Enviando correo a soporte@minuempleos.com: Nueva verificación pendiente para ${legalName} (CUIT: ${taxId})`,
    );

    return { success: true };
  } catch (error) {
    console.error("Error inesperado en requestCompanyVerification:", error);
    return { success: false, error: "Error interno del servidor." };
  }
}
