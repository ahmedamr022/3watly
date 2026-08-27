"use client";

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2Icon, ChevronDownIcon } from 'lucide-react';

interface SectionRowProps {
  id: string;
  label: string;
  icon: React.ComponentType<{className?: string;}>;
  open: boolean;
  onToggle: () => void;
  complete: boolean;
  count?: number | null;
  badge?: React.ReactNode;
  children: React.ReactNode;
}

export function SectionRow({
  id,
  label,
  icon: Icon,
  open,
  onToggle,
  complete,
  count,
  badge,
  children
}: SectionRowProps) {
  const panelId = `${id}-panel`;
  return (
    <section>
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors duration-150 ease-smooth hover:bg-slate-50">
          
          <Icon
            className={`h-[18px] w-[18px] shrink-0 ${
            open ? 'text-brand-600' : 'text-slate-400'}`
            } />
          
          <span
            className={`flex-1 text-[15px] font-semibold ${
            open ? 'text-brand-700' : 'text-slate-800'}`
            }>
            
            {label}
          </span>
          {badge}
          {typeof count === 'number' &&
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-slate-100 px-1.5 text-xs font-semibold tabular-nums text-slate-600">
              {count}
            </span>
          }
          {complete &&
          <CheckCircle2Icon
            className="h-5 w-5 text-emerald-500"
            aria-label="Section complete" />

          }
          <ChevronDownIcon
            className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ease-smooth ${
            open ? 'rotate-180' : ''}`
            }
            aria-hidden="true" />
          
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open &&
        <motion.div
          id={panelId}
          key="panel"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
          className="overflow-hidden">
          
            <div className="px-5 pb-5 pt-0">{children}</div>
          </motion.div>
        }
      </AnimatePresence>
    </section>);

}
