"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User } from "lucide-react";
import { useSession } from "next-auth/react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "admin";
  createdAt: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { status } = useSession();

  // Load history
  useEffect(() => {
    if (isOpen) {
      fetch("/api/chat")
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(console.error);
    }
  }, [isOpen]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Poll for messages (simulation)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen) {
      interval = setInterval(() => {
        fetch("/api/chat")
          .then(res => res.json())
          .then(data => {
            if (data.length > messages.length) setMessages(data);
          });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isOpen, messages.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const text = inputValue.trim();
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const newMessage = await res.json();
      setMessages(prev => [...prev, newMessage]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (status !== "authenticated") return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-primary text-black flex items-center justify-center shadow-[0_10px_40px_rgba(255,193,7,0.4)] hover:scale-110 active:scale-95 transition-all group"
        >
          <MessageCircle size={28} />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-[#000000] text-[10px] flex items-center justify-center font-bold text-white">1</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-96 h-[500px] glass rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-primary text-black flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center">
                <User size={20} />
              </div>
              <div>
                <div className="font-bold text-sm">Ваш бухгалтер</div>
                <div className="text-[10px] font-medium opacity-60">Онлайн • Ответит в течение 10 мин</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-black/10 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                <MessageCircle size={48} className="mb-4" />
                <p className="text-sm">Задайте любой вопрос бухгалтеру. Мы поможем с налогами, счетами и отчетностью.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.sender === "user" 
                      ? "bg-primary text-black rounded-tr-none" 
                      : "bg-white/5 border border-white/10 text-white rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-black/40 border-t border-white/5 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Введите сообщение..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-all"
            />
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="w-10 h-10 rounded-xl bg-primary text-black flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 transition-all font-bold"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
