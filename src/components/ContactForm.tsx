"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, User, Send, CheckCircle2, FileText } from "lucide-react";
import { useState } from "react";

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactForm({ isOpen, onClose }: ContactFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "+7 ",
    message: ""
  });

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    let result = "+7 ";
    if (digits.length > 1) {
      const selection = digits.slice(1, 11);
      if (selection.length > 0) result += "(" + selection.slice(0, 3);
      if (selection.length > 3) result += ") " + selection.slice(3, 6);
      if (selection.length > 6) result += "-" + selection.slice(6, 8);
      if (selection.length > 8) result += "-" + selection.slice(8, 10);
    }
    return result;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone.length < 18) {
      alert("Пожалуйста, введите корректный номер телефона");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert("Произошла ошибка при отправке. Пожалуйста, попробуйте позже.");
      }
    } catch (e) {
      console.error(e);
      alert("Сетевая ошибка. Проверьте соединение.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] cursor-pointer"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[201] p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl pointer-events-auto overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 pt-8 pb-2">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest mb-3">
                    Консультация эксперта
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    Оставьте заявку
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-8 pt-6">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Ваше имя</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                        <input
                          required
                          type="text"
                          placeholder="Иван Иванов"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder:text-white/25 focus:outline-none focus:border-primary/50 transition-colors text-sm"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Телефон</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                        <input
                          required
                          type="tel"
                          placeholder="+7 (___) ___-__-__"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          maxLength={18}
                          className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder:text-white/25 focus:outline-none focus:border-primary/50 transition-colors text-sm"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Ваш запрос</label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-4 text-white/30" size={16} />
                        <textarea
                          required
                          placeholder="Опишите ситуацию..."
                          rows={3}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 pt-3.5 text-white placeholder:text-white/25 focus:outline-none focus:border-primary/50 transition-colors text-sm resize-none"
                        />
                      </div>
                    </div>

                    <button
                      disabled={loading}
                      className="w-full py-4 bg-primary text-neutral-900 rounded-xl font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 text-xs mt-2"
                    >
                      {loading ? "Отправка..." : "Отправить заявку"}
                      <Send size={16} className={loading ? "animate-pulse" : ""} />
                    </button>

                    <p className="text-[9px] text-center text-white/30 tracking-wide leading-relaxed">
                      Нажимая на кнопку, вы соглашаетесь с политикой конфиденциальности.
                    </p>
                  </form>
                ) : (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-8 text-center space-y-6"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
                      <CheckCircle2 size={32} />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-white">Спасибо!</h2>
                      <p className="text-sm text-white/60">
                        Менеджер свяжется с вами в ближайшее время.
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="px-10 py-4 bg-primary text-neutral-900 rounded-xl font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors text-xs"
                    >
                      Закрыть
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
