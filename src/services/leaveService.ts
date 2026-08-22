import type {
  LeaveRequest,
  LeaveBalances,
  SubmitLeavePayload,
} from '../types/leave';

const LEAVE_REQUESTS_KEY = 'dayflow_leave_requests';
const LEAVE_BALANCES_KEY = 'dayflow_leave_balances';

const delay = (ms: number = 200) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calculates the number of working days (Mon-Fri) between two dates inclusive.
 */
export function calculateLeaveDays(startDateStr: string, endDateStr: string): number {
  if (!startDateStr || !endDateStr) return 0;

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    return 0;
  }

  let count = 0;
  const current = new Date(start);

  while (current <= end) {
    const dayOfWeek = current.getDay();
    // Exclude weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return Math.max(1, count);
}

// Default initial seed data
const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lr_am_pending',
    employeeId: 'DF-4089',
    employeeName: 'Alex Morgan',
    department: 'Product Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
    leaveType: 'Paid',
    startDate: '2026-09-14',
    endDate: '2026-09-18',
    days: 5,
    reason: 'Annual family vacation trip to California',
    status: 'Pending',
    submittedAt: 'Aug 21, 2026',
  },
  {
    id: 'lr_am_approved',
    employeeId: 'DF-4089',
    employeeName: 'Alex Morgan',
    department: 'Product Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
    leaveType: 'Paid',
    startDate: '2026-08-19',
    endDate: '2026-08-19',
    days: 1,
    reason: 'Personal appointment and document processing',
    status: 'Approved',
    submittedAt: 'Aug 15, 2026',
    reviewedBy: 'Eleanor Vance (HR)',
    reviewedAt: 'Aug 16, 2026',
  },
  {
    id: 'lr_am_rejected',
    employeeId: 'DF-4089',
    employeeName: 'Alex Morgan',
    department: 'Product Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
    leaveType: 'Paid',
    startDate: '2026-07-01',
    endDate: '2026-07-03',
    days: 3,
    reason: 'Short road trip',
    status: 'Rejected',
    submittedAt: 'Jun 25, 2026',
    reviewedBy: 'Eleanor Vance (HR)',
    reviewedAt: 'Jun 26, 2026',
    rejectionReason: 'Overlaps with critical Q3 platform launch deployment window.',
  },
  {
    id: 'lr_mc_1',
    employeeId: 'DF-1092',
    employeeName: 'Marcus Chen',
    department: 'Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop',
    leaveType: 'Paid',
    startDate: '2026-09-12',
    endDate: '2026-09-16',
    days: 5,
    reason: 'Attending global distributed systems conference',
    status: 'Pending',
    submittedAt: 'Aug 20, 2026',
  },
  {
    id: 'lr_sr_1',
    employeeId: 'DF-2041',
    employeeName: 'Sofia Rodriguez',
    department: 'Product Design',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop',
    leaveType: 'Sick',
    startDate: '2026-08-24',
    endDate: '2026-08-25',
    days: 2,
    reason: 'Dental wisdom surgery recovery',
    status: 'Pending',
    submittedAt: 'Aug 21, 2026',
  },
  {
    id: 'lr_dk_1',
    employeeId: 'DF-3118',
    employeeName: 'David Kim',
    department: 'Sales & BD',
    leaveType: 'Unpaid',
    startDate: '2026-09-01',
    endDate: '2026-09-02',
    days: 2,
    reason: 'Apartment relocation and personal logistics',
    status: 'Pending',
    submittedAt: 'Aug 22, 2026',
  },
  {
    id: 'lr_zp_1',
    employeeId: 'DF-4090',
    employeeName: 'Zara Patel',
    department: 'Operations',
    leaveType: 'Sick',
    startDate: '2026-08-10',
    endDate: '2026-08-11',
    days: 2,
    reason: 'Severe seasonal flu recovery',
    status: 'Approved',
    submittedAt: 'Aug 09, 2026',
    reviewedBy: 'Eleanor Vance (HR)',
    reviewedAt: 'Aug 09, 2026',
  },
];

const DEFAULT_BALANCES: Record<string, LeaveBalances> = {
  'DF-4089': {
    annualPaid: 12,
    annualTotal: 20,
    sick: 8,
    sickTotal: 10,
    unpaidTaken: 0,
  },
};

function getStoredRequests(): LeaveRequest[] {
  try {
    const raw = localStorage.getItem(LEAVE_REQUESTS_KEY);
    if (!raw) {
      localStorage.setItem(LEAVE_REQUESTS_KEY, JSON.stringify(INITIAL_LEAVE_REQUESTS));
      return [...INITIAL_LEAVE_REQUESTS];
    }
    return JSON.parse(raw) as LeaveRequest[];
  } catch {
    return [...INITIAL_LEAVE_REQUESTS];
  }
}

function saveRequests(requests: LeaveRequest[]) {
  try {
    localStorage.setItem(LEAVE_REQUESTS_KEY, JSON.stringify(requests));
    window.dispatchEvent(new Event('dayflow_leave_updated'));
  } catch (err) {
    console.error('Failed to save leave requests', err);
  }
}

function getStoredBalances(employeeId: string): LeaveBalances {
  try {
    const raw = localStorage.getItem(LEAVE_BALANCES_KEY);
    const map = raw ? JSON.parse(raw) : DEFAULT_BALANCES;
    return (
      map[employeeId.toUpperCase()] || {
        annualPaid: 12,
        annualTotal: 20,
        sick: 8,
        sickTotal: 10,
        unpaidTaken: 0,
      }
    );
  } catch {
    return {
      annualPaid: 12,
      annualTotal: 20,
      sick: 8,
      sickTotal: 10,
      unpaidTaken: 0,
    };
  }
}

