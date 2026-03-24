import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { FAQ_ITEMS } from "@/lib/faq-data";
import { HANDBOOK_TERMS } from "@/lib/handbook-data";
import { SERVICES } from "@/lib/services-data";
import { ExpertVerification } from "@/components/ExpertVerification";
import { Logo } from "@/components/Logo";
import { ContactButton } from "@/components/ContactButton";
import {
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  BookOpen,
  Tag,
  Zap
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
  Аутсорсинг: "text-white bg-blue-400/10 border-blue-400/20",
  "Налоговые режимы": "text-white bg-primary/10 border-primary/40",
  Проверки: "text-white bg-red-400/10 border-red-400/20",
  "Блокировка счёта": "text-white bg-orange-400/10 border-orange-400/20",
  "ИП и ООО": "text-white bg-green-400/10 border-green-400/20",
  "Налоги и взносы": "text-white bg-purple-400/10 border-purple-400/20",
};

export default async function FaqDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = FAQ_ITEMS.find((f) => f.slug === slug);
  if (!item) notFound();

  const url = `https://elitfinans.online/faq/${slug}`;

  const relatedTermObjs = HANDBOOK_TERMS.filter((t) => item.relatedTerms.includes(t.slug));
  const relatedServiceObjs = SERVICES.filter((s) => item.relatedServices.includes(s.slug));

  const relatedFaq = FAQ_ITEMS.filter(
    (f) => f.slug !== slug && f.category === item.category
  ).slice(0, 3);

  const qaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "QAPage",
        "@id": `${url}#qapage`,
        "name": item.question,
        "url": url,
        "inLanguage": "ru",
        "mainEntity": {
          "@type": "Question",
          "@id": `${url}#question`,
          "name": item.question,
          "text": item.shortAnswer,
          "answerCount": 1,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.fullAnswer.join(" "),
            "upvoteCount": 15,
            "author": {
              "@type": "Organization",
              "@id": "https://elitfinans.online#org",
              "name": "ЭлитФинанс"
            }
          }
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://elitfinans.online" },
          { "@type": "ListItem", "position": 2, "name": "Вопросы и ответы", "item": "https://elitfinans.online/faq" },
          { "@type": "ListItem", "position": 3, "name": item.question, "item": url }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans selection:bg-primary-dark/80 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(qaJsonLd) }}
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
            <Link href="/faq" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:text-white transition-colors">
              <ArrowLeft size={14} /> Все вопросы
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-40 px-6 md:pt-40">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white flex-wrap">
              <li><Link href="/" className="hover:text-white transition-colors">Главная</Link></li>
              <li><ChevronRight size={10} /></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><ChevronRight size={10} /></li>
              <li className="text-white truncate max-w-[200px]">{item.category}</li>
            </ol>
          </nav>

          {/* Category */}
          <div className="mb-8">
            <span className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${categoryColors[item.category] || "text-white bg-white/5 border-white/20"}`}>
              <Tag size={10} /> {item.category}
            </span>
          </div>

          {/* Question */}
          <header className="mb-12 space-y-8">
            <div className="flex items-center gap-3 text-white font-bold uppercase text-[10px] tracking-[0.4em]">
              <HelpCircle size={16} /> ЧАСТЫЙ ВОПРОС / 2026
            </div>
            <h1 className="text-4xl md:text-5xl xl:text-7xl font-black tracking-tightest leading-[1.05] text-white uppercase">
              {item.question}
            </h1>
          </header>

          {/* Short answer - Premium block */}
          <div className="faq-short-answer mb-16 p-10 rounded-[56px] border border-white/12 bg-neutral-900 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5"><Logo size={100} /></div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white mb-5">КРАТКИЙ ЭКСПЕРТНЫЙ ОТВЕТ</p>
            <p className="text-2xl text-white font-medium leading-relaxed  relative z-10">{item.shortAnswer}</p>
          </div>

          {/* Full answer */}
          <article className="faq-full-answer mb-24 space-y-10">
            <div className="flex items-center gap-3 text-white font-bold uppercase text-[10px] tracking-[0.4em] border-b border-white/12 pb-4">
               ПОШАГОВЫЙ РАЗБОР
            </div>
            <div className="space-y-8">
              {item.fullAnswer.map((para, i) => (
                <p key={i} className="text-white leading-[1.8] text-[19px] font-medium ">{para}</p>
              ))}
            </div>
          </article>

          {/* Expert Verification */}
          <ExpertVerification expertName="Эксперт ЭлитФинанс" date="Март 2026" />

          {/* Related items grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-24">
            {/* Related terms */}
            {relatedTermObjs.length > 0 && (
              <section className="space-y-8">
                <div className="flex items-center gap-3 text-white font-bold uppercase text-[10px] tracking-[0.4em]">
                  <BookOpen size={16} /> СВЯЗАННЫЕ ТЕРМИНЫ
                </div>
                <div className="space-y-4">
                  {relatedTermObjs.map((t) => (
                    <Link key={t.slug} href={`/handbook/${t.slug}`} className="group p-8 rounded-[40px] border border-white/12 bg-neutral-900 hover:bg-neutral-900 hover:border-primary/40 transition-all flex flex-col gap-4 shadow-lg">
                      <h3 className="font-black text-white group-hover:text-white transition-colors text-lg uppercase tracking-tight">{t.term}</h3>
                      <p className="text-xs text-white leading-relaxed font-medium line-clamp-2">{t.shortDef}</p>
                      <span className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest mt-auto">
                        В СПРАВОЧНИК <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Related services */}
            {relatedServiceObjs.length > 0 && (
              <section className="space-y-8">
                <div className="flex items-center gap-3 text-white font-bold uppercase text-[10px] tracking-[0.4em]">
                  <Zap size={16} /> ПОДХОДЯЩИЕ УСЛУГИ
                </div>
                <div className="space-y-4">
                  {relatedServiceObjs.map((s) => (
                    <Link key={s.slug} href={`/services/${s.slug}`} className="group p-8 rounded-[40px] border border-white/12 bg-neutral-900 hover:border-primary/40 transition-all flex items-center justify-between gap-6 shadow-xl">
                      <div className="space-y-2">
                        <h3 className="font-black text-white group-hover:text-white transition-colors text-lg uppercase tracking-tight">{s.title}</h3>
                        <p className="text-sm text-white font-black uppercase tracking-tight">{s.price}</p>
                      </div>
                      <ArrowRight size={20} className="text-white group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* CTA - Premium Dark High Contrast */}
          <div className="mt-24 p-12 md:p-20 rounded-[80px] bg-neutral-900 border border-white/12 relative overflow-hidden group hover:bg-white/[0.05] transition-all duration-700 shadow-2xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12 text-left">
              <div className="space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-white">ОСТАЛСЯ ВОПРОС?</p>
                <h3 className="text-3xl md:text-5xl font-black tracking-tightest text-white uppercase leading-none">РАЗБЕРЁМ ВАШУ <br /> СИТУАЦИЮ</h3>
                <p className="text-white text-lg md:text-xl max-w-md font-medium leading-relaxed ">Задайте вопрос напрямую эксперту — первичная консультация бесплатна и ни к чему вас не обязывает.</p>
              </div>
              <ContactButton label="ЗАДАТЬ ВОПРОС" />
            </div>
          </div>

          {/* Related FAQ list */}
          {relatedFaq.length > 0 && (
            <section className="mt-40">
              <div className="flex items-center gap-4 mb-16 border-b border-white/12 pb-6">
                <HelpCircle size={18} className="text-white" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">ПОХОЖИЕ ВОПРОСЫ</h2>
              </div>
              <div className="space-y-6">
                {relatedFaq.map((f) => (
                  <Link key={f.slug} href={`/faq/${f.slug}`} className="group flex items-start justify-between gap-8 p-8 rounded-[40px] border border-white/12 bg-white/[0.03] hover:bg-neutral-900 hover:border-primary/40 transition-all shadow-lg">
                    <div className="space-y-3">
                      <h3 className="font-black text-white group-hover:text-white transition-all text-xl md:text-2xl leading-tight uppercase tracking-tight">{f.question}</h3>
                      <p className="text-sm text-white line-clamp-1 font-medium">{f.shortAnswer}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-white/12 flex items-center justify-center shrink-0 text-white group-hover:text-white group-hover:border-primary/40 transition-all">
                       <ArrowRight size={20} />
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
