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
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xl z-[200] cursor-pointer"
          />
          
          <div className="fixed inset-0 z-[201] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden">
            <motion.div
              layout
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
              className="w-full h-[100dvh] sm:h-auto sm:max-w-2xl bg-white border-t sm:border border-black/10 sm:rounded-[40px] shadow-2xl pointer-events-auto flex flex-col relative sm:max-h-[90vh] rounded-t-[32px] sm:rounded-b-[40px] z-[210]"
            >
              {/* Mobile Drag/Indicator */}
              <div className="sm:hidden w-full flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-12 h-1.5 rounded-full bg-neutral-900/10" />
              </div>

              {/* Fixed Close Button Container */}
              <div className="relative flex items-center justify-between p-6 sm:p-0 sm:absolute sm:top-8 sm:right-8 z-30 shrink-0">
                <div className="sm:hidden flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-white border border-primary/20">
                    <service.icon size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">{service.title}</h3>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-black/10 flex items-center justify-center text-white hover:bg-neutral-900 hover:text-white transition-all bg-neutral-50 backdrop-blur-md"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 sm:p-12 pt-2 sm:pt-12 scrollbar-thin scrollbar-thumb-white/10">
                <div className="hidden sm:flex items-center gap-6 mb-10 shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-white border border-primary/20">
                    <service.icon size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tightest uppercase text-white leading-none mb-2">
                      {service.title}
                    </h2>
                    <div className="flex items-center gap-3">
                      <div className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">Полный спектр услуг</div>
                      {service.price && (
                        <>
                          <div className="w-1 h-1 rounded-full bg-neutral-700" />
                          <div className="text-[10px] font-bold text-white uppercase tracking-widest leading-none">{service.price} / мес</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-widest">Что включено</h3>
                    <ul className="space-y-3 sm:space-y-4">
                      {service.details.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 border-b border-white/[0.03] pb-3 last:border-0 sm:border-0 sm:pb-0">
                          <CheckCircle2 size={16} className="text-white mt-0.5 shrink-0" />
                          <span className="text-xs sm:text-sm font-medium text-white leading-tight">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-6 sm:space-y-8">
                     <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-white/5 space-y-3 sm:space-y-4">
                        <h3 className="text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-widest">Почему это важно</h3>
                        <p className="text-[10px] sm:text-xs font-bold text-white leading-relaxed uppercase tracking-widest">{service.benefit}</p>
                     </div>

                     <div className="space-y-4 pb-12 sm:pb-0">
                        <h3 className="text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-widest">Преимущества этапа</h3>
                        <div className="flex flex-wrap gap-2">
                           {service.features.map((f, i) => (
                             <span key={i} className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-neutral-900/5 border border-black/5 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-white">
                               {f}
                             </span>
                           ))}
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 bg-neutral-50 border-t border-black/5 shrink-0 safe-bottom">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                   <div className="hidden sm:flex items-center gap-4">
                      <Clock size={18} className="text-white" />
                      <div className="text-[10px] font-bold text-white uppercase tracking-widest leading-none">
                         Старт работ за <span className="text-white">24 часа</span>
                      </div>
                   </div>
                   <button 
                     onClick={onClose}
                     className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-xl sm:rounded-2xl font-bold uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-all text-[11px] shadow-xl active:scale-95"
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
