export type LeaveType = 'Paid' | 'Sick' | 'Unpaid';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  avatarUrl?: string;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  days: number;
  reason: string;
  status: LeaveStatus;
  submittedAt: string; // e.g. "Aug 21, 2026"
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface LeaveBalances {
  annualPaid: number; // e.g. 12
  annualTotal: number; // e.g. 20
  sick: number; // e.g. 8
  sickTotal: number; // e.g. 10
  unpaidTaken: number; // e.g. 0
}

export interface SubmitLeavePayload {
  employeeId: string;
  employeeName: string;
  department: string;
  avatarUrl?: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}
