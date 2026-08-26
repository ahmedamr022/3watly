import React from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { surface } from '../../../utils/styles';

interface PanelCardProps {
  icon: React.ReactNode;
  title: string;
  footerLabel: string;
  children: React.ReactNode;
}

export function PanelCard({ icon, title, footerLabel, children }: PanelCardProps) {
  return (
    <section className={`flex h-full flex-col p-5 ${surface}`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 text-[15.5px] font-semibold text-ink">
          {icon}
          {title}
        </h2>
        <button
          type="button"
          className="rounded-md px-1 text-[13px] font-medium text-brand-blue transition-colors duration-150 ease-smooth hover:text-brand-blueDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40">
          
          View all
        </button>
      </div>

      <div className="mt-5 flex-1">{children}</div>

      <button
        type="button"
        className="mt-5 flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-line bg-white text-[13.5px] font-semibold text-brand-blue transition-[background-color,border-color,transform] duration-150 ease-smooth active:scale-[0.99] hover:border-[#BFD0F2] hover:bg-[#F7FAFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40">
        
        {footerLabel}
        <ArrowRightIcon className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
      </button>
    </section>);

}