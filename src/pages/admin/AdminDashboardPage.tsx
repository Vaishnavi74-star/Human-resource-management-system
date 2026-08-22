import React, { useState } from 'react';
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
import {
  Users,
  CalendarCheck,
  CreditCard,
  Building,
  Check,
  X,
  Plus,
  TrendingUp,
  Download,
  Shield,
  Sparkles,
} from 'lucide-react';

interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  type: string;
  dates: string;
  days: number;
  avatarUrl?: string;
}

const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lr_1',
    employeeName: 'Marcus Chen',
    employeeId: 'DF-1092',
    department: 'Engineering',
    type: 'Annual Vacation',
    dates: 'Sep 12 - Sep 16, 2026',
    days: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop',
  },
  {
    id: 'lr_2',
    employeeName: 'Sofia Rodriguez',
    employeeId: 'DF-2041',
    department: 'Product Design',
    type: 'Sick Leave',
    dates: 'Aug 24 - Aug 25, 2026',
    days: 2,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop',
  },
  {
    id: 'lr_3',
    employeeName: 'David Kim',
    employeeId: 'DF-3118',
    department: 'Sales & BD',
    type: 'Floating Holiday',
    dates: 'Sep 01, 2026',
    days: 1,
  },
  {
    id: 'lr_4',
    employeeName: 'Zara Patel',
    employeeId: 'DF-4089',
    department: 'Operations',
    type: 'Annual Vacation',
    dates: 'Oct 05 - Oct 09, 2026',
    days: 5,
  },
];

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { success, warning, info } = useToast();
  const newHireModal = useDisclosure();

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQUESTS);

  const handleApproveLeave = (req: LeaveRequest) => {
    setLeaveRequests((prev) => prev.filter((item) => item.id !== req.id));
    success(
      'Leave Request Approved',
      `${req.type} for ${req.employeeName} (${req.days} days) has been approved and logged.`
    );
  };

  const handleRejectLeave = (req: LeaveRequest) => {
    setLeaveRequests((prev) => prev.filter((item) => item.id !== req.id));
    warning(
      'Leave Request Rejected',
      `Request for ${req.employeeName} was declined. Employee notified.`
    );
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-900 via-indigo-800 to-indigo-700 text-white p-6 sm:p-8 shadow-lg shadow-indigo-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-indigo-100">
              <Shield className="w-3.5 h-3.5 text-indigo-300" />
              <span>HR & People Operations Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Welcome back, {user?.name ? user.name.split(' ')[0] : 'Admin'} 👋
            </h1>
            <p className="text-sm text-indigo-100/90 leading-relaxed">
              Every workday, perfectly aligned. Total 148 employees active across 8 departments.
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
              onClick={() => info('Payroll Report', 'Generating August payroll compliance spreadsheet.')}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Payroll Export
            </Button>
          </div>
        </div>

        {/* Subtle decorative background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Headcount</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900">148</p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12 new hires this quarter</span>
            </div>
          </div>
        </Card>

        <Card className="hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attendance Today</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <p className="text-2xl font-black text-slate-900">98.2%</p>
              <Badge variant="success" size="xs" dot>142 Present</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">6 on approved leave</p>
          </div>
        </Card>

        <Card className="hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Approvals</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900">{leaveRequests.length}</p>
            <p className="text-xs text-amber-600 font-medium mt-1">Action required by HR</p>
          </div>
        </Card>

        <Card className="hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">August Payroll</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900">$428,500</p>
            <p className="text-xs text-slate-500 mt-1">Disbursement in 3 days</p>
          </div>
        </Card>
      </div>

      {/* Main Operations: Pending Leave Requests Table & Recent Joiners */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Requests Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle>Pending Time-Off Approvals</CardTitle>
                <CardDescription>Review and respond to employee leave submissions</CardDescription>
              </div>
              <Badge variant="primary" size="sm">
                {leaveRequests.length} Pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {leaveRequests.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <p className="text-sm font-semibold text-slate-800">All caught up!</p>
                <p className="text-xs">No pending leave requests in the queue.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {leaveRequests.map((req) => (
                  <div key={req.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar src={req.avatarUrl} name={req.employeeName} size="md" status="active" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900">{req.employeeName}</p>
                          <span className="text-[10px] font-mono text-slate-400">({req.employeeId})</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {req.type} &bull; <strong className="text-slate-700">{req.dates}</strong> ({req.days}d)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <Button
                        variant="ghost"
                        size="xs"
                        className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                        onClick={() => handleRejectLeave(req)}
                        leftIcon={<X className="w-3.5 h-3.5" />}
                      >
                        Decline
                      </Button>
                      <Button
                        variant="success"
                        size="xs"
                        onClick={() => handleApproveLeave(req)}
                        leftIcon={<Check className="w-3.5 h-3.5" />}
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Department Breakdown & Joiners */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Department Distribution</CardTitle>
                <CardDescription>Active headcounts</CardDescription>
              </div>
              <Building className="w-5 h-5 text-slate-400" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { dept: 'Engineering & QA', count: 64, pct: 43 },
                { dept: 'Product & Design', count: 28, pct: 19 },
                { dept: 'Sales & Growth', count: 32, pct: 22 },
                { dept: 'HR, Legal & Finance', count: 24, pct: 16 },
              ].map((d, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                    <span>{d.dept}</span>
                    <span className="font-bold text-slate-900">{d.count} staff</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${d.pct}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

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
                { value: 'eng', label: 'Engineering' },
                { value: 'prod', label: 'Product' },
                { value: 'hr', label: 'Human Resources' },
                { value: 'sales', label: 'Sales' },
              ]}
            />
          </div>
          <Input label="Designation / Role" defaultValue="Product Marketing Manager" />
        </div>
      </Modal>
    </div>
  );
};
