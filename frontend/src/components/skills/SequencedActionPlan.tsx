"use client";

import React from 'react';
import Link from 'next/link';
import { Trophy, Clock, ChevronRight, ArrowRight } from 'lucide-react';
import { SkillIcon } from './SkillIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import type { SkillPlan } from '@/types/skills';

interface SequencedActionPlanProps {
  plan: SkillPlan;
}

export function SequencedActionPlan({ plan }: SequencedActionPlanProps) {
  const { isAr } = useLanguage();

  const steps = [
    {
      step: 1,
      skillId: 'docker',
      name: 'Docker',
      badge: isAr ? 'تأثير مرتفع' : 'High Impact',
      badgeClass: 'bg-blue-50 text-blue-600',
      circleClass: 'bg-blue-600 text-white',
      modules: isAr ? '4 وحدات تطبيقية · 12 س' : '4 Modules · 12h 30m'
    },
    {
      step: 2,
      skillId: 'airflow',
      name: 'Apache Airflow',
      badge: isAr ? 'أولوية متوسطة' : 'Medium Priority',
      badgeClass: 'bg-amber-50 text-amber-600',
      circleClass: 'bg-amber-500 text-white',
      modules: isAr ? '5 وحدات تطبيقية · 16 س' : '5 Modules · 16h 45m'
    },
    {
      step: 3,
      skillId: 'kafka',
      name: 'Apache Kafka',
      badge: isAr ? 'مرحلة لاحقة' : 'Learn Later',
      badgeClass: 'bg-emerald-50 text-emerald-600',
      circleClass: 'bg-emerald-600 text-white',
      modules: isAr ? '6 وحدات تطبيقية · 14 س' : '6 Modules · 14h 20m'
    },
    {
      step: 4,
      skillId: 'postgresql',
      name: 'PostgreSQL',
      badge: isAr ? 'تأسيسي' : 'Foundation',
      badgeClass: 'bg-slate-100 text-slate-600',
      circleClass: 'bg-slate-600 text-white',
      modules: isAr ? '3 وحدات تطبيقية · 8 س' : '3 Modules · 8h 15m'
    },
    {
      step: 5,
      skillId: 'spark',
      name: 'Apache Spark',
      badge: isAr ? 'تأسيسي' : 'Foundation',
      badgeClass: 'bg-orange-50 text-orange-600',
      circleClass: 'bg-orange-500 text-white',
      modules: isAr ? '4 وحدات تطبيقية · 10 س' : '4 Modules · 10h 40m'
    }
  ];

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-xs h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {isAr ? "خارطة التدرج واكتساب المهارات" : "Skill Sequence & Roadmap"}
          </h2>
          <Link
            href="/career-roadmap"
            className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            <span>{isAr ? "عرض الخارطة الكاملة" : "View Full Roadmap"}</span>
            <ArrowRight className={`h-3.5 w-3.5 ${isAr ? 'rotate-180' : ''}`} />
          </Link>
        </div>

        {/* Step Items Timeline */}
        <div className="mt-5 space-y-4 relative">
          {steps.map((item, idx) => (
            <div key={item.step} className="relative flex items-center justify-between group">
              {/* Connected Line */}
              {idx < steps.length - 1 && (
                <div className="absolute left-[15px] rtl:left-auto rtl:right-[15px] top-[32px] bottom-[-16px] w-0.5 bg-slate-200 z-0" />
              )}

              {/* Step Circle & Tile */}
              <div className="flex items-center gap-3 relative z-10">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black shadow-xs ${item.circleClass}`}
                >
                  {item.step}
                </span>

                <SkillIcon skillId={item.skillId} size="sm" className="rounded-lg shadow-2xs" />

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </h4>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${item.badgeClass}`}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">
                    {item.modules}
                  </span>
                </div>
              </div>

              <ChevronRight className={`h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors ${isAr ? 'rotate-180' : ''}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Estimated Completion Footer */}
      <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 dark:bg-[#0B1120]/[0.04] p-3.5 border border-slate-100">
        <div className="flex items-center gap-2.5">
          <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {isAr ? "المدة المتوقعة للإنجاز" : "Estimated Completion"}
            </span>
            <span className="text-xs font-black text-slate-800">
              {isAr ? "8-10 أسابيع (5 مهارات · 42 ساعة)" : "8–10 weeks (5 skills · 42h 30m total)"}
            </span>
          </div>
        </div>
        <Trophy className="h-5 w-5 text-amber-500" />
      </div>
    </div>
  );
}
