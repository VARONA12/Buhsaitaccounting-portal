"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Loader2 } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-all duration-300 ${isOpen ? "bg-surface text-primary" : "text-text-muted hover:text-text hover:bg-surface"}`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full shadow-[0_0_8px_rgba(255,193,7,0.5)] animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-[-60px] sm:right-0 mt-4 w-[280px] sm:w-80 glass rounded-3xl border border-border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          <div className="p-4 border-b border-border bg-surface flex items-center justify-between">
            <h3 className="font-black text-[10px] uppercase tracking-widest text-text">Уведомления</h3>
            {unreadCount > 0 && (
              <button 
                onClick={() => markAsRead("all")}
                className="text-[10px] text-primary hover:underline font-black uppercase tracking-tighter"
              >
                Все прочитано
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto no-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-text-muted text-xs italic">
                Новых уведомлений нет
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`p-4 border-b border-border transition-colors cursor-pointer ${!n.read ? 'bg-primary/5' : 'opacity-50 hover:opacity-100 hover:bg-surface/50'}`}
                  onClick={() => !n.read && markAsRead(n.id)}
                >
                  <div className="flex gap-3">
                    <div className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                      n.type === 'success' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 
                      n.type === 'warning' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]' : 
                      'bg-primary shadow-[0_0_8px_rgba(255,193,7,0.4)]'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-text mb-0.5 leading-tight">{n.title}</div>
                      <p className="text-[10px] text-text-muted leading-relaxed line-clamp-2">{n.message}</p>
                      <div className="text-[9px] text-text-muted/60 mt-1.5 font-medium uppercase tracking-tighter">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
