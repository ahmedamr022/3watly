"use client";

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { InfoIcon } from 'lucide-react';
import { EASE } from '@/utils/motion';

interface InfoTooltipProps {
  content: string;
  className?: string;
}

export function InfoTooltip({ content, className = '' }: InfoTooltipProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label="More information"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full p-0.5 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40 cursor-help"
      >
        <InfoIcon className="h-[15px] w-[15px]" strokeWidth={1.8} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 2, scale: 0.95 }}
            transition={{ duration: 0.15, ease: EASE }}
            role="tooltip"
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-900/95 dark:bg-[#1E293B]/95 px-3 py-2 text-[12px] font-normal leading-relaxed text-white shadow-xl backdrop-blur-sm z-50 pointer-events-none text-center"
          >
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-slate-900/95 dark:border-t-[#1E293B]/95" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
