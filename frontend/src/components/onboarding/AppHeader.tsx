"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon, LogOutIcon, RotateCcwIcon } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { EASE } from '@/utils/motion';

import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function AppHeader() {
  const router = useRouter();
  const { reset } = useOnboarding();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

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
      label: 'Restart onboarding',
      Icon: RotateCcwIcon,
      onSelect: () => {
        reset();
        router.push('/onboarding/career-path');
      }
    },
    {
      label: 'Log out',
      Icon: LogOutIcon,
      onSelect: () => {
        reset();
        router.push('/login');
      }
    }
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-line dark:border-white/10 bg-white/92 dark:bg-[#0B1120]/92 backdrop-blur">
      <div className="mx-auto flex h-[66px] w-full max-w-[1440px] items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-4">
          <Logo tagline={null} />
          <span className="hidden h-6 w-px bg-line dark:bg-white/10 sm:block" aria-hidden="true" />
          <span className="hidden text-[13.5px] font-normal text-ink-muted dark:text-slate-400 sm:block">
            Career Intelligence Platform
          </span>
        </div>

        <div className="flex items-center gap-3.5">
          <ThemeToggle />

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition-colors duration-150 ease-smooth hover:bg-canvas dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40 cursor-pointer"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue text-[12px] font-semibold text-white">
                AH
              </span>
              <span className="hidden text-[13.5px] font-medium text-ink dark:text-white sm:block">Ahmed H.</span>
              <ChevronDownIcon
                className={`h-4 w-4 text-ink-faint dark:text-slate-500 transition-transform duration-200 ease-smooth ${menuOpen ? 'rotate-180' : ''}`}
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
                  className="absolute right-0 top-12 w-52 overflow-hidden rounded-xl border border-line dark:border-white/10 bg-white dark:bg-[#0D1322] py-1.5 shadow-card dark:shadow-2xl dark:shadow-black/80"
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
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13.5px] font-medium text-ink-soft dark:text-slate-300 transition-colors duration-150 ease-smooth hover:bg-canvas dark:hover:bg-white/5 cursor-pointer"
                    >
                      <Icon className="h-4 w-4 text-ink-faint dark:text-slate-500" strokeWidth={1.9} aria-hidden="true" />
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