"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Star, Upload, Brain, Target, Sparkles, Rocket } from 'lucide-react';
import { AnalyzePanel, PlanPanel, UploadPanel } from './StepPanels';
import { steps, testimonials } from '@/data/landing';

const panels = [UploadPanel, AnalyzePanel, PlanPanel];

const iconsMap: Record<string, React.ReactNode> = {
  upload: <Upload className="w-5 h-5 text-[#4338CA] dark:text-indigo-400" />,
  brain: <Brain className="w-5 h-5 text-[#4338CA] dark:text-indigo-400" />,
  target: <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-white dark:bg-[#060913] py-16 px-6 sm:px-10 lg:px-16 border-t border-slate-100 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-[#4F46E5] dark:text-indigo-300 text-[12px] font-bold tracking-wider uppercase border border-indigo-100/80 dark:border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simple. Smart. Personalized.</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0F172A] dark:text-white leading-tight tracking-tight">
            How <span className="text-[#4338CA] dark:text-[#818CF8]">MAJRA</span> Works
          </h2>

          <p className="text-[15px] text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Three simple steps to unlock your best career opportunities.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3 relative">
          {steps.map((step, index) => {
            const Panel = panels[index];
            const isLast = index === steps.length - 1;

            return (
              <div key={step.number} className="relative flex">
                
                {/* Number Badge */}
                <div
                  className={`absolute -top-5 left-1/2 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full text-[15px] font-black text-white ring-4 ring-white dark:ring-[#060913] shadow-md ${
                    isLast ? 'bg-emerald-500' : 'bg-[#4338CA]'
                  }`}
                >
                  {step.number}
                </div>

                {/* Arrow to next step on desktop */}
                {!isLast && (
                  <div
                    className="absolute -right-4 top-[42%] z-20 hidden h-8 w-8 items-center justify-center rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] shadow-md lg:flex"
                    aria-hidden="true"
                  >
                    <ArrowRight className="h-4 w-4 text-[#4338CA] dark:text-indigo-400" />
                  </div>
                )}

                {/* Step Card Container */}
                <div className="flex w-full flex-col rounded-[28px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 pt-9 shadow-xl shadow-slate-200/50 dark:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.7),0_0_15px_rgba(99,102,241,0.06)] hover:shadow-2xl transition-all">
                  
                  {/* Visual Preview */}
                  <div className="h-[210px]">
                    <Panel />
                  </div>

                  {/* Step Description */}
                  <div className="mt-5 flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isLast 
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-500/30' 
                          : 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-500/30'
                      }`}
                    >
                      {iconsMap[step.icon]}
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-slate-900 dark:text-white leading-snug">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed min-h-[38px]">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bottom Line */}
                  <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full ${isLast ? 'bg-emerald-500' : 'bg-[#4338CA] dark:bg-[#818CF8]'}`}
                      style={{ width: `${step.progress}%` }}
                    />
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* Bottom Banner (Fixed Shadow & Deep Indigo Accent)                         */}
        {/* ========================================================================= */}
        <div className="relative mt-12 overflow-hidden rounded-[26px] border border-slate-200/70 dark:border-white/[0.08] bg-[#F4F8FF] dark:bg-gradient-to-r dark:from-[#0B1224] dark:via-[#111C38] dark:to-[#09101E] px-6 py-6 sm:px-10 sm:py-6 shadow-xl shadow-slate-200/50 dark:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),0_0_20px_rgba(99,102,241,0.1)]">
          
          {/* Light Mode Rocket Background Image */}
          <div className="pointer-events-none absolute inset-0 select-none dark:hidden">
            <Image
              src="/images/rocket-banner-bg.png"
              alt="Rocket banner background"
              fill
              className="object-cover object-left opacity-90"
              priority
            />
          </div>

          {/* Dark Mode Glowing Rocket & Nebula Accent */}
          <div className="pointer-events-none absolute inset-0 select-none hidden dark:block">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center justify-center h-20 w-20 rounded-full bg-indigo-500/15 blur-md" />
            <Rocket className="absolute left-8 top-1/2 -translate-y-1/2 h-14 w-14 text-indigo-400/30 -rotate-45" />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-between gap-6 lg:flex-row pl-0 sm:pl-28 lg:pl-36">
            
            {/* Center Content */}
            <div className="text-center lg:text-left space-y-1">
              <h3 className="text-[19px] sm:text-[21px] font-black text-[#0F172A] dark:text-white tracking-tight leading-snug">
                Your best career move starts here.
              </h3>
              <p className="text-[13px] text-slate-600 dark:text-slate-400 font-medium">
                Join thousands of professionals growing with MAJRA.
              </p>
              
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                <div className="flex items-center -space-x-2">
                  {testimonials.map((person) => (
                    <img
                      key={person.name}
                      src={person.avatar}
                      alt=""
                      className="h-6 w-6 rounded-full border-2 border-white dark:border-[#0B1224] object-cover shadow-sm"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300">
                  Trusted by 15,000+ professionals
                </span>
              </div>
            </div>

            {/* Right Action Column */}
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#0052FF] hover:bg-[#0045D8] text-white text-[14px] font-bold shadow-lg shadow-blue-600/25 hover:-translate-y-0.5 transition-all"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>No credit card required</span>
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
