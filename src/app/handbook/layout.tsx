import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Справочник предпринимателя | Налоги, отчётность, системы учёта 2026",
  description:
    "Полный справочник по налогам и бухгалтерии для ООО и ИП в России 2026: ЕНП, УСН, ОСНО, НДС, НДФЛ, страховые взносы, 115-ФЗ. Экспертные определения с разбором и примерами.",
  keywords: [
    "справочник предпринимателя",
    "налоговые термины",
    "ЕНП",
    "УСН 2026",
    "ОСНО",
    "НДС",
    "страховые взносы",
    "бухгалтерия для бизнеса",
    "115-ФЗ",
    "налоговая оптимизация",
  ],
  alternates: {
    canonical: "https://elitfinans.online/handbook",
  },
  openGraph: {
    title: "Справочник предпринимателя | ЭлитФинанс",
    description:
      "Экспертный справочник по налогам и бухгалтерии для ООО и ИП. ЕНП, УСН, ОСНО, НДС, 115-ФЗ — 20 ключевых терминов с разбором, FAQ и примерами.",
    url: "https://elitfinans.online/handbook",
    siteName: "ЭлитФинанс",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Справочник предпринимателя | ЭлитФинанс",
    description:
      "ЕНП, УСН, ОСНО, НДС, 115-ФЗ — полный налоговый справочник для ООО и ИП 2026",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export default function HandbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
