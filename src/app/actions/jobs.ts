"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getAllJobs() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("jobs")
      .select("*, companies(name, image_url), categories(name), localities(ciudad)")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error obteniendo empleos:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error inesperado en getAllJobs:", error);
    return [];
  }
}

export async function getJobById(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("jobs")
      .select("*, companies(*), categories(name), localities(ciudad)")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("Error obteniendo empleo:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error inesperado en getJobById:", error);
    return null;
  }
}

export async function getJobsByCompany(companyId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("jobs")
      .select("*, categories(name), localities(ciudad)")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error obteniendo empleos de la empresa:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error inesperado en getJobsByCompany:", error);
    return [];
  }
}

export async function createJob(jobData: any) {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: "No autorizado" };

    const supabase = await createClient();
    
    // Generar slug
    const baseSlug = jobData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const slug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;

    const { error } = await supabase.from("jobs").insert({
      company_id: jobData.company_id,
      category_id: jobData.category_id,
      name: jobData.name,
      slug: slug,
      description: jobData.description,
      salary_min: jobData.salary_min,
      salary_max: jobData.salary_max,
      vacancies: jobData.vacancies || 1,
      job_type: jobData.job_type || 'Full-time',
      modality: jobData.modality || 'Presencial',
      requirements: jobData.requirements,
      locality_id: jobData.locality_id,
      address: jobData.address || null,
    });

    if (error) {
      console.error("Error creando empleo:", error);
      return { success: false, error: "Error al crear el empleo" };
    }

    revalidatePath("/panel-empresa");
    revalidatePath("/empleos");
    return { success: true };
  } catch (error) {
    console.error("Error inesperado en createJob:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

export async function updateJob(id: string, jobData: any) {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: "No autorizado" };

    const supabase = await createClient();

    // Validar propiedad de la empresa (seguridad extra)
    const { data: job } = await supabase.from("jobs").select("company_id").eq("id", id).single();
    if (!job) return { success: false, error: "Empleo no encontrado" };
    const { data: company } = await supabase.from("companies").select("owner_id").eq("id", job.company_id).single();
    if (!company || company.owner_id !== user.id) return { success: false, error: "No tienes permiso" };

    const { error } = await supabase.from("jobs").update({
      category_id: jobData.category_id,
      name: jobData.name,
      description: jobData.description,
      salary_min: jobData.salary_min,
      salary_max: jobData.salary_max,
      vacancies: jobData.vacancies || 1,
      job_type: jobData.job_type || 'Full-time',
      modality: jobData.modality || 'Presencial',
      requirements: jobData.requirements,
      locality_id: jobData.locality_id,
      address: jobData.address || null,
    }).eq("id", id);

    if (error) {
      console.error("Error actualizando empleo:", error);
      return { success: false, error: "Error al actualizar el empleo" };
    }

    revalidatePath("/panel-empresa");
    revalidatePath("/empleos");
    return { success: true };
  } catch (error) {
    console.error("Error inesperado en updateJob:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

export async function toggleJobStatus(id: string, currentStatus: boolean) {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: "No autorizado" };

    const supabase = await createClient();
    const { error } = await supabase
      .from("jobs")
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (error) return { success: false, error: "Error al cambiar estado" };

    revalidatePath("/panel-empresa");
    revalidatePath("/empleos");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error interno" };
  }
}

export async function deleteJob(id: string) {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: "No autorizado" };

    const supabase = await createClient();
    
    // Primero borrar las postulaciones relacionadas
    await supabase.from("applications").delete().eq("job_id", id);
    
    // Luego borrar el empleo
    const { error } = await supabase.from("jobs").delete().eq("id", id);

    if (error) return { success: false, error: "Error al eliminar" };

    revalidatePath("/panel-empresa");
    revalidatePath("/empleos");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error interno" };
  }
}
