"use client";

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LogoProps {
  /** Pass null to render the wordmark on its own, or a custom string. */
  tagline?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  forceLang?: 'ar' | 'en';
}

const sizes = {
  sm: { mark: 'h-8 w-8', word: 'text-[20px]', tag: 'text-[10px]' },
  md: { mark: 'h-10 w-10 sm:h-11 sm:w-11', word: 'text-[24px] sm:text-[27px]', tag: 'text-[11px]' },
  lg: { mark: 'h-12 w-12 sm:h-14 sm:w-14', word: 'text-[28px] sm:text-[32px]', tag: 'text-[12px]' },
  xl: { mark: 'h-16 w-16 sm:h-20 sm:w-20', word: 'text-[36px] sm:text-[42px]', tag: 'text-[14px]' }
} as const;

export function Logo({ tagline = null, size = 'md', forceLang }: LogoProps) {
  const { isAr } = useLanguage();
  const activeIsAr = forceLang ? forceLang === 'ar' : isAr;
  const { mark, word, tag } = sizes[size];

  const brandTitle = activeIsAr ? 'عواطلي' : '3WATLY';
  const defaultTagline = activeIsAr 
    ? 'استخبارات سوق العمل والتطوير المهني'
    : 'Egyptian Career Intelligence Platform';

  const finalTagline = tagline === null ? null : (tagline || defaultTagline);

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Official 3D 3WATLY / عواطلي Logo */}
      <div className={`${mark} relative flex-shrink-0 flex items-center justify-center`}>
        <img 
          src="/logo.png" 
          alt={brandTitle}
          className="w-full h-full object-contain drop-shadow-md transition-transform duration-200 hover:scale-105"
        />
      </div>
      
      <div className="flex flex-col justify-center leading-tight">
        {/* Brand Name with Official Blue-to-Green Gradient from Reference Photo */}
        <span className={`${word} font-black tracking-tight bg-gradient-to-r from-[#1B57E0] via-[#0284C7] to-[#10B981] dark:from-[#3B82F6] dark:via-[#38BDF8] dark:to-[#34D399] bg-clip-text text-transparent drop-shadow-sm`}>
          {brandTitle}
        </span>
        {finalTagline && (
          <span className={`mt-0.5 ${tag} font-medium tracking-tight text-slate-500 dark:text-slate-400 line-clamp-1`}>
            {finalTagline}
          </span>
        )}
      </div>
    </div>
  );
}