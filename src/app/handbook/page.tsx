export const revalidate = 300;

import Link from "next/link";
import { HANDBOOK_TERMS, CATEGORIES } from "@/lib/handbook-data";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
import { BookOpen, ArrowRight, ChevronRight, Tag, Zap } from "lucide-react";

export default function HandbookPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTermSet",
        "@id": "https://elitfinans.online/handbook#glossary",
        "name": "Справочник предпринимателя",
        "description": "Экспертный глоссарий налоговых и бухгалтерских терминов для владельцев ООО и ИП в России",
        "inLanguage": "ru",
        "url": "https://elitfinans.online/handbook",
        "publisher": {
          "@type": "Organization",
          "name": "ЭлитФинанс",
        },
        "hasDefinedTerm": HANDBOOK_TERMS.map((t) => ({
          "@type": "DefinedTerm",
          "name": t.term,
          "description": t.shortDef,
          "url": `https://elitfinans.online/handbook/${t.slug}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://elitfinans.online" },
          { "@type": "ListItem", "position": 2, "name": "Справочник", "item": "https://elitfinans.online/handbook" },
        ],
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
            <span className="font-bold text-lg xl:text-xl tracking-tighter uppercase text-white leading-none">
              ЭлитФинанс
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-white hover:text-white transition-colors"
            >
              На главную
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-40 px-6 md:pt-48">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="handbook-intro mb-20 space-y-8 lg:text-left">
            <div className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.5em] text-white">
              <BookOpen size={16} />
              KNOWLEDGE BASE / GLOSSARY
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tightest leading-[1.1] text-white uppercase">
              НАЛОГОВЫЕ <br /> ТЕРМИНЫ <span className="text-white ">2026</span>
            </h1>
            <p className="text-xl md:text-2xl text-white font-medium leading-relaxed max-w-2xl">
              Экспертный глоссарий для собственников бизнеса: от ОСНО до 115-ФЗ.
            </p>
          </header>

          {/* Categories Grid */}
          <div className="space-y-32">
            {CATEGORIES.filter(c => c !== "Все").map(category => (
              <section key={category} id={category}>
                 <div className="flex items-center gap-4 mb-12">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <h2 className="text-2xl font-black uppercase tracking-[0.3em] text-white">{category}</h2>
                    <div className="h-px bg-white/5 flex-1" />
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {HANDBOOK_TERMS.filter(t => t.category === category).map((term) => (
                      <Link
                        key={term.slug}
                        href={`/handbook/${term.slug}`}
                        className="group p-10 rounded-[48px] border border-white/12 bg-neutral-900 hover:bg-white/[0.04] hover:border-primary/30 transition-all duration-500 flex flex-col h-full shadow-sm"
                      >
                        <div>
                          <h3 className="text-2xl font-black text-white group-hover:text-white transition-colors tracking-tight mb-6 uppercase">
                            {term.term}
                          </h3>
                          <p className="text-white text-sm md:text-base leading-relaxed line-clamp-3 mb-10 font-medium">
                            {term.shortDef}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/12">
                          <span className="text-[9px] font-bold text-white uppercase tracking-widest">
                            {term.faq.length} вопроса разобрано
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-white uppercase tracking-widest group-hover:gap-4 transition-all">
                            Детали <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </Link>
                    ))}
                 </div>
              </section>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-40 p-12 md:p-20 rounded-[80px] bg-primary text-white relative overflow-hidden group shadow-[0_0_80px_rgba(255,179,0,0.15)]">
            <div className="absolute top-[-50%] right-[-10%] w-[800px] h-[800px] bg-white/20 rounded-full blur-[100px]" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
              <div className="space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/50">
                  PERSONAL CONSULTING
                </p>
                <h2 className="text-3xl md:text-5xl font-black tracking-tightest text-white uppercase leading-none">
                  Разберём вашу <br /> ситуацию.
                </h2>
                <p className="text-white/60 text-lg md:text-xl max-w-md font-medium leading-relaxed ">
                  Эксперт ЭлитФинанс применит нужные нормы к вашему конкретному случаю — ООО или ИП.
                </p>
              </div>
              <Link
                href="/#contact"
                className="shrink-0 px-10 py-5 bg-neutral-900 text-white font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl hover:bg-white hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3 group"
              >
                Оставить заявку
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
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
