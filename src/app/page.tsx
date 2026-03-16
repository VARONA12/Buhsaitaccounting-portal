"use client";

import { useSession } from "next-auth/react";
import { DashboardShell } from "@/components/DashboardShell";
import { TaxCalendar } from "@/components/TaxCalendar";
import { RecentDocuments } from "@/components/RecentDocuments";
import AnimatedDocumentWrapper from "@/components/AnimatedDocumentWrapper";

export default function Home() {
  const { data: session } = useSession();

  const companyName = session?.user?.company || "Ваша компания";

  return (
    <DashboardShell>
      {/* Header Title */}
      <div className="relative z-10 mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          С возвращением,<br />
          <span className="text-glow">{companyName}!</span>
        </h1>
        <h2 className="text-neutral-400 text-xl font-light">
          Обзор за апрель 2024
        </h2>
      </div>

      <div className="relative z-10 flex flex-col xl:flex-row gap-8 items-start mb-8">
        <TaxCalendar />
        <div className="flex-1 h-[300px] w-full relative -mt-32 xl:-mt-20">
          <AnimatedDocumentWrapper />
        </div>
      </div>

      <RecentDocuments />

      {/* News & 1C Sync Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 pb-12">
        <div className="lg:col-span-2 glass rounded-2xl border border-white/5 p-6">
          <h3 className="text-xl font-bold text-white mb-6">Новости для бизнеса</h3>
          <div className="space-y-6">
            {[
              { title: "Изменения в налоговом законодательстве с мая 2024", date: "Сегодня", tag: "Законы" },
              { title: "Как правильно оформить сотрудника на удаленку?", date: "Вчера", tag: "HR" },
              { title: "Новые лимиты по УСН на текущий год", date: "12 апреля", tag: "Налоги" },
            ].map((news, i) => (
              <div key={i} className="flex gap-4 group cursor-pointer">
                <div className="w-24 h-16 rounded-xl bg-white/5 shrink-0 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent group-hover:scale-110 transition-transform"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-1.5 py-0.5 rounded">{news.tag}</span>
                    <span className="text-[10px] text-neutral-500">{news.date}</span>
                  </div>
                  <h4 className="font-semibold text-white leading-tight group-hover:text-primary transition-colors">{news.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl border border-white/5 p-6 flex flex-col items-center text-center justify-center bg-primary/5">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4 animate-pulse">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Синхронизация с 1С</h3>
          <p className="text-sm text-neutral-400 mb-6">Ваши данные обновляются в режиме реального времени. Точность данных — 100%.</p>
          <div className="flex items-center gap-2 text-primary font-mono text-xs mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            ACTIVE SYNC HL-992
          </div>
          <button className="w-full py-3 bg-white text-black rounded-xl font-bold hover:bg-neutral-200 transition-all text-sm">
            Открыть отчет сверки
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
