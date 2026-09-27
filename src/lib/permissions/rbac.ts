export type SystemRole =
  | 'superadmin'
  | 'admin'
  | 'event_manager'
  | 'competition_manager'
  | 'judge'
  | 'moderator'
  | 'staff'
  | 'participant'
  | 'visitor';

export type Permission =
  | 'event:create'
  | 'event:update'
  | 'event:delete'
  | 'event:publish'
  | 'registration:view'
  | 'registration:approve'
  | 'registration:export'
  | 'competition:create'
  | 'competition:update'
  | 'competition:publish'
  | 'question:create'
  | 'question:update'
  | 'question:delete'
  | 'submission:view'
  | 'submission:grade'
  | 'submission:review'
  | 'attendance:scan'
  | 'attendance:view'
  | 'user:view'
  | 'user:update'
  | 'user:suspend'
  | 'analytics:view'
  | 'audit:view';

export const ROLE_PERMISSIONS: Record<SystemRole, Permission[]> = {
  superadmin: [
    'event:create',
    'event:update',
    'event:delete',
    'event:publish',
    'registration:view',
    'registration:approve',
    'registration:export',
    'competition:create',
    'competition:update',
    'competition:publish',
    'question:create',
    'question:update',
    'question:delete',
    'submission:view',
    'submission:grade',
    'submission:review',
    'attendance:scan',
    'attendance:view',
    'user:view',
    'user:update',
    'user:suspend',
    'analytics:view',
    'audit:view'
  ],
  admin: [
    'event:create',
    'event:update',
    'event:publish',
    'registration:view',
    'registration:approve',
    'registration:export',
    'competition:create',
    'competition:update',
    'competition:publish',
    'question:create',
    'question:update',
    'submission:view',
    'submission:grade',
    'submission:review',
    'attendance:scan',
    'attendance:view',
    'user:view',
    'analytics:view',
    'audit:view'
  ],
  event_manager: [
    'event:create',
    'event:update',
    'registration:view',
    'registration:approve',
    'attendance:scan',
    'attendance:view'
  ],
  competition_manager: [
    'competition:create',
    'competition:update',
    'competition:publish',
    'question:create',
    'question:update',
    'submission:view',
    'submission:review'
  ],
  judge: [
    'submission:view',
    'submission:grade'
  ],
  moderator: [
    'submission:view',
    'submission:review',
    'user:view'
  ],
  staff: [
    'attendance:scan',
    'attendance:view',
    'registration:view'
  ],
  participant: [],
  visitor: []
};

export function hasPermission(role: SystemRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
