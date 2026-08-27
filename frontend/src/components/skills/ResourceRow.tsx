"use client";

import React from 'react';
import {
  BookOpenIcon,
  GraduationCapIcon,
  HammerIcon } from
'lucide-react';
import { FaYoutube as YoutubeIcon } from 'react-icons/fa6';
import { toast } from 'sonner';
import type { ResourceKind, SkillResource } from '../../types/skills';

const KIND_META: Record<
  ResourceKind,
  {Icon: React.ComponentType<{className?: string;}>;color: string;}> =
{
  video: { Icon: YoutubeIcon, color: 'text-red-500' },
  course: { Icon: GraduationCapIcon, color: 'text-brand-600' },
  docs: { Icon: BookOpenIcon, color: 'text-slate-500 dark:text-slate-400' },
  project: { Icon: HammerIcon, color: 'text-violet-600' }
};

export function ResourceRow({
  resource,
  skillName



}: {resource: SkillResource;skillName: string;}) {
  const { Icon, color } = KIND_META[resource.kind];

  return (
    <button
      type="button"
      onClick={() =>
      toast(`Opening "${resource.title}" for ${skillName} in a new tab.`)
      }
      className="flex w-full items-center gap-3 rounded-lg border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] px-3 py-2.5 text-left transition-colors duration-150 ease-smooth hover:border-brand-300 hover:bg-brand-50/40">
      
      <Icon className={`h-4 w-4 shrink-0 ${color}`} aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold text-slate-800">
          {resource.title}
        </span>
        <span className="block text-[11px] text-slate-500 dark:text-slate-400">
          {resource.provider} · {resource.hours}h
        </span>
      </span>
      <span
        className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${
        resource.free ?
        'bg-emerald-50 text-emerald-700' :
        'bg-slate-100 text-slate-600'}`
        }>
        
        {resource.free ? 'Free' : 'Certificate'}
      </span>
    </button>);

}
