"use client";

import React, { useState, useMemo } from 'react';
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
  Zap
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { CompanyLogo } from '@/components/brand/CompanyLogo';
import { ApplyModal } from '@/components/jobs/ApplyModal';
import { mockJobsList, mockDashboardData, JobItem } from '@/data/jobs';
import { ApiService } from '@/services/api';

export default function JobsPage() {
  const { isAr } = useLanguage();
  const [keyword, setKeyword] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [jobs, setJobs] = useState<JobItem[]>(mockJobsList);
  const [loadingLive, setLoadingLive] = useState(true);

  React.useEffect(() => {
    let mounted = true;
    setLoadingLive(true);
    fetch('/api/jobs')
      .then((res) => res.json())
      .then((data) => {
        if (mounted && data && Array.isArray(data.jobs) && data.jobs.length > 0) {
          setJobs(data.jobs);
        }
      })
      .catch((err) => {
        console.warn('Failed to load live jobs:', err);
      })
      .finally(() => {
        if (mounted) setLoadingLive(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Filter states
  const [matchScoreFilter, setMatchScoreFilter] = useState<number>(60);
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

  const toggleSave = (id: string) => {
    setSavedJobs((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtered and Sorted Jobs
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        // Match score filter
        if (job.matchScore < matchScoreFilter) return false;

        // Seniority filter
        if (seniorityFilter !== 'all') {
          if (seniorityFilter === 'junior' && job.seniority !== 'Junior' && job.seniority !== 'Fresh') return false;
          if (seniorityFilter === 'mid' && job.seniority !== 'Mid') return false;
          if (seniorityFilter === 'senior' && job.seniority !== 'Senior') return false;
        }

        // Work type filter
        if (workTypeFilter !== 'all') {
          if (workTypeFilter === 'hybrid' && job.workType !== 'Hybrid') return false;
          if (workTypeFilter === 'remote' && job.workType !== 'Remote') return false;
          if (workTypeFilter === 'onsite' && job.workType !== 'On-site') return false;
        }

        // Search keyword
        if (keyword.trim()) {
          const q = keyword.toLowerCase();
          const matchesTitle = job.title.toLowerCase().includes(q) || job.titleAr.includes(q);
          const matchesCompany = job.company.toLowerCase().includes(q) || job.companyAr.includes(q);
          const matchesSkills = job.matchedSkills.some(s => s.name.toLowerCase().includes(q));
          if (!matchesTitle && !matchesCompany && !matchesSkills) return false;
        }

        // Location query
        if (locationQuery.trim()) {
          const lq = locationQuery.toLowerCase();
          const matchesLoc = job.location.toLowerCase().includes(lq) || job.locationAr.includes(lq);
          if (!matchesLoc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'match') return b.matchScore - a.matchScore;
        if (sortBy === 'salary') return b.applicantsCount - a.applicantsCount;
        return 0;
      });
  }, [keyword, locationQuery, matchScoreFilter, seniorityFilter, workTypeFilter, sortBy]);

  return (
    <AppShell
      title={isAr ? "الوظائف والفرص المتاحة" : "Jobs"}
      subtitle={isAr ? "استكشف وظائف تكنولوجيا المعلومات والبيانات المطابقة لمهاراتك وخبرتك." : "Discover roles that match your skills and career goals."}
    >
      <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
        
        {/* ========================================================================= */}
        {/* 1. SEARCH & FILTERS HEADER CARD                                           */}
        {/* ========================================================================= */}
        <div className="rounded-[24px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 sm:p-6 shadow-xs space-y-4">
          
          {/* Main Search Inputs Row */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
            
            {/* Keywords Input */}
            <div className="sm:col-span-5 relative">
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
            <div className="sm:col-span-4 relative">
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

            {/* Search Action / Reset Button */}
            <div className="sm:col-span-3 flex items-end">
              <button
                type="button"
                onClick={() => {
                  setKeyword('');
                  setLocationQuery('');
                  setMatchScoreFilter(0);
                  setSeniorityFilter('all');
                  setWorkTypeFilter('all');
                }}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-[#1B57E0] hover:bg-blue-700 text-white text-[13.5px] font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>{isAr ? "تحديث النتائج" : "Update Results"}</span>
              </button>
            </div>

          </div>

          {/* Filter Pills Row (Matching media_1787761309709.png 1:1) */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5 border-t border-slate-100 dark:border-white/5">
            
            {/* 1. Match Score Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMatchMenuOpen(!matchMenuOpen)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-blue-200 dark:border-blue-500/30 bg-blue-50/60 dark:bg-blue-950/40 text-[12.5px] font-bold text-[#1B57E0] dark:text-blue-400 hover:bg-blue-100/60 transition-colors cursor-pointer"
              >
                <span>{isAr ? `نسبة التوافق: +${matchScoreFilter}%` : `Match Score: ${matchScoreFilter}%+`}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#1B57E0] dark:text-blue-400" />
              </button>

              {matchMenuOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-44 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] p-1.5 shadow-xl z-30 space-y-1">
                  {[0, 70, 80, 85].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => {
                        setMatchScoreFilter(score);
                        setMatchMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors ${
                        matchScoreFilter === score ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span>{score === 0 ? (isAr ? "جميع النسب" : "All Scores") : `+${score}%`}</span>
                      {matchScoreFilter === score && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Seniority Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSeniorityMenuOpen(!seniorityMenuOpen)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-blue-200 dark:border-blue-500/30 bg-blue-50/60 dark:bg-blue-950/40 text-[12.5px] font-bold text-[#1B57E0] dark:text-blue-400 hover:bg-blue-100/60 transition-colors cursor-pointer"
              >
                <span>
                  {seniorityFilter === 'all' 
                    ? (isAr ? "المستوى: مبتدئ/خريج" : "Seniority: Junior/Fresh")
                    : (isAr ? `المستوى: ${seniorityFilter}` : `Seniority: ${seniorityFilter}`)}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#1B57E0] dark:text-blue-400" />
              </button>

              {seniorityMenuOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-48 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] p-1.5 shadow-xl z-30 space-y-1">
                  {[
                    { id: 'all', label: isAr ? 'جميع المستويات' : 'All Seniorities' },
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
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors ${
                        seniorityFilter === item.id ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span>{item.label}</span>
                      {seniorityFilter === item.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Work Type Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setWorkTypeMenuOpen(!workTypeMenuOpen)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-blue-200 dark:border-blue-500/30 bg-blue-50/60 dark:bg-blue-950/40 text-[12.5px] font-bold text-[#1B57E0] dark:text-blue-400 hover:bg-blue-100/60 transition-colors cursor-pointer"
              >
                <span>
                  {workTypeFilter === 'all'
                    ? (isAr ? "نوع العمل: مرن / عن بُعد" : "Work Type: Hybrid/Remote")
                    : (isAr ? `نوع العمل: ${workTypeFilter}` : `Work Type: ${workTypeFilter}`)}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#1B57E0] dark:text-blue-400" />
              </button>

              {workTypeMenuOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-44 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] p-1.5 shadow-xl z-30 space-y-1">
                  {[
                    { id: 'all', label: isAr ? 'الكل' : 'All Types' },
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
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors ${
                        workTypeFilter === item.id ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span>{item.label}</span>
                      {workTypeFilter === item.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. More Filters Button */}
            <button
              type="button"
              onClick={() => {
                setMatchScoreFilter(0);
                setSeniorityFilter('all');
                setWorkTypeFilter('all');
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070B14] text-[12.5px] font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors cursor-pointer"
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
              <p className="text-[14px] font-bold text-slate-900 dark:text-white">
                <span className="text-blue-600 dark:text-blue-400">{filteredJobs.length}</span>{" "}
                {isAr ? "وظيفة متوافقة مع ملفك" : "jobs found"}
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

            {/* Job Cards Feed (Matching media_1787761419609.png 1:1) */}
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
                      <CompanyLogo company={job.company} size="lg" className="shrink-0" />

                      <div className="min-w-0">
                        {/* Title with blue verified checkmark */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link 
                            href={`/jobs/${job.id}`}
                            className="text-[17px] font-bold text-[#0B132B] dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-snug"
                          >
                            {isAr 
                              ? `${job.titleAr} في ${job.companyAr}`
                              : `${job.title} at ${job.company}`}
                          </Link>
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1B57E0] text-white text-[9px] font-black shrink-0">
                            ✓
                          </span>
                        </div>

                        {/* Location */}
                        <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                          {isAr ? job.companyAr : job.company} 📍 {isAr ? job.locationAr : job.location} ({isAr ? job.workTypeAr : job.workType})
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
                          onClick={() => setSelectedJobForApply(job)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[12.5px] font-bold shadow-sm transition-all cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 fill-white" />
                          <span>{isAr ? "تقديم سريع" : "Quick Apply"}</span>
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
                    <div className="flex items-center justify-between text-[13px]">
                      <div className="flex items-center gap-2.5">
                        <span className="h-6 w-6 rounded-full bg-slate-100 dark:bg-[#0B1120]/5 flex items-center justify-center text-[11px] font-bold text-slate-500 dark:text-slate-400 shrink-0">
                          {index + 1}
                        </span>
                        <span className="font-bold text-[#0B132B] dark:text-slate-200">
                          {skill.name}
                        </span>
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {skill.share}%
                      </span>
                    </div>
                    
                    {/* Vibrant Green Progress Bar */}
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden ltr:pl-8 rtl:pr-8">
                      <div 
                        className="h-full rounded-full bg-[#10B981]" 
                        style={{ width: `${skill.share}%` }} 
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

      {/* Interactive Apply Modal */}
      <ApplyModal
        job={selectedJobForApply}
        isOpen={!!selectedJobForApply}
        onClose={() => setSelectedJobForApply(null)}
      />
    </AppShell>
  );
}
