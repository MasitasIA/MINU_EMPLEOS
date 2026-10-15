"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/session";

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

/**
 * Obtiene únicamente la cantidad de notificaciones no leídas.
 * Muy liviano (usa head: true, no transfiere datos de filas).
 */
export async function getUnreadNotificationCount(): Promise<number> {
  try {
    const user = await getUser();
    if (!user) return 0;

    const supabase = await createClient();

    const { count, error } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (error) {
      console.error("Error obteniendo conteo de notificaciones no leídas:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Error inesperado en getUnreadNotificationCount:", error);
    return 0;
  }
}

/**
 * Obtiene el listado de las últimas 20 notificaciones con columnas estrictas.
 * Se llama bajo demanda (lazy loading) solo cuando el usuario abre la campana.
 */
export async function getNotificationsList(): Promise<NotificationItem[]> {
  try {
    const user = await getUser();
    if (!user) return [];

    const supabase = await createClient();

    const { data: notifications, error } = await supabase
      .from("notifications")
      .select("id, user_id, title, message, type, link, is_read, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error obteniendo lista de notificaciones:", error);
      return [];
    }

    return (notifications as NotificationItem[]) || [];
  } catch (error) {
    console.error("Error inesperado en getNotificationsList:", error);
    return [];
  }
}

/**
 * Wrapper de compatibilidad hacia atrás
 */
export async function getNotifications() {
  const [notifications, unreadCount] = await Promise.all([
    getNotificationsList(),
    getUnreadNotificationCount(),
  ]);

  return { notifications, unreadCount };
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
      .eq("user_id", user.id);

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
