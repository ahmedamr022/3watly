"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheckIcon } from 'lucide-react';
import { StepShell } from '@/components/onboarding/StepShell';
import { RequireOnboarding } from '@/components/onboarding/RequireOnboarding';
import { StepFooter } from '@/components/onboarding/StepFooter';
import { Sparkle } from '@/components/brand/Sparkle';
import { PriorityStrip } from '@/components/onboarding/recommendations/PriorityStrip';
import { SkillsToImprove } from '@/components/onboarding/recommendations/SkillsToImprove';
import { ActionsList } from '@/components/onboarding/recommendations/ActionsList';
import { TargetRoles } from '@/components/onboarding/recommendations/TargetRoles';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { riseIn } from '@/utils/motion';

export default function RecommendationsPage() {
  const router = useRouter();
  const { profile } = useOnboarding();

  if (!profile) {
    return (
      <RequireOnboarding need="parsedCv">
        <div />
      </RequireOnboarding>
    );
  }

  return (
    <RequireOnboarding need="parsedCv">
      <StepShell step={4}>
        <div className="flex min-h-[calc(100vh-196px)] flex-col">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-[#E3EAFA] dark:border-white/10 bg-[#F1F5FE] dark:bg-indigo-950/70">
                <Sparkle className="h-6 w-6 text-brand-blue dark:text-indigo-400" />
              </span>
              <div>
                <h1 className="text-[27px] font-bold leading-tight tracking-[-0.025em] text-ink dark:text-white">
                  Your Recommendations
                </h1>
                <p className="mt-1 text-[14px] font-light text-ink-muted dark:text-slate-400">
                  Personalized steps to boost your profile and reach your goals
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-[#CFEBDD] dark:border-emerald-500/30 bg-[#EFFAF4] dark:bg-emerald-950/60 px-4 py-3">
              <ShieldCheckIcon
                className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#0E8F55] dark:text-emerald-400"
                strokeWidth={1.9}
                aria-hidden="true"
              />
              <div>
                <p className="text-[13.5px] font-semibold text-[#0E8F55] dark:text-emerald-400">Personalized for you</p>
                <p className="mt-0.5 text-[12.5px] font-light text-ink-muted dark:text-slate-400">
                  Based on your CV and target role
                </p>
              </div>
            </div>
          </div>

          <motion.div {...riseIn(0)} className="mt-6">
            <PriorityStrip items={profile.priorities} />
          </motion.div>

          <div className="mt-5 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
            <motion.div {...riseIn(1, 0.07)} className="h-full">
              <SkillsToImprove skills={profile.skillGaps} />
            </motion.div>
            <motion.div {...riseIn(2, 0.07)} className="h-full">
              <ActionsList actions={profile.actions} />
            </motion.div>
            <motion.div {...riseIn(3, 0.07)} className="h-full">
              <TargetRoles roles={profile.targetRoles} />
            </motion.div>
          </div>

          <div className="mt-auto pt-8">
            <StepFooter
              onBack={() => router.push('/onboarding/profile-insights')}
              onNext={() => router.push('/onboarding/complete')}
              nextLabel="Complete Onboarding"
              variant="finish"
            />
          </div>
        </div>
      </StepShell>
    </RequireOnboarding>
  );
}
