"use client";

import { motion } from "framer-motion";
import { TrendingUp, Receipt, Wallet, ArrowUpRight, Users } from "lucide-react";

const stats = [
  { label: "Чистая прибыль", value: "245,000 ₽", change: "+12.5%", icon: Wallet, color: "text-primary bg-primary/10" },
  { label: "Уплаченные налоги", value: "38,400 ₽", change: "Март", icon: Receipt, color: "text-primary bg-primary/10" },
  { label: "Количество сотрудников", value: "12", change: "+2", icon: Users, color: "text-text bg-surface" },
];

export function QuickStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 relative z-10 w-full">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="glass rounded-[32px] border border-border p-5 md:p-6 shadow-xl relative overflow-hidden group hover:border-primary/30 transition-all font-sans"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full" />
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${stat.color} border border-border group-hover:scale-105 transition-transform`}>
              <stat.icon size={20} className="md:w-6 md:h-6" />
            </div>
            <div className="flex items-center gap-1 text-[10px] font-black text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
              <TrendingUp size={12} />
              {stat.change}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-xl md:text-2xl font-black text-text">{stat.value}</div>
          </div>
          <motion.div 
            className="absolute bottom-4 right-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
            whileHover={{ rotate: 45 }}
          >
            <ArrowUpRight size={20} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
