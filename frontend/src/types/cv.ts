export type SectionId =
'contact' |
'summary' |
'experience' |
'education' |
'projects' |
'skills';

export interface Contact {
  fullName: string;
  jobTitle: string;
  phone: string;
  email: string;
  linkedin: string;
  location: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  location: string;
  major: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  technologies: string[];
  bullets: string[];
}

export interface SkillGroup {
  id: string;
  label: string;
  skills: string[];
}

export interface CVData {
  contact: Contact;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: SkillGroup[];
  /** Order the sections appear in on the rendered CV. */
  sectionOrder: SectionId[];
  /** Sections excluded from the rendered CV (still editable). */
  hiddenSections: SectionId[];
  /** Optional one-line skills summary (added by the ATS "Skills Summary" fix). */
  skillsSummary: string | null;
}

export type TemplateId = 'ats-classic' | 'modern-minimal' | 'compact';

export type SaveStatus = 'saved' | 'saving';

export type FixId = 'keywords' | 'metrics' | 'skills-summary';

export type ScoreBand = 'excellent' | 'good' | 'average' | 'poor';