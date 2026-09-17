"use client";

import React from 'react';
import {
  Code,
  BarChart3,
  Cloud,
  Database,
  Brain,
  Cpu,
  Layers
} from 'lucide-react';

interface Glyph {
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number; style?: React.CSSProperties }>;
  color: string;
  glowColor: string;
  className: string;
  delay: string;
}

const glyphs: Glyph[] = [
  { Icon: Code, color: '#38BDF8', glowColor: '56 189 248', className: 'left-[3%] top-[12%]', delay: '0s' },
  { Icon: BarChart3, color: '#FBBF24', glowColor: '251 191 36', className: 'left-[23%] top-[8%]', delay: '1.8s' },
  { Icon: Cloud, color: '#38BDF8', glowColor: '56 189 248', className: 'left-[44%] top-[10%]', delay: '0.6s' },
  { Icon: Database, color: '#2DD4BF', glowColor: '45 212 191', className: 'left-[65%] top-[8%]', delay: '2.4s' },
  { Icon: Brain, color: '#C084FC', glowColor: '192 132 252', className: 'left-[86%] top-[12%]', delay: '1.2s' },
  { Icon: Cpu, color: '#38BDF8', glowColor: '56 189 248', className: 'left-[14%] bottom-[12%]', delay: '2.1s' },
  { Icon: Layers, color: '#A855F7', glowColor: '168 85 247', className: 'left-[78%] bottom-[12%]', delay: '1.5s' }
];

const nodes = [
  { x: '5%', y: '48%', color: '56 189 248', size: 6, delay: '0s' },
  { x: '16%', y: '28%', color: '0 210 255', size: 8, delay: '1.2s' },
  { x: '29%', y: '68%', color: '168 85 247', size: 7, delay: '2.4s' },
  { x: '42%', y: '32%', color: '251 191 36', size: 6, delay: '0.8s' },
  { x: '56%', y: '72%', color: '56 189 248', size: 8, delay: '3.1s' },
  { x: '70%', y: '26%', color: '45 212 191', size: 7, delay: '1.9s' },
  { x: '84%', y: '65%', color: '192 132 252', size: 6, delay: '2.7s' },
  { x: '95%', y: '38%', color: '56 189 248', size: 7, delay: '1.0s' }
];

/** Isometric 3D wireframe tech cube */
function WireframeCube({
  className,
  color = '#38BDF8',
  fillColor = 'rgba(56, 189, 248, 0.15)',
  size = 28
}: {
  className: string;
  color?: string;
  fillColor?: string;
  size?: number;
}) {
  return (
    <div className={`absolute pointer-events-none ${className}`} aria-hidden="true">
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className="overflow-visible"
        style={{ filter: `drop-shadow(0 0 10px ${color})` }}
      >
        {/* Top Face */}
        <path d="M 16 2 L 28 8 L 16 14 L 4 8 Z" fill={fillColor} stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
        {/* Left Face */}
        <path d="M 4 8 L 16 14 L 16 28 L 4 22 Z" fill={fillColor} stroke={color} strokeWidth="1.2" strokeLinejoin="round" opacity="0.8" />
        {/* Right Face */}
        <path d="M 16 14 L 28 8 L 28 22 L 16 28 Z" fill={fillColor} stroke={color} strokeWidth="1.2" strokeLinejoin="round" opacity="0.6" />
        {/* Glowing Vertex Highlight */}
        <circle cx="16" cy="14" r="1.5" fill="#ffffff" />
      </svg>
    </div>
  );
}

