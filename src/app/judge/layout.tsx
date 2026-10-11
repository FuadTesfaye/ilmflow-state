'use client';

import React from 'react';
import { RoleGate, AccessDeniedCard } from '../../components/common/PermissionGate';

export default function JudgeLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate
      allowedRoles={['judge', 'admin', 'superadmin']}
      fallback={
        <div className="min-h-[80vh] py-16 px-4 flex items-center justify-center">
          <AccessDeniedCard
            requiredRoles={['judge', 'admin', 'superadmin']}
            title="Senior Adjudicator Portal Access Required"
            description="Access to academic adjudication, Quranic recitation scoring, essay evaluation, and Sanad certification requires Senior Adjudicator credentials."
          />
        </div>
      }
    >
      {children}
    </RoleGate>
  );
}
