import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { useDisclosure } from '../../hooks/useDisclosure';
import { employeeService } from '../../services/employeeService';
import { leaveService } from '../../services/leaveService';
import type { Employee, EmploymentStatus, EmployeeDocument } from '../../types/employee';
import type { LeaveBalances, LeaveRequest } from '../../types/leave';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import {
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  User,
  Briefcase,
  DollarSign,
  FileText,
  Clock,
  Plane,
  Edit,
  Download,
  Plus,
  AlertCircle,
} from 'lucide-react';
import { cn } from '../../utils/cn';

type TabKey = 'overview' | 'personal' | 'job' | 'attendance' | 'leave' | 'salary' | 'documents';

export const AdminEmployeeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { role } = useAuth();
  const { success, error: toastError } = useToast();

  const isHRorAdmin = role === 'admin' || role === 'hr';

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalances | null>(null);
  const [leaveHistory, setLeaveHistory] = useState<LeaveRequest[]>([]);

  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  // Edit Modal
  const editModal = useDisclosure();
  const [editFullName, setEditFullName] = useState<string>('');
  const [editEmail, setEditEmail] = useState<string>('');
  const [editPhone, setEditPhone] = useState<string>('');
  const [editAddress, setEditAddress] = useState<string>('');
  const [editAvatarUrl, setEditAvatarUrl] = useState<string>('');
  const [editDept, setEditDept] = useState<string>('');
  const [editRole, setEditRole] = useState<string>('');
  const [editStatus, setEditStatus] = useState<EmploymentStatus>('Active');
  const [editLocation, setEditLocation] = useState<string>('');
  const [editManager, setEditManager] = useState<string>('');
  const [editBasicSalary, setEditBasicSalary] = useState<string>('');
  const [editAllowances, setEditAllowances] = useState<string>('');
  const [editDeductions, setEditDeductions] = useState<string>('');
  const [editFormError, setEditFormError] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Document Upload Modal
  const docModal = useDisclosure();
  const [newDocName, setNewDocName] = useState<string>('');
  const [newDocType, setNewDocType] = useState<'PDF' | 'DOCX' | 'PNG' | 'ZIP'>('PDF');
  const [isUploadingDoc, setIsUploadingDoc] = useState<boolean>(false);

  const fetchDetails = useCallback(async () => {
    if (!id) return;
    try {
      setHasError(false);
      const emp = await employeeService.getEmployeeById(id);
      if (!emp) {
        setHasError(true);
        return;
      }
      setEmployee(emp);

      // Load leave data for this employee
      const [bal, history] = await Promise.all([
        leaveService.getEmployeeBalances(emp.job.employeeId),
        leaveService.getEmployeeLeaveRequests(emp.job.employeeId),
      ]);
      setLeaveBalances(bal);
      setLeaveHistory(history);
    } catch (err) {
      console.error('Failed to load employee details', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();

    const handleSync = () => fetchDetails();
    window.addEventListener('dayflow_employees_updated', handleSync);
    window.addEventListener('dayflow_leave_updated', handleSync);
    return () => {
      window.removeEventListener('dayflow_employees_updated', handleSync);
      window.removeEventListener('dayflow_leave_updated', handleSync);
    };
  }, [fetchDetails]);

  // Open edit modal if ?edit=true in URL
  useEffect(() => {
    if (searchParams.get('edit') === 'true' && employee) {
      handleOpenEdit();
    }
  }, [searchParams, employee]);

  const handleOpenEdit = () => {
    if (!employee) return;
    setEditFullName(employee.personal.fullName);
    setEditEmail(employee.personal.email);
    setEditPhone(employee.personal.phone);
    setEditAddress(employee.personal.address);
    setEditAvatarUrl(employee.avatarUrl);
    setEditDept(employee.job.department);
    setEditRole(employee.job.designation);
    setEditStatus(employee.job.employmentStatus);
    setEditLocation(employee.job.workLocation);
    setEditManager(employee.job.manager);
    setEditBasicSalary(employee.salary.basic.toString());
    setEditAllowances(employee.salary.allowances.toString());
    setEditDeductions(employee.salary.deductions.toString());
    setEditFormError('');
    editModal.open();
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;
    setEditFormError('');

    setIsSaving(true);
    try {
      if (isHRorAdmin) {
        // Admin / HR can edit all fields
        const basic = parseFloat(editBasicSalary) || employee.salary.basic;
        const allowances = parseFloat(editAllowances) || employee.salary.allowances;
        const deductions = parseFloat(editDeductions) || employee.salary.deductions;

        await employeeService.updateEmployee(employee.id, {
          avatarUrl: editAvatarUrl,
          personal: {
            ...employee.personal,
            fullName: editFullName.trim(),
            email: editEmail.trim(),
            phone: editPhone.trim(),
            address: editAddress.trim(),
          },
          job: {
            ...employee.job,
            department: editDept,
            designation: editRole.trim(),
            employmentStatus: editStatus,
            workLocation: editLocation.trim(),
            manager: editManager.trim(),
          },
          salary: {
            ...employee.salary,
            basic,
            allowances,
            deductions,
            netSalary: basic + allowances - deductions,
          },
        });
      } else {
        // Employee can ONLY edit address, phone, avatarUrl
        await employeeService.updateEmployee(employee.id, {
          avatarUrl: editAvatarUrl,
          personal: {
            ...employee.personal,
            phone: editPhone.trim(),
            address: editAddress.trim(),
          },
        });
      }

      editModal.close();
      success('Profile Updated', `Changes for ${employee.personal.fullName} saved successfully.`);
      await fetchDetails();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      setEditFormError(msg);
      toastError('Update Error', msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee || !newDocName.trim()) return;

    setIsUploadingDoc(true);
    try {
      const newDoc: EmployeeDocument = {
        id: `doc_${Date.now()}`,
        name: newDocName.trim().endsWith('.pdf') ? newDocName.trim() : `${newDocName.trim()}.${newDocType.toLowerCase()}`,
        fileType: newDocType,
        uploadDate: '2026-08-22',
        size: '1.5 MB',
      };

      const updatedDocs = [newDoc, ...employee.documents];
      await employeeService.updateEmployee(employee.id, { documents: updatedDocs });

      docModal.close();
      setNewDocName('');
      success('Document Uploaded', `Added ${newDoc.name} to employee record.`);
      await fetchDetails();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      toastError('Upload Error', msg);
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const getStatusBadge = (status: EmploymentStatus) => {
    switch (status) {
      case 'Active':
        return <Badge variant="success" size="sm" dot>Active</Badge>;
      case 'On Leave':
        return <Badge variant="purple" size="sm" dot>On Leave</Badge>;
      case 'Inactive':
        return <Badge variant="neutral" size="sm">Inactive</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center">
        <LoadingState message="Loading comprehensive employee profile dossier..." />
      </div>
    );
  }

  if (hasError || !employee) {
    return (
      <ErrorState
        title="Employee Profile Not Found"
        message={`The employee record with identifier "${id}" could not be located in the database.`}
        onRetry={() => navigate('/admin/employees')}
      />
    );
  }

  const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: 'overview', label: 'Overview', icon: User },
    { key: 'personal', label: 'Personal', icon: Mail },
    { key: 'job', label: 'Job Profile', icon: Briefcase },
    { key: 'attendance', label: 'Attendance', icon: Clock },
    { key: 'leave', label: 'Leave Quotas', icon: Plane },
    { key: 'salary', label: 'Salary & Comp', icon: DollarSign },
    { key: 'documents', label: `Documents (${employee.documents.length})`, icon: FileText },
  ];

  return (
    <div className="space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin/employees')}
          leftIcon={<ChevronLeft className="w-4 h-4" />}
        >
          Back to Directory
        </Button>
        <span className="text-xs font-mono text-slate-400">
          Dayflow ID: <strong className="text-slate-800">{employee.job.employeeId}</strong>
        </span>
      </div>

      {/* Header Profile Dossier Card */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-900 via-indigo-800 to-indigo-700 text-white p-6 sm:p-8 shadow-xl shadow-indigo-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <Avatar
              src={employee.avatarUrl}
              name={employee.personal.fullName}
              size="xl"
              status={employee.job.employmentStatus === 'Active' ? 'active' : 'offline'}
              className="ring-4 ring-white/30"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
                  {employee.personal.fullName}
                </h1>
                {getStatusBadge(employee.job.employmentStatus)}
              </div>
              <p className="text-sm text-indigo-100 font-medium">
                {employee.job.designation} &bull; {employee.job.department}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-indigo-200/90 pt-1">
                <span className="flex items-center gap-1.5 font-mono">
                  <Mail className="w-3.5 h-3.5" /> {employee.personal.email}
                </span>
                <span className="flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5" /> {employee.personal.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {employee.job.workLocation}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="white"
              size="md"
              onClick={handleOpenEdit}
              leftIcon={<Edit className="w-4 h-4 text-indigo-600" />}
            >
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Tabs Navigation Bar */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto pb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 -mb-px cursor-pointer',
                  isActive
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30 rounded-t-xl'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-indigo-600' : 'text-slate-400')} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Employee ID</span>
                <p className="text-xl font-black font-mono text-slate-900 mt-1">{employee.job.employeeId}</p>
                <p className="text-xs text-slate-500 mt-0.5">{employee.job.employmentType}</p>
              </Card>

              <Card className="p-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Annual Net Pay</span>
                <p className="text-xl font-black font-mono text-emerald-600 mt-1">
                  ${(employee.salary.netSalary).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Disbursed {employee.salary.payFrequency}</p>
              </Card>

              <Card className="p-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Leave Balance</span>
                <p className="text-xl font-black font-mono text-indigo-600 mt-1">
                  {leaveBalances?.annualPaid || 12} Days
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{leaveBalances?.sick || 8} sick days available</p>
              </Card>

              <Card className="p-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Manager</span>
                <p className="text-xl font-black text-slate-900 mt-1 truncate">{employee.job.manager}</p>
                <p className="text-xs text-slate-500 mt-0.5">{employee.job.department}</p>
              </Card>
            </div>

            {/* Overview Detail Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Snapshot</CardTitle>
                  <CardDescription>Primary identification details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Legal Name</span>
                    <span className="font-bold text-slate-900">{employee.personal.fullName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Work Email</span>
                    <span className="font-mono font-bold text-slate-900">{employee.personal.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Direct Phone</span>
                    <span className="font-mono font-bold text-slate-900">{employee.personal.phone}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-500 font-medium">Residential Address</span>
                    <span className="font-semibold text-slate-900 text-right max-w-xs">{employee.personal.address}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Job Assignment</CardTitle>
                  <CardDescription>Current organizational placement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Department</span>
                    <span className="font-bold text-slate-900">{employee.job.department}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Designation</span>
                    <span className="font-bold text-slate-900">{employee.job.designation}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Joining Date</span>
                    <span className="font-mono font-bold text-slate-900">{employee.job.joiningDate}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-500 font-medium">Work Location</span>
                    <span className="font-semibold text-slate-900">{employee.job.workLocation}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PERSONAL ================= */}
        {activeTab === 'personal' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div>
                  <CardTitle>Personal & Contact Information</CardTitle>
                  <CardDescription>Confidential employee personal details</CardDescription>
                </div>
                <Button variant="outline" size="xs" onClick={handleOpenEdit} leftIcon={<Edit className="w-3.5 h-3.5" />}>
                  Edit Personal Info
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Full Legal Name</span>
                    <p className="text-sm font-bold text-slate-900">{employee.personal.fullName}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Email Address</span>
                    <p className="text-sm font-bold font-mono text-slate-900">{employee.personal.email}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Phone Number</span>
                    <p className="text-sm font-bold font-mono text-slate-900">{employee.personal.phone}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Home Address</span>
                    <p className="text-sm font-semibold text-slate-900 leading-relaxed">{employee.personal.address}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Date of Birth / Gender</span>
                    <p className="text-sm font-bold text-slate-900">
                      {employee.personal.dateOfBirth || '1992-06-14'} &bull; {employee.personal.gender || 'Female'}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Emergency Contact</span>
                    <p className="text-sm font-semibold text-slate-900">{employee.personal.emergencyContact || 'Verified on file'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ================= TAB 3: JOB ================= */}
        {activeTab === 'job' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div>
                  <CardTitle>Job & Employment Details</CardTitle>
                  <CardDescription>Departmental placement and contract terms</CardDescription>
                </div>
                {isHRorAdmin && (
                  <Button variant="outline" size="xs" onClick={handleOpenEdit} leftIcon={<Edit className="w-3.5 h-3.5" />}>
                    Edit Job Details
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Employee ID</span>
                    <p className="text-sm font-mono font-black text-indigo-700">{employee.job.employeeId}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Department</span>
                    <p className="text-sm font-bold text-slate-900">{employee.job.department}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Designation / Role</span>
                    <p className="text-sm font-bold text-slate-900">{employee.job.designation}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Employment Status & Type</span>
                    <div className="flex items-center gap-2 pt-0.5">
                      {getStatusBadge(employee.job.employmentStatus)}
                      <Badge variant="primary" size="xs">{employee.job.employmentType}</Badge>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Official Joining Date</span>
                    <p className="text-sm font-bold font-mono text-slate-900">{employee.job.joiningDate}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Reporting Manager</span>
                    <p className="text-sm font-bold text-slate-900">{employee.job.manager}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ================= TAB 4: ATTENDANCE ================= */}
        {activeTab === 'attendance' && (
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Attendance Log & Biometric Punches</CardTitle>
                <CardDescription>Recent clock records and working session durations</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100 text-xs">
                {[
                  { date: 'Friday, Aug 21, 2026', in: '09:00 AM', out: '05:30 PM', hours: '08h 30m', status: 'Present', badge: 'success' },
                  { date: 'Thursday, Aug 20, 2026', in: '09:30 AM', out: '01:00 PM', hours: '03h 30m', status: 'Half-day', badge: 'warning' },
                  { date: 'Wednesday, Aug 19, 2026', in: '--', out: '--', hours: '--', status: 'Leave', badge: 'neutral' },
                  { date: 'Tuesday, Aug 18, 2026', in: '09:10 AM', out: '05:25 PM', hours: '08h 15m', status: 'Present', badge: 'success' },
                  { date: 'Monday, Aug 17, 2026', in: '09:02 AM', out: '05:32 PM', hours: '08h 30m', status: 'Present', badge: 'success' },
                ].map((row, i) => (
                  <div key={i} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{row.date}</p>
                      <p className="text-slate-500 font-mono mt-0.5">{row.in} &rarr; {row.out}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-indigo-700">{row.hours}</span>
                      <Badge variant={row.badge as any} size="xs">{row.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ================= TAB 5: LEAVE ================= */}
        {activeTab === 'leave' && (
          <div className="space-y-6">
            {/* Balances */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-4">
                <span className="text-xs font-bold text-slate-500">Annual Paid Leave</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{leaveBalances?.annualPaid || 12} Days</p>
                <p className="text-[11px] text-indigo-600 mt-1 font-semibold">Total allocated: {leaveBalances?.annualTotal || 20}d</p>
              </Card>
              <Card className="p-4">
                <span className="text-xs font-bold text-slate-500">Sick & Medical</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{leaveBalances?.sick || 8} Days</p>
                <p className="text-[11px] text-purple-600 mt-1 font-semibold">Total allocated: {leaveBalances?.sickTotal || 10}d</p>
              </Card>
              <Card className="p-4">
                <span className="text-xs font-bold text-slate-500">Unpaid Leave</span>
                <p className="text-2xl font-black text-slate-900 mt-1">Available</p>
                <p className="text-[11px] text-slate-500 mt-1 font-semibold">Taken this year: {leaveBalances?.unpaidTaken || 0}d</p>
              </Card>
            </div>

            {/* Leave History Table */}
            <Card>
              <CardHeader>
                <CardTitle>Leave Requests History</CardTitle>
                <CardDescription>Recorded time-off submissions and audit status</CardDescription>
              </CardHeader>
              <CardContent>
                {leaveHistory.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No leave requests found for this employee.</p>
                ) : (
                  <div className="divide-y divide-slate-100 text-xs">
                    {leaveHistory.map((req) => (
                      <div key={req.id} className="py-3 flex items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{req.leaveType} Leave</span>
                            <Badge
                              variant={req.status === 'Approved' ? 'success' : req.status === 'Pending' ? 'warning' : 'error'}
                              size="xs"
                            >
                              {req.status}
                            </Badge>
                          </div>
                          <p className="text-slate-500 mt-0.5 font-mono">
                            {req.startDate} &rarr; {req.endDate} ({req.days} days)
                          </p>
                          <p className="text-slate-600 italic mt-0.5 max-w-sm truncate">"{req.reason}"</p>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">{req.submittedAt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ================= TAB 6: SALARY ================= */}
        {activeTab === 'salary' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div>
                  <CardTitle>Salary & Compensation Breakdown</CardTitle>
                  <CardDescription>Confidential payroll structure and deductions</CardDescription>
                </div>
                {isHRorAdmin && (
                  <Button variant="outline" size="xs" onClick={handleOpenEdit} leftIcon={<Edit className="w-3.5 h-3.5" />}>
                    Adjust Compensation
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-3">
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-600 font-semibold">Annual Basic Salary</span>
                    <span className="font-mono font-bold text-slate-900">${employee.salary.basic.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-600 font-semibold">Benefits & Allowances</span>
                    <span className="font-mono font-bold text-emerald-600">+${employee.salary.allowances.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-600 font-semibold">Tax & Withholding Deductions</span>
                    <span className="font-mono font-bold text-rose-600">-${employee.salary.deductions.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Calculated Annual Net Salary</span>
                    <p className="text-3xl font-black font-mono text-indigo-950 mt-1">
                      ${employee.salary.netSalary.toLocaleString()}
                    </p>
                    <p className="text-xs text-indigo-800/80 mt-1">
                      Monthly Disbursement: <strong>${Math.round(employee.salary.netSalary / 12).toLocaleString()}</strong>
                    </p>
                  </div>
                  <div className="pt-4 border-t border-indigo-200/60 flex items-center justify-between text-xs text-indigo-900 font-medium">
                    <span>Frequency: {employee.salary.payFrequency}</span>
                    <span>Currency: {employee.salary.currency}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ================= TAB 7: DOCUMENTS ================= */}
        {activeTab === 'documents' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div>
                  <CardTitle>Personnel Compliance Documents</CardTitle>
                  <CardDescription>Verified contracts, W-4 tax forms, and agreements</CardDescription>
                </div>
                <Button variant="white" size="xs" onClick={docModal.open} leftIcon={<Plus className="w-3.5 h-3.5 text-indigo-600" />}>
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {employee.documents.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center">No documents uploaded for this profile.</p>
              ) : (
                <div className="divide-y divide-slate-100 text-xs">
                  {employee.documents.map((doc) => (
                    <div key={doc.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold font-mono text-[10px]">
                          {doc.fileType}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{doc.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            Uploaded on {doc.uploadDate} &bull; {doc.size}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => success('Download Started', `Downloading ${doc.name}`)}
                        leftIcon={<Download className="w-3.5 h-3.5" />}
                      >
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title={`Edit Profile: ${employee.personal.fullName}`}
        description={
          isHRorAdmin
            ? 'Admin role: Full administrative privileges to modify personal, job, and compensation records.'
            : 'Employee role: You may edit your residential address, phone number, and avatar image.'
        }
        footer={
          <>
            <Button variant="outline" size="sm" onClick={editModal.close} disabled={isSaving}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveEdit} isLoading={isSaving}>
              Save Profile Changes
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          {editFormError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{editFormError}</span>
            </div>
          )}

          {/* Section: Personal Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Personal & Contact</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Full Name"
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
                disabled={!isHRorAdmin}
                required
              />
              <Input
                label="Work Email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                disabled={!isHRorAdmin}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Phone Number"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                required
              />
              <Input
                label="Profile Picture URL"
                value={editAvatarUrl}
                onChange={(e) => setEditAvatarUrl(e.target.value)}
              />
            </div>
            <Input
              label="Home Address"
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
              required
            />
          </div>

          {/* Section: Job Info (Admin/HR Only) */}
          {isHRorAdmin && (
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Job & Department Assignment</h4>
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Department"
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  options={[
                    { value: 'Engineering', label: 'Engineering' },
                    { value: 'Operations', label: 'Operations' },
                    { value: 'Marketing', label: 'Marketing' },
                    { value: 'Finance', label: 'Finance' },
                    { value: 'Human Resources', label: 'Human Resources' },
                  ]}
                />
                <Input
                  label="Designation / Role"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Employment Status"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as EmploymentStatus)}
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'On Leave', label: 'On Leave' },
                    { value: 'Inactive', label: 'Inactive' },
                  ]}
                />
                <Input
                  label="Work Location"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Section: Salary & Comp (Admin/HR Only) */}
          {isHRorAdmin && (
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Compensation Breakdown ($)</h4>
              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Basic Salary"
                  type="number"
                  value={editBasicSalary}
                  onChange={(e) => setEditBasicSalary(e.target.value)}
                  required
                />
                <Input
                  label="Allowances"
                  type="number"
                  value={editAllowances}
                  onChange={(e) => setEditAllowances(e.target.value)}
                  required
                />
                <Input
                  label="Deductions"
                  type="number"
                  value={editDeductions}
                  onChange={(e) => setEditDeductions(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
        </form>
      </Modal>

      {/* Upload Document Modal */}
      <Modal
        isOpen={docModal.isOpen}
        onClose={docModal.close}
        title="Upload Compliance Document"
        description="Add a new employment agreement or tax declaration to this personnel record."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={docModal.close} disabled={isUploadingDoc}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleUploadDocument} isLoading={isUploadingDoc}>
              Upload File
            </Button>
          </>
        }
      >
        <form onSubmit={handleUploadDocument} className="space-y-4">
          <Input
            label="Document Title / Name"
            placeholder="e.g. Health_Insurance_Beneficiary.pdf"
            value={newDocName}
            onChange={(e) => setNewDocName(e.target.value)}
            required
          />

          <Select
            label="File Type"
            value={newDocType}
            onChange={(e) => setNewDocType(e.target.value as any)}
            options={[
              { value: 'PDF', label: 'PDF Document (.pdf)' },
              { value: 'DOCX', label: 'Word Document (.docx)' },
              { value: 'PNG', label: 'Image Scan (.png)' },
              { value: 'ZIP', label: 'Archive (.zip)' },
            ]}
          />
        </form>
      </Modal>
    </div>
  );
};
