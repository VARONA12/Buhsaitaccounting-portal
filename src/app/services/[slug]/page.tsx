import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES } from "@/lib/services-data";
import { HANDBOOK_TERMS } from "@/lib/handbook-data";
import { ExpertVerification } from "@/components/ExpertVerification";
import { Logo } from "@/components/Logo";
import {
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Users,
  BookOpen,
  Banknote,
  ShieldCheck,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { ALL_NEWS } from "@/lib/news-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return { title: "Услуга не найдена | ЭлитФинанс" };

  const url = `https://elitfinans.online/services/${slug}`;

  return {
    title: `${service.title} | Цена ${service.price} | ЭлитФинанс`,
    description: service.subtitle + ". " + service.description[0].slice(0, 120) + "...",
    keywords: service.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${service.title} — ${service.price}`,
      description: service.subtitle,
      url,
      siteName: "ЭлитФинанс",
      locale: "ru_RU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} | ЭлитФинанс`,
      description: service.subtitle,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const url = `https://elitfinans.online/services/${slug}`;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    "mainEntity": service.faq.map((item) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": { "@type": "Answer", "text": item.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://elitfinans.online" },
      { "@type": "ListItem", "position": 2, "name": "Услуги", "item": "https://elitfinans.online/services" },
      { "@type": "ListItem", "position": 3, "name": service.title, "item": url },
    ],
  };

  const relatedTermObjs = HANDBOOK_TERMS.filter((t) =>
    service.relatedTerms.includes(t.slug)
  );

  const otherServices = SERVICES.filter((s) => s.slug !== slug);
  const relatedNews = ALL_NEWS.filter(n => 
    service.keywords.some(k => n.title.toLowerCase().includes(k.toLowerCase())) ||
    n.category === "Налоги" || n.category === "Законодательство"
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans selection:bg-primary-dark/80 selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full z-[100] border-b border-white/12 bg-neutral-900/70 backdrop-blur-3xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 xl:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="transition-transform group-hover:scale-110">
              <Logo size={40} />
            </div>
            <span className="font-bold text-lg xl:text-xl tracking-tighter uppercase text-white leading-none">
              ЭлитФинанс
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/services"
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:text-white transition-colors"
            >
              <ArrowLeft size={14} /> Все услуги
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-40 px-6 md:pt-40">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white flex-wrap">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Главная</Link>
              </li>
              <li><ChevronRight size={10} /></li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">Услуги</Link>
              </li>
              <li><ChevronRight size={10} /></li>
              <li className="text-white truncate max-w-[260px]">{service.title}</li>
            </ol>
          </nav>

          {/* Price badge */}
          <div className="mb-8">
            <span className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-primary/40 bg-primary/10 text-white text-sm font-black uppercase tracking-tight shadow-md">
              <Banknote size={16} /> {service.price}
            </span>
          </div>

          {/* Headline */}
          <header className="mb-12 space-y-6">
            <h1 className="text-4xl md:text-6xl xl:text-7xl font-black tracking-tightest leading-[1.05] text-white uppercase">
              {service.title}
            </h1>
            <p className="text-xl xl:text-2xl text-white leading-relaxed font-medium max-w-2xl ">
              {service.subtitle}
            </p>
          </header>

          {/* TLDR Block */}
          <section className="mb-20 p-10 rounded-[48px] border border-white/12 bg-neutral-900 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Logo size={120} />
            </div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Стоимость 2026</span>
                <div className="text-3xl font-black text-white leading-none">{service.price}</div>
                <p className="text-[11px] text-white leading-tight font-medium">Фиксированная цена по договору без скрытых платежей.</p>
              </div>
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Ключевые опции</span>
                <ul className="space-y-2">
                  {service.included.slice(0, 3).map((item, i) => (
                    <li key={i} className="text-xs font-bold text-white flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Гарантия 2026</span>
                <div className="text-sm font-black text-white uppercase tracking-tight">100% Фин. Ответственность</div>
                <p className="text-[11px] text-white leading-tight font-medium">Если по нашей вине возник штраф — мы платим его сами. Полный аутсорсинг.</p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 mb-24">
            {/* Main content */}
            <div className="xl:col-span-2 space-y-20">
              <section aria-label="Детальное описание" className="prose prose-invert max-w-none">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-8 h-px bg-primary" />
                   <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white">
                     КАК МЫ ВЕДЕМ {service.title.toUpperCase()}?
                   </h2>
                </div>
                <div className="space-y-8">
                  {service.description.map((para, i) => (
                    <p key={i} className="text-white leading-[1.8] text-[18px] font-medium">
                      {para}
                    </p>
                  ))}
                </div>
              </section>

              <section aria-label="Перечень работ">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white mb-10">
                  ЧТО ВХОДИТ В СТОИМОСТЬ ОБСЛУЖИВАНИЯ?
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {service.included.map((item, i) => (
                    <li key={i} className="flex items-start gap-4 p-6 rounded-[32px] border border-white/12 bg-neutral-900 hover:bg-white/[0.04] transition-all">
                      <CheckCircle2 size={18} className="text-white shrink-0 mt-0.5" />
                      <span className="text-white text-sm leading-relaxed font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

            </div>

            {/* Sidebar */}
            <aside className="xl:col-span-1 space-y-8">
              <div className="p-8 rounded-[40px] border border-white/12 bg-neutral-900 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users size={16} className="text-white" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">Для кого</span>
                </div>
                <ul className="space-y-3">
                  {service.forWhom.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 rounded-[40px] border border-primary/40 bg-primary/5 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-white" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">Гарантия</span>
                </div>
                <p className="text-sm text-white leading-relaxed font-medium">
                  100% Ответственность за ошибки. Если возник штраф по нашей вине — компенсируем его полностью.
                </p>
              </div>

              <div className="p-8 rounded-[40px] border border-white/12 bg-neutral-900 space-y-6 shadow-2xl">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white">
                  НАЧАТЬ РАБОТУ 2026
                </p>
                <p className="text-sm text-white leading-relaxed font-medium">
                  Бесплатный расчет стоимости проекта в течение 2-х часов.
                </p>
                <Link
                  href="/#contact"
                  className="flex items-center justify-center gap-3 w-full py-4 bg-primary text-white font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl hover:bg-white transition-all group shadow-xl"
                >
                  КОНСУЛЬТАЦИЯ
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </aside>
          </div>

          {/* Related Handbook Terms */}
          {relatedTermObjs.length > 0 && (
            <section className="mb-24">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <BookOpen size={20} className="text-white" />
                </div>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white">
                  СВЯЗАННЫЕ ТЕРМИНЫ
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {relatedTermObjs.map((term) => (
                  <Link
                    key={term.slug}
                    href={`/handbook/${term.slug}`}
                    className="group p-8 rounded-[40px] border border-white/12 bg-neutral-900 hover:bg-white/[0.04] hover:border-primary/40 transition-all flex flex-col gap-4 shadow-sm"
                  >
                    <h3 className="text-xl font-black text-white group-hover:text-white transition-colors uppercase tracking-tight">
                      {term.term}
                    </h3>
                    <p className="text-xs text-white leading-relaxed line-clamp-2 font-medium">
                      {term.shortDef}
                    </p>
                    <span className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-[0.3em] mt-auto">
                      В справочник <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Semantic Cluster: Related News */}
          {relatedNews.length > 0 && (
            <section className="mb-24">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Zap size={20} className="text-white" />
                </div>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white">
                  АКТУАЛЬНЫЕ ИНСАЙТЫ ПО ТЕМЕ
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedNews.map((news) => (
                  <Link
                    key={news.slug}
                    href={`/news/${news.slug}`}
                    className="group p-8 rounded-[40px] border border-white/12 bg-neutral-900 hover:bg-neutral-900 hover:border-primary/20 transition-all flex flex-col gap-6 shadow-sm h-full"
                  >
                    <div className="flex items-center justify-between">
                       <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">{news.category}</span>
                       <span className="text-[9px] font-bold text-white uppercase tracking-widest">{news.date}</span>
                    </div>
                    <h3 className="text-lg font-black text-white group-hover:text-white transition-colors uppercase tracking-tight leading-tight">
                      {news.title}
                    </h3>
                    <span className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest group-hover:text-white transition-colors mt-auto">
                      АНАЛИЗ РИСКОВ <ArrowRight size={14} />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          {service.faq.length > 0 && (
            <section className="mb-24" aria-label="Часто задаваемые вопросы">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <HelpCircle size={20} className="text-white" />
                </div>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white">
                  ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ
                </h2>
              </div>
              <div className="space-y-4">
                {service.faq.map((item, i) => (
                  <details key={i} className="group p-8 rounded-[32px] border border-white/12 bg-neutral-900 hover:border-primary/30 transition-all">
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                      <h3 className="text-sm md:text-base font-black text-white uppercase tracking-tight leading-snug">{item.q}</h3>
                      <ChevronDown size={16} className="text-white shrink-0 group-open:rotate-180 transition-transform" />
                    </summary>
                    <p className="mt-6 text-sm text-white/80 leading-relaxed font-medium">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/12 bg-neutral-900 relative">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-4">
               <Logo size={40} />
               <span className="font-bold text-xl tracking-tighter uppercase text-white">ЭлитФинанс</span>
            </div>
            <nav className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                {[
                  { label: "МЫ В МАКСЕ", href: "https://max-channel-link" },
                  { label: "ПОЗВОНИТЬ", href: "tel:+74950000000" },
                  { label: "СООБЩЕСТВО В ВК", href: "https://vk.com/elitfinans" },
                  { label: "НАПИСАТЬ НА ПОЧТУ", href: "mailto:info@elitfinans.online" }
                ].map(nav => (
                  <Link 
                    key={nav.label} 
                    href={nav.href} 
                    className="px-6 py-3 rounded-full border border-white/12 bg-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-white hover:bg-white hover:text-neutral-900 transition-all shadow-lg whitespace-nowrap"
                  >
                    {nav.label}
                  </Link>
                ))}
            </nav>
         </div>
      </footer>
    </div>
  );
}
