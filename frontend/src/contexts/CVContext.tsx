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
import { toast } from 'sonner';
import { initialCV } from '../data/cvData';
import type { CVData, CVVersion, FixId, SaveStatus, TemplateId } from '../types/cv';
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

  // Multi-CV Version Management
  versions: CVVersion[];
  activeVersionId: string;
  editingVersionId: string;
  currentVersion: CVVersion | null;
  activeVersion: CVVersion | null;
  setActiveVersion: (id: string) => void;
  switchEditingVersion: (id: string) => void;
  createVersion: (name: string, targetRole?: string, fromCv?: CVData) => CVVersion;
  duplicateVersion: (id: string, newName?: string) => CVVersion;
  renameVersion: (id: string, newName: string, newTargetRole?: string) => void;
  deleteVersion: (id: string) => void;
}

const CVContext = createContext<CVContextValue | null>(null);

const MAX_HISTORY = 60;
const COALESCE_MS = 900;

function syncActiveCVToPlatform(version: CVVersion) {
  try {
    localStorage.setItem('3watly_active_cv_id', version.id);
    localStorage.setItem('3watly_target_role', version.targetRole || version.cvData.contact.jobTitle);

    const flatSkills: string[] = [];
    version.cvData.skills.forEach(g => {
      g.skills.forEach(s => {
        if (!flatSkills.includes(s)) flatSkills.push(s);
      });
    });

    const parsedData = {
      fullName: version.cvData.contact.fullName,
      currentTitle: version.cvData.contact.jobTitle,
      email: version.cvData.contact.email,
      phone: version.cvData.contact.phone,
      location: version.cvData.contact.location,
      linkedin: version.cvData.contact.linkedin,
      github: version.cvData.contact.github || '',
      portfolio: version.cvData.contact.portfolio || '',
      socialLinks: version.cvData.contact.socialLinks || [],
      links: (version.cvData.contact.socialLinks || []).map(sl => ({
        title: sl.platform,
        url: sl.url,
        type: sl.platform.toLowerCase() as any
      })),
      summary: version.cvData.summary,
      targetRole: version.targetRole || version.cvData.contact.jobTitle,
      skills: flatSkills,
      categorizedSkillGroups: version.cvData.skills,
      // Use 'experiences' as the canonical key (matches what the parse API returns)
      // Do NOT also save under 'experience' — that causes duplication on re-load
      experiences: version.cvData.experience,
      // Use 'education' as the canonical key — do NOT also save 'educationHistory'
      education: version.cvData.education,
      projects: version.cvData.projects,
      atsScore: version.atsScore ?? (version.analysis?.score ?? analyzeCV(version.cvData, version.templateId).score),
      atsReport: {
        score: version.atsScore ?? (version.analysis?.score ?? analyzeCV(version.cvData, version.templateId).score),
        band: version.analysis?.band
      }
    };

    localStorage.setItem('3watly_parsed_cv', JSON.stringify(parsedData));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('3watly_active_cv_changed', { detail: version }));
    }
  } catch (e) {
    console.warn('Failed to sync active CV to platform:', e);
  }
}

