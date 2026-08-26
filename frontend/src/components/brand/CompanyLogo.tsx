"use client";

import React from 'react';
import Image from 'next/image';

interface CompanyLogoProps {
  company: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CompanyLogo({ company, size = 'md', className = '' }: CompanyLogoProps) {
  const norm = company.toLowerCase();

  const dims = {
    sm: 'h-10 w-10 rounded-xl',
    md: 'h-12 w-12 rounded-2xl',
    lg: 'h-14 w-14 rounded-2xl'
  }[size];

  if (norm.includes('vodafone')) {
    return (
      <div className={`relative flex items-center justify-center bg-white dark:bg-white border border-slate-100 dark:border-white/10 shadow-xs p-1.5 overflow-hidden ${dims} ${className}`}>
        <Image
          src="/companies/vodafone.png"
          alt="Vodafone"
          fill
          className="object-contain p-1"
          priority
        />
      </div>
    );
  }

  if (norm.includes('valeo')) {
    return (
      <div className={`flex items-center justify-center bg-white dark:bg-white border border-slate-100 dark:border-white/10 shadow-xs p-2 ${dims} ${className}`}>
        <div className="flex flex-col items-center justify-center w-full h-full">
          <svg viewBox="0 0 100 40" className="w-full h-full">
            <path d="M5 8 Q30 2 55 8 T95 8" fill="none" stroke="#22C55E" strokeWidth="4.5" strokeLinecap="round" />
            <text x="50%" y="78%" dominantBaseline="middle" textAnchor="middle" fill="#16A34A" fontWeight="900" fontSize="26" fontStyle="italic" fontFamily="sans-serif">
              Valeo
            </text>
          </svg>
        </div>
      </div>
    );
  }

  if (norm.includes('siemens')) {
    return (
      <div className={`flex items-center justify-center bg-white dark:bg-white border border-slate-100 dark:border-white/10 shadow-xs p-2 ${dims} ${className}`}>
        <span className="text-[11px] font-black tracking-tight text-[#00646E] select-none font-sans scale-110">
          SIEMENS
        </span>
      </div>
    );
  }

  if (norm.includes('paymob')) {
    return (
      <div className={`flex items-center justify-center bg-white dark:bg-white border border-slate-100 dark:border-white/10 shadow-xs p-2 ${dims} ${className}`}>
        <span className="text-[12px] font-black tracking-tight text-[#0066F5] select-none font-sans">
          Paymob
        </span>
      </div>
    );
  }

  // Fallback initial
  const initials = company.slice(0, 2).toUpperCase();
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xs shadow-xs ${dims} ${className}`}>
      {initials}
    </div>
  );
}
