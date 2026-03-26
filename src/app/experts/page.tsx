export const revalidate = 300;

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { UserCheck, Star, ShieldCheck, ArrowRight, User } from "lucide-react";
import { EXPERTS } from "@/lib/experts-data";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { AeoNav } from "@/components/AeoNav";

export const metadata: Metadata = {
  title: "Эксперты по налогам и бухгалтерии — команда ЭлитФинанс",
  description: "Познакомьтесь с командой ЭлитФинанс: главный бухгалтер, налоговый консультант, специалист по 115-ФЗ, кадровый эксперт. Суммарный опыт команды — более 70 лет. Финансовая ответственность по договору.",
  alternates: { canonical: "https://elitfinans.online/experts" },
  openGraph: {
    title: "Эксперты по налогам и бухгалтерии — ЭлитФинанс",
    description: "5 узкопрофильных специалистов: ОСНО, УСН, 115-ФЗ, кадры, гранты. Суммарный опыт — более 70 лет.",
    url: "https://elitfinans.online/experts",
    images: [{ url: "https://elitfinans.online/director_hq.png", width: 1200, height: 630 }],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://elitfinans.online" },
    { "@type": "ListItem", "position": 2, "name": "Эксперты", "item": "https://elitfinans.online/experts" },
  ],
};

const expertsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": "https://elitfinans.online/experts#list",
  "name": "Команда экспертов ЭлитФинанс",
  "url": "https://elitfinans.online/experts",
  "inLanguage": "ru",
  "numberOfItems": EXPERTS.length,
  "itemListElement": EXPERTS.map((e, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "item": {
      "@type": "Person",
      "@id": `https://elitfinans.online/experts/${e.slug}`,
      "name": e.name,
      "jobTitle": e.role,
      "description": e.bio,
      "url": `https://elitfinans.online/experts/${e.slug}`,
      "worksFor": {
        "@type": "Organization",
        "@id": "https://elitfinans.online#org",
        "name": "ЭлитФинанс"
      },
      "knowsAbout": e.specialization,
    }
  }))
};

export default function ExpertsPage() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans selection:bg-primary-dark/80 selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(expertsJsonLd) }}
      />
      <AeoNav />

      <main className="pt-32 pb-40 px-6 md:pt-48">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-20 space-y-8 lg:text-left">
             <div className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.5em] text-white">
                <UserCheck size={16} />
                КОМАНДА ЭЛИТФИНАНС
             </div>
             <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tightest leading-[1.1] text-white uppercase">
                ЭКСПЕРТЫ <br /> ПО НАЛОГАМ И <span className="text-white ">ПРАВУ</span>
             </h1>
            <p className="text-xl md:text-2xl text-white font-medium max-w-2xl leading-relaxed">
               Коллективная экспертиза ЭлитФинанс гарантирует 100% точность в ведении вашего бизнеса.
            </p>
          </header>

          {/* Experts Grid - Optimized for 6 members */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {EXPERTS.map((expert) => (
              <Link 
                key={expert.slug} 
                href={`/experts/${expert.slug}`}
                className="group relative h-[550px] rounded-[48px] overflow-hidden border border-white/12 bg-neutral-900 hover:border-primary/40 transition-all duration-700 flex flex-col justify-end shadow-2xl"
              >
                {/* Image background */}
                <Image 
                  src={expert.image} 
                  alt={expert.name} 
                  fill 
                  className="object-cover opacity-95 group-hover: group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                
                {/* Info Overlay */}
                <div className="relative p-10 space-y-5">
                   <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white flex items-center gap-3">
                      <Star size={12} className="text-white animate-pulse" /> {expert.role}
                   </div>
                   <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none">{expert.name}</h2>
                   <div className="flex flex-wrap gap-2 pt-2">
                      {expert.specialization.slice(0, 2).map((s) => (
                        <span key={s} className="px-5 py-1.5 bg-white/[0.05] border border-white/20 rounded-full text-[9px] font-bold uppercase text-white">{s}</span>
                      ))}
                   </div>
                   <p className="text-base text-white line-clamp-2 leading-relaxed ">
                      {expert.bio}
                   </p>
                   <div className="pt-8 border-t border-white/20 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-white uppercase tracking-widest">Опыт {expert.experience}</span>
                      <span className="flex items-center gap-3 text-[10px] font-bold text-white uppercase tracking-widest group-hover:gap-6 transition-all">Профиль <ArrowRight size={14} /></span>
                   </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Principles Block - Horizontal Layout */}
          <div className="mt-40 p-12 md:p-20 rounded-[80px] border border-white/12 bg-neutral-900 relative overflow-hidden group hover:bg-white/[0.04] transition-all">
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
             <div className="flex flex-col lg:gap-16 relative z-10">
                <div className="text-3xl md:text-5xl lg:text-6xl font-black leading-[1.1] uppercase tracking-tightest text-white mb-16">
                   Разделяя <span className="text-white ">ответственность</span>, мы гарантируем стабильность вашего бизнеса
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <ShieldCheck size={24} className="text-white" />
                      </div>
                      <h4 className="font-black text-white uppercase text-sm tracking-widest">Коллективная гарантия</h4>
                      <p className="text-sm text-white/70 leading-relaxed font-medium">Вся документация проходит тройную проверку профильными экспертами ЭлитФинанс</p>
                   </div>
                   <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <User size={24} className="text-white" />
                      </div>
                      <h4 className="font-black text-white uppercase text-sm tracking-widest">Узкая специализация</h4>
                      <p className="text-sm text-white/70 leading-relaxed font-medium">Каждый специалист фокусируется в своем сегменте: от налогообложения до 115-ФЗ.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
