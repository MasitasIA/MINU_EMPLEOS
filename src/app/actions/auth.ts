"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { ProfileSchema } from "@/lib/validations";

/**
 * Registra un nuevo usuario en Supabase Auth y luego
 * inserta su perfil en la tabla pública `profiles`.
 */
export async function registerUser(userData: any) {
  try {
    const supabase = await createClient();

    // 1. Crear el usuario en Supabase Auth (Tabla auth.users)
    // Pasamos los metadatos para que el trigger de la BBDD los capture e inserte en `profiles`
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.mail,
      password: userData.contrasena,
      options: {
        data: {
          username: userData.usuario,
          full_name: `${userData.nombre} ${userData.apellido}`,
          phone: userData.phone,
        },
      },
    });

    if (authError || !authData.user) {
      console.error("Error en Auth:", authError);
      return { success: false, error: authError?.message || "Error al crear cuenta." };
    }

    // El Trigger de Supabase ('on_auth_user_created') ya insertó los datos en la tabla 'profiles'
    return { success: true };
  } catch (error) {
    console.error("Error de servidor:", error);
    return { success: false, error: "Error de servidor. Intenta de nuevo." };
  }
}

/**
 * Verifica si un nombre de usuario ya está registrado en `profiles`.
 */
export async function checkUsernameAvailability(username: string) {
  try {
    const supabase = await createClient();
    
    // Usamos maybeSingle() que no arroja error si no encuentra nada (retorna null)
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (error) {
      console.error("Error buscando username:", error);
      return { available: false, error: "Error interno" };
    }

    // Si data existe, el username está tomado
    return { available: !data };
  } catch (error) {
    return { available: false, error: "Error de servidor" };
  }
}

/**
 * Inicia sesión usando Supabase Auth.
 */
export async function loginUser(emailOrUsername: string, contrasena: string) {
  try {
    const supabase = await createClient();
    
    let email = emailOrUsername;

    // Si no tiene '@', asumimos que es un username.
    // Supabase Auth requiere Email o Phone. Entonces buscamos el Email de ese username.
    if (!emailOrUsername.includes("@")) {
      const { data } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", emailOrUsername)
        .single();
        
      if (!data) {
        return { success: false, error: "Credenciales incorrectas" };
      }
      // NOTA: Para hacer un login real por username con Supabase Auth sin tener
      // el email, es un poco complejo (requiere edge functions o leer auth.users).
      // Para este MVP, si escriben un username, fallará si no tenemos el correo,
      // así que el formulario debería forzar el email por ahora, o crear una RPC 
      // en Supabase que devuelva el correo dado un username.
      // Para evitar bloqueos, por ahora retornamos error indicando que usen email.
      return { success: false, error: "Por favor usa tu Correo Electrónico para iniciar sesión por ahora." };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: contrasena,
    });

    if (error) {
      console.error("Error detallado de login:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return { success: false, error: "Error de conexión." };
  }
}

/**
 * Cierra la sesión en Supabase y redirige.
 */
export async function logoutUser() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

/**
 * Actualiza el perfil del usuario.
 */
export async function updateProfile(profileData: any) {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: "No autorizado" };

    const parsedData = ProfileSchema.safeParse(profileData);
    if (!parsedData.success) {
      return { success: false, error: "Datos inválidos" };
    }

    // Procesar skills (de string separado por comas a array de strings)
    let skillsArray: string[] | null = null;
    if (parsedData.data.skills) {
      skillsArray = parsedData.data.skills
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0);
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: parsedData.data.full_name,
        phone: parsedData.data.phone,
        bio: parsedData.data.bio,
        title: parsedData.data.title,
        resume_url: profileData.resume_url, // URL no viene del schema directamente
        is_public: parsedData.data.is_public,
        avatar_url: parsedData.data.avatar_url,
        linkedin_url: parsedData.data.linkedin_url,
        availability: parsedData.data.availability,
        mobility: parsedData.data.mobility,
        locality_id: parsedData.data.locality_id || null, // Guardar null si está vacío
        skills: skillsArray,
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error actualizando perfil:", error);
      return { success: false, error: "Error al actualizar perfil" };
    }
    return { success: true };
  } catch (error) {
    console.error("Error inesperado en updateProfile:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

/**
 * Obtiene el perfil completo del usuario desde la tabla profiles.
 */
export async function getProfile(userId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error obteniendo perfil:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error inesperado en getProfile:", error);
    return null;
  }
}

/**
 * Obtiene el perfil público del usuario mediante su username.
 */
export async function getProfileByUsername(username: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*, localities(ciudad)")
      .eq("username", username)
      .single();

    if (error) {
      console.error("Error obteniendo perfil por username:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error inesperado en getProfileByUsername:", error);
    return null;
  }
}

/**
 * Obtiene todos los perfiles públicos.
 */
export async function getAllPublicProfiles() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*, localities(ciudad)")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error obteniendo perfiles públicos:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error inesperado en getAllPublicProfiles:", error);
    return [];
  }
}

