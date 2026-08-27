"use client";

import React from 'react';
import { CopyIcon, Trash2Icon } from 'lucide-react';

interface ItemShellProps {
  label: string;
  first?: boolean;
  onDuplicate?: () => void;
  onDelete?: () => void;
  deleteDisabled?: boolean;
  children: React.ReactNode;
}

export function ItemShell({
  label,
  first,
  onDuplicate,
  onDelete,
  deleteDisabled,
  children
}: ItemShellProps) {
  return (
    <div className={first ? '' : 'mt-5 border-t border-slate-100 pt-5'}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <p className="text-[13px] font-medium text-slate-600">{label}</p>
        <div className="flex items-center gap-1">
          {onDuplicate &&
          <button
            type="button"
            onClick={onDuplicate}
            aria-label={`Duplicate ${label}`}
            className="rounded-md p-1.5 text-slate-400 transition-colors duration-150 ease-smooth hover:bg-slate-100 hover:text-slate-600">
            
              <CopyIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          }
          {onDelete &&
          <button
            type="button"
            onClick={onDelete}
            disabled={deleteDisabled}
            aria-label={`Delete ${label}`}
            className="rounded-md p-1.5 text-red-400 transition-colors duration-150 ease-smooth hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent">
            
              <Trash2Icon className="h-4 w-4" aria-hidden="true" />
            </button>
          }
        </div>
      </div>
      {children}
    </div>);

}
