"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  BarChart3, 
  Building2, 
  MapPin, 
  DollarSign, 
  Search, 
  ArrowUpRight, 
  Briefcase,
  Zap,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MarketPage() {
  const { isAr } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'roles' | 'companies'>('overview');

  const topSkills = [
    { name: "SQL", demand: "81%", growth: "+18%", roles: "1,840 roles", category: "Database & Querying" },
    { name: "Python", demand: "74%", growth: "+24%", roles: "1,520 roles", category: "Programming" },
    { name: "Power BI", demand: "68%", growth: "+31%", roles: "1,390 roles", category: "BI & Visualization" },
    { name: "Excel (Advanced)", demand: "62%", growth: "+5%", roles: "1,210 roles", category: "Spreadsheets" },
    { name: "Tableau", demand: "46%", growth: "+12%", roles: "890 roles", category: "BI & Visualization" },
    { name: "ETL Pipelines", demand: "42%", growth: "+19%", roles: "760 roles", category: "Data Engineering" },
    { name: "AWS Cloud", demand: "38%", growth: "+28%", roles: "680 roles", category: "Cloud Infrastructure" },
    { name: "Machine Learning", demand: "34%", growth: "+22%", roles: "590 roles", category: "AI & ML" }
  ];

  return (
    <AppShell
      title={isAr ? "مؤشرات وتحليلات سوق العمل المصري" : "Egyptian Job Market Intelligence"}
      subtitle={isAr ? "بيانات حية ومحدثة من آلاف إعلانات الوظائف للشركات في مصر." : "Live real-time data analyzed from thousands of Egyptian tech job postings."}
    >
      <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
        
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-[20px] border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-5 shadow-xs">
            <span className="text-[12px] font-bold text-slate-500">{isAr ? "الوظائف المتاحة حالياً" : "Active Tech Jobs"}</span>
            <p className="text-[26px] font-black text-[#0B132B] dark:text-white mt-1">12,842</p>
            <span className="text-[11.5px] font-bold text-[#12B76A] mt-1 block">↑ +8.4% {isAr ? "هذا الشهر" : "this month"}</span>
          </div>

          <div className="rounded-[20px] border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-5 shadow-xs">
            <span className="text-[12px] font-bold text-slate-500">{isAr ? "متوسط الرواتب (Data)" : "Avg Data Salary"}</span>
            <p className="text-[26px] font-black text-[#0B132B] dark:text-white mt-1">28,500 <span className="text-sm font-bold text-slate-400">{isAr ? "ج.م" : "EGP"}</span></p>
            <span className="text-[11.5px] font-bold text-[#12B76A] mt-1 block">↑ +11.2% YoY</span>
          </div>

          <div className="rounded-[20px] border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-5 shadow-xs">
            <span className="text-[12px] font-bold text-slate-500">{isAr ? "المهارة الأكثر طلباً" : "Top In-Demand Skill"}</span>
            <p className="text-[26px] font-black text-blue-600 dark:text-blue-400 mt-1">SQL</p>
            <span className="text-[11.5px] font-medium text-slate-500 mt-1 block">{isAr ? "في 81% من الوظائف" : "In 81% of postings"}</span>
          </div>

          <div className="rounded-[20px] border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-5 shadow-xs">
            <span className="text-[12px] font-bold text-slate-500">{isAr ? "المهارة الأسرع نمواً" : "Fastest Growing"}</span>
            <p className="text-[26px] font-black text-[#12B76A] mt-1">Power BI</p>
            <span className="text-[11.5px] font-bold text-[#12B76A] mt-1 block">+31% {isAr ? "زيادة في الطلب" : "surge in demand"}</span>
          </div>
        </div>

        {/* Skills Intelligence Table */}
        <div className="rounded-[24px] border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-bold text-[#0B132B] dark:text-white">
                {isAr ? "ترتيب المهارات الأكثر طلباً في السوق المصري" : "In-Demand Skills Ranking (Egypt Market)"}
              </h2>
              <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                {isAr ? "بناءً على تحليل متطلبات الوظائف المنشورة خلال الـ 90 يوماً الماضية" : "Based on deep analysis of requirements across active job descriptions"}
              </p>
            </div>

            <Link
              href="/skills"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[12.5px] font-bold transition-all shadow-sm"
            >
              <span>{isAr ? "فحص فجوة مهاراتك" : "Check Your Skill Gap"}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/[0.06] text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">{isAr ? "المهارة" : "Skill"}</th>
                  <th className="py-3 px-4">{isAr ? "التصنيف" : "Category"}</th>
                  <th className="py-3 px-4">{isAr ? "نسبة الطلب" : "Market Demand"}</th>
                  <th className="py-3 px-4">{isAr ? "النمو" : "Growth (90d)"}</th>
                  <th className="py-3 px-4">{isAr ? "عدد الوظائف" : "Active Postings"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04] text-[13px]">
                {topSkills.map((skill, index) => (
                  <tr key={skill.name} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#0B132B] dark:text-white flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 dark:bg-white/5 text-[11px] font-bold text-slate-500">
                        {index + 1}
                      </span>
                      <span>{skill.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-medium">
                      {skill.category}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-blue-400">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-blue-600" 
                            style={{ width: skill.demand }} 
                          />
                        </div>
                        <span>{skill.demand}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#12B76A]">
                      {skill.growth}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-semibold">
                      {skill.roles}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
