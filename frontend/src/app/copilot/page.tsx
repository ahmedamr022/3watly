"use client";

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  SparklesIcon,
  PlusCircleIcon,
  MoreVerticalIcon,
  DownloadIcon,
  CopyIcon,
  Trash2Icon,
  MessageSquarePlusIcon,
  Loader2Icon,
  UploadIcon,
  CheckCircle2Icon,
  BriefcaseIcon,
  TargetIcon,
} from 'lucide-react';
import { ChatThread } from '@/components/copilot/ChatThread';
import { ChatComposer } from '@/components/copilot/ChatComposer';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { useClickOutside } from '@/hooks/useClickOutside';
import { downloadFile } from '@/utils/marketData';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { ActiveCVBadge } from '@/components/cv/CVVersionManager';

const arabicEmptyPrompts = [
  {
    title: "🔍 أقرب الوظائف المطابقة لخبراتي",
    prompt: "ما هي أقرب الوظائف المتاحة حالياً في السوق المصري المناسبة لمهاراتي وخبراتي ولماذا؟"
  },
  {
    title: "📈 أهم المهارات المطلوب تعلمها الآن",
    prompt: "ما هي أهم المهارات التقنية الناقصة في ملفي والتي سترفع نسبة قبولي في الشركات الكبرى؟"
  },
  {
    title: "📄 فحص وتحسين الـ CV لـ ATS",
    prompt: "حلل نقاط القوة والضعف في سيرتي الذاتية واقترح صياغة رقمية أفضل لإنجازاتي."
  },
  {
    title: "🎯 رفع الـ Match Score للوظائف",
    prompt: "كيف أرفع نسبة التطابق (Match Score) لوظائف الشركات الرائدة في القاهرة؟"
  }
];

const englishEmptyPrompts = [
  {
    title: "🔍 Top Matching Jobs for My Skills",
    prompt: "What are the closest live Egyptian market opportunities matching my profile and why?"
  },
  {
    title: "📈 High-Impact Skills to Learn Next",
    prompt: "What are the most critical skill gaps I should close to maximize my hiring probability?"
  },
  {
    title: "📄 ATS CV Optimization & Audit",
    prompt: "Review my CV structure, keywords, and quantified achievements for Egyptian tech companies."
  },
  {
    title: "🎯 Boost Job Match Scores",
    prompt: "How can I increase my match score for top tech roles in Cairo and Alexandria?"
  }
];

export default function CopilotPage() {
  const {
    messages,
    isThinking,
    isLoading,
    sendMessage,
    resetChat,
    setFeedback,
    buildTranscript,
  } = useChat();
  const { user } = useAuth();
  const { isAr } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useClickOutside<HTMLDivElement>(menuOpen, () => setMenuOpen(false));
  const endRef = useRef<HTMLDivElement | null>(null);

  const [activeCvStats, setActiveCvStats] = useState<{
    hasCv: boolean;
    role?: string;
    skillsCount: number;
    atsScore?: number;
  }>({ hasCv: false, skillsCount: 0 });

  useEffect(() => {
    try {
      const raw = localStorage.getItem('3watly_parsed_cv');
      if (raw) {
        const p = JSON.parse(raw);
        setActiveCvStats({
          hasCv: true,
          role: p.targetRole || p.currentTitle || 'Data Analyst',
          skillsCount: Array.isArray(p.skills) ? p.skills.length : 0,
          atsScore: p.atsReport?.score,
        });
      }
    } catch {}
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, isThinking]);

  const copyConversation = async () => {
    setMenuOpen(false);
    if (messages.length === 0) {
      toast.info(isAr ? 'لا توجد رسائل للنسخ' : 'Nothing to copy yet');
      return;
    }
    try {
      await navigator.clipboard.writeText(buildTranscript());
      toast.success(isAr ? 'تم نسخ المحادثة إلى الحافظة' : 'Conversation copied to clipboard');
    } catch {
      toast.error(isAr ? 'تعذر الوصول إلى الحافظة' : 'Could not access the clipboard');
    }
  };

  const exportTranscript = () => {
    setMenuOpen(false);
    if (messages.length === 0) {
      toast.info(isAr ? 'لا توجد محادثة لتصديرها' : 'Nothing to export yet');
      return;
    }
    downloadFile('3watly-copilot-conversation.txt', buildTranscript(), 'text/plain;charset=utf-8');
    toast.success(isAr ? 'تم تصدير المحادثة كملف نصي' : 'Conversation exported', {
      description: '3watly-copilot-conversation.txt',
    });
  };

  const clearConversation = async () => {
    setMenuOpen(false);
    if (messages.length === 0) {
      toast.info(isAr ? 'المحادثة فارغة بالفعل' : 'This chat is already empty');
      return;
    }
    await resetChat();
    toast.success(isAr ? 'تم مسح المحادثة' : 'Conversation cleared');
  };

  const emptyStatePrompts = isAr ? arabicEmptyPrompts : englishEmptyPrompts;

  return (
    <AppShell
      title={isAr ? "المساعد المهني الذكي (AI Career Copilot)" : "AI Career Copilot"}
      subtitle={
        isAr
          ? "مرشدك الذكي للمسار المهني، مستند إلى بيانات حقيقية لآلاف الوظائف في السوق المصري."
          : "Your intelligent career guide, powered by real Egyptian market data."
      }
      showSearch={false}
    >
      <div className="mx-auto flex h-[calc(100vh-210px)] max-w-[1100px] flex-col rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] shadow-xs">
        {/* Header Bar */}
        <header className="flex shrink-0 items-center justify-between border-b border-slate-100 dark:border-white/5 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
              <SparklesIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {isAr ? "محادثة المساعد المهني الذكي" : "AI Career Copilot"}
                </h2>
                <ActiveCVBadge pageName={isAr ? "المساعد الذكي" : "Copilot"} />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? "مبني على تحليل مئات الوظائف في السوق المصري" : "Grounded in verified Egyptian market jobs"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={async () => {
                await resetChat();
                toast.success(isAr ? 'تم بدء محادثة جديدة' : 'Started a new chat');
              }}
              className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] px-3.5 text-xs font-semibold text-blue-600 dark:text-blue-400 transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer shadow-2xs"
            >
              <PlusCircleIcon className="h-4 w-4" />
              <span>{isAr ? "محادثة جديدة" : "New Chat"}</span>
            </button>

            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Conversation options"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer shadow-2xs"
              >
                <MoreVerticalIcon className="h-4 w-4" />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute ltr:right-0 rtl:left-0 top-[42px] z-30 w-52 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] p-1.5 shadow-xl"
                  >
                    <MenuRow
                      icon={CopyIcon}
                      label={isAr ? "نسخ المحادثة" : "Copy conversation"}
                      onClick={copyConversation}
                    />
                    <MenuRow
                      icon={DownloadIcon}
                      label={isAr ? "تصدير كملف txt" : "Export as .txt"}
                      onClick={exportTranscript}
                    />
                    <MenuRow
                      icon={Trash2Icon}
                      label={isAr ? "مسح المحادثة" : "Clear conversation"}
                      danger
                      onClick={clearConversation}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Scrollable Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-5 scroll-slim space-y-4">
          {isLoading ? (
            <div className="flex h-full items-center justify-center py-16">
              <Loader2Icon className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
            </div>
          ) : messages.length === 0 ? (
            <EmptyState
              isAr={isAr}
              userName={user?.fullName || (user as any)?.name || ''}
              stats={activeCvStats}
              prompts={emptyStatePrompts}
              onPick={sendMessage}
            />
          ) : (
            <ChatThread
              messages={messages}
              onFeedback={setFeedback}
              onSendMessage={sendMessage}
            />
          )}
          <div ref={endRef} />
        </div>

        {/* Composer Input Area */}
        <div className="shrink-0 border-t border-slate-100 dark:border-white/5 p-4">
          <ChatComposer onSend={sendMessage} isThinking={isThinking} />
        </div>
      </div>
    </AppShell>
  );
}

