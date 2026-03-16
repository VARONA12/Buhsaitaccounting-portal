import {
  LayoutDashboard,
  Wallet,
  CalendarDays,
  FileText,
  FileBox,
  Settings,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Главная", icon: LayoutDashboard, href: "/" },
    { name: "Счета", icon: Wallet, href: "/invoices" },
    { name: "Календарь", icon: CalendarDays, href: "/calendar" },
    { name: "Акты", icon: FileText, href: "/acts" },
    { name: "Документы", icon: FileBox, href: "/documents" },
  ];

  return (
    <aside className="w-64 h-full flex flex-col justify-between py-8 px-4 border-r border-white/5 bg-[#000000] glass fixed md:relative z-20">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 mb-12">
          <div className="w-8 h-8 rounded shrink-0 bg-primary flex items-center justify-center">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-wide text-white">АПЕКС</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(255,193,7,0.1)] font-medium"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-primary text-glow" : ""}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Links */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <Link 
          href="/settings"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <Settings className="w-5 h-5" />
          Настройки
        </Link>
        <Link 
          href="/help"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <HelpCircle className="w-5 h-5" />
          Помощь
        </Link>
      </div>
    </aside>
  );
}
