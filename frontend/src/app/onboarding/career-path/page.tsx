"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRightIcon,
  CheckIcon,
  ChartColumnIcon,
  CloudUploadIcon,
  CodeXmlIcon,
  DatabaseIcon,
  InfoIcon,
  NetworkIcon,
  PlusIcon,
  XIcon
} from 'lucide-react';
import { OnboardingSidebar } from '@/components/onboarding/OnboardingSidebar';
import { Logo } from '@/components/brand/Logo';
import { experienceLevels, locationOptions, roleOptions } from '@/data/roles';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { EASE, riseIn, springPop } from '@/utils/motion';

import { ThemeToggle } from '@/components/ui/ThemeToggle';

const roleIcons = {
  analytics: ChartColumnIcon,
  database: DatabaseIcon,
  code: CodeXmlIcon,
  network: NetworkIcon,
  cloud: CloudUploadIcon
} as const;

const roleTones = {
  blue: { tile: 'bg-[#EAF1FE] dark:bg-indigo-950/60', icon: 'text-brand-blue dark:text-indigo-400' },
  green: { tile: 'bg-[#E6F7EF] dark:bg-emerald-950/60', icon: 'text-brand-green dark:text-emerald-400' },
  violet: { tile: 'bg-[#ECEBFD] dark:bg-purple-950/60', icon: 'text-brand-indigo dark:text-purple-400' }
} as const;

