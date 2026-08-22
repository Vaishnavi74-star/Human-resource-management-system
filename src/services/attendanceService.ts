import type {
  AttendanceRecord,
  WeeklyAttendanceDay,
  AttendanceFilterParams,
  AttendanceSummaryStats,
} from '../types/attendance';
import {
  calculateWorkingHoursString,
  calculateWorkingMinutes,
  getCurrentTimeString,
} from '../utils/timeCalculators';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const ATTENDANCE_STORAGE_KEY = 'dayflow_attendance_records';
const delay = (ms: number = 200) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate dynamic Monday-Friday dates for current week
function getWeekDates(offsetWeeks: number = 0): { dayName: string; date: string; formattedDate: string }[] {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1) + offsetWeeks * 7;
  const monday = new Date(now.setDate(diffToMonday));

  const days: { dayName: string; date: string; formattedDate: string }[] = [];
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    days.push({
      dayName: dayNames[i],
      date: dateStr,
      formattedDate: formatted,
    });
  }

  return days;
}

const currentWeekDates = getWeekDates(0);

// Default seed data for historical reference
const INITIAL_ATTENDANCE_DB: AttendanceRecord[] = [
  // Alex Morgan (DF-4089) historical logs
  {
    id: 'att_am_1',
    employeeId: 'DF-4089',
    employeeName: 'Alex Morgan',
    department: 'Product Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
    date: currentWeekDates[0]?.date || '2026-08-17',
    checkIn: '09:02',
    checkOut: '17:32',
    status: 'Present',
    notes: 'On-time biometric entry',
  },
  {
    id: 'att_am_2',
    employeeId: 'DF-4089',
    employeeName: 'Alex Morgan',
    department: 'Product Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
    date: currentWeekDates[1]?.date || '2026-08-18',
    checkIn: '09:10',
    checkOut: '17:25',
    status: 'Present',
    notes: 'Normal schedule',
  },
  {
    id: 'att_am_3',
    employeeId: 'DF-4089',
    employeeName: 'Alex Morgan',
    department: 'Product Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
    date: currentWeekDates[2]?.date || '2026-08-19',
    checkIn: null,
    checkOut: null,
    status: 'Leave',
    notes: 'Approved Annual Paid Leave',
  },
  {
    id: 'att_am_4',
    employeeId: 'DF-4089',
    employeeName: 'Alex Morgan',
    department: 'Product Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
    date: currentWeekDates[3]?.date || '2026-08-20',
    checkIn: '09:30',
    checkOut: '13:00',
    status: 'Half-day',
    notes: 'Morning shift only',
  },

  // Marcus Chen (DF-1092)
  {
    id: 'att_mc_1',
    employeeId: 'DF-1092',
    employeeName: 'Marcus Chen',
    department: 'Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop',
    date: currentWeekDates[0]?.date || '2026-08-17',
    checkIn: '08:52',
    checkOut: '17:15',
    status: 'Present',
    notes: 'Completed standard 8h day',
  },

  // Sofia Rodriguez (DF-2041)
  {
    id: 'att_sr_1',
    employeeId: 'DF-2041',
    employeeName: 'Sofia Rodriguez',
    department: 'Product Design',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop',
    date: currentWeekDates[1]?.date || '2026-08-18',
    checkIn: null,
    checkOut: null,
    status: 'Leave',
    notes: 'Approved Medical Sick Leave',
  },
];

function getStoredRecords(): AttendanceRecord[] {
  try {
    const raw = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(INITIAL_ATTENDANCE_DB));
      return [...INITIAL_ATTENDANCE_DB];
    }
    return JSON.parse(raw) as AttendanceRecord[];
  } catch {
    return [...INITIAL_ATTENDANCE_DB];
  }
}

function saveRecords(records: AttendanceRecord[]) {
  try {
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(records));
    window.dispatchEvent(new Event('dayflow_attendance_updated'));
  } catch (err) {
    console.error('Failed to save attendance records', err);
  }
}