function saveBalances(employeeId: string, balances: LeaveBalances) {
  try {
    const raw = localStorage.getItem(LEAVE_BALANCES_KEY);
    const map = raw ? JSON.parse(raw) : DEFAULT_BALANCES;
    map[employeeId.toUpperCase()] = balances;
    localStorage.setItem(LEAVE_BALANCES_KEY, JSON.stringify(map));
    window.dispatchEvent(new Event('dayflow_leave_updated'));
  } catch (err) {
    console.error('Failed to save leave balances', err);
  }
}

export const leaveService = {
  /**
   * Get all leave requests for a specific employee
   */
  async getEmployeeLeaveRequests(employeeId: string): Promise<LeaveRequest[]> {
    await delay(100);
    const requests = getStoredRequests();
    return requests.filter(
      (r) => r.employeeId.toUpperCase() === employeeId.toUpperCase()
    );
  },

  /**
   * Get current leave balances for an employee
   */
  async getEmployeeBalances(employeeId: string): Promise<LeaveBalances> {
    await delay(100);
    return getStoredBalances(employeeId);
  },

  /**
   * Submit a new leave request
   */
  async submitLeaveRequest(payload: SubmitLeavePayload): Promise<LeaveRequest> {
    await delay(300);

    const days = calculateLeaveDays(payload.startDate, payload.endDate);
    if (days <= 0) {
      throw new Error('Please select a valid date range.');
    }

    if (!payload.reason.trim()) {
      throw new Error('Please provide a reason for the leave request.');
    }

    const balances = getStoredBalances(payload.employeeId);
    if (payload.leaveType === 'Paid' && days > balances.annualPaid) {
      throw new Error(
        `Insufficient Paid Leave balance. You requested ${days} days but have ${balances.annualPaid} days available.`
      );
    }
    if (payload.leaveType === 'Sick' && days > balances.sick) {
      throw new Error(
        `Insufficient Sick Leave balance. You requested ${days} days but have ${balances.sick} days available.`
      );
    }

    const todayStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const newRequest: LeaveRequest = {
      id: `lr_${Date.now()}`,
      employeeId: payload.employeeId.toUpperCase(),
      employeeName: payload.employeeName,
      department: payload.department,
      avatarUrl: payload.avatarUrl,
      leaveType: payload.leaveType,
      startDate: payload.startDate,
      endDate: payload.endDate,
      days,
      reason: payload.reason.trim(),
      status: 'Pending',
      submittedAt: todayStr,
    };

    const requests = getStoredRequests();
    requests.unshift(newRequest);
    saveRequests(requests);

    return newRequest;
  },

  /**
   * Get all workforce leave requests (HR / Admin)
   */
  async getAllLeaveRequests(): Promise<LeaveRequest[]> {
    await delay(150);
    return getStoredRequests();
  },

  /**
   * Approve a leave request (HR / Admin)
   */
  async approveLeaveRequest(
    requestId: string,
    reviewerName: string = 'Eleanor Vance (HR)'
  ): Promise<LeaveRequest> {
    await delay(250);
    const requests = getStoredRequests();
    const index = requests.findIndex((r) => r.id === requestId);

    if (index < 0) {
      throw new Error('Leave request not found.');
    }

    const req = requests[index];
    const todayStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const updated: LeaveRequest = {
      ...req,
      status: 'Approved',
      reviewedBy: reviewerName,
      reviewedAt: todayStr,
      rejectionReason: undefined,
    };

    requests[index] = updated;
    saveRequests(requests);

    // Deduct balances if Paid or Sick
    const balances = getStoredBalances(req.employeeId);
    if (req.leaveType === 'Paid') {
      balances.annualPaid = Math.max(0, balances.annualPaid - req.days);
      saveBalances(req.employeeId, balances);
    } else if (req.leaveType === 'Sick') {
      balances.sick = Math.max(0, balances.sick - req.days);
      saveBalances(req.employeeId, balances);
    } else if (req.leaveType === 'Unpaid') {
      balances.unpaidTaken += req.days;
      saveBalances(req.employeeId, balances);
    }

    return updated;
  },

  /**
   * Reject a leave request with mandatory comment (HR / Admin)
   */
  async rejectLeaveRequest(
    requestId: string,
    rejectionReason: string,
    reviewerName: string = 'Eleanor Vance (HR)'
  ): Promise<LeaveRequest> {
    await delay(250);
    if (!rejectionReason.trim()) {
      throw new Error('A rejection reason or comment is required.');
    }

    const requests = getStoredRequests();
    const index = requests.findIndex((r) => r.id === requestId);

    if (index < 0) {
      throw new Error('Leave request not found.');
    }

    const req = requests[index];
    const todayStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const updated: LeaveRequest = {
      ...req,
      status: 'Rejected',
      reviewedBy: reviewerName,
      reviewedAt: todayStr,
      rejectionReason: rejectionReason.trim(),
    };

    requests[index] = updated;
    saveRequests(requests);

    return updated;
  },

  /**
   * Get count of pending leave requests
   */
  async getPendingCount(): Promise<number> {
    const requests = getStoredRequests();
    return requests.filter((r) => r.status === 'Pending').length;
  },
};
