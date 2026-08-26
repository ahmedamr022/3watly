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
    sm: 'h-9 w-9 rounded-xl',
    md: 'h-12 w-12 rounded-2xl',
    lg: 'h-14 w-14 rounded-2xl'
  }[size];

  if (norm.includes('vodafone')) {
    return (
      <div className={`flex flex-col items-center justify-center bg-white dark:bg-white border border-slate-100 dark:border-white/10 shadow-xs overflow-hidden p-1.5 ${dims} ${className}`}>
        <div className="relative w-full h-[65%]">
          <Image
            src="/companies/vodafone.png"
            alt="Vodafone"
            fill
            className="object-contain"
          />
        </div>
        <span className="text-[8px] font-black text-[#E60000] tracking-tighter leading-none mt-0.5 select-none">
          vodafone
        </span>
      </div>
    );
  }

  if (norm.includes('valeo')) {
    return (
      <div className={`flex items-center justify-center bg-white dark:bg-white border border-slate-100 dark:border-white/10 shadow-xs p-1.5 ${dims} ${className}`}>
        <svg viewBox="0 0 100 40" className="w-full h-auto">
          <path d="M5 10 Q25 2 45 10 T95 10" fill="none" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" />
          <text x="50%" y="75%" dominantBaseline="middle" textAnchor="middle" fill="#15803D" fontWeight="900" fontSize="24" fontStyle="italic" fontFamily="sans-serif">
            Valeo
          </text>
        </svg>
      </div>
    );
  }

  if (norm.includes('siemens')) {
    return (
      <div className={`flex items-center justify-center bg-white dark:bg-white border border-slate-100 dark:border-white/10 shadow-xs p-1.5 ${dims} ${className}`}>
        <span className="text-[11px] font-black tracking-tight text-[#00646E] select-none font-sans">
          SIEMENS
        </span>
      </div>
    );
  }

  if (norm.includes('paymob')) {
    return (
      <div className={`flex items-center justify-center bg-white dark:bg-white border border-slate-100 dark:border-white/10 shadow-xs p-1.5 ${dims} ${className}`}>
        <span className="text-[11px] font-black tracking-tight text-[#0066F5] select-none font-sans">
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
