"use client";

import React from 'react';
import Link from 'next/link';
import { Send } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { isAr, t } = useLanguage();

  const footerColumns = isAr
    ? [
        {
          title: "المنصة",
          links: [
            { label: "الوظائف والفرص", href: "#features" },
            { label: "مؤشرات السوق", href: "#insights" },
            { label: "صانع السيرة الذاتية", href: "#how-it-works" },
            { label: "قصص النجاح", href: "#testimonials" }
          ]
        },
        {
          title: "عن المنصة",
          links: [
            { label: "من نحن", href: "#" },
            { label: "المنهجية ومصادر البيانات", href: "#" },
            { label: "فريق العمل", href: "#" },
            { label: "تواصل معنا", href: "#" }
          ]
        },
        {
          title: "الشروط والخصوصية",
          links: [
            { label: "سياسة الخصوصية", href: "#" },
            { label: "شروط الاستخدام", href: "#" },
            { label: "أمان البيانات", href: "#" }
          ]
        }
      ]
    : [
        {
          title: "Platform",
          links: [
            { label: "Jobs & Matching", href: "#features" },
            { label: "Market Insights", href: "#insights" },
            { label: "CV Builder", href: "#how-it-works" },
            { label: "Success Stories", href: "#testimonials" }
          ]
        },
        {
          title: "Company",
          links: [
            { label: "About Us", href: "#" },
            { label: "Data Methodology", href: "#" },
            { label: "Careers", href: "#" },
            { label: "Contact", href: "#" }
          ]
        },
        {
          title: "Legal",
          links: [
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Service", href: "#" },
            { label: "Data Security", href: "#" }
          ]
        }
      ];

  return (
    <footer className="w-full bg-white dark:bg-[#070B14] border-t border-slate-100/80 dark:border-white/5 pt-10 pb-6 px-6 sm:px-10 lg:px-16 text-slate-600 dark:text-slate-400 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-6 items-start">
          
          {/* 1. Brand Info Column */}
          <div className="lg:col-span-2 space-y-3 lg:ltr:pr-8 lg:rtl:pl-8 lg:ltr:border-r lg:rtl:border-l lg:border-slate-100 dark:lg:border-white/5">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <Logo size="md" />
            </Link>

            <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[280px]">
              {isAr 
                ? "منصة استخبارات سوق العمل والتطوير المهني الأولى في مصر، مبنية على لغة الأرقام والذكاء الاصطناعي."
                : "Egypt's leading career intelligence platform helping you make smarter career decisions with real data and AI."}
            </p>
          </div>

          {/* 2. Product, Company, Support Columns */}
          {footerColumns.map((col) => (
            <div key={col.title} className="space-y-3">
              <h4 className="text-[13.5px] font-bold text-slate-900 dark:text-white">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[12.5px] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* 3. Stay Updated Column */}
          <div className="space-y-3">
            <h4 className="text-[13.5px] font-bold text-slate-900 dark:text-white">
              {isAr ? "ابقَ على اطلاع" : "Stay Updated"}
            </h4>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-snug">
              {isAr ? "احصل على أحدث تقارير ومؤشرات سوق العمل المصري أسبوعياً." : "Get the latest career insights and Egyptian job market trends."}
            </p>
            
            {/* Email Input + Blue Send Button */}
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-1.5 pt-0.5">
              <input
                type="email"
                placeholder={isAr ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0D1322] text-[12px] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-600 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                aria-label="Submit email"
                className="h-9 w-9 shrink-0 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-sm shadow-blue-600/20 cursor-pointer"
              >
                <Send className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
              </button>
            </form>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1 text-slate-400">
              {/* LinkedIn */}
              <a 
                href="https://linkedin.com" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="flex items-center justify-center h-8 w-8 rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.04] text-slate-500 dark:text-slate-400 hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/30 hover:scale-110 transition-all duration-200 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a 
                href="https://facebook.com" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Facebook"
                className="flex items-center justify-center h-8 w-8 rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.04] text-slate-500 dark:text-slate-400 hover:text-[#1877F2] hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30 hover:scale-110 transition-all duration-200 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a 
                href="https://instagram.com" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="flex items-center justify-center h-8 w-8 rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.04] text-slate-500 dark:text-slate-400 hover:text-[#E1306C] hover:bg-[#E1306C]/10 hover:border-[#E1306C]/30 hover:scale-110 transition-all duration-200 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 pt-4 border-t border-slate-100/90 dark:border-white/5 text-center text-[12px] text-slate-400 dark:text-slate-500 font-medium">
          {t('footerRights')}
        </div>

      </div>
    </footer>
  );
}
