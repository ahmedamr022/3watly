"use client";

import React from 'react';
import { ArrowUpRight, TrendingUp, User, ChevronRight, Info } from 'lucide-react';
import { SkillIcon } from './SkillIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import type { SkillPlan, PlannedSkill } from '@/types/skills';

interface PriorityGridProps {
  plan: SkillPlan;
  onSelectSkill?: (skill: PlannedSkill) => void;
}

export function PriorityGrid({ plan, onSelectSkill }: PriorityGridProps) {
  const { isAr } = useLanguage();

  const priorityCards = [
    {
      id: 'docker',
      badge: isAr ? '● تأثير مرتفع للغاية' : '● HIGH IMPACT',
      badgeClass: 'bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-800/40',
      skillId: 'docker',
      name: 'Docker',
      demandPill: isAr ? 'مطلوبة في 52% من وظائف القاهرة' : 'Appears in 52% of Cairo tech jobs',
      demandClass: 'bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300',
      impactIcon: ArrowUpRight,
      impactText: isAr ? 'تفتح +84 وظيفة إضافية لملفك المهني' : 'Unlocks +84 new jobs for your profile',
      impactClass: 'text-emerald-600 dark:text-emerald-400',
      why: isAr
        ? 'مهارة الحاويات الأساسية المستخدمة بكثافة في مسارات معالجة البيانات والنشر السحابي في مصر.'
        : 'Docker is a core containerization skill widely used in data engineering pipelines and cloud deployments.'
    },
    {
      id: 'airflow',
      badge: isAr ? '● أولوية متوسطة' : '● MEDIUM PRIORITY',
      badgeClass: 'bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-300 border-amber-200 dark:border-amber-800/40',
      skillId: 'airflow',
      name: 'Apache Airflow',
      demandPill: isAr ? 'نسبة طلب 41% في السوق' : '41% market demand',
      demandClass: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
      impactIcon: TrendingUp,
      impactText: isAr ? '+18% معدل نمو الطلب (خلال 90 يوماً في مصر)' : '+18% 90-day growth in Egypt',
      impactClass: 'text-emerald-600 dark:text-emerald-400',
      why: isAr
        ? 'أداة الجدولة وهندسة خطوط البيانات الرائدة والمطلوبة بكثرة في الشركات الكبرى والبنوك.'
        : 'Airflow is the leading workflow orchestration tool for data pipelines and is increasingly adopted across MENA.'
    },
    {
      id: 'kafka',
      badge: isAr ? '● مرحلة متقدمة' : '● LEARN LATER',
      badgeClass: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40',
      skillId: 'kafka',
      name: 'Apache Kafka',
      demandPill: isAr ? 'نسبة طلب 22% في السوق' : '22% market demand',
      demandClass: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
      impactIcon: User,
      impactText: isAr ? 'مطلوبة بالأساس للمستويات المتقدمة (Senior)' : 'Primarily senior-level requirement',
      impactClass: 'text-slate-600 dark:text-slate-400',
      why: isAr
        ? 'تقنية معالجة البيانات المتدفقة اللحظية (Real-time Streaming)، مهمة للتخصص في الأنظمة الموزعة.'
        : 'Kafka is powerful for real-time streaming but is mostly required in senior or specialized backend roles.'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          {isAr ? "فجوات المهارات حسب الأولوية" : "Your Skill Gaps by Priority"}
          <Info className="h-4 w-4 text-slate-400" />
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {priorityCards.map((card) => {
          const ImpactIcon = card.impactIcon;
          return (
            <div
              key={card.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-xs hover:border-blue-300 dark:hover:border-blue-500/30 transition-all min-h-[380px]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${card.badgeClass}`}
                  >
                    {card.badge}
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-center">
                  <SkillIcon skillId={card.skillId} size="lg" className="rounded-2xl shadow-xs" />
                </div>

                <h3 className="mt-4 text-center text-lg font-bold text-slate-900 dark:text-white">
                  {card.name}
                </h3>

                <div className="mt-2 flex justify-center">
                  <span
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold text-center ${card.demandClass}`}
                  >
                    {card.demandPill}
                  </span>
                </div>

                <div className={`mt-4 flex items-center justify-center gap-1.5 text-xs font-bold text-center ${card.impactClass}`}>
                  <ImpactIcon className="h-4 w-4 shrink-0" />
                  <span>{card.impactText}</span>
                </div>

                <div className="mt-4 border-t border-slate-100 dark:border-white/5 pt-3">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {isAr ? "لماذا هذه المهارة مهمة؟" : "Why it matters"}
                  </span>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {card.why}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => {
                    const found = [...plan.priorities, ...plan.future].find(
                      (p) => p.def.id.toLowerCase().includes(card.id)
                    );
                    if (found && onSelectSkill) onSelectSkill(found);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  <span>{isAr ? "خطة الإتقان والتطبيق" : "Master & Apply Skill"}</span>
                  <ChevronRight className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
