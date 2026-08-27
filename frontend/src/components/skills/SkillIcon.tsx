"use client";

import React from 'react';

export function DockerIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M22.5 10.8c-.3-.2-1.3-.4-2.5.2-.2-.8-.7-1.5-1.5-2-.1 0-.2-.1-.3-.1-.1-.8-.6-1.5-1.3-1.9-.3-.2-.7-.3-1.1-.3-.2-.5-.6-.9-1.1-1.2-.5-.3-1.1-.4-1.7-.3v-.1c0-.4-.3-.8-.7-1-.4-.2-.9-.3-1.4-.2-.1 0-.2 0-.2.1-.2-.4-.6-.8-1.1-1-.5-.2-1-.3-1.5-.1v5.1H1.5C.7 8.1 0 8.8 0 9.6v1.9c0 4.2 3.1 7.7 7.2 8.3 1.7.3 3.5.1 5.2-.4 3.7-1.1 6.5-4.2 7.1-8.1 1.2.3 2.5 0 3-.5z"
        fill="#2496ED"
      />
      <rect x="7.3" y="5.5" width="2" height="1.8" rx="0.3" fill="#2496ED" />
      <rect x="9.8" y="5.5" width="2" height="1.8" rx="0.3" fill="#2496ED" />
      <rect x="4.8" y="7.8" width="2" height="1.8" rx="0.3" fill="#2496ED" />
      <rect x="7.3" y="7.8" width="2" height="1.8" rx="0.3" fill="#2496ED" />
      <rect x="9.8" y="7.8" width="2" height="1.8" rx="0.3" fill="#2496ED" />
      <rect x="12.3" y="7.8" width="2" height="1.8" rx="0.3" fill="#2496ED" />
      <rect x="2.3" y="10.1" width="2" height="1.8" rx="0.3" fill="#2496ED" />
      <rect x="4.8" y="10.1" width="2" height="1.8" rx="0.3" fill="#2496ED" />
      <rect x="7.3" y="10.1" width="2" height="1.8" rx="0.3" fill="#2496ED" />
      <rect x="9.8" y="10.1" width="2" height="1.8" rx="0.3" fill="#2496ED" />
      <rect x="12.3" y="10.1" width="2" height="1.8" rx="0.3" fill="#2496ED" />
    </svg>
  );
}

export function AirflowIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M12 12V3c3.5 0 6 2.5 6 6s-2.5 3-6 3z" fill="#017CEE" />
      <path d="M12 12h9c0 3.5-2.5 6-6 6s-3-2.5-3-6z" fill="#E43927" />
      <path d="M12 12v9c-3.5 0-6-2.5-6-6s2.5-3 6-3z" fill="#00C7B7" />
      <path d="M12 12H3c0-3.5 2.5-6 6-6s3 2.5 3 6z" fill="#FFB900" />
      <circle cx="12" cy="12" r="2.2" fill="#FFFFFF" />
    </svg>
  );
}

export function KafkaIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="6" cy="12" r="3.2" fill="#231F20" />
      <circle cx="17.5" cy="5.5" r="3.2" fill="#231F20" />
      <circle cx="17.5" cy="18.5" r="3.2" fill="#231F20" />
      <circle cx="12" cy="12" r="2.2" fill="#231F20" />
      <path d="M6 12L17.5 5.5M6 12L17.5 18.5" stroke="#231F20" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function SparkIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z"
        fill="#E25A1C"
      />
      <path
        d="M17.5 16.5l1.2 3.3L22 21l-3.3 1.2-1.2 3.3-1.2-3.3L13 21l3.3-1.2 1.2-3.3z"
        fill="#F97316"
        opacity="0.8"
      />
    </svg>
  );
}

export function PostgresIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 2C6.48 2 2 6.48 2 12c0 3.7 2 6.94 5 8.65V18c0-1.66 1.34-3 3-3h4c1.66 0 3 1.34 3 3v2.65c3-1.71 5-4.95 5-8.65 0-5.52-4.48-10-10-10z"
        fill="#336791"
      />
      <path
        d="M8.5 9.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S10.83 11 10 11s-1.5-.67-1.5-1.5zm5.5 0c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S16.33 11 15.5 11 14 10.33 14 9.5z"
        fill="#FFFFFF"
      />
      <path d="M12 12.5c-1.66 0-3 1.34-3 3v5.5c1 .5 2 .7 3 .7s2-.2 3-.7v-5.5c0-1.66-1.34-3-3-3z" fill="#29557B" />
    </svg>
  );
}

