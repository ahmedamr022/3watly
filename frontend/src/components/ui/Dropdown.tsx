"use client";

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon, CheckIcon } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';

export type Option = { id: string; label: string; description?: string };

type DropdownProps = {
  options: Option[];
  value: string;
  onChange: (id: string) => void;
  variant?: 'filter' | 'compact';
  label?: string;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  className?: string;
  menuWidth?: string;
};

export function Dropdown({
  options,
  value,
  onChange,
  variant = 'compact',
  label,
  icon: Icon,
  className = '',
  menuWidth = 'w-full min-w-[220px]'
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(() => Math.max(0, options.findIndex((o) => o.id === value)));
  const ref = useClickOutside<HTMLDivElement>(open, () => setOpen(false));
  const selected = options.find((o) => o.id === value) ?? options[0];

  const commit = (id: string) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          setOpen((v) => !v);
          setCursor(Math.max(0, options.findIndex((o) => o.id === value)));
        }}
        className={
          variant === 'filter'
            ? 'flex h-[54px] w-full items-center justify-between gap-3 rounded-2xl border border-slate-200/80 dark:border-white/10 dark:border-white/10 bg-white dark:bg-[#0B1120] px-4 text-left shadow-xs transition-all hover:border-blue-400 dark:hover:border-blue-500/40 focus:outline-none cursor-pointer'
            : 'flex h-[36px] items-center gap-2 rounded-xl border border-slate-200/80 dark:border-white/10 dark:border-white/10 bg-white dark:bg-[#0B1120] px-3 text-[13px] font-semibold text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-50 dark:bg-[#0B1120]/[0.04] dark:hover:bg-white dark:bg-[#0B1120]/5 focus:outline-none cursor-pointer'
        }
      >
        <div className="flex items-center gap-3 min-w-0">
          {Icon && (
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
              <Icon className="h-4 w-4" />
            </span>
          )}
          <div className="min-w-0 text-left">
            {label && <span className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 dark:text-slate-400">{label}</span>}
            <span className="block truncate text-[13.5px] font-bold text-[#0B132B] dark:text-white leading-tight">
              {selected?.label}
            </span>
          </div>
        </div>

        <ChevronDownIcon className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className={`absolute top-full z-50 mt-2 ${menuWidth} rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0D1527] p-2 shadow-2xl`}
          >
            <div className="max-h-60 overflow-y-auto space-y-1">
              {options.map((opt) => {
                const isCurrent = opt.id === value;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => commit(opt.id)}
                    className={`flex w-full items-center justify-between px-3 py-2 rounded-xl text-[13px] font-semibold text-left transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-[#0B1120]/[0.04] dark:hover:bg-white dark:bg-[#0B1120]/5'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isCurrent && <CheckIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
