"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { Plus, Search, FileCheck, Download, MoreVertical, Calendar } from "lucide-react";

export default function ActsPage() {
  const acts = [
    { id: "ACT-882", invoice: "INV-001", client: "ООО Вектор", date: "12.04.2024", status: "Подписан" },
    { id: "ACT-881", invoice: "INV-012", client: "ИП Смирнов", date: "08.04.2024", status: "Отправлен" },
    { id: "ACT-880", invoice: "INV-011", client: "ООО Омега", date: "02.04.2024", status: "В архиве" },
  ];

  return (
    <DashboardShell>
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Акты</h1>
            <p className="text-neutral-400">Закрывающие документы и акты сверки</p>
          </div>
          <button className="bg-primary text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all transform active:scale-95 shadow-[0_0_20px_rgba(255,193,7,0.2)]">
            <Plus size={20} /> Сформировать акт
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <button className="glass px-6 py-4 rounded-2xl border border-white/5 hover:border-primary/30 transition-all flex flex-col gap-2 min-w-[200px]">
            <Calendar className="text-primary w-6 h-6" />
            <span className="font-semibold text-white">Акт сверки</span>
            <span className="text-xs text-neutral-500">За любой период</span>
          </button>
          <button className="glass px-6 py-4 rounded-2xl border border-white/5 hover:border-primary/30 transition-all flex flex-col gap-2 min-w-[200px]">
            <FileCheck className="text-primary w-6 h-6" />
            <span className="font-semibold text-white">Подписать ЭЦП</span>
            <span className="text-xs text-neutral-500">2 документа ожидают</span>
          </button>
        </div>

        {/* Acts Table */}
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Поиск акта..." 
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>
          
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-neutral-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Номер / Основание</th>
                <th className="px-6 py-4 font-medium">Клиент</th>
                <th className="px-6 py-4 font-medium">Дата</th>
                <th className="px-6 py-4 font-medium">Статус</th>
                <th className="px-6 py-4 font-medium text-right">Управление</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {acts.map((act) => (
                <tr key={act.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="font-bold text-white">{act.id}</div>
                    <div className="text-xs text-neutral-500">к счету {act.invoice}</div>
                  </td>
                  <td className="px-6 py-5 text-neutral-300">{act.client}</td>
                  <td className="px-6 py-5 text-neutral-400 text-sm">{act.date}</td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase
                      ${act.status === 'Подписан' ? 'bg-green-500/20 text-green-400' : 
                        act.status === 'Отправлен' ? 'bg-primary/20 text-primary' : 
                        'bg-neutral-500/20 text-neutral-400'}
                    `}>
                      {act.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 text-xs">
                        <Download size={14} /> PDF
                      </button>
                      <button className="p-1 text-neutral-600 hover:text-white">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
