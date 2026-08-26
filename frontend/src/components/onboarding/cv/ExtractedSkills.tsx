import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, CheckIcon, UserIcon } from 'lucide-react';
import { TechIcon, techTile } from '../../icons/TechIcon';
import { EASE, springPop } from '../../../utils/motion';
import { surface } from '../../../utils/styles';
import type { ParsedCv } from '../../../types/onboarding';

interface ExtractedSkillsProps {
  cv: ParsedCv;
  addedCount: number;
  complete: boolean;
}

export function ExtractedSkills({ cv, addedCount, complete }: ExtractedSkillsProps) {
  const added = cv.detectedSkills.slice(0, addedCount);

  return (
    <section className={`p-6 ${surface}`}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[184px_minmax(0,1fr)_auto_minmax(0,300px)] lg:items-center">
        <div>
          <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-ink">Extracted Skills</h2>
          <p className="mt-1 text-[12.5px] font-light text-ink-muted">
            Detected skills from your CV
          </p>
          <p className="mt-3 text-[12.5px] font-medium text-ink-soft">
            {addedCount}/{cv.detectedSkills.length} mapped
          </p>
        </div>

        <ul className="flex flex-wrap gap-2.5">
          {cv.detectedSkills.map((skill, index) => {
            const mapped = index < addedCount;
            return (
              <motion.li
                key={skill.name}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.22,
                  delay: Math.min(index * 0.04, 0.32),
                  ease: EASE
                }}
                className={`flex h-9 items-center gap-2 rounded-full border px-3.5 transition-[border-color,background-color] duration-200 ease-smooth ${
                mapped ? 'border-[#C9E7D8] bg-[#F4FBF7]' : 'border-line bg-white'}`
                }>
                
                <span
                  className={`flex h-[22px] w-[22px] items-center justify-center rounded-full ${techTile(skill.key)}`}>
                  
                  <TechIcon name={skill.key} className="h-[13px] w-[13px]" />
                </span>
                <span className="whitespace-nowrap text-[12.5px] font-medium text-ink-soft">
                  {skill.name}
                </span>
              </motion.li>);

          })}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <ArrowRightIcon
            className="h-[18px] w-[18px] text-[#C3CEE6]"
            strokeWidth={2}
            aria-hidden="true" />
          
          <div className="relative flex h-[64px] w-[64px] items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-[#EBF1FD]" aria-hidden="true" />
            <UserIcon
              className="relative h-7 w-7 text-brand-blue"
              strokeWidth={1.7}
              aria-hidden="true" />
            
            <motion.span
              animate={{ scale: complete ? 1 : 0.85 }}
              transition={springPop}
              className={`absolute -bottom-1 -right-1 flex h-[24px] w-[24px] items-center justify-center rounded-full border-2 border-white transition-colors duration-200 ease-smooth ${
              complete ? 'bg-brand-green' : 'bg-[#9BB6E8]'}`
              }>
              
              <CheckIcon className="h-3.5 w-3.5 text-white" strokeWidth={3.2} aria-hidden="true" />
            </motion.span>
          </div>
        </div>

        <div>
          <p className="text-[13px] font-medium text-ink-soft" aria-live="polite">
            {complete ? 'Added to your profile' : 'Adding to your profile...'}
          </p>
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {added.map((skill) =>
            <motion.li
              key={skill.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="flex h-8 items-center rounded-lg bg-[#EAF8F1] px-3 text-[12.5px] font-medium text-[#0E8F55]">
              
                {skill.name}
              </motion.li>
            )}
            {addedCount === 0 &&
            <li className="flex h-8 items-center rounded-lg bg-canvas px-3 text-[12.5px] font-light text-ink-faint">
                Waiting for extraction...
              </li>
            }
          </ul>
        </div>
      </div>
    </section>);

}