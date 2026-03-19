import type { Metadata } from "next";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": "https://elitefinance.pro/articles#blog",
  name: "База знаний ЭлитФинанс — статьи о налогах и бухгалтерии",
  description:
    "Экспертные статьи о налогообложении ООО и ИП в России. ОСНО, УСН, ЕНП, 115-ФЗ. Верифицированы налоговым аудитором Анной Туманян.",
  url: "https://elitefinance.pro/articles",
  inLanguage: "ru",
  isAccessibleForFree: true,
  publisher: {
    "@type": "Organization",
    "@id": "https://elitefinance.pro#org",
    name: "ЭлитФинанс",
    url: "https://elitefinance.pro",
  },
  author: {
    "@type": "Person",
    "@id": "https://elitefinance.pro#expert",
    name: "Анна Туманян",
    jobTitle: "Налоговый консультант и главный бухгалтер",
    worksFor: { "@id": "https://elitefinance.pro#org" },
  },
  about: [
    { "@type": "Thing", name: "Бухгалтерский учёт" },
    { "@type": "Thing", name: "Налогообложение ООО" },
    { "@type": "Thing", name: "Налогообложение ИП" },
    { "@type": "Thing", name: "УСН" },
    { "@type": "Thing", name: "ОСНО" },
    { "@type": "Thing", name: "ЕНП" },
  ],
};

export const metadata: Metadata = {
  title: "База знаний — Статьи о налогах и бухгалтерии | ЭлитФинанс",
  description:
    "Экспертные статьи о налогообложении ООО и ИП в России. Разборы ОСНО, УСН, ЕНП, 115-ФЗ — актуальные материалы, верифицированные налоговым аудитором Анной Туманян.",
  keywords: [
    "бухгалтерия для ООО",
    "налоги для ИП",
    "УСН 2026",
    "ОСНО",
    "ЕНП",
    "115-ФЗ",
    "налоговая оптимизация",
    "бухгалтерский учёт",
  ],
  alternates: {
    canonical: "https://elitefinance.pro/articles",
  },
  openGraph: {
    title: "База знаний — Статьи о налогах и бухгалтерии | ЭлитФинанс",
    description:
      "Экспертные статьи о налогообложении ООО и ИП. Верифицированы налоговым аудитором с 15-летним стажем.",
    url: "https://elitefinance.pro/articles",
    siteName: "ЭлитФинанс",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "База знаний ЭлитФинанс — Статьи о налогах",
    description:
      "Экспертные статьи о налогообложении ООО и ИП, верифицированные профессиональным аудитором.",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export default function ArticlesLayout({
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
