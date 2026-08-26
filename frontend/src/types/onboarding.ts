export type RoleId =
'data-analyst' |
'data-engineer' |
'software-engineer' |
'ml-engineer' |
'devops';

export type TechKey =
'python' |
'sql' |
'pandas' |
'powerbi' |
'excel' |
'viz' |
'statistics' |
'problem' |
'docker' |
'kubernetes' |
'spark' |
'airflow' |
'react' |
'typescript' |
'node' |
'git' |
'tensorflow' |
'pytorch' |
'sklearn' |
'cloud' |
'terminal' |
'api';

export type Impact = 'High' | 'Medium' | 'Low';

export interface SkillGap {
  key: TechKey;
  name: string;
  level: number;
  impact: Impact;
}

export interface TargetRole {
  title: string;
  match: number;
  label: 'Strong Match' | 'Good Match' | 'Possible Match';
}

export interface RecommendedAction {
  key: TechKey | 'course' | 'project' | 'certificate' | 'dashboard';
  title: string;
  meta: string;
}

export interface PriorityItem {
  key: TechKey | 'course' | 'project' | 'certificate' | 'dashboard';
  title: string;
  description: string;
  impact: Impact;
}

export interface RoleProfile {
  headline: string;
  scores: {
    overall: number;
    skills: number;
    experience: number;
    education: number;
  };
  experienceYears: number;
  relevance: {relevant: number;related: number;other: number;};
  strengths: string[];
  topSkills: {key: TechKey;name: string;}[];
  extraSkillCount: number;
  skillGaps: SkillGap[];
  targetRoles: TargetRole[];
  actions: RecommendedAction[];
  priorities: PriorityItem[];
}

export interface ParsedCv {
  fullName: string;
  currentTitle: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: {
    title: string;
    company: string;
    location: string;
    period: string;
    bullets: string[];
  };
  education: {degree: string;school: string;period: string;};
  detectedSkills: {key: TechKey;name: string;}[];
}

export type ParseStatus = 'idle' | 'uploading' | 'parsing' | 'complete';

export interface UploadedFile {
  name: string;
  sizeLabel: string;
}