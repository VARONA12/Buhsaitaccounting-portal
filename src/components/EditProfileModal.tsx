"use client";

import { useState } from "react";
import { X, Save, Loader2, User } from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSuccess: () => void;
}

export function EditProfileModal({ isOpen, onClose, user, onSuccess }: EditProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const birthYear = formData.get("birthYear");
    const birthMonth = formData.get("birthMonth");
    const birthDay = formData.get("birthDay");
    
    let birthDateStr = "";
    if (birthYear && birthMonth && birthDay) {
      birthDateStr = `${birthYear}-${birthMonth}-${birthDay}`;
    }

    const data = {
      name: formData.get("name"),
      company: formData.get("company"),
      birthDate: birthDateStr || formData.get("birthDate"),
    };

    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Ошибка при обновлении профиля");
      
      onSuccess();
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md glass rounded-[32px] border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-border flex items-center justify-between bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <User size={20} />
            </div>
            <h2 className="text-xl font-black text-text tracking-tight">Профиль</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface rounded-full text-text-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest pl-2">ФИО Пользователя</label>
            <input 
              name="name" 
              defaultValue={user.name} 
              required
              placeholder="Иванов Иван Иванович"
              className="w-full bg-surface border border-border rounded-2xl px-5 py-4 text-sm focus:border-primary text-text outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest pl-2">Компания</label>
            <input 
              name="company" 
              defaultValue={user.company} 
              required
              placeholder="ООО ЭлитФинанс"
              className="w-full bg-surface border border-border rounded-2xl px-5 py-4 text-sm focus:border-primary text-text outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest pl-2">Дата рождения</label>
            <div className="flex gap-2">
              <select
                name="birthDay"
                defaultValue={user.birthDate ? user.birthDate.split('-')[2] : ""}
                className="w-1/4 bg-surface border border-border rounded-2xl px-2 py-4 text-xs font-bold focus:border-primary text-text outline-none appearance-none cursor-pointer text-center"
              >
                <option value="" disabled>Дн</option>
                {Array.from({ length: 31 }, (_, i) => {
                  const d = String(i + 1).padStart(2, '0');
                  return <option key={d} value={d}>{d}</option>;
                })}
              </select>

              <select
                name="birthMonth"
                defaultValue={user.birthDate ? user.birthDate.split('-')[1] : ""}
                className="flex-1 bg-surface border border-border rounded-2xl px-4 py-4 text-xs font-bold focus:border-primary text-text outline-none appearance-none cursor-pointer"
              >
                <option value="" disabled>Месяц</option>
                {[
                  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
                  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
                ].map((m, idx) => (
                  <option key={idx} value={String(idx + 1).padStart(2, '0')}>{m}</option>
                ))}
              </select>

              <select
                name="birthYear"
                defaultValue={user.birthDate ? user.birthDate.split('-')[0] : ""}
                className="w-1/3 bg-surface border border-border rounded-2xl px-2 py-4 text-xs font-bold focus:border-primary text-text outline-none appearance-none cursor-pointer text-center"
              >
                <option value="" disabled>Год</option>
                {Array.from({ length: 80 }, (_, i) => {
                  const y = String(new Date().getFullYear() - 18 - i);
                  return <option key={y} value={y}>{y}</option>;
                })}
              </select>
            </div>
          </div>

          {error && <p className="text-red-500 text-xs font-bold px-2">{error}</p>}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-black py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-[0_10px_30px_rgba(255,193,7,0.2)] disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Сохранить</>}
          </button>
        </form>
      </div>
    </div>
  );
}
