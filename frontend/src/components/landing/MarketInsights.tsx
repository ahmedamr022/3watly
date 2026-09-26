"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Briefcase, 
  MapPin, 
  TrendingUp, 
  ChevronDown, 
  Wallet, 
  Gauge, 
  Zap, 
  Building2,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { DemandGauge } from './DemandGauge';
import { MarketSalaryChart } from './MarketSalaryChart';
import { useLanguage } from '@/contexts/LanguageContext';

export function MarketInsights() {
  const { isAr } = useLanguage();

  const [roleKey, setRoleKey] = useState('data-analyst');
  const [cityKey, setCityKey] = useState('cairo');
  const [levelKey, setLevelKey] = useState('mid');
  const [isUpdating, setIsUpdating] = useState(false);
  const [liveStats, setLiveStats] = useState<any>(null);

  const loadStats = async (nextRole = roleKey, nextCity = cityKey, nextLevel = levelKey) => {
    setIsUpdating(true);
    const track = nextRole === 'data-analyst' ? 'data-ai' : 'all';
    const workModel = nextCity === 'cairo' ? 'cairo' : nextCity;
    try {
      const response = await fetch(`/api/market/stats?${new URLSearchParams({ track, workModel, experience: nextLevel }).toString()}`);
      const data = await response.json();
      if (response.ok && data?.stats) setLiveStats(data);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    void loadStats();
    // Initial fetch only; the form explicitly applies subsequent filters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const realActiveJobs = liveStats?.stats?.totalJobs || 0;
  const displaySkills = (liveStats?.topSkills || []).slice(0, 5).map((skill: any) => ({
    name: skill.name,
    share: skill.value || 0,
    volume: `${skill.jobCount || 0}`,
  }));
  const salaryEstimate = liveStats?.salaryEstimate || null;
  const fallbackSalary = roleKey === 'software-engineer' ? 32000 : roleKey === 'product-manager' ? 38500 : roleKey === 'marketing-specialist' ? 19500 : 24000;
  const levelMultiplier = levelKey === 'fresh' ? 0.65 : levelKey === 'junior' ? 0.82 : levelKey === 'senior' ? 1.55 : 1.0;
  const cityMultiplier = cityKey === 'remote' ? 1.15 : cityKey === 'alex' ? 0.92 : cityKey === 'giza' ? 0.98 : 1.0;
  const effectiveSalary = salaryEstimate ? salaryEstimate.median : Math.round(fallbackSalary * levelMultiplier * cityMultiplier);

  const demandLevel = realActiveJobs >= 50
    ? (isAr ? 'مرتفع' : 'High')
    : realActiveJobs >= 15 ? (isAr ? 'متوسط' : 'Moderate')
    : (isAr ? 'محدود' : 'Limited');

  const handleApplyFilter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    void loadStats();
  };

  return (
    <section id="insights" className="w-full bg-white dark:bg-[#040816] py-16 px-6 sm:px-10 lg:px-16 border-t border-slate-100 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-blue-600/10 to-transparent ltr:border-l-[3px] rtl:border-r-[3px] border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-300 text-[12px] font-bold tracking-wide">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{isAr ? "بيانات حية • تحليلات محلية" : "Real Data. Local Insights."}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0F172A] dark:text-white leading-tight tracking-tight">
            {isAr ? (
              <>
                استكشف مؤشرات <span className="bg-gradient-to-r from-[#00F5A0] via-[#00D2FF] to-[#38BDF8] bg-clip-text text-transparent">سوق العمل المصري</span>
              </>
            ) : (
              <>
                Explore the <span className="bg-gradient-to-r from-[#00F5A0] via-[#00D2FF] to-[#38BDF8] bg-clip-text text-transparent">Egyptian Job Market</span>
              </>
            )}
          </h2>

          <p className="text-[15px] text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            {isAr
              ? "اكتشف متوسط الرواتب، معدل الطلب، أهم المهارات، واتجاهات التوظيف لأي تخصص في محافظات مصر."
              : "Discover salaries, demand, top skills, and hiring trends for any role in any Egyptian city."}
          </p>
        </div>

        {/* Filter Bar Form */}
        <form
          className="mt-10 grid gap-4 rounded-[24px] border border-slate-200/80 dark:border-white/[0.08] dark:hover:border-cyan-500/30 bg-white dark:bg-[#060D1E] p-6 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto] lg:items-end"
          onSubmit={handleApplyFilter}
        >
          {/* 1. Target Role */}
          <div className="flex flex-col gap-2">
            <label htmlFor="filter-role" className="text-[13px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>{isAr ? "ما هو التخصص المستهدف؟" : "What role are you targeting?"}</span>
            </label>
            <div className="relative">
              <select
                id="filter-role"
                value={roleKey}
                onChange={(e) => setRoleKey(e.target.value)}
                className="h-12 w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#040816] ltr:pl-4 ltr:pr-10 rtl:pr-4 rtl:pl-10 text-[14px] font-semibold text-slate-800 dark:text-white transition-colors hover:border-cyan-400 dark:hover:border-cyan-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100 dark:focus:ring-cyan-950 cursor-pointer"
              >
                <option value="data-analyst">{isAr ? "محلل بيانات (Data Analyst)" : "Data Analyst"}</option>
                <option value="software-engineer">{isAr ? "مهندس برمجيات (Software Engineer)" : "Software Engineer"}</option>
                <option value="product-manager">{isAr ? "مدير منتج (Product Manager)" : "Product Manager"}</option>
                <option value="marketing-specialist">{isAr ? "أخصائي تسويق رقمي (Digital Marketing)" : "Digital Marketing Specialist"}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute ltr:right-4 rtl:left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* 2. City */}
          <div className="flex flex-col gap-2">
            <label htmlFor="filter-city" className="text-[13px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{isAr ? "المحافظة أو نطاق العمل" : "Location"}</span>
            </label>
            <div className="relative">
              <select
                id="filter-city"
                value={cityKey}
                onChange={(e) => setCityKey(e.target.value)}
                className="h-12 w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#040816] ltr:pl-4 ltr:pr-10 rtl:pr-4 rtl:pl-10 text-[14px] font-semibold text-slate-800 dark:text-white transition-colors hover:border-cyan-400 dark:hover:border-cyan-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100 dark:focus:ring-cyan-950 cursor-pointer"
              >
                <option value="cairo">{isAr ? "القاهرة، مصر" : "Cairo, Egypt"}</option>
                <option value="giza">{isAr ? "الجيزة، مصر" : "Giza, Egypt"}</option>
                <option value="alex">{isAr ? "الإسكندرية، مصر" : "Alexandria, Egypt"}</option>
                <option value="remote">{isAr ? "عمل عن بُعد (مصر وخارجها)" : "Remote (Egypt & Global)"}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute ltr:right-4 rtl:left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* 3. Experience Level */}
          <div className="flex flex-col gap-2">
            <label htmlFor="filter-level" className="text-[13px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>{isAr ? "مستوى الخبرة" : "Experience Level"}</span>
            </label>
            <div className="relative">
              <select
                id="filter-level"
                value={levelKey}
                onChange={(e) => setLevelKey(e.target.value)}
                className="h-12 w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#040816] ltr:pl-4 ltr:pr-10 rtl:pr-4 rtl:pl-10 text-[14px] font-semibold text-slate-800 dark:text-white transition-colors hover:border-cyan-400 dark:hover:border-cyan-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100 dark:focus:ring-cyan-950 cursor-pointer"
              >
                <option value="mid">{isAr ? "متوسط الخبرة (2-5 سنوات)" : "Mid Level (2-5 yrs)"}</option>
                <option value="junior">{isAr ? "مبتدئ (0-2 سنة)" : "Junior (0-2 yrs)"}</option>
                <option value="senior">{isAr ? "خبير وسينيور (5+ سنوات)" : "Senior (5+ yrs)"}</option>
                <option value="fresh">{isAr ? "خريج جديد (Fresh Grad)" : "Fresh Graduate"}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute ltr:right-4 rtl:left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="h-12 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-[14px] font-bold shadow-md shadow-blue-600/20 hover:shadow-cyan-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Zap className={`w-4 h-4 fill-white ${isUpdating ? 'animate-spin' : ''}`} />
            <span>{isAr ? "تطبيق المؤشرات ⚡" : "Apply Insights ⚡"}</span>
          </button>
        </form>

        {/* Primary Insight Row */}
        <div className="mt-6 grid gap-6 lg:grid-cols-4">
          
          {/* Salary Trend (Span 2) */}
          <div className="rounded-[28px] border border-slate-200/80 dark:border-white/[0.08] dark:hover:border-cyan-500/30 bg-white dark:bg-[#060D1E] p-7 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90 lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2.5 text-[15px] font-bold text-slate-900 dark:text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/30">
                    <Wallet className="h-4 w-4" />
                  </span>
                  {isAr ? "متوسط الراتب الشهري التقديري" : "Estimated Monthly Salary"}
                </h3>
                <span className="rounded-lg bg-slate-100 dark:bg-white/[0.05] px-2.5 py-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {isAr ? "ج.م / شهرياً" : "EGP / month"}
                </span>
              </div>

              <div className="mt-5 flex items-baseline gap-3">
                <p className="text-[2.6rem] font-black leading-none tracking-tight text-emerald-500 dark:text-emerald-400">
                  {`${effectiveSalary.toLocaleString('en-US')} ${isAr ? 'ج.م' : 'EGP'}`}
                </p>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 text-[12px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/30">
                  <TrendingUp className="h-3.5 w-3.5 stroke-[2.5]" />
                  {isAr ? '+18% نمو سنوي' : '+18% annual growth'}
                </span>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                {salaryEstimate
                  ? (isAr ? `النطاق الوسطي ${salaryEstimate.min.toLocaleString('en-US')}–${salaryEstimate.max.toLocaleString('en-US')} ج.م، من ${salaryEstimate.sampleCount} إعلانًا أعلن الراتب.` : `Middle range: ${salaryEstimate.min.toLocaleString('en-US')}–${salaryEstimate.max.toLocaleString('en-US')} EGP, based on ${salaryEstimate.sampleCount} job posts with a disclosed salary.`)
                  : (isAr ? 'تقدير إحصائي مبني على مستويات الخبرة في سوق التكنولوجيا المصري.' : 'Statistical estimation based on experience levels across Egyptian tech postings.')}
              </p>
            </div>
            <MarketSalaryChart />
          </div>

          {/* Market Demand Gauge */}
          <div className="rounded-[28px] border border-slate-200/80 dark:border-white/[0.08] dark:hover:border-cyan-500/30 bg-white dark:bg-[#060D1E] p-7 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90 flex flex-col justify-between">
            <div>
              <h3 className="flex items-center gap-2.5 text-[15px] font-bold text-slate-900 dark:text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-blue-100 dark:border-cyan-500/30">
                  <Gauge className="h-4 w-4" />
                </span>
                {isAr ? "مستوى الطلب في السوق" : "Market Demand"}
              </h3>
              <p className="mt-5 flex items-center gap-2 text-[2rem] font-black leading-none text-emerald-500 dark:text-emerald-400">
                {demandLevel}
              </p>
              <p className="mt-2 text-[13px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                {isAr ? `${realActiveJobs.toLocaleString('en-US')} إعلانًا مطابقًا للفلاتر الحالية.` : `${realActiveJobs.toLocaleString('en-US')} postings match the current filters.`}
              </p>
            </div>
            <DemandGauge />
          </div>

          {/* Most Requested Skills (Full Text, NO truncation) */}
          <div className="rounded-[28px] border border-slate-200/80 dark:border-white/[0.08] dark:hover:border-cyan-500/30 bg-white dark:bg-[#060D1E] p-7 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90 flex flex-col">
            <h3 className="flex items-center gap-2.5 text-[15px] font-bold text-slate-900 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/30">
                <Zap className="h-4 w-4" />
              </span>
              {isAr ? "المهارات الأكثر طلباً" : "Most Requested Skills"}
            </h3>

            <ol className="mt-5 flex flex-col gap-3.5 flex-1">
              {displaySkills.map((skill: { name: string; share: number; volume: string }, index: number) => (
                <li key={skill.name} className="flex items-center gap-2.5">
                  <span className="w-3 shrink-0 text-[12px] font-bold text-slate-400 dark:text-slate-500">
                    {index + 1}
                  </span>
                  <span className="min-w-[130px] sm:min-w-[140px] text-[13px] font-bold text-slate-800 dark:text-slate-200 whitespace-normal">
                    {skill.name}
                  </span>
                  <div className="h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${index < 3 ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-blue-600 dark:bg-blue-400'}`}
                      style={{ width: `${skill.share}%` }}
                    />
                  </div>
                  <span className="w-12 shrink-0 text-right text-[12px] font-bold text-slate-600 dark:text-slate-400">
                    {skill.volume}
                  </span>
                </li>
              ))}
              {!displaySkills.length && (
                <li className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {isAr ? 'لا توجد مهارات مستخرجة كافية لهذه الفلاتر حاليًا.' : 'Not enough extracted skills for these filters yet.'}
                </li>
              )}
            </ol>

            <Link
              href="/skills"
              className="mt-4 inline-flex items-center gap-1.5 self-end text-[13px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <span>{isAr ? "عرض كل المهارات ↗" : "View all skills ↗"}</span>
              <ArrowRight className={`h-3.5 w-3.5 ${isAr ? "rotate-180" : ""}`} />
            </Link>
          </div>

        </div>

        {/* Secondary Insight Row */}
        <div className="mt-6 grid gap-6 lg:grid-cols-4">
          
          {/* Active Job Postings */}
          <div className="rounded-[28px] border border-slate-200/80 dark:border-white/[0.08] dark:hover:border-cyan-500/30 bg-white dark:bg-[#060D1E] p-7 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90">
            <h3 className="flex items-center gap-2.5 text-[15px] font-bold text-slate-900 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-blue-100 dark:border-cyan-500/30">
                <Briefcase className="h-4 w-4" />
              </span>
              {isAr ? "الوظائف النشطة المتاحة" : "Active Job Postings"}
            </h3>
            <p className="mt-5 text-[2.4rem] font-black leading-none text-slate-900 dark:text-white">
              {realActiveJobs.toLocaleString('en-US')}
            </p>
            <p className="mt-3 text-[12px] text-slate-500 dark:text-slate-400">
              {liveStats?.updatedAt
                ? (isAr ? `آخر تحديث: ${new Date(liveStats.updatedAt).toLocaleDateString('ar-EG')}` : `Updated: ${new Date(liveStats.updatedAt).toLocaleDateString('en-GB')}`)
                : (isAr ? 'من إعلانات WUZZUF المتاحة' : 'From available WUZZUF job posts')}
            </p>
          </div>

          {/* Top Hiring Companies */}
          <div className="rounded-[28px] border border-slate-200/80 dark:border-white/[0.08] dark:hover:border-cyan-500/30 bg-white dark:bg-[#060D1E] p-7 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90 flex flex-col">
            <h3 className="flex items-center gap-2.5 text-[15px] font-bold text-slate-900 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-blue-100 dark:border-cyan-500/30">
                <Building2 className="h-4 w-4" />
              </span>
              {isAr ? "أبرز الشركات الموظفة" : "Top Hiring Companies"}
            </h3>
            <div className="mt-5 flex flex-col gap-2.5 flex-1">
              {(liveStats?.topCompanies || []).map((company: { name: string; jobCount: number }) => (
                <div key={company.name} className="flex items-center justify-between gap-3 text-[13px]">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{company.name}</span>
                  <span className="shrink-0 text-slate-500 dark:text-slate-400">{company.jobCount}</span>
                </div>
              ))}
              {!liveStats?.topCompanies?.length && (
                <p className="text-[13px] text-slate-500 dark:text-slate-400">{isAr ? 'لا توجد بيانات شركات كافية.' : 'No company data available.'}</p>
              )}
            </div>
            <Link
              href="/jobs"
              className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors"
            >
              <span>{isAr ? "عرض كل الوظائف والشركات ↗" : "Explore All Jobs & Companies ↗"}</span>
              <ArrowRight className={`h-3.5 w-3.5 ${isAr ? "rotate-180" : ""}`} />
            </Link>
          </div>

          {/* Data provenance */}
          <div className="rounded-[28px] border border-slate-200/80 dark:border-white/[0.08] dark:hover:border-cyan-500/30 bg-white dark:bg-[#060D1E] p-7 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90 lg:col-span-2">
            <h3 className="flex items-center gap-2.5 text-[15px] font-bold text-slate-900 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/30">
                <Building2 className="h-4 w-4" />
              </span>
              {isAr ? "تغطية البيانات وطريقة الحساب" : "Data Coverage & Method"}
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">{isAr ? 'المهارات وعدد الوظائف يُحسبان مباشرةً من الإعلانات المطابقة، لا من أرقام ثابتة.' : 'Skills and job counts are calculated from the matching posts, not fixed figures.'}</p>
              <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">{isAr ? 'الراتب تقدير منفصل مبني على median وP25/P75 لإعلانات أفصحت عن الراتب فقط.' : 'Salary is a separate median/P25/P75 estimate using only posts that disclose pay.'}</p>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* PREMIUM CTA BANNER CARD (Full Light/Dark Mode Support)                   */}
        {/* ========================================================================= */}
        <div className="relative mt-10 overflow-hidden rounded-[26px] border border-slate-200 dark:border-cyan-500/25 p-7 sm:p-9 shadow-lg shadow-slate-200/50 dark:shadow-[0_20px_50px_rgba(4,8,22,0.6)]">
          {/* Light mode background layer */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[26px] dark:hidden"
            style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0f6ff 50%, #e6efff 100%)' }}
          />
          {/* Dark mode background layer */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[26px] hidden dark:block"
            style={{ background: 'linear-gradient(135deg, #060D1E 0%, #08132B 50%, #040816 100%)' }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* Left Info & Badges */}
            <div className="space-y-3.5 max-w-2xl text-center lg:text-left rtl:lg:text-right">
              {/* AI badge — modern accent chip, NOT an oval pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-blue-600/10 to-transparent ltr:border-l-[3px] rtl:border-r-[3px] border-blue-600 dark:border-cyan-400 text-blue-700 dark:text-cyan-300 text-[11.5px] font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                <span>{isAr ? "تحليلات مدعومة بالذكاء الاصطناعي" : "AI-Powered Career Intelligence"}</span>
              </div>

              <h4 className="text-[22px] sm:text-[26px] font-black leading-tight text-slate-900 dark:text-white">
                {isAr 
                  ? "احصل على تحليلات سوق أعمق وأدق مع عواطلي" 
                  : "Unlock Deeper, Actionable Market Insights with 3WATLY"}
              </h4>

              <p className="text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {isAr
                  ? "اكتشف سلم رواتب الشركات الحقيقية، واتجاهات التوظيف الآنية، وتوصيات سد فجوة المهارات المخصصة لملفك الشخصي بنقرة واحدة."
                  : "Discover verified company salary scales, live hiring velocity, and personalized skill gap roadmaps tailored directly to your profile."}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-[12.5px] text-slate-700 dark:text-slate-300 font-semibold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{isAr ? "بيانات رواتب موثقة" : "Verified Salaries"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{isAr ? "خطة تطوير مهارات فورية" : "Instant Skill Roadmap"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{isAr ? "مجاني 100%" : "100% Free"}</span>
                </div>
              </div>
            </div>

            {/* Right Action Button */}
            <div className="flex-shrink-0">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-[15px] font-extrabold shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
              >
                <span>{isAr ? "ابدأ التحليل مجاناً الآن" : "Start Free Analysis Now"}</span>
                <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isAr ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
