"use client";

import React from 'react';
import { Briefcase, Flame, MapPin, TrendingUp, Check } from 'lucide-react';
import { CardWaves } from './CardWaves';
import { RoleItem } from '@/data/rolesData';

interface TargetRoleCardProps {
  role: RoleItem;
  isActive: boolean;
  isCurrentSavedRole?: boolean;
  readinessPct?: number;
  width: number;
  height: number;
  onSelect: () => void;
  isAr?: boolean;
}

export function TargetRoleCard({
  role,
  isActive,
  isCurrentSavedRole = false,
  readinessPct = 0,
  width,
  height,
  onSelect,
  isAr = true,
}: TargetRoleCardProps) {
  const t = role.theme;
  const Icon = role.icon;
  const tile = isActive ? 64 : 54;
  const glyph = isActive ? 30 : 25;
  const pad = isActive ? 20 : 16;

  const hairlineDark = isActive
    ? `linear-gradient(150deg, ${t.borderActive} 0%, ${t.borderActive}cc 38%, ${t.borderActive}4d 72%, ${t.borderActive}99 100%)`
    : `linear-gradient(150deg, ${t.borderActive}80 0%, ${t.borderIdle}b3 38%, ${t.borderIdle}40 100%)`;

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      aria-current={isActive ? 'true' : undefined}
      style={{ width, height }}
      className="relative transition-[width,height,transform] duration-300 ease-out select-none"
    >
      {/* Detached signature glow ring for the featured / active card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[6px] rounded-[28px] border transition-opacity duration-300"
        style={{
          borderColor: t.borderActive,
          opacity: isActive ? 0.9 : 0,
          boxShadow: `0 0 24px ${t.glow}, inset 0 0 24px ${t.glow}`,
        }}
      />

      {/* Hairline border wrapper */}
      <div
        className="relative h-full w-full rounded-[24px] p-px transition-shadow duration-300 cursor-pointer"
        onClick={onSelect}
        style={{
          backgroundImage: hairlineDark,
          boxShadow: isActive
            ? `0 0 35px ${t.glow}, 0 20px 45px rgba(0,0,0,0.5)`
            : `0 10px 25px rgba(0,0,0,0.25)`,
        }}
      >
        <div
          className="relative h-full w-full overflow-hidden rounded-[23px] flex flex-col justify-between"
          style={{
            backgroundColor: t.surfaceBottom,
          }}
        >
          {/* Background image overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[url('/images/role-card-bg.png')] bg-cover bg-center opacity-30 dark:opacity-40 mix-blend-overlay"
          />

          {/* Light Mode Surface Gradient */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-slate-50/95 dark:hidden"
          />

          {/* Dark Mode Radial and Linear Surface Gradient */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden dark:block"
            style={{
              backgroundImage: `radial-gradient(120% 78% at 16% -6%, ${t.surfaceTop} 0%, rgba(0,0,0,0) 68%), linear-gradient(168deg, ${t.surfaceTop}55 0%, ${t.surfaceBottom} 62%, #020612 100%)`,
            }}
          />

          {/* Flowing SVG Waves */}
          <CardWaves color={t.accent} strong={isActive} uid={role.id} />

          {/* Bloom behind icon */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-8 -top-10 h-44 w-44 rounded-full transition-opacity duration-300"
            style={{
              background: `radial-gradient(closest-side, ${t.bloom}, rgba(0,0,0,0))`,
              opacity: isActive ? 1 : 0.4,
            }}
          />

          {/* Top gloss */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
          />

          {/* Card Content Container */}
          <div className="relative flex h-full flex-col justify-between z-10" style={{ padding: pad }}>
            {/* Top Row: Icon tile + Hot Badge / Current Badge */}
            <div className="flex items-start justify-between gap-2">
              <span
                className="relative grid shrink-0 place-items-center overflow-hidden transition-all duration-300"
                style={{
                  width: tile,
                  height: tile,
                  borderRadius: isActive ? 18 : 15,
                  backgroundImage: `linear-gradient(158deg, ${t.iconFrom} 0%, ${t.iconTo} 100%)`,
                  boxShadow: `0 10px 20px ${t.glow}, inset 0 1px 0 rgba(255,255,255,0.35)`,
                }}
              >
                <Icon
                  aria-hidden="true"
                  style={{ width: glyph, height: glyph }}
                  strokeWidth={2}
                  className="relative text-white drop-shadow-md"
                />
              </span>

              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                {isCurrentSavedRole && (
                  <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-extrabold text-emerald-950 bg-emerald-400 shadow-sm border border-emerald-300">
                    <Check className="h-3 w-3" strokeWidth={3} />
                    {isAr ? 'مسارك الحالي' : 'Current Role'}
                  </span>
                )}

                {role.hot && (
                  <span
                    className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow-md"
                    style={{
                      backgroundImage: 'linear-gradient(90deg, #1668C9 0%, #2E90F2 100%)',
                      boxShadow: '0 4px 12px rgba(29,111,209,0.45)',
                    }}
                  >
                    <Flame className="h-3 w-3 text-[#FFB347]" fill="currentColor" />
                    {isAr ? 'الأكثر طلباً' : 'Most In-Demand'}
                  </span>
                )}
              </div>
            </div>

            {/* Middle: Title, Subtitle, Description */}
            <div className="my-auto space-y-1 pt-2">
              <h3
                className="font-black leading-tight text-slate-900 dark:text-white transition-all duration-300"
                style={{ fontSize: isActive ? 20 : 17 }}
              >
                {isAr ? role.title : role.titleEn}
              </h3>

              {role.subtitle && (
                <p
                  className="font-bold text-slate-600 dark:text-slate-300 leading-tight"
                  style={{ fontSize: isActive ? 13 : 11.5 }}
                >
                  {role.subtitle}
                </p>
              )}

              <p
                className="leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2 pt-0.5"
                style={{ fontSize: isActive ? 12 : 11 }}
              >
                {role.description}
              </p>
            </div>

            {/* Bottom Row: Stats Bar */}
            <div
              className="flex items-center justify-between rounded-xl border px-3 py-2 text-[11.5px] font-bold border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/5 backdrop-blur-md"
            >
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5 shrink-0" />
                <span>{role.growth}</span>
              </span>

              <span className="flex items-center gap-1 text-slate-700 dark:text-slate-200 font-medium">
                <Briefcase className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>{role.jobs} {isAr ? 'وظيفة' : 'jobs'}</span>
              </span>

              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
                <MapPin className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>{isAr ? 'مصر' : 'Egypt'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
