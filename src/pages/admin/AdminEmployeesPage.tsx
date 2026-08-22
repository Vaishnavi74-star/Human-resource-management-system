import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { useDisclosure } from '../../hooks/useDisclosure';
import { employeeService } from '../../services/employeeService';
import type { Employee, EmploymentStatus } from '../../types/employee';
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
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import {
  Users,
  Search,
  Plus,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit2,
  Trash2,
  Sparkles,
  Download,
  AlertCircle,
} from 'lucide-react';

export const AdminEmployeesPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, warning, error: toastError } = useToast();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = 8;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'joiningDate' | 'department' | 'id'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals
  const createModal = useDisclosure();
  const deleteConfirm = useDisclosure();
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  // New Employee Form State
  const [newFullName, setNewFullName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newDept, setNewDept] = useState<string>('Engineering');
  const [newRole, setNewRole] = useState<string>('');
  const [newSalary, setNewSalary] = useState<string>('95000');
  const [newJoinDate, setNewJoinDate] = useState<string>('2026-08-22');
  const [formError, setFormError] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const fetchEmployeeData = useCallback(async () => {
    try {
      setHasError(false);
      const res = await employeeService.filterEmployees({
        search: searchQuery,
        department: selectedDept,
        status: selectedStatus,
        sortBy,
        sortOrder,
        page,
        pageSize,
      });

      setEmployees(res.employees);
      setTotalCount(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to load employee list', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedDept, selectedStatus, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchEmployeeData();

    const handleSync = () => fetchEmployeeData();
    window.addEventListener('dayflow_employees_updated', handleSync);
    return () => window.removeEventListener('dayflow_employees_updated', handleSync);
  }, [fetchEmployeeData]);

  // Handle Search Input Debounce / Change
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setPage(1);
  };

  const handleDeptChange = (val: string) => {
    setSelectedDept(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setSelectedStatus(val);
    setPage(1);
  };

  const toggleSort = (col: 'name' | 'joiningDate' | 'department' | 'id') => {
    if (sortBy === col) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(col);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newFullName.trim() || !newEmail.trim() || !newRole.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setIsCreating(true);
    try {
      const basicNum = parseFloat(newSalary) || 80000;
      const allowances = Math.round(basicNum * 0.12);
      const deductions = Math.round(basicNum * 0.1);

      const created = await employeeService.createEmployee({
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newFullName)}`,
        personal: {
          fullName: newFullName.trim(),
          email: newEmail.trim().toLowerCase(),
          phone: newPhone.trim() || '+1 (555) 000-1122',
          address: 'San Francisco, CA',
        },
        job: {
          employeeId: `DF-${Math.floor(1000 + Math.random() * 9000)}`,
          department: newDept,
          designation: newRole.trim(),
          joiningDate: newJoinDate,
          employmentStatus: 'Active',
          workLocation: 'San Francisco HQ (Hybrid)',
          manager: 'Eleanor Vance',
          employmentType: 'Full-Time',
        },
        salary: {
          basic: basicNum,
          allowances,
          deductions,
          netSalary: basicNum + allowances - deductions,
          currency: 'USD',
          payFrequency: 'Monthly',
        },
        documents: [],
      });

      createModal.close();
      setNewFullName('');
      setNewEmail('');
      setNewPhone('');
      setNewRole('');
      success('Employee Onboarded', `${created.personal.fullName} has been added to the directory.`);
      await fetchEmployeeData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Creation failed';
      setFormError(msg);
      toastError('Creation Error', msg);
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenDelete = (emp: Employee) => {
    setEmployeeToDelete(emp);
    deleteConfirm.open();
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;
    try {
      await employeeService.deleteEmployee(employeeToDelete.id);
      deleteConfirm.close();
      warning('Employee Record Removed', `${employeeToDelete.personal.fullName} was removed from the roster.`);
      await fetchEmployeeData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Deletion failed';
      toastError('Deletion Error', msg);
    }
  };

  const getStatusBadge = (status: EmploymentStatus) => {
    switch (status) {
      case 'Active':
        return <Badge variant="success" size="xs" dot>Active</Badge>;
      case 'On Leave':
        return <Badge variant="purple" size="xs" dot>On Leave</Badge>;
      case 'Inactive':
        return <Badge variant="neutral" size="xs">Inactive</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-900 via-indigo-800 to-indigo-700 text-white p-6 sm:p-8 shadow-xl shadow-indigo-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>HR Personnel & Talent Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Employee Directory
            </h1>
            <p className="text-sm text-indigo-100/90 leading-relaxed">
              Comprehensive roster of active workforce members, departmental records, job profiles, and compensation metrics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="white"
              size="md"
              onClick={createModal.open}
              leftIcon={<Plus className="w-4 h-4 text-indigo-600" />}
            >
              Add New Employee
            </Button>
            <Button
              variant="outline"
              size="md"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30"
              onClick={() => success('Export Ready', 'Exported employee directory spreadsheet.')}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export CSV
            </Button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Directory Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full">
            <div>
              <CardTitle>Staff Records & Profiles</CardTitle>
              <CardDescription>
                Showing {employees.length} of {totalCount} total employee records
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Filters & Search Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80">
            {/* Search Input */}
            <Input
              placeholder="Search name, ID, role, email..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />

            {/* Department Filter */}
            <Select
              value={selectedDept}
              onChange={(e) => handleDeptChange(e.target.value)}
              options={[
                { value: 'all', label: 'All Departments' },
                { value: 'Engineering', label: 'Engineering' },
                { value: 'Human Resources', label: 'Human Resources' },
                { value: 'Marketing', label: 'Marketing' },
                { value: 'Finance', label: 'Finance' },
                { value: 'Operations', label: 'Operations' },
              ]}
            />

            {/* Status Filter */}
            <Select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'Active', label: 'Active Status' },
                { value: 'On Leave', label: 'On Leave' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
            />

            {/* Sort Order Selector */}
            <Select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as 'name' | 'joiningDate' | 'department' | 'id');
                setPage(1);
              }}
              options={[
                { value: 'name', label: 'Sort: Name (A-Z)' },
                { value: 'joiningDate', label: 'Sort: Joining Date' },
                { value: 'department', label: 'Sort: Department' },
                { value: 'id', label: 'Sort: Employee ID' },
              ]}
            />
          </div>

          {/* Table Container */}
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <LoadingState message="Loading workforce directory..." />
            </div>
          ) : hasError ? (
            <ErrorState
              title="Failed to Load Directory"
              message="An error occurred while fetching employee profiles."
              onRetry={fetchEmployeeData}
            />
          ) : employees.length === 0 ? (
            <EmptyState
              icon={<Users className="w-8 h-8 text-slate-400" />}
              title="No Employees Found"
              description="No personnel matched your search and filter criteria."
              actionLabel="Clear Filters"
              onAction={() => {
                setSearchQuery('');
                setSelectedDept('all');
                setSelectedStatus('all');
                setPage(1);
              }}
            />
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase tracking-wider font-bold">
                      <th
                        className="py-3 px-4 rounded-l-xl cursor-pointer hover:text-indigo-600 transition-colors"
                        onClick={() => toggleSort('name')}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Employee</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th
                        className="py-3 px-4 cursor-pointer hover:text-indigo-600 transition-colors"
                        onClick={() => toggleSort('id')}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Employee ID</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th
                        className="py-3 px-4 cursor-pointer hover:text-indigo-600 transition-colors"
                        onClick={() => toggleSort('department')}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Department</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-3 px-4">Designation</th>
                      <th className="py-3 px-4">Status</th>
                      <th
                        className="py-3 px-4 cursor-pointer hover:text-indigo-600 transition-colors"
                        onClick={() => toggleSort('joiningDate')}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Joining Date</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {employees.map((emp) => (
                      <tr
                        key={emp.id}
                        className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                        onClick={() => navigate(`/admin/employees/${emp.id}`)}
                      >
                        {/* Employee (Avatar, Name, Email) */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={emp.avatarUrl}
                              name={emp.personal.fullName}
                              size="md"
                              status={emp.job.employmentStatus === 'Active' ? 'active' : 'offline'}
                            />
                            <div>
                              <p className="font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                                {emp.personal.fullName}
                              </p>
                              <p className="text-[11px] text-slate-500 font-mono">{emp.personal.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Employee ID */}
                        <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                          {emp.job.employeeId}
                        </td>

                        {/* Department */}
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {emp.job.department}
                        </td>

                        {/* Designation */}
                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          {emp.job.designation}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          {getStatusBadge(emp.job.employmentStatus)}
                        </td>

                        {/* Joining Date */}
                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          {new Date(emp.job.joiningDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="inline-flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => navigate(`/admin/employees/${emp.id}`)}
                              leftIcon={<Eye className="w-3.5 h-3.5" />}
                            >
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => navigate(`/admin/employees/${emp.id}?edit=true`)}
                              leftIcon={<Edit2 className="w-3.5 h-3.5 text-slate-500" />}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="xs"
                              className="text-rose-600 hover:bg-rose-50"
                              onClick={() => handleOpenDelete(emp)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs text-slate-500">
                <span>
                  Showing Page <strong className="text-slate-800">{page}</strong> of{' '}
                  <strong className="text-slate-800">{totalPages}</strong> ({totalCount} items)
                </span>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setPage(pageNum)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                          page === pageNum
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 1. Add New Employee Modal */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        title="Onboard New Employee"
        description="Fill in employee details to create a profile and assign department roles."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={createModal.close} disabled={isCreating}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateEmployee} isLoading={isCreating}>
              Create Employee
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateEmployee} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <Input
            label="Full Legal Name"
            placeholder="e.g. Jordan Rivera"
            value={newFullName}
            onChange={(e) => setNewFullName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Work Email"
              type="email"
              placeholder="jordan.rivera@dayflow.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
            <Input
              label="Phone Number"
              placeholder="+1 (555) 890-9988"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Department"
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
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
              placeholder="e.g. Cloud Security Engineer"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Annual Basic Salary ($)"
              type="number"
              value={newSalary}
              onChange={(e) => setNewSalary(e.target.value)}
              required
            />
            <Input
              label="Joining Date"
              type="date"
              value={newJoinDate}
              onChange={(e) => setNewJoinDate(e.target.value)}
              required
            />
          </div>
        </form>
      </Modal>

      {/* 2. Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={deleteConfirm.close}
        onConfirm={handleConfirmDelete}
        title="Remove Employee Record"
        message={`Are you sure you want to remove ${employeeToDelete?.personal.fullName} (${employeeToDelete?.id})? This will delete active profile assignments.`}
        confirmLabel="Confirm & Delete"
        variant="danger"
      />
    </div>
  );
};
