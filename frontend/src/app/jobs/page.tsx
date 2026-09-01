"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
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
  Users,
  MoreVertical,
  Zap,
  Loader2
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { CompanyLogo } from '@/components/brand/CompanyLogo';
import { ActiveCVBadge } from '@/components/cv/CVVersionManager';
import { mockDashboardData, mockJobsList, JobItem } from '@/data/jobs';

export default function JobsPage() {
  const { isAr } = useLanguage();
  const { parsedCv, profile } = useOnboarding();
  const [keyword, setKeyword] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  // User skills & target role for personalized feed matching
  const userSkills = useMemo(() => {
    const raw = parsedCv?.skills || [];
    return raw.length > 0 ? raw : ['sql', 'python', 'power bi', 'excel', 'data modeling', 'tableau'];
  }, [parsedCv]);

  const targetRole = useMemo(() => {
    return parsedCv?.targetRole || profile?.targetRoles?.[0]?.title || 'Data Analyst';
  }, [parsedCv, profile]);

  // — Live jobs from Supabase only —
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loadingLive, setLoadingLive] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Filter states (default 0 = show all jobs sorted by best match to user profile)
  const [matchScoreFilter, setMatchScoreFilter] = useState<number>(0);
  const [seniorityFilter, setSeniorityFilter] = useState<string>('all');
  const [workTypeFilter, setWorkTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'match' | 'recent' | 'salary'>('match');

  // Dropdown open states
  const [matchMenuOpen, setMatchMenuOpen] = useState(false);
  const [seniorityMenuOpen, setSeniorityMenuOpen] = useState(false);
  const [workTypeMenuOpen, setWorkTypeMenuOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  // Apply Modal state
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobItem | null>(null);

  const { inDemandSkills, marketOverview } = mockDashboardData;

  // Apply all filters client-side (works on both live DB jobs and mockJobsList fallback)
  const applyAllFilters = useCallback((rawJobs: JobItem[]) => {
    let result = rawJobs;
    // Keyword: title, company, skills
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      result = result.filter(j =>
        (j.title?.toLowerCase().includes(kw)) ||
        (j.titleAr?.toLowerCase().includes(kw)) ||
        (j.company?.toLowerCase().includes(kw)) ||
        (j.companyAr?.toLowerCase().includes(kw)) ||
        j.matchedSkills?.some(s => s.name.toLowerCase().includes(kw))
      );
    }
    // Location: match Arabic or English location field
    if (locationQuery.trim()) {
      const loc = locationQuery.trim().toLowerCase();
      result = result.filter(j =>
        (j.location?.toLowerCase().includes(loc)) ||
        (j.locationAr?.toLowerCase().includes(loc))
      );
    }
    // Seniority
    if (seniorityFilter !== 'all') {
      result = result.filter(j => j.seniority?.toLowerCase() === seniorityFilter.toLowerCase());
    }
    // Work type
    if (workTypeFilter !== 'all') {
      result = result.filter(j => j.workType?.toLowerCase() === workTypeFilter.toLowerCase() ||
        (workTypeFilter === 'onsite' && j.workType === 'On-site'));
    }
    // Match score
    if (matchScoreFilter > 0) {
      result = result.filter(j => j.matchScore >= matchScoreFilter);
    }
    // Sort
    if (sortBy === 'match') {
      result = [...result].sort((a, b) => b.matchScore - a.matchScore);
    } else if (sortBy === 'recent') {
      result = [...result]; // already ordered by posted_at from API
    }
    return result;
  }, [keyword, locationQuery, seniorityFilter, workTypeFilter, matchScoreFilter, sortBy]);

  // Fetch live jobs from Supabase API
  const fetchJobs = useCallback(() => {
    setLoadingLive(true);
    const params = new URLSearchParams();
    params.set('sortBy', sortBy);
    params.set('limit', '200');
    if (userSkills.length > 0) params.set('skills', userSkills.join(','));
    if (targetRole) params.set('targetRole', targetRole);

    fetch(`/api/jobs?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        const source: JobItem[] = (data && Array.isArray(data.jobs) && data.jobs.length > 0)
          ? data.jobs
          : mockJobsList;
        const filtered = applyAllFilters(source);
        setJobs(filtered);
        setTotalJobs(filtered.length);
      })
      .catch(() => {
        const filtered = applyAllFilters(mockJobsList);
        setJobs(filtered);
        setTotalJobs(filtered.length);
      })
      .finally(() => {
        setLoadingLive(false);
      });
  }, [applyAllFilters, sortBy, userSkills, targetRole]);

  // Re-fetch when filters change (debounced for text inputs)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchJobs, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [fetchJobs]);

  const toggleSave = (id: string) => {
    setSavedJobs((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Jobs are already filtered/sorted by the API, just expose them
  const filteredJobs = jobs;

  return (
    <AppShell
      title={isAr ? "الوظائف والفرص المتاحة" : "Jobs"}
      subtitle={isAr ? "استكشف وظائف تكنولوجيا المعلومات والبيانات المطابقة لمهاراتك وخبرتك." : "Discover roles that match your skills and career goals."}
    >
      <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
        
        {/* Active CV Badge for Jobs Match */}
        <div className="flex items-center justify-between">
          <ActiveCVBadge pageName={isAr ? "مطابقة الوظائف" : "Job Match"} />
        </div>

        {/* ========================================================================= */}
        {/* 1. SEARCH & FILTERS HEADER CARD                                           */}
        {/* ========================================================================= */}
        <div className="rounded-[24px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 sm:p-6 shadow-xs space-y-4">
          
          {/* Main Search Inputs Row */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            
            {/* Keywords Input */}
            <div className="relative">
              <label className="block text-[11.5px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                {isAr ? "المسمى أو المهارات" : "Keywords"}
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder={isAr ? "مثال: Data Analyst, Python, SQL..." : "e.g. Data Analyst, Python, SQL..."}
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
            <div className="relative">
              <label className="block text-[11.5px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                {isAr ? "المحافظة أو النطاق" : "Location"}
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder={isAr ? "القرية الذكية، القاهرة، الجيزة..." : "Smart Village, Cairo, Giza..."}
                  className="w-full h-11 ltr:pl-10 ltr:pr-8 rtl:pr-10 rtl:pl-8 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#070B14] text-[13.5px] font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                {locationQuery && (
                  <button
                    type="button"
                    onClick={() => setLocationQuery('')}
                    className="absolute ltr:right-2.5 rtl:left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>


          </div>

          {/* Filter Pills Row (Matching media_1787761309709.png 1:1) */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5 border-t border-slate-100 dark:border-white/5">
            
            {/* 1. Match Score Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setMatchMenuOpen(!matchMenuOpen);
                  setSeniorityMenuOpen(false);
                  setWorkTypeMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-[12.5px] font-bold transition-all cursor-pointer shadow-2xs ${
                  matchScoreFilter > 0
                    ? 'border-blue-300 dark:border-blue-500/50 bg-blue-50/80 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
              >
                <span>
                  {matchScoreFilter === 0 
                    ? (isAr ? "نسبة التوافق: جميع النسب" : "Match: All")
                    : (isAr ? `نسبة التوافق: +${matchScoreFilter}%` : `Match: ${matchScoreFilter}%+`)}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {matchMenuOpen && (
                <div className="absolute top-full ltr:left-0 rtl:right-0 mt-1.5 w-48 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1726] p-1.5 shadow-2xl z-40 space-y-1 backdrop-blur-md">
                  {[
                    { score: 0, labelAr: 'جميع النسب (الكل)', labelEn: 'All Scores' },
                    { score: 60, labelAr: '+60% فما فوق', labelEn: '+60% and above' },
                    { score: 75, labelAr: '+75% توافق جيد', labelEn: '+75% Good Match' },
                    { score: 85, labelAr: '+85% توافق ممتاز', labelEn: '+85% High Match' }
                  ].map((item) => (
                    <button
                      key={item.score}
                      type="button"
                      onClick={() => {
                        setMatchScoreFilter(item.score);
                        setMatchMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-bold transition-colors cursor-pointer ${
                        matchScoreFilter === item.score 
                          ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span>{isAr ? item.labelAr : item.labelEn}</span>
                      {matchScoreFilter === item.score && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Seniority Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setSeniorityMenuOpen(!seniorityMenuOpen);
                  setMatchMenuOpen(false);
                  setWorkTypeMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-[12.5px] font-bold transition-all cursor-pointer shadow-2xs ${
                  seniorityFilter !== 'all'
                    ? 'border-blue-300 dark:border-blue-500/50 bg-blue-50/80 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
              >
                <span>
                  {seniorityFilter === 'all' 
                    ? (isAr ? "المستوى: جميع المستويات" : "Seniority: All Levels")
                    : seniorityFilter === 'junior'
                    ? (isAr ? "المستوى: مبتدئ / خريج جديد" : "Seniority: Junior / Fresh")
                    : seniorityFilter === 'mid'
                    ? (isAr ? "المستوى: متوسط الخبرة (Mid)" : "Seniority: Mid-Level")
                    : (isAr ? "المستوى: خبير أول (Senior)" : "Seniority: Senior Level")}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {seniorityMenuOpen && (
                <div className="absolute top-full ltr:left-0 rtl:right-0 mt-1.5 w-52 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1726] p-1.5 shadow-2xl z-40 space-y-1 backdrop-blur-md">
                  {[
                    { id: 'all', label: isAr ? 'جميع المستويات (الكل)' : 'All Seniorities' },
                    { id: 'junior', label: isAr ? 'مبتدئ / خريج جديد' : 'Junior / Fresh' },
                    { id: 'mid', label: isAr ? 'متوسط الخبرة (Mid)' : 'Mid-Level' },
                    { id: 'senior', label: isAr ? 'خبير أول (Senior)' : 'Senior Level' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSeniorityFilter(item.id);
                        setSeniorityMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-bold transition-colors cursor-pointer ${
                        seniorityFilter === item.id 
                          ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      {seniorityFilter === item.id && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Work Type Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setWorkTypeMenuOpen(!workTypeMenuOpen);
                  setMatchMenuOpen(false);
                  setSeniorityMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-[12.5px] font-bold transition-all cursor-pointer shadow-2xs ${
                  workTypeFilter !== 'all'
                    ? 'border-blue-300 dark:border-blue-500/50 bg-blue-50/80 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
              >
                <span>
                  {workTypeFilter === 'all'
                    ? (isAr ? "نوع العمل: كل الأنواع" : "Work Type: All")
                    : workTypeFilter === 'hybrid'
                    ? (isAr ? "نوع العمل: هجين (Hybrid)" : "Work Type: Hybrid")
                    : workTypeFilter === 'remote'
                    ? (isAr ? "نوع العمل: عن بُعد (Remote)" : "Work Type: Remote")
                    : (isAr ? "نوع العمل: من المقر (On-site)" : "Work Type: On-site")}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {workTypeMenuOpen && (
                <div className="absolute top-full ltr:left-0 rtl:right-0 mt-1.5 w-48 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1726] p-1.5 shadow-2xl z-40 space-y-1 backdrop-blur-md">
                  {[
                    { id: 'all', label: isAr ? 'كل الأنواع (الكل)' : 'All Types' },
                    { id: 'hybrid', label: isAr ? 'هجين (Hybrid)' : 'Hybrid' },
                    { id: 'remote', label: isAr ? 'عن بُعد (Remote)' : 'Remote' },
                    { id: 'onsite', label: isAr ? 'من المقر (On-site)' : 'On-site' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setWorkTypeFilter(item.id);
                        setWorkTypeMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-bold transition-colors cursor-pointer ${
                        workTypeFilter === item.id 
                          ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      {workTypeFilter === item.id && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Reset Filters Button */}
            <button
              type="button"
              onClick={() => {
                setKeyword('');
                setLocationQuery('');
                setMatchScoreFilter(0);
                setSeniorityFilter('all');
                setWorkTypeFilter('all');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] text-[12.5px] font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer shadow-2xs"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{isAr ? "إعادة ضبط الفلاتر" : "Reset Filters"}</span>
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
              <p className="text-[14px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {loadingLive ? (
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-[13px]">{isAr ? "جاري تحميل الوظائف..." : "Loading live jobs..."}</span>
                  </span>
                ) : (
                  <>
                    <span className="text-blue-600 dark:text-blue-400">{filteredJobs.length}</span>{" "}
                    {isAr ? "وظيفة متوافقة مع ملفك" : "jobs found"}
                  </>
                )}
              </p>
              
              {/* Sort By Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSortMenuOpen(!sortMenuOpen)}
                  className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                >
                  <span>
                    {sortBy === 'match' 
                      ? (isAr ? "الترتيب حسب: الأفضل تطابقاً" : "Sort by: Best Match")
                      : sortBy === 'salary'
                      ? (isAr ? "الترتيب حسب: الأكثر طلباً" : "Sort by: Most Popular")
                      : (isAr ? "الترتيب حسب: الأحدث" : "Sort by: Most Recent")}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {sortMenuOpen && (
                  <div className="absolute top-full ltr:right-0 rtl:left-0 mt-1.5 w-48 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] p-1.5 shadow-xl z-30 space-y-1">
                    {[
                      { id: 'match', label: isAr ? 'الأفضل تطابقاً' : 'Best Match' },
                      { id: 'salary', label: isAr ? 'الأكثر طلباً' : 'Most Popular' },
                      { id: 'recent', label: isAr ? 'الأحدث' : 'Most Recent' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSortBy(item.id as any);
                          setSortMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors ${
                          sortBy === item.id ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span>{item.label}</span>
                        {sortBy === item.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Loading Skeleton */}
            {loadingLive && jobs.length === 0 && (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-[22px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 sm:p-6 shadow-xs space-y-4 animate-pulse">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                      <div className="flex-1 space-y-2.5">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4" />
                        <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-lg w-1/2" />
                        <div className="flex gap-2 mt-2">
                          <div className="h-6 w-16 bg-slate-100 dark:bg-slate-700 rounded-full" />
                          <div className="h-6 w-20 bg-slate-100 dark:bg-slate-700 rounded-full" />
                          <div className="h-6 w-14 bg-slate-100 dark:bg-slate-700 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loadingLive && filteredJobs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-[15px] font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? "لا توجد وظائف مطابقة" : "No matching jobs found"}
                </p>
                <p className="text-[13px] text-slate-400 max-w-[280px]">
                  {isAr ? "جرب تغيير الفلاتر أو البحث بكلمات مختلفة" : "Try adjusting your filters or search with different keywords"}
                </p>
                <button
                  type="button"
                  onClick={() => { setKeyword(''); setLocationQuery(''); setMatchScoreFilter(0); setSeniorityFilter('all'); setWorkTypeFilter('all'); }}
                  className="mt-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold transition-colors cursor-pointer"
                >
                  {isAr ? "إعادة ضبط الفلاتر" : "Reset Filters"}
                </button>
              </div>
            )}

            {/* Job Cards Feed */}
            {filteredJobs.map((job) => {
              const isSaved = savedJobs.includes(job.id);
              return (
                <div
                  key={job.id}
                  className="rounded-[22px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-white/20 transition-all space-y-4"
                >
                  {/* Top Row: Company Logo + Title + Match Ring + Menu */}
                  <div className="flex items-start justify-between gap-4">
                    
                    <div className="flex items-start gap-4 min-w-0">
                      {/* Official Company Logo */}
                      <CompanyLogo
                        company={job.company}
                        logoUrl={job.companyLogo || (job as any).company_logo}
                        size="lg"
                        className="shrink-0"
                      />

                      <div className="min-w-0">
                        {/* Title with blue verified checkmark */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link 
                            href={`/jobs/${job.id}`}
                            className="text-[17px] font-bold text-[#0B132B] dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-snug"
                          >
                            {isAr ? job.titleAr : job.title}
                          </Link>
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1B57E0] text-white text-[9px] font-black shrink-0">
                            ✓
                          </span>
                        </div>

                        {/* Company & Location */}
                        <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                          <span className="font-bold text-slate-700 dark:text-slate-200">{isAr ? job.companyAr : job.company}</span>
                          {" • 📍 "}
                          <span>{isAr ? job.locationAr : job.location}</span>
                          {` (${isAr ? job.workTypeAr : job.workType})`}
                        </p>

                        {/* Salary and employment type pill */}
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                            {isAr ? job.salaryRangeAr : `${job.salaryRange} / month`}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#E8F8F0] dark:bg-emerald-950/60 text-[11.5px] font-bold text-[#12B76A]">
                            {isAr ? job.employmentTypeAr : job.employmentType}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Match Donut Ring + Posted Time + Menu */}
                    <div className="flex items-start gap-3 shrink-0">
                      <div className="flex flex-col items-center">
                        <div className="relative h-12 w-12">
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
                            <span className="text-[12px] font-black text-[#0B132B] dark:text-white leading-none">
                              {job.matchScore}%
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium text-slate-400 mt-0.5">
                          {isAr ? "توافق" : "Match"}
                        </span>
                        <span className="text-[10.5px] text-slate-400 mt-1">
                          {isAr ? job.postedAgoAr : job.postedAgo}
                        </span>
                      </div>

                      <button type="button" className="text-slate-400 hover:text-slate-600 p-1">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                  {/* Skills Match Section (Matching media_1787761419609.png) */}
                  <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-2">
                    <span className="block text-[11.5px] font-bold text-slate-400 uppercase tracking-wider">
                      {isAr ? "المهارات المطابقة" : "Top Skills Match"}
                    </span>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {job.matchedSkills.map((skill) => (
                          <span 
                            key={skill.name}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#E8F8F0] dark:bg-emerald-950/50 text-[12px] font-bold text-[#12B76A] border border-emerald-200/60 dark:border-emerald-500/20"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            {skill.name}
                          </span>
                        ))}
                        {job.missingSkills.map((skill) => (
                          <span 
                            key={skill.name}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFF7ED] dark:bg-amber-950/50 text-[12px] font-bold text-[#F97316] border border-orange-200/60 dark:border-orange-500/20"
                          >
                            <X className="w-3.5 h-3.5 stroke-[3]" />
                            {skill.name}
                          </span>
                        ))}
                        <span className="text-[12px] font-medium text-slate-400">
                          {isAr ? "1 مهارة ناقصة" : "1 missing skill"}
                        </span>
                      </div>

                      {/* Action Buttons (View Details & Fit + Bookmark) */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const url = job.applyUrl || (job as any).apply_url;
                            if (url) {
                              window.open(url, '_blank', 'noopener,noreferrer');
                            } else {
                              window.location.href = `/jobs/${job.id}`;
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[12.5px] font-bold shadow-sm transition-all cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 fill-white" />
                          <span>{isAr ? "تقديم سريع ↗" : "Quick Apply ↗"}</span>
                        </button>

                        <Link
                          href={`/jobs/${job.id}`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B57E0] hover:bg-blue-700 text-white text-[13px] font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
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
                  </div>

                </div>
              );
            })}

          </div>

          {/* Right Sidebar Widgets Column (Span 4) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Widget 1: Quick Market Tip (Matching media_1787761289307.png with Gradient Area Fill) */}
            <div className="rounded-[22px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-xs space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="text-[16px]">✨</span>
                <h3 className="text-[14.5px] font-bold text-[#0B132B] dark:text-white">
                  {isAr ? "نصيحة السوق الذكية" : "Quick Market Tip"}
                </h3>
              </div>

              {/* Inside Vibrant Blue Card */}
              <div className="rounded-2xl bg-[#1B57E0] text-white p-5 shadow-md shadow-blue-600/25 relative overflow-hidden space-y-1">
                <span className="text-[13px] font-medium text-blue-100 block">
                  {isAr ? "ارتفاع الطلب على مهارة Tableau" : "Tableau demand increased"}
                </span>
                
                <p className="text-[36px] font-black leading-none text-white pt-1">
                  +12%
                </p>

                <span className="text-[13px] font-medium text-blue-100 block pt-1">
                  {isAr ? "في الشركات متعددة الجنسيات" : "in Egyptian MNCs"}
                </span>

                <span className="text-[11.5px] text-blue-200/80 block">
                  {isAr ? "مقارنة بالشهر الماضي" : "vs last month"}
                </span>

                {/* Glowing Ascending Smooth Wave with Gradient Fill & Solid White Dot */}
                <div className="h-16 w-full pt-2">
                  <svg viewBox="0 0 200 60" className="h-full w-full overflow-visible">
                    <defs>
                      <linearGradient id="tipAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Area under curve */}
                    <path
                      d="M 5 50 C 40 45, 70 36, 100 28 C 130 20, 160 22, 192 10 L 192 60 L 5 60 Z"
                      fill="url(#tipAreaGrad)"
                    />

                    {/* Smooth Stroke Line */}
                    <path
                      d="M 5 50 C 40 45, 70 36, 100 28 C 130 20, 160 22, 192 10"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    
                    {/* Solid White Peak Dot */}
                    <circle cx="192" cy="10" r="5" fill="#FFFFFF" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Widget 2: In-Demand Skills (Matching media_1787760914225.png 1:1) */}
            <div className="rounded-[22px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[14.5px] font-bold text-[#0B132B] dark:text-white">
                  {isAr ? "المهارات الأكثر طلباً" : "In-Demand Skills"}
                </h3>
                <Link href="/skills" className="text-[12.5px] font-bold text-[#1B57E0] dark:text-blue-400 hover:underline">
                  {isAr ? "عرض الكل" : "View all"}
                </Link>
              </div>

              <div className="space-y-3.5 pt-1">
                {inDemandSkills.map((skill, index) => (
                  <div key={skill.name} className="space-y-1.5">
                    <div className="flex items-center gap-2.5 text-[13px]">
                      <span className="h-5 w-5 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-[10.5px] font-black text-blue-600 dark:text-blue-400 shrink-0">
                        {index + 1}
                      </span>
                      <span className="font-bold text-[#0B132B] dark:text-slate-200 flex-1">{skill.name}</span>
                      <span className="font-black text-slate-700 dark:text-slate-300 text-[12px]">{skill.share}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${skill.share}%`,
                          background: `linear-gradient(90deg, #1B57E0 0%, #10B981 100%)`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 3: Job Market Overview */}
            <div className="rounded-[22px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-xs space-y-4">
              <div>
                <h3 className="text-[14.5px] font-bold text-[#0B132B] dark:text-white">
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
