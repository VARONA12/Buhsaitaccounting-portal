"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Loader2, Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Logo } from "@/components/Logo";

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  image: string | null;
  author: string;
  createdAt: string;
}

export default function ArticlesPage() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.isAdmin;

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
  });

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/articles");
      const data = await res.json();
      setArticles(data);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ title: "", excerpt: "", content: "", image: "" });
        fetchArticles();
      }
    } catch (error) {
      console.error("Failed to create article:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      "datePublished": article.createdAt,
      "url": `https://elitfinans.online/articles/${article.id}`,
      "author": {
        "@type": "Person",
        "@id": "https://elitfinans.online#expert",
        "name": article.author === "Администратор" ? "Анна Туманян" : article.author,
      },
      "isAccessibleForFree": true,
      "inLanguage": "ru",
    })),
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-primary/30 selection:text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articlesJsonLd) }}
      />

      {/* Header */}
      <nav className="fixed top-0 left-0 w-full z-[100] border-b border-white/[0.05] bg-black/50 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-16 xl:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center transition-transform hover:scale-110">
              <Logo size={42} />
            </div>
            <span className="font-bold text-lg xl:text-xl tracking-tighter uppercase">ЭлитФинанс</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors"
            >
              На главную
            </Link>
            {isAdmin && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all"
              >
                <Plus size={14} /> Добавить статью
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 space-y-4"
          >
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">База знаний</h2>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tightest leading-none">
              АКТУАЛЬНЫЕ <br /> СТАТЬИ И <span className="text-primary italic">ИНСАЙТЫ</span>
            </h1>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group rounded-[40px] bg-neutral-900/30 border border-white/5 p-8 hover:bg-neutral-900/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    {article.image && (
                      <div className="aspect-video rounded-[30px] overflow-hidden mb-6 bg-neutral-800">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4">
                      <div className="flex items-center gap-1.5 text-neutral-400">
                        <Calendar size={12} />
                        {new Date(article.createdAt).toLocaleDateString("ru-RU")}
                      </div>
                      <div className="flex items-center gap-1.5 flex-1">
                        <User size={12} />
                        {article.author === "Администратор" ? "Анна Туманян" : article.author}
                      </div>
                      {isAdmin && (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (window.confirm("Удалить статью?")) {
                              try {
                                const res = await fetch(`/api/articles?id=${article.id}`, { method: "DELETE" });
                                if (res.ok) fetchArticles();
                              } catch (err) {
                                console.error(err);
                              }
                            }
                          }}
                          className="p-2 -m-2 text-red-500 hover:text-red-400 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-neutral-400 text-sm line-clamp-3 mb-8 italic">
                      {article.excerpt ?? article.content.substring(0, 150) + "..."}
                    </p>
                  </div>
                  <Link
                    href={`/articles/${article.id}`}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary group-hover:gap-4 transition-all"
                  >
                    Читать полностью <ArrowRight size={14} />
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 border border-dashed border-white/10 rounded-[40px]">
              <p className="text-neutral-500 uppercase font-bold tracking-widest">Статей пока нет</p>
            </div>
          )}
        </div>
      </main>

      {/* Admin Upload Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-[40px] p-10 overflow-hidden"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 text-neutral-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              <div className="mb-10">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-2">Админ-панель</h2>
                <h3 className="text-3xl font-bold text-white tracking-tight">СОЗДАНИЕ СТАТЬИ</h3>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Заголовок</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Название статьи"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Превью (коротко)</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Краткое описание для карточки"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-colors h-24 resize-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Текст статьи</label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Полное содержание статьи..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-colors h-48 resize-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 block">URL изображения (опционально)</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full py-5 bg-primary text-black font-bold uppercase text-[11px] tracking-[0.3em] rounded-2xl hover:bg-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Опубликовать статью"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
