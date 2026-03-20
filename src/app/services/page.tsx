import Link from "next/link";
import { SERVICES } from "@/lib/services-data";
import { Logo } from "@/components/Logo";
import { ArrowRight, ChevronRight, Banknote, CheckCircle2, ShieldCheck } from "lucide-react";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AccountingService",
      "@id": "https://elitfinans.online#service",
      name: "ЭлитФинанс — бухгалтерское сопровождение",
      description:
        "Профессиональное бухгалтерское сопровождение ООО и ИП в России. ОСНО, УСН, кадровый учёт, защита по 115-ФЗ.",
      url: "https://elitfinans.online/services",
      provider: { "@id": "https://elitfinans.online#org" },
      areaServed: { "@type": "Country", name: "Россия" },
      priceRange: "от 5 000 ₽/мес",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Тарифы бухгалтерского сопровождения",
        itemListElement: SERVICES.map((s) => ({
          "@type": "Offer",
          name: s.title,
          description: s.subtitle,
          url: `https://elitfinans.online/services/${s.slug}`,
          priceCurrency: "RUB",
          price: s.minPrice,
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            minPrice: s.minPrice,
            priceCurrency: "RUB",
            unitCode: "MON",
            unitText: "месяц",
          },
          eligibleRegion: { "@type": "Country", name: "Россия" },
          availability: "https://schema.org/InStock",
        })),
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: "https://elitfinans.online" },
        { "@type": "ListItem", position: 2, name: "Услуги", item: "https://elitfinans.online/services" },
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

export default function ServicesPage() {
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
            <span className="font-bold text-lg xl:text-xl tracking-tighter uppercase">ЭлитФинанс</span>
          </Link>
          <Link href="/" className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors">
            На главную
          </Link>
        </div>
      </nav>

      <main className="pt-28 pb-24 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
              <li><Link href="/" className="hover:text-primary transition-colors">Главная</Link></li>
              <li><ChevronRight size={10} /></li>
              <li className="text-neutral-400">Услуги</li>
            </ol>
          </nav>

          <header className="mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-4">Все услуги</p>
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tightest leading-[1.05] text-white mb-5">
              Бухгалтерское сопровождение<br />
              <span className="text-neutral-500">ООО и ИП</span>
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl leading-relaxed">
              Профессиональный аутсорсинг бухгалтерии с финансовой ответственностью по договору.
              ОСНО, УСН, кадровый учёт — от 5 000 ₽/мес.
            </p>
          </header>

          {/* Services grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group p-10 rounded-[40px] bg-neutral-900/30 border border-white/5 hover:bg-neutral-900/50 hover:border-primary/20 transition-all flex flex-col gap-6"
              >
                {/* Price */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-bold text-primary">
                    <Banknote size={15} /> {s.price}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h2 className="text-2xl font-bold text-white group-hover:text-primary transition-colors tracking-tight mb-3">
                    {s.title}
                  </h2>
                  <p className="text-sm text-neutral-400 leading-relaxed">{s.subtitle}</p>
                </div>

                {/* Top 3 included */}
                <ul className="space-y-2">
                  {s.included.slice(0, 3).map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-neutral-500">
                      <CheckCircle2 size={12} className="text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                  {s.included.length > 3 && (
                    <li className="text-[10px] font-bold text-primary uppercase tracking-widest pl-5">
                      +{s.included.length - 3} включено
                    </li>
                  )}
                </ul>

                <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest mt-auto pt-4 border-t border-white/5">
                  Подробнее <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {/* Trust block */}
          <div className="p-10 rounded-[40px] bg-primary/5 border border-primary/15 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-start gap-5">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-white mb-1">100% финансовая ответственность</h2>
                <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
                  Если штраф или доначисление возникли по нашей вине — компенсируем в полном объёме.
                  Прописано в договоре.
                </p>
              </div>
            </div>
            <Link
              href="/#contact"
              className="shrink-0 px-8 py-4 bg-primary text-black font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-white transition-all flex items-center gap-3 group"
            >
              Получить консультацию
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
