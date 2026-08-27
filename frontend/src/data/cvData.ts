import type { CVData, SectionId, TemplateId } from '../types/cv';

export const initialCV: CVData = {
  contact: {
    fullName: 'Ahmed Amr',
    jobTitle: 'Data Analyst',
    phone: '+20 100 123 4567',
    email: 'ahmed.amr@email.com',
    linkedin: 'linkedin.com/in/ahmedamr',
    location: 'Cairo, Egypt'
  },
  summary:
  'Data Analyst with 2+ years of experience turning data into actionable insights that drive business performance. Skilled in SQL, Python, Power BI, and Excel. Passionate about building dashboards, identifying trends, and solving problems through data.',
  experience: [
  {
    id: 'exp-vodafone',
    role: 'Data Analyst',
    company: 'Vodafone Egypt',
    startDate: 'Jan 2023',
    endDate: '',
    current: true,
    location: 'Smart Village, Giza (Hybrid)',
    bullets: [
    'Analyzed customer behavior and sales data to identify trends and opportunities.',
    'Built interactive Power BI dashboards used by 10+ stakeholders for daily reporting.',
    'Automated data extraction and reporting processes using SQL and Python, saving 10+ hours weekly.',
    'Collaborated with cross-functional teams to support data-driven decision making.']

  },
  {
    id: 'exp-raya',
    role: 'Junior Data Analyst',
    company: 'Raya Customer Experience',
    startDate: 'Jul 2021',
    endDate: 'Dec 2022',
    current: false,
    location: 'Cairo, Egypt (On-site)',
    bullets: [
    'Cleaned and transformed large datasets using SQL and Excel.',
    'Created reports and dashboards to monitor KPIs and track performance.',
    'Supported the analytics team in ad-hoc analysis and data validation.']

  }],

  education: [
  {
    id: 'edu-auc',
    degree: 'Bachelor of Business Administration (BBA)',
    institution: 'The American University in Cairo',
    startDate: 'Sep 2017',
    endDate: 'May 2021',
    location: 'Cairo, Egypt',
    major: 'Management Information Systems'
  }],

  projects: [
  {
    id: 'prj-sales-dashboard',
    title: 'Sales Analytics Dashboard',
    technologies: ['Power BI', 'SQL', 'Excel', 'DAX'],
    bullets: [
    'Built an interactive sales dashboard using Power BI to track KPIs across regions and product categories.',
    'Connected and cleaned data from multiple sources (Excel, SQL).',
    'Implemented DAX measures to analyze YoY growth and revenue trends.',
    'Enabled data-driven decisions that improved regional performance by 15%.']

  }],

  skills: [
  {
    id: 'skill-technical',
    label: 'Technical Skills',
    skills: ['SQL', 'Python', 'Excel', 'Power BI', 'DAX', 'Tableau (Basics)']
  },
  {
    id: 'skill-analysis',
    label: 'Analysis Skills',
    skills: [
    'Data Cleaning',
    'EDA',
    'Data Visualization',
    'Statistical Analysis']

  },
  {
    id: 'skill-tools',
    label: 'Tools & Others',
    skills: ['Git', 'Microsoft Office', 'Google Sheets']
  }],

  sectionOrder: [
  'contact',
  'summary',
  'experience',
  'education',
  'projects',
  'skills'],

  hiddenSections: [],
  skillsSummary: null
};

/**
 * Keywords the Egyptian tech market asks for in Data Analyst postings.
 * Missing keywords are surfaced in the order listed here.
 */
export const MARKET_KEYWORDS: string[] = [
'SQL',
'Python',
'Excel',
'Power BI',
'Tableau',
'DAX',
'Data Visualization',
'Data Cleaning',
'Dashboards',
'Git',
'Statistical Analysis',
'Docker',
'Airflow',
'Data Modeling',
'ETL',
'Pandas',
'Snowflake',
'dbt'];


/** Number of market keywords that counts as full keyword coverage. */
export const KEYWORD_BENCHMARK = 13;

export const TEMPLATES: {
  id: TemplateId;
  name: string;
  columns: number;
  description: string;
}[] = [
{
  id: 'ats-classic',
  name: 'ATS Classic',
  columns: 1,
  description: 'Single column, ruled headings — safest for parsers.'
},
{
  id: 'modern-minimal',
  name: 'Modern Minimal',
  columns: 1,
  description: 'Airy spacing with letterspaced headings.'
},
{
  id: 'compact',
  name: 'Compact',
  columns: 1,
  description: 'Tighter rhythm to fit more on one page.'
}];


export const SECTION_META: Record<
  SectionId,
  {label: string;heading: string;}> =
{
  contact: { label: 'Header & Contact', heading: '' },
  summary: { label: 'Professional Summary', heading: 'Professional Summary' },
  experience: { label: 'Experience', heading: 'Experience' },
  education: { label: 'Education', heading: 'Education' },
  projects: { label: 'Projects', heading: 'Projects' },
  skills: { label: 'Skills', heading: 'Skills' }
};

export const CURRENT_USER = {
  name: 'Ahmed Salah',
  role: 'Data Analyst',
  initials: 'AS'
};