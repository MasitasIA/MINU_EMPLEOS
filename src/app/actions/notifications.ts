"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  try {
    const user = await getUser();
    if (!user) return { notifications: [], unreadCount: 0 };

    const supabase = await createClient();

    const { data: notifications, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error obteniendo notificaciones:", error);
      return { notifications: [], unreadCount: 0 };
    }

    const { count, error: countError } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (countError) {
      console.error("Error obteniendo conteo de notificaciones no leídas:", countError);
    }

    return { 
      notifications: notifications || [], 
      unreadCount: count || 0 
    };
  } catch (error) {
    console.error("Error inesperado en getNotifications:", error);
    return { notifications: [], unreadCount: 0 };
  }
}

export async function markAsRead(notificationId: string) {
  try {
    const user = await getUser();
    if (!user) return { success: false };

    const supabase = await createClient();

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .eq("user_id", user.id); // Asegurar que sea suya

    if (error) return { success: false };

    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function markAllAsRead() {
  try {
    const user = await getUser();
    if (!user) return { success: false };

    const supabase = await createClient();

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (error) return { success: false };

    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
