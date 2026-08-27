"use client";

import React from 'react';
import { PlusIcon, Trash2Icon, XIcon } from 'lucide-react';
import { useCV } from '../../../contexts/CVContext';
import { TagInput } from '../../ui/TagInput';
import { uid } from '../../../utils/cvHelpers';

export function SkillsSection() {
  const { cv, update } = useCV();

  return (
    <div>
      {cv.skillsSummary &&
      <div className="mb-4 rounded-lg border border-brand-100 bg-brand-50 px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-700">
                Skills Summary
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-700">
                {cv.skillsSummary}
              </p>
            </div>
            <button
            type="button"
            onClick={() =>
            update((prev) => ({ ...prev, skillsSummary: null }))
            }
            aria-label="Remove skills summary"
            className="shrink-0 rounded-md p-1 text-brand-600 transition-colors duration-150 ease-smooth hover:bg-brand-100">
            
              <XIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      }

      <div className="space-y-5">
        {cv.skills.map((group, index) =>
        <div
          key={group.id}
          className={index === 0 ? '' : 'border-t border-slate-100 pt-5'}>
          
            <div className="mb-2 flex items-center gap-2">
              <input
              value={group.label}
              aria-label={`Skill group ${index + 1} name`}
              onChange={(event) =>
              update(
                (prev) => ({
                  ...prev,
                  skills: prev.skills.map((g) =>
                  g.id === group.id ?
                  { ...g, label: event.target.value } :
                  g
                  )
                }),
                `skill-label-${group.id}`
              )
              }
              className="flex-1 rounded-md border border-transparent px-1.5 py-1 text-[13px] font-semibold text-slate-700 transition-colors duration-150 ease-smooth hover:border-slate-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" />
            
              <button
              type="button"
              onClick={() =>
              update((prev) => ({
                ...prev,
                skills: prev.skills.filter((g) => g.id !== group.id)
              }))
              }
              disabled={cv.skills.length === 1}
              aria-label={`Delete ${group.label} group`}
              className="rounded-md p-1.5 text-red-400 transition-colors duration-150 ease-smooth hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent">
              
                <Trash2Icon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <TagInput
            tags={group.skills}
            emptyHint="No skills in this group yet."
            onChange={(skills) =>
            update((prev) => ({
              ...prev,
              skills: prev.skills.map((g) =>
              g.id === group.id ? { ...g, skills } : g
              )
            }))
            } />
          
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() =>
        update((prev) => ({
          ...prev,
          skills: [
          ...prev.skills,
          { id: uid('skill'), label: 'New Group', skills: [] }]

        }))
        }
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-500 transition-colors duration-150 ease-smooth hover:border-brand-400 hover:text-brand-600">
        
        <PlusIcon className="h-4 w-4" aria-hidden="true" />
        Add Skill Group
      </button>
    </div>);

}
