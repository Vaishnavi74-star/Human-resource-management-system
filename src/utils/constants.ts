export const APP_CONFIG = {
  name: 'DAYFLOW',
  tagline: 'Every workday, perfectly aligned.',
  version: '1.0.0-alpha',
  copyrightYear: new Date().getFullYear(),
} as const;

export const ROLES = {
  ADMIN: 'admin',
  HR: 'hr',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];
