"use client";

import { motion, useScroll, useTransform, useInView, animate, AnimatePresence } from "framer-motion";
import Link from "next/link";
import React, { useRef, useEffect, useState } from "react";
import { 
  Building, 
  Calculator, 
  Users, 
  Shield, 
  Banknote, 
  ArrowUpRight, 
  Star, 
  CheckCircle2, 
  Quote,
  Clock,
  MapPin,
  FileCheck,
  ShieldCheck,
  TrendingDown,
  Globe,
  Settings,
  HelpCircle,
  FileText,
  BadgePercent,
  UserCheck,
  ChevronRight,
  Zap,
  Briefcase,
  BookOpen,
  Phone,
  Mail,
  Menu,
  X
} from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { ServiceModal } from "@/components/ServiceModal";
import { Logo } from "@/components/Logo";

const servicesData = [
  {
    id: "buh_ooo_osno",
    slug: "buhgalterskoe-soprovozhdenie-ooo-osno",
    icon: Briefcase,
    title: "ООО (ОСНО)",
    price: "от 20 000 ₽",
    desc: "Комплексный учет для компаний на общей системе налогообложения с НДС.",
    details: [
      "Базовый учет ОСНО: полная защита по 115-ФЗ и банковский комплаенс",
      "НДС: формирование книг, налоговое планирование и законная оптимизация",
      "Защита и аудит: сопровождение налоговых проверок и общение с госорганами",
      "Финансовая ответственность: 100% компенсация штрафов по договору"
    ],
    features: ["Для ООО", "ОСНО / НДС", "Защита 115-ФЗ"],
    benefit: "Берем на себя самую сложную отчетность и полностью страхуем вас от финансовых претензий налоговой."
  },
  {
    id: "buh_ooo_usn",
    slug: "buhgalterskoe-soprovozhdenie-ooo-usn",
    icon: Building,
    title: "ООО (УСН/Патент)",
    price: "от 10 000 ₽",
    desc: "Сопровождение юридических лиц на упрощенной системе налогообложения.",
    details: [
      "УСН/Патент: ведение выписок, КУДиР, начисление зарплаты и взносов",
      "Налоговая оптимизация: подбор лучшего режима и минимизация платежей",
      "Кадровый модуль: оформление сотрудников, включая воинский учет",
      "Поддержка: оперативные ответы за 15 минут в Телеграм-канале портала"
    ],
    features: ["Для ООО", "УСН/Патент", "Безопасность"],
    benefit: "Гарантируем корректность учета и отсутствие переплат по налогам за счет глубокого аудита каждой сделки."
  },
  {
    id: "buh_ip",
    slug: "buhgalterskoe-soprovozhdenie-ip",
    icon: UserCheck,
    title: "ИП",
    price: "от 5 000 ₽",
    desc: "Полное бухгалтерское сопровождение для предпринимателей.",
    details: [
      "Налоговый учет: автоматизация расчетов и своевременная подача деклараций",
      "Банковский комплаенс: защита счетов от блокировок по 115-ФЗ",
      "Доп. услуги: открытие счетов, настройка ЭДО и 1С за наш счет",
      "Консультации: прямая связь с главбухом без автоответчиков"
    ],
    features: ["Для ИП", "Без блокировок", "Выгода x3"],
    benefit: "Освобождаем до 40 часов вашего времени в месяц, полностью закрывая все вопросы с банками и государством."
  },
  {
    id: "hr_full",
    slug: "kadrovyy-uchet",
    icon: Users,
    title: "Кадры",
    price: "от 5 000 ₽",
    desc: "Кадровый учет любой сложности и решение трудовых споров.",
    details: [
      "Прием и увольнение: бережное оформление сложных/конфликтных сотрудников",
      "Документооборот: ТК РФ, локальные акты и воинский учет «под ключ»",
      "Защита: полная подготовка к проверкам инспекции труда и аудит рисков",
      "Расчеты: зарплата, отпускные и больничные без ошибок и задержек"
    ],
    features: ["Для персонала", "Без судов", "Воинский учет"],
    benefit: "Защищаем ваш бизнес от штрафов трудовой инспекции и помогаем увольнять сотрудников без судебных рисков."
  }
];

