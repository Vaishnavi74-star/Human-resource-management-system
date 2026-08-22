import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { useDisclosure } from '../../hooks/useDisclosure';
import { leaveService, calculateLeaveDays } from '../../services/leaveService';
import type { LeaveRequest, LeaveBalances, LeaveType } from '../../types/leave';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  Plus,
  Plane,
  HeartPulse,
  Coffee,
  Sparkles,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const EmployeeLeavePage: React.FC = () => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const applyModal = useDisclosure();

  const employeeId = user?.employeeId || 'DF-4089';
  const employeeName = user?.name || 'Alex Morgan';
  const department = user?.department || 'Product Engineering';

  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [balances, setBalances] = useState<LeaveBalances>({
    annualPaid: 12,
    annualTotal: 20,
    sick: 8,
    sickTotal: 10,
    unpaidTaken: 0,
  });

  const [filterTab, setFilterTab] = useState<'all' | 'Pending' | 'Approved' | 'Rejected'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form State
  const [formType, setFormType] = useState<LeaveType>('Paid');
  const [formStart, setFormStart] = useState<string>('2026-09-21');
  const [formEnd, setFormEnd] = useState<string>('2026-09-25');
  const [formReason, setFormReason] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Automatically calculate working days
  const calculatedDays = calculateLeaveDays(formStart, formEnd);

  const loadData = useCallback(async () => {
    try {
      setHasError(false);
      const [reqList, bal] = await Promise.all([
        leaveService.getEmployeeLeaveRequests(employeeId),
        leaveService.getEmployeeBalances(employeeId),
      ]);
      setRequests(reqList);
      setBalances(bal);
    } catch (err) {
      console.error('Failed to load leave data', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    loadData();

    const handleSync = () => loadData();
    window.addEventListener('dayflow_leave_updated', handleSync);
    return () => window.removeEventListener('dayflow_leave_updated', handleSync);
  }, [loadData]);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (calculatedDays <= 0) {
      setFormError('Please select a valid date range (End Date must be on or after Start Date).');
      return;
    }

    if (!formReason.trim()) {
      setFormError('Please enter a brief reason for your leave request.');
      return;
    }

    if (formType === 'Paid' && calculatedDays > balances.annualPaid) {
      setFormError(
        `Insufficient Paid Leave balance. You requested ${calculatedDays} days, but only ${balances.annualPaid} days remain.`
      );
      return;
    }

    if (formType === 'Sick' && calculatedDays > balances.sick) {
      setFormError(
        `Insufficient Sick Leave balance. You requested ${calculatedDays} days, but only ${balances.sick} days remain.`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await leaveService.submitLeaveRequest({
        employeeId,
        employeeName,
        department,
        avatarUrl: user?.avatarUrl,
        leaveType: formType,
        startDate: formStart,
        endDate: formEnd,
        reason: formReason.trim(),
      });

      applyModal.close();
      setFormReason('');
      success(
        'Leave Request Submitted!',
        `Your ${calculatedDays}-day ${formType} leave request has been submitted for HR review.`
      );
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed';
      setFormError(msg);
      toastError('Submission Error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filterTab === 'all') return true;
    return r.status === filterTab;
  });

  const getStatusBadge = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'Approved':
        return <Badge variant="success" size="sm" dot>Approved</Badge>;
      case 'Pending':
        return <Badge variant="warning" size="sm" dot>Pending Review</Badge>;
      case 'Rejected':
        return <Badge variant="error" size="sm" dot>Rejected</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
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
      <div className="py-20 flex justify-center">
        <LoadingState message="Loading your leave balances and request history..." />
      </div>
    );
  }

  if (hasError) {
    return (
      <ErrorState
        title="Failed to Load Leave Records"
        message="An error occurred while fetching leave quotas and request history."
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-900 via-indigo-800 to-indigo-700 text-white p-6 sm:p-8 shadow-lg shadow-indigo-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Time Off & Leave Self-Service</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Leave Management
            </h1>
            <p className="text-sm text-indigo-100/90 leading-relaxed">
              Track your paid, medical, and unpaid leave allocations and submit time-off requests directly to HR.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/calendar">
              <Button
                variant="outline"
                size="md"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30"
                leftIcon={<Calendar className="w-4 h-4" />}
              >
                Leave Calendar
              </Button>
            </Link>

            <Button
              variant="white"
              size="md"
              onClick={() => {
                setFormError('');
                applyModal.open();
              }}
              leftIcon={<Plus className="w-4 h-4 text-indigo-600" />}
            >
              Apply for Leave
            </Button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 1. Leave Balances Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Annual Paid Leave */}
        <Card className="hover:border-indigo-200 transition-all p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Plane className="w-5 h-5" />
              </div>
              <Badge variant="primary" size="xs">Paid Time Off</Badge>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Annual Leave</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-3xl font-black text-slate-900">{balances.annualPaid}</p>
              <span className="text-xs text-slate-500 font-semibold">days available</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Total allocated: {balances.annualTotal} days</span>
            <span className="font-semibold text-indigo-600">Accrues monthly</span>
          </div>
        </Card>

        {/* Sick Leave */}
        <Card className="hover:border-purple-200 transition-all p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <HeartPulse className="w-5 h-5" />
              </div>
              <Badge variant="purple" size="xs">Medical</Badge>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sick Leave</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-3xl font-black text-slate-900">{balances.sick}</p>
              <span className="text-xs text-slate-500 font-semibold">days available</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Total allocated: {balances.sickTotal} days</span>
            <span className="font-semibold text-purple-600">Doctor note &gt; 2d</span>
          </div>
        </Card>

        {/* Unpaid Leave */}
        <Card className="hover:border-slate-300 transition-all p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Coffee className="w-5 h-5" />
              </div>
              <Badge variant="neutral" size="xs">Policy Based</Badge>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unpaid Leave</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-3xl font-black text-slate-900">Available</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Taken this year: {balances.unpaidTaken} days</span>
            <span className="font-semibold text-slate-700">Subject to HR review</span>
          </div>
        </Card>
      </div>

      {/* 2. Leave Requests List & Filter Tabs */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <div>
              <CardTitle>My Leave Requests History</CardTitle>
              <CardDescription>
                Track status of your pending, approved, and rejected submissions
              </CardDescription>
            </div>

            {/* Status Filter Tabs */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
              {(['all', 'Pending', 'Approved', 'Rejected'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilterTab(tab)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all',
                    filterTab === tab
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  {tab === 'all' ? 'All Requests' : tab}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredRequests.length === 0 ? (
            <EmptyState
              icon={<CalendarCheck className="w-8 h-8 text-slate-400" />}
              title={`No ${filterTab === 'all' ? '' : filterTab} Requests Found`}
              description="You have no leave submissions in this category. Click 'Apply for Leave' to submit one."
              actionLabel="Apply for Leave"
              onAction={applyModal.open}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4 rounded-l-xl">Leave Type</th>
                    <th className="py-3 px-4">Date Range</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Reason / Notes</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4 rounded-r-xl">HR Review Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Leave Type */}
                      <td className="py-3.5 px-4">
                        {getLeaveTypeBadge(req.leaveType)}
                      </td>

                      {/* Date Range */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {new Date(req.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} &rarr;{' '}
                        {new Date(req.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>

                      {/* Duration */}
                      <td className="py-3.5 px-4 font-bold text-indigo-700 font-mono">
                        {req.days} {req.days === 1 ? 'day' : 'days'}
                      </td>

                      {/* Reason */}
                      <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate" title={req.reason}>
                        {req.reason}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(req.status)}
                      </td>

                      {/* Submitted Date */}
                      <td className="py-3.5 px-4 text-slate-500 font-mono">
                        {req.submittedAt}
                      </td>

                      {/* Rejection / Approval Review Note */}
                      <td className="py-3.5 px-4">
                        {req.status === 'Rejected' && req.rejectionReason ? (
                          <div className="flex items-center gap-1.5 text-rose-700 bg-rose-50 p-1.5 rounded-lg border border-rose-200">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate max-w-xs" title={req.rejectionReason}>
                              {req.rejectionReason}
                            </span>
                          </div>
                        ) : req.status === 'Approved' ? (
                          <span className="text-emerald-700 text-[11px] font-semibold">
                            Reviewed by {req.reviewedBy || 'HR'}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Awaiting reviewer assignment</span>
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

      {/* 3. Apply Leave Modal Form */}
      <Modal
        isOpen={applyModal.isOpen}
        onClose={applyModal.close}
        title="Apply for Leave"
        description="Select your leave category, dates, and provide a brief reason for managerial review."
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={applyModal.close}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleApplySubmit}
              isLoading={isSubmitting}
            >
              Submit Leave Request
            </Button>
          </>
        }
      >
        <form onSubmit={handleApplySubmit} className="space-y-4">
          {formError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* Leave Type Select */}
          <Select
            label="Leave Category"
            value={formType}
            onChange={(e) => setFormType(e.target.value as LeaveType)}
            options={[
              { value: 'Paid', label: `Annual Paid Leave (${balances.annualPaid} days available)` },
              { value: 'Sick', label: `Medical / Sick Leave (${balances.sick} days available)` },
              { value: 'Unpaid', label: 'Unpaid Leave of Absence (Available)' },
            ]}
          />

          {/* Date Pickers */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={formStart}
              onChange={(e) => setFormStart(e.target.value)}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={formEnd}
              onChange={(e) => setFormEnd(e.target.value)}
              required
            />
          </div>

          {/* Automatic Working Days Calculation Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/80 border border-indigo-100 text-xs">
            <div className="flex items-center gap-2 text-indigo-900 font-semibold">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Automatically Calculated Duration:</span>
            </div>
            <span className="font-bold font-mono text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shadow-2xs">
              {calculatedDays} Working {calculatedDays === 1 ? 'Day' : 'Days'} (Mon - Fri)
            </span>
          </div>

          {/* Reason Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Reason / Notes <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={formReason}
              onChange={(e) => setFormReason(e.target.value)}
              rows={3}
              placeholder="e.g. Family vacation, personal medical appointment, etc."
              className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 text-xs text-slate-900 rounded-xl p-3 placeholder:text-slate-400 outline-none transition-all"
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
