import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
import { CheckCircle2, ArrowLeft, TrendingDown, ShieldCheck, Users } from "lucide-react";
import { ContactButtonFull } from "@/components/ContactButton";

export const metadata: Metadata = {
  title: "Кейсы ЭлитФинанс — реальные результаты для бизнеса",
  description: "Реальные кейсы ЭлитФинанс: снижение штрафов ФНС, защита при проверках, кадровые споры. Конкретные цифры и результаты для ООО и ИП.",
  alternates: { canonical: "https://elitfinans.online/cases" },
  openGraph: {
    title: "Кейсы ЭлитФинанс — реальные результаты",
    description: "Как мы снизили штраф 500 000 ₽ вдвое, спасли бизнес от блокировки и уволили сотрудника без претензий к компании.",
    url: "https://elitfinans.online/cases",
    images: [{ url: "https://elitfinans.online/director_hq.png", width: 1200, height: 630 }],
  },
};

const casesJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://elitfinans.online" },
        { "@type": "ListItem", "position": 2, "name": "Кейсы", "item": "https://elitfinans.online/cases" },
      ],
    },
    {
      "@type": "ItemList",
      "@id": "https://elitfinans.online/cases#list",
      "name": "Кейсы ЭлитФинанс",
      "numberOfItems": 2,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@type": "Article",
            "name": "Снижение штрафа ФНС с 500 000 ₽ до 250 000 ₽ за неправильные ОКВЭД",
            "description": "Компания по благоустройству дорог получила штраф 500 000 ₽. ЭлитФинанс снизила штраф вдвое, исправила ОКВЭД и сохранила бизнес.",
            "provider": { "@type": "Organization", "name": "ЭлитФинанс" },
          },
        },
        {
          "@type": "ListItem",
          "position": 2,
          "item": {
            "@type": "Article",
            "name": "Увольнение проблемного сотрудника без претензий к компании",
            "description": "ЭлитФинанс помогла провести увольнение по официальным основаниям, исключив риск трудового спора.",
            "provider": { "@type": "Organization", "name": "ЭлитФинанс" },
          },
        },
      ],
    },
  ],
};

const CASES = [
  {
    id: "okved-shtraf",
    badge: "Налоговые ОКВЭД",
    icon: TrendingDown,
    result: "−250 000 ₽",
    resultLabel: "сэкономлено",
    client: "ООО, благоустройство дорог и уборка снега, Москва",
    problem: "Компания получила от ФНС штраф 500 000 ₽ за несоответствие фактической деятельности зарегистрированным кодам ОКВЭД. Инспекция посчитала часть операций выходящими за рамки заявленных видов деятельности.",
    solution: [
      "Проведён полный аудит фактической деятельности и действующих кодов ОКВЭД.",
      "Подготовлены возражения на акт ФНС с правовым обоснованием — со ссылками на НК РФ и судебную практику.",
      "Параллельно внесены изменения в ЕГРЮЛ: добавлены корректные коды ОКВЭД, соответствующие реальной деятельности.",
      "Штраф снижен вдвое — с 500 000 ₽ до 250 000 ₽ по результатам досудебного обжалования.",
    ],
    outcome: "Штраф снижен с 500 000 ₽ до 250 000 ₽. Все ОКВЭД приведены в соответствие. Бизнес продолжает работу без ограничений.",
    duration: "3 недели",
    tags: ["ОКВЭД", "Штраф ФНС", "Досудебное обжалование"],
  },
  {
    id: "uvolneniye",
    badge: "Кадровые споры",
    icon: Users,
    result: "0 ₽",
    resultLabel: "претензий",
    client: "ООО, сфера услуг",
    problem: "Компания столкнулась с ситуацией, когда увольнение сотрудника грозило трудовым спором и судебными претензиями. Неправильное оформление могло обернуться восстановлением сотрудника и выплатой компенсаций.",
    solution: [
      "Проведён анализ оснований для увольнения в соответствии с ТК РФ.",
      "Выбрано законное основание с минимальными рисками трудового спора.",
      "Подготовлен полный пакет кадровых документов: уведомления, приказы, записка-расчёт, запись в трудовой.",
      "Все сроки и процедуры соблюдены строго по ТК РФ — исключена любая возможность обжалования.",
    ],
    outcome: "Сотрудник уволен по официальным основаниям. Претензий и судебных исков не последовало. Компания полностью защищена.",
    duration: "5 рабочих дней",
    tags: ["ТК РФ", "Кадровый учёт", "Трудовые споры"],
  },
];

export default function CasesPage() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(casesJsonLd) }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full z-[100] border-b border-white/12 bg-neutral-900/70 backdrop-blur-3xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 xl:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="transition-transform group-hover:scale-110"><Logo size={40} /></div>
            <span className="font-bold text-lg xl:text-xl tracking-tighter uppercase text-white leading-none">ЭлитФинанс</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:text-white transition-colors">
            <ArrowLeft size={14} /> На главную
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-40 px-6 md:pt-48">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <header className="mb-20 space-y-6">
            <div className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.5em] text-white">
              <ShieldCheck size={14} />
              РЕАЛЬНЫЕ РЕЗУЛЬТАТЫ
            </div>
            <h1 className="text-4xl md:text-6xl xl:text-7xl font-black tracking-tightest leading-[1.05] text-white uppercase">
              КЕЙСЫ <br className="hidden md:block" />
              ЭЛИТФИНАНС
            </h1>
            <p className="text-xl md:text-2xl text-white font-medium max-w-2xl leading-relaxed">
              Конкретные ситуации, конкретные цифры. Как мы решаем реальные проблемы бизнеса.
            </p>
          </header>

          {/* Cases */}
          <div className="space-y-12">
            {CASES.map((c) => {
              const Icon = c.icon;
              return (
                <article
                  key={c.id}
                  className="p-10 md:p-14 rounded-[56px] border border-white/12 bg-neutral-900 hover:bg-white/[0.02] transition-all shadow-sm space-y-10"
                >
                  {/* Top row */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-white">
                        <Icon size={14} />
                        {c.badge}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {c.tags.map(tag => (
                          <span key={tag} className="px-4 py-1.5 rounded-full border border-white/20 bg-white/[0.04] text-[9px] font-bold uppercase tracking-widest text-white">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-4xl md:text-5xl font-black text-white leading-none">{c.result}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white mt-1">{c.resultLabel}</div>
                      <div className="text-[10px] text-white mt-1">Срок: {c.duration}</div>
                    </div>
                  </div>

                  {/* Client */}
                  <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white block mb-2">Клиент</span>
                    <p className="text-sm text-white font-medium">{c.client}</p>
                  </div>

                  {/* Problem → Solution → Result */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Проблема</h3>
                      <p className="text-sm text-white leading-relaxed">{c.problem}</p>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Решение</h3>
                      <ul className="space-y-2">
                        {c.solution.map((step, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-white leading-relaxed">
                            <CheckCircle2 size={14} className="text-white shrink-0 mt-0.5" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Результат</h3>
                      <p className="text-sm text-white leading-relaxed font-medium">{c.outcome}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-24 p-12 md:p-16 rounded-[56px] border border-white/12 bg-neutral-900 text-center space-y-6">
            <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter">
              Похожая ситуация?
            </h2>
            <p className="text-white text-base max-w-lg mx-auto leading-relaxed">
              Расскажите о вашем случае — разберём бесплатно на первичной консультации.
            </p>
            <div className="flex justify-center">
              <ContactButtonFull label="ПОЛУЧИТЬ КОНСУЛЬТАЦИЮ" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
