"use client";

import React from 'react';
import { Briefcase, BarChart3, Brain, Target, Crown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function FeatureStrip() {
  const { isAr } = useLanguage();

  const stripItems = isAr
    ? [
        {
          title: 'مطابقة وظيفية دقيقة',
          description: 'وظائف تناسب مهاراتك وخبرتك',
          icon: <Briefcase className="h-5 w-5 text-white" />,
          isAiHighlight: false,
        },
        {
          title: 'بيانات سوق العمل المصري',
          description: 'أرقام وإحصائيات دقيقة وموثوقة',
          icon: <BarChart3 className="h-5 w-5 text-white" />,
          isAiHighlight: false,
        },
        {
          title: 'توصيات مخصصة بالذكاء الاصطناعي',
          description: 'خطة تطوير تناسب أهدافك وسوق العمل',
          icon: <Brain className="h-5 w-5 text-[#00F5A0]" />,
          isAiHighlight: true,
        },
        {
          title: 'تحليل فجوات المهارات',
          description: 'أعرف اي اللي ناقص بالضبط لتتقدم',
          icon: <Target className="h-5 w-5 text-white" />,
          isAiHighlight: false,
        },
        {
          title: 'متابعة ذكية ومتكاملة',
          description: 'كل ما تحتاجه في مكان واحد',
          icon: <Crown className="h-5 w-5 text-white" />,
          isAiHighlight: false,
        },
      ]
    : [
        {
          title: 'Accurate Job Matching',
          description: 'Jobs matching your skills & experience',
          icon: <Briefcase className="h-5 w-5 text-white" />,
          isAiHighlight: false,
        },
        {
          title: 'Egyptian Market Data',
          description: 'Accurate, trusted numbers & metrics',
          icon: <BarChart3 className="h-5 w-5 text-white" />,
          isAiHighlight: false,
        },
        {
          title: 'Personalized AI Guidance',
          description: 'Tailored growth plans for your goals',
          icon: <Brain className="h-5 w-5 text-[#00F5A0]" />,
          isAiHighlight: true,
        },
        {
          title: 'Skill Gap Diagnostics',
          description: 'Know exactly what skills to learn next',
          icon: <Target className="h-5 w-5 text-white" />,
          isAiHighlight: false,
        },
        {
          title: 'All-in-One Dashboard',
          description: 'Everything you need in one place',
          icon: <Crown className="h-5 w-5 text-white" />,
          isAiHighlight: false,
        },
      ];

  return (
    <div className="w-full relative">
      <div className="mx-auto max-w-[1440px] xl:max-w-[1480px] relative">
        {/* Soft atmospheric ambient glow beneath the capsule */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400/20 via-cyan-400/25 to-blue-400/20 dark:from-[#0066FF]/15 dark:via-[#00D2FF]/20 dark:to-[#0066FF]/15 blur-xl opacity-75 pointer-events-none -z-10" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3 lg:gap-2 xl:gap-3 rounded-[26px] sm:rounded-full border border-slate-200/90 dark:border-[#00D2FF]/25 bg-white/90 dark:bg-[#030718]/65 backdrop-blur-2xl px-4 sm:px-6 py-3.5 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.06),0_0_25px_rgba(0,120,255,0.07)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(0,100,255,0.2)]">
          {stripItems.map((item) => (
            <div 
              key={item.title} 
              className="flex items-center gap-3 p-1.5 sm:p-2 rounded-2xl hover:bg-slate-100/70 dark:hover:bg-white/[0.04] transition-colors duration-200 group cursor-default"
            >
              {/* Vibrant Squircle Icon Pill */}
              <div 
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] transition-transform duration-300 group-hover:scale-105 ${
                  item.isAiHighlight
                    ? 'bg-emerald-50 dark:bg-[#005A50] border border-emerald-300 dark:border-[#00F5A0]/60 shadow-[0_0_15px_rgba(16,185,129,0.2)] dark:shadow-[0_0_18px_rgba(0,245,160,0.35)] text-emerald-600 dark:text-[#00F5A0]'
                    : 'bg-blue-600 dark:bg-[#003FA6] border border-blue-500/80 dark:border-[#0066FF]/50 shadow-[0_0_15px_rgba(37,99,235,0.25)] dark:shadow-[0_0_15px_rgba(0,102,255,0.35)] text-white'
                }`}
              >
                {item.icon}
              </div>

              {/* Text Container - Single line title and crisp subtitle */}
              <div className="min-w-0 flex-1 text-right">
                <h4 className="text-[12px] sm:text-[12.5px] xl:text-[13.5px] font-bold text-slate-900 dark:text-white leading-tight whitespace-nowrap">
                  {item.title}
                </h4>
                <p className="text-[10.5px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-300/80 mt-1 leading-tight whitespace-nowrap">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
