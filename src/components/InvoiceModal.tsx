"use client";

import { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function InvoiceModal({ isOpen, onClose, onSuccess }: InvoiceModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      number: formData.get("number"),
      client: formData.get("client"),
      amount: formData.get("amount"),
      dueDate: formData.get("dueDate"),
    };

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Ошибка при создании счета");
      
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
      
      <div className="relative w-full max-w-lg glass rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Новый счет</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-neutral-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Номер счета</label>
              <input 
                name="number" 
                required 
                placeholder="INV-001"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Дата оплаты</label>
              <input 
                name="dueDate" 
                type="date" 
                required 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Наименование клиента</label>
            <input 
              name="client" 
              required 
              placeholder="ООО Ромашка"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Сумма (₽)</label>
            <input 
              name="amount" 
              required 
              placeholder="100,000 ₽"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 text-white outline-none"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,193,7,0.2)] disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <><Plus size={20} /> Создать счет</>}
          </button>
        </form>
      </div>
    </div>
  );
}
