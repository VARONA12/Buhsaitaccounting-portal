import {
  LayoutDashboard,
  Wallet,
  CalendarDays,
  FileText,
  FileBox,
  Settings,
  X,
  ShieldCheck,
  Users,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isAdminMode?: boolean;
}

export function Sidebar({ isOpen, onClose, isAdminMode }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdminUser = (session?.user as any)?.isAdmin;

  const userNavItems = [
    { name: "Главная", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Счета", icon: Wallet, href: "/invoices" },
    { name: "Календарь", icon: CalendarDays, href: "/calendar" },
    { name: "Акты", icon: FileText, href: "/acts" },
    { name: "Документы", icon: FileBox, href: "/documents" },
    { name: "Чат", icon: MessageSquare, href: "/chat" },
  ];

  const adminNavItems = [
    { name: "Обзор", icon: LayoutDashboard, href: "/admin" },
    { name: "Клиенты", icon: Users, href: "/admin?tab=clients" },
    { name: "Счета всех", icon: Wallet, href: "/admin?tab=invoices" },
    { name: "Рассылка", icon: MessageSquare, href: "/admin?tab=messages" },
  ];

  const navItems = isAdminMode ? adminNavItems : userNavItems;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed md:relative top-0 left-0 h-full w-64 flex flex-col justify-between py-8 px-4 border-r border-border bg-bg glass z-50 transition-all duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div>
          {/* Logo & Close Button (Mobile) */}
          <div className="flex items-center justify-between px-4 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded shrink-0 bg-primary flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
                </svg>
              </div>
              <span className="font-bold text-xl tracking-wide text-text">ЭлитФинанс</span>
            </div>
            <button onClick={onClose} className="md:hidden text-text-muted hover:text-text">
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => onClose && onClose()}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-black font-bold shadow-[0_0_20px_rgba(255,193,7,0.2)]"
                      : "text-text-muted hover:text-text hover:bg-surface-hover"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Links */}
        <div className="p-4 border-t border-border space-y-2">
          <Link 
            href="/settings"
            onClick={() => onClose && onClose()}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              pathname === '/settings' 
                ? "bg-primary text-black font-bold"
                : "text-text-muted hover:text-text hover:bg-surface-hover"
            }`}
          >
            <Settings className="w-5 h-5" />
            Настройки
          </Link>

          {isAdminUser && !isAdminMode && (
             <Link 
              href="/admin"
              onClick={() => onClose && onClose()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-primary hover:bg-primary/10 border border-primary/20 bg-primary/5"
            >
              <ShieldCheck className="w-5 h-5" />
              Админ-панель
            </Link>
          )}

           {isAdminMode && (
             <Link 
              href="/dashboard"
              onClick={() => onClose && onClose()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-text-muted hover:text-text hover:bg-surface-hover"
            >
              <LayoutDashboard className="w-5 h-5" />
              В кабинет
            </Link>
          )}

        </div>
      </aside>
    </>
  );
}
