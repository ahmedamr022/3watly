"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon, LogOutIcon, RotateCcwIcon } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { formatTopbarName, resolveDisplayName } from '@/utils/formatName';
import { EASE } from '@/utils/motion';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';

export function AppHeader() {
  const router = useRouter();
  const { reset } = useOnboarding();
  const { isAr } = useLanguage();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const resolvedFullName = resolveDisplayName({
    fullName: user?.fullName,
    email: user?.email,
    isAr
  });
  const displayName = formatTopbarName(resolvedFullName, isAr);

  React.useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const items = [
    {
      label: isAr ? 'إعادة التهيئة من البداية' : 'Restart onboarding',
      Icon: RotateCcwIcon,
      onSelect: () => {
        reset();
        router.push('/onboarding/career-path');
      }
    },
    {
      label: isAr ? 'تسجيل الخروج' : 'Log out',
      Icon: LogOutIcon,
      onSelect: async () => {
        reset();
        await logout();
        router.push('/login');
      }
    }
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur">
      <div className="mx-auto flex h-[66px] w-full max-w-[1440px] items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="transition-transform hover:scale-105" title="3WATLY | عواطلي">
            <Logo tagline={null} />
          </Link>
          <span className="hidden h-6 w-px bg-slate-200 dark:bg-[#0B1120]/10 sm:block" aria-hidden="true" />
          <span className="hidden text-[13.5px] font-normal text-slate-500 dark:text-slate-400 sm:block">
            {isAr ? 'تحليلات سوق العمل والتوجيه المهني' : 'Career Intelligence Platform'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <LanguageToggle />

          {/* Theme Switcher */}
          <ThemeToggle />

          {/* User Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition-colors duration-150 ease-smooth hover:bg-slate-100 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 cursor-pointer"
            >
              <UserAvatar
                avatarUrl={user?.avatarUrl}
                name={resolvedFullName}
                size="sm"
              />
              <span className="hidden text-[13.5px] font-medium text-[#0B132B] dark:text-white sm:block max-w-[120px] truncate">
                {displayName}
              </span>
              <ChevronDownIcon
                className={`h-4 w-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 ease-smooth ${menuOpen ? 'rotate-180' : ''}`}
                strokeWidth={2}
                aria-hidden="true"
              />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: EASE }}
                  className="absolute ltr:right-0 rtl:left-0 top-12 w-52 overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0D1322] py-1.5 shadow-xl dark:shadow-2xl dark:shadow-black/80 z-50"
                >
                  {items.map(({ label, Icon, onSelect }) => (
                    <button
                      key={label}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        onSelect();
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left rtl:text-right text-[13.5px] font-medium text-slate-700 dark:text-slate-300 transition-colors duration-150 ease-smooth hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                    >
                      <Icon className="h-4 w-4 text-slate-400 dark:text-slate-500" strokeWidth={1.9} aria-hidden="true" />
                      {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}