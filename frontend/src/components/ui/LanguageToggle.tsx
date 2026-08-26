"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang, toggleLang, isAr } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={isAr ? "Switch to English / Franco" : "التحويل إلى اللغة العربية"}
      className={`group relative flex h-9 items-center gap-1.5 rounded-xl border border-slate-200/90 dark:border-white/15 bg-white/90 dark:bg-[#131C31]/90 px-3 text-[13px] font-bold text-slate-700 dark:text-slate-200 shadow-sm backdrop-blur transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-400/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 cursor-pointer ${className}`}
    >
      <Globe className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 transition-transform duration-300 group-hover:rotate-45" />
      <span className="font-semibold tracking-wide">
        {lang === 'ar' ? 'EN' : 'عربي'}
      </span>
      <span className="sr-only">Toggle Language</span>
    </button>
  );
}
