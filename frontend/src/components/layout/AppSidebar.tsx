"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
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

  const mainItems = isAr
    ? [
        { label: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard },
        { label: "الوظائف والفرص", href: "/jobs", icon: Briefcase },
      ]
    : [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Jobs", href: "/jobs", icon: Briefcase },
      ];

  const bottomItems = isAr
    ? [{ label: "الإعدادات", href: "/settings", icon: Settings }]
    : [{ label: "Settings", href: "/settings", icon: Settings }];

  const renderLink = (item: { label: string; href: string; icon: React.ComponentType<{ className?: string }> }) => {
    const Icon = item.icon;
    const isActive = pathname === item.href || (item.href === '/jobs' && pathname.startsWith('/jobs'));
    return (
      <Link
        key={item.label}
        href={item.href}
        onClick={onCloseMobile}
        className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all duration-200 ${
          isActive
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/25'
            : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
        }`}
      >
        <Icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${
          isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
        }`} />
        <span>{item.label}</span>
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#060913] text-[#F8FAFC] select-none">
      
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
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

      {/* Subtle divider */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col justify-between px-3 py-5">
        <div className="space-y-1">
          <span className="px-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-2 block">
            {isAr ? "القائمة" : "MENU"}
          </span>
          {mainItems.map(renderLink)}
        </div>

        <div className="space-y-1">
          <div className="mx-2 mb-3 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          {bottomItems.map(renderLink)}
        </div>
      </nav>

      {/* User Profile Mini Bar */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between rounded-xl p-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] transition-colors cursor-pointer">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-[12px] font-black shadow-lg shadow-blue-600/20">
              AS
            </div>
            <div className="min-w-0">
              <span className="block truncate text-[13px] font-bold text-white leading-tight">
                {isAr ? "أحمد سيد" : "Ahmed Sayed"}
              </span>
              <span className="block truncate text-[11px] text-slate-500 font-medium mt-0.5">
                {isAr ? "محلل بيانات" : "Data Analyst"}
              </span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-600 shrink-0" />
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed top-0 ltr:left-0 rtl:right-0 bottom-0 z-40 border-r rtl:border-r-0 rtl:border-l border-white/[0.06]">
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
