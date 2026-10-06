"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Briefcase, UserCheck, Eye, FileText, CheckCircle2, XCircle } from "lucide-react";
import { getNotifications, markAsRead, markAllAsRead } from "@/app/actions/notifications";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fetchNotifications = async () => {
    const { notifications: data, unreadCount: count } = await getNotifications();
    setNotifications(data || []);
    setUnreadCount(count || 0);
  };

  useEffect(() => {
    fetchNotifications();
    
    // Polling ligero cada 1 minuto
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

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

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setUnreadCount(0);
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(notifications.map(n => n.id === notification.id ? { ...n, is_read: true } : n));
    }
    setIsOpen(false);
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const getIcon = (type: string, message: string) => {
    if (type === 'new_application') return <UserCheck className="h-5 w-5 text-blue-500" />;
    if (type === 'status_change') {
      if (message.includes('revisada')) return <Eye className="h-5 w-5 text-amber-500" />;
      if (message.includes('seleccionado')) return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      if (message.includes('no continuará') || message.includes('rechazada')) return <XCircle className="h-5 w-5 text-red-500" />;
      return <FileText className="h-5 w-5 text-foreground-muted" />;
    }
    return <Briefcase className="h-5 w-5 text-foreground-muted" />;
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours} h`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return past.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-foreground-muted transition-colors hover:bg-surface-muted hover:text-primary radius-button flex items-center justify-center"
        aria-label="Notificaciones"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-1 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 radius-predefined bg-white shadow-lg ring-1 ring-border origin-top-right z-50 overflow-hidden flex flex-col max-h-[85vh]">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-surface-muted">
            <h3 className="font-bold text-foreground">Notificaciones</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Marcar todas leídas
              </button>
            )}
          </div>
          
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-foreground-muted">
                <Bell className="h-10 w-10 opacity-20 mb-3" />
                <p className="text-sm font-medium">No tienes notificaciones pendientes</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {notifications.map((notification) => (
                  <li key={notification.id}>
                    <button
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-surface-muted ${!notification.is_read ? 'bg-primary/5' : ''}`}
                    >
                      <div className="mt-0.5 flex-shrink-0 bg-white p-1.5 rounded-full ring-1 ring-border shadow-sm">
                        {getIcon(notification.type, notification.message)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <p className={`text-sm truncate pr-2 ${!notification.is_read ? 'font-bold text-foreground' : 'font-semibold text-foreground-muted'}`}>
                            {notification.title}
                          </p>
                          <span className="text-[10px] text-foreground-subtle whitespace-nowrap font-medium">
                            {getTimeAgo(notification.created_at)}
                          </span>
                        </div>
                        <p className={`text-xs line-clamp-2 ${!notification.is_read ? 'text-foreground font-medium' : 'text-foreground-muted'}`}>
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
