"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, User, Settings, Building2, Calendar, Phone, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { EditProfileModal } from "./EditProfileModal";

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Реальные данные пользователя из сессии
  const user = session?.user || {
    name: "Загрузка...",
    phone: "",
    company: "",
    birthDate: "Не указана",
    plan: "Загрузка...",
  };

  // Закрытие при клике вне дропдауна
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
    return <div className="h-9 w-9 rounded-full bg-white/10 animate-pulse"></div>;
  }

  // Берем первую букву имени для аватарки
  const initial = user.name ? user.name.charAt(0).toUpperCase() : "A";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Кнопка профиля (Аватар) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-9 w-9 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm transition-all duration-300 ${
          isOpen ? "shadow-[0_0_20px_rgba(255,255,255,0.6)] scale-105" : "hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
        }`}
      >
        {initial}
      </button>

      {/* Выпадающее меню */}
      {isOpen && (
        <div className="absolute right-0 mt-4 w-80 glass rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          
          {/* Шапка профиля */}
          <div className="p-5 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center font-bold text-xl text-black shrink-0 shadow-[0_0_15px_rgba(255,193,7,0.3)]">
                {initial}
              </div>
              <div className="overflow-hidden">
                <h3 className="font-semibold text-white truncate text-lg">{user.name}</h3>
                <p className="text-sm text-neutral-400 truncate">{user.company}</p>
              </div>
            </div>
          </div>

          {/* Информация об аккаунте */}
          <div className="p-3 space-y-1">
            <div className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-300">
              <Phone className="w-4 h-4 text-neutral-500 shrink-0" />
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
            
            <div className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-300">
              <Building2 className="w-4 h-4 text-neutral-500 shrink-0" />
              <span className="truncate">{user.company}</span>
            </div>
            
            <div className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-300">
              <Calendar className="w-4 h-4 text-neutral-500 shrink-0" />
              <span>{user.birthDate}</span>
            </div>
          </div>

          <div className="h-[1px] w-full bg-white/5 my-1"></div>

          {/* Действия */}
          <div className="p-2">
            <button 
              onClick={() => { setIsEditModalOpen(true); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <User className="w-4 h-4" />
              Редактировать профиль
            </button>
            <button 
              onClick={() => { router.push("/settings"); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              Настройки аккаунта
            </button>
            
            <div className="h-[1px] w-full bg-white/5 my-2"></div>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
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
          // Force session refresh
          window.location.reload();
        }}
      />
    </div>
  );
}
