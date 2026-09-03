"use client";

import React from 'react';
import { useCV } from '../../contexts/CVContext';
import { SECTION_META } from '../../data/cvData';
import { formatDateRange, visibleSections } from '../../utils/cvHelpers';
import type { CVData, SectionId, TemplateId } from '../../types/cv';

interface StyleConfig {
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
  fontFamily: string;
}

// Support both light and dark mode in CV Builder editor, with high contrast and ATS structure
const STYLES: Record<TemplateId, StyleConfig> = {
  'ats-classic': {
    page: 'p-6 sm:p-10',
    name: 'text-[24px] sm:text-[28px] font-bold tracking-tight text-slate-900 dark:text-white text-center',
    role: 'mt-0.5 text-[13.5px] sm:text-[14.5px] font-semibold text-slate-800 dark:text-slate-200 text-center',
    contact: 'mt-1.5 text-[11.5px] text-slate-700 dark:text-slate-300 text-center',
    heading: 'text-[12.5px] sm:text-[13px] font-bold uppercase tracking-wider text-slate-900 dark:text-white',
    headingRule: 'mt-1 border-b border-slate-900 dark:border-white/30',
    body: 'text-[11.5px] sm:text-[12px] leading-[1.55] text-slate-800 dark:text-slate-200',
    itemTitle: 'text-[12.5px] sm:text-[13px] font-bold text-slate-900 dark:text-white',
    itemSub: 'text-[12px] sm:text-[12.5px] italic text-slate-700 dark:text-slate-300',
    meta: 'text-[11.5px] sm:text-[12px] text-slate-600 dark:text-slate-400 font-medium',
    gap: 'mt-3.5',
    itemGap: 'mt-2',
    fontFamily: '"Times New Roman", Times, Georgia, serif'
  },
  'compact': {
    page: 'p-5 sm:p-8',
    name: 'text-[22px] sm:text-[25px] font-bold tracking-tight text-slate-900 dark:text-white text-center',
    role: 'mt-0.5 text-[13px] sm:text-[13.5px] font-semibold text-slate-800 dark:text-slate-200 text-center',
    contact: 'mt-1 text-[11px] text-slate-700 dark:text-slate-300 text-center',
    heading: 'text-[12px] font-bold uppercase tracking-wider text-slate-900 dark:text-white',
    headingRule: 'mt-0.5 border-b border-slate-900 dark:border-white/30',
    body: 'text-[11px] sm:text-[11.5px] leading-[1.45] text-slate-800 dark:text-slate-200',
    itemTitle: 'text-[12px] sm:text-[12.5px] font-bold text-slate-900 dark:text-white',
    itemSub: 'text-[11.5px] sm:text-[12px] italic text-slate-700 dark:text-slate-300',
    meta: 'text-[11px] text-slate-600 dark:text-slate-400 font-medium',
    gap: 'mt-3',
    itemGap: 'mt-1.5',
    fontFamily: 'Calibri, Arial, Helvetica, sans-serif'
  },
  'two-column': {
    page: 'p-6 sm:p-9',
    name: 'text-[24px] sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white text-center',
    role: 'mt-0.5 text-[13.5px] sm:text-[14px] font-semibold text-slate-800 dark:text-slate-200 text-center',
    contact: 'mt-1.5 text-[11px] text-slate-700 dark:text-slate-300 text-center',
    heading: 'text-[12px] font-bold uppercase tracking-wider text-slate-900 dark:text-white',
    headingRule: 'mt-1 border-b border-slate-900 dark:border-white/30',
    body: 'text-[11px] sm:text-[11.5px] leading-[1.5] text-slate-800 dark:text-slate-200',
    itemTitle: 'text-[12px] sm:text-[12.5px] font-bold text-slate-900 dark:text-white',
    itemSub: 'text-[11.5px] italic text-slate-700 dark:text-slate-300',
    meta: 'text-[11px] text-slate-600 dark:text-slate-400 font-medium',
    gap: 'mt-3.5',
    itemGap: 'mt-2',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
  },
  'simple': {
    page: 'p-6 sm:p-10',
    name: 'text-[24px] sm:text-[28px] font-bold tracking-normal text-slate-900 dark:text-white text-center',
    role: 'mt-0.5 text-[13.5px] sm:text-[14px] italic text-slate-700 dark:text-slate-300 text-center',
    contact: 'mt-1.5 text-[11px] sm:text-[11.5px] text-slate-700 dark:text-slate-300 text-center',
    heading: 'text-[12.5px] sm:text-[13px] font-bold uppercase tracking-widest text-slate-900 dark:text-white',
    headingRule: 'mt-1 border-b border-slate-900 dark:border-white/30',
    body: 'text-[11.5px] sm:text-[12px] leading-[1.6] text-slate-800 dark:text-slate-200',
    itemTitle: 'text-[12.5px] sm:text-[13px] font-bold text-slate-900 dark:text-white',
    itemSub: 'text-[12px] italic text-slate-700 dark:text-slate-300',
    meta: 'text-[11.5px] text-slate-600 dark:text-slate-400',
    gap: 'mt-3.5',
    itemGap: 'mt-2',
    fontFamily: 'Georgia, "Times New Roman", serif'
  },
  'modern-minimal': {
    page: 'p-6 sm:p-10',
    name: 'text-[24px] sm:text-[28px] font-bold tracking-tight text-slate-900 dark:text-white text-center',
    role: 'mt-0.5 text-[13.5px] sm:text-[14.5px] font-semibold text-slate-800 dark:text-slate-200 text-center',
    contact: 'mt-1.5 text-[11px] sm:text-[11.5px] text-slate-700 dark:text-slate-300 text-center',
    heading: 'text-[12.5px] sm:text-[13px] font-bold uppercase tracking-wider text-slate-900 dark:text-white',
    headingRule: 'mt-1 border-b border-slate-900 dark:border-white/30',
    body: 'text-[11.5px] sm:text-[12px] leading-[1.55] text-slate-800 dark:text-slate-200',
    itemTitle: 'text-[12.5px] sm:text-[13px] font-bold text-slate-900 dark:text-white',
    itemSub: 'text-[12px] sm:text-[12.5px] italic text-slate-700 dark:text-slate-300',
    meta: 'text-[11.5px] text-slate-600 dark:text-slate-400 font-medium',
    gap: 'mt-3.5',
    itemGap: 'mt-2',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
  }
};

