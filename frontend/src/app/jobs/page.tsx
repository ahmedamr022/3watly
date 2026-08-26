"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  Filter, 
  ChevronDown, 
  Check, 
  X, 
  Bookmark, 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Briefcase,
  DollarSign,
  Users
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockJobsList, mockDashboardData } from '@/data/jobs';

export default function JobsPage() {
  const { isAr } = useLanguage();
  const [keyword, setKeyword] = useState('Data Analyst');
  const [location, setLocation] = useState('Cairo, Egypt');
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [activeWorkType, setActiveWorkType] = useState('All');

  const { inDemandSkills, marketOverview } = mockDashboardData;

  const toggleSave = (id: string) => {
    setSavedJobs((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <AppShell
      title={isAr ? "الوظائف والفرص المتاحة" : "Jobs"}
      subtitle={isAr ? "استكشف وظائف تكنولوجيا المعلومات والبيانات المطابقة لمهاراتك وخبرتك." : "Discover roles that match your skills and career goals."}
    >
      <div className="space-y-6">
        
        {/* ========================================================================= */}
        {/* 1. SEARCH & FILTERS HEADER CARD                                           */}
        {/* ========================================================================= */}
        <div className="rounded-[26px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-5 sm:p-6 shadow-sm space-y-4">
          
          {/* Main Search Inputs Row */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
            
            {/* Keywords Input */}
            <div className="sm:col-span-5 relative">
              <label className="block text-[11.5px] font-bold text-slate-400 dark:text-slate-400 mb-1">
                {isAr ? "المسمى أو المهارات" : "Keywords"}
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder={isAr ? "المسمى الوظيفي أو التخصص..." : "Job title or keyword..."}
                  className="w-full h-11 ltr:pl-10 ltr:pr-8 rtl:pr-10 rtl:pl-8 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#070B14] text-[13.5px] font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                {keyword && (
                  <button
                    type="button"
                    onClick={() => setKeyword('')}
                    className="absolute ltr:right-2.5 rtl:left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Location Input */}
            <div className="sm:col-span-4 relative">
              <label className="block text-[11.5px] font-bold text-slate-400 dark:text-slate-400 mb-1">
                {isAr ? "المحافظة أو النطاق" : "Location"}
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={isAr ? "المدينة أو المحافظة..." : "City or Governorate..."}
                  className="w-full h-11 ltr:pl-10 ltr:pr-8 rtl:pr-10 rtl:pl-8 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#070B14] text-[13.5px] font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                {location && (
                  <button
                    type="button"
                    onClick={() => setLocation('')}
                    className="absolute ltr:right-2.5 rtl:left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Search Button */}
            <div className="sm:col-span-3 flex items-end">
              <button
                type="button"
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>{isAr ? "بحث عن وظائف" : "Search Jobs"}</span>
              </button>
            </div>

          </div>

          {/* Filter Pills Row */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5 border-t border-slate-100 dark:border-white/5">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070B14] text-[12.5px] font-bold text-slate-700 dark:text-slate-300 hover:border-slate-300 transition-colors cursor-pointer"
            >
              <span>{isAr ? "نسبة التوافق: +70%" : "Match Score: 70%+"}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070B14] text-[12.5px] font-bold text-slate-700 dark:text-slate-300 hover:border-slate-300 transition-colors cursor-pointer"
            >
              <span>{isAr ? "المستوى: مبتدئ/خريج" : "Seniority: Junior/Fresh"}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070B14] text-[12.5px] font-bold text-slate-700 dark:text-slate-300 hover:border-slate-300 transition-colors cursor-pointer"
            >
              <span>{isAr ? "نوع العمل: هجين/عن بُعد" : "Work Type: Hybrid/Remote"}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-transparent text-[12.5px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{isAr ? "المزيد من الفلاتر" : "More Filters"}</span>
            </button>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. RESULTS MAIN GRID (Left Feed + Right Intelligence Widgets)             */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          
          {/* Main Feed Column (Span 8) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Results Count & Sort Header */}
            <div className="flex items-center justify-between px-1">
              <p className="text-[14px] font-bold text-slate-900 dark:text-white">
                <span className="text-blue-600 dark:text-blue-400">{mockJobsList.length * 32}</span>{" "}
                {isAr ? "وظيفة متوافقة مع ملفك" : "jobs found"}
              </p>
              
              <div className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 dark:text-slate-400 cursor-pointer">
                <span>{isAr ? "الترتيب حسب: الأفضل تطابقاً" : "Sort by: Best Match"}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Job Cards Feed */}
            {mockJobsList.map((job) => {
              const isSaved = savedJobs.includes(job.id);
              return (
                <div
                  key={job.id}
                  className="rounded-[24px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-white/20 transition-all space-y-4"
                >
                  {/* Top Row: Company & Title & Match Radial */}
                  <div className="flex items-start justify-between gap-4">
                    
                    <div className="flex items-start gap-3.5 min-w-0">
                      {/* Logo Mark */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 font-black text-slate-800 dark:text-white text-sm">
                        {job.company.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Link 
                            href={`/jobs/${job.id}`}
                            className="text-[16.5px] font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-tight"
                          >
                            {isAr ? job.titleAr : job.title}
                          </Link>
                          <span className="h-4 w-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] shrink-0">
                            ✓
                          </span>
                        </div>

                        <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                          {isAr ? job.companyAr : job.company} • {isAr ? job.locationAr : job.location} ({isAr ? job.workTypeAr : job.workType})
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="text-[12.5px] font-black text-emerald-600 dark:text-emerald-400">
                            {isAr ? job.salaryRangeAr : job.salaryRange}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                            {isAr ? job.employmentTypeAr : job.employmentType}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Match Score Indicator */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[14px] font-black">
                        {job.matchScore}%
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 mt-1">
                        {isAr ? "مطابقة" : "Match"}
                      </span>
                    </div>

                  </div>

                  {/* Skills Match Bar */}
                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11.5px] font-bold text-slate-400">
                        {isAr ? "المهارات المطابقة:" : "Top Skills Match:"}
                      </span>
                      {job.matchedSkills.map((skill) => (
                        <span 
                          key={skill.name}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-[11.5px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20"
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                          {skill.name}
                        </span>
                      ))}
                      {job.missingSkills.map((skill) => (
                        <span 
                          key={skill.name}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-[11.5px] font-bold text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-500/20"
                        >
                          <X className="w-3 h-3 stroke-[3]" />
                          {skill.name}
                        </span>
                      ))}
                    </div>

                    <span className="text-[11.5px] font-medium text-slate-400">
                      {isAr ? job.postedAgoAr : job.postedAgo}
                    </span>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex items-center justify-between pt-1">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                    >
                      <span>{isAr ? "عرض التفاصيل والمطابقة" : "View Details & Fit"}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => toggleSave(job.id)}
                      className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                        isSaved
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                          : 'border-slate-200 dark:border-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white'
                      }`}
                    >
                      <Bookmark className={`w-4.5 h-4.5 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                </div>
              );
            })}

          </div>

          {/* Right Sidebar Widgets Column (Span 4) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Widget 1: Quick Market Tip */}
            <div className="rounded-[26px] border border-blue-100 dark:border-blue-500/20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 shadow-lg shadow-blue-600/20">
              <div className="flex items-center gap-2 text-[12px] font-bold text-blue-100">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isAr ? "نصيحة السوق الذكية" : "Quick Market Tip"}</span>
              </div>

              <div className="mt-4">
                <span className="text-[12.5px] text-blue-100 font-medium block">
                  {isAr ? "ارتفاع الطلب على مهارة Tableau" : "Tableau demand increased"}
                </span>
                <p className="text-[34px] font-black leading-none mt-1">
                  +12%
                </p>
                <span className="text-[12px] text-blue-200 mt-1 block">
                  {isAr ? "في الشركات متعددة الجنسيات بمصر" : "in Egyptian MNCs vs last month"}
                </span>
              </div>

              {/* Glowing Line Graph */}
              <div className="mt-4 h-16 w-full">
                <svg viewBox="0 0 200 60" className="h-full w-full overflow-visible">
                  <path
                    d="M0 50 Q40 45 80 30 T150 25 T200 8"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="200" cy="8" r="4" fill="#FBBF24" />
                </svg>
              </div>
            </div>

            {/* Widget 2: In-Demand Skills */}
            <div className="rounded-[26px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-[14.5px] font-bold text-slate-900 dark:text-white">
                  {isAr ? "المهارات الأكثر طلباً" : "In-Demand Skills"}
                </h3>
                <Link href="/skills" className="text-[12px] font-bold text-blue-600 dark:text-blue-400 hover:underline">
                  {isAr ? "عرض الكل" : "View all"}
                </Link>
              </div>

              <div className="mt-5 space-y-3.5">
                {inDemandSkills.map((skill, index) => (
                  <div key={skill.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[12.5px]">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {index + 1}. {skill.name}
                      </span>
                      <span className="font-black text-slate-900 dark:text-white">{skill.share}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${index < 2 ? 'bg-emerald-500' : 'bg-blue-600'}`} 
                        style={{ width: `${skill.share}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 3: Job Market Overview */}
            <div className="rounded-[26px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-[14.5px] font-bold text-slate-900 dark:text-white">
                  {isAr ? "نظرة عامة على سوق الوظائف" : "Job Market Overview"}
                </h3>
                <span className="text-[11.5px] text-slate-400 font-medium">
                  {isAr ? "القاهرة الكبرى، مصر" : "Cairo, Egypt"}
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-[#070B14]">
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-[13px] font-black text-slate-900 dark:text-white">
                        {marketOverview.activeJobs}
                      </p>
                      <span className="text-[11px] text-slate-400">{isAr ? "وظائف محللي البيانات" : "Data Analyst jobs"}</span>
                    </div>
                  </div>
                  <span className="text-[11.5px] font-bold text-emerald-600">{marketOverview.activeJobsDelta}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-[#070B14]">
                  <div className="flex items-center gap-2.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="text-[13px] font-black text-slate-900 dark:text-white">
                        {marketOverview.avgSalary}
                      </p>
                      <span className="text-[11px] text-slate-400">{isAr ? "متوسط الراتب الشهري" : "Avg. Salary"}</span>
                    </div>
                  </div>
                  <span className="text-[11.5px] font-bold text-emerald-600">{marketOverview.avgSalaryDelta}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-[#070B14]">
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="text-[13px] font-black text-slate-900 dark:text-white">
                        {marketOverview.competition}
                      </p>
                      <span className="text-[11px] text-slate-400">{isAr ? "معدل المنافسة" : "Competition"}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950/60 text-[11px] font-black text-red-600 dark:text-red-400">
                    {isAr ? "شديدة" : "High"}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
}
