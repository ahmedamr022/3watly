"use client";

import React from 'react';
import { PlusIcon, ExternalLinkIcon } from 'lucide-react';
import { useCV } from '../../../contexts/CVContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { uid } from '../../../utils/cvHelpers';
import type { CertificationItem } from '../../../types/cv';
import { ItemShell } from '../ItemShell';

export function CertificationsSection() {
  const { cv, update } = useCV();
  const { isAr } = useLanguage();
  const certs = cv.certifications || [];

  const add = () => {
    update(
      (prev) => ({
        ...prev,
        certifications: [
          ...(prev.certifications || []),
          { id: uid('cert'), name: '', issuer: '', url: '', date: '' },
        ],
      }),
      'cert-add'
    );
  };

  const remove = (id: string) => {
    update(
      (prev) => ({
        ...prev,
        certifications: (prev.certifications || []).filter((c) => c.id !== id),
      }),
      'cert-remove'
    );
  };

  const patch = (id: string, changes: Partial<CertificationItem>) => {
    update(
      (prev) => ({
        ...prev,
        certifications: (prev.certifications || []).map((c) =>
          c.id === id ? { ...c, ...changes } : c
        ),
      }),
      'cert-edit'
    );
  };

  return (
    <div className="space-y-3 px-4 pb-4">
      {certs.length === 0 && (
        <p className="text-[12.5px] text-slate-500 dark:text-slate-400 italic py-2">
          {isAr ? "لم تتم إضافة أي شهادات حتى الآن. أضف واحدة بالأسفل." : "No certifications added yet. Add one below."}
        </p>
      )}

      {certs.map((cert) => (
        <ItemShell
          key={cert.id}
          onDelete={() => remove(cert.id)}
          label={cert.name || (isAr ? "شهادة جديدة" : "New Certification")}
        >
          {/* Certificate Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {isAr ? "اسم الشهادة أو الدورة *" : "Certificate Name *"}
            </label>
            <input
              type="text"
              value={cert.name}
              onChange={(e) => patch(cert.id, { name: e.target.value })}
              placeholder={isAr ? "مثال: Google Data Analytics Certificate" : "e.g. Google Data Analytics Certificate"}
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070C18] px-3 py-2 text-[12.5px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Issuer */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {isAr ? "الجهة المصدرة / المنصة" : "Issuer / Platform"}
            </label>
            <input
              type="text"
              value={cert.issuer}
              onChange={(e) => patch(cert.id, { issuer: e.target.value })}
              placeholder={isAr ? "مثال: Coursera, Udemy, IBM, Google" : "e.g. Coursera, Udemy, IBM, Google"}
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070C18] px-3 py-2 text-[12.5px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Date + URL row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                {isAr ? "تاريخ الحصول عليها" : "Date"}
              </label>
              <input
                type="text"
                value={cert.date || ''}
                onChange={(e) => patch(cert.id, { date: e.target.value })}
                placeholder={isAr ? "مثال: Jun 2024" : "e.g. Jun 2024"}
                className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070C18] px-3 py-2 text-[12.5px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                <ExternalLinkIcon className="w-3 h-3" />
                {isAr ? "رابط التحقق (URL)" : "Verify URL"}
              </label>
              <input
                type="url"
                value={cert.url || ''}
                onChange={(e) => patch(cert.id, { url: e.target.value })}
                placeholder="https://credential.net/..."
                className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070C18] px-3 py-2 text-[12.5px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>
        </ItemShell>
      ))}

      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 dark:border-white/15 px-3 py-2 text-[12px] font-semibold text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
      >
        <PlusIcon className="h-3.5 w-3.5" />
        {isAr ? "إضافة شهادة جديدة" : "Add Certification"}
      </button>
    </div>
  );
}
