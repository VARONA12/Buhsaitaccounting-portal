import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@/components/Logo';
import { ShieldCheck, Award, TrendingUp, Users, MapPin, Mail, Phone, ArrowLeft, ArrowRight, UserCheck, ChevronRight, Zap } from 'lucide-react';
import { ContactButtonFull } from '@/components/ContactButton';

export const metadata: Metadata = {
  title: 'О компании ЭлитФинанс — Команда экспертов',
  description: 'Познакомьтесь с командой ЭлитФинанс. 15 лет суммарного опыта в бухгалтерии и налогах, коллективная финансовая ответственность и гарантия результатов.',
  openGraph: {
    title: 'О компании ЭлитФинанс',
    description: 'Надежный партнер для вашего бизнеса с коллективной экспертизой.',
    url: 'https://elitfinans.online/about',
    siteName: 'ЭлитФинанс',
    locale: 'ru_RU',
    type: 'website',
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ЭлитФинанс",
  "url": "https://elitfinans.online",
  "founder": {
    "@type": "Person",
    "name": "Анна Туманян",
    "jobTitle": "Главный Аудитор"
  },
  "description": "Центр коллективной экспертизы в области налогов и бухгалтерского сопровождения бизнеса.",
  "knowsAbout": ["Налоги РФ", "Бухгалтерия ООО", "Оптимизация ИП", "115-ФЗ"],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Москва",
    "addressCountry": "RU"
  }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans selection:bg-primary-dark/80 selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />
      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full z-[100] border-b border-white/12 bg-neutral-900/70 backdrop-blur-3xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 xl:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="transition-transform group-hover:scale-110">
              <Logo size={40} />
            </div>
            <span className="font-bold text-lg xl:text-xl tracking-tighter uppercase text-white leading-none">ЭлитФинанс</span>
          </Link>
          <Link href="/" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft size={14} /> На главную
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-40 px-6 md:pt-48">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-24 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.5em] text-white">
               <Zap size={16} className="animate-pulse" /> ИСТОРИЯ И ЦЕННОСТИ
            </div>
            <h1 className="text-4xl md:text-5xl xl:text-8xl font-black tracking-tightest leading-[1.05] text-white uppercase max-w-5xl">
              КОЛЛЕКТИВНАЯ <br className="hidden md:block" />
              <span className="text-white  text-glow">ОТВЕТСТВЕННОСТЬ</span>
            </h1>
            <p className="text-xl md:text-2xl text-white max-w-3xl leading-relaxed font-medium ">
              ЭлитФинанс — это синергия опыта бухгалтеров-практиков и налоговых юристов. Мы защищаем ваш бизнес, используя суммарный интеллект всей команды.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-20">
              <section className="prose prose-invert max-w-none text-white leading-relaxed text-[19px] font-medium  border-l-2 border-primary/40 pl-10">
                <p>
                  В современном мире налогового контроля один эксперт не может знать всё. Именно поэтому мы отошли от модели «единого лидера» к модели <strong>Центра Коллективной Экспертизы</strong>.
                </p>
                <p>
                  Каждое решение, каждая декларация и каждая сделка проходят внутренний аудит. Если закон меняется, мы адаптируем процессы мгновенно, гарантируя, что ваш учет всегда соответствует актуальным нормам 2026 года.
                </p>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 {[
                   { title: "Командный опыт", desc: "Суммарно более 40 лет стажа в налогах и праве", icon: Award },
                   { title: "Юридическая чистота", desc: "Все документы верифицируются юристами", icon: ShieldCheck },
                   { title: "Технологичность", desc: "Интеграция ИИ для мониторинга рисков 115-ФЗ", icon: Users },
                   { title: "Финансовый щит", desc: "Страхование ответственности по каждому договору", icon: TrendingUp }
                 ].map((stat, i) => (
                   <div key={i} className="p-10 rounded-[48px] bg-neutral-900 border border-white/12 flex flex-col gap-6 hover:border-primary/40 transition-all duration-500 shadow-xl group">
                     <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <stat.icon size={26} className="text-white" />
                     </div>
                     <div className="space-y-3">
                       <div className="text-xl font-black text-white uppercase tracking-tight leading-none">{stat.title}</div>
                       <div className="text-sm text-white leading-relaxed font-medium">{stat.desc}</div>
                     </div>
                   </div>
                 ))}
              </div>

              {/* Team Block - Premium Bento Dark */}
              <section className="p-12 md:p-20 rounded-[80px] bg-neutral-900 border border-white/12 relative overflow-hidden group hover:bg-white/[0.04] transition-all duration-700 shadow-2xl">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
                   <div className="flex -space-x-8 shrink-0">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] bg-neutral-900 border-4 border-black ring-2 ring-white/5 overflow-hidden relative hover: transition-all duration-1000 shadow-2xl">
                           <Image src={`https://images.unsplash.com/photo-${i === 1 ? '1573496359142-b8d87734a5a2' : i === 2 ? '1560250097-0b93528c311a' : '1551836022-d5d8b5c828db'}?q=80&w=200&auto=format&fit=crop`} alt="Expert" fill className="object-cover opacity-80" />
                        </div>
                      ))}
                   </div>
                   <div className="space-y-6 text-left">
                      <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white">РЕСУРСЫ ЭЛИТФИНАНС</div>
                      <h2 className="text-3xl md:text-5xl font-black tracking-tightest text-white uppercase leading-none">НАШИ <br /> СПЕЦИАЛИСТЫ</h2>
                      <p className="text-lg text-white leading-relaxed font-medium ">
                        Мы собрали лучших экспертов: от налогообложения до банковского комплаенса и кадровых аудитов. У каждого эксперта ЭлитФинанс своя зона ответственности.
                      </p>
                      <Link href="/experts" className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white hover:text-white transition-all group">
                        ВЕСЬ СОСТАВ ЭКСПЕРТОВ <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                      </Link>
                   </div>
                </div>
              </section>
            </div>

            {/* Sidebar / Contact Info */}
            <aside className="lg:col-span-4 space-y-8">
              <div className="p-10 rounded-[56px] bg-neutral-900 border border-white/12 shadow-[0_0_80px_rgba(0,0,0,0.5)] space-y-10 sticky top-40">
                 <div className="flex items-center gap-4 pb-8 border-b border-white/12">
                    <UserCheck className="text-white" size={24} />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">КОНТАКТЫ ОФИСА</h3>
                 </div>
                 <ul className="space-y-8">
                   <li>
                     <a href="tel:+79028371370" className="flex items-start gap-5 text-white hover:text-white transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300"><Phone size={20} /></div>
                        <div>
                          <div className="text-[10px] uppercase font-bold tracking-widest text-white mb-1">Телефон</div>
                          <div className="text-lg font-black text-white tracking-tight">+7 (902) 837-13-70</div>
                        </div>
                     </a>
                   </li>
                   <li>
                     <a href="mailto:info@elitfinance.ru" className="flex items-start gap-5 text-white hover:text-white transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300"><Mail size={20} /></div>
                        <div>
                          <div className="text-[10px] uppercase font-bold tracking-widest text-white mb-1">Email</div>
                          <div className="text-lg font-black text-white tracking-tight">info@elitfinance.ru</div>
                        </div>
                     </a>
                   </li>
                   <li>
                      <div className="flex items-start gap-5 text-white group">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 text-white group-hover:text-white transition-colors"><MapPin size={20} /></div>
                        <div>
                          <div className="text-[10px] uppercase font-bold tracking-widest text-white mb-1">Локация</div>
                          <div className="text-lg font-black text-white tracking-tight uppercase">РФ / ОНЛАЙН</div>
                          <div className="text-[10px] text-white mt-2 font-bold uppercase tracking-widest opacity-95">Работаем через ЭДО</div>
                        </div>
                      </div>
                   </li>
                 </ul>
                 
                 <div className="pt-8 space-y-4">
                    <ContactButtonFull label="ЗАЯВКА ЭКСПЕРТУ" />
                    <Link href="/experts" className="flex items-center justify-center gap-3 w-full py-5 border border-white/20 text-white font-bold text-[10px] uppercase tracking-widest rounded-2xl hover:text-white hover:border-white transition-all">
                      СПИСОК КОМАНДЫ <ChevronRight size={14} />
                    </Link>
                 </div>
              </div>
            </aside>
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
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white">© 2026 ЭЛИТФИНАНС / МОСКВА</div>
         </div>
      </footer>
    </div>
  );
}
