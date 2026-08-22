import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { useDisclosure } from '../../hooks/useDisclosure';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  Users,
  UserCheck,
  UserX,
  CalendarOff,
  ClipboardList,
  CreditCard,
  Building,
  Check,
  X,
  Plus,
  TrendingUp,
  Download,
  Shield,
  Eye,
  UserPlus,
  Plane,
  Award,
  FileText,
  Wallet,
  Activity,
  ArrowUpRight,
  Sun,
  Moon,
  CloudSun,
} from 'lucide-react';
import {
  DEPARTMENTS,
  TOTAL_EMPLOYEES,
  ATTENDANCE_BY_FILTER,
  PRESENT_TODAY,
  ABSENT_TODAY,
  ON_LEAVE_TODAY,
  INITIAL_LEAVE_REQUESTS,
  PAYROLL,
  WEEKLY_ATTENDANCE_TREND,
  MONTHLY_ATTENDANCE_TREND,
  ORG_ACTIVITIES,
} from '../../data/mockAdminData';
import type { LeaveRequest } from '../../data/mockAdminData';

// ─── Helpers ────────────────────────────────────────────────────────────
function getGreeting(): { greeting: string; icon: React.ReactNode } {
  const hour = new Date().getHours();
  if (hour < 12) return { greeting: 'Good morning', icon: <Sun className="w-5 h-5 text-amber-400" /> };
  if (hour < 17) return { greeting: 'Good afternoon', icon: <CloudSun className="w-5 h-5 text-orange-400" /> };
  return { greeting: 'Good evening', icon: <Moon className="w-5 h-5 text-indigo-300" /> };
}

// Activity icon map
const activityIcons: Record<string, { icon: React.ReactNode; bg: string }> = {
  hire: { icon: <UserPlus className="w-4 h-4" />, bg: 'bg-emerald-50 text-emerald-600' },
  leave: { icon: <Plane className="w-4 h-4" />, bg: 'bg-indigo-50 text-indigo-600' },
  payroll: { icon: <Wallet className="w-4 h-4" />, bg: 'bg-purple-50 text-purple-600' },
  promotion: { icon: <Award className="w-4 h-4" />, bg: 'bg-amber-50 text-amber-600' },
  policy: { icon: <FileText className="w-4 h-4" />, bg: 'bg-blue-50 text-blue-600' },
  termination: { icon: <UserX className="w-4 h-4" />, bg: 'bg-rose-50 text-rose-600' },
};

// Recharts custom tooltip
const AttendanceChartTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-bold text-slate-800 mb-1.5">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-600">{entry.name}:</span>
          <span className="font-semibold text-slate-900">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Component ──────────────────────────────────────────────────────────
