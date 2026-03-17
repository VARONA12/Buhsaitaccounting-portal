"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, TrendingUp, Clock, ArrowRight, Building, Target, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-primary selection:text-black">
      {/* Subtle Background Glows */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full z-0 pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full z-0 pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-50 w-full border-b border-white/[0.05] bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(255,193,7,0.2)]">
              <Building size={20} color="black" strokeWidth={2.5} />
            </div>
            <span className="font-black text-xl tracking-tight uppercase">ЭлитФинанс</span>
          </div>
          
          <div className="flex items-center gap-10">
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-primary transition-colors">Услуги</a>
              <a href="#advantages" className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-primary transition-colors">Преимущества</a>
            </div>
            <Link 
              href="/login" 
              className="px-6 py-2.5 rounded-full bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-2 group shadow-xl"
            >
              Личный кабинет
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-10"
          >
            Интеллектуальный бухгалтерский учет
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-10"
          >
            ФИНАНСЫ ПОД <br/> <span className="text-primary">ПОЛНЫМ</span> КОНТРОЛЕМ
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-500 max-w-2xl leading-relaxed font-medium mb-12"
          >
            Мы объединяем экспертизу лучших бухгалтеров и современные технологии для безопасности вашего бизнеса.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link 
              href="/register"
              className="px-10 py-5 bg-primary text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-3 text-sm"
            >
              Начать работу
              <Zap size={18} fill="black" />
            </Link>
            <a 
              href="#services"
              className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center text-sm"
            >
              Наши услуги
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats/Advantages Bundle */}
      <section id="advantages" className="relative z-10 px-6 py-24 bg-white/[0.02] border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            { 
              icon: ShieldCheck, 
              title: "СТРАХОВАНИЕ РИСКОВ", 
              desc: "Мы несем полную материальную ответственность за каждую цифру в отчетах." 
            },
            { 
              icon: Target, 
              title: "ОПТИМИЗАЦИЯ НАЛОГОВ", 
              desc: "Внедряем легальные схемы экономии, которые работают на ваш капитал." 
            },
            { 
              icon: Clock, 
              title: "СКОРОСТЬ РЕАКЦИИ", 
              desc: "Личный бухгалтер на связи 24/7. Отчеты готовы точно в срок." 
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group"
            >
              <item.icon className="w-10 h-10 text-primary mb-6 transition-transform group-hover:scale-110" strokeWidth={1.5} />
              <h3 className="text-xl font-black mb-4 tracking-tight uppercase">{item.title}</h3>
              <p className="text-neutral-500 leading-relaxed text-sm font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Minimalist Grid */}
      <section id="services" className="relative z-10 px-6 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">Продукты</h2>
              <p className="text-4xl md:text-5xl font-black leading-tight tracking-tight">РЕШЕНИЯ ДЛЯ ЛЮБОГО МАСШТАБА БИЗНЕСА</p>
            </div>
            <p className="text-neutral-500 max-w-xs font-medium text-sm">От стартапа до крупного холдинга — мы обеспечим безупречный порядок в делах.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "КОМПЛЕКСНОЕ ВЕДЕНИЕ",
                tags: ["ООО", "ИП", "ОСНО", "УСН"],
                desc: "Полный аутсорсинг: от первички до сдачи годового баланса."
              },
              {
                title: "ЦИФРОВАЯ ЭКОСИСТЕМА",
                tags: ["API", "CLOUD", "SECURITY"],
                desc: "Современный личный кабинет с аналитикой в реальном времени."
              }
            ].map((service, i) => (
              <div key={i} className="p-10 rounded-[32px] bg-white/[0.03] border border-white/[0.08] hover:border-primary/20 transition-all cursor-default group">
                <div className="flex gap-2 mb-6">
                  {service.tags.map(tag => (
                    <span key={tag} className="text-[8px] font-black px-2 py-0.5 rounded border border-white/10 text-neutral-500 group-hover:border-primary/30 group-hover:text-primary transition-colors uppercase tracking-widest">{tag}</span>
                  ))}
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tighter">{service.title}</h3>
                <p className="text-neutral-500 font-medium mb-8 text-sm">{service.desc}</p>
                <div className="w-12 h-1 bg-white/10 group-hover:w-full group-hover:bg-primary transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-20 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="text-2xl font-black tracking-tighter uppercase">ЭлитФинанс</span>
            <p className="text-neutral-600 text-[10px] font-black uppercase tracking-widest">© {new Date().getFullYear()} Все права защищены</p>
          </div>
          <div className="flex gap-8">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-colors">Вход</Link>
            <Link href="/register" className="text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-colors">Регистрация</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
