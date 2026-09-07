"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export function MarketTicker() {
  const { isAr } = useLanguage();

  const signals = isAr
    ? [
        {
          id: 'sig-1',
          entity: 'Vodafone Egypt',
          action: 'توظف مهندسي ومحللي بيانات',
          metric: 'القرية الذكية',
          isLive: true,
        },
        {
          id: 'sig-2',
          entity: 'سوق العمل المصري',
          action: '+1,240 فرصة عمل تقنية نشطة',
          metric: 'محدث اليوم',
          isLive: true,
        },
        {
          id: 'sig-3',
          entity: 'Python • SQL • React',
          action: 'الأعلى طلباً في إعلانات التوظيف',
          metric: '+81% طلب',
          isLive: false,
        },
        {
          id: 'sig-4',
          entity: 'Valeo Egypt',
          action: 'توسع في فرق الـ Deep Learning & AI',
          metric: 'القاهرة',
          isLive: true,
        },
        {
          id: 'sig-5',
          entity: 'سد فجوة المهارات',
          action: 'يرفع معدل قبول المقابلات بنسبة 3.6x',
          metric: 'أثر مباشر',
          isLive: false,
        },
        {
          id: 'sig-6',
          entity: 'Paymob & Fawry',
          action: 'توظيف نشط لمهندسي Backend & DevOps',
          metric: 'مصر',
          isLive: true,
        },
      ]
    : [
        {
          id: 'sig-1',
          entity: 'Vodafone Egypt',
          action: 'Hiring Data Engineers & Analysts',
          metric: 'Smart Village',
          isLive: true,
        },
        {
          id: 'sig-2',
          entity: 'Egyptian Market',
          action: '+1,240 active tech openings live',
          metric: 'Updated Today',
          isLive: true,
        },
        {
          id: 'sig-3',
          entity: 'Python • SQL • React',
          action: 'Leading demand across job listings',
          metric: '+81% Share',
          isLive: false,
        },
        {
          id: 'sig-4',
          entity: 'Valeo Egypt',
          action: 'Expanding Autonomous & ML teams',
          metric: 'Cairo Hub',
          isLive: true,
        },
        {
          id: 'sig-5',
          entity: 'Closing Skill Gap',
          action: 'Boosts interview callbacks by 3.6x',
          metric: 'Proven ROI',
          isLive: false,
        },
        {
          id: 'sig-6',
          entity: 'Paymob & Fawry',
          action: 'Active recruiting for Backend & DevOps',
          metric: 'Egypt',
          isLive: true,
        },
      ];

  const duplicatedSignals = [...signals, ...signals, ...signals];

  return (
    <div 
      className="relative w-full overflow-hidden py-3.5 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#040816] dark:via-[#030716] dark:to-[#040816] border-y border-slate-200/80 dark:border-cyan-500/15 backdrop-blur-md select-none z-20"
      aria-label={isAr ? "مؤشرات السوق المباشرة" : "Live Market Ticker"}
    >
      {/* Ambient water reflection continuation glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_100%_at_50%_50%,rgba(0,110,255,0.06),transparent_70%)]" />

      {/* Delicate Edge Fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-36 z-10 bg-gradient-to-r from-slate-50 dark:from-[#040816] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-36 z-10 bg-gradient-to-l from-slate-50 dark:from-[#040816] to-transparent" />

      <div className="flex w-max">
        <motion.div
          className="flex items-center gap-3 shrink-0"
          animate={{
            x: isAr ? ['0%', '33.333%'] : ['0%', '-33.333%'],
          }}
          transition={{
            duration: 34,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {duplicatedSignals.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 hover:border-blue-400 dark:hover:border-[#00D2FF]/30 bg-white/95 dark:bg-[#040A1C]/90 shadow-sm shadow-slate-200/60 dark:shadow-lg dark:shadow-black/50 hover:bg-slate-50 dark:hover:bg-[#07132F] transition-all duration-200 shrink-0 cursor-default"
            >
              {/* Live Dot Indicator */}
              {item.isLive ? (
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                </span>
              ) : (
                <span className="h-2 w-2 rounded-full bg-blue-500 dark:bg-[#00D2FF] shrink-0 shadow-[0_0_8px_rgba(37,99,235,0.5)] dark:shadow-[0_0_8px_rgba(0,210,255,0.7)]" />
              )}

              {/* Entity Title */}
              <span className="text-[12.5px] font-bold text-slate-900 dark:text-white whitespace-nowrap">
                {item.entity}
              </span>

              <span className="text-slate-400 dark:text-white/25 text-[10px]">•</span>

              {/* Action / Statement */}
              <span className="text-[12px] font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                {item.action}
              </span>

              {/* Glow Metric Tag */}
              <span 
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg whitespace-nowrap ${
                  item.isLive
                    ? 'bg-emerald-50 dark:bg-[#003B46] text-emerald-700 dark:text-[#00F5A0] border border-emerald-200 dark:border-[#00F5A0]/30 shadow-xs'
                    : 'bg-blue-50 dark:bg-[#0B1E45] text-blue-700 dark:text-[#00D2FF] border border-blue-200 dark:border-[#00D2FF]/30 shadow-xs'
                }`}
              >
                {item.metric}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
