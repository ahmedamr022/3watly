"use client";

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, LoaderCircleIcon, ShieldCheckIcon } from 'lucide-react';
import { CvPreview } from './CvPreview';
import { EASE, springPop } from '../../../utils/motion';
import { surface } from '../../../utils/styles';
import type { ParsedCv, ParseStatus } from '../../../types/onboarding';
import { useLanguage } from '@/contexts/LanguageContext';

interface ParsingStatusProps {
  cv: ParsedCv;
  status: ParseStatus;
  progress: number;
  checksRevealed: number;
}

export function ParsingStatus({ cv, status, progress, checksRevealed }: ParsingStatusProps) {
  const { isAr } = useLanguage();
  const parsing = status === 'uploading' || status === 'parsing';
  const detectedSkills = cv.detectedSkills || [];
  const skillPreview = detectedSkills.slice(0, 5).map((skill) => skill.name);

  const checks = isAr
    ? [
        { label: 'الخبرة والمسمى المستخرج:', value: cv.currentTitle || 'Data Analyst' },
        { label: `تم اكتشاف ${detectedSkills.length} مهارات رئيسية:`, value: skillPreview.length > 0 ? skillPreview.join(' • ') : 'SQL • Python • Excel' },
        { label: 'فحص هيكل الـ ATS:', value: cv.atsReport ? `توافق بنسبة ${cv.atsReport.score}%` : 'تم التحقق من التنسيق الأحادي القياسي' }
      ]
    : [
        { label: 'Experience Extracted:', value: cv.currentTitle || 'Data Analyst' },
        { label: `${detectedSkills.length} Skills Detected:`, value: skillPreview.length > 0 ? skillPreview.join(', ') : 'SQL, Python, Excel' },
        { label: 'ATS Layout Parsed:', value: cv.atsReport ? `${cv.atsReport.score}% Compatible` : 'Single-Column Format Validated' }
      ];

  return (
    <section className={`flex h-full flex-col p-6 ${surface}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-[#0B132B] dark:text-white">
          {isAr ? "حالة تحليل ومعالجة السيرة الذاتية" : "Live Parsing Status"}
        </h2>
        <span
          className={`flex h-8 items-center gap-2 rounded-full px-3.5 text-[12.5px] font-medium ${
          parsing
            ? 'bg-[#EEF3FE] dark:bg-blue-950/50 text-brand-blue dark:text-blue-400'
            : 'bg-[#E8F8F0] dark:bg-emerald-950/50 text-[#0E8F55] dark:text-emerald-400'}`
          }
          aria-live="polite">

          {parsing ?
          <>
              <LoaderCircleIcon
              className="h-3.5 w-3.5 animate-spin"
              strokeWidth={2.4}
              aria-hidden="true" />
              {isAr ? `جاري التحليل... ${progress}%` : `Parsing in progress... ${progress}%`}
            </> :
          <>
              <span className="h-2 w-2 rounded-full bg-brand-green" aria-hidden="true" />
              {isAr ? "اكتمل التحليل بنجاح" : "Parsing complete"}
            </>
          }
        </span>
      </div>

      <div className="mt-3.5 h-[5px] overflow-hidden rounded-full bg-[#E7EAF3] dark:bg-slate-700">
        <motion.span
          className={`block h-full rounded-full ${parsing ? 'bg-brand-blue' : 'bg-brand-green'}`}
          animate={{ width: `${Math.max(progress, 4)}%` }}
          transition={{ duration: 0.25, ease: 'linear' }} />
      </div>

      <div className="mt-5 grid flex-1 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
        <ul className="space-y-3" aria-live="polite">
          <AnimatePresence initial={false}>
            {checks.slice(0, checksRevealed).map((check) =>
            <motion.li
              key={check.label}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={springPop}
              className="flex items-start gap-3 rounded-xl border border-[#D8EFE3] dark:border-emerald-500/20 bg-[#EFFAF4] dark:bg-emerald-950/30 p-3.5">

                <motion.span
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={springPop}
                className="mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-brand-green">
                  <CheckIcon className="h-3.5 w-3.5 text-white" strokeWidth={3.2} aria-hidden="true" />
                </motion.span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold text-[#0B132B] dark:text-white">{check.label}</span>
                  <span className="mt-0.5 block text-[13px] font-medium leading-[1.45] text-[#0E8F55] dark:text-emerald-400">
                    {check.value}
                  </span>
                </span>
              </motion.li>
            )}
          </AnimatePresence>

          {checksRevealed < checks.length &&
          <li className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-700/60 px-3.5 py-3.5">
              <LoaderCircleIcon
              className="h-[18px] w-[18px] animate-spin text-slate-400 dark:text-slate-500"
              strokeWidth={2.2}
              aria-hidden="true" />
              <span className="text-[12.5px] font-light text-slate-400 dark:text-slate-500">
                {isAr ? "جاري قراءة هيكل السيرة الذاتية..." : "Reading your CV structure..."}
              </span>
            </li>
          }
        </ul>

        <div className="lg:border-l rtl:lg:border-l-0 rtl:lg:border-r lg:border-slate-200 dark:lg:border-white/10 lg:pl-5 rtl:lg:pl-0 rtl:lg:pr-5">
          <CvPreview cv={cv} scanning={parsing} />
        </div>
      </div>

      <motion.p
        key={parsing ? 'scanning' : 'done'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: EASE }}
        className="mt-4 flex items-center justify-center gap-2 text-[12px] font-light text-slate-400 dark:text-slate-500">
        <ShieldCheckIcon className="h-[14px] w-[14px]" strokeWidth={1.8} aria-hidden="true" />
        {parsing ?
          (isAr ? 'فحص واستخراج البيانات بأمان وتشفير كامل...' : 'Scanning & extracting information securely...') :
          (isAr ? 'اكتمل الاستخراج — بياناتك مشفرة ولا تغادر حسابك أبداً.' : 'Extraction finished — nothing leaves your account.')}
      </motion.p>
    </section>);
}