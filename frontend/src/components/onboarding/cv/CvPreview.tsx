import React from 'react';
import { motion } from 'framer-motion';
import { MailIcon, MapPinIcon, PhoneIcon, Briefcase, GraduationCap, Sparkles, CheckCircle2 } from 'lucide-react';
import type { ParsedCv } from '../../../types/onboarding';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { isAr } = useLanguage();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-sm transition-all">
      {/* Scanning Animation Laser Line */}
      {scanning && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 h-[3px] bg-gradient-to-r from-blue-500 via-emerald-400 to-blue-600 shadow-[0_0_18px_4px_rgba(27,87,224,0.5)] z-20"
          initial={{ top: '4%' }}
          animate={{ top: ['4%', '94%', '4%'] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Luxury CV Paper Sheet */}
      <div className="space-y-4 text-slate-900 dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>
        
        {/* Header Section */}
        <header className="border-b border-slate-200 dark:border-white/10 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[20px] font-extrabold tracking-tight text-slate-900 dark:text-white">
                {cv.fullName || 'User'}
              </h2>
              <p className="mt-0.5 text-[13px] font-bold text-blue-600 dark:text-[#60A5FA] font-sans">
                {cv.currentTitle}
              </p>
            </div>

            {cv.atsReport && (
              <span className="shrink-0 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-[11px] font-black border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1 font-sans">
                <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>ATS {cv.atsReport.score}%</span>
              </span>
            )}
          </div>

          {/* Contact Bar */}
          <ul className="mt-2.5 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[11px] text-slate-600 dark:text-slate-400 font-sans">
            {cv.email && (
              <li className="flex items-center gap-1">
                <MailIcon className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                <span>{cv.email}</span>
              </li>
            )}
            {cv.phone && (
              <li className="flex items-center gap-1">
                <PhoneIcon className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                <span dir="ltr">{cv.phone}</span>
              </li>
            )}
            {cv.linkedin && (
              <li className="flex items-center gap-1">
                <LinkedinIcon className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                <span>{cv.linkedin}</span>
              </li>
            )}
            {cv.location && (
              <li className="flex items-center gap-1">
                <MapPinIcon className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                <span>{cv.location}</span>
              </li>
            )}
          </ul>
        </header>

        {/* Summary */}
        {cv.summary && (
          <section className="space-y-1">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans">
              {isAr ? "الملخص المهني" : "Professional Summary"}
            </h3>
            <p className="text-[12px] leading-[1.65] text-slate-700 dark:text-slate-300">
              {cv.summary}
            </p>
          </section>
        )}

        {/* Experience Section */}
        {cv.experience && (
          <section className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/10">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-[#60A5FA]" />
              <span>{isAr ? "الخبرات المهنية" : "Work Experience"}</span>
            </h3>

            <div>
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">
                  {cv.experience.title}
                </h4>
                <span className="text-[10.5px] font-medium text-slate-500 dark:text-slate-400 font-sans shrink-0">
                  {cv.experience.period}
                </span>
              </div>
              <p className="text-[11.5px] font-semibold text-blue-600 dark:text-[#60A5FA] font-sans">
                {cv.experience.company} {cv.experience.location ? `• ${cv.experience.location}` : ''}
              </p>

              {cv.experience.bullets && cv.experience.bullets.length > 0 && (
                <ul className="mt-1.5 space-y-1 font-sans">
                  {cv.experience.bullets.slice(0, 3).map((bullet, index) => (
                    <li key={index} className="flex items-start gap-2 text-[11.5px] text-slate-700 dark:text-slate-300 leading-relaxed">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {/* Education Section */}
        {cv.education && (
          <section className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-white/10">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{isAr ? "المؤهل الدراسي والتعليم" : "Education"}</span>
            </h3>

            <div className="flex items-baseline justify-between gap-2">
              <h4 className="text-[12.5px] font-bold text-slate-900 dark:text-white">
                {cv.education.degree}
              </h4>
              <span className="text-[10.5px] font-medium text-slate-500 dark:text-slate-400 font-sans shrink-0">
                {cv.education.period}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-sans">
              {cv.education.school}
            </p>
          </section>
        )}

        {/* Extracted Skills Section */}
        {cv.skills && cv.skills.length > 0 && (
          <section className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans">
              {isAr ? "المهارات والتقنيات" : "Skills & Technologies"}
            </h3>

            <div className="flex flex-wrap gap-1.5 font-sans">
              {cv.skills.slice(0, 10).map((skill, index) => (
                <span
                  key={index}
                  className="px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-[10.5px] font-bold border border-blue-100 dark:border-blue-500/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}