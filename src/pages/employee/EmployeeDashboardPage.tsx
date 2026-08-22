import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { useDisclosure } from '../../hooks/useDisclosure';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
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
} from 'lucide-react';

export const EmployeeDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { success, info } = useToast();
  const leaveModal = useDisclosure();

  // Clock In / Out simulation state
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [clockInTime, setClockInTime] = useState('09:02 AM');
  const [workSeconds, setWorkSeconds] = useState(14420); // ~4h 00m

  // Live Timer
  useEffect(() => {
    if (!isClockedIn) return;
    const interval = setInterval(() => {
      setWorkSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isClockedIn]);

  const formatWorkDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}h ${minutes
      .toString()
      .padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

  const handleClockToggle = () => {
    if (isClockedIn) {
      setIsClockedIn(false);
      info('Clocked Out', `You clocked out for the day at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`);
    } else {
      setIsClockedIn(true);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setClockInTime(timeStr);
      setWorkSeconds(0);
      success('Clocked In Successfully', `Good morning, ${user?.name}! Workday session started at ${timeStr}.`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-900 via-indigo-800 to-indigo-700 text-white p-6 sm:p-8 shadow-lg shadow-indigo-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Employee Workspace Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Welcome, {user?.name ? user.name.split(' ')[0] : 'Employee'} 👋
            </h1>
            <p className="text-sm text-indigo-100/90 leading-relaxed">
              {user?.title} &bull; {user?.department} &bull; ID: <strong className="text-white font-mono">{user?.employeeId}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
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

        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Grid: Clock-in widget + Leave Balance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Attendance Clock Card */}
        <Card className="lg:col-span-1 border-indigo-100 bg-white">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <CardTitle className="text-sm">Today's Attendance</CardTitle>
              </div>
              <Badge variant={isClockedIn ? 'success' : 'neutral'} size="xs" dot>
                {isClockedIn ? 'On Duty' : 'Off Duty'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="text-center p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Elapsed Work Time</p>
              <p className="text-3xl font-mono font-black text-slate-900 mt-1 tracking-tight">
                {isClockedIn ? formatWorkDuration(workSeconds) : '00h 00m 00s'}
              </p>
              <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-500">
                <span>Clock In: <strong className="text-slate-800">{clockInTime}</strong></span>
                <span>&bull;</span>
                <span>Expected: <strong className="text-slate-800">8h 00m</strong></span>
              </div>
            </div>

            <Button
              variant={isClockedIn ? 'danger' : 'success'}
              size="lg"
              className="w-full justify-center"
              onClick={handleClockToggle}
              leftIcon={isClockedIn ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            >
              {isClockedIn ? 'Clock Out for Today' : 'Clock In to Start Work'}
            </Button>
          </CardContent>
        </Card>

        {/* Leave Balances Cards */}
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
            <p className="text-[11px] text-slate-400 mt-4 border-t border-slate-100 pt-2.5">
              Accrues +1.5 days/month
            </p>
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
            <p className="text-[11px] text-slate-400 mt-4 border-t border-slate-100 pt-2.5">
              Zero doctor note required under 2d
            </p>
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
            <p className="text-[11px] text-slate-400 mt-4 border-t border-slate-100 pt-2.5">
              Expires on Dec 31
            </p>
          </Card>
        </div>
      </div>

      {/* Recent Activity & Upcoming Team Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Attendance Logs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle>My Attendance Log</CardTitle>
                <CardDescription>Biometric clock records this week</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => info('Export Logs', 'Generating PDF attendance timesheet summary.')}
                rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
              >
                View Full
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-slate-100">
              {[
                { date: 'Today, Aug 22', in: '09:02 AM', out: 'In Progress', status: 'On Time', badge: 'success' as const, hours: '4.0h' },
                { date: 'Yesterday, Aug 21', in: '08:55 AM', out: '05:30 PM', status: 'Completed', badge: 'neutral' as const, hours: '8.5h' },
                { date: 'Wednesday, Aug 20', in: '09:05 AM', out: '05:15 PM', status: 'Completed', badge: 'neutral' as const, hours: '8.2h' },
                { date: 'Tuesday, Aug 19', in: '08:48 AM', out: '05:40 PM', status: 'Completed', badge: 'neutral' as const, hours: '8.8h' },
              ].map((row, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{row.date}</p>
                    <p className="text-slate-500 mt-0.5">{row.in} &rarr; {row.out}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-700 font-mono">{row.hours}</span>
                    <Badge variant={row.badge} size="xs">{row.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Documents & Pay Summaries */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Payslips & Documents</CardTitle>
              <CardDescription>Recent HR disbursements & tax forms</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: 'July 2026 Monthly Payslip', desc: 'Disbursed on Jul 31, 2026 &bull; Net: $6,450.00', icon: FileText },
              { title: 'June 2026 Monthly Payslip', desc: 'Disbursed on Jun 30, 2026 &bull; Net: $6,450.00', icon: FileText },
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
                    Download
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Request Leave Modal */}
      <Modal
        isOpen={leaveModal.isOpen}
        onClose={leaveModal.close}
        title="Submit Time Off Request"
        description="Select your leave type and requested dates for managerial review."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={leaveModal.close}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                leaveModal.close();
                success('Leave Request Submitted', 'Your request has been routed to HR for fast approval.');
              }}
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
          <Input label="Reason / Notes (Optional)" placeholder="e.g. Family vacation" />
        </div>
      </Modal>
    </div>
  );
};
