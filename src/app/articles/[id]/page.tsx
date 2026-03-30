  const readingTime = Math.max(1, Math.ceil(article.content.split(" ").length / 170));
  const formattedDate = new Date(article.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const expertName =
    article.author === "Администратор" ? "Эксперт ЭлитФинанс" : article.author;

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
          {/* JSON-LD for Article */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": article.title,
                "description": description,
                "image": article.image ? `https://elitfinans.online${article.image}` : undefined,
                "datePublished": article.createdAt.toISOString(),
                "dateModified": article.updatedAt.toISOString(),
                "author": {
                  "@type": "Person",
                  "name": expertName
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "ЭлитФинанс",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://elitfinans.online/logo.png"
                  }
                },
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": url
                }
              })
            }}
          />
          {/* Article header */}
          <header className="mb-12">
            <div className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.5em] text-white mb-6">
              <Zap size={16} className="animate-pulse" /> БАЗА ЗНАНИЙ ЭЛИТФИНАНС
            </div>
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-black tracking-tightest leading-[1.05] text-white uppercase mb-8">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{expertName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{readingTime} мин. чтения</span>
              </div>
            </div>
          </header>

          {/* Article image if exists */}
          {article.image && (
            <div className="mb-12 rounded-2xl overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                width={1200}
                height={630}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          )}