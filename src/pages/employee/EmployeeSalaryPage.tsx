import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { payrollService } from '../../services/payrollService';
import type { SalaryStructure, SalaryHistory } from '../../types/payroll';
import { IndianRupee, TrendingUp, TrendingDown, Clock, Download } from 'lucide-react';

export const EmployeeSalaryPage: React.FC = () => {
  const { user } = useAuth();
  const [salary, setSalary] = useState<SalaryStructure | null>(null);
  const [history, setHistory] = useState<SalaryHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          const [salaryData, historyData] = await Promise.all([
            payrollService.getEmployeeSalary(user.id),
            payrollService.getSalaryHistory(user.id)
          ]);
          setSalary(salaryData);
          setHistory(historyData);
        }
      } catch (error) {
        console.error('Failed to fetch salary data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
          My Salary & Payslips
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          View your current compensation structure and download past payslips.
        </p>
      </div>

      {/* Salary Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-l-4 border-l-indigo-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <IndianRupee className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-600">Net Salary</p>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {formatCurrency(salary?.netSalary || 0)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Take home pay</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-600">Basic Salary</p>
          </div>
          <p className="text-xl font-bold text-slate-900">
            {formatCurrency(salary?.basic || 0)}
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-600">Allowances</p>
          </div>
          <p className="text-xl font-bold text-slate-900">
            {formatCurrency(salary?.allowances || 0)}
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <TrendingDown className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-600">Deductions</p>
          </div>
          <p className="text-xl font-bold text-slate-900">
            {formatCurrency(salary?.deductions || 0)}
          </p>
        </Card>
      </div>

      {/* Salary History */}
      <Card>
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            Salary History
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Month</th>
                <th className="px-6 py-4 font-medium">Gross Salary</th>
                <th className="px-6 py-4 font-medium">Deductions</th>
                <th className="px-6 py-4 font-medium">Net Salary</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.length > 0 ? (
                history.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-900">
                          {record.month} {record.year}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatCurrency(record.grossSalary)}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatCurrency(record.deductions)}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {formatCurrency(record.netSalary)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={record.status === 'Paid' ? 'success' : 'warning'}>
                        {record.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                        onClick={() => alert('Download Payslip functionality coming soon!')}
                      >
                        <Download className="w-4 h-4" />
                        Payslip
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No salary history available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
