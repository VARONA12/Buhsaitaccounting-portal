export const revalidate = 300;

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  ChevronRight, 
  ArrowLeft,
  CheckCircle2, 
  Quote, 
  ShieldCheck, 
  Banknote,
  Star,
  Zap
} from "lucide-react";
import { EXPERTS } from "@/lib/experts-data";
import { Logo } from "@/components/Logo";
import { ContactButtonFull } from "@/components/ContactButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ExpertDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const expert = EXPERTS.find((e) => e.slug === slug);

  if (!expert) notFound();

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans selection:bg-primary-dark/80 selection:text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full z-[100] border-b border-white/12 bg-neutral-900/70 backdrop-blur-3xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 xl:h-20 flex items-center justify-between">
          <Link href="/experts" className="flex items-center gap-4 group">
            <div className="transition-transform group-hover:scale-110">
              <Logo size={40} />
            </div>
            <span className="font-bold text-lg xl:text-xl tracking-tighter uppercase text-white leading-none">
              ЭлитФинанс
            </span>
          </Link>
          <Link
            href="/experts"
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:text-white transition-all"
          >
            <ArrowLeft size={14} /> Все эксперты
          </Link>
        </div>
      </nav>

      <main className="pt-28 pb-40 px-6 md:pt-40">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-12">
            <ol className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white flex-wrap">
              <li><Link href="/" className="hover:text-white transition-colors">Главная</Link></li>
              <li><ChevronRight size={10} /></li>
              <li><Link href="/experts" className="hover:text-white transition-colors">Эксперты</Link></li>
              <li><ChevronRight size={10} /></li>
              <li className="text-white">{expert.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
            {/* Left Col: Sticky Image Profile */}
            <div className="lg:col-span-4 lg:sticky lg:top-40 h-fit">
              <div className="relative aspect-[4/5] rounded-[64px] overflow-hidden bg-neutral-900 border border-white/12 shadow-2xl group">
                <Image
                  src={expert.image}
                  alt={expert.name}
                  fill
                  style={expert.slug === "elvira-specialist" ? { objectPosition: "center 5%" } : undefined}
                  className="object-cover opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
              </div>
              
              <div className="mt-8 space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    {expert.achievements.map((ach) => (
                       <div key={ach.label} className="p-6 rounded-[32px] bg-neutral-900 border border-white/12 shadow-sm group hover:bg-white/[0.04] transition-all">
                          <p className="text-2xl font-black text-white mb-1 uppercase tracking-tight leading-none">{ach.value}</p>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-white leading-tight">{ach.label}</p>
                       </div>
                    ))}
                 </div>
                 <ContactButtonFull label="Консультация эксперта" />
              </div>
            </div>

            {/* Right Col: Info */}
            <div className="lg:col-span-8 space-y-16">
               <div className="space-y-10">
                  <div className="flex flex-wrap items-center gap-5">
                     {expert.experience && <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/40 text-white text-[10px] font-bold uppercase tracking-widest leading-none">{expert.experience} опыта</span>}
                     {expert.experience && <span className="w-1.5 h-1.5 rounded-full bg-white/10" />}
                     <span className="text-[10px] font-bold uppercase tracking-widest text-white">{expert.role}</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tightest leading-[1.05] uppercase text-white">
                     {expert.name.split(' ')[0]} <br /> <span className="text-white ">{expert.name.split(' ')[1]}</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-white leading-relaxed max-w-2xl font-medium  mb-10">
                     {expert.bio}
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                     {expert.specialization.map((s) => (
                        <div key={s} className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-neutral-900 border border-white/12 text-[10px] font-bold text-white uppercase tracking-widest transition-all hover:bg-white/[0.05] hover:border-primary/40 hover:text-white">
                           <Star size={12} className="text-white" /> {s}
                        </div>
                     ))}
                  </div>
               </div>

               {/* Mission block */}
               <div className="p-12 md:p-16 rounded-[64px] bg-neutral-900 border border-white/12 relative overflow-hidden group hover:bg-white/[0.04] transition-all">
                  <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none transition-opacity group-hover:opacity-10">
                     <Quote size={100} className="text-white" />
                  </div>
                  <div className="flex items-center gap-3 mb-10 text-white font-bold uppercase text-[10px] tracking-[0.4em]">
                    <Zap size={16} className="animate-pulse" /> МИССИЯ ЭКСПЕРТА
                  </div>
                  <div className="space-y-8 text-white font-medium leading-relaxed text-xl ">
                     <p>«В бухгалтерии нет мелочей: каждая проводка и каждая строчка в уставе — это фундамент вашей финансовой безопасности.»</p>
                     <p>Работа в команде ЭлитФинанс позволяет {expert.name.split(' ')[0]} использовать коллективный аудит и системные аналитические инструменты, обеспечивая клиентам защиту высшего уровня в ИИ-эпоху.</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-10 rounded-[48px] border border-white/12 bg-neutral-900 space-y-4 shadow-xl group hover:border-primary/40 transition-all">
                     <ShieldCheck className="text-white" size={32} />
                     <h4 className="font-black text-white uppercase text-sm tracking-widest">Гарантия точности</h4>
                     <p className="text-xs text-white leading-relaxed font-medium">Личная ответственность специалиста подкрепляется системой качества ЭлитФинанс</p>
                  </div>
                  <div className="p-10 rounded-[48px] border border-white/12 bg-neutral-900 space-y-4 shadow-xl group hover:border-primary/40 transition-all">
                     <Banknote className="text-white" size={32} />
                     <h4 className="font-black text-white uppercase text-sm tracking-widest">Оптимизация налогов</h4>
                     <p className="text-xs text-white leading-relaxed font-medium">Использование только легальных методов снижения налоговой нагрузки для вашего масштабирования</p>
                  </div>
               </div>
            </div>
          </div>
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
