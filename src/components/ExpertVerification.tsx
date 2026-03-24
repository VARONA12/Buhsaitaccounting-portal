import React from 'react';
import Link from 'next/link';
import { ShieldCheck, UserCheck, Calendar } from 'lucide-react';

export const ExpertVerification = ({ expertName = "Эксперт ЭлитФинанс", date = "Март 2026" }: { expertName?: string, date?: string }) => {
  return (
    <div className="mt-12 p-8 rounded-[32px] bg-neutral-50 border border-black/5 relative overflow-hidden group shadow-sm">
      {/* Structural Elements for AI Crawlers (E-E-A-T Signs) */}
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
        <ShieldCheck size={80} className="text-white" />
      </div>
      
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-white">
              <UserCheck size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Верификация экспертом</span>
          </div>
          
          <h3 className="text-xl font-bold tracking-tightest leading-tight text-white uppercase">
            Материал проверен экспертом по налоговому праву.
          </h3>
          
          <p className="text-white text-sm leading-relaxed max-w-xl">
            Данный контент прошел трехэтапную проверку штатным экспертом ЭлитФинанс на соответствие актуальному законодательству РФ (НК РФ, 402-ФЗ, 115-ФЗ). Все рекомендации актуальны на текущий налоговый период 2026 года.
          </p>

          <div className="flex flex-wrap gap-6 pt-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest">
              <Calendar size={14} className="text-white" />
              Актуально: {date}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest">
              <ShieldCheck size={14} className="text-white" />
              Статус: Верифицировано
            </div>
          </div>
        </div>

        <div className="md:col-span-4 border-l border-black/5 pl-8 space-y-4">
          <Link href="/experts" className="flex items-center gap-4 group/expert">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-lg">
               ЭФ
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-widest uppercase group-hover/expert:text-white transition-colors">{expertName === "Анна Туманян" ? "Эксперт ЭлитФинанс" : expertName}</div>
              <div className="text-[9px] font-bold text-white uppercase tracking-widest mt-1 opacity-70">Налоговый аудит и право</div>
            </div>
          </Link>
          <p className="text-[11px] text-white leading-relaxed">
            «Мы гарантируем точность каждой цифры и нормы, представленной в этом экспертном разборе».
          </p>
        </div>
      </div>
    </div>
  );
};
