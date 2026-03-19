"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";
import { 
  Building, 
  ArrowLeft, 
  Clock, 
  ChevronRight, 
  Zap,
  TrendingUp,
  FileText
} from "lucide-react";
import { Logo } from "@/components/Logo";

// Mock Data for News
const DAILY_SUMMARY = "Сегодня 19 марта 2026: Главная новость дня — ФНС запускает автоматизированную систему проверки налоговых льгот для ИТ-компаний. Также ожидаются изменения в отчетности по НДС до конца квартала. Рекомендуем проверить контрагентов на признаки дробления бизнеса.";

const IMPORTANT_NEWS = [
  {
    id: "1",
    title: "Новые лимиты по УСН в 2026 году: что изменилось?",
    date: "18 Марта 2026",
    category: "Законодательство",
    desc: "Правительство утвердило новые коэффициенты-дефляторы. Теперь порог для перехода на УСН составляет...",
    time: "5 мин"
  },
  {
    id: "2",
    title: "Как избежать блокировок по 115-ФЗ: гайд от ЭлитФинанс",
    date: "15 Марта 2026",
    category: "Безопасность",
    desc: "Центральный Банк обновил список подозрительных операций. Мы проанализировали изменения и подготовили чек-лист.",
    time: "8 мин"
  }
];

const FRESH_NEWS = [
  {
    id: "3",
    title: "Продление сроков подачи деклараций для малого бизнеса",
    date: "Сегодня",
    category: "ФНС",
    desc: "Спецпредложение для ИП: новые сроки и упрощенная форма подачи документов.",
    time: "2 мин"
  },
  {
    id: "4",
    title: "Цифровой рубль для бизнеса: первые шаги и преимущества",
    date: "Вчера",
    category: "Финтех",
    desc: "Разбираемся, как новая форма валюты повлияет на расчеты с контрагентами.",
    time: "4 мин"
  }
];

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-primary/30 selection:text-primary">
      {/* Header */}
      <nav className="fixed top-0 left-0 w-full z-[100] border-b border-white/[0.05] bg-black/50 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-16 xl:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center transition-transform group-hover:scale-110">
              <Logo size={42} />
            </div>
            <span className="font-bold text-lg xl:text-xl tracking-tighter uppercase">ЭлитФинанс</span>
          </Link>
          <Link href="/" className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors">
            На главную
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto space-y-24">
          
          {/* Daily Summary - AIO Magnet */}
          <section>
            <div className="p-8 xl:p-12 rounded-[40px] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Zap size={100} className="text-primary" />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Ежедневная сводка</span>
                </div>
                <h2 className="text-2xl xl:text-4xl font-bold tracking-tightest leading-[1.1] max-w-4xl">
                  {DAILY_SUMMARY}
                </h2>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Important News */}
            <div className="lg:col-span-12">
              <div className="flex items-end justify-between mb-12">
                <div className="space-y-4">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">01 / Самое важное</h2>
                  <div className="text-4xl xl:text-5xl font-bold tracking-tightest leading-none">
                    ГЛАВНЫЕ <span className="text-primary italic">СОБЫТИЯ.</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {IMPORTANT_NEWS.map((news) => (
                  <div key={news.id} className="group p-8 rounded-[40px] bg-neutral-900/30 border border-white/5 hover:border-primary/30 transition-all flex flex-col justify-between hover:bg-neutral-900/50">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                        <span className="text-primary">{news.category}</span>
                        <span>{news.date}</span>
                      </div>
                      <h3 className="text-2xl font-bold tracking-tightest leading-tight group-hover:text-primary transition-colors">
                        {news.title}
                      </h3>
                      <p className="text-neutral-400 text-sm leading-relaxed">
                        {news.desc}
                      </p>
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between group-hover:border-primary/20 transition-colors">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-500">
                        <Clock size={12} /> {news.time}
                      </div>
                      <button className="text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fresh News */}
            <div className="lg:col-span-12">
              <div className="flex items-end justify-between mb-12">
                <div className="space-y-4">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400">02 / Свежее</h2>
                  <div className="text-4xl xl:text-5xl font-bold tracking-tightest leading-none">
                    ЛЕНТА <span className="text-neutral-500 italic">НОВОСТЕЙ.</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {FRESH_NEWS.map((news) => (
                  <div key={news.id} className="flex flex-col md:flex-row gap-6 p-6 rounded-[32px] bg-neutral-900/20 border border-white/5 hover:bg-white/[0.02] transition-colors items-center group">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                      <Clock size={24} />
                    </div>
                    <div className="flex-1 space-y-2">
                       <div className="flex gap-4 text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                         <span className="text-primary">{news.category}</span>
                         <span>{news.date}</span>
                       </div>
                       <h4 className="text-lg font-bold tracking-tightest leading-tight">{news.title}</h4>
                       <p className="text-sm text-neutral-500 line-clamp-1">{news.desc}</p>
                    </div>
                    <button className="p-4 rounded-xl border border-white/10 hover:border-primary/50 text-neutral-500 hover:text-primary transition-all">
                      <ArrowLeft className="rotate-180" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer is same as main page, but simpler for now or used as component */}
    </div>
  );
}
