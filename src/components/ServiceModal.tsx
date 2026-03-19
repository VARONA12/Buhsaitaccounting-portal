"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Shield, Calculator, Users, Clock, Zap } from "lucide-react";

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    title: string;
    price?: string;
    icon: any;
    details: string[];
    features: string[];
    benefit: string;
  } | null;
}

export function ServiceModal({ isOpen, onClose, service }: ServiceModalProps) {
  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200] cursor-pointer"
          />
          
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[201] p-4 md:p-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="w-full max-w-2xl bg-[#0F0F0F] border border-white/10 rounded-[40px] shadow-2xl pointer-events-auto overflow-hidden relative"
            >
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:bg-white hover:text-black transition-all z-10"
              >
                <X size={20} />
              </button>

              <div className="p-8 md:p-12">
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <service.icon size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tightest uppercase text-white leading-none mb-2">
                      {service.title}
                    </h2>
                    <div className="flex items-center gap-3">
                      <div className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Полный спектр услуг</div>
                      {service.price && (
                        <>
                          <div className="w-1 h-1 rounded-full bg-neutral-700" />
                          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">{service.price} / мес</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Что включено</h3>
                    <ul className="space-y-4">
                      {service.details.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                          <span className="text-sm font-medium text-neutral-300 leading-tight">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-8">
                     <div className="p-6 rounded-3xl bg-neutral-900 border border-white/5 space-y-4">
                        <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest">Почему это важно</h3>
                        <p className="text-xs font-bold text-neutral-400 leading-relaxed uppercase tracking-widest">{service.benefit}</p>
                     </div>

                     <div className="space-y-4">
                        <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Преимущества этапа</h3>
                        <div className="flex flex-wrap gap-2">
                           {service.features.map((f, i) => (
                             <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-white">
                               {f}
                             </span>
                           ))}
                        </div>
                     </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                   <div className="flex items-center gap-4">
                      <Clock size={18} className="text-primary" />
                      <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-none">
                         Старт работ за <span className="text-white">24 часа</span>
                      </div>
                   </div>
                   <button 
                     onClick={onClose}
                     className="w-full sm:w-auto px-10 py-4 bg-primary text-black rounded-2xl font-bold uppercase tracking-widest hover:bg-white transition-all text-[11px] shadow-xl"
                   >
                     Понятно, спасибо
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
