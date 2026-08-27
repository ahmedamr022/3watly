import React from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { CheckCheckIcon, ThumbsUpIcon, ThumbsDownIcon, CopyIcon, PaperclipIcon } from 'lucide-react';
import { ChatMessage, Feedback } from '../../contexts/ChatContext';
import { RichText } from './RichText';
import { RoadmapCard } from './RoadmapCard';
import { SparklesIcon } from 'lucide-react';

type ChatThreadProps = {
  messages: ChatMessage[];
  onFeedback: (id: string, value: Feedback) => void;
};

export function ChatThread({ messages, onFeedback }: ChatThreadProps) {
  return (
    <div className="space-y-5">
      {messages.map((message) =>
      message.role === 'user' ?
      <UserBubble key={message.id} message={message} /> :
      message.pending ?
      <ThinkingBubble key={message.id} /> :

      <AssistantCard key={message.id} message={message} onFeedback={onFeedback} />

      )}
    </div>);

}

function UserBubble({ message }: {message: ChatMessage;}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
      className="flex justify-end">
      
      <div className="max-w-[720px] rounded-[12px] rounded-tr-[4px] bg-brand-600 px-5 py-4 text-white shadow-card">
        <p className="whitespace-pre-line text-[14.5px] leading-[1.55]">{message.text}</p>
        {message.attachment &&
        <p className="mt-2 flex items-center gap-1.5 rounded-[7px] bg-white/15 px-2.5 py-1.5 text-[12px] text-white/90">
            <PaperclipIcon className="h-[13px] w-[13px]" strokeWidth={2.2} />
            {message.attachment}
          </p>
        }
        <p className="mt-2 flex items-center justify-end gap-1.5 text-[11px] text-white/75">
          {message.time}
          <CheckCheckIcon className="h-[14px] w-[14px]" strokeWidth={2.4} />
        </p>
      </div>
    </motion.div>);

}

function ThinkingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-[14px] border border-line bg-white p-5 shadow-card">
      
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900">
          <SparklesIcon className="h-4 w-4 text-white" />
        </span>
        <span className="text-[13.5px] font-bold text-ink-900">MAJRA</span>
        <span className="text-[11.5px] text-ink-400">analyzing market data</span>
        <span className="ml-1 flex items-end gap-1" aria-hidden="true">
          {[0, 1, 2].map((i) =>
          <motion.span
            key={i}
            className="h-[5px] w-[5px] rounded-full bg-brand-500"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.14, ease: 'linear' }} />

          )}
        </span>
        <span className="sr-only" role="status">
          MAJRA is preparing an answer
        </span>
      </div>
    </motion.div>);

}

function AssistantCard({ message, onFeedback }: {message: ChatMessage;onFeedback: (id: string, value: Feedback) => void;}) {
  const payload = message.payload;
  if (!payload) return null;

  const copy = async () => {
    const plain = [
    payload.intro,
    ...payload.points.map((p, i) => `${i + 1}. ${p.text.replace(/\*\*/g, '')}${p.source ? ` ${p.source}` : ''}`),
    payload.outro ?? ''].

    filter(Boolean).
    join('\n');
    try {
      await navigator.clipboard.writeText(plain);
      toast.success('Answer copied to clipboard');
    } catch {
      toast.error('Could not access the clipboard');
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-[14px] border border-line bg-white p-5 shadow-card">
      
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900">
          <SparklesIcon className="h-4 w-4 text-white" />
        </span>
        <span className="text-[13.5px] font-bold text-ink-900">MAJRA</span>
        <span className="text-[11.5px] text-ink-400">{message.time}</span>
      </div>

      <div className="mt-3 pl-[42px]">
        <p className="text-[13.5px] leading-[1.6] text-ink-700">{payload.intro}</p>

        <ol className="mt-2.5 space-y-2 pl-5 text-[13.5px] leading-[1.6] text-ink-700">
          {payload.points.map((point, i) =>
          <li key={i} className="list-decimal">
              <RichText text={point.text} />
              {point.source &&
            <>
                  <br />
                  <button
                type="button"
                onClick={() => toast.info('Q3 Cairo Salary Index', { description: 'Built from 840 analyzed postings.' })}
                className="text-brand-600 transition-colors duration-150 ease-out hover:text-brand-700 hover:underline">
                
                    {point.source}
                  </button>
                </>
            }
            </li>
          )}
        </ol>

        {payload.outro && <p className="mt-3 text-[13.5px] leading-[1.6] text-ink-700">{payload.outro}</p>}

        {payload.showRoadmap &&
        <div className="mt-4">
            <RoadmapCard />
          </div>
        }

        <div className="mt-4 flex items-center gap-3">
          <IconButton
            label="Helpful"
            active={message.feedback === 'up'}
            activeClass="bg-[#E9F8EF] text-[#16A34A]"
            onClick={() => {
              onFeedback(message.id, message.feedback === 'up' ? null : 'up');
              if (message.feedback !== 'up') toast.success('Thanks — noted as helpful');
            }}>
            
            <ThumbsUpIcon className="h-[17px] w-[17px]" strokeWidth={1.9} />
          </IconButton>
          <IconButton
            label="Not helpful"
            active={message.feedback === 'down'}
            activeClass="bg-[#FDECEC] text-[#DC2626]"
            onClick={() => {
              onFeedback(message.id, message.feedback === 'down' ? null : 'down');
              if (message.feedback !== 'down') toast.info('Thanks — we will refine this answer');
            }}>
            
            <ThumbsDownIcon className="h-[17px] w-[17px]" strokeWidth={1.9} />
          </IconButton>
          <IconButton label="Copy answer" onClick={copy}>
            <CopyIcon className="h-[17px] w-[17px]" strokeWidth={1.9} />
          </IconButton>
          <span className="text-[12.5px] text-ink-500">
            {message.feedback ? 'Feedback recorded' : 'Was this helpful?'}
          </span>
        </div>
      </div>
    </motion.article>);

}

function IconButton({
  label,
  onClick,
  active,
  activeClass = '',
  children






}: {label: string;onClick: () => void;active?: boolean;activeClass?: string;children: React.ReactNode;}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`flex h-8 w-8 items-center justify-center rounded-[8px] transition-colors duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-100 ${
      active ? activeClass : 'text-ink-400 hover:bg-canvas hover:text-ink-700'}`
      }>
      
      {children}
    </button>);

}