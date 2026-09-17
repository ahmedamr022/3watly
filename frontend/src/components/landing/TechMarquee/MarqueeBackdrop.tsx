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
  { Icon: Code, color: '#38BDF8', glowColor: '56 189 248', className: 'left-[4%] top-[10%]', delay: '0s' },
  { Icon: BarChart3, color: '#FBBF24', glowColor: '251 191 36', className: 'left-[22%] top-[6%]', delay: '1.8s' },
  { Icon: Cloud, color: '#38BDF8', glowColor: '56 189 248', className: 'left-[43%] top-[8%]', delay: '0.6s' },
  { Icon: Database, color: '#2DD4BF', glowColor: '45 212 191', className: 'left-[64%] top-[6%]', delay: '2.4s' },
  { Icon: Brain, color: '#C084FC', glowColor: '192 132 252', className: 'left-[85%] top-[10%]', delay: '1.2s' },
  { Icon: Cpu, color: '#38BDF8', glowColor: '56 189 248', className: 'left-[14%] bottom-[10%]', delay: '2.1s' },
  { Icon: Layers, color: '#A855F7', glowColor: '168 85 247', className: 'left-[76%] bottom-[10%]', delay: '1.5s' }
];

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

/** Isometric 3D wireframe tech cube */
function WireframeCube({
  className,
  color = '#38BDF8',
  fillColor = 'rgba(56, 189, 248, 0.12)',
  size = 26
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
      {/* PURE TRANSPARENT BACKGROUND - NO BLOBS, NO MUDDY COLORS, NO HARD EDGES */}

      {/* Sinuous Glowing Energy Wave SVG */}
      <svg
        className="absolute inset-0 h-full w-full"
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

      {/* Floating Isometric 3D Wireframe Cubes */}
      <WireframeCube className="left-[9%] top-[12%] animate-float-soft" color="#38BDF8" size={26} />
      <WireframeCube className="left-[31%] top-[8%] animate-float-soft" color="#C084FC" fillColor="rgba(192, 132, 252, 0.15)" size={22} />
      <WireframeCube className="left-[52%] bottom-[12%] animate-float-soft" color="#00D2FF" size={24} />
      <WireframeCube className="left-[73%] top-[10%] animate-float-soft" color="#38BDF8" size={28} />
      <WireframeCube className="left-[91%] bottom-[14%] animate-float-soft" color="#2DD4BF" fillColor="rgba(45, 212, 191, 0.15)" size={24} />

      {/* Glowing Energy Nodes (Spark Dots along wave paths) */}
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

      {/* Floating Glass Glyph Chips (</>, Cloud, Database, Brain, etc.) */}
      {glyphs.map(({ Icon, color, glowColor, className, delay }, index) => (
        <span
          key={`glyph-${index}`}
          className={`absolute animate-float-soft rounded-[12px] p-[1px] ${className}`}
          style={{
            animationDelay: delay,
            background: `linear-gradient(145deg, rgba(${glowColor}, 0.7), rgba(${glowColor}, 0.08) 50%, rgba(${glowColor}, 0.4))`,
            boxShadow: `0 0 14px rgba(${glowColor}, 0.3)`
          }}
        >
          <span
            className="flex items-center justify-center rounded-[11px] h-8 w-8 sm:h-8.5 sm:w-8.5"
            style={{
              background: `linear-gradient(155deg, rgba(${glowColor}, 0.18) 0%, rgba(4, 10, 24, 0.92) 80%)`,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.18)'
            }}
          >
            <Icon
              className="h-3.5 w-3.5"
              strokeWidth={1.8}
              style={{
                color,
                filter: `drop-shadow(0 0 5px ${color})`
              }}
            />
          </span>
        </span>
      ))}
    </div>
  );
}
