import React from 'react';
import { ArrowRightIcon } from 'lucide-react';

interface SubmitButtonProps {
  label: string;
}

export function SubmitButton({ label }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="group relative flex h-[52px] w-full items-center justify-center rounded-xl bg-[linear-gradient(90deg,#1B57E0_0%,#3A3FDB_55%,#6D2BE6_100%)] text-[15.5px] font-semibold text-white shadow-cta transition-[transform,filter] duration-150 ease-smooth hover:brightness-[1.07] active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-indigo/35">
      
      <span>{label}</span>
      <ArrowRightIcon
        className="absolute right-5 h-[18px] w-[18px] transition-transform duration-200 ease-smooth group-hover:translate-x-1"
        strokeWidth={2.2}
        aria-hidden="true" />
      
    </button>);

}