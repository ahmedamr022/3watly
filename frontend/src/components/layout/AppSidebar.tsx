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
  Wallet, 
  Building2, 
  FileText, 
  BookOpen, 
  BarChart3, 
  Bookmark, 
  Settings, 
  Crown,
  ChevronDown,
  ArrowRight,
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
            { label: "ملفي المهني", href: "/career", icon: User },
            { label: "المساعد الذكي (AI)", href: "/copilot", icon: Sparkles }
          ]
        },
        {
          group: "تحليلات السوق",
          items: [
            { label: "مؤشرات السوق", href: "/market", icon: TrendingUp },
            { label: "تحليل المهارات", href: "/skills", icon: Zap },
            { label: "استكشاف الرواتب", href: "/salaries", icon: Wallet },
            { label: "دليل الشركات", href: "/companies", icon: Building2 }
          ]
        },
        {
          group: "الأدوات الذكية",
          items: [
            { label: "صانع السيرة الذاتية", href: "/cv-builder", icon: FileText },
            { label: "مسارات التعلم", href: "/learning", icon: BookOpen },
            { label: "تقارير السوق", href: "/reports", icon: BarChart3 }
          ]
        },
        {
          group: "الحساب",
          items: [
            { label: "العناصر المحفوظة", href: "/saved", icon: Bookmark },
            { label: "الإعدادات", href: "/settings", icon: Settings }
          ]
        }
      ]
    : [
        {
          group: "MAIN",
          items: [
            { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { label: "Jobs", href: "/jobs", icon: Briefcase },
            { label: "My Career", href: "/career", icon: User },
            { label: "AI Career Copilot", href: "/copilot", icon: Sparkles }
          ]
        },
        {
          group: "INSIGHTS",
          items: [
            { label: "Market Overview", href: "/market", icon: TrendingUp },
            { label: "Skill Analysis", href: "/skills", icon: Zap },
            { label: "Salary Insights", href: "/salaries", icon: Wallet },
            { label: "Companies", href: "/companies", icon: Building2 }
          ]
        },
        {
          group: "TOOLS",
          items: [
            { label: "CV Builder", href: "/cv-builder", icon: FileText },
            { label: "Learning Paths", href: "/learning", icon: BookOpen },
            { label: "Reports", href: "/reports", icon: BarChart3 }
          ]
        },
        {
          group: "ACCOUNT",
          items: [
            { label: "Saved Items", href: "/saved", icon: Bookmark },
            { label: "Settings", href: "/settings", icon: Settings }
          ]
        }
      ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-[#060913] text-[#F8FAFC] p-4 sm:p-5 select-none overflow-y-auto custom-scrollbar">
      
      {/* Top Section: Logo & Nav Links */}
      <div className="space-y-6">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-1 pb-2">
          <Link href="/dashboard" className="transition-transform hover:scale-105">
            <Logo size="md" />
          </Link>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-5">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              <span className="px-3 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">
                {group.group}
              </span>
              <div className="mt-1 space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href === '/jobs' && pathname.startsWith('/jobs'));
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={onCloseMobile}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-bold transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

      </div>

      {/* Bottom Section: Pro Upgrade Card & User Profile */}
      <div className="mt-6 pt-4 space-y-4 border-t border-white/[0.08]">
        
        {/* Upgrade to Pro Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#131E35] to-[#0A1224] p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 border border-amber-500/30">
              <Crown className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-[13px] font-bold text-white">
              {isAr ? "الترقية للباقة الاحترافية" : "Upgrade to Pro"}
            </span>
          </div>
          <p className="mt-2 text-[11.5px] text-slate-400 leading-relaxed font-normal">
            {isAr
              ? "افتح كافة التحليلات العميقة، وفاحص الـ ATS المتقدم، والمستشار الذكي."
              : "Unlock full insights, ATS checker, and AI coach."}
          </p>
          <button
            type="button"
            className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[12.5px] font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <span>{isAr ? "ترقية الحساب الآن" : "Upgrade Now"}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* User Profile Mini Bar */}
        <div className="flex items-center justify-between rounded-xl p-2 hover:bg-white/[0.04] transition-colors cursor-pointer">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-[12px] font-black shadow-sm">
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
          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
        </div>

      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent Fixed Left/Right) */}
      <aside className="hidden lg:flex w-64 xl:w-72 flex-col fixed top-0 ltr:left-0 rtl:right-0 bottom-0 z-40 border-r rtl:border-r-0 rtl:border-l border-white/[0.08] shadow-2xl">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
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
