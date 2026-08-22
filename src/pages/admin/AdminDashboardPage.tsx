import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { useDisclosure } from '../../hooks/useDisclosure';
import { leaveService } from '../../services/leaveService';
import { notificationService } from '../../services/notificationService';
import type { LeaveRequest, LeaveStatus, LeaveType } from '../../types/leave';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Link } from 'react-router-dom';
import {
  Users,
  CalendarCheck,
  UserX,
  Plane,
  Clock,
  CreditCard,
  Building2,
  Check,
  X,
  Eye,
  Plus,
  TrendingUp,
  Download,
  Shield,
  Sparkles,
  ArrowUpRight,
  AlertCircle,
  Activity,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface OrgActivity {
  id: string;
  type: 'hire' | 'payroll' | 'leave' | 'compliance' | 'attendance';
  title: string;
  description: string;
  timestamp: string;
  badge: string;
  badgeVariant: 'success' | 'primary' | 'purple' | 'neutral' | 'warning';
}

const ORG_ACTIVITIES: OrgActivity[] = [
  {
    id: 'oa_1',
    type: 'hire',
    title: 'New Hire Onboarded',
    description: 'Maya Lin registered as Product Marketing Manager in Marketing.',
    timestamp: '15 mins ago',
    badge: 'Onboarding',
    badgeVariant: 'success',
  },
  {
    id: 'oa_2',
    type: 'leave',
    title: 'Time-Off Approved',
    description: 'Annual Paid leave (5 days) approved for Alex Morgan by HR.',
    timestamp: '1 hour ago',
    badge: 'Leave',
    badgeVariant: 'primary',
  },
  {
    id: 'oa_3',
    type: 'payroll',
    title: 'August Payroll Batch Ready',
    description: 'Disbursement file for 105 active staff generated ($428,500).',
    timestamp: '3 hours ago',
    badge: 'Finance',
    badgeVariant: 'purple',
  },
  {
    id: 'oa_4',
    type: 'compliance',
    title: 'Workforce Audit Verified',
    description: 'Q3 time & attendance compliance validated with 98.4% score.',
    timestamp: 'Yesterday',
    badge: 'Compliance',
    badgeVariant: 'neutral',
  },
];

// Department Headcounts requested:
// Engineering — 42, HR — 8, Finance — 12, Marketing — 18, Operations — 25 (Total: 105)
const DEPARTMENT_DATA = [
  { name: 'Engineering', count: 42, color: '#4f46e5', pct: 40 },
  { name: 'Operations', count: 25, color: '#06b6d4', pct: 24 },
  { name: 'Marketing', count: 18, color: '#8b5cf6', pct: 17 },
  { name: 'Finance', count: 12, color: '#10b981', pct: 11 },
  { name: 'HR', count: 8, color: '#f59e0b', pct: 8 },
];

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { success, warning, info, error: toastError } = useToast();
  const newHireModal = useDisclosure();

  // Centralized Leave Data
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  // Attendance Chart Filter (Today | This week | This month)
  const [attendancePeriod, setAttendancePeriod] = useState<'today' | 'week' | 'month'>('week');

  // Modals: View Details, Approve, Reject
  const viewModal = useDisclosure();
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  const approveModal = useDisclosure();
  const [requestToApprove, setRequestToApprove] = useState<LeaveRequest | null>(null);
  const [isApproving, setIsApproving] = useState<boolean>(false);

  const rejectModal = useDisclosure();
  const [requestToReject, setRequestToReject] = useState<LeaveRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [rejectError, setRejectError] = useState<string>('');
  const [isRejecting, setIsRejecting] = useState<boolean>(false);

  // Fetch Centralized Leave Requests
  const fetchLeaves = useCallback(async () => {
    try {
      setHasError(false);
      const all = await leaveService.getAllLeaveRequests();
      setLeaveRequests(all);
    } catch (err) {
      console.error('Failed to load admin leaves', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();

    const handleSync = () => fetchLeaves();
    window.addEventListener('dayflow_leave_updated', handleSync);
    return () => window.removeEventListener('dayflow_leave_updated', handleSync);
  }, [fetchLeaves]);

  // Pending queue only
  const pendingLeaves = useMemo(() => {
    return leaveRequests.filter((r) => r.status === 'Pending');
  }, [leaveRequests]);

  // Approvals & Rejection Handlers
  const handleOpenApprove = (req: LeaveRequest) => {
    setRequestToApprove(req);
    approveModal.open();
  };

  const handleConfirmApprove = async () => {
    if (!requestToApprove) return;
    setIsApproving(true);
    try {
      await leaveService.approveLeaveRequest(requestToApprove.id, user?.name || 'Eleanor Vance (HR)');
      
      notificationService.addNotification({
        userId: requestToApprove.employeeId,
        title: 'Leave Approved',
        message: `Your leave request for ${requestToApprove.startDate} to ${requestToApprove.endDate} was approved.`,
        type: 'success'
      });

      success('Leave Approved', `Request for ${requestToApprove.employeeName} has been approved.`);
      approveModal.close();
      await fetchLeaves();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Approval failed';
      toastError('Approval Error', msg);
    } finally {
      setIsApproving(false);
    }
  };

  const handleOpenReject = (req: LeaveRequest) => {
    setRequestToReject(req);
    setRejectionReason('');
    setRejectError('');
    rejectModal.open();
  };

  const handleConfirmReject = async () => {
    if (!requestToReject) return;
    if (!rejectionReason.trim()) {
      setRejectError('Please enter a constructive reason for rejection.');
      return;
    }

    setIsRejecting(true);
    try {
      await leaveService.rejectLeaveRequest(
        requestToReject.id,
        rejectionReason.trim(),
        user?.name || 'Eleanor Vance (HR)'
      );
      rejectModal.close();
      warning(
        'Leave Request Declined',
        `Request for ${requestToReject.employeeName} was declined with reason recorded.`
      );
      await fetchLeaves();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Rejection failed';
      toastError('Rejection Error', msg);
    } finally {
      setIsRejecting(false);
    }
  };

  // Attendance Chart Datasets
  const weeklyAttendanceData = [
    { day: 'Mon', Present: 94, Absent: 3, HalfDay: 2, Leave: 6 },
    { day: 'Tue', Present: 96, Absent: 2, HalfDay: 1, Leave: 6 },
    { day: 'Wed', Present: 91, Absent: 5, HalfDay: 3, Leave: 6 },
    { day: 'Thu', Present: 93, Absent: 4, HalfDay: 2, Leave: 6 },
    { day: 'Fri (Today)', Present: 92, Absent: 4, HalfDay: 3, Leave: 6 },
  ];

  const monthlyAttendanceData = [
    { day: 'Week 1', Present: 95, Absent: 3, HalfDay: 2, Leave: 5 },
    { day: 'Week 2', Present: 93, Absent: 4, HalfDay: 3, Leave: 5 },
    { day: 'Week 3', Present: 96, Absent: 2, HalfDay: 1, Leave: 6 },
    { day: 'Week 4', Present: 92, Absent: 4, HalfDay: 3, Leave: 6 },
  ];

  const todayDonutData = [
    { name: 'Present', value: 92, color: '#10b981' },
    { name: 'Absent', value: 4, color: '#f43f5e' },
    { name: 'Half-day', value: 3, color: '#f59e0b' },
    { name: 'On Leave', value: 6, color: '#6366f1' },
  ];

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case 'Approved':
        return <Badge variant="success" size="xs" dot>Approved</Badge>;
      case 'Pending':
        return <Badge variant="warning" size="xs" dot>Pending</Badge>;
      case 'Rejected':
        return <Badge variant="error" size="xs" dot>Rejected</Badge>;
    }
  };

  const getLeaveTypeBadge = (type: LeaveType) => {
    switch (type) {
      case 'Paid':
        return <Badge variant="primary" size="xs">Annual Paid</Badge>;
      case 'Sick':
        return <Badge variant="purple" size="xs">Medical Sick</Badge>;
      case 'Unpaid':
        return <Badge variant="neutral" size="xs">Unpaid</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center">
        <LoadingState message="Initializing organization command center & workforce statistics..." />
      </div>
    );
  }

  if (hasError) {
    return (
      <ErrorState
        title="Failed to Load Admin Dashboard"
        message="An error occurred while synchronizing workforce metrics."
        onRetry={fetchLeaves}
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
              <Shield className="w-3.5 h-3.5 text-indigo-300" />
              <span>HR & Workforce Management Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Organization Overview 👋
            </h1>
            <p className="text-sm text-indigo-100/90 leading-relaxed">
              Every workday, perfectly aligned. Monitoring 105 active employees across 5 departments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="white"
              size="md"
              onClick={newHireModal.open}
              leftIcon={<Plus className="w-4 h-4 text-indigo-600" />}
            >
              Onboard Employee
            </Button>
            <Link to="/calendar">
              <Button
                variant="outline"
                size="md"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30"
                leftIcon={<Calendar className="w-4 h-4" />}
              >
                Workforce Calendar
              </Button>
            </Link>
            <Button
              variant="outline"
              size="md"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30"
              onClick={() => info('Export Payroll', 'Exporting August payroll compliance ledger.')}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export
            </Button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. 6 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1: Total Employees */}
        <Card className="p-4 hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Staff</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">105</p>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-600 font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>5 Depts Active</span>
          </div>
        </Card>

        {/* Card 2: Present Today */}
        <Card className="p-4 hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Present Today</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">92</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">87.6% attendance</p>
        </Card>

        {/* Card 3: Absent Today */}
        <Card className="p-4 hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Absent Today</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">4</p>
          <p className="text-[11px] text-rose-600 font-semibold mt-1">3.8% unplanned</p>
        </Card>

        {/* Card 4: On Leave */}
        <Card className="p-4 hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">On Leave</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Plane className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">6</p>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">Approved time-off</p>
        </Card>

        {/* Card 5: Pending Leave Requests */}
        <Link to="/admin/leave" className="block group">
          <Card className="p-4 hover:border-amber-300 transition-all h-full">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Leaves</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{pendingLeaves.length}</p>
            <p className="text-[11px] text-amber-600 font-semibold group-hover:underline mt-1">
              Action required &rarr;
            </p>
          </Card>
        </Link>

        {/* Card 6: Payroll Status */}
        <Card className="p-4 hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Payroll Status</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">$428.5k</p>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">August Batch: Ready</p>
        </Card>
      </div>

      {/* 3. Attendance Overview Chart & Department Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Distribution Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
              <div>
                <CardTitle>Workforce Attendance Overview</CardTitle>
                <CardDescription>Present, Absent, Half-Day, and Leave distribution</CardDescription>
              </div>

              {/* Timeframe Filter Switcher */}
              <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
                {(['today', 'week', 'month'] as const).map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setAttendancePeriod(period)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all capitalize ${
                      attendancePeriod === period
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {period === 'today' ? 'Today' : period === 'week' ? 'This Week' : 'This Month'}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {attendancePeriod === 'today' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center py-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={todayDonutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {todayDonutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Today's Breakdown (105 Staff)</p>
                  {todayDonutData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-semibold text-slate-800">{item.name}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">{item.value} employees</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={attendancePeriod === 'week' ? weeklyAttendanceData : monthlyAttendanceData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                    <Bar dataKey="Present" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar dataKey="HalfDay" fill="#f59e0b" radius={[0, 0, 0, 0]} stackId="a" />
                    <Bar dataKey="Leave" fill="#6366f1" radius={[0, 0, 0, 0]} stackId="a" />
                    <Bar dataKey="Absent" fill="#f43f5e" radius={[4, 4, 0, 0]} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Department Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle>Department Headcount</CardTitle>
                <CardDescription>105 total active employees</CardDescription>
              </div>
              <Building2 className="w-5 h-5 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {DEPARTMENT_DATA.map((dept, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dept.color }} />
                    <span>{dept.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {dept.count} <span className="text-[10px] text-slate-400 font-normal">({dept.pct}%)</span>
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${dept.pct}%`, backgroundColor: dept.color }}
                  />
                </div>
              </div>
            ))}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>5 Active Business Units</span>
              <Link to="/employees" className="text-indigo-600 font-bold hover:underline">
                View Directory &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Prominent Pending Leave Requests Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
            <div>
              <CardTitle>Pending Time-Off Approvals</CardTitle>
              <CardDescription>
                Review employee submissions with immediate approval & rejection comments
              </CardDescription>
            </div>
            <Link to="/admin/leave">
              <Button variant="ghost" size="xs" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                Manage Full Queue ({pendingLeaves.length})
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent>
          {pendingLeaves.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-sm font-bold text-slate-900">All Approvals Completed!</p>
              <p className="text-xs">No pending leave requests awaiting HR review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4 rounded-l-xl">Employee</th>
                    <th className="py-3 px-4">Leave Type</th>
                    <th className="py-3 px-4">Date Range</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {pendingLeaves.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Employee */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={req.avatarUrl}
                            name={req.employeeName}
                            size="sm"
                            status="active"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{req.employeeName}</p>
                            <p className="text-[10px] text-slate-500">
                              <span className="font-mono text-slate-400 font-bold">{req.employeeId}</span> &bull; {req.department}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Leave Type */}
                      <td className="py-3.5 px-4">
                        {getLeaveTypeBadge(req.leaveType)}
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {req.startDate} &rarr; {req.endDate}
                      </td>

                      {/* Duration */}
                      <td className="py-3.5 px-4 font-bold text-indigo-700 font-mono">
                        {req.days} {req.days === 1 ? 'day' : 'days'}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(req.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => {
                              setSelectedRequest(req);
                              viewModal.open();
                            }}
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                          >
                            View
                          </Button>
                          <Button
                            variant="success"
                            size="xs"
                            onClick={() => handleOpenApprove(req)}
                            leftIcon={<Check className="w-3.5 h-3.5" />}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="ghost"
                            size="xs"
                            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                            onClick={() => handleOpenReject(req)}
                            leftIcon={<X className="w-3.5 h-3.5" />}
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 5. Recent Organization Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <CardTitle>Recent Organization Activity</CardTitle>
              <CardDescription>Company-wide log of onboarding, payroll, and compliance events</CardDescription>
            </div>
            <Activity className="w-5 h-5 text-indigo-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100">
            {ORG_ACTIVITIES.map((act) => (
              <div key={act.id} className="py-3.5 flex items-start justify-between gap-3 hover:bg-slate-50/50 p-2 rounded-xl transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900">{act.title}</p>
                      <Badge variant={act.badgeVariant} size="xs">{act.badge}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{act.description}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0 mt-0.5">{act.timestamp}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Request Modal */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={viewModal.close}
        title="Leave Request Details"
        description="Comprehensive review of employee submission and reason."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={viewModal.close}>
              Close
            </Button>
            {selectedRequest?.status === 'Pending' && (
              <>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    viewModal.close();
                    if (selectedRequest) handleOpenReject(selectedRequest);
                  }}
                >
                  Reject
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => {
                    viewModal.close();
                    if (selectedRequest) handleOpenApprove(selectedRequest);
                  }}
                >
                  Approve Request
                </Button>
              </>
            )}
          </>
        }
      >
        {selectedRequest && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <Avatar
                src={selectedRequest.avatarUrl}
                name={selectedRequest.employeeName}
                size="md"
                status="active"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">{selectedRequest.employeeName}</p>
                <p className="text-slate-500 font-mono font-semibold">
                  {selectedRequest.employeeId} &bull; {selectedRequest.department}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/60">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Leave Category</span>
                <p className="font-bold text-slate-800 mt-0.5">{selectedRequest.leaveType} Leave</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Duration</span>
                <p className="font-bold text-indigo-700 mt-0.5">{selectedRequest.days} Working Days</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Start Date</span>
                <p className="font-bold text-slate-800 mt-0.5 font-mono">{selectedRequest.startDate}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">End Date</span>
                <p className="font-bold text-slate-800 mt-0.5 font-mono">{selectedRequest.endDate}</p>
              </div>
            </div>

            <div>
              <span className="text-[11px] uppercase font-bold text-slate-400">Employee Stated Reason</span>
              <p className="mt-1 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs leading-relaxed">
                {selectedRequest.reason}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Approve Confirmation Modal */}
      <Modal
        isOpen={approveModal.isOpen}
        onClose={approveModal.close}
        title="Confirm Leave Approval"
        description="Are you sure you want to approve this leave request? Leave quota will be automatically deducted."
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={approveModal.close}
              disabled={isApproving}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={handleConfirmApprove}
              isLoading={isApproving}
              leftIcon={<Check className="w-4 h-4" />}
            >
              Confirm & Approve
            </Button>
          </>
        }
      >
        {requestToApprove && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1.5">
            <p className="font-bold text-sm">
              Approve {requestToApprove.leaveType} Leave for {requestToApprove.employeeName}
            </p>
            <p className="text-emerald-800">
              Dates: <strong className="font-mono">{requestToApprove.startDate}</strong> &rarr;{' '}
              <strong className="font-mono">{requestToApprove.endDate}</strong> ({requestToApprove.days} working days)
            </p>
          </div>
        )}
      </Modal>

      {/* Reject Modal with Mandatory Comment */}
      <Modal
        isOpen={rejectModal.isOpen}
        onClose={rejectModal.close}
        title="Decline Leave Request"
        description="Please provide a constructive reason for declining this request. The employee will be notified."
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={rejectModal.close}
              disabled={isRejecting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmReject}
              isLoading={isRejecting}
            >
              Decline Request
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          {rejectError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{rejectError}</span>
            </div>
          )}

          {requestToReject && (
            <p className="text-xs text-slate-600">
              Declining <strong>{requestToReject.leaveType} Leave</strong> for{' '}
              <strong>{requestToReject.employeeName}</strong> ({requestToReject.days} days).
            </p>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Rejection Comment / Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value);
                setRejectError('');
              }}
              placeholder="e.g. Insufficient coverage during the scheduled product launch sprint..."
              className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 text-xs text-slate-900 rounded-xl p-3 placeholder:text-slate-400 outline-none transition-all"
              required
              autoFocus
            />
          </div>
        </div>
      </Modal>

      {/* Onboard New Hire Modal */}
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
              options={[
                { value: 'eng', label: 'Engineering (42)' },
                { value: 'ops', label: 'Operations (25)' },
                { value: 'mkt', label: 'Marketing (18)' },
                { value: 'fin', label: 'Finance (12)' },
                { value: 'hr', label: 'Human Resources (8)' },
              ]}
            />
          </div>
          <Input label="Designation / Role" defaultValue="Product Marketing Manager" />
        </div>
      </Modal>
    </div>
  );
};
