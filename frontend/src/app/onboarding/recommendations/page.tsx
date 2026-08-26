"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, Sparkles, ArrowUpRight, CheckCircle2, Rocket, Briefcase, Zap } from 'lucide-react';
import { StepShell } from '@/components/onboarding/StepShell';
import { RequireOnboarding } from '@/components/onboarding/RequireOnboarding';
import { StepFooter } from '@/components/onboarding/StepFooter';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { riseIn } from '@/utils/motion';

export default function RecommendationsPage() {
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

  const prioritySteps = isAr
    ? [
        {
          title: "تعزيز مهارات السحابة و SQL",
          desc: "إضافة شهادة أو مشروع عملي يرفع نسبة قبولك بنسبة 25%.",
          tag: "أولوية عالية",
          tagBg: "bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-500/30"
        },
        {
          title: "تحسين كلمات الـ ATS المفتاحية",
          desc: "ضبط مصطلحات سيرتك لتتطابق مع متطلبات شركات التكنولوجيا في القاهرة.",
          tag: "موصى به",
          tagBg: "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-500/30"
        },
        {
          title: "التقديم على 14 وظيفة مطابقة",
          desc: "تم تجهيز شواغر نشطة مطابقة لخبرتك في كبرى الشركات.",
          tag: "فرص متاحة",
          tagBg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/30"
        }
      ]
    : [
        {
          title: "Strengthen SQL & Cloud Skills",
          desc: "Adding a hands-on project or cert can boost your match score by 25%.",
          tag: "High Priority",
          tagBg: "bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-500/30"
        },
        {
          title: "Align ATS Keywords with Cairo Market",
          desc: "Tailor technical keywords to match current job post requirements.",
          tag: "Recommended",
          tagBg: "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-500/30"
        },
        {
          title: "Apply to 14 Matched Tech Roles",
          desc: "Active hiring opportunities matched to your seniority in Egypt.",
          tag: "Ready Now",
          tagBg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/30"
        }
      ];

  const matchedRoles = isAr
    ? [
        { title: "Senior Data Analyst", company: "Vodafone Egypt", location: "القاهرة (القرية الذكية)", match: "92%" },
        { title: "Business Intelligence Specialist", company: "CIB Egypt", location: "الجيزة / هجين", match: "86%" }
      ]
    : [
        { title: "Senior Data Analyst", company: "Vodafone Egypt", location: "Cairo (Smart Village)", match: "92%" },
        { title: "Business Intelligence Specialist", company: "CIB Egypt", location: "Giza / Hybrid", match: "86%" }
      ];

  return (
    <RequireOnboarding need="parsedCv">
      <StepShell step={4}>
        <div className="flex min-h-[calc(100vh-196px)] flex-col">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-blue-100 dark:border-white/10 bg-blue-50 dark:bg-blue-950/70">
                <Rocket className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </span>
              <div>
                <h1 className="text-[27px] font-bold leading-tight tracking-tight text-[#0B132B] dark:text-white">
                  {isAr ? "خطة انطلاقك المهنية" : "Your Action Plan"}
                </h1>
                <p className="mt-1 text-[14px] font-normal text-slate-500 dark:text-slate-400">
                  {isAr 
                    ? "خطوات عملية محددة لسد الفجوات والانطلاق نحو أفضل الوظائف" 
                    : "High-impact steps to boost your market fit and land your next role"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-emerald-200/70 dark:border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-950/60 px-3.5 py-2">
              <ShieldCheckIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[12.5px] font-bold text-emerald-800 dark:text-emerald-300">
                {isAr ? "خطة مخصصة لملفك بنسبة 100%" : "100% Personalized Plan"}
              </span>
            </div>
          </div>

          {/* 3 Action Priority Cards */}
          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {prioritySteps.map((item, index) => (
              <motion.div
                key={item.title}
                {...riseIn(index)}
                className="rounded-[22px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 text-[12px] font-black">
                      {index + 1}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${item.tagBg}`}>
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="mt-3.5 text-[15px] font-bold text-slate-900 dark:text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[12.5px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Top Matched Roles Preview Card */}
          <motion.div {...riseIn(3)} className="mt-6 rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-[#F8FAFC] dark:bg-[#080D1A] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[15px] font-bold text-slate-900 dark:text-white">
                <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{isAr ? "وظائف جاهزة ومطابقة لملفك حالياً" : "Top Matched Roles Ready For You"}</span>
              </h2>
              <span className="text-[12px] font-bold text-blue-600 dark:text-blue-400">
                {isAr ? "+14 فرصة نشطة" : "+14 active roles"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {matchedRoles.map((job) => (
                <div 
                  key={job.company} 
                  className="flex items-center justify-between rounded-2xl border border-slate-200/70 dark:border-white/5 bg-white dark:bg-[#0D1527] p-4 shadow-sm"
                >
                  <div>
                    <h4 className="text-[14px] font-bold text-slate-900 dark:text-white leading-tight">
                      {job.title}
                    </h4>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {job.company} • {job.location}
                    </p>
                  </div>
                  <span className="rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 font-black text-[13px] px-3 py-1.5 border border-emerald-200/70 dark:border-emerald-500/30">
                    {job.match}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Step Footer */}
          <div className="mt-auto pt-8">
            <StepFooter
              onBack={() => router.push('/onboarding/profile-insights')}
              onNext={() => router.push('/onboarding/complete')}
              nextLabel={isAr ? "إتمام التهيئة والدخول للوحة التحكم" : "Complete & Enter Dashboard"}
              variant="finish"
            />
          </div>

        </div>
      </StepShell>
    </RequireOnboarding>
  );
}
