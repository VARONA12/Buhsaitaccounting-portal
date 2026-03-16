"use client";

import { useSession } from "next-auth/react";
import { DashboardShell } from "@/components/DashboardShell";
import { TaxCalendar } from "@/components/TaxCalendar";
import { RecentDocuments } from "@/components/RecentDocuments";
import AnimatedDocumentWrapper from "@/components/AnimatedDocumentWrapper";
import { motion } from "framer-motion";

export default function Home() {
  const { data: session } = useSession();

  const companyName = session?.user?.company || "Ваша компания";

  return (
    <DashboardShell>
      {/* Premium Background Orb */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full z-0 pointer-events-none animate-pulse" />
      
      {/* Header Title with Animation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 mb-12"
      >
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 leading-tight">
          С возвращением,<br />
          <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]">
            {companyName}!
          </span>
        </h1>
        <div className="flex items-center gap-3">
          <div className="h-px w-12 bg-neutral-700" />
          <h2 className="text-neutral-400 text-xl font-light">
            Обзор за апрель 2024
          </h2>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 flex flex-col xl:flex-row gap-8 items-start mb-8"
      >
        <TaxCalendar />
        <div className="flex-1 h-[400px] w-full relative -mt-32 xl:-mt-20">
          <AnimatedDocumentWrapper />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <RecentDocuments />
      </motion.div>

      {/* News & 1C Sync Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 pb-12 relative z-10">
        <motion.div 
          whileHover={{ y: -5 }}
          className="lg:col-span-2 glass-premium rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl" />
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-primary rounded-full" />
            Новости для бизнеса
          </h3>
          <div className="space-y-8">
            {[
              { title: "Изменения в налоговом законодательстве с мая 2024", date: "Сегодня", tag: "Законы", color: "from-blue-500/20" },
              { title: "Как правильно оформить сотрудника на удаленку?", date: "Вчера", tag: "HR", color: "from-purple-500/20" },
              { title: "Новые лимиты по УСН на текущий год", date: "12 апреля", tag: "Налоги", color: "from-orange-500/20" },
            ].map((news, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex gap-6 group cursor-pointer"
              >
                <div className={`w-28 h-20 rounded-2xl bg-gradient-to-br ${news.color} to-transparent border border-white/5 shrink-0 overflow-hidden flex items-center justify-center`}>
                  <div className="w-12 h-12 bg-white/10 rounded-full blur-md group-hover:scale-150 transition-transform duration-700" />
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
          className="glass-premium rounded-3xl border border-white/10 p-8 flex flex-col items-center text-center justify-center bg-gradient-to-b from-primary/10 via-transparent to-transparent shadow-2xl"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-6 shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-spin-slow"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Синхронизация с 1С</h3>
          <p className="text-sm text-neutral-400 mb-8 px-4 font-light leading-relaxed">Ваши данные обновляются в реальном времени. Точность данных — 100%.</p>
          <div className="flex items-center gap-3 text-primary font-mono text-[10px] mb-8 bg-black/40 border border-primary/20 px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            ACTIVE SYNC HL-992
          </div>
          <button className="w-full py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-2xl font-bold hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] transition-all duration-300 text-sm transform active:scale-95">
            Открыть отчет сверки
          </button>
        </motion.div>
      </div>
    </DashboardShell>
  );
}
