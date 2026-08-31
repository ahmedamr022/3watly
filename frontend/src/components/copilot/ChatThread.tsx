"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  CheckCheckIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  CopyIcon,
  PaperclipIcon,
  SparklesIcon,
} from 'lucide-react';
import { ChatMessage, Feedback } from '../../contexts/ChatContext';
import { RichText } from './RichText';
import { RoadmapCard } from './RoadmapCard';

type ChatThreadProps = {
  messages: ChatMessage[];
  onFeedback: (id: string, value: Feedback) => void;
};

export function ChatThread({ messages, onFeedback }: ChatThreadProps) {
  return (
    <div className="space-y-5">
      {messages.map((message) => {
        if (message.role === 'user') {
          return <UserBubble key={message.id} message={message} />;
        }
        if (message.pending && !message.text) {
          return <ThinkingBubble key={message.id} />;
        }
        return (
          <AssistantCard
            key={message.id}
            message={message}
            onFeedback={onFeedback}
          />
        );
      })}
    </div>
  );
}

function UserBubble({ message }: { message: ChatMessage }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
      className="flex justify-end"
    >
      <div className="max-w-[720px] rounded-[14px] rounded-tr-[4px] bg-blue-600 px-5 py-4 text-white shadow-md">
        <p className="whitespace-pre-line text-[14.5px] leading-[1.55]">
          {message.text || message.content}
        </p>
        {message.attachment && (
          <p className="mt-2 flex items-center gap-1.5 rounded-[7px] bg-white/15 px-2.5 py-1.5 text-[12px] text-white/90">
            <PaperclipIcon className="h-[13px] w-[13px]" strokeWidth={2.2} />
            {message.attachment}
          </p>
        )}
        <p className="mt-2 flex items-center justify-end gap-1.5 text-[11px] text-white/75">
          {message.time}
          <CheckCheckIcon className="h-[14px] w-[14px]" strokeWidth={2.4} />
        </p>
      </div>
    </motion.div>
  );
}

function ThinkingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-[14px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] p-5 shadow-sm"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white shadow-xs">
          <SparklesIcon className="h-4 w-4 text-blue-400" />
        </span>
        <span className="text-[13.5px] font-bold text-slate-900 dark:text-white">3WATLY</span>
        <span className="text-[11.5px] text-slate-400">analyzing career & market data</span>
        <span className="ml-1 flex items-end gap-1" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-[5px] w-[5px] rounded-full bg-blue-600"
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                delay: i * 0.14,
                ease: 'linear',
              }}
            />
          ))}
        </span>
      </div>
    </motion.div>
  );
}

