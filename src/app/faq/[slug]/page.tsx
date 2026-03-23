import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { FAQ_ITEMS } from "@/lib/faq-data";
import { HANDBOOK_TERMS } from "@/lib/handbook-data";
import { SERVICES } from "@/lib/services-data";
import { ExpertVerification } from "@/components/ExpertVerification";
import { Logo } from "@/components/Logo";
import {
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  BookOpen,
  Tag,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return FAQ_ITEMS.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = FAQ_ITEMS.find((f) => f.slug === slug);
  if (!item) return { title: "Вопрос не найден | ЭлитФинанс" };

  const url = `https://elitfinans.online/faq/${slug}`;
  return {
    title: `${item.question} | ЭлитФинанс`,
    description: item.shortAnswer,
    keywords: item.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: item.question,
      description: item.shortAnswer,
      url,
      siteName: "ЭлитФинанс",
      locale: "ru_RU",
      type: "article",
    },
    twitter: { card: "summary_large_image", title: item.question, description: item.shortAnswer },
    robots: { index: true, follow: true, "max-snippet": -1 },
  };
}

const categoryColors: Record<string, string> = {
  Аутсорсинг: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  "Налоговые режимы": "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  Проверки: "text-red-400 bg-red-400/10 border-red-400/20",
  "Блокировка счёта": "text-orange-400 bg-orange-400/10 border-orange-400/20",
  "ИП и ООО": "text-green-400 bg-green-400/10 border-green-400/20",
  "Налоги и взносы": "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

export default async function FaqDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = FAQ_ITEMS.find((f) => f.slug === slug);
  if (!item) notFound();

  const url = `https://elitfinans.online/faq/${slug}`;

  const relatedTermObjs = HANDBOOK_TERMS.filter((t) => item.relatedTerms.includes(t.slug));
  const relatedServiceObjs = SERVICES.filter((s) => item.relatedServices.includes(s.slug));

  // Related FAQ in same category
  const relatedFaq = FAQ_ITEMS.filter(
    (f) => f.slug !== slug && f.category === item.category
  ).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            "@id": `${url}#question`,
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.fullAnswer.join(" "),
              author: {
                "@type": "Person",
                "@id": "https://elitfinans.online#expert",
                name: "Анна Туманян",
              },
            },
          },
        ],
      },
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: item.question,
        description: item.shortAnswer,
        articleBody: item.fullAnswer.join(" "),
        inLanguage: "ru",
        isAccessibleForFree: true,
        keywords: item.keywords.join(", "),
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".faq-short-answer", ".faq-full-answer"],
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
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        isPartOf: {
          "@type": "FAQPage",
          "@id": "https://elitfinans.online/faq#faqpage",
        },
      },
      ...(item.question.startsWith("Как") ? [{
        "@type": "HowTo",
        "@id": `${url}#howto`,
        name: item.question,
        description: item.shortAnswer,
        inLanguage: "ru",
        author: {
          "@type": "Person",
          "@id": "https://elitfinans.online#expert",
          name: "Анна Туманян",
        },
        step: item.fullAnswer.map((text, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          text,
        })),
      }] : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: "https://elitfinans.online" },
          { "@type": "ListItem", position: 2, name: "Вопросы и ответы", item: "https://elitfinans.online/faq" },
          { "@type": "ListItem", position: 3, name: item.question, item: url },
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
            <Link href="/faq" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors">
              <ArrowLeft size={14} /> Все вопросы
            </Link>
            <Link href="/" className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors">На главную</Link>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-24 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-600 flex-wrap">
              <li><Link href="/" className="hover:text-primary transition-colors">Главная</Link></li>
              <li><ChevronRight size={10} /></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">Вопросы и ответы</Link></li>
              <li><ChevronRight size={10} /></li>
              <li className="text-neutral-400 truncate max-w-[200px]">{item.category}</li>
            </ol>
          </nav>

          {/* Category */}
          <div className="mb-6">
            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${categoryColors[item.category] || "text-neutral-400 bg-neutral-800/50 border-white/10"}`}>
              <Tag size={9} /> {item.category}
            </span>
          </div>

          {/* Question */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                <HelpCircle size={16} className="text-primary" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Вопрос</span>
            </div>
            <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold tracking-tightest leading-[1.1] text-white">
              {item.question}
            </h1>
          </header>

          {/* Short answer */}
          <div className="faq-short-answer mb-10 p-7 rounded-[28px] bg-primary/5 border border-primary/20">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-3">Краткий ответ</p>
            <p className="text-lg text-white font-medium leading-relaxed">{item.shortAnswer}</p>
          </div>

          {/* Full answer */}
          <article className="faq-full-answer mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6">Подробный ответ</p>
            <div className="space-y-5">
              {item.fullAnswer.map((para, i) => (
                <p key={i} className="text-neutral-300 leading-[1.8] text-[17px]">{para}</p>
              ))}
            </div>
          </article>

          {/* Expert Verification */}
          <ExpertVerification expertName="Анна Туманян" date="Март 2026" />

          {/* Related terms */}
          {relatedTermObjs.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                  <BookOpen size={16} className="text-primary" />
                </div>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Связанные термины</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedTermObjs.map((t) => (
                  <Link key={t.slug} href={`/handbook/${t.slug}`} className="group p-5 rounded-[20px] bg-neutral-900/30 border border-white/5 hover:border-primary/20 transition-all flex flex-col gap-2">
                    <h3 className="font-bold text-white group-hover:text-primary transition-colors text-sm">{t.term}</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">{t.shortDef}</p>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-widest mt-1">
                      В справочник <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related services */}
          {relatedServiceObjs.length > 0 && (
            <section className="mt-12">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-6">Подходящие услуги</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedServiceObjs.map((s) => (
                  <Link key={s.slug} href={`/services/${s.slug}`} className="group p-5 rounded-[20px] bg-neutral-900/30 border border-white/5 hover:border-primary/20 transition-all flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-white group-hover:text-primary transition-colors text-sm">{s.title}</h3>
                      <p className="text-xs text-primary mt-0.5">{s.price}</p>
                    </div>
                    <ArrowRight size={14} className="text-neutral-600 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <div className="mt-16 p-10 rounded-[40px] bg-neutral-900/40 border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Остался вопрос?</p>
                <h3 className="text-2xl font-bold tracking-tightest text-white">Разберём вашу ситуацию</h3>
                <p className="text-neutral-400 text-sm max-w-md">Задайте вопрос напрямую эксперту ЭлитФинанс — первичная консультация бесплатна.</p>
              </div>
              <Link href="/#contact" className="shrink-0 px-8 py-4 bg-primary text-black font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-white transition-all flex items-center gap-3 group">
                Задать вопрос <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Related FAQ */}
          {relatedFaq.length > 0 && (
            <section className="mt-20">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400 mb-8">Похожие вопросы</h2>
              <div className="space-y-4">
                {relatedFaq.map((f) => (
                  <Link key={f.slug} href={`/faq/${f.slug}`} className="group flex items-start justify-between gap-4 p-6 rounded-[24px] bg-neutral-900/30 border border-white/5 hover:border-primary/20 transition-all">
                    <div>
                      <h3 className="font-bold text-white group-hover:text-primary transition-colors text-sm leading-snug mb-2">{f.question}</h3>
                      <p className="text-xs text-neutral-500 line-clamp-1">{f.shortAnswer}</p>
                    </div>
                    <ArrowRight size={14} className="text-neutral-600 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-0.5" />
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