export function PythonIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M11.87 2c-5.18 0-4.86 2.25-4.86 2.25l.01 2.33h4.94v.7H4.99S2 7.02 2 12.22c0 5.2 2.6 5.03 2.6 5.03h1.55v-2.17s-.08-2.6 2.55-2.6h4.37s2.47.04 2.47-2.42V4.46S16.03 2 11.87 2zm-2.7 1.63c.53 0 .96.43.96.96 0 .53-.43.96-.96.96-.53 0-.96-.43-.96-.96 0-.53.43-.96.96-.96z"
        fill="#3776AB"
      />
      <path
        d="M12.13 22c5.18 0 4.86-2.25 4.86-2.25l-.01-2.33h-4.94v-.7h6.97s2.99.26 2.99-4.94c0-5.2-2.6-5.03-2.6-5.03h-1.55v2.17s.08 2.6-2.55 2.6H10.9s-2.47-.04-2.47 2.42v5.6s-.45 2.46 3.7 2.46zm2.7-1.63c-.53 0-.96-.43-.96-.96 0-.53.43-.96.96-.96.53 0 .96.43.96.96 0 .53-.43.96-.96.96z"
        fill="#FFD43B"
      />
    </svg>
  );
}

export function PowerBiIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="2" y="10" width="5" height="12" rx="1.5" fill="#F2C811" />
      <rect x="9.5" y="6" width="5" height="16" rx="1.5" fill="#EAA300" />
      <rect x="17" y="2" width="5" height="20" rx="1.5" fill="#D68A00" />
    </svg>
  );
}

export function TableauIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="10.8" y="1.5" width="2.4" height="21" rx="0.6" fill="#E8762D" />
      <rect x="1.5" y="10.8" width="21" height="2.4" rx="0.6" fill="#E8762D" />
      <rect x="5.5" y="5" width="2" height="14" rx="0.5" fill="#5C7A99" />
      <rect x="5" y="5.5" width="14" height="2" rx="0.5" fill="#5C7A99" />
      <rect x="16.5" y="5" width="2" height="14" rx="0.5" fill="#5C7A99" />
      <rect x="5" y="16.5" width="14" height="2" rx="0.5" fill="#5C7A99" />
    </svg>
  );
}

export function SqlIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <ellipse cx="12" cy="6" rx="9" ry="3.5" fill="#0284C7" />
      <path d="M3 6v6c0 1.93 4.03 3.5 9 3.5s9-1.57 9-3.5V6" stroke="#0284C7" strokeWidth="2" fill="none" />
      <path d="M3 12v6c0 1.93 4.03 3.5 9 3.5s9-1.57 9-3.5v-6" stroke="#0284C7" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function DbtIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M12 2L3 7.2v9.6l9 5.2 9-5.2V7.2L12 2z" fill="#FF694B" />
      <path d="M12 6.5l-5 2.9v5.8l5 2.9 5-2.9V9.4L12 6.5z" fill="#FFFFFF" opacity="0.95" />
      <path d="M12 9.2l-2.8 1.6v3.2l2.8 1.6 2.8-1.6v-3.2L12 9.2z" fill="#FF694B" />
    </svg>
  );
}

export function SnowflakeIconComponent({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93M9 2l3 3-3 3M15 22l-3-3 3-3M2 9l3 3-3 3M22 15l-3-3 3-3"
        stroke="#29B5E8"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AwsIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M4.5 15.5c5 3.5 11 3.5 15.5 0M18 13.5l2.5 2.5-3.5 1"
        stroke="#FF9900"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="3.5" y="11" fill="#232F3E" fontSize="9" fontWeight="900" fontFamily="sans-serif">
        AWS
      </text>
    </svg>
  );
}

export function GitIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M21.7 10.3L13.7 2.3c-.4-.4-1.1-.4-1.5 0l-2.3 2.3 3 3c.4-.1.8 0 1.1.3.5.5.5 1.4 0 1.9-.3.3-.7.4-1.1.3l-2.6 2.6c.1.4 0 .8-.3 1.1-.5.5-1.4.5-1.9 0-.5-.5-.5-1.4 0-1.9.3-.3.7-.4 1.1-.3l2.5-2.5V5.8L3.8 13.7c-.4.4-.4 1.1 0 1.5l8 8c.4.4 1.1.4 1.5 0l8.4-8.4c.4-.4.4-1.1 0-1.5z"
        fill="#F05032"
      />
    </svg>
  );
}

export function ReactIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <ellipse cx="12" cy="12" rx="3.5" ry="9" transform="rotate(30 12 12)" stroke="#61DAFB" strokeWidth="1.6" />
      <ellipse cx="12" cy="12" rx="3.5" ry="9" transform="rotate(90 12 12)" stroke="#61DAFB" strokeWidth="1.6" />
      <ellipse cx="12" cy="12" rx="3.5" ry="9" transform="rotate(150 12 12)" stroke="#61DAFB" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="2" fill="#61DAFB" />
    </svg>
  );
}

