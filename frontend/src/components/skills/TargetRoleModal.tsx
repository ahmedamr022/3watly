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

// ── Card sizes (contained within modal width) ─────────────────────────────────

interface CardMetrics {
  idleWidth: number;
  activeWidth: number;
  idleHeight: number;
  activeHeight: number;
  gap: number;
}

const WIDE: CardMetrics = {
  idleWidth: 210,
  activeWidth: 248,
  idleHeight: 232,
  activeHeight: 270,
  gap: 16,
};

const COMPACT: CardMetrics = {
  idleWidth: 158,
  activeWidth: 192,
  idleHeight: 208,
  activeHeight: 244,
  gap: 10,
};

const SPAN = 3;

const DEPTH = [
  { rotate: 0,  z: 0,    scale: 1,     opacity: 1    },
  { rotate: 10, z: -60,  scale: 0.97,  opacity: 0.9  },
  { rotate: 14, z: -130, scale: 0.93,  opacity: 0.65 },
  { rotate: 16, z: -200, scale: 0.88,  opacity: 0    },
];

function mod(value: number, length: number) {
  return ((value % length) + length) % length;
}

function slotX(offset: number, m: CardMetrics) {
  if (offset === 0) return 0;
  const steps = Math.abs(offset);
  const distance =
    m.activeWidth / 2 + m.gap + m.idleWidth / 2 + (steps - 1) * (m.idleWidth + m.gap);
  return Math.sign(offset) * distance;
}

function useCardMetrics(): CardMetrics {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 640px)');
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);
  return compact ? COMPACT : WIDE;
}

// ── Main modal ────────────────────────────────────────────────────────────────

