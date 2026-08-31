"use client";

import React from 'react';
import Link from 'next/link';
import { 
  User, 
  Briefcase, 
  MapPin, 
  GraduationCap, 
  FileText, 
  Zap, 
  ArrowRight, 
  CheckCircle2,
  Sparkles,
  Edit3
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { resolveDisplayName } from '@/utils/formatName';

export default function CareerPage() {
  const { isAr } = useLanguage();
  const { user, updateAvatar } = useAuth();
  const { role, parsedCv } = useOnboarding();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const resolvedName = resolveDisplayName({
    fullName: user?.fullName || parsedCv?.fullName,
    email: user?.email,
    isAr
  });

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateAvatar(file);
    }
  };

  const targetRoleName = user?.targetRole || (role ? String(role).replace(/-/g, ' ') : (isAr ? 'محلل بيانات' : 'Data Analyst'));

  const extractedSkills = parsedCv?.skills && parsedCv.skills.length > 0 
    ? parsedCv.skills.map((s: string) => ({ name: s, level: isAr ? "متوسط" : "Intermediate", verified: true }))
    : [
        { name: "SQL", level: isAr ? "متقدم" : "Advanced", verified: true },
        { name: "Python", level: isAr ? "متوسط" : "Intermediate", verified: true },
        { name: "Excel", level: isAr ? "متقدم" : "Advanced", verified: true },
        { name: "Power BI", level: isAr ? "متوسط" : "Intermediate", verified: true },
        { name: "Git", level: isAr ? "متوسط" : "Intermediate", verified: true }
      ];

  return (
    <AppShell
      title={isAr ? "ملفي المهني ومسار النمو" : "My Career Profile"}
      subtitle={isAr ? "إدارة مهاراتك، خبراتك، وأهدافك الوظيفية." : "Manage your verified skills, experience, and target career goals."}
    >
      <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
        
        {/* Hidden File Input for Avatar Upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleAvatarFile}
          accept="image/*"
          className="hidden"
        />

        {/* Profile Header Card */}
        <div className="rounded-[24px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative cursor-pointer group"
              title={isAr ? "تغيير الصورة الشخصية" : "Change Profile Photo"}
            >
              <UserAvatar
                avatarUrl={user?.avatarUrl}
                name={resolvedName}
                size="lg"
                className="shadow-md shadow-blue-600/20 group-hover:opacity-90 transition"
              />
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Edit3 className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[20px] font-black text-[#0B132B] dark:text-white">
                  {resolvedName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-[11px] font-bold">
                  {isAr ? "حساب موثق" : "Verified Profile"}
                </span>
              </div>
              <p className="text-[13.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                {targetRoleName}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[12px] text-slate-400 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {isAr ? "القاهرة، مصر" : "Cairo, Egypt"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{isAr ? `الهدف: ${targetRoleName}` : `Target: ${targetRoleName}`}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-blue-500 bg-white dark:bg-[#0B1120] text-slate-800 dark:text-slate-200 text-[13px] font-bold shadow-xs hover:bg-slate-50 dark:hover:bg-white/5 transition cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{isAr ? "تغيير الصورة" : "Change Photo"}</span>
            </button>

            <Link
              href="/settings"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold shadow-sm transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>{isAr ? "تعديل الملف بالكامل" : "Edit Full Profile"}</span>
            </Link>
          </div>
        </div>

        {/* 2-Column Grid: Verified Skills & Target Alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Skills Column (Span 7) */}
          <div className="lg:col-span-7 rounded-[24px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[#0B132B] dark:text-white">
                {isAr ? "المهارات المثبتة في ملفك" : "Verified Skills in Your Profile"}
              </h2>
              <Link
                href="/skills"
                className="text-[12.5px] font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <span>{isAr ? "إدارة المهارات" : "Manage Skills"}</span>
                <ArrowRight className={`w-3 h-3 ${isAr ? "rotate-180" : ""}`} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {extractedSkills.map((skill) => (
                <div 
                  key={skill.name}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50/60 dark:bg-[#0B1120]/[0.02]"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#12B76A]" />
                    <span className="text-[13px] font-bold text-[#0B132B] dark:text-white">
                      {skill.name}
                    </span>
                  </div>
                  <span className="text-[11.5px] font-medium text-slate-400">
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts (Span 5) */}
          <div className="lg:col-span-5 rounded-[24px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <h2 className="text-[16px] font-bold text-[#0B132B] dark:text-white">
                {isAr ? "الأدوات والتوصيات" : "Career Growth Tools"}
              </h2>
              <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-1">
                {isAr ? "أدوات مخصصة لتسريع وصولك للوظيفة المناسبة." : "Tailored tools to help you land high-fit roles faster."}
              </p>

              <div className="mt-4 space-y-2.5">
                <Link
                  href="/skills"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-[13px] font-bold text-[#0B132B] dark:text-white leading-tight">
                        {isAr ? "مصفوفة فجوة المهارات" : "Skill Gap Priority Matrix"}
                      </p>
                      <p className="text-[11.5px] text-slate-400">
                        {isAr ? "2 مهارة ناقصة (Power BI, Tableau)" : "2 missing skills (Power BI, Tableau)"}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 text-slate-400 ${isAr ? "rotate-180" : ""}`} />
                </Link>

                <Link
                  href="/cv-builder"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="text-[13px] font-bold text-[#0B132B] dark:text-white leading-tight">
                        {isAr ? "فاحص توافق الـ ATS" : "ATS Compatibility Report"}
                      </p>
                      <p className="text-[11.5px] text-slate-400">
                        {isAr ? "درجة التوافق الحالية: 87/100" : "Current ATS Score: 87/100"}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 text-slate-400 ${isAr ? "rotate-180" : ""}`} />
                </Link>
              </div>
            </div>

            <Link
              href="/copilot"
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-[13px] hover:bg-blue-100 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAr ? "استشارة المساعد الذكي" : "Ask AI Copilot for Advice"}</span>
            </Link>
          </div>

        </div>

      </div>
    </AppShell>
  );
}
