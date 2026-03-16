"use client";

import { useState } from "react";
import { X, Upload, Loader2, FileCheck } from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DocumentUploadModal({ isOpen, onClose, onSuccess }: UploadModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation of upload (delay)
    await new Promise(r => setTimeout(r, 2000));

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Новый документ.pdf" })
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
          setIsSuccess(false);
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg glass rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden p-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-glow transition-all">
            {isSuccess ? <FileCheck size={40} className="animate-bounce" /> : <Upload size={40} />}
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            {isSuccess ? "Загружено!" : "Загрузка документа"}
          </h2>
          <p className="text-neutral-400 text-sm mb-8">
            Перетащите файлы сюда или выберите на компьютере.<br/>Поддерживаются PDF, XML, XLSX.
          </p>

          {!isSuccess && (
            <div className="w-full border-2 border-dashed border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-all cursor-pointer group mb-8">
              <Upload className="text-neutral-600 group-hover:text-primary transition-colors" size={32} />
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Перетащите файл</span>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={isLoading || isSuccess}
            className="w-full bg-primary text-black py-4 rounded-2xl font-black text-lg shadow-[0_20px_40px_rgba(255,193,7,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : isSuccess ? "Успешно" : "Начать загрузку"}
          </button>
        </div>
      </div>
    </div>
  );
}