function EmptyState({
  isAr,
  userName,
  stats,
  prompts,
  onPick,
}: {
  isAr: boolean;
  userName?: string;
  stats: { hasCv: boolean; role?: string; skillsCount: number; atsScore?: number };
  prompts: Array<{ title: string; prompt: string }>;
  onPick: (prompt: string) => void;
}) {
  const router = useRouter();

  return (
    <div className="flex h-full flex-col items-center justify-center py-8 text-center max-w-[720px] mx-auto">
      {/* Personalized Welcome Card */}
      <div className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-slate-900/60 p-5 text-left rtl:text-right mb-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
            <SparklesIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {isAr
                ? `أهلاً بك${userName ? ` يا ${userName}` : ''} في عواطلي Copilot`
                : `Welcome${userName ? `, ${userName}` : ''} to 3WATLY Copilot`}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr
                ? "مساعدك المتخصص لربط مهاراتك بشواغر وفرص سوق العمل المصري."
                : "Your AI advisor grounded in Egyptian tech market criteria."}
            </p>
          </div>
        </div>

        {/* Dynamic Status Badges */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200/70 dark:border-white/5">
          {stats.hasCv ? (
            <>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-[11.5px] font-semibold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2Icon className="h-3.5 w-3.5" />
                {stats.role || 'Data Analyst'}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 text-[11.5px] font-semibold text-blue-700 dark:text-blue-400">
                <TargetIcon className="h-3.5 w-3.5" />
                {stats.skillsCount} {isAr ? 'مهارة مسجلة' : 'Skills Detected'}
              </span>
              {stats.atsScore !== undefined && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 text-[11.5px] font-semibold text-purple-700 dark:text-purple-400">
                  <BriefcaseIcon className="h-3.5 w-3.5" />
                  ATS: {stats.atsScore}/100
                </span>
              )}
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-[12px] text-slate-500">
                {isAr
                  ? "لم ترفع سيرتك الذاتية بعد. ارفعها لتحصل على تحليل فوري مخصص."
                  : "No CV uploaded yet. Upload your resume for tailored insights."}
              </span>
              <button
                type="button"
                onClick={() => router.push('/onboarding/upload-cv')}
                className="inline-flex items-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-1 text-[11.5px] font-semibold text-white transition-colors cursor-pointer"
              >
                <UploadIcon className="h-3 w-3" />
                {isAr ? "رفع سيرة ذاتية" : "Upload CV"}
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
        {isAr ? "ما الذي يشغل بالك اليوم؟ اختر موضوعاً للبدء:" : "What would you like to explore today?"}
      </h3>

      <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-3">
        {prompts.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => onPick(item.prompt)}
            className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] p-3.5 text-left rtl:text-right shadow-2xs transition-all hover:border-blue-500 hover:shadow-xs cursor-pointer group"
          >
            <p className="text-[13px] font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {item.title}
            </p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500 dark:text-slate-400">
              {item.prompt}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function MenuRow({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left rtl:text-right text-[13px] font-medium transition-colors cursor-pointer ${
        danger
          ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30'
          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
      }`}
    >
      <Icon className="h-4 w-4" strokeWidth={2} />
      <span>{label}</span>
    </button>
  );
}
