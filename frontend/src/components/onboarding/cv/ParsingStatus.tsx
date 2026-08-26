import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, LoaderCircleIcon, ShieldCheckIcon } from 'lucide-react';
import { CvPreview } from './CvPreview';
import { EASE, springPop } from '../../../utils/motion';
import { surface } from '../../../utils/styles';
import type { ParsedCv, ParseStatus } from '../../../types/onboarding';

interface ParsingStatusProps {
  cv: ParsedCv;
  status: ParseStatus;
  progress: number;
  checksRevealed: number;
}

export function ParsingStatus({ cv, status, progress, checksRevealed }: ParsingStatusProps) {
  const parsing = status === 'uploading' || status === 'parsing';
  const skillPreview = cv.detectedSkills.slice(0, 5).map((skill) => skill.name);

  const checks = [
  { label: 'Experience Extracted:', value: cv.currentTitle },
  { label: `${cv.detectedSkills.length} Skills Detected:`, value: skillPreview.join(', ') },
  { label: 'ATS Layout Parsed:', value: 'Single-Column Format Validated' }];


  return (
    <section className={`flex h-full flex-col p-6 ${surface}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-ink">
          Live Parsing Status
        </h2>
        <span
          className={`flex h-8 items-center gap-2 rounded-full px-3.5 text-[12.5px] font-medium ${
          parsing ? 'bg-[#EEF3FE] text-brand-blue' : 'bg-[#E8F8F0] text-[#0E8F55]'}`
          }
          aria-live="polite">
          
          {parsing ?
          <>
              <LoaderCircleIcon
              className="h-3.5 w-3.5 animate-spin"
              strokeWidth={2.4}
              aria-hidden="true" />
            
              Parsing in progress... {progress}%
            </> :

          <>
              <span className="h-2 w-2 rounded-full bg-brand-green" aria-hidden="true" />
              Parsing complete
            </>
          }
        </span>
      </div>

      <div className="mt-3.5 h-[5px] overflow-hidden rounded-full bg-[#E7EAF3]">
        <motion.span
          className={`block h-full rounded-full ${parsing ? 'bg-brand-blue' : 'bg-brand-green'}`}
          animate={{ width: `${Math.max(progress, 4)}%` }}
          transition={{ duration: 0.25, ease: 'linear' }} />
        
      </div>

      <div className="mt-5 grid flex-1 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
        <ul className="space-y-3" aria-live="polite">
          <AnimatePresence initial={false}>
            {checks.slice(0, checksRevealed).map((check) =>
            <motion.li
              key={check.label}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={springPop}
              className="flex items-start gap-3 rounded-xl border border-[#D8EFE3] bg-[#EFFAF4] p-3.5">
              
                <motion.span
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={springPop}
                className="mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-brand-green">
                
                  <CheckIcon className="h-3.5 w-3.5 text-white" strokeWidth={3.2} aria-hidden="true" />
                </motion.span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold text-ink">{check.label}</span>
                  <span className="mt-0.5 block text-[13px] font-medium leading-[1.45] text-[#0E8F55]">
                    {check.value}
                  </span>
                </span>
              </motion.li>
            )}
          </AnimatePresence>

          {checksRevealed < checks.length &&
          <li className="flex items-center gap-3 rounded-xl border border-dashed border-line px-3.5 py-3.5">
              <LoaderCircleIcon
              className="h-[18px] w-[18px] animate-spin text-ink-faint"
              strokeWidth={2.2}
              aria-hidden="true" />
            
              <span className="text-[12.5px] font-light text-ink-faint">
                Reading your CV structure...
              </span>
            </li>
          }
        </ul>

        <div className="lg:border-l lg:border-line lg:pl-5">
          <CvPreview cv={cv} scanning={parsing} />
        </div>
      </div>

      <motion.p
        key={parsing ? 'scanning' : 'done'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: EASE }}
        className="mt-4 flex items-center justify-center gap-2 text-[12px] font-light text-ink-faint">
        
        <ShieldCheckIcon className="h-[14px] w-[14px]" strokeWidth={1.8} aria-hidden="true" />
        {parsing ?
        'Scanning & extracting information securely...' :
        'Extraction finished — nothing leaves your account.'}
      </motion.p>
    </section>);

}