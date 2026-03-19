import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Услуги бухгалтерского сопровождения ООО и ИП | ЭлитФинанс",
  description:
    "Бухгалтерское сопровождение ООО на ОСНО и УСН, бухгалтерия для ИП, кадровый учёт. Цены от 5 000 ₽/мес. Финансовая ответственность по договору.",
  keywords: [
    "бухгалтерские услуги",
    "сопровождение ООО",
    "бухгалтерия для ИП",
    "кадровый учёт",
    "ОСНО аутсорс",
    "УСН аутсорс",
    "стоимость бухгалтерии",
  ],
  alternates: {
    canonical: "https://elitefinance.pro/services",
  },
  openGraph: {
    title: "Услуги бухгалтерского сопровождения | ЭлитФинанс",
    description:
      "ООО на ОСНО и УСН, ИП, кадровый учёт — от 5 000 ₽/мес. Финансовая ответственность по договору.",
    url: "https://elitefinance.pro/services",
    siteName: "ЭлитФинанс",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Бухгалтерские услуги для ООО и ИП | ЭлитФинанс",
    description: "ОСНО, УСН, ИП, кадры — от 5 000 ₽/мес с финансовой ответственностью.",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
