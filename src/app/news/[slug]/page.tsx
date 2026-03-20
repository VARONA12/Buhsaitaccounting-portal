import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ALL_NEWS } from "@/lib/news-data";
import { ExpertVerification } from "@/components/ExpertVerification";
import { Logo } from "@/components/Logo";
import {
  ChevronRight,
  Clock,
  ArrowLeft,
  ArrowRight,
  Tag,
  Calendar,
  Zap,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return ALL_NEWS.map((news) => ({ slug: news.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const news = ALL_NEWS.find((n) => n.slug === slug);
  if (!news) return { title: "Новость не найдена | ЭлитФинанс" };

  const url = `https://elitfinans.online/news/${slug}`;

  return {
    title: `${news.title} | ЭлитФинанс`,
    description: news.desc,
    keywords: news.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: news.title,
      description: news.desc,
      url,
      siteName: "ЭлитФинанс",
      locale: "ru_RU",
      type: "article",
      publishedTime: news.isoDate,
      section: news.category,
    },
    twitter: {
      card: "summary_large_image",
      title: news.title,
      description: news.desc,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const news = ALL_NEWS.find((n) => n.slug === slug);
  if (!news) notFound();

  const url = `https://elitfinans.online/news/${slug}`;
  const related = ALL_NEWS.filter((n) => n.slug !== slug && n.category === news.category).slice(0, 3);
  const otherRelated = ALL_NEWS.filter((n) => n.slug !== slug).slice(0, 3 - related.length);
  const relatedNews = [...related, ...otherRelated].slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsArticle",
        "@id": `${url}#article`,
        "headline": news.title,
        "description": news.desc,
        "articleBody": news.fullContent,
        "datePublished": news.isoDate,
        "dateModified": news.isoDate,
        "articleSection": news.category,
        "keywords": news.keywords.join(", "),
        "inLanguage": "ru",
        "isAccessibleForFree": true,
        "audience": {
          "@type": "Audience",
          "audienceType": "Предприниматели, владельцы ООО и ИП",
        },
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": [".news-summary", ".news-body"],
        },
        "author": {
          "@type": "Person",
          "@id": "https://elitfinans.online#expert",
          "name": "Анна Туманян",
          "jobTitle": "Налоговый консультант и главный бухгалтер",
          "worksFor": { "@id": "https://elitfinans.online#org" },
        },
        "publisher": {
          "@type": "Organization",
          "@id": "https://elitfinans.online#org",
          "name": "ЭлитФинанс",
          "url": "https://elitfinans.online",
          "logo": {
            "@type": "ImageObject",
            "url": "https://elitfinans.online/favicon.ico",
          },
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": url,
        },
        "isPartOf": {
          "@type": "Blog",
          "@id": "https://elitfinans.online/news",
          "name": "Новости ЭлитФинанс",
        },
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://elitfinans.online" },
          { "@type": "ListItem", "position": 2, "name": "Новости", "item": "https://elitfinans.online/news" },
          { "@type": "ListItem", "position": 3, "name": news.title, "item": url },
        ],
      },
      {
        "@type": "Organization",
        "@id": "https://elitfinans.online#org",
        "name": "ЭлитФинанс",
        "url": "https://elitfinans.online",
        "telephone": "+79028371370",
        "email": "info@elitfinance.ru",
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
            <Link
              href="/news"
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} /> Все новости
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
              <li><Link href="/" className="hover:text-primary transition-colors">Главная</Link></li>
              <li><ChevronRight size={10} /></li>
              <li><Link href="/news" className="hover:text-primary transition-colors">Новости</Link></li>
              <li><ChevronRight size={10} /></li>
              <li className="text-neutral-400 truncate max-w-[200px]">{news.title}</li>
            </ol>
          </nav>

          {/* Category + Date */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold uppercase tracking-widest">
              <Tag size={10} /> {news.category}
            </span>
            <span className="flex items-center gap-2 text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
              <Calendar size={12} /> {news.date}
            </span>
            <span className="flex items-center gap-2 text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
              <Clock size={12} /> {news.time} чтения
            </span>
          </div>

          {/* Headline */}
          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tightest leading-[1.05] text-white mb-6">
              {news.title}
            </h1>
            <p className="news-summary text-lg xl:text-xl text-neutral-400 leading-relaxed font-medium">
              {news.desc}
            </p>
          </header>

          {/* Breaking indicator */}
          <div className="mb-10 p-6 rounded-[28px] bg-primary/5 border border-primary/15 flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
              <Zap size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-1">
                Экспертный разбор
              </p>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Материал подготовлен аналитиками ЭлитФинанс на основании официальных источников: НК РФ, писем ФНС и Минфина.
              </p>
            </div>
          </div>

          {/* Article Body */}
          <article className="mb-16">
            <div className="news-body text-neutral-300 leading-[1.8] text-[17px] whitespace-pre-wrap space-y-6">
              {news.fullContent}
            </div>
          </article>

          {/* Expert Verification */}
          <ExpertVerification expertName="Анна Туманян" date={news.date === "Сегодня" || news.date === "Вчера" ? "Март 2026" : news.date} />

          {/* CTA */}
          <div className="mt-16 p-10 xl:p-14 rounded-[40px] bg-neutral-900/40 border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Остались вопросы?</p>
                <h3 className="text-2xl xl:text-3xl font-bold tracking-tightest text-white">
                  Разберёмся вместе.
                </h3>
                <p className="text-neutral-400 text-sm max-w-md">
                  Получите персональную консультацию от эксперта ЭлитФинанс по данной теме.
                </p>
              </div>
              <Link
                href="/#services"
                className="shrink-0 px-8 py-4 bg-primary text-black font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-white transition-all flex items-center gap-3 group"
              >
                Наши услуги <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Related News */}
          {relatedNews.length > 0 && (
            <section className="mt-20">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400 mb-10">
                Похожие новости
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedNews.map((item) => (
                  <Link
                    key={item.id}
                    href={`/news/${item.slug}`}
                    className="group p-6 rounded-[32px] bg-neutral-900/30 border border-white/5 hover:bg-neutral-900/50 hover:border-primary/20 transition-all flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-primary uppercase tracking-widest">{item.category}</span>
                      <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">{item.date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors leading-snug line-clamp-3">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-widest mt-auto">
                      Читать <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
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
