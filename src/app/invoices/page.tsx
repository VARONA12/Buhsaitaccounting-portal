"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { Plus, Search, FileText, Download, MoreVertical, Filter, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { InvoiceModal } from "@/components/InvoiceModal";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      setInvoices(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <DashboardShell>
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Счета</h1>
            <p className="text-neutral-400">Управление выставленными счетами и платежами</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all transform active:scale-95 shadow-[0_0_20px_rgba(255,193,7,0.2)]"
          >
            <Plus size={20} /> Выставить счет
          </button>
        </div>

        {/* Filters/Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Всего выставлено", value: "177,800 ₽", color: "text-white" },
            { label: "Ожидают оплаты", value: "12,800 ₽", color: "text-primary" },
            { label: "Просрочено", value: "120,000 ₽", color: "text-red-500" },
          ].map((stat, i) => (
            <div key={i} className="glass p-6 rounded-2xl border border-white/5">
              <div className="text-sm text-neutral-500 mb-1">{stat.label}</div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Поиск по клиенту или номеру..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors bg-white/5 px-4 py-2.5 rounded-xl border border-white/10">
            <Filter size={16} /> Фильтры
          </button>
        </div>

        {/* Invoices List */}
        <div className="glass rounded-2xl border border-white/5 overflow-hidden max-h-[600px] overflow-y-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-20">
              <tr className="border-b border-white/5 bg-surface/90 backdrop-blur-md text-neutral-500 text-xs uppercase tracking-wider font-black">
                <th className="px-6 py-4 font-medium">Номер / Клиент</th>
                <th className="px-6 py-4 font-medium">Сумма</th>
                <th className="px-6 py-4 font-medium">Дата</th>
                <th className="px-6 py-4 font-medium">Статус</th>
                <th className="px-6 py-4 font-medium text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                    Счетов пока нет
                  </td>
                </tr>
              ) : invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                        <FileText size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{inv.number}</div>
                        <div className="text-sm text-neutral-400">{inv.client}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-bold text-white">{inv.amount}</td>
                  <td className="px-6 py-5 text-neutral-400 text-sm">{new Date(inv.dueDate).toLocaleDateString("ru")}</td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter
                      ${inv.status === 'Оплачен' ? 'bg-green-500/10 text-green-400' : 
                        inv.status === 'Просрочен' ? 'bg-red-500/10 text-red-400' : 
                        'bg-primary/10 text-primary'}
                    `}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-neutral-500 hover:text-primary transition-colors">
                        <Download size={18} />
                      </button>
                      <button className="p-2 text-neutral-500 hover:text-white transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <InvoiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchInvoices} 
      />
    </DashboardShell>
  );
}
