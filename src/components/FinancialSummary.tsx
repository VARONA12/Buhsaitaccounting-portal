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
    <div className="glass-premium rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">Финансовый итог</h3>
          <p className="text-sm text-neutral-400">Динамика за последние 6 месяцев</p>
        </div>
          <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
            <span className="text-neutral-400">Доходы</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
            <span className="text-neutral-400">Расходы</span>
          </div>
        </div>
      </div>

      <div className="h-64 flex items-end justify-between gap-4 relative">
        {/* Y-Axis Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-full h-px bg-white/5 border-t border-dashed border-white/10" />
          ))}
        </div>

        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 relative z-10 group">
            <div className="flex gap-1.5 items-end h-full w-full justify-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.income / maxVal) * 100}%` }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className="w-3 bg-gradient-to-t from-primary/20 to-primary rounded-t-full relative"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-primary text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.income.toLocaleString()} ₽
                </div>
              </motion.div>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.expense / maxVal) * 100}%` }}
                transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                className="w-3 bg-gradient-to-t from-white/10 to-white/60 rounded-t-full relative"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.expense.toLocaleString()} ₽
                </div>
              </motion.div>
            </div>
            <span className="text-[10px] text-neutral-500 font-medium">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
