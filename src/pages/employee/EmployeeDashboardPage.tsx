import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { useDisclosure } from '../../hooks/useDisclosure';
import { attendanceService } from '../../services/attendanceService';
import { notificationService } from '../../services/notificationService';
import { leaveService, calculateLeaveDays } from '../../services/leaveService';
import type { AttendanceRecord } from '../../types/attendance';
import type { LeaveBalances, LeaveRequest, LeaveType } from '../../types/leave';
import { calculateWorkingHoursString } from '../../utils/timeCalculators';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Link } from 'react-router-dom';
import {
  Clock,
  CalendarCheck,
  Plane,
  HeartPulse,
  Coffee,
  Play,
  Square,
  Sparkles,
  FileText,
  CheckCircle2,
  Calendar,
  UserCheck,
  AlertCircle,
  Download,
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface ActivityItem {
  id: string;
  type: 'leave_submitted' | 'leave_approved' | 'profile_updated' | 'attendance_recorded';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act_1',
    type: 'leave_submitted',
    title: 'Leave Request Submitted',
    description: 'Annual Paid Leave request (Sep 14 - Sep 18, 5 days) submitted for review.',
    timestamp: '25 mins ago',
    icon: Plane,
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50',
  },
  {
    id: 'act_2',
    type: 'attendance_recorded',
    title: 'Biometric Attendance Synced',
    description: 'Morning check-in timestamp confirmed on Workday Terminal #2.',
    timestamp: 'Today at 09:00 AM',
    icon: Clock,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
  },
  {
    id: 'act_3',
    type: 'leave_approved',
    title: 'Time-Off Approved',
    description: 'Personal leave for Aug 19 was approved by Eleanor Vance (HR).',
    timestamp: '3 days ago',
    icon: CheckCircle2,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
  },
  {
    id: 'act_4',
    type: 'profile_updated',
    title: 'Workspace Role Confirmed',
    description: 'Designation updated to Senior Software Engineer in Product Engineering.',
    timestamp: 'Aug 10, 2026',
    icon: UserCheck,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50',
  },
];

