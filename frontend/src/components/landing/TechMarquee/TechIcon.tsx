"use client";

import React from 'react';
import { SiDocker, SiMongodb, SiPandas, SiPython } from 'react-icons/si';
import { BrainCircuit, UploadCloud } from 'lucide-react';
import type { TechIconName } from '@/data/techStack';

interface TechIconProps {
  name: TechIconName;
  color: string;
}

export function TechIcon({ name, color }: TechIconProps) {
  switch (name) {
    case 'sql':
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" aria-hidden="true">
          {/* 3D Cylinder Database Stack */}
          <ellipse cx="12" cy="5.5" rx="8" ry="3" fill="#0284C7" fillOpacity="0.4" stroke="#38BDF8" strokeWidth="1.6" />
          <path d="M4 5.5v5.5c0 1.66 3.58 3 8 3s8-1.34 8-3V5.5" stroke="#38BDF8" strokeWidth="1.6" />
          <path d="M4 11v5.5c0 1.66 3.58 3 8 3s8-1.34 8-3V11" stroke="#38BDF8" strokeWidth="1.6" />
          <ellipse cx="12" cy="5.5" rx="5" ry="1.8" fill="#38BDF8" fillOpacity="0.8" />
        </svg>
      );

    case 'python':
      return (
        <span className="relative block h-full w-full">
          <SiPython
            className="absolute inset-0 h-full w-full"
            style={{ color: '#38BDF8', clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
            aria-hidden="true"
          />
          <SiPython
            className="absolute inset-0 h-full w-full"
            style={{ color: '#FBBF24', clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
            aria-hidden="true"
          />
        </span>
      );

    case 'pandas':
      return (
        <SiPandas
          className="h-full w-full"
          style={{ color }}
          aria-hidden="true"
        />
      );

    case 'powerbi':
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" aria-hidden="true">
          <rect x="3" y="12" width="4.5" height="9" rx="1.2" fill={color} fillOpacity="0.75" />
          <rect x="9.8" y="7.5" width="4.5" height="13.5" rx="1.2" fill={color} fillOpacity="0.9" />
          <rect x="16.5" y="3" width="4.5" height="18" rx="1.2" fill={color} />
        </svg>
      );

    case 'ml':
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="1.2" strokeDasharray="2 2" opacity="0.4" />
          <circle cx="12" cy="12" r="3" fill={color} />
          <g stroke={color} strokeWidth="1.2" opacity="0.7">
            <path d="M12 9V4M12 15v5M9 12H4M15 12h5M9.8 9.8L6.2 6.2M14.2 14.2l3.6 3.6M14.2 9.8l3.6-3.6M9.8 14.2l-3.6 3.6" />
          </g>
          <g fill={color}>
            <circle cx="12" cy="3.5" r="1.6" />
            <circle cx="12" cy="20.5" r="1.6" />
            <circle cx="3.5" cy="12" r="1.6" />
            <circle cx="20.5" cy="12" r="1.6" />
            <circle cx="6" cy="6" r="1.3" />
            <circle cx="18" cy="18" r="1.3" />
            <circle cx="18" cy="6" r="1.3" />
            <circle cx="6" cy="18" r="1.3" />
          </g>
        </svg>
      );

    case 'cloud':
      return (
        <UploadCloud
          className="h-full w-full"
          style={{ color }}
          strokeWidth={1.7}
          aria-hidden="true"
        />
      );

    case 'docker':
      return (
        <SiDocker
          className="h-full w-full"
          style={{ color }}
          aria-hidden="true"
        />
      );

    case 'etl':
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" aria-hidden="true">
          <path
            d="M6 6h5.5M6 18h5.5M11.5 6c0 3.5 2 6 6.5 6M11.5 18c0-3.5 2-6 6.5-6"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="4" cy="6" r="2.5" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.2" />
          <circle cx="4" cy="18" r="2.5" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.2" />
          <circle cx="20" cy="12" r="2.8" fill={color} />
        </svg>
      );

    case 'mongodb':
      return (
        <SiMongodb
          className="h-full w-full"
          style={{ color }}
          aria-hidden="true"
        />
      );

    case 'ai':
      return (
        <BrainCircuit
          className="h-full w-full"
          style={{ color }}
          strokeWidth={1.6}
          aria-hidden="true"
        />
      );

    default:
      return null;
  }
}
