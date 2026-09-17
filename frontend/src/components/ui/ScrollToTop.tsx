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
        >
          {/* ─── Outer ambient glow (GPU-only radial, no filter) ─── */}
          <div
            className="absolute inset-0 -m-6 rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 60%, rgba(30,120,255,0.35) 0%, rgba(0,180,255,0.15) 45%, transparent 72%)',
              transform: 'translateZ(0)',
            }}
          />

          {/* ─── Orbital ring ─── */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: '108px',
              height: '108px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) translateZ(0)',
              animation: 'orbit-spin 5s linear infinite',
            }}
          >
            {/* Ellipse ring */}
            <svg
              viewBox="0 0 108 108"
              className="absolute inset-0 w-full h-full"
              style={{ overflow: 'visible' }}
            >
              <ellipse
                cx="54"
                cy="54"
                rx="52"
                ry="18"
                fill="none"
                stroke="url(#orbit-grad)"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.85"
              />
              <defs>
                <linearGradient id="orbit-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(100,210,255,0)" />
                  <stop offset="30%" stopColor="rgba(100,210,255,0.9)" />
                  <stop offset="60%" stopColor="rgba(255,255,255,0.95)" />
                  <stop offset="80%" stopColor="rgba(100,180,255,0.6)" />
                  <stop offset="100%" stopColor="rgba(100,210,255,0)" />
                </linearGradient>
              </defs>
              {/* Bright dot on the ring */}
              <circle cx="106" cy="54" r="3.5" fill="rgba(140,220,255,0.95)" />
            </svg>
          </div>

          {/* ─── Small floating spheres ─── */}
          {/* Top-right sphere */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: '9px',
              height: '9px',
              top: '-8px',
              right: '-8px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, #a0e4ff, #1e8eff)',
              boxShadow: '0 0 6px rgba(60,180,255,0.7)',
              transform: 'translateZ(0)',
              animation: 'float-sphere-a 3.2s ease-in-out infinite',
            }}
          />
          {/* Bottom-left small sphere */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: '5px',
              height: '5px',
              bottom: '-6px',
              left: '-2px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, #c0f0ff, #3ab0ff)',
              boxShadow: '0 0 4px rgba(60,180,255,0.6)',
              transform: 'translateZ(0)',
              animation: 'float-sphere-b 2.8s ease-in-out infinite 0.5s',
            }}
          />
          {/* Left sphere */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: '7px',
              height: '7px',
              bottom: '2px',
              left: '-14px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, #90d8ff, #1a7aee)',
              boxShadow: '0 0 5px rgba(30,130,255,0.65)',
              transform: 'translateZ(0)',
              animation: 'float-sphere-a 3.8s ease-in-out infinite 0.3s',
            }}
          />

          {/* ─── Main 3D Button ─── */}
          <motion.button
            type="button"
            onClick={handleScrollToTop}
            whileHover={{ scale: 1.07, y: -3 }}
            whileTap={{ scale: 0.93 }}
            aria-label="Scroll to top"
            style={{ transform: 'translateZ(0)' }}
            className="relative flex h-[52px] w-[52px] items-center justify-center cursor-pointer"
          >
            {/* Chrome / neon outer ring */}
            <span
              className="absolute inset-0 rounded-[18px] pointer-events-none"
              style={{
                background:
                  'linear-gradient(145deg, rgba(160,220,255,0.9) 0%, rgba(80,160,255,0.5) 40%, rgba(30,80,200,0.4) 100%)',
                padding: '1.5px',
                borderRadius: '18px',
                WebkitMask:
                  'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />

            {/* Glass body — squircle */}
            <span
              className="absolute inset-0 rounded-[18px] overflow-hidden"
              aria-hidden
            >
              {/* Base deep blue gradient */}
              <span
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(160deg, #2980ff 0%, #1256e8 35%, #0a3dc7 65%, #0830a0 100%)',
                  borderRadius: '18px',
                }}
              />
              {/* Top-center glossy specular highlight */}
              <span
                className="absolute"
                style={{
                  top: '3px',
                  left: '10%',
                  width: '80%',
                  height: '42%',
                  borderRadius: '50%',
                  background:
                    'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0.08) 65%, transparent 100%)',
                  pointerEvents: 'none',
                }}
              />
              {/* Bottom-center subtle reflected light */}
              <span
                className="absolute"
                style={{
                  bottom: '3px',
                  left: '15%',
                  width: '70%',
                  height: '22%',
                  borderRadius: '50%',
                  background:
                    'radial-gradient(ellipse at 50% 100%, rgba(100,200,255,0.25) 0%, transparent 100%)',
                  pointerEvents: 'none',
                }}
              />
              {/* Inset shadow — depth */}
              <span
                className="absolute inset-0"
                style={{
                  borderRadius: '18px',
                  boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.18), inset 0 -3px 8px rgba(0,0,0,0.3)',
                  pointerEvents: 'none',
                }}
              />
            </span>

            {/* Outer glow ring on hover (no filter — translateZ trick) */}
            <span
              className="absolute -inset-[3px] rounded-[21px] pointer-events-none opacity-0 group-hover:opacity-100"
              style={{
                boxShadow:
                  '0 0 18px 4px rgba(40,140,255,0.55), 0 0 8px 2px rgba(100,210,255,0.4)',
              }}
            />

            {/* Arrow Icon */}
            <ArrowUp
              className={`relative z-10 h-6 w-6 text-white transition-transform duration-300 ${
                isFlying ? '-translate-y-1.5' : ''
              }`}
              style={{ strokeWidth: 3, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
            />

            {/* Flight thruster glow */}
            {isFlying && (
              <motion.span
                initial={{ opacity: 0, scaleY: 0.3 }}
                animate={{ opacity: 1, scaleY: 1 }}
                className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-6 h-5 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to bottom, rgba(100,220,255,0.9), rgba(50,180,255,0.5), transparent)',
                  borderRadius: '0 0 50% 50%',
                }}
              />
            )}
          </motion.button>

          {/* ─── Keyframe animations injected as <style> ─── */}
          <style>{`
            @keyframes orbit-spin {
              from { transform: translate(-50%, -50%) rotateX(72deg) rotateZ(0deg) translateZ(0); }
              to   { transform: translate(-50%, -50%) rotateX(72deg) rotateZ(360deg) translateZ(0); }
            }
            @keyframes float-sphere-a {
              0%, 100% { transform: translateY(0) translateZ(0); }
              50%       { transform: translateY(-4px) translateZ(0); }
            }
            @keyframes float-sphere-b {
              0%, 100% { transform: translateY(0) translateZ(0); }
              50%       { transform: translateY(3px) translateZ(0); }
            }
          `}</style>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
