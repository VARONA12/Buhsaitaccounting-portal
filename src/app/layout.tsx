import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://elitfinans.online"),
  title: {
    default: "ЭлитФинанс — Бухгалтерское сопровождение ООО и ИП | Налоги 2026",
    template: "%s | ЭлитФинанс",
  },
  description:
    "Бухгалтерское сопровождение ООО и ИП в России от 5 000 ₽/мес. ОСНО, УСН, кадровый учёт, налоговая оптимизация, защита по 115-ФЗ. 100% финансовая ответственность по договору. Работаем с 2010 года.",
  keywords: [
    "бухгалтерское сопровождение",
    "бухгалтерия для ООО",
    "бухгалтерия для ИП",
    "налоговая оптимизация",
    "ОСНО",
    "УСН 2026",
    "ЕНП",
    "115-ФЗ",
    "аутсорсинг бухгалтерии",
    "кадровый учёт",
  ],
  authors: [{ name: "ЭлитФинанс", url: "https://elitfinans.online" }],
  creator: "ЭлитФинанс",
  publisher: "ЭлитФинанс",
  applicationName: "ЭлитФинанс",
  alternates: {
    canonical: "https://elitfinans.online",
  },
  openGraph: {
    title: "ЭлитФинанс — Бухгалтерское сопровождение ООО и ИП",
    description:
      "Профессиональное бухгалтерское сопровождение в России. ОСНО, УСН, налоговая оптимизация с полной финансовой ответственностью.",
    url: "https://elitfinans.online",
    siteName: "ЭлитФинанс",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "/director_hq.png",
        width: 1200,
        height: 630,
        alt: "ЭлитФинанс — бухгалтерское сопровождение бизнеса",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ЭлитФинанс — Бухгалтерское сопровождение ООО и ИП",
    description:
      "Профессиональное бухгалтерское сопровождение в России. ОСНО, УСН, налоговая оптимизация.",
    images: ["/director_hq.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "pending_google_verification",
    yandex: "pending_yandex_verification",
    other: {
      "msvalidate.01": "B2C26347D8735BBC4AF6CEA15C33337E",
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "AccountingService",
  "@id": "https://elitfinans.online#org",
  "name": "ЭлитФинанс",
  "url": "https://elitfinans.online",
  "telephone": "+79028371370",
  "priceRange": "от 5 000 ₽/мес",
  "openingHours": "Mo-Fr 09:00-18:00",
  "inLanguage": "ru",
  "areaServed": "RU",
  "description": "Профессиональное бухгалтерское сопровождение ООО и ИП в России. ОСНО, УСН, кадровый учёт, защита по 115-ФЗ.",
  "founder": {
    "@type": "Person",
    "name": "Анна Туманян",
    "jobTitle": "Главный аудитор"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+79028371370",
    "contactType": "customer support",
    "availableLanguage": "Russian",
    "hoursAvailable": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  }
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://elitfinans.online#website",
  "url": "https://elitfinans.online",
  "name": "ЭлитФинанс",
  "description": "Профессиональное бухгалтерское и налоговое сопровождение ООО и ИП в России",
  "inLanguage": "ru",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://elitfinans.online/faq?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://elitfinans.online#org"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased selection:bg-primary/30 selection:text-white bg-neutral-900">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
