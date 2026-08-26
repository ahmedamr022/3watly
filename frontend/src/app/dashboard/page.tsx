"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Building2, 
  Monitor, 
  Star, 
  ArrowUpRight, 
  Sparkles, 
  Target, 
  CheckCircle2, 
  BookOpen, 
  CodeXml, 
  Bot, 
  Bookmark, 
  TrendingUp, 
  ArrowRight,
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockJobsList, mockDashboardData } from '@/data/jobs';

export default function DashboardPage() {
  const { isAr } = useLanguage();
  const { stats, careerAlignment, nextBestMove, upcomingTasks, marketTip } = mockDashboardData;

  const topJobs = mockJobsList.slice(0, 3);

  return (
    <AppShell>
      <div className="space-y-7">
        
        {/* ========================================================================= */}
        {/* 1. TOP 4 STAT CARDS                                                       */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Card 1: Total Analyzed Jobs */}
          <div className="rounded-[24px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-500/30 text-blue-600 dark:text-blue-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-[12px] font-bold text-slate-500 dark:text-slate-400">
                {isAr ? "وظائف تقنية نشطة" : "Total Analyzed Jobs"}
              </span>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-[28px] font-black text-[#0B132B] dark:text-white leading-none">
                  {stats.totalJobs.value}
                </p>
                <span className="mt-1.5 inline-flex items-center gap-0.5 text-[11.5px] font-bold text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {isAr ? stats.totalJobs.deltaAr : stats.totalJobs.delta}
                </span>
              </div>

              {/* Blue Sparkline Area */}
              <div className="h-8 w-20">
                <svg viewBox="0 0 100 40" className="h-full w-full overflow-visible">
                  <path
                    d="M0 32 Q25 28 45 18 T75 22 T100 6"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2: Hiring Companies */}
          <div className="rounded-[24px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-100 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-[12px] font-bold text-slate-500 dark:text-slate-400">
                {isAr ? "الشركات الموظفة" : "Hiring Companies"}
              </span>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-[28px] font-black text-[#0B132B] dark:text-white leading-none">
                  {stats.hiringCompanies.value}
                </p>
                <span className="mt-1.5 inline-flex items-center gap-0.5 text-[11.5px] font-bold text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {isAr ? stats.hiringCompanies.deltaAr : stats.hiringCompanies.delta}
                </span>
              </div>

              {/* Green Sparkline Area */}
              <div className="h-8 w-20">
                <svg viewBox="0 0 100 40" className="h-full w-full overflow-visible">
                  <path
                    d="M0 34 Q30 30 50 15 T80 25 T100 8"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 3: Remote/Hybrid Ratio */}
          <div className="rounded-[24px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-950/70 border border-purple-100 dark:border-purple-500/30 text-purple-600 dark:text-purple-400">
                <Monitor className="w-5 h-5" />
              </div>
              <span className="text-[12px] font-bold text-slate-500 dark:text-slate-400">
                {isAr ? "نسبة العمل عن بُعد/الهجين" : "Remote/Hybrid Ratio"}
              </span>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-[28px] font-black text-[#0B132B] dark:text-white leading-none">
                  {stats.remoteRatio.value}
                </p>
                <span className="mt-1.5 inline-flex items-center gap-0.5 text-[11.5px] font-bold text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {isAr ? stats.remoteRatio.deltaAr : stats.remoteRatio.delta}
                </span>
              </div>

              {/* Purple Sparkline Area */}
              <div className="h-8 w-20">
                <svg viewBox="0 0 100 40" className="h-full w-full overflow-visible">
                  <path
                    d="M0 30 Q25 24 55 28 T85 14 T100 6"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 4: Top In-Demand Skill */}
          <div className="rounded-[24px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/70 border border-amber-100 dark:border-amber-500/30 text-amber-500">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              </div>
              <span className="text-[12px] font-bold text-slate-500 dark:text-slate-400">
                {isAr ? "المهارة الأكثر طلباً" : "Top In-Demand Skill"}
              </span>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-[28px] font-black text-[#0B132B] dark:text-white leading-none">
                  {stats.topSkill.name}
                </p>
                <span className="mt-1.5 block text-[11.5px] font-medium text-slate-500 dark:text-slate-400">
                  {isAr ? stats.topSkill.subAr : stats.topSkill.sub}
                </span>
              </div>

              {/* Mini Bar Chart */}
              <div className="flex items-end gap-1 h-7">
                <span className="w-1.5 h-3 rounded-full bg-amber-400/40" />
                <span className="w-1.5 h-4.5 rounded-full bg-amber-400/60" />
                <span className="w-1.5 h-6 rounded-full bg-amber-400/80" />
                <span className="w-1.5 h-7 rounded-full bg-amber-500" />
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. MIDDLE 3 CORE SECTION CARDS                                            */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
          
          {/* A. Your Career Alignment Card (Span 4) */}
          <div className="lg:col-span-4 rounded-[28px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-1.5 text-[15px] font-bold text-slate-900 dark:text-white">
                  <span>{isAr ? "مؤشر التوافق المهني" : "Your Career Alignment"}</span>
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                </h2>
              </div>

              <div className="mt-6 flex items-center gap-5">
                {/* Radial Ring */}
                <div className="relative h-[115px] w-[115px] shrink-0">
                  <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="8.5" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="8.5"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - careerAlignment.score / 100)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[2rem] font-black text-blue-600 dark:text-blue-400 leading-none">
                      {careerAlignment.score}%
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200 leading-snug">
                    {isAr ? careerAlignment.summaryAr : careerAlignment.summary}
                  </p>
                  <span className="mt-1.5 inline-flex items-center gap-1 text-[11.5px] font-bold text-emerald-600 dark:text-emerald-400">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    {isAr ? careerAlignment.deltaAr : careerAlignment.delta}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
              <p className="text-[11.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {isAr ? "لماذا يهم هذا المؤشر؟" : "Why this matters?"}
              </p>
              <p className="mt-1 text-[12.5px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {isAr ? careerAlignment.whyMattersAr : careerAlignment.whyMatters}
              </p>
              <Link
                href="/market"
                className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>{isAr ? "عرض التقرير الكامل" : "View Full Report"}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
              </Link>
            </div>
          </div>

          {/* B. Your Next Best Move Card (Span 4) */}
          <div className="lg:col-span-4 rounded-[28px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400">
                  <Target className="w-5 h-5" />
                </div>
                <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">
                  {isAr ? "خطوتك القادمة الأهم" : "Your Next Best Move"}
                </h2>
              </div>

              <div className="mt-5 space-y-2">
                <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">
                  {isAr ? "ركز على مهارات " : "Improve "}
                  <span className="text-blue-600 dark:text-blue-400">Power BI</span> {isAr ? "و " : "and "}
                  <span className="text-blue-600 dark:text-blue-400">SQL</span>.
                </h3>
                <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {isAr ? nextBestMove.descriptionAr : nextBestMove.description}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
              <Link
                href="/skills"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13.5px] shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5"
              >
                <span>{isAr ? "عرض مسار سد فجوة المهارات" : "View Skill Gap Roadmap"}</span>
                <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
              </Link>
            </div>
          </div>

          {/* C. Upcoming Focus Tasks Card (Span 4) */}
          <div className="lg:col-span-4 rounded-[28px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4.5 h-4.5 text-slate-500" />
                  <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">
                    {isAr ? "المهام والتركيز القادم" : "Upcoming Focus"}
                  </h2>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {upcomingTasks.map((task) => (
                  <div 
                    key={task.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/70 dark:bg-[#070B14] hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-lg bg-white dark:bg-[#0D1527] shadow-xs text-blue-600 shrink-0">
                        {task.icon === 'book' && <BookOpen className="w-4 h-4" />}
                        {task.icon === 'code' && <CodeXml className="w-4 h-4" />}
                        {task.icon === 'bot' && <Bot className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200 truncate">
                          {isAr ? task.titleAr : task.title}
                        </p>
                        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                          {isAr ? task.statusAr : task.status}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 shrink-0">
                      {isAr ? task.timeAr : task.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5">
              <Link
                href="/learning"
                className="inline-flex items-center gap-1 text-[12.5px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>{isAr ? "عرض كل المهام والمسارات" : "View All Tasks"}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
              </Link>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. BOTTOM SECTION: TOP MATCHED JOBS & MARKET TIP                          */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[18px] font-black text-slate-900 dark:text-white">
                {isAr ? "أفضل الوظائف المطابقة لملفك حالياً" : "Top Matched Jobs for You"}
              </h2>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1 text-[13px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>{isAr ? "استعراض كل الوظائف" : "View all jobs"}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-stretch">
            
            {/* Top 3 Job Cards (Span 9) */}
            <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {topJobs.map((job) => (
                <div 
                  key={job.id}
                  className="rounded-[24px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Header: Company & Match Donut */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 font-bold text-slate-700 dark:text-white text-xs">
                          {job.company.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-[13.5px] font-bold text-slate-900 dark:text-white leading-tight">
                            {isAr ? job.titleAr : job.title}
                          </h3>
                          <p className="text-[11.5px] text-slate-400 mt-0.5">
                            {isAr ? job.companyAr : job.company}
                          </p>
                        </div>
                      </div>

                      {/* Match Badge */}
                      <span className="flex flex-col items-center justify-center h-10 w-10 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/70 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-black">
                        {job.matchScore}%
                      </span>
                    </div>

                    <p className="mt-3 text-[12px] text-slate-500 dark:text-slate-400">
                      {isAr ? job.locationAr : job.location} • {isAr ? job.workTypeAr : job.workType}
                    </p>

                    {/* Skill Tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {job.matchedSkills.slice(0, 3).map((s) => (
                        <span 
                          key={s.name}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/5 text-[11px] font-semibold text-slate-600 dark:text-slate-300"
                        >
                          {s.name}
                        </span>
                      ))}
                      <span className="px-1.5 py-0.5 rounded-lg bg-slate-100 dark:bg-white/5 text-[10.5px] font-semibold text-slate-400">
                        +2
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11.5px] text-slate-400">
                    <span>{isAr ? job.postedAgoAr : job.postedAgo}</span>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {isAr ? "التفاصيل ←" : "Details →"}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Market Tip Widget (Span 3) */}
            <div className="lg:col-span-3 rounded-[24px] border border-blue-100 dark:border-blue-500/20 bg-gradient-to-b from-blue-50/70 to-indigo-50/50 dark:from-[#0B1428] dark:to-[#080D1A] p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="mt-3.5 text-[14px] font-bold text-slate-900 dark:text-white">
                  {isAr ? "نصيحة السوق الذكية" : "Market Tip"}
                </h3>
                <p className="mt-2 text-[12.5px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {isAr ? marketTip.textAr : marketTip.text}
                </p>
              </div>

              <Link
                href="/market"
                className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>{isAr ? "استكشف مؤشرات السوق" : "Explore Market Insights"}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
              </Link>
            </div>

          </div>
        </div>

      </div>
    </AppShell>
  );
}
