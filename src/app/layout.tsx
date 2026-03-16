import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

import NextAuthProvider from "@/components/NextAuthProvider";
import { ChatWidget } from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "Бухгалтерский Портал | Апекс Решения",
  description: "Безопасный, надежный и быстрый доступ к вашей бухгалтерии.",
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
          <ChatWidget />
        </NextAuthProvider>
      </body>
    </html>
  );
}
