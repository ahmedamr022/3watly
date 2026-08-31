"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { initialCV } from '../data/cvData';
import type { CVData, FixId, SaveStatus, TemplateId } from '../types/cv';
import { analyzeCV, type Analysis } from '../utils/atsAnalysis';
import { enhanceBullet } from '../utils/cvHelpers';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './AuthContext';

interface HistoryState {
  present: CVData;
  past: CVData[];
  future: CVData[];
}

interface CVContextValue {
  cv: CVData;
  template: TemplateId;
  setTemplate: (template: TemplateId) => void;
  saveStatus: SaveStatus;
  /**
   * Applies an immutable update. Passing the same `label` within a short window
   * coalesces edits so undo steps map to intents, not keystrokes.
   */
  update: (updater: (prev: CVData) => CVData, label?: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  analysis: Analysis;
  applyFix: (id: FixId) => string;
}

const CVContext = createContext<CVContextValue | null>(null);

const MAX_HISTORY = 60;
const COALESCE_MS = 900;

export function CVProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryState>({
    present: initialCV,
    past: [],
    future: []
  });
  const [template, setTemplate] = useState<TemplateId>('ats-classic');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');

  const lastLabel = useRef<string | null>(null);
  const lastEditAt = useRef<number>(0);
  const saveTimer = useRef<number | undefined>(undefined);
  const cvRef = useRef<CVData>(initialCV);

  cvRef.current = history.present;

  // Hydrate CV on mount or when user changes
  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    const loadUserCV = async () => {
      // 1. Try fetching from Supabase if user is logged in
      if (supabase && user?.id) {
        try {
          const { data: cvDoc, error } = await supabase
            .from('cv_documents')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (!error && cvDoc && isMounted) {
            const loadedCV: CVData = {
              contact: cvDoc.contact || initialCV.contact,
              summary: cvDoc.summary || initialCV.summary,
              experience: Array.isArray(cvDoc.experience) ? cvDoc.experience : initialCV.experience,
              education: Array.isArray(cvDoc.education) ? cvDoc.education : initialCV.education,
              projects: Array.isArray(cvDoc.projects) ? cvDoc.projects : initialCV.projects,
              skills: Array.isArray(cvDoc.skills) ? cvDoc.skills : initialCV.skills,
              skillsSummary: cvDoc.skills_summary || cvDoc.skillsSummary || initialCV.skillsSummary || '',
              hiddenSections: Array.isArray(cvDoc.hidden_sections) ? cvDoc.hidden_sections : [],
              sectionOrder: Array.isArray(cvDoc.section_order) ? cvDoc.section_order : ['summary', 'experience', 'education', 'skills', 'projects']
            };
            if (cvDoc.template_id) {
              setTemplate(cvDoc.template_id as TemplateId);
            }
            setHistory({
              present: loadedCV,
              past: [],
              future: []
            });
            return;
          }
        } catch (e) {
          console.warn('Could not fetch CV from Supabase:', e);
        }
      }

      // 2. Try restoring from localStorage parsed CV or draft
      try {
        const savedDraft = localStorage.getItem('3watly_cv_draft');
        if (savedDraft && isMounted) {
          const parsed = JSON.parse(savedDraft);
          setHistory({ present: parsed, past: [], future: [] });
          return;
        }

        const parsedOnboarding = localStorage.getItem('3watly_parsed_cv');
        if (parsedOnboarding && isMounted) {
          const p = JSON.parse(parsedOnboarding);
          const adaptedCV: CVData = {
            ...initialCV,
            contact: {
              fullName: p.fullName || user?.fullName || initialCV.contact.fullName,
              jobTitle: p.currentTitle || initialCV.contact.jobTitle,
              email: p.email || user?.email || initialCV.contact.email,
              phone: p.phone || initialCV.contact.phone,
              location: p.location || initialCV.contact.location,
              linkedin: p.linkedin || initialCV.contact.linkedin
            },
            summary: p.summary || initialCV.summary,
            skillsSummary: initialCV.skillsSummary || '',
            skills: p.skills && p.skills.length > 0 ? [
              { id: 'tech-1', label: 'Technical Skills', skills: p.skills }
            ] : initialCV.skills
          };
          setHistory({ present: adaptedCV, past: [], future: [] });
        }
      } catch (e) {
        console.warn('LocalStorage CV hydration warning:', e);
      }
    };

