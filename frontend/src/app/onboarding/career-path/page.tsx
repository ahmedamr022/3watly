"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckIcon,
  ChartColumnIcon,
  CloudUploadIcon,
  CodeXmlIcon,
  DatabaseIcon,
  NetworkIcon,
  PlusIcon,
  SparklesIcon,
  XIcon
} from 'lucide-react';
import { StepShell } from '@/components/onboarding/StepShell';
import { StepFooter } from '@/components/onboarding/StepFooter';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { EASE, riseIn, springPop } from '@/utils/motion';

const roleIcons = {
  analytics: ChartColumnIcon,
  database: DatabaseIcon,
  code: CodeXmlIcon,
  network: NetworkIcon,
  cloud: CloudUploadIcon
} as const;

const roleTones = {
  blue: { tile: 'bg-[#EAF1FE] dark:bg-blue-950/60 dark:border dark:border-blue-500/20', icon: 'text-blue-600 dark:text-[#60A5FA]' },
  green: { tile: 'bg-[#E6F7EF] dark:bg-emerald-950/60 dark:border dark:border-emerald-500/20', icon: 'text-emerald-600 dark:text-[#34D399]' },
  violet: { tile: 'bg-[#ECEBFD] dark:bg-indigo-950/60 dark:border dark:border-indigo-500/20', icon: 'text-indigo-600 dark:text-[#A78BFA]' }
} as const;

