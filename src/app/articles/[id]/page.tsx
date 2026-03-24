import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExpertVerification } from "@/components/ExpertVerification";
import { Logo } from "@/components/Logo";
import { ContactButton } from "@/components/ContactButton";
import { ChevronRight, Calendar, User, Clock, ArrowLeft, ArrowRight, BookOpen, Zap } from "lucide-react";
import { VideoTranscript } from "@/components/VideoTranscript";

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

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
    article.author === "Администратор" ? "Эксперт ЭлитФинанс" : article.author;
  const expertDate = new Date(article.updatedAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans selection:bg-primary-dark/80 selection:text-white">
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
            <Link
              href="/articles"
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:text-white transition-colors"
            >
              <ArrowLeft size={14} /> Все статьи
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-40 px-6 md:pt-40">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-12">
            <ol className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white flex-wrap">
              <li><Link href="/" className="hover:text-white transition-colors">Главная</Link></li>
              <li><ChevronRight size={10} /></li>
              <li><Link href="/articles" className="hover:text-white transition-colors">Статьи</Link></li>
              <li><ChevronRight size={10} /></li>
              <li className="text-white truncate max-w-[200px]">{article.title}</li>
            </ol>
          </nav>

          {/* Article Header */}
          <header className="mb-16 space-y-10">
            <div className="flex items-center gap-3 text-white font-bold uppercase text-[10px] tracking-[0.4em]">
              <Zap size={16} className="animate-pulse" /> БАЗА ЗНАНИЙ ЭЛИТФИНАНС
            </div>

            <h1 className="text-4xl md:text-5xl xl:text-7xl font-black tracking-tightest leading-[1.05] text-white uppercase">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="article-description text-xl md:text-2xl text-white leading-relaxed font-medium max-w-3xl ">
                {article.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-white/12">
              <div className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest">
                <Calendar size={14} className="text-white" />
                {formattedDate}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest">
                <User size={14} className="text-white" />
                {expertName}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest">
                <Clock size={14} className="text-white" />
                {readingTime} мин чтения
              </div>
            </div>
          </header>

          {/* Hero Image */}
          {article.image && (
            <div className="mb-16 aspect-video rounded-[56px] overflow-hidden bg-neutral-900 border border-white/12 shadow-2xl relative">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover opacity-95 hover: hover:opacity-100 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-95" />
            </div>
          )}

          {/* Video & Transcript */}
          {((article as any).videoUrl) && (
            <VideoTranscript 
              videoUrl={(article as any).videoUrl} 
              transcript={(article as any).videoTranscript || ""} 
            />
          )}

          {/* Article Body */}
          <article className="mb-24">
            <div className="article-body prose prose-invert max-w-none text-white prose-headings:text-white prose-a:text-white hover:prose-a:underline prose-p:leading-[1.8] prose-p:text-[19px] prose-p:italic prose-p:font-medium prose-p: prose-li:text-[18px] prose-strong:text-white prose-strong:">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {article.content}
              </ReactMarkdown>
            </div>
          </article>

          {/* Expert Verification */}
          <ExpertVerification expertName={expertName} date={expertDate} />

          {/* CTA - Fixed high contrast */}
          <div className="mt-24 p-12 md:p-20 rounded-[80px] bg-primary text-white relative overflow-hidden group shadow-[0_0_80px_rgba(255,179,0,0.15)]">
            <div className="absolute top-[-50%] right-[-10%] w-[800px] h-[800px] bg-white/20 rounded-full blur-[100px]" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
              <div className="space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/50">Нужна консультация?</p>
                <h3 className="text-3xl md:text-5xl font-black tracking-tightest text-white uppercase leading-[0.9]">
                  ПРИМЕНИМ ЭТО <br /> НА ПРАКТИКЕ.
                </h3>
                <p className="text-white/60 text-lg md:text-xl max-w-md font-medium leading-relaxed ">
                  Эксперты ЭлитФинанс разберут вашу ситуацию и предложат оптимальное решение прямо сейчас.
                </p>
              </div>
              <ContactButton label="ОСТАВИТЬ ЗАЯВКУ" />
            </div>
          </div>

          {/* Related Articles */}
          {related.length > 0 && (
            <section className="mt-40">
              <div className="flex items-center gap-4 mb-16">
                <BookOpen size={20} className="text-white" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">
                  ЧИТАЙТЕ ТАКЖЕ
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/articles/${rel.id}`}
                    className="group p-8 rounded-[48px] border border-white/12 bg-white/[0.03] hover:bg-neutral-900 hover:border-primary/40 transition-all flex flex-col gap-6"
                  >
                    <div className="flex items-center gap-3 text-[9px] font-bold text-white uppercase tracking-widest">
                      <Calendar size={12} className="text-white" />
                      {new Date(rel.createdAt).toLocaleDateString("ru-RU")}
                    </div>
                    <h3 className="text-lg font-black text-white uppercase group-hover:text-white transition-colors leading-tight line-clamp-3 tracking-tight">
                      {rel.title}
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