interface IconRegistryMeta {
  Component: React.ComponentType<{ className?: string }>;
  color: string;
  bgLight: string;
  borderColor: string;
}

const REGISTRY: Record<string, IconRegistryMeta> = {
  docker: { Component: DockerIcon, color: '#2496ED', bgLight: '#EFF6FF', borderColor: '#BFDBFE' },
  airflow: { Component: AirflowIcon, color: '#017CEE', bgLight: '#EFF6FF', borderColor: '#BFDBFE' },
  'apache-airflow': { Component: AirflowIcon, color: '#017CEE', bgLight: '#EFF6FF', borderColor: '#BFDBFE' },
  kafka: { Component: KafkaIcon, color: '#231F20', bgLight: '#F8FAFC', borderColor: '#E2E8F0' },
  'apache-kafka': { Component: KafkaIcon, color: '#231F20', bgLight: '#F8FAFC', borderColor: '#E2E8F0' },
  spark: { Component: SparkIcon, color: '#E25A1C', bgLight: '#FFF7ED', borderColor: '#FED7AA' },
  'apache-spark': { Component: SparkIcon, color: '#E25A1C', bgLight: '#FFF7ED', borderColor: '#FED7AA' },
  postgresql: { Component: PostgresIcon, color: '#336791', bgLight: '#EEF2FF', borderColor: '#C7D2FE' },
  sql: { Component: SqlIcon, color: '#0284C7', bgLight: '#E0F2FE', borderColor: '#BAE6FD' },
  python: { Component: PythonIcon, color: '#3776AB', bgLight: '#EFF6FF', borderColor: '#BFDBFE' },
  powerbi: { Component: PowerBiIcon, color: '#F2C811', bgLight: '#FEFCE8', borderColor: '#FEF08A' },
  bi: { Component: PowerBiIcon, color: '#F2C811', bgLight: '#FEFCE8', borderColor: '#FEF08A' },
  tableau: { Component: TableauIcon, color: '#E8762D', bgLight: '#FFF7ED', borderColor: '#FED7AA' },
  dbt: { Component: DbtIcon, color: '#FF694B', bgLight: '#FFF1F0', borderColor: '#FECDD3' },
  snowflake: { Component: SnowflakeIconComponent, color: '#29B5E8', bgLight: '#ECFEFF', borderColor: '#A5F3FC' },
  aws: { Component: AwsIcon, color: '#FF9900', bgLight: '#FFFBEB', borderColor: '#FDE68A' },
  git: { Component: GitIcon, color: '#F05032', bgLight: '#FEF2F2', borderColor: '#FECACA' },
  react: { Component: ReactIcon, color: '#61DAFB', bgLight: '#F0FDFA', borderColor: '#99F6E4' },
  js: { Component: PythonIcon, color: '#F7DF1E', bgLight: '#FEFCE8', borderColor: '#FEF08A' }
};

const fallback: IconRegistryMeta = {
  Component: SqlIcon,
  color: '#475569',
  bgLight: '#F8FAFC',
  borderColor: '#E2E8F0'
};

const SIZES = {
  sm: { tile: 'h-9 w-9 rounded-lg', icon: 'h-5 w-5' },
  md: { tile: 'h-12 w-12 rounded-xl shadow-xs', icon: 'h-7 w-7' },
  lg: { tile: 'h-16 w-16 rounded-2xl shadow-sm', icon: 'h-9 w-9' },
  xl: { tile: 'h-20 w-20 rounded-2xl shadow-md', icon: 'h-11 w-11' }
};

interface SkillIconProps {
  skillId: string;
  size?: keyof typeof SIZES;
  className?: string;
}

export function SkillIcon({ skillId, size = 'md', className = '' }: SkillIconProps) {
  const normalized = (skillId || '').toLowerCase().trim();
  const meta = REGISTRY[normalized] ?? fallback;
  const dimensions = SIZES[size];

  return (
    <span
      className={`grid shrink-0 place-items-center border transition-transform duration-200 hover:scale-105 ${dimensions.tile} ${className}`}
      style={{ backgroundColor: meta.bgLight, borderColor: meta.borderColor }}
      aria-hidden="true"
    >
      <meta.Component className={dimensions.icon} />
    </span>
  );
}

export function skillColor(skillId: string): string {
  const normalized = (skillId || '').toLowerCase().trim();
  return REGISTRY[normalized]?.color ?? '#475569';
}