    loadUserCV();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Cloud Save Debounce
  const triggerCloudSave = useCallback((updatedCv: CVData, currentTemplate: TemplateId) => {
    setSaveStatus('saving');
    if (saveTimer.current) window.clearTimeout(saveTimer.current);

    saveTimer.current = window.setTimeout(async () => {
      // 1. Always save to LocalStorage draft
      try {
        localStorage.setItem('3watly_cv_draft', JSON.stringify(updatedCv));
      } catch {}

      // 2. Save to Supabase if client & user are available
      const supabase = createClient();
      if (supabase && user?.id) {
        try {
          await supabase.from('cv_documents').upsert({
            user_id: user.id,
            template_id: currentTemplate,
            contact: updatedCv.contact,
            summary: updatedCv.summary,
            experience: updatedCv.experience,
            education: updatedCv.education,
            projects: updatedCv.projects,
            skills: updatedCv.skills,
            hidden_sections: updatedCv.hiddenSections,
            section_order: updatedCv.sectionOrder,
            updated_at: new Date().toISOString()
          });
        } catch (err) {
          console.warn('Failed to sync CV to Supabase:', err);
        }
      }

      setSaveStatus('saved');
    }, 800);
  }, [user]);

  const update = useCallback(
    (updater: (prev: CVData) => CVData, label?: string) => {
      const now = Date.now();
      const coalesce =
        Boolean(label) &&
        label === lastLabel.current &&
        now - lastEditAt.current < COALESCE_MS;
      lastLabel.current = label ?? null;
      lastEditAt.current = now;

      setHistory((state) => {
        const next = updater(state.present);
        if (next === state.present) return state;

        triggerCloudSave(next, template);

        return {
          present: next,
          past: coalesce
            ? state.past
            : [...state.past, state.present].slice(-MAX_HISTORY),
          future: []
        };
      });
    },
    [template, triggerCloudSave]
  );

  const handleSetTemplate = useCallback((nextTemplate: TemplateId) => {
    setTemplate(nextTemplate);
    triggerCloudSave(cvRef.current, nextTemplate);
  }, [triggerCloudSave]);

  const undo = useCallback(() => {
    lastLabel.current = null;
    setHistory((state) => {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      triggerCloudSave(previous, template);
      return {
        present: previous,
        past: state.past.slice(0, -1),
        future: [state.present, ...state.future].slice(0, MAX_HISTORY)
      };
    });
  }, [template, triggerCloudSave]);

  const redo = useCallback(() => {
    lastLabel.current = null;
    setHistory((state) => {
      if (state.future.length === 0) return state;
      const [next, ...rest] = state.future;
      triggerCloudSave(next, template);
      return {
        present: next,
        past: [...state.past, state.present].slice(-MAX_HISTORY),
        future: rest
      };
    });
  }, [template, triggerCloudSave]);

  const cv = history.present;
  const analysis = useMemo(() => analyzeCV(cv, template), [cv, template]);

  const applyFix = useCallback(
    (id: FixId): string => {
      if (id === 'keywords') {
        const keywords = analysis.keywords.missing.slice(0, 3);
        if (keywords.length === 0) return 'No missing keywords left.';
        const targetLabel =
          cv.skills.find((g) => /technical/i.test(g.label))?.label ??
          cv.skills[0]?.label ??
          'Skills';
        update((prev) => {
          const groups = [...prev.skills];
          const targetIndex = Math.max(
            0,
            groups.findIndex((g) => /technical/i.test(g.label))
          );
          const target = groups[targetIndex];
          if (!target) return prev;
          const merged = [...target.skills];
          keywords.forEach((k) => {
            if (!merged.some((s) => s.toLowerCase() === k.toLowerCase())) {
              merged.push(k);
            }
          });
          groups[targetIndex] = { ...target, skills: merged };
          return { ...prev, skills: groups };
        }, 'fix-keywords');
        return `Added ${keywords.join(', ')} to your ${targetLabel}.`;
      }

      if (id === 'metrics') {
        update(
          (prev) => ({
            ...prev,
            experience: prev.experience.map((item) => ({
              ...item,
              bullets: item.bullets.map((bullet, index) =>
                enhanceBullet(bullet, index)
              )
            }))
          }),
          'fix-metrics'
        );
        return 'Experience bullets rewritten with measurable outcomes.';
      }

      // skills-summary
      update((prev) => {
        const headline = prev.skills
          .flatMap((g) => g.skills)
          .slice(0, 8)
          .join(', ');
        return {
          ...prev,
          skillsSummary: `${prev.contact.jobTitle} with hands-on expertise in ${headline}.`
        };
      }, 'fix-skills-summary');
      return 'Skills Summary added to the top of your Skills section.';
    },
    [analysis.keywords.missing, cv.skills, update]
  );

  const value = useMemo<CVContextValue>(
    () => ({
      cv,
      template,
      setTemplate: handleSetTemplate,
      saveStatus,
      update,
      undo,
      redo,
      canUndo: history.past.length > 0,
      canRedo: history.future.length > 0,
      analysis,
      applyFix
    }),
    [
      cv,
      template,
      handleSetTemplate,
      saveStatus,
      update,
      undo,
      redo,
      history.past.length,
      history.future.length,
      analysis,
      applyFix
    ]
  );

  return <CVContext.Provider value={value}>{children}</CVContext.Provider>;
}

export function useCV(): CVContextValue {
  const context = useContext(CVContext);
  if (!context) throw new Error('useCV must be used inside a CVProvider');
  return context;
}
