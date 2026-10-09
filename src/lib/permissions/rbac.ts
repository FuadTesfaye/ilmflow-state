import { Role } from '../../types';

export type SystemRole = Role | 'event_manager' | 'competition_manager' | 'moderator';

export type Permission =
  // Events & Ticketing
  | 'event:create'
  | 'event:update'
  | 'event:delete'
  | 'event:publish'
  | 'event:view'
  
  // Registrations & Attendees
  | 'registration:view'
  | 'registration:view_own'
  | 'registration:view_family'
  | 'registration:manage'
  | 'registration:approve'
  | 'registration:export'
  | 'registration:checkin'
  
  // Competitions & Academics
  | 'competition:create'
  | 'competition:update'
  | 'competition:delete'
  | 'competition:publish'
  | 'competition:view'
  | 'competition:participate'
  
  // Question Bank
  | 'question:create'
  | 'question:update'
  | 'question:delete'
  | 'question:view'
  
  // Submissions & Adjudication
  | 'submission:view'
  | 'submission:view_own'
  | 'submission:create'
  | 'submission:grade'
  | 'submission:review'
  
  // Gate & Attendance
  | 'attendance:scan'
  | 'attendance:view'
  
  // Passes & Lanyard
  | 'pass:view_own'
  | 'pass:view_family'
  | 'pass:view_all'
  
  // Certificates & Sanad
  | 'certificate:issue'
  | 'certificate:view_own'
  | 'certificate:view_family'
  | 'certificate:verify'
  
  // Announcements & Giving
  | 'announcement:create'
  | 'announcement:view'
  | 'giving:donate'
  | 'giving:manage'
  
  // System & Governance
  | 'user:view'
  | 'user:update'
  | 'user:suspend'
  | 'user:manage'
  | 'analytics:view'
  | 'audit:view'
  | 'settings:view'
  | 'settings:manage';

export interface RoleMeta {
  role: Role;
  label: string;
  badge: string;
  description: string;
  homeTab: string;
  allowedTabs: string[];
}

export const ROLE_METADATA: Record<Role, RoleMeta> = {
  superadmin: {
    role: 'superadmin',
    label: 'Executive Superadmin',
    badge: 'Supreme Authority',
    description: 'Unrestricted enterprise control: user access governance, security audit trails, and platform configurations.',
    homeTab: 'overview',
    allowedTabs: [
      'overview',
      'events',
      'registrations',
      'competitions',
      'questions',
      'grading',
      'certificates',
      'passes',
      'giving',
      'settings'
    ]
  },
  admin: {
    role: 'admin',
    label: 'Platform Administrator',
    badge: 'Operations Lead',
    description: 'Full institutional management: event programming, attendee admissions, question bank, and diplomas.',
    homeTab: 'overview',
    allowedTabs: [
      'overview',
      'events',
      'registrations',
      'competitions',
      'questions',
      'grading',
      'certificates',
      'passes',
      'giving',
      'settings'
    ]
  },
  judge: {
    role: 'judge',
    label: 'Senior Adjudicator',
    badge: 'Scholar Hafidh',
    description: 'Rubric-based adjudication of Quranic recitations and treatises, leaderboard audit, and exam review.',
    homeTab: 'grading',
    allowedTabs: [
      'overview',
      'grading',
      'competitions',
      'questions',
      'certificates',
      'passes',
      'giving'
    ]
  },
  staff: {
    role: 'staff',
    label: 'Gate Marshal Staff',
    badge: 'Gate Operations',
    description: 'Ground operations: optical QR ticket scanning, live attendee check-in, and venue capacity monitoring.',
    homeTab: 'registrations',
    allowedTabs: [
      'overview',
      'registrations',
      'events',
      'passes',
      'giving'
    ]
  },
  participant: {
    role: 'participant',
    label: 'Competitor & Student',
    badge: 'Delegate',
    description: 'Personal delegate dashboard: dynamic QR lanyard, active tournament quizzes, submissions, and Sanad diplomas.',
    homeTab: 'passes',
    allowedTabs: [
      'overview',
      'passes',
      'competitions',
      'certificates',
      'events',
      'giving'
    ]
  },
  parent: {
    role: 'parent',
    label: 'Family Guardian',
    badge: 'Family Sponsor',
    description: 'Household delegate management: family attendance passes, dependent competition progress, and Sanad archive.',
    homeTab: 'passes',
    allowedTabs: [
      'overview',
      'passes',
      'certificates',
      'events',
      'giving'
    ]
  },
  visitor: {
    role: 'visitor',
    label: 'Public Visitor',
    badge: 'Guest',
    description: 'Public community visitor: browse upcoming conferences, review tournament rules, and support Waqf endowments.',
    homeTab: 'overview',
    allowedTabs: [
      'overview',
      'events',
      'giving'
    ]
  }
};

