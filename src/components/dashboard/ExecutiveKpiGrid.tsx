'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  Users,
  CheckCircle,
  GraduationCap,
  Award,
  Heart,
  TrendingUp,
  ArrowUpRight,
  Clock
} from 'lucide-react';

interface ExecutiveKpiGridProps {
  onNavigateTab?: (tab: string) => void;
}

export const ExecutiveKpiGrid: React.FC<ExecutiveKpiGridProps> = ({ onNavigateTab }) => {
  const {
    registrations,
    competitions,
    manualSubmissions,
    quizAttempts
  } = useApp();

  const totalRegistered = registrations.length;
  const checkedInCount = registrations.filter((r) => r.status === 'checked_in').length;
  const checkInRate = totalRegistered > 0 ? Math.round((checkedInCount / totalRegistered) * 100) : 0;

  const pendingGradingCount = manualSubmissions.filter((s) => s.status === 'pending_review').length;
  const totalSubmissions = manualSubmissions.length + quizAttempts.length;

  const kpis = [
    {
      id: 'registrations',
      title: 'Total Attendees',
      value: totalRegistered.toLocaleString(),
      subtext: '+18% vs last summit',
      subtextTrend: 'up',
      badge: 'Live Quotas',
      icon: Users,
      iconColor: 'text-[#135B3E]',
      iconBg: 'bg-emerald-50 border-emerald-200/70',
      actionLabel: 'Manage Guests',
      tabTarget: 'registrations'
    },
    {
      id: 'checkin',
      title: 'Gate Check-In Rate',
      value: `${checkInRate}%`,
      subtext: `${checkedInCount} of ${totalRegistered} admitted`,
      progress: checkInRate,
      icon: CheckCircle,
      iconColor: 'text-emerald-700',
      iconBg: 'bg-emerald-50 border-emerald-200/70',
      actionLabel: 'Arrival Terminal',
      tabTarget: 'registrations'
    },
    {
      id: 'tournaments',
      title: 'Academic Contests',
      value: competitions.length.toString(),
      subtext: `${totalSubmissions} submissions logged`,
      badge: 'Active Rounds',
      icon: GraduationCap,
      iconColor: 'text-[#9E782F]',
      iconBg: 'bg-amber-50 border-amber-200/70',
      actionLabel: 'View Brackets',
      tabTarget: 'competitions'
    },
    {
      id: 'grading',
      title: 'Grading Queue',
      value: pendingGradingCount.toString(),
      subtext: pendingGradingCount > 0 ? 'Urgent review pending' : 'All graded',
      isUrgent: pendingGradingCount > 0,
      icon: Award,
      iconColor: 'text-amber-700',
      iconBg: 'bg-amber-50 border-amber-200/70',
      actionLabel: 'Score Rubric',
      tabTarget: 'grading'
    },
    {
      id: 'giving',
      title: 'Waqf & Giving Total',
      value: '$24,850',
      subtext: '82.8% of $30,000 goal',
      progress: 83,
      icon: Heart,
      iconColor: 'text-rose-700',
      iconBg: 'bg-rose-50 border-rose-200/70',
      actionLabel: 'Giving Ledger',
      tabTarget: 'giving'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;

        return (
          <Card
            key={kpi.id}
            onClick={() => onNavigateTab && onNavigateTab(kpi.tabTarget)}
            className="p-4 sm:p-5 bg-white border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-[#135B3E]/40 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${kpi.iconBg}`}
                >
                  <Icon size={18} className={kpi.iconColor} />
                </div>

                {kpi.isUrgent ? (
                  <Badge variant="destructive" className="text-[10px] animate-pulse">
                    Urgent
                  </Badge>
                ) : kpi.badge ? (
                  <Badge variant="outline" className="text-[10px] text-slate-600 border-slate-200">
                    {kpi.badge}
                  </Badge>
                ) : null}
              </div>

              {/* Title & Value */}
              <div className="space-y-1">
                <span className="text-xs font-medium text-slate-500 block truncate">
                  {kpi.title}
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {kpi.value}
                </div>
              </div>
            </div>

            {/* Bottom Meta & Progress */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
              {kpi.progress !== undefined ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{kpi.subtext}</span>
                    <span className="font-semibold text-slate-700">{kpi.progress}%</span>
                  </div>
                  <Progress value={kpi.progress} className="h-1.5 bg-slate-100" />
                </div>
              ) : (
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="truncate">{kpi.subtext}</span>
                  <ArrowUpRight
                    size={14}
                    className="text-slate-400 group-hover:text-[#135B3E] transition-colors shrink-0"
                  />
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
