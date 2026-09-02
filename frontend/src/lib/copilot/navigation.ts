export const ALLOWED_NAV_PATHS = [
  '/dashboard',
  '/jobs',
  '/skill-plan',
  '/cv-builder',
  '/ats-diagnostics',
  '/market',
  '/settings',
  '/onboarding/upload-cv',
] as const;

export type AllowedNavigationPath = (typeof ALLOWED_NAV_PATHS)[number];

export interface NavPathMeta {
  path: AllowedNavigationPath;
  defaultLabelAr: string;
  defaultLabelEn: string;
}

export const NAV_PATH_REGISTRY: Record<AllowedNavigationPath, NavPathMeta> = {
  '/dashboard': {
    path: '/dashboard',
    defaultLabelAr: 'لوحة التحكم الرئيسية',
    defaultLabelEn: 'Career Dashboard',
  },
  '/jobs': {
    path: '/jobs',
    defaultLabelAr: 'استعراض الوظائف المطابقة',
    defaultLabelEn: 'Explore Matched Jobs',
  },
  '/skill-plan': {
    path: '/skill-plan',
    defaultLabelAr: 'بناء خطة المهارات',
    defaultLabelEn: 'Skill Gap & Learning Plan',
  },
  '/cv-builder': {
    path: '/cv-builder',
    defaultLabelAr: 'محرر السيرة الذاتية (CV Builder)',
    defaultLabelEn: 'Edit CV in Builder',
  },
  '/ats-diagnostics': {
    path: '/ats-diagnostics',
    defaultLabelAr: 'فحص الـ ATS وتوافق السيرة الذاتية',
    defaultLabelEn: 'ATS Diagnostic & Score',
  },
  '/market': {
    path: '/market',
    defaultLabelAr: 'مؤشرات وسوق العمل المصري',
    defaultLabelEn: 'Market Intelligence',
  },
  '/settings': {
    path: '/settings',
    defaultLabelAr: 'إعدادات الحساب والملف الشخصي',
    defaultLabelEn: 'Profile Settings',
  },
  '/onboarding/upload-cv': {
    path: '/onboarding/upload-cv',
    defaultLabelAr: 'رفع سيرة ذاتية جديدة',
    defaultLabelEn: 'Upload New CV',
  },
};

export function isAllowedNavPath(path: string): path is AllowedNavigationPath {
  return ALLOWED_NAV_PATHS.includes(path as AllowedNavigationPath);
}

export function sanitizeNavPath(path: string): AllowedNavigationPath | null {
  const clean = path.trim().split('?')[0].replace(/\/+$/, '') || '/';
  if (isAllowedNavPath(clean)) return clean;
  if (clean.startsWith('/jobs')) return '/jobs';
  if (clean.startsWith('/skill')) return '/skill-plan';
  if (clean.startsWith('/cv')) return '/cv-builder';
  if (clean.startsWith('/ats')) return '/ats-diagnostics';
  if (clean.startsWith('/market')) return '/market';
  if (clean.startsWith('/dash')) return '/dashboard';
  if (clean.startsWith('/setting')) return '/settings';
  return null;
}
