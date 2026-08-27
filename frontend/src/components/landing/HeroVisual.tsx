"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Info, ArrowUpRight } from 'lucide-react';
import { SalaryTrendChart } from './SalaryTrendChart';
import { SkillSignalCard } from './SkillSignalCard';
import { useLanguage } from '@/contexts/LanguageContext';

const RADIUS = 62;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SCORE = 84;

export function HeroVisual() {
  const { isAr } = useLanguage();

  const matchReasons = isAr
    ? ['توافق عالي في المهارات الأساسية', 'طلب مرتفع لدى الشركات المصرية', 'فرص نمو وترقي واعدة']
    : ['Strong skill alignment', 'High company demand', 'Great growth potential'];

  return (
    <div className="relative mx-auto flex w-full max-w-[620px] items-center justify-center [perspective:1400px] lg:h-[580px] lg:max-w-none">
      
      {/* 3D Isometric Canvas */}
      <div 
        className={`relative w-full max-w-[600px] lg:h-[560px] [transform-style:preserve-3d] transition-all duration-700 hover:[transform:rotateY(0deg)_rotateX(0deg)] ${
          isAr 
            ? '[transform:rotateY(6deg)_rotateX(4deg)_rotateZ(1deg)] hover:[transform:rotateY(2deg)_rotateX(1deg)_rotateZ(0deg)]' 
            : '[transform:rotateY(-6deg)_rotateX(4deg)_rotateZ(-1deg)] hover:[transform:rotateY(-2deg)_rotateX(1deg)_rotateZ(0deg)]'
        }`}
      >
        
        {/* 1. PRIMARY JOB MATCH CARD */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="relative z-10 rounded-[32px] border border-slate-200/80 dark:border-indigo-500/30 bg-white/95 dark:bg-gradient-to-b dark:from-[#0F172E]/95 dark:via-[#0A1122]/95 dark:to-[#060B18]/95 backdrop-blur-2xl p-6 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] dark:shadow-[0_0_35px_rgba(99,102,241,0.2),0_25px_60px_-15px_rgba(0,0,0,0.95)] lg:absolute lg:ltr:left-0 lg:rtl:right-0 lg:top-0 lg:w-[325px]"
          style={{ transform: 'translateZ(10px)' }}
        >
          <header className="flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-1.5 text-[1.1rem] font-bold tracking-tight text-slate-900 dark:text-white">
              {isAr ? "مطابقة الوظيفة" : "Job Match"}
              <Info className="h-3.5 w-3.5 text-slate-400 stroke-[2]" />
            </h3>
            <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 text-[11.5px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-500/40 shadow-sm shadow-emerald-500/20">
              {isAr ? "توافق ممتاز" : "Excellent Match"}
            </span>
          </header>

          <div className="mt-5 flex flex-col items-center">
            {/* Radial Gauge */}
            <div className="relative h-[146px] w-[146px]">
              <svg viewBox="0 0 152 152" className="h-full w-full -rotate-[90deg]">
                <circle cx="76" cy="76" r={RADIUS} fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-800/80" strokeWidth="12" />
                <motion.circle
                  cx="76"
                  cy="76"
                  r={RADIUS}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  initial={{ strokeDashoffset: CIRCUMFERENCE }}
                  animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - SCORE / 100) }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  className="filter dark:drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="flex items-baseline text-[2.85rem] font-black leading-none tracking-tight text-emerald-500 dark:text-emerald-400">
                  {SCORE}
                  <span className="text-[1.25rem] font-bold tracking-tight">%</span>
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
                  {isAr ? "مؤشر التوافق" : "Match Score"}
                </p>
              </div>
            </div>

            <p className="mt-4 text-[11px] font-medium text-slate-400">
              {isAr ? "مطابقة مع شركة" : "Matched with"}
            </p>
            
            {/* Vodafone Logo */}
            <div className="mt-1 flex items-center gap-2">
              <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-[#E60000] shadow-sm shadow-red-500/40 flex-shrink-0">
                <svg viewBox="0 0 32 32" className="h-3.5 w-3.5" fill="white">
                  <path d="M16 4C9.37 4 4 9.37 4 16C4 22.63 9.37 28 16 28C17.9 28 19.68 27.56 21.26 26.77L25.5 31.5L23.2 25.2C26.18 22.98 28 19.68 28 16C28 9.37 22.63 4 16 4ZM16 24C11.58 24 8 20.42 8 16C8 11.58 11.58 8 16 8C20.42 8 24 11.58 24 16C24 20.42 20.42 24 16 24Z" />
                </svg>
              </div>
              <span className="text-[1.15rem] font-black tracking-tight text-slate-900 dark:text-white">Vodafone Egypt</span>
            </div>

            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <span className="rounded-xl bg-blue-50/90 dark:bg-blue-950/70 px-3 py-1 text-[11px] font-bold text-blue-900 dark:text-blue-200 border border-blue-100/70 dark:border-blue-500/30">
                {isAr ? "مهندس برمجيات" : "Software Engineer"}
              </span>
              <span className="rounded-xl bg-blue-50/90 dark:bg-blue-950/70 px-3 py-1 text-[11px] font-bold text-blue-900 dark:text-blue-200 border border-blue-100/70 dark:border-blue-500/30">
                {isAr ? "القاهرة، مصر" : "Cairo, Egypt"}
              </span>
            </div>
          </div>

          <div className="mt-5 border-t border-slate-100 dark:border-white/10 pt-4">
            <h4 className="text-[12.5px] font-bold text-slate-900 dark:text-white">
              {isAr ? "أسباب التوافق القوي" : "Why it's a great match"}
            </h4>
            <ul className="mt-2.5 flex flex-col gap-2">
              {matchReasons.map((reason) => (
                <li
                  key={reason}
                  className="flex items-center gap-2 text-[12.5px] font-medium text-slate-600 dark:text-slate-300"
                >
                  <Check
                    className="h-3.5 w-3.5 shrink-0 text-emerald-500 dark:text-emerald-400 stroke-[3]"
                  />
                  {reason}
                </li>
              ))}
            </ul>
            <a
              href="#insights"
              className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <span>{isAr ? "عرض التحليل الكامل" : "View full analysis"}</span>
              <ArrowRight className={`h-3.5 w-3.5 ${isAr ? "rotate-180" : ""}`} />
            </a>
          </div>
        </motion.article>

        {/* 2. SKILL SIGNAL CARDS */}
        <div 
          className="flex flex-col gap-3 sm:grid sm:grid-cols-3 lg:absolute lg:ltr:right-0 lg:rtl:left-0 lg:top-0 lg:z-20 lg:flex lg:w-[245px] lg:flex-col"
          style={{ transform: 'translateZ(30px)' }}
        >
          <SkillSignalCard name="Python" glyph="python" filled={5} delay={0.08} />
          <SkillSignalCard name="SQL" glyph="sql" filled={5} delay={0.12} />
          <SkillSignalCard name="Docker" glyph="docker" filled={4} delay={0.16} />
        </div>

        {/* 3. SALARY TREND CARD */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="rounded-[30px] border border-slate-200/80 dark:border-indigo-500/30 bg-white/95 dark:bg-gradient-to-b dark:from-[#0F172E]/95 dark:via-[#0A1122]/95 dark:to-[#060B18]/95 backdrop-blur-2xl p-5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] dark:shadow-[0_0_35px_rgba(99,102,241,0.2),0_25px_60px_-15px_rgba(0,0,0,0.95)] lg:absolute lg:bottom-0 lg:ltr:right-0 lg:rtl:left-0 lg:z-30 lg:w-[325px]"
          style={{ transform: 'translateZ(55px)' }}
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[1.05rem] font-bold tracking-tight text-slate-900 dark:text-white">
              {isAr ? "مؤشر متوسط الرواتب" : "Average Salary Trend"}
            </h3>
            <span className="text-[11.5px] font-medium text-slate-400">
              {isAr ? "ج.م / شهرياً" : "EGP / month"}
            </span>
          </div>
          <div className="mt-2 flex items-end gap-2">
            <p className="text-[2.15rem] font-black leading-none tracking-tight text-emerald-500 dark:text-emerald-400">
              32,450
            </p>
            <span className="flex items-center gap-0.5 pb-0.5 text-[12.5px] font-bold text-emerald-600 dark:text-emerald-400">
              +18%
              <ArrowUpRight className="h-3.5 w-3.5 stroke-[3]" />
            </span>
          </div>
          <p className="mt-0.5 text-[11px] font-medium text-slate-400">
            {isAr ? "مقارنة بالعام الماضي" : "vs last year"}
          </p>
          <SalaryTrendChart />
        </motion.article>

      </div>

    </div>
  );
}
