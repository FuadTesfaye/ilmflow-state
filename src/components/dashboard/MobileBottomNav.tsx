'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  QrCode,
  Award,
  Menu,
  GraduationCap,
  FileCheck,
  Heart
} from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: string;
  onSelectTab: (tab: any) => void;
  onOpenMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenMenu
}) => {
  const { currentUser, manualSubmissions, registrations, certificates } = useApp();

  const pendingGradingCount = manualSubmissions.filter((s) => s.status === 'pending_review').length;
  const activeRegistrationsCount = registrations.filter((r) => r.status === 'checked_in' || r.status === 'approved').length;
  const myCertificatesCount = certificates.filter(
    (c) => c.recipientEmail === currentUser.email || c.recipientName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])
  ).length;

  const getNavItems = () => {
    switch (currentUser.role) {
      case 'judge':
        return [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'grading', label: 'Adjudicate', icon: Award, badge: pendingGradingCount > 0 ? pendingGradingCount : undefined },
          { id: 'competitions', label: 'Exams', icon: GraduationCap },
          { id: 'certificates', label: 'Sanads', icon: FileCheck }
        ];

      case 'staff':
        return [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'registrations', label: 'Gate Scan', icon: QrCode, badge: activeRegistrationsCount > 0 ? activeRegistrationsCount : undefined },
          { id: 'events', label: 'Events', icon: Calendar },
          { id: 'passes', label: 'Staff Pass', icon: Ticket }
        ];

      case 'participant':
        return [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'passes', label: 'My Passes', icon: Ticket },
          { id: 'competitions', label: 'Exams', icon: GraduationCap },
          { id: 'certificates', label: 'My Sanads', icon: FileCheck, badge: myCertificatesCount > 0 ? myCertificatesCount : undefined }
        ];

      case 'parent':
        return [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'passes', label: 'Family Pass', icon: Ticket },
          { id: 'certificates', label: 'Sanads', icon: FileCheck },
          { id: 'events', label: 'Events', icon: Calendar }
        ];

      case 'visitor':
        return [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'events', label: 'Events', icon: Calendar },
          { id: 'giving', label: 'Waqf', icon: Heart }
        ];

      case 'admin':
      case 'superadmin':
      default:
        return [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'events', label: 'Events', icon: Calendar },
          { id: 'registrations', label: 'Gate', icon: QrCode },
          { id: 'grading', label: 'Grading', icon: Award, badge: pendingGradingCount > 0 ? pendingGradingCount : undefined }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 py-1.5 flex items-center justify-around safe-bottom"
      aria-label="Mobile Bottom Navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer relative ${
              isActive
                ? 'text-[#135B3E] font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Icon
                size={20}
                className={`transition-transform ${
                  isActive ? 'scale-110 text-[#135B3E]' : 'text-slate-500'
                }`}
              />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 px-1 py-0.2 bg-amber-600 text-white text-[9px] font-bold rounded-full min-w-3.5 text-center leading-tight">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-1 truncate max-w-[64px]">
              {item.label}
            </span>
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#135B3E] mt-0.5" />
            )}
          </button>
        );
      })}

      {/* Menu / Drawer Trigger */}
      <button
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
        aria-label="Open full navigation drawer"
      >
        <Menu size={20} className="text-slate-600" />
        <span className="text-[10px] tracking-tight mt-1 text-slate-600">More</span>
      </button>
    </nav>
  );
};
