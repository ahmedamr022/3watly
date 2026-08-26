"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  Play, 
  Check, 
  ShieldCheck,
  Layers,
  Sparkle,
  TrendingUp,
  MessageSquare
} from "lucide-react";
import { HeroBackdrop } from "@/components/landing/HeroBackdrop";
import { HeroVisual } from "@/components/landing/HeroVisual";
import { FeatureStrip } from "@/components/landing/FeatureStrip";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { MarketInsights } from "@/components/landing/MarketInsights";
import { Testimonials } from "@/components/landing/Testimonials";
import { LogoCloud } from "@/components/landing/LogoCloud";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { Logo } from "@/components/brand/Logo";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LandingPage() {
  const { isAr, t } = useLanguage();
  const [activeNav, setActiveNav] = useState("features");
  const [isScrolled, setIsScrolled] = useState(false);
  const isClickScrollingRef = useRef(false);

  const navigationLinks = isAr
    ? [
        { label: "المميزات", href: "#features", id: "features" },
        { label: "كيف تعمل المنصة", href: "#how-it-works", id: "how-it-works" },
        { label: "مؤشرات السوق", href: "#insights", id: "insights" },
        { label: "قصص النجاح", href: "#testimonials", id: "testimonials" }
      ]
    : [
        { label: "Features", href: "#features", id: "features" },
        { label: "How It Works", href: "#how-it-works", id: "how-it-works" },
        { label: "Market Insights", href: "#insights", id: "insights" },
        { label: "Success Stories", href: "#testimonials", id: "testimonials" }
      ];

  // Scroll detection & Accurate Section Tracking
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (isClickScrollingRef.current) return;

      const sections = [
        { id: "features" },
        { id: "how-it-works" },
        { id: "insights" },
        { id: "testimonials" }
      ];

      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveNav(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    isClickScrollingRef.current = true;
    setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 700);
  };

  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-[#060913] text-[#1E293B] dark:text-[#F8FAFC] flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-colors duration-300">
      {/* Absolute top anchor for fail-safe smooth scroll target */}
      <div id="page-top" className="absolute top-0 left-0 h-0 w-0 pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. FIXED FLOATING NAVBAR                                                 */}
      {/* ========================================================================= */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 border-none ${
          isScrolled
            ? "bg-white/90 dark:bg-[#060913]/90 backdrop-blur-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]"
            : "bg-white/40 dark:bg-transparent backdrop-blur-md"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          
          {/* Brand Logo with 3D Mark and Dynamic Text */}
          <Link href="/" className="transition-transform duration-200 hover:scale-105">
            <Logo size="md" />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[14px] font-semibold text-slate-600 dark:text-slate-300">
            {navigationLinks.map((link) => {
              const isActive = activeNav === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-2 transition-colors duration-200 ${
                    isActive ? "text-blue-600 dark:text-blue-400 font-bold" : "hover:text-blue-600 dark:hover:text-white"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeNavUnderline"
                      className="absolute -bottom-0.5 left-0 right-0 h-[2.5px] bg-blue-600 dark:bg-blue-400 rounded-full shadow-sm shadow-blue-600/30"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Controls: Language Toggle + Theme Toggle + Log In + Sign Up */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Language Switcher */}
            <LanguageToggle />

            {/* Dark / Light Mode Switcher */}
            <ThemeToggle />

            <Link 
              href="/login" 
              className="text-[14px] font-bold text-[#1E293B] dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 px-2 py-1.5 transition-colors"
            >
              {t('navLogin')}
            </Link>

            <Link 
              href="/signup" 
              className="px-4 sm:px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13.5px] font-bold shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              {t('navSignUp')}
            </Link>
          </div>

        </div>
      </header>

      {/* Spacer for Fixed Header */}
      <div className="h-16 w-full" aria-hidden="true" />

      {/* ========================================================================= */}
      {/* 2. UNIFIED HERO AREA                                                     */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden px-4 pt-4 pb-8 sm:px-8 lg:px-12 lg:pt-6">
        {/* Full Section Background */}
        <HeroBackdrop />

        <div className="max-w-[1400px] mx-auto relative z-10">
          
          {/* Main Hero 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center pt-6 lg:pt-10 pb-8">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 flex flex-col items-start space-y-6">
              
              {/* Pill Badge */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200/80 dark:border-blue-500/30 bg-blue-50/80 dark:bg-blue-950/60 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="text-[12.5px] font-bold text-blue-700 dark:text-blue-300">
                  {t('heroBadge')}
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-[36px] sm:text-[46px] lg:text-[52px] font-black leading-[1.12] tracking-tight text-[#0F172A] dark:text-white"
              >
                {t('heroTitle1')}{" "}
                <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#1B57E0] via-[#0284C7] to-[#10B981] dark:from-[#3B82F6] dark:via-[#38BDF8] dark:to-[#34D399] bg-clip-text text-transparent drop-shadow-sm">
                  {t('heroTitle2')}
                </span>
              </motion.h1>

              {/* Sub-headline */}
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[15px] sm:text-[17px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-[540px] font-normal"
              >
                {t('heroDesc')}
              </motion.p>

              {/* CTA Buttons Row */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-3.5 pt-2 w-full sm:w-auto"
              >
                <Link
                  href="/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-[15px] shadow-lg shadow-blue-600/30 hover:shadow-blue-600/45 hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <span>{t('heroCtaPrimary')}</span>
                  <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isAr ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
                </Link>

                <a
                  href="#insights"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-bold text-[14.5px] transition-all backdrop-blur-sm"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span>{t('heroCtaSecondary')}</span>
                </a>
              </motion.div>

              {/* Trust Badge */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 pt-2 text-[12.5px] text-slate-500 dark:text-slate-400 font-medium"
              >
                <div className="flex -space-x-1.5 rtl:space-x-reverse">
                  <div className="w-7 h-7 rounded-full bg-blue-500 border-2 border-white dark:border-[#060913] flex items-center justify-center text-[10px] text-white font-bold">A</div>
                  <div className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-white dark:border-[#060913] flex items-center justify-center text-[10px] text-white font-bold">M</div>
                  <div className="w-7 h-7 rounded-full bg-purple-500 border-2 border-white dark:border-[#060913] flex items-center justify-center text-[10px] text-white font-bold">S</div>
                </div>
                <span>{t('heroTrust')}</span>
              </motion.div>

            </div>

            {/* Right Visual Column */}
            <div className="lg:col-span-6 w-full flex justify-center items-center">
              <HeroVisual />
            </div>

          </div>

          {/* Key Metrics Feature Strip */}
          <div className="mt-8 mb-4">
            <FeatureStrip />
          </div>

          {/* Trusted Companies Logo Cloud */}
          <div className="mt-6">
            <LogoCloud />
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CORE FEATURES SECTION                                                 */}
      {/* ========================================================================= */}
      <section id="features" className="w-full py-16 scroll-mt-20">
        <Features />
      </section>

      {/* ========================================================================= */}
      {/* 4. HOW IT WORKS SECTION                                                  */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="w-full py-16 bg-slate-50/50 dark:bg-[#070B14]/50 scroll-mt-20 border-y border-slate-100 dark:border-white/5">
        <HowItWorks />
      </section>

      {/* ========================================================================= */}
      {/* 5. LIVE MARKET INSIGHTS SECTION                                          */}
      {/* ========================================================================= */}
      <section id="insights" className="w-full py-16 scroll-mt-20">
        <MarketInsights />
      </section>

      {/* ========================================================================= */}
      {/* 6. SUCCESS STORIES / TESTIMONIALS SECTION                                */}
      {/* ========================================================================= */}
      <section id="testimonials" className="w-full py-16 bg-slate-50/50 dark:bg-[#070B14]/50 scroll-mt-20 border-y border-slate-100 dark:border-white/5">
        <Testimonials />
      </section>

      {/* ========================================================================= */}
      {/* 7. FINAL CALL TO ACTION (CTA)                                            */}
      {/* ========================================================================= */}
      <section className="w-full py-16">
        <FinalCta />
      </section>

      {/* ========================================================================= */}
      {/* 8. FOOTER                                                                */}
      {/* ========================================================================= */}
      <Footer />

      {/* Floating Scroll To Top Button */}
      <ScrollToTop />

    </div>
  );
}
