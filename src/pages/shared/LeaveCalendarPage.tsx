import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { leaveService } from '../../services/leaveService';
import type { LeaveRequest, LeaveStatus, LeaveType } from '../../types/leave';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { LoadingState } from '../../components/ui/LoadingState';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Search,
  Plane,
  HeartPulse,
  Coffee,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const LeaveCalendarPage: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Calendar view mode: Month or Week
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  // Navigation date state (year, month 0-indexed, or week anchor)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 7, 22)); // August 2026

  // Filters
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected event for detail modal
  const [selectedEvent, setSelectedEvent] = useState<LeaveRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  const fetchLeaveData = useCallback(async () => {
    try {
      const data = await leaveService.getAllLeaveRequests();
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch leave requests for calendar', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaveData();

    const handleSync = () => fetchLeaveData();
    window.addEventListener('dayflow_leave_updated', handleSync);
    return () => window.removeEventListener('dayflow_leave_updated', handleSync);
  }, [fetchLeaveData]);

  // Unique list of employees for filter dropdown
  const employeeOptions = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    requests.forEach((r) => {
      if (!map.has(r.employeeId)) {
        map.set(r.employeeId, { id: r.employeeId, name: r.employeeName });
      }
    });
    return Array.from(map.values());
  }, [requests]);

  // Filtered requests based on user filters
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesDept = selectedDept === 'all' || r.department.toLowerCase() === selectedDept.toLowerCase();
      const matchesEmp = selectedEmployee === 'all' || r.employeeId.toUpperCase() === selectedEmployee.toUpperCase();
      const matchesStatus = selectedStatus === 'all' || r.status === selectedStatus;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        r.employeeName.toLowerCase().includes(q) ||
        r.employeeId.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q);

      return matchesDept && matchesEmp && matchesStatus && matchesSearch;
    });
  }, [requests, selectedDept, selectedEmployee, selectedStatus, searchQuery]);

  // Navigation handlers
  const handlePrev = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'month') {
        d.setMonth(d.getMonth() - 1);
      } else {
        d.setDate(d.getDate() - 7);
      }
      return d;
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'month') {
        d.setMonth(d.getMonth() + 1);
      } else {
        d.setDate(d.getDate() + 7);
      }
      return d;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 7, 22)); // Aug 22, 2026
  };

  // Month grid generation (Monday to Sunday)
  const monthGridDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Day of week index (0 = Sun, 1 = Mon... 6 = Sat) -> convert so Monday is index 0
    let startDayIndex = firstDayOfMonth.getDay() - 1;
    if (startDayIndex === -1) startDayIndex = 6; // Sunday becomes 6

    const days: { date: Date; dateStr: string; isCurrentMonth: boolean; isToday: boolean }[] = [];

    // Previous month padding
    for (let i = startDayIndex; i > 0; i--) {
      const d = new Date(year, month, 1 - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: d,
        dateStr,
        isCurrentMonth: false,
        isToday: dateStr === '2026-08-22',
      });
    }

    // Current month days
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const d = new Date(year, month, i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: d,
        dateStr,
        isCurrentMonth: true,
        isToday: dateStr === '2026-08-22',
      });
    }

    // Next month padding to fill complete grid (multiples of 7)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: d,
        dateStr,
        isCurrentMonth: false,
        isToday: dateStr === '2026-08-22',
      });
    }

    return days;
  }, [currentDate]);

  // Week days generation (Monday to Sunday for current week)
  const weekDays = useMemo(() => {
    const d = new Date(currentDate);
    const day = d.getDay();
    const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diffToMonday));

    const days: { date: Date; dateStr: string; dayName: string; isToday: boolean }[] = [];
    const names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    for (let i = 0; i < 7; i++) {
      const cur = new Date(monday);
      cur.setDate(monday.getDate() + i);
      const dateStr = cur.toISOString().split('T')[0];
      days.push({
        date: cur,
        dateStr,
        dayName: names[i],
        isToday: dateStr === '2026-08-22',
      });
    }

    return days;
  }, [currentDate]);

  // Helper to check if a leave request spans a specific date string (YYYY-MM-DD)
  const getLeavesForDate = (dateStr: string) => {
    return filteredRequests.filter((r) => {
      return dateStr >= r.startDate && dateStr <= r.endDate;
    });
  };

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case 'Approved':
        return <Badge variant="success" size="xs" dot>Approved</Badge>;
      case 'Pending':
        return <Badge variant="warning" size="xs" dot>Pending Review</Badge>;
      case 'Rejected':
        return <Badge variant="error" size="xs" dot>Rejected</Badge>;
    }
  };

  const getLeaveTypeIcon = (type: LeaveType) => {
    switch (type) {
      case 'Paid':
        return <Plane className="w-3 h-3 text-indigo-600 shrink-0" />;
      case 'Sick':
        return <HeartPulse className="w-3 h-3 text-purple-600 shrink-0" />;
      case 'Unpaid':
        return <Coffee className="w-3 h-3 text-slate-500 shrink-0" />;
    }
  };

  const renderEventPill = (req: LeaveRequest, compact: boolean = true) => {
    const isApproved = req.status === 'Approved';
    const isPending = req.status === 'Pending';
    const isRejected = req.status === 'Rejected';

    return (
      <button
        key={`${req.id}-${compact}`}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedEvent(req);
          setIsDetailOpen(true);
        }}
        className={cn(
          'w-full text-left rounded-lg p-1.5 transition-all text-[11px] font-medium border flex items-center justify-between gap-1.5 shadow-2xs hover:scale-[1.02] cursor-pointer',
          isApproved && 'bg-emerald-50/90 text-emerald-900 border-emerald-200 hover:bg-emerald-100/90',
          isPending && 'bg-amber-50/90 text-amber-900 border-amber-200 hover:bg-amber-100/90',
          isRejected && 'bg-rose-50/90 text-rose-900 border-rose-200 opacity-75 hover:opacity-100 hover:bg-rose-100/90'
        )}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {getLeaveTypeIcon(req.leaveType)}
          <span className="font-bold truncate">
            {req.employeeName.split(' ')[0]}
          </span>
          <span className="text-[10px] text-slate-500 font-normal hidden sm:inline truncate">
            ({req.leaveType})
          </span>
        </div>

        <span
          className={cn(
            'w-2 h-2 rounded-full shrink-0',
            isApproved && 'bg-emerald-500',
            isPending && 'bg-amber-500 animate-pulse',
            isRejected && 'bg-rose-500'
          )}
          title={`Status: ${req.status}`}
        />
      </button>
    );
  };

  const monthTitle = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const weekTitle = `Week of ${weekDays[0]?.date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })} - ${weekDays[6]?.date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-900 via-indigo-800 to-indigo-700 text-white p-6 sm:p-8 shadow-lg shadow-indigo-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Workforce Availability & Team Leave Calendar</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Leave Schedule & Calendar
            </h1>
            <p className="text-sm text-indigo-100/90 leading-relaxed">
              View company-wide planned leaves, upcoming team absences, and pending managerial reviews in monthly & weekly matrix views.
            </p>
          </div>

          {/* Status Legend Pill */}
          <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs">
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-100 border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Approved</span>
            </span>
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-500/20 text-amber-100 border border-amber-400/30">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Pending</span>
            </span>
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-rose-500/20 text-rose-100 border border-rose-400/30">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>Rejected</span>
            </span>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Calendar Card */}
      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full">
            {/* Left: Navigation Buttons & Current Month/Week Title */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all"
                  aria-label="Previous interval"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleToday}
                  className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all"
                  aria-label="Next interval"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-base sm:text-lg font-black text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
                {viewMode === 'month' ? monthTitle : weekTitle}
              </h2>
            </div>

            {/* Right: View Mode Switcher (Month vs Week) */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 self-start lg:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('month')}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all',
                  viewMode === 'month'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                Month View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('week')}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all',
                  viewMode === 'week'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                Week View
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Multi-Filters Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80">
            {/* Search */}
            <Input
              placeholder="Search employee, reason..."
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
                { value: 'Human Resources', label: 'Human Resources' },
              ]}
            />

            {/* Employee Filter */}
            <Select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              options={[
                { value: 'all', label: 'All Employees' },
                ...employeeOptions.map((emp) => ({
                  value: emp.id,
                  label: `${emp.name} (${emp.id})`,
                })),
              ]}
            />

            {/* Status Filter */}
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'Approved', label: 'Approved Only' },
                { value: 'Pending', label: 'Pending Only' },
                { value: 'Rejected', label: 'Rejected Only' },
              ]}
            />
          </div>

          {/* Calendar Content Area */}
          {isLoading ? (
            <div className="py-24 flex justify-center">
              <LoadingState message="Rendering leave schedule..." />
            </div>
          ) : viewMode === 'month' ? (
            /* ================= MONTH VIEW ================= */
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white">
              {/* Day Headers (Mon - Sun) */}
              <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/90 text-center text-xs font-bold text-slate-600 py-3">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span className="text-slate-400">Sat</span>
                <span className="text-slate-400">Sun</span>
              </div>

              {/* Month Grid Cells */}
              <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100">
                {monthGridDays.map((dayItem, idx) => {
                  const leavesOnDay = getLeavesForDate(dayItem.dateStr);

                  return (
                    <div
                      key={idx}
                      className={cn(
                        'min-h-[110px] p-2 flex flex-col justify-between transition-colors',
                        !dayItem.isCurrentMonth && 'bg-slate-50/40 text-slate-400',
                        dayItem.isCurrentMonth && 'bg-white text-slate-800 hover:bg-slate-50/50',
                        dayItem.isToday && 'ring-2 ring-indigo-600 ring-inset bg-indigo-50/20'
                      )}
                    >
                      {/* Day Number Header */}
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            'text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center',
                            dayItem.isToday
                              ? 'bg-indigo-600 text-white'
                              : dayItem.isCurrentMonth
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          )}
                        >
                          {dayItem.date.getDate()}
                        </span>

                        {leavesOnDay.length > 0 && (
                          <span className="text-[10px] font-mono text-slate-400 font-bold">
                            {leavesOnDay.length} {leavesOnDay.length === 1 ? 'leave' : 'leaves'}
                          </span>
                        )}
                      </div>

                      {/* Events List in cell */}
                      <div className="mt-1 space-y-1 overflow-y-auto max-h-[80px]">
                        {leavesOnDay.map((req) => renderEventPill(req, true))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ================= WEEK VIEW ================= */
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-7 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
                {weekDays.map((wDay) => {
                  const leavesOnDay = getLeavesForDate(wDay.dateStr);

                  return (
                    <div
                      key={wDay.dateStr}
                      className={cn(
                        'min-h-[300px] flex flex-col p-3 transition-colors',
                        wDay.isToday ? 'bg-indigo-50/30' : 'bg-white hover:bg-slate-50/40'
                      )}
                    >
                      {/* Day Title */}
                      <div className="pb-3 border-b border-slate-100 flex sm:flex-col items-center sm:items-start justify-between gap-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {wDay.dayName}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              'text-sm font-black w-7 h-7 rounded-full flex items-center justify-center font-mono',
                              wDay.isToday ? 'bg-indigo-600 text-white' : 'text-slate-900 bg-slate-100'
                            )}
                          >
                            {wDay.date.getDate()}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {wDay.date.toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                        </div>
                      </div>

                      {/* Leaves List for Day */}
                      <div className="mt-3 flex-1 space-y-2 overflow-y-auto">
                        {leavesOnDay.length === 0 ? (
                          <div className="h-full flex items-center justify-center text-[11px] text-slate-400 italic py-6 sm:py-0">
                            No leaves
                          </div>
                        ) : (
                          leavesOnDay.map((req) => (
                            <div
                              key={req.id}
                              onClick={() => {
                                setSelectedEvent(req);
                                setIsDetailOpen(true);
                              }}
                              className={cn(
                                'p-2.5 rounded-xl border text-xs cursor-pointer shadow-xs transition-all hover:scale-[1.02]',
                                req.status === 'Approved' && 'bg-emerald-50 border-emerald-200 text-emerald-950',
                                req.status === 'Pending' && 'bg-amber-50 border-amber-200 text-amber-950',
                                req.status === 'Rejected' && 'bg-rose-50 border-rose-200 text-rose-950 opacity-80'
                              )}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <p className="font-bold truncate">{req.employeeName}</p>
                                {getStatusBadge(req.status)}
                              </div>
                              <p className="text-[11px] text-slate-600 mt-1 font-medium flex items-center gap-1">
                                {getLeaveTypeIcon(req.leaveType)}
                                <span>{req.leaveType} Leave ({req.days}d)</span>
                              </p>
                              <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 italic">
                                "{req.reason}"
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interactive Detail Modal on Event Click */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Leave Schedule Details"
        description="Comprehensive employee time-off record and review remarks."
        footer={
          <Button variant="outline" size="sm" onClick={() => setIsDetailOpen(false)}>
            Close
          </Button>
        }
      >
        {selectedEvent && (
          <div className="space-y-4 text-xs">
            {/* Employee Profile Header */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <Avatar
                src={selectedEvent.avatarUrl}
                name={selectedEvent.employeeName}
                size="md"
                status="active"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">{selectedEvent.employeeName}</p>
                <p className="text-slate-500 font-mono font-semibold">
                  {selectedEvent.employeeId} &bull; {selectedEvent.department}
                </p>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/60">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Leave Type</span>
                <p className="font-bold text-slate-800 mt-0.5">{selectedEvent.leaveType} Leave</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Number of Days</span>
                <p className="font-bold text-indigo-700 mt-0.5">{selectedEvent.days} Working Days</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Start Date</span>
                <p className="font-bold text-slate-800 mt-0.5 font-mono">{selectedEvent.startDate}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">End Date</span>
                <p className="font-bold text-slate-800 mt-0.5 font-mono">{selectedEvent.endDate}</p>
              </div>
            </div>

            {/* Status Pill */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-700">Approval Status:</span>
              <div>{getStatusBadge(selectedEvent.status)}</div>
            </div>

            {/* Reason */}
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-400">Employee Stated Reason</span>
              <p className="mt-1 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs leading-relaxed">
                {selectedEvent.reason}
              </p>
            </div>

            {/* HR Review Remarks */}
            {selectedEvent.rejectionReason && (
              <div>
                <span className="text-[11px] uppercase font-bold text-rose-600">HR Decline Comment</span>
                <p className="mt-1 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs leading-relaxed">
                  {selectedEvent.rejectionReason}
                </p>
              </div>
            )}

            {selectedEvent.reviewedBy && (
              <p className="text-[11px] text-slate-400">
                Decision rendered by <strong className="text-slate-700">{selectedEvent.reviewedBy}</strong> on{' '}
                {selectedEvent.reviewedAt}
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
