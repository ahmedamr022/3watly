'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  TargetIcon,
  XIcon,
} from 'lucide-react';
import { useSkillPlan } from '@/contexts/SkillPlanContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { TARGET_ROLES } from '@/data/rolesData';
import { TargetRoleCard } from './TargetRoleCard';
import { TargetRoleDetailPanel } from './TargetRoleDetailPanel';
import { CarouselDots } from './CarouselDots';

interface TargetRoleModalProps {
  open: boolean;
  onClose: () => void;
}

// ── Carousel geometry ─────────────────────────────────────────────────────────

interface CardMetrics {
  idleWidth: number;
  activeWidth: number;
  idleHeight: number;
  activeHeight: number;
  gap: number;
}

const WIDE: CardMetrics = {
  idleWidth: 224,
  activeWidth: 262,
  idleHeight: 242,
  activeHeight: 280,
  gap: 18,
};

const COMPACT: CardMetrics = {
  idleWidth: 172,
  activeWidth: 210,
  idleHeight: 224,
  activeHeight: 260,
  gap: 12,
};

/** How many cards are rendered on each side of the focused one. */
const SPAN = 3;

/** Depth treatment per distance from the focused card. */
const DEPTH = [
  { rotate: 0,  z: 0,    scale: 1,     opacity: 1    },
  { rotate: 11, z: -70,  scale: 0.975, opacity: 0.94 },
  { rotate: 15, z: -150, scale: 0.94,  opacity: 0.72 },
  { rotate: 17, z: -220, scale: 0.9,   opacity: 0    },
];

function mod(value: number, length: number) {
  return ((value % length) + length) % length;
}

/** Horizontal distance from the track centre to the centre of slot `offset`. */
function slotX(offset: number, m: CardMetrics) {
  if (offset === 0) return 0;
  const steps = Math.abs(offset);
  const distance =
    m.activeWidth / 2 + m.gap + m.idleWidth / 2 + (steps - 1) * (m.idleWidth + m.gap);
  return Math.sign(offset) * distance;
}

function useCardMetrics(containerRef: React.RefObject<HTMLDivElement>): CardMetrics {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 700px)');
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return compact ? COMPACT : WIDE;
}

// ── Arrow button ─────────────────────────────────────────────────────────────

interface ArrowButtonProps {
  side: 'left' | 'right';
  label: string;
  onClick: () => void;
}

