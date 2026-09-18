"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen, Plus, Search, Edit2, Trash2, ToggleLeft, ToggleRight,
  RefreshCw, AlertTriangle, X, Check, PlayCircle, Code2, ExternalLink,
  GraduationCap, FileText,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Resource {
  id: string;
  skill_key: string;
  title: string;
  title_ar: string | null;
  provider: string;
  provider_icon: string | null;
  kind: string;
  url: string;
  duration_hours: number | null;
  is_free: boolean;
  language: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

const KIND_OPTIONS = ['video', 'article', 'course', 'repo', 'practice', 'book', 'other'];
const LANG_OPTIONS = ['en', 'ar', 'both'];

const PROVIDER_ICONS: Record<string, React.ElementType> = {
  youtube: PlayCircle,
  github: Code2,
  coursera: GraduationCap,
  udemy: GraduationCap,
  article: FileText,
  other: ExternalLink,
};

const KIND_COLORS: Record<string, string> = {
  video: 'bg-red-500/10 text-red-400 border-red-500/20',
  course: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  repo: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  article: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  practice: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  book: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  other: 'bg-slate-600/10 text-slate-400 border-slate-600/20',
};

const EMPTY_FORM = {
  skill_key: '',
  title: '',
  title_ar: '',
  provider: '',
  provider_icon: '',
  kind: 'video',
  url: '',
  duration_hours: '',
  is_free: true,
  language: 'en',
  display_order: 0,
  is_active: true,
};

type FormState = typeof EMPTY_FORM;

function ProviderIcon({ provider }: { provider: string }) {
  const key = provider.toLowerCase();
  const Icon = PROVIDER_ICONS[key] ?? ExternalLink;
  return <Icon className="w-3.5 h-3.5" />;
}

interface ResourceModalProps {
  initial?: Partial<Resource> | null;
  onClose: () => void;
  onSave: () => void;
  isAr: boolean;
}

function ResourceModal({ initial, onClose, onSave, isAr }: ResourceModalProps) {
  const [form, setForm] = useState<FormState>({
    ...EMPTY_FORM,
    ...(initial
      ? {
          skill_key: initial.skill_key ?? '',
          title: initial.title ?? '',
          title_ar: initial.title_ar ?? '',
          provider: initial.provider ?? '',
          provider_icon: initial.provider_icon ?? '',
          kind: initial.kind ?? 'video',
          url: initial.url ?? '',
          is_free: initial.is_free ?? true,
          language: initial.language ?? 'en',
          display_order: initial.display_order ?? 0,
          is_active: initial.is_active ?? true,
        }
      : {}),
    duration_hours: initial?.duration_hours != null ? String(initial.duration_hours) : '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!initial?.id;

  const set = (key: keyof FormState, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...(isEdit ? { id: initial!.id } : {}),
        ...form,
        duration_hours: form.duration_hours ? parseFloat(String(form.duration_hours)) : null,
      };
      const res = await fetch('/api/admin/resources', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed'); return; }
      onSave();
      onClose();
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-[#0B1120] border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <h2 className="text-[15px] font-bold text-white">
            {isEdit
              ? (isAr ? 'تعديل المصدر' : 'Edit Resource')
              : (isAr ? 'إضافة مصدر جديد' : 'Add New Resource')}
          </h2>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                {isAr ? 'مفتاح المهارة *' : 'Skill Key *'}
              </label>
              <input
                required
                value={form.skill_key}
                onChange={(e) => set('skill_key', e.target.value)}
                placeholder="e.g. python, sql, react"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                {isAr ? 'العنوان (إنجليزي) *' : 'Title (English) *'}
              </label>
              <input
                required
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                {isAr ? 'العنوان (عربي)' : 'Title (Arabic)'}
              </label>
              <input
                value={form.title_ar}
                onChange={(e) => set('title_ar', e.target.value)}
                dir="rtl"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                {isAr ? 'المزود *' : 'Provider *'}
              </label>
              <input
                required
                value={form.provider}
                onChange={(e) => set('provider', e.target.value)}
                placeholder="YouTube, Coursera, GitHub..."
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                {isAr ? 'أيقونة المزود' : 'Provider Icon'}
              </label>
              <input
                value={form.provider_icon}
                onChange={(e) => set('provider_icon', e.target.value)}
                placeholder="URL or icon name"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                {isAr ? 'النوع' : 'Kind'}
              </label>
              <select
                value={form.kind}
                onChange={(e) => set('kind', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                {KIND_OPTIONS.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                {isAr ? 'اللغة' : 'Language'}
              </label>
              <select
                value={form.language}
                onChange={(e) => set('language', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                {LANG_OPTIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                {isAr ? 'الرابط *' : 'URL *'}
              </label>
              <input
                required
                type="url"
                value={form.url}
                onChange={(e) => set('url', e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                {isAr ? 'المدة (بالساعات)' : 'Duration (hours)'}
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={form.duration_hours}
                onChange={(e) => set('duration_hours', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                {isAr ? 'ترتيب العرض' : 'Display Order'}
              </label>
              <input
                type="number"
                min="0"
                value={form.display_order}
                onChange={(e) => set('display_order', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => set('is_free', !form.is_free)}
                className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer border ${form.is_free ? 'bg-emerald-500/30 border-emerald-500/40' : 'bg-white/8 border-white/15'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${form.is_free ? 'start-5 bg-emerald-400' : 'start-0.5 bg-slate-500'}`} />
              </button>
              <span className="text-[12px] text-slate-300">
                {isAr ? (form.is_free ? 'مجاني' : 'مدفوع') : (form.is_free ? 'Free' : 'Paid')}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => set('is_active', !form.is_active)}
                className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer border ${form.is_active ? 'bg-cyan-500/30 border-cyan-500/40' : 'bg-white/8 border-white/15'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${form.is_active ? 'start-5 bg-cyan-400' : 'start-0.5 bg-slate-500'}`} />
              </button>
              <span className="text-[12px] text-slate-300">
                {isAr ? (form.is_active ? 'نشط' : 'معطل') : (form.is_active ? 'Active' : 'Inactive')}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-slate-400 hover:bg-white/5 cursor-pointer transition-colors"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50 cursor-pointer transition-opacity flex items-center justify-center gap-2"
            >
              {saving ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              {isAr ? (isEdit ? 'حفظ التعديلات' : 'إضافة') : (isEdit ? 'Save Changes' : 'Add Resource')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminResourcesPage() {
  const { isAr } = useLanguage();
  const [resources, setResources] = useState<Resource[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [kindFilter, setKindFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editResource, setEditResource] = useState<Resource | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        ...(search ? { search } : {}),
        ...(kindFilter ? { kind: kindFilter } : {}),
      });
      const res = await fetch(`/api/admin/resources?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResources(data.resources ?? []);
      setTotal(data.total ?? 0);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [search, kindFilter]);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  const handleToggleActive = async (resource: Resource) => {
    try {
      await fetch('/api/admin/resources', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: resource.id, is_active: !resource.is_active }),
      });
      await fetchResources();
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isAr ? 'هل تريد حذف هذا المصدر؟' : 'Delete this resource?')) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/resources?id=${id}`, { method: 'DELETE' });
      await fetchResources();
    } catch {}
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            {isAr ? 'المصادر التعليمية' : 'Learning Resources'}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {isAr ? `${total.toLocaleString()} مصدر` : `${total.toLocaleString()} resources`}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <button
            type="button"
            onClick={fetchResources}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => { setEditResource(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-sm font-bold text-white hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {isAr ? 'إضافة مصدر' : 'Add Resource'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder={isAr ? 'بحث في المصادر...' : 'Search resources...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full ps-9 pe-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
        <select
          value={kindFilter}
          onChange={(e) => setKindFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
        >
          <option value="">{isAr ? 'كل الأنواع' : 'All Kinds'}</option>
          {KIND_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />{error}
        </div>
      )}

      {/* Resources Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-36 rounded-2xl bg-white/5 animate-pulse border border-white/8" />
            ))
          : resources.length === 0
          ? (
            <div className="col-span-full py-16 text-center text-slate-500">
              <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">{isAr ? 'لا توجد مصادر حتى الآن.' : 'No resources yet.'}</p>
              <button
                type="button"
                onClick={() => { setEditResource(null); setModalOpen(true); }}
                className="mt-4 text-cyan-400 text-sm hover:underline cursor-pointer"
              >
                {isAr ? '+ أضف أول مصدر' : '+ Add first resource'}
              </button>
            </div>
          )
          : resources.map((r) => (
            <div
              key={r.id}
              className={`relative flex flex-col gap-3 p-4 rounded-2xl border transition-all duration-200 hover:scale-[1.01] ${r.is_active ? 'bg-white/3 border-white/8' : 'bg-white/1 border-white/5 opacity-60'}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 rounded-lg bg-white/5 border border-white/8 text-slate-400 shrink-0">
                    <ProviderIcon provider={r.provider} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-white truncate">{r.title}</p>
                    <p className="text-[11px] text-slate-500">{r.provider}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(r)}
                    title={r.is_active ? 'Deactivate' : 'Activate'}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/8 cursor-pointer transition-colors"
                  >
                    {r.is_active ? <ToggleRight className="w-4 h-4 text-cyan-400" /> : <ToggleLeft className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditResource(r); setModalOpen(true); }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/8 cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(r.id)}
                    disabled={deletingId === r.id}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/20 cursor-pointer transition-colors disabled:opacity-40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded-full border font-semibold bg-slate-700/30 text-slate-400 border-slate-600/30">
                  {r.skill_key}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${KIND_COLORS[r.kind] ?? KIND_COLORS.other}`}>
                  {r.kind}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${r.is_free ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                  {r.is_free ? 'Free' : 'Paid'}
                </span>
                {r.duration_hours && (
                  <span className="text-[10px] text-slate-500">{r.duration_hours}h</span>
                )}
              </div>

              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-cyan-500 hover:text-cyan-400 truncate flex items-center gap-1 mt-auto"
              >
                <ExternalLink className="w-3 h-3 shrink-0" />
                <span className="truncate">{r.url}</span>
              </a>
            </div>
          ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <ResourceModal
          initial={editResource}
          onClose={() => { setModalOpen(false); setEditResource(null); }}
          onSave={fetchResources}
          isAr={isAr}
        />
      )}
    </div>
  );
}
