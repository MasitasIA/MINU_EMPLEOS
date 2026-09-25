import { createClient } from "@/lib/supabase/server";

export interface UserSession {
  id: string;
  email: string;
  username: string;
  avatar_url?: string | null;
}

/**
 * Obtiene el usuario actual logueado leyendo la sesión real de Supabase.
 */
export async function getUser(): Promise<UserSession | null> {
  try {
    const supabase = await createClient();
    
    // 1. Obtener la sesión segura (verifica JWT y cookies)
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    // 2. Obtener el perfil extendido (username y avatar) desde la tabla pública
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", user.id)
      .single();

    return {
      id: user.id,
      email: user.email || "",
      username: profile?.username || "Usuario",
      avatar_url: profile?.avatar_url,
    };
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    return null;
  }
}
