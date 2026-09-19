"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, Search, ChevronLeft, ChevronRight,
  Shield, UserX, UserCheck, MoreHorizontal, RefreshCw, AlertTriangle, Crown
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { CustomDropdown } from '@/components/ui/CustomDropdown';

interface AdminUser {
  id: string;
  full_name: string | null;
  email: string;
  role: 'owner' | 'admin' | 'user';
  account_status: 'active' | 'suspended';
  created_at: string;
  onboarding_completed: boolean;
}

const ROLE_BADGE: Record<string, string> = {
  owner: 'bg-amber-500/15 text-amber-500 dark:text-amber-400 border-amber-500/30 font-bold',
  admin: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 font-bold',
  user: 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-400/20 font-semibold',
};

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-semibold',
  suspended: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30 font-semibold',
};

function formatDate(iso: string, isAr: boolean) {
  try {
    return new Date(iso).toLocaleDateString(isAr ? 'ar-EG' : 'en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  } catch { return iso; }
}

export default function AdminUsersPage() {
  const { isAr } = useLanguage();
  const { isOwner } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const LIMIT = 20;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        ...(search ? { search } : {}),
        ...(roleFilter ? { role: roleFilter } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
      });
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setUsers(data.users ?? []);
      setTotal(data.total ?? 0);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, statusFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleAction = async (userId: string, updates: { role?: string; accountStatus?: string }) => {
    setActionLoading(userId);
    setOpenMenu(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...updates }),
      });
      if (!res.ok) {
        const d = await res.json();
        alert(d.error || 'Action failed');
        return;
      }
      await fetchUsers();
    } catch (e) {
      alert('Network error');
    } finally {
      setActionLoading(null);
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-50/80 via-white/70 to-blue-100/60 dark:bg-gradient-to-r dark:from-[#0D2452]/60 dark:via-[#091738]/70 dark:to-[#061026]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-cyan-500/25 shadow-xl shadow-cyan-950/20">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />
            {isAr ? 'إدارة حسابات المستخدمين' : 'User Accounts Management'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            {isAr ? `${total.toLocaleString()} مستخدم مسجل في المنصة` : `${total.toLocaleString()} registered users in platform`}
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-cyan-500/30 bg-white/70 dark:bg-[#0D2452]/50 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#12316B]/60 transition-all cursor-pointer disabled:opacity-50 self-start shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {isAr ? 'تحديث' : 'Refresh'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={isAr ? 'بحث بالاسم أو البريد الإلكتروني...' : 'Search by name or email...'}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-white/80 dark:bg-gradient-to-r dark:from-[#0B1E45]/60 dark:to-[#07132B]/70 border border-slate-200 dark:border-cyan-500/25 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/60 shadow-xs backdrop-blur-md"
          />
        </div>

        {/* Role filter */}
        <div className="w-full sm:w-48">
          <CustomDropdown
            options={[
              { value: '', label: isAr ? 'كل الأدوار' : 'All Roles' },
              { value: 'owner', label: isAr ? '👑 المالك' : '👑 Owner' },
              { value: 'admin', label: isAr ? '🛡️ مسؤول' : '🛡️ Admin' },
              { value: 'user', label: isAr ? '👤 مستخدم' : '👤 User' },
            ]}
            value={roleFilter}
            onChange={(val) => { setRoleFilter(val); setPage(1); }}
          />
        </div>

        {/* Status filter */}
        <div className="w-full sm:w-48">
          <CustomDropdown
            options={[
              { value: '', label: isAr ? 'كل الحالات' : 'All Statuses' },
              { value: 'active', label: isAr ? '🟢 نشط' : '🟢 Active' },
              { value: 'suspended', label: isAr ? '🔴 معلق' : '🔴 Suspended' },
            ]}
            value={statusFilter}
            onChange={(val) => { setStatusFilter(val); setPage(1); }}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Table Container */}
      <div className="bg-gradient-to-b from-blue-50/60 via-white/70 to-blue-50/60 dark:bg-gradient-to-b dark:from-[#0B1E45]/55 dark:via-[#07132B]/65 dark:to-[#040C1E]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-cyan-500/20 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-white/10 bg-slate-100/60 dark:bg-[#0E2656]/30 text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                <th className="text-start px-6 py-4">{isAr ? 'المستخدم' : 'User'}</th>
                <th className="text-center px-6 py-4">{isAr ? 'الدور' : 'Role'}</th>
                <th className="text-center px-6 py-4">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="text-start px-6 py-4 hidden md:table-cell">{isAr ? 'تاريخ التسجيل' : 'Joined'}</th>
                <th className="text-end px-6 py-4">{isAr ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/6">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-slate-200 dark:bg-white/8 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : users.length === 0
                ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                      {isAr ? 'لا يوجد مستخدمون مطابقون للبحث.' : 'No users found.'}
                    </td>
                  </tr>
                )
                : users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/3 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                          {(u.full_name ?? u.email)[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13.5px] font-bold text-slate-900 dark:text-white truncate">
                            {u.full_name || '—'}
                          </p>
                          <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-mono truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block text-[10.5px] px-2.5 py-0.5 rounded-full border ${ROLE_BADGE[u.role] ?? ROLE_BADGE.user}`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block text-[10.5px] px-2.5 py-0.5 rounded-full border ${STATUS_BADGE[u.account_status] ?? STATUS_BADGE.active}`}>
                        {u.account_status}
                      </span>
                    </td>

                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(u.created_at, isAr)}</span>
                    </td>

                    <td className="px-6 py-4 text-end">
                      <div className="relative inline-block">
                        <button
                          type="button"
                          onClick={() => setOpenMenu(openMenu === u.id ? null : u.id)}
                          disabled={actionLoading === u.id}
                          className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/8 transition-colors cursor-pointer disabled:opacity-40"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {openMenu === u.id && (
                          <div className="absolute end-0 mt-1.5 w-56 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-white/12 shadow-2xl z-30 py-1.5 overflow-hidden animate-in fade-in zoom-in-95">
                            {/* Suspend / Activate */}
                            {u.account_status === 'active' ? (
                              <button
                                type="button"
                                onClick={() => handleAction(u.id, { accountStatus: 'suspended' })}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer text-start"
                              >
                                <UserX className="w-4 h-4" />
                                {isAr ? 'تعليق الحساب' : 'Suspend Account'}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAction(u.id, { accountStatus: 'active' })}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer text-start"
                              >
                                <UserCheck className="w-4 h-4" />
                                {isAr ? 'تفعيل الحساب' : 'Activate Account'}
                              </button>
                            )}

                            {/* Role changes — owner only */}
                            {isOwner && (
                              <>
                                <div className="border-t border-slate-100 dark:border-white/8 my-1" />
                                {u.role !== 'owner' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (confirm(isAr ? `هل أنت متأكد من ترقية "${u.full_name || u.email}" إلى مالك للمنصة (Owner)؟ سيكون له كامل الصلاحيات.` : `Promote "${u.full_name || u.email}" to Owner?`)) {
                                        handleAction(u.id, { role: 'owner' });
                                      }
                                    }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer text-start"
                                  >
                                    <Crown className="w-4 h-4 text-amber-500" />
                                    {isAr ? '👑 ترقية لمالك (Owner)' : '👑 Make Owner'}
                                  </button>
                                )}
                                {u.role !== 'admin' && (
                                  <button
                                    type="button"
                                    onClick={() => handleAction(u.id, { role: 'admin' })}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 transition-colors cursor-pointer text-start"
                                  >
                                    <Shield className="w-4 h-4" />
                                    {isAr ? '🛡️ ترقية لمسؤول (Admin)' : '🛡️ Make Admin'}
                                  </button>
                                )}
                                {u.role !== 'user' && (
                                  <button
                                    type="button"
                                    onClick={() => handleAction(u.id, { role: 'user' })}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-start"
                                  >
                                    <UserX className="w-4 h-4" />
                                    {isAr ? '👤 تحويل لمستخدم عادي' : '👤 Make Regular User'}
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/80 dark:border-white/8 bg-slate-50/50 dark:bg-white/2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr
                ? `عرض ${Math.min((page - 1) * LIMIT + 1, total)}–${Math.min(page * LIMIT, total)} من ${total}`
                : `Showing ${Math.min((page - 1) * LIMIT + 1, total)}–${Math.min(page * LIMIT, total)} of ${total}`}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 px-2">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 cursor-pointer transition-colors"
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
