'use client';

import React from 'react';
import { RoleGate, AccessDeniedCard } from '../../components/common/PermissionGate';

export default function StaffLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate
      allowedRoles={['staff', 'admin', 'superadmin']}
      fallback={
        <div className="min-h-[80vh] py-16 px-4 flex items-center justify-center">
          <AccessDeniedCard
            requiredRoles={['staff', 'admin', 'superadmin']}
            title="Gate Marshal Operations Access Required"
            description="Access to physical attendee check-in, dynamic QR optical scanning, and venue admittance requires Gate Marshal Staff credentials."
          />
        </div>
      }
    >
      {children}
    </RoleGate>
  );
}
