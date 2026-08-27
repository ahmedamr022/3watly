"use client";

import React, { useEffect, useRef, useState } from "react";
import { DownloadIcon, UploadCloudIcon } from "lucide-react";
import { toast } from "sonner";
import { useCV } from "@/contexts/CVContext";
import { ScoreOverview } from "@/components/ats/ScoreOverview";
import { StructureCard } from "@/components/ats/StructureCard";
import { ParserCard } from "@/components/ats/ParserCard";
import { KeywordCard } from "@/components/ats/KeywordCard";
import { FixesCard } from "@/components/ats/FixesCard";
import { ReuploadModal } from "@/components/ats/ReuploadModal";
import { AppShell } from "@/components/layout/AppShell";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ATSDiagnosticsPage() {
  const { analysis, applyFix } = useCV();
  const { isAr } = useLanguage();
  const [reuploadOpen, setReuploadOpen] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const previousScore = useRef(analysis.score);

  useEffect(() => {
    const before = previousScore.current;
    if (analysis.score === before) return;
    previousScore.current = analysis.score;
    const delta = analysis.score - before;
    if (delta > 0) {
      toast.success(
        isAr
          ? `ارتفعت درجة الـ ATS إلى ${analysis.score} (+${delta} نقطة).`
          : `ATS score improved to ${analysis.score} (+${delta} points).`
      );
    } else {
      toast.warning(
        isAr
          ? `انخفضت درجة الـ ATS إلى ${analysis.score} (${delta} نقطة).`
          : `ATS score dropped to ${analysis.score} (${delta} points).`
      );
    }
  }, [analysis.score, isAr]);

  const downloadReport = () => {
    toast.success(
      isAr
        ? "جاري فتح نافذة الطباعة — احفظ التقرير كملف PDF."
        : "Opening your print dialog — save the report as PDF."
    );
    window.setTimeout(() => window.print(), 350);
  };

  return (
    <AppShell showSearch={false}>
      <div className="flex h-full min-h-0 flex-col -m-4 sm:-m-6 lg:-m-8 bg-slate-50">
        <header className="no-print flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 sm:px-8 py-5">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
              {isAr ? "تحليلات وفحص الـ ATS (ATS Diagnostics)" : "ATS Diagnostics"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {isAr
                ? "تحليل شامل ودقيق لتوافق سيرتك الذاتية مع أنظمة الفرز الآلي (ATS) ومتطلبات سوق العمل المصري."
                : "Comprehensive analysis of your CV's compatibility with ATS systems."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setReuploadOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition-colors duration-150 ease-smooth hover:bg-slate-50 cursor-pointer shadow-2xs"
            >
              <UploadCloudIcon
                className="h-4 w-4 text-slate-500"
                aria-hidden="true"
              />
              {isAr ? "إعادة رفع السيرة الذاتية" : "Re-upload CV"}
            </button>
            <button
              type="button"
              onClick={downloadReport}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 ease-smooth hover:bg-brand-700 cursor-pointer shadow-sm"
            >
              <DownloadIcon className="h-4 w-4" aria-hidden="true" />
              {isAr ? "تحميل التقرير PDF" : "Download Report"}
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8 scroll-slim">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-6">
            <ScoreOverview analysis={analysis} runKey={runKey} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <StructureCard analysis={analysis} />
              <ParserCard analysis={analysis} />
              <KeywordCard analysis={analysis} />
            </div>

            <FixesCard analysis={analysis} onApply={applyFix} />
          </div>
        </div>

        <ReuploadModal
          open={reuploadOpen}
          onClose={() => setReuploadOpen(false)}
          onComplete={(fileName) => {
            setRunKey((key) => key + 1);
            window.setTimeout(() => {
              setReuploadOpen(false);
              toast.success(
                isAr
                  ? `تمت إعادة تحليل ${fileName} — تم تحديث التشخيص بنجاح.`
                  : `${fileName} re-analyzed — diagnostics refreshed.`
              );
            }, 600);
          }}
        />
      </div>
    </AppShell>
  );
}
