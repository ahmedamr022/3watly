"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/* ========================================================================= */
/* Custom Pixel-Perfect Tech SVG Glyphs                                      */
/* ========================================================================= */

function ReactIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <ellipse cx="12" cy="12" rx="4" ry="10" stroke="#00D2FF" strokeWidth="1.6" transform="rotate(30 12 12)" />
      <ellipse cx="12" cy="12" rx="4" ry="10" stroke="#00D2FF" strokeWidth="1.6" transform="rotate(90 12 12)" />
      <ellipse cx="12" cy="12" rx="4" ry="10" stroke="#00D2FF" strokeWidth="1.6" transform="rotate(150 12 12)" />
      <circle cx="12" cy="12" r="2.2" fill="#00D2FF" />
    </svg>
  );
}

function NodeIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M12 2.5L20.5 7.4V16.6L12 21.5L3.5 16.6V7.4L12 2.5Z"
        stroke="#22C55E"
        strokeWidth="1.8"
        fill="#15803D"
        fillOpacity="0.2"
      />
      <path
        d="M11.5 8V16M8.5 10.5C9.5 9.5 11 9 12.5 9C14.5 9 15.5 10 15.5 11.5C15.5 13.5 12 13 12 15C12 15.8 12.8 16.2 13.8 16.2"
        stroke="#4ADE80"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PythonIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M11.9 2C8.7 2 6.8 3.4 6.8 5.6v2.7h5.3v.7H4.4C2.3 9 1 10.9 1 14.1c0 3.2 1.8 4.6 4.6 4.6h1.5v-2.1c0-2.3 2-4.2 4.3-4.2h5.3v-.8c0-2.2-1.9-4.3-4.3-4.3h-.5V5.6c0-2.2-1.9-3.6-4-3.6zm-1.8 1.8c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"
        fill="#387EB8"
      />
      <path
        d="M12.1 22c3.2 0 5.1-1.4 5.1-3.6v-2.7h-5.3v-.7h7.7c2.1 0 3.4-1.9 3.4-5.1 0-3.2-1.8-4.6-4.6-4.6h-1.5v2.1c0 2.3-2 4.2-4.3 4.2H7.3v.8c0 2.2 1.9 4.3 4.3 4.3h.5v1.7c0 2.2 1.9 3.6 4 3.6zm1.8-1.8c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"
        fill="#FFD43B"
      />
    </svg>
  );
}

function DockerIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect x="6" y="8" width="2.2" height="2" rx="0.3" fill="#0284C7" />
      <rect x="9" y="8" width="2.2" height="2" rx="0.3" fill="#0284C7" />
      <rect x="12" y="8" width="2.2" height="2" rx="0.3" fill="#0284C7" />
      <rect x="3" y="10.8" width="2.2" height="2" rx="0.3" fill="#0284C7" />
      <rect x="6" y="10.8" width="2.2" height="2" rx="0.3" fill="#0284C7" />
      <rect x="9" y="10.8" width="2.2" height="2" rx="0.3" fill="#0284C7" />
      <rect x="12" y="10.8" width="2.2" height="2" rx="0.3" fill="#0284C7" />
      <rect x="15" y="10.8" width="2.2" height="2" rx="0.3" fill="#0284C7" />
      <path
        d="M2.5 13.5C2.5 17.5 5.5 19.5 10 19.5C15 19.5 19 17 20.5 13.5C21.5 13.5 22.5 12.8 22.5 12C22.5 11.2 21 11 20 11.5C19.5 10 18.5 9 17 9C17 9 16.5 11 15 11.5H2.5v2z"
        fill="#0284C7"
      />
      <circle cx="6" cy="15.5" r="0.6" fill="#fff" />
    </svg>
  );
}

function JavaIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M4 18.5h14a3 3 0 003-3v0a1 1 0 00-1-1H4a1 1 0 00-1 1v0a3 3 0 002 3z" stroke="#EA580C" strokeWidth="1.8" fill="#C2410C" fillOpacity="0.2" />
      <path d="M9 12c0-2 2-3 2-5M14 12c0-2 2-3 2-5M11.5 13.5c0-2 1.5-3 1.5-5" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5 21h12" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SpringIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.14 2.53 7.69 6.13 9.17-.08-.6-.13-1.22-.13-1.85 0-5.52 4.48-10 10-10 .63 0 1.25.05 1.85.13C18.31 4.53 14.76 2 12 2z" fill="#6DB33F" />
      <path d="M21.87 9.32C21.46 9.11 21 9 20.5 9c-4.42 0-8 3.58-8 8 0 .5.11.96.32 1.37A9.976 9.976 0 0022 12c0-.93-.13-1.83-.37-2.68h.24z" fill="#5FA334" />
    </svg>
  );
}

function AwsIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M4 14.5c4.5 3.5 11.5 3.5 16 0" stroke="#FF9900" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M18.5 12.5l2 2-1 2" stroke="#FF9900" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="3.5" y="11" fill="#FF9900" fontSize="8" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.5">aws</text>
    </svg>
  );
}

/* ========================================================================= */
/* Ticker Cards Data Definition                                             */
/* ========================================================================= */

interface TickerCardData {
  id: string;
  title: string;
  subtitle: string;
  growth: string;
  cardBorder: string;
  cardGlow: string;
  cardHover: string;
  iconBg: string;
  iconBorder: string;
  badge: {
    label: string;
    dotColor: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
  };
  pillBg: string;
  pillBorder: string;
  pillText: string;
  renderIcon: () => React.ReactNode;
}

