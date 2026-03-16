"use client";

import { useSession } from "next-auth/react";
import { DashboardShell } from "@/components/DashboardShell";
import { TaxCalendar } from "@/components/TaxCalendar";
import { RecentDocuments } from "@/components/RecentDocuments";
import AnimatedDocumentWrapper from "@/components/AnimatedDocumentWrapper";
import { motion } from "framer-motion";

import { FinancialSummary } from "@/components/FinancialSummary";

import { QuickStats } from "@/components/QuickStats";

export default function Home() {
  const { data: session } = useSession();

  const companyName = session?.user?.company || "Ваша компания";

  return (
    <DashboardShell>
      {/* Refined Background Orb (Yellow only) */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full z-0 pointer-events-none" />
      
      <div className="flex flex-col xl:flex-row gap-8 mb-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            С возвращением,<br />
            <span className="text-primary drop-shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]">
              {companyName}!
            </span>
          </h1>
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-neutral-800" />
            <h2 className="text-neutral-500 text-xl font-light">
              Обзор за апрель 2024
            </h2>
          </div>
        </motion.div>
      </div>

      <div className="mb-12">
        <QuickStats />
      </div>

      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-2 gap-8 items-start mb-8">
        <div className="space-y-8">
          <TaxCalendar />
          <FinancialSummary />
        </div>
        <div className="h-[500px] w-full relative xl:-mt-20">
          <AnimatedDocumentWrapper />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <RecentDocuments />
      </motion.div>

      {/* News & 1C Sync Status (Black/Yellow/White theme) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 pb-12 relative z-10">
        <motion.div 
          whileHover={{ y: -5 }}
          className="lg:col-span-2 glass rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden"
        >
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-primary rounded-full" />
            Новости для бизнеса
          </h3>
          <div className="space-y-8">
            {[
              { title: "Изменения в налоговом законодательстве с мая 2024", date: "Сегодня", tag: "Законы" },
              { title: "Как правильно оформить сотрудника на удаленку?", date: "Вчера", tag: "HR" },
              { title: "Новые лимиты по УСН на текущий год", date: "12 апреля", tag: "Налоги" },
            ].map((news, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex gap-6 group cursor-pointer"
              >
                <div className="w-28 h-20 rounded-2xl bg-white/5 border border-white/5 shrink-0 overflow-hidden flex items-center justify-center">
                  <div className="w-12 h-12 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 tracking-widest px-2 py-1 rounded-md border border-primary/20">{news.tag}</span>
                    <span className="text-[10px] text-neutral-500 font-mono italic">{news.date}</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white/90 leading-tight group-hover:text-primary transition-colors duration-300">{news.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass rounded-3xl border border-white/10 p-8 flex flex-col items-center text-center justify-center shadow-2xl"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-3 text-glow">Синхронизация с 1С</h3>
          <p className="text-sm text-neutral-400 mb-8 px-4 font-light leading-relaxed">Ваши данные обновляются в реальном времени.</p>
          <div className="flex items-center gap-3 text-primary font-mono text-[10px] mb-8 bg-black border border-primary/20 px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            ACTIVE SYNC
          </div>
          <button className="w-full py-4 bg-primary text-black rounded-2xl font-bold hover:bg-primary-dark transition-all duration-300 text-sm transform active:scale-95 shadow-[0_4px_15px_rgba(255,193,7,0.3)]">
            Открыть отчет сверки
          </button>
        </motion.div>
      </div>
    </DashboardShell>
  );
}
