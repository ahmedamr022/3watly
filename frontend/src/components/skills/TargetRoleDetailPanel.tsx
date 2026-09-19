'use client';

import React from 'react';
import {
  BriefcaseIcon,
  CalendarDaysIcon,
  ChevronLeftIcon,
  MapPinIcon,
  TrendingUpIcon,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { RoleItem } from '@/data/rolesData';

const BG = '/images/role-card-bg.png';

interface Props {
  role: RoleItem;
  labels: string[];
  activeIndex: number;
  onSelect: (i: number) => void;
  onConfirm: () => void;
}

export function TargetRoleDetailPanel({ role, onConfirm }: Props) {
  const rm = useReducedMotion();
  const t = role.theme;
  const Icon = role.icon;

  const stats = [
    { label: 'الموقع',      value: role.location,        icon: MapPinIcon,       ic: t.accent,   vc: '#fff'     },
    { label: 'الوظائف',     value: `${role.jobs} وظيفة`, icon: BriefcaseIcon,    ic: t.accent,   vc: '#fff'     },
    { label: 'النمو',       value: role.growth,           icon: TrendingUpIcon,   ic: '#34D399',  vc: '#34D399'  },
    { label: 'الراتب',      value: role.salary.replace('متوسط الراتب: ', ''), icon: CalendarDaysIcon, ic: t.accent, vc: '#fff' },
  ];

  return (
    <div
      className="relative w-full rounded-[20px] p-[1px] overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(140deg, ${t.borderActive}cc 0%, ${t.borderIdle}55 50%, ${t.borderActive}66 100%)`,
        boxShadow: `0 20px 50px rgba(0,0,0,0.7), 0 0 30px ${t.glow}44`,
      }}
    >
      <section
        dir="rtl"
        aria-live="polite"
        className="relative w-full overflow-hidden rounded-[19px]"
        style={{ backgroundColor: '#030b1c' }}
      >
        {/* Background artwork */}
        <img
          src={BG} alt="" aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-left opacity-40"
        />

        {/* Veil */}
        <div aria-hidden className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(270deg,rgba(3,9,24,.97) 0%,rgba(3,9,24,.85) 45%,rgba(3,9,24,.35) 80%,rgba(3,9,24,.05) 100%)' }} />

        {/* Role glow on right */}
        <div aria-hidden className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: `radial-gradient(100% 110% at 98% 50%,${t.glow} 0%,rgba(0,0,0,0) 60%)`, opacity: 0.4 }} />

        {/* Top gloss */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[1px]"
          style={{ backgroundImage: 'linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.25) 50%,rgba(255,255,255,0) 100%)' }} />

        <motion.div
          key={role.id}
          initial={{ opacity: 0, y: rm ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="relative flex flex-col sm:flex-row items-center gap-4 px-5 py-4"
        >
          {/* ── Left: Identity + CTA ── */}
          <div className="flex flex-col items-center sm:items-start gap-3 shrink-0 sm:w-[190px]">
            {/* Icon + title pill */}
            <div
              dir="ltr"
              className="flex items-center gap-3 rounded-[14px] border px-3 py-2"
              style={{
                borderColor: `${t.borderIdle}cc`,
                backgroundColor: 'rgba(6,26,52,0.75)',
                boxShadow: '0 10px 28px rgba(2,8,20,0.6), inset 0 1px 0 rgba(255,255,255,0.09)',
              }}
            >
              <span
                className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-[13px]"
                style={{
                  backgroundImage: `linear-gradient(155deg,${t.iconFrom} 0%,${t.iconTo} 100%)`,
                  boxShadow: `0 10px 22px ${t.glow},inset 0 2px 0 rgba(255,255,255,.28),inset 0 -8px 14px rgba(0,0,0,.2)`,
                }}
              >
                <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
                  style={{ backgroundImage: 'linear-gradient(180deg,rgba(255,255,255,.28),rgba(255,255,255,0))' }} />
                <Icon aria-hidden className="relative h-6 w-6 text-white" strokeWidth={1.8} />
              </span>
              <h3 className="text-[15px] font-extrabold leading-tight text-white line-clamp-2">
                {role.title}
              </h3>
            </div>

            {/* Description */}
            <p className="text-[12px] leading-relaxed text-slate-300/90 text-center sm:text-right line-clamp-3 max-w-[180px]">
              {role.description}
            </p>

            {/* CTA */}
            <button
              type="button"
              onClick={onConfirm}
              className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold text-white outline-none transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 cursor-pointer"
              style={{
                backgroundImage: 'linear-gradient(90deg,#8B5CF6 0%,#6366F1 52%,#2F80ED 100%)',
                boxShadow: '0 12px 28px rgba(91,63,222,0.55),inset 0 1px 0 rgba(255,255,255,.28)',
              }}
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/20">
                <ChevronLeftIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-[2px]" strokeWidth={3} />
              </span>
              اختيار هذا المسار
            </button>
          </div>

          {/* ── Divider ── */}
          <div className="hidden sm:block w-[1px] self-stretch"
            style={{ background: 'linear-gradient(180deg,rgba(21,48,85,0) 0%,rgba(21,48,85,1) 30%,rgba(21,48,85,1) 70%,rgba(21,48,85,0) 100%)' }} />

          {/* ── Right: stats + skills ── */}
          <div className="flex flex-1 flex-col gap-3 min-w-0">
            {/* 4 stat rows */}
            <div className="grid grid-cols-2 gap-2">
              {stats.map(({ label, value, icon: SI, ic, vc }) => (
                <div key={label} className="flex items-center justify-between gap-2 rounded-[10px] border border-[#1e3f6e] bg-[#06172f]/75 px-3 py-2"
                  style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)' }}>
                  <span className="text-[11px] font-semibold text-slate-300 shrink-0">{label}</span>
                  <span dir="ltr" className="flex items-center gap-1.5 min-w-0">
                    <SI aria-hidden className="h-[15px] w-[15px] shrink-0" style={{ color: ic }} strokeWidth={2.1} />
                    <span className="text-[12px] font-bold truncate" style={{ color: vc }}>{value}</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Skills chips */}
            <div dir="rtl" className="flex flex-wrap gap-1.5">
              {role.skills.map((sk) => {
                const SK = sk.icon;
                return (
                  <div key={sk.label}
                    className="inline-flex items-center gap-1.5 rounded-[10px] border border-[#1B3B6B] bg-[#05142C]/80 px-2.5 py-1.5"
                    style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)' }}
                  >
                    <SK aria-hidden className="h-[14px] w-[14px] shrink-0" style={{ color: t.accent }} strokeWidth={2} />
                    <span className="text-[11px] font-semibold text-slate-200 whitespace-nowrap">{sk.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
