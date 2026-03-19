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
          
          <div className="fixed inset-0 flex items-end sm:items-center justify-center z-[201] p-0 sm:p-6 overflow-hidden pointer-events-none">
            <motion.div
              layout
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-2xl bg-[#0B0B0B] border-t sm:border border-white/10 sm:rounded-[40px] shadow-2xl pointer-events-auto flex flex-col relative max-h-[95vh] sm:max-h-[90vh] rounded-t-[32px] sm:rounded-b-[40px]"
            >
              <button 
                onClick={onClose}
                className="absolute top-5 right-5 sm:top-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:bg-white hover:text-black transition-all z-20 bg-neutral-900/80 backdrop-blur-md shadow-lg"
              >
                <X size={18} />
              </button>

              <div className="flex-1 overflow-y-auto p-6 sm:p-12 scrollbar-thin scrollbar-thumb-white/10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8 sm:mb-10 pt-4 sm:pt-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                    <service.icon size={26} className="sm:w-8 sm:h-8" />
                  </div>
                  <div className="w-full">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tightest uppercase text-white leading-tight mb-2 pr-10 sm:pr-0">
                      {service.title}
                    </h2>
                    <div className="flex items-center gap-3">
                      <div className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-[0.2em] sm:tracking-[0.3em]">Полный спектр услуг</div>
                      {service.price && (
                        <>
                          <div className="w-1 h-1 rounded-full bg-neutral-700" />
                          <div className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">{service.price} / мес</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-[9px] sm:text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Что включено</h3>
                    <ul className="space-y-3 sm:space-y-4">
                      {service.details.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 border-b border-white/[0.03] pb-3 last:border-0 sm:border-0 sm:pb-0">
                          <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                          <span className="text-xs sm:text-sm font-medium text-neutral-300 leading-tight">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-6 sm:space-y-8">
                     <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-neutral-900 border border-white/5 space-y-3 sm:space-y-4">
                        <h3 className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-widest">Почему это важно</h3>
                        <p className="text-[10px] sm:text-xs font-bold text-neutral-400 leading-relaxed uppercase tracking-widest">{service.benefit}</p>
                     </div>

                     <div className="space-y-4 pb-6 sm:pb-0">
                        <h3 className="text-[9px] sm:text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Преимущества этапа</h3>
                        <div className="flex flex-wrap gap-2">
                           {service.features.map((f, i) => (
                             <span key={i} className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white/5 border border-white/10 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-white">
                               {f}
                             </span>
                           ))}
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 border-t border-white/5 bg-[#0F0F0F] shrink-0">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                   <div className="hidden sm:flex items-center gap-4">
                      <Clock size={18} className="text-primary" />
                      <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-none">
                         Старт работ за <span className="text-white">24 часа</span>
                      </div>
                   </div>
                   <button 
                     onClick={onClose}
                     className="w-full sm:w-auto px-10 py-4 bg-primary text-black rounded-xl sm:rounded-2xl font-bold uppercase tracking-widest hover:bg-white transition-all text-[10px] sm:text-[11px] shadow-xl"
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
