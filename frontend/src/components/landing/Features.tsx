"use client";

import React from 'react';
import { ArrowRight, CheckCircle2, BarChart3, FileText, Sparkles, LayoutGrid } from 'lucide-react';
import { CopilotPanel, CvPreviewPanel, SkillGapPanel } from './FeaturePanels';
import { featureCards } from '@/data/landing';

const panels = [SkillGapPanel, CvPreviewPanel, CopilotPanel];

const iconsMap: Record<string, React.ReactNode> = {
  bar: <BarChart3 className="w-5 h-5" />,
  file: <FileText className="w-5 h-5" />,
  sparkles: <Sparkles className="w-5 h-5" />
};

const tones: Record<string, { tile: string; bullet: string; link: string }> = {
  success: {
    tile: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/30',
    bullet: 'text-emerald-500 dark:text-emerald-400',
    link: 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300'
  },
  primary: {
    tile: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/30',
    bullet: 'text-blue-600 dark:text-blue-400',
    link: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
  },
  accent: {
    tile: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/30',
    bullet: 'text-indigo-500 dark:text-indigo-400',
    link: 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300'
  }
};

export function Features() {
  return (
    <section id="features" className="w-full bg-[#F8FAFC]/60 dark:bg-[#060913] py-16 px-6 sm:px-10 lg:px-16 border-t border-slate-100 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-[#4F46E5] dark:text-indigo-300 text-[12px] font-bold tracking-wider uppercase border border-indigo-100/80 dark:border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Powerful Features</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0F172A] dark:text-white leading-tight tracking-tight">
            Everything you need to <br className="hidden sm:inline" />
            build the <span className="text-[#4338CA] dark:text-[#818CF8]">right career</span>
          </h2>

          <p className="text-[15px] text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            MAJRA combines AI technology with real Egyptian market data to give you an{' '}
            <span className="font-semibold text-[#4338CA] dark:text-[#818CF8]">unfair advantage</span> in your career journey.
          </p>
        </div>

        {/* 3 Main Feature Cards */}
        <div className="mt-12 grid gap-7 lg:grid-cols-3">
          {featureCards.map((card, index) => {
            const Icon = iconsMap[card.icon] || <Sparkles className="w-5 h-5" />;
            const Panel = panels[index];
            const tone = tones[card.tone];

            return (
              <div
                key={card.title}
                className="flex flex-col rounded-[28px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 shadow-xl shadow-slate-200/50 dark:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.7),0_0_15px_rgba(99,102,241,0.06)] hover:shadow-2xl transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start gap-3.5">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tone.tile}`}>
                    {Icon}
                  </div>
                  <div>
                    <h3 className="text-[17px] font-bold text-slate-900 dark:text-white leading-snug">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-[12.5px] text-slate-500 dark:text-slate-400 leading-relaxed min-h-[36px]">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Interactive Inner Panel Preview */}
                <div className="mt-5 h-[255px]">
                  <Panel />
                </div>

                {/* Bullets */}
                <ul className="mt-5 flex flex-col gap-2">
                  {card.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 text-[13px] font-medium text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${tone.bullet}`} />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Footer Link */}
                <a
                  href="#onboarding"
                  className={`mt-auto inline-flex items-center gap-1.5 pt-5 text-[13.5px] font-bold transition-colors ${tone.link}`}
                >
                  <span>Learn more</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            );
          })}
        </div>

        {/* Explore All Features Button */}
        <div className="mt-10 flex justify-center">
          <a
            href="#features"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white text-[13.5px] font-bold shadow-sm hover:border-slate-300 dark:hover:border-white/20 transition-all"
          >
            <LayoutGrid className="w-4 h-4 text-[#4338CA] dark:text-[#818CF8]" />
            <span>Explore all features</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </a>
        </div>

      </div>
    </section>
  );
}
