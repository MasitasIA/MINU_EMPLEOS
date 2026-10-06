"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function applyToJob(jobId: string, coverLetter?: string) {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: "Debes iniciar sesión para postularte" };

    const supabase = await createClient();

    // Verificar perfil para el resume_url y nombre
    const { data: profile } = await supabase
      .from("profiles")
      .select("resume_url, full_name")
      .eq("id", user.id)
      .single();

    if (!profile?.resume_url) {
      return { success: false, error: "Debes subir tu CV en tu perfil antes de postularte" };
    }

    // Verificar que la oferta exista, esté activa y no haya expirado
    const { data: job } = await supabase
      .from("jobs")
      .select("is_active, expires_at, name, company_id")
      .eq("id", jobId)
      .single();

    if (!job || !job.is_active || (job.expires_at && new Date(job.expires_at) < new Date())) {
      return { success: false, error: "Esta oferta ha expirado o ya no se encuentra activa." };
    }

    // Verificar si ya se postuló
    const { data: existingApp } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", jobId)
      .eq("candidate_id", user.id)
      .maybeSingle();

    if (existingApp) {
      // Error silencioso: devolvemos true para no romper la UX
      return { success: true };
    }

    const { error } = await supabase.from("applications").insert({
      job_id: jobId,
      candidate_id: user.id,
      cover_letter: coverLetter || null,
      resume_url: profile.resume_url,
      status: 'pending'
    });

    if (error) {
      // Si la base de datos lanza error de constraint única (23505), lo ignoramos silenciosamente
      if (error.code === '23505') {
        return { success: true };
      }
      console.error("Error al postularse:", error);
      return { success: false, error: "Ocurrió un error al enviar tu postulación" };
    }

    // Obtener owner de la empresa para notificar
    if (job.company_id) {
      const { data: company } = await supabase
        .from("companies")
        .select("owner_id")
        .eq("id", job.company_id)
        .single();
        
      if (company?.owner_id) {
        const { error: notifError } = await supabase.from("notifications").insert({
          user_id: company.owner_id,
          title: "Nueva postulación",
          message: `${profile.full_name || 'Un candidato'} se ha postulado a "${job.name}".`,
          type: "new_application",
          link: `/panel-empresa/empleos/${jobId}/postulaciones`
        });
        
        if (notifError) {
          console.error("Error guardando notificación para empresa:", notifError);
        }
      }
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
      .select("*, profiles(full_name, title, resume_url, phone, bio, username, avatar_url)")
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
      .select("*, profiles(full_name, title, resume_url, phone, bio, username, avatar_url), jobs(name, slug)")
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

export async function updateApplicationStatus(applicationId: string, status: 'pending' | 'reviewed' | 'accepted' | 'rejected') {
    try {
        const user = await getUser();
        if (!user) return { success: false };
    
        const supabase = await createClient();
        
        // Verificar que la empresa que publicó el empleo pertenece al usuario actual
        const { data: application } = await supabase.from("applications").select("job_id, candidate_id").eq("id", applicationId).single();
        if (!application) return { success: false };
        
        const { data: job } = await supabase.from("jobs").select("company_id, name").eq("id", application.job_id).single();
        if (!job) return { success: false };
        
        const { data: company } = await supabase.from("companies").select("owner_id, name").eq("id", job.company_id).single();
        if (!company || company.owner_id !== user.id) return { success: false };
        
        const { error } = await supabase
          .from("applications")
          .update({ status, updated_at: new Date().toISOString() })
          .eq("id", applicationId);
    
        if (error) {
          console.error("Error actualizando postulación:", error);
          return { success: false };
        }
        
        // Registrar el evento
        await supabase.from("application_events").insert({
          application_id: applicationId,
          event_type: 'status_change',
          new_status: status,
          created_by: user.id,
          notes: `Estado cambiado a ${status}`
        });

        // Notificar al candidato
        if (application.candidate_id) {
          let title = "Actualización de postulación";
          let message = `La empresa ${company.name} ha actualizado el estado de tu postulación para "${job.name}".`;
          
          if (status === 'reviewed') {
            title = "Postulación revisada";
            message = `La empresa ${company.name} ha revisado tu postulación para "${job.name}".`;
          } else if (status === 'accepted') {
            title = "¡Has sido seleccionado!";
            message = `La empresa ${company.name} te ha seleccionado para continuar en el proceso de "${job.name}".`;
          } else if (status === 'rejected') {
            title = "Postulación rechazada";
            message = `La empresa ${company.name} ha decidido no continuar con tu postulación para "${job.name}".`;
          }

          const { error: notifError } = await supabase.from("notifications").insert({
            user_id: application.candidate_id,
            title,
            message,
            type: "status_change",
            link: "/mis-postulaciones"
          });
          
          if (notifError) {
            console.error("Error guardando notificación para candidato:", notifError);
          }
        }
    
        revalidatePath(`/panel-empresa`);
        return { success: true };
      } catch (error) {
        console.error("Error inesperado:", error);
        return { success: false };
      }
}