function ArrowButton({ side, label, onClick }: ArrowButtonProps) {
  const Icon = side === 'left' ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 z-[60] hidden h-[54px] w-[54px] -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-slate-300 outline-none backdrop-blur-md transition-[background-color,border-color,color,transform] duration-200 hover:border-white/30 hover:bg-white/[0.11] hover:text-white focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#04060f] active:scale-95 md:grid ${
        side === 'left' ? 'left-0' : 'right-0'
      }`}
      style={{
        boxShadow: '0 14px 34px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.14)',
      }}
    >
      <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={2.2} />
    </button>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

export function TargetRoleModal({ open, onClose }: TargetRoleModalProps) {
  const { roleId, setRoleId } = useSkillPlan();
  const { isAr } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null!);
  const touchStartX = useRef<number | null>(null);

  /** Unbounded position so the carousel can loop forever in both directions. */
  const [position, setPosition] = useState(1);
  const metrics = useCardMetrics(containerRef);

  // Sync position when modal opens to the currently saved role
  useEffect(() => {
    if (open) {
      const idx = TARGET_ROLES.findIndex((r) => r.id === roleId);
      if (idx >= 0) setPosition(idx);
    }
  }, [open, roleId]);

  const labels = useMemo(() => TARGET_ROLES.map((role) => role.title), []);
  const activeIndex = mod(position, TARGET_ROLES.length);
  const activeRole = TARGET_ROLES[activeIndex];
  const isCurrentSavedRole = activeRole.id === roleId;

  const step = useCallback((delta: number) => {
    setPosition((current) => current + delta);
  }, []);

  const goToIndex = useCallback((index: number) => {
    setPosition((current) => {
      const half = TARGET_ROLES.length / 2;
      let delta = index - mod(current, TARGET_ROLES.length);
      if (delta > half) delta -= TARGET_ROLES.length;
      if (delta < -half) delta += TARGET_ROLES.length;
      return current + delta;
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        step(isAr ? -1 : 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        step(isAr ? 1 : -1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, isAr, step, onClose]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 44) step(delta < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  const slots = useMemo(() => {
    const result: { key: number; offset: number; roleIndex: number }[] = [];
    for (let offset = -SPAN; offset <= SPAN; offset += 1) {
      const key = position + offset;
      result.push({ key, offset, roleIndex: mod(key, TARGET_ROLES.length) });
    }
    return result;
  }, [position]);

  const handleConfirm = () => {
    setRoleId(activeRole.id);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="target-roles-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 sm:p-6 backdrop-blur-xl"
      style={{
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        dir={isAr ? 'rtl' : 'ltr'}
        ref={containerRef}
        className="relative w-full max-w-6xl rounded-[28px] my-auto"
        style={{
          background: '#04060f',
          boxShadow: '0 40px 100px rgba(0,0,0,0.85)',
          animation: 'slideUp 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute right-5 top-5 z-[70] grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-slate-300 outline-none backdrop-blur-md transition-[background-color,color] duration-200 hover:bg-white/[0.12] hover:text-white focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#04060f]"
          style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.5)' }}
        >
          <XIcon className="h-5 w-5" strokeWidth={2.2} />
        </button>

        {/* ambient background blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-52 -top-56 h-[560px] w-[680px] rounded-full"
          style={{
            background:
              'radial-gradient(closest-side, rgba(88,28,180,0.55), rgba(88,28,180,0))',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-24 h-[420px] w-[420px] rounded-full"
          style={{
            background:
              'radial-gradient(closest-side, rgba(38,64,190,0.28), rgba(38,64,190,0))',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-8 top-10 hidden h-24 w-40 opacity-50 lg:block"
          style={{
            backgroundImage:
              'radial-gradient(rgba(150,132,255,0.6) 1.4px, transparent 1.4px)',
            backgroundSize: '14px 14px',
          }}
        />

        {/* Inner container with overflow hidden for rounded corners */}
        <div className="relative overflow-hidden rounded-[28px] py-10 sm:py-12 lg:py-14">
          <div className="relative mx-auto w-full max-w-[1460px] px-4 sm:px-6">

            {/* ── header ───────────────────────────────────────────── */}
            <header className="mx-auto max-w-[1000px] text-center">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
                <span
                  id="target-roles-title"
                  className="relative grid h-[58px] w-[58px] shrink-0 place-items-center overflow-hidden rounded-[20px]"
                  style={{
                    backgroundImage:
                      'linear-gradient(145deg, #A78BFA 0%, #6D28D9 48%, #2563EB 100%)',
                    boxShadow:
                      '0 14px 32px rgba(109,40,217,0.55), inset 0 2px 0 rgba(255,255,255,0.32), inset 0 -12px 18px rgba(0,0,0,0.25)',
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
                  <TargetIcon
                    aria-hidden="true"
                    className="relative h-8 w-8 text-white"
                    strokeWidth={2}
                  />
                </span>

                <h2 className="text-[22px] font-extrabold leading-tight text-white sm:text-[28px] lg:text-[34px]">
                  أكثر المسمى الوظيفي{' '}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        'linear-gradient(90deg, #C084FC 0%, #F472B6 100%)',
                    }}
                  >
                    المستهدف
                  </span>
                </h2>

                <SparklesIcon
                  aria-hidden="true"
                  className="h-7 w-7 shrink-0 text-[#93C5FD]"
                  strokeWidth={2}
                  fill="currentColor"
                  fillOpacity={0.25}
                />
              </div>

              <p className="mx-auto mt-4 max-w-[860px] text-[15px] leading-[1.9] text-slate-400 sm:text-[17px]">
                يتم إعادة حساب مهاراتك وواجباتك والوظائف المطابقة لك بناءً على المسمى الذي
                تختاره.
              </p>
            </header>

            {/* ── carousel ─────────────────────────────────────────── */}
            <div
              className="relative mt-10 sm:mt-12"
              role="group"
              aria-roledescription="carousel"
              aria-label="المسميات الوظيفية المستهدفة"
            >
              <ArrowButton side="right" label="المسمى التالي" onClick={() => step(1)} />
              <ArrowButton side="left" label="المسمى السابق" onClick={() => step(-1)} />

              <div className="md:px-[96px]">
                <div
                  className="relative overflow-hidden"
                  style={{
                    height: metrics.activeHeight + 74,
                    perspective: '1700px',
                    perspectiveOrigin: '50% 50%',
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  {slots.map(({ key, offset, roleIndex }) => {
                    const distance = Math.min(Math.abs(offset), DEPTH.length - 1);
                    const depth = DEPTH[distance];
                    const direction = Math.sign(offset);
                    const isActive = offset === 0;
                    const role = TARGET_ROLES[roleIndex];

                    return (
                      <div
                        key={key}
                        className="absolute left-1/2 top-1/2"
                        style={{
                          transformOrigin: 'center center',
                          transform: `translate(-50%, -50%) translateX(${slotX(
                            offset,
                            metrics
                          )}px) translateZ(${depth.z}px) rotateY(${
                            -direction * depth.rotate
                          }deg) scale(${depth.scale})`,
                          opacity: depth.opacity,
                          pointerEvents: depth.opacity === 0 ? 'none' : 'auto',
                          zIndex: 40 - distance,
                          willChange: 'transform, opacity',
                          transition:
                            'transform 460ms cubic-bezier(0.22, 1, 0.36, 1), opacity 460ms cubic-bezier(0.22, 1, 0.36, 1)',
                        }}
                      >
                        <TargetRoleCard
                          role={role}
                          isActive={isActive}
                          width={isActive ? metrics.activeWidth : metrics.idleWidth}
                          height={isActive ? metrics.activeHeight : metrics.idleHeight}
                          onSelect={() => step(offset)}
                        />
                      </div>
                    );
                  })}

                  {/* soften the clipped edges of the deck */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 z-[45] w-14 sm:w-20"
                    style={{
                      backgroundImage:
                        'linear-gradient(90deg, #04060f 0%, rgba(4,6,15,0) 100%)',
                    }}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-0 z-[45] w-14 sm:w-20"
                    style={{
                      backgroundImage:
                        'linear-gradient(270deg, #04060f 0%, rgba(4,6,15,0) 100%)',
                    }}
                  />
                </div>
              </div>
            </div>

            <CarouselDots
              labels={labels}
              activeIndex={activeIndex}
              onSelect={goToIndex}
              className="mt-4 justify-center"
            />

            {/* ── detail panel ─────────────────────────────────────── */}
            <div className="mt-8 sm:mt-10">
              <TargetRoleDetailPanel
                role={activeRole}
                labels={labels}
                activeIndex={activeIndex}
                onSelect={goToIndex}
                onConfirm={handleConfirm}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
