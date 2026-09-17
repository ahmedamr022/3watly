"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFlying, setIsFlying] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const currentScroll =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      if (currentScroll > 280) {
        if (!isFlying) setIsVisible(true);
      } else {
        if (!isFlying) setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [isFlying]);

  const handleScrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isFlying) return;
    setIsFlying(true);
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } catch {
      window.scrollTo(0, 0);
    }
    setTimeout(() => {
      setIsFlying(false);
      setIsVisible(false);
    }, 800);
  };

  return (
    <>
      {/* Keyframes — injected once globally */}
      <style>{`
        @keyframes stt-orbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes stt-float-a {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-5px); }
        }
        @keyframes stt-float-b {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(4px); }
        }
      `}</style>

      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key="scroll-top-btn"
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={
              isFlying
                ? {
                    y: -600,
                    opacity: [1, 0.9, 0.3, 0],
                    scale: [1, 1.15, 0.8, 0.3],
                    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
                  }
                : {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: { duration: 0.3, ease: 'easeOut' },
                  }
            }
            exit={{ opacity: 0, scale: 0.5, y: 30, transition: { duration: 0.2 } }}
            className="fixed bottom-7 right-7 z-[9999] pointer-events-auto"
            /* wrapper is 80×80 so the orbit SVG (centered) fits without clipping */
            style={{ width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {/* ── Ambient radial glow (no filter, pure gradient) ── */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: '-16px',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle at 50% 58%, rgba(30,120,255,0.30) 0%, rgba(0,180,255,0.12) 50%, transparent 75%)',
                pointerEvents: 'none',
              }}
            />

            {/* ── Orbital ring (SVG ellipse spinning in a fixed container) ── */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                animation: 'stt-orbit 4.5s linear infinite',
              }}
            >
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                style={{ overflow: 'visible' }}
              >
                <defs>
                  <linearGradient id="orbit-lg" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="rgba(100,210,255,0)" />
                    <stop offset="25%"  stopColor="rgba(120,200,255,0.7)" />
                    <stop offset="55%"  stopColor="rgba(220,240,255,0.95)" />
                    <stop offset="80%"  stopColor="rgba(100,180,255,0.5)" />
                    <stop offset="100%" stopColor="rgba(100,210,255,0)" />
                  </linearGradient>
                </defs>
                {/* Tilted ellipse → looks like an orbital ring */}
                <ellipse
                  cx="40" cy="40"
                  rx="38" ry="13"
                  stroke="url(#orbit-lg)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  transform="rotate(-20 40 40)"
                />
                {/* Bright leading dot on the ring */}
                <circle
                  cx="78" cy="37"
                  r="3.5"
                  fill="rgba(160,230,255,0.95)"
                  transform="rotate(-20 40 40)"
                />
              </svg>
            </div>

            {/* ── Floating spheres ── */}
            {/* Top-right */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: 0, right: 2,
                width: 9, height: 9,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 30%, #c0eeff, #1e90ff)',
                boxShadow: '0 0 6px rgba(50,170,255,0.7)',
                pointerEvents: 'none',
                animation: 'stt-float-a 3s ease-in-out infinite',
              }}
            />
            {/* Left */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                bottom: 8, left: 1,
                width: 7, height: 7,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 30%, #a8e0ff, #1a7aee)',
                boxShadow: '0 0 5px rgba(30,130,255,0.6)',
                pointerEvents: 'none',
                animation: 'stt-float-b 3.6s ease-in-out infinite 0.4s',
              }}
            />
            {/* Bottom-left small */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                bottom: 2, left: 10,
                width: 5, height: 5,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 30%, #d0f0ff, #3abaff)',
                boxShadow: '0 0 4px rgba(60,180,255,0.55)',
                pointerEvents: 'none',
                animation: 'stt-float-a 2.8s ease-in-out infinite 0.8s',
              }}
            />

            {/* ── Main 3D glossy button ── */}
            <motion.button
              type="button"
              onClick={handleScrollToTop}
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.93 }}
              aria-label="Scroll to top"
              style={{
                position: 'relative',
                width: 52,
                height: 52,
                borderRadius: 18,
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                /* Deep blue gradient body */
                background: 'linear-gradient(160deg, #2b84ff 0%, #1256e8 38%, #0a3dc7 68%, #072fa0 100%)',
                /* Outer neon glow ring via box-shadow */
                boxShadow: [
                  '0 0 0 1.5px rgba(140,200,255,0.75)',       /* chrome ring */
                  '0 0 0 3px rgba(30,100,255,0.35)',           /* soft outer glow */
                  '0 8px 24px -4px rgba(20,90,255,0.6)',       /* drop shadow */
                  'inset 0 2px 4px rgba(255,255,255,0.22)',    /* top specular */
                  'inset 0 -3px 8px rgba(0,0,0,0.30)',        /* bottom depth */
                ].join(','),
              }}
            >
              {/* Glossy specular highlight — top white sheen */}
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  top: 4,
                  left: '12%',
                  width: '76%',
                  height: '44%',
                  borderRadius: '50%',
                  background:
                    'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.06) 70%, transparent 100%)',
                  pointerEvents: 'none',
                }}
              />
              {/* Bottom reflected light */}
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  bottom: 4,
                  left: '18%',
                  width: '64%',
                  height: '20%',
                  borderRadius: '50%',
                  background:
                    'radial-gradient(ellipse at 50% 100%, rgba(100,200,255,0.22) 0%, transparent 100%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Arrow icon */}
              <ArrowUp
                style={{
                  position: 'relative',
                  zIndex: 1,
                  width: 22,
                  height: 22,
                  color: '#fff',
                  strokeWidth: 3,
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.35))',
                  transform: isFlying ? 'translateY(-3px)' : 'none',
                  transition: 'transform 0.25s',
                }}
              />

              {/* Flight thruster glow */}
              {isFlying && (
                <motion.span
                  initial={{ opacity: 0, scaleY: 0.2 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  style={{
                    position: 'absolute',
                    bottom: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 24,
                    height: 18,
                    background:
                      'linear-gradient(to bottom, rgba(100,220,255,0.9), rgba(50,160,255,0.4), transparent)',
                    borderRadius: '0 0 50% 50%',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
