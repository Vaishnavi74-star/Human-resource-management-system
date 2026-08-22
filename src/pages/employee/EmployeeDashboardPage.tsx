import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { useDisclosure } from '../../hooks/useDisclosure';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import {
  Clock,
  CheckCircle2,
  FileText,
  Sparkles,
  Plane,
  HeartPulse,
  Coffee,
  Play,
  Square,
  ArrowUpRight,
  CalendarDays,
  Bell,
  UserCheck,
  Timer,
  LogIn,
  ClipboardList,
  User,
  HelpCircle,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Calendar,
  Briefcase,
  Sun,
  Moon,
  CloudSun,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────
type AttendanceStatus = 'not-checked-in' | 'checked-in' | 'checked-out';

interface ActivityItem {
  id: string;
  type: 'leave-submitted' | 'leave-approved' | 'leave-rejected' | 'profile-updated' | 'attendance-recorded' | 'document-uploaded';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  badgeVariant: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'purple';
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'success' | 'warning' | 'info' | 'error';
}

interface AttendanceLogEntry {
  date: string;
  checkIn: string;
  checkOut: string;
  status: string;
  badgeVariant: 'success' | 'neutral' | 'warning' | 'error';
  hours: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────
const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act_1',
    type: 'leave-submitted',
    title: 'Leave Request Submitted',
    description: 'Annual vacation leave request for Sep 12 – Sep 16, 2026 submitted for approval.',
    timestamp: '2 hours ago',
    icon: <Plane className="w-4 h-4" />,
    badgeVariant: 'primary',
  },
  {
    id: 'act_2',
    type: 'leave-approved',
    title: 'Leave Approved',
    description: 'Your sick leave request for Aug 18 was approved by Marcus Chen.',
    timestamp: '1 day ago',
    icon: <CheckCircle className="w-4 h-4" />,
    badgeVariant: 'success',
  },
  {
    id: 'act_3',
    type: 'profile-updated',
    title: 'Profile Updated',
    description: 'Emergency contact information and phone number updated successfully.',
    timestamp: '2 days ago',
    icon: <User className="w-4 h-4" />,
    badgeVariant: 'info',
  },
  {
    id: 'act_4',
    type: 'attendance-recorded',
    title: 'Attendance Recorded',
    description: 'Clock-in recorded at 09:02 AM on Aug 21. Total working hours: 8h 28m.',
    timestamp: '3 days ago',
    icon: <Clock className="w-4 h-4" />,
    badgeVariant: 'neutral',
  },
  {
    id: 'act_5',
    type: 'document-uploaded',
    title: 'Payslip Available',
    description: 'July 2026 payslip has been generated and is ready for download.',
    timestamp: '5 days ago',
    icon: <FileText className="w-4 h-4" />,
    badgeVariant: 'purple',
  },
];

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Time-off Request Approved',
    message: 'Your sick leave for Aug 18 was approved by Marcus Chen.',
    timestamp: '10m ago',
    read: false,
    type: 'success',
  },
  {
    id: 'notif_2',
    title: 'Timesheet Reminder',
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
  {
    id: 'notif_4',
    title: 'Performance Review Due',
    message: 'Self-assessment for Q3 is due by Aug 30, 2026.',
    timestamp: '2d ago',
    read: true,
    type: 'warning',
  },
];

const MOCK_ATTENDANCE_LOG: AttendanceLogEntry[] = [
  { date: 'Yesterday, Aug 21', checkIn: '08:55 AM', checkOut: '05:30 PM', status: 'Completed', badgeVariant: 'neutral', hours: '8h 35m' },
  { date: 'Wednesday, Aug 20', checkIn: '09:05 AM', checkOut: '05:15 PM', status: 'Completed', badgeVariant: 'neutral', hours: '8h 10m' },
  { date: 'Tuesday, Aug 19', checkIn: '08:48 AM', checkOut: '05:40 PM', status: 'Completed', badgeVariant: 'neutral', hours: '8h 52m' },
  { date: 'Monday, Aug 18', checkIn: '—', checkOut: '—', status: 'Sick Leave', badgeVariant: 'warning', hours: '0h 00m' },
];

// ─── Helper Functions ──────────────────────────────────────────────────
function getGreeting(): { greeting: string; icon: React.ReactNode } {
  const hour = new Date().getHours();
  if (hour < 12) return { greeting: 'Good morning', icon: <Sun className="w-5 h-5 text-amber-400" /> };
  if (hour < 17) return { greeting: 'Good afternoon', icon: <CloudSun className="w-5 h-5 text-orange-400" /> };
  return { greeting: 'Good evening', icon: <Moon className="w-5 h-5 text-indigo-300" /> };
}

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
}

