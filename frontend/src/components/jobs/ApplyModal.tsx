"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Zap, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  Sparkles, 
  Building2, 
  Send,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { CompanyLogo } from '@/components/brand/CompanyLogo';
import { JobItem } from '@/data/jobs';

interface ApplyModalProps {
  job: JobItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ApplyModal({ job, isOpen, onClose, onSuccess }: ApplyModalProps) {
  const { isAr } = useLanguage();
  const { user } = useAuth();
  const { file, parsedCv } = useOnboarding();
  const [step, setStep] = useState<'options' | 'submitting' | 'success'>('options');
  const [customNote, setCustomNote] = useState('');
  const [includeCoverLetter, setIncludeCoverLetter] = useState(true);

  const cvFileName = file?.name || parsedCv?.filename || (user?.fullName ? `${user.fullName.replace(/\s+/g, '_')}_CV.pdf` : 'My_Resume.pdf');

  if (!isOpen || !job) return null;

  const handle1ClickSubmit = () => {
    setStep('submitting');
    setTimeout(() => {
      setStep('success');
      if (onSuccess) onSuccess();
    }, 1200);
  };

  const getCompanyCareerUrl = (company: string) => {
    const norm = company.toLowerCase();
    if (norm.includes('vodafone')) return 'https://jobs.vodafone.com/careers';
    if (norm.includes('valeo')) return 'https://www.valeo.com/en/careers/';
    if (norm.includes('siemens')) return 'https://jobs.siemens.com';
    return 'https://paymob.com/en/careers';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg rounded-[26px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-2xl z-10 overflow-hidden"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 ltr:right-5 rtl:left-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* STEP 1: OPTIONS */}
          {step === 'options' && (
            <div className="space-y-5">
              
              {/* Header */}
              <div className="flex items-center gap-3.5 pr-8 rtl:pr-0 rtl:pl-8">
                <CompanyLogo company={job.company} size="md" />
                <div>
                  <h3 className="text-[17px] font-black text-[#0B132B] dark:text-white leading-tight">
                    {isAr ? "التقديم على الوظيفة" : "Apply for Role"}
                  </h3>
                  <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isAr ? job.titleAr : job.title} • {isAr ? job.companyAr : job.company}
                  </p>
                </div>
              </div>

              {/* Match Highlight Banner */}
              <div className="p-3.5 rounded-2xl bg-[#E8F8F0] dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-white font-black text-[12px]">
                    {job.matchScore}%
                  </span>
                  <div>
                    <span className="text-[12px] font-bold text-emerald-900 dark:text-emerald-300 block">
                      {isAr ? "نسبة توافق ممتازة مع سيرتك الذاتية!" : "High Compatibility with your profile!"}
                    </span>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block">
                      {isAr ? "سيتم إبراز مهاراتك: SQL و Python و Power BI" : "Top skills will be highlighted"}
                    </span>
                  </div>
                </div>
                <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
              </div>

              {/* Primary Method: 1-Click Smart Apply via 3WATLY */}
              <div className="p-4 rounded-2xl border-2 border-blue-500/80 bg-blue-50/40 dark:bg-blue-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13.5px] font-bold text-[#1B57E0] dark:text-blue-400 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 fill-current" />
                    <span>{isAr ? "التقديم الفوري الذكي بنقرة واحدة (مُوصى به)" : "1-Click Smart Apply (Recommended)"}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                    FAST
                  </span>
                </div>

                {/* Attached CV Preview */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#070B14] border border-blue-200 dark:border-blue-500/30">
                  <div className="flex items-center gap-2 text-[12px] truncate">
                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{cvFileName}</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded shrink-0">
                      {isAr ? "مُحسّن ATS" : "ATS Optimized"}
                    </span>
                  </div>
                  <Link href="/cv-builder" className="text-[11px] font-bold text-blue-600 hover:underline shrink-0">
                    {isAr ? "تغيير" : "Change"}
                  </Link>
                </div>

                {/* Note input */}
                <textarea
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder={isAr ? "أضف رسالة قصيرة لمسؤول التوظيف (اختياري)..." : "Add a short note to the recruiter (optional)..."}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070B14] text-[12px] text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
                />

                <button
                  type="button"
                  onClick={handle1ClickSubmit}
                  className="w-full py-2.5 rounded-xl bg-[#1B57E0] hover:bg-blue-700 text-white text-[13.5px] font-bold shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isAr ? "إرسال طلب التقديم المباشر الآن" : "Submit Direct Application Now"}</span>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-[1px] flex-1 bg-slate-200 dark:bg-[#0B1120]/10" />
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  {isAr ? "أو" : "OR"}
                </span>
                <div className="h-[1px] flex-1 bg-slate-200 dark:bg-[#0B1120]/10" />
              </div>

              {/* Secondary Method: Official Company Career Site */}
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B1120]/[0.02] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[12.5px] font-bold text-[#0B132B] dark:text-white block">
                    {isAr ? `التقديم عبر موقع ${job.company} الرسمي` : `Apply on ${job.company} Career Site`}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {isAr ? "سيتم فتح بوابة التوظيف الرسمية للشركة في نافذة جديدة" : "Opens company portal in a new tab"}
                  </span>
                </div>

                <a
                  href={getCompanyCareerUrl(job.company)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#070B14] hover:bg-slate-100 text-[11.5px] font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <span>{isAr ? "فتح الموقع الرسمي" : "Open Portal"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          )}

          {/* STEP 2: SUBMITTING ANIMATION */}
          {step === 'submitting' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative h-16 w-16">
                <div className="h-full w-full rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
              </div>
              <div>
                <h4 className="text-[16px] font-bold text-[#0B132B] dark:text-white">
                  {isAr ? "جاري معالجة وتأكيد إرسال طلبك..." : "Processing your application..."}
                </h4>
                <p className="text-[12px] text-slate-400 mt-1">
                  {isAr ? "يتم إرفاق السيرة الذاتية وتحليل التوافق وتجهيز الملف" : "Attaching profile and ATS optimization data"}
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS CELEBRATION */}
          {step === 'success' && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h4 className="text-[18px] font-black text-[#0B132B] dark:text-white">
                  {isAr ? "تم إرسال طلبك بنجاح! 🎉" : "Application Submitted! 🎉"}
                </h4>
                <p className="text-[13px] text-slate-600 dark:text-slate-300 max-w-sm">
                  {isAr 
                    ? `تم تسليم ملفك وسيرتك الذاتية لفريق توظيف ${job.company}. سنقوم بإشعارك فور مراجعة طلبك!`
                    : `Your application has been delivered to ${job.company} hiring team. You will be notified of updates.`}
                </p>
              </div>

              <div className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#0B1120]/[0.02] border border-slate-100 dark:border-white/5 text-[12px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>{isAr ? "حالة الطلب:" : "Status:"}</span>
                  <span className="font-bold text-emerald-600">{isAr ? "قيد المراجعة الأولية" : "Under Review"}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isAr ? "تاريخ التقديم:" : "Applied on:"}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{isAr ? "الآن (اليوم)" : "Just Now"}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-[#1B57E0] hover:bg-blue-700 text-white text-[13.5px] font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                {isAr ? "حسناً، متابعة الوظائف الأخرى" : "Done, Continue Browsing"}
              </button>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
