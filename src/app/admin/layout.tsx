'use client';

import React from 'react';
import { RoleGate, AccessDeniedCard } from '../../components/common/PermissionGate';

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate
      allowedRoles={['admin', 'superadmin']}
      fallback={
        <div className="min-h-[80vh] py-16 px-4 flex items-center justify-center">
          <AccessDeniedCard
            requiredRoles={['admin', 'superadmin']}
            title="Restricted Administrative Console"
            description="Access to platform administration, user governance, audit trails, and schema builders requires verified Administrative credentials."
          />
        </div>
      }
    >
      {children}
    </RoleGate>
  );
}
