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
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-md z-[200] cursor-pointer"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[201] p-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-lg bg-white border border-black/10 rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.1)] pointer-events-auto overflow-hidden relative"
            >
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-white hover:bg-neutral-900 hover:text-white transition-all group"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform" />
              </button>

              <div className="p-10 xl:p-12">
                {!isSubmitted ? (
                  <>
                    <div className="space-y-4 mb-10 text-center">
                      <div className="inline-flex px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-white text-[9px] font-bold uppercase tracking-widest">
                        Консультация эксперта
                      </div>
                      <h2 className="text-4xl font-bold tracking-tightest uppercase text-white">
                        Оставьте завяку
                      </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white uppercase tracking-widest ml-4">Ваше имя</label>
                        <div className="relative group">
                          <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white group-focus-within:text-white transition-colors" size={18} />
                           <input 
                            required
                            type="text" 
                            placeholder="Иван Иванов"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full h-14 bg-neutral-50 border border-black/5 rounded-2xl pl-14 pr-6 font-bold text-white placeholder:text-white focus:outline-none focus:border-primary transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white uppercase tracking-widest ml-4">Номер телефона</label>
                        <div className="relative group">
                          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-white group-focus-within:text-white transition-colors" size={18} />
                           <input 
                            required
                            type="tel" 
                            placeholder="+7 (___) ___-__-__"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            maxLength={18}
                            className="w-full h-14 bg-neutral-50 border border-black/5 rounded-2xl pl-14 pr-6 font-bold text-white placeholder:text-white focus:outline-none focus:border-primary transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white uppercase tracking-widest ml-4">Ваш запрос</label>
                        <div className="relative group">
                          <FileText className="absolute left-5 top-5 text-white group-focus-within:text-white transition-colors" size={18} />
                           <textarea 
                            required
                            placeholder="Опишите ситуацию..."
                            rows={3}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full bg-neutral-50 border border-black/5 rounded-2xl pl-14 pr-6 pt-4 font-bold text-white placeholder:text-white focus:outline-none focus:border-primary transition-all text-sm resize-none"
                          />
                        </div>
                      </div>

                      <button 
                        disabled={loading}
                        className="w-full py-5 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-95 text-[11px] mt-6"
                      >
                        {loading ? "Отправка..." : "Отправить заявку"}
                        <Send size={18} className={loading ? "animate-pulse" : ""} />
                      </button>

                      <p className="text-[9px] text-center text-white font-bold uppercase tracking-widest leading-relaxed mt-4">
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
                    <div className="w-20 h-20 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center text-white mx-auto shadow-2xl">
                      <CheckCircle2 size={40} />
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-4xl font-bold tracking-tightest uppercase text-white leading-none">Спасибо!</h2>
                      <p className="text-sm font-bold text-white uppercase tracking-widest leading-relaxed">
                        Менеджер свяжется с вами <br/> в ближайшее время.
                      </p>
                    </div>
                    <button 
                      onClick={onClose}
                      className="px-12 py-5 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-white transition-all text-[11px]"
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
