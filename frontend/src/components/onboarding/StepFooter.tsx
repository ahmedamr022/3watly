import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon, CircleCheckIcon, SparklesIcon } from 'lucide-react';

interface StepFooterProps {
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
  nextDisabled?: boolean;
  variant?: 'next' | 'finish';
  hint?: string;
}

export function StepFooter({
  onBack,
  onNext,
  nextLabel,
  nextDisabled = false,
  variant = 'next',
  hint
}: StepFooterProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <button
        type="button"
        onClick={onBack}
        className="flex h-11 items-center gap-2 rounded-xl border border-line bg-white px-5 text-[14px] font-medium text-ink-soft shadow-field transition-[background-color,border-color] duration-150 ease-smooth hover:border-[#cdd6ef] hover:bg-[#FAFBFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40">
        
        <ArrowLeftIcon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        Back
      </button>

      <div className="flex items-center gap-4">
        {hint && <span className="text-[12.5px] font-light text-ink-faint">{hint}</span>}
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className={`flex h-12 items-center gap-2.5 rounded-xl px-6 text-[15px] font-semibold text-white transition-[transform,filter,background-color] duration-150 ease-smooth focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-blue/30 ${
          nextDisabled ?
          'cursor-not-allowed bg-[#C3CEE6]' :
          'bg-brand-blue shadow-[0_14px_28px_-14px_rgba(27,87,224,0.75)] hover:brightness-105 active:translate-y-[1px]'}`
          }>
          
          {variant === 'finish' &&
          <CircleCheckIcon className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />
          }
          {nextLabel}
          {variant === 'finish' ?
          <SparklesIcon className="h-[17px] w-[17px]" strokeWidth={2} aria-hidden="true" /> :

          <ArrowRightIcon className="h-[17px] w-[17px]" strokeWidth={2.1} aria-hidden="true" />
          }
        </button>
      </div>
    </div>);

}