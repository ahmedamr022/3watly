"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Briefcase, 
  MapPin, 
  TrendingUp, 
  ChevronDown, 
  Wallet, 
  Gauge, 
  Zap, 
  Building2
} from 'lucide-react';
import { DemandGauge } from './DemandGauge';
import { MarketSalaryChart } from './MarketSalaryChart';
import { demandSkills, topIndustries } from '@/data/landing';
import { 
  VodafoneLogo, 
  IbmLogo, 
  MicrosoftLogo 
} from '@/components/brand/CompanyLogos';

const filters = [
  {
    id: 'role',
    label: 'What role are you targeting?',
    icon: <Briefcase className="w-4 h-4 text-[#4338CA] dark:text-indigo-400" />,
    options: ['Data Analyst', 'Software Engineer', 'Marketing Specialist', 'Product Manager']
  },
  {
    id: 'city',
    label: 'Where?',
    icon: <MapPin className="w-4 h-4 text-[#4338CA] dark:text-indigo-400" />,
    options: ['Cairo, Egypt', 'Alexandria, Egypt', 'Giza, Egypt', 'Remote (Egypt)']
  },
  {
    id: 'level',
    label: 'Experience Level',
    icon: <TrendingUp className="w-4 h-4 text-[#4338CA] dark:text-indigo-400" />,
    options: ['Mid Level (2-5 yrs)', 'Junior (0-2 yrs)', 'Senior (5+ yrs)', 'Fresh Graduate']
  }
];

