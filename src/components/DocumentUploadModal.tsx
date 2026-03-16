"use client";

import { useState } from "react";
import { Upload, Loader2, FileCheck } from "lucide-react";

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
    await new Promise(r => setTimeout(r, 1500));

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
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg glass rounded-[40px] border border-border shadow-2xl overflow-hidden p-6 md:p-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-[0_0_20px_rgba(255,193,7,0.1)] transition-all">
            {isSuccess ? <FileCheck size={32} className="animate-bounce" /> : <Upload size={32} />}
          </div>
          
          <h2 className="text-xl md:text-2xl font-black text-text mb-2 tracking-tight">
            {isSuccess ? "Готово!" : "Загрузка"}
          </h2>
          <p className="text-text-muted text-[10px] md:text-sm mb-8 leading-relaxed">
            Поддерживаются PDF, XML, XLSX.<br className="hidden md:block" /> Выберите файлы на устройстве.
          </p>

          {!isSuccess && (
            <div 
              onClick={handleUpload}
              className="w-full border-2 border-dashed border-border rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-all cursor-pointer group mb-8 bg-surface/30"
            >
              <Upload className="text-text-muted group-hover:text-primary transition-colors" size={28} />
              <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Выбрать файл</span>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={isLoading || isSuccess}
            className="w-full bg-primary text-black py-4 md:py-5 rounded-2xl font-black text-base md:text-lg shadow-[0_15px_30px_rgba(255,193,7,0.2)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : isSuccess ? "Успешно" : "Загрузить"}
          </button>
        </div>
      </div>
    </div>
  );
}
