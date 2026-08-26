"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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

const navigationLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Market Insights", href: "#insights" },
  { label: "Success Stories", href: "#testimonials" }
];

export default function LandingPage() {
  const [activeNav, setActiveNav] = useState("Features");
  const [isScrolled, setIsScrolled] = useState(false);
  const isClickScrollingRef = useRef(false);

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
        { id: "features", label: "Features" },
        { id: "how-it-works", label: "How It Works" },
        { id: "insights", label: "Market Insights" },
        { id: "testimonials", label: "Success Stories" }
      ];

      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveNav(section.label);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (label: string) => {
    setActiveNav(label);
    isClickScrollingRef.current = true;
    setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 700);
  };

  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-[#060913] text-[#1E293B] dark:text-[#F8FAFC] flex flex-col font-sans selection:bg-[#4338CA] selection:text-white transition-colors duration-300">
      {/* Absolute top anchor for fail-safe smooth scroll target */}
      <div id="page-top" className="absolute top-0 left-0 h-0 w-0 pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. FIXED FLOATING NAVBAR (Real Sections Only, No Resources)               */}
      {/* ========================================================================= */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 border-none ${
          isScrolled
            ? "bg-white/90 dark:bg-[#060913]/90 backdrop-blur-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]"
            : "bg-white/40 dark:bg-transparent backdrop-blur-md"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          
          {/* Prominent Logo with Brand Icon */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image 
                src="/images/logo.png" 
                alt="MAJRA Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[23px] sm:text-[25px] font-black tracking-tight text-[#0F172A] dark:text-white leading-none">
                MAJRA
              </span>
              <span className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-400 tracking-wider uppercase mt-0.5">
                Career Intelligence
              </span>
            </div>
          </Link>

          {/* Navigation Links strictly for real sections on page */}
          <nav className="hidden md:flex items-center gap-8 text-[14px] font-semibold text-slate-600 dark:text-slate-300">
            {navigationLinks.map((link) => {
              const isActive = activeNav === link.label;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => handleNavClick(link.label)}
                  className={`relative py-2 transition-colors duration-200 ${
                    isActive ? "text-[#4338CA] dark:text-[#818CF8] font-bold" : "hover:text-[#4338CA] dark:hover:text-white"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeNavUnderline"
                      className="absolute -bottom-0.5 left-0 right-0 h-[2.5px] bg-[#4338CA] dark:bg-[#818CF8] rounded-full shadow-sm shadow-indigo-600/30"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />

            <Link 
              href="/login" 
              className="text-[14px] font-bold text-[#1E293B] dark:text-slate-300 hover:text-[#4338CA] dark:hover:text-white px-2.5 py-1.5 transition"
            >
              Log In
            </Link>

            <Link 
              href="/signup" 
              className="px-5 sm:px-6 py-2 rounded-xl bg-[#4338CA] hover:bg-[#3730A3] text-white text-[14px] font-bold shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              Sign Up Free
            </Link>
          </div>

        </div>
      </header>

      {/* Spacer for Fixed Header */}
      <div className="h-16 w-full" aria-hidden="true" />

      {/* ========================================================================= */}
      {/* 2. UNIFIED HERO AREA (Hero Grid + FeatureStrip + LogoCloud with Background) */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden px-4 pt-4 pb-8 sm:px-8 lg:px-12 lg:pt-6">
        {/* Full Section Background (Light & Dark) */}
        <HeroBackdrop />

        {/* A. Main Hero Grid */}
        <div className="relative z-10 mx-auto grid w-full max-w-[1440px] items-center gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8">
          
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-xl space-y-5"
          >
            {/* AI Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] dark:bg-indigo-950/70 text-[#4F46E5] dark:text-indigo-300 text-[13px] font-bold tracking-tight border border-indigo-100/90 dark:border-indigo-500/30 shadow-sm dark:shadow-[0_0_20px_rgba(99,102,241,0.15)]">
              <Sparkles className="w-3.5 h-3.5 text-[#4F46E5] dark:text-indigo-400" />
              <span>AI-Powered Career Intelligence</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-[2.75rem] sm:text-[3.5rem] lg:text-[48px] xl:text-[54px] font-black text-[#0B132B] dark:text-white leading-[1.08] tracking-[-0.035em]">
              Build a <span className="text-[#4338CA] dark:text-[#818CF8]">Career</span>,<br />
              Not Just a Resume
            </h1>

            {/* Description */}
            <p className="text-[16px] sm:text-[17px] text-[#475569] dark:text-slate-400 leading-[1.6] font-normal max-w-xl">
              MAJRA analyzes the Egyptian job market, identifies your skill gaps, and matches you with high-fit opportunities so you can grow with confidence.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#4338CA] hover:bg-[#3730A3] text-white font-bold text-[15px] shadow-lg shadow-indigo-600/25 dark:shadow-indigo-600/35 hover:-translate-y-0.5 transition-all"
              >
                <span>Get Started — It's Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/90 dark:bg-white/[0.04] hover:bg-white dark:hover:bg-white/[0.08] text-[#1E293B] dark:text-white font-bold text-[15px] border border-slate-200/90 dark:border-white/10 shadow-sm transition-all cursor-pointer"
              >
                <div className="w-4.5 h-4.5 rounded-full border border-slate-400 dark:border-slate-500 flex items-center justify-center">
                  <Play className="w-2 h-2 text-slate-700 dark:text-slate-300 fill-slate-700 dark:fill-slate-300 ml-0.5" />
                </div>
                <span>See How It Works</span>
              </button>
            </div>

            {/* 3 Trust Checkpoints */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 text-left border-t border-slate-100 dark:border-white/[0.06]">
              <div className="flex items-start gap-2">
                <div className="w-4.5 h-4.5 rounded-full border border-slate-400 dark:border-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-slate-600 dark:text-slate-300 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-[12.5px] font-bold text-[#1E293B] dark:text-white block leading-tight">100% Free</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">No credit card required</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-slate-600 dark:text-slate-400 stroke-[1.75] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[12.5px] font-bold text-[#1E293B] dark:text-white block leading-tight">Your Data is Safe</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">We never share your info</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Sparkles className="w-4.5 h-4.5 text-slate-600 dark:text-slate-400 stroke-[1.75] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[12.5px] font-bold text-[#1E293B] dark:text-white block leading-tight">AI-Powered Matching</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Smarter opportunities</span>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Right 3D Visual Cards */}
          <HeroVisual />

        </div>

        {/* B. 4-Card Feature Strip (Floating over Background) */}
        <div className="relative z-10 mt-8">
          <FeatureStrip />
        </div>

        {/* C. Trusted by Top Companies (Concentric Rings in Background) */}
        <div className="relative z-10 mt-4">
          <LogoCloud />
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3. SECTION 1: POWERFUL FEATURES                                           */}
      {/* ========================================================================= */}
      <Features />

      {/* ========================================================================= */}
      {/* 4. SECTION 2: HOW MAJRA WORKS (3 STEPS + ROCKET BANNER)                  */}
      {/* ========================================================================= */}
      <HowItWorks />

      {/* ========================================================================= */}
      {/* 5. SECTION 3: EXPLORE EGYPTIAN JOB MARKET (INSIGHTS & CHARTS)            */}
      {/* ========================================================================= */}
      <MarketInsights />

      {/* ========================================================================= */}
      {/* 6. SECTION 4: TESTIMONIALS (LOVED BY JOB SEEKERS)                        */}
      {/* ========================================================================= */}
      <Testimonials />

      {/* ========================================================================= */}
      {/* 7. SECTION 5: FINAL CTA CARD                                              */}
      {/* ========================================================================= */}
      <FinalCta />

      {/* ========================================================================= */}
      {/* 8. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <Footer />

      {/* ========================================================================= */}
      {/* 9. ANIMATED FLYING SCROLL TO TOP BUTTON                                   */}
      {/* ========================================================================= */}
      <ScrollToTop />

    </div>
  );
}
