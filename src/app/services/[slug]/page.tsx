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
} from "lucide-react";

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

  // Related handbook terms
  const relatedTermObjs = HANDBOOK_TERMS.filter((t) =>
    service.relatedTerms.includes(t.slug)
  );

  // Other services
  const otherServices = SERVICES.filter((s) => s.slug !== slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.title,
        description: service.subtitle,
        url,
        provider: {
          "@type": "Organization",
          "@id": "https://elitfinans.online#org",
          name: "ЭлитФинанс",
          url: "https://elitfinans.online",
          telephone: "+79028371370",
        },
        serviceType: "Бухгалтерский аутсорсинг",
        areaServed: { "@type": "Country", name: "Россия" },
        availableLanguage: "ru",
        offers: {
          "@type": "Offer",
          priceCurrency: "RUB",
          price: service.minPrice,
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            minPrice: service.minPrice,
            priceCurrency: "RUB",
            unitCode: "MON",
            unitText: "месяц",
          },
          eligibleRegion: { "@type": "Country", name: "Россия" },
          availability: "https://schema.org/InStock",
          seller: { "@id": "https://elitfinans.online#org" },
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `Состав услуги: ${service.title}`,
          itemListElement: service.included.map((item, i) => ({
            "@type": "Offer",
            position: i + 1,
            name: item,
          })),
        },
        audience: {
          "@type": "Audience",
          audienceType: service.forWhom.join(", "),
        },
        isRelatedTo: service.relatedTerms.map((termSlug) => ({
          "@type": "DefinedTerm",
          "@id": `https://elitfinans.online/handbook/${termSlug}#term`,
          url: `https://elitfinans.online/handbook/${termSlug}`,
        })),
        isPartOf: {
          "@type": "AccountingService",
          "@id": "https://elitfinans.online#service",
          name: "ЭлитФинанс — бухгалтерское сопровождение",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: service.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Главная",
            item: "https://elitfinans.online",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Услуги",
            item: "https://elitfinans.online/#services",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.title,
            item: url,
          },
        ],
      },
      {
        "@type": "Organization",
        "@id": "https://elitfinans.online#org",
        name: "ЭлитФинанс",
        url: "https://elitfinans.online",
        telephone: "+79028371370",
        email: "info@elitfinance.ru",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "127",
          bestRating: "5",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full z-[100] border-b border-white/[0.05] bg-black/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-16 xl:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="transition-transform group-hover:scale-110">
              <Logo size={42} />
            </div>
            <span className="font-bold text-lg xl:text-xl tracking-tighter uppercase">
              ЭлитФинанс
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/#services"
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} /> Все услуги
            </Link>
            <Link
              href="/"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors"
            >
              На главную
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-24 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Главная
                </Link>
              </li>
              <li><ChevronRight size={10} /></li>
              <li>
                <Link href="/#services" className="hover:text-primary transition-colors">
                  Услуги
                </Link>
              </li>
              <li><ChevronRight size={10} /></li>
              <li className="text-neutral-400 truncate max-w-[260px]">{service.title}</li>
            </ol>
          </nav>

          {/* Price badge */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/25 text-primary text-sm font-bold">
              <Banknote size={14} /> {service.price}
            </span>
          </div>

          {/* Headline */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tightest leading-[1.05] text-white mb-5">
              {service.title}
            </h1>
            <p className="text-lg xl:text-xl text-neutral-400 leading-relaxed font-medium max-w-2xl">
              {service.subtitle}
            </p>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-16">
            {/* Main content */}
            <div className="xl:col-span-2 space-y-12">

              {/* Description */}
              <section>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6">
                  Подробнее об услуге
                </h2>
                <div className="space-y-5">
                  {service.description.map((para, i) => (
                    <p key={i} className="text-neutral-300 leading-[1.8] text-[17px]">
                      {para}
                    </p>
                  ))}
                </div>
              </section>

              {/* What's included */}
              <section>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6">
                  Что входит в услугу
                </h2>
                <ul className="space-y-3">
                  {service.included.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                      <span className="text-neutral-300 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Expert Verification */}
              <ExpertVerification expertName="Анна Туманян" date="Март 2026" />
            </div>

            {/* Sidebar */}
            <aside className="xl:col-span-1 space-y-6">

              {/* For whom */}
              <div className="p-6 rounded-[28px] bg-neutral-900/40 border border-white/5">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                    <Users size={13} className="text-primary" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    Для кого
                  </span>
                </div>
                <ul className="space-y-2">
                  {service.forWhom.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-neutral-400"
                    >
                      <span className="w-1 h-1 rounded-full bg-primary/50 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Guarantee */}
              <div className="p-6 rounded-[28px] bg-primary/5 border border-primary/15">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck size={16} className="text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    Гарантия
                  </span>
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  100% финансовая ответственность по договору. Если штраф возник по
                  нашей вине — компенсируем его полностью.
                </p>
              </div>

              {/* CTA sidebar */}
              <div className="p-6 rounded-[28px] bg-neutral-900/40 border border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">
                  Начать сотрудничество
                </p>
                <p className="text-sm text-neutral-400 mb-5 leading-relaxed">
                  Бесплатная консультация и расчёт стоимости — без обязательств.
                </p>
                <Link
                  href="/#contact"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-black font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-white transition-all group"
                >
                  Получить консультацию
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </aside>
          </div>

          {/* FAQ */}
          <section className="mb-16" aria-label={`Частые вопросы: ${service.title}`}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                <HelpCircle size={16} className="text-primary" />
              </div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                Частые вопросы
              </h2>
            </div>
            <div className="space-y-4">
              {service.faq.map((item, i) => (
                <details
                  key={i}
                  className="group p-6 rounded-[24px] bg-neutral-900/30 border border-white/5 hover:border-primary/15 transition-colors"
                >
                  <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                    <span className="font-bold text-white text-base leading-snug">
                      {item.q}
                    </span>
                    <ChevronDown
                      size={16}
                      className="text-neutral-500 shrink-0 mt-1 group-open:rotate-180 transition-transform"
                    />
                  </summary>
                  <p className="mt-4 text-neutral-400 leading-relaxed text-sm">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* Related Handbook Terms */}
          {relatedTermObjs.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                  <BookOpen size={16} className="text-primary" />
                </div>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                  Связанные термины
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {relatedTermObjs.map((term) => (
                  <Link
                    key={term.slug}
                    href={`/handbook/${term.slug}`}
                    className="group p-5 rounded-[20px] bg-neutral-900/30 border border-white/5 hover:border-primary/20 transition-all flex flex-col gap-3"
                  >
                    <h3 className="font-bold text-white group-hover:text-primary transition-colors">
                      {term.term}
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
                      {term.shortDef}
                    </p>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-widest mt-auto">
                      В справочник{" "}
                      <ArrowRight
                        size={11}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Other services */}
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400 mb-8">
              Другие услуги
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherServices.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group p-6 rounded-[28px] bg-neutral-900/30 border border-white/5 hover:bg-neutral-900/50 hover:border-primary/20 transition-all flex flex-col gap-4"
                >
                  <div>
                    <h3 className="font-bold text-white group-hover:text-primary transition-colors mb-1">
                      {s.title}
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
                      {s.subtitle}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                    <span className="text-sm font-bold text-primary">{s.price}</span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-neutral-500 uppercase tracking-widest group-hover:text-primary transition-colors">
                      Подробнее{" "}
                      <ArrowRight
                        size={11}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
