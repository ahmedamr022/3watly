"use client";

import React from 'react';
import { CheckIcon } from 'lucide-react';
import { onboardingSteps } from '../../data/roles';

interface StepperProps {
  current: number;
  onStepSelect?: (path: string) => void;
}

export function Stepper({ current, onStepSelect }: StepperProps) {
  return (
    <nav aria-label="Onboarding progress" className="flex items-center justify-center">
      <ol className="flex flex-wrap items-center justify-center gap-y-2">
        {onboardingSteps.map((step, index) => {
          const isDone = step.id < current;
          const isActive = step.id === current;
          const clickable = isDone && Boolean(onStepSelect);

          const content = (
            <span className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className={`flex h-[24px] w-[24px] items-center justify-center rounded-full text-[12px] font-bold transition-all duration-200 ease-smooth ${
                  isDone
                    ? 'bg-brand-green dark:bg-emerald-500 text-white'
                    : isActive
                    ? 'bg-brand-blue dark:bg-blue-500 text-white ring-4 ring-brand-blue/20 dark:ring-blue-500/30'
                    : 'bg-[#E4E8F2] dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                }`}
              >
                {isDone ? <CheckIcon className="h-[14px] w-[14px]" strokeWidth={3} /> : step.id}
              </span>
              <span
                className={`whitespace-nowrap text-[13.5px] transition-colors duration-150 ease-smooth ${
                  isActive
                    ? 'font-bold text-brand-blue dark:text-blue-400'
                    : isDone
                    ? 'font-semibold text-slate-700 dark:text-slate-200'
                    : 'font-normal text-slate-400 dark:text-slate-500'
                }`}
              >
                {step.label}
              </span>
            </span>
          );

          return (
            <li key={step.id} className="flex items-center" aria-current={isActive ? 'step' : undefined}>
              {clickable ? (
                <button
                  type="button"
                  onClick={() => onStepSelect?.(step.path)}
                  className="rounded-lg px-1.5 py-0.5 transition-opacity duration-150 ease-smooth hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40 cursor-pointer"
                >
                  {content}
                </button>
              ) : (
                <span className="px-1.5 py-0.5">{content}</span>
              )}

              {index < onboardingSteps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`mx-3.5 hidden h-px w-10 sm:block lg:w-14 transition-colors duration-200 ${
                    step.id < current
                      ? 'bg-brand-green/60 dark:bg-emerald-500/50'
                      : 'bg-slate-200 dark:bg-white/10'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}