export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { success, warning, info } = useToast();
  const newHireModal = useDisclosure();
  const viewModal = useDisclosure();
  const rejectModal = useDisclosure();
  const approveConfirmModal = useDisclosure();

  // ── States ──
  const [isLoading, setIsLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQUESTS);
  const [attendanceFilter, setAttendanceFilter] = useState<'today' | 'week' | 'month'>('today');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [rejectComment, setRejectComment] = useState('');
  const [rejectSubmitting, setRejectSubmitting] = useState(false);
  const [approveSubmitting, setApproveSubmitting] = useState(false);

  // Loading simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Derived
  const pendingCount = leaveRequests.filter((r) => r.status === 'pending').length;
  const { greeting, icon: greetingIcon } = getGreeting();
  const firstName = user?.name ? user.name.split(' ')[0] : 'Admin';
  const currentAttendance = ATTENDANCE_BY_FILTER[attendanceFilter];

  // Chart data for attendance
  const attendanceChartData = attendanceFilter === 'today'
    ? [{ day: 'Today', present: currentAttendance.present, absent: currentAttendance.absent, halfDay: currentAttendance.halfDay, onLeave: currentAttendance.onLeave }]
    : attendanceFilter === 'week'
      ? WEEKLY_ATTENDANCE_TREND
      : MONTHLY_ATTENDANCE_TREND;

  // Donut data from attendance
  const attendanceDonutData = [
    { name: 'Present', value: currentAttendance.present, color: '#10b981' },
    { name: 'Absent', value: currentAttendance.absent, color: '#ef4444' },
    { name: 'Half-Day', value: currentAttendance.halfDay, color: '#f59e0b' },
    { name: 'On Leave', value: currentAttendance.onLeave, color: '#6366f1' },
  ];

  // Department chart data
  const departmentChartData = DEPARTMENTS.map((d) => ({
    name: d.name,
    headcount: d.headcount,
    color: d.color,
  }));

  // ── Handlers ──
  const handleViewRequest = useCallback((req: LeaveRequest) => {
    setSelectedRequest(req);
    viewModal.open();
  }, [viewModal]);

  const handleOpenApproveConfirm = useCallback((req: LeaveRequest) => {
    setSelectedRequest(req);
    approveConfirmModal.open();
  }, [approveConfirmModal]);

  const handleConfirmApprove = useCallback(() => {
    if (!selectedRequest) return;
    setApproveSubmitting(true);
    setTimeout(() => {
      setLeaveRequests((prev) =>
        prev.map((r) => r.id === selectedRequest.id ? { ...r, status: 'approved' as const } : r)
      );
      setApproveSubmitting(false);
      approveConfirmModal.close();
      success(
        'Leave Request Approved',
        `${selectedRequest.leaveType} for ${selectedRequest.employeeName} (${selectedRequest.days} days) has been approved.`
      );
      setSelectedRequest(null);
    }, 800);
  }, [selectedRequest, approveConfirmModal, success]);

  const handleOpenRejectModal = useCallback((req: LeaveRequest) => {
    setSelectedRequest(req);
    setRejectComment('');
    rejectModal.open();
  }, [rejectModal]);

  const handleConfirmReject = useCallback(() => {
    if (!selectedRequest) return;
    setRejectSubmitting(true);
    setTimeout(() => {
      setLeaveRequests((prev) =>
        prev.map((r) => r.id === selectedRequest.id ? { ...r, status: 'rejected' as const } : r)
      );
      setRejectSubmitting(false);
      rejectModal.close();
      warning(
        'Leave Request Rejected',
        `Request for ${selectedRequest.employeeName} was declined. Employee has been notified.`
      );
      setSelectedRequest(null);
    }, 800);
  }, [selectedRequest, rejectModal, warning]);

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-indigo-900/80 p-6 sm:p-8 animate-pulse">
          <div className="space-y-3">
            <div className="h-5 w-56 bg-white/20 rounded-lg" />
            <div className="h-8 w-80 bg-white/20 rounded-lg" />
            <div className="h-4 w-64 bg-white/10 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-5 animate-pulse">
              <div className="h-3 w-20 bg-slate-200 rounded mb-3" />
              <div className="h-7 w-14 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
        <LoadingState message="Loading organization data..." description="Fetching headcounts, attendance, and leave requests." size="lg" fullHeight />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ════════════════════════════════════════════════════════════════
           HEADER: Command Center Banner
         ════════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-800 to-indigo-900 text-white p-6 sm:p-8 shadow-xl shadow-slate-950/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-slate-200">
              <Shield className="w-3.5 h-3.5 text-indigo-300" />
              <span>HR & People Operations Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
              {greeting}, {firstName} 🛡️
            </h1>
            <p className="text-sm text-slate-300/90 leading-relaxed">
              Organization overview &bull; <strong className="text-white">{TOTAL_EMPLOYEES}</strong> employees across <strong className="text-white">{DEPARTMENTS.length}</strong> departments &bull; {pendingCount} actions pending
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="white"
              size="md"
              onClick={newHireModal.open}
              leftIcon={<Plus className="w-4 h-4 text-indigo-600" />}
            >
              Onboard New Hire
            </Button>
            <Button
              variant="outline"
              size="md"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30"
              onClick={() => info('Payroll Report', `Generating ${PAYROLL.month} payroll compliance spreadsheet.`)}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Payroll Export
            </Button>
          </div>
        </div>

        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 w-72 h-72 bg-slate-400/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ════════════════════════════════════════════════════════════════
           SUMMARY CARDS (6)
         ════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Employees */}
        <Card className="hover:border-indigo-200 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Employees</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-slate-900">{TOTAL_EMPLOYEES}</p>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-600 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>+12 this quarter</span>
            </div>
          </div>
        </Card>

        {/* Present Today */}
        <Card className="hover:border-emerald-200 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Present Today</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-slate-900">{PRESENT_TODAY}</p>
            <p className="text-[11px] text-slate-500 mt-1">{Math.round((PRESENT_TODAY / TOTAL_EMPLOYEES) * 100)}% attendance rate</p>
          </div>
        </Card>

        {/* Absent Today */}
        <Card className="hover:border-rose-200 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Absent Today</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-slate-900">{ABSENT_TODAY}</p>
            <p className="text-[11px] text-rose-500 font-medium mt-1">Unplanned absence</p>
          </div>
        </Card>

        {/* On Leave */}
        <Card className="hover:border-violet-200 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">On Leave</span>
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarOff className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-slate-900">{ON_LEAVE_TODAY}</p>
            <p className="text-[11px] text-slate-500 mt-1">Approved leave</p>
          </div>
        </Card>

        {/* Pending Leave Requests */}
        <Card className="hover:border-amber-200 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Requests</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-slate-900">{pendingCount}</p>
            <p className="text-[11px] text-amber-600 font-medium mt-1">Action required</p>
          </div>
        </Card>

        {/* Payroll Status */}
        <Card className="hover:border-purple-200 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payroll</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-slate-900">{PAYROLL.totalAmount}</p>
            <Badge variant="purple" size="xs">{PAYROLL.status}</Badge>
          </div>
        </Card>
      </div>

      {/* ════════════════════════════════════════════════════════════════
           ATTENDANCE OVERVIEW (Chart) + DEPARTMENT OVERVIEW
         ════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Attendance Overview ── */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-3">
              <div>
                <CardTitle>Attendance Overview</CardTitle>
                <CardDescription>Organization-wide attendance breakdown</CardDescription>
              </div>
              <div className="flex items-center bg-slate-100 rounded-xl p-1">
                {(['today', 'week', 'month'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setAttendanceFilter(filter)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                      attendanceFilter === filter
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {filter === 'today' ? 'Today' : filter === 'week' ? 'This Week' : 'This Month'}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Bar chart */}
              <div className="md:col-span-3 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceChartData} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <RechartsTooltip content={<AttendanceChartTooltip />} />
                    <Bar dataKey="present" name="Present" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="absent" name="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="halfDay" name="Half-Day" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="onLeave" name="On Leave" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Donut chart */}
              <div className="md:col-span-2 h-64 flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceDonutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {attendanceDonutData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value: number, name: string) => [`${value} employees`, name]}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value: string) => <span className="text-xs text-slate-600">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-100">
              {attendanceDonutData.map((item) => (
                <div key={item.name} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">{item.name}</p>
                    <p className="text-sm font-black text-slate-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Department Overview ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle>Department Overview</CardTitle>
                <CardDescription>{TOTAL_EMPLOYEES} employees total</CardDescription>
              </div>
              <Building className="w-5 h-5 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            {/* Mini pie chart */}
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    dataKey="headcount"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    fontSize={10}
                  >
                    {departmentChartData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: number, name: string) => [`${value} staff`, name]}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Department list */}
            <div className="space-y-3">
              {DEPARTMENTS.map((dept) => {
                const pct = Math.round((dept.headcount / TOTAL_EMPLOYEES) * 100);
                return (
                  <div key={dept.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: dept.color }} />
                        <span className="font-medium text-slate-700">{dept.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">{dept.headcount} <span className="font-normal text-slate-400">({pct}%)</span></span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: dept.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ════════════════════════════════════════════════════════════════
           PENDING LEAVE REQUESTS TABLE
         ════════════════════════════════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-3">
            <div>
              <CardTitle>Pending Leave Requests</CardTitle>
              <CardDescription>Review and respond to employee leave submissions</CardDescription>
            </div>
            <Badge variant="primary" size="sm">
              {pendingCount} Pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {pendingCount === 0 ? (
            <EmptyState
              title="All caught up!"
              description="No pending leave requests in the queue. All submissions have been reviewed."
              icon={<ClipboardList className="w-7 h-7 text-indigo-600" />}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-3 pr-4">Employee</th>
                    <th className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-3 pr-4 hidden sm:table-cell">Leave Type</th>
                    <th className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-3 pr-4 hidden md:table-cell">Dates</th>
                    <th className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-3 pr-4">Status</th>
                    <th className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {leaveRequests.map((req) => (
                    <tr key={req.id} className={`transition-colors ${req.status !== 'pending' ? 'opacity-50' : 'hover:bg-slate-50/50'}`}>
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={req.avatarUrl} name={req.employeeName} size="sm" />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{req.employeeName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{req.employeeId} &bull; {req.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 hidden sm:table-cell">
                        <div>
                          <p className="text-xs font-semibold text-slate-700">{req.leaveType}</p>
                          <p className="text-[10px] text-slate-400">{req.days} day{req.days > 1 ? 's' : ''}</p>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 hidden md:table-cell">
                        <p className="text-xs text-slate-700">{req.startDate} — {req.endDate}</p>
                        <p className="text-[10px] text-slate-400">Applied {req.appliedOn}</p>
                      </td>
                      <td className="py-3.5 pr-4">
                        <Badge
                          variant={req.status === 'pending' ? 'warning' : req.status === 'approved' ? 'success' : 'error'}
                          size="xs"
                          dot
                        >
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3.5 text-right">
                        {req.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => handleViewRequest(req)}
                              leftIcon={<Eye className="w-3.5 h-3.5" />}
                            >
                              <span className="hidden lg:inline">View</span>
                            </Button>
                            <Button
                              variant="success"
                              size="xs"
                              onClick={() => handleOpenApproveConfirm(req)}
                              leftIcon={<Check className="w-3.5 h-3.5" />}
                            >
                              <span className="hidden lg:inline">Approve</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="xs"
                              className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                              onClick={() => handleOpenRejectModal(req)}
                              leftIcon={<X className="w-3.5 h-3.5" />}
                            >
                              <span className="hidden lg:inline">Reject</span>
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">
                            {req.status === 'approved' ? 'Approved' : 'Declined'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ════════════════════════════════════════════════════════════════
           RECENT ACTIVITY + PAYROLL SUMMARY
         ════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Recent Organization Activity ── */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle>Recent Organization Activity</CardTitle>
                <CardDescription>Latest HR actions and events across the company</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => info('Activity Log', 'Opening full organization activity audit log...')}
                rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ORG_ACTIVITIES.map((activity) => {
                const iconInfo = activityIcons[activity.type] || activityIcons.policy;
                return (
                  <div key={activity.id} className="flex gap-3 group">
                    <div className="mt-0.5 shrink-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${iconInfo.bg}`}>
                        {iconInfo.icon}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs font-bold text-slate-800">{activity.title}</p>
                        <Badge
                          variant={
                            activity.type === 'hire' ? 'success' :
                            activity.type === 'leave' ? 'primary' :
                            activity.type === 'payroll' ? 'purple' :
                            activity.type === 'promotion' ? 'warning' :
                            'info'
                          }
                          size="xs"
                        >
                          {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{activity.description}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {activity.timestamp} &bull; By <span className="font-medium text-slate-500">{activity.actor}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ── Payroll Summary ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle>Payroll Summary</CardTitle>
                <CardDescription>{PAYROLL.month}</CardDescription>
              </div>
              <Wallet className="w-5 h-5 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="text-center p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100">
              <p className="text-xs font-semibold text-purple-500 uppercase tracking-wider">Total Disbursement</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{PAYROLL.totalAmount}</p>
              <Badge variant="purple" size="xs" className="mt-2">{PAYROLL.status}</Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Disbursement Date</span>
                <span className="font-bold text-slate-800">{PAYROLL.disbursementDate}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Days Remaining</span>
                <Badge variant="warning" size="xs">{PAYROLL.daysRemaining} days</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Processed</span>
                <span className="font-bold text-emerald-600">{PAYROLL.processed} / {TOTAL_EMPLOYEES}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Pending</span>
                <span className="font-bold text-amber-600">{PAYROLL.pending}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Payroll processing progress</span>
                <span className="font-semibold text-slate-600">{Math.round((PAYROLL.processed / TOTAL_EMPLOYEES) * 100)}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${Math.round((PAYROLL.processed / TOTAL_EMPLOYEES) * 100)}%` }}
                />
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center"
              onClick={() => info('Payroll Details', 'Opening full payroll breakdown and compliance report...')}
              leftIcon={<Activity className="w-4 h-4" />}
            >
              View Full Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ════════════════════════════════════════════════════════════════
           MODALS
         ════════════════════════════════════════════════════════════════ */}

      {/* ── View Leave Request Detail Modal ── */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={viewModal.close}
        title="Leave Request Details"
        description={selectedRequest ? `Submitted by ${selectedRequest.employeeName}` : ''}
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={viewModal.close}>Close</Button>
            {selectedRequest?.status === 'pending' && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-rose-600 hover:bg-rose-50"
                  onClick={() => {
                    viewModal.close();
                    handleOpenRejectModal(selectedRequest);
                  }}
                  leftIcon={<X className="w-3.5 h-3.5" />}
                >
                  Reject
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => {
                    viewModal.close();
                    handleOpenApproveConfirm(selectedRequest);
                  }}
                  leftIcon={<Check className="w-3.5 h-3.5" />}
                >
                  Approve
                </Button>
              </>
            )}
          </>
        }
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <Avatar src={selectedRequest.avatarUrl} name={selectedRequest.employeeName} size="lg" />
              <div>
                <p className="text-sm font-bold text-slate-900">{selectedRequest.employeeName}</p>
                <p className="text-xs text-slate-500">{selectedRequest.employeeId} &bull; {selectedRequest.department}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leave Type</p>
                <p className="text-sm font-semibold text-slate-800 mt-1">{selectedRequest.leaveType}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</p>
                <p className="text-sm font-semibold text-slate-800 mt-1">{selectedRequest.days} day{selectedRequest.days > 1 ? 's' : ''}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Start Date</p>
                <p className="text-sm font-semibold text-slate-800 mt-1">{selectedRequest.startDate}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End Date</p>
                <p className="text-sm font-semibold text-slate-800 mt-1">{selectedRequest.endDate}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reason</p>
              <p className="text-sm text-slate-700 mt-1 leading-relaxed">{selectedRequest.reason}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>Applied on: <strong className="text-slate-700">{selectedRequest.appliedOn}</strong></span>
              <Badge
                variant={selectedRequest.status === 'pending' ? 'warning' : selectedRequest.status === 'approved' ? 'success' : 'error'}
                size="xs"
                dot
              >
                {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
              </Badge>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Approve Confirmation Modal ── */}
      <Modal
        isOpen={approveConfirmModal.isOpen}
        onClose={() => { if (!approveSubmitting) approveConfirmModal.close(); }}
        title="Confirm Approval"
        size="sm"
        showCloseButton={!approveSubmitting}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={approveConfirmModal.close} disabled={approveSubmitting}>
              Cancel
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={handleConfirmApprove}
              isLoading={approveSubmitting}
              leftIcon={<Check className="w-3.5 h-3.5" />}
            >
              Approve Leave
            </Button>
          </>
        }
      >
        {selectedRequest && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 leading-snug">Approve leave request?</h4>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                You are about to approve <strong>{selectedRequest.employeeName}</strong>'s {selectedRequest.leaveType.toLowerCase()} request
                for <strong>{selectedRequest.days} day{selectedRequest.days > 1 ? 's' : ''}</strong> ({selectedRequest.startDate} — {selectedRequest.endDate}).
                The employee will be notified immediately.
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Reject with Comment Modal ── */}
      <Modal
        isOpen={rejectModal.isOpen}
        onClose={() => { if (!rejectSubmitting) rejectModal.close(); }}
        title="Reject Leave Request"
        description={selectedRequest ? `Declining request from ${selectedRequest.employeeName}` : ''}
        size="md"
        showCloseButton={!rejectSubmitting}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={rejectModal.close} disabled={rejectSubmitting}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmReject}
              isLoading={rejectSubmitting}
              leftIcon={<X className="w-3.5 h-3.5" />}
            >
              Confirm Rejection
            </Button>
          </>
        }
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-rose-50 border border-rose-100">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <X className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Rejecting {selectedRequest.leaveType} — {selectedRequest.days} day{selectedRequest.days > 1 ? 's' : ''}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  {selectedRequest.startDate} — {selectedRequest.endDate}
                </p>
              </div>
            </div>

            <Input
              label="Rejection Reason / Comment"
              placeholder="Explain the reason for rejection (will be sent to employee)..."
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              hint="This comment will be visible to the employee in their leave request history."
            />
          </div>
        )}
      </Modal>

      {/* ── Onboard New Hire Modal ── */}
      <Modal
        isOpen={newHireModal.isOpen}
        onClose={newHireModal.close}
        title="Onboard New Employee"
        description="Register a new team member and dispatch their Dayflow invitation credentials."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={newHireModal.close}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                newHireModal.close();
                success('Employee Created', 'New hire record created and welcome invitation dispatched.');
              }}
            >
              Create & Send Invite
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Full Name" placeholder="e.g. Maya Lin" defaultValue="Maya Lin" />
          <Input label="Company Email" type="email" placeholder="maya.lin@dayflow.hr" defaultValue="maya.lin@dayflow.hr" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Employee ID" defaultValue="DF-5012" />
            <Select
              label="Department"
              options={DEPARTMENTS.map((d) => ({ value: d.id, label: d.name }))}
            />
          </div>
          <Input label="Designation / Role" defaultValue="Product Marketing Manager" />
        </div>
      </Modal>
    </div>
  );
};
