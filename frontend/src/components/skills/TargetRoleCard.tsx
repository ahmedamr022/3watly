'use client';

import React from 'react';
import { BriefcaseIcon, FlameIcon, MapPinIcon, TrendingUpIcon } from 'lucide-react';
import { CardWaves } from './CardWaves';
import { RoleItem } from '@/data/rolesData';

interface TargetRoleCardProps {
  role: RoleItem;
  isActive: boolean;
  width: number;
  height: number;
  onSelect: () => void;
}

interface StatProps {
  icon: React.ElementType;
  value: string;
  iconColor: string;
  valueColor: string;
}

function Stat({ icon: Icon, value, iconColor, valueColor }: StatProps) {
  return (
    <span className="flex items-center gap-1 whitespace-nowrap">
      <Icon
        aria-hidden="true"
        className="h-[13px] w-[13px] shrink-0"
        style={{ color: iconColor }}
        strokeWidth={2.2}
      />
      <span className="text-[11px] font-bold leading-none" style={{ color: valueColor }}>
        {value}
      </span>
    </span>
  );
}

export function TargetRoleCard({
  role,
  isActive,
  width,
  height,
  onSelect,
}: TargetRoleCardProps) {
  const t = role.theme;
  const Icon = role.icon;
  const tile = isActive ? 56 : 46;
  const glyph = isActive ? 28 : 22;
  const pad = isActive ? 18 : 14;

  const hairline = isActive
    ? `linear-gradient(150deg, ${t.borderActive} 0%, ${t.borderActive}cc 38%, ${t.borderActive}4d 72%, ${t.borderActive}99 100%)`
    : `linear-gradient(150deg, ${t.borderActive}80 0%, ${t.borderIdle}b3 38%, ${t.borderIdle}40 100%)`;

  return (
    <div
      dir="rtl"
      aria-current={isActive ? 'true' : undefined}
      className="relative"
      style={{
        width,
        height,
        transition: 'width 420ms cubic-bezier(0.22, 1, 0.36, 1), height 420ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {/* detached outer ring — the signature glow of the featured card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[7px] rounded-[30px] border"
        style={{
          borderColor: t.borderActive,
          opacity: isActive ? 0.85 : 0,
          boxShadow: `0 0 22px ${t.glow}, inset 0 0 22px ${t.glow}`,
          transition: 'opacity 300ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />

      {/* hairline border wrapper */}
      <div
        className="relative h-full w-full rounded-[23px] p-px"
        style={{
          backgroundImage: hairline,
          boxShadow: isActive
            ? `0 0 40px ${t.glow}, 0 34px 70px rgba(0,0,0,0.7)`
            : `0 22px 48px rgba(0,0,0,0.6)`,
          transition: 'box-shadow 300ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div
          className="relative h-full w-full overflow-hidden rounded-[22px]"
          style={{
            backgroundImage: `radial-gradient(120% 78% at 16% -6%, ${t.surfaceTop} 0%, rgba(0,0,0,0) 68%), linear-gradient(168deg, ${t.surfaceTop}55 0%, ${t.surfaceBottom} 62%, #000000 100%)`,
            backgroundColor: t.surfaceBottom,
          }}
        >
          <CardWaves color={t.accent} strong={isActive} uid={role.id} />

          {/* bloom behind the icon tile */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-10 -top-12 h-52 w-52 rounded-full"
            style={{
              background: `radial-gradient(closest-side, ${t.bloom}, rgba(0,0,0,0))`,
              opacity: isActive ? 1 : 0.5,
              transition: 'opacity 300ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />

          {/* top gloss */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              backgroundImage:
                'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)',
            }}
          />

          {/* bottom vignette */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
            style={{
              backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 100%)',
            }}
          />

          <div className="relative flex h-full flex-col" style={{ padding: pad }}>
            {/* icon tile on the left, "most wanted" badge on the right */}
            <div dir="ltr" className="flex items-start justify-between">
              <span
                className="relative grid shrink-0 place-items-center overflow-hidden"
                style={{
                  width: tile,
                  height: tile,
                  borderRadius: isActive ? 22 : 19,
                  backgroundImage: `linear-gradient(158deg, ${t.iconFrom} 0%, ${t.iconTo} 100%)`,
                  boxShadow: `0 16px 34px ${t.glow}, 0 2px 0 rgba(255,255,255,0.25) inset, 0 -14px 22px rgba(0,0,0,0.22) inset`,
                  transition:
                    'width 420ms cubic-bezier(0.22, 1, 0.36, 1), height 420ms cubic-bezier(0.22, 1, 0.36, 1), border-radius 420ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
                  style={{
                    backgroundImage:
                      'linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 100%)',
                  }}
                />
                <Icon
                  aria-hidden="true"
                  style={{ width: glyph, height: glyph }}
                  strokeWidth={1.7}
                  className="relative text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
                />
              </span>

              {role.hot ? (
                <span
                  dir="rtl"
                  className="mt-1 inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-bold leading-none text-white"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #1668C9 0%, #2E90F2 100%)',
                    boxShadow:
                      '0 10px 24px rgba(29,111,209,0.55), inset 0 1px 0 rgba(255,255,255,0.3)',
                  }}
                >
                  <FlameIcon
                    aria-hidden="true"
                    className="h-[12px] w-[12px] text-[#FF8A3D]"
                    fill="currentColor"
                    strokeWidth={1.4}
                  />
                  الأكثر طلباً
                </span>
              ) : null}
            </div>

            {/* breathing room */}
            <div aria-hidden="true" className="flex-1" />

            <h3
              className="text-center font-extrabold leading-tight text-white"
              style={{
                fontSize: isActive ? 19 : 15,
                transition: 'font-size 420ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <button
                type="button"
                onClick={onSelect}
                className="static text-inherit outline-none before:absolute before:inset-0 before:z-10 before:rounded-[22px] before:content-[''] focus-visible:before:ring-2 focus-visible:before:ring-white/80"
              >
                {role.title}
              </button>
            </h3>

            {role.subtitle ? (
              <p
                dir="ltr"
                className="mt-0.5 text-center font-bold leading-tight text-white/95"
                style={{
                  fontSize: isActive ? 15 : 12,
                  transition: 'font-size 420ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                {role.subtitle}
              </p>
            ) : null}

            <p
              className="mt-2 text-center leading-[1.75] text-slate-300/85"
              style={{
                fontSize: isActive ? 12 : 10.5,
                transition: 'font-size 420ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {role.description}
            </p>

            {/* stats bar */}
            <div
              dir="ltr"
              className="mt-3 flex items-center justify-between rounded-[11px] border px-2.5 py-2"
              style={{
                borderColor: `${t.borderIdle}99`,
                backgroundColor: 'rgba(255,255,255,0.055)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
            >
              <Stat
                icon={TrendingUpIcon}
                value={role.growth}
                iconColor="#34D399"
                valueColor="#34D399"
              />
              <Stat
                icon={BriefcaseIcon}
                value={`${role.jobs} وظيفة`}
                iconColor={t.accent}
                valueColor="#E8EEF7"
              />
              <Stat
                icon={MapPinIcon}
                value={role.location}
                iconColor={t.accent}
                valueColor="#E8EEF7"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
