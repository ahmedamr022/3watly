"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MarqueeBackdrop } from './MarqueeBackdrop';
import { TechCard } from './TechCard';
import { techStack } from '@/data/techStack';
import { useLanguage } from '@/contexts/LanguageContext';
import type { TechItem } from '@/data/techStack';

interface TechMarqueeProps {
  items?: TechItem[];
  durationSeconds?: number;
  className?: string;
}

export function TechMarquee({
  items = techStack,
  durationSeconds = 42,
  className = ''
}: TechMarqueeProps) {
  const { isAr } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate items twice to ensure completely seamless, unbroken continuous looping
  const loop = [...items, ...items];

  return (
    <section
      dir="ltr"
      aria-label={isAr ? "المهارات والتقنيات الأكثر طلباً في سوق العمل" : "Most in-demand technologies"}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`group relative isolate w-full overflow-hidden select-none py-10 sm:py-14 bg-transparent ${className}`}
    >
      {/* Dynamic Ambient Neon Backdrop with Sinuous Glowing Waves */}
      <MarqueeBackdrop />

      {/* Marquee Track Container */}
      <div className="relative py-4 sm:py-6 z-10">
        <motion.div
          className="flex w-max items-center gap-5 pr-5 sm:gap-6 sm:pr-6"
          animate={{
            x: isAr ? ['-50%', '0%'] : ['0%', '-50%']
          }}
          transition={{
            duration: isPaused ? 10000 : durationSeconds,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop'
          }}
        >
          {loop.map((item, index) => (
            <TechCard
              key={`${item.id}-${index}`}
              item={item}
              duplicate={index >= items.length}
            />
          ))}
        </motion.div>
      </div>

      {/* Top and Bottom soft dissolves (Zero hard borders against hero and features) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white dark:from-[#060B18] to-transparent z-20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white dark:from-[#060B18] to-transparent z-20" />

      {/* Left and Right edge fades (Cards melt into the dark void) */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-44 z-20 bg-gradient-to-r from-white dark:from-[#060B18] via-white/80 dark:via-[#060B18]/80 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-44 z-20 bg-gradient-to-l from-white dark:from-[#060B18] via-white/80 dark:via-[#060B18]/80 to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
