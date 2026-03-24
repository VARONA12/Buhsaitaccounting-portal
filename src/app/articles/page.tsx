import { db } from "@/lib/db";
import { Calendar, User, ArrowRight, Zap, BookOpen } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const articles = await db.article.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  const articlesJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://elitfinans.online/articles",
    "name": "База знаний ЭлитФинанс",
    "description": "Экспертные статьи о налогах и бухгалтерии для ООО и ИП в России.",
    "inLanguage": "ru",
    "publisher": {
      "@type": "Organization",
      "@id": "https://elitfinans.online#org",
      "name": "ЭлитФинанс",
    },
    "blogPost": articles.map((article) => ({
      "@type": "BlogPosting",
      "@id": `https://elitfinans.online/articles/${article.id}`,
      "headline": article.title,
      "description": article.excerpt ?? article.content.substring(0, 160),
      "datePublished": article.createdAt.toISOString(),
      "url": `https://elitfinans.online/articles/${article.id}`,
      "author": {
        "@type": "Person",
        "@id": "https://elitfinans.online#expert",
        "name": article.author === "Администратор" ? "ЭФ Эксперт" : article.author,
      },
      "isAccessibleForFree": true,
      "inLanguage": "ru",
    })),
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans selection:bg-primary-dark/80 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articlesJsonLd) }}
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
          <div className="mb-20 space-y-6 lg:text-left relative">
            <div className="absolute top-[-50%] left-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px]" />
            <div className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.5em] text-white">
              <Zap size={14} className="animate-pulse" />
              VAULT 2026 / INSIGHTS
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tightest leading-[1.1] text-white uppercase">
              ЭКСПЕРТНЫЕ <br /> ИНСАЙТЫ <span className="text-white ">2026</span>
            </h1>
            <p className="text-xl md:text-2xl text-white font-medium max-w-2xl leading-relaxed">
              Информационное превосходство: от управления налогами до защиты активов.
            </p>
          </div>

          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="group rounded-[56px] border border-white/12 bg-neutral-900 hover:bg-white/[0.04] p-10 hover:shadow-2xl hover:border-primary/30 transition-all duration-500 flex flex-col h-full shadow-sm"
                >
                  <div className="flex-1">
                    {article.image && (
                      <div className="aspect-[16/10] rounded-[48px] overflow-hidden mb-8 bg-neutral-900 relative shadow-lg">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover: group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-95" />
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-[9px] font-bold text-white uppercase tracking-[0.4em] mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-white" />
                        {new Date(article.createdAt).toLocaleDateString("ru-RU")}
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={12} className="text-white" />
                        {article.author === "Администратор" ? "ЭФ Эксперт" : article.author}
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-6 group-hover:text-white transition-colors leading-tight uppercase tracking-tight">
                      {article.title}
                    </h3>
                    <p className="text-sm md:text-base text-white line-clamp-3 mb-8 leading-relaxed font-medium">
                      {article.excerpt ?? article.content.substring(0, 150) + "..."}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.4em] text-white group-hover:gap-6 transition-all pt-8 border-t border-white/12">
                    ЧИТАТЬ СТАТЬЮ <ArrowRight size={16} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-40 bg-neutral-900 border border-dashed border-white/20 rounded-[64px]">
              <p className="text-white uppercase font-bold tracking-[0.5em] text-[10px] animate-pulse">Архив пуст</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
