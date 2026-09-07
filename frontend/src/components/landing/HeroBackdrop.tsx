"use client";

import React from 'react';

export function HeroBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Light Mode Ultra-HD Background */}
      <img
        src="/images/hero-light-bg.png?v=10"
        srcSet="/images/hero-light-bg.png?v=10 1x, /images/hero-light-bg-2x.png?v=10 2x"
        alt="Hero Background Light"
        className="absolute inset-0 h-full w-full object-cover object-[center_top] dark:hidden pointer-events-none select-none"
      />
      {/* Light Mode Mobile Readability Scrim (Ensures text is 100% crisp on small screens) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/92 via-white/80 to-white/95 dark:hidden md:hidden pointer-events-none z-[1]" />

      {/* Light Mode Smooth Subtle Bottom Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent dark:hidden pointer-events-none z-[1]" />

      {/* Dark Mode Ultra-HD Background (Full uncropped night sky with stars, vivid neon, crystal water) */}
      <img
        src="/images/hero-dark-bg.png?v=11"
        srcSet="/images/hero-dark-bg.png?v=11 1x, /images/hero-dark-bg-2x.png?v=11 2x"
        alt="Hero Background Dark"
        className="absolute inset-0 h-full w-full object-cover object-[center_top] hidden dark:block pointer-events-none select-none brightness-105 contrast-[1.03]"
      />

      {/* Dark Mode Mobile Readability Scrim (Ensures text is 100% crisp on small screens only) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#040816]/92 via-[#040816]/80 to-[#040816]/95 hidden dark:block md:hidden pointer-events-none z-[1]" />

      {/* Dark Mode Subtle Bottom Edge Transition (Preserves full clarity of water, neon reflections, and laptop) */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#040816] to-transparent hidden dark:block pointer-events-none z-[1]" />
    </div>
  );
}