export function MarketTicker() {
  const { isAr } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);

  const cards: TickerCardData[] = isAr
    ? [
        {
          id: 'card-react',
          title: 'React - Next.js',
          subtitle: 'تطوير تطبيقات الويب الحديثة',
          growth: '+62%',
          cardBorder: 'border-sky-300/80 dark:border-[#00D2FF]/75',
          cardGlow: 'shadow-none dark:shadow-[0_0_20px_-2px_rgba(0,210,255,0.45)]',
          cardHover: 'hover:border-sky-400 dark:hover:border-[#00D2FF] hover:shadow-md dark:hover:shadow-[0_0_30px_rgba(0,210,255,0.7)]',
          iconBg: 'bg-sky-50 dark:bg-cyan-950/60',
          iconBorder: 'border-sky-200 dark:border-cyan-400/35',
          badge: {
            label: 'الأكثر طلباً',
            dotColor: 'bg-sky-500 dark:bg-[#00D2FF]',
            bgColor: 'bg-sky-50 dark:bg-cyan-500/20',
            textColor: 'text-sky-700 dark:text-cyan-300',
            borderColor: 'border-sky-200 dark:border-cyan-400/40'
          },
          pillBg: 'bg-sky-50 dark:bg-cyan-950/70',
          pillBorder: 'border-sky-200 dark:border-cyan-500/40',
          pillText: 'text-sky-700 dark:text-cyan-300',
          renderIcon: () => <ReactIcon className="w-4.5 h-4.5" />
        },
        {
          id: 'card-aws',
          title: 'AWS - Terraform',
          subtitle: 'البنية التحتية السحابية (Cloud)',
          growth: '+52%',
          cardBorder: 'border-amber-300/80 dark:border-[#D97706]/75',
          cardGlow: 'shadow-none dark:shadow-[0_0_20px_-2px_rgba(245,158,11,0.45)]',
          cardHover: 'hover:border-amber-400 dark:hover:border-[#D97706] hover:shadow-md dark:hover:shadow-[0_0_30px_rgba(245,158,11,0.7)]',
          iconBg: 'bg-amber-50 dark:bg-amber-950/60',
          iconBorder: 'border-amber-200 dark:border-amber-400/35',
          badge: {
            label: 'الأعلى نمواً',
            dotColor: 'bg-amber-500 dark:bg-[#F59E0B]',
            bgColor: 'bg-amber-50 dark:bg-amber-500/20',
            textColor: 'text-amber-700 dark:text-amber-300',
            borderColor: 'border-amber-200 dark:border-amber-400/40'
          },
          pillBg: 'bg-amber-50 dark:bg-amber-950/70',
          pillBorder: 'border-amber-200 dark:border-amber-500/40',
          pillText: 'text-amber-700 dark:text-amber-300',
          renderIcon: () => <AwsIcon className="w-4.5 h-4.5" />
        },
        {
          id: 'card-java',
          title: 'Java - Spring Boot',
          subtitle: 'تطبيقات المؤسسات والشركات الكبرى',
          growth: '+41%',
          cardBorder: 'border-purple-300/80 dark:border-[#EA580C]/75',
          cardGlow: 'shadow-none dark:shadow-[0_0_20px_-2px_rgba(249,115,22,0.45)]',
          cardHover: 'hover:border-purple-400 dark:hover:border-[#EA580C] hover:shadow-md dark:hover:shadow-[0_0_30px_rgba(249,115,22,0.7)]',
          iconBg: 'bg-purple-50 dark:bg-orange-950/60',
          iconBorder: 'border-purple-200 dark:border-orange-400/35',
          badge: {
            label: 'شائع ومطلوب',
            dotColor: 'bg-purple-500 dark:bg-[#F97316]',
            bgColor: 'bg-purple-50 dark:bg-orange-500/20',
            textColor: 'text-purple-700 dark:text-orange-300',
            borderColor: 'border-purple-200 dark:border-orange-400/40'
          },
          pillBg: 'bg-purple-50 dark:bg-orange-950/70',
          pillBorder: 'border-purple-200 dark:border-orange-500/40',
          pillText: 'text-purple-700 dark:text-orange-300',
          renderIcon: () => <SpringIcon className="w-4.5 h-4.5" />
        },
        {
          id: 'card-node2',
          title: 'Node.js & APIs',
          subtitle: 'هندسة الأنظمة والـ Microservices',
          growth: '+60%',
          cardBorder: 'border-emerald-300/80 dark:border-[#10B981]/75',
          cardGlow: 'shadow-none dark:shadow-[0_0_20px_-2px_rgba(16,185,129,0.45)]',
          cardHover: 'hover:border-emerald-400 dark:hover:border-[#10B981] hover:shadow-md dark:hover:shadow-[0_0_30px_rgba(16,185,129,0.7)]',
          iconBg: 'bg-emerald-50 dark:bg-emerald-950/60',
          iconBorder: 'border-emerald-200 dark:border-emerald-400/35',
          badge: {
            label: 'نمو سريع',
            dotColor: 'bg-emerald-500 dark:bg-[#10B981]',
            bgColor: 'bg-emerald-50 dark:bg-emerald-500/20',
            textColor: 'text-emerald-700 dark:text-emerald-300',
            borderColor: 'border-emerald-200 dark:border-emerald-400/40'
          },
          pillBg: 'bg-emerald-50 dark:bg-emerald-950/70',
          pillBorder: 'border-emerald-200 dark:border-emerald-500/40',
          pillText: 'text-emerald-700 dark:text-emerald-300',
          renderIcon: () => <NodeIcon className="w-4.5 h-4.5" />
        },
        {
          id: 'card-docker',
          title: 'Docker',
          subtitle: 'إدارة الحاويات وDevOps',
          growth: '+41%',
          cardBorder: 'border-sky-300/80 dark:border-[#0284C7]/75',
          cardGlow: 'shadow-none dark:shadow-[0_0_20px_-2px_rgba(14,165,233,0.45)]',
          cardHover: 'hover:border-sky-400 dark:hover:border-[#0284C7] hover:shadow-md dark:hover:shadow-[0_0_30px_rgba(14,165,233,0.7)]',
          iconBg: 'bg-sky-50 dark:bg-sky-950/60',
          iconBorder: 'border-sky-200 dark:border-sky-400/35',
          badge: {
            label: 'مطلوب دائماً',
            dotColor: 'bg-sky-500 dark:bg-[#38BDF8]',
            bgColor: 'bg-sky-50 dark:bg-sky-500/20',
            textColor: 'text-sky-700 dark:text-sky-300',
            borderColor: 'border-sky-200 dark:border-sky-400/40'
          },
          pillBg: 'bg-sky-50 dark:bg-sky-950/70',
          pillBorder: 'border-sky-200 dark:border-sky-500/40',
          pillText: 'text-sky-700 dark:text-sky-300',
          renderIcon: () => <DockerIcon className="w-4.5 h-4.5" />
        },
        {
          id: 'card-python',
          title: 'Python - SQL - React',
          subtitle: 'تحليل البيانات والـ AI',
          growth: '+72%',
          cardBorder: 'border-purple-300/80 dark:border-[#8B5CF6]/75',
          cardGlow: 'shadow-none dark:shadow-[0_0_20px_-2px_rgba(139,92,246,0.45)]',
          cardHover: 'hover:border-purple-400 dark:hover:border-[#8B5CF6] hover:shadow-md dark:hover:shadow-[0_0_30px_rgba(139,92,246,0.7)]',
          iconBg: 'bg-purple-50 dark:bg-purple-950/60',
          iconBorder: 'border-purple-200 dark:border-purple-400/35',
          badge: {
            label: 'الأكثر طلباً',
            dotColor: 'bg-purple-500 dark:bg-[#A855F7]',
            bgColor: 'bg-purple-50 dark:bg-purple-500/20',
            textColor: 'text-purple-700 dark:text-purple-300',
            borderColor: 'border-purple-200 dark:border-purple-400/40'
          },
          pillBg: 'bg-purple-50 dark:bg-purple-950/70',
          pillBorder: 'border-purple-200 dark:border-purple-500/40',
          pillText: 'text-purple-700 dark:text-purple-300',
          renderIcon: () => <PythonIcon className="w-4.5 h-4.5" />
        },
        {
          id: 'card-node',
          title: 'Node.js',
          subtitle: 'تطوير الخوادم والـ Backend',
          growth: '+48%',
          cardBorder: 'border-emerald-300/80 dark:border-[#10B981]/75',
          cardGlow: 'shadow-none dark:shadow-[0_0_20px_-2px_rgba(16,185,129,0.45)]',
          cardHover: 'hover:border-emerald-400 dark:hover:border-[#10B981] hover:shadow-md dark:hover:shadow-[0_0_30px_rgba(16,185,129,0.7)]',
          iconBg: 'bg-emerald-50 dark:bg-emerald-950/60',
          iconBorder: 'border-emerald-200 dark:border-emerald-400/35',
          badge: {
            label: 'نمو سريع',
            dotColor: 'bg-emerald-500 dark:bg-[#10B981]',
            bgColor: 'bg-emerald-50 dark:bg-emerald-500/20',
            textColor: 'text-emerald-700 dark:text-emerald-300',
            borderColor: 'border-emerald-200 dark:border-emerald-400/40'
          },
          pillBg: 'bg-emerald-50 dark:bg-emerald-950/70',
          pillBorder: 'border-emerald-200 dark:border-emerald-500/40',
          pillText: 'text-emerald-700 dark:text-emerald-300',
          renderIcon: () => <NodeIcon className="w-4.5 h-4.5" />
        }
      ]
    : [
        {
          id: 'card-react',
          title: 'React - Next.js',
          subtitle: 'Building modern web applications',
          growth: '+62%',
          cardBorder: 'border-sky-300/80 dark:border-[#00D2FF]/75',
          cardGlow: 'shadow-none dark:shadow-[0_0_20px_-2px_rgba(0,210,255,0.45)]',
          cardHover: 'hover:border-sky-400 dark:hover:border-[#00D2FF] hover:shadow-md dark:hover:shadow-[0_0_30px_rgba(0,210,255,0.7)]',
          iconBg: 'bg-sky-50 dark:bg-cyan-950/60',
          iconBorder: 'border-sky-200 dark:border-cyan-400/35',
          badge: {
            label: 'High Demand',
            dotColor: 'bg-sky-500 dark:bg-[#00D2FF]',
            bgColor: 'bg-sky-50 dark:bg-cyan-500/20',
            textColor: 'text-sky-700 dark:text-cyan-300',
            borderColor: 'border-sky-200 dark:border-cyan-400/40'
          },
          pillBg: 'bg-sky-50 dark:bg-cyan-950/70',
          pillBorder: 'border-sky-200 dark:border-cyan-500/40',
          pillText: 'text-sky-700 dark:text-cyan-300',
          renderIcon: () => <ReactIcon className="w-4.5 h-4.5" />
        },
        {
          id: 'card-aws',
          title: 'AWS - Terraform',
          subtitle: 'Cloud infrastructure',
          growth: '+52%',
          cardBorder: 'border-amber-300/80 dark:border-[#D97706]/75',
          cardGlow: 'shadow-none dark:shadow-[0_0_20px_-2px_rgba(245,158,11,0.45)]',
          cardHover: 'hover:border-amber-400 dark:hover:border-[#D97706] hover:shadow-md dark:hover:shadow-[0_0_30px_rgba(245,158,11,0.7)]',
          iconBg: 'bg-amber-50 dark:bg-amber-950/60',
          iconBorder: 'border-amber-200 dark:border-amber-400/35',
          badge: {
            label: 'Top Growth',
            dotColor: 'bg-amber-500 dark:bg-[#F59E0B]',
            bgColor: 'bg-amber-50 dark:bg-amber-500/20',
            textColor: 'text-amber-700 dark:text-amber-300',
            borderColor: 'border-amber-200 dark:border-amber-400/40'
          },
          pillBg: 'bg-amber-50 dark:bg-amber-950/70',
          pillBorder: 'border-amber-200 dark:border-amber-500/40',
          pillText: 'text-amber-700 dark:text-amber-300',
          renderIcon: () => <AwsIcon className="w-4.5 h-4.5" />
        },
        {
          id: 'card-java',
          title: 'Java - Spring Boot',
          subtitle: 'Enterprise applications',
          growth: '+41%',
          cardBorder: 'border-purple-300/80 dark:border-[#EA580C]/75',
          cardGlow: 'shadow-none dark:shadow-[0_0_20px_-2px_rgba(249,115,22,0.45)]',
          cardHover: 'hover:border-purple-400 dark:hover:border-[#EA580C] hover:shadow-md dark:hover:shadow-[0_0_30px_rgba(249,115,22,0.7)]',
          iconBg: 'bg-purple-50 dark:bg-orange-950/60',
          iconBorder: 'border-purple-200 dark:border-orange-400/35',
          badge: {
            label: 'In Demand',
            dotColor: 'bg-purple-500 dark:bg-[#F97316]',
            bgColor: 'bg-purple-50 dark:bg-orange-500/20',
            textColor: 'text-purple-700 dark:text-orange-300',
            borderColor: 'border-purple-200 dark:border-orange-400/40'
          },
          pillBg: 'bg-purple-50 dark:bg-orange-950/70',
          pillBorder: 'border-purple-200 dark:border-orange-500/40',
          pillText: 'text-purple-700 dark:text-orange-300',
          renderIcon: () => <SpringIcon className="w-4.5 h-4.5" />
        },
        {
          id: 'card-node2',
          title: 'Node.js & APIs',
          subtitle: 'Microservices & Architecture',
          growth: '+60%',
          cardBorder: 'border-emerald-300/80 dark:border-[#10B981]/75',
          cardGlow: 'shadow-none dark:shadow-[0_0_20px_-2px_rgba(16,185,129,0.45)]',
          cardHover: 'hover:border-emerald-400 dark:hover:border-[#10B981] hover:shadow-md dark:hover:shadow-[0_0_30px_rgba(16,185,129,0.7)]',
          iconBg: 'bg-emerald-50 dark:bg-emerald-950/60',
          iconBorder: 'border-emerald-200 dark:border-emerald-400/35',
          badge: {
            label: 'Fast Growth',
            dotColor: 'bg-emerald-500 dark:bg-[#10B981]',
            bgColor: 'bg-emerald-50 dark:bg-emerald-500/20',
            textColor: 'text-emerald-700 dark:text-emerald-300',
            borderColor: 'border-emerald-200 dark:border-emerald-400/40'
          },
          pillBg: 'bg-emerald-50 dark:bg-emerald-950/70',
          pillBorder: 'border-emerald-200 dark:border-emerald-500/40',
          pillText: 'text-emerald-700 dark:text-emerald-300',
          renderIcon: () => <NodeIcon className="w-4.5 h-4.5" />
        },
        {
          id: 'card-docker',
          title: 'Docker',
          subtitle: 'Containerization & DevOps',
          growth: '+41%',
          cardBorder: 'border-sky-300/80 dark:border-[#0284C7]/75',
          cardGlow: 'shadow-none dark:shadow-[0_0_20px_-2px_rgba(14,165,233,0.45)]',
          cardHover: 'hover:border-sky-400 dark:hover:border-[#0284C7] hover:shadow-md dark:hover:shadow-[0_0_30px_rgba(14,165,233,0.7)]',
          iconBg: 'bg-sky-50 dark:bg-sky-950/60',
          iconBorder: 'border-sky-200 dark:border-sky-400/35',
          badge: {
            label: 'Always Needed',
            dotColor: 'bg-sky-500 dark:bg-[#38BDF8]',
            bgColor: 'bg-sky-50 dark:bg-sky-500/20',
            textColor: 'text-sky-700 dark:text-sky-300',
            borderColor: 'border-sky-200 dark:border-sky-400/40'
          },
          pillBg: 'bg-sky-50 dark:bg-sky-950/70',
          pillBorder: 'border-sky-200 dark:border-sky-500/40',
          pillText: 'text-sky-700 dark:text-sky-300',
          renderIcon: () => <DockerIcon className="w-4.5 h-4.5" />
        },
        {
          id: 'card-python',
          title: 'Python - SQL - React',
          subtitle: 'Data analysis & visualization',
          growth: '+72%',
          cardBorder: 'border-purple-300/80 dark:border-[#8B5CF6]/75',
          cardGlow: 'shadow-none dark:shadow-[0_0_20px_-2px_rgba(139,92,246,0.45)]',
          cardHover: 'hover:border-purple-400 dark:hover:border-[#8B5CF6] hover:shadow-md dark:hover:shadow-[0_0_30px_rgba(139,92,246,0.7)]',
          iconBg: 'bg-purple-50 dark:bg-purple-950/60',
          iconBorder: 'border-purple-200 dark:border-purple-400/35',
          badge: {
            label: 'Top Trending',
            dotColor: 'bg-purple-500 dark:bg-[#A855F7]',
            bgColor: 'bg-purple-50 dark:bg-purple-500/20',
            textColor: 'text-purple-700 dark:text-purple-300',
            borderColor: 'border-purple-200 dark:border-purple-400/40'
          },
          pillBg: 'bg-purple-50 dark:bg-purple-950/70',
          pillBorder: 'border-purple-200 dark:border-purple-500/40',
          pillText: 'text-purple-700 dark:text-purple-300',
          renderIcon: () => <PythonIcon className="w-4.5 h-4.5" />
        },
        {
          id: 'card-node',
          title: 'Node.js',
          subtitle: 'Backend development',
          growth: '+48%',
          cardBorder: 'border-emerald-300/80 dark:border-[#10B981]/75',
          cardGlow: 'shadow-none dark:shadow-[0_0_20px_-2px_rgba(16,185,129,0.45)]',
          cardHover: 'hover:border-emerald-400 dark:hover:border-[#10B981] hover:shadow-md dark:hover:shadow-[0_0_30px_rgba(16,185,129,0.7)]',
          iconBg: 'bg-emerald-50 dark:bg-emerald-950/60',
          iconBorder: 'border-emerald-200 dark:border-emerald-400/35',
          badge: {
            label: 'High Demand',
            dotColor: 'bg-emerald-500 dark:bg-[#10B981]',
            bgColor: 'bg-emerald-50 dark:bg-emerald-500/20',
            textColor: 'text-emerald-700 dark:text-emerald-300',
            borderColor: 'border-emerald-200 dark:border-emerald-400/40'
          },
          pillBg: 'bg-emerald-50 dark:bg-emerald-950/70',
          pillBorder: 'border-emerald-200 dark:border-emerald-500/40',
          pillText: 'text-emerald-700 dark:text-emerald-300',
          renderIcon: () => <NodeIcon className="w-4.5 h-4.5" />
        }
      ];

  const duplicatedCards = [...cards, ...cards, ...cards];

  return (
    <div 
      className="relative w-full overflow-hidden py-2.5 select-none z-20"
      aria-label={isAr ? "مؤشرات السوق والمهارات المطلوبة" : "Live Skills & Market Trends"}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
        maskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
      }}
    >
      {/* Seamless Edge Fades for natural scrolling transitions */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-36 z-10 bg-gradient-to-r from-white/95 dark:from-[#040816] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-36 z-10 bg-gradient-to-l from-white/95 dark:from-[#040816] to-transparent" />

      <div className="flex w-max">
        <motion.div
          className="flex items-center gap-3 sm:gap-3.5 shrink-0 py-1.5"
          animate={{
            x: isAr ? ['0%', '33.333%'] : ['0%', '-33.333%'],
          }}
          transition={{
            duration: isPaused ? 10000 : 38,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {duplicatedCards.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className={`flex items-center gap-2.5 sm:gap-3 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-[20px] min-w-[220px] sm:min-w-[245px] h-[64px] sm:h-[66px] border ${item.cardBorder} bg-white/95 dark:bg-gradient-to-r dark:from-[#040c1e]/95 dark:via-[#040c1e]/90 dark:to-[#040c1e]/75 backdrop-blur-2xl transition-all duration-300 shrink-0 cursor-default group ${item.cardGlow} ${item.cardHover}`}
            >
              {/* Technology Squircle Icon with matching theme border and background */}
              <div
                className={`flex h-9 w-9 sm:h-9.5 sm:w-9.5 shrink-0 items-center justify-center rounded-[13px] border ${item.iconBorder} ${item.iconBg} shadow-inner group-hover:scale-105 transition-transform duration-200`}
              >
                {item.renderIcon()}
              </div>

              {/* Card Content (Title, Badge, Subtitle, Metric) — WITHOUT arrows and WITHOUT white flares */}
              <div className="min-w-0 flex-1 flex flex-col justify-center h-full">
                
                {/* Top Row: Title + Badge */}
                <div className="flex items-center justify-between gap-1.5">
                  <h4 className="text-[11.5px] sm:text-[12px] font-bold text-slate-800 dark:text-white truncate leading-none">
                    {item.title}
                  </h4>

                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8.5px] sm:text-[9px] font-semibold border shrink-0 ${item.badge.bgColor} ${item.badge.textColor} ${item.badge.borderColor} leading-none`}
                  >
                    <span className={`h-1 w-1 rounded-full ${item.badge.dotColor} animate-pulse`} />
                    <span>{item.badge.label}</span>
                  </span>
                </div>

                {/* Middle Row: Subtitle */}
                <p className="text-[9.5px] sm:text-[10px] font-normal text-slate-500 dark:text-slate-400 truncate leading-none mt-1">
                  {item.subtitle}
                </p>

                {/* Bottom Row: Growth Metric Pill matching card theme color */}
                <div className="mt-1">
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[8.5px] sm:text-[9px] font-bold ${item.pillBg} ${item.pillBorder} ${item.pillText} leading-none`}>
                    <Users className="w-2.5 h-2.5" />
                    <span>{item.growth}</span>
                    <TrendingUp className="w-2.5 h-2.5" />
                  </span>
                </div>

              </div>

            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

