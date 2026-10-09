'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { Permission } from '../../lib/permissions/rbac';
import { Role } from '../../types';
import { IslamicStarEmblem } from './IslamicPattern';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ShieldAlert, ShieldCheck, ArrowLeft, RefreshCw, Lock, Sparkles, UserCheck } from 'lucide-react';

interface PermissionGateProps {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  children
}) => {
  const { can, canAny } = useApp();

  let hasAccess = false;
  if (permission) {
    hasAccess = can(permission);
  } else if (permissions && permissions.length > 0) {
    hasAccess = requireAll
      ? permissions.every((p) => can(p))
      : canAny(permissions);
  } else {
    hasAccess = true;
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface RoleGateProps {
  allowedRoles: Role | Role[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const RoleGate: React.FC<RoleGateProps> = ({
  allowedRoles,
  fallback = null,
  children
}) => {
  const { hasRole } = useApp();

  const isAllowed = hasRole(allowedRoles);

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface AccessDeniedCardProps {
  title?: string;
  description?: string;
  requiredRoles?: Role | Role[];
  requiredPermission?: Permission;
  onReturnHome?: () => void;
  className?: string;
}

export const AccessDeniedCard: React.FC<AccessDeniedCardProps> = ({
  title = 'Restricted Workspace Access',
  description,
  requiredRoles,
  requiredPermission,
  onReturnHome,
  className = ''
}) => {
  const { currentUser, switchRole, currentRoleMeta } = useApp();

  const rolesList: Role[] = requiredRoles
    ? Array.isArray(requiredRoles)
      ? requiredRoles
      : [requiredRoles]
    : [];

  const defaultDesc = description || (
    rolesList.length > 0
      ? `This command interface requires credentials from: ${rolesList.map((r) => r.toUpperCase()).join(', ')}.`
      : requiredPermission
      ? `This operation requires the explicit permission '${requiredPermission}'.`
      : 'Your current platform scope does not possess authorization to view or alter this module.'
  );

  return (
    <div className={`w-full max-w-2xl mx-auto py-12 px-4 animate-in fade-in-50 zoom-in-98 duration-200 ${className}`}>
      <Card className="border-amber-200/80 bg-linear-to-b from-white via-amber-50/20 to-white shadow-xl overflow-hidden rounded-3xl relative">
        {/* Subtle decorative background top accent */}
        <div className="h-2 w-full bg-linear-to-r from-amber-500 via-emerald-600 to-amber-500" />

        <CardHeader className="text-center pt-8 pb-4 space-y-3">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-100/80 border border-amber-300/60 flex items-center justify-center text-amber-700 shadow-inner">
            <ShieldAlert size={34} />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 border border-amber-200 text-amber-800 text-xs font-semibold tracking-wide uppercase">
              <Lock size={12} />
              <span>RBAC Boundary Enforced</span>
            </div>
            <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">
              {title}
            </CardTitle>
            <CardDescription className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed pt-1">
              {defaultDesc}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-2 pb-6 px-6 sm:px-10">
          {/* Persona Status Pill */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-emerald-600/20"
              />
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{currentUser.name}</span>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-700 bg-slate-50">
                    {currentUser.role}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 font-medium">{currentRoleMeta.label} • {currentUser.email}</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                Assigned Scope
              </span>
              <span className="text-xs text-slate-600 font-medium">
                {currentRoleMeta.badge}
              </span>
            </div>
          </div>

          {/* Quick Persona Elevator Switcher (Demonstration / Sandbox convenience) */}
          {rolesList.length > 0 && !rolesList.includes(currentUser.role) && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#135B3E]" />
                <span className="text-xs font-bold uppercase tracking-wide text-[#135B3E]">
                  Development Switch Shortcut
                </span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Elevate to an authorized role to interact with this module:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {rolesList.map((targetRole) => (
                  <Button
                    key={targetRole}
                    size="sm"
                    variant="outline"
                    onClick={() => switchRole(targetRole)}
                    className="h-8 gap-1.5 bg-white border-emerald-300 text-[#135B3E] hover:bg-emerald-100/70 rounded-xl font-bold text-xs"
                  >
                    <RefreshCw size={12} />
                    Switch to {targetRole.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-slate-50/70 border-t border-slate-100 p-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <IslamicStarEmblem size={16} className="text-[#135B3E]" />
            <span>Islamic Foundation Governance &amp; Security Protocol</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onReturnHome ? (
              <Button
                variant="outline"
                size="sm"
                onClick={onReturnHome}
                className="gap-1.5 rounded-xl text-xs font-semibold"
              >
                <ArrowLeft size={14} />
                Return to Overview
              </Button>
            ) : (
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 rounded-xl text-xs font-semibold"
                >
                  <ArrowLeft size={14} />
                  Return to Dashboard
                </Button>
              </Link>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
