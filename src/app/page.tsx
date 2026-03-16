"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, TrendingUp, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Hero3D } from "@/components/Hero3D";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans overflow-x-hidden selection:bg-primary selection:text-black">
      {/* Background decorations */}
      <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full z-0 pointer-events-none" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full z-0 pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 w-full border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
              </svg>
            </div>
            <span className="font-bold text-2xl tracking-wide text-white">ЭлитФинанс</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Услуги</a>
            <a href="#advantages" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Преимущества</a>
            <Link 
              href="/login" 
              className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all text-sm flex items-center gap-2 group"
            >
              Личный кабинет
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Ваша бухгалтерия в безопасности
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]"
            >
              Бухгалтерское<br />
              обслуживание <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">нового уровня</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-neutral-400 mb-12 max-w-xl leading-relaxed font-light"
            >
              Возьмем на себя всю рутину, налоги и отчетность. Автоматизируем процессы, чтобы вы могли сосредоточиться на росте бизнеса.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-start gap-4"
            >
              <Link 
                href="/login"
                className="w-full sm:w-auto px-8 py-4 bg-primary text-black font-bold rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(255,193,7,0.3)] transition-all flex items-center justify-center gap-2"
              >
                Войти в личный кабинет
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a 
                href="#services"
                className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-medium rounded-full hover:bg-white/10 transition-all flex items-center justify-center"
              >
                Наши услуги
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex items-center justify-center relative w-full h-[300px] md:h-[500px]"
          >
            <Hero3D />
          </motion.div>
        </div>
      </main>

      {/* Features/Stats Section */}
      <section id="advantages" className="relative z-10 w-full bg-white/[0.02] border-y border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: ShieldCheck, title: "100% Защита", desc: "Гарантируем отсутствие штрафов. Вся ответственность застрахована." },
            { icon: TrendingUp, title: "Снижение налогов", desc: "Законно оптимизируем налогооблагаемую базу и находим скрытые резервы." },
            { icon: Clock, title: "Отчетность вовремя", desc: "Синхронизация с 1С и банками. Соблюдение всех дедлайнов." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-neutral-400 font-light leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative z-10 w-full max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Комплексные решения</h2>
          <p className="text-neutral-400 max-w-2xl mx-auto font-light">
            От регистрации бизнеса до полного финансового сопровождения. Все необходимое в одном окне.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Комплексное ведение",
              points: ["Обработка первичной документации", "Расчет зарплаты и кадровый учет", "Налоговая и бухгалтерская отчетность", "Интеграция с клиент-банком"]
            },
            {
              title: "Мощный личный кабинет",
              points: ["Актуальные финансовые показатели", "Календарь дедлайнов", "Безопасный обмен документами", "Аналитика бизнес-процессов"]
            }
          ].map((service, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass p-10 rounded-3xl border border-white/10 hover:border-primary/30 transition-colors"
            >
              <h3 className="text-2xl font-bold text-primary mb-6">{service.title}</h3>
              <ul className="space-y-4">
                {service.points.map((point, j) => (
                  <li key={j} className="flex items-center gap-3 text-neutral-300">
                    <CheckCircle2 className="w-5 h-5 text-primary/50 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black/50 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-widest text-white/50">ЭлитФинанс</span>
            <span className="text-white/20 text-sm">© {new Date().getFullYear()}</span>
          </div>
          <p className="text-neutral-500 text-sm text-center md:text-left">
            Профессиональное бухгалтерское обслуживание.
          </p>
        </div>
      </footer>
    </div>
  );
}
