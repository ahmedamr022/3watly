"use client";

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  Check,
  X,
  ArrowUpRight,
  Loader2,
  Layers,
  Award,
  ChevronDown,
  Database,
  PlusCircle,
  Sparkles
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  // Determine smart recommended category on skill change
  useEffect(() => {
    if (skill && skill.def) {
      const canon = normalizeSkillName(skill.def.name);
      const meta = getSmartSkillCategory(canon, cv?.skills || [], isAr);
      setSelectedCategory(meta.targetGroupLabel);
      setIsCustomCategory(false);
      setCustomCategoryInput('');
      setIsDropdownOpen(false);
    }
  }, [skill, cv?.skills, isAr]);

  if (!open || !skill) return null;

  const skillName = normalizeSkillName(skill.def.name);
  const rawExistingGroups = (cv?.skills || []).map((g) => g.label).filter(Boolean);
  
  // Deduplicate existing groups
  const existingGroups = Array.from(new Set(rawExistingGroups));

  // Determine smart recommendation for badge
  const canon = normalizeSkillName(skill.def.name);
  const smartRecommendation = getSmartSkillCategory(canon, cv?.skills || [], isAr).targetGroupLabel;

  // Build clean list of options:
  // 1. Recommended group
  // 2. Other existing groups from the user's CV
  // 3. If user has no groups at all, fallback to a clean list in the active language
  const buildCategoryOptions = (): string[] => {
    const list: string[] = [];
    
    // Always put recommended at top
    if (smartRecommendation) {
      list.push(smartRecommendation);
    }

    // Add other existing groups
    existingGroups.forEach(grp => {
      if (!list.some(item => item.toLowerCase() === grp.toLowerCase())) {
        list.push(grp);
      }
    });

    // If user's CV has no sections at all, supply clean default tracks
    if (existingGroups.length === 0) {
      const defaults = isAr
        ? [
            'البرمجة وقواعد البيانات',
            'هندسة البيانات والمعالجة',
            'الذكاء الاصطناعي والتعلم الآلي',
            'السحابة والتشغيل (DevOps)',
            'أدوات التطوير والتقنيات'
          ]
        : [
            'Programming & Databases',
            'Data Engineering & Pipelines',
            'Machine Learning & AI',
            'Cloud & DevOps',
            'Tools & Technologies'
          ];
      defaults.forEach(d => {
        if (!list.some(item => item.toLowerCase() === d.toLowerCase())) {
          list.push(d);
        }
      });
    }

    return list;
  };

  const categoryOptions = buildCategoryOptions();

  const handleSelectOption = (cat: string) => {
    setIsCustomCategory(false);
    setSelectedCategory(cat);
    setIsDropdownOpen(false);
  };

  const handleSelectCustom = () => {
    setIsCustomCategory(true);
    setIsDropdownOpen(false);
  };

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
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0B1120] p-6 shadow-2xl shadow-black/80 overflow-visible z-10"
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
                    <span className="text-[16px] font-bold text-white truncate" dir="auto">
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
                <Sparkles className="w-3 h-3 text-purple-400" />
                {isAr ? 'تصنيف ذكي للمهارة' : 'Smart Auto-Placed'}
              </span>
            </div>

            {/* Custom Modern Styled Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {/* Trigger Button */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full flex items-center justify-between rounded-xl border bg-[#070C18] py-2.5 px-3.5 text-[13px] font-semibold text-white transition-all cursor-pointer ${
                  isDropdownOpen
                    ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg shadow-blue-500/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="truncate text-white font-bold" dir="auto">
                    {isCustomCategory
                      ? (customCategoryInput.trim() || (isAr ? 'قسم مخصص جديد...' : 'New custom category...'))
                      : selectedCategory}
                  </span>
                  {!isCustomCategory && selectedCategory.toLowerCase() === smartRecommendation.toLowerCase() && (
                    <span className="shrink-0 text-[10.5px] font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-800/50">
                      {isAr ? 'الموصى به بذكاء' : 'Recommended'}
                    </span>
                  )}
                  {isCustomCategory && (
                    <span className="shrink-0 text-[10.5px] font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-800/50">
                      {isAr ? 'قسم جديد' : 'Custom'}
                    </span>
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180 text-blue-400' : ''
                  }`}
                />
              </button>

              {/* Animated Floating Dropdown Panel */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 4, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-x-0 top-full z-50 max-h-60 overflow-y-auto rounded-2xl border border-white/15 bg-[#0B1120] p-1.5 shadow-2xl shadow-black/90 backdrop-blur-xl scrollbar-thin scrollbar-thumb-slate-700"
                  >
                    <div className="space-y-1">
                      {categoryOptions.map((cat) => {
                        const isSelected = !isCustomCategory && selectedCategory.toLowerCase() === cat.toLowerCase();
                        const isRec = cat.toLowerCase() === smartRecommendation.toLowerCase();

                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => handleSelectOption(cat)}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left rtl:text-right text-[12.5px] font-semibold transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#1B57E0]/20 text-white border border-[#1B57E0]/40'
                                : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="truncate" dir="auto">{cat}</span>
                              {isRec && (
                                <span className="shrink-0 text-[10px] font-bold text-blue-400 bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-800/40">
                                  {isAr ? 'الموصى به بذكاء' : 'Recommended'}
                                </span>
                              )}
                            </div>
                            {isSelected && (
                              <Check className="w-4 h-4 text-blue-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}

                      {/* Divider */}
                      <div className="my-1 border-t border-white/5" />

                      {/* Custom Category Option */}
                      <button
                        type="button"
                        onClick={handleSelectCustom}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left rtl:text-right text-[12.5px] font-semibold transition-colors cursor-pointer ${
                          isCustomCategory
                            ? 'bg-purple-900/30 text-purple-200 border border-purple-700/40'
                            : 'text-purple-400 hover:bg-purple-950/40 hover:text-purple-300 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <PlusCircle className="w-4 h-4 shrink-0" />
                          <span>{isAr ? '+ إنشاء قسم مخصص جديد...' : '+ Create new custom category...'}</span>
                        </div>
                        {isCustomCategory && (
                          <Check className="w-4 h-4 text-purple-400 shrink-0" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Custom Input Field when Custom is selected */}
              {isCustomCategory && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-2"
                >
                  <input
                    type="text"
                    placeholder={isAr ? "اكتب اسم القسم الجديد (مثال: أطر العمل السحابية)" : "Enter custom category name"}
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                    className="w-full rounded-xl border border-purple-500/50 bg-[#070C18] py-2.5 px-3.5 text-[13px] font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 shadow-inner"
                    autoFocus
                  />
                </motion.div>
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
