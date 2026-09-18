"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText, Search, ChevronLeft, ChevronRight, RefreshCw, AlertTriangle, Shield
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { AdminGuard } from '@/components/admin/AdminGuard';

interface AuditLog {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

const ACTION_COLOR: Record<string, string> = {
  'user.suspend': 'text-red-400',
  'user.status_change': 'text-orange-400',
  'user.role_change': 'text-amber-400',
  'resource.create': 'text-emerald-400',
  'resource.update': 'text-cyan-400',
  'resource.delete': 'text-red-400',
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch { return iso; }
}

function AuditLogsContent() {
  const { isAr } = useLanguage();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const LIMIT = 50;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        ...(search ? { action: search } : {}),
      });
      const res = await fetch(`/api/admin/audit-logs?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setLogs(data.logs ?? []);
      setTotal(data.total ?? 0);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            {isAr ? 'سجل العمليات' : 'Audit Logs'}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {isAr ? `${total.toLocaleString()} إجراء مسجل` : `${total.toLocaleString()} logged actions`}
          </p>
        </div>
        <button
          type="button"
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50 self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {isAr ? 'تحديث' : 'Refresh'}
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder={isAr ? 'بحث في الإجراءات...' : 'Filter by action...'}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full ps-9 pe-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
        />
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />{error}
        </div>
      )}

      <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-start px-5 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {isAr ? 'الإجراء' : 'Action'}
                </th>
                <th className="text-start px-5 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {isAr ? 'المنفذ' : 'Actor'}
                </th>
                <th className="text-start px-5 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                  {isAr ? 'الهدف' : 'Target'}
                </th>
                <th className="text-start px-5 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {isAr ? 'التاريخ' : 'Date'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 4 }).map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 bg-white/8 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : logs.length === 0
                ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-slate-500 text-sm">
                      {isAr ? 'لا توجد سجلات بعد.' : 'No audit logs yet.'}
                    </td>
                  </tr>
                )
                : logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3.5">
                      <code className={`text-[12px] font-mono font-semibold ${ACTION_COLOR[log.action] ?? 'text-slate-300'}`}>
                        {log.action}
                      </code>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-[12px] text-slate-300 truncate max-w-[150px]">
                        {log.actor_email ?? '—'}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <p className="text-[11px] text-slate-500">
                        {log.target_type}{log.target_id ? ` · ${log.target_id.slice(0, 8)}…` : ''}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[11px] text-slate-500">{formatDate(log.created_at)}</span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/8">
            <p className="text-[12px] text-slate-500">
              {isAr
                ? `الصفحة ${page} من ${totalPages}`
                : `Page ${page} of ${totalPages}`}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminAuditLogsPage() {
  return (
    <AdminGuard requireOwner>
      <AuditLogsContent />
    </AdminGuard>
  );
}
