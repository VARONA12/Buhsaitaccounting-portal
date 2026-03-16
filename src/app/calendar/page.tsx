"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { ChevronLeft, ChevronRight, Bell, Calendar as CalendarIcon, Info } from "lucide-react";

export default function CalendarPage() {
  const events = [
    { date: "25.04", title: "НДС за 1 квартал", type: "Налог", amount: "128,400 ₽" },
    { date: "28.04", title: "Страховые взносы", type: "Взносы", amount: "15,200 ₽" },
    { date: "30.04", title: "Зарплата (2 часть)", type: "Выплата", amount: "540,000 ₽" },
    { date: "15.05", title: "Сдача отчетности в СФР", type: "Отчет", amount: "-" },
  ];

  return (
    <DashboardShell>
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Налоговый календарь</h1>
            <p className="text-neutral-400">Следите за важными датами и платежами</p>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
            <button className="p-2 text-neutral-400 hover:text-white"><ChevronLeft size={20} /></button>
            <span className="px-4 font-semibold">Апрель 2024</span>
            <button className="p-2 text-neutral-400 hover:text-white"><ChevronRight size={20} /></button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main List */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {events.map((event, i) => (
              <div key={i} className="glass p-6 rounded-3xl border border-white/5 flex items-center justify-between hover:border-primary/20 transition-all group">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary text-black flex flex-col items-center justify-center shadow-[0_0_20px_rgba(255,193,7,0.15)]">
                    <span className="text-xs font-bold leading-none">{event.date.split('.')[1] === '04' ? 'АПР' : 'МАЙ'}</span>
                    <span className="text-2xl font-black">{event.date.split('.')[0]}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{event.title}</h3>
                    <div className="flex items-center gap-3 text-sm mt-1">
                      <span className="text-neutral-500 font-medium">{event.type}</span>
                      <span className="w-1 h-1 rounded-full bg-neutral-700"></span>
                      <span className="text-primary/80">{event.amount}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="p-3 rounded-xl bg-white/5 text-neutral-400 hover:text-white transition-all">
                    <Bell size={20} />
                  </button>
                  <button className="p-3 rounded-xl bg-white/5 text-neutral-400 hover:text-white transition-all">
                    <Info size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar / Summary */}
          <div className="flex flex-col gap-6">
            <div className="glass p-8 rounded-3xl border border-white/5 bg-primary/5">
              <CalendarIcon className="text-primary w-10 h-10 mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Итог за месяц</h4>
              <p className="text-neutral-400 text-sm mb-6">Сумма всех налогов и выплат к концу месяца составит:</p>
              <div className="text-3xl font-black text-primary leading-none">683,600 ₽</div>
              <button className="w-full mt-8 bg-white text-black py-4 rounded-2xl font-bold hover:bg-neutral-200 transition-all">
                Сформировать отчет
              </button>
            </div>

            <div className="glass p-6 rounded-2xl border border-white/5">
              <h5 className="font-bold text-white mb-4">Напоминания</h5>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                  <p className="text-sm text-neutral-400">Завтра дедлайн по подаче декларации УСН для ИП</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                  <p className="text-sm text-neutral-400">Просрочен платеж по аренде офиса (3 дня)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