function AssistantCard({
  message,
  onFeedback,
}: {
  message: ChatMessage;
  onFeedback: (id: string, value: Feedback) => void;
}) {
  const textContent = message.text || message.content || '';
  const payload = message.payload;

  const copy = async () => {
    let plain = textContent;
    if (payload) {
      plain = [
        payload.intro,
        ...payload.points.map(
          (p, i) => `${i + 1}. ${p.text.replace(/\*\*/g, '')}${p.source ? ` ${p.source}` : ''}`
        ),
        payload.outro ?? '',
      ]
        .filter(Boolean)
        .join('\n');
    }

    try {
      await navigator.clipboard.writeText(plain);
      toast.success('تم نسخ الرد إلى الحافظة / Answer copied');
    } catch {
      toast.error('Could not access clipboard');
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-[14px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] p-5 shadow-sm"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white shadow-xs">
          <SparklesIcon className="h-4 w-4 text-blue-400" />
        </span>
        <span className="text-[13.5px] font-bold text-slate-900 dark:text-white">3WATLY</span>
        <span className="text-[11.5px] text-slate-400">{message.time}</span>
      </div>

      <div className="mt-3 ltr:pl-[42px] rtl:pr-[42px]">
        {/* Render Live Streaming Markdown Text */}
        {textContent && (
          <div className="text-[14px] leading-[1.65] text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
            <FormattedMarkdown text={textContent} />
          </div>
        )}

        {/* Render Structured Payload if present */}
        {payload && (
          <div>
            <p className="text-[13.5px] leading-[1.6] text-slate-700 dark:text-slate-300">
              {payload.intro}
            </p>

            <ol className="mt-2.5 space-y-2 pl-5 text-[13.5px] leading-[1.6] text-slate-700 dark:text-slate-300">
              {payload.points.map((point, i) => (
                <li key={i} className="list-decimal">
                  <RichText text={point.text} />
                  {point.source && (
                    <>
                      <br />
                      <button
                        type="button"
                        onClick={() =>
                          toast.info('Q3 Cairo Salary Index', {
                            description: 'Built from 840 analyzed postings.',
                          })
                        }
                        className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                      >
                        {point.source}
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ol>

            {payload.outro && (
              <p className="mt-3 text-[13.5px] leading-[1.6] text-slate-700 dark:text-slate-300">
                {payload.outro}
              </p>
            )}

            {payload.showRoadmap && (
              <div className="mt-4">
                <RoadmapCard />
              </div>
            )}
          </div>
        )}

        {/* Live typing pulse cursor if still streaming */}
        {message.pending && (
          <span className="inline-block h-4 w-1.5 bg-blue-600 animate-pulse ltr:ml-1 rtl:mr-1 align-middle rounded-full" />
        )}

        {/* Action Controls: Feedback & Copy */}
        <div className="mt-4 flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
          <IconButton
            label="Helpful"
            active={message.feedback === 'up'}
            activeClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
            onClick={() => {
              onFeedback(message.id, message.feedback === 'up' ? null : 'up');
              if (message.feedback !== 'up') toast.success('Thanks — noted as helpful');
            }}
          >
            <ThumbsUpIcon className="h-[15px] w-[15px]" strokeWidth={1.9} />
          </IconButton>

          <IconButton
            label="Not helpful"
            active={message.feedback === 'down'}
            activeClass="bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
            onClick={() => {
              onFeedback(message.id, message.feedback === 'down' ? null : 'down');
              if (message.feedback !== 'down') toast.info('Thanks — we will refine this answer');
            }}
          >
            <ThumbsDownIcon className="h-[15px] w-[15px]" strokeWidth={1.9} />
          </IconButton>

          <IconButton label="Copy answer" onClick={copy}>
            <CopyIcon className="h-[15px] w-[15px]" strokeWidth={1.9} />
          </IconButton>

          <span className="text-[11.5px] text-slate-400">
            {message.feedback ? 'Feedback recorded' : 'Was this helpful?'}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

function FormattedMarkdown({ text }: { text: string }) {
  // Simple formatter for bullet points, bolding, and headers
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-[15px] font-bold text-slate-900 dark:text-white mt-2 mb-1">
              <RichText text={trimmed.slice(4)} />
            </h3>
          );
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-[16px] font-extrabold text-slate-900 dark:text-white mt-3 mb-1">
              <RichText text={trimmed.slice(3)} />
            </h2>
          );
        }

        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={idx} className="text-[17px] font-black text-slate-900 dark:text-white mt-3 mb-1">
              <RichText text={trimmed.slice(2)} />
            </h1>
          );
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2 rtl:pl-0 rtl:pr-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
              <span className="flex-1">
                <RichText text={trimmed.slice(2)} />
              </span>
            </div>
          );
        }

        if (/^\d+\.\s/.test(trimmed)) {
          const numMatch = trimmed.match(/^(\d+)\.\s(.*)$/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2 rtl:pl-0 rtl:pr-2">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">{numMatch[1]}.</span>
                <span className="flex-1">
                  <RichText text={numMatch[2]} />
                </span>
              </div>
            );
          }
        }

        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        return (
          <p key={idx}>
            <RichText text={line} />
          </p>
        );
      })}
    </div>
  );
}

function IconButton({
  label,
  onClick,
  active,
  activeClass = '',
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  activeClass?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 cursor-pointer ${
        active
          ? activeClass
          : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
      }`}
    >
      {children}
    </button>
  );
}