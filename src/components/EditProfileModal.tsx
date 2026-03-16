"use client";

import { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";

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
    const data = {
      name: formData.get("name"),
      company: formData.get("company"),
      birthDate: formData.get("birthDate"),
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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md glass rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Редактировать профиль</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-neutral-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">ФИО</label>
            <input 
              name="name" 
              defaultValue={user.name} 
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Название компании</label>
            <input 
              name="company" 
              defaultValue={user.company} 
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Дата рождения</label>
            <input 
              name="birthDate" 
              type="date"
              defaultValue={user.birthDate || ""} 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 text-white outline-none"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,193,7,0.2)] disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Сохранить изменения</>}
          </button>
        </form>
      </div>
    </div>
  );
}
