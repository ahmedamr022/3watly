"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { FileSearchIcon } from 'lucide-react';
import { StepShell } from '@/components/onboarding/StepShell';
import { RequireOnboarding } from '@/components/onboarding/RequireOnboarding';
import { SecureBadge } from '@/components/onboarding/PageHeading';
import { StepFooter } from '@/components/onboarding/StepFooter';
import { Dropzone } from '@/components/onboarding/cv/Dropzone';
import { ParsingStatus } from '@/components/onboarding/cv/ParsingStatus';
import { ExtractedSkills } from '@/components/onboarding/cv/ExtractedSkills';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { parsedCvByRole } from '@/data/roleProfiles';
import { roleOptions } from '@/data/roles';
import { fadeUp } from '@/utils/motion';
import { surface } from '@/utils/styles';

export default function CvUploadPage() {
  const router = useRouter();
  const { isAr } = useLanguage();
  const { role, file, status, progress, checksRevealed, skillsAdded, uploadFile, removeFile } =
    useOnboarding();

  const cv = role ? parsedCvByRole[role] : null;
  const roleTitle = roleOptions.find((option) => option.id === role)?.title;
  const showResults = Boolean(file && cv);
  const complete = status === 'complete';

  return (
    <RequireOnboarding need="role">
      <StepShell step={2}>
        <div className="flex min-h-[calc(100vh-196px)] flex-col">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-[27px] font-bold leading-tight tracking-tight text-[#0B132B] dark:text-white">
                {isAr ? "ارفع سيرتك الذاتية (CV)" : "Upload Your CV"}
              </h1>
              <p className="mt-1.5 text-[14px] font-normal text-slate-500 dark:text-slate-400">
                {isAr 
                  ? "محرك الذكاء الاصطناعي هيحلل خبراتك ومهاراتك ويطابقها مع متطلبات السوق المصري" 
                  : `Our AI will analyze your experience and skills ${roleTitle ? `against ${roleTitle} roles` : ''}`}
              </p>
            </div>
            <div className="pt-1.5">
              <SecureBadge />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <Dropzone
              file={file}
              status={status}
              progress={progress}
              onFile={uploadFile}
              onRemove={removeFile}
            />

            <AnimatePresence mode="wait" initial={false}>
              {showResults && cv ? (
                <motion.div key="parsing" {...fadeUp} className="h-full">
                  <ParsingStatus
                    cv={cv}
                    status={status}
                    progress={progress}
                    checksRevealed={checksRevealed}
                  />
                </motion.div>
              ) : (
                <motion.section
                  key="waiting"
                  {...fadeUp}
                  className={`flex h-full flex-col items-center justify-center border-dashed dark:border-white/10 dark:bg-[#0B1120] p-10 text-center ${surface}`}
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-canvas dark:bg-white/5">
                    <FileSearchIcon
                      className="h-6 w-6 text-slate-400 dark:text-slate-400"
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />
                  </span>
                  <h2 className="mt-4 text-[17px] font-bold text-[#0B132B] dark:text-white">
                    {isAr ? "فحص وتحليل حي للسيرة الذاتية" : "Live Parsing Status"}
                  </h2>
                  <p className="mt-2 max-w-[23rem] text-[13px] font-normal leading-[1.65] text-slate-500 dark:text-slate-400">
                    {isAr 
                      ? "بمجرد رفع الـ CV، يقوم عواطلي باستخراج سنوات خبرتك، تحديد مهاراتك التقنية، وفحص مطابقة ملفك مع معايير الـ ATS فوراً."
                      : "The moment you upload a CV, 3WATLY extracts your experience, detects your skills, and validates the ATS layout — live, right here."}
                  </p>
                  <ul className="mt-6 space-y-2.5 text-left rtl:text-right">
                    {(isAr 
                      ? ['استخراج وتحليل الخبرات السابقة', 'اكتشاف وتصنيف المهارات التقنية', 'فحص هيكل وتوافق أنظمة ATS']
                      : ['Experience extraction', 'Skill detection', 'ATS layout validation']
                    ).map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2.5 text-[12.5px] font-normal text-slate-500 dark:text-slate-400"
                      >
                        <span
                          className="h-[18px] w-[18px] rounded-full border border-dashed border-[#CBD5E8] dark:border-white/20"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence initial={false}>
            {showResults && cv && (
              <motion.div key="skills" {...fadeUp} className="mt-6">
                <ExtractedSkills cv={cv} addedCount={skillsAdded} complete={complete} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-auto pt-8">
            <StepFooter
              onBack={() => router.push('/onboarding/career-path')}
              onNext={() => router.push('/onboarding/profile-insights')}
              nextLabel={isAr ? "المتابعة إلى مؤشرات الملف" : "Continue to Profile Insights"}
              nextDisabled={!complete}
              hint={
                !file 
                  ? (isAr ? "ارفع سيرتك الذاتية للمتابعة" : "Upload your CV to continue")
                  : !complete 
                  ? (isAr ? "جاري تحليل الـ CV..." : "Analyzing your CV...") 
                  : undefined
              }
            />
          </div>
        </div>
      </StepShell>
    </RequireOnboarding>
  );
}
