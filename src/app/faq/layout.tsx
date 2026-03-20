import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Вопросы и ответы по бухгалтерии и налогам 2026 | ЭлитФинанс",
  description:
    "20 частых вопросов о налогах, аутсорсинге бухгалтерии и 115-ФЗ для ООО и ИП в России. Экспертные ответы от ЭлитФинанс: УСН, ОСНО, ЕНП, блокировка счёта, проверки ФНС.",
  keywords: [
    "вопросы по налогам",
    "бухгалтерия FAQ",
    "аутсорсинг бухгалтерии вопросы",
    "115-ФЗ вопросы",
    "УСН или ОСНО",
    "ФНС требование что делать",
    "блокировка счёта вопросы",
  ],
  alternates: { canonical: "https://elitfinans.online/faq" },
  openGraph: {
    title: "Вопросы и ответы по налогам | ЭлитФинанс",
    description:
      "20 экспертных ответов на частые вопросы об аутсорсинге бухгалтерии, налоговых режимах и проверках ФНС.",
    url: "https://elitfinans.online/faq",
    siteName: "ЭлитФинанс",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Вопросы и ответы по налогам | ЭлитФинанс",
    description: "20 вопросов об аутсорсинге, УСН, ОСНО, 115-ФЗ и проверках ФНС.",
  },
  robots: { index: true, follow: true, "max-snippet": -1 },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
