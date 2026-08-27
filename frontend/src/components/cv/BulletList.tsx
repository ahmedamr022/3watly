"use client";

import React from 'react';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { AutoTextarea } from '../ui/AutoTextarea';

interface BulletListProps {
  bullets: string[];
  onChange: (bullets: string[]) => void;
  itemLabel?: string;
  footer?: React.ReactNode;
}

export function BulletList({
  bullets,
  onChange,
  itemLabel = 'bullet',
  footer
}: BulletListProps) {
  const setBullet = (index: number, value: string) =>
  onChange(bullets.map((b, i) => i === index ? value : b));

  const insertAfter = (index: number) => {
    const next = [...bullets];
    next.splice(index + 1, 0, '');
    onChange(next);
  };

  const removeAt = (index: number) => {
    if (bullets.length === 1) {
      onChange(['']);
      return;
    }
    onChange(bullets.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <ul className="space-y-1">
        {bullets.map((bullet, index) =>
        <li
          key={index}
          className="group flex items-start gap-2 rounded-lg px-1.5 py-1 transition-colors duration-150 ease-smooth hover:bg-slate-50">
          
            <span
            className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400"
            aria-hidden="true" />
          
            <AutoTextarea
            value={bullet}
            onChange={(value) => setBullet(index, value)}
            ariaLabel={`${itemLabel} ${index + 1}`}
            placeholder="Describe what you did and the result it drove…"
            onEnter={() => insertAfter(index)}
            onBackspaceEmpty={() => removeAt(index)} />
          
            <button
            type="button"
            onClick={() => removeAt(index)}
            aria-label={`Delete ${itemLabel} ${index + 1}`}
            className="mt-0.5 shrink-0 rounded-md p-1 text-slate-300 opacity-0 transition-opacity duration-150 ease-smooth hover:bg-red-50 hover:text-red-500 focus-visible:opacity-100 group-hover:opacity-100">
            
              <Trash2Icon className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </li>
        )}
      </ul>

      <button
        type="button"
        onClick={() => insertAfter(bullets.length - 1)}
        className="mt-1.5 inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs font-semibold text-brand-600 transition-colors duration-150 ease-smooth hover:text-brand-700">
        
        <PlusIcon className="h-3.5 w-3.5" aria-hidden="true" />
        Add {itemLabel}
      </button>

      {footer}
    </div>);

}
