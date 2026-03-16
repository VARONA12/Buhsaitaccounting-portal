"use client";

import {
  ShieldCheck,
  Users,
  Receipt,
  Calendar,
  MessageSquare,
  LogOut,
  LayoutDashboard,
  Search,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  Send,
  Plus,
  Loader2,
  FileText
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AdminLayout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  
  const [activeTab, setActiveTab] = useState(tabFromUrl || "clients");
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && !(session.user as any).isAdmin) {
      router.push("/dashboard");
    } else if (status === "authenticated") {
      fetchClients();
    }
  }, [status, session]);

  useEffect(() => {
    if (tabFromUrl) setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/admin/clients");
      const data = await res.json();
      setClients(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: "clients", label: "Клиенты", icon: Users },
    { id: "invoices", label: "Счета", icon: Receipt },
    { id: "calendar", label: "Календарь", icon: Calendar },
    { id: "messages", label: "Сообщения", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#070707] text-white flex font-sans">
      {/* Admin Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col h-screen sticky top-0">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(255,193,7,0.3)]">
              <ShieldCheck className="text-black w-6 h-6" />
            </div>
            <div>
              <div className="font-black text-xl tracking-tighter">ADMIN</div>
              <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] -mt-1">ЭлитФинанс</div>
            </div>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  router.push(`/admin?tab=${tab.id}`);
                }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? "bg-primary text-black shadow-xl" 
                    : "text-neutral-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 space-y-4">
          <Link 
            href="/dashboard"
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-neutral-400 hover:text-white hover:bg-white/5 transition-all border border-white/5"
          >
            <LayoutDashboard size={20} />
            В кабинет клиента
          </Link>
          <button 
            onClick={() => signOut()}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-red-500/80 hover:text-red-500 hover:bg-red-500/5 transition-all"
          >
            <LogOut size={20} />
            Выйти
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Admin Header */}
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-black/20 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black">{tabs.find(t => t.id === activeTab)?.label}</h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Система активна</span>
            </div>
            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                <div className="text-right">
                    <div className="text-sm font-bold">{session?.user?.name}</div>
                    <div className="text-[10px] text-primary font-black uppercase">Главный бухгалтер</div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-primary">
                    {session?.user?.name?.[0]}
                </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-10 flex-1 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "clients" && <ClientsTab clients={clients} />}
              {activeTab === "invoices" && <InvoicesTab clients={clients} onRefresh={fetchClients} />}
              {activeTab === "calendar" && <CalendarTab clients={clients} />}
              {activeTab === "messages" && <MessagesTab clients={clients} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- Tab Components ---

function ClientsTab({ clients }: any) {
  return (
    <div className="grid gap-8">
      <div className="flex justify-between items-center">
        <div className="relative w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Поиск клиентов..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-primary outline-none transition-all"
          />
        </div>
        <div className="flex gap-4">
           {/* Summary Stats */}
           <div className="glass px-6 py-3 rounded-2xl border border-white/5 text-sm font-bold">
             Всего: <span className="text-primary ml-1">{clients.length}</span>
           </div>
        </div>
      </div>

      <div className="glass rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 border-b border-white/5 text-[10px] text-neutral-500 uppercase font-black tracking-widest">
              <th className="px-8 py-6">Клиент / Компания</th>
              <th className="px-8 py-6">ИНН / Система</th>
              <th className="px-8 py-6">Документы</th>
              <th className="px-8 py-6">Счета</th>
              <th className="px-8 py-6 text-right">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {clients.map((client: any) => (
              <tr key={client.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-8 py-7">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-neutral-400 group-hover:text-primary transition-colors">
                        {client.name[0]}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-white text-lg leading-tight">{client.name}</span>
                        <span className="text-xs text-neutral-500 tracking-tight">{client.company}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-7">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{client.taxSystem || "УСН"}</span>
                    <span className="text-[10px] text-neutral-500">ИНН {client.inn || "---"}</span>
                  </div>
                </td>
                <td className="px-8 py-7">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-primary" />
                    <span className="font-bold">{client.documents?.length || 0}</span>
                  </div>
                </td>
                <td className="px-8 py-7 font-bold text-neutral-400">
                    {client.invoices?.length || 0}
                </td>
                <td className="px-8 py-7 text-right">
                  <div className="flex items-center justify-end gap-2 text-[10px] font-black uppercase text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20 w-fit ml-auto">
                    Active
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InvoicesTab({ clients, onRefresh }: any) {
  const allInvoices = clients.flatMap((c: any) => c.invoices.map((i: any) => ({ ...i, user: c })));

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/invoices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="grid gap-8">
      {/* Invoice Stats */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: "Всего счетов", val: allInvoices.length, color: "text-white" },
          { label: "Ожидают оплаты", val: allInvoices.filter((i: any) => i.status === "Ожидание").length, color: "text-primary" },
          { label: "Оплачено", val: allInvoices.filter((i: any) => i.status === "Оплачен").length, color: "text-green-500" },
          { label: "Просрочено", val: allInvoices.filter((i: any) => i.status === "Просрочен").length, color: "text-xl text-red-500" }
        ].map((s, i) => (
          <div key={i} className="glass p-8 rounded-[32px] border border-white/5">
             <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">{s.label}</div>
             <div className={`text-3xl font-black ${s.color}`}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-[32px] border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/5 text-[10px] text-neutral-500 uppercase font-black tracking-widest">
            <tr>
              <th className="px-8 py-6">Клиент</th>
              <th className="px-8 py-6">Номер / Сумма</th>
              <th className="px-8 py-6">Дата / Срок</th>
              <th className="px-8 py-6">Статус</th>
              <th className="px-8 py-6 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {allInvoices.map((inv: any) => (
              <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                <td className="px-8 py-7">
                  <div className="font-bold text-white leading-none mb-1">{inv.user.name}</div>
                  <div className="text-[10px] text-neutral-500">{inv.user.company}</div>
                </td>
                <td className="px-8 py-7">
                  <div className="font-black text-primary text-xs mb-1 uppercase tracking-tighter">{inv.number}</div>
                  <div className="font-black text-lg">{inv.amount} ₽</div>
                </td>
                <td className="px-8 py-7">
                   <div className="text-white text-sm font-bold">{new Date(inv.dueDate).toLocaleDateString("ru")}</div>
                </td>
                <td className="px-8 py-7">
                   <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border
                    ${inv.status === 'Оплачен' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      inv.status === 'Просрочен' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                      'bg-primary/10 text-primary border-primary/20'}
                  `}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-8 py-7 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => updateStatus(inv.id, "Оплачен")} title="Оплачен" className="p-3 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black transition-all shadow-lg active:scale-90"><CheckCircle2 size={18} /></button>
                    <button onClick={() => updateStatus(inv.id, "Ожидание")} title="В ожидании" className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-black transition-all shadow-lg active:scale-90"><Clock size={18} /></button>
                    <button onClick={() => updateStatus(inv.id, "Просрочен")} title="Просрочен" className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-black transition-all shadow-lg active:scale-90"><AlertCircle size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CalendarTab({ clients }: any) {
  const [formData, setFormData] = useState({ title: "", dueDate: "", status: "оплата", targetUserId: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/admin/taxes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      alert("Событие успешно добавлено в календари!");
      setFormData({ title: "", dueDate: "", status: "оплата", targetUserId: "" });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="glass p-12 rounded-[48px] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-20 -mt-20" />
        
        <div className="relative z-10">
            <h3 className="text-3xl font-black mb-10 flex items-center gap-4">
               <div className="p-3 bg-primary rounded-2xl text-black"><Plus /></div>
               Создать дедлайн
            </h3>

            <form onSubmit={submit} className="space-y-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Информация о задаче</label>
                    <input 
                        type="text" 
                        required 
                        placeholder="Название события (например: Декларация НДС 2 кв.)"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-lg outline-none focus:border-primary transition-all shadow-inner"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Дата события</label>
                        <input 
                            type="date" 
                            required 
                            value={formData.dueDate}
                            onChange={e => setFormData({...formData, dueDate: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-primary transition-all color-scheme-dark"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Категория</label>
                        <select 
                            value={formData.status}
                            onChange={e => setFormData({...formData, status: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-primary transition-all appearance-none"
                        >
                            <option value="оплата">💸 Оплата</option>
                            <option value="отчет">📊 Отчет</option>
                            <option value="уведомление">🔔 Уведомление</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Для кого</label>
                    <select 
                        value={formData.targetUserId}
                        onChange={e => setFormData({...formData, targetUserId: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-primary transition-all appearance-none"
                    >
                        <option value="">🌍 ВСЕМ КЛИЕНТАМ (Глобально)</option>
                        {clients.map((c: any) => (
                          <option key={c.id} value={c.id}>👤 {c.name} ({c.company})</option>
                        ))}
                    </select>
                </div>

                <button 
                    disabled={loading}
                    className="w-full bg-primary text-black font-black py-6 rounded-[24px] text-lg shadow-[0_20px_40px_rgba(255,193,7,0.2)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : "Опубликовать в календари"}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}

function MessagesTab({ clients }: any) {
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [msgText, setMsgText] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: any) => {
    e.preventDefault();
    if (!selectedClient || !msgText.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedClient.id, text: msgText })
      });
      setMsgText("");
      alert("Сообщение доставлено!");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-black/20 rounded-[48px] border border-white/5 h-[700px] overflow-hidden shadow-2xl">
      {/* Sidebar - Contacts */}
      <div className="w-96 border-r border-white/5 flex flex-col bg-black/20">
        <div className="p-8 border-b border-white/5">
             <h3 className="text-xl font-black mb-4">Чаты</h3>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
                <input type="text" placeholder="Поиск клиента..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:border-primary transition-all" />
             </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">
            {clients.map((c: any) => (
                <button
                    key={c.id}
                    onClick={() => setSelectedClient(c)}
                    className={`w-full text-left p-5 rounded-3xl transition-all flex items-center gap-4 ${
                        selectedClient?.id === c.id ? "bg-primary text-black shadow-lg" : "hover:bg-white/5 grayscale-[0.5] hover:grayscale-0"
                    }`}
                >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                        selectedClient?.id === c.id ? "bg-black/10" : "bg-white/5"
                    }`}>
                        {c.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-bold truncate">{c.name}</div>
                        <div className={`text-[10px] uppercase font-black tracking-widest ${selectedClient?.id === c.id ? "text-black/60" : "text-neutral-500"}`}>
                            {c.company}
                        </div>
                    </div>
                </button>
            ))}
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {selectedClient ? (
           <>
             {/* Chat Header */}
             <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-black font-black text-xl">
                        {selectedClient.name[0]}
                    </div>
                    <div>
                        <div className="font-black text-xl">{selectedClient.name}</div>
                        <div className="text-xs text-neutral-500">ИНН: {selectedClient.inn || '---'}</div>
                    </div>
                </div>
                <button className="p-4 rounded-full bg-white/5 hover:bg-white/10 hover:text-primary transition-all">
                    <Bell size={20} />
                </button>
             </div>

             {/* Message Flow */}
             <div className="flex-1 p-10 overflow-y-auto no-scrollbar space-y-8">
                <div className="flex justify-center">
                    <div className="bg-white/5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 border border-white/10">
                        Сегодня
                    </div>
                </div>
                {/* Real messages would follow here - placeholder for now */}
                <div className="text-center py-20 text-neutral-600 italic text-sm font-medium">История переписки подгружается...</div>
             </div>

             {/* Footer Input */}
             <div className="p-8 bg-black/40 border-t border-white/5">
                <form onSubmit={sendMessage} className="flex gap-4">
                    <input 
                        type="text" 
                        value={msgText}
                        onChange={e => setMsgText(e.target.value)}
                        placeholder="Введите сообщение для клиента..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-[24px] px-8 py-5 text-sm outline-none focus:border-primary transition-all shadow-inner"
                    />
                    <button 
                        disabled={loading || !msgText.trim()}
                        className="bg-primary text-black p-5 rounded-[24px] shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        <Send size={24} />
                    </button>
                </form>
             </div>
           </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-20 gap-6 opacity-20">
                <div className="w-32 h-32 rounded-[48px] bg-white/5 flex items-center justify-center">
                    <MessageSquare size={64} />
                </div>
                <div>
                    <h4 className="text-2xl font-black mb-2">Выберите чат</h4>
                    <p className="max-w-xs text-sm font-medium">Выберите клиента в списке слева, чтобы начать переписку в безопасном чате</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