function formatDurationShort(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── Component ──────────────────────────────────────────────────────────
export const EmployeeDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { success, info } = useToast();
  const leaveModal = useDisclosure();

  // ── Dashboard loading / error simulation ──
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // ── Attendance state ──
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>('not-checked-in');
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null);
  const [workSeconds, setWorkSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Notification state ──
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  // ── Activity state ──
  const [activities] = useState<ActivityItem[]>(MOCK_ACTIVITIES);

  // ── Leave request form ──
  const [leaveSubmitting, setLeaveSubmitting] = useState(false);

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Live working-hours counter
  useEffect(() => {
    if (attendanceStatus === 'checked-in') {
      timerRef.current = setInterval(() => {
        setWorkSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [attendanceStatus]);

  // ── Handlers ──
  const handleCheckIn = useCallback(() => {
    const now = new Date();
    setCheckInTime(now);
    setCheckOutTime(null);
    setWorkSeconds(0);
    setAttendanceStatus('checked-in');
    success(
      'Checked In Successfully',
      `Your workday has started at ${formatTime(now)}. Have a productive day!`
    );
  }, [success]);

  const handleCheckOut = useCallback(() => {
    const now = new Date();
    setCheckOutTime(now);
    setAttendanceStatus('checked-out');
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    info(
      'Checked Out',
      `You clocked out at ${formatTime(now)}. Total working hours: ${formatDurationShort(workSeconds)}.`
    );
  }, [info, workSeconds]);

  const handleSubmitLeave = useCallback(() => {
    setLeaveSubmitting(true);
    setTimeout(() => {
      setLeaveSubmitting(false);
      leaveModal.close();
      success(
        'Leave Request Submitted',
        'Your request has been routed to your manager for approval. You will be notified once reviewed.'
      );
    }, 1500);
  }, [leaveModal, success]);

  const handleMarkNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1200);
  }, []);

  const { greeting, icon: greetingIcon } = getGreeting();
  const firstName = user?.name ? user.name.split(' ')[0] : 'Employee';
  const unreadCount = notifications.filter((n) => !n.read).length;

  // ── Computed summary values ──
  const attendanceLabel = attendanceStatus === 'checked-in'
    ? 'Present'
    : attendanceStatus === 'checked-out'
      ? 'Completed'
      : 'Not Checked In';

  const attendanceTime = attendanceStatus === 'not-checked-in'
    ? '—'
    : checkInTime
      ? formatTime(checkInTime)
      : '—';

  const workingHoursDisplay = attendanceStatus === 'not-checked-in'
    ? '00h 00m'
    : formatDurationShort(workSeconds);

  // ── Loading State ──
  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Skeleton Header */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900/80 via-indigo-800/80 to-indigo-700/80 p-6 sm:p-8 animate-pulse">
          <div className="space-y-3">
            <div className="h-5 w-48 bg-white/20 rounded-lg" />
            <div className="h-8 w-72 bg-white/20 rounded-lg" />
            <div className="h-4 w-56 bg-white/10 rounded-lg" />
          </div>
        </div>
        {/* Skeleton Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-3 w-24 bg-slate-200 rounded" />
                <div className="w-9 h-9 rounded-xl bg-slate-100" />
              </div>
              <div className="h-7 w-20 bg-slate-200 rounded mt-2" />
              <div className="h-3 w-32 bg-slate-100 rounded mt-2" />
            </div>
          ))}
        </div>
        <LoadingState
          message="Loading your dashboard..."
          description="Fetching attendance, leave balances, and notifications."
          size="lg"
          fullHeight
        />
      </div>
    );
  }

  // ── Error State ──
  if (hasError) {
    return (
      <div className="space-y-8">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-700 text-white p-6 sm:p-8 shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-sm text-indigo-100/90 mt-1">Here's your workday overview.</p>
        </div>
        <ErrorState
          title="Failed to load dashboard data"
          message="We couldn't fetch your attendance records, leave balances, and notifications. Please check your connection and try again."
          onRetry={handleRetry}
        />
      </div>
    );
  }

  // ─── Notification icon map ──
  const notifIcons: Record<string, React.ReactNode> = {
    success: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-500" />,
    info: <Info className="w-4 h-4 text-blue-500" />,
    error: <XCircle className="w-4 h-4 text-rose-500" />,
  };

  return (
    <div className="space-y-8">
      {/* ════════════════════════════════════════════════════════════════
           HEADER: Greeting Banner
         ════════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-800 to-violet-700 text-white p-6 sm:p-8 shadow-xl shadow-indigo-950/15">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-indigo-100">
              {greetingIcon}
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
              {greeting}, {firstName} 👋
            </h1>
            <p className="text-sm text-indigo-100/90 leading-relaxed">
              Here's your workday overview.
              {user?.title && (
                <span> &bull; {user.title}</span>
              )}
              {user?.department && (
                <span> &bull; {user.department}</span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="white"
              size="md"
              onClick={leaveModal.open}
              leftIcon={<Plane className="w-4 h-4 text-indigo-600" />}
            >
              Request Time Off
            </Button>
          </div>
        </div>

        {/* Decorative glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 w-72 h-72 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ════════════════════════════════════════════════════════════════
           SUMMARY CARDS
         ════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Attendance Today */}
        <Card className="hover:border-emerald-200 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attendance</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900">{attendanceLabel}</p>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              {attendanceStatus !== 'not-checked-in' && (
                <>
                  <Clock className="w-3 h-3" />
                  {attendanceTime}
                </>
              )}
              {attendanceStatus === 'not-checked-in' && (
                <span className="text-amber-600 font-medium">Awaiting check-in</span>
              )}
            </p>
          </div>
        </Card>

        {/* 2. Working Hours */}
        <Card className="hover:border-indigo-200 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Working Hours</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Timer className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">{workingHoursDisplay}</p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
              {attendanceStatus === 'checked-in' && (
                <Badge variant="success" size="xs" dot>Live</Badge>
              )}
              {attendanceStatus === 'checked-out' && (
                <span className="text-emerald-600 font-medium">Day complete</span>
              )}
              {attendanceStatus === 'not-checked-in' && (
                <span>Expected: 8h 00m</span>
              )}
            </div>
          </div>
        </Card>

        {/* 3. Leave Balance */}
        <Card className="hover:border-amber-200 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Leave Balance</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900">12 <span className="text-xs text-slate-400 font-normal">Days</span></p>
            <p className="text-xs text-slate-500 mt-1">Across all leave types</p>
          </div>
        </Card>

        {/* 4. Pending Leave Requests */}
        <Card className="hover:border-violet-200 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Requests</span>
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900">2</p>
            <p className="text-xs text-amber-600 font-medium mt-1">Awaiting manager approval</p>
          </div>
        </Card>
      </div>

      {/* ════════════════════════════════════════════════════════════════
           ATTENDANCE WIDGET + LEAVE SUMMARY
         ════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Live Attendance Clock Widget ── */}
        <Card className="lg:col-span-1 border-indigo-100 bg-white">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <CardTitle className="text-sm">Attendance Widget</CardTitle>
              </div>
              <Badge
                variant={
                  attendanceStatus === 'checked-in'
                    ? 'success'
                    : attendanceStatus === 'checked-out'
                      ? 'neutral'
                      : 'warning'
                }
                size="xs"
                dot
              >
                {attendanceStatus === 'checked-in'
                  ? 'Working'
                  : attendanceStatus === 'checked-out'
                    ? 'Day Complete'
                    : 'Not Checked In'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Status Display */}
            <div className="text-center p-5 rounded-2xl bg-slate-50 border border-slate-100">
              {attendanceStatus === 'not-checked-in' && (
                <>
                  <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mb-3">
                    <LogIn className="w-6 h-6 text-amber-500" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Not checked in</p>
                  <p className="text-xs text-slate-400 mt-1">Start your workday by checking in below</p>
                </>
              )}

              {attendanceStatus === 'checked-in' && (
                <>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Elapsed Work Time</p>
                  <p className="text-3xl font-mono font-black text-slate-900 mt-1 tracking-tight">
                    {formatDuration(workSeconds)}
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-500">
                    <span>Checked in at <strong className="text-slate-800">{checkInTime ? formatTime(checkInTime) : '—'}</strong></span>
                    <span>&bull;</span>
                    <span>Expected: <strong className="text-slate-800">8h 00m</strong></span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-linear"
                      style={{
                        width: `${Math.min((workSeconds / (8 * 3600)) * 100, 100)}%`,
                        background: workSeconds >= 8 * 3600
                          ? 'linear-gradient(90deg, #10b981, #059669)'
                          : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {Math.min(Math.round((workSeconds / (8 * 3600)) * 100), 100)}% of 8h shift completed
                  </p>
                </>
              )}

              {attendanceStatus === 'checked-out' && (
                <>
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Day Completed</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-slate-500">
                      Check-in: <strong className="text-slate-800">{checkInTime ? formatTime(checkInTime) : '—'}</strong>
                    </p>
                    <p className="text-xs text-slate-500">
                      Check-out: <strong className="text-slate-800">{checkOutTime ? formatTime(checkOutTime) : '—'}</strong>
                    </p>
                    <p className="text-xs text-slate-500">
                      Total: <strong className="text-emerald-700 font-mono">{formatDurationShort(workSeconds)}</strong>
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Action Button */}
            {attendanceStatus === 'not-checked-in' && (
              <Button
                variant="success"
                size="lg"
                className="w-full justify-center"
                onClick={handleCheckIn}
                leftIcon={<Play className="w-4 h-4" />}
              >
                Check In
              </Button>
            )}

            {attendanceStatus === 'checked-in' && (
              <Button
                variant="danger"
                size="lg"
                className="w-full justify-center"
                onClick={handleCheckOut}
                leftIcon={<Square className="w-4 h-4" />}
              >
                Check Out
              </Button>
            )}

            {attendanceStatus === 'checked-out' && (
              <div className="text-center">
                <p className="text-xs text-slate-400">You've completed your shift for today. 🎉</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Leave Summary ── */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="hover:border-indigo-200 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Plane className="w-5 h-5" />
                </div>
                <Badge variant="primary" size="xs">Paid</Badge>
              </div>
              <p className="text-xs font-semibold text-slate-500">Annual Vacation</p>
              <p className="text-3xl font-black text-slate-900 mt-1">16 <span className="text-xs text-slate-400 font-normal">Days Left</span></p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-slate-100 space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Used</span>
                <span className="font-semibold text-slate-600">4 days</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
          </Card>

          <Card className="hover:border-emerald-200 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <Badge variant="success" size="xs">Active</Badge>
              </div>
              <p className="text-xs font-semibold text-slate-500">Sick & Medical</p>
              <p className="text-3xl font-black text-slate-900 mt-1">8 <span className="text-xs text-slate-400 font-normal">Days Left</span></p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-slate-100 space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Used</span>
                <span className="font-semibold text-slate-600">2 days</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
          </Card>

          <Card className="hover:border-amber-200 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Coffee className="w-5 h-5" />
                </div>
                <Badge variant="warning" size="xs">Personal</Badge>
              </div>
              <p className="text-xs font-semibold text-slate-500">Floating Holidays</p>
              <p className="text-3xl font-black text-slate-900 mt-1">2 <span className="text-xs text-slate-400 font-normal">Days Left</span></p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-slate-100 space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Used</span>
                <span className="font-semibold text-slate-600">1 day</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '33%' }} />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
           QUICK ACTIONS
         ════════════════════════════════════════════════════════════════ */}
      <Card padding="sm">
        <div className="flex items-center gap-2 mb-3 px-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-semibold text-slate-900">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {[
            { label: 'Apply Leave', icon: <Plane className="w-5 h-5" />, color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100', action: () => leaveModal.open() },
            { label: 'View Payslips', icon: <FileText className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100', action: () => info('Payslips', 'Navigating to your payslip archive...') },
            { label: 'My Attendance', icon: <Calendar className="w-5 h-5" />, color: 'bg-violet-50 text-violet-600 hover:bg-violet-100', action: () => info('Attendance', 'Opening full attendance log...') },
            { label: 'Update Profile', icon: <User className="w-5 h-5" />, color: 'bg-amber-50 text-amber-600 hover:bg-amber-100', action: () => info('Profile', 'Opening profile settings...') },
            { label: 'Team Directory', icon: <Briefcase className="w-5 h-5" />, color: 'bg-rose-50 text-rose-600 hover:bg-rose-100', action: () => info('Team', 'Opening team directory...') },
            { label: 'Help & Support', icon: <HelpCircle className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600 hover:bg-blue-100', action: () => info('Support', 'Opening knowledge base...') },
          ].map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={item.action}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-transparent transition-all duration-200 cursor-pointer hover:border-slate-200 hover:shadow-sm active:scale-[0.97] ${item.color}`}
            >
              {item.icon}
              <span className="text-xs font-semibold text-slate-700">{item.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* ════════════════════════════════════════════════════════════════
           ATTENDANCE LOG + RECENT ACTIVITY + NOTIFICATIONS
         ════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Today's Attendance Summary / Attendance Log ── */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle>Attendance Log</CardTitle>
                <CardDescription>Recent clock records this week</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => info('View All', 'Opening full attendance history...')}
                rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Today's entry (dynamic) */}
            {attendanceStatus !== 'not-checked-in' && (
              <div className="py-3 flex items-center justify-between text-xs border-b border-slate-100">
                <div>
                  <p className="font-bold text-slate-800">Today, Aug 22</p>
                  <p className="text-slate-500 mt-0.5">
                    {checkInTime ? formatTime(checkInTime) : '—'} &rarr; {checkOutTime ? formatTime(checkOutTime) : 'In Progress'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-700 font-mono">{formatDurationShort(workSeconds)}</span>
                  <Badge variant={attendanceStatus === 'checked-in' ? 'success' : 'neutral'} size="xs">
                    {attendanceStatus === 'checked-in' ? 'On Duty' : 'Complete'}
                  </Badge>
                </div>
              </div>
            )}

            {/* Historical entries */}
            <div className="divide-y divide-slate-100">
              {MOCK_ATTENDANCE_LOG.map((row, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{row.date}</p>
                    <p className="text-slate-500 mt-0.5">{row.checkIn} &rarr; {row.checkOut}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-700 font-mono">{row.hours}</span>
                    <Badge variant={row.badgeVariant} size="xs">{row.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Recent Activity Feed ── */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions & updates</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => info('Activity', 'Opening full activity log...')}
                rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
              >
                See All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <EmptyState
                title="No recent activity"
                description="Your recent actions will appear here once you start using the platform."
                icon={<ClipboardList className="w-7 h-7 text-indigo-600" />}
              />
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3 group">
                    <div className="mt-0.5 shrink-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                        activity.badgeVariant === 'success' ? 'bg-emerald-50 text-emerald-600' :
                        activity.badgeVariant === 'primary' ? 'bg-indigo-50 text-indigo-600' :
                        activity.badgeVariant === 'info' ? 'bg-blue-50 text-blue-600' :
                        activity.badgeVariant === 'purple' ? 'bg-purple-50 text-purple-600' :
                        activity.badgeVariant === 'warning' ? 'bg-amber-50 text-amber-600' :
                        activity.badgeVariant === 'error' ? 'bg-rose-50 text-rose-600' :
                        'bg-slate-50 text-slate-600'
                      }`}>
                        {activity.icon}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 leading-tight">{activity.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{activity.description}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Notification Preview ── */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Stay updated</CardDescription>
                </div>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-rose-500 rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                  info('Notifications', 'All notifications marked as read.');
                }}
              >
                Mark all read
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <EmptyState
                title="All caught up!"
                description="No new notifications at the moment."
                icon={<Bell className="w-7 h-7 text-indigo-600" />}
              />
            ) : (
              <div className="space-y-1">
                {notifications.map((notif) => (
                  <button
                    key={notif.id}
                    type="button"
                    onClick={() => handleMarkNotificationRead(notif.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 cursor-pointer group ${
                      notif.read
                        ? 'bg-white hover:bg-slate-50'
                        : 'bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/60'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5 shrink-0">
                        {notifIcons[notif.type]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`text-xs font-bold leading-tight ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{notif.timestamp}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ════════════════════════════════════════════════════════════════
           REQUEST LEAVE MODAL
         ════════════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={leaveModal.isOpen}
        onClose={leaveModal.close}
        title="Submit Time Off Request"
        description="Select your leave type and requested dates for managerial review."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={leaveModal.close} disabled={leaveSubmitting}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmitLeave}
              isLoading={leaveSubmitting}
            >
              Submit Request
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Leave Type"
            options={[
              { value: 'vacation', label: 'Annual Vacation Leave (16 days remaining)' },
              { value: 'sick', label: 'Medical / Sick Leave (8 days remaining)' },
              { value: 'floating', label: 'Floating Holiday (2 days remaining)' },
              { value: 'unpaid', label: 'Unpaid Leave of Absence' },
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" defaultValue="2026-09-14" />
            <Input label="End Date" type="date" defaultValue="2026-09-18" />
          </div>
          <Input label="Reason / Notes (Optional)" placeholder="e.g. Family vacation trip" />
        </div>
      </Modal>
    </div>
  );
};
