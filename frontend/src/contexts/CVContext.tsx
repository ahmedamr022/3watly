"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState } from
'react';
import { initialCV } from '../data/cvData';
import type { CVData, FixId, SaveStatus, TemplateId } from '../types/cv';
import { analyzeCV, type Analysis } from '../utils/atsAnalysis';
import { enhanceBullet } from '../utils/cvHelpers';

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

export function CVProvider({ children }: {children: React.ReactNode;}) {
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

  useEffect(
    () => () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    },
    []
  );

  const touchSave = useCallback(() => {
    setSaveStatus('saving');
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => setSaveStatus('saved'), 900);
  }, []);

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
        return {
          present: next,
          past: coalesce ?
          state.past :
          [...state.past, state.present].slice(-MAX_HISTORY),
          future: []
        };
      });
      touchSave();
    },
    [touchSave]
  );

  const undo = useCallback(() => {
    lastLabel.current = null;
    setHistory((state) => {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      return {
        present: previous,
        past: state.past.slice(0, -1),
        future: [state.present, ...state.future].slice(0, MAX_HISTORY)
      };
    });
    touchSave();
  }, [touchSave]);

  const redo = useCallback(() => {
    lastLabel.current = null;
    setHistory((state) => {
      if (state.future.length === 0) return state;
      const [next, ...rest] = state.future;
      return {
        present: next,
        past: [...state.past, state.present].slice(-MAX_HISTORY),
        future: rest
      };
    });
    touchSave();
  }, [touchSave]);

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
            if (
            !merged.some((s) => s.toLowerCase() === k.toLowerCase()))

            merged.push(k);
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
        const headline = prev.skills.
        flatMap((g) => g.skills).
        slice(0, 8).
        join(', ');
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
      setTemplate,
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
    saveStatus,
    update,
    undo,
    redo,
    history.past.length,
    history.future.length,
    analysis,
    applyFix]

  );

  return <CVContext.Provider value={value}>{children}</CVContext.Provider>;
}

export function useCV(): CVContextValue {
  const context = useContext(CVContext);
  if (!context) throw new Error('useCV must be used inside a CVProvider');
  return context;
}
