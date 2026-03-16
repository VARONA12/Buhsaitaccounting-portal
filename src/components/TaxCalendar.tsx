"use client";

import { useEffect, useState } from "react";
import { Loader2, CalendarDays } from "lucide-react";

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
    <div className="glass p-5 md:p-6 rounded-[32px] border border-border w-full relative z-10 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-primary/10 text-primary">
          <CalendarDays size={20} />
        </div>
        <h3 className="text-xl font-bold text-text font-sans">Календарь</h3>
      </div>
      
      <div className="text-[10px] text-text-muted mb-4 uppercase tracking-[0.2em] font-black pl-1">Дедлайны</div>
      
      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 no-scrollbar scroll-smooth">
        {loading ? (
          <div className="flex flex-col items-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" />
          </div>
        ) : deadlines.length === 0 ? (
          <div className="text-center py-10 text-text-muted text-xs italic">Событий не запланировано</div>
        ) : (
          deadlines.map((deadline) => (
            <div
              key={deadline.id}
              className="flex items-center gap-4 bg-primary text-black rounded-[20px] p-3.5 shadow-[0_10px_25px_rgba(255,193,7,0.2)] transform transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <div className="border-r border-black/10 pr-4 flex flex-col items-center justify-center min-w-[3.5rem]">
                <span className="text-[10px] font-black tracking-tighter">{getMonthStr(deadline.dueDate)}</span>
                <span className="text-2xl font-black leading-none">{getDayStr(deadline.dueDate)}</span>
              </div>
              <div className="font-bold text-sm leading-tight pr-2">{deadline.title}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
