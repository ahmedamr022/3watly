import React from 'react';

interface CardWavesProps {
  color: string;
  strong?: boolean;
  uid: string;
}

export function CardWaves({ color, strong = false, uid }: CardWavesProps) {
  const fade = `waves-fade-${uid}`;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 340 380"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity: strong ? 0.9 : 0.45 }}
    >
      <defs>
        <linearGradient id={fade} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="28%" stopColor={color} stopOpacity="0.6" />
          <stop offset="72%" stopColor={color} stopOpacity="0.55" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      <g fill="none" stroke={`url(#${fade})`} strokeLinecap="round">
        <path
          d="M-20 246 C 56 178, 118 268, 190 202 S 316 146, 372 206"
          strokeWidth="1.4"
          strokeOpacity={strong ? 0.8 : 0.45}
        />
        <path
          d="M-20 268 C 62 200, 126 290, 198 224 S 320 168, 372 228"
          strokeWidth="1.2"
          strokeOpacity={strong ? 0.55 : 0.3}
        />
        <path
          d="M-20 292 C 70 226, 132 314, 206 248 S 324 192, 372 252"
          strokeWidth="1"
          strokeOpacity={strong ? 0.35 : 0.2}
        />
        <path
          d="M-20 220 C 50 156, 110 244, 182 178 S 312 122, 372 182"
          strokeWidth="1.1"
          strokeOpacity={strong ? 0.45 : 0.22}
        />
        <path
          d="M-20 196 C 44 138, 104 220, 176 156 S 308 100, 372 158"
          strokeWidth="0.9"
          strokeOpacity={strong ? 0.25 : 0.12}
        />
      </g>
    </svg>
  );
}
