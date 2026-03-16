"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { ProfileDropdown } from "./ProfileDropdown";
import { NotificationDropdown } from "./NotificationDropdown";
import { Search, Loader2, FileText, FileBox } from "lucide-react";
import Link from "next/link";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
          const data = await res.json();
          setSearchResults(data);
          setShowResults(true);
        } catch (e) {
          console.error(e);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex bg-[#000000] min-h-screen items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex bg-[#000000] min-h-screen text-white overflow-hidden font-sans">
      <Sidebar />
      
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* Top Navigation */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 relative z-30 glass bg-transparent">
          <div></div>
          <div className="flex items-center gap-6">
            <div className="relative group" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                placeholder="Поиск..." 
                className="bg-[#0A0A0A] border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all w-64 text-white placeholder:text-neutral-500"
              />
              
              {/* Search Results Dropdown */}
              {showResults && (
                <div className="absolute top-full left-0 mt-2 w-80 glass border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 border-b border-white/5 bg-white/5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center justify-between">
                    Результаты поиска
                    {isSearching && <Loader2 className="w-3 h-3 animate-spin" />}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {searchResults.length === 0 ? (
                      <div className="p-4 text-center text-sm text-neutral-500">Ничего не найдено</div>
                    ) : (
                      searchResults.map((r, i) => (
                        <Link 
                          key={i} 
                          href={r.href}
                          onClick={() => setShowResults(false)}
                          className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            {r.type === 'invoice' ? <FileText size={16} /> : <FileBox size={16} />}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{r.title}</div>
                            <div className="text-[10px] text-neutral-500">{r.detail}</div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <NotificationDropdown />
            <ProfileDropdown />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative">
          {children}
        </div>
        
        {/* Background Decorations */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: `4rem 4rem`
          }}
        ></div>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#000000] via-transparent to-transparent z-0"></div>
      </main>
    </div>
  );
}
