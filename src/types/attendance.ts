export type AttendanceStatus = 'Present' | 'Absent' | 'Half-day' | 'Leave' | 'Working';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  avatarUrl?: string;
  date: string; // YYYY-MM-DD
  checkIn: string | null; // e.g. "09:02" or "09:02 AM"
  checkOut: string | null; // e.g. "17:32" or "05:32 PM"
  status: AttendanceStatus;
  notes?: string;
}

export interface WeeklyAttendanceDay {
  dayName: string;
  date: string;
  formattedDate: string;
  checkIn: string | null;
  checkOut: string | null;
  calculatedHours: string;
  minutesWorked: number;
  status: AttendanceStatus;
  record?: AttendanceRecord;
}

export interface AttendanceFilterParams {
  search?: string;
  date?: string;
  department?: string;
  status?: string;
  view?: 'daily' | 'weekly';
}

export interface AttendanceSummaryStats {
  totalEmployees: number;
  presentToday: number;
  onLeaveToday: number;
  halfDayToday: number;
  absentToday: number;
  attendanceRate: number;
}