export function CVProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryState>({
    present: initialCV,
    past: [],
    future: []
  });
  const [template, setTemplate] = useState<TemplateId>('ats-classic');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');

  // Multi-CV versions state
  const [versions, setVersions] = useState<CVVersion[]>([]);
  const [activeVersionId, setActiveVersionIdState] = useState<string>('ver-default');
  const [editingVersionId, setEditingVersionId] = useState<string>('ver-default');

  const lastLabel = useRef<string | null>(null);
  const lastEditAt = useRef<number>(0);
  const saveTimer = useRef<number | undefined>(undefined);
  const cvRef = useRef<CVData>(initialCV);

  cvRef.current = history.present;

  // Hydrate CV versions on mount
  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    // ── One-time migration: remove stale duplicate keys from 3watly_parsed_cv ──
    // Older versions of syncActiveCVToPlatform saved both 'experiences' + 'experience'
    // and both 'education' + 'educationHistory', causing double entries in the CV Builder.
    try {
      const rawParsed = localStorage.getItem('3watly_parsed_cv');
      if (rawParsed) {
        const p = JSON.parse(rawParsed);
        let changed = false;
        // Remove the stale alias key 'educationHistory' — 'education' is canonical
        if (p.educationHistory !== undefined) { delete p.educationHistory; changed = true; }
        // Remove stale alias key 'experience' — 'experiences' is canonical (from parse API)
        // But ONLY if 'experiences' already exists and is equal in length
        if (p.experience !== undefined && Array.isArray(p.experiences) && p.experiences.length > 0) {
          delete p.experience; changed = true;
        }
        if (changed) localStorage.setItem('3watly_parsed_cv', JSON.stringify(p));
      }
    } catch {}

    const loadAllCVData = async () => {
      let initialVersionsList: CVVersion[] = [];
      let activeId = 'ver-default';

      // 1. Try loading versions from localStorage
      try {
        const savedVersionsJson = localStorage.getItem('3watly_cv_versions');
        const savedActiveId = localStorage.getItem('3watly_active_cv_id');
        if (savedVersionsJson) {
          const parsedVers = JSON.parse(savedVersionsJson);
          if (Array.isArray(parsedVers) && parsedVers.length > 0) {
            initialVersionsList = parsedVers;
            if (savedActiveId && parsedVers.some(v => v.id === savedActiveId)) {
              activeId = savedActiveId;
            } else {
              activeId = parsedVers[0].id;
            }
          }
        }
      } catch (e) {
        console.warn('Failed to read 3watly_cv_versions:', e);
      }

      // 2. Check if active version has no real content or if a richer parsed CV exists in 3watly_parsed_cv
      let shouldRebuildFromParsed = initialVersionsList.length === 0;
      if (!shouldRebuildFromParsed) {
        const activeVer = initialVersionsList.find(v => v.id === activeId);
        const parsedOnboardingStr = localStorage.getItem('3watly_parsed_cv');
        if (parsedOnboardingStr) {
          try {
            const p = JSON.parse(parsedOnboardingStr);
            const pHasContent = Boolean(p && (p.fullName || (Array.isArray(p.skills) && p.skills.length > 0) || (Array.isArray(p.projects) && p.projects.length > 0)));
            const activeVerIsBare = !activeVer || (!activeVer.cvData?.contact?.fullName && (!activeVer.cvData?.projects || activeVer.cvData?.projects.length === 0));
            if (pHasContent && activeVerIsBare) {
              shouldRebuildFromParsed = true;
            }
          } catch {}
        }
      }

      // If no versions stored yet or active version is an empty placeholder, create primary version from parsed onboarding CV or draft
      if (shouldRebuildFromParsed) {
        let baseCv = initialCV;
        let baseRole = '';

        try {
          const parsedOnboarding = localStorage.getItem('3watly_parsed_cv');
          if (parsedOnboarding) {
            const p = JSON.parse(parsedOnboarding);

            // ── Experience: prefer p.experiences (API output), fall back to p.experience (synced CV)
            // IMPORTANT: never merge both — they contain the same data, just different keys
            const rawExpList = (() => {
              const fromExperiences = Array.isArray(p.experiences) && p.experiences.length > 0 ? p.experiences : null;
              const fromExperience = Array.isArray(p.experience) && p.experience.length > 0 ? p.experience : null;
              // Use whichever is richer (more bullets = parsed API version)
              if (fromExperiences && fromExperience) {
                const expBullets = fromExperiences.reduce((s: number, e: any) => s + (e.bullets?.length || 0), 0);
                const expBullets2 = fromExperience.reduce((s: number, e: any) => s + (e.bullets?.length || 0), 0);
                return expBullets >= expBullets2 ? fromExperiences : fromExperience;
              }
              return fromExperiences || fromExperience || [];
            })();

            const adaptedExperience = rawExpList.map((exp: any, idx: number) => ({
              id: exp.id || `exp-${idx + 1}`,
              role: exp.role || p.currentTitle || 'Professional',
              company: exp.company || '',
              companyUrl: exp.companyUrl || '',
              startDate: exp.startDate || '',
              endDate: exp.endDate || 'Present',
              current: Boolean(exp.current),
              location: exp.location || p.location || '',
              bullets: Array.isArray(exp.bullets) ? exp.bullets : []
            }));

            // ── Education: use ONLY ONE source to prevent duplication
            // 'education' is canonical (from API). 'educationHistory' is the old alias saved by syncActiveCVToPlatform.
            // Never merge both — they contain the same entries.
            const rawEduList = Array.isArray(p.education) && p.education.length > 0
              ? p.education
              : (Array.isArray(p.educationHistory) && p.educationHistory.length > 0 ? p.educationHistory : []);

            const adaptedEducation = rawEduList.length > 0
              ? rawEduList.map((edu: any, idx: number) => ({
                  id: edu.id || `edu-${idx + 1}`,
                  degree: edu.degree || 'Bachelor Degree',
                  institution: edu.institution || edu.school || '',
                  startDate: edu.startDate || '',
                  endDate: edu.endDate || edu.period || '',
                  location: edu.location || p.location || '',
                  major: edu.major || ''
                }))
              : [];

            const adaptedProjects = Array.isArray(p.projects) && p.projects.length > 0
              ? p.projects.map((proj: any, idx: number) => ({
                  id: proj.id || `prj-${idx + 1}`,
                  title: proj.title || `Project ${idx + 1}`,
                  technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
                  github: proj.github || '',
                  link: proj.link || '',
                  bullets: Array.isArray(proj.bullets) && proj.bullets.length > 0
                    ? proj.bullets
                    : (proj.description ? [proj.description] : [])
                }))
              : [];

            let adaptedSkills: import('../types/cv').SkillGroup[] = [];
            if (Array.isArray(p.categorizedSkillGroups) && p.categorizedSkillGroups.length > 0) {
              adaptedSkills = p.categorizedSkillGroups.map((g: any, idx: number) => ({
                id: g.id || `skill-g-${idx + 1}`,
                label: g.label || 'Technical Skills',
                skills: Array.isArray(g.skills) ? g.skills : []
              }));
            } else if (p.categorizedSkills && typeof p.categorizedSkills === 'object') {
              const groups = [];
              if (p.categorizedSkills.programming?.length) {
                groups.push({ id: 'prog', label: 'Programming & Databases', skills: p.categorizedSkills.programming });
              }
              if (p.categorizedSkills.frameworks?.length) {
                groups.push({ id: 'fw', label: 'Machine Learning & Frameworks', skills: p.categorizedSkills.frameworks });
              }
              if (p.categorizedSkills.databasesAndTools?.length) {
                groups.push({ id: 'tools', label: 'Tools & Backend', skills: p.categorizedSkills.databasesAndTools });
              }
              if (p.categorizedSkills.soft?.length) {
                groups.push({ id: 'soft', label: 'Core Competencies', skills: p.categorizedSkills.soft });
              }
              if (groups.length > 0) adaptedSkills = groups;
            } else if (p.skills && p.skills.length > 0) {
              adaptedSkills = [{ id: 'tech-1', label: 'Technical Skills', skills: p.skills }];
            }

            // Build socialLinks from parsed links array or individual fields
            const platformMap: Record<string, import('../types/cv').SocialPlatform> = {
              linkedin: 'LinkedIn',
              github: 'GitHub',
              portfolio: 'Portfolio',
              kaggle: 'Other',
              leetcode: 'Other',
              behance: 'Dribbble',
              medium: 'Medium',
              website: 'Personal'
            };
            const parsedSocialLinks: import('../types/cv').SocialLink[] = [];

            // 1. Use pre-structured socialLinks from the parser (new path)
            if (Array.isArray(p.socialLinks) && p.socialLinks.length > 0) {
              p.socialLinks.forEach((l: any) => {
                if (l.url && !parsedSocialLinks.some((sl) => sl.url === l.url)) {
                  parsedSocialLinks.push({
                    id: l.id || `link-${parsedSocialLinks.length}`,
                    platform: (l.platform as import('../types/cv').SocialPlatform) || 'Other',
                    url: l.url
                  });
                }
              });
            }

            // 2. Fallback: use raw links array from ExtractedLinkItem[]
            if (parsedSocialLinks.length === 0 && Array.isArray(p.links) && p.links.length > 0) {
              p.links.forEach((l: any, idx: number) => {
                const platform = platformMap[l.type] ?? 'Other';
                if (l.url && !parsedSocialLinks.some(sl => sl.url === l.url)) {
                  parsedSocialLinks.push({ id: `link-${idx}`, platform, url: l.url });
                }
              });
            }

            // 3. Fallback: build from individual linkedin/github/portfolio fields
            if (parsedSocialLinks.length === 0) {
              if (p.linkedin) parsedSocialLinks.push({ id: 'link-li', platform: 'LinkedIn', url: p.linkedin });
              if (p.github) parsedSocialLinks.push({ id: 'link-gh', platform: 'GitHub', url: p.github });
              if (p.portfolio) parsedSocialLinks.push({ id: 'link-pf', platform: 'Portfolio', url: p.portfolio });
            }

            baseCv = {
              ...initialCV,
              contact: {
                fullName: p.fullName || user?.fullName || '',
                jobTitle: p.currentTitle || p.targetRole || '',
                email: p.email || user?.email || '',
                phone: p.phone || '',
                location: p.location || '',
                linkedin: p.linkedin || '',
                github: p.github || '',
                portfolio: p.portfolio || '',
                socialLinks: parsedSocialLinks
              },
              summary: p.summary || '',
              skillsSummary: '',
              experience: adaptedExperience,
              education: adaptedEducation,
              projects: adaptedProjects,
              skills: adaptedSkills,
              sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects'],
              hiddenSections: []
            };

            baseRole = p.targetRole || p.currentTitle || '';
          }
        } catch (e) {
          console.warn('Fallback initialization:', e);
        }

        const defaultVersion: CVVersion = {
          id: 'ver-primary',
          name: baseCv.contact.jobTitle 
            ? `${baseCv.contact.jobTitle} (الأساسية)` 
            : (baseCv.contact.fullName ? `سيرة ${baseCv.contact.fullName}` : 'سيرتي الذاتية الأولى'),
          targetRole: baseRole || 'مساري المستهدف',
          cvData: baseCv,
          templateId: 'ats-classic',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        };

        initialVersionsList = [defaultVersion, ...initialVersionsList.filter(v => v.id !== defaultVersion.id).map(v => ({ ...v, isActive: false }))];
        activeId = defaultVersion.id;
        localStorage.setItem('3watly_cv_versions', JSON.stringify(initialVersionsList));
        localStorage.setItem('3watly_active_cv_id', activeId);
        syncActiveCVToPlatform(defaultVersion);
      }

      if (isMounted) {
        setVersions(initialVersionsList);
        setActiveVersionIdState(activeId);
        setEditingVersionId(activeId);

        const currentToEdit = initialVersionsList.find(v => v.id === activeId) || initialVersionsList[0];
        if (currentToEdit) {
          setHistory({
            present: currentToEdit.cvData,
            past: [],
            future: []
          });
          setTemplate(currentToEdit.templateId || 'ats-classic');
        }
      }
    };

    loadAllCVData();

    // Event listener for cross-context CV updates (from Onboarding, direct uploads, or re-parses)
    const handleActiveCVChanged = (event: Event) => {
      const customEvent = event as CustomEvent<CVVersion>;
      const version = customEvent.detail;
      if (version && version.id && version.cvData) {
        setVersions(prev => {
          const filtered = prev.filter(v => v.id !== version.id).map(v => ({ ...v, isActive: false }));
          return [version, ...filtered];
        });
        setActiveVersionIdState(version.id);
        setEditingVersionId(version.id);
        setHistory({
          present: version.cvData,
          past: [],
          future: []
        });
        setTemplate(version.templateId || 'ats-classic');
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('3watly_active_cv_changed', handleActiveCVChanged);
    }

    return () => {
      isMounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('3watly_active_cv_changed', handleActiveCVChanged);
      }
    };
  }, [user]);

  // Derived current & active versions
  const currentVersion = useMemo(() => {
    return versions.find(v => v.id === editingVersionId) || versions[0] || null;
  }, [versions, editingVersionId]);

  const activeVersion = useMemo(() => {
    return versions.find(v => v.id === activeVersionId) || versions[0] || null;
  }, [versions, activeVersionId]);

  // Cloud & LocalStorage Save Debounce
  const triggerSave = useCallback((updatedCv: CVData, currentTemplate: TemplateId, versionIdToSave: string) => {
    setSaveStatus('saving');
    if (saveTimer.current) window.clearTimeout(saveTimer.current);

    saveTimer.current = window.setTimeout(async () => {
      let versionToSync: CVVersion | null = null;

      setVersions(prev => {
        const next = prev.map(v => {
          if (v.id === versionIdToSave) {
            const liveAnalysis = analyzeCV(updatedCv, currentTemplate);
            const updated: CVVersion = {
              ...v,
              cvData: updatedCv,
              templateId: currentTemplate,
              updatedAt: new Date().toISOString(),
              atsScore: liveAnalysis.score,
              analysis: liveAnalysis
            };
            // Capture for sync AFTER render — never call side effects inside setState updater
            if (v.id === activeVersionId) {
              versionToSync = updated;
            }
            return updated;
          }
          return v;
        });

        try {
          localStorage.setItem('3watly_cv_versions', JSON.stringify(next));
          localStorage.setItem('3watly_cv_draft', JSON.stringify(updatedCv));
        } catch {}

        return next;
      });

      // Dispatch event OUTSIDE setState updater to avoid "setState during render" error
      if (versionToSync) {
        setTimeout(() => {
          syncActiveCVToPlatform(versionToSync!);
        }, 0);
      }

      setSaveStatus('saved');
    }, 450);
  }, [activeVersionId]);

  // Switch which version is currently being edited in CV Builder
  const switchEditingVersion = useCallback((id: string) => {
    setVersions(prev => {
      const target = prev.find(v => v.id === id);
      if (target) {
        setEditingVersionId(target.id);
        setHistory({
          present: target.cvData,
          past: [],
          future: []
        });
        setTemplate(target.templateId || 'ats-classic');
        toast.info(`تم التبديل لمحرر: ${target.name}`);
      }
      return prev;
    });
  }, []);

  // Set version as platform active (drives Jobs, ATS, Skill Gap, Copilot)
  const setActiveVersion = useCallback((id: string) => {
    setVersions(prev => {
      const target = prev.find(v => v.id === id);
      if (!target) return prev;

      setActiveVersionIdState(target.id);
      const next = prev.map(v => ({
        ...v,
        isActive: v.id === target.id
      }));
      try {
        localStorage.setItem('3watly_cv_versions', JSON.stringify(next));
        localStorage.setItem('3watly_active_cv_id', target.id);
      } catch {}

      syncActiveCVToPlatform({ ...target, isActive: true });
      toast.success(`تم تعيين "${target.name}" كنسخة أساسية نشطة للمنصة 🎯`);
      return next;
    });
  }, []);

  // Create a brand new version (immediately updates editor and preview state)
  const createVersion = useCallback((name: string, targetRole: string = 'Data Analyst', fromCv?: CVData) => {
    const newId = `ver-${Date.now()}`;
    const cvPayload = fromCv || initialCV;
    const newVersion: CVVersion = {
      id: newId,
      name: name.trim() || 'سيرة ذاتية جديدة',
      targetRole: targetRole.trim() || 'Data Analyst',
      cvData: cvPayload,
      templateId: 'ats-classic',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    };

    setVersions(prev => {
      const next = [newVersion, ...prev.map(v => ({ ...v, isActive: false }))];
      try {
        localStorage.setItem('3watly_cv_versions', JSON.stringify(next));
        localStorage.setItem('3watly_active_cv_id', newId);
        localStorage.setItem('3watly_cv_draft', JSON.stringify(cvPayload));
      } catch {}
      return next;
    });

    // Synchronously update editor & preview state
    setEditingVersionId(newId);
    setActiveVersionIdState(newId);
    setHistory({
      present: cvPayload,
      past: [],
      future: []
    });
    setTemplate('ats-classic');

    syncActiveCVToPlatform(newVersion);
    toast.success(`تم إنشاء وتفعيل: "${newVersion.name}" 🚀`);
    return newVersion;
  }, []);

  // Duplicate an existing version (e.g. tailor for specific job)
  const duplicateVersion = useCallback((id: string, newName?: string) => {
    const source = versions.find(v => v.id === id) || currentVersion;
    if (!source) return createVersion('نسخة مستنسخة');

    const newId = `ver-${Date.now()}`;
    const duplicated: CVVersion = {
      id: newId,
      name: newName || `${source.name} (نسخة مخصصة)`,
      targetRole: source.targetRole,
      cvData: JSON.parse(JSON.stringify(source.cvData)),
      templateId: source.templateId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: false
    };

    setVersions(prev => {
      const next = [...prev, duplicated];
      localStorage.setItem('3watly_cv_versions', JSON.stringify(next));
      return next;
    });

    switchEditingVersion(newId);
    toast.success(`تم استنساخ النسخة بنجاح: "${duplicated.name}"`);
    return duplicated;
  }, [versions, currentVersion, createVersion, switchEditingVersion]);

  // Rename a version
  const renameVersion = useCallback((id: string, newName: string, newTargetRole?: string) => {
    setVersions(prev => {
      const next = prev.map(v => {
        if (v.id === id) {
          const updated = {
            ...v,
            name: newName.trim() || v.name,
            targetRole: newTargetRole ? newTargetRole.trim() : v.targetRole,
            updatedAt: new Date().toISOString()
          };
          if (v.id === activeVersionId) {
            syncActiveCVToPlatform(updated);
          }
          return updated;
        }
        return v;
      });
      localStorage.setItem('3watly_cv_versions', JSON.stringify(next));
      return next;
    });
    toast.success('تم تحديث اسم ومجال النسخة بنجاح');
  }, [activeVersionId]);

  // Delete a version (must retain at least 1)
  const deleteVersion = useCallback((id: string) => {
    if (versions.length <= 1) {
      toast.error('لا يمكن حذف النسخة الوحيدة المتبقية');
      return;
    }

    setVersions(prev => {
      const next = prev.filter(v => v.id !== id);
      localStorage.setItem('3watly_cv_versions', JSON.stringify(next));

      // If we deleted the active or editing version, fallback to first available
      if (id === activeVersionId) {
        const newActive = next[0];
        setActiveVersionIdState(newActive.id);
        syncActiveCVToPlatform(newActive);
      }
      if (id === editingVersionId) {
        const newEdit = next[0];
        setEditingVersionId(newEdit.id);
        setHistory({
          present: newEdit.cvData,
          past: [],
          future: []
        });
        setTemplate(newEdit.templateId || 'ats-classic');
      }

      return next;
    });

    toast.success('تم حذف النسخة');
  }, [versions.length, activeVersionId, editingVersionId]);

  const update = useCallback(
    (updater: (prev: CVData) => CVData, label?: string) => {
      const now = Date.now();
      const current = cvRef.current;
      const next = updater(current);

      if (next === current) return;

      const coalesce =
        label &&
        lastLabel.current === label &&
        now - lastEditAt.current < COALESCE_MS;

      lastLabel.current = label ?? null;
      lastEditAt.current = now;

      setHistory((prev) => {
        if (coalesce) {
          return {
            present: next,
            past: prev.past,
            future: []
          };
        }
        return {
          present: next,
          past: [...prev.past.slice(-(MAX_HISTORY - 1)), prev.present],
          future: []
        };
      });

      triggerSave(next, template, editingVersionId);
    },
    [template, editingVersionId, triggerSave]
  );

  const handleSetTemplate = useCallback((nextTemplate: TemplateId) => {
    setTemplate(nextTemplate);
    triggerSave(cvRef.current, nextTemplate, editingVersionId);
  }, [editingVersionId, triggerSave]);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, -1);
      return {
        present: previous,
        past: newPast,
        future: [prev.present, ...prev.future].slice(0, MAX_HISTORY)
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);
      return {
        present: next,
        past: [...prev.past, prev.present].slice(-MAX_HISTORY),
        future: newFuture
      };
    });
  }, []);

  const analysis = useMemo(() => analyzeCV(history.present, template), [history.present, template]);

  const applyFix = useCallback(
    (id: FixId): string => {
      let toastMessage = '';

      // Role-specific default content helpers
      const getRoleKey = (jobTitle: string) => {
        const t = (jobTitle || '').toLowerCase();
        if (/machine learning|ml|ai|computer vision|deep learning/.test(t)) return 'ml';
        if (/frontend|react|web/.test(t)) return 'frontend';
        if (/backend|node|php|laravel/.test(t)) return 'backend';
        return 'data';
      };

      const ROLE_SUMMARY: Record<string, string> = {
        ml: 'Aspiring Machine Learning Engineer with hands-on experience in model development, computer vision, and data preprocessing. Proficient in Python, TensorFlow, and Scikit-Learn. Passionate about applying AI to solve real-world problems in the Egyptian tech ecosystem.',
        frontend: 'Frontend Developer with solid experience building responsive, performant web interfaces using React and Next.js. Skilled in TypeScript, Tailwind CSS, and modern UI/UX principles.',
        backend: 'Backend Engineer with experience building scalable REST APIs and database-driven systems. Proficient in Node.js/Python and relational databases.',
        data: 'Junior Data Analyst with hands-on experience in Exploratory Data Analysis (EDA), data visualization, and machine learning. Skilled in Python, SQL, and Power BI. Passionate about uncovering insights that drive data-informed decisions in the Egyptian market.',
      };

      const ROLE_SKILLS: Record<string, string[]> = {
        ml: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-Learn', 'OpenCV', 'Pandas', 'NumPy', 'Deep Learning', 'Computer Vision', 'Git'],
        frontend: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'JavaScript', 'HTML5', 'CSS3', 'Git', 'REST APIs', 'Redux'],
        backend: ['Node.js', 'Python', 'SQL', 'PostgreSQL', 'REST APIs', 'Docker', 'Git', 'Express', 'Redis', 'Linux'],
        data: ['SQL', 'Python', 'Power BI', 'Excel', 'Pandas', 'Tableau', 'Data Visualization', 'Statistical Analysis', 'Data Cleaning', 'Git'],
      };

      const ROLE_BULLETS: Record<string, string[]> = {
        ml: [
          'Developed and trained machine learning models to solve real-world classification and regression problems.',
          'Implemented data preprocessing and feature engineering pipelines to improve model performance.',
          'Conducted exploratory data analysis (EDA) to uncover trends and patterns in large datasets.',
        ],
        frontend: [
          'Built responsive and accessible web interfaces using React and Tailwind CSS.',
          'Integrated REST APIs and managed application state using React Query and Context.',
          'Collaborated with designers to translate Figma mockups into production-ready components.',
        ],
        backend: [
          'Designed and implemented RESTful APIs serving high-traffic client applications.',
          'Optimized SQL queries and database schemas to improve response times.',
          'Wrote unit and integration tests to ensure code reliability and maintainability.',
        ],
        data: [
          'Analyzed datasets using Python (Pandas, NumPy) to extract actionable business insights.',
          'Built interactive dashboards in Power BI / Tableau to support executive decision-making.',
          'Cleaned and transformed raw data from multiple sources to ensure consistency and accuracy.',
        ],
      };

      update((prev) => {
        const roleKey = getRoleKey(prev.contact.jobTitle || '');

        switch (id) {
          case 'summary-missing': {
            const summaryText = ROLE_SUMMARY[roleKey];
            toastMessage = 'Added an ATS-optimized Professional Summary.';
            return { ...prev, summary: summaryText };
          }

          case 'summary-short': {
            const existing = prev.summary.trim();
            const extension = ` ${ROLE_SUMMARY[roleKey].split('. ').slice(-1)[0]}`;
            const expanded = existing.endsWith('.') ? `${existing}${extension}` : `${existing}. ${extension.trim()}`;
            toastMessage = 'Expanded your Professional Summary with more ATS-friendly content.';
            return { ...prev, summary: expanded };
          }

          case 'linkedin-missing': {
            toastMessage = 'Please enter your actual LinkedIn profile URL in the Contact section.';
            return prev;
          }

          case 'few-bullets': {
            const additions = ROLE_BULLETS[roleKey];
            const exp = prev.experience.map((item) => {
              const nonEmpty = item.bullets.filter((b) => b.trim().length > 0);
              if (nonEmpty.length < 2) {
                const needed = Math.max(0, 3 - nonEmpty.length);
                return { ...item, bullets: [...nonEmpty, ...additions.slice(0, needed)] };
              }
              return item;
            });
            toastMessage = 'Added descriptive, action-led bullets to thin experience entries.';
            return { ...prev, experience: exp };
          }

          case 'few-skills': {
            const candidates = ROLE_SKILLS[roleKey];
            const currentSkillsLower = prev.skills.flatMap((g) => g.skills.map((s) => s.toLowerCase()));
            const toAdd = candidates.filter((s) => !currentSkillsLower.includes(s.toLowerCase())).slice(0, 5);
            if (toAdd.length === 0) {
              toastMessage = 'Your skills section is already comprehensive!';
              return prev;
            }
            const skills = [...prev.skills];
            if (skills.length > 0) {
              skills[0] = { ...skills[0], skills: [...new Set([...skills[0].skills, ...toAdd])] };
            } else {
              skills.push({ id: 'skill-tech', label: 'Technical Skills', skills: toAdd });
            }
            toastMessage = `Added ${toAdd.join(', ')} to your Technical Skills group.`;
            return { ...prev, skills };
          }

          case 'keywords': {
            const missing = analysis.keywords.missing.slice(0, 3);
            if (missing.length === 0) {
              toastMessage = 'All priority keywords are already present.';
              return prev;
            }
            toastMessage = `Added ${missing.join(', ')} to your Technical Skills group.`;
            const skills = [...prev.skills];
            const target = skills[0] ?? { id: 'skill-tech', label: 'Technical Skills', skills: [] };
            const nextSkills = Array.from(new Set([...target.skills, ...missing]));
            if (skills.length === 0) {
              return { ...prev, skills: [{ ...target, skills: nextSkills }] };
            }
            skills[0] = { ...target, skills: nextSkills };
            return { ...prev, skills };
          }

          case 'metrics': {
            const exp = prev.experience.map((item, index) => {
              const bullets = item.bullets.map((b, bIdx) => enhanceBullet(b, index + bIdx));
              return { ...item, bullets };
            });
            toastMessage = 'Strengthened experience bullets with action verbs and impact language.';
            return { ...prev, experience: exp };
          }

          case 'skills-summary': {
            const topList = prev.skills.flatMap((g) => g.skills).slice(0, 8).join(' · ');
            toastMessage = 'Added an ATS-focused Skills Summary banner.';
            return {
              ...prev,
              skillsSummary: topList
                ? `Core Competencies: ${topList}`
                : 'Core Competencies: SQL · Python · Excel · Power BI · Data Modeling · Git',
            };
          }

          default:
            return prev;
        }
      }, `fix-${id}`);

      return toastMessage;
    },
    [analysis.keywords.missing, update]
  );

  const value = useMemo(
    () => ({
      cv: history.present,
      template,
      setTemplate: handleSetTemplate,
      saveStatus,
      update,
      undo,
      redo,
      canUndo: history.past.length > 0,
      canRedo: history.future.length > 0,
      analysis,
      applyFix,
      versions,
      activeVersionId,
      editingVersionId,
      currentVersion,
      activeVersion,
      setActiveVersion,
      switchEditingVersion,
      createVersion,
      duplicateVersion,
      renameVersion,
      deleteVersion
    }),
    [
      history.present,
      template,
      handleSetTemplate,
      saveStatus,
      update,
      undo,
      redo,
      history.past.length,
      history.future.length,
      analysis,
      applyFix,
      versions,
      activeVersionId,
      editingVersionId,
      currentVersion,
      activeVersion,
      setActiveVersion,
      switchEditingVersion,
      createVersion,
      duplicateVersion,
      renameVersion,
      deleteVersion
    ]
  );

  return <CVContext.Provider value={value}>{children}</CVContext.Provider>;
}

export function useCV() {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
}
