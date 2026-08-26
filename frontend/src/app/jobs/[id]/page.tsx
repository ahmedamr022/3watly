"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  Zap, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign, 
  Check, 
  X, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockJobsList } from '@/data/jobs';

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAr } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  const jobId = params?.id as string;
  const job = mockJobsList.find((j) => j.id === jobId) || mockJobsList[0];

  const tabs = isAr
    ? [
        { id: 'overview', label: 'نظرة عامة' },
        { id: 'company', label: 'عن الشركة' },
        { id: 'benefits', label: 'المزايا' },
        { id: 'similar', label: 'وظائف مشابهة' }
      ]
    : [
        { id: 'overview', label: 'Overview' },
        { id: 'company', label: 'About Company' },
        { id: 'benefits', label: 'Benefits' },
        { id: 'similar', label: 'Similar Jobs' }
      ];

  return (
    <AppShell showSearch={false}>
      <div className="space-y-6">
        
        {/* ========================================================================= */}
        {/* 1. TOP BREADCRUMB & ACTION BAR                                            */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-[14px] font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
            <span>{isAr ? "العودة إلى قائمة الوظائف" : "Back to Jobs"}</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                isSaved
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                  : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            <button
              type="button"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setApplied(true)}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-[13.5px] transition-all cursor-pointer ${
                applied
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{applied ? (isAr ? "تم التقديم بنجاح ✓" : "Applied ✓") : (isAr ? "التقديم الفوري الآن" : "Apply Now")}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. JOB HEADER HERO CARD                                                   */}
        {/* ========================================================================= */}
        <div className="rounded-[28px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            
            <div className="flex items-start gap-4">
              {/* Company Logo Box */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 font-black text-slate-900 dark:text-white text-lg shadow-xs">
                {job.company.slice(0, 2).toUpperCase()}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-[22px] sm:text-[26px] font-black text-[#0B132B] dark:text-white leading-tight">
                    {isAr ? job.titleAr : job.title}
                  </h1>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[12px] font-black">
                    {job.matchScore}% {isAr ? "مطابقة" : "Match"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[14.5px] font-bold text-slate-700 dark:text-slate-300">
                  <span>{isAr ? job.companyAr : job.company}</span>
                  <span className="h-4 w-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                </div>

                {/* Metadata badges row */}
                <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {isAr ? job.locationAr : job.location} ({isAr ? job.workTypeAr : job.workType})
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {isAr ? job.postedAgoAr : job.postedAgo}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {job.applicantsCount} {isAr ? "متقدمين" : "applicants"}
                  </span>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <span className="text-[14px] font-black text-emerald-600 dark:text-emerald-400">
                    {isAr ? job.salaryRangeAr : job.salaryRange}
                  </span>
                  <span className="text-[11.5px] text-slate-400 font-normal">
                    {isAr ? "(تقدير معلن بناءً على مؤشرات السوق)" : "(Disclosed market estimate)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Group */}
            <div className="flex flex-wrap sm:flex-col items-center sm:items-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setApplied(true)}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[14px] shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
              >
                {applied ? (isAr ? "تم إرسال التقديم ✓" : "Application Sent ✓") : (isAr ? "التقديم الفوري الآن ⚡" : "Apply Now ⚡")}
              </button>

              <button
                type="button"
                onClick={() => setIsSaved(!isSaved)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070B14] text-[13px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {isSaved ? (isAr ? "محفوظة في قائمتك ✓" : "Saved ✓") : (isAr ? "حفظ الوظيفة" : "Save Job")}
              </button>
            </div>

          </div>

          {/* Tag Pills */}
          <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[12px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20">
              {isAr ? job.employmentTypeAr : job.employmentType}
            </span>
            <span className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[12px] font-bold text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-500/20">
              {isAr ? job.workTypeAr : job.workType}
            </span>
            <span className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-[12px] font-bold text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-500/20">
              {isAr ? job.seniorityAr : job.seniority} Level
            </span>
            <span className="px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-[12px] font-bold text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20">
              {isAr ? job.departmentAr : job.department}
            </span>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. TABS HEADER                                                            */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-[14px] font-bold transition-all relative whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* 4. MAIN DETAILS & INTELLIGENCE BREAKDOWN GRID                             */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          
          {/* Left Column: Job Description & Specs (Span 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Overview & Description */}
            <div className="rounded-[28px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 sm:p-7 shadow-sm space-y-6">
              
              <div>
                <h2 className="text-[17px] font-bold text-slate-900 dark:text-white">
                  {isAr ? "الوصف الوظيفي والمهام" : "Job Overview & Requirements"}
                </h2>
                <p className="mt-3 text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {isAr ? job.descriptionAr : job.description}
                </p>
              </div>

              {/* Key Responsibilities */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-3">
                <h3 className="flex items-center gap-2 text-[15px] font-bold text-slate-900 dark:text-white">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-600">
                    <Briefcase className="w-3.5 h-3.5" />
                  </span>
                  {isAr ? "المسؤوليات والمهام الرئيسية" : "Key Responsibilities"}
                </h3>
                <ul className="space-y-2.5">
                  {(isAr ? job.responsibilitiesAr : job.responsibilities).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-[13.5px] text-slate-600 dark:text-slate-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-3">
                <h3 className="flex items-center gap-2 text-[15px] font-bold text-slate-900 dark:text-white">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                  {isAr ? "متطلبات التعيين والمؤهلات" : "Requirements"}
                </h3>
                <ul className="space-y-2.5">
                  {(isAr ? job.requirementsAr : job.requirements).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-[13.5px] text-slate-600 dark:text-slate-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specs Grid */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#070B14] space-y-1">
                  <span className="text-[11.5px] text-slate-400 font-medium">{isAr ? "المستوى الوظيفي" : "Seniority Level"}</span>
                  <p className="text-[13.5px] font-bold text-slate-900 dark:text-white">{isAr ? job.seniorityAr : job.seniority}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#070B14] space-y-1">
                  <span className="text-[11.5px] text-slate-400 font-medium">{isAr ? "نوع التوظيف" : "Employment Type"}</span>
                  <p className="text-[13.5px] font-bold text-slate-900 dark:text-white">{isAr ? job.employmentTypeAr : job.employmentType}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#070B14] space-y-1">
                  <span className="text-[11.5px] text-slate-400 font-medium">{isAr ? "طبيعة العمل" : "Work Type"}</span>
                  <p className="text-[13.5px] font-bold text-slate-900 dark:text-white">{isAr ? job.workTypeAr : job.workType}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#070B14] space-y-1">
                  <span className="text-[11.5px] text-slate-400 font-medium">{isAr ? "القسم أو الإدارة" : "Department"}</span>
                  <p className="text-[13.5px] font-bold text-slate-900 dark:text-white">{isAr ? job.departmentAr : job.department}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#070B14] space-y-1">
                  <span className="text-[11.5px] text-slate-400 font-medium">{isAr ? "المؤهل الدراسي" : "Education"}</span>
                  <p className="text-[13.5px] font-bold text-slate-900 dark:text-white">{isAr ? job.educationAr : job.education}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#070B14] space-y-1">
                  <span className="text-[11.5px] text-slate-400 font-medium">{isAr ? "سنوات الخبرة" : "Experience"}</span>
                  <p className="text-[13.5px] font-bold text-slate-900 dark:text-white">{isAr ? job.experienceYearsAr : job.experienceYears}</p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: AI Fit Intelligence & CV Optimizer (Span 5) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Widget 1: Your Fit Intelligence */}
            <div className="rounded-[28px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 shadow-sm space-y-5">
              
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">
                  {isAr ? "ذكاء المطابقة لملفك الشخصي" : "Your Fit Intelligence"}
                </h3>
              </div>

              {/* Radial Donut Gauge */}
              <div className="flex flex-col items-center justify-center py-2">
                <div className="relative h-[135px] w-[135px]">
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
                      strokeDashoffset={2 * Math.PI * 42 * (1 - job.matchScore / 100)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[2.2rem] font-black leading-none text-emerald-500">
                      {job.matchScore}%
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 mt-0.5">
                      {isAr ? "توافق إجمالي" : "Overall Match"}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-center text-[13px] font-bold text-slate-800 dark:text-slate-200">
                  {isAr ? "توافق ممتاز! خبراتك تغطي أغلب متطلبات الوظيفة." : "Great Match! You meet most of the key requirements."}
                </p>
              </div>

              {/* Skills Match Breakdown */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-3">
                <h4 className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? "تفصيل مطابقة المهارات" : "Skills Match Breakdown"}
                </h4>

                {/* Matched Skills */}
                <div className="space-y-2.5">
                  <span className="text-[11.5px] font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    {isAr ? "المهارات المتطابقة في ملفك" : "Matched Skills"}
                  </span>
                  {job.matchedSkills.map((s) => (
                    <div key={s.name} className="space-y-1">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{s.name}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{s.weight}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${s.weight * 3}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Missing Skills */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-[11.5px] font-bold text-amber-600 flex items-center gap-1">
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                    {isAr ? "المهارات المطلوب تعزيزها" : "Missing Skills"}
                  </span>
                  {job.missingSkills.map((s) => (
                    <div key={s.name} className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-500/20 space-y-1">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="font-bold text-amber-900 dark:text-amber-300">{s.name}</span>
                        <span className="font-bold text-amber-700 dark:text-amber-400">{s.weight}%</span>
                      </div>
                      <p className="text-[11px] text-amber-700 dark:text-amber-400">
                        {isAr ? s.marketNoteAr : s.marketNote}
                      </p>
                    </div>
                  ))}
                </div>

              </div>

            </div>

            {/* Widget 2: CV Compatibility & Optimizer */}
            <div className="rounded-[28px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 shadow-sm space-y-4">
              
              <div className="flex items-center justify-between">
                <h3 className="text-[14.5px] font-bold text-slate-900 dark:text-white">
                  {isAr ? "توافق الـ CV مع هذه الوظيفة" : "CV Compatibility for this Job"}
                </h3>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </div>

              <div className="flex flex-col items-center py-2">
                <div className="text-[34px] font-black text-blue-600 dark:text-blue-400">
                  78<span className="text-[16px] text-slate-400 font-bold">/100</span>
                </div>
                <p className="mt-1 text-center text-[12.5px] text-slate-600 dark:text-slate-300">
                  {isAr 
                    ? "سيرتك الذاتية متوافقة بشكل جيد، ويمكن تحسين صياغة بعض الكلمات لمضاعفة فرص القبول."
                    : "Your CV is good, but can be improved for higher chances."}
                </p>
              </div>

              <Link
                href="/cv-builder"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13.5px] font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>{isAr ? "تحسين الـ CV لهذه الوظيفة" : "Optimize CV for this Role"}</span>
              </Link>

            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
}
