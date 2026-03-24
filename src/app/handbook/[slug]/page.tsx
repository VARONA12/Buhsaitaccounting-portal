import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { HANDBOOK_TERMS } from "@/lib/handbook-data";
import { ExpertVerification } from "@/components/ExpertVerification";
import { Logo } from "@/components/Logo";
import { ContactButton } from "@/components/ContactButton";
import {
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Tag,
  BookOpen,
  HelpCircle,
  ChevronDown,
  Zap
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return HANDBOOK_TERMS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const term = HANDBOOK_TERMS.find((t) => t.slug === slug);
  if (!term) return { title: "Термин не найден | ЭлитФинанс" };

  const url = `https://elitfinans.online/handbook/${slug}`;

  return {
    title: `${term.term} — что это такое простыми словами | ЭлитФинанс`,
    description: term.shortDef,
    keywords: term.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${term.term} — определение и разбор`,
      description: term.shortDef,
      url,
      siteName: "ЭлитФинанс",
      locale: "ru_RU",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${term.term} — что это | ЭлитФинанс`,
      description: term.shortDef,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };
}

const categoryColors: Record<string, string> = {
  Налоги: "text-white bg-primary/10 border-primary/40",
  Системы: "text-white bg-blue-400/10 border-blue-400/20",
  Отчётность: "text-white bg-green-400/10 border-green-400/20",
  Документы: "text-white bg-purple-400/10 border-purple-400/20",
  Регистрация: "text-white bg-orange-400/10 border-orange-400/20",
  Законы: "text-white bg-red-400/10 border-red-400/20",
};

