"use client";

import React, { useState } from 'react';
import { Settings, Shield, Database, Globe, Bell, Save, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { AdminGuard } from '@/components/admin/AdminGuard';

function SettingSection({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
        <Icon className="w-4 h-4 text-cyan-400" />
        <h2 className="text-[14px] font-bold text-white">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function SettingsContent() {
  const { isAr } = useLanguage();
  const { user, isOwner } = useAuth();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-400" />
          {isAr ? 'إعدادات الإدارة' : 'Admin Settings'}
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          {isAr ? 'إعدادات عامة للوحة تحكم الإدارة.' : 'General settings for the admin control panel.'}
        </p>
      </div>

      {/* Account Info */}
      <SettingSection title={isAr ? 'معلومات حسابك' : 'Your Account'} icon={Shield}>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-[13px] text-slate-400">{isAr ? 'الاسم' : 'Name'}</span>
            <span className="text-[13px] font-semibold text-white">{user?.fullName || '—'}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-[13px] text-slate-400">{isAr ? 'البريد الإلكتروني' : 'Email'}</span>
            <span className="text-[13px] font-semibold text-white">{user?.email || '—'}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-[13px] text-slate-400">{isAr ? 'الدور' : 'Role'}</span>
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-bold ${
              isOwner
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
            }`}>
              {isOwner ? (isAr ? 'المالك' : 'Owner') : (isAr ? 'مسؤول' : 'Admin')}
            </span>
          </div>
        </div>
      </SettingSection>

      {/* Platform Info */}
      <SettingSection title={isAr ? 'معلومات المنصة' : 'Platform Info'} icon={Globe}>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-[13px] text-slate-400">{isAr ? 'اسم المنصة' : 'Platform Name'}</span>
            <span className="text-[13px] font-semibold text-white">3watly — عواطلي</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-[13px] text-slate-400">{isAr ? 'الإصدار' : 'Version'}</span>
            <span className="text-[13px] font-semibold text-slate-400">Admin Studio v1.0</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-[13px] text-slate-400">{isAr ? 'قاعدة البيانات' : 'Database'}</span>
            <span className="flex items-center gap-1.5 text-[13px] font-semibold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Supabase
            </span>
          </div>
        </div>
      </SettingSection>

      {/* Security */}
      <SettingSection title={isAr ? 'الأمان' : 'Security'} icon={Shield}>
        <div className="space-y-3 text-[13px] text-slate-400">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{isAr ? 'حماية 3 طبقات: واجهة + API + RLS نشطة' : '3-layer protection: UI guard + API auth + RLS active'}</span>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{isAr ? 'جميع عمليات الإدارة مسجلة في سجل التدقيق' : 'All admin operations logged in audit log'}</span>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{isAr ? 'تغيير الأدوار محجوز للمالك فقط' : 'Role changes restricted to owner only'}</span>
          </div>
        </div>
      </SettingSection>

      {isOwner && (
        <SettingSection title={isAr ? 'إعدادات المالك' : 'Owner Settings'} icon={Shield}>
          <p className="text-sm text-slate-400">
            {isAr
              ? 'إعدادات إضافية خاصة بالمالك ستتوفر في الإصدارات القادمة.'
              : 'Additional owner-specific settings will be available in future releases.'}
          </p>
        </SettingSection>
      )}
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <AdminGuard>
      <SettingsContent />
    </AdminGuard>
  );
}
