"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Shield, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { formatTopbarName, resolveDisplayName } from '@/utils/formatName';

const BREADCRUMBS: Record<string, { label: string; labelAr: string }> = {
  '/admin': { label: 'Dashboard', labelAr: 'الواجهة الرئيسية' },
  '/admin/users': { label: 'Users', labelAr: 'المستخدمون' },
  '/admin/resources': { label: 'Resources', labelAr: 'المصادر التعليمية' },
  '/admin/analytics': { label: 'Analytics', labelAr: 'التحليلات' },
  '/admin/audit-logs': { label: 'Audit Logs', labelAr: 'سجل العمليات' },
  '/admin/settings': { label: 'Settings', labelAr: 'الإعدادات' },
};

interface AdminTopbarProps {
  onOpenMobile?: () => void;
}

export function AdminTopbar({ onOpenMobile }: AdminTopbarProps) {
  const { isAr } = useLanguage();
  const { user, isOwner } = useAuth();
  const pathname = usePathname();

  const displayName = formatTopbarName(
    resolveDisplayName({ fullName: user?.fullName, email: user?.email, isAr }),
    isAr
  );

  const currentCrumb = BREADCRUMBS[pathname] ?? { label: 'Admin', labelAr: 'استوديو الإدارة' };

  const roleLabel = isOwner
    ? (isAr ? 'مالك المنصة' : 'Platform Owner')
    : (isAr ? 'مسؤول' : 'Admin');

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-[#070C18]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/8 transition-colors duration-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">

        {/* Start / Left: Profile pill + Toggles */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {onOpenMobile && (
            <button
              type="button"
              onClick={onOpenMobile}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* User Profile Pill matching Mockup */}
          <div className="flex items-center gap-2.5 p-1.5 pe-3 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/90 dark:border-white/10 shadow-xs">
            <UserAvatar
              avatarUrl={user?.avatarUrl}
              name={displayName}
              size="sm"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[12.5px] font-bold text-slate-900 dark:text-white truncate max-w-[110px]">
                {displayName}
              </span>
              <span className={`text-[10px] font-semibold ${isOwner ? 'text-amber-500 dark:text-amber-400' : 'text-cyan-600 dark:text-cyan-400'}`}>
                {roleLabel}
              </span>
            </div>
          </div>

          <ThemeToggle />
          <LanguageToggle />
        </div>

        {/* End / Right: Breadcrumb Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/90 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <Shield className="w-3.5 h-3.5 text-cyan-500" />
            <Link
              href="/admin"
              className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
            >
              {isAr ? 'استوديو الإدارة' : 'Admin Studio'}
            </Link>
            {pathname !== '/admin' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 rtl:rotate-180" />
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                  {isAr ? currentCrumb.labelAr : currentCrumb.label}
                </span>
              </>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
