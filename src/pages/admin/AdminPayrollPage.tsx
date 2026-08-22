import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { payrollService } from '../../services/payrollService';
import type { EmployeePayroll, PayrollSummary, SalaryStructure } from '../../types/payroll';
import { IndianRupee, Users, TrendingDown, Eye, FileEdit, X } from 'lucide-react';
import { PayslipPreviewModal } from '../shared/PayslipPreviewModal';

const EditSalaryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeePayroll | null;
  onSave: (employeeId: string, updates: Partial<SalaryStructure>) => void;
}> = ({ isOpen, onClose, employee, onSave }) => {
  const [basic, setBasic] = useState<number>(0);
  const [allowances, setAllowances] = useState<number>(0);
  const [deductions, setDeductions] = useState<number>(0);

  useEffect(() => {
    if (employee) {
      setBasic(employee.salaryStructure.basic);
      setAllowances(employee.salaryStructure.allowances);
      setDeductions(employee.salaryStructure.deductions);
    }
  }, [employee]);

  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Edit Salary</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Basic Salary</label>
            <input
              type="number"
              value={basic}
              onChange={(e) => setBasic(Number(e.target.value))}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Allowances</label>
            <input
              type="number"
              value={allowances}
              onChange={(e) => setAllowances(Number(e.target.value))}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deductions</label>
            <input
              type="number"
              value={deductions}
              onChange={(e) => setDeductions(Number(e.target.value))}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          
          <div className="pt-4 border-t border-slate-100">
            <div className="flex justify-between text-sm font-medium text-slate-600">
              <span>Preview Net Salary:</span>
              <span className="text-indigo-600">
                ₹{(basic + allowances - deductions).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(employee.employeeId, { basic, allowances, deductions })}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminPayrollPage: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeePayroll[]>([]);
  const [summary, setSummary] = useState<PayrollSummary | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [editingEmployee, setEditingEmployee] = useState<EmployeePayroll | null>(null);
  const [viewingPayslip, setViewingPayslip] = useState<EmployeePayroll | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empData, sumData] = await Promise.all([
        payrollService.getAllEmployeeSalaries(),
        payrollService.getPayrollSummary()
      ]);
      setEmployees(empData);
      setSummary(sumData);
    } catch (error) {
      console.error('Failed to fetch payroll data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSaveSalary = async (employeeId: string, updates: Partial<SalaryStructure>) => {
    try {
      await payrollService.updateSalaryStructure(employeeId, updates);
      setEditingEmployee(null);
      // Refresh data to get updated summary and list
      fetchData();
    } catch (error) {
      console.error('Failed to update salary', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
          Payroll Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage salary structures, view overall payroll expenses, and generate payslips.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-600">Total Employees</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {summary?.totalEmployees || 0}
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <IndianRupee className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-600">Total Gross Salary</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {formatCurrency(summary?.totalGrossSalary || 0)}
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <TrendingDown className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-600">Total Deductions</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {formatCurrency(summary?.totalDeductions || 0)}
          </p>
        </Card>

        <Card className="p-5 border-l-4 border-l-indigo-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <IndianRupee className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-600">Total Net Salary</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {formatCurrency(summary?.totalNetSalary || 0)}
          </p>
        </Card>
      </div>

      {/* Employee Payroll Table */}
      <Card>
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            Employee Directory
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Employee</th>
                <th className="px-6 py-4 font-medium">Basic</th>
                <th className="px-6 py-4 font-medium">Allowances</th>
                <th className="px-6 py-4 font-medium">Deductions</th>
                <th className="px-6 py-4 font-medium">Net Salary</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{emp.employeeName}</div>
                    <div className="text-xs text-slate-500">{emp.role}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {formatCurrency(emp.salaryStructure.basic)}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {formatCurrency(emp.salaryStructure.allowances)}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {formatCurrency(emp.salaryStructure.deductions)}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {formatCurrency(emp.salaryStructure.netSalary)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={emp.status === 'Processed' ? 'success' : 'warning'}>
                      {emp.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewingPayslip(emp)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Payslip"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingEmployee(emp)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Salary"
                      >
                        <FileEdit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <EditSalaryModal
        isOpen={!!editingEmployee}
        onClose={() => setEditingEmployee(null)}
        employee={editingEmployee}
        onSave={handleSaveSalary}
      />

      <PayslipPreviewModal
        isOpen={!!viewingPayslip}
        onClose={() => setViewingPayslip(null)}
        payroll={viewingPayslip}
      />
    </div>
  );
};
