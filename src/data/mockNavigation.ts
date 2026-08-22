import type { NavSection } from '../types/navigation';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CreditCard,
  Building2,
  FileBadge,
  Sparkles,
  ShieldCheck,
  LifeBuoy,
} from 'lucide-react';

export const NAVIGATION_SECTIONS: NavSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      {
        id: 'admin-dashboard',
        label: 'Admin Dashboard',
        path: '/admin/dashboard',
        icon: LayoutDashboard,
        requiredRole: ['admin', 'hr'],
      },
      {
        id: 'employee-dashboard',
        label: 'My Workspace',
        path: '/employee/dashboard',
        icon: LayoutDashboard,
        requiredRole: ['employee'],
      },
      {
        id: 'foundation',
        label: 'System Architecture',
        path: '/architecture',
        icon: ShieldCheck,
        badge: 'Live',
        badgeVariant: 'primary',
      },
      {
        id: 'showcase',
        label: 'UI Components',
        path: '/components',
        icon: Sparkles,
        badge: '12 Built',
        badgeVariant: 'success',
      },
    ],
  },
  {
    title: 'WORKFORCE & TEAMS',
    items: [
      {
        id: 'directory',
        label: 'Employee Directory',
        path: '/employees',
        icon: Users,
        badge: '148',
        badgeVariant: 'neutral',
      },
      {
        id: 'time-attendance',
        label: 'Time & Attendance',
        path: '/attendance',
        icon: CalendarCheck,
      },
      {
        id: 'organization',
        label: 'Organization Chart',
        path: '/organization',
        icon: Building2,
      },
    ],
  },
  {
    title: 'OPERATIONS & FINANCE',
    items: [
      {
        id: 'payroll',
        label: 'Payroll & Benefits',
        path: '/payroll',
        icon: CreditCard,
        requiredRole: ['admin', 'hr'],
      },
      {
        id: 'documents',
        label: 'Document Hub',
        path: '/documents',
        icon: FileBadge,
      },
    ],
  },
  {
    title: 'SUPPORT & SETTINGS',
    items: [
      {
        id: 'help',
        label: 'Help & Knowledge Base',
        path: '/help',
        icon: LifeBuoy,
      },
    ],
  },
];
