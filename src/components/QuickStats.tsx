"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Users, CreditCard, Wallet, ArrowUpRight } from "lucide-react";

const stats = [
  { label: "Чистая прибыль", value: "245,000 ₽", change: "+12.5%", icon: Wallet, color: "text-primary bg-primary/10" },
  { label: "Активные счета", value: "42", change: "+5", icon: CreditCard, color: "text-primary bg-primary/10" },
  { label: "Клиенты", value: "128", change: "+3%", icon: Users, color: "text-white bg-white/5" },
];

export function QuickStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 w-full">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="glass rounded-3xl border border-white/10 p-6 shadow-xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl rounded-full" />
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${stat.color} border border-white/5 group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full border border-primary/20">
              <TrendingUp size={12} />
              {stat.change}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-2xl font-black text-white">{stat.value}</div>
          </div>
          <motion.div 
            className="absolute bottom-4 right-4 text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 45 }}
          >
            <ArrowUpRight size={20} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
