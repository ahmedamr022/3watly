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
  MessageSquarePlusIcon
} from 'lucide-react';
import { ChatThread } from '@/components/copilot/ChatThread';
import { ChatComposer } from '@/components/copilot/ChatComposer';
import { useChat } from '@/contexts/ChatContext';
import { useClickOutside } from '@/hooks/useClickOutside';
import { emptyStatePrompts } from '@/data/chat';
import { downloadFile } from '@/utils/marketData';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CopilotPage() {
  const { messages, isThinking, sendMessage, resetChat, setFeedback, buildTranscript } = useChat();
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
    downloadFile('majra-copilot-conversation.txt', buildTranscript(), 'text/plain;charset=utf-8');
    toast.success(isAr ? 'تم تصدير المحادثة كملف نصي' : 'Conversation exported', {
      description: 'majra-copilot-conversation.txt'
    });
  };

  const clearConversation = () => {
    setMenuOpen(false);
    if (messages.length === 0) {
      toast.info(isAr ? 'المحادثة فارغة بالفعل' : 'This chat is already empty');
      return;
    }
    resetChat();
    toast.success(isAr ? 'تم مسح المحادثة' : 'Conversation cleared');
  };

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
      <div className="mx-auto flex h-[calc(100vh-210px)] max-w-[1100px] flex-col rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <header className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <SparklesIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isAr ? "محادثة المساعد الذكي" : "AI Career Chat"}
              </h2>
              <span className="text-xs text-slate-500">
                {isAr ? "مبني على تحليل 12,842 وظيفة مصرية" : "Grounded in 12,842 Egyptian job postings"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                resetChat();
                toast.success(isAr ? 'تم بدء محادثة جديدة' : 'Started a new chat');
              }}
              className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-50 cursor-pointer shadow-2xs"
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
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 cursor-pointer shadow-2xs"
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
                    className="absolute right-0 rtl:right-auto rtl:left-0 top-[42px] z-30 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg"
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

        <div className="flex-1 overflow-y-auto px-6 py-5 scroll-slim space-y-4">
          {messages.length === 0 ? (
            <EmptyState isAr={isAr} onPick={sendMessage} />
          ) : (
            <ChatThread messages={messages} onFeedback={setFeedback} />
          )}
          <div ref={endRef} />
        </div>

        <div className="shrink-0 border-t border-slate-100 p-4">
          <ChatComposer onSend={sendMessage} isThinking={isThinking} />
        </div>
      </div>
    </AppShell>
  );
}

function EmptyState({ isAr, onPick }: { isAr: boolean; onPick: (prompt: string) => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center py-10 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 shadow-xs">
        <MessageSquarePlusIcon className="h-7 w-7" strokeWidth={1.9} />
      </span>
      <h2 className="mt-4 text-lg font-bold text-slate-900">
        {isAr ? "فيمَ يمكنني مساعدتك اليوم؟" : "What should we work on?"}
      </h2>
      <p className="mt-1 max-w-[420px] text-[13px] leading-relaxed text-slate-500">
        {isAr
          ? "كل إجابة مبنية على تحليل 12,842 إعلان وظيفة من سوق العمل المصري."
          : "Every answer is grounded in 12,842 analyzed job postings from the Egyptian market."}
      </p>

      <div className="mt-6 grid w-full max-w-[620px] grid-cols-1 sm:grid-cols-2 gap-3">
        {emptyStatePrompts.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => onPick(item.prompt)}
            className="rounded-xl border border-slate-200 bg-white p-4 text-left rtl:text-right shadow-2xs transition-all hover:border-brand-300 hover:shadow-xs cursor-pointer"
          >
            <p className="text-[13.5px] font-bold text-slate-900">{item.title}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-slate-500">{item.prompt}</p>
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
  danger
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
      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left rtl:text-right text-[13px] font-medium transition-colors cursor-pointer ${
        danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-700 hover:bg-slate-50'
      }`}
    >
      <Icon className="h-4 w-4" strokeWidth={2} />
      <span>{label}</span>
    </button>
  );
}
