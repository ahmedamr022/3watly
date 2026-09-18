"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Shield, ChevronRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { UserAvatar, getInitials } from '@/components/ui/UserAvatar';
import { formatTopbarName, resolveDisplayName } from '@/utils/formatName';

// Map admin route pathname → breadcrumb label
const BREADCRUMBS: Record<string, { label: string; labelAr: string }> = {
  '/admin': { label: 'Dashboard', labelAr: 'لوحة التحكم' },
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

  // Build breadcrumb
  const currentCrumb = BREADCRUMBS[pathname] ?? { label: 'Admin', labelAr: 'الإدارة' };

  const roleBadge = isOwner
    ? { label: 'Owner', labelAr: 'المالك', color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400' }
    : { label: 'Admin', labelAr: 'مسؤول', color: 'from-cyan-500/20 to-indigo-500/10 border-cyan-500/30 text-cyan-400' };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#040816]/95 backdrop-blur-xl border-b border-white/8">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 gap-4">

        {/* Left: Mobile menu + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          {onOpenMobile && (
            <button
              type="button"
              onClick={onOpenMobile}
              className="lg:hidden p-2 rounded-xl border border-white/10 text-slate-400 hover:bg-white/5 cursor-pointer transition-colors"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>
          )}

          {/* Admin Studio badge */}
          <div className="hidden sm:flex items-center gap-2 text-slate-500">
            <Shield className="w-3.5 h-3.5 text-cyan-500/60" />
            <Link
              href="/admin"
              className="text-[12px] font-medium text-slate-500 hover:text-slate-300 transition-colors"
            >
              {isAr ? 'استوديو الإدارة' : 'Admin Studio'}
            </Link>
            {pathname !== '/admin' && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-600 rtl:rotate-180" />
                <span className="text-[12px] font-semibold text-slate-200">
                  {isAr ? currentCrumb.labelAr : currentCrumb.label}
                </span>
              </>
            )}
          </div>

          {/* Mobile title */}
          <h1 className="sm:hidden text-[15px] font-bold text-white">
            {isAr ? currentCrumb.labelAr : currentCrumb.label}
          </h1>
        </div>

        {/* Right: Language + Theme + Role Badge + Avatar */}
        <div className="flex items-center gap-2 shrink-0">
          <LanguageToggle />
          <ThemeToggle />

          {/* Role badge */}
          <div className={`hidden sm:flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border bg-gradient-to-r ${roleBadge.color}`}>
            {isAr ? roleBadge.labelAr : roleBadge.label}
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-2 py-1 px-1.5 rounded-full">
            <UserAvatar
              avatarUrl={user?.avatarUrl}
              name={displayName}
              size="sm"
            />
            <span className="hidden sm:inline text-xs font-bold text-slate-300 max-w-[80px] truncate">
              {displayName}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}