export function TargetRoleModal({ open, onClose }: TargetRoleModalProps) {
  const { roleId, setRoleId } = useSkillPlan();
  const { isAr } = useLanguage();
  const touchStartX = useRef<number | null>(null);
  const [position, setPosition] = useState(0);
  const metrics = useCardMetrics();

  // Sync to currently saved role on open
  useEffect(() => {
    if (open) {
      const idx = TARGET_ROLES.findIndex((r) => r.id === roleId);
      setPosition(idx >= 0 ? idx : 0);
    }
  }, [open, roleId]);

  const labels = useMemo(() => TARGET_ROLES.map((r) => r.title), []);
  const activeIndex = mod(position, TARGET_ROLES.length);
  const activeRole = TARGET_ROLES[activeIndex];

  const step = useCallback((delta: number) => {
    setPosition((p) => p + delta);
  }, []);

  const goToIndex = useCallback((index: number) => {
    setPosition((p) => {
      const half = TARGET_ROLES.length / 2;
      let delta = index - mod(p, TARGET_ROLES.length);
      if (delta > half) delta -= TARGET_ROLES.length;
      if (delta < -half) delta += TARGET_ROLES.length;
      return p + delta;
    });
  }, []);

  // Keyboard nav
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') { e.preventDefault(); step(isAr ? -1 : 1); }
      else if (e.key === 'ArrowLeft')  { e.preventDefault(); step(isAr ? 1 : -1); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, isAr, step, onClose]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const d = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(d) > 44) step(d < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  const slots = useMemo(() => {
    const out: { key: number; offset: number; roleIndex: number }[] = [];
    for (let o = -SPAN; o <= SPAN; o++) {
      out.push({ key: position + o, offset: o, roleIndex: mod(position + o, TARGET_ROLES.length) });
    }
    return out;
  }, [position]);

  const handleConfirm = () => {
    setRoleId(activeRole.id);
    onClose();
  };

  if (!open) return null;

  const carouselH = metrics.activeHeight + 40;

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
        style={{ animation: 'fadeIn 0.18s ease-out' }}
      />

      {/* ── Modal shell ──────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="trm-title"
        dir={isAr ? 'rtl' : 'ltr'}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 pointer-events-none"
      >
        <div
          className="pointer-events-auto relative w-full max-w-[960px] max-h-[92vh] flex flex-col overflow-hidden rounded-[24px]"
          style={{
            background: 'linear-gradient(170deg, #070C20 0%, #04060f 60%, #060813 100%)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.07)',
            animation: 'slideUp 0.25s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {/* Ambient glow blobs (clipped inside modal) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-32 -top-32 h-80 w-96 rounded-full"
            style={{ background: 'radial-gradient(closest-side, rgba(88,28,180,0.5), rgba(88,28,180,0))' }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 -top-20 h-56 w-72 rounded-full"
            style={{ background: 'radial-gradient(closest-side, rgba(38,64,190,0.25), rgba(38,64,190,0))' }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-6 top-6 hidden h-16 w-28 opacity-40 lg:block"
            style={{
              backgroundImage: 'radial-gradient(rgba(150,132,255,0.6) 1.4px, transparent 1.4px)',
              backgroundSize: '12px 12px',
            }}
          />

          {/* ── Header ─────────────────────────────────────────── */}
          <div className="relative shrink-0 px-6 pt-6 pb-4 text-center">
            {/* Close btn */}
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق"
              className="absolute top-4 right-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-slate-300 outline-none transition-colors duration-200 hover:bg-white/[0.12] hover:text-white focus-visible:ring-2 focus-visible:ring-sky-400 cursor-pointer"
              style={{ boxShadow: '0 6px 16px rgba(0,0,0,0.5)' }}
            >
              <XIcon className="h-4 w-4" strokeWidth={2.5} />
            </button>

            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
              {/* Icon badge */}
              <span
                className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-[14px]"
                style={{
                  backgroundImage: 'linear-gradient(145deg, #A78BFA 0%, #6D28D9 48%, #2563EB 100%)',
                  boxShadow: '0 10px 24px rgba(109,40,217,0.55), inset 0 2px 0 rgba(255,255,255,0.3)',
                }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
                  style={{ backgroundImage: 'linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,255,255,0))' }}
                />
                <TargetIcon id="trm-title" aria-hidden="true" className="relative h-6 w-6 text-white" strokeWidth={2} />
              </span>

              <h2 className="text-[19px] font-extrabold leading-tight text-white sm:text-[22px]">
                أكثر المسمى الوظيفي{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(90deg,#C084FC 0%,#F472B6 100%)' }}
                >
                  المستهدف
                </span>
              </h2>

              <SparklesIcon
                aria-hidden="true"
                className="h-5 w-5 shrink-0 text-[#93C5FD]"
                strokeWidth={2}
                fill="currentColor"
                fillOpacity={0.25}
              />
            </div>

            <p className="mt-2 text-[13px] leading-relaxed text-slate-400 sm:text-[14px]">
              يتم إعادة حساب مهاراتك وواجباتك والوظائف المطابقة لك بناءً على المسمى الذي تختاره.
            </p>
          </div>

          {/* ── Scrollable body ────────────────────────────────── */}
          <div className="relative flex-1 overflow-y-auto overflow-x-hidden">

            {/* ── Carousel ──────────────────────────────────────── */}
            <div
              className="relative px-10 sm:px-14"
              role="group"
              aria-roledescription="carousel"
              aria-label="المسميات الوظيفية المستهدفة"
            >
              {/* Arrow buttons */}
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="السابق"
                className="absolute left-1 top-1/2 z-[60] -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-slate-300 outline-none backdrop-blur-md transition-colors duration-200 hover:border-white/25 hover:bg-white/[0.12] hover:text-white active:scale-95 cursor-pointer"
                style={{ boxShadow: '0 10px 26px rgba(0,0,0,0.55)' }}
              >
                <ChevronLeftIcon className="h-5 w-5" strokeWidth={2.2} />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="التالي"
                className="absolute right-1 top-1/2 z-[60] -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-slate-300 outline-none backdrop-blur-md transition-colors duration-200 hover:border-white/25 hover:bg-white/[0.12] hover:text-white active:scale-95 cursor-pointer"
                style={{ boxShadow: '0 10px 26px rgba(0,0,0,0.55)' }}
              >
                <ChevronRightIcon className="h-5 w-5" strokeWidth={2.2} />
              </button>

              {/* 3D track */}
              <div
                className="relative overflow-hidden"
                style={{
                  height: carouselH,
                  perspective: '1400px',
                  perspectiveOrigin: '50% 50%',
                }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {slots.map(({ key, offset, roleIndex }) => {
                  const dist = Math.min(Math.abs(offset), DEPTH.length - 1);
                  const depth = DEPTH[dist];
                  const dir = Math.sign(offset);
                  const isActive = offset === 0;
                  const role = TARGET_ROLES[roleIndex];

                  return (
                    <div
                      key={key}
                      className="absolute left-1/2 top-1/2"
                      style={{
                        transformOrigin: 'center center',
                        transform: `translate(-50%,-50%) translateX(${slotX(offset, metrics)}px) translateZ(${depth.z}px) rotateY(${-dir * depth.rotate}deg) scale(${depth.scale})`,
                        opacity: depth.opacity,
                        pointerEvents: depth.opacity === 0 ? 'none' : 'auto',
                        zIndex: 40 - dist,
                        willChange: 'transform,opacity',
                        transition: 'transform 440ms cubic-bezier(0.22,1,0.36,1), opacity 440ms cubic-bezier(0.22,1,0.36,1)',
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

                {/* Edge fade-out masks */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 z-[45] w-12 sm:w-16"
                  style={{ backgroundImage: 'linear-gradient(90deg,#04060f 0%,rgba(4,6,15,0) 100%)' }}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-0 z-[45] w-12 sm:w-16"
                  style={{ backgroundImage: 'linear-gradient(270deg,#04060f 0%,rgba(4,6,15,0) 100%)' }}
                />
              </div>
            </div>

            {/* Dots */}
            <CarouselDots
              labels={labels}
              activeIndex={activeIndex}
              onSelect={goToIndex}
              className="mt-3 justify-center"
            />

            {/* ── Detail panel ──────────────────────────────────── */}
            <div className="mt-5 px-4 sm:px-6 pb-6">
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
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </>
  );
}
