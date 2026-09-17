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
  durationSeconds = 40,
  className = ''
}: TechMarqueeProps) {
  const { isAr } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate items to create an unbroken seamless loop
  const loop = [...items, ...items];

  return (
    <section
      dir="ltr"
      aria-label={isAr ? "المهارات والتقنيات الأكثر طلباً في سوق العمل" : "Most in-demand technologies"}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`group relative isolate w-full overflow-hidden select-none py-10 sm:py-14 bg-white dark:bg-[#040816] ${className}`}
      style={{
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >
      {/* Sinuous Glowing Energy Wave & Floating Elements */}
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
    </section>
  );
}
