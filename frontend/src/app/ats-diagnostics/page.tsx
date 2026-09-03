"use client";

import React, { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { useCV } from "@/contexts/CVContext";
import { ScoreOverview } from "@/components/ats/ScoreOverview";
import { StructureCard } from "@/components/ats/StructureCard";
import { ParserCard } from "@/components/ats/ParserCard";
import { KeywordCard } from "@/components/ats/KeywordCard";
import { FixesCard } from "@/components/ats/FixesCard";
import { ActiveCVBadge } from "@/components/cv/CVVersionManager";
import { AppShell } from "@/components/layout/AppShell";
import { useLanguage } from "@/contexts/LanguageContext";
import { downloadAtsDiagnosticPdf } from "@/utils/atsReportGenerator";

export default function ATSDiagnosticsPage() {
  const { analysis, applyFix, cv } = useCV();
  const { isAr } = useLanguage();
  const [downloading, setDownloading] = useState(false);
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

  const handleDownloadReport = () => {
    try {
      setDownloading(true);
      toast.success(
        isAr
          ? "جاري إنشاء وتحميل تقرير الـ ATS بصيغة PDF..."
          : "Generating and downloading your ATS Diagnostic Report PDF..."
      );
      downloadAtsDiagnosticPdf(analysis, cv, isAr);
    } catch (err) {
      console.error("Failed to download ATS report:", err);
      toast.error(isAr ? "فشل إنشاء تقرير الـ PDF" : "Failed to generate PDF report");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AppShell
      title={isAr ? "تحليلات وفحص الـ ATS" : "ATS Diagnostics"}
      subtitle={
        isAr
          ? "تحليل شامل ودقيق لتوافق سيرتك الذاتية مع أنظمة الفرز الآلي ومتطلبات سوق العمل المصري."
          : "Comprehensive diagnostics of your resume's ATS readiness and Egyptian market alignment."
      }
      showSearch={false}
    >
      <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
        {/* Top Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-[22px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-[17px] font-bold text-slate-900 dark:text-white">
                {isAr ? "فحص مطابقة الـ ATS" : "ATS Compatibility Scan"}
              </h2>
              <ActiveCVBadge pageName={isAr ? "فحص الـ ATS" : "ATS Diagnostics"} />
            </div>
            <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-1">
              {isAr
                ? `تم فحص سيرتك الذاتية لـ ${analysis.keywords.role} في مصر (آخر فحص منذ لحظات)`
                : `Evaluated for ${analysis.keywords.role} roles in Egypt (checked moments ago)`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadReport}
              disabled={downloading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B57E0] hover:bg-blue-700 text-white font-bold text-[13px] shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-60"
            >
              <Download className="h-4 w-4" />
              <span>{isAr ? "تحميل التقرير PDF" : "Download Report PDF"}</span>
            </button>
          </div>
        </div>

        {/* Score Overview */}
        <ScoreOverview analysis={analysis} runKey={runKey} />

        {/* 3 Diagnostic Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <StructureCard analysis={analysis} />
          <ParserCard analysis={analysis} />
          <KeywordCard analysis={analysis} />
        </div>

        {/* Actionable Fixes */}
        <FixesCard analysis={analysis} onApply={applyFix} />
      </div>
    </AppShell>
  );
}
