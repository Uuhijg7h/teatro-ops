import type { UserRole } from './constants';

export const PERMISSIONS = [
  'view_dashboard',
  'view_calendar',
  'view_bookings',
  'manage_bookings',
  'view_guests',
  'view_menu',
  'manage_menu',
  'view_staff',
  'manage_staff',
  'view_venues',
  'manage_venues',
  'view_finance',
  'manage_finance',
  'view_templates',
  'manage_templates',
  'view_settings',
  'manage_settings',
  'manage_users',
  'manage_roles',
  'manage_integrations',
  'manage_inventory',
  'view_inventory',
  'view_kitchen',
  'manage_kitchen',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [...PERMISSIONS],
  manager: [
    'view_dashboard',
    'view_calendar',
    'view_bookings',
    'manage_bookings',
    'view_guests',
    'view_menu',
    'manage_menu',
    'view_staff',
    'manage_staff',
    'view_venues',
    'manage_venues',
    'view_finance',
    'manage_finance',
    'view_templates',
    'view_settings',
    'view_inventory',
    'manage_inventory',
    'view_kitchen',
  ],
  staff: [
    'view_dashboard',
    'view_calendar',
    'view_bookings',
    'view_guests',
    'view_menu',
    'view_staff',
    'view_venues',
    'view_templates',
    'view_inventory',
    'view_kitchen',
  ],
  visitor: ['view_dashboard', 'view_calendar', 'view_bookings'],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
