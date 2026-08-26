import React from 'react';
import {
  SiApacheairflow,
  SiApachespark,
  SiDocker,
  SiGit,
  SiKubernetes,
  SiNodedotjs,
  SiPandas,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiReact,
  SiScikitlearn,
  SiTensorflow,
  SiTypescript } from
'react-icons/si';
import {
  BrainIcon,
  ChartColumnIcon,
  CloudIcon,
  LightbulbIcon,
  PlugIcon,
  SigmaIcon,
  TerminalIcon } from
'lucide-react';
import type { TechKey } from '../../types/onboarding';

type IconComponent = React.ComponentType<{className?: string;}>;

/** Microsoft brand marks are drawn locally so they stay accurate and dependency-free. */
function ExcelMark({ className = '' }: {className?: string;}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="2" y="3" width="20" height="18" rx="3" fill="#1D6F42" />
      <path
        d="M8.4 8.2l3.6 7.6M12 8.2l-3.6 7.6"
        stroke="#fff"
        strokeWidth="1.9"
        strokeLinecap="round" />
      
      <rect x="14" y="7.6" width="5.4" height="8.8" rx="1" fill="#fff" opacity="0.9" />
      <path d="M14 10.6h5.4M14 13.4h5.4" stroke="#1D6F42" strokeWidth="1" />
    </svg>);

}

function PowerBiMark({ className = '' }: {className?: string;}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="3" y="10" width="4.6" height="11" rx="1.4" fill="#F2C811" />
      <rect x="9.7" y="6" width="4.6" height="15" rx="1.4" fill="#EAA300" />
      <rect x="16.4" y="2.5" width="4.6" height="18.5" rx="1.4" fill="#D68A00" />
    </svg>);

}

interface TechMeta {
  Icon: IconComponent;
  color: string;
  tile: string;
}

const registry: Record<TechKey, TechMeta> = {
  python: { Icon: SiPython, color: 'text-[#3776AB]', tile: 'bg-[#EEF3FE]' },
  sql: { Icon: SiPostgresql, color: 'text-[#31648C]', tile: 'bg-[#EDF4FB]' },
  pandas: { Icon: SiPandas, color: 'text-[#150458]', tile: 'bg-[#EEEDFB]' },
  powerbi: { Icon: PowerBiMark, color: '', tile: 'bg-[#FFF6E5]' },
  excel: { Icon: ExcelMark, color: '', tile: 'bg-[#E9F6EE]' },
  viz: { Icon: ChartColumnIcon, color: 'text-[#1B57E0]', tile: 'bg-[#EEF3FE]' },
  statistics: { Icon: SigmaIcon, color: 'text-[#0F766E]', tile: 'bg-[#E7F5F3]' },
  problem: { Icon: LightbulbIcon, color: 'text-[#C2410C]', tile: 'bg-[#FEF1E7]' },
  docker: { Icon: SiDocker, color: 'text-[#2496ED]', tile: 'bg-[#EAF4FE]' },
  kubernetes: { Icon: SiKubernetes, color: 'text-[#326CE5]', tile: 'bg-[#EBF1FE]' },
  spark: { Icon: SiApachespark, color: 'text-[#E25A1C]', tile: 'bg-[#FDEFE9]' },
  airflow: { Icon: SiApacheairflow, color: 'text-[#017CEE]', tile: 'bg-[#E9F3FE]' },
  react: { Icon: SiReact, color: 'text-[#087EA4]', tile: 'bg-[#E8F4F8]' },
  typescript: { Icon: SiTypescript, color: 'text-[#3178C6]', tile: 'bg-[#EAF1FA]' },
  node: { Icon: SiNodedotjs, color: 'text-[#5FA04E]', tile: 'bg-[#EDF6EA]' },
  git: { Icon: SiGit, color: 'text-[#F05033]', tile: 'bg-[#FDEDEA]' },
  tensorflow: { Icon: SiTensorflow, color: 'text-[#FF6F00]', tile: 'bg-[#FFF2E5]' },
  pytorch: { Icon: SiPytorch, color: 'text-[#EE4C2C]', tile: 'bg-[#FDECE8]' },
  sklearn: { Icon: SiScikitlearn, color: 'text-[#F7931E]', tile: 'bg-[#FEF4E7]' },
  cloud: { Icon: CloudIcon, color: 'text-[#1B57E0]', tile: 'bg-[#EEF3FE]' },
  terminal: { Icon: TerminalIcon, color: 'text-[#334155]', tile: 'bg-[#EEF1F6]' },
  api: { Icon: PlugIcon, color: 'text-[#4F46E5]', tile: 'bg-[#EEEDFD]' }
};

const fallback: TechMeta = { Icon: BrainIcon, color: 'text-brand-indigo', tile: 'bg-[#EEEDFD]' };

interface TechIconProps {
  name: TechKey;
  className?: string;
}

export function TechIcon({ name, className = 'h-4 w-4' }: TechIconProps) {
  const { Icon, color } = registry[name] ?? fallback;
  return <Icon className={`${className} ${color}`} />;
}

export function techTile(name: TechKey) {
  return (registry[name] ?? fallback).tile;
}