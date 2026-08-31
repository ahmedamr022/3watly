"use client";

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  SparklesIcon,
  PlusCircleIcon,
  MoreVerticalIcon,
  DownloadIcon,
  CopyIcon,
  Trash2Icon,
  MessageSquarePlusIcon,
  Loader2Icon,
} from 'lucide-react';
import { ChatThread } from '@/components/copilot/ChatThread';
import { ChatComposer } from '@/components/copilot/ChatComposer';
import { useChat } from '@/contexts/ChatContext';
import { useClickOutside } from '@/hooks/useClickOutside';
import { downloadFile } from '@/utils/marketData';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';

const arabicEmptyPrompts = [
  {
    title: "مراجعة السيرة الذاتية (ATS)",
    prompt: "حلل سيرتي الذاتية وقدم لي 3 نقاط قوة و3 نقاط تحتاج تحسين للتوافق مع متطلبات السوق."
  },
  {
    title: "خطة سد فجوة المهارات",
    prompt: "ما هي المهارات التقنية الأكثر طلباً في مصر لدور Data Analyst وكيف أتقنها؟"
  },
  {
    title: "الاستعداد لمقابلة العمل",
    prompt: "اطرح علي 5 أسئلة تقنية وسلوكية شائعة في مقابلات العمل مع الإجابات النموذجية."
  },
  {
    title: "رواتب وفرص السوق المصري",
    prompt: "ما هو متوسط الرواتب التقنية الحالية وما هي الشركات الأكثر توظيفاً في القاهرة؟"
  }
];

const englishEmptyPrompts = [
  {
    title: "ATS CV Diagnostic",
    prompt: "Analyze my CV and provide 3 strengths and 3 high-impact improvement points for Egyptian market standards."
  },
  {
    title: "Skill Gap Roadmap",
    prompt: "What are the top required skills for a Data Analyst in Egypt and how can I master them in 3 months?"
  },
  {
    title: "Interview Preparation",
    prompt: "Give me 5 common technical and behavioral interview questions with model answers."
  },
  {
    title: "Salary & Market Trends",
    prompt: "What are the current tech salary ranges and top hiring companies in Cairo?"
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
  const { isAr } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useClickOutside<HTMLDivElement>(menuOpen, () => setMenuOpen(false));
  const endRef = useRef<HTMLDivElement | null>(null);

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
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {isAr ? "محادثة المساعد المهني الذكي" : "AI Career Copilot"}
              </h2>
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
            <EmptyState isAr={isAr} prompts={emptyStatePrompts} onPick={sendMessage} />
          ) : (
            <ChatThread messages={messages} onFeedback={setFeedback} />
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
  prompts,
  onPick,
}: {
  isAr: boolean;
  prompts: Array<{ title: string; prompt: string }>;
  onPick: (prompt: string) => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center py-10 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-xs">
        <MessageSquarePlusIcon className="h-7 w-7" strokeWidth={1.9} />
      </span>
      <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
        {isAr ? "فيمَ يمكنني مساعدتك اليوم؟" : "What should we work on today?"}
      </h2>
      <p className="mt-1 max-w-[440px] text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
        {isAr
          ? "اسأل عن مسارك المهني، مهاراتك، تحسين سيرتك الذاتية، أو متطلبات وظائف السوق المصري."
          : "Get guidance on your career roadmap, CV diagnostics, skill gaps, or Egyptian job trends."}
      </p>

      <div className="mt-6 grid w-full max-w-[640px] grid-cols-1 sm:grid-cols-2 gap-3">
        {prompts.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => onPick(item.prompt)}
            className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] p-4 text-left rtl:text-right shadow-2xs transition-all hover:border-blue-500 hover:shadow-xs cursor-pointer group"
          >
            <p className="text-[13.5px] font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {item.title}
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-slate-500 dark:text-slate-400">
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
