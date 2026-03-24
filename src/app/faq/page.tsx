"use client";

import Link from "next/link";
import { useState } from "react";
import { FAQ_ITEMS, FAQ_CATEGORIES } from "@/lib/faq-data";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
import { ChevronRight, HelpCircle, ArrowRight, Search, Zap } from "lucide-react";

export default function FaqIndexPage() {
  const [activeCategory, setActiveCategory] = useState<string>("Все");
  const [query, setQuery] = useState("");

  const getSearchScore = (item: typeof FAQ_ITEMS[0], rawQuery: string) => {
    if (!rawQuery) return 1;
    const q = rawQuery.toLowerCase().trim();
    const tokens = q.split(/\s+/).filter(t => t.length >= 2);
    let score = 0;

    const question = item.question.toLowerCase();
    const answer = item.shortAnswer.toLowerCase();
    const keywords = item.keywords.map(k => k.toLowerCase());

    // Exact match boost
    if (question.includes(q)) score += 50;
    if (answer.includes(q)) score += 20;

    // Token matching
    tokens.forEach(token => {
      if (question.includes(token)) score += 10;
      if (answer.includes(token)) score += 5;
      if (keywords.some(k => k.includes(token))) score += 15;
    });

    return score;
  };

  const scoredItems = FAQ_ITEMS.map(item => ({
    ...item,
    score: getSearchScore(item, query)
  })).filter(item => {
    const matchCat = activeCategory === "Все" || item.category === activeCategory;
    if (!query) return matchCat;
    return matchCat && item.score > 0;
  }).sort((a, b) => b.score - a.score);

  const recommendedItems = FAQ_ITEMS.slice(0, 3);
  const results = scoredItems.length > 0 ? scoredItems : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://elitfinans.online" },
          { "@type": "ListItem", "position": 2, "name": "Вопросы и ответы", "item": "https://elitfinans.online/faq" },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://elitfinans.online/faq#faqpage",
        name: "Вопросы и ответы по бухгалтерии и налогам для ООО и ИП",
        description:
          "Экспертные ответы на частые вопросы об аутсорсинге бухгалтерии и налогах.",
        url: "https://elitfinans.online/faq",
        inLanguage: "ru",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          "@id": `https://elitfinans.online/faq/${item.slug}#question`,
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.shortAnswer,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans selection:bg-primary-dark/80 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full z-[100] border-b border-white/12 bg-neutral-900/70 backdrop-blur-3xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 xl:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="transition-transform group-hover:scale-110">
              <Logo size={40} />
            </div>
            <span className="font-bold text-lg xl:text-xl tracking-tighter uppercase text-white leading-none">ЭлитФинанс</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-[10px] font-bold uppercase tracking-[0.3em] text-white hover:text-white transition-colors">На главную</Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-40 px-6 md:pt-48">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <header className="mb-20 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.5em] text-white">
              <HelpCircle size={16} />
              БАЗА ЗНАНИЙ / ВОПРОСЫ
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tightest leading-[1.1] text-white uppercase">
              ЧАСТЫЕ <br /> ВОПРОСЫ <span className="text-white ">2026</span>
            </h1>
            <p className="text-xl md:text-2xl text-white font-medium max-w-2xl leading-relaxed">
              Разбираем сложные задачи налогообложения и операционного учета простым языком.
            </p>
          </header>

          {/* Search + Filter */}
          <div className="mb-20 space-y-10">
            <div className="relative max-w-2xl mx-auto lg:mx-0 group">
              <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-white group-focus-within:text-white transition-colors" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск по вопросам..."
                className="w-full pl-16 pr-8 py-6 bg-neutral-900 border border-white/12 rounded-3xl text-lg text-white placeholder:text-white focus:outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all shadow-sm"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              {FAQ_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all border ${
                    activeCategory === cat
                      ? "bg-primary text-white border-primary shadow-xl"
                      : "bg-white/5 text-white border-white/12 hover:border-primary/40 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ list */}
          <div className="space-y-6">
            {results.map((item) => (
              <Link
                key={item.slug}
                href={`/faq/${item.slug}`}
                className="group flex flex-col gap-6 p-10 rounded-[48px] border border-white/12 bg-neutral-900 hover:bg-white/[0.04] hover:border-primary/40 transition-all shadow-sm"
              >
                <div className="flex items-start justify-between gap-6">
                  <h2 className="font-black text-white text-xl md:text-2xl group-hover:text-white transition-colors leading-tight uppercase tracking-tight">
                    {item.question}
                  </h2>
                  <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-white group-hover:text-white group-hover:translate-x-1 transition-all shrink-0">
                    <ArrowRight size={20} />
                  </div>
                </div>
                <p className="text-white text-sm md:text-base leading-relaxed line-clamp-2 font-medium">
                  {item.shortAnswer}
                </p>
                <div className="flex items-center gap-6 pt-8 border-t border-white/12">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1 rounded-full bg-primary/10 text-white border border-primary/20">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-bold text-white uppercase tracking-[0.3em] group-hover:text-white transition-colors">
                    ПОЛНЫЙ ОТВЕТ →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty state - Smarter Fallback */}
          {query && results.length === 0 && (
            <div className="space-y-12">
              <div className="text-center py-24 border border-dashed border-white/20 rounded-[56px] bg-white/[0.03]">
                <p className="text-white uppercase font-black tracking-[0.5em] text-[10px] mb-4">По вашему запросу ничего не найдено</p>
                <p className="text-white text-sm mb-10">Попробуйте изменить запрос или ознакомьтесь с популярными вопросами ниже.</p>
                <button 
                  onClick={() => setQuery("")} 
                  className="px-8 py-3 bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-xl hover:bg-primary hover:text-white transition-all"
                >
                  Сбросить поиск
                </button>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-white">
                  <Zap size={14} className="animate-pulse" /> РЕКОМЕНДУЕМЫЕ ВОПРОСЫ
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {recommendedItems.map(item => (
                     <Link key={item.slug} href={`/faq/${item.slug}`} className="p-8 rounded-[40px] border border-white/12 bg-white/[0.02] hover:border-primary/20 transition-all flex flex-col gap-4">
                        <h4 className="font-bold text-white uppercase text-sm leading-tight group-hover:text-white">{item.question}</h4>
                        <span className="text-[9px] font-bold text-white uppercase tracking-widest mt-auto">ПОСМОТРЕТЬ РЕШЕНИЕ</span>
                     </Link>
                   ))}
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-40 p-12 md:p-20 rounded-[80px] bg-neutral-900 border border-white/12 relative overflow-hidden group hover:bg-white/[0.05] transition-all">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
              <div className="space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-white">DO YOU HAVE QUESTIONS?</p>
                <h2 className="text-3xl md:text-5xl font-black tracking-tightest text-white uppercase leading-none">Спросите эксперта <br /> напрямую</h2>
                <p className="text-white text-lg md:text-xl max-w-md font-medium leading-relaxed ">Бесплатный разбор вашей ситуации при первом обращении.</p>
              </div>
              <Link href="/#contact" className="shrink-0 px-10 py-5 bg-primary text-white font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl hover:bg-white transition-all shadow-2xl flex items-center justify-center gap-3 group">
                Задать вопрос <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
