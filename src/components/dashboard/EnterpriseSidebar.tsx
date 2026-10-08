'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { IslamicStarEmblem } from '../common/IslamicPattern';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Award,
  FileCheck,
  CheckCircle,
  FileText,
  ShieldCheck,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  ExternalLink,
  Building,
  GraduationCap,
  Ticket,
  Heart,
  Bell,
  X,
  Sparkles
} from 'lucide-react';

interface EnterpriseSidebarProps {
  currentTab?: string;
  onSelectTab?: (tab: any) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface SidebarNavItem {
  id: string;
  label: string;
  icon: any;
  isTab?: boolean;
  href?: string;
  badge?: string;
  count?: number;
  countVariant?: 'urgent' | 'normal' | 'gold';
}

interface SidebarNavGroup {
  group: string;
  items: SidebarNavItem[];
}

export const EnterpriseSidebar: React.FC<EnterpriseSidebarProps> = ({
  currentTab = 'overview',
  onSelectTab,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen
}) => {
  const pathname = usePathname();
  const { currentUser, manualSubmissions, registrations, certificates, announcements } = useApp();

  const pendingGradingCount = manualSubmissions.filter((s) => s.status === 'pending_review').length;
  const activeRegistrationsCount = registrations.filter((r) => r.status === 'checked_in' || r.status === 'approved' || r.status === 'submitted').length;
  const myRegistrationsCount = registrations.filter((r) => r.userId === currentUser.id || r.participantEmail === currentUser.email).length;
  const myCertificatesCount = certificates.filter((c) => c.recipientEmail === currentUser.email || c.recipientName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])).length;

  const navGroups: SidebarNavGroup[] = [
    {
      group: 'Core Operations',
      items: [
        {
          id: 'overview',
          label: 'Executive Overview',
          icon: LayoutDashboard,
          isTab: true
        },
        {
          id: 'events',
          label: 'Events & Ticketing',
          icon: Calendar,
          isTab: true,
          badge: 'Live'
        },
        {
          id: 'registrations',
          label: 'Attendees & Gate',
          icon: Users,
          isTab: true,
          count: activeRegistrationsCount
        },
        {
          id: 'prayers',
          label: 'Prayers & Adhan Sync',
          icon: Clock,
          href: '/schedule'
        }
      ]
    },
    {
      group: 'Academic & Competitions',
      items: [
        {
          id: 'competitions',
          label: 'Tournaments & Exams',
          icon: GraduationCap,
          isTab: true
        },
        {
          id: 'questions',
          label: 'Question Bank',
          icon: BookOpen,
          isTab: true
        },
        {
          id: 'grading',
          label: 'Grading Queue',
          icon: Award,
          isTab: true,
          count: pendingGradingCount,
          countVariant: pendingGradingCount > 0 ? 'urgent' : 'normal'
        },
        {
          id: 'certificates',
          label: 'Sanad Diplomas',
          icon: FileCheck,
          isTab: true,
          count: myCertificatesCount > 0 ? myCertificatesCount : undefined,
          countVariant: 'gold'
        }
      ]
    },
    {
      group: 'Personal & Community',
      items: [
        {
          id: 'passes',
          label: 'My Passes & Lanyard',
          icon: Ticket,
          isTab: true,
          count: myRegistrationsCount > 0 ? myRegistrationsCount : undefined
        },
        {
          id: 'giving',
          label: 'Waqf & Giving Hub',
          icon: Heart,
          isTab: true
        },
        {
          id: 'announcements',
          label: 'Announcements',
          icon: Bell,
          isTab: true,
          count: announcements.length > 0 ? announcements.length : undefined
        }
      ]
    },
    {
      group: 'Systems & Governance',
      items: [
        {
          id: 'forms',
          label: 'Form Studio Builder',
          icon: FileText,
          isTab: true
        },
        {
          id: 'audit-logs',
          label: 'Audit Trail & Security',
          icon: ShieldCheck,
          href: '/admin/audit-logs'
        },
        {
          id: 'analytics',
          label: 'Psychometrics & Data',
          icon: BarChart3,
          href: '/admin/analytics'
        },
        {
          id: 'settings',
          label: 'System Settings',
          icon: Settings,
          isTab: true
        }
      ]
    }
  ];

  const handleItemClick = (item: any) => {
    if (item.isTab && onSelectTab) {
      onSelectTab(item.id);
    }
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/90 text-slate-800 select-none">
      {/* Brand Header & Campus Pill */}
      <div className={`p-4 border-b border-slate-100 flex items-center justify-between ${isCollapsed ? 'flex-col gap-2' : ''}`}>
        <Link href="/" className="flex items-center gap-3 group min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-center text-[#135B3E] shrink-0 group-hover:scale-105 transition-transform">
            <IslamicStarEmblem size={22} className="text-[#135B3E]" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-black tracking-wider text-slate-900 group-hover:text-[#135B3E] transition-colors truncate">
                HEJRAT FOUNDATION
              </span>
              <span className="text-[10px] font-semibold text-[#135B3E] uppercase tracking-widest truncate">
                Command Center
              </span>
            </div>
          )}
        </Link>

        {/* Mobile close button inside drawer */}
        <button
          onClick={() => setMobileOpen(false)}
          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg md:hidden hover:bg-slate-100 cursor-pointer"
          aria-label="Close navigation drawer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Group Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!isCollapsed && (
              <h4 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {group.group}
              </h4>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = item.isTab ? currentTab === item.id : pathname === item.href;

                if (item.href) {
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-[#135B3E] text-white shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      } ${isCollapsed ? 'justify-center px-2' : ''}`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <item.icon size={17} className={isActive ? 'text-white' : 'text-slate-500'} />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#135B3E] text-white shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    } ${isCollapsed ? 'justify-center px-2' : ''}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon size={17} className={isActive ? 'text-white' : 'text-slate-500'} />
                    {!isCollapsed && (
                      <>
                        <span className="truncate text-left flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded-full leading-none">
                            {item.badge}
                          </span>
                        )}
                        {item.count !== undefined && item.count > 0 && (
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full leading-none ${
                              item.countVariant === 'urgent'
                                ? 'bg-amber-500 text-white animate-pulse'
                                : item.countVariant === 'gold'
                                ? 'bg-[#9E782F] text-white'
                                : isActive
                                ? 'bg-emerald-800 text-emerald-100'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Profile & Desktop Collapse Toggle */}
      <div className="p-3 border-t border-slate-100 space-y-2 bg-slate-50/60">
        <button
          onClick={() => {
            if (onSelectTab) onSelectTab('passes');
            setMobileOpen(false);
          }}
          className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-white hover:shadow-2xs transition-all cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="Active Member Credential"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-[#135B3E]/30 shrink-0"
          />
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 flex-1 text-left">
              <span className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</span>
              <span className="text-[10px] text-[#135B3E] font-semibold truncate capitalize">
                {currentUser.role} Session
              </span>
            </div>
          )}
        </button>

        {/* Desktop Collapse Trigger */}
        <div className="hidden md:flex items-center justify-between pt-1">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer text-xs"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <div className="flex items-center gap-2"><ChevronLeft size={16} /><span className="text-[11px] font-medium">Collapse Sidebar</span></div>}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed/Sticky Sidebar */}
      <aside
        className={`hidden md:block shrink-0 transition-all duration-300 sticky top-0 h-screen z-30 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
