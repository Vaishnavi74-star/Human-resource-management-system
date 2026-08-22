// ─── Centralized Admin Dashboard Mock Data ───────────────────────────
// All admin dashboard statistics derive from this single source.

export interface Department {
  id: string;
  name: string;
  headcount: number;
  color: string;
}

export interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  avatarUrl?: string;
  appliedOn: string;
}

export interface AttendanceData {
  label: string;
  present: number;
  absent: number;
  halfDay: number;
  onLeave: number;
}

export interface OrgActivity {
  id: string;
  type: 'hire' | 'leave' | 'promotion' | 'termination' | 'policy' | 'payroll';
  title: string;
  description: string;
  timestamp: string;
  actor: string;
}

// ─── Departments ───────────────────────────────────────────────────────
export const DEPARTMENTS: Department[] = [
  { id: 'dept_eng', name: 'Engineering', headcount: 42, color: '#6366f1' },
  { id: 'dept_hr', name: 'HR', headcount: 8, color: '#f43f5e' },
  { id: 'dept_fin', name: 'Finance', headcount: 12, color: '#10b981' },
  { id: 'dept_mktg', name: 'Marketing', headcount: 18, color: '#f59e0b' },
  { id: 'dept_ops', name: 'Operations', headcount: 25, color: '#8b5cf6' },
];

// Derived totals
export const TOTAL_EMPLOYEES = DEPARTMENTS.reduce((sum, d) => sum + d.headcount, 0); // 105

// ─── Attendance Data (per filter) ──────────────────────────────────────
export const ATTENDANCE_BY_FILTER: Record<string, AttendanceData> = {
  today: { label: 'Today', present: 89, absent: 3, halfDay: 4, onLeave: 9 },
  week: { label: 'This Week (Avg)', present: 87, absent: 5, halfDay: 5, onLeave: 8 },
  month: { label: 'This Month (Avg)', present: 85, absent: 6, halfDay: 6, onLeave: 8 },
};

// Derived from today's data
export const PRESENT_TODAY = ATTENDANCE_BY_FILTER.today.present;
export const ABSENT_TODAY = ATTENDANCE_BY_FILTER.today.absent;
export const ON_LEAVE_TODAY = ATTENDANCE_BY_FILTER.today.onLeave;

// ─── Leave Requests ────────────────────────────────────────────────────
export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lr_1',
    employeeName: 'Marcus Chen',
    employeeId: 'DF-1092',
    department: 'Engineering',
    leaveType: 'Annual Vacation',
    startDate: 'Sep 12, 2026',
    endDate: 'Sep 16, 2026',
    days: 5,
    reason: 'Family reunion trip to Vancouver.',
    status: 'pending',
    appliedOn: 'Aug 20, 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop',
  },
  {
    id: 'lr_2',
    employeeName: 'Sofia Rodriguez',
    employeeId: 'DF-2041',
    department: 'Marketing',
    leaveType: 'Sick Leave',
    startDate: 'Aug 24, 2026',
    endDate: 'Aug 25, 2026',
    days: 2,
    reason: 'Medical appointment and recovery.',
    status: 'pending',
    appliedOn: 'Aug 21, 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop',
  },
  {
    id: 'lr_3',
    employeeName: 'David Kim',
    employeeId: 'DF-3118',
    department: 'Finance',
    leaveType: 'Floating Holiday',
    startDate: 'Sep 01, 2026',
    endDate: 'Sep 01, 2026',
    days: 1,
    reason: 'Personal day — moving to new apartment.',
    status: 'pending',
    appliedOn: 'Aug 19, 2026',
  },
  {
    id: 'lr_4',
    employeeName: 'Zara Patel',
    employeeId: 'DF-4089',
    department: 'Operations',
    leaveType: 'Annual Vacation',
    startDate: 'Oct 05, 2026',
    endDate: 'Oct 09, 2026',
    days: 5,
    reason: 'Planned vacation to Bali with spouse.',
    status: 'pending',
    appliedOn: 'Aug 18, 2026',
  },
  {
    id: 'lr_5',
    employeeName: 'Liam Brooks',
    employeeId: 'DF-5220',
    department: 'Engineering',
    leaveType: 'Sick Leave',
    startDate: 'Aug 28, 2026',
    endDate: 'Aug 29, 2026',
    days: 2,
    reason: 'Flu symptoms and doctor-advised rest.',
    status: 'pending',
    appliedOn: 'Aug 22, 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=250&auto=format&fit=crop',
  },
  {
    id: 'lr_6',
    employeeName: 'Priya Sharma',
    employeeId: 'DF-6310',
    department: 'HR',
    leaveType: 'Maternity Leave',
    startDate: 'Sep 15, 2026',
    endDate: 'Dec 15, 2026',
    days: 65,
    reason: 'Maternity leave as per company policy.',
    status: 'pending',
    appliedOn: 'Aug 10, 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=250&auto=format&fit=crop',
  },
];

