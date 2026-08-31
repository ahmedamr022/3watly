"use client";

import React from 'react';
import {
  Calendar,
  Mail,
  MapPin,
  Phone
} from 'lucide-react';
import { FaLinkedin as LinkedinIcon } from 'react-icons/fa6';
import { useCV } from '../../contexts/CVContext';
import { SECTION_META } from '../../data/cvData';
import { formatDateRange, visibleSections } from '../../utils/cvHelpers';
import type { CVData, SectionId, TemplateId } from '../../types/cv';

interface Style {
  page: string;
  name: string;
  role: string;
  contact: string;
  heading: string;
  headingRule: string;
  body: string;
  itemTitle: string;
  itemSub: string;
  meta: string;
  gap: string;
  itemGap: string;
}

const STYLES: Record<TemplateId, Style> = {
  'ats-classic': {
    page: 'px-11 py-10',
    name: 'text-[32px] font-extrabold tracking-tight text-slate-900 dark:text-white',
    role: 'mt-1 text-[16.5px] font-bold text-blue-700 dark:text-[#60A5FA]',
    contact: 'mt-3 text-[12.5px] text-slate-600 dark:text-slate-400',
    heading: 'text-[14px] font-bold uppercase tracking-wider text-slate-900 dark:text-white',
    headingRule: 'mt-1.5 border-b-2 border-slate-300 dark:border-white/15',
    body: 'text-[13px] leading-[1.7] text-slate-800 dark:text-slate-300',
    itemTitle: 'text-[15px] font-bold text-slate-900 dark:text-white',
    itemSub: 'text-[13.5px] font-semibold text-blue-700 dark:text-[#60A5FA]',
    meta: 'text-[12px] text-slate-500 dark:text-slate-400',
    gap: 'mt-6',
    itemGap: 'mt-3.5'
  },
  'modern-minimal': {
    page: 'px-12 py-11',
    name: 'text-[35px] font-bold tracking-tight text-slate-900 dark:text-white',
    role: 'mt-1 text-[15px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400',
    contact: 'mt-3.5 text-[12.5px] text-slate-500 dark:text-slate-400',
    heading: 'text-[13px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-400',
    headingRule: 'mt-2',
    body: 'text-[13px] leading-[1.75] text-slate-700 dark:text-slate-300',
    itemTitle: 'text-[15px] font-semibold text-slate-900 dark:text-white',
    itemSub: 'text-[13.5px] font-medium text-slate-500 dark:text-slate-400',
    meta: 'text-[12px] text-slate-400 dark:text-slate-500',
    gap: 'mt-7',
    itemGap: 'mt-4'
  },
  compact: {
    page: 'px-9 py-8',
    name: 'text-[28px] font-extrabold tracking-tight text-slate-900 dark:text-white',
    role: 'text-[14.5px] font-bold text-blue-700 dark:text-[#60A5FA]',
    contact: 'mt-2 text-[11.5px] text-slate-600 dark:text-slate-400',
    heading: 'text-[12.5px] font-bold uppercase tracking-wide text-slate-900 dark:text-white',
    headingRule: 'mt-1 border-b border-slate-300 dark:border-white/15',
    body: 'text-[12px] leading-[1.6] text-slate-800 dark:text-slate-300',
    itemTitle: 'text-[14px] font-bold text-slate-900 dark:text-white',
    itemSub: 'text-[12.5px] font-semibold text-blue-700 dark:text-[#60A5FA]',
    meta: 'text-[11.5px] text-slate-500 dark:text-slate-400',
    gap: 'mt-5',
    itemGap: 'mt-3'
  }
};

