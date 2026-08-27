"use client";

import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'max-w-lg'
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open &&
      <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          onClick={onClose}
          className="absolute inset-0 bg-navy-950/50" />
        
          <motion.div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className={`relative w-full ${maxWidth} overflow-hidden rounded-2xl bg-white dark:bg-[#0B1120] shadow-panel focus:outline-none`}>
          
            <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 px-6 py-5">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  {title}
                </h2>
                {description &&
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
              }
              </div>
              <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="rounded-lg p-1.5 text-slate-400 transition-colors duration-150 ease-smooth hover:bg-slate-100 hover:text-slate-600">
              
                <XIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto px-6 py-5 scroll-slim">
              {children}
            </div>
            {footer &&
          <div className="flex items-center justify-end gap-3 border-t border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-[#0B1120]/[0.04] px-6 py-4">
                {footer}
              </div>
          }
          </motion.div>
        </div>
      }
    </AnimatePresence>);

}
