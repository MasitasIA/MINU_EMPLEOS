"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, Briefcase, UserCheck, Eye, FileText, CheckCircle2, XCircle } from "lucide-react";
import { 
  getUnreadNotificationCount, 
  getNotificationsList, 
  markAsRead, 
  markAllAsRead, 
  NotificationItem 
} from "@/app/actions/notifications";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface NotificationBellProps {
  userId?: string;
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [hasLoadedList, setHasLoadedList] = useState(false);
  const [isRinging, setIsRinging] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 1. Obtener conteo de no leídas inicial (muy ligero, 0 transferencia de filas)
  const refreshUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadNotificationCount();
      setUnreadCount(count);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("minu_unread_notifs", count.toString());
      }
    } catch (err) {
      console.error("Error al refrescar conteo de notificaciones:", err);
    }
  }, []);

  // 2. Cargar listado completo solo cuando se abre la campana (Lazy Load)
  const loadNotificationsList = useCallback(async () => {
    setIsLoadingList(true);
    try {
      const data = await getNotificationsList();
      setNotifications(data);
      setHasLoadedList(true);
    } catch (err) {
      console.error("Error al cargar lista de notificaciones:", err);
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  // Inicializar contador desde caché de sesión si existe (Zero-CLS)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem("minu_unread_notifs");
      if (cached !== null) {
        setUnreadCount(parseInt(cached, 10) || 0);
      }
    }
    refreshUnreadCount();
  }, [refreshUnreadCount]);

  // 3. Suscripción en Tiempo Real con Supabase (WebSockets)
  useEffect(() => {
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const setupRealtime = async () => {
      let activeUserId = userId;
      if (!activeUserId) {
        const { data: { session } } = await supabase.auth.getSession();
        activeUserId = session?.user?.id;
      }

      if (!activeUserId) return;

      channel = supabase
        .channel(`user_notifications:${activeUserId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${activeUserId}`,
          },
          (payload) => {
            const newNotif = payload.new as NotificationItem;
            setUnreadCount((prev) => {
              const updated = prev + 1;
              if (typeof window !== "undefined") {
                sessionStorage.setItem("minu_unread_notifs", updated.toString());
              }
              return updated;
            });

            // Animación de timbre cuando llega una notificación en vivo
            setIsRinging(true);
            setTimeout(() => setIsRinging(false), 1500);

            // Si el listado ya fue cargado o la campana está abierta, anteponer inmediatamente
            setNotifications((prev) => [newNotif, ...prev]);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${activeUserId}`,
          },
          (payload) => {
            const updatedNotif = payload.new as NotificationItem;
            setNotifications((prev) =>
              prev.map((n) => (n.id === updatedNotif.id ? updatedNotif : n))
            );
          }
        )
        .subscribe();
    };

    setupRealtime();

    // Revalidación inteligente al volver a la pestaña (reemplaza polling cada 60s)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshUnreadCount();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [userId, refreshUnreadCount]);

  // Cerrar al hacer click afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggleOpen = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    // Lazy load: solo pedir la lista si se abre y aún no ha sido cargada
    if (nextState && !hasLoadedList) {
      loadNotificationsList();
    }
  };

  const handleMarkAllAsRead = async () => {
    // Actualización optimista inmediata
    setUnreadCount(0);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("minu_unread_notifs", "0");
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await markAllAsRead();
  };

  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!notification.is_read) {
      // Optimista
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
      );
      await markAsRead(notification.id);
    }
    setIsOpen(false);
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const getIcon = (type: string, message: string) => {
    if (type === "new_application") return <UserCheck className="h-5 w-5 text-blue-500" />;
    if (type === "status_change") {
      if (message.includes("revisada")) return <Eye className="h-5 w-5 text-amber-500" />;
      if (message.includes("seleccionado")) return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      if (message.includes("no continuará") || message.includes("rechazada")) return <XCircle className="h-5 w-5 text-red-500" />;
      return <FileText className="h-5 w-5 text-foreground-muted" />;
    }
    return <Briefcase className="h-5 w-5 text-foreground-muted" />;
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();

    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Ahora mismo";
    if (diffMins < 60) return `Hace ${diffMins} min`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours} h`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;

    return past.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggleOpen}
        className={`relative p-2 text-foreground-muted transition-all duration-300 hover:bg-surface-muted hover:text-primary radius-button flex items-center justify-center ${
          isRinging ? "animate-bounce text-primary" : ""
        }`}
        aria-label="Notificaciones"
      >
        <Bell className={`h-5 w-5 ${isRinging ? "rotate-12 transition-transform" : ""}`} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-1 ring-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 radius-predefined bg-white shadow-xl ring-1 ring-border origin-top-right z-50 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-surface-muted">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-foreground text-sm">Notificaciones</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary">
                  {unreadCount} nuevas
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs font-semibold text-primary hover:underline transition-colors"
              >
                Marcar todas leídas
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1">
            {isLoadingList ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 animate-pulse items-center">
                    <div className="w-9 h-9 rounded-full bg-surface-muted flex-shrink-0" />
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="h-3.5 bg-surface-muted rounded w-2/3" />
                      <div className="h-2.5 bg-surface-muted rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-foreground-muted">
                <Bell className="h-10 w-10 opacity-20 mb-3" />
                <p className="text-sm font-medium">No tienes notificaciones pendientes</p>
                <p className="text-xs text-foreground-subtle mt-1">Te avisaremos cuando haya novedades sobre tus empleos o postulaciones</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {notifications.map((notification) => (
                  <li key={notification.id}>
                    <button
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-surface-muted ${
                        !notification.is_read ? "bg-primary/[0.04]" : ""
                      }`}
                    >
                      <div className="mt-0.5 flex-shrink-0 bg-white p-2 rounded-full ring-1 ring-border shadow-sm">
                        {getIcon(notification.type, notification.message)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <p
                            className={`text-sm truncate pr-2 ${
                              !notification.is_read
                                ? "font-bold text-foreground"
                                : "font-semibold text-foreground-muted"
                            }`}
                          >
                            {notification.title}
                          </p>
                          <span className="text-[10px] text-foreground-subtle whitespace-nowrap font-medium">
                            {getTimeAgo(notification.created_at)}
                          </span>
                        </div>
                        <p
                          className={`text-xs line-clamp-2 ${
                            !notification.is_read
                              ? "text-foreground font-medium"
                              : "text-foreground-muted"
                          }`}
                        >
                          {notification.message}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
