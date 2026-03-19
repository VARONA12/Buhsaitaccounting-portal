import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

import NextAuthProvider from "@/components/NextAuthProvider";

export const metadata: Metadata = {
  title: "ЭлитФинанс — Экспертный бухгалтерский портал для бизнеса | Бухгалтерия 2026",
  description: "ЭлитФинанс — профессиональная бухгалтерская поддержка от сертифицированных экспертов. Обеспечиваем безопасный, надежный и быстрый доступ к вашей отчетности и финансам 24/7.",
  authors: [{ name: "ЭлитФинанс", url: "https://elitefinance.pro" }],
  creator: "ЭлитФинанс",
  publisher: "ЭлитФинанс",
  applicationName: "ЭлитФинанс",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} antialiased selection:bg-primary/30 selection:text-primary`}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
