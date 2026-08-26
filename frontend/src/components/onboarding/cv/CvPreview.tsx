import React from 'react';
import { motion } from 'framer-motion';
import { MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import type { ParsedCv } from '../../../types/onboarding';

function LinkedinIcon({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

interface CvPreviewProps {
  cv: ParsedCv;
  scanning: boolean;
}

export function CvPreview({ cv, scanning }: CvPreviewProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-line dark:border-white/10 bg-white dark:bg-[#070B14] px-5 py-4">
      {scanning && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 h-[3px] bg-brand-blue shadow-[0_0_18px_4px_rgba(27,87,224,0.45)]"
          initial={{ top: '6%' }}
          animate={{ top: ['6%', '92%', '6%'] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <h3 className="text-[13.5px] font-bold tracking-[0.02em] text-ink dark:text-white">{cv.fullName}</h3>
      <p className="mt-0.5 text-[11.5px] font-medium text-ink-soft dark:text-slate-300">{cv.currentTitle}</p>

      <div className="mt-2 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[9.5px] font-light text-ink-muted dark:text-slate-400">
        <span className="flex items-center gap-1">
          <MailIcon className="h-[11px] w-[11px]" strokeWidth={1.8} aria-hidden="true" />
          {cv.email}
        </span>
        <span className="flex items-center gap-1">
          <PhoneIcon className="h-[11px] w-[11px]" strokeWidth={1.8} aria-hidden="true" />
          {cv.phone}
        </span>
        <span className="flex items-center gap-1">
          <MapPinIcon className="h-[11px] w-[11px]" strokeWidth={1.8} aria-hidden="true" />
          {cv.location}
        </span>
        <span className="flex items-center gap-1">
          <LinkedinIcon className="h-[11px] w-[11px]" />
          LinkedIn
        </span>
      </div>

      <div className="mt-3 border-t border-line dark:border-white/10 pt-2.5">
        <h4 className="text-[9.5px] font-semibold tracking-[0.12em] text-ink-muted dark:text-slate-400">SUMMARY</h4>
        <p className="mt-1 text-[9.5px] font-light leading-[1.55] text-ink-muted dark:text-slate-400">{cv.summary}</p>
      </div>

      <div className="mt-3 border-t border-line dark:border-white/10 pt-2.5">
        <h4 className="text-[9.5px] font-semibold tracking-[0.12em] text-ink-muted dark:text-slate-400">EXPERIENCE</h4>
        <div className="mt-1.5 flex items-baseline justify-between gap-3">
          <p className="text-[10.5px] font-semibold text-ink dark:text-white">{cv.experience.title}</p>
          <p className="shrink-0 text-[9.5px] font-light text-ink-faint dark:text-slate-500">{cv.experience.period}</p>
        </div>
        <p className="text-[9.5px] font-light text-ink-muted dark:text-slate-400">
          {cv.experience.company} &nbsp;•&nbsp; {cv.experience.location}
        </p>
        <ul className="mt-1.5 space-y-1">
          {cv.experience.bullets.map((bullet, index) => (
            <li key={index} className="flex items-start gap-1.5 text-[9.5px] font-light leading-[1.5] text-ink-soft dark:text-slate-300">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-blue" aria-hidden="true" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 border-t border-line dark:border-white/10 pt-2.5">
        <h4 className="text-[9.5px] font-semibold tracking-[0.12em] text-ink-muted dark:text-slate-400">EDUCATION</h4>
        <div className="mt-1.5 flex items-baseline justify-between gap-3">
          <p className="text-[10.5px] font-semibold text-ink dark:text-white">{cv.education.degree}</p>
          <p className="shrink-0 text-[9.5px] font-light text-ink-faint dark:text-slate-500">{cv.education.period}</p>
        </div>
        <p className="text-[9.5px] font-light text-ink-muted dark:text-slate-400">{cv.education.school}</p>
      </div>
    </div>
  );
}