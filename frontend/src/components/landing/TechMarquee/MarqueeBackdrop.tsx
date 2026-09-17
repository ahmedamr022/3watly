"use client";

import React from 'react';




const nodes = [
  { x: '6%', y: '50%', color: '56 189 248', size: 6, delay: '0s' },
  { x: '18%', y: '24%', color: '0 210 255', size: 8, delay: '1.2s' },
  { x: '30%', y: '74%', color: '168 85 247', size: 7, delay: '2.4s' },
  { x: '44%', y: '26%', color: '251 191 36', size: 6, delay: '0.8s' },
  { x: '58%', y: '74%', color: '56 189 248', size: 8, delay: '3.1s' },
  { x: '72%', y: '24%', color: '45 212 191', size: 7, delay: '1.9s' },
  { x: '86%', y: '72%', color: '192 132 252', size: 6, delay: '2.7s' },
  { x: '96%', y: '36%', color: '56 189 248', size: 7, delay: '1.0s' }
];


export function MarqueeBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none" aria-hidden="true">
      {/* PURE TRANSPARENT BACKGROUND - NO BLOBS, NO MUDDY COLORS, NO HARD EDGES */}

      {/* Sinuous Glowing Energy Wave SVG */}
      <svg
        className="tech-marquee-wave absolute inset-0 h-full w-full"
        viewBox="0 0 1600 360"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Main Primary Stream Gradient */}
          <linearGradient id="wave-gradient-primary" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D2FF" stopOpacity="0" />
            <stop offset="12%" stopColor="#00D2FF" stopOpacity="0.95" />
            <stop offset="28%" stopColor="#38BDF8" stopOpacity="1" />
            <stop offset="48%" stopColor="#A855F7" stopOpacity="0.95" />
            <stop offset="68%" stopColor="#00D2FF" stopOpacity="1" />
            <stop offset="86%" stopColor="#2DD4BF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
          </linearGradient>

          {/* Secondary Counter-Harmonic Stream Gradient */}
          <linearGradient id="wave-gradient-counter" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0" />
            <stop offset="15%" stopColor="#C084FC" stopOpacity="0.85" />
            <stop offset="38%" stopColor="#2DD4BF" stopOpacity="0.9" />
            <stop offset="62%" stopColor="#38BDF8" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#C084FC" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </linearGradient>

          {/* Wide Soft Neon Bloom Filter */}
          <filter id="neon-glow-wide" x="-10%" y="-100%" width="120%" height="300%">
            <feGaussianBlur stdDeviation="9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Core Hairline Crisp Glow Filter */}
          <filter id="neon-glow-core" x="-5%" y="-50%" width="110%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* --- LAYER A: Wide Ambient Neon Halo --- */}
        <g filter="url(#neon-glow-wide)" fill="none" opacity="0.65">
          {/* Primary undulating wave */}
          <path
            d="M -30 180 C 130 80, 270 280, 430 180 S 710 80, 870 180 S 1150 280, 1330 180 S 1490 80, 1650 180"
            stroke="url(#wave-gradient-primary)"
            strokeWidth="12"
          />
          {/* Intertwined counter wave */}
          <path
            d="M -30 180 C 130 280, 270 80, 430 180 S 710 280, 870 180 S 1150 80, 1330 180 S 1490 280, 1650 180"
            stroke="url(#wave-gradient-counter)"
            strokeWidth="9"
          />
        </g>

        {/* --- LAYER B: Razor-Sharp Luminous Core Paths --- */}
        <g filter="url(#neon-glow-core)" fill="none" strokeLinecap="round">
          {/* Primary wave crisp line */}
          <path
            d="M -30 180 C 130 80, 270 280, 430 180 S 710 80, 870 180 S 1150 280, 1330 180 S 1490 80, 1650 180"
            stroke="url(#wave-gradient-primary)"
            strokeWidth="2"
          />

          {/* Counter wave crisp line */}
          <path
            d="M -30 180 C 130 280, 270 80, 430 180 S 710 280, 870 180 S 1150 80, 1330 180 S 1490 280, 1650 180"
            stroke="url(#wave-gradient-counter)"
            strokeWidth="1.6"
          />

          {/* Delicate harmonic filament threads */}
          <path
            d="M -30 200 C 170 130, 340 230, 540 160 S 920 230, 1140 150 S 1420 220, 1650 170"
            stroke="url(#wave-gradient-primary)"
            strokeWidth="0.8"
            opacity="0.45"
          />
          <path
            d="M -30 160 C 190 230, 380 130, 620 210 S 1000 120, 1240 210 S 1460 130, 1650 165"
            stroke="url(#wave-gradient-counter)"
            strokeWidth="0.8"
            opacity="0.4"
          />
        </g>
      </svg>

      {/* Glowing spark nodes */}
      {nodes.map((node, i) => (
        <span
          key={`node-${i}`}
          className="absolute animate-glow-drift rounded-full pointer-events-none"
          style={{
            left: node.x,
            top: node.y,
            height: node.size,
            width: node.size,
            animationDelay: node.delay,
            background: '#ffffff',
            boxShadow: `0 0 8px 2px rgb(${node.color} / 0.95), 0 0 20px 6px rgb(${node.color} / 0.4)`
          }}
        />
      ))}
    </div>
  );
}
