"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface TaxRecord {
  id: string;
  title: string;
  dueDate: string;
  status: string;
}

export function TaxCalendar() {
  const [deadlines, setDeadlines] = useState<TaxRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaxes = async () => {
      try {
        const res = await fetch("/api/taxes");
        const data = await res.json();
        if (Array.isArray(data)) {
          setDeadlines(data);
        }
      } catch (error) {
        console.error("Ошибка при загрузке налогов:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTaxes();
  }, []);

  const getMonthStr = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('ru-RU', { month: 'short' }).toUpperCase().replace('.', '');
  };

  const getDayStr = (dateStr: string) => {
    return new Date(dateStr).getDate().toString();
  };

  return (
    <div className="glass p-6 rounded-2xl border border-white/5 w-full max-w-sm relative z-10">
      <h3 className="text-lg font-medium text-white mb-6 font-sans">Налоговый календарь</h3>
      <div className="text-sm text-neutral-400 mb-4 uppercase tracking-wider font-medium">Ближайшие дедлайны</div>
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center py-8 opacity-50">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : deadlines.length === 0 ? (
          <div className="text-center py-8 text-neutral-500 text-sm">Нет запланированных событий</div>
        ) : (
          deadlines.map((deadline) => (
            <div
              key={deadline.id}
              className="flex items-center gap-4 bg-primary text-[#000000] rounded-xl p-3 shadow-[0_0_20px_rgba(255,193,7,0.15)] transform transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <div className="border-r border-[#000000]/20 pr-4 flex flex-col items-center justify-center min-w-[3.5rem]">
                <span className="text-xs font-bold">{getMonthStr(deadline.dueDate)}</span>
                <span className="text-2xl font-black leading-none">{getDayStr(deadline.dueDate)}</span>
              </div>
              <div className="font-semibold leading-tight">{deadline.title}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