export function MarketInsights() {
  return (
    <section id="insights" className="w-full bg-[#F8FAFC]/50 dark:bg-[#060913] py-16 px-6 sm:px-10 lg:px-16 border-t border-slate-100 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-[#2563EB] dark:text-blue-400 text-[12px] font-bold tracking-wider uppercase border border-blue-100/80 dark:border-blue-500/30">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Real Data. Local Insights.</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0F172A] dark:text-white leading-tight tracking-tight">
            Explore the <span className="text-[#4338CA] dark:text-[#818CF8]">Egyptian Job Market</span>
          </h2>

          <p className="text-[15px] text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Discover salaries, demand, top skills, and hiring trends for any role in any city.
          </p>
        </div>

        {/* Filter Bar Form */}
        <form
          className="mt-10 grid gap-4 rounded-[24px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto] lg:items-end"
          onSubmit={(e) => e.preventDefault()}
        >
          {filters.map((filter) => (
            <div key={filter.id} className="flex flex-col gap-2">
              <label htmlFor={`filter-${filter.id}`} className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                {filter.label}
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                  {filter.icon}
                </span>
                <select
                  id={`filter-${filter.id}`}
                  defaultValue={filter.options[0]}
                  className="h-12 w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070B14] pl-11 pr-10 text-[14px] font-semibold text-slate-800 dark:text-white transition-colors hover:border-indigo-300 dark:hover:border-indigo-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950"
                >
                  {filter.options.map((option) => (
                    <option key={option} className="dark:bg-[#070B14]">{option}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="h-12 px-8 rounded-xl bg-[#4338CA] hover:bg-[#3730A3] text-white text-[14px] font-bold shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Show Insights</span>
          </button>
        </form>

        {/* Primary Insight Row */}
        <div className="mt-6 grid gap-6 lg:grid-cols-4">
          
          {/* Salary Trend (Span 2) */}
          <div className="rounded-[28px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-7 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90 lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2.5 text-[15px] font-bold text-slate-900 dark:text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/30">
                    <Wallet className="h-4 w-4" />
                  </span>
                  Average Monthly Salary
                </h3>
                <span className="rounded-lg bg-slate-100 dark:bg-white/5 px-2.5 py-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  EGP / month
                </span>
              </div>

              <div className="mt-5 flex items-baseline gap-3">
                <p className="text-[2.6rem] font-black leading-none tracking-tight text-emerald-500 dark:text-emerald-400">
                  EGP 24,000
                </p>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 text-[12px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/30">
                  <ArrowUpRight className="h-3.5 w-3.5 stroke-[3]" />
                  18% vs last year
                </span>
              </div>
            </div>

            <MarketSalaryChart />
          </div>

          {/* Market Demand Gauge */}
          <div className="rounded-[28px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-7 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90 flex flex-col justify-between">
            <div>
              <h3 className="flex items-center gap-2.5 text-[15px] font-bold text-slate-900 dark:text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/30">
                  <Gauge className="h-4 w-4" />
                </span>
                Market Demand
              </h3>
              <p className="mt-5 flex items-center gap-2 text-[2.2rem] font-black leading-none text-emerald-500 dark:text-emerald-400">
                High
                <ArrowUpRight className="h-6 w-6 stroke-[3]" />
              </p>
              <p className="mt-2 text-[13px] font-medium text-slate-500 dark:text-slate-400">
                Strong demand for Data Analysts in Cairo right now.
              </p>
            </div>
            <DemandGauge />
          </div>

          {/* Most Requested Skills */}
          <div className="rounded-[28px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-7 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90 flex flex-col">
            <h3 className="flex items-center gap-2.5 text-[15px] font-bold text-slate-900 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/30">
                <Zap className="h-4 w-4" />
              </span>
              Most Requested Skills
            </h3>

            <ol className="mt-5 flex flex-col gap-3.5 flex-1">
              {demandSkills.map((skill, index) => (
                <li key={skill.name} className="flex items-center gap-3">
                  <span className="w-3 shrink-0 text-[12px] font-bold text-slate-400 dark:text-slate-500">
                    {index + 1}
                  </span>
                  <span className="w-[85px] shrink-0 truncate text-[13px] font-bold text-slate-800 dark:text-slate-200">
                    {skill.name}
                  </span>
                  <div className="h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${index < 3 ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-[#4338CA] dark:bg-[#818CF8]'}`}
                      style={{ width: `${skill.share}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-[12px] font-bold text-slate-600 dark:text-slate-400">
                    {skill.volume}
                  </span>
                </li>
              ))}
            </ol>

            <a
              href="#onboarding"
              className="mt-4 inline-flex items-center gap-1.5 self-end text-[13px] font-bold text-[#4F46E5] dark:text-indigo-400 hover:text-[#4338CA] dark:hover:text-indigo-300 transition-colors"
            >
              <span>View all skills</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

        </div>

        {/* Secondary Insight Row */}
        <div className="mt-6 grid gap-6 lg:grid-cols-4">
          
          {/* Active Job Postings */}
          <div className="rounded-[28px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-7 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90">
            <h3 className="flex items-center gap-2.5 text-[15px] font-bold text-slate-900 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/30">
                <Briefcase className="h-4 w-4" />
              </span>
              Active Job Postings
            </h3>
            <p className="mt-5 text-[2.4rem] font-black leading-none text-slate-900 dark:text-white">
              1,247
            </p>
            <p className="mt-3 inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 text-[12px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/30">
              <ArrowUpRight className="h-3.5 w-3.5 stroke-[3]" />
              14% vs last month
            </p>
          </div>

          {/* Top Hiring Companies */}
          <div className="rounded-[28px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-7 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90 flex flex-col">
            <h3 className="flex items-center gap-2.5 text-[15px] font-bold text-slate-900 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/30">
                <Building2 className="h-4 w-4" />
              </span>
              Top Hiring Companies
            </h3>
            <div className="mt-5 flex flex-wrap items-center gap-4 flex-1">
              <VodafoneLogo className="scale-90 origin-left dark:text-slate-200" />
              <IbmLogo className="scale-90 origin-left dark:text-slate-200" />
              <MicrosoftLogo className="scale-90 origin-left dark:text-slate-200" />
            </div>
            <a
              href="#onboarding"
              className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#4F46E5] dark:text-indigo-400 hover:text-[#4338CA] dark:hover:text-indigo-300 transition-colors"
            >
              <span>View all companies</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Top Industries (Span 2) */}
          <div className="rounded-[28px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-7 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90 lg:col-span-2">
            <h3 className="flex items-center gap-2.5 text-[15px] font-bold text-slate-900 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/30">
                <Building2 className="h-4 w-4" />
              </span>
              Top Industries
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {topIndustries.map((industry) => (
                <div key={industry.name} className="flex items-center gap-3">
                  <span className="w-[110px] shrink-0 truncate text-[13px] font-bold text-slate-800 dark:text-slate-200">
                    {industry.name}
                  </span>
                  <div className="h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#4338CA] dark:bg-[#818CF8]"
                      style={{ width: `${industry.share}%` }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right text-[12px] font-bold text-slate-600 dark:text-slate-400">
                    {industry.share}%
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-[22px] border border-slate-200/70 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] px-7 py-5 sm:py-5 lg:flex-row shadow-lg shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90">
          <div className="flex items-center gap-4 text-left">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100/80 dark:border-emerald-500/30 flex-shrink-0">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-[16px] font-bold text-slate-900 dark:text-white leading-snug">Get deeper insights with MAJRA</h4>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">
                Unlock company salary data, hiring trends, and personalized market insights tailored to your profile.
              </p>
            </div>
          </div>

          <div className="flex-shrink-0">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#009668] hover:bg-[#008259] text-white text-[14px] font-bold shadow-md shadow-emerald-600/20 hover:-translate-y-0.5 transition-all"
            >
              <span>Start Free Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
