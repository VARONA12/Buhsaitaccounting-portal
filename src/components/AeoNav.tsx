"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Zap, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";

export function AeoNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: "Услуги", href: "/services" },
    { label: "Статьи", href: "/articles" },
    { label: "Кейсы", href: "/cases" },
    { label: "Вопросы", href: "/faq" },
    { label: "Новости", href: "/news" },
    { label: "Эксперты", href: "/experts" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] border-b border-white/12 bg-neutral-900/80 backdrop-blur-3xl shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 xl:h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="flex items-center justify-center transition-all group-hover:scale-110">
            <Logo size={42} />
          </div>
          <span className="font-bold text-lg xl:text-xl tracking-tighter uppercase text-white leading-none">ЭлитФинанс</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-10">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[10px] font-bold uppercase tracking-[0.4em] text-white hover:text-white transition-all flex items-center gap-2 group"
            >
              <div className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => { (window as any).toggleContactForm?.() }}
            className="px-8 py-3 rounded-xl bg-white text-neutral-900 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-neutral-200 transition-all shadow-xl"
          >
            Консультация
          </button>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-white/12 bg-neutral-900/95 backdrop-blur-3xl overflow-hidden"
          >
            <div className="px-6 py-6 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[13px] font-bold uppercase tracking-[0.2em] text-white hover:bg-white/5 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {item.label}
                </Link>
              ))}

              <div className="pt-4 mt-2 border-t border-white/10">
                <button
                  onClick={() => { setIsMenuOpen(false); (window as any).toggleContactForm?.(); }}
                  className="w-full py-4 rounded-2xl bg-white text-neutral-900 font-black uppercase tracking-[0.3em] text-[11px] shadow-xl hover:bg-neutral-200 transition-all"
                >
                  ОСТАВИТЬ ЗАЯВКУ
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
