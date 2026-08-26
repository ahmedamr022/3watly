"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BriefcaseBusinessIcon, CheckIcon, CodeXmlIcon, TrophyIcon } from 'lucide-react';
import { StepShell } from '@/components/onboarding/StepShell';
import { RequireOnboarding } from '@/components/onboarding/RequireOnboarding';
import { SecureBadge } from '@/components/onboarding/PageHeading';
import { StepFooter } from '@/components/onboarding/StepFooter';
import { DonutScore } from '@/components/onboarding/DonutScore';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { riseIn } from '@/utils/motion';
import { surface } from '@/utils/styles';

export default function ProfileInsightsPage() {
  const router = useRouter();
  const { profile } = useOnboarding();

  if (!profile) {
    return (
      <RequireOnboarding need="parsedCv">
        <div />
      </RequireOnboarding>
    );
  }

  const { scores, topSkills, extraSkillCount, experienceYears, relevance, strengths } = profile;

  const donuts = [
    { title: 'Overall Match', value: scores.overall, label: 'Strong Match', tone: 'blue' as const },
    { title: 'Skills Match', value: scores.skills, label: 'Good Match', tone: 'green' as const },
    {
      title: 'Experience Relevance',
      value: scores.experience,
      label: 'Very Relevant',
      tone: 'violet' as const
    },
    {
      title: 'Education Match',
      value: scores.education,
      label: 'Excellent',
      tone: 'amber' as const
    }
  ];

  return (
    <RequireOnboarding need="parsedCv">
      <StepShell step={3}>
        <div className="flex min-h-[calc(100vh-196px)] flex-col">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-[#E3EAFA] dark:border-white/10 bg-[#F1F5FE] dark:bg-indigo-950/70">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
                  <path
                    d="M4 17l5-5 3.5 3.5L20 8"
                    stroke="#1B57E0"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="4" cy="17" r="2" fill="#1B57E0" />
                  <circle cx="12.5" cy="15.5" r="2" fill="#4F46E5" />
                  <circle cx="20" cy="8" r="2" fill="#12B76A" />
                </svg>
              </span>
              <div>
                <h1 className="text-[27px] font-bold leading-tight tracking-[-0.025em] text-ink dark:text-white">
                  Your Profile Insights
                </h1>
                <p className="mt-1 text-[14px] font-light text-ink-muted dark:text-slate-400">
                  Here’s a quick overview of your profile
                </p>
              </div>
            </div>
            <SecureBadge />
          </div>

          {/* Scores */}
          <div className="mt-6 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {donuts.map((donut, index) => (
              <motion.div key={donut.title} {...riseIn(index, 0.06)} className="h-full">
                <DonutScore {...donut} delay={0.1 + index * 0.08} />
              </motion.div>
            ))}
          </div>

          {/* Detail panels */}
          <div className="mt-5 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
            <motion.section {...riseIn(0, 0.08)} className={`flex flex-col p-6 dark:bg-[#0B1120] dark:border-white/10 ${surface}`}>
              <h2 className="flex items-center gap-2.5 text-[15.5px] font-semibold text-ink dark:text-white">
                <CodeXmlIcon
                  className="h-[19px] w-[19px] text-brand-blue dark:text-indigo-400"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Top Skills
              </h2>
              <ul className="mt-5 flex flex-wrap gap-2.5">
                {topSkills.map((skill, index) => (
                  <li
                    key={skill.name}
                    className={`flex h-9 items-center rounded-lg px-3.5 text-[13px] font-medium ${
                      index < 5
                        ? 'bg-[#EAF8F1] dark:bg-emerald-950/70 text-[#0E8F55] dark:text-emerald-400 border border-transparent dark:border-emerald-500/20'
                        : 'bg-[#EEF3FE] dark:bg-indigo-950/70 text-brand-blue dark:text-indigo-300 border border-transparent dark:border-indigo-500/20'
                    }`}
                  >
                    {skill.name}
                  </li>
                ))}
                <li className="flex h-9 items-center rounded-lg bg-canvas dark:bg-white/5 px-3.5 text-[13px] font-medium text-ink-faint dark:text-slate-400">
                  +{extraSkillCount} more
                </li>
              </ul>
            </motion.section>

            <motion.section {...riseIn(1, 0.08)} className={`flex flex-col p-6 dark:bg-[#0B1120] dark:border-white/10 ${surface}`}>
              <h2 className="flex items-center gap-2.5 text-[15.5px] font-semibold text-ink dark:text-white">
                <BriefcaseBusinessIcon
                  className="h-[19px] w-[19px] text-brand-indigo dark:text-indigo-400"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Experience Overview
              </h2>

              <p className="mt-5 text-[27px] font-bold tracking-[-0.02em] text-[#7C2BC7] dark:text-purple-400">
                {experienceYears} Years
              </p>

              <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full bg-[#E7EAF3] dark:bg-white/10">
                {[
                  { width: relevance.relevant, color: 'bg-[#7C2BC7] dark:bg-purple-500' },
                  { width: relevance.related, color: 'bg-[#C79AE8] dark:bg-purple-400' },
                  { width: relevance.other, color: 'bg-[#CBD1DD] dark:bg-slate-600' }
                ].map((segment, index) => (
                  <motion.span
                    key={index}
                    className={segment.color}
                    initial={{ width: 0 }}
                    animate={{ width: `${segment.width}%` }}
                    transition={{ duration: 0.7, delay: 0.15 + index * 0.08, ease: [0.23, 1, 0.32, 1] }}
                  />
                ))}
              </div>

              <dl className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { label: 'Relevant', value: relevance.relevant, dot: 'bg-[#7C2BC7] dark:bg-purple-400' },
                  { label: 'Related', value: relevance.related, dot: 'bg-[#C79AE8] dark:bg-purple-300' },
                  { label: 'Other', value: relevance.other, dot: 'bg-[#CBD1DD] dark:bg-slate-500' }
                ].map((item) => (
                  <div key={item.label}>
                    <dt className="flex items-center gap-2 text-[13px] font-medium text-ink-soft dark:text-slate-300">
                      <span className={`h-2 w-2 rounded-full ${item.dot}`} aria-hidden="true" />
                      {item.label}
                    </dt>
                    <dd className="mt-1 text-[13.5px] font-semibold text-ink dark:text-white">{item.value}%</dd>
                  </div>
                ))}
              </dl>
            </motion.section>

            <motion.section {...riseIn(2, 0.08)} className={`flex flex-col p-6 dark:bg-[#0B1120] dark:border-white/10 ${surface}`}>
              <h2 className="flex items-center gap-2.5 text-[15.5px] font-semibold text-ink dark:text-white">
                <TrophyIcon
                  className="h-[19px] w-[19px] text-brand-green dark:text-emerald-400"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Strengths
              </h2>
              <ul className="mt-5 space-y-4">
                {strengths.map((strength) => (
                  <li key={strength} className="flex items-center gap-3">
                    <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-brand-green dark:bg-emerald-500">
                      <CheckIcon
                        className="h-[13px] w-[13px] text-white"
                        strokeWidth={3.2}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-[13.5px] font-medium text-ink-soft dark:text-slate-300">{strength}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          </div>

          <div className="mt-auto pt-8">
            <StepFooter
              onBack={() => router.push('/onboarding/cv-upload')}
              onNext={() => router.push('/onboarding/recommendations')}
              nextLabel="Continue to Recommendations"
            />
          </div>
        </div>
      </StepShell>
    </RequireOnboarding>
  );
}