export default function CareerPathPage() {
  const router = useRouter();
  const { role, selectRole, experience, setExperience, locations, toggleLocation } = useOnboarding();
  const [locationMenuOpen, setLocationMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const remainingLocations = locationOptions.filter((option) => !locations.includes(option));

  React.useEffect(() => {
    if (!locationMenuOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setLocationMenuOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLocationMenuOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [locationMenuOpen]);

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-[#060913] text-[#1E293B] dark:text-[#F8FAFC]">
      <OnboardingSidebar step={1} totalSteps={4} />

      <main className="flex min-h-screen flex-1 flex-col bg-[#FCFDFF] dark:bg-[#060913]">
        {/* Mobile Header */}
        <div className="flex items-center justify-between border-b border-line dark:border-white/10 px-6 py-4 lg:hidden">
          <Logo tagline="Career Intelligence Platform" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="text-[12.5px] font-semibold text-brand-blue dark:text-[#818CF8]">Step 1 of 4</span>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[1080px] flex-1 flex-col px-6 py-8 lg:px-12 lg:py-10">
          {/* Top Desktop Controls & Progress */}
          <div>
            <div className="hidden lg:flex items-center justify-between">
              <p className="text-[13px] font-semibold text-brand-blue dark:text-[#818CF8]">Step 1 of 4</p>
              <ThemeToggle />
            </div>
            <div className="mt-0 flex items-center gap-4 lg:mt-3">
              <div
                className="h-2 flex-1 overflow-hidden rounded-full bg-[#E4E8F2] dark:bg-white/10"
                role="progressbar"
                aria-valuenow={25}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Onboarding progress"
              >
                <motion.div
                  className="h-full rounded-full bg-brand-blue dark:bg-[#818CF8]"
                  initial={{ width: 0 }}
                  animate={{ width: '25%' }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
              </div>
              <span className="text-[13px] font-semibold text-brand-blue dark:text-[#818CF8]">25%</span>
            </div>
          </div>

          {/* Heading */}
          <header className="mt-8 lg:mt-9">
            <h1 className="text-[28px] font-bold leading-tight tracking-[-0.03em] text-ink dark:text-white lg:text-[34px]">
              What is your target career path?
            </h1>
            <p className="mt-2.5 text-[15px] font-light text-ink-muted dark:text-slate-400">
              Choose the role that best matches your career aspirations.
            </p>
          </header>

          {/* Role cards */}
          <div
            role="radiogroup"
            aria-label="Target career path"
            className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {roleOptions.map((option, index) => {
              const Icon = roleIcons[option.icon];
              const tone = roleTones[option.tone];
              const selected = role === option.id;
              return (
                <motion.button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => selectRole(option.id)}
                  {...riseIn(index)}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.985 }}
                  className={`group relative flex h-full flex-col items-start overflow-hidden rounded-2xl border bg-white dark:bg-[#0B1120] p-5 text-left transition-[border-color,box-shadow] duration-150 ease-smooth focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-blue/25 cursor-pointer ${
                    selected
                      ? 'border-brand-blue dark:border-[#818CF8] shadow-[0_20px_40px_-26px_rgba(27,87,224,0.6)] dark:shadow-[0_20px_40px_-26px_rgba(129,140,248,0.6)]'
                      : 'border-line dark:border-white/10 shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:border-[#BFD0F2] dark:hover:border-white/20 hover:shadow-[0_18px_34px_-26px_rgba(27,45,105,0.45)]'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 bg-[#F7FAFF] dark:bg-white/[0.03] transition-opacity duration-200 ease-smooth ${
                      selected ? 'opacity-100' : 'opacity-0'
                    }`}
                  />

                  <span
                    className={`relative flex h-[50px] w-[50px] items-center justify-center rounded-2xl transition-transform duration-200 ease-smooth group-hover:scale-[1.04] ${tone.tile}`}
                  >
                    <Icon
                      className={`h-[22px] w-[22px] ${tone.icon}`}
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                  </span>

                  <AnimatePresence>
                    {selected && (
                      <motion.span
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={springPop}
                        className="absolute right-4 top-4 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-brand-blue dark:bg-[#818CF8]"
                      >
                        <CheckIcon
                          className="h-[13px] w-[13px] text-white"
                          strokeWidth={3.2}
                          aria-hidden="true"
                        />
                      </motion.span>
                    )}
                  </AnimatePresence>

                  <h2 className="relative mt-4 text-[16.5px] font-semibold leading-snug text-ink dark:text-white">
                    {option.title}
                  </h2>
                  <p className="relative mt-1.5 text-[13px] font-light leading-[1.55] text-ink-muted dark:text-slate-400">
                    {option.description}
                  </p>
                </motion.button>
              );
            })}
          </div>

          {/* Preferences */}
          <div className="mt-9 grid grid-cols-1 gap-7 lg:grid-cols-2">
            <section>
              <div className="flex items-center gap-1.5">
                <h2 className="text-[14px] font-medium text-ink-soft dark:text-slate-200">Experience level</h2>
                <InfoIcon
                  className="h-[15px] w-[15px] text-ink-faint dark:text-slate-500"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {experienceLevels.map((level) => {
                  const active = experience === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setExperience(level)}
                      aria-pressed={active}
                      className={`h-10 whitespace-nowrap rounded-xl border px-4 text-[13.5px] transition-[border-color,background-color,color,transform] duration-150 ease-smooth active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40 cursor-pointer ${
                        active
                          ? 'border-brand-blue dark:border-[#818CF8] bg-[#EEF4FE] dark:bg-indigo-950/70 font-semibold text-brand-blue dark:text-indigo-300'
                          : 'border-line dark:border-white/10 bg-white dark:bg-[#0B1120] font-medium text-ink-soft dark:text-slate-300 hover:border-[#BFD0F2] dark:hover:border-white/20'
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-1.5">
                <h2 className="text-[14px] font-medium text-ink-soft dark:text-slate-200">
                  Location{' '}
                  <span className="font-light text-ink-muted dark:text-slate-400">(select all that apply)</span>
                </h2>
                <InfoIcon
                  className="h-[15px] w-[15px] text-ink-faint dark:text-slate-500"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2.5">
                <AnimatePresence initial={false}>
                  {locations.map((location) => (
                    <motion.span
                      key={location}
                      layout
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={springPop}
                      className="flex h-10 items-center gap-2 rounded-xl border border-brand-blue dark:border-[#818CF8] bg-[#EEF4FE] dark:bg-indigo-950/70 pl-4 pr-2.5 text-[13.5px] font-medium text-brand-blue dark:text-indigo-300"
                    >
                      {location}
                      <button
                        type="button"
                        onClick={() => toggleLocation(location)}
                        aria-label={`Remove ${location}`}
                        className="rounded-md p-0.5 transition-colors duration-150 ease-smooth hover:bg-[#DCE7FC] dark:hover:bg-indigo-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40 cursor-pointer"
                      >
                        <XIcon className="h-[15px] w-[15px]" strokeWidth={2.4} />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>

                {remainingLocations.length > 0 && (
                  <div className="relative" ref={menuRef}>
                    <button
                      type="button"
                      onClick={() => setLocationMenuOpen((open) => !open)}
                      aria-expanded={locationMenuOpen}
                      aria-haspopup="listbox"
                      className="flex h-10 items-center gap-1.5 rounded-xl border border-dashed border-[#C8D2E8] dark:border-white/20 bg-white dark:bg-[#0B1120] px-4 text-[13.5px] font-medium text-ink-faint dark:text-slate-400 transition-[border-color,color,transform] duration-150 ease-smooth active:scale-[0.97] hover:border-brand-blue dark:hover:border-[#818CF8] hover:text-brand-blue dark:hover:text-[#818CF8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40 cursor-pointer"
                    >
                      <PlusIcon className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
                      Add location
                    </button>

                    <AnimatePresence>
                      {locationMenuOpen && (
                        <motion.ul
                          role="listbox"
                          initial={{ opacity: 0, y: -6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.98 }}
                          transition={{ duration: 0.17, ease: EASE }}
                          className="absolute left-0 top-12 z-20 w-56 overflow-hidden rounded-xl border border-line dark:border-white/10 bg-white dark:bg-[#0D1322] py-1.5 shadow-card dark:shadow-2xl dark:shadow-black/90"
                        >
                          {remainingLocations.map((option) => (
                            <li key={option} role="option" aria-selected={false}>
                              <button
                                type="button"
                                onClick={() => {
                                  toggleLocation(option);
                                  setLocationMenuOpen(false);
                                }}
                                className="block w-full px-4 py-2 text-left text-[13.5px] font-medium text-ink-soft dark:text-slate-300 transition-colors duration-150 ease-smooth hover:bg-canvas dark:hover:bg-white/5 cursor-pointer"
                              >
                                {option}
                              </button>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {locations.length === 0 && (
                  <span className="text-[12.5px] font-light text-ink-faint dark:text-slate-500">
                    Add at least one location for better matches
                  </span>
                )}
              </div>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-auto flex flex-wrap items-center justify-end gap-4 pt-10">
            <AnimatePresence initial={false}>
              {!role && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18, ease: EASE }}
                  className="text-[12.5px] font-light text-ink-faint dark:text-slate-500"
                >
                  Select a career path to continue
                </motion.span>
              )}
            </AnimatePresence>
            <motion.button
              type="button"
              disabled={!role}
              onClick={() => router.push('/onboarding/cv-upload')}
              whileTap={role ? { scale: 0.985 } : undefined}
              className={`flex h-[52px] items-center gap-2.5 rounded-xl px-7 text-[15.5px] font-semibold text-white transition-[filter,background-color] duration-150 ease-smooth focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-blue/30 cursor-pointer ${
                role
                  ? 'bg-brand-blue dark:bg-[#4338CA] shadow-[0_16px_32px_-14px_rgba(27,87,224,0.7)] hover:brightness-105'
                  : 'cursor-not-allowed bg-[#C3CEE6] dark:bg-slate-800'
              }`}
            >
              Continue to CV Upload
              <ArrowRightIcon className="h-[18px] w-[18px]" strokeWidth={2.1} aria-hidden="true" />
            </motion.button>
          </div>
        </div>
      </main>
    </div>
  );
}
