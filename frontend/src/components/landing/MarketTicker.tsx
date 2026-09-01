"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Sparkles, 
  Building2, 
  Zap, 
  CheckCircle2, 
  Briefcase 
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function MarketTicker() {
  const { isAr } = useLanguage();

  const signals = isAr
    ? [
        {
          id: 'sig-1',
          tag: 'توظيف نشط',
          text: 'Vodafone Egypt توظف مهندسي ومحللي بيانات',
          icon: <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />,
          highlight: 'القرية الذكية'
        },
        {
          id: 'sig-2',
          tag: 'الأكثر طلباً',
          text: 'Python و SQL و React في صدارة الوظائف التقنية',
          icon: <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
          highlight: '+81% طلب'
        },
        {
          id: 'sig-3',
          tag: 'سوق العمل',
          text: '+1,240 فرصة عمل تقنية نشطة داخل مصر',
          icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
          highlight: 'محدث اليوم'
        },
        {
          id: 'sig-4',
          tag: 'ذكاء اصطناعي',
          text: 'Valeo Egypt تتوسع في فرق الـ Deep Learning و AI',
          icon: <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />,
          highlight: 'القاهرة'
        },
        {
          id: 'sig-5',
          tag: 'ميزة تنافسية',
          text: 'سد فجوة المهارات يرفع فرص المقابلات بنسبة 3.6x',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />,
          highlight: 'معدل قبول أعلى'
        },
        {
          id: 'sig-6',
          tag: 'تكنولوجيا مالية',
          text: 'Paymob و Fawry يبحثان عن مطوري برمجيات و DevOps',
          icon: <Briefcase className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
          highlight: 'مصر'
        }
      ]
    : [
        {
          id: 'sig-1',
          tag: 'Active Hiring',
          text: 'Vodafone Egypt hiring Data Engineers & Analysts',
          icon: <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />,
          highlight: 'Smart Village'
        },
        {
          id: 'sig-2',
          tag: 'Top Demand',
          text: 'Python, SQL & React lead Egyptian tech requirements',
          icon: <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
          highlight: '+81% Share'
        },
        {
          id: 'sig-3',
          tag: 'Live Market',
          text: '+1,240 active tech openings live in Egypt',
          icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
          highlight: 'Updated Today'
        },
        {
          id: 'sig-4',
          tag: 'AI & Vision',
          text: 'Valeo Egypt expanding Autonomous & ML teams',
          icon: <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />,
          highlight: 'Cairo Tech Hub'
        },
        {
          id: 'sig-5',
          tag: 'Career Growth',
          text: 'Closing skill gaps delivers 3.6x more interview callbacks',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />,
          highlight: 'Higher ROI'
        },
        {
          id: 'sig-6',
          tag: 'Fintech Surge',
          text: 'Paymob & Fawry recruiting Software & DevOps engineers',
          icon: <Briefcase className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
          highlight: 'Egypt'
        }
      ];

  const duplicatedSignals = [...signals, ...signals, ...signals];

  return (
    <div 
      className="relative w-full overflow-hidden py-3 border-y border-slate-200/80 dark:border-white/5 bg-slate-50/80 dark:bg-[#070B14] transition-colors duration-300 select-none"
      aria-label={isAr ? "شريط مؤشرات السوق المباشرة" : "Live Market Ticker"}
    >
      {/* Gradient Fades for Left and Right Edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-r from-slate-50 dark:from-[#070B14] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-l from-slate-50 dark:from-[#070B14] to-transparent" />

      <div className="flex w-max">
        <motion.div
          className="flex items-center gap-3 shrink-0"
          animate={{
            x: isAr ? ['0%', '33.333%'] : ['0%', '-33.333%'],
          }}
          transition={{
            duration: 32,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {duplicatedSignals.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0E1626] shadow-2xs hover:border-blue-400/80 dark:hover:border-blue-500/40 transition-colors shrink-0"
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5">
                {item.icon}
              </div>

              <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-[10.5px]">
                {item.tag}
              </span>

              <span className="text-[12px] font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">
                {item.text}
              </span>

              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/30 whitespace-nowrap">
                {item.highlight}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
