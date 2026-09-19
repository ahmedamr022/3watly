"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Target,
  Sparkles,
  Check,
} from 'lucide-react';
import { useSkillPlan } from '@/contexts/SkillPlanContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { TARGET_ROLES, RoleItem } from '@/data/rolesData';
import { TargetRoleCard } from './TargetRoleCard';
import { TargetRoleDetailPanel } from './TargetRoleDetailPanel';

interface TargetRoleModalProps {
  open: boolean;
  onClose: () => void;
}

export function TargetRoleModal({ open, onClose }: TargetRoleModalProps) {
  const { roleId, setRoleId, readinessFor } = useSkillPlan();
  const { isAr } = useLanguage();

  // Find initial active index based on currently saved roleId
  const initialIndex = Math.max(0, TARGET_ROLES.findIndex((r) => r.id === roleId));
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  // Sync index when modal opens
  useEffect(() => {
    if (open) {
      const idx = TARGET_ROLES.findIndex((r) => r.id === roleId);
      if (idx >= 0) setActiveIndex(idx);
    }
  }, [open, roleId]);

  const activeRole = TARGET_ROLES[activeIndex] || TARGET_ROLES[0];
  const readinessPct = readinessFor(activeRole.id);
  const isCurrentSavedRole = activeRole.id === roleId;

  const nextRole = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % TARGET_ROLES.length);
  }, []);

  const prevRole = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + TARGET_ROLES.length) % TARGET_ROLES.length);
  }, []);

  // Keyboard navigation (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        if (isAr) prevRole();
        else nextRole();
      } else if (e.key === 'ArrowLeft') {
        if (isAr) nextRole();
        else prevRole();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, isAr, nextRole, prevRole, onClose]);

  const handleConfirm = () => {
    setRoleId(activeRole.id);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/65 dark:bg-black/85 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        dir={isAr ? 'rtl' : 'ltr'}
        className="relative w-full max-w-5xl rounded-3xl bg-white/95 dark:bg-[#070C1E]/95 backdrop-blur-2xl border border-slate-200 dark:border-cyan-500/30 shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-white/3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{isAr ? 'اختر المسمى والمسار الوظيفي المستهدف' : 'Choose Your Target Career Path'}</span>
                <span className="hidden sm:inline-flex text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                  {TARGET_ROLES.length} {isAr ? 'مسارات متاحة' : 'Roles'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr
                  ? 'يتم حساب فجوة المهارات والكورسات المقترحة تلقائياً وبدقة 100% بناءً على المسار المختار.'
                  : 'Skills gap, learning resources, and matching jobs adapt in real-time to your target role.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6 flex-1">
          {/* Card Carousel Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                {isAr ? 'تصفح المسارات المتاحة (اضغط على الكارت للتفاصيل):' : 'Explore Target Paths:'}
              </span>

              {/* Arrow controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={prevRole}
                  aria-label="Previous role"
                  className="p-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer shadow-xs"
                >
                  {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 px-1 font-mono">
                  {activeIndex + 1} / {TARGET_ROLES.length}
                </span>
                <button
                  type="button"
                  onClick={nextRole}
                  aria-label="Next role"
                  className="p-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer shadow-xs"
                >
                  {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Horizontal Scrollable Cards List */}
            <div className="flex items-center gap-3.5 overflow-x-auto py-2.5 px-1 scrollbar-none snap-x">
              {TARGET_ROLES.map((role, idx) => {
                const isActive = idx === activeIndex;
                const isSaved = role.id === roleId;
                const rPct = readinessFor(role.id);

                return (
                  <div key={role.id} className="snap-center shrink-0">
                    <TargetRoleCard
                      role={role}
                      isActive={isActive}
                      isCurrentSavedRole={isSaved}
                      readinessPct={rPct}
                      width={isActive ? 290 : 250}
                      height={isActive ? 275 : 245}
                      onSelect={() => setActiveIndex(idx)}
                      isAr={isAr}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Role Detailed Breakdown Panel */}
          <TargetRoleDetailPanel
            role={activeRole}
            readinessPct={readinessPct}
            isCurrentSavedRole={isCurrentSavedRole}
            onConfirmSelection={handleConfirm}
            isAr={isAr}
          />
        </div>
      </div>
    </div>
  );
}
