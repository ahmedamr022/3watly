"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
  Shield,
  BarChart3,
  X,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  label: string;
  labelAr: string;
  href: string;
  icon: React.ElementType;
  ownerOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    labelAr: 'لوحة التحكم',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Users',
    labelAr: 'المستخدمون',
    href: '/admin/users',
    icon: Users,
  },
  {
    label: 'Resources',
    labelAr: 'المصادر التعليمية',
    href: '/admin/resources',
    icon: BookOpen,
  },
  {
    label: 'Analytics',
    labelAr: 'التحليلات',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    label: 'Audit Logs',
    labelAr: 'سجل العمليات',
    href: '/admin/audit-logs',
    icon: FileText,
    ownerOnly: true,
  },
  {
    label: 'Settings',
    labelAr: 'الإعدادات',
    href: '/admin/settings',
    icon: Settings,
  },
];

const STORAGE_KEY = '3watly_admin_sidebar_collapsed';

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function AdminSidebar({ mobileOpen, onMobileClose }: AdminSidebarProps) {
  const { isAr } = useLanguage();
  const { isOwner } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) setCollapsed(stored === 'true');
    } catch {}
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try { localStorage.setItem(STORAGE_KEY, String(next)); } catch {}
      return next;
    });
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.ownerOnly || isOwner
  );

  const sidebarContent = (
    <div className={`
      flex flex-col h-full bg-[#040816] border-e border-white/8
      transition-all duration-300 ease-in-out
      ${collapsed ? 'w-16' : 'w-60'}
    `}>
      {/* Logo / Header */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/8 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/20">
              <Shield className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-[13px] font-bold text-white truncate">
              {isAr ? 'استوديو الإدارة' : 'Admin Studio'}
            </span>
          </div>
        )}
        {collapsed && (
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/20">
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
        )}
        <button
          type="button"
          onClick={toggleCollapsed}
          className="hidden lg:flex p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer shrink-0"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isAr
            ? (collapsed ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />)
            : (collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />)
          }
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {visibleItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              title={collapsed ? (isAr ? item.labelAr : item.label) : undefined}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
                transition-all duration-150 group
                ${active
                  ? 'bg-gradient-to-r from-cyan-500/15 to-indigo-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              {!collapsed && (
                <span className="truncate">{isAr ? item.labelAr : item.label}</span>
              )}
              {active && !collapsed && (
                <span className="ms-auto h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Back to App */}
      <div className={`p-3 border-t border-white/8 ${collapsed ? 'flex justify-center' : ''}`}>
        <Link
          href="/dashboard"
          onClick={onMobileClose}
          className={`
            flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-medium
            text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors
            ${collapsed ? 'justify-center' : ''}
          `}
          title={collapsed ? (isAr ? 'العودة للتطبيق' : 'Back to App') : undefined}
        >
          {isAr ? <ChevronRight className="w-3.5 h-3.5 shrink-0" /> : <ChevronLeft className="w-3.5 h-3.5 shrink-0" />}
          {!collapsed && <span>{isAr ? 'العودة للتطبيق' : 'Back to App'}</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <aside className="relative z-10 flex h-full">
            {/* Force expanded on mobile */}
            <div className="flex flex-col h-full w-60 bg-[#040816] border-e border-white/8">
              <div className="flex items-center justify-between px-4 py-5 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/20">
                    <Shield className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-[13px] font-bold text-white">
                    {isAr ? 'استوديو الإدارة' : 'Admin Studio'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onMobileClose}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
                {visibleItems.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onMobileClose}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
                        transition-all duration-150 border
                        ${active
                          ? 'bg-gradient-to-r from-cyan-500/15 to-indigo-500/10 text-cyan-400 border-cyan-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                        }
                      `}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <span>{isAr ? item.labelAr : item.label}</span>
                      {active && <span className="ms-auto h-1.5 w-1.5 rounded-full bg-cyan-400" />}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-3 border-t border-white/8">
                <Link
                  href="/dashboard"
                  onClick={onMobileClose}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-medium text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
                >
                  {isAr ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                  <span>{isAr ? 'العودة للتطبيق' : 'Back to App'}</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
