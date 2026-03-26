export const revalidate = 300;

import Link from "next/link";
import { SERVICES } from "@/lib/services-data";
import { Logo } from "@/components/Logo";
import { ContactButton } from "@/components/ContactButton";
import { ArrowRight, Banknote, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export default function ServicesPage() {
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
        provider: {
          "@type": "Organization",
          "@id": "https://elitfinans.online#org",
          name: "ЭлитФинанс",
        },
      },
      {
        "@type": "ItemList",
        "@id": "https://elitfinans.online/services#list",
        name: "Бухгалтерские услуги ЭлитФинанс",
        url: "https://elitfinans.online/services",
        numberOfItems: SERVICES.length,
        itemListElement: SERVICES.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "AccountingService",
            "@id": s.schemaId,
            name: s.title,
            description: s.subtitle,
            url: `https://elitfinans.online/services/${s.slug}`,
            offers: {
              "@type": "Offer",
              price: s.minPrice,
              priceCurrency: "RUB",
              priceSpecification: {
                "@type": "PriceSpecification",
                price: s.minPrice,
                priceCurrency: "RUB",
                valueAddedTaxIncluded: false,
              },
            },
            provider: {
              "@type": "Organization",
              "@id": "https://elitfinans.online#org",
              name: "ЭлитФинанс",
            },
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: "https://elitfinans.online" },
          { "@type": "ListItem", position: 2, name: "Услуги", item: "https://elitfinans.online/services" },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans selection:bg-primary-dark/80 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full z-[100] border-b border-white/12 bg-neutral-900/70 backdrop-blur-3xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 xl:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="flex items-center justify-center transition-all group-hover:scale-110">
              <Logo size={40} />
            </div>
            <span className="font-bold text-lg xl:text-xl tracking-tighter uppercase text-white leading-none">ЭлитФинанс</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-[10px] font-bold uppercase tracking-[0.4em] text-white hover:text-white transition-colors"
            >
              На главную
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-32 px-6 md:pt-40">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-20 space-y-6">
            <div className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.5em] text-white">
              <Zap size={14} className="animate-pulse" />
              НАПРАВЛЕНИЯ УСЛУГ 2026
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tightest leading-[1.1] text-white uppercase">
              БУХГАЛТЕРСКИЙ <br /> АУТСОРСИНГ <span className="text-white">БИЗНЕСА</span>
            </h1>
            <p className="text-xl md:text-2xl text-white font-medium max-w-2xl leading-relaxed">
              Операционный учет, налоговое планирование и юридическая защита с гарантией
            </p>
          </header>

          {/* Services grid - Dark */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group p-10 rounded-[56px] border border-white/12 bg-neutral-900 hover:bg-white/[0.04] hover:border-primary/30 transition-all duration-500 flex flex-col gap-8 shadow-sm"
              >
                {/* Price */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 px-5 py-2 rounded-full border border-primary/40 bg-primary/10 text-white text-xs font-bold uppercase tracking-tight shadow-md">
                    <Banknote size={14} /> {s.price}
                  </span>
                </div>

                {/* Title */}
                <div className="space-y-3">
                  <h2 className="text-2xl md:text-3xl font-black text-white group-hover:text-white transition-colors tracking-tight uppercase leading-tight">
                    {s.title}
                  </h2>
                  <p className="text-sm md:text-base text-white font-medium leading-relaxed">{s.subtitle}</p>
                </div>

                {/* Top 3 included */}
                <ul className="grid grid-cols-1 gap-3">
                  {s.included.slice(0, 3).map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs md:text-sm text-white font-medium">
                      <CheckCircle2 size={14} className="text-white shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.4em] text-white group-hover:gap-6 transition-all mt-auto pt-8 border-t border-white/12">
                  ПОДРОБНЕЕ <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>

          {/* Trust block - Dark */}
          <div className="p-10 md:p-16 rounded-[56px] bg-primary text-white flex flex-col lg:flex-row lg:items-center justify-between gap-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-[-50%] right-[-10%] w-[800px] h-[800px] bg-white/20 rounded-full blur-[100px]" />
            
            <div className="flex items-start gap-6 relative z-10">
              <div className="w-16 h-16 rounded-3xl bg-neutral-900 flex items-center justify-center shrink-0">
                <ShieldCheck size={32} className="text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-none">100% Финансовая <br /> ответственность</h2>
                <p className="text-sm md:text-lg text-white/60 max-w-xl leading-relaxed font-medium ">
                  Если штраф или доначисление возникли по нашей вине — компенсируем в полном объёме, прописано в договоре
                </p>
              </div>
            </div>
            <ContactButton label="Консультация" className="shrink-0 px-10 py-5 bg-neutral-900 text-white font-black uppercase text-[10px] tracking-[0.4em] rounded-2xl hover:bg-white hover:text-neutral-900 transition-all shadow-2xl flex items-center justify-center gap-3 relative z-10" />
          </div>
        </div>
      </main>
    </div>
  );
}
