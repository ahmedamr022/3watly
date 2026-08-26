"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  User, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  FileText, 
  Settings, 
  ChevronDown,
  X
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { useLanguage } from '@/contexts/LanguageContext';

interface AppSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AppSidebar({ mobileOpen = false, onCloseMobile }: AppSidebarProps) {
  const pathname = usePathname();
  const { isAr } = useLanguage();

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
          group: "المسار المهني",
          items: [
            { label: "ملفي المهني", href: "/career", icon: User },
            { label: "صانع السيرة الذاتية (ATS)", href: "/cv-builder", icon: FileText },
            { label: "فجوة المهارات", href: "/skills", icon: Zap },
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
          group: "CAREER",
          items: [
            { label: "My Career Profile", href: "/career", icon: User },
            { label: "ATS CV Builder", href: "/cv-builder", icon: FileText },
            { label: "Skill Gap Matrix", href: "/skills", icon: Zap },
          ]
        },
        {
          group: "INSIGHTS & AI",
          items: [
            { label: "Market Intelligence", href: "/market", icon: TrendingUp },
            { label: "AI Career Copilot", href: "/copilot", icon: Sparkles },
          ]
        }
      ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-[#060913] text-[#F8FAFC] p-4 sm:p-5 select-none overflow-hidden">
      
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
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />

        {/* Nav Groups with enhanced spacing and hover effects */}
        <nav className="space-y-4">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1.5">
              <span className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
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
                      className={`relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all duration-200 group ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-600/30'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.07] hover:shadow-xs'
                      }`}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <span className="absolute ltr:left-0 rtl:right-0 top-2 bottom-2 w-1 rounded-full bg-white shadow-sm" />
                      )}
                      
                      <Icon className={`w-4.5 h-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
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

      {/* Bottom Area: Settings + User Profile */}
      <div className="pt-4 border-t border-white/[0.08] space-y-2.5">
        
        {/* Settings link with beautiful hover */}
        <Link
          href="/settings"
          onClick={onCloseMobile}
          className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all duration-200 group ${
            pathname === '/settings'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.07]'
          }`}
        >
          <Settings className={`w-4.5 h-4.5 transition-transform duration-200 group-hover:rotate-45 ${
            pathname === '/settings' ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
          }`} />
          <span>{isAr ? "الإعدادات" : "Settings"}</span>
        </Link>

        {/* User Profile Bar */}
        <div className="flex items-center justify-between rounded-2xl p-2.5 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] transition-all duration-200 cursor-pointer group">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-[12px] font-black shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              AS
            </div>
            <div className="min-w-0">
              <span className="block truncate text-[13px] font-bold text-white leading-tight">
                {isAr ? "أحمد سيد" : "Ahmed Sayed"}
              </span>
              <span className="block truncate text-[11px] text-slate-400 font-medium mt-0.5">
                {isAr ? "محلل بيانات" : "Data Analyst"}
              </span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors shrink-0" />
        </div>

      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed top-0 ltr:left-0 rtl:right-0 bottom-0 z-40 border-r rtl:border-r-0 rtl:border-l border-white/[0.08] shadow-2xl">
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
