"use client";

import React, { useState } from 'react';
import { PlusIcon, XIcon } from 'lucide-react';

interface TagInputProps {
  label?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  tone?: 'emerald' | 'brand';
  emptyHint?: string;
}

const TONES = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  brand: 'bg-brand-50 text-brand-700 border-brand-100'
};

export function TagInput({
  label,
  tags,
  onChange,
  placeholder = 'Add and press Enter',
  tone = 'emerald',
  emptyHint
}: TagInputProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');

  const commit = () => {
    const value = draft.trim();
    if (
    value !== '' &&
    !tags.some((tag) => tag.toLowerCase() === value.toLowerCase()))
    {
      onChange([...tags, value]);
    }
    setDraft('');
    setAdding(false);
  };

  return (
    <div>
      {label &&
      <p className="mb-2 text-[13px] font-medium text-slate-600">{label}</p>
      }
      <div className="flex flex-wrap items-center gap-2">
        {tags.length === 0 && !adding && emptyHint &&
        <span className="text-xs text-slate-400">{emptyHint}</span>
        }
        {tags.map((tag) =>
        <span
          key={tag}
          className={`group inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[13px] font-medium ${TONES[tone]}`}>
          
            {tag}
            <button
            type="button"
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            aria-label={`Remove ${tag}`}
            className="rounded-full p-0.5 text-current opacity-50 transition-opacity duration-150 ease-smooth hover:opacity-100">
            
              <XIcon className="h-3 w-3" aria-hidden="true" />
            </button>
          </span>
        )}

        {adding ?
        <input
          autoFocus
          value={draft}
          placeholder={placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              commit();
            }
            if (event.key === 'Escape') {
              setDraft('');
              setAdding(false);
            }
          }}
          className="w-40 rounded-md border border-brand-300 px-2.5 py-1 text-[13px] text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" /> :


        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1 rounded-md border border-dashed border-slate-300 px-2.5 py-1 text-[13px] font-medium text-slate-500 dark:text-slate-400 transition-colors duration-150 ease-smooth hover:border-brand-400 hover:text-brand-600">
          
            <PlusIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Add
          </button>
        }
      </div>
    </div>);

}