// ─── Payroll ───────────────────────────────────────────────────────────
export const PAYROLL = {
  month: 'August 2026',
  totalAmount: '$428,500',
  status: 'Processing' as const,
  disbursementDate: 'Aug 31, 2026',
  daysRemaining: 9,
  processed: 78,
  pending: 27,
};

// ─── Weekly Attendance Trend (for bar chart) ───────────────────────────
export const WEEKLY_ATTENDANCE_TREND = [
  { day: 'Mon', present: 92, absent: 4, halfDay: 3, onLeave: 6 },
  { day: 'Tue', present: 88, absent: 5, halfDay: 5, onLeave: 7 },
  { day: 'Wed', present: 90, absent: 3, halfDay: 4, onLeave: 8 },
  { day: 'Thu', present: 87, absent: 6, halfDay: 5, onLeave: 7 },
  { day: 'Fri', present: 85, absent: 7, halfDay: 6, onLeave: 7 },
];

// ─── Monthly Attendance Trend (for bar chart) ──────────────────────────
export const MONTHLY_ATTENDANCE_TREND = [
  { day: 'Week 1', present: 90, absent: 4, halfDay: 4, onLeave: 7 },
  { day: 'Week 2', present: 88, absent: 5, halfDay: 5, onLeave: 7 },
  { day: 'Week 3', present: 86, absent: 6, halfDay: 6, onLeave: 7 },
  { day: 'Week 4', present: 85, absent: 6, halfDay: 6, onLeave: 8 },
];

// ─── Organization Activity ─────────────────────────────────────────────
export const ORG_ACTIVITIES: OrgActivity[] = [
  {
    id: 'oa_1',
    type: 'hire',
    title: 'New hire onboarded',
    description: 'Maya Lin joined Engineering as Product Marketing Manager.',
    timestamp: '30 min ago',
    actor: 'Eleanor Vance',
  },
  {
    id: 'oa_2',
    type: 'leave',
    title: 'Leave approved',
    description: 'Annual vacation for James Wright (Operations) approved for Sep 1–5.',
    timestamp: '2 hours ago',
    actor: 'Eleanor Vance',
  },
  {
    id: 'oa_3',
    type: 'payroll',
    title: 'Payroll cycle initiated',
    description: 'August 2026 payroll processing started. 78 of 105 employees processed.',
    timestamp: '4 hours ago',
    actor: 'System',
  },
  {
    id: 'oa_4',
    type: 'promotion',
    title: 'Promotion recorded',
    description: 'Sarah Park promoted from Marketing Coordinator to Marketing Manager.',
    timestamp: '1 day ago',
    actor: 'Eleanor Vance',
  },
  {
    id: 'oa_5',
    type: 'policy',
    title: 'Policy update published',
    description: 'Updated Remote Work & Equipment Reimbursement guidelines published company-wide.',
    timestamp: '2 days ago',
    actor: 'HR Team',
  },
  {
    id: 'oa_6',
    type: 'hire',
    title: 'Offer letter sent',
    description: 'Offer letter dispatched to candidate Rahul Mehta for Senior DevOps Engineer.',
    timestamp: '3 days ago',
    actor: 'Eleanor Vance',
  },
];
