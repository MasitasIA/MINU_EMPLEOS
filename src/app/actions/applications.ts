"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function applyToJob(jobId: string, coverLetter?: string) {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: "Debes iniciar sesión para postularte" };

    const supabase = await createClient();

    // Obtener perfil para el resume_url
    const { data: profile } = await supabase
      .from("profiles")
      .select("resume_url")
      .eq("id", user.id)
      .single();

    if (!profile?.resume_url) {
      return { success: false, error: "Debes subir tu CV en tu perfil antes de postularte" };
    }

    // Verificar si ya se postuló
    const { data: existingApp } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", jobId)
      .eq("candidate_id", user.id)
      .maybeSingle();

    if (existingApp) {
      return { success: false, error: "Ya te has postulado a este empleo" };
    }

    const { error } = await supabase.from("applications").insert({
      job_id: jobId,
      candidate_id: user.id,
      cover_letter: coverLetter || null,
      resume_url: profile.resume_url,
      status: 'pending'
    });

    if (error) {
      console.error("Error al postularse:", error);
      return { success: false, error: "Ocurrió un error al enviar tu postulación" };
    }

    revalidatePath(`/empleos`);
    revalidatePath(`/mis-postulaciones`);
    return { success: true };
  } catch (error) {
    console.error("Error inesperado en applyToJob:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

export async function hasUserAppliedToJob(jobId: string, userId: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", jobId)
      .eq("candidate_id", userId)
      .maybeSingle();
      
    return !!data;
  } catch (error) {
    console.error("Error comprobando postulación:", error);
    return false;
  }
}

export async function getMyApplications() {
  try {
    const user = await getUser();
    if (!user) return [];

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("applications")
      .select("*, jobs(name, slug, companies(name, image_url))")
      .eq("candidate_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error obteniendo postulaciones:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error inesperado en getMyApplications:", error);
    return [];
  }
}

export async function getApplicationsForJob(jobId: string) {
  try {
    const user = await getUser();
    if (!user) return [];

    const supabase = await createClient();
    
    // Verificar que el usuario es el dueño de la empresa de este trabajo
    const { data: job } = await supabase
      .from("jobs")
      .select("companies(owner_id)")
      .eq("id", jobId)
      .single();
      
    // En Supabase JS las relaciones one-to-many pueden inferirse como array
    const companyOwnerId = Array.isArray(job?.companies) 
        ? job?.companies[0]?.owner_id 
        : (job?.companies as any)?.owner_id;

    if (!job || companyOwnerId !== user.id) {
        return [];
    }

    const { data, error } = await supabase
      .from("applications")
      .select("*, profiles(full_name, title, resume_url)")
      .eq("job_id", jobId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error obteniendo postulaciones del empleo:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error inesperado:", error);
    return [];
  }
}

export async function getApplicationsForCompany(companyId: string) {
  try {
    const user = await getUser();
    if (!user) return [];

    const supabase = await createClient();
    
    // Verificar propiedad
    const { data: company } = await supabase
      .from("companies")
      .select("owner_id")
      .eq("id", companyId)
      .single();
      
    if (!company || company.owner_id !== user.id) {
        return [];
    }

    // Obtener los trabajos de esta empresa
    const { data: jobs } = await supabase
      .from("jobs")
      .select("id")
      .eq("company_id", companyId);
      
    if (!jobs || jobs.length === 0) return [];
    
    const jobIds = jobs.map(j => j.id);

    const { data, error } = await supabase
      .from("applications")
      .select("*, profiles(full_name, title, resume_url), jobs(name, slug)")
      .in("job_id", jobIds)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error obteniendo postulaciones de la empresa:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error inesperado:", error);
    return [];
  }
}

export async function updateApplicationStatus(applicationId: string, status: 'pending' | 'accepted' | 'rejected') {
    try {
        const user = await getUser();
        if (!user) return { success: false };
    
        const supabase = await createClient();
        
        // Asumimos validación de propiedad de empresa en la UI o aquí
        const { error } = await supabase
          .from("applications")
          .update({ status, updated_at: new Date().toISOString() })
          .eq("id", applicationId);
    
        if (error) {
          console.error("Error actualizando postulación:", error);
          return { success: false };
        }
    
        revalidatePath(`/panel-empresa`);
        return { success: true };
      } catch (error) {
        console.error("Error inesperado:", error);
        return { success: false };
      }
}
