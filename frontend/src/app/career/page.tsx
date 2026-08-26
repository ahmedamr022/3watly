"use client";

import React from 'react';
import Link from 'next/link';
import { 
  User, 
  Briefcase, 
  MapPin, 
  GraduationCap, 
  FileText, 
  Zap, 
  ArrowRight, 
  CheckCircle2,
  Sparkles,
  Edit3
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CareerPage() {
  const { isAr } = useLanguage();

  const userSkills = [
    { name: "SQL", level: "Advanced", verified: true },
    { name: "Python", level: "Intermediate", verified: true },
    { name: "Pandas", level: "Intermediate", verified: true },
    { name: "Excel", level: "Advanced", verified: true },
    { name: "Git", level: "Intermediate", verified: true },
    { name: "Statistics", level: "Intermediate", verified: false },
    { name: "Data Cleaning", level: "Advanced", verified: true }
  ];

  return (
    <AppShell
      title={isAr ? "ملفي المهني ومسار النمو" : "My Career Profile"}
      subtitle={isAr ? "إدارة مهاراتك، خبراتك، وأهدافك الوظيفية." : "Manage your verified skills, experience, and target career goals."}
    >
      <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
        
        {/* Profile Header Card */}
        <div className="rounded-[24px] border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-[22px] font-black shadow-md shadow-blue-600/20">
              AS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[20px] font-black text-[#0B132B] dark:text-white">
                  {isAr ? "أحمد سيد" : "Ahmed Sayed"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-[11px] font-bold">
                  {isAr ? "حساب موثق" : "Verified Profile"}
                </span>
              </div>
              <p className="text-[13.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                {isAr ? "محلل بيانات مبتدئ • خريج حاسبات ومعلومات" : "Junior Data Analyst • CS Graduate"}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[12px] text-slate-400 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {isAr ? "القاهرة، مصر" : "Cairo, Egypt"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  {isAr ? "الهدف: Data Analyst" : "Target: Data Analyst"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Link
              href="/cv-builder"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold shadow-sm transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>{isAr ? "تعديل الـ CV" : "Edit CV"}</span>
            </Link>
          </div>
        </div>

        {/* 2-Column Grid: Verified Skills & Target Alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Skills Column (Span 7) */}
          <div className="lg:col-span-7 rounded-[24px] border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[#0B132B] dark:text-white">
                {isAr ? "المهارات المثبتة في ملفك" : "Verified Skills in Your Profile"}
              </h2>
              <Link
                href="/skills"
                className="text-[12.5px] font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <span>{isAr ? "إدارة المهارات" : "Manage Skills"}</span>
                <ArrowRight className={`w-3 h-3 ${isAr ? "rotate-180" : ""}`} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {userSkills.map((skill) => (
                <div 
                  key={skill.name}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-white/[0.06] bg-slate-50/60 dark:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#12B76A]" />
                    <span className="text-[13px] font-bold text-[#0B132B] dark:text-white">
                      {skill.name}
                    </span>
                  </div>
                  <span className="text-[11.5px] font-medium text-slate-400">
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts (Span 5) */}
          <div className="lg:col-span-5 rounded-[24px] border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <h2 className="text-[16px] font-bold text-[#0B132B] dark:text-white">
                {isAr ? "الأدوات والتوصيات" : "Career Growth Tools"}
              </h2>
              <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-1">
                {isAr ? "أدوات مخصصة لتسريع وصولك للوظيفة المناسبة." : "Tailored tools to help you land high-fit roles faster."}
              </p>

              <div className="mt-4 space-y-2.5">
                <Link
                  href="/skills"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-white/[0.06] hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-[13px] font-bold text-[#0B132B] dark:text-white leading-tight">
                        {isAr ? "مصفوفة فجوة المهارات" : "Skill Gap Priority Matrix"}
                      </p>
                      <p className="text-[11.5px] text-slate-400">
                        {isAr ? "2 مهارة ناقصة (Power BI, Tableau)" : "2 missing skills (Power BI, Tableau)"}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 text-slate-400 ${isAr ? "rotate-180" : ""}`} />
                </Link>

                <Link
                  href="/cv-builder"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-white/[0.06] hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="text-[13px] font-bold text-[#0B132B] dark:text-white leading-tight">
                        {isAr ? "فاحص توافق الـ ATS" : "ATS Compatibility Report"}
                      </p>
                      <p className="text-[11.5px] text-slate-400">
                        {isAr ? "درجة التوافق الحالية: 87/100" : "Current ATS Score: 87/100"}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 text-slate-400 ${isAr ? "rotate-180" : ""}`} />
                </Link>
              </div>
            </div>

            <Link
              href="/copilot"
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-[13px] hover:bg-blue-100 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAr ? "استشارة المساعد الذكي" : "Ask AI Copilot for Advice"}</span>
            </Link>
          </div>

        </div>

      </div>
    </AppShell>
  );
}
