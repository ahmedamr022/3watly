"use client";

import React, { useState } from 'react';
import { Settings, Shield, Globe, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { AdminGuard } from '@/components/admin/AdminGuard';

function SettingSection({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white/80 dark:bg-[#070C18]/90 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200/80 dark:border-white/8 bg-slate-50/50 dark:bg-white/2">
        <Icon className="w-4 h-4 text-cyan-500" />
        <h2 className="text-[14px] font-bold text-slate-900 dark:text-white">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function SettingsContent() {
  const { isAr } = useLanguage();
  const { user, isOwner } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-slate-500 dark:text-slate-400" />
          {isAr ? 'إعدادات المنصة والإدارة' : 'Admin & Platform Settings'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {isAr ? 'معلومات عامة حول حسابك وإعدادات الأمان وقاعدة البيانات.' : 'General system and security information.'}
        </p>
      </div>

      {/* Account Info */}
      <SettingSection title={isAr ? 'معلومات حسابك' : 'Your Account'} icon={Shield}>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5">
            <span className="text-[13px] text-slate-500 dark:text-slate-400">{isAr ? 'الاسم' : 'Name'}</span>
            <span className="text-[13px] font-bold text-slate-900 dark:text-white">{user?.fullName || '—'}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5">
            <span className="text-[13px] text-slate-500 dark:text-slate-400">{isAr ? 'البريد الإلكتروني' : 'Email'}</span>
            <span className="text-[13px] font-mono font-semibold text-slate-900 dark:text-white">{user?.email || '—'}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-[13px] text-slate-500 dark:text-slate-400">{isAr ? 'الدور والصلاحية' : 'Role & Permissions'}</span>
            <span className={`text-[11px] px-3 py-1 rounded-full border font-bold ${
              isOwner
                ? 'bg-amber-500/15 text-amber-500 dark:text-amber-400 border-amber-500/30'
                : 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
            }`}>
              {isOwner ? (isAr ? '👑 مالك المنصة (Owner)' : '👑 Platform Owner') : (isAr ? '🛡️ مسؤول (Admin)' : '🛡️ Admin')}
            </span>
          </div>
        </div>
      </SettingSection>

      {/* Platform Info */}
      <SettingSection title={isAr ? 'معلومات المنصة' : 'Platform Info'} icon={Globe}>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5">
            <span className="text-[13px] text-slate-500 dark:text-slate-400">{isAr ? 'اسم المنصة' : 'Platform Name'}</span>
            <span className="text-[13px] font-bold text-slate-900 dark:text-white">3watly — عواطلي</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5">
            <span className="text-[13px] text-slate-500 dark:text-slate-400">{isAr ? 'الإصدار' : 'Version'}</span>
            <span className="text-[12px] font-mono text-slate-600 dark:text-slate-400">Admin Studio v2.0</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-[13px] text-slate-500 dark:text-slate-400">{isAr ? 'قاعدة البيانات السحابية' : 'Cloud Database'}</span>
            <span className="flex items-center gap-1.5 text-[13px] font-bold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Supabase PostgreSQL
            </span>
          </div>
        </div>
      </SettingSection>

      {/* Security */}
      <SettingSection title={isAr ? 'الأمان وحماية البيانات' : 'Security & RBAC'} icon={Shield}>
        <div className="space-y-3 text-[13px]">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-500/8 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>{isAr ? 'حماية ثلاثية الطبقات: واجهة (Guard) + فحص سيرفر (API) + سياسات قاعدة بيانات (RLS) نشطة.' : '3-tier security active: UI Guard + API Authorization + PostgreSQL Row Level Security.'}</span>
          </div>
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-cyan-500/8 border border-cyan-500/20 text-cyan-700 dark:text-cyan-300">
            <Check className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
            <span>{isAr ? 'سجل العمليات الإدارية مفعل ومؤمّن ويسجل كافة التعديلات بدقة.' : 'Audit logging is active and recording all mutations.'}</span>
          </div>
        </div>
      </SettingSection>
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
