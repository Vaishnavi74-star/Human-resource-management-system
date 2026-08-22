export interface SalaryStructure {
  basic: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  grossSalary: number;
}

export interface EmployeePayroll {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  role: string;
  salaryStructure: SalaryStructure;
  status: 'Processed' | 'Pending' | 'Hold';
  lastProcessed?: string;
}

export interface SalaryHistory {
  id: string;
  employeeId: string;
  month: string;
  year: number;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  status: 'Paid' | 'Processing';
  paymentDate?: string;
}

export interface PayrollSummary {
  totalEmployees: number;
  totalGrossSalary: number;
  totalDeductions: number;
  totalNetSalary: number;
}
