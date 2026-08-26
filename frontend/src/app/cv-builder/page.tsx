"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Sparkles, 
  ShieldCheck,
  Eye,
  RefreshCw
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CvBuilderPage() {
  const { isAr } = useLanguage();

  return (
    <AppShell
      title={isAr ? "صانع السيرة الذاتية وفاحص الـ ATS" : "Smart ATS CV Builder"}
      subtitle={isAr ? "سيرة ذاتية متوافقة 100% مع أنظمة التوظيف الآلية (ATS) وخوارزميات الشركات." : "Build clean, ATS-compliant resumes verified against Egyptian and global hiring scanners."}
    >
      <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
        
        {/* ATS Score & Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          
          {/* Score Card (Span 4) */}
          <div className="md:col-span-4 rounded-[24px] border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-slate-500">{isAr ? "درجة توافق الـ ATS العامة" : "Overall ATS Score"}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#12B76A] font-bold text-[11px]">
                  {isAr ? "جاهز للتقديم" : "Ready to Apply"}
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-[44px] font-black text-[#12B76A] leading-none">87</span>
                <span className="text-[18px] font-bold text-slate-400">/100</span>
              </div>
              <p className="text-[12.5px] text-slate-500 mt-2">
                {isAr ? "سيرتك الذاتية متوافقة بنسبة ممتازة مع أنظمة الفرز الإلكتروني لدى معظم الشركات." : "Your CV passes standard automated parsing algorithms with high fidelity."}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center gap-2">
              <button
                type="button"
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold shadow-sm transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isAr ? "تحميل PDF" : "Download PDF"}</span>
              </button>
            </div>
          </div>

          {/* Diagnostic Checks (Span 8) */}
          <div className="md:col-span-8 rounded-[24px] border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 shadow-xs space-y-4">
            <h2 className="text-[16px] font-bold text-[#0B132B] dark:text-white">
              {isAr ? "نتائج الفحص والتحقق الآلي" : "ATS Diagnostics & Validation Breakdown"}
            </h2>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5 text-[#12B76A] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[13.5px] font-bold text-[#0B132B] dark:text-white">
                    {isAr ? "تنسيق أحادي العمود قياسي (Single Column)" : "Standard Single-Column Layout Validated"}
                  </h3>
                  <p className="text-[12px] text-slate-600 dark:text-slate-300">
                    {isAr ? "يضمن قراءة الروبوتات للبيانات بتسلسل سليم بدون أخطاء الجداول المزدوجة." : "Ensures flawless parser reading without double-column scanning errors."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5 text-[#12B76A] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[13.5px] font-bold text-[#0B132B] dark:text-white">
                    {isAr ? "الكلمات المفتاحية لمحللي البيانات (Keywords)" : "Core Keywords Present (SQL, Python, Excel)"}
                  </h3>
                  <p className="text-[12px] text-slate-600 dark:text-slate-300">
                    {isAr ? "تم العثور على 7 من أصل 8 مهارات أساسية مطلوبة في وظائف الـ Data." : "7 out of 8 high-priority tech keywords successfully identified in text."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-500/20">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[13.5px] font-bold text-[#0B132B] dark:text-white">
                    {isAr ? "نقص مهارة Power BI في ملخص الخبرات" : "Missing Power BI keyword in Experience section"}
                  </h3>
                  <p className="text-[12px] text-slate-600 dark:text-slate-300">
                    {isAr ? "إضافة مشروع عملي يبرز مهارة Power BI سيرفع درجتك إلى 94/100." : "Adding a bullet point with Power BI metrics will boost score to 94/100."}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </AppShell>
  );
}
