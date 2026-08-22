import React from 'react';
import { X, Download, Building2, MapPin } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import type { EmployeePayroll } from '../../types/payroll';

interface PayslipPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  payroll: EmployeePayroll | null;
}

export const PayslipPreviewModal: React.FC<PayslipPreviewModalProps> = ({
  isOpen,
  onClose,
  payroll,
}) => {
  if (!isOpen || !payroll) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header Options */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900">Payslip Preview</h2>
          <div className="flex items-center gap-3">
            <button
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              onClick={() => alert('PDF generation integration point')}
            >
              <Download className="w-4 h-4" />
              Download Payslip
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-8 overflow-y-auto" id="payslip-print-area">
          <Card className="p-8 border border-slate-200">
            {/* Company Info */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">DAYFLOW INC.</h1>
                  <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>Tech Park, Bangalore, 560001</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-bold text-indigo-600 uppercase tracking-wider">Payslip</h2>
                <p className="text-sm font-medium text-slate-600 mt-1">
                  For the month of {currentMonth} {currentYear}
                </p>
              </div>
            </div>

            {/* Employee Info */}
            <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Employee ID:</span>
                  <span className="text-slate-900 font-bold">{payroll.employeeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Employee Name:</span>
                  <span className="text-slate-900 font-bold">{payroll.employeeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Department:</span>
                  <span className="text-slate-900 font-bold">{payroll.department}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Designation:</span>
                  <span className="text-slate-900 font-bold">{payroll.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Payment Date:</span>
                  <span className="text-slate-900 font-bold">
                    {payroll.lastProcessed || 'Pending Processing'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <span className="text-slate-900 font-bold">{payroll.status}</span>
                </div>
              </div>
            </div>

            {/* Salary Breakdown Table */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              {/* Earnings */}
              <div>
                <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-2 mb-3 uppercase tracking-wider text-xs">
                  Earnings
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Basic Salary</span>
                    <span className="font-medium text-slate-900">
                      {formatCurrency(payroll.salaryStructure.basic)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Allowances</span>
                    <span className="font-medium text-slate-900">
                      {formatCurrency(payroll.salaryStructure.allowances)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-2 mb-3 uppercase tracking-wider text-xs">
                  Deductions
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Taxes & Provident Fund</span>
                    <span className="font-medium text-slate-900">
                      {formatCurrency(payroll.salaryStructure.deductions)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="grid grid-cols-2 gap-8 border-t border-slate-200 pt-4 mb-8">
              <div className="flex justify-between">
                <span className="font-bold text-slate-900">Gross Earnings</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(payroll.salaryStructure.grossSalary)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-900">Total Deductions</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(payroll.salaryStructure.deductions)}
                </span>
              </div>
            </div>

            {/* Net Pay */}
            <div className="bg-indigo-50 p-4 rounded-xl flex items-center justify-between border border-indigo-100">
              <span className="font-bold text-indigo-900">Net Pay</span>
              <span className="text-2xl font-extrabold text-indigo-700">
                {formatCurrency(payroll.salaryStructure.netSalary)}
              </span>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
              <p>This is a computer generated payslip and does not require a physical signature.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
