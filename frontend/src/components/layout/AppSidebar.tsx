"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  FileCheck2,
  FileText, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AppSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AppSidebar({ mobileOpen = false, onCloseMobile }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAr } = useLanguage();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success(isAr ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully');
    router.push('/login');
  };

  const navGroups = isAr
    ? [
        {
          group: "الرئيسية",
          items: [
            { label: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard },
            { label: "الوظائف والفرص", href: "/jobs", icon: Briefcase },
          ]
        },
        {
          group: "أدوات السيرة الذاتية والمهارات",
          items: [
            { label: "فاحص الـ ATS والتشخيص", href: "/ats-diagnostics", icon: FileCheck2 },
            { label: "صانع السيرة الذاتية الذكي", href: "/cv-builder", icon: FileText },
            { label: "فجوة المهارات وتطويرها", href: "/skills", icon: Zap },
          ]
        },
        {
          group: "السوق والذكاء الاصطناعي",
          items: [
            { label: "مؤشرات سوق العمل", href: "/market", icon: TrendingUp },
            { label: "المساعد الذكي (Copilot)", href: "/copilot", icon: Sparkles },
          ]
        }
      ]
    : [
        {
          group: "MAIN",
          items: [
            { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { label: "Jobs & Opportunities", href: "/jobs", icon: Briefcase },
          ]
        },
        {
          group: "CV & SKILLS TOOLS",
          items: [
            { label: "ATS Diagnostics & Checker", href: "/ats-diagnostics", icon: FileCheck2 },
            { label: "Smart CV Builder", href: "/cv-builder", icon: FileText },
            { label: "Skill Gap Matrix", href: "/skills", icon: Zap },
          ]
        },
        {
          group: "MARKET & AI",
          items: [
            { label: "Market Intelligence", href: "/market", icon: TrendingUp },
            { label: "AI Career Copilot", href: "/copilot", icon: Sparkles },
          ]
        }
      ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-[#0B132B] dark:bg-[#070C18] text-[#F8FAFC] p-4 sm:p-5 select-none overflow-hidden transition-colors duration-200">
      
      {/* Top Area: Logo + Nav Items */}
      <div className="space-y-5">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-1 pb-1">
          <Link href="/dashboard" className="transition-transform hover:scale-105">
            <Logo size="md" />
          </Link>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

        {/* Nav Groups */}
        <nav className="space-y-4">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1.5">
              <span className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                {group.group}
              </span>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href === '/jobs' && pathname.startsWith('/jobs'));
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={onCloseMobile}
                      className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all duration-150 group ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-600/30 ring-1 ring-white/10'
                          : 'text-slate-300 dark:text-slate-400 hover:text-white hover:bg-white/[0.08] active:scale-[0.98]'
                      }`}
                    >
                      <Icon className={`w-4.5 h-4.5 shrink-0 transition-transform duration-150 group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                      }`} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

      </div>

      {/* Bottom Area: Settings + Logout only */}
      <div className="pt-3 border-t border-white/[0.1] space-y-1.5">
        
        {/* Settings link */}
        <Link
          href="/settings"
          onClick={onCloseMobile}
          className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all duration-150 group ${
            pathname === '/settings'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-600/30 ring-1 ring-white/10'
              : 'text-slate-300 dark:text-slate-400 hover:text-white hover:bg-white/[0.08] active:scale-[0.98]'
          }`}
        >
          <Settings className={`w-4.5 h-4.5 transition-transform duration-150 group-hover:rotate-45 ${
            pathname === '/settings' ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
          }`} />
          <span>{isAr ? "الإعدادات" : "Settings"}</span>
        </Link>

        {/* Direct Log Out Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3.5 px-4 py-2.5 w-full rounded-xl text-[13.5px] font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-150 cursor-pointer group active:scale-[0.98]"
        >
          <LogOut className="w-4.5 h-4.5 text-slate-400 group-hover:text-rose-400 transition-transform group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5" />
          <span>{isAr ? "تسجيل الخروج" : "Log out"}</span>
        </button>

      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed top-0 ltr:left-0 rtl:right-0 bottom-0 z-40 border-r rtl:border-r-0 rtl:border-l border-slate-800/80 dark:border-white/10 shadow-2xl">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
