"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, Search, Filter, ChevronLeft, ChevronRight,
  Shield, UserX, UserCheck, MoreHorizontal, RefreshCw, AlertTriangle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

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
  owner: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  admin: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  user: 'bg-slate-700/40 text-slate-400 border-slate-600/30',
};

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  suspended: 'bg-red-500/15 text-red-400 border-red-500/30',
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            {isAr ? 'إدارة المستخدمين' : 'User Management'}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {isAr ? `${total.toLocaleString()} مستخدم مسجل` : `${total.toLocaleString()} registered users`}
          </p>
        </div>
        <button
          type="button"
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50 self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {isAr ? 'تحديث' : 'Refresh'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder={isAr ? 'بحث بالاسم أو البريد...' : 'Search by name or email...'}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full ps-9 pe-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        {/* Role filter */}
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
        >
          <option value="">{isAr ? 'كل الأدوار' : 'All Roles'}</option>
          <option value="owner">{isAr ? 'مالك' : 'Owner'}</option>
          <option value="admin">{isAr ? 'مسؤول' : 'Admin'}</option>
          <option value="user">{isAr ? 'مستخدم' : 'User'}</option>
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
        >
          <option value="">{isAr ? 'كل الحالات' : 'All Statuses'}</option>
          <option value="active">{isAr ? 'نشط' : 'Active'}</option>
          <option value="suspended">{isAr ? 'معلق' : 'Suspended'}</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-start px-5 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {isAr ? 'المستخدم' : 'User'}
                </th>
                <th className="text-start px-5 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {isAr ? 'الدور' : 'Role'}
                </th>
                <th className="text-start px-5 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {isAr ? 'الحالة' : 'Status'}
                </th>
                <th className="text-start px-5 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                  {isAr ? 'تاريخ التسجيل' : 'Joined'}
                </th>
                <th className="text-end px-5 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {isAr ? 'إجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 bg-white/8 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : users.length === 0
                ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-500 text-sm">
                      {isAr ? 'لا يوجد مستخدمون.' : 'No users found.'}
                    </td>
                  </tr>
                )
                : users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/3 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center shrink-0">
                          <span className="text-[11px] font-bold text-white">
                            {(u.full_name ?? u.email)[0]?.toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-white truncate">
                            {u.full_name || '—'}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${ROLE_BADGE[u.role]}`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${STATUS_BADGE[u.account_status]}`}>
                        {u.account_status}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-[12px] text-slate-500">{formatDate(u.created_at)}</span>
                    </td>

                    <td className="px-5 py-3.5 text-end">
                      <div className="relative inline-block">
                        <button
                          type="button"
                          onClick={() => setOpenMenu(openMenu === u.id ? null : u.id)}
                          disabled={actionLoading === u.id}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/8 transition-colors cursor-pointer disabled:opacity-40"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {openMenu === u.id && (
                          <div className="absolute end-0 mt-1 w-52 rounded-xl bg-[#0B1120] border border-white/10 shadow-2xl z-20 py-1 overflow-hidden">
                            {/* Suspend / Activate */}
                            {u.account_status === 'active' ? (
                              <button
                                type="button"
                                onClick={() => handleAction(u.id, { accountStatus: 'suspended' })}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer text-start"
                              >
                                <UserX className="w-3.5 h-3.5" />
                                {isAr ? 'تعليق الحساب' : 'Suspend Account'}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAction(u.id, { accountStatus: 'active' })}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] text-emerald-400 hover:bg-emerald-950/40 transition-colors cursor-pointer text-start"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                {isAr ? 'تفعيل الحساب' : 'Activate Account'}
                              </button>
                            )}

                            {/* Role changes — owner only */}
                            {isOwner && u.role !== 'owner' && (
                              <>
                                <div className="border-t border-white/8 my-1" />
                                {u.role !== 'admin' && (
                                  <button
                                    type="button"
                                    onClick={() => handleAction(u.id, { role: 'admin' })}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] text-cyan-400 hover:bg-cyan-950/40 transition-colors cursor-pointer text-start"
                                  >
                                    <Shield className="w-3.5 h-3.5" />
                                    {isAr ? 'ترقية لمسؤول' : 'Make Admin'}
                                  </button>
                                )}
                                {u.role !== 'user' && (
                                  <button
                                    type="button"
                                    onClick={() => handleAction(u.id, { role: 'user' })}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] text-slate-400 hover:bg-white/5 transition-colors cursor-pointer text-start"
                                  >
                                    <UserX className="w-3.5 h-3.5" />
                                    {isAr ? 'إزالة صلاحيات الإدارة' : 'Remove Admin'}
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
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/8">
            <p className="text-[12px] text-slate-500">
              {isAr
                ? `عرض ${Math.min((page - 1) * LIMIT + 1, total)}–${Math.min(page * LIMIT, total)} من ${total}`
                : `Showing ${Math.min((page - 1) * LIMIT + 1, total)}–${Math.min(page * LIMIT, total)} of ${total}`}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[12px] text-slate-400 px-2">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 cursor-pointer transition-colors"
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
