export interface PlatformSkill {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
}

export const PLATFORM_SKILLS: PlatformSkill[] = [
  // Foundation & Programming
  { id: 'python', name: 'Python', nameAr: 'بايثون', category: 'Programming', categoryAr: 'البرمجة' },
  { id: 'sql', name: 'SQL', nameAr: 'قواعد بيانات SQL', category: 'Database', categoryAr: 'قواعد البيانات' },
  { id: 'git', name: 'Git & GitHub', nameAr: 'إدارة الإصدارات Git', category: 'DevOps', categoryAr: 'التطوير والتشغيل' },
  { id: 'typescript', name: 'TypeScript', nameAr: 'تايب سكريبت', category: 'Programming', categoryAr: 'البرمجة' },
  
  // Data Engineering & Big Data
  { id: 'etl', name: 'ETL Pipelines', nameAr: 'أنابيب معالجة البيانات ETL', category: 'Data Engineering', categoryAr: 'هندسة البيانات' },
  { id: 'airflow', name: 'Apache Airflow', nameAr: 'أباتشي إيرفلو (Airflow)', category: 'Data Engineering', categoryAr: 'هندسة البيانات' },
  { id: 'docker', name: 'Docker', nameAr: 'حاويات دوكر (Docker)', category: 'DevOps', categoryAr: 'التطوير والتشغيل' },
  { id: 'spark', name: 'Apache Spark', nameAr: 'أباتشي سبارك (Big Data)', category: 'Data Engineering', categoryAr: 'هندسة البيانات' },
  { id: 'data-modeling', name: 'Data Modeling', nameAr: 'نمذجة البيانات', category: 'Data Engineering', categoryAr: 'هندسة البيانات' },
  { id: 'dbt', name: 'dbt (Data Build Tool)', nameAr: 'أداة dbt للتحويلات', category: 'Data Engineering', categoryAr: 'هندسة البيانات' },
  
  // Business Intelligence & Analytics
  { id: 'powerbi', name: 'Power BI', nameAr: 'باور بي آي (Power BI)', category: 'BI & Analytics', categoryAr: 'ذكاء الأعمال والتحليلات' },
  { id: 'tableau', name: 'Tableau', nameAr: 'تابلوه (Tableau)', category: 'BI & Analytics', categoryAr: 'ذكاء الأعمال والتحليلات' },
  { id: 'excel', name: 'Advanced Excel', nameAr: 'إكسيل متقدم للتحليل', category: 'BI & Analytics', categoryAr: 'ذكاء الأعمال والتحليلات' },
  
  // Web & Backend Development
  { id: 'react', name: 'React.js', nameAr: 'رياكت (React.js)', category: 'Frontend', categoryAr: 'تطوير الواجهات' },
  { id: 'nextjs', name: 'Next.js', nameAr: 'نكست (Next.js)', category: 'Frontend', categoryAr: 'تطوير الواجهات' },
  { id: 'nodejs', name: 'Node.js', nameAr: 'نود جي إس (Node.js)', category: 'Backend', categoryAr: 'تطوير الخوادم' },
  { id: 'fastapi', name: 'FastAPI', nameAr: 'فاست إي بي آي (FastAPI)', category: 'Backend', categoryAr: 'تطوير الخوادم' },
  { id: 'rest-api', name: 'RESTful APIs', nameAr: 'تصميم واجهات البرمجة APIs', category: 'Backend', categoryAr: 'تطوير الخوادم' },
  { id: 'postgresql', name: 'PostgreSQL', nameAr: 'بوستجريس (PostgreSQL)', category: 'Database', categoryAr: 'قواعد البيانات' },
  { id: 'mongodb', name: 'MongoDB', nameAr: 'مونجو دي بي (MongoDB)', category: 'Database', categoryAr: 'قواعد البيانات' },
  { id: 'redis', name: 'Redis', nameAr: 'ريديس (Redis Cache)', category: 'Database', categoryAr: 'قواعد البيانات' },
  
  // Cloud & DevOps
  { id: 'aws', name: 'AWS Cloud', nameAr: 'الحوسبة السحابية AWS', category: 'Cloud', categoryAr: 'السحابة' },
  { id: 'kubernetes', name: 'Kubernetes', nameAr: 'كوبرنيتس (K8s)', category: 'DevOps', categoryAr: 'التطوير والتشغيل' },
  { id: 'ci-cd', name: 'CI/CD Pipelines', nameAr: 'أتمتة النشر CI/CD', category: 'DevOps', categoryAr: 'التطوير والتشغيل' },
  { id: 'linux', name: 'Linux / Bash', nameAr: 'لينكس وشل سكربتنج', category: 'DevOps', categoryAr: 'التطوير والتشغيل' },
];

export function getSkillName(skillKey: string, isAr: boolean = false): string {
  const cleanKey = (skillKey || '').toLowerCase().trim();
  const skill = PLATFORM_SKILLS.find((s) => s.id === cleanKey);
  if (skill) {
    return isAr ? skill.nameAr : skill.name;
  }
  // Fallback to formatted key
  return skillKey ? skillKey.toUpperCase() : 'General';
}
