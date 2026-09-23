"use client";

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  X,
  ArrowUpRight,
  Loader2,
  Layers,
  Award,
  ChevronDown,
  Database
} from 'lucide-react';
import { toast } from 'sonner';
import type { PlannedSkill } from '@/types/skills';
import { useCV } from '@/contexts/CVContext';
import { useSkillPlan } from '@/contexts/SkillPlanContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getSmartSkillCategory, normalizeSkillName, areSkillsEquivalent, addSkillsSmartly } from '@/utils/skillTaxonomy';

interface SkillCompletionModalProps {
  open: boolean;
  skill: PlannedSkill | null;
  onClose: () => void;
  onCompleted?: (skillName: string, categoryLabel: string) => void;
}

export function SkillCompletionModal({
  open,
  skill,
  onClose,
  onCompleted
}: SkillCompletionModalProps) {
  const { isAr } = useLanguage();
  const cvContext = useCV();
  const { cv, update } = cvContext;
  const { completeSkill } = useSkillPlan();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  // Determine smart category on skill change
  useEffect(() => {
    if (skill && skill.def) {
      const canon = normalizeSkillName(skill.def.name);
      const meta = getSmartSkillCategory(canon, cv?.skills || [], isAr);
      setSelectedCategory(meta.targetGroupLabel);
      setIsCustomCategory(false);
      setCustomCategoryInput('');
    }
  }, [skill, cv?.skills, isAr]);

  if (!open || !skill) return null;

  const skillName = normalizeSkillName(skill.def.name);
  const existingGroups = (cv?.skills || []).map((g) => g.label).filter(Boolean);

  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const finalCategory = isCustomCategory
        ? (customCategoryInput.trim() || selectedCategory)
        : selectedCategory;

      let resolvedCategory = finalCategory;
      const addSkillFn = (cvContext as any)?.addSkillToActiveCv;

      if (typeof addSkillFn === 'function') {
        const result = await addSkillFn(skillName, finalCategory);
        resolvedCategory = result.categoryLabel || finalCategory;
      } else if (typeof update === 'function') {
        update((prev) => {
          const skills = (prev.skills || []).map((g) => ({ ...g, skills: [...g.skills] }));

          if (finalCategory && finalCategory.trim()) {
            const trimmed = finalCategory.trim();
            const existingGroup = skills.find(
              (g) => g.label.trim().toLowerCase() === trimmed.toLowerCase()
            );
            if (existingGroup) {
              resolvedCategory = existingGroup.label;
              if (!existingGroup.skills.some((s) => areSkillsEquivalent(s, skillName))) {
                existingGroup.skills.push(skillName);
              }
              return { ...prev, skills };
            } else {
              resolvedCategory = trimmed;
              skills.push({
                id: `group-${Date.now().toString(36)}`,
                label: trimmed,
                skills: [skillName]
              });
              return { ...prev, skills };
            }
          }

          const meta = getSmartSkillCategory(skillName, skills, isAr);
          resolvedCategory = meta.targetGroupLabel;
          const updated = addSkillsSmartly(skills, [skillName], isAr);
          return { ...prev, skills: updated };
        }, 'add-skill-smart');
      }

      // Sync to localStorage immediately
      try {
        const rawParsed = localStorage.getItem('3watly_parsed_cv');
        if (rawParsed) {
          const p = JSON.parse(rawParsed);
          if (Array.isArray(p.skills)) {
            if (!p.skills.some((s: string) => areSkillsEquivalent(s, skillName))) {
              p.skills.push(skillName);
              localStorage.setItem('3watly_parsed_cv', JSON.stringify(p));
            }
          }
        }
        window.dispatchEvent(new Event('3watly_active_cv_changed'));
      } catch {}

      if (skill.def.id && typeof completeSkill === 'function') {
        completeSkill(skill.def.id);
      }

      toast.success(
        isAr
          ? `تهانينا! تمت إضافة مهارة "${skillName}" بنجاح إلى قسم [${resolvedCategory}] في سيرتك الذاتية.`
          : `"${skillName}" has been added to [${resolvedCategory}] in your CV.`
      );

      if (onCompleted) {
        onCompleted(skillName, resolvedCategory);
      }
      onClose();
    } catch (err: any) {
      console.error('Skill completion error:', err);
      toast.error(
        err?.message ||
          (isAr ? 'حدث خطأ أثناء إضافة المهارة' : 'Failed to add skill')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0B1120] p-6 shadow-2xl shadow-black/60 overflow-hidden z-10"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 ltr:right-4 rtl:left-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3.5 pt-1">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1B57E0] to-indigo-700 text-white shadow-md shadow-blue-900/50">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-white leading-snug">
                {isAr ? 'إتمام المهارة وإضافتها إلى CV' : 'Mark Completed & Add to CV'}
              </h3>
              <p className="text-[12.5px] text-slate-400 mt-0.5">
                {isAr
                  ? 'سيتم تسجيل المهارة كمكتملة وتضمينها باحترافية في سيرتك الذاتية الأنشطة.'
                  : 'This skill will be marked complete and cleanly placed into your active CV.'}
              </p>
            </div>
          </div>

          {/* Skill Highlight Card */}
          <div className="mt-5 p-4 rounded-2xl border border-white/[0.07] bg-[#070C18]">
            <div className="flex items-center justify-between gap-3">
              {/* Skill icon + name */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#1B57E0]/80 to-indigo-700 flex items-center justify-center text-white shadow-md">
                  <Database className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[16px] font-bold text-white truncate">
                      {skillName}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  </div>
                </div>
              </div>
              {/* Demand badge */}
              <span className="shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-950/80 text-blue-300 border border-blue-800/50 whitespace-nowrap">
                {isAr ? `مطلوبة بنسبة ${skill.demand}%` : `${skill.demand}% Demand`}
              </span>
            </div>

            {skill.jobsUnlocked > 0 && (
              <div className="flex items-center gap-1.5 mt-3 text-[12px] font-semibold text-emerald-400">
                <ArrowUpRight className="w-4 h-4 shrink-0" />
                <span>
                  {isAr
                    ? `تفتح سيرتك الذاتية أمام +${skill.jobsUnlocked} وظيفة شاغرة في السوق المصري`
                    : `Unlocks +${skill.jobsUnlocked} active roles in the Egyptian market`}
                </span>
              </div>
            )}
          </div>

          {/* Smart Category Placement */}
          <div className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-[13px] font-bold text-slate-200">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>{isAr ? 'القسم المخصص في سيرتك الذاتية' : 'Target CV Category:'}</span>
              </label>
              <span className="text-[11px] font-bold text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded-md border border-purple-700/50 flex items-center gap-1">
                <span className="text-purple-400">✦</span>
                {isAr ? 'تصنيف ذكي للمهارة' : 'Smart Auto-Placed'}
              </span>
            </div>

            {/* Dropdown */}
            <div className="space-y-2">
              <div className="relative">
                <select
                  value={isCustomCategory ? '__custom__' : selectedCategory}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setIsCustomCategory(true);
                    } else {
                      setIsCustomCategory(false);
                      setSelectedCategory(e.target.value);
                    }
                  }}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-[#070C18] py-2.5 px-3.5 text-[13px] font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all cursor-pointer"
                >
                  <option value={selectedCategory}>
                    {selectedCategory} {isAr ? '(الموصى به بذكاء)' : '(Smart Recommendation)'}
                  </option>

                  {existingGroups
                    .filter((g) => g.toLowerCase() !== selectedCategory.toLowerCase())
                    .map((grp) => (
                      <option key={grp} value={grp}>
                        {grp}
                      </option>
                    ))}

                  {[
                    isAr ? 'السحابة والتشغيل (DevOps)' : 'Cloud & DevOps',
                    isAr ? 'قواعد البيانات والتخزين' : 'Databases & Storage',
                    isAr ? 'هندسة البيانات والمعالجة' : 'Data Engineering & Pipelines',
                    isAr ? 'لغات البرمجة' : 'Programming Languages',
                    isAr ? 'ذكاء الأعمال والتحليلات' : 'BI & Analytics',
                    isAr ? 'أطر العمل والمكتبات' : 'Frameworks & Libraries'
                  ]
                    .filter((cat) =>
                      cat.toLowerCase() !== selectedCategory.toLowerCase() &&
                      !existingGroups.some(g => g.toLowerCase() === cat.toLowerCase())
                    )
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}

                  <option value="__custom__">
                    {isAr ? '+ إنشاء قسم مخصص جديد...' : '+ Create new custom category...'}
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 ltr:right-3 rtl:left-3 flex items-center text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {isCustomCategory && (
                <div className="pt-1">
                  <input
                    type="text"
                    placeholder={isAr ? "اكتب اسم القسم الجديد (مثال: أطر العمل السحابية)" : "Enter custom category name"}
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                    className="w-full rounded-xl border border-blue-500/40 bg-[#070C18] py-2.5 px-3.5 text-[13px] font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    autoFocus
                  />
                </div>
              )}
            </div>

            <p className="text-[11.5px] text-slate-500 leading-relaxed pt-0.5 flex items-center gap-1.5">
              <span className="text-slate-600">ⓘ</span>
              {isAr
                ? 'يتم ترتيب المهارات داخل القسم المحدد بطريقة منظمة ومقروءة لمحركات الـ ATS ومسؤولي التوظيف.'
                : 'Skills will be cleanly organized and readable by ATS parsers and technical recruiters.'}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 font-bold text-[13px] transition-colors cursor-pointer disabled:opacity-50"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-[2] flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1B57E0] to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-[13px] shadow-md shadow-blue-900/40 transition-all cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Award className="w-4 h-4" />
              )}
              <span>
                {isSubmitting
                  ? (isAr ? 'جاري الإضافة...' : 'Adding...')
                  : (isAr ? 'تأكيد وإضافة إلى الـ CV' : 'Confirm & Add to CV')}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
