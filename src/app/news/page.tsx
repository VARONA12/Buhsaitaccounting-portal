import { Clock, ChevronRight, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ALL_NEWS } from "@/lib/news-data";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

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
    date: new Date(item.publishedAt).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsJsonLd) }}
      />
      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full z-[100] border-b border-white/12 bg-neutral-900/70 backdrop-blur-3xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 xl:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="flex items-center justify-center transition-all group-hover:scale-110">
              <Logo size={40} />
            </div>
            <span className="font-bold text-lg xl:text-xl tracking-tighter uppercase text-white leading-none">ЭлитФинанс</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-[10px] font-black uppercase tracking-[0.4em] text-white hover:text-white transition-colors"
            >
              На главную
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-32 px-6 md:pt-40">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-20 space-y-6 text-center">
            <div className="flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.5em] text-white">
              <Globe size={14} className="animate-spin-slow" />
              GLOBAL NEWS FEED 2026
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tightest leading-[1.05] text-white uppercase">
              ПУЛЬС <br /> ЭКОНОМИКИ И <span className="text-white ">ПРАВА.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white font-medium max-w-2xl mx-auto leading-relaxed">
               Оперативный анализ изменений в законодательстве с экспертной оценкой рисков.
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
                      Inside Analysis
                    </div>
                    <div className="flex items-center gap-2 pt-0.5">
                      <Clock size={14} className="text-white" />
                      {news.date}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-6 group-hover:text-white transition-colors leading-tight uppercase tracking-tight">
                    {news.title}
                  </h3>
                  <p className="text-sm md:text-base text-white line-clamp-4 leading-relaxed mb-10 flex-1 font-medium">
                    {news.desc}
                  </p>
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
                 Все новости модерируются экспертами ЭлитФинанс. Мы отбираем только критические изменения для бизнеса наших клиентов.
               </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
