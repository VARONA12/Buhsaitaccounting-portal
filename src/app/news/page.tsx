"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Clock, ChevronRight, ChevronLeft, Zap } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ALL_NEWS } from "@/lib/news-data";

const ITEMS_PER_PAGE = 12;

export default function NewsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(ALL_NEWS.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNews = ALL_NEWS.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const newsJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://elitfinans.online/news",
    "name": "Новости ЭлитФинанс",
    "description": "Ежедневная сводка изменений в налоговом законодательстве и бухучёте.",
    "inLanguage": "ru",
    "publisher": {
      "@type": "Organization",
      "@id": "https://elitfinans.online#org",
      "name": "ЭлитФинанс",
    },
    "blogPost": currentNews.map((news) => ({
      "@type": "NewsArticle",
      "@id": `https://elitfinans.online/news/${news.slug}`,
      "headline": news.title,
      "description": news.desc,
      "datePublished": news.isoDate,
      "articleSection": news.category,
      "url": `https://elitfinans.online/news/${news.slug}`,
      "author": {
        "@type": "Person",
        "@id": "https://elitfinans.online#expert",
        "name": "Анна Туманян",
      },
      "isAccessibleForFree": true,
      "inLanguage": "ru",
    })),
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-primary/30 selection:text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsJsonLd) }}
      />

      {/* Header */}
      <nav className="fixed top-0 left-0 w-full z-[100] border-b border-white/[0.05] bg-black/50 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-16 xl:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center transition-transform group-hover:scale-110">
              <Logo size={42} />
            </div>
            <span className="font-bold text-lg xl:text-xl tracking-tighter uppercase">ЭлитФинанс</span>
          </Link>
          <Link
            href="/"
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors"
          >
            На главную
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto space-y-16">

          {/* Daily Summary */}
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
                  Главная новость дня: ФНС запускает автоматизированную систему проверки налоговых льгот для компаний. Проверьте ваш статус до конца недели.
                </h2>
              </div>
            </div>
          </section>

          {/* News Feed */}
          <section id="feed">
            <div className="flex items-end justify-between mb-16">
              <div className="space-y-4">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400">Лента новостей</h2>
                <div className="text-4xl xl:text-7xl font-bold tracking-tightest leading-none">
                  СВЕЖИЕ <span className="text-primary italic">НОВОСТИ</span>
                </div>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                Страница {currentPage} из {totalPages}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="wait">
                {currentNews.map((news, i) => (
                  <motion.div
                    key={`${currentPage}-${news.id}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Link
                      href={`/news/${news.slug}`}
                      className="group relative p-8 rounded-[40px] border border-white/5 bg-neutral-900/30 hover:bg-neutral-900/50 hover:border-primary/30 transition-all flex flex-col justify-between aspect-[4/3] xl:aspect-square"
                    >
                      <div className="space-y-6">
                        <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                          <span className="text-primary">{news.category}</span>
                          <span>{news.date}</span>
                        </div>
                        <h3 className="text-xl xl:text-2xl font-bold tracking-tightest leading-tight group-hover:text-primary transition-colors">
                          {news.title}
                        </h3>
                        <p className="text-neutral-500 text-sm leading-relaxed line-clamp-3">
                          {news.desc}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/5 group-hover:border-primary/20 transition-colors">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-600">
                          <Clock size={12} /> {news.time}
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            <div className="mt-20 flex items-center justify-center gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="w-14 h-14 rounded-full border border-white/5 flex items-center justify-center text-white disabled:opacity-20 hover:bg-white hover:text-black transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-14 h-14 rounded-full font-bold text-[10px] transition-all ${
                      currentPage === i + 1
                        ? "bg-primary text-black"
                        : "bg-white/5 text-neutral-400 hover:bg-white/10"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="w-14 h-14 rounded-full border border-white/5 flex items-center justify-center text-white disabled:opacity-20 hover:bg-white hover:text-black transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
