import { Clock, ChevronRight, Zap, Globe } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { AeoNav } from "@/components/AeoNav";
import { Footer } from "@/components/Footer";
import { ALL_NEWS } from "@/lib/news-data";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Новости бухгалтерии и налогов 2026 | ЭлитФинанс",
  description: "Актуальные новости об изменениях в налоговом законодательстве России 2026: УСН, ОСНО, ЕНП, НДФЛ, страховые взносы. Ежедневный мониторинг ФНС, Минфин, Госдума — для ООО и ИП.",
  alternates: { canonical: "https://elitfinans.online/news" },
  openGraph: {
    title: "Новости налогов и бухгалтерии 2026 — ЭлитФинанс",
    description: "Оперативный анализ изменений законодательства: УСН, ЕНП, страховые взносы, проверки ФНС. Только важное для малого бизнеса.",
    url: "https://elitfinans.online/news",
    images: [{ url: "https://elitfinans.online/director_hq.png", width: 1200, height: 630 }],
  },
};

export default async function NewsPage() {
  // Fetch live news from DB
  let dbNews: {
    id: string;
    title: string;
    excerpt: string | null;
    category: string | null;
    publishedAt: Date;
  }[] = [];

  try {
    dbNews = await db.newsItem.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 60,
      select: { id: true, title: true, excerpt: true, category: true, publishedAt: true },
    });
  } catch {
    // DB unavailable — fall back to static only
  }

  // Convert DB items to unified display shape
  const fromDb = dbNews.map((item) => ({
    slug: item.id,
    title: item.title,
    category: item.category ?? "Налоги",
    date: new Date(item.publishedAt).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    isoDate: item.publishedAt.toISOString(),
    desc: item.excerpt ?? item.title,
  }));

  // Static fallback news (always include, sorted by date)
  const fromStatic = ALL_NEWS.map((n) => ({
    slug: n.slug,
    title: n.title,
    category: n.category,
    date: n.date,
    isoDate: n.isoDate,
    desc: n.desc,
  }));

  // Merge and sort newest first
  const sortedNews = [...fromDb, ...fromStatic].sort(
    (a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime()
  );

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://elitfinans.online" },
      { "@type": "ListItem", "position": 2, "name": "Новости", "item": "https://elitfinans.online/news" },
    ],
  };

  const newsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": "https://elitfinans.online/news#list",
    "name": "Новости налогообложения и права — ЭлитФинанс",
    "description": "Оперативный анализ изменений в законодательстве с экспертной оценкой рисков для бизнеса",
    "url": "https://elitfinans.online/news",
    "inLanguage": "ru",
    "numberOfItems": sortedNews.length,
    "itemListElement": sortedNews.slice(0, 30).map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "NewsArticle",
        "@id": `https://elitfinans.online/news/${item.slug}`,
        "headline": item.title,
        "description": item.desc,
        "datePublished": item.isoDate,
        "url": `https://elitfinans.online/news/${item.slug}`,
        "inLanguage": "ru",
        "articleSection": item.category,
        "author": {
          "@type": "Organization",
          "@id": "https://elitfinans.online#org",
          "name": "ЭлитФинанс"
        },
        "publisher": {
          "@type": "Organization",
          "@id": "https://elitfinans.online#org",
          "name": "ЭлитФинанс",
          "logo": {
            "@type": "ImageObject",
            "url": "https://elitfinans.online/logo.png"
          }
        }
      }
    }))
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans selection:bg-primary-dark/80 selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsJsonLd) }}
      />
      <AeoNav />

      <main className="pt-28 pb-32 px-6 md:pt-40">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-20 space-y-6 text-center">
            <div className="flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.5em] text-white">
              <Globe size={14} className="animate-spin-slow" />
              НАЛОГИ И ПРАВО 2026
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tightest leading-[1.05] text-white uppercase">
              НОВОСТИ <br /> БУХГАЛТЕРИИ И <span className="text-white">НАЛОГОВ</span>
            </h1>
            <p className="text-xl md:text-2xl text-white font-medium max-w-2xl mx-auto leading-relaxed">
              Оперативный анализ изменений в законодательстве с экспертной оценкой рисков для бизнеса.
            </p>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {sortedNews.map((news) => (
              <Link
                key={news.slug}
                href={`/news/${news.slug}`}
                className="group p-10 rounded-[56px] border border-white/12 bg-neutral-900 hover:bg-white/[0.04] hover:border-primary/30 transition-all duration-500 flex flex-col justify-between h-full shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-6 text-[9px] font-bold text-white uppercase tracking-[0.3em] mb-10">
                    <div className="flex items-center gap-2 text-white">
                      <Zap size={14} />
                      Экспертный разбор
                    </div>
                    <div className="flex items-center gap-2 pt-0.5">
                      <Clock size={14} className="text-white" />
                      {news.date}
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-white mb-6 group-hover:text-white transition-colors leading-tight tracking-tight line-clamp-3">
                    {news.title}
                  </h3>
                  {news.desc !== news.title && (
                    <p className="text-sm text-white/70 line-clamp-3 leading-relaxed mb-10 flex-1 font-medium">
                      {news.desc}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.4em] text-white group-hover:gap-6 transition-all pt-8 border-t border-white/12">
                  ПОДРОБНЕЕ <ChevronRight size={16} />
                </div>
              </Link>
            ))}
          </div>

          {/* Footer SEO Text */}
          <div className="mt-32 p-12 rounded-[56px] border border-white/12 bg-neutral-900 text-center shadow-sm">
            <div className="max-w-xl mx-auto space-y-4">
               <p className="text-white text-[10px] font-bold leading-relaxed uppercase tracking-[0.5em]">
                 Все новости модерируются экспертами ЭлитФинанс — мы отбираем только критические изменения для бизнеса наших клиентов
               </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
