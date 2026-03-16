"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { 
  Bell, 
  Shield, 
  Globe, 
  ChevronRight, 
  Building2, 
  Smartphone, 
  History, 
  Lock,
  Wallet,
  Check,
  Loader2,
  ExternalLink,
  X,
  Save,
  AlertCircle
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [currentTheme, setCurrentTheme] = useState<"dark" | "light">("dark");
  
  // Modals state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  const sections = [
    { id: "general", label: "Основные", icon: Globe },
    { id: "company", label: "Фирма", icon: Building2 },
    { id: "notifications", label: "Уведомления", icon: Bell },
    { id: "security", label: "Защита", icon: Shield },
  ];

  useEffect(() => {
    fetchUser();
    const savedTheme = localStorage.getItem('theme') as "dark" | "light";
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      if (savedTheme === 'light') document.documentElement.classList.add('light');
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user");
      const data = await res.json();
      setUser(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updates: any) => {
    setSaving(true);
    setSaveStatus("idle");
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        setUser({ ...user, ...updates });
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
        return true;
      } else {
        setSaveStatus("error");
        return false;
      }
    } catch (e) {
      setSaveStatus("error");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Optimistic Toggle Handler
  const handleToggle = useCallback(async (key: string, value: boolean) => {
    if (!user) return;
    
    // Optimistic update
    const previousUser = { ...user };
    setUser({ ...user, [key]: value });

    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      });
      
      if (!res.ok) throw new Error("Failed to update");
      
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (e) {
      // Revert on error
      setUser(previousUser);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  }, [user]);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 md:gap-8 max-w-5xl mx-auto pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-text mb-2 tracking-tight">Настройки</h1>
            <p className="text-sm text-text-muted">Управление вашим бизнес-профилем</p>
          </div>
          
          <AnimatePresence>
            {saveStatus === "success" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-green-500/10 text-green-500 px-4 py-2 rounded-xl border border-green-500/20 text-xs font-bold flex items-center gap-2"
              >
                <Check size={14} /> Изменения сохранены
              </motion.div>
            )}
            {saveStatus === "error" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-500/10 text-red-500 px-4 py-2 rounded-xl border border-red-500/20 text-xs font-bold flex items-center gap-2"
              >
                <AlertCircle size={14} /> Ошибка сохранения
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-72 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveTab(s.id)}
                className={`flex items-center gap-3 px-4 py-3 md:px-5 md:py-4 rounded-2xl transition-all group shrink-0 ${
                  activeTab === s.id 
                    ? "bg-primary text-black font-black shadow-[0_10px_30px_rgba(255,193,7,0.2)]" 
                    : "text-text-muted hover:text-text hover:bg-surface border border-transparent hover:border-border"
                }`}
              >
                <s.icon size={18} className={activeTab === s.id ? "scale-110" : "group-hover:scale-110 transition-transform"} />
                <span className="text-sm md:text-base whitespace-nowrap">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="glass p-5 md:p-8 rounded-[32px] border border-border space-y-8 min-h-[400px] md:min-h-[500px]"
            >
              {activeTab === "general" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                      <Globe size={20} />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-text">Основные</h2>
                  </div>
                  
                  <div className="grid gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface/50 rounded-2xl border border-border gap-4">
                      <div>
                        <div className="font-bold text-text">Тема интерфейса</div>
                        <div className="text-[10px] md:text-xs text-text-muted">Выберите оформление</div>
                      </div>
                      <div className="flex bg-surface p-1 rounded-xl border border-border w-full sm:w-auto">
                        <button 
                          onClick={() => {
                            document.documentElement.classList.remove('light');
                            localStorage.setItem('theme', 'dark');
                            setCurrentTheme('dark');
                          }}
                          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-black transition-all ${
                            currentTheme === 'dark'
                              ? "bg-primary text-black shadow-lg" 
                              : "text-text-muted hover:text-text"
                          }`}
                        >
                          Темная
                        </button>
                        <button 
                          onClick={() => {
                            document.documentElement.classList.add('light');
                            localStorage.setItem('theme', 'light');
                            setCurrentTheme('light');
                          }}
                          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-black transition-all ${
                            currentTheme === 'light'
                              ? "bg-primary text-black shadow-lg" 
                              : "text-text-muted hover:text-text"
                          }`}
                        >
                          Светлая
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-surface/50 rounded-2xl border border-border cursor-pointer group hover:border-primary/30 transition-all">
                      <div>
                        <div className="font-bold text-text group-hover:text-primary transition-colors">Язык системы</div>
                        <div className="text-[10px] md:text-xs text-text-muted">Русский по умолчанию</div>
                      </div>
                      <ChevronRight size={18} className="text-text-muted" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "company" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                      <Building2 size={20} />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-text">Профиль фирмы</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2">ИНН Компании</label>
                      <input 
                        type="text" 
                        placeholder="7700000000"
                        value={user?.inn || ""}
                        onChange={(e) => setUser({...user, inn: e.target.value})}
                        className="w-full bg-surface border border-border rounded-2xl px-5 py-4 text-text text-sm focus:border-primary outline-none transition-all placeholder:text-text-muted/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2">Налогообложение</label>
                      <select 
                        value={user?.taxSystem || ""}
                        onChange={(e) => setUser({...user, taxSystem: e.target.value})}
                        className="w-full bg-surface border border-border rounded-2xl px-5 py-4 text-text text-sm focus:border-primary outline-none transition-all appearance-none"
                      >
                        <option value="" disabled>Выберите систему</option>
                        <option value="УСН Доходы">УСН Доходы (6%)</option>
                        <option value="УСН Доходы-Расходы">УСН Доходы-Расходы (15%)</option>
                        <option value="ОСНО">ОСНО (Общая)</option>
                        <option value="Патент">Патент</option>
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2">Юридический адрес</label>
                      <input 
                        type="text" 
                        placeholder="г. Москва, ул. Примерная, д. 1"
                        value={user?.legalAddress || ""}
                        onChange={(e) => setUser({...user, legalAddress: e.target.value})}
                        className="w-full bg-surface border border-border rounded-2xl px-5 py-4 text-text text-sm focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2 flex items-center gap-2">
                        <Wallet size={12} /> Прибыль (мес)
                      </label>
                      <input 
                        type="text" 
                        placeholder="0.00 ₽"
                        value={user?.lastMonthProfit || ""}
                        onChange={(e) => setUser({...user, lastMonthProfit: e.target.value})}
                        className="w-full bg-surface border border-border rounded-2xl px-5 py-4 text-text text-sm focus:border-primary outline-none transition-all font-mono"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => handleUpdate({ 
                      inn: user.inn, 
                      legalAddress: user.legalAddress, 
                      taxSystem: user.taxSystem, 
                      lastMonthProfit: user.lastMonthProfit 
                    })}
                    disabled={saving}
                    className="w-full sm:w-auto bg-primary text-black px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_30px_rgba(255,193,7,0.2)] disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18}/> Сохранить</>}
                  </button>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500">
                      <Bell size={20} />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-text">Уведомления</h2>
                  </div>
                  
                  <div className="bg-surface/30 rounded-[28px] border border-border overflow-hidden">
                    <div className="p-5 md:p-6 space-y-2 divide-y divide-border/30">
                      <ToggleWrapper 
                        active={!!user?.notifEmail} 
                        onToggle={(val) => handleToggle('notifEmail', val)}
                        label="Email отчеты" 
                        desc="О налогах и документах" 
                      />
                      <ToggleWrapper 
                        active={!!user?.notifSms} 
                        onToggle={(val) => handleToggle('notifSms', val)}
                        label="SMS оповещения" 
                        desc="Критические события" 
                      />
                      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                        <div>
                          <div className="font-bold text-text flex items-center gap-2">
                            Telegram Bot <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-black">TOP</span>
                          </div>
                          <div className="text-[10px] md:text-xs text-text-muted">Получайте уведомления в мессенджер</div>
                        </div>
                        <button className="w-full sm:w-auto text-xs bg-surface border border-border hover:bg-primary hover:text-black py-2.5 px-5 rounded-xl transition-all font-black flex items-center justify-center gap-2">
                          Подключить <ExternalLink size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 rounded-xl text-red-500">
                      <Shield size={20} />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-text">Безопасность</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-surface/50 rounded-3xl border border-border space-y-4 hover:border-primary/20 transition-colors">
                      <div className="flex items-center gap-3 text-text font-bold">
                        <Smartphone size={18} className="text-primary" /> Телефон
                      </div>
                      <div className="text-xl md:text-2xl font-black text-text">+{user?.phone}</div>
                      <button 
                        onClick={() => setIsPhoneModalOpen(true)}
                        className="text-xs text-primary font-black hover:underline flex items-center gap-1 uppercase tracking-tight"
                      >
                        Изменить <ChevronRight size={14} />
                      </button>
                    </div>

                    <div className="p-6 bg-surface/50 rounded-3xl border border-border space-y-4 hover:border-primary/20 transition-colors">
                      <div className="flex items-center gap-3 text-text font-bold">
                        <Lock size={18} className="text-primary" /> Пароль
                      </div>
                      <div className="text-[10px] md:text-xs text-text-muted leading-tight">
                        {user?.password ? "Защищено надежным паролем" : "Вход только по одноразовым кодам"}
                      </div>
                      <button 
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="text-xs text-primary font-black hover:underline flex items-center gap-1 uppercase tracking-tight"
                      >
                        {user?.password ? "Обновить" : "Создать"} <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-text font-bold text-sm">
                      <History size={16} /> История входов
                    </div>
                    <div className="overflow-x-auto rounded-2xl border border-border bg-surface/20">
                      <table className="w-full text-left text-sm min-w-[500px]">
                        <thead className="bg-surface/50 text-[10px] text-text-muted uppercase font-black tracking-widest">
                          <tr>
                            <th className="px-6 py-4">Устройство</th>
                            <th className="px-6 py-4">IP / Тип</th>
                            <th className="px-6 py-4">Дата</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                          {user?.loginSessions && user.loginSessions.length > 0 ? (
                            user.loginSessions.map((session: any) => (
                              <tr key={session.id} className="hover:bg-surface/30 transition-colors">
                                <td className="px-6 py-4 font-bold text-text text-xs">{session.device}</td>
                                <td className="px-6 py-4 text-text-muted text-[10px]">{session.ip || "Web Portal"}</td>
                                <td className="px-6 py-4 text-text-muted text-[10px]">
                                  {new Date(session.createdAt).toLocaleString('ru-RU')}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={3} className="px-6 py-8 text-center text-text-muted italic">История пуста</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isPasswordModalOpen && (
          <Modal title="Защита паролем" onClose={() => setIsPasswordModalOpen(false)}>
            <PasswordForm onSuccess={() => setIsPasswordModalOpen(false)} onUpdate={handleUpdate} />
          </Modal>
        )}
        {isPhoneModalOpen && (
          <Modal title="Новый номер" onClose={() => setIsPhoneModalOpen(false)}>
            <PhoneForm currentPhone={user?.phone} onSuccess={() => setIsPhoneModalOpen(false)} onUpdate={handleUpdate} />
          </Modal>
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}

// Improved Toggle Component with better hit area and logic
function ToggleWrapper({ active, onToggle, label, desc }: { active: boolean, onToggle: (v: boolean) => void, label: string, desc: string }) {
  return (
    <div 
      className="flex items-center justify-between py-4 group cursor-pointer select-none"
      onClick={() => onToggle(!active)}
    >
      <div className="pr-4 flex-1">
        <div className="font-bold text-text group-hover:text-primary transition-colors text-sm md:text-base">{label}</div>
        <div className="text-[10px] md:text-xs text-text-muted">{desc}</div>
      </div>
      <div 
        className={`w-12 h-6.5 rounded-full relative transition-all duration-300 shrink-0 ${
          active ? "bg-primary shadow-[0_0_15px_rgba(255,193,7,0.3)]" : "bg-surface border border-border"
        }`}
      >
        <motion.div 
          animate={{ x: active ? 24 : 4 }}
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`w-4.5 h-4.5 rounded-full absolute top-1 ${active ? "bg-black" : "bg-text-muted"}`}
        />
      </div>
    </div>
  );
}

function Modal({ title, children, onClose }: any) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-sm glass rounded-[32px] border border-border shadow-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-border flex items-center justify-between bg-surface/50">
          <h3 className="font-black text-text uppercase text-xs tracking-widest">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-surface rounded-full text-text-muted transition-colors"><X size={18}/></button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
}

function PasswordForm({ onSuccess, onUpdate }: any) {
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  
  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const success = await onUpdate({ password: pass });
    if (success) onSuccess();
    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <input 
        type="password" 
        placeholder="Придумайте пароль" 
        required 
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        className="w-full bg-surface border border-border rounded-2xl px-5 py-4 text-text focus:border-primary outline-none text-sm"
      />
      <button disabled={loading} className="w-full bg-primary text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-dark transition-all">
        {loading ? <Loader2 className="animate-spin" size={18}/> : "Сохранить"}
      </button>
    </form>
  );
}

function PhoneForm({ currentPhone, onSuccess, onUpdate }: any) {
  const [phone, setPhone] = useState(currentPhone);
  const [loading, setLoading] = useState(false);
  
  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const success = await onUpdate({ phone });
    if (success) onSuccess();
    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted font-bold text-sm">+7</div>
        <input 
          type="tel" 
          placeholder="999 000-00-00" 
          required 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-surface border border-border rounded-2xl pl-12 pr-4 py-4 text-text focus:border-primary outline-none text-sm font-mono"
        />
      </div>
      <p className="text-[10px] text-text-muted text-center px-2">Номер будет обновлен мгновенно. Подтверждение не требуется.</p>
      <button disabled={loading} className="w-full bg-primary text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-dark transition-all">
        {loading ? <Loader2 className="animate-spin" size={18}/> : "Обновить номер"}
      </button>
    </form>
  );
}
