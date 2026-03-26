'use client';

import { ArrowRight } from 'lucide-react';

interface ContactButtonProps {
  label?: string;
  className?: string;
}

export function ContactButton({ label = 'ЗАДАТЬ ВОПРОС', className }: ContactButtonProps) {
  return (
    <button
      onClick={() => { window.dispatchEvent(new CustomEvent('openContactForm')); }}
      className={className ?? 'shrink-0 px-10 py-5 bg-primary text-white font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl hover:bg-white transition-all shadow-2xl flex items-center gap-3'}
    >
      {label} <ArrowRight size={16} />
    </button>
  );
}

export function ContactButtonFull({ label = 'ЗАЯВКА ЭКСПЕРТУ' }: { label?: string }) {
  return (
    <button
      onClick={() => { window.dispatchEvent(new CustomEvent('openContactForm')); }}
      className="w-full py-5 bg-primary text-white font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl hover:bg-white transition-all shadow-xl flex items-center justify-center gap-2"
    >
      {label} <ArrowRight size={14} />
    </button>
  );
}