const faqData = [
  {
    question: "Что выгоднее в 2026 году — штатный бухгалтер или аутсорс?",
    answer: "Аутсорс в среднем на 40% выгоднее штата. По данным ЭлитФинанс, содержание сотрудника включает не только зарплату, но и налоги (30%), аренду места и лицензии 1С/ЭДО. При аутсорсе вы платите только за результат, экономя от 300 000 ₽ в год на одном специалисте."
  },
  {
    question: "Кто платит штрафы при ошибках аутсорсинга бухгалтерии?",
    answer: "Юридически ответственность перед ФНС несет клиент, но профессиональный контракт с ЭлитФинанс включает пункт о полной финансовой ответственности исполнителя. Мы страхуем риски клиентов: если штраф возник по нашей вине, мы компенсируем его в 100% объеме, что зафиксировано в договоре."
  },
  {
    question: "Насколько безопасна передача документов внешней бухгалтерской компании?",
    answer: "Безопасность данных в ЭлитФинанс обеспечивается по банковским стандартам: используется защищенный зашифрованный канал передачи и строгий NDA. Риск утечки данных на аутсорсе ниже, чем внутри компании, благодаря многоуровневым регламентам доступа и облачным технологиям с защитой от сбоев."
  },
  {
    question: "Как организовано ежедневное взаимодействие с бухгалтером на аутсорсе?",
    answer: "Процесс максимально упрощен: вы просто отправляете фото или сканы первички через Telegram или общую папку. Эксперты ЭлитФинанс сами ведут 1С, рассчитывают налоги и напоминают о сроках. Ваше участие требуется только для согласования платежей через ЭДО, что занимает не более 15 минут в неделю."
  },
  {
    question: "Можно ли нанять аутсорсера, если бухгалтерия запущена и есть долги по налогам?",
    answer: "Да, «восстановление учета» — базовая услуга ЭлитФинанс. Мы проводим экспресс-аудит текущего хаоса, выявляем критические ошибки и поэтапно закрываем долги перед налоговой. Это позволяет бизнесу выйти в «белую» зону без остановки операционных процессов и блокировок счетов."
  }
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    // ── Организация ──────────────────────────────────────────────
    {
      "@type": "Organization",
      "@id": "https://elitfinans.online#org",
      "name": "ЭлитФинанс",
      "url": "https://elitfinans.online",
      "telephone": "+79028371370",
      "email": "info@elitfinance.ru",
      "description": "Профессиональное бухгалтерское сопровождение ООО и ИП в России.",
      "foundingDate": "2010",
      "areaServed": { "@type": "Country", "name": "Россия" },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "RU",
        "addressLocality": "Россия"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Консультация",
        "telephone": "+79028371370",
        "email": "info@elitfinance.ru",
        "availableLanguage": "ru",
        "areaServed": "RU",
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
          "opens": "09:00",
          "closes": "18:00"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "127",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": [
        {
          "@type": "Review",
          "author": { "@type": "Person", "name": "Александр Волков" },
          "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
          "reviewBody": "ЭлитФинанс — это не просто аутсорс, а полноценный финансовый отдел. Благодаря им мы привлекли грант на 20 млн рублей.",
          "name": "Гендиректор ТехноСолюшн"
        },
        {
          "@type": "Review",
          "author": { "@type": "Person", "name": "Мария Кравцова" },
          "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
          "reviewBody": "Уже 3 года на обслуживании. Ни одного штрафа, ни одной задержки. Максимальная прозрачность и профессионализм.",
          "name": "Владелец сети ВкусЖизни"
        },
        {
          "@type": "Review",
          "author": { "@type": "Person", "name": "Дмитрий Седов" },
          "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
          "reviewBody": "Лучшее решение для быстрорастущего бизнеса. Помогают с оптимизацией налогов и ведут кадры безупречно.",
          "name": "Основатель стартапа"
        }
      ]
    },

    // ── Главная услуга ────────────────────────────────────────────
    {
      "@type": "AccountingService",
      "@id": "https://elitfinans.online#service",
      "name": "ЭлитФинанс — бухгалтерское сопровождение",
      "description": "Профессиональное бухгалтерское сопровождение ООО и ИП в России. Ведение ОСНО, УСН, кадровый учёт и налоговая оптимизация.",
      "url": "https://elitfinans.online",
      "provider": { "@id": "https://elitfinans.online#org" },
      "areaServed": { "@type": "Country", "name": "Россия" },
      "availableLanguage": "ru",
      "serviceType": "Бухгалтерский аутсорсинг",
      "priceRange": "от 5 000 ₽/мес",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Тарифы бухгалтерского сопровождения",
        "itemListElement": [
          { "@id": "https://elitfinans.online#service-ooo-osno" },
          { "@id": "https://elitfinans.online#service-ooo-usn" },
          { "@id": "https://elitfinans.online#service-ip" },
          { "@id": "https://elitfinans.online#service-kadry" }
        ]
      }
    },

    // ── 4 отдельных услуги с ценами ───────────────────────────────
    {
      "@type": "Service",
      "@id": "https://elitfinans.online#service-ooo-osno",
      "name": "Бухгалтерское сопровождение ООО на ОСНО",
      "description": "Комплексный учёт для компаний на общей системе налогообложения с НДС. Защита по 115-ФЗ, налоговое планирование, сопровождение проверок.",
      "provider": { "@id": "https://elitfinans.online#org" },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "RUB",
        "price": "20000",
        "priceSpecification": { "@type": "UnitPriceSpecification", "minPrice": 20000, "priceCurrency": "RUB" }
      },
      "serviceType": "Бухгалтерия для ООО ОСНО",
      "areaServed": { "@type": "Country", "name": "Россия" }
    },
    {
      "@type": "Service",
      "@id": "https://elitfinans.online#service-ooo-usn",
      "name": "Бухгалтерское сопровождение ООО на УСН/Патенте",
      "description": "Сопровождение юридических лиц на упрощённой системе налогообложения. КУДиР, кадровый модуль, налоговая оптимизация.",
      "provider": { "@id": "https://elitfinans.online#org" },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "RUB",
        "price": "10000",
        "priceSpecification": { "@type": "UnitPriceSpecification", "minPrice": 10000, "priceCurrency": "RUB" }
      },
      "serviceType": "Бухгалтерия для ООО УСН",
      "areaServed": { "@type": "Country", "name": "Россия" }
    },
    {
      "@type": "Service",
      "@id": "https://elitfinans.online#service-ip",
      "name": "Бухгалтерское сопровождение ИП",
      "description": "Полное бухгалтерское сопровождение для предпринимателей. Защита от блокировок по 115-ФЗ, налоговый учёт, консультации.",
      "provider": { "@id": "https://elitfinans.online#org" },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "RUB",
        "price": "5000",
        "priceSpecification": { "@type": "UnitPriceSpecification", "minPrice": 5000, "priceCurrency": "RUB" }
      },
      "serviceType": "Бухгалтерия для ИП",
      "areaServed": { "@type": "Country", "name": "Россия" }
    },
    {
      "@type": "Service",
      "@id": "https://elitfinans.online#service-kadry",
      "name": "Кадровый учёт и HR-сопровождение",
      "description": "Кадровый учёт любой сложности, воинский учёт, защита от трудовых споров, расчёт зарплаты и увольнение сложных сотрудников.",
      "provider": { "@id": "https://elitfinans.online#org" },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "RUB",
        "price": "5000",
        "priceSpecification": { "@type": "UnitPriceSpecification", "minPrice": 5000, "priceCurrency": "RUB" }
      },
      "serviceType": "Кадровый учёт",
      "areaServed": { "@type": "Country", "name": "Россия" }
    },

    // ── Эксперт ───────────────────────────────────────────────────
    {
      "@type": "Person",
      "@id": "https://elitfinans.online#expert",
      "name": "Анна Туманян",
      "jobTitle": "Руководитель ЭлитФинанс, налоговый консультант",
      "description": "Эксперт в области налогообложения и бухгалтерского учёта с 15-летним стажем. Специализация: ОСНО, УСН, налоговая оптимизация, 115-ФЗ.",
      "worksFor": { "@id": "https://elitfinans.online#org" },
      "knowsAbout": ["Налоги РФ", "Бухгалтерский учёт", "115-ФЗ", "ОСНО", "УСН", "ЕНП", "Кадровый учёт", "Налоговая оптимизация"],
      "hasCredential": {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Профессиональный бухгалтер"
      },
      "knowsLanguage": "ru",
      "image": {
        "@type": "ImageObject",
        "url": "https://elitfinans.online/director_hq.png",
        "description": "Анна Туманян — руководитель ЭлитФинанс"
      }
    },

    // ── WebSite + SearchAction ────────────────────────────────────
    {
      "@type": "WebSite",
      "@id": "https://elitfinans.online#website",
      "url": "https://elitfinans.online",
      "name": "ЭлитФинанс",
      "description": "Экспертный бухгалтерский портал для бизнеса",
      "publisher": { "@id": "https://elitfinans.online#org" },
      "inLanguage": "ru",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://elitfinans.online/articles?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },

    // ── FAQ ───────────────────────────────────────────────────────
    {
      "@type": "FAQPage",
      "@id": "https://elitfinans.online#faq",
      "mainEntity": faqData.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    },

    // ── Breadcrumb ────────────────────────────────────────────────
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://elitfinans.online" }
      ]
    }
  ]
};

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const openService = (service: any) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-white selection:text-black">
      {/* AIO/GEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Structural Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-white rounded-full blur-[200px]" />
      </div>

      {/* Form Modals */}
      <ContactForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      <ServiceModal 
        isOpen={isServiceModalOpen} 
        onClose={() => setIsServiceModalOpen(false)} 
        service={selectedService}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-[100] border-b border-white/[0.05] bg-black/50 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-16 xl:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="flex items-center justify-center transition-transform hover:scale-110">
              <Logo size={42} />
            </div>
            <span className="font-bold text-lg xl:text-xl tracking-tighter uppercase">ЭлитФинанс</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
            {[
              { label: "Услуги", href: "/services" },
              { label: "Справочник", href: "/handbook" },
              { label: "Вопросы", href: "/faq" },
              { label: "Новости", href: "/news" },
              { label: "Эксперт", href: "/expert/anna-tumanian" },
            ].map((item: any) => (
              item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <a 
                  key={item.label}
                  href={`#${item.id}`}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors"
                  onClick={(e) => {
                     e.preventDefault();
                     document.getElementById(item.id!)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {item.label}
                </a>
              )
            ))}
          </div>

          <div className="flex items-center gap-4 lg:gap-10">
            <button 
              onClick={() => setIsFormOpen(true)}
              className="px-6 py-2.5 rounded-full bg-[#FFC107] text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all shadow-[0_10px_30_rgba(255,193,7,0.2)]"
            >
              Консультация
            </button>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-white/5 bg-black/95 backdrop-blur-3xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                {[
                  { label: "Услуги", href: "/services" },
                  { label: "Справочник", href: "/handbook" },
                  { label: "Вопросы", href: "/faq" },
                  { label: "Новости", href: "/news" },
                  { label: "Эксперт", href: "/expert/anna-tumanian" },
                ].map((item: any) => (
                  item.href ? (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block text-lg font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : item.onClick ? (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      className="block text-lg font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-primary transition-colors text-left"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <a
                      key={item.label}
                      href={`#${item.id}`}
                      className="block text-lg font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-primary transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMenuOpen(false);
                        document.getElementById(item.id!)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {item.label}
                    </a>
                  )
                ))}
                
                <button 
                  onClick={() => { setIsMenuOpen(false); setIsFormOpen(true); }}
                  className="w-full py-4 rounded-2xl bg-primary text-black font-bold uppercase tracking-[0.2em] text-[11px]"
                >
                  Оставить заявку
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section - Minimalist & Serious */}
      <section className="relative z-10 pt-24 pb-12 xl:pt-32 xl:pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center">
            <div className="lg:col-span-8 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-primary"
              >
                <div className="w-8 h-px bg-primary/30" />
                Профессиональный учет и аудит
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl lg:text-[6.5rem] xl:text-[8rem] font-bold tracking-tightest leading-[0.9] text-white"
              >
                БЕЗУПРЕЧНЫЙ <br /> КОНТРОЛЬ <br /> <span className="text-primary italic">ФИНАНСОВ</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg xl:text-xl text-neutral-400 font-medium max-w-xl leading-relaxed"
              >
                Освободите до 40 часов вашего времени в месяц и забудьте о блокировках счетов. Профессиональное бухгалтерское сопровождение на ОСНО и УСН с полной финансовой ответственностью за каждый рубль вашего бизнеса.
              </motion.p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={() => setIsFormOpen(true)}
                  className="px-8 py-4 xl:px-10 xl:py-5 bg-primary text-black font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-white transition-all flex items-center justify-center gap-3 group shadow-[0_15px_30px_rgba(255,193,7,0.2)]"
                >
                  Консультация <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <a 
                  href="https://max.ru/join/8yIWQTLe3c6kJnLgy_gs2eAVXCEFwly9TqLissFIYNQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 xl:px-10 xl:py-5 bg-white/5 border border-white/10 text-white font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-[#FFC107] hover:text-black transition-all flex items-center justify-center gap-2 group shadow-xl"
                >
                  Наш канал в Макс <Zap size={14} className="group-hover:scale-125 transition-transform" />
                </a>
                <button 
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 xl:px-10 xl:py-5 bg-transparent border border-white/10 text-white font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-white/5 transition-all lg:hidden xl:flex"
                >
                  Наши услуги
                </button>
              </div>
            </div>

            <div className="lg:col-span-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="p-8 rounded-3xl bg-neutral-900/50 border border-white/5 backdrop-blur-sm space-y-8"
              >
                <div className="space-y-2">
                  <div className="text-4xl font-bold tracking-tighter text-primary">0</div>
                  <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-none">Блокировок счетов</div>
                </div>
                <div className="w-full h-px bg-white/5" />
                <div className="space-y-6">
                  {[
                    "15+ лет на рынке",
                    "Среднее время ответа — 15 мин",
                    "Безопасность данных 100%"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="w-2 h-2 rounded-full border border-primary group-hover:bg-primary transition-colors" />
                      <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section id="services" className="relative z-10 px-6 py-20 xl:py-32 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-500">01 / Направления</h2>
            <div className="text-4xl xl:text-6xl font-bold tracking-tightest leading-none">
              КОМПЛЕКСНОЕ <br /> СОПРОВОЖДЕНИЕ.
            </div>
          </div>

          <div className="relative group/slider">
            <style jsx global>{`
              .no-scrollbar::-webkit-scrollbar { display: none; }
              .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            
            <div className="flex overflow-x-auto gap-6 pb-12 snap-x snap-mandatory no-scrollbar px-4 md:px-0 scroll-smooth">
              {servicesData.map((service, i) => (
                <motion.div 
                  key={service.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="flex-none w-[300px] md:w-[450px] h-[650px] snap-center rounded-[48px] bg-[#0F0F0F] border border-white/5 p-8 md:p-12 flex flex-col group/card hover:bg-[#141414] transition-all relative overflow-hidden"
                  onClick={() => openService(service)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
                  
                  <div className="relative z-10 flex-1 flex flex-col">
                     <div className="flex items-start justify-between mb-12">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/5 group-hover/card:scale-110 transition-transform duration-500 shrink-0">
                        <service.icon size={32} strokeWidth={1.5} />
                      </div>
                      {service.price && (
                        <div className="bg-primary text-black text-[10px] font-extrabold uppercase tracking-widest px-6 py-3 rounded-full shadow-[0_10px_30px_rgba(255,193,7,0.3)] whitespace-nowrap">
                          {service.price}
                        </div>
                      )}
                    </div>
                    
                    <div className="min-h-[100px] mb-6 flex flex-col justify-center">
                      <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-tightest text-white leading-[1.1] group-hover/card:text-primary transition-colors line-clamp-2">
                        {service.title}
                      </h3>
                    </div>
                    
                    <div className="min-h-[80px] mb-8">
                      <p className="text-neutral-500 text-sm md:text-base font-medium leading-relaxed line-clamp-3">
                        {service.desc}
                      </p>
                    </div>

                    <div className="flex-1 flex flex-col justify-end">
                      <div className="flex flex-col gap-4 mb-10">
                         {service.details.slice(0, 3).map((detail, idx) => (
                           <div key={idx} className="flex items-start gap-4 text-neutral-400 text-[10px] uppercase font-bold tracking-widest leading-tight opacity-70">
                             <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1 shrink-0" />
                             <span className="line-clamp-2">{detail}</span>
                           </div>
                         ))}
                      </div>

                      <Link
                        href={`/services/${service.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full py-6 rounded-3xl border border-white/10 text-[11px] font-bold uppercase tracking-[0.3em] text-white hover:bg-white hover:text-black transition-all flex items-center justify-center gap-4 group/btn"
                      >
                        Подробнее <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex items-center gap-6 mt-8 opacity-20 group-hover/slider:opacity-100 transition-opacity duration-500">
               <div className="flex-1 h-px bg-white/10" />
               <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-neutral-500 whitespace-nowrap">Листайте для выбора направления</div>
               <div className="flex-1 h-px bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* How We Work Section - From Slide 12 */}
      <section className="relative z-10 px-6 py-20 xl:py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-500">01.1 / Процесс</h2>
            <div className="text-4xl xl:text-6xl font-bold tracking-tightest leading-none">
              КАК МЫ <span className="text-primary italic">РАБОТАЕМ</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Передача документов",
                desc: "Вы передаете первичные документы: счета, акты, накладные, выписки. Мы проверяем их корректность, систематизируем и готовим к обработке, исключая ошибки в учете."
              },
              {
                title: "Ведение учета",
                desc: "На основе документов ведем бухгалтерский и налоговый учет, отражаем все операции в 1С и рассчитываем налоги. Проводим законную оптимизацию нагрузки и контроль данных."
              },
              {
                title: "Отчетность и контроль",
                desc: "Формируем отчетность, проверяем её и вовремя отправляем в госорганы. Сопровождаем по всем возникающим вопросам и следим за актуальностью и безопасностью учета."
              }
            ].map((step, i) => (
              <div key={i} className="relative p-10 rounded-[40px] bg-neutral-900/20 border border-white/5 space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl border border-primary/20">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-white">{step.title}</h3>
                <p className="text-neutral-400 text-sm font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cases Section / Кейсы */}
      <section id="cases" className="relative z-10 px-6 py-24 xl:py-32 border-t border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">02 / Наш опыт</h2>
            <div className="text-4xl xl:text-6xl font-bold tracking-tightest leading-none text-white">
              РЕАЛЬНЫЕ <span className="text-primary italic">РЕЗУЛЬТАТЫ</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              { 
                tag: "Защита бизнеса", 
                title: "Снижение штрафа в 2 раза за 14 дней", 
                desc: "У компании по благоустройству дорог и уборке снега возник штраф 500 000 ₽ из-за некорректных ОКВЭД. Мы предотвратили продажу техники для долгов, снизив штраф вдвое и перенастроив учетные коды.",
                result: "Экономия 250 000 ₽",
                metrics: ["-50% штраф", "ОКВЭД исправлен"]
              },
              { 
                tag: "Кадры", 
                title: "Удачное увольнение сложного сотрудника", 
                desc: "Кейс по экстренному кадровому сопровождению. Необходимо было уволить сотрудника, защищенного законом, без юридических последствий. Проведена процедура «под ключ» без единой претензии.",
                result: "0 судебных рисков",
                metrics: ["100% защита", "Без претензий ГИТ"]
              }
            ].map((caseStudy, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group p-8 xl:p-12 rounded-[40px] bg-neutral-900/40 border border-white/5 hover:border-primary/30 transition-all relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold uppercase tracking-widest">{caseStudy.tag}</span>
                  <ArrowUpRight size={20} className="text-neutral-600 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-2xl xl:text-3xl font-bold mb-6 tracking-tighter text-white">{caseStudy.title}</h3>
                <p className="text-neutral-400 text-sm font-medium leading-relaxed mb-8">{caseStudy.desc}</p>
                <div className="pt-8 border-t border-white/5 flex flex-wrap gap-8">
                  {caseStudy.metrics.map((m, idx) => (
                    <div key={idx}>
                      <div className="text-xl font-bold text-white tracking-widest leading-none mb-1">{m}</div>
                      <div className="text-[8px] font-bold text-neutral-600 uppercase tracking-widest">Метрика успеха</div>
                    </div>
                  ))}
                  <div className="ml-auto text-right">
                    <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 italic">Результат</div>
                    <div className="text-sm font-bold text-white uppercase tracking-tighter">{caseStudy.result}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section / Отзывы и благодарности */}
      <section id="testimonials" className="relative z-10 px-6 py-24 xl:py-32 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary underline underline-offset-8 decoration-primary/30 decoration-2">03 / Говорят партнеры</h2>
            <div className="text-4xl xl:text-7xl font-bold tracking-tightest leading-none text-white uppercase">
              НАМ <span className="text-primary italic">ДОВЕРЯЮТ</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[
               { 
                 name: "Александр Волков", 
                 role: "Гендиректор ТехноСолюшн", 
                 text: "ЭлитФинанс — это не просто аутсорс, а полноценный финансовый отдел. Благодаря им мы привлекли грант на 20 млн рублей.",
                 rating: 5
               },
               { 
                 name: "Мария Кравцова", 
                 role: "Владелец сети 'ВкусЖизни'", 
                 text: "Уже 3 года на обслуживании. Ни одного штрафа, ни одной задержки. Максимальная прозрачность и профессионализм.",
                 rating: 5
               },
               { 
                 name: "Дмитрий Седов", 
                 role: "Основатель ИТ-стартапа", 
                 text: "Лучшее решение для быстрорастущего бизнеса. Помогают с оптимизацией налогов и ведут кадры безупречно.",
                 rating: 5
               }
             ].map((review, i) => (
               <div key={i} className="p-10 rounded-[40px] bg-neutral-900/30 border border-white/5 hover:bg-neutral-900/50 transition-all flex flex-col items-start justify-between">
                  <div className="flex gap-1 mb-8">
                    {[...Array(review.rating)].map((_, idx) => <Star key={idx} size={14} fill="#FFC107" className="text-primary" />)}
                  </div>
                  <Quote size={32} className="text-primary/20 mb-6" />
                  <p className="text-neutral-400 text-sm font-medium leading-[1.6] mb-10 italic">"{review.text}"</p>
                  <div className="mt-auto">
                    <div className="text-lg font-bold text-white tracking-tighter leading-none mb-1">{review.name}</div>
                    <div className="text-[9px] font-bold text-primary uppercase tracking-widest">{review.role}</div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* About Section / Руководитель */}
      <section id="about" className="relative z-10 px-6 py-16 xl:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
           <div className="lg:col-span-6 space-y-12">
             <div className="space-y-4">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">04 / Руководитель</h2>
                <h3 className="text-5xl xl:text-[6.5rem] font-bold tracking-tightest leading-none text-white uppercase">
                  ЛИЧНЫЙ <br /> <span className="text-primary italic">КОНТРОЛЬ</span> <br /> КАЧЕСТВА
                </h3>
             </div>
             
             <div className="space-y-6 text-lg xl:text-xl text-neutral-400 leading-relaxed font-medium">
                <p>
                  Более 15 лет опыта в бухгалтерии и налоговом учете. Специализируется на налогах и законной оптимизации налоговой нагрузки для бизнеса.
                </p>
                <p>
                  Лично контролирует качество отчетности, сложные налоговые вопросы и корректность финансового учета. 
                </p>
                <div className="flex items-center gap-4 text-white">
                   <div className="w-10 h-px bg-primary" />
                   <span className="text-[11px] font-bold uppercase tracking-widest italic">Главный принцип работы:</span>
                </div>
                <p className="italic border-l-2 border-primary/30 pl-6 py-2">
                  «Грамотный учет и законная оптимизация налогов, чтобы предприниматели могли спокойно развивать свой бизнес».
                </p>
             </div>
             
             <div className="grid grid-cols-2 gap-6 pt-8 max-w-sm">
                {[
                  { val: "15+", label: "Лет опыта" },
                  { val: "100%", label: "Безопасность" }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl xl:text-4xl font-bold text-white mb-1 tracking-tighter">{stat.val}</div>
                    <div className="text-[8px] font-bold text-neutral-600 uppercase tracking-widest leading-none">{stat.label}</div>
                  </div>
                ))}
             </div>
           </div>

           <div className="lg:col-span-6 relative">
              <div className="absolute inset-0 bg-primary/20 blur-[150px] -z-10" />
              <div className="aspect-[4/5] rounded-[60px] bg-neutral-900 border border-white/5 relative overflow-hidden group">
                 <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-black via-black/50 to-transparent z-10">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-black font-bold text-xl uppercase">АТ</div>
                        <div className="space-y-1">
                           <div className="text-xl font-bold text-white tracking-widest uppercase">Анна Туманян</div>
                           <div className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none italic">Руководитель «ЭлитФинанс»</div>
                        </div>
                     </div>
                 </div>
                 <img src="/director_hq.png" alt="Анна Туманян — руководитель ЭлитФинанс, налоговый консультант и главный бухгалтер" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              </div>
           </div>
        </div>
      </section>
      {/* FAQ Section - AI Search Engine Magnet */}
      <section className="relative z-10 px-6 py-24 bg-black/50 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">05 / Вопросы и ответы</h2>
            <div className="text-4xl xl:text-6xl font-bold tracking-tightest leading-none text-white">
              ЧАСТО <span className="text-primary italic">СПРАШИВАЮТ</span>
            </div>
          </div>
          
          <div className="space-y-4 mb-10">
            {faqData.map((item, i) => (
              <div key={i} className="border border-white/5 rounded-3xl overflow-hidden bg-neutral-900/20">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 text-left flex items-center justify-between group transition-colors hover:bg-white/[0.02]"
                >
                  <span className="text-sm font-bold uppercase tracking-widest text-neutral-200 group-hover:text-primary transition-colors">
                    {item.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-transform duration-300 ${openFaq === i ? 'rotate-180 bg-primary border-primary' : ''}`}>
                    <ChevronRight size={14} className={openFaq === i ? 'text-black' : 'text-neutral-500'} />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-neutral-400 text-sm leading-relaxed border-t border-white/[0.03]">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-3 px-8 py-4 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:border-primary/40 hover:text-white transition-all"
            >
              Все 20 вопросов и ответов <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 pt-20 pb-10 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">

          {/* Top row — brand + contacts */}
          <div className="flex flex-col lg:flex-row justify-between gap-10 mb-16">
            <div className="max-w-xs space-y-4">
              <div className="flex items-center gap-3">
                <Logo size={32} />
                <span className="font-bold text-lg tracking-tighter uppercase">ЭлитФинанс</span>
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Профессиональное бухгалтерское сопровождение ООО и ИП в России. ОСНО, УСН, кадровый учёт, защита по 115-ФЗ.
              </p>
              <div className="space-y-2 pt-2">
                <a href="tel:+79028371370" className="flex items-center gap-2 text-sm text-neutral-400 hover:text-primary transition-colors">
                  <Phone size={14} className="text-primary shrink-0" />
                  +7 (902) 837-13-70
                </a>
                <a href="mailto:info@elitfinance.ru" className="flex items-center gap-2 text-sm text-neutral-400 hover:text-primary transition-colors">
                  <Mail size={14} className="text-primary shrink-0" />
                  info@elitfinance.ru
                </a>
                <a href="https://max.ru/join/8yIWQTLe3c6kJnLgy_gs2eAVXCEFwly9TqLissFIYNQ" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-neutral-400 hover:text-primary transition-colors">
                  <Zap size={14} className="text-primary shrink-0" />
                  Написать в Макс
                </a>
              </div>
            </div>

            {/* Nav columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10">

              {/* Услуги */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-5">Услуги</p>
                <ul className="space-y-3">
                  {[
                    { label: "ООО на ОСНО", href: "/services/buhgalterskoe-soprovozhdenie-ooo-osno" },
                    { label: "ООО на УСН", href: "/services/buhgalterskoe-soprovozhdenie-ooo-usn" },
                    { label: "Бухгалтерия ИП", href: "/services/buhgalterskoe-soprovozhdenie-ip" },
                    { label: "Кадровый учёт", href: "/services/kadrovyy-uchet" },
                    { label: "Все услуги", href: "/#services" },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-neutral-500 hover:text-white transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Справочник */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-5">Справочник</p>
                <ul className="space-y-3">
                  {[
                    { label: "ЕНП", href: "/handbook/enp" },
                    { label: "УСН", href: "/handbook/usn" },
                    { label: "ОСНО", href: "/handbook/osno" },
                    { label: "НДС", href: "/handbook/nds" },
                    { label: "115-ФЗ", href: "/handbook/115-fz" },
                    { label: "Весь справочник", href: "/handbook" },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-neutral-500 hover:text-white transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Вопросы */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-5">Вопросы</p>
                <ul className="space-y-3">
                  {[
                    { label: "УСН 6% или 15%?", href: "/faq/usn-6-ili-15-chto-vygodnee" },
                    { label: "Аутсорс vs штат", href: "/faq/shtaatnyy-buhgalter-ili-autorsing" },
                    { label: "Требование ФНС", href: "/faq/chto-delat-trebovanie-fns" },
                    { label: "Блокировка счёта", href: "/faq/chto-delat-bank-zablokiroval-schet" },
                    { label: "Все вопросы", href: "/faq" },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-neutral-500 hover:text-white transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Материалы */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-5">Материалы</p>
                <ul className="space-y-3">
                  {[
                    { label: "Новости", href: "/news" },
                    { label: "Статьи", href: "/articles" },
                    { label: "Справочник", href: "/handbook" },
                    { label: "Эксперт", href: "/expert/anna-tumanian" },
                    { label: "О компании", href: "/#about" },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-neutral-500 hover:text-white transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-[10px] uppercase font-bold tracking-widest text-neutral-600">
              © 2026 ЭлитФинанс — Все права защищены
            </div>
            <div className="flex items-center gap-6">
              <Link href="/expert/anna-tumanian" className="text-[10px] uppercase font-bold tracking-widest text-neutral-600 hover:text-primary transition-colors">
                Анна Туманян
              </Link>
              <Link href="/faq" className="text-[10px] uppercase font-bold tracking-widest text-neutral-600 hover:text-primary transition-colors">
                Вопросы и ответы
              </Link>
              <Link href="/handbook" className="text-[10px] uppercase font-bold tracking-widest text-neutral-600 hover:text-primary transition-colors">
                Справочник
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
