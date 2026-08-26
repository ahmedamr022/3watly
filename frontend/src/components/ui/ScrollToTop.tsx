"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Sparkles } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const isLaunchingRef = useRef(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (isLaunchingRef.current) return;

      const currentScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (currentScroll > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const handleScrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLaunchingRef.current) return;
    isLaunchingRef.current = true;
    setIsLaunching(true);

    // Instant simultaneous smooth scroll
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } catch {}

    const topElement = document.getElementById('page-top');
    if (topElement && typeof topElement.scrollIntoView === 'function') {
      try {
        topElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch {}
    }

    // Reset after flight completes
    setTimeout(() => {
      setIsLaunching(false);
      isLaunchingRef.current = false;
      const finalScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
      if (finalScroll < 150) {
        setIsVisible(false);
      }
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={
            isLaunching
              ? { 
                  y: -780, 
                  opacity: [1, 1, 0.8, 0],
                  scale: [1, 1.08, 0.85]
                }
              : { y: 0, opacity: 1, scale: 1 }
          }
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={
            isLaunching
              ? { duration: 0.95, ease: [0.22, 1, 0.36, 1] }
              : { duration: 0.25, ease: [0.23, 1, 0.32, 1] }
          }
          className="fixed bottom-7 right-7 z-[9999] pointer-events-auto"
        >
          <button
            type="button"
            onClick={handleScrollToTop}
            aria-label="Scroll to top"
            className="relative flex h-13 w-13 items-center justify-center rounded-2xl bg-white/95 dark:bg-[#0D1527]/90 backdrop-blur-2xl p-3.5 text-[#0052FF] dark:text-[#818CF8] shadow-[0_16px_36px_-8px_rgba(0,82,255,0.35)] dark:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.8),0_0_20px_rgba(99,102,241,0.25)] border border-slate-200/80 dark:border-indigo-500/30 hover:bg-[#0052FF] dark:hover:bg-[#4338CA] hover:text-white dark:hover:text-white hover:-translate-y-1 active:scale-95 transition-all duration-300 group cursor-pointer"
          >
            {/* Ambient Pulse Glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-500/15 to-indigo-500/15 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Upward Arrow */}
            <ArrowUp className="h-5 w-5 stroke-[2.6] transition-transform duration-300 group-hover:-translate-y-0.5" />

            {/* Graceful Rocket Jet Stream during flight */}
            {isLaunching && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 0 }}
                animate={{ 
                  opacity: [0, 1, 0.8, 0],
                  scale: [0.7, 1.4, 1.8],
                  y: [10, 35, 60]
                }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="absolute -bottom-2 flex flex-col items-center pointer-events-none"
              >
                <div className="h-7 w-3.5 rounded-full bg-gradient-to-b from-blue-400 via-indigo-400 to-transparent blur-[2px]" />
                <Sparkles className="h-4 w-4 text-indigo-300 -mt-1.5 animate-spin" />
              </motion.div>
            )}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
