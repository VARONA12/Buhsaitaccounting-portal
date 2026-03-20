"use client";

import Link from "next/link";
import { useState } from "react";
import { FAQ_ITEMS, FAQ_CATEGORIES } from "@/lib/faq-data";
import { Logo } from "@/components/Logo";
import { ChevronRight, HelpCircle, ArrowRight, Search } from "lucide-react";

const categoryColors: Record<string, string> = {
  Аутсорсинг: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  "Налоговые режимы": "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  Проверки: "text-red-400 bg-red-400/10 border-red-400/20",
  "Блокировка счёта": "text-orange-400 bg-orange-400/10 border-orange-400/20",
  "ИП и ООО": "text-green-400 bg-green-400/10 border-green-400/20",
  "Налоги и взносы": "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

export default function FaqIndexPage() {
  const [activeCategory, setActiveCategory] = useState<string>("Все");
  const [query, setQuery] = useState("");

  const filtered = FAQ_ITEMS.filter((item) => {
    const matchCat = activeCategory === "Все" || item.category === activeCategory;
    const q = query.toLowerCase();
    const matchQ =
      !q ||
      item.question.toLowerCase().includes(q) ||
      item.shortAnswer.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q));
    return matchCat && matchQ;
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": "https://elitfinans.online/faq#faqpage",
        name: "Вопросы и ответы по бухгалтерии и налогам для ООО и ИП",
        description:
          "Экспертные ответы на 20 частых вопросов об аутсорсинге бухгалтерии, налоговых режимах, проверках ФНС и блокировках счетов.",
        url: "https://elitfinans.online/faq",
        inLanguage: "ru",
        author: {
          "@type": "Person",
          "@id": "https://elitfinans.online#expert",
          name: "Анна Туманян",
        },
        publisher: {
          "@type": "Organization",
          "@id": "https://elitfinans.online#org",
          name: "ЭлитФинанс",
        },
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          "@id": `https://elitfinans.online/faq/${item.slug}#question`,
          name: item.question,
          url: `https://elitfinans.online/faq/${item.slug}`,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.shortAnswer,
            url: `https://elitfinans.online/faq/${item.slug}`,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: "https://elitfinans.online" },
          { "@type": "ListItem", position: 2, name: "Вопросы и ответы", item: "https://elitfinans.online/faq" },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full z-[100] border-b border-white/[0.05] bg-black/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-16 xl:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="transition-transform group-hover:scale-110">
              <Logo size={42} />
            </div>
            <span className="font-bold text-lg xl:text-xl tracking-tighter uppercase">ЭлитФинанс</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/handbook" className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors hidden md:block">Справочник</Link>
            <Link href="/articles" className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors hidden md:block">Статьи</Link>
            <Link href="/" className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors">На главную</Link>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-24 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
              <li><Link href="/" className="hover:text-primary transition-colors">Главная</Link></li>
              <li><ChevronRight size={10} /></li>
              <li className="text-neutral-400">Вопросы и ответы</li>
            </ol>
          </nav>

          {/* Header */}
          <header className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <HelpCircle size={20} className="text-primary" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Вопросы и ответы</span>
            </div>
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tightest leading-[1.05] text-white mb-6">
              Частые вопросы
              <br /><span className="text-neutral-500">о налогах и бухгалтерии</span>
            </h1>
            <p className="text-lg xl:text-xl text-neutral-400 leading-relaxed font-medium max-w-2xl">
              20 экспертных ответов на самые часто задаваемые вопросы об аутсорсинге бухгалтерии, налоговых режимах, проверках ФНС и блокировках счетов.
            </p>
          </header>

          {/* Search + Filter */}
          <div className="mb-10 space-y-5">
            <div className="relative max-w-xl">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск по вопросам..."
                className="w-full pl-11 pr-4 py-3.5 bg-neutral-900/60 border border-white/10 rounded-xl text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {FAQ_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-black border-primary"
                      : "bg-neutral-900/50 text-neutral-400 border-white/10 hover:border-primary/30 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-8">
            Найдено вопросов: {filtered.length}
          </p>

          {/* FAQ list */}
          <div className="space-y-4">
            {filtered.map((item) => (
              <Link
                key={item.slug}
                href={`/faq/${item.slug}`}
                className="group flex flex-col gap-4 p-7 rounded-[28px] bg-neutral-900/30 border border-white/5 hover:bg-neutral-900/50 hover:border-primary/20 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-bold text-white text-base group-hover:text-primary transition-colors leading-snug">
                    {item.question}
                  </h2>
                  <ArrowRight size={16} className="text-neutral-600 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-0.5" />
                </div>
                <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2">
                  {item.shortAnswer}
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${categoryColors[item.category] || "text-neutral-400 bg-neutral-800/50 border-white/10"}`}>
                    {item.category}
                  </span>
                  <span className="text-[9px] font-bold text-primary uppercase tracking-widest">
                    Читать полный ответ →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-neutral-500 text-lg">Ничего не найдено</p>
              <button onClick={() => { setQuery(""); setActiveCategory("Все"); }} className="mt-4 text-primary text-sm font-bold underline">Сбросить фильтры</button>
            </div>
          )}

          {/* CTA */}
          <div className="mt-20 p-10 xl:p-14 rounded-[40px] bg-neutral-900/40 border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Не нашли ответ?</p>
                <h2 className="text-2xl xl:text-3xl font-bold tracking-tightest text-white">Спросите эксперта напрямую</h2>
                <p className="text-neutral-400 text-sm max-w-md">Анна Туманян ответит на ваш конкретный вопрос бесплатно при первичной консультации.</p>
              </div>
              <Link href="/#contact" className="shrink-0 px-8 py-4 bg-primary text-black font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-white transition-all flex items-center gap-3 group">
                Задать вопрос <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