export const EmployeeDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { success, info, error: toastError } = useToast();
  const applyLeaveModal = useDisclosure();

  const employeeId = user?.employeeId || 'DF-4089';
  const employeeName = user?.name || 'Alex Morgan';
  const department = user?.department || 'Product Engineering';

  // State Management
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalances>({
    annualPaid: 12,
    annualTotal: 20,
    sick: 8,
    sickTotal: 10,
    unpaidTaken: 0,
  });
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [liveDuration, setLiveDuration] = useState<string>('00h 00m 00s');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Apply Leave Modal State
  const [modalLeaveType, setModalLeaveType] = useState<LeaveType>('Paid');
  const [modalStart, setModalStart] = useState<string>('2026-09-21');
  const [modalEnd, setModalEnd] = useState<string>('2026-09-25');
  const [modalReason, setModalReason] = useState<string>('');
  const [modalError, setModalError] = useState<string>('');
  const [isSubmittingLeave, setIsSubmittingLeave] = useState<boolean>(false);

  const modalCalculatedDays = calculateLeaveDays(modalStart, modalEnd);

  // Greeting helper based on local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const loadDashboardData = useCallback(async () => {
    try {
      setHasError(false);
      const [todayAtt, balancesRes, requestsRes] = await Promise.all([
        attendanceService.getTodayAttendance(employeeId, employeeName, department),
        leaveService.getEmployeeBalances(employeeId),
        leaveService.getEmployeeLeaveRequests(employeeId),
      ]);

      setTodayRecord(todayAtt);
      setLeaveBalances(balancesRes);
      setLeaveRequests(requestsRes);
    } catch (err) {
      console.error('Failed to load employee dashboard data', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [employeeId, employeeName, department]);

  useEffect(() => {
    loadDashboardData();

    const handleSync = () => loadDashboardData();
    window.addEventListener('dayflow_attendance_updated', handleSync);
    window.addEventListener('dayflow_leave_updated', handleSync);
    return () => {
      window.removeEventListener('dayflow_attendance_updated', handleSync);
      window.removeEventListener('dayflow_leave_updated', handleSync);
    };
  }, [loadDashboardData]);

  // Live Timer for checked-in working session
  const isCheckedIn = todayRecord?.status === 'Working';

  useEffect(() => {
    if (!isCheckedIn || !todayRecord?.checkIn) {
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
  }, [isCheckedIn, todayRecord]);

  // Attendance Toggle: Check In / Check Out
  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      const updated = await attendanceService.checkIn(employeeId, employeeName, department);
      setTodayRecord(updated);
      
      notificationService.addNotification({
        userId: user?.id,
        title: 'Checked In',
        message: `You successfully checked in at ${updated.checkIn}. Have a great day!`,
        type: 'success'
      });

      success('Checked In', `Good morning, ${employeeName}! Work session started at ${updated.checkIn}. Live counter started.`);
      await loadDashboardData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Check-in failed';
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
      
      notificationService.addNotification({
        userId: user?.id,
        title: 'Checked Out',
        message: `You successfully checked out at ${updated.checkOut}. See you tomorrow!`,
        type: 'info'
      });

      info('Checked Out', `Workday completed at ${updated.checkOut}. Status recorded as ${updated.status}. Duration calculated.`);
      await loadDashboardData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Check-out failed';
      toastError('Check-out Error', msg);
    } finally {
      setActionLoading(false);
    }
  };

  // Leave Modal Submit
  const handleModalLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');

    if (modalCalculatedDays <= 0) {
      setModalError('Please choose a valid date range.');
      return;
    }

    if (!modalReason.trim()) {
      setModalError('Please provide a reason for your request.');
      return;
    }

    setIsSubmittingLeave(true);
    try {
      await leaveService.submitLeaveRequest({
        employeeId,
        employeeName,
        department,
        avatarUrl: user?.avatarUrl,
        leaveType: modalLeaveType,
        startDate: modalStart,
        endDate: modalEnd,
        reason: modalReason.trim(),
      });

      applyLeaveModal.close();
      setModalReason('');
      success(
        'Leave Request Submitted',
        `Your ${modalCalculatedDays}-day ${modalLeaveType} leave request was sent to HR.`
      );
      await loadDashboardData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed';
      setModalError(msg);
      toastError('Submission Error', msg);
    } finally {
      setIsSubmittingLeave(false);
    }
  };

  const pendingRequestsCount = leaveRequests.filter((r) => r.status === 'Pending').length;

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center">
        <LoadingState message="Loading your personal employee workspace & metrics..." />
      </div>
    );
  }

  if (hasError) {
    return (
      <ErrorState
        title="Failed to Load Dashboard"
        message="An error occurred while fetching your workspace overview."
        onRetry={loadDashboardData}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-900 via-indigo-800 to-indigo-700 text-white p-6 sm:p-8 shadow-xl shadow-indigo-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Dayflow Workplace Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
              {getGreeting()}, {user?.name ? user.name.split(' ')[0] : 'Alex'} 👋
            </h1>
            <p className="text-sm text-indigo-100/90 leading-relaxed">
              Here's your workday overview. {user?.title} &bull; {user?.department} &bull; ID:{' '}
              <strong className="text-white font-mono">{user?.employeeId || 'DF-4089'}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="white"
              size="md"
              onClick={() => {
                setModalError('');
                applyLeaveModal.open();
              }}
              leftIcon={<Plane className="w-4 h-4 text-indigo-600" />}
            >
              Apply for Leave
            </Button>
            <Link to="/calendar">
              <Button
                variant="outline"
                size="md"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30"
                leftIcon={<Calendar className="w-4 h-4" />}
              >
                Team Calendar
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Attendance Today */}
        <Card className="hover:border-indigo-200 transition-all p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Attendance Today</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900">
              {isCheckedIn ? 'Working' : todayRecord?.status || 'Not Checked In'}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-500 font-mono">
                {todayRecord?.checkIn ? `Checked in: ${todayRecord.checkIn}` : 'Pending morning punch'}
              </span>
              {isCheckedIn && <Badge variant="success" size="xs" dot>Live</Badge>}
            </div>
          </div>
        </Card>

        {/* Card 2: Working Hours */}
        <Card className="hover:border-indigo-200 transition-all p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Working Hours</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black font-mono text-indigo-700">
              {isCheckedIn
                ? liveDuration
                : calculateWorkingHoursString(todayRecord?.checkIn || null, todayRecord?.checkOut || null, todayRecord?.status)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {isCheckedIn ? 'Running active workday ticker' : 'Expected standard: 08h 00m'}
            </p>
          </div>
        </Card>

        {/* Card 3: Leave Balance */}
        <Link to="/employee/leave" className="block group">
          <Card className="hover:border-indigo-300 transition-all p-5 h-full">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Leave Balance</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Plane className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-black text-slate-900">{leaveBalances.annualPaid} Days</p>
              <p className="text-xs text-indigo-600 font-semibold group-hover:underline mt-1">
                {leaveBalances.sick} sick days available &rarr;
              </p>
            </div>
          </Card>
        </Link>

        {/* Card 4: Pending Leave Requests */}
        <Link to="/employee/leave" className="block group">
          <Card className="hover:border-amber-300 transition-all p-5 h-full">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Requests</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <p className="text-2xl font-black text-slate-900">{pendingRequestsCount}</p>
                {pendingRequestsCount > 0 && <Badge variant="warning" size="xs">In Review</Badge>}
              </div>
              <p className="text-xs text-amber-600 font-semibold group-hover:underline mt-1">
                Awaiting HR manager decision &rarr;
              </p>
            </div>
          </Card>
        </Link>
      </div>

      {/* 3. Interactive Attendance Widget & Leave Quotas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Action Widget */}
        <Card className="border-indigo-100/90 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <CardTitle className="text-sm">Attendance Widget</CardTitle>
              </div>
              <Badge variant={isCheckedIn ? 'success' : todayRecord?.status === 'Present' ? 'primary' : 'neutral'} size="xs" dot>
                {isCheckedIn ? 'Working' : todayRecord?.status || 'Not Checked In'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Live timer display box */}
            <div className="text-center p-6 rounded-2xl bg-slate-50/90 border border-slate-200/80">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {isCheckedIn ? 'Elapsed Working Time' : 'Session Duration'}
              </p>
              <p className="text-3xl sm:text-4xl font-mono font-black text-slate-900 mt-2 tracking-tight">
                {isCheckedIn
                  ? liveDuration
                  : todayRecord?.checkOut
                  ? calculateWorkingHoursString(todayRecord.checkIn, todayRecord.checkOut, todayRecord.status)
                  : '00h 00m 00s'}
              </p>
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-600 font-medium">
                <span>
                  Check In: <strong className="text-slate-900 font-mono">{todayRecord?.checkIn || '--:--'}</strong>
                </span>
                <span>&bull;</span>
                <span>
                  Check Out: <strong className="text-slate-900 font-mono">{todayRecord?.checkOut || (isCheckedIn ? 'In Progress' : '--:--')}</strong>
                </span>
              </div>
            </div>

            {/* Interactive Toggle Button */}
            {isCheckedIn ? (
              <Button
                variant="danger"
                size="lg"
                className="w-full justify-center shadow-md shadow-rose-200"
                onClick={handleCheckOut}
                isLoading={actionLoading}
                leftIcon={<Square className="w-4 h-4" />}
              >
                Clock Out for Today
              </Button>
            ) : (
              <Button
                variant="success"
                size="lg"
                className="w-full justify-center shadow-md shadow-emerald-200"
                onClick={handleCheckIn}
                isLoading={actionLoading}
                leftIcon={<Play className="w-4 h-4" />}
              >
                Check In to Start Work
              </Button>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Shift: 09:00 AM - 05:30 PM</span>
              <Link to="/employee/attendance" className="text-indigo-600 font-bold hover:underline">
                View Log &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Leave Balances Quota Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Leave Quotas & Allocation</h3>
            <Link to="/employee/leave" className="text-xs font-bold text-indigo-600 hover:underline">
              Manage Leaves &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Annual Paid */}
            <Card className="p-4 hover:border-indigo-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Plane className="w-4 h-4" />
                  </div>
                  <Badge variant="primary" size="xs">Paid</Badge>
                </div>
                <p className="text-xs font-semibold text-slate-500">Annual Vacation</p>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {leaveBalances.annualPaid} <span className="text-xs text-slate-400 font-normal">/ {leaveBalances.annualTotal}d</span>
                </p>
              </div>
              <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                Accrues +1.5 days/month
              </p>
            </Card>

            {/* Sick Leave */}
            <Card className="p-4 hover:border-purple-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <Badge variant="purple" size="xs">Medical</Badge>
                </div>
                <p className="text-xs font-semibold text-slate-500">Sick & Medical</p>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {leaveBalances.sick} <span className="text-xs text-slate-400 font-normal">/ {leaveBalances.sickTotal}d</span>
                </p>
              </div>
              <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                Zero note under 2 days
              </p>
            </Card>

            {/* Unpaid */}
            <Card className="p-4 hover:border-slate-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <Badge variant="neutral" size="xs">Unpaid</Badge>
                </div>
                <p className="text-xs font-semibold text-slate-500">Unpaid Leave</p>
                <p className="text-2xl font-black text-slate-900 mt-1">Available</p>
              </div>
              <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                Subject to approval
              </p>
            </Card>
          </div>

          {/* Quick Actions Panel */}
          <Card className="p-4 bg-linear-to-r from-slate-50 to-indigo-50/40 border-slate-200">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Quick Workplace Actions</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <Button
                variant="outline"
                size="xs"
                className="bg-white justify-center text-xs"
                onClick={() => {
                  setModalError('');
                  applyLeaveModal.open();
                }}
                leftIcon={<Plane className="w-3.5 h-3.5 text-indigo-600" />}
              >
                Apply Leave
              </Button>
              <Link to="/employee/attendance">
                <Button variant="outline" size="xs" className="w-full bg-white justify-center text-xs" leftIcon={<Clock className="w-3.5 h-3.5 text-emerald-600" />}>
                  My Timesheet
                </Button>
              </Link>
              <Link to="/calendar">
                <Button variant="outline" size="xs" className="w-full bg-white justify-center text-xs" leftIcon={<Calendar className="w-3.5 h-3.5 text-purple-600" />}>
                  Leave Calendar
                </Button>
              </Link>
              <Button
                variant="outline"
                size="xs"
                className="bg-white justify-center text-xs"
                onClick={() => info('Payslip Download', 'Downloading July 2026 Payslip summary.')}
                leftIcon={<Download className="w-3.5 h-3.5 text-blue-600" />}
              >
                Download Pay
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* 4. Recent Activity & Payslips Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Feed */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle>Recent Activity & Timeline</CardTitle>
                <CardDescription>Track your attendance, leave submissions, and organizational events</CardDescription>
              </div>
              <Badge variant="primary" size="xs">Live Stream</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-slate-100">
              {RECENT_ACTIVITIES.map((act) => {
                const Icon = act.icon;
                return (
                  <div key={act.id} className="py-3.5 flex items-start justify-between gap-3 hover:bg-slate-50/50 p-2 rounded-xl transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5', act.iconBg, act.iconColor)}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{act.title}</p>
                        <p className="text-xs text-slate-600 mt-0.5">{act.description}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0 mt-0.5">{act.timestamp}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Verified Documents & Payslips */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Payslips & Documents</CardTitle>
              <CardDescription>Recent HR disbursements</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: 'July 2026 Monthly Payslip', desc: 'Disbursed Jul 31 &bull; Net: $6,450.00', icon: FileText },
              { title: 'June 2026 Monthly Payslip', desc: 'Disbursed Jun 30 &bull; Net: $6,450.00', icon: FileText },
              { title: 'Form W-2 / Annual Tax Summary', desc: 'Year 2025 Tax Declaration &bull; Verified', icon: CheckCircle2 },
            ].map((doc, i) => {
              const Icon = doc.icon;
              return (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition-all cursor-pointer"
                  onClick={() => success('Downloaded', `Downloaded ${doc.title}.`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{doc.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{doc.desc}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="xs">
                    Get
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={applyLeaveModal.isOpen}
        onClose={applyLeaveModal.close}
        title="Submit Leave Request"
        description="Select your leave category, dates, and provide a brief reason for managerial review."
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={applyLeaveModal.close}
              disabled={isSubmittingLeave}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleModalLeaveSubmit}
              isLoading={isSubmittingLeave}
            >
              Submit Request
            </Button>
          </>
        }
      >
        <form onSubmit={handleModalLeaveSubmit} className="space-y-4">
          {modalError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          <Select
            label="Leave Category"
            value={modalLeaveType}
            onChange={(e) => setModalLeaveType(e.target.value as LeaveType)}
            options={[
              { value: 'Paid', label: `Annual Paid Leave (${leaveBalances.annualPaid} days available)` },
              { value: 'Sick', label: `Medical / Sick Leave (${leaveBalances.sick} days available)` },
              { value: 'Unpaid', label: 'Unpaid Leave of Absence' },
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={modalStart}
              onChange={(e) => setModalStart(e.target.value)}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={modalEnd}
              onChange={(e) => setModalEnd(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-xs">
            <span className="font-semibold text-indigo-900">Calculated Duration:</span>
            <span className="font-bold font-mono text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
              {modalCalculatedDays} Working Days
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Reason / Notes <span className="text-rose-500">*</span>
            </label>
            <Input
              value={modalReason}
              onChange={(e) => setModalReason(e.target.value)}
              placeholder="e.g. Family vacation, personal appointment, medical checkup"
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
