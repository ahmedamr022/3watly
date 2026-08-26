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
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { CompanyLogo } from '@/components/brand/CompanyLogo';
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
        { id: 'reviews', label: 'التقييمات' },
        { id: 'similar', label: 'وظائف مشابهة' }
      ]
    : [
        { id: 'overview', label: 'Overview' },
        { id: 'company', label: 'About Company' },
        { id: 'benefits', label: 'Benefits' },
        { id: 'reviews', label: 'Reviews' },
        { id: 'similar', label: 'Similar Jobs' }
      ];

  return (
    <AppShell showSearch={false}>
      <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
        
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
        </div>

        {/* ========================================================================= */}
        {/* 2. JOB HEADER HERO CARD (Matching media_1787757450089.png Exactly)       */}
        {/* ========================================================================= */}
        <div className="rounded-[24px] border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 sm:p-7 shadow-xs space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            
            <div className="flex items-start gap-4">
              {/* Official Company Logo */}
              <CompanyLogo company={job.company} size="lg" className="shrink-0" />

              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-[22px] sm:text-[25px] font-black text-[#0B132B] dark:text-white leading-tight">
                    {isAr ? job.titleAr : job.title}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E8F8F0] dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-500/30 text-[#12B76A] dark:text-emerald-400 text-[11.5px] font-bold">
                    {job.matchScore}% {isAr ? "مطابقة" : "Match"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[14.5px] font-bold text-slate-700 dark:text-slate-300">
                  <span>{isAr ? job.companyAr : job.company}</span>
                  <span className="h-4 w-4 rounded-full bg-[#1B57E0] text-white flex items-center justify-center text-[10px] font-black">
                    ✓
                  </span>
                </div>

                {/* Metadata row */}
                <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {isAr ? job.locationAr : job.location} ({isAr ? job.workTypeAr : job.workType})
                  </span>
                  <span>•</span>
                  <span>{isAr ? job.postedAgoAr : job.postedAgo}</span>
                  <span>•</span>
                  <span>{job.applicantsCount} {isAr ? "متقدمين" : "applicants"}</span>
                </div>

                <div className="pt-1.5 flex items-center gap-2">
                  <span className="text-[14px] font-black text-slate-800 dark:text-slate-100">
                    {isAr ? job.salaryRangeAr : job.salaryRange}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-[11px] text-slate-500 font-medium">
                    {isAr ? "تقدير معلن بناءً على مؤشرات السوق" : "Disclosed estimate"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Apply Now & Save Job */}
            <div className="flex flex-wrap sm:flex-col items-center sm:items-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setApplied(true)}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#1B57E0] hover:bg-blue-700 text-white font-bold text-[14px] shadow-lg shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{applied ? (isAr ? "تم إرسال التقديم ✓" : "Application Sent ✓") : (isAr ? "التقديم الفوري الآن ⚡" : "Apply Now ⚡")}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSaved(!isSaved)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070B14] text-[13px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current text-blue-600' : ''}`} />
                <span>{isSaved ? (isAr ? "محفوظة في قائمتك ✓" : "Saved ✓") : (isAr ? "حفظ الوظيفة" : "Save Job")}</span>
              </button>
            </div>

          </div>

          {/* Pill Tags: Full-time, Hybrid, Junior Level, Department */}
          <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-xl bg-[#E8F8F0] dark:bg-emerald-950/50 text-[12px] font-bold text-[#12B76A] border border-emerald-200/50 dark:border-emerald-500/20">
              {isAr ? job.employmentTypeAr : job.employmentType}
            </span>
            <span className="px-3 py-1 rounded-xl bg-[#EEF3FE] dark:bg-blue-950/50 text-[12px] font-bold text-[#1B57E0] dark:text-blue-300 border border-blue-200/50 dark:border-blue-500/20">
              {isAr ? job.workTypeAr : job.workType}
            </span>
            <span className="px-3 py-1 rounded-xl bg-[#F3E8FF] dark:bg-purple-950/50 text-[12px] font-bold text-[#9333EA] dark:text-purple-300 border border-purple-200/50 dark:border-purple-500/20">
              {isAr ? job.seniorityAr : job.seniority} Level
            </span>
            <span className="px-3 py-1 rounded-xl bg-[#FFF7ED] dark:bg-amber-950/50 text-[12px] font-bold text-[#F97316] dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20">
              {isAr ? job.departmentAr : job.department}
            </span>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. TABS HEADER (Matching media_1787757466936.png)                         */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-6 border-b border-slate-200 dark:border-white/10 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-[14.5px] font-bold transition-all relative whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'text-[#1B57E0] dark:text-[#60A5FA]'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1B57E0] dark:bg-[#60A5FA] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* 4. MAIN DETAILS & SPEC MATRIX (Matching media_1787757466936.png Exactly)  */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          
          {/* Left Column: Job Description & Responsibilities & Requirements (Span 8) */}
          <div className="lg:col-span-8 rounded-[24px] border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 sm:p-8 shadow-xs space-y-6">
            
            <div>
              <h2 className="text-[17px] font-bold text-[#0B132B] dark:text-white">
                {isAr ? "الوصف الوظيفي والمهام" : "Job Overview & Requirements"}
              </h2>
              <p className="mt-3 text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {isAr ? job.descriptionAr : job.description}
              </p>
            </div>

            {/* Key Responsibilities */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-3">
              <h3 className="flex items-center gap-2 text-[15px] font-bold text-[#0B132B] dark:text-white">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EEF3FE] dark:bg-blue-950/70 text-[#1B57E0]">
                  <Briefcase className="w-4 h-4" />
                </span>
                <span>{isAr ? "المسؤوليات والمهام الرئيسية" : "Key Responsibilities"}</span>
              </h3>
              <ul className="space-y-2.5 ltr:pl-2 rtl:pr-2">
                {(isAr ? job.responsibilitiesAr : job.responsibilities).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-[13.5px] text-slate-600 dark:text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1B57E0] mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-3">
              <h3 className="flex items-center gap-2 text-[15px] font-bold text-[#0B132B] dark:text-white">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E8F8F0] dark:bg-emerald-950/70 text-[#12B76A]">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <span>{isAr ? "متطلبات التعيين والمؤهلات" : "Requirements"}</span>
              </h3>
              <ul className="space-y-2.5 ltr:pl-2 rtl:pr-2">
                {(isAr ? job.requirementsAr : job.requirements).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-[13.5px] text-slate-600 dark:text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#12B76A] mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Right Column: 6 Metadata Matrix + AI Fit Intelligence (Span 4) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Metadata Matrix List (Matching Right Side of Screenshot) */}
            <div className="rounded-[24px] border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 shadow-xs space-y-4 divide-y divide-slate-100 dark:divide-white/[0.06]">
              
              {/* Seniority */}
              <div className="flex items-center gap-3.5 pt-1">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-500">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11.5px] font-medium text-slate-400">
                    {isAr ? "المستوى الوظيفي" : "Seniority Level"}
                  </span>
                  <p className="text-[13.5px] font-bold text-[#0B132B] dark:text-white">
                    {isAr ? job.seniorityAr : job.seniority}
                  </p>
                </div>
              </div>

              {/* Employment Type */}
              <div className="flex items-center gap-3.5 pt-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-500">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11.5px] font-medium text-slate-400">
                    {isAr ? "نوع التوظيف" : "Employment Type"}
                  </span>
                  <p className="text-[13.5px] font-bold text-[#0B132B] dark:text-white">
                    {isAr ? job.employmentTypeAr : job.employmentType}
                  </p>
                </div>
              </div>

              {/* Work Type */}
              <div className="flex items-center gap-3.5 pt-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-500">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11.5px] font-medium text-slate-400">
                    {isAr ? "طبيعة العمل" : "Work Type"}
                  </span>
                  <p className="text-[13.5px] font-bold text-[#0B132B] dark:text-white">
                    {isAr ? job.workTypeAr : job.workType}
                  </p>
                </div>
              </div>

              {/* Department */}
              <div className="flex items-center gap-3.5 pt-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-500">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11.5px] font-medium text-slate-400">
                    {isAr ? "القسم أو الإدارة" : "Department"}
                  </span>
                  <p className="text-[13.5px] font-bold text-[#0B132B] dark:text-white">
                    {isAr ? job.departmentAr : job.department}
                  </p>
                </div>
              </div>

              {/* Education */}
              <div className="flex items-center gap-3.5 pt-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-500">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11.5px] font-medium text-slate-400">
                    {isAr ? "المؤهل الدراسي" : "Education"}
                  </span>
                  <p className="text-[13.5px] font-bold text-[#0B132B] dark:text-white">
                    {isAr ? job.educationAr : job.education}
                  </p>
                </div>
              </div>

              {/* Experience */}
              <div className="flex items-center gap-3.5 pt-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-500">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11.5px] font-medium text-slate-400">
                    {isAr ? "سنوات الخبرة" : "Experience"}
                  </span>
                  <p className="text-[13.5px] font-bold text-[#0B132B] dark:text-white">
                    {isAr ? job.experienceYearsAr : job.experienceYears}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3.5 pt-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-500">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11.5px] font-medium text-slate-400">
                    {isAr ? "المقر والمحافظة" : "Location"}
                  </span>
                  <p className="text-[13.5px] font-bold text-[#0B132B] dark:text-white">
                    {isAr ? job.locationAr : job.location}
                  </p>
                </div>
              </div>

            </div>

          {/* Right Column: AI Fit Intelligence & CV Optimizer (Span 4 - Matching Screenshot 1:1) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Widget 1: Your Fit Intelligence */}
            <div className="rounded-[24px] border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 shadow-xs space-y-5">
              
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EEF3FE] dark:bg-purple-950/70 text-[#7C3AED] dark:text-[#A78BFA]">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-[16px] font-bold text-[#0B132B] dark:text-white">
                  {isAr ? "ذكاء المطابقة لملفك" : "Your Fit Intelligence"}
                </h3>
              </div>

              {/* Circular Gauge Ring */}
              <div className="flex flex-col items-center justify-center py-1">
                <div className="relative h-[130px] w-[130px]">
                  <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                    <circle cx="50" cy="50" r="41" fill="none" stroke="#E8F8F0" className="dark:stroke-emerald-950/40" strokeWidth="7.5" />
                    <circle
                      cx="50"
                      cy="50"
                      r="41"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="7.5"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 41}
                      strokeDashoffset={2 * Math.PI * 41 * (1 - job.matchScore / 100)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[28px] font-black text-[#0B132B] dark:text-white leading-none">
                      {job.matchScore}%
                    </span>
                    <span className="text-[11.5px] font-medium text-slate-400 dark:text-slate-400 mt-1">
                      {isAr ? "توافق إجمالي" : "Overall Match"}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-center text-[13px] text-slate-600 dark:text-slate-300 font-medium max-w-[220px]">
                  {isAr ? "توافق ممتاز! خبراتك تغطي أغلب متطلبات الوظيفة." : "Great Match! You meet most of the key requirements."}
                </p>
              </div>

              {/* Skills Match Breakdown Subsection */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06] space-y-4">
                <h4 className="text-[13.5px] font-bold text-[#0B132B] dark:text-white">
                  {isAr ? "تفصيل مطابقة المهارات" : "Skills Match Breakdown"}
                </h4>

                {/* Matched Skills */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[12.5px] font-bold text-[#12B76A]">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#E8F8F0] text-[#12B76A] text-[10px] font-black">
                      ✓
                    </span>
                    <span>{isAr ? "المهارات المتطابقة" : "Matched Skills"}</span>
                  </div>

                  <div className="space-y-2">
                    {job.matchedSkills.map((s) => (
                      <div key={s.name} className="space-y-1">
                        <div className="flex items-center justify-between text-[12px]">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{s.name}</span>
                          <span className="font-bold text-slate-500 dark:text-slate-400">{s.weight}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div className="h-full rounded-full bg-[#10B981]" style={{ width: `${s.weight * 3.5}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center gap-1.5 text-[12.5px] font-bold text-[#EA580C]">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FFF7ED] text-[#EA580C] text-[10px] font-black">
                      ●
                    </span>
                    <span>{isAr ? "المهارات الناقصة" : "Missing Skill"}</span>
                  </div>

                  {job.missingSkills.map((s) => (
                    <div key={s.name} className="space-y-1">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{s.name}</span>
                        <span className="font-bold text-slate-500 dark:text-slate-400">{s.weight}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full rounded-full bg-[#F97316]" style={{ width: `${s.weight * 3.5}%` }} />
                      </div>
                      <p className="text-[11px] text-[#EA580C] font-medium pt-0.5">
                        {isAr ? "مطلوبة في 31% من وظائف القاهرة المشابهة" : "Found in 31% of similar Cairo jobs"}
                      </p>
                    </div>
                  ))}
                </div>

              </div>

            </div>

            {/* Widget 2: CV Compatibility & Optimizer */}
            <div className="rounded-[24px] border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 shadow-xs space-y-4">
              
              <div className="flex items-center justify-between">
                <h3 className="text-[14.5px] font-bold text-[#0B132B] dark:text-white">
                  {isAr ? "توافق الـ CV مع هذه الوظيفة" : "CV Compatibility for this Job"}
                </h3>
                <Info className="w-4 h-4 text-slate-400 cursor-pointer" />
              </div>

              {/* Arc Gauge */}
              <div className="flex flex-col items-center py-2">
                <div className="relative h-20 w-36 overflow-hidden flex items-end justify-center">
                  <svg viewBox="0 0 100 50" className="h-full w-full">
                    <path d="M10 45 A 35 35 0 0 1 90 45" fill="none" stroke="#EEF3FE" className="dark:stroke-slate-800" strokeWidth="8" strokeLinecap="round" />
                    <path d="M10 45 A 35 35 0 0 1 72 17" fill="none" stroke="#1B57E0" strokeWidth="8" strokeLinecap="round" />
                  </svg>
                  <div className="absolute bottom-0 inset-x-0 flex items-center justify-center">
                    <span className="text-[24px] font-black text-[#0B132B] dark:text-white leading-none">
                      78<span className="text-[14px] text-slate-400 font-bold">/100</span>
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-center text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[240px]">
                  {isAr 
                    ? "سيرتك الذاتية متوافقة بشكل جيد، ويمكن تحسين صياغة بعض الكلمات لمضاعفة فرص القبول."
                    : "Your CV is good, but can be improved for higher chances."}
                </p>
              </div>

              <Link
                href="/cv-builder"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1B57E0] hover:bg-blue-700 text-white text-[13.5px] font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>{isAr ? "تحسين الـ CV لهذه الوظيفة" : "Optimize CV for this Role"}</span>
              </Link>

            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
}
