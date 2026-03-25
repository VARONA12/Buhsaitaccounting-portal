export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/Footer";
import {
  Building,
  Users,
  ArrowUpRight,
  ChevronRight,
  Zap,
  Briefcase,
  BookOpen,
  BadgePercent,
  TrendingUp,
  ShieldCheck,
  Globe,
  MessageSquare,
  Newspaper,
  Clock,
  Tag,
  Calendar,
  LayoutDashboard,
  Database,
  HelpCircle
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { AeoNav } from "@/components/AeoNav";
import { AeoModals } from "@/components/AeoModals";
import { ContactButton } from "@/components/ContactButton";
import { EXPERTS } from "@/lib/experts-data";

export const metadata: Metadata = {
  title: "ЭлитФинанс — бухгалтерский аутсорсинг для ООО и ИП с финансовой ответственностью",
  description: "Профессиональный бухгалтерский аутсорсинг для ООО и ИП в России. ОСНО, УСН, кадры. 100% финансовая ответственность по договору. Опыт команды — более 70 лет.",
  alternates: { canonical: "https://elitfinans.online" },
  openGraph: {
    title: "ЭлитФинанс — бухгалтерский аутсорсинг с финансовой ответственностью",
    description: "Профессиональная защита бизнеса: ОСНО, УСН, кадры, 115-ФЗ. 20+ партнеров. 0 блокировок.",
    url: "https://elitfinans.online",
    siteName: "ЭлитФинанс",
    locale: "ru_RU",
    type: "website",
    images: [{ url: "https://elitfinans.online/director_hq.png", width: 1200, height: 630 }],
  },
};

const servicesData = [
  {
    id: "buh_ooo_osno",
    slug: "buhgalterskoe-soprovozhdenie-ooo-osno",
    icon: Briefcase,
    title: "ООО (ОСНО)",
    price: "от 20 000 ₽",
    desc: "Полное бухгалтерское сопровождение и сдача отчетности для организаций на общей системе (ОСНО/НДС).",
    details: [
      "Базовый учет ОСНО: полная защита по 115-ФЗ и банковский комплаенс",
      "НДС: формирование книг, налоговое планирование и законная оптимизация",
    ],
    features: ["Для ООО", "ОСНО / НДС", "Защита 115-ФЗ"],
    benefit: "Берем на себя самую сложную отчетность и экономим до 1.2 млн ₽ в год."
  },
  {
    id: "buh_ooo_usn",
    slug: "buhgalterskoe-soprovozhdenie-ooo-usn",
    icon: Building,
    title: "ООО (УСН/Патент)",
    price: "от 10 000 ₽",
    desc: "Полное бухгалтерское сопровождение и сдача отчетности для организаций на УСН и патенте.",
    details: [
      "УСН/Патент: ведение выписок, КУДиР, начисление зарплаты",
    ],
    features: ["Для ООО", "УСН/Патент", "Безопасность"],
    benefit: "Снижаем налоговую нагрузку на 15-20% через ежеквартальный аудит."
  },
  {
    id: "buh_ip",
    slug: "buhgalterskoe-soprovozhdenie-ip",
    icon: TrendingUp,
    title: "ИП",
    price: "от 5 000 ₽",
    desc: "Полное бухгалтерское сопровождение и сдача отчетности для индивидуальных предпринимателей (ИП).",
    details: [
      "Налоговый учет: автоматизация расчетов и подача деклараций",
    ],
    features: ["Для ИП", "Без блокировок", "Выгода x3"],
    benefit: "Сокращаем расходы на бухгалтерию в 3 раза."
  },
  {
    id: "hr_full",
    slug: "kadrovyy-uchet",
    icon: Users,
    title: "Кадры",
    price: "от 5 000 ₽",
    desc: "Полное кадровое сопровождение и сдача отчетности по персоналу любой сложности.",
    details: [
      "Прием и увольнение: оформление сложных сотрудников",
    ],
    features: ["Для персонала", "Без судов", "Воинский учет"],
    benefit: "Защищаем вас от штрафов до 500 000 ₽."
  }
];

const faqData = [
  {
    question: "Что выгоднее в 2026 году — штатный бухгалтер или аутсорс?",
    answer: "Аутсорс в среднем на 40% выгоднее штата. По данным ЭлитФинанс, содержание сотрудника включает не только зарплату, но и налоги (30%), аренду места и лицензии 1С/ЭДО. При аутсорсе вы платите только за результат, экономя от 300 000 ₽ в год."
  },
  {
    question: "Кто платит штрафы при ошибках аутсорсинга бухгалтерии?",
    answer: "Профессиональный контракт с ЭлитФинанс включает пункт о полной финансовой ответственности исполнителя. Мы страхуем риски: если штраф возник по нашей вине, мы компенсируем его в 100% объеме."
  },
  {
    question: "Насколько безопасна передача финансовых документов внешней бухгалтерии?",
    answer: "При работе с ЭлитФинанс риск утечки данных ниже, чем внутри компании: защищённые каналы передачи, NDA, облачное хранение с резервным копированием. Все сотрудники подписывают соглашение о неразглашении."
  },
  {
    question: "Как организовано взаимодействие с бухгалтером на аутсорсе?",
    answer: "Вы отправляете фото или сканы документов в Telegram — бухгалтер сам вносит в 1С, рассчитывает налоги и напоминает о сроках. Ваше участие в операционном учёте — не более 15 минут в неделю."
  }
];

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "AccountingService",
  "@id": "https://elitfinans.online#org",
  "name": "ЭлитФинанс",
  "url": "https://elitfinans.online",
  "logo": "https://elitfinans.online/logo.png",
  "image": "https://elitfinans.online/director_hq.png",
  "description": "Профессиональный бухгалтерский аутсорсинг для ООО и ИП в России с 100% финансовой ответственностью по договору.",
  "foundingDate": "2010",
  "numberOfEmployees": { "@type": "QuantitativeValue", "value": 20 },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "RU",
    "addressLocality": "Москва"
  },
  "telephone": "+79028371370",
  "sameAs": [
    "https://vk.com/elitfinans"
  ],
  "knowsAbout": [
    "Бухгалтерский учёт",
    "Налоговое планирование",
    "ОСНО",
    "УСН",
    "ЕНП",
    "115-ФЗ",
    "Кадровый учёт",
    "Налоговая оптимизация",
    "Аутсорсинг бухгалтерии"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Бухгалтерские услуги",
    "itemListElement": servicesData.map(s => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "AccountingService",
        "name": s.title,
        "description": s.desc
      },
      "price": s.price.replace(/[^0-9]/g, ''),
      "priceCurrency": "RUB"
    }))
  }
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqData.map(f => ({
    "@type": "Question",
    "name": f.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": f.answer
    }
  }))
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans selection:bg-primary-dark/80 selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <AeoNav />
      <AeoModals />

      {/* Hero Section - Reverted to Dark Premium */}
      <section className="relative pt-24 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Glowing background decorations */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-5%] w-[400px] h-[400px] bg-primary-dark/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-[40%] left-[60%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-12 space-y-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tighter leading-[1.05] text-white uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] max-w-5xl">
                ОТВЕЧАЕМ ЗА <br /> ШТРАФЫ <span className="text-white contrast-125">СВОИМИ ДЕНЬГАМИ</span>
              </h1>

              <p className="text-lg md:text-xl text-white font-medium leading-relaxed max-w-3xl">
                Профессиональная финансовая защита вашего бизнеса с коллективной ответственностью команды экспертов <span className="text-white font-bold">ЭлитФинанс</span>
              </p>


              <div className="flex flex-col sm:flex-row gap-6">
                <Link
                  href="/services"
                  className="px-10 py-6 bg-primary text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-white hover:text-white transition-all shadow-lg flex items-center justify-center gap-3 group"
                >
                  Все услуги <ArrowUpRight size={14} />
                </Link>
                <ContactButton
                  label="Задать вопрос эксперту"
                  className="px-10 py-6 border border-white/20 bg-white/10 text-white font-black uppercase text-[10px] tracking-[0.4em] rounded-2xl hover:bg-white hover:text-white transition-all flex items-center justify-center gap-3 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid - Dark Aesthetics */}
      <section className="py-24 px-6 bg-neutral-950" id="services">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-white">Портфель услуг</h2>
                </div>
                <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] uppercase text-white">Что входит <br /> в <span className="text-white">аутсорсинг</span> бухгалтерии?</h3>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesData.map((service) => (
              <div 
                key={service.id} 
                className="group p-8 md:p-10 rounded-[48px] bg-neutral-900 border border-white/12 hover:border-primary/30 transition-all flex flex-col h-full shadow-lg"
              >
                <div className="w-14 h-14 rounded-2xl bg-neutral-900 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                  <service.icon size={22} className="text-white group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xl font-bold mb-3 uppercase tracking-tight text-white leading-tight">{service.title}</h4>
                <p className="text-white text-sm leading-relaxed mb-8 flex-1">{service.desc}</p>
                <div className="pt-8 border-t border-white/12 space-y-5">
                  <p className="text-2xl font-bold text-white">{service.price}</p>
                  <Link href={`/services/${service.slug}`} className="text-[9px] font-bold uppercase tracking-[0.4em] text-white flex items-center gap-2 group-hover:gap-4 transition-all">
                    ПОДРОБНЕЕ <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EEAT: Our Experts Preview - NEW Section */}
      <section className="py-24 px-6 bg-neutral-950">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
               <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white">Ключевая экспертиза</p>
                  <h3 className="text-4xl md:text-6xl font-black uppercase text-white">Кто ведёт <br /> учёт вашего <span className="text-white">бизнеса?</span></h3>
               </div>
               <Link href="/experts" className="text-[10px] font-bold uppercase tracking-[0.3em] text-white hover:text-white transition-colors border-b border-white/12 pb-1">
                 Смотреть всех экспертов →
               </Link>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {EXPERTS.slice(0, 6).map((expert) => (
                 <Link key={expert.slug} href={`/experts/${expert.slug}`} className="group p-8 rounded-[48px] border border-white/12 bg-neutral-900 hover:bg-neutral-900/50 transition-all block">
                    <div className="flex items-center gap-5 mb-6">
                       <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-white/12 flex items-center justify-center text-white group-hover:scale-110 transition-transform overflow-hidden relative">
                          <Image src={expert.image} alt={expert.name} fill className="object-cover" sizes="64px" />
                       </div>
                       <div>
                          <p className="font-bold text-lg text-white group-hover:text-white transition-colors uppercase tracking-tight">{expert.name}</p>
                          <p className="text-[10px] uppercase font-bold text-white tracking-widest">{expert.role}</p>
                       </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-white/12">
                       <span className="text-[9px] font-bold text-white uppercase tracking-widest">{expert.experience} опыта в РФ</span>
                       <ChevronRight size={14} className="text-white group-hover:text-white transition-colors" />
                    </div>
                 </Link>
               ))}
            </div>
         </div>
      </section>

      {/* Social Proof: Cases Section - NEW */}
      <section className="py-24 px-6 bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white">Реальный опыт</p>
              <h3 className="text-4xl md:text-6xl font-black uppercase text-white">Как мы <br /> решаем <span className="text-white">проблемы?</span></h3>
            </div>
            <Link href="/cases" className="text-[10px] font-bold uppercase tracking-[0.3em] text-white hover:text-white transition-colors border-b border-white/12 pb-1">
              Смотреть все кейсы →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/cases#okved-shtraf" className="group p-10 rounded-[56px] border border-white/12 bg-neutral-900 hover:bg-neutral-900/50 transition-all block space-y-8">
              <div className="flex justify-between items-start">
                <div className="px-4 py-1.5 rounded-full border border-white/20 bg-white/[0.04] text-[9px] font-bold uppercase tracking-widest text-white">Налоги и штрафы</div>
                <div className="text-3xl font-black text-white">−250 000 ₽</div>
              </div>
              <h4 className="text-xl font-bold text-white uppercase tracking-tight leading-tight">Снижение штрафа ФНС вдвое за ошибки в ОКВЭД</h4>
              <p className="text-white/60 text-sm leading-relaxed">Клиент получил претензию на 500 тыс. руб. Мы подготовили возражения и исправили реестр. Бизнес сохранён.</p>
              <div className="pt-6 border-t border-white/12 flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-white">
                Подробнее <ArrowUpRight size={14} />
              </div>
            </Link>
            
            <Link href="/cases#uvolneniye" className="group p-10 rounded-[56px] border border-white/12 bg-neutral-900 hover:bg-neutral-900/50 transition-all block space-y-8">
              <div className="flex justify-between items-start">
                <div className="px-4 py-1.5 rounded-full border border-white/20 bg-white/[0.04] text-[9px] font-bold uppercase tracking-widest text-white">Кадровое дело</div>
                <div className="text-3xl font-black text-white">0 ₽ риск</div>
              </div>
              <h4 className="text-xl font-bold text-white uppercase tracking-tight leading-tight">Увольнение конфликтного сотрудника без судов</h4>
              <p className="text-white/60 text-sm leading-relaxed">Помогли владельцу расстаться с токсичным персоналом строго по ТК РФ. Ни одной претензии от ГИТ.</p>
              <div className="pt-6 border-t border-white/12 flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-white">
                Подробнее <ArrowUpRight size={14} />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Expertise Block - Premium Dark Glass */}
      <section className="py-24 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="space-y-16">
               <div className="space-y-8">
                  <h3 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.05] uppercase text-white">
                     ПОЧЕМУ 20+ КОМПАНИЙ <br className="hidden lg:block"/> ДОВЕРЯЮТ ЭЛИТФИНАНС СВОЙ БИЗНЕС?
                  </h3>
                  <p className="text-white/70 text-lg font-medium max-w-3xl leading-relaxed ">
                     Мы берем на себя 100% ответственности за ошибки. Если возник штраф по нашей вине — мы платим его сами. Никаких «звёздочек» в договоре.
                  </p>
               </div>
               
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20">
                  {[
                     { val: "15 ЛЕТ", label: "ЭКСПЕРТИЗЫ" },
                     { val: "20+", label: "ПАРТНЕРОВ" },
                     { val: "0", label: "БЛОКИРОВОК" },
                     { val: "100%", label: "ФИНАНСОВАЯ БЕЗОПАСНОСТЬ" }
                  ].map((s, i) => (
                     <div key={i} className="space-y-3">
                        <div className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none">{s.val}</div>
                        <div className="text-[10px] md:text-[11px] font-bold text-white/40 uppercase tracking-[0.4em]">{s.label}</div>
                     </div>
                  ))}
               </div>
            </div>
            </div>
      </section>

      {/* FAQ Discoverability - Dark mode glass */}
      <section className="py-24 px-6 bg-neutral-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-white">Информационный центр</h2>
            <h3 className="text-4xl md:text-5xl font-black uppercase text-white">Вопросы и Ответы</h3>
          </div>
          <div className="space-y-5">
            {faqData.map((faq, i) => (
              <div key={i} className="p-8 md:p-12 rounded-[40px] border border-white/12 bg-neutral-900 shadow-xl hover:bg-white/[0.05] transition-all duration-500">
                 <h4 className="text-lg md:text-xl font-bold text-white mb-4 uppercase tracking-tight">{faq.question}</h4>
                 <p className="text-white text-sm md:text-base leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
             <Link href="/faq" className="px-10 py-5 border border-white/20 bg-white/10 text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-2xl hover:bg-primary hover:text-white transition-all shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                Архив экспертных ответов →
             </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
