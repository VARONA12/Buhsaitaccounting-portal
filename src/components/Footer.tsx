"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="py-20 px-6 border-t border-white/12 bg-neutral-900 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex items-center gap-4">
          <Logo size={40} />
          <span className="font-bold text-xl tracking-tighter uppercase text-white">ЭлитФинанс</span>
        </div>
        <nav className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {[
            { label: "КЕЙСЫ", href: "/cases" },
            { label: "ПОЗВОНИТЬ", href: "tel:+79028371370" },
            { label: "СООБЩЕСТВО В ВК", href: "https://vk.com/elitfinans" },
            { label: "НАПИСАТЬ НА ПОЧТУ", href: "mailto:info@elitfinans.online" }
          ].map(nav => (
            <Link 
              key={nav.label} 
              href={nav.href} 
              className="px-6 py-3 rounded-full border border-white/12 bg-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-white hover:bg-white hover:text-neutral-900 transition-all shadow-lg whitespace-nowrap"
            >
              {nav.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
