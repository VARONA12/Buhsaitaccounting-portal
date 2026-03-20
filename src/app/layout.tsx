import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "@/components/NextAuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://elitfinans.online"),
  title: {
    default: "ЭлитФинанс — Бухгалтерское сопровождение ООО и ИП | Налоги 2026",
    template: "%s | ЭлитФинанс",
  },
  description:
    "Профессиональное бухгалтерское сопровождение ООО и ИП в России. ОСНО, УСН, кадровый учёт, налоговая оптимизация. Эксперт Анна Туманян — 15 лет опыта, 100% ответственность по договору.",
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
  authors: [{ name: "Анна Туманян", url: "https://elitfinans.online" }],
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
    // Добавить при получении кодов верификации
    // google: "...",
    // yandex: "...",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} antialiased selection:bg-primary/30 selection:text-primary`}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
