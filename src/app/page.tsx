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
    {
      "@type": "AccountingService",
      "@id": "https://elitefinance.pro/#service",
      "name": "ЭлитФинанс",
      "description": "Профессиональное бухгалтерское сопровождение ООО и ИП в России. Ведение ОСНО, УСН, кадровый учет и налоговая оптимизация.",
      "url": "https://elitefinance.pro",
      "telephone": "+79028371370",
      "priceRange": "₽₽",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "RU"
      },
      "founder": {
        "@type": "Person",
        "name": "Анна Туманян",
        "jobTitle": "Руководитель ЭлитФинанс",
        "description": "Эксперт в области налогообложения и бухгалтерского учета с 15-летним стажем."
      }
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
          
          <div className="hidden lg:flex items-center gap-10">
            {[
              { label: "Услуги", id: "services" },
              { label: "Кейсы", id: "cases" },
              { label: "Отзывы", id: "testimonials" },
              { label: "О компании", id: "about" },
              { label: "Новости", href: "/news" },
              { label: "Статьи", href: "/articles" }
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
                  { label: "Услуги", id: "services" },
                  { label: "Кейсы", id: "cases" },
                  { label: "Отзывы", id: "testimonials" },
                  { label: "О компании", id: "about" },
                  { label: "Новости", href: "/news" },
                  { label: "Статьи", href: "/articles" }
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
                БЕЗУПРЕЧНЫЙ <br /> КОНТРОЛЬ <br /> <span className="text-primary italic">ФИНАНСОВ.</span>
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
                  Наш канал в Max <Zap size={14} className="group-hover:scale-125 transition-transform" />
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

                      <button 
                        onClick={(e) => {
                           e.stopPropagation();
                           openService(service);
                        }}
                        className="w-full py-6 rounded-3xl border border-white/10 text-[11px] font-bold uppercase tracking-[0.3em] text-white hover:bg-white hover:text-black transition-all flex items-center justify-center gap-4 group/btn"
                      >
                        Подробнее <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      </button>
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
              КАК МЫ <span className="text-primary italic">РАБОТАЕМ.</span>
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
              РЕАЛЬНЫЕ <span className="text-primary italic">РЕЗУЛЬТАТЫ.</span>
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
                 role: "CEO TechSolution", 
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
                 role: "Основатель IT-стартапа", 
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
                  ЛИЧНЫЙ <br /> <span className="text-primary italic">КОНТРОЛЬ</span> <br /> КАЧЕСТВА.
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
                 <img src="/director_hq.png" alt="Руководитель" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
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
              ЧАСТО <span className="text-primary italic">СПРАШИВАЮТ.</span>
            </div>
          </div>
          
          <div className="space-y-4">
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
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="relative z-10 px-6 py-12 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto space-y-12">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                 <div className="flex items-center justify-center">
                    <Logo size={32} />
                 </div>
                 <span className="font-bold text-lg tracking-tighter uppercase">ЭлитФинанс</span>
              </div>
              <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-none">Консалтинговые услуги высшей пробы</div>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {[
                 { label: "Телефон", val: "+7 (902) 837-13-70", href: "tel:+79028371370", icon: <Phone size={20} /> },
                 { label: "Почта", val: "info@elitfinance.ru", href: "mailto:info@elitfinance.ru", icon: <Mail size={20} /> },
                  { label: "Прямая связь", val: "Написать в Max", href: "https://max.ru/join/8yIWQTLe3c6kJnLgy_gs2eAVXCEFwly9TqLissFIYNQ", icon: <Zap size={20} /> },
                  { label: "Наш канал", val: "Подписаться", href: "https://max.ru/join/8yIWQTLe3c6kJnLgy_gs2eAVXCEFwly9TqLissFIYNQ", icon: <ArrowUpRight size={20} />, primary: true }
              ].map((item, i) => (
                 <motion.a 
                    key={i}
                    href={item.href}
                    target={item.href.startsWith('http') ? "_blank" : undefined}
                    whileHover={{ y: -5 }}
                    className={`p-6 rounded-[32px] border ${item.primary ? 'bg-primary border-primary' : 'bg-neutral-900/40 border-white/5'} hover:border-primary/50 transition-all group flex flex-col justify-between min-h-[160px]`}
                 >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${item.primary ? 'bg-black/10 text-black' : 'bg-white/5 text-primary'} group-hover:scale-110 transition-transform`}>
                       {React.cloneElement(item.icon, { size: 18 })}
                    </div>
                    <div>
                       <div className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${item.primary ? 'text-black/60' : 'text-neutral-500'}`}>{item.label}</div>
                       <div className={`text-lg font-bold tracking-tightest leading-tight ${item.primary ? 'text-black' : 'text-white group-hover:text-primary transition-colors'}`}>{item.val}</div>
                    </div>
                 </motion.a>
              ))}
           </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-4 opacity-30">
           <div className="text-[10px] uppercase font-bold tracking-widest">© 2024 ЭлитФинанс</div>
           <div className="text-[10px] uppercase font-bold tracking-widest">Все права защищены</div>
        </div>
      </footer>
    </div>
  );
}
