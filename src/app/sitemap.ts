import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { ALL_NEWS } from "@/lib/news-data";
import { HANDBOOK_TERMS } from "@/lib/handbook-data";
import { SERVICES } from "@/lib/services-data";
import { FAQ_ITEMS } from "@/lib/faq-data";

const BASE_URL = "https://elitfinans.online";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/handbook`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/expert/anna-tumanian`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Dynamic article pages from DB
  let articlePages: MetadataRoute.Sitemap = [];
  try {
    const articles = await db.article.findMany({
      where: { published: true },
      select: { id: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
    });
    articlePages = articles.map((article) => ({
      url: `${BASE_URL}/articles/${article.id}`,
      lastModified: article.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch {
    // DB unavailable during build — skip article pages
  }

  // Static news pages from news-data
  const newsPages: MetadataRoute.Sitemap = ALL_NEWS.map((news) => ({
    url: `${BASE_URL}/news/${news.slug}`,
    lastModified: new Date(news.isoDate),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Individual service pages
  const servicePages: MetadataRoute.Sitemap = SERVICES.map((service) => ({
    url: `${BASE_URL}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  // Static handbook term pages
  const handbookPages: MetadataRoute.Sitemap = HANDBOOK_TERMS.map((term) => ({
    url: `${BASE_URL}/handbook/${term.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Individual FAQ pages
  const faqPages: MetadataRoute.Sitemap = FAQ_ITEMS.map((f) => ({
    url: `${BASE_URL}/faq/${f.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...servicePages, ...faqPages, ...articlePages, ...newsPages, ...handbookPages];
}
