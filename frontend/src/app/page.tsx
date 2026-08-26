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
  Briefcase,
  BarChart3,
  FileText,
  ChevronDown
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
  const [activeNav, setActiveNav] = useState("jobs");
  const [isScrolled, setIsScrolled] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const isClickScrollingRef = useRef(false);

  const navigationLinks = isAr
    ? [
        { label: "الوظائف والفرص", href: "#features", id: "jobs", icon: <Briefcase className="w-4 h-4 text-slate-500" /> },
        { label: "مؤشرات السوق", href: "#insights", id: "insights", icon: <BarChart3 className="w-4 h-4 text-slate-500" /> },
        { label: "صانع السيرة الذاتية", href: "/onboarding/career-path", id: "cv", icon: <FileText className="w-4 h-4 text-slate-500" /> },
      ]
    : [
        { label: "Jobs", href: "#features", id: "jobs", icon: <Briefcase className="w-4 h-4 text-slate-500" /> },
        { label: "Market Insights", href: "#insights", id: "insights", icon: <BarChart3 className="w-4 h-4 text-slate-500" /> },
        { label: "CV Builder", href: "/onboarding/career-path", id: "cv", icon: <FileText className="w-4 h-4 text-slate-500" /> },
      ];

  // Scroll detection & Section Tracking
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (isClickScrollingRef.current) return;

      const sections = [
        { id: "features", navId: "jobs" },
        { id: "insights", navId: "insights" },
        { id: "how-it-works", navId: "resources" }
      ];

      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveNav(section.navId);
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
      {/* Absolute top anchor */}
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

          {/* Navigation Links with Icons */}
          <nav className="hidden md:flex items-center gap-7 text-[14px] font-semibold text-slate-600 dark:text-slate-300">
            {navigationLinks.map((link) => {
              const isActive = activeNav === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center gap-2 py-2 transition-colors duration-200 ${
                    isActive ? "text-blue-600 dark:text-blue-400 font-bold" : "hover:text-blue-600 dark:hover:text-white"
                  }`}
                >
                  <span className="opacity-80">{link.icon}</span>
                  <span>{link.label}</span>
                </a>
              );
            })}

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className="flex items-center gap-1.5 py-2 hover:text-blue-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                <span>{isAr ? "المصادر" : "Resources"}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${resourcesOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {resourcesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute ltr:left-0 rtl:right-0 top-10 w-48 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0D1527] p-2 shadow-xl shadow-slate-200/50 dark:shadow-black/80 z-50"
                  >
                    <a
                      href="#how-it-works"
                      onClick={() => setResourcesOpen(false)}
                      className="block px-3 py-2 text-[13px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg"
                    >
                      {isAr ? "كيف تعمل المنصة" : "How It Works"}
                    </a>
                    <a
                      href="#testimonials"
                      onClick={() => setResourcesOpen(false)}
                      className="block px-3 py-2 text-[13px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg"
                    >
                      {isAr ? "قصص النجاح" : "Success Stories"}
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
              {isAr ? "تسجيل الدخول" : "Log In"}
            </Link>

            <Link 
              href="/signup" 
              className="px-4 sm:px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13.5px] font-bold shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              {isAr ? "أنشئ حسابك مجاناً" : "Sign Up Free"}
            </Link>
          </div>

        </div>
      </header>

      {/* Spacer for Fixed Header */}
      <div className="h-16 w-full" aria-hidden="true" />

      {/* ========================================================================= */}
      {/* 2. UNIFIED HERO AREA (Matching Uploaded Screenshot 1:1)                   */}
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
                  {isAr ? "ذكاء اصطناعي لتوجيه المسار المهني" : "AI-Powered Career Intelligence"}
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-[36px] sm:text-[46px] lg:text-[54px] font-black leading-[1.12] tracking-tight text-[#0F172A] dark:text-white"
              >
                {isAr ? (
                  <>
                    ابني <span className="bg-gradient-to-r from-[#1B57E0] via-[#0284C7] to-[#10B981] dark:from-[#3B82F6] dark:via-[#38BDF8] dark:to-[#34D399] bg-clip-text text-transparent drop-shadow-sm">مسارك المهني</span>،
                    <br />
                    مش مجرد سيرة ذاتية
                  </>
                ) : (
                  <>
                    Build a <span className="bg-gradient-to-r from-[#1B57E0] via-[#0284C7] to-[#10B981] dark:from-[#3B82F6] dark:via-[#38BDF8] dark:to-[#34D399] bg-clip-text text-transparent drop-shadow-sm">Career</span>,<br />
                    Not Just a Resume
                  </>
                )}
              </motion.h1>

              {/* Sub-headline */}
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[15px] sm:text-[17px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-[540px] font-normal"
              >
                {isAr ? (
                  <>
                    <span className="font-extrabold text-blue-600 dark:text-blue-400">عواطلي</span> بيحلل سوق العمل المصري، يحدد فجوات مهاراتك بدقة، ويطابق خبرتك مع أفضل الفرص المناسبة عشان تطور مسارك المهني بثقة.
                  </>
                ) : (
                  <>
                    <span className="font-extrabold text-blue-600 dark:text-blue-400">3WATLY</span> analyzes the Egyptian job market, identifies your skill gaps, and matches you with high-fit opportunities so you can grow with confidence.
                  </>
                )}
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
                  <span>{isAr ? "ابدأ الآن — مجاناً" : "Get Started — It's Free"}</span>
                  <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isAr ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
                </Link>

                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-bold text-[14.5px] transition-all backdrop-blur-sm"
                >
                  <div className="w-5 h-5 rounded-full border border-slate-400 dark:border-slate-500 flex items-center justify-center">
                    <Play className="w-2 h-2 text-slate-700 dark:text-slate-300 fill-slate-700 dark:fill-slate-300 ltr:ml-0.5 rtl:mr-0.5" />
                  </div>
                  <span>{isAr ? "شاهد كيف تعمل المنصة" : "See How It Works"}</span>
                </a>
              </motion.div>

              {/* 3 Trust Checkpoints */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 text-left rtl:text-right border-t border-slate-100 dark:border-white/[0.06] w-full"
              >
                <div className="flex items-start gap-2">
                  <div className="w-4.5 h-4.5 rounded-full border border-slate-400 dark:border-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 text-slate-600 dark:text-slate-300 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-[12.5px] font-bold text-[#1E293B] dark:text-white block leading-tight">
                      {isAr ? "مجاني 100%" : "100% Free"}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isAr ? "بدون أي كارت أو رسوم" : "No credit card required"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-slate-600 dark:text-slate-400 stroke-[1.75] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[12.5px] font-bold text-[#1E293B] dark:text-white block leading-tight">
                      {isAr ? "بياناتك في أمان" : "Your Data is Safe"}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isAr ? "مش بنشارك معلوماتك أبداً" : "We never share your info"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Sparkles className="w-4.5 h-4.5 text-slate-600 dark:text-slate-400 stroke-[1.75] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[12.5px] font-bold text-[#1E293B] dark:text-white block leading-tight">
                      {isAr ? "مطابقة ذكية" : "AI-Powered Matching"}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isAr ? "فرص تناسب مهاراتك الفعلية" : "Smarter opportunities"}
                    </span>
                  </div>
                </div>
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
