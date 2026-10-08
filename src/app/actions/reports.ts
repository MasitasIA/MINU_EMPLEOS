"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export type ReportEntityType = "job" | "company" | "profile";

export async function submitReport(
  entityType: ReportEntityType,
  entityId: string,
  reason: string,
  description?: string
) {
  try {
    const supabase = await createClient();
    const user = await getUser();

    // Podemos permitir reportes anónimos, o requerir sesión. Requerir sesión evita spam masivo.
    if (!user) {
      return { success: false, error: "Debes iniciar sesión para enviar un reporte" };
    }

    const { error } = await supabase.from("reports").insert({
      reporter_id: user.id,
      entity_type: entityType,
      entity_id: entityId,
      reason,
      description: description || null,
      status: "pending"
    });

    if (error) {
      console.error("Error al enviar el reporte:", error);
      return { success: false, error: "Hubo un error al enviar el reporte. Inténtalo de nuevo." };
    }

    return { success: true };
  } catch (err) {
    console.error("Error inesperado al enviar el reporte:", err);
    return { success: false, error: "Error inesperado. Inténtalo de nuevo." };
  }
}
