import type { UserProfile } from '../types/user';

export const CURRENT_USER: UserProfile = {
  id: 'usr_df_001',
  name: 'Eleanor Vance',
  email: 'eleanor.vance@dayflow.hr',
  role: 'admin',
  title: 'Head of People Operations',
  department: 'Human Resources',
  status: 'active',
  joinedDate: '2024-03-15',
  timezone: 'America/New_York (EST)',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
};

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
