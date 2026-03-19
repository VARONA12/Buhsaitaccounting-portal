import type { Metadata } from "next";
import { ALL_NEWS } from "@/lib/news-data";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": "https://elitefinance.pro/news#blog",
  name: "Новости налогообложения и бухгалтерии | ЭлитФинанс",
  description:
    "Ежедневная лента новостей об изменениях в налоговом законодательстве России. УСН, ОСНО, ЕНП, 115-ФЗ — актуальные разборы для ООО и ИП.",
  url: "https://elitefinance.pro/news",
  inLanguage: "ru",
  isAccessibleForFree: true,
  publisher: {
    "@type": "Organization",
    "@id": "https://elitefinance.pro#org",
    name: "ЭлитФинанс",
    url: "https://elitefinance.pro",
  },
  blogPost: ALL_NEWS.map((n) => ({
    "@type": "NewsArticle",
    "@id": `https://elitefinance.pro/news/${n.slug}#article`,
    headline: n.title,
    description: n.desc,
    url: `https://elitefinance.pro/news/${n.slug}`,
    datePublished: n.isoDate,
    articleSection: n.category,
    keywords: n.keywords.join(", "),
    inLanguage: "ru",
    isAccessibleForFree: true,
    publisher: { "@id": "https://elitefinance.pro#org" },
    author: {
      "@type": "Person",
      "@id": "https://elitefinance.pro#expert",
      name: "Анна Туманян",
    },
  })),
};

export const metadata: Metadata = {
  title: "Новости налогообложения и бухгалтерии 2026 | ЭлитФинанс",
  description:
    "Ежедневная лента новостей об изменениях в налоговом законодательстве России. УСН, ОСНО, ЕНП, 115-ФЗ — актуальные разборы для ООО и ИП от экспертов ЭлитФинанс.",
  keywords: [
    "налоговые новости 2026",
    "изменения законодательства",
    "УСН изменения",
    "ФНС новости",
    "ЕНП 2026",
    "бухгалтерия новости",
    "налоги для бизнеса",
  ],
  alternates: {
    canonical: "https://elitefinance.pro/news",
  },
  openGraph: {
    title: "Новости налогообложения и бухгалтерии | ЭлитФинанс",
    description:
      "Ежедневная лента новостей об изменениях в налоговом законодательстве России для ООО и ИП.",
    url: "https://elitefinance.pro/news",
    siteName: "ЭлитФинанс",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Новости налогообложения 2026 | ЭлитФинанс",
    description:
      "Ежедневные разборы изменений в налоговом законодательстве для бизнеса.",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
