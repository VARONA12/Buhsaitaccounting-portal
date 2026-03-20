import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ExpertVerification } from "@/components/ExpertVerification";
import { Logo } from "@/components/Logo";
import { ChevronRight, Calendar, User, Clock, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await db.article.findUnique({
    where: { id, published: true },
  });
  if (!article) return { title: "Статья не найдена | ЭлитФинанс" };

  const description =
    article.excerpt ?? article.content.substring(0, 160) + "...";
  const url = `https://elitfinans.online/articles/${id}`;

  return {
    title: `${article.title} | ЭлитФинанс`,
    description,
    authors: [{ name: article.author }],
    keywords: ["бухгалтерия", "налоги", "ООО", "ИП", article.title],
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description,
      url,
      siteName: "ЭлитФинанс",
      locale: "ru_RU",
      type: "article",
      publishedTime: article.createdAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: [article.author],
      ...(article.image ? { images: [{ url: article.image, width: 1200, height: 630, alt: article.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;

  const [article, related] = await Promise.all([
    db.article.findUnique({ where: { id, published: true } }),
    db.article.findMany({
      where: { published: true, NOT: { id } },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  if (!article) notFound();

  const url = `https://elitfinans.online/articles/${id}`;
  const description = article.excerpt ?? article.content.substring(0, 160) + "...";
  const readingTime = Math.max(1, Math.ceil(article.content.split(" ").length / 200));
  const formattedDate = new Date(article.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const expertName =
    article.author === "Администратор" ? "Анна Туманян" : article.author;
  const expertDate = new Date(article.updatedAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        "headline": article.title,
        "description": description,
        "articleBody": article.content,
        "datePublished": article.createdAt.toISOString(),
        "dateModified": article.updatedAt.toISOString(),
        "inLanguage": "ru",
        "isAccessibleForFree": true,
        "audience": {
          "@type": "Audience",
          "audienceType": "Предприниматели, владельцы ООО и ИП",
        },
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": [".article-description", ".article-body"],
        },
        "author": {
          "@type": "Person",
          "@id": "https://elitfinans.online#expert",
          "name": expertName,
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
          "@id": "https://elitfinans.online/articles",
          "name": "База знаний ЭлитФинанс",
        },
        ...(article.image
          ? {
              "image": {
                "@type": "ImageObject",
                "url": article.image,
                "description": article.title,
              },
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://elitfinans.online" },
          { "@type": "ListItem", "position": 2, "name": "Статьи", "item": "https://elitfinans.online/articles" },
          { "@type": "ListItem", "position": 3, "name": article.title, "item": url },
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
              href="/articles"
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} /> Все статьи
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
              <li><Link href="/articles" className="hover:text-primary transition-colors">Статьи</Link></li>
              <li><ChevronRight size={10} /></li>
              <li className="text-neutral-400 truncate max-w-[200px]">{article.title}</li>
            </ol>
          </nav>

          {/* Article Header */}
          <header className="mb-12 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                База знаний ЭлитФинанс
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tightest leading-[1.05] text-white">
              {article.title}
            </h1>

            {(article.excerpt) && (
              <p className="article-description text-lg xl:text-xl text-neutral-400 leading-relaxed font-medium max-w-3xl">
                {article.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-white/5">
              <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                <Calendar size={13} className="text-primary" />
                {formattedDate}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                <User size={13} className="text-primary" />
                {expertName}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                <Clock size={13} className="text-primary" />
                {readingTime} мин чтения
              </div>
            </div>
          </header>

          {/* Hero Image */}
          {article.image && (
            <div className="mb-12 aspect-video rounded-[40px] overflow-hidden bg-neutral-900">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Body */}
          <article className="mb-16">
            <div
              className="article-body prose prose-invert max-w-none text-neutral-300 leading-[1.8] text-[17px] whitespace-pre-wrap"
            >
              {article.content}
            </div>
          </article>

          {/* Expert Verification */}
          <ExpertVerification expertName={expertName} date={expertDate} />

          {/* CTA */}
          <div className="mt-16 p-10 xl:p-14 rounded-[40px] bg-neutral-900/40 border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Нужна консультация?</p>
                <h3 className="text-2xl xl:text-3xl font-bold tracking-tightest text-white">
                  Применим это на практике.
                </h3>
                <p className="text-neutral-400 text-sm max-w-md">
                  Эксперты ЭлитФинанс разберут вашу ситуацию и предложат оптимальное решение.
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

          {/* Related Articles */}
          {related.length > 0 && (
            <section className="mt-20">
              <div className="flex items-center gap-4 mb-10">
                <BookOpen size={18} className="text-primary" />
                <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400">
                  Читайте также
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/articles/${rel.id}`}
                    className="group p-6 rounded-[32px] bg-neutral-900/30 border border-white/5 hover:bg-neutral-900/50 hover:border-primary/20 transition-all flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-2 text-[9px] font-bold text-neutral-600 uppercase tracking-widest">
                      <Calendar size={10} />
                      {new Date(rel.createdAt).toLocaleDateString("ru-RU")}
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors leading-snug line-clamp-3">
                      {rel.title}
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
