import React from 'react';
import { TargetIcon, UserIcon } from 'lucide-react';
import { PanelCard } from './PanelCard';
import type { TargetRole } from '../../../types/onboarding';

interface TargetRolesProps {
  roles: TargetRole[];
}

export function TargetRoles({ roles }: TargetRolesProps) {
  return (
    <PanelCard
      icon={<TargetIcon className="h-[19px] w-[19px] text-brand-blue" strokeWidth={2} aria-hidden="true" />}
      title="Roles You Can Target"
      footerLabel="See all matching roles">
      
      <ul className="space-y-3">
        {roles.map((role) =>
        <li
          key={role.title}
          className="flex items-center gap-3.5 rounded-xl border border-line bg-white px-3.5 py-3 transition-[border-color,background-color] duration-150 ease-smooth hover:border-[#BFD0F2] hover:bg-[#FAFCFF]">
          
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-canvas">
              <UserIcon className="h-[19px] w-[19px] text-ink-faint" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-semibold text-ink">{role.title}</span>
              <span className="mt-0.5 block text-[12.5px] font-light text-ink-muted">{role.label}</span>
            </span>
            <span
            className={`shrink-0 text-[15px] font-bold tracking-[-0.01em] ${
            role.match >= 65 ? 'text-[#0E9F63]' : 'text-[#EA8207]'}`
            }>
            
              {role.match}%
            </span>
          </li>
        )}
      </ul>
    </PanelCard>);

}