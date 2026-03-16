"use client";

import { motion } from "framer-motion";

const data = [
  { month: "Янв", income: 45000, expense: 32000 },
  { month: "Фев", income: 52000, expense: 38000 },
  { month: "Мар", income: 48000, expense: 42000 },
  { month: "Апр", income: 61000, expense: 35000 },
  { month: "Май", income: 55000, expense: 40000 },
  { month: "Июн", income: 67000, expense: 31000 },
];

export function FinancialSummary() {
  const maxVal = Math.max(...data.flatMap(d => [d.income, d.expense]));

  return (
    <div className="glass rounded-[32px] border border-border p-5 md:p-8 shadow-2xl relative overflow-hidden transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-text mb-1">Финансовый итог</h3>
          <p className="text-xs md:text-sm text-text-muted">Динамика за 6 месяцев</p>
        </div>
        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-text-muted">Доходы</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-surface border border-border" />
            <span className="text-text-muted">Расходы</span>
          </div>
        </div>
      </div>

      <div className="h-48 md:h-64 flex items-end justify-between gap-2 md:gap-4 relative">
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-full h-px border-t border-dashed border-border opacity-30" />
          ))}
        </div>

        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 relative z-10 group min-w-0">
            <div className="flex gap-1 md:gap-1.5 items-end h-full w-full justify-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.income / maxVal) * 100}%` }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className="w-2 md:w-4 bg-primary rounded-t-full relative"
              />
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.expense / maxVal) * 100}%` }}
                transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                className="w-2 md:w-4 bg-text-muted/20 border border-border rounded-t-full relative"
              />
            </div>
            <span className="text-[9px] md:text-[10px] text-text-muted font-medium truncate w-full text-center">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
