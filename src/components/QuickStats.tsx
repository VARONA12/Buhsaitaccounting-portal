"use client";

import { motion } from "framer-motion";
import { TrendingUp, Receipt, Wallet, ArrowUpRight, Users } from "lucide-react";
import { useRouter } from "next/navigation";

const stats = [
  { 
    label: "Чистая прибыль", 
    value: "245,000 ₽", 
    change: "+12.5%", 
    icon: Wallet, 
    color: "text-primary bg-primary/10",
    href: "/dashboard" 
  },
  { 
    label: "Уплаченные налоги", 
    value: "38,400 ₽", 
    change: "Март", 
    icon: Receipt, 
    color: "text-primary bg-primary/10",
    href: "/calendar" 
  },
  { 
    label: "Количество сотрудников", 
    value: "12", 
    change: "+2", 
    icon: Users, 
    color: "text-text bg-surface",
    href: "/settings" 
  },
];

export function QuickStats() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 relative z-10 w-full">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ 
            y: -5,
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          onClick={() => router.push(stat.href)}
          className="glass rounded-[32px] border border-border p-5 md:p-6 shadow-xl relative overflow-hidden group hover:border-primary/50 transition-colors font-sans cursor-pointer"
        >
          {/* Animated background glow on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.color} border border-border group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all duration-300`}>
                <stat.icon size={20} className="md:w-6 md:h-6" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 group-hover:border-primary/40 transition-colors">
                <TrendingUp size={12} />
                {stat.change}
              </div>
            </div>
            
            <div>
              <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1 group-hover:text-text transition-colors">
                {stat.label}
              </div>
              <div className="text-xl md:text-2xl font-black text-text flex items-baseline gap-2">
                {stat.value}
                <span className="text-[10px] text-text-muted font-normal opacity-0 group-hover:opacity-100 transition-opacity">детали</span>
              </div>
            </div>
          </div>

          <motion.div 
            className="absolute bottom-4 right-4 text-primary opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 hidden md:block"
          >
            <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter">
              Перейти <ArrowUpRight size={16} />
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