export const attendanceService = {
  /**
   * Get today's attendance record for an employee
   */
  async getTodayAttendance(
    employeeId: string,
    employeeName: string = 'Alex Morgan',
    department: string = 'Product Engineering'
  ): Promise<AttendanceRecord> {
    await delay(80);
    const todayDate = new Date().toISOString().split('T')[0];
    const records = getStoredRecords();

    // 1. Try finding today's record in local storage
    const found = records.find(
      (r) => r.employeeId.toUpperCase() === employeeId.toUpperCase() && r.date === todayDate
    );

    if (found) {
      return found;
    }

    // 2. Return a fresh record ready for clock in
    const defaultRecord: AttendanceRecord = {
      id: `att_${employeeId}_${todayDate}`,
      employeeId: employeeId.toUpperCase(),
      employeeName,
      department,
      date: todayDate,
      checkIn: null,
      checkOut: null,
      status: 'Absent',
    };

    return defaultRecord;
  },

  /**
   * Clock in employee for today
   */
  async checkIn(
    employeeId: string,
    employeeName: string = 'Alex Morgan',
    department: string = 'Product Engineering'
  ): Promise<AttendanceRecord> {
    await delay(250);
    const records = getStoredRecords();
    const todayDate = new Date().toISOString().split('T')[0];
    const timeNow = getCurrentTimeString(true);

    const index = records.findIndex(
      (r) => r.employeeId.toUpperCase() === employeeId.toUpperCase() && r.date === todayDate
    );

    let updated: AttendanceRecord;

    if (index >= 0) {
      updated = {
        ...records[index],
        checkIn: timeNow,
        checkOut: null,
        status: 'Working',
        notes: 'Live biometric workday entry',
      };
      records[index] = updated;
    } else {
      updated = {
        id: `att_${employeeId}_${Date.now()}`,
        employeeId: employeeId.toUpperCase(),
        employeeName,
        department,
        date: todayDate,
        checkIn: timeNow,
        checkOut: null,
        status: 'Working',
        notes: 'Live biometric workday entry',
      };
      records.push(updated);
    }

    saveRecords(records);

    // Sync to Supabase if active
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('attendance').upsert({
          employee_id: employeeId.toUpperCase(),
          date: todayDate,
          check_in: timeNow,
          status: 'Working',
          notes: 'Biometric web punch',
        });
      } catch (err) {
        console.warn('Supabase attendance sync warning:', err);
      }
    }

    return updated;
  },

  /**
   * Clock out employee for today
   */
  async checkOut(employeeId: string): Promise<AttendanceRecord> {
    await delay(250);
    const records = getStoredRecords();
    const todayDate = new Date().toISOString().split('T')[0];
    const timeNow = getCurrentTimeString(true);

    let index = records.findIndex(
      (r) => r.employeeId.toUpperCase() === employeeId.toUpperCase() && r.date === todayDate
    );

    if (index < 0) {
      // Create record with default morning checkin if none existed
      const autoIn: AttendanceRecord = {
        id: `att_${employeeId}_${Date.now()}`,
        employeeId: employeeId.toUpperCase(),
        employeeName: 'Alex Morgan',
        department: 'Product Engineering',
        date: todayDate,
        checkIn: '09:00',
        checkOut: timeNow,
        status: 'Present',
        notes: `Clocked out at ${timeNow}`,
      };
      records.push(autoIn);
      saveRecords(records);
      return autoIn;
    }

    const checkInTime = records[index].checkIn || '09:00';
    const minutes = calculateWorkingMinutes(checkInTime, timeNow);
    const finalStatus = minutes < 300 && minutes > 0 ? 'Half-day' : 'Present';

    const updated: AttendanceRecord = {
      ...records[index],
      checkOut: timeNow,
      status: finalStatus,
      notes: `Clocked out at ${timeNow}`,
    };

    records[index] = updated;
    saveRecords(records);

    // Sync to Supabase if active
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('attendance').upsert({
          employee_id: employeeId.toUpperCase(),
          date: todayDate,
          check_in: checkInTime,
          check_out: timeNow,
          status: finalStatus,
          notes: `Clocked out at ${timeNow}`,
        });
      } catch (err) {
        console.warn('Supabase attendance sync warning:', err);
      }
    }

    return updated;
  },

  /**
   * Reset punch for testing purposes
   */
  async resetTodayPunch(employeeId: string): Promise<AttendanceRecord> {
    const todayDate = new Date().toISOString().split('T')[0];
    const records = getStoredRecords();
    const filtered = records.filter(
      (r) => !(r.employeeId.toUpperCase() === employeeId.toUpperCase() && r.date === todayDate)
    );
    saveRecords(filtered);

    return {
      id: `att_${employeeId}_${todayDate}`,
      employeeId: employeeId.toUpperCase(),
      employeeName: 'Alex Morgan',
      department: 'Product Engineering',
      date: todayDate,
      checkIn: null,
      checkOut: null,
      status: 'Absent',
    };
  },

  /**
   * Get 5-day weekly attendance breakdown for an employee
   */
  async getWeeklyAttendance(
    employeeId: string,
    weekOffset: number = 0
  ): Promise<{
    days: WeeklyAttendanceDay[];
    totalMinutes: number;
    formattedTotalHours: string;
    presentDaysCount: number;
    attendancePercentage: number;
  }> {
    await delay(120);
    const records = getStoredRecords();
    const weekDates = getWeekDates(weekOffset);

    const days: WeeklyAttendanceDay[] = weekDates.map((wDate) => {
      const match = records.find(
        (r) => r.employeeId.toUpperCase() === employeeId.toUpperCase() && r.date === wDate.date
      );

      const checkIn = match ? match.checkIn : null;
      const checkOut = match ? match.checkOut : null;
      const status = match ? match.status : 'Absent';
      const calculatedHours = calculateWorkingHoursString(checkIn, checkOut, status);
      const minutesWorked = calculateWorkingMinutes(checkIn, checkOut);

      return {
        dayName: wDate.dayName,
        date: wDate.date,
        formattedDate: wDate.formattedDate,
        checkIn,
        checkOut,
        calculatedHours,
        minutesWorked,
        status,
        record: match,
      };
    });

    const totalMinutes = days.reduce((acc, d) => acc + d.minutesWorked, 0);
    const formattedTotalHours = `${Math.floor(totalMinutes / 60)}h ${(totalMinutes % 60)
      .toString()
      .padStart(2, '0')}m`;

    const presentDaysCount = days.filter((d) => d.status === 'Present' || d.status === 'Working').length;
    const attendancePercentage = Math.round((presentDaysCount / 5) * 100);

    return {
      days,
      totalMinutes,
      formattedTotalHours,
      presentDaysCount,
      attendancePercentage,
    };
  },

  /**
   * Get all workforce records with flexible filters (Admin/HR only)
   */
  async getAllWorkforceAttendance(
    filters: AttendanceFilterParams
  ): Promise<{
    records: AttendanceRecord[];
    stats: AttendanceSummaryStats;
  }> {
    await delay(150);
    let records = getStoredRecords();

    // Filter by search (name or ID)
    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      records = records.filter(
        (r) =>
          r.employeeName.toLowerCase().includes(q) ||
          r.employeeId.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q)
      );
    }

    // Filter by department
    if (filters.department && filters.department !== 'all') {
      records = records.filter((r) => r.department.toLowerCase() === filters.department?.toLowerCase());
    }

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      records = records.filter((r) => r.status.toLowerCase() === filters.status?.toLowerCase());
    }

    // Filter by specific date if requested
    if (filters.date) {
      records = records.filter((r) => r.date === filters.date);
    }

    const totalEmployees = 148;
    const presentToday = records.filter((r) => r.status === 'Present' || r.status === 'Working').length;
    const onLeaveToday = records.filter((r) => r.status === 'Leave').length;
    const halfDayToday = records.filter((r) => r.status === 'Half-day').length;
    const absentToday = records.filter((r) => r.status === 'Absent').length;
    const attendanceRate = Math.round(((presentToday + halfDayToday * 0.5) / (records.length || 1)) * 100);

    return {
      records,
      stats: {
        totalEmployees,
        presentToday,
        onLeaveToday,
        halfDayToday,
        absentToday,
        attendanceRate: isNaN(attendanceRate) ? 96 : attendanceRate,
      },
    };
  },
};
