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
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
          My Salary & Payslips
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          View your current compensation structure and download past payslips.
        </p>
      </div>

      {/* Salary Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-l-4 border-l-indigo-600">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <IndianRupee className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Net Salary</p>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {formatCurrency(salary?.netSalary || 0)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Take home pay</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Basic Salary</p>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(salary?.basic || 0)}
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Allowances</p>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(salary?.allowances || 0)}
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-lg">
              <TrendingDown className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Deductions</p>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(salary?.deductions || 0)}
          </p>
        </Card>
      </div>

      {/* Salary History */}
      <Card>
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans',sans-serif]">
            Salary History
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="px-6 py-4 font-semibold">Month</th>
                <th className="px-6 py-4 font-semibold">Gross Salary</th>
                <th className="px-6 py-4 font-semibold">Deductions</th>
                <th className="px-6 py-4 font-semibold">Net Salary</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {history.length > 0 ? (
                history.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {record.month} {record.year}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-mono">
                      {formatCurrency(record.grossSalary)}
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-mono">
                      {formatCurrency(record.deductions)}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white font-mono">
                      {formatCurrency(record.netSalary)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={record.status === 'Paid' ? 'success' : 'warning'}>
                        {record.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                        onClick={() => alert(`Payslip for ${record.month} ${record.year} is prepared for download.`)}
                      >
                        <Download className="w-3.5 h-3.5" />
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
