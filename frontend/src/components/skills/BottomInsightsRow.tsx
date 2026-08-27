"use client";

import React from 'react';
import { Briefcase, TrendingUp, Wallet, Clock, Target, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function BottomInsightsRow() {
  const { isAr } = useLanguage();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Market Insights Box (Left 7 Cols) */}
      <div className="lg:col-span-7 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-xs flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            {isAr ? "مؤشرات السوق لوظائف مهندس بيانات (Data Engineer) في القاهرة" : "Market Insights for Data Engineer in Cairo"}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {/* 1. Open Jobs */}
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-[#070C18] p-3.5 border border-slate-100 dark:border-white/5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/70 text-[#1B57E0] dark:text-[#60A5FA]">
                <Briefcase className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-900 dark:text-white">1,247</p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">{isAr ? "وظيفة متاحة" : "Open Jobs"}</p>
              </div>
            </div>

            {/* 2. Growth YoY */}
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-[#070C18] p-3.5 border border-slate-100 dark:border-white/5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-[#12B76A] dark:text-[#34D399]">
                <TrendingUp className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">+24%</p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">{isAr ? "نمو سنوي" : "Growth (YoY)"}</p>
              </div>
            </div>

            {/* 3. Avg Salary */}
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-[#070C18] p-3.5 border border-slate-100 dark:border-white/5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/70 text-[#F97316] dark:text-[#FB923C]">
                <Wallet className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-900 dark:text-white">{isAr ? "28 ألف ج.م" : "EGP 28K"}</p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">{isAr ? "متوسط الراتب" : "Avg. Salary"}</p>
              </div>
            </div>

            {/* 4. Time to Hire */}
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-[#070C18] p-3.5 border border-slate-100 dark:border-white/5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950/70 text-[#9333EA] dark:text-[#C084FC]">
                <Clock className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-900 dark:text-white">{isAr ? "32 يوماً" : "32 Days"}</p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">{isAr ? "متوسط التوظيف" : "Time to Hire"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA Banner (Right 5 Cols) */}
      <div className="lg:col-span-5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 shadow-md">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xs text-white shadow-xs">
            <Target className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <h4 className="text-[15px] font-extrabold text-white leading-tight">
              {isAr ? "سد فجوة مهاراتك. واضمن قبولك أسرع." : "Close your gaps. Get hired faster."}
            </h4>
            <p className="mt-1 text-[12.5px] text-blue-100 leading-relaxed">
              {isAr
                ? "إتقان هذه المهارات يزيد فرص قبولك في المقابلات بنسبة تصل إلى 3.6x."
                : "Completing these skills can increase your interview callbacks by up to 3.6x."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white hover:bg-blue-50 text-blue-700 px-5 py-2.5 text-[13px] font-bold transition-all shadow-md cursor-pointer"
        >
          <span>{isAr ? "ابدأ الآن" : "Start Now"}</span>
          <ArrowRight className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
}
