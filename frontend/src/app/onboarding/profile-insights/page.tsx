"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckIcon, Sparkles, CodeXmlIcon, TrophyIcon, ArrowUpRight, Gauge, Briefcase } from 'lucide-react';
import { StepShell } from '@/components/onboarding/StepShell';
import { RequireOnboarding } from '@/components/onboarding/RequireOnboarding';
import { SecureBadge } from '@/components/onboarding/PageHeading';
import { StepFooter } from '@/components/onboarding/StepFooter';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { riseIn } from '@/utils/motion';

export default function ProfileInsightsPage() {
  const router = useRouter();
  const { isAr } = useLanguage();
  const { profile } = useOnboarding();

  if (!profile) {
    return (
      <RequireOnboarding need="parsedCv">
        <div />
      </RequireOnboarding>
    );
  }

  const { scores, topSkills, experienceYears, strengths } = profile;

  const arabicStrengths = [
    "توافق قوي مع المهارات الأكثر طلباً في الشركات المصرية",
    "خبرة عملية متطابقة مع متطلبات المستوى المطلوب",
    "هيكل سيرة ذاتية واضح وسهل القراءة لأنظمة ATS"
  ];

  const activeStrengths = isAr ? arabicStrengths : strengths;

  return (
    <RequireOnboarding need="parsedCv">
      <StepShell step={3}>
        <div className="flex min-h-[calc(100vh-196px)] flex-col">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-blue-100 dark:border-white/10 bg-blue-50 dark:bg-blue-950/70">
                <Gauge className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </span>
              <div>
                <h1 className="text-[27px] font-bold leading-tight tracking-tight text-[#0B132B] dark:text-white">
                  {isAr ? "ملخص مؤشرات ملفك المهني" : "Your Profile Insights"}
                </h1>
                <p className="mt-1 text-[14px] font-normal text-slate-500 dark:text-slate-400">
                  {isAr 
                    ? "نظرة سريعة على جاهزيتك ونقاط قوتك في سوق العمل المصري" 
                    : "A quick snapshot of your market readiness and strengths"}
                </p>
              </div>
            </div>
            <SecureBadge />
          </div>

          {/* Streamlined Modern 2-Column Grid */}
          <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
            
            {/* Left Column (Span 5): Main Market Fit Gauge Card */}
            <motion.div 
              {...riseIn(0)} 
              className="lg:col-span-5 rounded-[26px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-7 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                    {isAr ? "مؤشر التوافق الإجمالي" : "Overall Market Fit"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-[11.5px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-500/30">
                    <Sparkles className="w-3 h-3" />
                    {isAr ? "جاهزية ممتازة" : "Strong Readiness"}
                  </span>
                </div>

                {/* Donut Score Visual */}
                <div className="mt-6 flex flex-col items-center">
                  <div className="relative h-[130px] w-[130px]">
                    <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="8" />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 42}
                        strokeDashoffset={2 * Math.PI * 42 * (1 - (scores.overall || 84) / 100)}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[2.35rem] font-black leading-none tracking-tight text-emerald-500 dark:text-emerald-400">
                        {scores.overall || 84}%
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 mt-1">
                        {isAr ? "نسبة المطابقة" : "Match Score"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-metrics breakdown */}
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/5 space-y-3">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    {isAr ? "مطابقة المهارات" : "Skills Alignment"}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{scores.skills || 88}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-blue-600 dark:bg-blue-400" style={{ width: `${scores.skills || 88}%` }} />
                </div>

                <div className="flex items-center justify-between text-[13px] pt-1">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    {isAr ? "ملاءمة الخبرة" : "Experience Fit"}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{experienceYears || 3} {isAr ? "سنوات" : "Years"}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-purple-600 dark:bg-purple-400" style={{ width: `${scores.experience || 82}%` }} />
                </div>
              </div>
            </motion.div>

            {/* Right Column (Span 7): Skills & Strengths Summary */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Top Skills Card */}
              <motion.section 
                {...riseIn(1)} 
                className="rounded-[26px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-sm flex-1"
              >
                <h2 className="flex items-center gap-2.5 text-[15px] font-bold text-slate-900 dark:text-white">
                  <CodeXmlIcon className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" strokeWidth={2} />
                  {isAr ? "المهارات المستخرجة من سيرتك الذاتية" : "Top Extracted Skills"}
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {topSkills.map((skill, index) => (
                    <span
                      key={skill.name}
                      className={`inline-flex items-center h-8 rounded-xl px-3 text-[12.5px] font-bold ${
                        index < 3
                          ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-500/30'
                          : 'bg-slate-100 dark:bg-[#0B1120]/5 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </motion.section>

              {/* Strengths Card */}
              <motion.section 
                {...riseIn(2)} 
                className="rounded-[26px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-sm flex-1"
              >
                <h2 className="flex items-center gap-2.5 text-[15px] font-bold text-slate-900 dark:text-white">
                  <TrophyIcon className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                  {isAr ? "أبرز نقاط تميز ملفك" : "Profile Highlights"}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {activeStrengths.map((strength) => (
                    <li key={strength} className="flex items-start gap-2.5 text-[13px] font-medium text-slate-700 dark:text-slate-300">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 mt-0.5">
                        <CheckIcon className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>

            </div>

          </div>

          {/* Footer CTA */}
          <div className="mt-auto pt-8">
            <StepFooter
              onBack={() => router.push('/onboarding/cv-upload')}
              onNext={() => router.push('/onboarding/recommendations')}
              nextLabel={isAr ? "المتابعة إلى خطة الانطلاق" : "Continue to Action Plan"}
            />
          </div>
        </div>
      </StepShell>
    </RequireOnboarding>
  );
}