export function CVPreview() {
  const { cv, template } = useCV();
  const style = STYLES[template];
  const sections = visibleSections(cv);

  return (
    <div className="print-region flex justify-center py-4 sm:py-6">
      <article
        className={`print-page cv-paper-root relative min-h-[960px] w-full max-w-[800px] mx-auto bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-slate-200/90 dark:border-white/10 rounded-xl sm:rounded-2xl transition-all duration-300 ${style.page}`}
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {/* Header: Name + Contact info */}
        <header className="border-b border-slate-200 dark:border-white/10 pb-5 text-center">
          <h1 className={style.name}>{cv.contact.fullName || 'Full Name'}</h1>
          {cv.contact.jobTitle && <p className={style.role}>{cv.contact.jobTitle}</p>}

          <ul className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 font-sans ${style.contact}`}>
            {cv.contact.phone && (
              <li className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                <span>{cv.contact.phone}</span>
              </li>
            )}
            {cv.contact.email && (
              <li className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                <span>{cv.contact.email}</span>
              </li>
            )}
            {cv.contact.linkedin && (
              <li className="flex items-center gap-1">
                <LinkedinIcon className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                <span>{cv.contact.linkedin}</span>
              </li>
            )}
            {cv.contact.location && (
              <li className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                <span>{cv.contact.location}</span>
              </li>
            )}
          </ul>
        </header>

        {/* Dynamic Sections */}
        <div className="space-y-6 pt-5">
          {sections.map((id) => (
            <section key={id} className={style.gap}>
              <h2 className={style.heading}>{SECTION_META[id].label}</h2>
              {style.headingRule && <div className={style.headingRule} />}
              <SectionContent id={id} cv={cv} style={style} />
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}

function SectionContent({
  id,
  cv,
  style
}: {
  id: SectionId;
  cv: CVData;
  style: Style;
}) {
  if (id === 'summary') {
    if (!cv.summary.trim()) return null;
    return <p className={`${style.itemGap} font-sans ${style.body}`}>{cv.summary}</p>;
  }

  if (id === 'experience') {
    if (cv.experience.length === 0) return null;
    return (
      <div className="space-y-4 font-sans">
        {cv.experience.map((item, index) => (
          <div key={item.id} className={index === 0 ? style.itemGap : 'mt-3.5'}>
            <div className="flex items-baseline justify-between gap-4">
              <p className={style.itemTitle}>{item.role}</p>
              <p className={`shrink-0 text-right ${style.meta}`}>
                {formatDateRange(item.startDate, item.endDate, item.current)}
              </p>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <p className={style.itemSub}>{item.company}</p>
              {item.location && <p className={style.meta}>{item.location}</p>}
            </div>
            <Bullets bullets={item.bullets} style={style} />
          </div>
        ))}
      </div>
    );
  }

  if (id === 'education') {
    if (cv.education.length === 0) return null;
    return (
      <div className="space-y-3.5 font-sans">
        {cv.education.map((item, index) => (
          <div key={item.id} className={index === 0 ? style.itemGap : 'mt-3'}>
            <div className="flex items-baseline justify-between gap-4">
              <p className={style.itemTitle}>{item.degree} {item.major && `in ${item.major}`}</p>
              <p className={`shrink-0 text-right ${style.meta}`}>
                {formatDateRange(item.startDate, item.endDate, false)}
              </p>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <p className={style.itemSub}>{item.institution}</p>
              {item.location && <p className={style.meta}>{item.location}</p>}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (id === 'projects') {
    if (cv.projects.length === 0) return null;
    return (
      <div className="space-y-3.5 font-sans">
        {cv.projects.map((item, index) => (
          <div key={item.id} className={index === 0 ? style.itemGap : 'mt-3'}>
            <div className="flex items-start justify-between gap-6">
              <p className={style.itemTitle}>{item.title}</p>
              {item.technologies.length > 0 && (
                <p className={`shrink-0 text-right ${style.meta}`}>
                  {item.technologies.join(', ')}
                </p>
              )}
            </div>
            <Bullets bullets={item.bullets} style={style} />
          </div>
        ))}
      </div>
    );
  }

  if (id === 'skills') {
    if (cv.skills.length === 0) return null;
    return (
      <div className={`${style.itemGap} font-sans`}>
        {cv.skillsSummary && (
          <p className={`mb-2.5 ${style.body}`}>{cv.skillsSummary}</p>
        )}
        <dl className="space-y-2">
          {cv.skills.map((group) => (
            <div key={group.id} className="flex gap-3">
              <dt className={`w-[120px] shrink-0 font-bold text-slate-900 dark:text-white ${style.body}`}>
                {group.label}:
              </dt>
              <dd className={style.body}>{group.skills.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  return null;
}

function Bullets({
  bullets,
  style
}: {
  bullets: string[];
  style: Style;
}) {
  const items = bullets.filter((bullet) => bullet.trim() !== '');
  if (items.length === 0) return null;
  return (
    <ul className={`mt-2 space-y-1.5 ${style.body}`}>
      {items.map((bullet, index) => (
        <li key={index} className="flex gap-2.5">
          <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" />
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  );
}
