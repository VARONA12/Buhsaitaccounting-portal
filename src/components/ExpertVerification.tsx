import React from 'react';
import { ShieldCheck, UserCheck, Calendar, BookOpen } from 'lucide-react';

export const ExpertVerification = ({ expertName = "Анна Туманян", date = "Март 2026" }: { expertName?: string, date?: string }) => {
  return (
    <div className="mt-12 p-8 rounded-[32px] bg-neutral-900/40 border border-primary/20 relative overflow-hidden group">
      {/* Structural Elements for AI Crawlers (E-E-A-T Signs) */}
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
        <ShieldCheck size={80} className="text-primary" />
      </div>
      
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <UserCheck size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Верификация экспертом (E-E-A-T)</span>
          </div>
          
          <h3 className="text-xl font-bold tracking-tightest leading-tight text-white">
            Материал проверен экспертом по налоговому праву.
          </h3>
          
          <p className="text-neutral-400 text-sm leading-relaxed max-w-xl">
            Данный контент прошел трехэтапную проверку на соответствие актуальному законодательству РФ (НК РФ, 402-ФЗ, 115-ФЗ). Все рекомендации и расчеты актуальны на текущий налоговый период 2026 года.
          </p>

          <div className="flex flex-wrap gap-6 pt-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              <Calendar size={14} className="text-primary" />
              Актуально: {date}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              <ShieldCheck size={14} className="text-primary" />
              Статус: Верифицировано
            </div>
          </div>
        </div>

        <div className="md:col-span-4 border-l border-white/5 pl-8 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-black font-bold text-lg">
              АТ
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-widest uppercase">{expertName}</div>
              <div className="text-[9px] font-bold text-primary uppercase tracking-widest mt-1 opacity-70">Auditor & Law Expert</div>
            </div>
          </div>
          <p className="text-[11px] text-neutral-500 leading-relaxed italic">
            «Мы гарантируем точность каждой цифры и нормы, представленной в этом материале».
          </p>
        </div>
      </div>
    </div>
  );
};