export function MarqueeBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none" aria-hidden="true">
      {/* 1. Organic Ambient Bloom (Centered, completely fades at edges - ZERO hard box borders) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(65% 100% at 50% 50%, rgba(14, 55, 120, 0.38) 0%, rgba(6, 25, 60, 0.18) 45%, transparent 75%)'
        }}
      />

      {/* 2. Secondary Floating Radial Glows */}
      <div
        className="absolute left-[15%] top-1/2 -translate-y-1/2 h-[340px] w-[340px] rounded-full blur-[90px] opacity-40 animate-pulse"
        style={{ background: 'rgba(0, 102, 255, 0.35)' }}
      />
      <div
        className="absolute left-[50%] top-1/2 -translate-y-1/2 h-[320px] w-[320px] rounded-full blur-[100px] opacity-35"
        style={{ background: 'rgba(168, 85, 247, 0.28)' }}
      />
      <div
        className="absolute right-[15%] top-1/2 -translate-y-1/2 h-[340px] w-[340px] rounded-full blur-[90px] opacity-35 animate-pulse"
        style={{ background: 'rgba(20, 184, 166, 0.3)' }}
      />

      {/* 3. Subtle Technical Dot Grid (Fades out to 0 at top/bottom and edges) */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(rgba(56, 189, 248, 0.3) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          maskImage:
            'radial-gradient(60% 80% at 50% 50%, black 20%, transparent 85%)',
          WebkitMaskImage:
            'radial-gradient(60% 80% at 50% 50%, black 20%, transparent 85%)'
        }}
      />

      {/* 4. Sinuous Glowing Energy Wave SVG */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1600 360"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Main Primary Stream Gradient */}
          <linearGradient id="wave-gradient-primary" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D2FF" stopOpacity="0" />
            <stop offset="12%" stopColor="#00D2FF" stopOpacity="0.9" />
            <stop offset="28%" stopColor="#3B82F6" stopOpacity="1" />
            <stop offset="48%" stopColor="#A855F7" stopOpacity="0.95" />
            <stop offset="68%" stopColor="#00D2FF" stopOpacity="1" />
            <stop offset="85%" stopColor="#10B981" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
          </linearGradient>

          {/* Secondary Counter-Harmonic Stream Gradient */}
          <linearGradient id="wave-gradient-counter" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0" />
            <stop offset="15%" stopColor="#8B5CF6" stopOpacity="0.75" />
            <stop offset="35%" stopColor="#2DD4BF" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="85%" stopColor="#C084FC" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </linearGradient>

          {/* Wide Soft Neon Bloom Filter */}
          <filter id="neon-glow-wide" x="-10%" y="-100%" width="120%" height="300%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Core Hairline Crisp Glow Filter */}
          <filter id="neon-glow-core" x="-5%" y="-50%" width="110%" height="200%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* --- LAYER A: Wide Ambient Neon Halo --- */}
        <g filter="url(#neon-glow-wide)" fill="none" opacity="0.6">
          {/* Primary undulating wave */}
          <path
            d="M -20 180 C 140 100, 260 270, 420 190 S 680 90, 840 180 S 1120 280, 1300 170 S 1480 80, 1640 190"
            stroke="url(#wave-gradient-primary)"
            strokeWidth="14"
          />
          {/* Intertwined counter wave */}
          <path
            d="M -20 170 C 120 260, 290 90, 460 170 S 740 280, 920 190 S 1180 80, 1360 200 S 1500 270, 1640 170"
            stroke="url(#wave-gradient-counter)"
            strokeWidth="11"
          />
        </g>

        {/* --- LAYER B: Razor-Sharp Luminous Core Paths --- */}
        <g filter="url(#neon-glow-core)" fill="none" strokeLinecap="round">
          {/* Primary wave crisp line */}
          <path
            d="M -20 180 C 140 100, 260 270, 420 190 S 680 90, 840 180 S 1120 280, 1300 170 S 1480 80, 1640 190"
            stroke="url(#wave-gradient-primary)"
            strokeWidth="2.2"
          />

          {/* Counter wave crisp line */}
          <path
            d="M -20 170 C 120 260, 290 90, 460 170 S 740 280, 920 190 S 1180 80, 1360 200 S 1500 270, 1640 170"
            stroke="url(#wave-gradient-counter)"
            strokeWidth="1.8"
          />

          {/* Delicate harmonic filament threads */}
          <path
            d="M -20 210 C 200 150, 360 240, 580 160 S 960 220, 1180 140 S 1440 230, 1640 180"
            stroke="url(#wave-gradient-primary)"
            strokeWidth="0.9"
            opacity="0.5"
          />
          <path
            d="M -20 140 C 220 210, 400 120, 640 210 S 1020 110, 1260 210 S 1460 120, 1640 160"
            stroke="url(#wave-gradient-counter)"
            strokeWidth="0.9"
            opacity="0.45"
          />
        </g>
      </svg>

      {/* 5. Floating Isometric 3D Wireframe Cubes (from Reference Image) */}
      <WireframeCube className="left-[8%] top-[14%] animate-float-soft" color="#38BDF8" size={26} />
      <WireframeCube className="left-[31%] top-[8%] animate-float-soft" color="#A855F7" fillColor="rgba(168, 85, 247, 0.18)" size={22} />
      <WireframeCube className="left-[52%] bottom-[14%] animate-float-soft" color="#00D2FF" size={24} />
      <WireframeCube className="left-[73%] top-[12%] animate-float-soft" color="#38BDF8" size={28} />
      <WireframeCube className="left-[91%] bottom-[16%] animate-float-soft" color="#2DD4BF" fillColor="rgba(45, 212, 191, 0.18)" size={24} />

      {/* 6. Glowing Energy Nodes (Spark Dots along wave paths) */}
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
            boxShadow: `0 0 10px 3px rgb(${node.color} / 0.95), 0 0 24px 8px rgb(${node.color} / 0.45)`
          }}
        />
      ))}

      {/* 7. Floating Glass Glyph Chips (</>, Cloud, Database, Brain, etc.) */}
      {glyphs.map(({ Icon, color, glowColor, className, delay }, index) => (
        <span
          key={`glyph-${index}`}
          className={`absolute animate-float-soft rounded-[12px] p-[1px] ${className}`}
          style={{
            animationDelay: delay,
            background: `linear-gradient(145deg, rgba(${glowColor}, 0.8), rgba(${glowColor}, 0.1) 50%, rgba(${glowColor}, 0.5))`,
            boxShadow: `0 0 16px rgba(${glowColor}, 0.35)`
          }}
        >
          <span
            className="flex items-center justify-center rounded-[11px] h-8 w-8 sm:h-9 sm:w-9"
            style={{
              background: `linear-gradient(155deg, rgba(${glowColor}, 0.22) 0%, rgba(6, 15, 34, 0.92) 80%)`,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            <Icon
              className="h-4 w-4"
              strokeWidth={1.8}
              style={{
                color,
                filter: `drop-shadow(0 0 6px ${color})`
              }}
            />
          </span>
        </span>
      ))}
    </div>
  );
}
