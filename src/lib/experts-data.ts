export interface Expert {
  id: string;
  slug: string;
  name: string;
  role: string;
  specialization: string[];
  experience: string;
  bio: string;
  image: string;
  achievements: {
    label: string;
    value: string;
  }[];
}

export const EXPERTS: Expert[] = [
  {
    id: "1",
    slug: "ekaterina-morozova",
    name: "Екатерина Морозова",
    role: "Старший налоговый консультант",
    specialization: ["ОСНО", "НДС", "Налоговая оптимизация"],
    experience: "12 лет",
    bio: "Эксперт в области сложного налогового планирования для производственных и торговых компаний на общей системе налогообложения. Специализируется на защите интересов бизнеса при выездных налоговых проверках.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
    achievements: [
      { label: "Кейсов по НДС", value: "240+" },
      { label: "Сэкономлено налогов", value: "450 млн ₽" }
    ]
  },
  {
    id: "2",
    slug: "dmitry-volkov",
    name: "Дмитрий Волков",
    role: "Главный бухгалтер, эксперт по 115-ФЗ",
    specialization: ["115-ФЗ", "Банковский комплаенс", "УСН"],
    experience: "10 лет",
    bio: "Ведущий специалист по вопросам финансового мониторинга и банковского контроля. Помогает компаниям выстраивать прозрачные финансовые потоки и снимать блокировки со счетов в кратчайшие сроки.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
    achievements: [
      { label: "Снято блокировок", value: "85" },
      { label: "Клиентов на УСН", value: "120+" }
    ]
  },
  {
    id: "3",
    slug: "marina-ivanova",
    name: "Марина Иванова",
    role: "Специалист по кадровому учёту и ТК РФ",
    specialization: ["ТК РФ", "Воинский учёт", "Охрана труда"],
    experience: "8 лет",
    bio: "Профессионал в сфере трудового права и автоматизации кадрового документооборота. Обеспечивает безупречное ведение воинского учёта и решение сложных трудовых конфликтов без судов.",
    image: "https://images.unsplash.com/photo-1551836022-d5d8b5c828db?q=80&w=800&auto=format&fit=crop",
    achievements: [
      { label: "Проверок ГИТ", value: "15/15 без штрафов" },
      { label: "Сотрудников в штате", value: "2500+" }
    ]
  }
];