export default async function HandbookTermPage({ params }: Props) {
  const { slug } = await params;
  const term = HANDBOOK_TERMS.find((t) => t.slug === slug);
  if (!term) notFound();

  const related = HANDBOOK_TERMS.filter(
    (t) => t.slug !== slug && t.category === term.category
  ).slice(0, 3);
  const fillRelated = HANDBOOK_TERMS.filter((t) => t.slug !== slug).slice(
    0,
    3 - related.length
  );
  const relatedTerms = [...related, ...fillRelated].slice(0, 3);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": term.faq.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans selection:bg-primary-dark/80 selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
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
              href="/handbook"
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:text-white transition-colors"
            >
              <ArrowLeft size={14} /> Справочник
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-40 px-6 md:pt-40">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white flex-wrap">
              <li><Link href="/" className="hover:text-white transition-colors">Главная</Link></li>
              <li><ChevronRight size={10} /></li>
              <li><Link href="/handbook" className="hover:text-white transition-colors">Справочник</Link></li>
              <li><ChevronRight size={10} /></li>
              <li className="text-white truncate max-w-[200px]">{term.term}</li>
            </ol>
          </nav>

          {/* Category */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span
              className={`flex items-center gap-2 px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                categoryColors[term.category] ||
                "text-white bg-white/5 border-white/20"
              }`}
            >
              <Tag size={10} /> {term.category}
            </span>
            <span className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest">
              <BookOpen size={14} className="text-white" /> СПРАВОЧНИК 2026
            </span>
          </div>

          {/* Headline */}
          <header className="mb-12 space-y-8">
            <h1 className="text-4xl md:text-6xl xl:text-7xl font-black tracking-tightest leading-[1.05] text-white uppercase">
              {term.term}
            </h1>
            <div className="term-definition p-8 rounded-[48px] border border-white/12 bg-neutral-900 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-5"><Logo size={80} /></div>
               <p className="text-xl md:text-2xl text-white font-medium leading-relaxed  relative z-10">
                 {term.shortDef}
               </p>
            </div>
          </header>

          {/* Full definition */}
          <article className="mb-24">
            <div className="flex items-center gap-3 mb-10 text-white font-bold uppercase text-[10px] tracking-[0.4em]">
              <Zap size={16} className="animate-pulse" /> ПОДРОБНЫЙ РАЗБОР
            </div>
            <div className="term-full-def space-y-8">
              {term.fullDef.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-white leading-[1.8] text-[19px] font-medium "
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          {/* Expert Verification */}
          <ExpertVerification expertName="Эксперт ЭлитФинанс" date="Март 2026" />

          {/* FAQ */}
          <section className="mt-24" aria-label={`Частые вопросы по теме ${term.term}`}>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <HelpCircle size={20} className="text-white" />
              </div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white">
                ЧАСТЫЕ ВОПРОСЫ
              </h2>
            </div>
            <div className="space-y-4">
              {term.faq.map((item, i) => (
                <details
                  key={i}
                  className="group p-8 rounded-[40px] bg-neutral-900 border border-white/12 hover:border-primary/40 transition-all shadow-xl"
                >
                  <summary className="flex items-start justify-between gap-6 cursor-pointer list-none">
                    <span className="font-black text-white text-lg leading-tight uppercase tracking-tight">
                      {item.q}
                    </span>
                    <ChevronDown
                      size={20}
                      className="text-white shrink-0 mt-1 group-open:rotate-180 transition-transform"
                    />
                  </summary>
                  <p className="mt-8 text-white leading-relaxed text-base font-medium  border-t border-white/12 pt-8">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA - Premium Dark Glass */}
          <div className="mt-24 p-12 md:p-20 rounded-[80px] bg-neutral-900 border border-white/12 text-white relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12 text-left">
              <div className="space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/50">ЛИЧНАЯ КОНСУЛЬТАЦИЯ</p>
                <h3 className="text-3xl md:text-5xl font-black tracking-tightest text-white uppercase leading-[0.9]">
                  РАЗБЕРЁМ ВАШУ <br /> СИТУАЦИЮ
                </h3>
                <p className="text-white/60 text-lg md:text-xl max-w-md font-medium leading-relaxed ">
                  Эксперт применит нормы по теме «{term.term}» к вашей модели бизнеса ООО или ИП. Профессионально и безопасно.
                </p>
              </div>
              <ContactButton label="ЗАДАТЬ ВОПРОС" />
            </div>
          </div>

          {/* Related Terms */}
          {relatedTerms.length > 0 && (
            <section className="mt-40">
              <div className="flex items-center gap-4 mb-16">
                <BookOpen size={20} className="text-white" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">
                  ПОХОЖИЕ ТЕРМИНЫ
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedTerms.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/handbook/${t.slug}`}
                    className="group p-8 rounded-[48px] border border-white/12 bg-white/[0.03] hover:bg-neutral-900 hover:border-primary/40 transition-all flex flex-col gap-6"
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-white/12">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                          categoryColors[t.category] ||
                          "text-white bg-white/5 border-white/20"
                        }`}
                      >
                        {t.category}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white group-hover:text-white transition-colors mb-2 uppercase tracking-tight">
                        {t.term}
                      </h3>
                      <p className="text-xs text-white leading-relaxed line-clamp-2 font-medium">
                        {t.shortDef}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-[0.3em] mt-auto">
                      ЧИТАТЬ <ArrowRight size={14} className="group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/12 bg-neutral-900 relative">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-4">
               <Logo size={40} />
               <span className="font-bold text-xl tracking-tighter uppercase text-white">ЭлитФинанс</span>
            </div>
            <nav className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                {[
                  { label: "МЫ В МАКСЕ", href: "https://max-channel-link" },
                  { label: "ПОЗВОНИТЬ", href: "tel:+74950000000" },
                  { label: "СООБЩЕСТВО В ВК", href: "https://vk.com/elitfinans" },
                  { label: "НАПИСАТЬ НА ПОЧТУ", href: "mailto:info@elitfinans.online" }
                ].map(nav => (
                  <Link 
                    key={nav.label} 
                    href={nav.href} 
                    className="px-6 py-3 rounded-full border border-white/12 bg-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-white hover:bg-white hover:text-neutral-900 transition-all shadow-lg whitespace-nowrap"
                  >
                    {nav.label}
                  </Link>
                ))}
            </nav>
         </div>
      </footer>
    </div>
  );
}
