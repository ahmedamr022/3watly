import React from 'react';
import { CheckIcon } from 'lucide-react';

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}

export function Checkbox({ id, checked, onChange, children }: CheckboxProps) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="relative flex h-[18px] w-[18px] shrink-0 items-center justify-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer h-[18px] w-[18px] cursor-pointer appearance-none rounded-[5px] border-[1.6px] border-[#cbd4ec] dark:border-white/20 bg-white dark:bg-[#070B14] transition-colors duration-150 ease-smooth checked:border-brand-blue dark:checked:border-indigo-500 checked:bg-brand-blue dark:checked:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40"
        />
        <CheckIcon
          className="pointer-events-none absolute h-[12px] w-[12px] text-white opacity-0 transition-opacity duration-150 ease-smooth peer-checked:opacity-100"
          strokeWidth={3.2}
          aria-hidden="true"
        />
      </span>
      <label htmlFor={id} className="cursor-pointer text-[13px] font-normal leading-[18px] text-ink-soft dark:text-slate-300">
        {children}
      </label>
    </div>
  );
}