import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../hooks/useToast';
import { useDisclosure } from '../../hooks/useDisclosure';
import { leaveService } from '../../services/leaveService';
import { notificationService } from '../../services/notificationService';
import type { LeaveRequest, LeaveType, LeaveStatus } from '../../types/leave';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  Search,
  Check,
  X,
  Eye,
  Sparkles,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
} from 'lucide-react';

export const AdminLeavePage: React.FC = () => {
  const { success, warning, error: toastError } = useToast();

  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Selected request for view modal
  const viewModal = useDisclosure();
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  // Approve confirmation dialog
  const approveModal = useDisclosure();
  const [requestToApprove, setRequestToApprove] = useState<LeaveRequest | null>(null);
  const [isApproving, setIsApproving] = useState<boolean>(false);

  // Reject confirmation & comment modal
  const rejectModal = useDisclosure();
  const [requestToReject, setRequestToReject] = useState<LeaveRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [rejectError, setRejectError] = useState<string>('');
  const [isRejecting, setIsRejecting] = useState<boolean>(false);

  const fetchRequests = useCallback(async () => {
    try {
      setHasError(false);
      const list = await leaveService.getAllLeaveRequests();
      setRequests(list);
    } catch (err) {
      console.error('Failed to load leave requests', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();

    const handleSync = () => fetchRequests();
    window.addEventListener('dayflow_leave_updated', handleSync);
    return () => window.removeEventListener('dayflow_leave_updated', handleSync);
  }, [fetchRequests]);

  const handleOpenApprove = (req: LeaveRequest) => {
    setRequestToApprove(req);
    approveModal.open();
  };

  const handleConfirmApprove = async () => {
    if (!requestToApprove) return;
    setIsApproving(true);
    try {
      await leaveService.approveLeaveRequest(requestToApprove.id, 'Eleanor Vance (HR)');
      
      // Trigger notification to the employee
      notificationService.addNotification({
        userId: requestToApprove.employeeId,
        title: 'Leave Approved',
        message: `Your leave request for ${requestToApprove.startDate} to ${requestToApprove.endDate} was approved.`,
        type: 'success'
      });

      approveModal.close();
      success(
        'Leave Request Approved',
        `${requestToApprove.leaveType} leave for ${requestToApprove.employeeName} (${requestToApprove.days} days) has been approved.`
      );
      await fetchRequests();
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
      setRejectError('Please specify the reason for declining this request.');
      return;
    }

    setIsRejecting(true);
    try {
      await leaveService.rejectLeaveRequest(
        requestToReject.id,
        rejectionReason.trim(),
        'Eleanor Vance (HR)'
      );
      rejectModal.close();
      warning(
        'Leave Request Declined',
        `Leave request for ${requestToReject.employeeName} was rejected with reason logged.`
      );
      await fetchRequests();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Rejection failed';
      toastError('Rejection Error', msg);
    } finally {
      setIsRejecting(false);
    }
  };

  const filteredRequests = requests.filter((r) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      r.employeeName.toLowerCase().includes(q) ||
      r.employeeId.toLowerCase().includes(q) ||
      r.department.toLowerCase().includes(q) ||
      r.reason.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesType = typeFilter === 'all' || r.leaveType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case 'Approved':
        return <Badge variant="success" size="xs" dot>Approved</Badge>;
      case 'Pending':
        return <Badge variant="warning" size="xs" dot>Pending Review</Badge>;
      case 'Rejected':
        return <Badge variant="error" size="xs" dot>Rejected</Badge>;
      default:
        return <Badge variant="neutral" size="xs">{status}</Badge>;
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

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const approvedCount = requests.filter((r) => r.status === 'Approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'Rejected').length;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-900 via-indigo-800 to-indigo-700 text-white p-6 sm:p-8 shadow-lg shadow-indigo-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>HR & People Operations Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Leave & Time-Off Approvals
            </h1>
            <p className="text-sm text-indigo-100/90 leading-relaxed">
              Review, approve, or reject employee time-off submissions and maintain workforce availability compliance.
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

            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-right">
              <p className="text-[11px] text-indigo-200 uppercase font-semibold">Pending Queue</p>
              <p className="text-sm font-bold text-white">{pendingCount} Requests Awaiting Review</p>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5 border-amber-200/80 bg-amber-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending Action</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{pendingCount}</p>
          <p className="text-xs text-amber-600 font-medium mt-1">Requires HR Manager decision</p>
        </Card>

        <Card className="p-5 border-emerald-200/80 bg-emerald-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Approved Requests</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{approvedCount}</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">Logged into active timesheets</p>
        </Card>

        <Card className="p-5 border-rose-200/80 bg-rose-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Declined Requests</span>
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{rejectedCount}</p>
          <p className="text-xs text-rose-600 font-medium mt-1">With recorded rejection comments</p>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full">
            <div>
              <CardTitle>Workforce Leave Management Queue</CardTitle>
              <CardDescription>
                Full roster of employee time-off requests with real-time approvals
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Filters Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80">
            {/* Search */}
            <Input
              placeholder="Search employee, ID, reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'Pending', label: `Pending (${pendingCount})` },
                { value: 'Approved', label: `Approved (${approvedCount})` },
                { value: 'Rejected', label: `Rejected (${rejectedCount})` },
              ]}
            />

            {/* Leave Type Filter */}
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Leave Categories' },
                { value: 'Paid', label: 'Annual Paid Leave' },
                { value: 'Sick', label: 'Medical / Sick Leave' },
                { value: 'Unpaid', label: 'Unpaid Leave' },
              ]}
            />
          </div>

          {/* Requests Table */}
          {isLoading ? (
            <div className="py-16 flex justify-center">
              <LoadingState message="Loading workforce leave requests..." />
            </div>
          ) : hasError ? (
            <ErrorState
              title="Failed to Load Leave Requests"
              message="An error occurred while fetching the leave approval queue."
              onRetry={fetchRequests}
            />
          ) : filteredRequests.length === 0 ? (
            <EmptyState
              icon={<CalendarCheck className="w-8 h-8 text-slate-400" />}
              title="No Leave Requests Found"
              description="No submissions matched your search and filter criteria."
              actionLabel="Clear Filters"
              onAction={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setTypeFilter('all');
              }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4 rounded-l-xl">Employee</th>
                    <th className="py-3 px-4">Leave Type</th>
                    <th className="py-3 px-4">Date Range</th>
                    <th className="py-3 px-4">Days</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Employee Column */}
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

                      {/* Date Range */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {new Date(req.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} &rarr;{' '}
                        {new Date(req.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>

                      {/* Days */}
                      <td className="py-3.5 px-4 font-bold text-indigo-700 font-mono">
                        {req.days} {req.days === 1 ? 'day' : 'days'}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(req.status)}
                      </td>

                      {/* Submitted */}
                      <td className="py-3.5 px-4 text-slate-500 font-mono">
                        {req.submittedAt}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* View button */}
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

                          {/* Quick Approve / Reject if Pending */}
                          {req.status === 'Pending' && (
                            <>
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
                            </>
                          )}
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

      {/* 1. View Request Modal */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={viewModal.close}
        title="Leave Request Details"
        description="Comprehensive review of employee submission and audit history."
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

            {selectedRequest.rejectionReason && (
              <div>
                <span className="text-[11px] uppercase font-bold text-rose-600">Rejection Note by HR</span>
                <p className="mt-1 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs leading-relaxed">
                  {selectedRequest.rejectionReason}
                </p>
              </div>
            )}

            {selectedRequest.reviewedBy && (
              <p className="text-[11px] text-slate-400">
                Reviewed by <strong className="text-slate-700">{selectedRequest.reviewedBy}</strong> on{' '}
                {selectedRequest.reviewedAt}
              </p>
            )}
          </div>
        )}
      </Modal>

      {/* 2. Approve Confirmation Modal */}
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

      {/* 3. Reject Modal with Mandatory Comment */}
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
              placeholder="e.g. Overlapping with critical sprint release, insufficient coverage in the department..."
              className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 text-xs text-slate-900 rounded-xl p-3 placeholder:text-slate-400 outline-none transition-all"
              required
              autoFocus
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
