export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  isoDate: string;
  time: string;
  desc: string;
  fullContent: string;
  keywords: string[];
}

// News is populated dynamically from DB via Python scraper
export const ALL_NEWS: NewsItem[] = [];
