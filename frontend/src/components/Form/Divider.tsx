import React from 'react';

export function Divider({ label = 'or' }: { label?: string }) {
  return (
    <div className="flex items-center gap-4" aria-hidden="true">
      <span className="h-px flex-1 bg-line dark:bg-white/10" />
      <span className="text-[12.5px] font-normal text-ink-faint dark:text-slate-500">{label}</span>
      <span className="h-px flex-1 bg-line dark:bg-white/10" />
    </div>
  );
}