/**
 * Sube el archivo PDF del currículum al bucket de Supabase.
 */
export async function uploadResume(formData: FormData) {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: "No autorizado" };

    const supabase = await createClient();
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, error: "Faltan datos requeridos." };
    }

    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "El archivo no puede pesar más de 5MB." };
    }

    if (file.type !== "application/pdf") {
      return { success: false, error: "Formato de archivo inválido. Solo PDF." };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `resumes/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("RESUMES")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error subiendo el archivo:", uploadError);
      return { success: false, error: "Error al subir el archivo." };
    }

    // Actualizar la tabla profiles con la nueva URL automáticamente
    const { error: dbError } = await supabase
      .from("profiles")
      .update({ resume_url: filePath })
      .eq("id", user.id);

    if (dbError) {
      console.error("Error actualizando el perfil con el CV:", dbError);
      return { success: false, error: "Error al vincular el CV a tu perfil." };
    }

    // Retornamos la ruta interna (ej. resumes/uuid.pdf) en lugar de la URL pública, 
    // porque el bucket es privado y requeriremos Signed URLs para acceder.
    return { success: true, url: filePath };
  } catch (error) {
    console.error("Error en uploadResume:", error);
    return { success: false, error: "Error interno del servidor." };
  }
}

/**
 * Genera una URL firmada (temporal) para acceder a un CV privado.
 * Requiere que el bucket RESUMES no sea público.
 */
export async function getResumeSignedUrl(filePath: string) {
  try {
    const supabase = await createClient();
    
    // Genera un link válido por 1 hora (3600 segundos)
    const { data, error } = await supabase.storage
      .from("RESUMES")
      .createSignedUrl(filePath, 3600);

    if (error || !data) {
      console.error("Error generando Signed URL:", error);
      return { success: false, error: "No se pudo generar el enlace al CV." };
    }

    return { success: true, url: data.signedUrl };
  } catch (error) {
    console.error("Error en getResumeSignedUrl:", error);
    return { success: false, error: "Error interno del servidor." };
  }
}

/**
 * Elimina el archivo PDF del currículum del bucket de Supabase y de la base de datos.
 */
export async function deleteResume(filePath: string) {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: "No autorizado" };

    const supabase = await createClient();

    // Eliminar del bucket
    const { data: deleteData, error: deleteError } = await supabase.storage
      .from("RESUMES")
      .remove([filePath]);

    if (deleteError || !deleteData || deleteData.length === 0) {
      console.error("Error o rechazo de RLS eliminando el archivo del bucket:", deleteError, deleteData);
      return { success: false, error: "Error al eliminar el archivo del servidor." };
    }

    // Actualizar la base de datos para quitar la referencia
    const { error: dbError } = await supabase
      .from("profiles")
      .update({ resume_url: null })
      .eq("id", user.id);

    if (dbError) {
      console.error("Error actualizando perfil tras borrar CV:", dbError);
      return { success: false, error: "Error al actualizar tu perfil." };
    }

    return { success: true };
  } catch (error) {
    console.error("Error en deleteResume:", error);
    return { success: false, error: "Error interno del servidor." };
  }
}

/**
 * Elimina la cuenta de usuario actual permanentemente
 */
export async function deleteUserAccount() {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    const supabase = await createClient();
    
    // Al no disponer de supabase-admin para borrar auth.users, llamaremos a una RPC en supabase 
    // o borraremos el profile y desloguearemos como solución MVP
    const { error: rpcError } = await supabase.rpc('delete_user');
    
    if (rpcError) {
      // Fallback: Si no hay RPC configurada, borramos el perfil público.
      const { error: profileError } = await supabase.from('profiles').delete().eq('id', user.id);
      if (profileError) {
         return { success: false, error: "No se pudo eliminar el perfil." };
      }
    }

    // Cerrar sesión local (esto redirigirá si no lo capturamos, por eso await)
    // Pero como logoutUser() tiene un redirect("/"), cortará la ejecución, 
    // por lo tanto cerramos sesión a mano y evitamos el redirect aquí para devolver la resp.
    await supabase.auth.signOut();
    return { success: true };
  } catch (error) {
    console.error("Error inesperado en deleteUserAccount:", error);
    return { success: false, error: "Error interno del servidor." };
  }
}
