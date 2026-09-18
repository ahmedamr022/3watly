"use client";

import React, { useEffect, useState } from 'react';
import {
  Users, UserCheck, UserX, FileText, Briefcase, BookOpen,
  TrendingUp, RefreshCw, AlertTriangle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface Stats {
  totalUsers: number;
  adminUsers: number;
  suspendedUsers: number;
  totalCvAnalyses: number;
  totalJobs: number;
  activeResources: number;
}

interface RecentUser {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  account_status: string;
  created_at: string;
}

interface StatCard {
  label: string;
  labelAr: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
}

function buildStatCards(stats: Stats): StatCard[] {
  return [
    {
      label: 'Total Users',
      labelAr: 'إجمالي المستخدمين',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-cyan-400',
      bgColor: 'from-cyan-500/15 to-cyan-500/5',
      borderColor: 'border-cyan-500/20',
    },
    {
      label: 'Admins',
      labelAr: 'المسؤولون',
      value: stats.adminUsers,
      icon: UserCheck,
      color: 'text-indigo-400',
      bgColor: 'from-indigo-500/15 to-indigo-500/5',
      borderColor: 'border-indigo-500/20',
    },
    {
      label: 'Suspended',
      labelAr: 'المعلقون',
      value: stats.suspendedUsers,
      icon: UserX,
      color: 'text-red-400',
      bgColor: 'from-red-500/15 to-red-500/5',
      borderColor: 'border-red-500/20',
    },
    {
      label: 'CV Analyses',
      labelAr: 'تحليلات السيرة الذاتية',
      value: stats.totalCvAnalyses,
      icon: FileText,
      color: 'text-emerald-400',
      bgColor: 'from-emerald-500/15 to-emerald-500/5',
      borderColor: 'border-emerald-500/20',
    },
    {
      label: 'Jobs in DB',
      labelAr: 'الوظائف في قاعدة البيانات',
      value: stats.totalJobs,
      icon: Briefcase,
      color: 'text-amber-400',
      bgColor: 'from-amber-500/15 to-amber-500/5',
      borderColor: 'border-amber-500/20',
    },
    {
      label: 'Active Resources',
      labelAr: 'المصادر النشطة',
      value: stats.activeResources,
      icon: BookOpen,
      color: 'text-purple-400',
      bgColor: 'from-purple-500/15 to-purple-500/5',
      borderColor: 'border-purple-500/20',
    },
  ];
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  } catch {
    return iso;
  }
}

const ROLE_STYLE: Record<string, string> = {
  owner: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  admin: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  user:  'bg-slate-700/50 text-slate-400 border-slate-600/30',
};

export default function AdminDashboardPage() {
  const { isAr } = useLanguage();
  const { user } = useAuth();

  const [stats, setStats] = useState<Stats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/stats');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setStats(data.stats);
      setRecentUsers(data.recentUsers ?? []);
    } catch (e: any) {
      setError(e.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = stats ? buildStatCards(stats) : [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">
            {isAr ? `أهلاً، ${user?.fullName?.split(' ')[0] ?? 'مسؤول'} 👋` : `Welcome back, ${user?.fullName?.split(' ')[0] ?? 'Admin'} 👋`}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {isAr ? 'إليك نظرة عامة على حالة المنصة.' : "Here's an overview of the platform status."}
          </p>
        </div>
        <button
          type="button"
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {isAr ? 'تحديث' : 'Refresh'}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse border border-white/8" />
            ))
          : statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className={`
                    relative flex flex-col gap-3 p-5 rounded-2xl
                    bg-gradient-to-br ${card.bgColor}
                    border ${card.borderColor}
                    hover:scale-[1.02] transition-transform duration-200
                  `}
                >
                  <div className={`p-2 rounded-xl bg-white/5 w-fit border ${card.borderColor}`}>
                    <Icon className={`w-4 h-4 ${card.color}`} />
                  </div>
                  <div>
                    <p className={`text-2xl font-black ${card.color}`}>
                      {card.value.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                      {isAr ? card.labelAr : card.label}
                    </p>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Recent Signups */}
      <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h2 className="text-[14px] font-bold text-white">
              {isAr ? 'أحدث المستخدمين' : 'Recent Signups'}
            </h2>
          </div>
          <a
            href="/admin/users"
            className="text-[12px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {isAr ? 'عرض الكل' : 'View all'}
          </a>
        </div>

        <div className="divide-y divide-white/5">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 bg-white/10 rounded animate-pulse" />
                  <div className="h-2.5 w-48 bg-white/5 rounded animate-pulse" />
                </div>
              </div>
            ))
          ) : recentUsers.length === 0 ? (
            <div className="px-6 py-10 text-center text-slate-500 text-sm">
              {isAr ? 'لا يوجد مستخدمون حتى الآن.' : 'No users yet.'}
            </div>
          ) : (
            recentUsers.map((u) => (
              <div key={u.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-white/3 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/30 to-indigo-500/30 border border-white/10 flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-bold text-white">
                    {(u.full_name ?? u.email)?.[0]?.toUpperCase() ?? '?'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-white truncate">
                    {u.full_name || u.email}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${ROLE_STYLE[u.role] ?? ROLE_STYLE.user}`}>
                    {u.role}
                  </span>
                  <span className="text-[11px] text-slate-500">{formatDate(u.created_at)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
