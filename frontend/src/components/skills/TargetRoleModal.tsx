"use client";

import React from 'react';
import { BriefcaseIcon, CheckIcon, TrendingUpIcon } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { ROLES } from '../../data/skillCatalog';
import { useSkillPlan } from '../../contexts/SkillPlanContext';

interface TargetRoleModalProps {
  open: boolean;
  onClose: () => void;
}

export function TargetRoleModal({ open, onClose }: TargetRoleModalProps) {
  const { roleId, setRoleId, readinessFor } = useSkillPlan();

  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth="max-w-2xl"
      title="Change your target role"
      description="Your gaps, priorities and matching jobs are recalculated from the role you pick.">
      
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ROLES.map((role) => {
          const readiness = readinessFor(role.id);
          const selected = role.id === roleId;
          return (
            <li key={role.id}>
              <button
                type="button"
                onClick={() => {
                  setRoleId(role.id);
                  onClose();
                }}
                aria-pressed={selected}
                className={`flex h-full w-full flex-col rounded-xl border p-4 text-left transition-colors duration-150 ease-smooth ${
                selected ?
                'border-brand-500 bg-brand-50/60' :
                'border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] hover:border-brand-300 hover:bg-slate-50 dark:bg-[#0B1120]/[0.04] dark:hover:bg-white/5'}`
                }>
                
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {role.name}
                  </span>
                  {selected &&
                  <span className="inline-flex items-center gap-1 rounded-md bg-brand-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                      <CheckIcon className="h-3 w-3" aria-hidden="true" />
                      Current
                    </span>
                  }
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {role.blurb}
                </p>

                <div className="mt-3 flex items-center gap-4 text-[13px]">
                  <span className="inline-flex items-center gap-1.5 text-slate-600">
                    <BriefcaseIcon
                      className="h-3.5 w-3.5 text-slate-400"
                      aria-hidden="true" />
                    
                    {role.openJobs.toLocaleString()} jobs
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-600">
                    <TrendingUpIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    +{role.yoyGrowth}% YoY
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <span>Your readiness</span>
                    <span className="tabular-nums text-slate-700 dark:text-slate-200">
                      {readiness}%
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-brand-600 transition-[width] duration-300 ease-smooth"
                      style={{ width: `${readiness}%` }} />
                    
                  </div>
                </div>

                <p className="mt-3 text-[11px] text-slate-400">
                  EGP {role.salaryEgpK}K avg · {role.timeToHireDays} days to
                  hire · {role.city}
                </p>
              </button>
            </li>);

        })}
      </ul>
    </Modal>);

}
