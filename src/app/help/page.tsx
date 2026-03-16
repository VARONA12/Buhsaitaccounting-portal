"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { Search, HelpCircle, MessageCircle, FileText, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Как загрузить документы из 1С?",
      a: "Вы можете настроить автоматическую синхронизацию в разделе настроек или загрузить XML/PDF файлы вручную в разделе 'Документы'."
    },
    {
      q: "Когда крайний срок подачи декларации НДС?",
      a: "Обычно это 25-е число месяца, следующего за налоговым периодом. Точную дату для вашей компании можно увидеть в 'Календаре'."
    },
    {
      q: "Как подключить электронный документооборот (ЭДО)?",
      a: "Напишите в службу поддержки или своему бухгалтеру через чат. Мы бесплатно настроим роуминг с вашим текущим оператором ЭДО."
    },
    {
      q: "Безопасно ли хранить данные в облаке?",
      a: "Мы используем шифрование AES-256 и сервера Yandex.Cloud с сертификацией по стандартам безопасности РФ."
    }
  ];

  return (
    <DashboardShell>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-white mb-4">Центр поддержки</h1>
          <p className="text-neutral-400">Найдите ответы на свои вопросы или свяжитесь с нами</p>
          
          <div className="relative max-w-xl mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Как мне выставить счет..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-primary/50 outline-none transition-all"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Чат с нами", desc: "Среднее время ответа: 5 мин", icon: MessageCircle, color: "bg-primary" },
            { label: "Инструкции", desc: "PDF мануалы по работе", icon: FileText, color: "bg-blue-500" },
            { label: "Видеоуроки", desc: "С чего начать", icon: HelpCircle, color: "bg-purple-500" },
          ].map((cat, i) => (
            <button key={i} className="glass p-6 rounded-3xl border border-white/5 hover:border-white/20 transition-all text-left group">
              <div className={`w-12 h-12 rounded-2xl ${cat.color} text-black flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <cat.icon size={24} />
              </div>
              <h3 className="font-bold text-white mb-1">{cat.label}</h3>
              <p className="text-xs text-neutral-500 leading-tight">{cat.desc}</p>
            </button>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="space-y-4 pt-8">
          <h2 className="text-2xl font-bold text-white mb-6">Частые вопросы</h2>
          {faqs.map((faq, i) => (
            <div key={i} className="glass rounded-2xl border border-white/5 overflow-hidden">
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-semibold text-white">{faq.q}</span>
                <ChevronDown className={`text-neutral-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6 text-sm text-neutral-400 leading-relaxed animate-in slide-in-from-top-2 duration-300">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-primary/5 border border-primary/20 p-8 rounded-3xl text-center mt-8">
          <h3 className="text-xl font-bold text-white mb-2">Не нашли ответ?</h3>
          <p className="text-sm text-neutral-400 mb-6">Напишите нам напрямую, наш бухгалтер поможет вам разобраться.</p>
          <button className="bg-primary text-black px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all">
            Начать чат
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