export const ROLE_PERMISSIONS: Record<SystemRole, Permission[]> = {
  superadmin: [
    'event:create',
    'event:update',
    'event:delete',
    'event:publish',
    'event:view',
    'registration:view',
    'registration:view_own',
    'registration:view_family',
    'registration:manage',
    'registration:approve',
    'registration:export',
    'registration:checkin',
    'competition:create',
    'competition:update',
    'competition:delete',
    'competition:publish',
    'competition:view',
    'competition:participate',
    'question:create',
    'question:update',
    'question:delete',
    'question:view',
    'submission:view',
    'submission:view_own',
    'submission:create',
    'submission:grade',
    'submission:review',
    'attendance:scan',
    'attendance:view',
    'pass:view_own',
    'pass:view_family',
    'pass:view_all',
    'certificate:issue',
    'certificate:view_own',
    'certificate:view_family',
    'certificate:verify',
    'announcement:create',
    'announcement:view',
    'giving:donate',
    'giving:manage',
    'user:view',
    'user:update',
    'user:suspend',
    'user:manage',
    'analytics:view',
    'audit:view',
    'settings:view',
    'settings:manage'
  ],
  admin: [
    'event:create',
    'event:update',
    'event:delete',
    'event:publish',
    'event:view',
    'registration:view',
    'registration:view_own',
    'registration:view_family',
    'registration:manage',
    'registration:approve',
    'registration:export',
    'registration:checkin',
    'competition:create',
    'competition:update',
    'competition:delete',
    'competition:publish',
    'competition:view',
    'question:create',
    'question:update',
    'question:delete',
    'question:view',
    'submission:view',
    'submission:grade',
    'submission:review',
    'attendance:scan',
    'attendance:view',
    'pass:view_own',
    'pass:view_family',
    'pass:view_all',
    'certificate:issue',
    'certificate:view_own',
    'certificate:view_family',
    'certificate:verify',
    'announcement:create',
    'announcement:view',
    'giving:donate',
    'giving:manage',
    'user:view',
    'user:update',
    'analytics:view',
    'audit:view',
    'settings:view',
    'settings:manage'
  ],
  judge: [
    'submission:view',
    'submission:grade',
    'submission:review',
    'competition:view',
    'question:view',
    'certificate:view_own',
    'certificate:verify',
    'pass:view_own',
    'event:view',
    'giving:donate',
    'announcement:view'
  ],
  staff: [
    'attendance:scan',
    'attendance:view',
    'registration:view',
    'registration:checkin',
    'event:view',
    'pass:view_own',
    'giving:donate',
    'announcement:view'
  ],
  participant: [
    'event:view',
    'competition:view',
    'competition:participate',
    'submission:create',
    'submission:view_own',
    'registration:view_own',
    'pass:view_own',
    'certificate:view_own',
    'certificate:verify',
    'giving:donate',
    'announcement:view'
  ],
  parent: [
    'event:view',
    'competition:view',
    'registration:view_own',
    'registration:view_family',
    'pass:view_own',
    'pass:view_family',
    'certificate:view_own',
    'certificate:view_family',
    'certificate:verify',
    'giving:donate',
    'announcement:view'
  ],
  visitor: [
    'event:view',
    'competition:view',
    'certificate:verify',
    'giving:donate',
    'announcement:view'
  ],
  // Legacy alias roles
  event_manager: [
    'event:create',
    'event:update',
    'event:publish',
    'event:view',
    'registration:view',
    'registration:manage',
    'registration:approve',
    'attendance:scan',
    'attendance:view',
    'announcement:view'
  ],
  competition_manager: [
    'competition:create',
    'competition:update',
    'competition:publish',
    'competition:view',
    'question:create',
    'question:update',
    'question:view',
    'submission:view',
    'submission:review',
    'announcement:view'
  ],
  moderator: [
    'submission:view',
    'submission:review',
    'user:view',
    'announcement:view'
  ]
};

export function hasPermission(role: SystemRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: SystemRole, permissions: Permission[]): boolean {
  const rolePerms = ROLE_PERMISSIONS[role] || [];
  return permissions.some((p) => rolePerms.includes(p));
}

export function hasAllPermissions(role: SystemRole, permissions: Permission[]): boolean {
  const rolePerms = ROLE_PERMISSIONS[role] || [];
  return permissions.every((p) => rolePerms.includes(p));
}

export function isTabAllowed(role: Role, tabId: string): boolean {
  const meta = ROLE_METADATA[role];
  if (!meta) return false;
  return meta.allowedTabs.includes(tabId);
}