export default function CareerPathPage() {
  const router = useRouter();
  const { isAr } = useLanguage();
  const { role, selectRole, experience, setExperience, locations, toggleLocation } = useOnboarding();
  const [locationMenuOpen, setLocationMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const roleOptionsList = isAr
    ? [
        {
          id: 'data-analyst' as const,
          title: 'محلل بيانات (Data Analyst)',
          description: 'تحويل البيانات المعقدة إلى قرارات بيزنس استراتيجية وذكية.',
          icon: 'analytics' as const,
          tone: 'blue' as const
        },
        {
          id: 'data-engineer' as const,
          title: 'مهندس بيانات (Data Engineer)',
          description: 'بناء وإدارة خطوط نقل ومعالجة البيانات الضخمة والبنية التحتية.',
          icon: 'database' as const,
          tone: 'green' as const
        },
        {
          id: 'software-engineer' as const,
          title: 'مهندس برمجيات (Software Engineer)',
          description: 'تصميم وبناء وتطوير تطبيقات برمجية قوية وقابلة للتوسع.',
          icon: 'code' as const,
          tone: 'blue' as const
        },
        {
          id: 'ml-engineer' as const,
          title: 'مهندس ذكاء اصطناعي (ML Engineer)',
          description: 'بناء وتدريب نماذج الذكاء الاصطناعي والتنبؤ الآلي.',
          icon: 'network' as const,
          tone: 'violet' as const
        },
        {
          id: 'devops' as const,
          title: 'أخصائي DevOps وسحابة',
          description: 'أتمتة ونشر وإدارة الأنظمة والبنية التحتية السحابية الموثوقة.',
          icon: 'cloud' as const,
          tone: 'blue' as const
        }
      ]
    : [
        {
          id: 'data-analyst' as const,
          title: 'Data Analyst',
          description: 'Turn data into actionable insights and drive business decisions.',
          icon: 'analytics' as const,
          tone: 'blue' as const
        },
        {
          id: 'data-engineer' as const,
          title: 'Data Engineer',
          description: 'Build and maintain reliable data pipelines and infrastructure.',
          icon: 'database' as const,
          tone: 'green' as const
        },
        {
          id: 'software-engineer' as const,
          title: 'Software Engineer',
          description: 'Design, build, and scale high-performance software systems.',
          icon: 'code' as const,
          tone: 'blue' as const
        },
        {
          id: 'ml-engineer' as const,
          title: 'Machine Learning Engineer',
          description: 'Build intelligent models that learn, predict, and automate tasks.',
          icon: 'network' as const,
          tone: 'violet' as const
        },
        {
          id: 'devops' as const,
          title: 'DevOps Specialist',
          description: 'Automate, deploy, and manage reliable cloud infrastructure.',
          icon: 'cloud' as const,
          tone: 'blue' as const
        }
      ];

  const experienceLevelsList = isAr
    ? ['خريج جديد', 'سنة - سنتين', '3 - 5 سنوات', '+5 سنوات']
    : ['Fresh Graduate', '1-2 Years', '3-5 Years', '5+ Years'];

  const allLocationOptions = isAr
    ? ['القاهرة', 'الجيزة', 'الإسكندرية', 'عمل عن بُعد (مصر)', 'عمل عن بُعد (دولي)', 'هجين — القاهرة']
    : ['Cairo', 'Giza', 'Alexandria', 'Remote in Egypt', 'Remote (Global)', 'Hybrid — Cairo'];

  const remainingLocations = allLocationOptions.filter((option) => !locations.includes(option));

  React.useEffect(() => {
    if (!locationMenuOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setLocationMenuOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLocationMenuOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [locationMenuOpen]);

  return (
    <StepShell step={1}>
      <div className="flex min-h-[calc(100vh-196px)] flex-col">
        {/* Heading */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-[#E3EAFA] dark:border-white/10 bg-[#F1F5FE] dark:bg-blue-950/70">
              <SparklesIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </span>
            <div>
              <h1 className="text-[27px] font-bold leading-tight tracking-tight text-[#0B132B] dark:text-white">
                {isAr ? "ما هو مسارك المهني المستهدف؟" : "What is your target career path?"}
              </h1>
              <p className="mt-1 text-[14px] font-normal text-slate-500 dark:text-slate-400">
                {isAr ? "اختر التخصص الأنسب لطموحاتك وخبراتك الحالية." : "Choose the role that best matches your career aspirations."}
              </p>
            </div>
          </div>
        </header>

        {/* Role Cards Grid */}
        <div
          role="radiogroup"
          aria-label="Target career path"
          className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {roleOptionsList.map((option, index) => {
            const Icon = roleIcons[option.icon];
            const tone = roleTones[option.tone];
            const selected = role === option.id;
            return (
              <motion.button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => selectRole(option.id)}
                {...riseIn(index)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.985 }}
                className={`group relative flex h-full flex-col items-start overflow-hidden rounded-2xl border p-5 text-left rtl:text-right transition-all duration-150 ease-smooth focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/25 cursor-pointer ${
                  selected
                    ? 'border-blue-600 dark:border-[#60A5FA] bg-[#F8FAFF] dark:bg-[#131E35] shadow-[0_20px_40px_-26px_rgba(27,87,224,0.5)] dark:shadow-[0_20px_40px_-26px_rgba(96,165,250,0.4)]'
                    : 'border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0D1527] shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:border-slate-300 dark:hover:border-white/20 hover:shadow-[0_18px_34px_-26px_rgba(27,45,105,0.35)]'
                }`}
              >
                <span
                  className={`relative flex h-[50px] w-[50px] items-center justify-center rounded-2xl transition-transform duration-200 ease-smooth group-hover:scale-[1.04] ${tone.tile}`}
                >
                  <Icon
                    className={`h-[22px] w-[22px] ${tone.icon}`}
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                </span>

                <AnimatePresence>
                  {selected && (
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={springPop}
                      className="absolute ltr:right-4 rtl:left-4 top-4 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500 shadow-sm"
                    >
                      <CheckIcon
                        className="h-[13px] w-[13px] text-white"
                        strokeWidth={3.2}
                        aria-hidden="true"
                      />
                    </motion.span>
                  )}
                </AnimatePresence>

                <h2 className="relative mt-4 text-[16.5px] font-bold leading-snug text-[#0B132B] dark:text-white">
                  {option.title}
                </h2>
                <p className="relative mt-1.5 text-[13px] font-normal leading-[1.55] text-slate-500 dark:text-slate-400">
                  {option.description}
                </p>
              </motion.button>
            );
          })}
        </div>

        {/* Preferences (Experience Level & Location) */}
        <div className="mt-8 grid grid-cols-1 gap-7 lg:grid-cols-2 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0D1527] p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          {/* Experience Level Section */}
          <section>
            <div className="flex items-center gap-2">
              <h2 className="text-[14px] font-bold text-[#1E293B] dark:text-slate-200">
                {isAr ? "مستوى الخبرة" : "Experience level"}
              </h2>
              <InfoTooltip content={isAr ? "يساعدنا في تخصيص ومطابقة الوظائف المناسبة لمستواك المهني وسنوات خبرتك." : "Helps us personalize job matches to your current seniority and career stage."} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {experienceLevelsList.map((level) => {
                const active = experience === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setExperience(level)}
                    aria-pressed={active}
                    className={`h-10 whitespace-nowrap rounded-xl border px-4 text-[13.5px] transition-all duration-150 ease-smooth active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 cursor-pointer ${
                      active
                        ? 'border-blue-600 dark:border-[#60A5FA] bg-[#EEF4FE] dark:bg-blue-950/70 font-bold text-blue-600 dark:text-blue-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700/80 bg-[#F8FAFC] dark:bg-[#131C31] font-medium text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Location Section */}
          <section>
            <div className="flex items-center gap-2">
              <h2 className="text-[14px] font-bold text-[#1E293B] dark:text-slate-200">
                {isAr ? "المحافظة ونطاق العمل" : "Location"}{' '}
                <span className="font-normal text-slate-400 dark:text-slate-400">
                  {isAr ? "(يمكنك اختيار أكثر من خيار)" : "(select all that apply)"}
                </span>
              </h2>
              <InfoTooltip content={isAr ? "نعطي أولوية لعرض الوظائف في المحافظات التي تختارها بالإضافة لفرص العمل عن بُعد." : "We prioritize job vacancies in your selected Egyptian governorates and remote opportunities."} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              <AnimatePresence initial={false}>
                {locations.map((location) => (
                  <motion.span
                    key={location}
                    layout
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={springPop}
                    className="flex h-10 items-center gap-2 rounded-xl border border-blue-600 dark:border-[#60A5FA] bg-[#EEF4FE] dark:bg-blue-950/70 ltr:pl-4 ltr:pr-2.5 rtl:pr-4 rtl:pl-2.5 text-[13.5px] font-bold text-blue-600 dark:text-blue-300 shadow-sm"
                  >
                    {location}
                    <button
                      type="button"
                      onClick={() => toggleLocation(location)}
                      aria-label={`Remove ${location}`}
                      className="rounded-md p-0.5 transition-colors duration-150 ease-smooth hover:bg-[#DCE7FC] dark:hover:bg-blue-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 cursor-pointer"
                    >
                      <XIcon className="h-[15px] w-[15px]" strokeWidth={2.4} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>

              {remainingLocations.length > 0 && (
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setLocationMenuOpen((open) => !open)}
                    aria-expanded={locationMenuOpen}
                    aria-haspopup="listbox"
                    className="flex h-10 items-center gap-1.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131C31] px-4 text-[13.5px] font-medium text-slate-500 dark:text-slate-300 transition-all duration-150 ease-smooth active:scale-[0.97] hover:border-blue-600 dark:hover:border-[#60A5FA] hover:text-blue-600 dark:hover:text-[#60A5FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 cursor-pointer"
                  >
                    <PlusIcon className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
                    {isAr ? "إضافة محافظة / نطاق" : "Add location"}
                  </button>

                  <AnimatePresence>
                    {locationMenuOpen && (
                      <motion.ul
                        role="listbox"
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.17, ease: EASE }}
                        className="absolute ltr:left-0 rtl:right-0 top-12 z-20 w-56 overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0D1527] py-1.5 shadow-xl dark:shadow-2xl dark:shadow-black/90"
                      >
                        {remainingLocations.map((option) => (
                          <li key={option} role="option" aria-selected={false}>
                            <button
                              type="button"
                              onClick={() => {
                                toggleLocation(option);
                                setLocationMenuOpen(false);
                              }}
                              className="block w-full px-4 py-2 text-left rtl:text-right text-[13.5px] font-medium text-slate-700 dark:text-slate-300 transition-colors duration-150 ease-smooth hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                            >
                              {option}
                            </button>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Footer CTA */}
        <div className="mt-auto pt-8">
          <StepFooter
            onNext={() => router.push('/onboarding/cv-upload')}
            nextLabel={isAr ? "المتابعة إلى رفع الـ CV" : "Continue to CV Upload"}
            nextDisabled={!role}
            showBack={false}
            hint={!role ? (isAr ? "اختر مسارك المهني للمتابعة" : "Select a career path to continue") : undefined}
          />
        </div>
      </div>
    </StepShell>
  );
}
