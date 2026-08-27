"use client";

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { SkillIcon } from './SkillIcon';
import { ResourceRow } from './ResourceRow';
import type { PlannedSkill, ResourceKind } from '../../types/skills';

interface ResourcesModalProps {
  open: boolean;
  onClose: () => void;
  skills: PlannedSkill[];
  initialKind?: ResourceKind | 'all';
}

const FILTERS: {id: ResourceKind | 'all';label: string;}[] = [
{ id: 'all', label: 'All' },
{ id: 'video', label: 'Free videos' },
{ id: 'course', label: 'Courses' },
{ id: 'docs', label: 'Documentation' },
{ id: 'project', label: 'Projects' }];


export function ResourcesModal({
  open,
  onClose,
  skills,
  initialKind = 'all'
}: ResourcesModalProps) {
  const [kind, setKind] = useState<ResourceKind | 'all'>(initialKind);

  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth="max-w-2xl"
      title="Learning resources for your plan"
      description="Curated per skill, mixing free material with certificate courses.">
      
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) =>
        <button
          key={filter.id}
          type="button"
          onClick={() => setKind(filter.id)}
          aria-pressed={kind === filter.id}
          className={`rounded-md px-2.5 py-1 text-[13px] font-semibold transition-colors duration-150 ease-smooth ${
          kind === filter.id ?
          'bg-brand-600 text-white' :
          'bg-slate-100 text-slate-600 hover:bg-slate-200'}`
          }>
          
            {filter.label}
          </button>
        )}
      </div>

      <div className="mt-5 space-y-5">
        {skills.map((item) => {
          const resources = item.def.resources.filter(
            (resource) => kind === 'all' || resource.kind === kind
          );
          if (resources.length === 0) return null;
          return (
            <div key={item.def.id}>
              <div className="flex items-center gap-2.5">
                <SkillIcon skillId={item.def.id} size="sm" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {item.def.name}
                </p>
                <span className="text-[11px] text-slate-400">
                  {item.def.courses} courses
                </span>
              </div>
              <div className="mt-2 space-y-2">
                {resources.map((resource) =>
                <ResourceRow
                  key={resource.title}
                  resource={resource}
                  skillName={item.def.name} />

                )}
              </div>
            </div>);

        })}

        {skills.length === 0 &&
        <p className="text-[13px] text-slate-500 dark:text-slate-400">
            Your plan has no open skills right now — pick a new target role to
            get fresh recommendations.
          </p>
        }
      </div>
    </Modal>);

}
