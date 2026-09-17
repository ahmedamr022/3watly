export type TechIconName =
  | 'sql'
  | 'python'
  | 'pandas'
  | 'powerbi'
  | 'ml'
  | 'cloud'
  | 'docker'
  | 'etl'
  | 'mongodb'
  | 'ai';

export interface TechItem {
  id: string;
  name: string;
  subtitleEn: string;
  subtitleAr: string;
  icon: TechIconName;
  /** Primary glow colour as "R G B" triple for alpha compositing. */
  accent: string;
  /** Secondary glow colour for dimensional two-tone edge lighting. */
  accentAlt: string;
  /** Hex color for the icon. */
  iconColor: string;
  /** Search query or link target. */
  query: string;
}

export const techStack: TechItem[] = [
  {
    id: 'sql',
    name: 'SQL',
    subtitleEn: 'Data Query & Analysis',
    subtitleAr: 'استعلام وتحليل البيانات',
    icon: 'sql',
    accent: '0 130 255',
    accentAlt: '0 210 255',
    iconColor: '#38BDF8',
    query: 'SQL'
  },
  {
    id: 'python',
    name: 'Python',
    subtitleEn: 'Data Processing',
    subtitleAr: 'معالجة وهندسة البيانات',
    icon: 'python',
    accent: '56 189 248',
    accentAlt: '250 204 21',
    iconColor: '#FACC15',
    query: 'Python'
  },
  {
    id: 'pandas',
    name: 'Pandas',
    subtitleEn: 'Data Manipulation',
    subtitleAr: 'هيكلة وتجهيز البيانات',
    icon: 'pandas',
    accent: '168 85 247',
    accentAlt: '129 140 248',
    iconColor: '#C084FC',
    query: 'Pandas'
  },
  {
    id: 'powerbi',
    name: 'Power BI',
    subtitleEn: 'Data Visualization',
    subtitleAr: 'تصور ولوحات البيانات',
    icon: 'powerbi',
    accent: '245 158 11',
    accentAlt: '20 184 166',
    iconColor: '#FBBF24',
    query: 'Power BI'
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    subtitleEn: 'Build Intelligence',
    subtitleAr: 'بناء النماذج الذكية',
    icon: 'ml',
    accent: '129 140 248',
    accentAlt: '192 132 252',
    iconColor: '#A5B4FC',
    query: 'Machine Learning'
  },
  {
    id: 'cloud',
    name: 'Cloud',
    subtitleEn: 'Deploy & Scale',
    subtitleAr: 'البنية السحابية والنشر',
    icon: 'cloud',
    accent: '6 182 212',
    accentAlt: '56 189 248',
    iconColor: '#38BDF8',
    query: 'Cloud'
  },
  {
    id: 'docker',
    name: 'Docker',
    subtitleEn: 'Containerization',
    subtitleAr: 'الحاويات وإدارة التطبيقات',
    icon: 'docker',
    accent: '2 132 199',
    accentAlt: '56 189 248',
    iconColor: '#60A5FA',
    query: 'Docker'
  },
  {
    id: 'etl',
    name: 'ETL',
    subtitleEn: 'Data Pipeline',
    subtitleAr: 'خطوط نقل وتحويل البيانات',
    icon: 'etl',
    accent: '20 184 166',
    accentAlt: '52 211 153',
    iconColor: '#2DD4BF',
    query: 'ETL'
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    subtitleEn: 'NoSQL Database',
    subtitleAr: 'قواعد بيانات NoSQL',
    icon: 'mongodb',
    accent: '34 197 94',
    accentAlt: '74 222 128',
    iconColor: '#4ADE80',
    query: 'MongoDB'
  },
  {
    id: 'ai',
    name: 'AI',
    subtitleEn: 'Smarter Solutions',
    subtitleAr: 'حلول الذكاء الاصطناعي',
    icon: 'ai',
    accent: '192 132 252',
    accentAlt: '244 63 94',
    iconColor: '#E879F9',
    query: 'AI'
  }
];
