'use client';

export interface SavedJobRecord {
  id: string;
  title: string;
  titleAr?: string;
  company: string;
  companyAr?: string;
  companyLogo?: string;
  location: string;
  locationAr?: string;
  workType?: string;
  salaryRange?: string;
  postedAgo?: string;
  postedAgoAr?: string;
  matchScore?: number | null;
  matchedSkills?: { name: string; isMatched: boolean }[];
  skills?: { name: string; isMatched: boolean }[];
  extraSkillsCount?: number;
  description?: string;
  savedAt?: string;
}

const STORAGE_KEY = '3watly_saved_jobs';
const OBJECTS_KEY = '3watly_saved_job_objects';
export const SAVED_JOBS_EVENT = '3watly_saved_jobs_updated';

export function getSavedJobIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function getSavedJobObjects(): SavedJobRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(OBJECTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : Object.values(parsed);
  } catch {
    return [];
  }
}

export function isJobBookmarked(id: string | number): boolean {
  const ids = getSavedJobIds();
  return ids.includes(String(id));
}

export function toggleJobBookmark(jobOrId: any): { isSaved: boolean; list: string[] } {
  if (typeof window === 'undefined') return { isSaved: false, list: [] };

  const id = String(jobOrId?.id ?? jobOrId);
  const currentIds = getSavedJobIds();
  const willBeSaved = !currentIds.includes(id);

  let nextIds: string[];
  let objectsMap: Record<string, any> = {};

  try {
    const rawObj = localStorage.getItem(OBJECTS_KEY);
    if (rawObj) {
      const parsed = JSON.parse(rawObj);
      if (Array.isArray(parsed)) {
        parsed.forEach((j: any) => { if (j?.id) objectsMap[String(j.id)] = j; });
      } else if (typeof parsed === 'object') {
        objectsMap = parsed;
      }
    }
  } catch {}

  if (willBeSaved) {
    nextIds = Array.from(new Set([...currentIds, id]));
    if (typeof jobOrId === 'object' && jobOrId !== null) {
      objectsMap[id] = {
        ...jobOrId,
        id,
        savedAt: new Date().toISOString()
      };
    }
  } else {
    nextIds = currentIds.filter(item => item !== id);
    delete objectsMap[id];
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds));
    localStorage.setItem(OBJECTS_KEY, JSON.stringify(objectsMap));
    window.dispatchEvent(new CustomEvent(SAVED_JOBS_EVENT, { detail: { id, isSaved: willBeSaved, list: nextIds } }));
  } catch (e) {
    console.warn('Failed to persist saved jobs to localStorage:', e);
  }

  return { isSaved: willBeSaved, list: nextIds };
}
