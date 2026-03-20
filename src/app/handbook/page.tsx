"use client";

import Link from "next/link";
import { useState } from "react";
import { HANDBOOK_TERMS, CATEGORIES } from "@/lib/handbook-data";
import { Logo } from "@/components/Logo";
import {
  BookOpen,
  ArrowRight,
  ChevronRight,
  Search,
  Tag,
} from "lucide-react";

export default function HandbookPage() {
  const [activeCategory, setActiveCategory] = useState<string>("Все");
  const [query, setQuery] = useState("");

  const filtered = HANDBOOK_TERMS.filter((t) => {
    const matchCat = activeCategory === "Все" || t.category === activeCategory;
    const q = query.toLowerCase();
    const matchQ =
      !q ||
      t.term.toLowerCase().includes(q) ||
      t.shortDef.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.toLowerCase().includes(q));
    return matchCat && matchQ;
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTermSet",
        "@id": "https://elitfinans.online/handbook#glossary",
        name: "Справочник предпринимателя",
        description:
          "Экспертный глоссарий налоговых и бухгалтерских терминов для владельцев ООО и ИП в России",
        inLanguage: "ru",
        url: "https://elitfinans.online/handbook",
        publisher: {
          "@type": "Organization",
          "@id": "https://elitfinans.online#org",
          name: "ЭлитФинанс",
        },
        hasDefinedTerm: HANDBOOK_TERMS.map((t) => ({
          "@type": "DefinedTerm",
          "@id": `https://elitfinans.online/handbook/${t.slug}#term`,
          name: t.term,
          description: t.shortDef,
          url: `https://elitfinans.online/handbook/${t.slug}`,
          inDefinedTermSet: "https://elitfinans.online/handbook#glossary",
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Главная",
            item: "https://elitfinans.online",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Справочник предпринимателя",
            item: "https://elitfinans.online/handbook",
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": "https://elitfinans.online/handbook",
        name: "Справочник предпринимателя — налоговые термины 2026",
        description:
          "Полный справочник по налогам и бухгалтерии для ООО и ИП: ЕНП, УСН, ОСНО, НДС, 115-ФЗ и другие ключевые термины с экспертными разборами.",
        url: "https://elitfinans.online/handbook",
        isPartOf: { "@id": "https://elitfinans.online#website" },
        breadcrumb: { "@id": "https://elitfinans.online/handbook#breadcrumb" },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".handbook-intro", ".handbook-terms"],
        },
      },
    ],
  };

  const categoryColors: Record<string, string> = {
    Налоги: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    Системы: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    Отчётность: "text-green-400 bg-green-400/10 border-green-400/20",
    Документы: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    Регистрация: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    Законы: "text-red-400 bg-red-400/10 border-red-400/20",
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
            <span className="font-bold text-lg xl:text-xl tracking-tighter uppercase">
              ЭлитФинанс
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/news"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors hidden md:block"
            >
              Новости
            </Link>
            <Link
              href="/articles"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors hidden md:block"
            >
              Статьи
            </Link>
            <Link
              href="/"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors"
            >
              На главную
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-24 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <ChevronRight size={10} />
              </li>
              <li className="text-neutral-400">Справочник предпринимателя</li>
            </ol>
          </nav>

          {/* Header */}
          <header className="handbook-intro mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <BookOpen size={20} className="text-primary" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                Справочник предпринимателя
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tightest leading-[1.05] text-white mb-6">
              Налоговые термины
              <br />
              <span className="text-neutral-500">для бизнеса 2026</span>
            </h1>
            <p className="text-lg xl:text-xl text-neutral-400 leading-relaxed font-medium max-w-2xl">
              20 ключевых понятий налогового и бухгалтерского учёта — с подробными
              определениями, примерами и ответами на частые вопросы. Материал
              подготовлен экспертом ЭлитФинанс.
            </p>
          </header>

          {/* Search + Filter */}
          <div className="mb-12 space-y-6">
            {/* Search */}
            <div className="relative max-w-xl">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск по справочнику..."
                className="w-full pl-11 pr-4 py-3.5 bg-neutral-900/60 border border-white/10 rounded-xl text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
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

          {/* Terms count */}
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-8">
            Найдено терминов: {filtered.length}
          </p>

          {/* Terms Grid */}
          <div className="handbook-terms grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((term) => (
              <Link
                key={term.slug}
                href={`/handbook/${term.slug}`}
                className="group relative p-8 rounded-[32px] bg-neutral-900/30 border border-white/5 hover:bg-neutral-900/50 hover:border-primary/20 transition-all flex flex-col gap-5"
              >
                {/* Category badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                      categoryColors[term.category] ||
                      "text-neutral-400 bg-neutral-800/50 border-white/10"
                    }`}
                  >
                    <Tag size={9} />
                    {term.category}
                  </span>
                </div>

                {/* Term name */}
                <div>
                  <h2 className="text-2xl font-bold text-white group-hover:text-primary transition-colors tracking-tight mb-3">
                    {term.term}
                  </h2>
                  <p className="text-sm text-neutral-400 leading-relaxed line-clamp-3">
                    {term.shortDef}
                  </p>
                </div>

                {/* FAQ count */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">
                    {term.faq.length} вопроса в FAQ
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-widest group-hover:gap-2 transition-all">
                    Читать <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-neutral-500 text-lg">Ничего не найдено</p>
              <button
                onClick={() => { setQuery(""); setActiveCategory("Все"); }}
                className="mt-4 text-primary text-sm font-bold underline"
              >
                Сбросить фильтры
              </button>
            </div>
          )}

          {/* CTA */}
          <div className="mt-20 p-10 xl:p-14 rounded-[40px] bg-neutral-900/40 border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                  Нужна личная консультация?
                </p>
                <h2 className="text-2xl xl:text-3xl font-bold tracking-tightest text-white">
                  Разберём вашу ситуацию.
                </h2>
                <p className="text-neutral-400 text-sm max-w-md">
                  Эксперт ЭлитФинанс применит нужные нормы к вашему конкретному
                  случаю — ООО или ИП, ОСНО или УСН.
                </p>
              </div>
              <Link
                href="/#services"
                className="shrink-0 px-8 py-4 bg-primary text-black font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-white transition-all flex items-center gap-3 group"
              >
                Наши услуги{" "}
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
