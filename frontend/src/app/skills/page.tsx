"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  BookOpen, 
  TrendingUp,
  Sparkles,
  Target
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SkillsPage() {
  const { isAr } = useLanguage();

  const missingSkills = [
    {
      name: "Power BI",
      priority: "High Priority",
      priorityAr: "أولوية قصوى",
      impact: "Unlocks +42% more job matches in Egypt",
      impactAr: "يفتح لك +42% وظائف إضافية في مصر",
      courses: "Microsoft Power BI Data Analyst (PL-300)",
      marketFrequency: "68% of Data Analyst roles"
    },
    {
      name: "Advanced SQL (Window Functions & CTEs)",
      priority: "High Priority",
      priorityAr: "أولوية قصوى",
      impact: "Required in 81% of Egyptian tech hiring tests",
      impactAr: "مطلوبة في 81% من اختبارات التوظيف التقنية",
      courses: "Advanced SQL for Data Analytics",
      marketFrequency: "81% of Data roles"
    },
    {
      name: "Tableau",
      priority: "Medium Priority",
      priorityAr: "أولوية متوسطة",
      impact: "Surging in Cairo MNCs (+12% growth)",
      impactAr: "طلب متزايد في الشركات متعددة الجنسيات بالقاهرة",
      courses: "Tableau Desktop Specialist",
      marketFrequency: "46% of roles"
    }
  ];

  return (
    <AppShell
      title={isAr ? "مصفوفة فجوة المهارات وخريطة التعلم" : "Skill Gap Priority Matrix"}
      subtitle={isAr ? "تحليل دقيق للمهارات الناقصة لرفع نسبة توافقك مع سوق العمل المصري." : "Identify exactly what skills to learn next to maximize your interview callback rate."}
    >
      <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
        
        {/* Top Summary Banner */}
        <div className="rounded-[24px] border border-blue-200/80 dark:border-blue-500/20 bg-gradient-to-r from-blue-50 to-indigo-50/70 dark:from-blue-950/40 dark:to-indigo-950/30 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-[#0B132B] dark:text-white">
                {isAr ? "تعلم مهارة واحدة يرفع توافقك من 74% إلى 88%" : "Learning Power BI raises your match from 74% to 88%"}
              </h2>
              <p className="text-[13px] text-slate-600 dark:text-slate-300 mt-0.5">
                {isAr ? "بناءً على متطلبات 1,240 وظيفة محلل بيانات نشطة في القاهرة والجيزة." : "Based on requirements from 1,240 active Data Analyst postings in Egypt."}
              </p>
            </div>
          </div>

          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold shadow-sm transition-colors shrink-0"
          >
            <span>{isAr ? "استعراض الوظائف المستهدفة" : "View Target Jobs"}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
          </Link>
        </div>

        {/* Priority Missing Skills List */}
        <div className="space-y-4">
          <h3 className="text-[17px] font-bold text-[#0B132B] dark:text-white">
            {isAr ? "المهارات المستهدفة بالأولوية" : "High-Impact Skills to Acquire"}
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {missingSkills.map((skill) => (
              <div 
                key={skill.name}
                className="rounded-[20px] border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[16px] font-black text-[#0B132B] dark:text-white">
                      {skill.name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
                      {isAr ? skill.priorityAr : skill.priority}
                    </span>
                  </div>
                  <p className="text-[13px] text-slate-600 dark:text-slate-300">
                    {isAr ? skill.impactAr : skill.impact} • <span className="text-slate-400">{skill.marketFrequency}</span>
                  </p>
                  <p className="text-[12px] text-blue-600 dark:text-blue-400 font-medium">
                    {isAr ? `مسار التعلم المقترح: ${skill.courses}` : `Recommended learning: ${skill.courses}`}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
                  <Link
                    href="/copilot"
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-[12.5px] font-bold transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>{isAr ? "خطة تعلم ذكية" : "AI Study Plan"}</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
