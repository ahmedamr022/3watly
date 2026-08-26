"use client";

import React from 'react';
import { UserCheck, Quote } from 'lucide-react';
import { testimonials } from '@/data/landing';

export function Testimonials() {
  return (
    <section id="testimonials" className="w-full bg-white dark:bg-[#060913] pt-16 pb-10 px-6 sm:px-10 lg:px-16 border-t border-slate-100 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-[#4F46E5] dark:text-indigo-300 text-[11.5px] font-bold tracking-wider uppercase border border-indigo-100/80 dark:border-indigo-500/30">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Success Stories &amp; Reviews</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-[#0F172A] dark:text-white leading-tight tracking-tight">
            Real stories from <span className="text-[#4338CA] dark:text-[#818CF8]">ambitious professionals</span>
          </h2>
        </div>

        {/* 4 Testimonial Cards */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="flex flex-col rounded-[24px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-5 shadow-xl shadow-slate-200/50 dark:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.7),0_0_15px_rgba(99,102,241,0.06)] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <Quote className="h-5 w-5 text-[#4338CA] dark:text-indigo-400 fill-[#4338CA]/10 dark:fill-indigo-400/10" />

              <blockquote className="mt-3 text-[13px] leading-relaxed text-slate-600 dark:text-slate-300 font-medium flex-1">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <div className="mt-4 flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="h-9 w-9 shrink-0 rounded-full object-cover shadow-sm border border-slate-200 dark:border-white/10"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <span className="block truncate text-[13px] font-bold text-slate-900 dark:text-white leading-tight">
                    {testimonial.name}
                  </span>
                  <span className="block truncate text-[11px] text-slate-400 font-medium">
                    {testimonial.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
