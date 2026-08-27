"use client";

import React from 'react';
import { Target, Briefcase, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { SkillPlan } from '@/types/skills';

interface TopMetricsBannerProps {
  plan: SkillPlan;
  onChangeTarget: () => void;
}

export function TopMetricsBanner({ plan, onChangeTarget }: TopMetricsBannerProps) {
  const { isAr } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Target Role Card */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400">
              {isAr ? "المسمى المستهدف" : "Target Role"}
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              {plan.role.name}
            </h3>
          </div>
        </div>
        <button
          type="button"
          onClick={onChangeTarget}
          className="rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer"
        >
          {isAr ? "تغيير" : "Change Target"}
        </button>
      </div>

      {/* 2. Market Demands Card */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-xs">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
          <Briefcase className="h-6 w-6" />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400">
            {isAr ? "متطلبات السوق" : "Market Demands"}
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {plan.role.coreSkills?.length || 10}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isAr ? "مهارات أساسية" : "Core Skills"}
            </span>
          </div>
        </div>
      </div>

      {/* 3. You Have Card */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-xs">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400">
            {isAr ? "تمتلك منها" : "You Have"}
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {plan.covered.length || 5}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isAr ? "مهارات مكتسبة" : "Skills"}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Gaps Identified Card */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-xs">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400">
            {isAr ? "الفجوات المحددة" : "Gaps Identified"}
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {(plan.priorities.length + plan.future.length) || 5}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isAr ? "مهارات للتطوير" : "Skills to Learn"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
