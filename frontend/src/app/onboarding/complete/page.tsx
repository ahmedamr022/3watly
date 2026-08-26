"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon, CheckIcon, RotateCcwIcon } from 'lucide-react';
import { AppHeader } from '@/components/onboarding/AppHeader';
import { RequireOnboarding } from '@/components/onboarding/RequireOnboarding';
import { roleOptions } from '@/data/roles';
import { useOnboarding } from '@/contexts/OnboardingContext';

export default function CompletePage() {
  const router = useRouter();
  const { role, profile, experience, locations, reset } = useOnboarding();

  const selected = roleOptions.find((option) => option.id === role);

  return (
    <RequireOnboarding need="parsedCv">
      <div className="flex min-h-screen w-full flex-col bg-[#FCFDFF] dark:bg-[#060913] text-[#1E293B] dark:text-[#F8FAFC]">
        <AppHeader />

        <main className="flex flex-1 items-center justify-center px-6 py-12">
          <section className="w-full max-w-[560px] rounded-[24px] border border-line dark:border-white/10 bg-white dark:bg-[#0B1120] p-10 text-center shadow-card dark:shadow-2xl dark:shadow-black/90">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-green dark:bg-emerald-500">
              <CheckIcon className="h-7 w-7 text-white" strokeWidth={3} aria-hidden="true" />
            </span>

            <h1 className="mt-6 text-[28px] font-bold leading-tight tracking-[-0.025em] text-ink dark:text-white">
              You’re all set, Ahmed
            </h1>
            <p className="mx-auto mt-2.5 max-w-[24rem] text-[14px] font-light leading-[1.6] text-ink-muted dark:text-slate-400">
              Your profile is live. MAJRA will keep matching you against the Egyptian job market and
              refresh your recommendations as the market moves.
            </p>

            <dl className="mt-8 grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
              {[
                { label: 'Target role', value: selected?.title ?? '—' },
                { label: 'Experience', value: experience },
                { label: 'Overall match', value: profile ? `${profile.scores.overall}%` : '—' }
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-line dark:border-white/10 bg-[#FBFCFE] dark:bg-[#070B14] px-4 py-3">
                  <dt className="text-[11.5px] font-medium uppercase tracking-[0.08em] text-ink-faint dark:text-slate-400">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-[14px] font-semibold text-ink dark:text-white">{item.value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-4 text-[12.5px] font-light text-ink-muted dark:text-slate-400">
              Locations: {locations.length > 0 ? locations.join(' • ') : 'Not set'}
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => router.push('/onboarding/recommendations')}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-blue dark:bg-[#4338CA] px-6 text-[15px] font-semibold text-white shadow-[0_14px_28px_-14px_rgba(27,87,224,0.75)] transition-[filter,transform] duration-150 ease-smooth hover:brightness-105 active:translate-y-[1px] sm:w-auto cursor-pointer"
              >
                Back to recommendations
                <ArrowRightIcon className="h-[17px] w-[17px]" strokeWidth={2.1} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => {
                  reset();
                  router.push('/onboarding/career-path');
                }}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-line dark:border-white/10 bg-white dark:bg-[#070B14] px-6 text-[15px] font-medium text-ink-soft dark:text-slate-300 transition-[background-color,border-color] duration-150 ease-smooth hover:border-[#C6D3EE] dark:hover:border-white/20 hover:bg-[#FAFBFF] sm:w-auto cursor-pointer"
              >
                <RotateCcwIcon className="h-[16px] w-[16px]" strokeWidth={2} aria-hidden="true" />
                Start over
              </button>
            </div>
          </section>
        </main>
      </div>
    </RequireOnboarding>
  );
}
