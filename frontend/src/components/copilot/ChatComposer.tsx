import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { PaperclipIcon, SendHorizonalIcon, ChevronDownIcon, XIcon, Loader2Icon } from 'lucide-react';
import { moreSuggestions, primarySuggestions } from '../../data/chat';

type ChatComposerProps = {
  onSend: (text: string, attachment?: string) => void;
  isThinking: boolean;
};

export function ChatComposer({ onSend, isThinking }: ChatComposerProps) {
  const [value, setValue] = useState('');
  const [attachment, setAttachment] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const submit = (text: string) => {
    if (isThinking) return;
    const trimmed = text.trim();
    if (!trimmed && !attachment) return;
    onSend(trimmed || `Review my CV: ${attachment}`, attachment ?? undefined);
    setValue('');
    setAttachment(null);
    setShowMore(false);
  };

  const canSend = (value.trim().length > 0 || !!attachment) && !isThinking;

  return (
    <div className="rounded-[14px] border border-line bg-white p-4 shadow-pop">
      {attachment &&
      <div className="mb-3 flex items-center gap-2 rounded-[8px] border border-line bg-canvas px-3 py-2">
          <PaperclipIcon className="h-[14px] w-[14px] text-ink-500" strokeWidth={2} />
          <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-ink-700">{attachment}</span>
          <button
          type="button"
          onClick={() => setAttachment(null)}
          aria-label="Remove attachment"
          className="flex h-6 w-6 items-center justify-center rounded-full text-ink-400 transition-colors duration-150 ease-out hover:bg-white hover:text-ink-900">
          
            <XIcon className="h-3.5 w-3.5" strokeWidth={2.4} />
          </button>
        </div>
      }

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit(value);
        }}
        className="flex items-center gap-3">
        
        <label className="min-w-0 flex-1">
          <span className="sr-only">Ask anything about your career</span>
          <input
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Ask anything about your career..."
            className="h-[36px] w-full bg-transparent px-2 text-[14.5px] text-ink-900 placeholder:text-ink-400 focus:outline-none" />
          
        </label>

        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              setAttachment(file.name);
              toast.success('File attached', { description: file.name });
            }
            event.target.value = '';
          }} />
        
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          aria-label="Attach a file"
          className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-line text-ink-500 transition-colors duration-150 ease-out hover:bg-canvas hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-100">
          
          <PaperclipIcon className="h-[17px] w-[17px]" strokeWidth={1.9} />
        </button>

        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-brand-600 text-white transition-colors duration-150 ease-out hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-100 disabled:bg-[#B9CDF0]">
          
          {isThinking ?
          <Loader2Icon className="h-[18px] w-[18px] animate-spin" strokeWidth={2} /> :

          <SendHorizonalIcon className="h-[18px] w-[18px]" strokeWidth={2} />
          }
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2.5">
        {primarySuggestions.map((s) =>
        <SuggestionChip key={s} label={s} onClick={() => submit(s)} disabled={isThinking} />
        )}
        {showMore && moreSuggestions.map((s) => <SuggestionChip key={s} label={s} onClick={() => submit(s)} disabled={isThinking} />)}
        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          aria-expanded={showMore}
          className="flex h-[36px] items-center gap-1.5 rounded-full border border-line bg-white px-4 text-[13px] font-medium text-ink-700 transition-colors duration-150 ease-out hover:bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-100">
          
          {showMore ? 'Fewer suggestions' : 'More suggestions'}
          <ChevronDownIcon
            className={`h-4 w-4 text-ink-400 transition-transform duration-150 ease-out ${showMore ? 'rotate-180' : ''}`} />
          
        </button>
      </div>
    </div>);

}

function SuggestionChip({ label, onClick, disabled }: {label: string;onClick: () => void;disabled: boolean;}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="h-[36px] rounded-full border border-line bg-white px-4 text-[13px] font-medium text-ink-700 transition-colors duration-150 ease-out hover:border-[#CBD6E8] hover:bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-100 disabled:text-ink-400">
      
      {label}
    </button>);

}