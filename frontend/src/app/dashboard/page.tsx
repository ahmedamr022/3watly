"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Building2, 
  Monitor, 
  Star, 
  ArrowUpRight, 
  Target, 
  BookOpen, 
  Code2, 
  Bot, 
  Bookmark, 
  TrendingUp, 
  ArrowRight,
  Info,
  Calendar
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { ApiService } from '@/services/api';
import { CompanyLogo } from '@/components/brand/CompanyLogo';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
import { mockJobsList } from '@/data/jobs';

export default function DashboardPage() {
  const { isAr } = useLanguage();
  const { user } = useAuth();
  const [liveJobs, setLiveJobs] = useState(mockJobsList);

  React.useEffect(() => {
    let mounted = true;
    ApiService.getJobs().then((res: any) => {
      if (mounted && res && (Array.isArray(res) || Array.isArray(res.jobs))) {
        const data = Array.isArray(res) ? res : res.jobs;
        if (data.length > 0) setLiveJobs(data);
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);
  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>([]);

  const toggleBookmark = (id: string | number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const strId = String(id);
    setBookmarkedJobs(prev => 
      prev.includes(strId) ? prev.filter(item => item !== strId) : [...prev, strId]
    );
  };

  const topJobs = React.useMemo(() => {
    const list = liveJobs.length > 0 ? liveJobs.slice(0, 3) : mockJobsList.slice(0, 3);
    return list.map((job: any) => ({
      id: String(job.id),
      title: job.title,
      titleAr: job.titleAr || job.title,
      company: job.company,
      companyAr: job.companyAr || job.company,
      location: job.location || 'Cairo, Egypt',
      locationAr: job.locationAr || job.location || 'القاهرة، مصر',
      matchScore: job.matchScore || 82,
      skills: Array.isArray(job.matchedSkills)
        ? job.matchedSkills.map((s: any) => typeof s === 'string' ? s : s.name).slice(0, 3)
        : Array.isArray(job.skills)
        ? job.skills.slice(0, 3)
        : ['SQL', 'Python', 'Power BI'],
      extraSkillsCount: Math.max(0, ((job.matchedSkills?.length || job.skills?.length || 5) - 3)),
      postedAgo: job.postedAgo || 'Recently',
      postedAgoAr: job.postedAgoAr || 'مؤخراً',
    }));
  }, [liveJobs]);

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
        
        {/* ========================================================================= */}
        {/* 1. TOP 4 STAT CARDS (Matching Image 1 Exactly)                           */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Card 1: Total Analyzed Jobs */}
          <div className="rounded-[20px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex items-center justify-between">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EEF3FE] dark:bg-blue-950/70 text-[#1B57E0] dark:text-[#60A5FA]">
                <Briefcase className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <span className="block text-[13px] font-medium text-slate-500 dark:text-slate-400 truncate">
                  {isAr ? "إجمالي الوظائف المحللة" : "Total Analyzed Jobs"}
                </span>
                <p className="text-[26px] font-black text-[#0B132B] dark:text-white leading-tight mt-0.5">
                  12,842
                </p>
                <div className="mt-1 flex items-center gap-1 text-[12px] font-bold text-[#12B76A]">
                  <span>↑ 8%</span>
                  <span className="font-normal text-slate-400 dark:text-slate-500 text-[11px]">
                    {isAr ? "مقارنة بآخر 30 يوم" : "vs last 30 days"}
                  </span>
                </div>
              </div>
            </div>

            {/* Blue Sparkline Wave */}
            <div className="h-9 w-20 shrink-0 ltr:ml-2 rtl:mr-2">
              <svg viewBox="0 0 100 40" className="h-full w-full overflow-visible">
                <path
                  d="M0 32 Q20 35 35 20 T65 24 T85 10 T100 6"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Card 2: Hiring Companies */}
          <div className="rounded-[20px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex items-center justify-between">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E8F8F0] dark:bg-emerald-950/70 text-[#12B76A] dark:text-[#34D399]">
                <Building2 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <span className="block text-[13px] font-medium text-slate-500 dark:text-slate-400 truncate">
                  {isAr ? "الشركات الموظفة" : "Hiring Companies"}
                </span>
                <p className="text-[26px] font-black text-[#0B132B] dark:text-white leading-tight mt-0.5">
                  1,246
                </p>
                <div className="mt-1 flex items-center gap-1 text-[12px] font-bold text-[#12B76A]">
                  <span>↑ 6.3%</span>
                  <span className="font-normal text-slate-400 dark:text-slate-500 text-[11px]">
                    {isAr ? "مقارنة بآخر 30 يوم" : "vs last 30 days"}
                  </span>
                </div>
              </div>
            </div>

            {/* Green Sparkline Wave */}
            <div className="h-9 w-20 shrink-0 ltr:ml-2 rtl:mr-2">
              <svg viewBox="0 0 100 40" className="h-full w-full overflow-visible">
                <path
                  d="M0 34 Q25 36 40 22 T70 26 T88 12 T100 6"
                  fill="none"
                  stroke="#12B76A"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Card 3: Remote/Hybrid Ratio */}
          <div className="rounded-[20px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex items-center justify-between">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F3E8FF] dark:bg-purple-950/70 text-[#9333EA] dark:text-[#C084FC]">
                <Monitor className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <span className="block text-[13px] font-medium text-slate-500 dark:text-slate-400 truncate">
                  {isAr ? "نسبة العمل عن بُعد/هجين" : "Remote/Hybrid Ratio"}
                </span>
                <p className="text-[26px] font-black text-[#0B132B] dark:text-white leading-tight mt-0.5">
                  38.4%
                </p>
                <div className="mt-1 flex items-center gap-1 text-[12px] font-bold text-[#12B76A]">
                  <span>↑ 4.7%</span>
                  <span className="font-normal text-slate-400 dark:text-slate-500 text-[11px]">
                    {isAr ? "مقارنة بآخر 30 يوم" : "vs last 30 days"}
                  </span>
                </div>
              </div>
            </div>

            {/* Purple Sparkline Wave */}
            <div className="h-9 w-20 shrink-0 ltr:ml-2 rtl:mr-2">
              <svg viewBox="0 0 100 40" className="h-full w-full overflow-visible">
                <path
                  d="M0 32 Q25 24 45 28 T75 14 T90 20 T100 6"
                  fill="none"
                  stroke="#9333EA"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Card 4: Top In-Demand Skill */}
          <div className="rounded-[20px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex items-center justify-between">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF7ED] dark:bg-amber-950/70 text-[#F97316]">
                <Star className="w-6 h-6 stroke-[2.2] fill-transparent" />
              </div>
              <div className="min-w-0">
                <span className="block text-[13px] font-medium text-slate-500 dark:text-slate-400 truncate">
                  {isAr ? "المهارة الأكثر طلباً" : "Top In-Demand Skill"}
                </span>
                <p className="text-[26px] font-black text-[#0B132B] dark:text-white leading-tight mt-0.5">
                  SQL
                </p>
                <span className="block text-[11.5px] font-normal text-slate-500 dark:text-slate-400 mt-1 truncate">
                  {isAr ? "مطلوبة في 81% من وظائف البيانات" : "81% of data roles"}
                </span>
              </div>
            </div>

            {/* Ascending Orange Bars */}
            <div className="flex items-end gap-1.5 h-8 shrink-0 ltr:ml-2 rtl:mr-2">
              <span className="w-2 h-2.5 rounded-full bg-[#F97316]/30" />
              <span className="w-2 h-4 rounded-full bg-[#F97316]/50" />
              <span className="w-2 h-5.5 rounded-full bg-[#F97316]/70" />
              <span className="w-2 h-7 rounded-full bg-[#F97316]/90" />
              <span className="w-2 h-8 rounded-full bg-[#F97316]" />
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. MIDDLE 3 CORE CARDS (Matching Image 3 Exactly)                         */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-stretch">
          
          {/* Card 1: Your Career Alignment (Span 4) */}
          <div className="lg:col-span-4 rounded-[24px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              {/* Header with info tooltip */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-[16px] font-bold text-[#0B132B] dark:text-white">
                    {isAr ? "مؤشر التوافق المهني" : "Your Career Alignment"}
                  </h2>
                  <InfoTooltip
                    title="Career Alignment"
                    titleAr="مؤشر التوافق المهني"
                    content="Calculates your profile readiness against 1,240+ active Data & Tech roles across Egyptian top employers."
                    contentAr="يقيس جاهزية وتوافق مهاراتك مع أكثر من 1,240 وظيفة نشطة في كبرى الشركات داخل مصر."
                  />
                </div>
              </div>

              {/* Progress Gauge + Status */}
              <div className="mt-6 flex items-center gap-5">
                {/* Donut Ring */}
                <div className="relative h-[110px] w-[110px] shrink-0">
                  <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="none" 
                      stroke="#EEF3FE" 
                      className="dark:stroke-slate-800" 
                      strokeWidth="9" 
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#1B57E0"
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - 0.74)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[26px] font-black text-[#0B132B] dark:text-white leading-none">
                      74%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[13.5px] font-bold text-[#0B132B] dark:text-slate-200 leading-snug">
                    {isAr ? "متوافق جيداً مع متطلبات السوق الحالية" : "You're aligned with current market demand"}
                  </p>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E8F8F0] dark:bg-emerald-950/60 text-[#12B76A] dark:text-emerald-400 text-[11.5px] font-bold">
                    <span>↑ 6% {isAr ? "عن الأسبوع الماضي" : "from last week"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer: Why this matters + Button */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/10 space-y-3.5">
              <div>
                <p className="text-[13px] font-bold text-[#0B132B] dark:text-white">
                  {isAr ? "لماذا يهم هذا المؤشر؟" : "Why this matters?"}
                </p>
                <p className="mt-1 text-[12.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isAr 
                    ? "المرشحون بنسبة توافق +70% يحصلون على معدل ردود للمقابلات أعلى بـ 3.6x."
                    : "Professionals with 70%+ alignment get 3.6x more interview callbacks."}
                </p>
              </div>

              <Link
                href="/market"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0B1120]/[0.06] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 text-[12.5px] font-bold transition-colors"
              >
                <span>{isAr ? "عرض التقرير الكامل" : "View Full Report"}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
              </Link>
            </div>
          </div>

          {/* Card 2: Your Next Best Move (Span 4) */}
          <div className="lg:col-span-4 rounded-[24px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              {/* Header with Target Squircle */}
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF3FE] dark:bg-blue-950/70 text-[#1B57E0] dark:text-[#60A5FA]">
                  <Target className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h2 className="text-[16px] font-bold text-[#0B132B] dark:text-white">
                  {isAr ? "خطوتك القادمة الأهم" : "Your Next Best Move"}
                </h2>
              </div>

              {/* Content */}
              <div className="mt-6 space-y-2.5">
                <h3 className="text-[15.5px] font-bold text-[#0B132B] dark:text-white leading-snug">
                  {isAr ? "طور مهارات " : "Improve "}
                  <span className="text-[#1B57E0] dark:text-[#60A5FA]">Power BI</span> {isAr ? "و " : "and "}
                  <span className="text-[#1B57E0] dark:text-[#60A5FA]">SQL</span>.
                </h3>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isAr
                    ? "هاتان هما أكثر مهارتين ذات تأثير مرتفع تنقصان ملفك مقارنة بـ 1,240 وظيفة نشطة في سوق العمل المصري."
                    : "These are the two highest-impact skills missing from your profile based on 1,240 current Egyptian job postings."}
                </p>
              </div>
            </div>

            {/* Full Width Action Button */}
            <div className="mt-6 pt-5">
              <Link
                href="/skills"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1B57E0] hover:bg-blue-700 text-white font-bold text-[13.5px] shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5"
              >
                <span>{isAr ? "عرض مسار سد فجوة المهارات" : "View Skill Gap Roadmap"}</span>
                <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
              </Link>
            </div>
          </div>

          {/* Card 3: Upcoming Focus (Span 4) */}
          <div className="lg:col-span-4 rounded-[24px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <h2 className="text-[16px] font-bold text-[#0B132B] dark:text-white">
                  {isAr ? "المهام والتركيز القادم" : "Upcoming Focus"}
                </h2>
              </div>

              {/* Task Items List */}
              <div className="mt-4 rounded-2xl border border-slate-100 dark:border-white/10 p-2 space-y-1 divide-y divide-slate-100 dark:divide-white/[0.04]">
                
                {/* Item 1: Power BI Course */}
                <div className="flex items-center justify-between p-2.5 hover:bg-slate-50/80 dark:hover:bg-white/[0.02] rounded-xl transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF7ED] dark:bg-amber-950/60 text-[#F97316]">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-[#0B132B] dark:text-white truncate">
                        {isAr ? "دورة Power BI - الفصل 3" : "Complete Power BI Course Chapter 3"}
                      </p>
                      <span className="text-[11.5px] font-semibold text-[#F97316]">
                        {isAr ? "قيد التقدم" : "In Progress"}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11.5px] font-medium text-slate-400 dark:text-slate-500 shrink-0 ltr:ml-2 rtl:mr-2">
                    {isAr ? "اليوم 6:00 م" : "Today 6:00 PM"}
                  </span>
                </div>

                {/* Item 2: SQL Practice */}
                <div className="flex items-center justify-between p-2.5 hover:bg-slate-50/80 dark:hover:bg-white/[0.02] rounded-xl transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F8F0] dark:bg-emerald-950/60 text-[#12B76A]">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-[#0B132B] dark:text-white truncate">
                        {isAr ? "تمارين استعلامات SQL المتقدمة" : "SQL Advanced Queries Practice"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11.5px] font-medium text-slate-400 dark:text-slate-500 shrink-0 ltr:ml-2 rtl:mr-2">
                    {isAr ? "غداً 10:00 ص" : "Tomorrow 10:00 AM"}
                  </span>
                </div>

                {/* Item 3: Copilot */}
                <div className="flex items-center justify-between p-2.5 hover:bg-slate-50/80 dark:hover:bg-white/[0.02] rounded-xl transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3E8FF] dark:bg-purple-950/60 text-[#9333EA]">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-[#0B132B] dark:text-white truncate">
                        {isAr ? "جلسة مع المساعد الذكي" : "Chat with AI Copilot"}
                      </p>
                      <span className="text-[11.5px] font-semibold text-[#9333EA]">
                        {isAr ? "احصل على نصائح مهنية" : "Get career advice"}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11.5px] font-medium text-slate-400 dark:text-slate-500 shrink-0 ltr:ml-2 rtl:mr-2">
                    {isAr ? "28 مايو 2:00 م" : "May 28 2:00 PM"}
                  </span>
                </div>

              </div>
            </div>

            {/* Bottom Link */}
            <div className="mt-4 pt-3">
              <Link
                href="/copilot"
                className="inline-flex items-center gap-1 text-[13px] font-bold text-[#1B57E0] dark:text-[#60A5FA] hover:underline"
              >
                <span>{isAr ? "عرض كل المهام والمواعيد" : "View All Tasks"}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
              </Link>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. BOTTOM ROW: TOP MATCHED JOBS & MARKET TIP (Matching Image 2 Exactly)    */}
        {/* ========================================================================= */}
        <div className="rounded-[24px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-5">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-[#0B132B] dark:text-white">
              {isAr ? "أفضل الوظائف المطابقة لملفك" : "Top Matched Jobs for You"}
            </h2>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1 text-[13px] font-bold text-[#1B57E0] dark:text-[#60A5FA] hover:underline"
            >
              <span>{isAr ? "عرض كل الوظائف" : "View all jobs"}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
            </Link>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
            
            {/* Job Card 1: Vodafone Egypt */}
            {topJobs.map((job) => {
              const isSaved = bookmarkedJobs.includes(job.id);
              return (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="rounded-[20px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0E1628] p-4 hover:shadow-md hover:border-blue-400/50 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Company Logo + Title/Company + Match Donut Ring */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        {/* Official Company Logo Badge */}
                        <CompanyLogo company={job.company} size="sm" className="shrink-0" />

                        <div className="min-w-0">
                          <h3 className="text-[13.5px] font-bold text-[#0B132B] dark:text-white leading-tight truncate group-hover:text-blue-600 transition-colors">
                            {isAr ? job.titleAr : job.title}
                          </h3>
                          <p className="text-[12px] font-normal text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                            {isAr ? job.companyAr : job.company}
                          </p>
                        </div>
                      </div>

                      {/* Match Ring */}
                      <div className="flex flex-col items-center shrink-0">
                        <div className="relative h-11 w-11">
                          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#E8F8F0" className="dark:stroke-emerald-950/60" strokeWidth="9" />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#12B76A"
                              strokeWidth="9"
                              strokeLinecap="round"
                              strokeDasharray={2 * Math.PI * 40}
                              strokeDashoffset={2 * Math.PI * 40 * (1 - job.matchScore / 100)}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[11px] font-black text-[#0B132B] dark:text-white leading-none">
                              {job.matchScore}%
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium text-slate-400 mt-0.5">
                          {isAr ? "توافق" : "Match"}
                        </span>
                      </div>
                    </div>

                    {/* Location & Work Type */}
                    <p className="mt-2 text-[11.5px] text-slate-500 dark:text-slate-400 truncate">
                      {isAr ? job.locationAr : job.location}
                    </p>

                    {/* Skill Pills */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {job.skills.map((skill: string) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-[#0B1120]/5 text-[11px] font-medium text-slate-600 dark:text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                      <span className="px-1.5 py-0.5 rounded-lg bg-slate-100 dark:bg-[#0B1120]/5 text-[10.5px] font-medium text-slate-400">
                        +{job.extraSkillsCount}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Info: Posted Time + Bookmark Icon */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                    <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500">
                      {isAr ? job.postedAgoAr : job.postedAgo}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => toggleBookmark(job.id, e)}
                      className={`p-1 rounded-lg transition-colors cursor-pointer ${
                        isSaved ? 'text-blue-600 fill-blue-600' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </Link>
              );
            })}

            {/* Card 4: Market Tip Card (Matching Image 2 Right Card) */}
            <div className="rounded-[20px] border border-blue-100 dark:border-blue-500/20 bg-[#F0F7FF] dark:bg-[#0A1428] p-5 flex flex-col justify-between shadow-xs">
              <div>
                {/* Trend Up Icon */}
                <div className="w-8 h-8 flex items-center justify-center text-[#1B57E0] dark:text-[#60A5FA]">
                  <TrendingUp className="w-6 h-6 stroke-[2.5]" />
                </div>

                <h3 className="mt-2 text-[15px] font-bold text-[#0B132B] dark:text-white">
                  {isAr ? "نصيحة السوق" : "Market Tip"}
                </h3>

                <p className="mt-2 text-[12.5px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {isAr 
                    ? "ارتفع الطلب على مهارة Tableau بنسبة +12% في الشركات متعددة الجنسيات في مصر خلال آخر 90 يوم."
                    : "Tableau demand increased +12% in Egyptian MNCs over the last 90 days."}
                </p>
              </div>

              <Link
                href="/market"
                className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1B57E0] dark:text-[#60A5FA] hover:underline"
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
