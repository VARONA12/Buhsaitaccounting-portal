import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { HANDBOOK_TERMS } from "@/lib/handbook-data";
import { ExpertVerification } from "@/components/ExpertVerification";
import { Logo } from "@/components/Logo";
import {
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Tag,
  BookOpen,
  HelpCircle,
  ChevronDown,
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
  Налоги: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  Системы: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Отчётность: "text-green-400 bg-green-400/10 border-green-400/20",
  Документы: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  Регистрация: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  Законы: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default async function HandbookTermPage({ params }: Props) {
  const { slug } = await params;
  const term = HANDBOOK_TERMS.find((t) => t.slug === slug);
  if (!term) notFound();

  const url = `https://elitfinans.online/handbook/${slug}`;

  // Related terms: same category, excluding self
  const related = HANDBOOK_TERMS.filter(
    (t) => t.slug !== slug && t.category === term.category
  ).slice(0, 3);
  const fillRelated = HANDBOOK_TERMS.filter((t) => t.slug !== slug).slice(
    0,
    3 - related.length
  );
  const relatedTerms = [...related, ...fillRelated].slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTerm",
        "@id": `${url}#term`,
        name: term.term,
        description: term.shortDef,
        url,
        inDefinedTermSet: {
          "@type": "DefinedTermSet",
          "@id": "https://elitfinans.online/handbook#glossary",
          name: "Справочник предпринимателя",
          url: "https://elitfinans.online/handbook",
        },
        termCode: term.slug,
        about: {
          "@type": "Thing",
          name: term.category,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        name: `Часто задаваемые вопросы: ${term.term}`,
        mainEntity: term.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: `${term.term} — что это такое: определение и разбор`,
        description: term.shortDef,
        articleBody: term.fullDef.join(" "),
        inLanguage: "ru",
        isAccessibleForFree: true,
        keywords: term.keywords.join(", "),
        about: {
          "@type": "DefinedTerm",
          "@id": `${url}#term`,
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".term-definition", ".term-full-def"],
        },
        author: {
          "@type": "Person",
          "@id": "https://elitfinans.online#expert",
          name: "Анна Туманян",
          jobTitle: "Налоговый консультант и главный бухгалтер",
          worksFor: { "@id": "https://elitfinans.online#org" },
        },
        publisher: {
          "@type": "Organization",
          "@id": "https://elitfinans.online#org",
          name: "ЭлитФинанс",
          url: "https://elitfinans.online",
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
        isPartOf: {
          "@type": "DefinedTermSet",
          "@id": "https://elitfinans.online/handbook#glossary",
        },
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
          {
            "@type": "ListItem",
            position: 3,
            name: term.term,
            item: url,
          },
        ],
      },
      {
        "@type": "Organization",
        "@id": "https://elitfinans.online#org",
        name: "ЭлитФинанс",
        url: "https://elitfinans.online",
        telephone: "+79028371370",
        email: "info@elitfinance.ru",
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
            <span className="font-bold text-lg xl:text-xl tracking-tighter uppercase">
              ЭлитФинанс
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/handbook"
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} /> Справочник
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
        <div className="max-w-4xl mx-auto">

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
              <li>
                <Link
                  href="/handbook"
                  className="hover:text-primary transition-colors"
                >
                  Справочник
                </Link>
              </li>
              <li>
                <ChevronRight size={10} />
              </li>
              <li className="text-neutral-400 truncate max-w-[200px]">
                {term.term}
              </li>
            </ol>
          </nav>

          {/* Category + section */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                categoryColors[term.category] ||
                "text-neutral-400 bg-neutral-800/50 border-white/10"
              }`}
            >
              <Tag size={9} /> {term.category}
            </span>
            <span className="flex items-center gap-2 text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
              <BookOpen size={12} /> Справочник предпринимателя
            </span>
          </div>

          {/* Headline */}
          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tightest leading-[1.05] text-white mb-6">
              {term.term}
            </h1>
            <p className="term-definition text-lg xl:text-xl text-neutral-400 leading-relaxed font-medium">
              {term.shortDef}
            </p>
          </header>

          {/* Full definition */}
          <article className="mb-16">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6">
              Подробное объяснение
            </h2>
            <div className="term-full-def space-y-6">
              {term.fullDef.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-neutral-300 leading-[1.8] text-[17px]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          {/* Expert Verification */}
          <ExpertVerification expertName="Анна Туманян" date="Март 2026" />

          {/* FAQ */}
          <section className="mt-16" aria-label={`Частые вопросы по теме ${term.term}`}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                <HelpCircle size={16} className="text-primary" />
              </div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                Частые вопросы
              </h2>
            </div>
            <div className="space-y-4">
              {term.faq.map((item, i) => (
                <details
                  key={i}
                  className="group p-6 rounded-[24px] bg-neutral-900/30 border border-white/5 hover:border-primary/15 transition-colors"
                >
                  <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                    <span className="font-bold text-white text-base leading-snug">
                      {item.q}
                    </span>
                    <ChevronDown
                      size={16}
                      className="text-neutral-500 shrink-0 mt-1 group-open:rotate-180 transition-transform"
                    />
                  </summary>
                  <p className="mt-4 text-neutral-400 leading-relaxed text-sm">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="mt-16 p-10 xl:p-14 rounded-[40px] bg-neutral-900/40 border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                  Нужна помощь с {term.term}?
                </p>
                <h3 className="text-2xl xl:text-3xl font-bold tracking-tightest text-white">
                  Разберём вашу ситуацию.
                </h3>
                <p className="text-neutral-400 text-sm max-w-md">
                  Эксперт ЭлитФинанс применит нормы по {term.term} к вашему
                  конкретному случаю и подготовит план действий.
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

          {/* Related Terms */}
          {relatedTerms.length > 0 && (
            <section className="mt-20">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400 mb-10">
                Похожие термины
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedTerms.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/handbook/${t.slug}`}
                    className="group p-6 rounded-[32px] bg-neutral-900/30 border border-white/5 hover:bg-neutral-900/50 hover:border-primary/20 transition-all flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                          categoryColors[t.category] ||
                          "text-neutral-400 bg-neutral-800/50 border-white/10"
                        }`}
                      >
                        {t.category}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors mb-2">
                        {t.term}
                      </h3>
                      <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
                        {t.shortDef}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-widest mt-auto">
                      Читать{" "}
                      <ArrowRight
                        size={12}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
