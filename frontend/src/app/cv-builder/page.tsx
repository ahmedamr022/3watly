"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2Icon,
  ChevronDownIcon,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  Redo2Icon,
  Undo2Icon
} from "lucide-react";
import { toast } from "sonner";
import { useCV } from "@/contexts/CVContext";
import { TEMPLATES } from "@/data/cvData";
import { EditorPanel } from "@/components/cv/EditorPanel";
import { CVPreview } from "@/components/cv/CVPreview";
import type { TemplateId } from "@/types/cv";
import { AppShell } from "@/components/layout/AppShell";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CVBuilderPage() {
  const {
    saveStatus,
    template,
    setTemplate,
    undo,
    redo,
    canUndo,
    canRedo,
    analysis
  } = useCV();
  const { isAr } = useLanguage();
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;
      if (!meta || event.key.toLowerCase() !== "z") return;
      event.preventDefault();
      if (event.shiftKey) redo();
      else undo();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  const downloadPdf = () => {
    toast.success(
      isAr
        ? "جاري فتح نافذة الطباعة — احفظ المستند كملف PDF."
        : "Opening your print dialog — save as PDF to finish."
    );
    window.setTimeout(() => window.print(), 350);
  };

  return (
    <AppShell showSearch={false}>
      <div className="flex h-full min-h-0 flex-col -m-4 sm:-m-6 lg:-m-8 bg-slate-50">
        <header className="no-print flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 sm:px-8 py-4">
          <div className="flex items-center gap-3">
            <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
              {isAr ? "صانع السيرة الذاتية (CV Builder)" : "CV Builder"}
            </h1>
            <span
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-500"
              aria-live="polite"
            >
              {saveStatus === "saving" ? (
                <>
                  <Loader2Icon
                    className="h-4 w-4 animate-spin text-slate-400"
                    aria-hidden="true"
                  />
                  {isAr ? "جاري الحفظ..." : "Saving…"}
                </>
              ) : (
                <>
                  <CheckCircle2Icon
                    className="h-4 w-4 text-emerald-500"
                    aria-hidden="true"
                  />
                  {isAr ? "تم الحفظ تلقائياً" : "Auto-saved"}
                </>
              )}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1">
              <button
                type="button"
                onClick={undo}
                disabled={!canUndo}
                aria-label="Undo"
                title={isAr ? "تراجع (Ctrl+Z)" : "Undo (Ctrl+Z)"}
                className="rounded-md p-1.5 text-slate-600 transition-colors duration-150 ease-smooth hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent cursor-pointer"
              >
                <Undo2Icon className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={redo}
                disabled={!canRedo}
                aria-label="Redo"
                title={isAr ? "إعادة (Ctrl+Shift+Z)" : "Redo (Ctrl+Shift+Z)"}
                className="rounded-md p-1.5 text-slate-600 transition-colors duration-150 ease-smooth hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent cursor-pointer"
              >
                <Redo2Icon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setPreviewMode((v) => !v)}
              aria-pressed={previewMode}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition-colors duration-150 ease-smooth hover:bg-slate-50 cursor-pointer"
            >
              {previewMode ? (
                <EyeOffIcon className="h-4 w-4 text-slate-500" aria-hidden="true" />
              ) : (
                <EyeIcon className="h-4 w-4 text-slate-500" aria-hidden="true" />
              )}
              {previewMode
                ? isAr
                  ? "إلغاء المعاينة"
                  : "Exit Preview"
                : isAr
                ? "وضع المعاينة"
                : "Preview Mode"}
            </button>

            <div className="relative inline-flex items-center rounded-lg border border-slate-200 bg-white pl-3.5 pr-9 rtl:pl-9 rtl:pr-3.5">
              <span className="text-sm text-slate-500">
                {isAr ? "القالب:" : "Template:"}
              </span>
              <select
                value={template}
                aria-label="CV template"
                onChange={(event) =>
                  setTemplate(event.target.value as TemplateId)
                }
                className="cursor-pointer appearance-none bg-transparent py-2 px-1.5 text-sm font-semibold text-slate-800 focus:outline-none"
              >
                {TEMPLATES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {isAr
                      ? item.id === 'ats-classic'
                        ? 'كلاسيكي ATS (موصى به)'
                        : item.id === 'modern-minimal'
                        ? 'عصري بسيط (Modern Minimal)'
                        : 'مدمج ومكثف (Compact)'
                      : item.name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon
                className="pointer-events-none absolute right-3 rtl:right-auto rtl:left-3 h-4 w-4 text-slate-400"
                aria-hidden="true"
              />
            </div>

            <button
              type="button"
              onClick={downloadPdf}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 ease-smooth hover:bg-brand-700 cursor-pointer shadow-sm"
            >
              <DownloadIcon className="h-4 w-4" aria-hidden="true" />
              {isAr ? "تحميل PDF" : "Download PDF"}
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6 scroll-slim lg:flex-row lg:overflow-hidden lg:p-8">
          {!previewMode && (
            <div className="no-print w-full shrink-0 lg:w-[520px] lg:overflow-y-auto lg:pr-1 rtl:lg:pr-0 rtl:lg:pl-1 scroll-slim">
              <EditorPanel />
              <p className="mt-4 px-1 pb-2 text-xs text-slate-400">
                {isAr ? "توافق الـ ATS الحالي:" : "Current ATS compatibility:"}{" "}
                <span className="font-bold text-slate-700">{analysis.score}/100</span> ·{" "}
                <span className="text-slate-600 font-semibold">{isAr ? analysis.bandLabelAr : analysis.bandLabel}</span> ·{" "}
                <Link
                  href="/cv-diagnostics"
                  className="font-semibold text-brand-600 hover:text-brand-700 underline underline-offset-2"
                >
                  {isAr ? "فتح تقرير الـ ATS" : "Open diagnostics"}
                </Link>
              </p>
            </div>
          )}

          <div className="print-region min-w-0 flex-1 rounded-2xl bg-navy-800 p-5 lg:overflow-y-auto scroll-slim">
            <CVPreview />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
