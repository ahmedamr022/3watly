"use client";

import React from 'react';

interface CompanyLogoProps {
  company: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CompanyLogo({ company, size = 'md', className = '' }: CompanyLogoProps) {
  const norm = (company || '').toLowerCase().trim();

  // Strict dimensional boxes with overflow-hidden guaranteed
  const dims = {
    sm: 'h-10 w-10 rounded-xl',
    md: 'h-11 w-11 rounded-xl',
    lg: 'h-14 w-14 rounded-2xl'
  }[size];

  // Base container class ensuring white background, clean border, and strict overflow clipping
  const baseBox = `relative flex items-center justify-center shrink-0 overflow-hidden bg-white border border-slate-100 dark:border-white/10 shadow-2xs p-1.5 ${dims} ${className}`;

  // 1. Vodafone
  if (norm.includes('vodafone')) {
    return (
      <div className={baseBox}>
        <svg viewBox="0 0 100 100" className="w-full h-full max-w-[28px] max-h-[28px]">
          <circle cx="50" cy="50" r="46" fill="#E60000" />
          <path
            d="M50 22 C37 22 28 32 28 44 C28 58 40 70 50 78 C60 70 72 58 72 44 C72 32 63 22 50 22 Z M50 64 C42 58 36 50 36 43 C36 36 42 30 50 30 C58 30 64 36 64 43 C64 50 58 58 50 64 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    );
  }

  // 2. Siemens
  if (norm.includes('siemens')) {
    return (
      <div className={baseBox}>
        <svg viewBox="0 0 100 24" className="w-full h-auto max-h-[14px]" fill="none">
          <text
            x="50%"
            y="72%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="#00646E"
            fontWeight="900"
            fontSize="18"
            letterSpacing="-0.5"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            SIEMENS
          </text>
        </svg>
      </div>
    );
  }

  // 3. Valeo
  if (norm.includes('valeo')) {
    return (
      <div className={baseBox}>
        <svg viewBox="0 0 100 36" className="w-full h-auto max-h-[16px]">
          <path d="M5 6 Q50 0 95 6" fill="none" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" />
          <text
            x="50%"
            y="78%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="#16A34A"
            fontWeight="900"
            fontSize="22"
            fontStyle="italic"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            Valeo
          </text>
        </svg>
      </div>
    );
  }

  // 4. Paymob
  if (norm.includes('paymob')) {
    return (
      <div className={baseBox}>
        <svg viewBox="0 0 100 30" className="w-full h-auto max-h-[15px]">
          <text
            x="50%"
            y="70%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="#0066F5"
            fontWeight="900"
            fontSize="21"
            letterSpacing="-0.5"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            Paymob
          </text>
        </svg>
      </div>
    );
  }

  // 5. Instabug
  if (norm.includes('instabug')) {
    return (
      <div className={baseBox}>
        <svg viewBox="0 0 100 30" className="w-full h-auto max-h-[15px]">
          <circle cx="20" cy="15" r="10" fill="#002D5B" />
          <circle cx="20" cy="15" r="5" fill="#FFFFFF" />
          <text
            x="60"
            y="21"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="#002D5B"
            fontWeight="900"
            fontSize="18"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            IBUG
          </text>
        </svg>
      </div>
    );
  }

  // 6. Orange
  if (norm.includes('orange')) {
    return (
      <div className={baseBox}>
        <div className="w-6 h-6 rounded-md bg-[#FF7900] flex items-center justify-center">
          <span className="text-white text-[10px] font-black">O</span>
        </div>
      </div>
    );
  }

  // 7. Etisalat / e&
  if (norm.includes('etisalat') || norm.includes('e&')) {
    return (
      <div className={baseBox}>
        <div className="w-6 h-6 rounded-full bg-[#719E19] flex items-center justify-center">
          <span className="text-white text-[9px] font-black">e&</span>
        </div>
      </div>
    );
  }

  // 8. Fawry
  if (norm.includes('fawry')) {
    return (
      <div className={baseBox}>
        <div className="w-7 h-5 rounded-md bg-[#FFDE00] flex items-center justify-center border border-amber-300">
          <span className="text-[#002D62] text-[10px] font-black">FAWRY</span>
        </div>
      </div>
    );
  }

  // 9. Microsoft
  if (norm.includes('microsoft')) {
    return (
      <div className={baseBox}>
        <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
          <span className="bg-[#F25022] rounded-[1px]" />
          <span className="bg-[#7FBA00] rounded-[1px]" />
          <span className="bg-[#00A4EF] rounded-[1px]" />
          <span className="bg-[#FFB900] rounded-[1px]" />
        </div>
      </div>
    );
  }

  // 10. Swvl
  if (norm.includes('swvl')) {
    return (
      <div className={baseBox}>
        <div className="w-7 h-5 rounded-md bg-[#E8004C] flex items-center justify-center">
          <span className="text-white text-[10px] font-black">SWVL</span>
        </div>
      </div>
    );
  }

  // Dynamic High-End Fallback for ANY company (Guaranteed zero overflow)
  const getInitials = (name: string) => {
    if (!name) return 'CO';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(company);

  // Deterministic pleasing gradient color per company name
  const gradients = [
    'from-blue-600 to-indigo-600',
    'from-indigo-600 to-purple-600',
    'from-emerald-600 to-teal-600',
    'from-cyan-600 to-blue-600',
    'from-rose-600 to-pink-600',
    'from-amber-600 to-orange-600'
  ];
  const charCode = (company.charCodeAt(0) || 0) + (company.charCodeAt(company.length - 1) || 0);
  const selectedGradient = gradients[charCode % gradients.length];

  return (
    <div className={`flex items-center justify-center shrink-0 overflow-hidden bg-gradient-to-br ${selectedGradient} text-white font-extrabold text-[12px] tracking-wider shadow-2xs select-none ${dims} ${className}`}>
      {initials}
    </div>
  );
}
