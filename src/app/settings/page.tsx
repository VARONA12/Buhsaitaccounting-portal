"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { Bell, Shield, Smartphone, Globe, Moon, CreditCard, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const sections = [
    { id: "general", label: "Основные", icon: Globe },
    { id: "notifications", label: "Уведомления", icon: Bell },
    { id: "security", label: "Безопасность", icon: Shield },
    { id: "billing", label: "Подписка", icon: CreditCard },
  ];

  return (
    <DashboardShell>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Настройки</h1>
          <p className="text-neutral-400">Управление аккаунтом и предпочтениями системы</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 flex flex-col gap-2">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveTab(s.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === s.id 
                    ? "bg-primary text-black font-bold shadow-[0_0_20px_rgba(255,193,7,0.2)]" 
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <s.icon size={20} />
                {s.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 glass p-8 rounded-3xl border border-white/5 space-y-8">
            {activeTab === "general" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold border-b border-white/5 pb-4">Общие настройки</h2>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-semibold text-white">Тема интерфейса</div>
                    <div className="text-xs text-neutral-500">Выберите подходящую цветовую схему</div>
                  </div>
                  <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                    <button className="px-3 py-1 bg-white/10 rounded text-xs text-white">Темная</button>
                    <button className="px-3 py-1 text-xs text-neutral-500">Светлая</button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-semibold text-white">Язык системы</div>
                    <div className="text-xs text-neutral-500">Русский (RU) выбран по умолчанию</div>
                  </div>
                  <ChevronRight className="text-neutral-600" />
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold border-b border-white/5 pb-4">Уведомления</h2>
                
                {[
                  { label: "Email уведомления", desc: "Получать отчеты и чеки на почту" },
                  { label: "SMS уведомления", desc: "Срочные оповещения о дедлайнах" },
                  { label: "Telegram Bot", desc: "Свяжите аккаунт с нашим ботом" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-semibold text-white">{item.label}</div>
                      <div className="text-xs text-neutral-500">{item.desc}</div>
                    </div>
                    <div className="w-12 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
                      <div className="w-4 h-4 bg-black rounded-full absolute right-1"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "billing" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold border-b border-white/5 pb-4">Ваша подписка</h2>
                
                <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="text-xs text-primary font-bold uppercase mb-1">Текущий план</div>
                    <div className="text-2xl font-black text-white">Базовый Плюс</div>
                    <div className="text-xs text-neutral-400 mt-2">Следующее списание: 12.05.2024</div>
                  </div>
                  <button className="bg-primary text-black px-6 py-2 rounded-xl font-bold text-sm">Улучшить</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