/** Clean location strings that mistakenly have date ranges concatenated into them */
function cleanLocationText(loc?: string): string {
  if (!loc) return '';
  return loc
    .replace(/\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)?\s*\d{4}\s*[-–—]\s*(?:present|\w+\s*\d{4})?/gi, '')
    .replace(/^[,\s·•-]+|[,\s·•-]+$/g, '')
    .trim();
}

export function CVPreview() {
  const { cv, template } = useCV();
  const activeTemplateKey = STYLES[template] ? template : 'ats-classic';
  const style = STYLES[activeTemplateKey];
  const sections = visibleSections(cv);

  // Helper to format clean link URLs
  const formatUrl = (url?: string) => {
    if (!url) return '';
    const u = url.trim();
    return u.startsWith('http://') || u.startsWith('https://') ? u : `https://${u}`;
  };

  // Helper to collect and normalize all social links (Displays name only: LinkedIn, GitHub, etc.)
  const activeSocialLinks = React.useMemo(() => {
    if (Array.isArray(cv.contact.socialLinks) && cv.contact.socialLinks.length > 0) {
      return cv.contact.socialLinks.filter((l) => Boolean(l.url && l.url.trim()));
    }
    const legacy: Array<{ id: string; platform: string; url: string }> = [];
    if (cv.contact.linkedin?.trim()) {
      legacy.push({ id: 'li', platform: 'LinkedIn', url: cv.contact.linkedin });
    }
    if (cv.contact.github?.trim()) {
      legacy.push({ id: 'gh', platform: 'GitHub', url: cv.contact.github });
    }
    if (cv.contact.portfolio?.trim()) {
      legacy.push({ id: 'pf', platform: 'Portfolio', url: cv.contact.portfolio });
    }
    return legacy;
  }, [cv.contact.socialLinks, cv.contact.linkedin, cv.contact.github, cv.contact.portfolio]);

  const isTwoColumn = template === 'two-column';

  return (
    <div className="print-region">
      {/* Scrollable viewport with neutral backdrop */}
      <div className="cv-scroll-viewport no-print-wrapper overflow-y-auto overflow-x-hidden py-4 sm:py-6 cv-preview-scroller">
        <article
          id="cv-paper-root"
          dir="ltr"
          className={`print-page cv-paper-root relative w-full max-w-[820px] mx-auto bg-white dark:bg-[#0E1626] text-slate-900 dark:text-slate-100 shadow-2xl border border-slate-200 dark:border-white/10 rounded-sm transition-all duration-300 text-left ${style.page}`}
          style={{ fontFamily: style.fontFamily }}
        >
          {/* Header: Name + Headline + Location + Contacts Row */}
          <header className="text-center pb-2">
            <h1 className={style.name}>{cv.contact.fullName || 'Candidate Name'}</h1>
            {cv.contact.jobTitle && <p className={style.role}>{cv.contact.jobTitle}</p>}
            {cv.contact.location && (
              <p className="text-[11.5px] text-slate-600 dark:text-slate-400 mt-0.5">
                {cleanLocationText(cv.contact.location)}
              </p>
            )}

            {/* Single Combined Contact Line: Phone | Email | LinkedIn | GitHub | Portfolio */}
            <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[11.5px] text-slate-700 dark:text-slate-300 mt-1.5 font-sans">
              {cv.contact.phone && (
                <a
                  href={`tel:${cv.contact.phone.replace(/[^\d+]/g, '')}`}
                  className="hover:underline text-slate-800 dark:text-slate-200"
                >
                  {cv.contact.phone}
                </a>
              )}

              {cv.contact.email && (
                <>
                  {cv.contact.phone && <span className="text-slate-400 dark:text-slate-600 select-none">|</span>}
                  <a
                    href={`mailto:${cv.contact.email}`}
                    className="hover:underline text-slate-800 dark:text-slate-200"
                  >
                    {cv.contact.email}
                  </a>
                </>
              )}

              {/* Social URLs rendered by NAME only: LinkedIn, GitHub, Portfolio */}
              {activeSocialLinks.map((item, idx) => (
                <React.Fragment key={item.id || idx}>
                  <span className="text-slate-400 dark:text-slate-600 select-none">|</span>
                  <a
                    href={formatUrl(item.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-900 dark:text-blue-400 font-semibold hover:underline"
                  >
                    {item.platform || 'Link'}
                  </a>
                </React.Fragment>
              ))}
            </div>
          </header>

          {/* Render 2-Column or Single Column */}
          {isTwoColumn ? (
            /* Perfectly Balanced Two-Column Layout (No squeezed labels or text collisions) */
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-8 pt-4 items-start">
              {/* Left Column (Skills + Education): 5 cols (42% width) with spacious padding */}
              <div className="col-span-1 sm:col-span-5 space-y-5 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-white/10 pb-4 sm:pb-0 sm:pr-6">
                {sections.includes('skills') && (
                  <section>
                    <h2 className={style.heading}>{SECTION_META['skills'].label}</h2>
                    <div className={style.headingRule} />
                    <TwoColumnSkillsContent cv={cv} style={style} />
                  </section>
                )}
                {sections.includes('education') && (
                  <section>
                    <h2 className={style.heading}>{SECTION_META['education'].label}</h2>
                    <div className={style.headingRule} />
                    <TwoColumnEducationContent cv={cv} style={style} />
                  </section>
                )}
              </div>

              {/* Right Column (Summary + Experience + Projects): 7 cols (58% width) */}
              <div className="col-span-1 sm:col-span-7 space-y-5">
                {sections.includes('summary') && (
                  <section>
                    <h2 className={style.heading}>{SECTION_META['summary'].label}</h2>
                    <div className={style.headingRule} />
                    <SummarySectionContent cv={cv} style={style} />
                  </section>
                )}
                {sections.includes('experience') && (
                  <section>
                    <h2 className={style.heading}>{SECTION_META['experience'].label}</h2>
                    <div className={style.headingRule} />
                    <ExperienceSectionContent cv={cv} style={style} />
                  </section>
                )}
                {sections.includes('projects') && (
                  <section>
                    <h2 className={style.heading}>{SECTION_META['projects'].label}</h2>
                    <div className={style.headingRule} />
                    <ProjectsSectionContent cv={cv} style={style} />
                  </section>
                )}
              </div>
            </div>
          ) : (
            /* Standard Single-Column Flow (Ivy League / ATS Gold Standard) */
            <div className="space-y-3.5 pt-1">
              {sections.map((id) => (
                <section key={id} className={style.gap}>
                  <h2 className={style.heading}>{SECTION_META[id].label}</h2>
                  <div className={style.headingRule} />
                  <SectionContent id={id} cv={cv} style={style} />
                </section>
              ))}
            </div>
          )}
        </article>
      </div>
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
  style: StyleConfig;
}) {
  if (id === 'summary') return <SummarySectionContent cv={cv} style={style} />;
  if (id === 'experience') return <ExperienceSectionContent cv={cv} style={style} />;
  if (id === 'education') return <EducationSectionContent cv={cv} style={style} />;
  if (id === 'projects') return <ProjectsSectionContent cv={cv} style={style} />;
  if (id === 'skills') return <SkillsSectionContent cv={cv} style={style} />;
  return null;
}

function SummarySectionContent({ cv, style }: { cv: CVData; style: StyleConfig }) {
  if (!cv.summary.trim()) return null;
  return <p className={`${style.itemGap} ${style.body}`}>{cv.summary}</p>;
}

function ExperienceSectionContent({ cv, style }: { cv: CVData; style: StyleConfig }) {
  if (cv.experience.length === 0) return null;
  return (
    <div className="space-y-3">
      {cv.experience.map((item, index) => {
        const cleanLoc = cleanLocationText(item.location);
        return (
          <div key={item.id} className={index === 0 ? style.itemGap : 'mt-2.5'}>
            {/* Top row: Role + Date range */}
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <p className={style.itemTitle}>{item.role}</p>
              <span className={`shrink-0 text-right ${style.meta}`}>
                {formatDateRange(item.startDate, item.endDate, item.current)}
              </span>
            </div>
            {/* Second row: Company + Clean Location */}
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <p className={style.itemSub}>{item.company}</p>
              {cleanLoc && <span className={`shrink-0 text-right ${style.itemSub}`}>{cleanLoc}</span>}
            </div>
            <Bullets bullets={item.bullets} style={style} />
          </div>
        );
      })}
    </div>
  );
}

function EducationSectionContent({ cv, style }: { cv: CVData; style: StyleConfig }) {
  if (cv.education.length === 0) return null;
  return (
    <div className="space-y-2.5">
      {cv.education.map((item, index) => {
        const cleanLoc = cleanLocationText(item.location);
        return (
          <div key={item.id} className={index === 0 ? style.itemGap : 'mt-2'}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <p className={style.itemTitle}>
                {item.degree} {item.major && `in ${item.major}`}
              </p>
              <span className={`shrink-0 text-right ${style.meta}`}>
                {formatDateRange(item.startDate, item.endDate, false)}
              </span>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <p className={style.itemSub}>{item.institution}</p>
              {cleanLoc && <span className={`shrink-0 text-right ${style.itemSub}`}>{cleanLoc}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProjectsSectionContent({ cv, style }: { cv: CVData; style: StyleConfig }) {
  if (cv.projects.length === 0) return null;

  const formatUrl = (url?: string) => {
    if (!url) return '';
    const u = url.trim();
    return u.startsWith('http://') || u.startsWith('https://') ? u : `https://${u}`;
  };

  return (
    <div className="space-y-3">
      {cv.projects.map((item, index) => (
        <div key={item.id} className={index === 0 ? style.itemGap : 'mt-2.5'}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className={style.itemTitle}>{item.title}</span>
              {item.github && (
                <a
                  href={formatUrl(item.github)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-900 dark:text-blue-400 underline text-[11.5px] font-medium"
                >
                  GitHub
                </a>
              )}
              {item.link && (
                <a
                  href={formatUrl(item.link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-900 dark:text-blue-400 underline text-[11.5px] font-medium"
                >
                  Live Demo
                </a>
              )}
            </div>
            {item.technologies.length > 0 && (
              <span className={`text-right ${style.meta}`}>
                {item.technologies.join(', ')}
              </span>
            )}
          </div>
          <Bullets bullets={item.bullets} style={style} />
        </div>
      ))}
    </div>
  );
}

/** Standard single-column skills content */
function SkillsSectionContent({ cv, style }: { cv: CVData; style: StyleConfig }) {
  if (cv.skills.length === 0) return null;
  return (
    <div className={`${style.itemGap}`}>
      {cv.skillsSummary && (
        <p className={`mb-1.5 ${style.body}`}>{cv.skillsSummary}</p>
      )}
      <dl className="space-y-1.5">
        {cv.skills.map((group) => (
          <div key={group.id} className="flex flex-wrap sm:flex-nowrap gap-x-2 gap-y-0.5">
            <dt className={`font-bold text-slate-900 dark:text-white shrink-0 ${style.body}`}>
              {group.label}:
            </dt>
            <dd className={style.body}>{group.skills.join(', ')}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Spacious Stacked Skills Layout specifically for Two-Column Sidebar (No horizontal cramming) */
function TwoColumnSkillsContent({ cv, style }: { cv: CVData; style: StyleConfig }) {
  if (cv.skills.length === 0) return null;
  return (
    <div className="mt-2 space-y-3">
      {cv.skillsSummary && (
        <p className={`mb-2 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 font-medium`}>
          {cv.skillsSummary}
        </p>
      )}
      {cv.skills.map((group) => (
        <div key={group.id} className="space-y-0.5">
          <dt className="font-bold text-slate-900 dark:text-white text-[12px] block">
            {group.label}
          </dt>
          <dd className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
            {group.skills.join(' • ')}
          </dd>
        </div>
      ))}
    </div>
  );
}

/** Clean Stacked Education Layout for Two-Column Sidebar */
function TwoColumnEducationContent({ cv, style }: { cv: CVData; style: StyleConfig }) {
  if (cv.education.length === 0) return null;
  return (
    <div className="mt-2 space-y-3">
      {cv.education.map((item) => {
        const cleanLoc = cleanLocationText(item.location);
        return (
          <div key={item.id} className="space-y-0.5">
            <p className="font-bold text-slate-900 dark:text-white text-[12px] leading-snug">
              {item.degree} {item.major && `(${item.major})`}
            </p>
            <p className="italic text-slate-700 dark:text-slate-300 text-[11.5px]">
              {item.institution}
            </p>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium">
              {formatDateRange(item.startDate, item.endDate, false)}
              {cleanLoc && ` • ${cleanLoc}`}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function Bullets({
  bullets,
  style
}: {
  bullets: string[];
  style: StyleConfig;
}) {
  const items = bullets.filter((bullet) => bullet.trim() !== '');
  if (items.length === 0) return null;
  return (
    <ul className={`mt-1 space-y-0.5 ${style.body}`}>
      {items.map((bullet, index) => (
        <li key={index} className="flex items-start gap-2">
          <span className="text-slate-900 dark:text-blue-400 font-bold select-none text-[13px] leading-[1.3]">•</span>
          <span className="leading-relaxed">{bullet}</span>
        </li>
      ))}
    </ul>
  );
}
