"use client";

import { useState, useEffect, useRef } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Send, Loader2, User, ShieldCheck } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ChatPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText })
      });
      const newMessage = await res.json();
      setMessages([...messages, newMessage]);
      setInputText("");
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardShell>
      <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-text">Консультация с бухгалтером</h1>
          <p className="text-text-muted text-sm">Мы ответим вам в ближайшее рабочее время</p>
        </div>

        <div className="flex-1 glass border border-border rounded-[32px] overflow-hidden flex flex-col shadow-2xl">
          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 no-scrollbar">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" />
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-50 gap-4 text-center px-10">
                <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center">
                  <User size={32} />
                </div>
                <p className="font-bold text-sm">Здесь пока нет сообщений. Напишите ваш первый вопрос!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black ${
                      msg.sender === 'user' ? 'bg-primary text-black' : 'bg-surface border border-border text-primary'
                    }`}>
                      {msg.sender === 'user' ? <User size={14} /> : <ShieldCheck size={14} />}
                    </div>
                    <div>
                      <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-primary text-black font-bold rounded-tr-none' 
                          : 'bg-surface border border-border text-text rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                      <div className={`text-[10px] mt-1 text-text-muted ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-surface/30 border-t border-border">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Напишите сообщение..." 
                className="flex-1 bg-surface border border-border rounded-2xl px-6 py-4 text-sm focus:border-primary outline-none transition-all text-text"
              />
              <button 
                type="submit" 
                disabled={sending || !inputText.trim()}
                className="bg-primary text-black p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center shrink-0"
              >
                {sending ? <Loader2 className="animate-spin" /> : <Send size={20} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
