"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, User, Send, CheckCircle2, Clock, FileText } from "lucide-react";
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
    // Only numbers
    const digits = value.replace(/\D/g, "");
    
    // Always start with 7
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone.length < 18) {
      alert("Пожалуйста, введите корректный номер телефона");
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1500);
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
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] cursor-pointer"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[201] p-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-lg bg-[#0F0F0F] border border-white/10 rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] pointer-events-auto overflow-hidden relative"
            >
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:bg-white hover:text-black transition-all group"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform" />
              </button>

              <div className="p-10 xl:p-12">
                {!isSubmitted ? (
                  <>
                    <div className="space-y-4 mb-10 text-center">
                      <div className="inline-flex px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[9px] font-bold uppercase tracking-widest">
                        Консультация эксперта
                      </div>
                      <h2 className="text-4xl font-bold tracking-tightest uppercase text-white">
                        Оставьте завяку
                      </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-4">Ваше имя</label>
                        <div className="relative group">
                          <User className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-primary transition-colors" size={18} />
                           <input 
                            required
                            type="text" 
                            placeholder="Иван Иванов"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full h-14 bg-neutral-900 border border-white/5 rounded-2xl pl-14 pr-6 font-bold text-white placeholder:text-neutral-600 focus:outline-none focus:border-primary transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-4">Номер телефона</label>
                        <div className="relative group">
                          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-primary transition-colors" size={18} />
                           <input 
                            required
                            type="tel" 
                            placeholder="+7 (___) ___-__-__"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            maxLength={18}
                            className="w-full h-14 bg-neutral-900 border border-white/5 rounded-2xl pl-14 pr-6 font-bold text-white placeholder:text-neutral-600 focus:outline-none focus:border-primary transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-4">Ваш запрос</label>
                        <div className="relative group">
                          <FileText className="absolute left-5 top-5 text-neutral-600 group-focus-within:text-primary transition-colors" size={18} />
                           <textarea 
                            required
                            placeholder="Опишите ситуацию..."
                            rows={3}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full bg-neutral-900 border border-white/5 rounded-2xl pl-14 pr-6 pt-4 font-bold text-white placeholder:text-neutral-600 focus:outline-none focus:border-primary transition-all text-sm resize-none"
                          />
                        </div>
                      </div>

                      <button 
                        disabled={loading}
                        className="w-full py-5 bg-primary text-black rounded-2xl font-bold uppercase tracking-widest hover:bg-white transition-all shadow-[0_20px_40px_rgba(255,193,7,0.2)] flex items-center justify-center gap-3 disabled:opacity-50 text-[11px] mt-6"
                      >
                        {loading ? "Отправка..." : "Отправить заявку"}
                        <Send size={18} className={loading ? "animate-pulse" : ""} />
                      </button>

                      <p className="text-[9px] text-center text-neutral-600 font-bold uppercase tracking-widest leading-relaxed mt-4">
                        Нажимая на кнопку, вы соглашаетесь с политикой конфиденциальности.
                      </p>
                    </form>
                  </>
                ) : (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-12 text-center space-y-8"
                  >
                    <div className="w-20 h-20 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center text-primary mx-auto shadow-2xl">
                      <CheckCircle2 size={40} />
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-4xl font-bold tracking-tightest uppercase text-white leading-none">Спасибо!</h2>
                      <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest leading-relaxed">
                        Менеджер свяжется с вами <br/> в ближайшее время.
                      </p>
                    </div>
                    <button 
                      onClick={onClose}
                      className="px-12 py-5 bg-primary text-black rounded-2xl font-bold uppercase tracking-widest hover:bg-white transition-all text-[11px]"
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
