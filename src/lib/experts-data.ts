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
    id: "0",
    slug: "anna-tumanian",
    name: "Анна Туманян",
    role: "Главный аудитор",
    specialization: ["АУДИТ", "НАЛОГИ", "ООО / ИП"],
    experience: "15 лет",
    bio: "Основатель ЭлитФинанс. Специализируется на налоговом аудите, защите бизнеса при проверках ФНС и оптимизации налоговой нагрузки для ООО и ИП.",
    image: "/team/anna-tumanian.jpg",
    achievements: [
      { label: "Клиентов под защитой", value: "20+" },
      { label: "Проверок ФНС", value: "100% без штрафов" }
    ]
  },
  {
    id: "1",
    slug: "nadezhda-zdorovets",
    name: "Надежда Здоровец",
    role: "Главный бухгалтер",
    specialization: ["ОСНО", "Налоги", "Аудит"],
    experience: "20 лет",
    bio: "Ведущий эксперт по вопросам бухгалтерского и налогового учета для крупного бизнеса. Специализируется на комплексной поддержке организаций на ОСНО.",
    image: "/team/nadezhda-zdorovets.jpg",
    achievements: [
      { label: "Кейсов по ОСНО", value: "300+" },
      { label: "Пройдено проверок", value: "100%" }
    ]
  },
  {
    id: "2",
    slug: "maria-shukova",
    name: "Мария Шукова",
    role: "Операционный бухгалтер",
    specialization: ["ОПЕРАЦИОНКА", "ПЛАТЕЖИ", "ДОКУМЕНТЫ"],
    experience: "12 лет",
    bio: "Специалист высшей категории по ведению операционного учета и банковского комплаенса. Гарантирует безупречную дисциплину в платежах и документообороте.",
    image: "/team/elvira.jpg",
    achievements: [
      { label: "Транзакций/мес", value: "10 000+" },
      { label: "Без ошибок", value: "5 лет+" }
    ]
  },
  {
    id: "3",
    slug: "elvira-specialist",
    name: "Эльвира",
    role: "Специалист по методологии и регламентам",
    specialization: ["МЕТОДОЛОГИЯ", "РЕГЛАМЕНТЫ", "АУДИТ"],
    experience: "15 лет",
    bio: "Архитектор финансовых регламентов. Разрабатывает и внедряет стандарты учета, которые исключают человеческий фактор и ошибки в отчетности.",
    image: "/team/maria-shukova.jpg",
    achievements: [
      { label: "Внедрено систем", value: "50+" },
      { label: "Регламентов", value: "200+" }
    ]
  },
  {
    id: "4",
    slug: "natalia-ryzhichkina",
    name: "Наталья Рыжичкина",
    role: "Специалист по кадровому учету",
    specialization: ["КАДРЫ", "ЗАРПЛАТА", "ТК РФ"],
    experience: "14 лет",
    bio: "Эксперт в области трудового права и Payroll. Обеспечивает полную безопасность бизнеса в отношениях с персоналом и контролирующими органами.",
    image: "/team/natalia-ryzhichkina.jpg",
    achievements: [
      { label: "Сотрудников", value: "1500+" },
      { label: "Проверок ГИТ", value: "20/20 без штрафов" }
    ]
  },
  {
    id: "5",
    slug: "marina-abasheva",
    name: "Марина Абашева",
    role: "Специалист по грантам и субсидиям",
    specialization: ["ГРАНТЫ", "СУБСИДИИ", "ГОСПОДДЕРЖКА"],
    experience: "10 лет",
    bio: "Профессиональный консультант по привлечению и отчетности по государственным грантам и субсидиям. Помогает бизнесу получать максимум от мер господдержки.",
    image: "/team/marina-abasheva.jpg",
    achievements: [
      { label: "Получено грантов", value: "150 млн ₽" },
      { label: "Успешных заявок", value: "95%" }
    ]
  }
];
