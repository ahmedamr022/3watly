"use client";

import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Sun,
  Save
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';

export default function SettingsPage() {
  const { isAr } = useLanguage();
  const [jobAlerts, setJobAlerts] = useState(true);
  const [marketTrends, setMarketTrends] = useState(true);

  return (
    <AppShell
      title={isAr ? "إعدادات الحساب والتفضيلات" : "Account Settings & Preferences"}
      subtitle={isAr ? "التحكم في الإشعارات، التنبيهات، والخصوصية." : "Manage your notifications, alerts, and account preferences."}
    >
      <div className="space-y-6 max-w-[900px] mx-auto pb-10">
        
        {/* Profile Info Card */}
        <div className="rounded-[24px] border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 shadow-xs space-y-4">
          <h2 className="text-[16px] font-bold text-[#0B132B] dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <span>{isAr ? "معلومات الحساب" : "Account Profile"}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-slate-500 mb-1.5">{isAr ? "الاسم بالكامل" : "Full Name"}</label>
              <input
                type="text"
                defaultValue="Ahmed Sayed"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#070B14] text-[13.5px] text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-slate-500 mb-1.5">{isAr ? "البريد الإلكتروني" : "Email Address"}</label>
              <input
                type="email"
                defaultValue="ahmed.sayed@gmail.com"
                disabled
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04] text-[13.5px] text-slate-500 font-medium cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Notifications & Alerts */}
        <div className="rounded-[24px] border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 shadow-xs space-y-4">
          <h2 className="text-[16px] font-bold text-[#0B132B] dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            <span>{isAr ? "تفضيلات الإشعارات الذكية" : "Smart Notification Preferences"}</span>
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-white/[0.06]">
              <div>
                <p className="text-[13.5px] font-bold text-[#0B132B] dark:text-white">
                  {isAr ? "تنبيهات الوظائف الجديدة المطابقة (+75%)" : "High-Match Job Alerts (75%+)"}
                </p>
                <p className="text-[12px] text-slate-500">
                  {isAr ? "استلام إشعار فوري عند نشر وظائف جديدة تناسب مهاراتك." : "Receive instant notifications when matching jobs are posted."}
                </p>
              </div>
              <input
                type="checkbox"
                checked={jobAlerts}
                onChange={() => setJobAlerts(!jobAlerts)}
                className="h-5 w-5 rounded text-blue-600 accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-white/[0.06]">
              <div>
                <p className="text-[13.5px] font-bold text-[#0B132B] dark:text-white">
                  {isAr ? "تحديثات مؤشرات المهارات والرواتب الأسبوعية" : "Weekly Market Demand & Salary Digest"}
                </p>
                <p className="text-[12px] text-slate-500">
                  {isAr ? "ملخص أسبوعي بأكثر المهارات طلباً وتغيرات الرواتب في مصر." : "Weekly summary of top trending skills and salaries in Egypt."}
                </p>
              </div>
              <input
                type="checkbox"
                checked={marketTrends}
                onChange={() => setMarketTrends(!marketTrends)}
                className="h-5 w-5 rounded text-blue-600 accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Display & Language */}
        <div className="rounded-[24px] border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] p-6 shadow-xs flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-bold text-[#0B132B] dark:text-white">
              {isAr ? "اللغة والمظهر" : "Language & Appearance"}
            </h2>
            <p className="text-[12px] text-slate-500 mt-0.5">
              {isAr ? "التبديل بين العربية والإنجليزية والوضع الليلي/النهاري." : "Toggle language and light/dark theme modes."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

      </div>
    </AppShell>
  );
}
