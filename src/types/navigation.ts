import type React from 'react';
import type { UserRole } from '../utils/constants';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  requiredRole?: UserRole[];
  children?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}
