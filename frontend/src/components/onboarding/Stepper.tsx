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

          const content =
          <span className="flex items-center gap-2.5">
              <span
              aria-hidden="true"
              className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11.5px] font-semibold transition-colors duration-150 ease-smooth ${
              isDone ?
              'bg-brand-green text-white' :
              isActive ?
              'bg-brand-blue text-white ring-4 ring-brand-blue/12' :
              'bg-[#E4E8F2] text-ink-faint'}`
              }>
              
                {isDone ? <CheckIcon className="h-[13px] w-[13px]" strokeWidth={3.2} /> : step.id}
              </span>
              <span
              className={`whitespace-nowrap text-[13.5px] transition-colors duration-150 ease-smooth ${
              isActive ?
              'font-semibold text-brand-blue' :
              isDone ?
              'font-medium text-ink-soft' :
              'font-normal text-ink-faint'}`
              }>
              
                {step.label}
              </span>
            </span>;


          return (
            <li key={step.id} className="flex items-center" aria-current={isActive ? 'step' : undefined}>
              {clickable ?
              <button
                type="button"
                onClick={() => onStepSelect?.(step.path)}
                className="rounded-lg px-1 py-0.5 transition-opacity duration-150 ease-smooth hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40">
                
                  {content}
                </button> :

              <span className="px-1 py-0.5">{content}</span>
              }

              {index < onboardingSteps.length - 1 &&
              <span
                aria-hidden="true"
                className={`mx-3.5 hidden h-px w-10 sm:block lg:w-14 ${
                step.id < current ? 'bg-[#BFD0F2]' : 'bg-line'}`
                } />

              }
            </li>);

        })}
      </ol>
    </nav>);

}