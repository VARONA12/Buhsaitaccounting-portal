import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ALL_NEWS } from "@/lib/news-data";
import { db } from "@/lib/db";
import { ExpertVerification } from "@/components/ExpertVerification";
import { Logo } from "@/components/Logo";
import { AeoNav } from "@/components/AeoNav";
import { ContactButton } from "@/components/ContactButton";
import {
  ChevronRight,
  Clock,
  ArrowLeft,
  ArrowRight,
  Tag,
  Calendar,
  Zap,
} from "lucide-react";

export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return ALL_NEWS.map((news) => ({ slug: news.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Check static news first
  const staticNews = ALL_NEWS.find((n) => n.slug === slug);
  if (staticNews) {
    const url = `https://elitfinans.online/news/${slug}`;
    return {
      title: `${staticNews.title} | ЭлитФинанс`,
      description: staticNews.desc,
      keywords: staticNews.keywords,
      alternates: { canonical: url },
      openGraph: {
        title: staticNews.title,
        description: staticNews.desc,
        url,
        siteName: "ЭлитФинанс",
        locale: "ru_RU",
        type: "article",
        publishedTime: staticNews.isoDate,
        section: staticNews.category,
        images: [{ url: "https://elitfinans.online/director_hq.png", width: 1200, height: 630 }],
      },
      twitter: { 
        card: "summary_large_image", 
        title: staticNews.title, 
        description: staticNews.desc,
        images: ["https://elitfinans.online/director_hq.png"]
      },
      robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    };
  }

  // Try DB news by ID
  try {
    const item = await db.newsItem.findUnique({ where: { id: slug } });
    if (item) {
      const url = `https://elitfinans.online/news/${slug}`;
      return {
        title: `${item.title} | ЭлитФинанс`,
        description: item.excerpt ?? item.title,
        alternates: { canonical: url },
        openGraph: {
          title: item.title,
          description: item.excerpt ?? item.title,
          url,
          siteName: "ЭлитФинанс",
          locale: "ru_RU",
          type: "article",
          publishedTime: item.publishedAt.toISOString(),
          section: item.category ?? "Налоги",
          images: [{ url: "https://elitfinans.online/director_hq.png", width: 1200, height: 630 }],
        },
        twitter: { 
          card: "summary_large_image", 
          title: item.title, 
          description: item.excerpt ?? item.title,
          images: ["https://elitfinans.online/director_hq.png"]
        },
        robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
      };
    }
  } catch {}

  return { title: "Новость не найдена | ЭлитФинанс" };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;

  // ── Static news ────────────────────────────────────────────────────────────
  const staticNews = ALL_NEWS.find((n) => n.slug === slug);
  if (staticNews) {
    const url = `https://elitfinans.online/news/${slug}`;
    const related = ALL_NEWS.filter((n) => n.slug !== slug && n.category === staticNews.category).slice(0, 3);
    const otherRelated = ALL_NEWS.filter((n) => n.slug !== slug).slice(0, 3 - related.length);
    const relatedNews = [...related, ...otherRelated].slice(0, 3);

    return <NewsLayout
      title={staticNews.title}
      category={staticNews.category}
      date={staticNews.date}
      readTime={staticNews.time}
      desc={staticNews.desc}
      url={url}
      relatedNews={relatedNews.map((r) => ({ slug: r.slug, title: r.title, category: r.category, date: r.date }))}
    >
      <div className="news-body prose prose-invert max-w-none text-white prose-headings:text-white prose-a:text-white hover:prose-a:underline prose-p:leading-[1.8] prose-p:text-[19px] prose-p:italic prose-p:font-medium prose-li:text-[18px] prose-strong:text-white">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{staticNews.fullContent}</ReactMarkdown>
      </div>
    </NewsLayout>;
  }

  // ── DB news ────────────────────────────────────────────────────────────────
  let dbItem = null;
  try {
    dbItem = await db.newsItem.findUnique({ where: { id: slug } });
  } catch {}

  if (!dbItem) notFound();

  const url = `https://elitfinans.online/news/${slug}`;
  const date = new Date(dbItem.publishedAt).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const wordCount = dbItem.content.split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} мин`;

  // Related: other recent DB news in same category
  let relatedDb: { id: string; title: string; category: string | null; publishedAt: Date }[] = [];
  try {
    relatedDb = await db.newsItem.findMany({
      where: { published: true, category: dbItem.category, id: { not: slug } },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { id: true, title: true, category: true, publishedAt: true },
    });
  } catch {}

  // Clean emoji from title for display
  const cleanTitle = dbItem.title.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2702}-\u{27B0}\u{24C2}-\u{1F251}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{FE00}-\u{FE0F}\u{200D}\u{2B50}-\u{2B55}\u{203C}-\u{3299}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/gu, '').trim();

  return <NewsLayout
    title={cleanTitle}
    category={dbItem.category ?? "Налоги"}
    date={date}
    readTime={readTime}
    desc={dbItem.excerpt ?? dbItem.title}
    url={url}
    sourceUrl={dbItem.sourceUrl ?? undefined}
    sourceName={dbItem.source}
    relatedNews={relatedDb.map((r) => ({
      slug: r.id,
      title: r.title.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2702}-\u{27B0}\u{24C2}-\u{1F251}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{FE00}-\u{FE0F}\u{200D}\u{2B50}-\u{2B55}\u{203C}-\u{3299}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/gu, '').trim(),
      category: r.category ?? "Налоги",
      date: new Date(r.publishedAt).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    }))}
  >
    <div className="news-body prose prose-invert max-w-none text-white prose-headings:text-white prose-a:text-white hover:prose-a:underline prose-p:leading-[1.8] prose-p:text-[19px] prose-p:font-medium prose-li:text-[18px] prose-strong:text-white">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{dbItem.content}</ReactMarkdown>
      {dbItem.sourceUrl && (
        <p className="text-sm text-white/60 pt-4 border-t border-white/10">
          Источник:{" "}
          <a href={dbItem.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">
            {dbItem.source}
          </a>
        </p>
      )}
    </div>
  </NewsLayout>;
}

// ── Shared layout component ────────────────────────────────────────────────────
function NewsLayout({
  title,
  category,
  date,
  readTime,
  desc,
  url,
  sourceUrl,
  sourceName,
  relatedNews,
  children,
}: {
  title: string;
  category: string;
  date: string;
  readTime: string;
  desc: string;
  url: string;
  sourceUrl?: string;
  sourceName?: string;
  relatedNews: { slug: string; title: string; category: string; date: string }[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans selection:bg-primary-dark/80 selection:text-white">
      <AeoNav />

      <main className="pt-28 pb-40 px-6 md:pt-40">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white flex-wrap">
              <li><Link href="/" className="hover:text-white transition-colors">Главная</Link></li>
              <li><ChevronRight size={10} /></li>
              <li><Link href="/news" className="hover:text-white transition-colors">Новости</Link></li>
              <li><ChevronRight size={10} /></li>
              <li className="text-white truncate max-w-[200px]">{title}</li>
            </ol>
          </nav>

          {/* Category + Date */}
          <div className="flex flex-wrap items-center gap-6 mb-10 pt-4 border-t border-white/12">
            <span className="flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/40 text-white text-[9px] font-bold uppercase tracking-[0.2em]">
              <Tag size={12} /> {category}
            </span>
            <span className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest font-medium">
              <Calendar size={14} className="text-white" /> {date}
            </span>
            <span className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest font-medium">
              <Clock size={14} className="text-white" /> {readTime} чтения
            </span>
          </div>

          {/* Headline */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-6xl xl:text-7xl font-black tracking-tightest leading-[1.05] text-white">
              {title}
            </h1>
          </header>

          {/* Body */}
          <article className="mb-24">{children}</article>

          {/* CTA */}
          <div className="mt-24 p-12 md:p-20 rounded-[80px] bg-neutral-900 border border-white/12 relative overflow-hidden group hover:bg-white/[0.05] transition-all shadow-2xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
              <div className="space-y-4 text-left">
                <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-white">ОСТАЛИСЬ ВОПРОСЫ?</p>
                <h3 className="text-3xl md:text-5xl font-black tracking-tightest text-white uppercase leading-none">
                  РАЗБЕРЁМСЯ <br /> ВМЕСТЕ.
                </h3>
                <p className="text-white text-lg md:text-xl max-w-md font-medium leading-relaxed">
                  Получите персональную консультацию от эксперта ЭлитФинанс по данной теме.
                </p>
              </div>
              <ContactButton label="ЗАДАТЬ ВОПРОС" />
            </div>
          </div>

          {/* Related */}
          {relatedNews.length > 0 && (
            <section className="mt-40">
              <div className="flex items-center gap-4 mb-16">
                <Zap size={18} className="text-white" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">
                  ПОХОЖИЕ НОВОСТИ
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedNews.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/news/${item.slug}`}
                    className="group p-8 rounded-[48px] border border-white/12 bg-white/[0.03] hover:bg-neutral-900 hover:border-primary/40 transition-all flex flex-col gap-6 h-full shadow-lg"
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-white/12">
                      <span className="text-[9px] font-bold text-white uppercase tracking-[0.2em]">{item.category}</span>
                      <span className="text-[9px] font-bold text-white uppercase tracking-widest">{item.date}</span>
                    </div>
                    <h3 className="text-base font-black text-white group-hover:text-white transition-colors leading-tight line-clamp-3 tracking-tight">
                      {item.title}
                    </h3>
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
    </div>
  );
}
