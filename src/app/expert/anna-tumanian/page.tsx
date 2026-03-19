import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/Logo";
import { HANDBOOK_TERMS } from "@/lib/handbook-data";
import { SERVICES } from "@/lib/services-data";
import {
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  FileText,
  Newspaper,
  Star,
  Award,
  Users,
  CheckCircle2,
} from "lucide-react";

const EXPERT_URL = "https://elitefinance.pro/expert/anna-tumanian";

export const metadata: Metadata = {
  title: "Анна Туманян — налоговый консультант и главный бухгалтер | ЭлитФинанс",
  description:
    "Анна Туманян — руководитель ЭлитФинанс, налоговый консультант с 15-летним стажем. Специализация: ОСНО, УСН, 115-ФЗ, налоговая оптимизация, кадровый учёт. 127+ клиентов, 0 штрафов по вине компании.",
  keywords: [
    "Анна Туманян",
    "налоговый консультант",
    "главный бухгалтер",
    "ЭлитФинанс",
    "аутсорсинг бухгалтерии",
    "эксперт по налогам",
    "налоговая оптимизация эксперт",
  ],
  alternates: { canonical: EXPERT_URL },
  openGraph: {
    title: "Анна Туманян — налоговый консультант | ЭлитФинанс",
    description:
      "15 лет опыта в налогообложении и бухгалтерии. 127+ клиентов. Специализация: ОСНО, УСН, 115-ФЗ.",
    url: EXPERT_URL,
    siteName: "ЭлитФинанс",
    locale: "ru_RU",
    type: "profile",
    images: [
      {
        url: "https://elitefinance.pro/director_hq.png",
        width: 800,
        height: 1000,
        alt: "Анна Туманян — руководитель ЭлитФинанс",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Анна Туманян — эксперт по налогам | ЭлитФинанс",
    description: "15 лет в налогообложении. ОСНО, УСН, 115-ФЗ. 127+ клиентов.",
    images: ["/director_hq.png"],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

const expertiseAreas = [
  {
    title: "Налоговое планирование",
    desc: "Разработка стратегий легальной минимизации налоговой нагрузки с учётом специфики бизнеса.",
    terms: ["nalogovaya-optimizaciya", "usn", "osno"],
  },
  {
    title: "ОСНО и НДС",
    desc: "Полный цикл учёта НДС: книги покупок/продаж, оптимизация вычетов, защита при проверках.",
    terms: ["osno", "nds", "kameralnaya-proverka"],
  },
  {
    title: "Антиотмывочное законодательство",
    desc: "Защита бизнеса от блокировок по 115-ФЗ, анализ транзакционных рисков, разблокировка счетов.",
    terms: ["115-fz"],
  },
  {
    title: "Налоговые проверки",
    desc: "Сопровождение камеральных и выездных проверок, подготовка ответов на требования ФНС.",
    terms: ["kameralnaya-proverka", "vyyezdnaya-proverka"],
  },
  {
    title: "УСН и спецрежимы",
    desc: "Подбор оптимального налогового режима, переход между режимами, работа с лимитами УСН.",
    terms: ["usn", "patentная-sistema", "samozanyatyy"],
  },
  {
    title: "Кадровый учёт",
    desc: "Трудовые договоры, воинский учёт, сложные увольнения, защита при проверках трудовой инспекции.",
    terms: ["ndfl", "strahovye-vznosy"],
  },
];

const credentials = [
  "Высшее экономическое образование (финансы и кредит)",
  "Аттестат профессионального бухгалтера",
  "Практика налогового консультирования с 2010 года",
  "15+ лет опыта работы с ООО на ОСНО и УСН",
  "Специализация по 115-ФЗ и банковскому комплаенсу",
  "Опыт сопровождения выездных налоговых проверок",
];

const stats = [
  { val: "15+", label: "Лет опыта" },
  { val: "127+", label: "Клиентов" },
  { val: "0", label: "Штрафов по вине компании" },
  { val: "100%", label: "Финансовая ответственность" },
];

export default function ExpertPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://elitefinance.pro#expert",
        name: "Анна Туманян",
        url: EXPERT_URL,
        image: {
          "@type": "ImageObject",
          url: "https://elitefinance.pro/director_hq.png",
          width: 800,
          height: 1000,
          description: "Анна Туманян — руководитель ЭлитФинанс, налоговый консультант",
        },
        jobTitle: "Руководитель ЭлитФинанс, налоговый консультант и главный бухгалтер",
        description:
          "Эксперт в области налогообложения и бухгалтерского учёта с 15-летним стажем. Специализация: ОСНО, УСН, налоговая оптимизация, 115-ФЗ, сопровождение налоговых проверок.",
        knowsAbout: [
          "Налоговое планирование",
          "ОСНО",
          "УСН",
          "НДС",
          "НДФЛ",
          "ЕНП",
          "115-ФЗ",
          "Банковский комплаенс",
          "Кадровый учёт",
          "Налоговая оптимизация",
          "Камеральные проверки",
          "Выездные проверки",
          "Страховые взносы",
          "Патентная система",
          "Бухгалтерский учёт",
        ],
        hasCredential: [
          {
            "@type": "EducationalOccupationalCredential",
            name: "Аттестат профессионального бухгалтера",
            credentialCategory: "Профессиональный бухгалтер",
          },
          {
            "@type": "EducationalOccupationalCredential",
            name: "Высшее образование — финансы и кредит",
            credentialCategory: "Высшее образование",
          },
        ],
        knowsLanguage: {
          "@type": "Language",
          name: "Русский",
          alternateName: "ru",
        },
        worksFor: {
          "@type": "Organization",
          "@id": "https://elitefinance.pro#org",
          name: "ЭлитФинанс",
          url: "https://elitefinance.pro",
        },
        mainEntityOfPage: {
          "@type": "ProfilePage",
          "@id": EXPERT_URL,
        },
        publishingPrinciples: "https://elitefinance.pro/expert/anna-tumanian",
        author: [
          { "@type": "WebPage", url: "https://elitefinance.pro/articles" },
          { "@type": "WebPage", url: "https://elitefinance.pro/news" },
          { "@type": "WebPage", url: "https://elitefinance.pro/handbook" },
        ],
      },
      {
        "@type": "ProfilePage",
        "@id": EXPERT_URL,
        name: "Анна Туманян — налоговый консультант и главный бухгалтер",
        description:
          "Профессиональный профиль Анны Туманян — руководителя ЭлитФинанс и налогового консультanta с 15-летним стажем.",
        url: EXPERT_URL,
        about: { "@id": "https://elitefinance.pro#expert" },
        mainEntity: { "@id": "https://elitefinance.pro#expert" },
        isPartOf: { "@id": "https://elitefinance.pro#website" },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".expert-bio", ".expert-credentials"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Главная",
            item: "https://elitefinance.pro",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Анна Туманян",
            item: EXPERT_URL,
          },
        ],
      },
      {
        "@type": "Organization",
        "@id": "https://elitefinance.pro#org",
        name: "ЭлитФинанс",
        url: "https://elitefinance.pro",
        telephone: "+79028371370",
        email: "info@elitfinance.ru",
        founder: { "@id": "https://elitefinance.pro#expert" },
        employee: { "@id": "https://elitefinance.pro#expert" },
      },
    ],
  };

  const featuredHandbookTerms = HANDBOOK_TERMS.slice(0, 6);
  const featuredServices = SERVICES.slice(0, 3);

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
              href="/handbook"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors hidden md:block"
            >
              Справочник
            </Link>
            <Link
              href="/articles"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors hidden md:block"
            >
              Статьи
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
        <div className="max-w-7xl mx-auto">

          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Главная
                </Link>
              </li>
              <li><ChevronRight size={10} /></li>
              <li className="text-neutral-400">Анна Туманян</li>
            </ol>
          </nav>

          {/* Hero */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 items-start">
            {/* Photo */}
            <div className="lg:col-span-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-[120px] -z-10 rounded-full" />
                <div className="aspect-[3/4] rounded-[48px] overflow-hidden border border-white/10 bg-neutral-900 relative">
                  <Image
                    src="/director_hq.png"
                    alt="Анна Туманян — налоговый консультант и руководитель ЭлитФинанс"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black via-black/50 to-transparent">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-black font-bold text-base">АТ</div>
                      <div>
                        <div className="font-bold text-white uppercase tracking-wide text-sm">Анна Туманян</div>
                        <div className="text-[9px] font-bold text-primary uppercase tracking-widest mt-0.5">Руководитель ЭлитФинанс</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="lg:col-span-8 space-y-10">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-4">
                  Профиль эксперта
                </p>
                <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tightest leading-[1.05] text-white mb-6">
                  Анна Туманян
                </h1>
                <p className="text-xl text-neutral-400 font-medium">
                  Налоговый консультант и главный бухгалтер · Руководитель ЭлитФинанс
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                  <div key={i} className="p-5 rounded-[20px] bg-neutral-900/50 border border-white/5">
                    <div className="text-2xl xl:text-3xl font-bold text-primary mb-1 tracking-tighter">
                      {s.val}
                    </div>
                    <div className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest leading-tight">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bio paragraphs */}
              <div className="expert-bio space-y-5 text-neutral-300 leading-[1.8] text-[17px]">
                <p>
                  Анна Туманян — руководитель и главный эксперт ЭлитФинанс, налоговый консультант
                  с более чем 15-летним стажем практической работы. Специализируется на комплексном
                  бухгалтерском сопровождении ООО и ИП, налоговом планировании, оптимизации
                  налоговой нагрузки и защите бизнеса от рисков по 115-ФЗ.
                </p>
                <p>
                  За годы практики выработала системный подход к налоговому учёту, позволяющий
                  клиентам работать в «белой» зоне, не переплачивая государству и не опасаясь
                  проверок. Лично сопровождает сложные случаи: выездные налоговые проверки,
                  блокировки счетов, споры с контрагентами по НДС, реструктуризацию задолженности
                  перед ФНС.
                </p>
                <p>
                  Принцип работы — превентивный контроль вместо исправления ошибок. Каждый
                  клиент получает индивидуальную стратегию налоговой безопасности, обновляемую
                  при каждом изменении законодательства. Все материалы справочника, статей и
                  новостей ЭлитФинанс проверены лично Анной Туманян на актуальность нормам
                  НК РФ, ГК РФ и 115-ФЗ.
                </p>
              </div>

              {/* Quote */}
              <blockquote className="border-l-2 border-primary/40 pl-6 py-2">
                <p className="text-lg text-neutral-300 italic leading-relaxed">
                  «Грамотный налоговый учёт — это не расходы бизнеса, а инвестиция
                  в его безопасность и рост».
                </p>
              </blockquote>
            </div>
          </section>

          {/* Credentials */}
          <section className="mb-20">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-8">
              Квалификация и опыт
            </h2>
            <div className="expert-credentials grid grid-cols-1 md:grid-cols-2 gap-4">
              {credentials.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-5 rounded-[20px] bg-neutral-900/30 border border-white/5">
                  <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-neutral-300">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Expertise areas */}
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                <Award size={16} className="text-primary" />
              </div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                Области экспертизы
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {expertiseAreas.map((area, i) => {
                const terms = HANDBOOK_TERMS.filter((t) =>
                  area.terms.includes(t.slug)
                );
                return (
                  <div
                    key={i}
                    className="p-7 rounded-[28px] bg-neutral-900/30 border border-white/5 flex flex-col gap-4"
                  >
                    <div>
                      <h3 className="font-bold text-white mb-2">{area.title}</h3>
                      <p className="text-sm text-neutral-400 leading-relaxed">{area.desc}</p>
                    </div>
                    {terms.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
                        {terms.map((t) => (
                          <Link
                            key={t.slug}
                            href={`/handbook/${t.slug}`}
                            className="text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full uppercase tracking-widest hover:bg-primary/20 transition-colors"
                          >
                            {t.term}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Publications — Articles */}
          <section className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                  <FileText size={16} className="text-primary" />
                </div>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                  Авторские материалы
                </h2>
              </div>
              <Link
                href="/articles"
                className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest hover:text-primary transition-colors"
              >
                Все статьи <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  href: "/articles",
                  title: "Экспертные статьи по налогообложению",
                  desc: "Аналитические материалы по ОСНО, УСН, НДС, ЕНП и изменениям законодательства 2026 года.",
                  icon: FileText,
                },
                {
                  href: "/news",
                  title: "Новости налогового законодательства",
                  desc: "Разбор актуальных изменений в НК РФ, писем ФНС и Минфина. Обновления 2026 года.",
                  icon: Newspaper,
                },
                {
                  href: "/handbook",
                  title: "Справочник предпринимателя",
                  desc: "20 ключевых терминов налогового учёта с детальными определениями и FAQ. Проверено лично.",
                  icon: BookOpen,
                },
              ].map((pub, i) => (
                <Link
                  key={i}
                  href={pub.href}
                  className="group p-6 rounded-[24px] bg-neutral-900/30 border border-white/5 hover:border-primary/20 transition-all flex flex-col gap-4"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <pub.icon size={16} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-primary transition-colors mb-2 text-sm">
                      {pub.title}
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">{pub.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-widest mt-auto">
                    Читать{" "}
                    <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Services */}
          <section className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Users size={16} className="text-primary" />
                </div>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                  Услуги под личным контролем
                </h2>
              </div>
              <Link
                href="/#services"
                className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest hover:text-primary transition-colors"
              >
                Все услуги <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featuredServices.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group p-6 rounded-[24px] bg-neutral-900/30 border border-white/5 hover:border-primary/20 transition-all flex flex-col gap-3"
                >
                  <div>
                    <h3 className="font-bold text-white group-hover:text-primary transition-colors text-sm mb-1">
                      {s.title}
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
                      {s.subtitle}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                    <span className="text-sm font-bold text-primary">{s.price}</span>
                    <ArrowRight size={14} className="text-neutral-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* E-E-A-T trust block */}
          <section className="mb-20 p-8 xl:p-12 rounded-[40px] bg-neutral-900/40 border border-primary/15 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShieldCheck size={120} className="text-primary" />
            </div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: ShieldCheck,
                  title: "Верификация контента",
                  desc: "Все материалы сайта — статьи, новости, справочные термины — лично проверены Анной Туманян на соответствие актуальному законодательству.",
                },
                {
                  icon: Award,
                  title: "Финансовая ответственность",
                  desc: "Каждая рекомендация подкреплена профессиональной ответственностью: при ошибке по нашей вине — 100% компенсация штрафа по договору.",
                },
                {
                  icon: Star,
                  title: "Только актуальные нормы",
                  desc: "НК РФ, 402-ФЗ, 115-ФЗ, письма ФНС и Минфина. Редакция 2026 года. Никаких устаревших ставок и сроков.",
                },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                    <item.icon size={16} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-white text-sm">{item.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="p-10 xl:p-14 rounded-[40px] bg-neutral-900/40 border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                  Личная консультация
                </p>
                <h2 className="text-2xl xl:text-3xl font-bold tracking-tightest text-white">
                  Задайте вопрос эксперту.
                </h2>
                <p className="text-neutral-400 text-sm max-w-md">
                  Анна Туманян лично разберёт вашу ситуацию и предложит оптимальное решение.
                  Первичная консультация — бесплатно.
                </p>
              </div>
              <Link
                href="/#contact"
                className="shrink-0 px-8 py-4 bg-primary text-black font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-white transition-all flex items-center gap-3 group"
              >
                Написать эксперту{" "}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
