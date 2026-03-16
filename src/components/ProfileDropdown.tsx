"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, User, Settings, Building2, Calendar, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { EditProfileModal } from "./EditProfileModal";

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  const user = session?.user || {
    name: "Загрузка...",
    phone: "",
    company: "",
    birthDate: "Не указана",
    plan: "Загрузка...",
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  if (status === "loading") {
    return <div className="h-9 w-9 rounded-full bg-surface-hover animate-pulse"></div>;
  }

  const initial = user.name ? user.name.charAt(0).toUpperCase() : "A";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
          isOpen 
            ? "shadow-[0_0_20px_rgba(255,193,7,0.4)] scale-105 bg-primary text-black" 
            : "bg-surface border border-border text-text hover:border-primary/50"
        }`}
      >
        {initial}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-80 glass rounded-2xl border border-border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          
          <div className="p-5 border-b border-border bg-surface">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center font-bold text-xl text-black shrink-0 shadow-[0_0_15px_rgba(255,193,7,0.3)]">
                {initial}
              </div>
              <div className="overflow-hidden">
                <h3 className="font-semibold text-text truncate text-lg">{user.name}</h3>
                <p className="text-sm text-text-muted truncate">{user.company}</p>
              </div>
            </div>
          </div>

          <div className="p-3 space-y-1">
            <div className="flex items-center gap-3 px-3 py-2 text-sm text-text">
              <Phone className="w-4 h-4 text-text-muted shrink-0" />
              <span className="truncate">
                {(() => {
                  if (!user.phone) return "";
                  const cleaned = user.phone.replace(/\D/g, "");
                  const match10 = cleaned.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
                  const match11 = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
                  if (match10) return `+7 (${match10[1]}) ${match10[2]}-${match10[3]}-${match10[4]}`;
                  if (match11) return `+7 (${match11[2]}) ${match11[3]}-${match11[4]}-${match11[5]}`;
                  return user.phone.startsWith("+") ? user.phone : `+7${cleaned}`;
                })()}
              </span>
            </div>
            
            <div className="flex items-center gap-3 px-3 py-2 text-sm text-text">
              <Building2 className="w-4 h-4 text-text-muted shrink-0" />
              <span className="truncate">{user.company}</span>
            </div>
            
            <div className="flex items-center gap-3 px-3 py-2 text-sm text-text">
              <Calendar className="w-4 h-4 text-text-muted shrink-0" />
              <span>{user.birthDate}</span>
            </div>
          </div>

          <div className="h-[1px] w-full bg-border my-1"></div>

          <div className="p-2">
            <button 
              onClick={() => { setIsEditModalOpen(true); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text-muted hover:text-text hover:bg-surface-hover rounded-lg transition-colors"
            >
              <User className="w-4 h-4" />
              Редактировать профиль
            </button>
            <button 
              onClick={() => { router.push("/settings"); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text-muted hover:text-text hover:bg-surface-hover rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              Настройки аккаунта
            </button>
            
            <div className="h-[1px] w-full bg-border my-2"></div>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Выйти из аккаунта
            </button>
          </div>
        </div>
      )}

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        user={user}
        onSuccess={() => {
          window.location.reload();
        }}
      />
    </div>
  );
}
