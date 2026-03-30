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