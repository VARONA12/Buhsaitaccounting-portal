"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { 
  Building, 
  ArrowLeft, 
  Clock, 
  ChevronRight, 
  Zap,
  Tag,
  Share2,
  Bookmark
} from "lucide-react";
import { Logo } from "@/components/Logo";

// Generated 15 diverse news items for visual demo
const NEWS_ITEMS = Array.from({ length: 15 }).map((_, i) => ({
  id: `${i + 1}`,
  title: [
    "Обновление лимитов по УСН в 2026 году",
    "ФНС запускает AI-мониторинг льгот",
    "Новые правила ЕНП: что нужно знать?",
    "Цифровой рубль в расчетах с бизнесом",
    "Безопасность 115-ФЗ: новые регламенты",
    "Тренды налоговой оптимизации 2026",
    "ЭлитФинанс расширяет штат экспертов",
    "Как подготовиться к аудиту за 48 часов",
    "Миграционный учет: новые требования",
    "Автоматизация первички через Telegram",
    "Воинский учет в ООО: актуальный гайд",
    "Смена налогового режима: чек-лист",
    "Защита активов при проверках",
    "Новые сроки сдачи отчетности в СФР",
    "Годовая отчетность без паники"
  ][i % 15],
  category: ["Налоги", "Законодательство", "IT", "Безопасность", "Кейс"][i % 5],
  date: i === 0 ? "Сегодня" : i < 3 ? "Вчера" : `${18 - i} Марта`,
  time: `${(i + 1) * 2} мин`,
  desc: i % 2 === 0 
    ? "Подробный разбор изменений в законодательстве с комментариями наших ведущих аудиторов и практическими советами для малого бизнеса."
    : "Краткая сводка самых важных событий, которые напрямую влияют на финансовую устойчивость вашей компании в текущем квартале.",
  size: (i % 3 === 0) ? "large" : "small" // For bento grid variety
}));

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
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Daily Summary - Kept as requested by user's plan earlier, but focus is on the feed */}
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
                <h2 className="text-2xl xl:text-4xl font-bold tracking-tightest leading-[1.1] max-w-4xl italic">
                  Главная новость дня: ФНС запускает автоматизированную систему проверки налоговых льгот для ИТ-компаний. Проверьте ваш статус до конца недели.
                </h2>
              </div>
            </div>
          </section>

          {/* News Feed - Interactive Bricks (Bento Grid) */}
          <section>
            <div className="flex items-end justify-between mb-16">
              <div className="space-y-4">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400">Лента новостей</h2>
                <div className="text-4xl xl:text-7xl font-bold tracking-tightest leading-none">
                  СВЕЖИЙ <span className="text-primary italic">КОНТЕНТ.</span>
                </div>
              </div>
              <div className="hidden md:flex gap-4">
                <button className="p-4 rounded-full border border-white/5 bg-neutral-900/40 text-neutral-500">
                  <Tag size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[280px]">
              {NEWS_ITEMS.map((news, i) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`group relative p-8 rounded-[40px] border border-white/5 bg-neutral-900/30 hover:bg-neutral-900/50 hover:border-primary/30 transition-all overflow-hidden flex flex-col justify-between ${
                    news.size === 'large' ? 'md:col-span-2 row-span-1' : ''
                  }`}
                >
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                    <FileText size={80} className="text-primary" />
                  </div>

                  <div className="relative z-10 space-y-4">
                    <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                      <span className="text-primary">{news.category}</span>
                      <span>{news.date}</span>
                    </div>
                    <h3 className={`font-bold tracking-tightest leading-tight group-hover:text-primary transition-colors ${
                      news.size === 'large' ? 'text-2xl xl:text-3xl' : 'text-xl'
                    }`}>
                      {news.title}
                    </h3>
                    {news.size === 'large' && (
                      <p className="text-neutral-400 text-sm leading-relaxed line-clamp-2 max-w-xl">
                        {news.desc}
                      </p>
                    )}
                  </div>

                  <div className="relative z-10 flex items-center justify-between pt-6 mt-6 border-t border-white/5 group-hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-600">
                      <Clock size={12} /> {news.time}
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="text-neutral-600 hover:text-primary transition-colors">
                        <Share2 size={16} />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-20 flex justify-center">
                   <button className="px-12 py-5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 hover:bg-white hover:text-black transition-all">
                     Загрузить еще
                   </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
