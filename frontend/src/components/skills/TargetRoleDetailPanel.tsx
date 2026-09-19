'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BriefcaseIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
  MapPinIcon,
  TrendingUpIcon,
} from 'lucide-react';
import { CarouselDots } from './CarouselDots';
import { RoleItem } from '@/data/rolesData';

const PANEL_BACKGROUND = '/images/role-card-bg.png';

interface TargetRoleDetailPanelProps {
  role: RoleItem;
  labels: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onConfirm: () => void;
}

interface DetailRow {
  label: string;
  value: string;
  icon: React.ElementType;
  iconColor: string;
  valueColor: string;
}

export function TargetRoleDetailPanel({
  role,
  labels,
  activeIndex,
  onSelect,
  onConfirm,
}: TargetRoleDetailPanelProps) {
  const reduceMotion = useReducedMotion();
  const t = role.theme;
  const Icon = role.icon;

  const rows: DetailRow[] = [
    {
      label: 'الموقع',
      value: role.location,
      icon: MapPinIcon,
      iconColor: t.accent,
      valueColor: '#FFFFFF',
    },
    {
      label: 'عدد الوظائف',
      value: `${role.jobs} وظيفة`,
      icon: BriefcaseIcon,
      iconColor: t.accent,
      valueColor: '#FFFFFF',
    },
    {
      label: 'نسبة النمو',
      value: role.growth,
      icon: TrendingUpIcon,
      iconColor: '#34D399',
      valueColor: '#34D399',
    },
    {
      label: 'الراتب',
      value: role.salary,
      icon: CalendarDaysIcon,
      iconColor: t.accent,
      valueColor: '#FFFFFF',
    },
  ];

  return (
    <div
      className="relative w-full rounded-[27px] p-px"
      style={{
        backgroundImage: `linear-gradient(150deg, ${t.borderActive}b3 0%, ${t.borderIdle}66 40%, ${t.borderActive}4d 100%)`,
        boxShadow: `0 34px 84px rgba(0,0,0,0.72), 0 0 40px ${t.glow}`,
      }}
    >
      <section
        dir="rtl"
        aria-live="polite"
        aria-label={`تفاصيل ${role.title}`}
        className="relative w-full overflow-hidden rounded-[26px]"
        style={{ backgroundColor: '#030b1c' }}
      >
        {/* Background artwork */}
        <img
          src={PANEL_BACKGROUND}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-left"
        />

        {/* readability veil */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden lg:block"
          style={{
            backgroundImage:
              'linear-gradient(270deg, rgba(3,9,24,0.95) 0%, rgba(3,9,24,0.88) 42%, rgba(3,9,24,0.44) 72%, rgba(3,9,24,0.05) 100%)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[#030b1c]/88 lg:hidden"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(110% 120% at 100% 50%, ${t.glow} 0%, rgba(0,0,0,0) 62%)`,
            opacity: 0.5,
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0) 100%)',
          }}
        />

        <motion.div
          key={role.id}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
          className="relative grid grid-cols-12 gap-6 p-6 pb-14 sm:p-7 sm:pb-14 lg:min-h-[348px] lg:gap-7"
        >
          {/* ── right: quick facts ─────────────────────────────── */}
          <div className="order-2 col-span-12 flex flex-col justify-center gap-3 border-t border-[#153055] pt-5 lg:order-1 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
            {rows.map((row) => {
              const RowIcon = row.icon;
              return (
                <div key={row.label} className="flex items-center justify-between gap-4">
                  <span
                    className="shrink-0 rounded-[11px] border border-[#204775] bg-[#06172F]/80 px-4 py-[7px] text-[13px] font-semibold leading-none text-slate-200"
                    style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)' }}
                  >
                    {row.label}
                  </span>
                  <span dir="ltr" className="flex min-w-0 items-center gap-2 text-right">
                    <RowIcon
                      aria-hidden="true"
                      className="h-[19px] w-[19px] shrink-0"
                      style={{ color: row.iconColor }}
                      strokeWidth={2.1}
                    />
                    <span
                      className="truncate text-[15px] font-bold leading-none"
                      style={{ color: row.valueColor }}
                    >
                      {row.value}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>

          {/* ── middle: identity, summary, skills ──────────────── */}
          <div className="order-1 col-span-12 flex flex-col items-center justify-center gap-4 text-center lg:order-2 lg:col-span-5">
            <div
              dir="ltr"
              className="flex items-center gap-4 rounded-[18px] border py-2 pl-2 pr-5"
              style={{
                borderColor: `${t.borderIdle}cc`,
                backgroundColor: 'rgba(6, 26, 52, 0.72)',
                boxShadow:
                  '0 14px 34px rgba(2,8,20,0.7), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              <span
                className="relative grid h-[54px] w-[54px] shrink-0 place-items-center overflow-hidden rounded-[16px]"
                style={{
                  backgroundImage: `linear-gradient(158deg, ${t.iconFrom} 0%, ${t.iconTo} 100%)`,
                  boxShadow: `0 12px 26px ${t.glow}, inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -10px 16px rgba(0,0,0,0.22)`,
                }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
                  style={{
                    backgroundImage:
                      'linear-gradient(180deg, rgba(255,255,255,0.3), rgba(255,255,255,0))',
                  }}
                />
                <Icon
                  aria-hidden="true"
                  className="relative h-7 w-7 text-white"
                  strokeWidth={1.8}
                />
              </span>
              <h3 className="text-[24px] font-extrabold leading-none text-white sm:text-[27px]">
                {role.title}
              </h3>
            </div>

            <p className="max-w-[460px] text-[15px] leading-[1.9] text-slate-300 sm:text-[15.5px]">
              {role.description}
            </p>

            <ul dir="rtl" className="flex flex-wrap items-stretch justify-center gap-3">
              {role.skills.map((skill) => {
                const SkillIcon = skill.icon;
                return (
                  <li
                    key={skill.label}
                    className="flex min-w-[104px] flex-1 flex-col items-center justify-center gap-1.5 rounded-[14px] border border-[#1B3B6B] bg-[#05142C]/80 px-3 py-2.5"
                    style={{
                      boxShadow:
                        'inset 0 1px 0 rgba(255,255,255,0.09), 0 10px 22px rgba(0,0,0,0.45)',
                    }}
                  >
                    <SkillIcon
                      aria-hidden="true"
                      className="h-[22px] w-[22px]"
                      style={{ color: t.accent }}
                      strokeWidth={2}
                    />
                    <span className="text-[12.5px] font-semibold leading-tight text-slate-200">
                      {skill.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ── left: CTA ──────────────── */}
          <div className="order-3 col-span-12 flex items-end lg:col-span-3">
            <button
              type="button"
              onClick={onConfirm}
              className="group/cta inline-flex w-full max-w-[320px] items-center justify-center gap-3 rounded-full px-6 py-3.5 text-[16px] font-bold text-white outline-none transition-[transform,filter] duration-200 hover:-translate-y-[2px] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#03091a] active:translate-y-0"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #8B5CF6 0%, #6366F1 52%, #2F80ED 100%)',
                boxShadow:
                  '0 16px 38px rgba(91,63,222,0.6), inset 0 1px 0 rgba(255,255,255,0.3)',
              }}
            >
              <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full bg-white/20">
                <ChevronRightIcon
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-[2px]"
                  strokeWidth={3}
                />
              </span>
              اختيار هذا المسار الوظيفي
            </button>
          </div>
        </motion.div>

        <CarouselDots
          labels={labels}
          activeIndex={activeIndex}
          onSelect={onSelect}
          size="sm"
          className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 lg:left-auto lg:right-8 lg:translate-x-0"
        />
      </section>
    </div>
  );
}
