import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { attendanceService } from '../../services/attendanceService';
import { notificationService } from '../../services/notificationService';
import type { AttendanceRecord, WeeklyAttendanceDay, AttendanceStatus } from '../../types/attendance';
import { calculateWorkingHoursString } from '../../utils/timeCalculators';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import {
  Clock,
  CalendarCheck,
  Play,
  Square,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  FileCheck,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const EmployeeAttendancePage: React.FC = () => {
  const { user } = useAuth();
  const { success, info, error: toastError } = useToast();

  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [weeklyDays, setWeeklyDays] = useState<WeeklyAttendanceDay[]>([]);
  const [totalWeeklyHours, setTotalWeeklyHours] = useState<string>('00h 00m');
  const [attendancePct, setAttendancePct] = useState<number>(0);
  const [weekOffset, setWeekOffset] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Live timer for working session
  const [liveDuration, setLiveDuration] = useState<string>('00h 00m 00s');

  const employeeId = user?.employeeId || 'DF-4089';
  const employeeName = user?.name || 'Alex Morgan';
  const department = user?.department || 'Product Engineering';

  const loadAttendance = useCallback(async () => {
    try {
      setHasError(false);
      const today = await attendanceService.getTodayAttendance(employeeId, employeeName, department);
      setTodayRecord(today);

      const weekly = await attendanceService.getWeeklyAttendance(employeeId, weekOffset);
      setWeeklyDays(weekly.days);
      setTotalWeeklyHours(weekly.formattedTotalHours);
      setAttendancePct(weekly.attendancePercentage);
    } catch (err) {
      console.error('Failed to load attendance data', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [employeeId, employeeName, department, weekOffset]);

  useEffect(() => {
    loadAttendance();

    // Listen for storage events (e.g. if updated from EmployeeDashboard)
    const handleSync = () => loadAttendance();
    window.addEventListener('dayflow_attendance_updated', handleSync);
    return () => window.removeEventListener('dayflow_attendance_updated', handleSync);
  }, [loadAttendance]);

  // Live seconds ticker if status is 'Working'
  useEffect(() => {
    if (todayRecord?.status !== 'Working' || !todayRecord?.checkIn) {
      return;
    }

    const updateTicker = () => {
      const parts = (todayRecord.checkIn || '09:00').split(':');
      const startH = parseInt(parts[0], 10) || 9;
      const startM = parseInt(parts[1], 10) || 0;
      const now = new Date();
      const diffSec = Math.max(
        0,
        Math.floor((now.getTime() - new Date().setHours(startH, startM, 0, 0)) / 1000)
      );

      const h = Math.floor(diffSec / 3600);
      const m = Math.floor((diffSec % 3600) / 60);
      const s = diffSec % 60;
      setLiveDuration(
        `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s
          .toString()
          .padStart(2, '0')}s`
      );
    };

    updateTicker();
    const interval = setInterval(updateTicker, 1000);
    return () => clearInterval(interval);
  }, [todayRecord]);

  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      const updated = await attendanceService.checkIn(employeeId, employeeName, department);
      setTodayRecord(updated);
      await loadAttendance();
      
      notificationService.addNotification({
        userId: user?.id || '',
        title: 'Checked In',
        message: `You successfully checked in at ${updated.checkIn}. Have a great day!`,
        type: 'success'
      });

      success(
        'Checked In Successfully',
        `Good morning, ${employeeName}! Work session recorded at ${updated.checkIn}.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to check in';
      toastError('Check-in Error', msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      const updated = await attendanceService.checkOut(employeeId);
      setTodayRecord(updated);
      await loadAttendance();
      
      notificationService.addNotification({
        userId: user?.id || '',
        title: 'Checked Out',
        message: `You successfully checked out at ${updated.checkOut}. See you tomorrow!`,
        type: 'info'
      });

      info(
        'Clocked Out for Today',
        `Workday completed at ${updated.checkOut}. Status recorded as ${updated.status}.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to check out';
      toastError('Check-out Error', msg);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'Present':
        return <Badge variant="success" size="sm" dot>Present</Badge>;
      case 'Working':
        return <Badge variant="primary" size="sm" dot>Working Now</Badge>;
      case 'Half-day':
        return <Badge variant="warning" size="sm">Half-day</Badge>;
      case 'Leave':
        return <Badge variant="neutral" size="sm">On Leave</Badge>;
      case 'Absent':
        return <Badge variant="error" size="sm">Absent</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingState message="Loading your attendance records & weekly timesheets..." />
      </div>
    );
  }

  if (hasError) {
    return (
      <ErrorState
        title="Failed to Load Attendance Records"
        message="An error occurred while fetching your time and attendance log."
        onRetry={loadAttendance}
      />
    );
  }

  const isCheckedIn = todayRecord?.status === 'Working';

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-900 via-indigo-800 to-indigo-700 text-white p-6 sm:p-8 shadow-lg shadow-indigo-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Time & Attendance Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
              My Attendance & Timesheet
            </h1>
            <p className="text-sm text-indigo-100/90 leading-relaxed">
              Track your daily check-in times, biometric stamps, and calculate weekly working hours.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-right">
              <p className="text-[11px] text-indigo-200 uppercase font-semibold">Current System Date</p>
              <p className="text-sm font-bold text-white">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 1. Today's Attendance Overview Card */}
      <Card className="border-indigo-100/80 shadow-md">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base">Today's Attendance Status</CardTitle>
                <CardDescription>
                  {todayRecord?.date
                    ? new Date(todayRecord.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Today'}
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {todayRecord && getStatusBadge(todayRecord.status)}
              {isCheckedIn ? (
                <Button
                  variant="danger"
                  size="md"
                  onClick={handleCheckOut}
                  isLoading={actionLoading}
                  leftIcon={<Square className="w-4 h-4" />}
                >
                  Clock Out
                </Button>
              ) : (
                <Button
                  variant="success"
                  size="md"
                  onClick={handleCheckIn}
                  isLoading={actionLoading}
                  leftIcon={<Play className="w-4 h-4" />}
                >
                  Clock In to Start Day
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Check In */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Check In</p>
              <p className="text-2xl font-black text-slate-900 mt-1 font-mono">
                {todayRecord?.checkIn || '--:--'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {todayRecord?.checkIn ? 'Biometric timestamp' : 'No check-in recorded'}
              </p>
            </div>

            {/* Metric 2: Check Out */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Check Out</p>
              <p className="text-2xl font-black text-slate-900 mt-1 font-mono">
                {todayRecord?.checkOut || (isCheckedIn ? 'In Session' : '--:--')}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {todayRecord?.checkOut ? 'Evening sign-off' : isCheckedIn ? 'Active on duty' : 'Pending checkout'}
              </p>
            </div>

            {/* Metric 3: Working Hours */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Calculated Hours</p>
              <p className="text-2xl font-black text-indigo-700 mt-1 font-mono">
                {isCheckedIn
                  ? liveDuration
                  : calculateWorkingHoursString(todayRecord?.checkIn || null, todayRecord?.checkOut || null, todayRecord?.status)}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {isCheckedIn ? 'Live workday ticker' : 'Expected: 8h 00m standard'}
              </p>
            </div>

            {/* Metric 4: Status / Notes */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Session Remarks</p>
              <p className="text-sm font-bold text-slate-800 mt-1 truncate">
                {todayRecord?.notes || 'Normal attendance log'}
              </p>
              <p className="text-xs text-emerald-600 font-medium mt-1">
                Policy Compliant
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Weekly Attendance View */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <div>
              <CardTitle className="text-base">Weekly Attendance Timesheet</CardTitle>
              <CardDescription>
                Calculated working hours and daily biometric check-ins
              </CardDescription>
            </div>

            {/* Week Offset Navigation Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="xs"
                onClick={() => setWeekOffset((prev) => prev - 1)}
                leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
              >
                Previous Week
              </Button>
              <Badge variant="primary" size="sm">
                {weekOffset === 0 ? 'Current Week' : `${Math.abs(weekOffset)} week(s) ${weekOffset < 0 ? 'ago' : 'ahead'}`}
              </Badge>
              <Button
                variant="outline"
                size="xs"
                onClick={() => setWeekOffset((prev) => prev + 1)}
                disabled={weekOffset >= 1}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                Next Week
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {weeklyDays.length === 0 ? (
            <EmptyState
              icon={<Calendar className="w-8 h-8 text-slate-400" />}
              title="No Attendance Logs Found"
              description="No check-in activity was recorded for the selected week interval."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4 rounded-l-xl">Date & Day</th>
                    <th className="py-3 px-4">Check In</th>
                    <th className="py-3 px-4">Check Out</th>
                    <th className="py-3 px-4">Working Hours</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 rounded-r-xl">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {weeklyDays.map((day) => {
                    const isToday = day.date === new Date().toISOString().split('T')[0];
                    return (
                      <tr
                        key={day.date}
                        className={cn(
                          'hover:bg-slate-50/70 transition-colors',
                          isToday && 'bg-indigo-50/40 font-semibold'
                        )}
                      >
                        {/* Day & Date */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{day.dayName}</span>
                            <span className="text-slate-400 font-normal">({day.formattedDate})</span>
                            {isToday && (
                              <span className="text-[10px] bg-indigo-600 text-white font-bold px-1.5 py-0.2 rounded-md">
                                Today
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Check In */}
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                          {day.checkIn || '--:--'}
                        </td>

                        {/* Check Out */}
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                          {day.checkOut || (day.status === 'Working' ? '--' : '--:--')}
                        </td>

                        {/* Calculated Hours */}
                        <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                          {day.calculatedHours}
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4">
                          {getStatusBadge(day.status)}
                        </td>

                        {/* Notes */}
                        <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                          {day.record?.notes || (day.status === 'Leave' ? 'Paid Leave' : 'Standard')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Weekly Summary Metrics Row */}
          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Total Hours This Week</p>
                <p className="text-lg font-black text-slate-900">{totalWeeklyHours}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Attendance Rate</p>
                <p className="text-lg font-black text-slate-900">{attendancePct}% on-time</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Policy Compliance</p>
                <p className="text-lg font-black text-slate-900">100% Verified</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
