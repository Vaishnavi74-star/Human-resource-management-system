import type { UserProfile } from '../types/user';

export interface MockUserRecord extends UserProfile {
  passwordHash: string;
}

export const MOCK_USERS_DB: MockUserRecord[] = [
  {
    id: 'usr_emp_001',
    employeeId: 'DF-4089',
    name: 'Alex Morgan',
    email: 'employee@dayflow.com',
    passwordHash: 'Employee@123',
    role: 'employee',
    title: 'Senior Software Engineer',
    department: 'Product Engineering',
    status: 'active',
    isEmailVerified: true,
    joinedDate: '2023-08-14',
    timezone: 'America/New_York (EST)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
  },
  {
    id: 'usr_hr_001',
    employeeId: 'DF-1001',
    name: 'Eleanor Vance',
    email: 'hr@dayflow.com',
    passwordHash: 'HR@123456',
    role: 'admin',
    title: 'Head of People & HR Operations',
    department: 'Human Resources',
    status: 'active',
    isEmailVerified: true,
    joinedDate: '2022-04-10',
    timezone: 'America/New_York (EST)',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=250&auto=format&fit=crop',
  },
];

export const CURRENT_USER: UserProfile = MOCK_USERS_DB[1]; // default fallback

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif_1',
    title: 'Time-off Request Approved',
    message: 'Your annual leave request for Sep 12-16 was approved by Marcus Chen.',
    timestamp: '10m ago',
    read: false,
    type: 'success',
  },
  {
    id: 'notif_2',
    title: 'Payroll Cycle Closing Soon',
    message: 'Monthly timesheet approval window closes in 24 hours.',
    timestamp: '2h ago',
    read: false,
    type: 'warning',
  },
  {
    id: 'notif_3',
    title: 'New Policy Published',
    message: 'Updated Remote Work & Equipment Reimbursement guidelines are live.',
    timestamp: '1d ago',
    read: true,
    type: 'info',
  },
];
