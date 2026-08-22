import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../hooks/useToast';
import { attendanceService } from '../../services/attendanceService';
import type { AttendanceRecord, AttendanceSummaryStats, AttendanceStatus } from '../../types/attendance';
import { calculateWorkingHoursString } from '../../utils/timeCalculators';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import {
  Users,
  CalendarCheck,
  Search,
  Download,
  Calendar,
  Sparkles,
  HeartPulse,
  AlertTriangle,
  FileSpreadsheet,
  Clock,
} from 'lucide-react';

export const AdminAttendancePage: React.FC = () => {
  const { success, info } = useToast();

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceSummaryStats>({
    totalEmployees: 148,
    presentToday: 142,
    onLeaveToday: 4,
    halfDayToday: 2,
    absentToday: 1,
    attendanceRate: 98,
  });

  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  const fetchRecords = useCallback(async () => {
    try {
      setHasError(false);
      const res = await attendanceService.getAllWorkforceAttendance({
        search: searchQuery,
        department: selectedDept,
        status: selectedStatus,
        date: selectedDate || undefined,
        view: viewMode,
      });
      setRecords(res.records);
      setStats(res.stats);
    } catch (err) {
      console.error('Failed to fetch attendance records', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedDept, selectedStatus, selectedDate, viewMode]);

  useEffect(() => {
    fetchRecords();

    // Listen for live updates
    const handleSync = () => fetchRecords();
    window.addEventListener('dayflow_attendance_updated', handleSync);
    return () => window.removeEventListener('dayflow_attendance_updated', handleSync);
  }, [fetchRecords]);

  const handleExportCSV = () => {
    info(
      'Exporting Timesheet',
      `Generating workforce attendance spreadsheet for ${records.length} employee records.`
    );
    setTimeout(() => {
      success('Export Completed', 'Attendance_Report_August_2026.csv downloaded.');
    }, 1000);
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'Present':
        return <Badge variant="success" size="xs" dot>Present</Badge>;
      case 'Working':
        return <Badge variant="primary" size="xs" dot>Working Now</Badge>;
      case 'Half-day':
        return <Badge variant="warning" size="xs">Half-day</Badge>;
      case 'Leave':
        return <Badge variant="neutral" size="xs">On Leave</Badge>;
      case 'Absent':
        return <Badge variant="error" size="xs">Absent</Badge>;
      default:
        return <Badge variant="neutral" size="xs">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-900 via-indigo-800 to-indigo-700 text-white p-6 sm:p-8 shadow-lg shadow-indigo-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Workforce Attendance Monitoring</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Time & Attendance Operations
            </h1>
            <p className="text-sm text-indigo-100/90 leading-relaxed">
              Real-time biometric punch monitoring, daily workforce status, and compliance timesheets across all 8 departments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="white"
              size="md"
              onClick={handleExportCSV}
              leftIcon={<Download className="w-4 h-4 text-indigo-600" />}
            >
              Export Timesheet (CSV)
            </Button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Present */}
        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Present Today</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{stats.presentToday}</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">98.2% attendance rate</p>
        </Card>

        {/* On Leave */}
        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">On Approved Leave</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <HeartPulse className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{stats.onLeaveToday}</p>
          <p className="text-xs text-slate-400 mt-1">Vacation & sick leaves</p>
        </Card>

        {/* Half Day */}
        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Half-day Shift</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{stats.halfDayToday}</p>
          <p className="text-xs text-amber-600 font-medium mt-1">Partial shifts logged</p>
        </Card>

        {/* Absent */}
        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Unexcused Absent</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{stats.absentToday}</p>
          <p className="text-xs text-rose-600 font-medium mt-1">Requires HR review</p>
        </Card>

        {/* Total Workforce */}
        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Headcount</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{stats.totalEmployees}</p>
          <p className="text-xs text-purple-600 font-medium mt-1">Across 8 departments</p>
        </Card>
      </div>

      {/* Main Table Card with Search & Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full">
            <div>
              <CardTitle>Workforce Punch Logs</CardTitle>
              <CardDescription>
                Live biometric check-in & check-out entries with calculated work hours
              </CardDescription>
            </div>

            {/* Daily vs Weekly View Switcher */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 self-start lg:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('daily')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'daily'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Daily View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('weekly')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'weekly'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Weekly Summary View
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Filter Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80">
            {/* Search */}
            <Input
              placeholder="Search by name, ID (e.g. DF-4089)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />

            {/* Department Filter */}
            <Select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              options={[
                { value: 'all', label: 'All Departments' },
                { value: 'Product Engineering', label: 'Product Engineering' },
                { value: 'Engineering', label: 'Engineering' },
                { value: 'Product Design', label: 'Product Design' },
                { value: 'Sales & BD', label: 'Sales & BD' },
                { value: 'Operations', label: 'Operations' },
                { value: 'Product Marketing', label: 'Product Marketing' },
                { value: 'Finance & Legal', label: 'Finance & Legal' },
                { value: 'Human Resources', label: 'Human Resources' },
              ]}
            />

            {/* Status Filter */}
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'Present', label: 'Present' },
                { value: 'Working', label: 'Working (Active)' },
                { value: 'Half-day', label: 'Half-day' },
                { value: 'Leave', label: 'On Leave' },
                { value: 'Absent', label: 'Absent' },
              ]}
            />

            {/* Date Filter */}
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
            />
          </div>

          {/* Results Table */}
          {isLoading ? (
            <div className="py-16 flex justify-center">
              <LoadingState message="Filtering workforce attendance records..." />
            </div>
          ) : hasError ? (
            <ErrorState
              title="Attendance Filter Error"
              message="Failed to load filtered workforce attendance records."
              onRetry={fetchRecords}
            />
          ) : records.length === 0 ? (
            <EmptyState
              icon={<FileSpreadsheet className="w-8 h-8 text-slate-400" />}
              title="No Matching Employee Records"
              description="No attendance entries matched your search keywords or filter criteria."
              actionLabel="Clear Filters"
              onAction={() => {
                setSearchQuery('');
                setSelectedDept('all');
                setSelectedStatus('all');
                setSelectedDate('');
              }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4 rounded-l-xl">Employee</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Check In</th>
                    <th className="py-3 px-4">Check Out</th>
                    <th className="py-3 px-4">Calculated Hours</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 rounded-r-xl">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {records.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Employee info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={r.avatarUrl}
                            name={r.employeeName}
                            size="sm"
                            status={r.status === 'Working' ? 'active' : 'offline'}
                          />
                          <div>
                            <p className="font-bold text-slate-900">{r.employeeName}</p>
                            <p className="text-[10px] font-mono text-slate-400">{r.employeeId}</p>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3 px-4 text-slate-600">
                        {r.department}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-slate-500 font-mono">
                        {r.date}
                      </td>

                      {/* Check In */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {r.checkIn || '--:--'}
                      </td>

                      {/* Check Out */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {r.checkOut || (r.status === 'Working' ? '--' : '--:--')}
                      </td>

                      {/* Calculated Working Hours */}
                      <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                        {calculateWorkingHoursString(r.checkIn, r.checkOut, r.status)}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {getStatusBadge(r.status)}
                      </td>

                      {/* Remarks */}
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {r.notes || 'Normal punch log'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
