"use client";

import React from 'react';
import {
  Briefcase,
  Calendar,
  Check,
  ChevronRight,
  ChevronLeft,
  MapPin,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { RoleItem } from '@/data/rolesData';

interface TargetRoleDetailPanelProps {
  role: RoleItem;
  readinessPct: number;
  isCurrentSavedRole: boolean;
  onConfirmSelection: () => void;
  isAr?: boolean;
}

export function TargetRoleDetailPanel({
  role,
  readinessPct,
  isCurrentSavedRole,
  onConfirmSelection,
  isAr = true,
}: TargetRoleDetailPanelProps) {
  const t = role.theme;
  const Icon = role.icon;

  const detailStats = [
    {
      label: isAr ? 'سوق العمل' : 'Job Market',
      value: `${role.jobs} ${isAr ? 'وظيفة نشطة' : 'active jobs'}`,
      icon: Briefcase,
      color: t.accent,
    },
    {
      label: isAr ? 'نسبة النمو السنوي' : 'YoY Growth',
      value: role.growth,
      icon: TrendingUp,
      color: '#10B981',
    },
    {
      label: isAr ? 'متوسط الراتب المتوقع' : 'Average Salary',
      value: role.salary,
      icon: Calendar,
      color: t.accent,
    },
    {
      label: isAr ? 'الموقع ونمط العمل' : 'Location',
      value: role.location,
      icon: MapPin,
      color: t.accent,
    },
  ];

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="relative w-full rounded-3xl p-px overflow-hidden shadow-2xl transition-all duration-300"
      style={{
        backgroundImage: `linear-gradient(150deg, ${t.borderActive}b3 0%, ${t.borderIdle}66 40%, ${t.borderActive}4d 100%)`,
        boxShadow: `0 20px 50px rgba(0,0,0,0.3), 0 0 30px ${t.glow}`,
      }}
    >
      <div className="relative w-full overflow-hidden rounded-[23px] bg-white dark:bg-[#060F26] p-6 sm:p-7">
        {/* Background artwork */}
        <img
          src="/images/role-card-bg.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-left opacity-15 dark:opacity-30 select-none"
        />

        {/* Backdrop radial glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(110% 120% at 100% 50%, ${t.glow} 0%, rgba(0,0,0,0) 65%)`,
            opacity: 0.35,
          }}
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center z-10">
          {/* Quick Facts (Left column in LTR, Right column in RTL) */}
          <div className="lg:col-span-5 space-y-3.5 border-b lg:border-b-0 lg:border-e border-slate-200 dark:border-white/10 pb-5 lg:pb-0 lg:pe-6">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              {isAr ? 'مؤشرات سوق العمل للوظيفة في مصر:' : 'Egypt Tech Market Indicators:'}
            </h4>
            <div className="space-y-2.5">
              {detailStats.map((st) => {
                const StatIcon = st.icon;
                return (
                  <div
                    key={st.label}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50/90 dark:bg-white/5 border border-slate-200/90 dark:border-white/10"
                  >
                    <span className="text-[12px] font-semibold text-slate-600 dark:text-slate-300">
                      {st.label}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                      <StatIcon className="w-3.5 h-3.5" style={{ color: st.color }} />
                      <span>{st.value}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Role Overview & CTA (Main Section) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md shrink-0"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${t.iconFrom} 0%, ${t.iconTo} 100%)`,
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {isAr ? role.title : role.titleEn}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {role.subtitle || role.titleEn}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 pt-1">
                {role.description}
              </p>
            </div>

            {/* Core Skills Chips */}
            <div className="space-y-2">
              <p className="text-[11.5px] font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'أهم المهارات المطلوبة لهذا المسار:' : 'Core Required Skills:'}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {role.skills.map((sk) => {
                  const SkIcon = sk.icon;
                  return (
                    <span
                      key={sk.label}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/8 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10"
                    >
                      <SkIcon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span>{sk.label}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Readiness & Action Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center font-black text-xs text-cyan-600 dark:text-cyan-300">
                  {readinessPct}%
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {isAr ? 'نسبة جاهزيتك للمسار' : 'Your Plan Readiness'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {readinessPct >= 70
                      ? (isAr ? 'جاهزية ممتازة للتقديم' : 'Strong match')
                      : (isAr ? 'خطة سد فجوة المهارات متاحة فوراً' : 'Skills plan ready')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onConfirmSelection}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-cyan-600/25 hover:opacity-95 transition-all cursor-pointer transform active:scale-98"
              >
                {isCurrentSavedRole ? (
                  <>
                    <Check className="w-4 h-4" strokeWidth={3} />
                    <span>{isAr ? 'المسار المستهدف الحالي (تم الحفظ)' : 'Current Target Role'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{isAr ? 'اختيار هذا المسار الوظيفي 🎯' : 'Select Target Role 🎯'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
