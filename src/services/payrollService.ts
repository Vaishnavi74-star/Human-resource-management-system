import type { EmployeePayroll, PayrollSummary, SalaryHistory, SalaryStructure } from '../types/payroll';

// Mock Data
const MOCK_SALARY_STRUCTURE: SalaryStructure = {
  basic: 40000,
  allowances: 15000,
  deductions: 6800,
  grossSalary: 55000,
  netSalary: 48200
};

const MOCK_SALARY_HISTORY: SalaryHistory[] = [
  {
    id: 'sh-001',
    employeeId: 'EMP001',
    month: 'July',
    year: 2026,
    grossSalary: 55000,
    deductions: 6800,
    netSalary: 48200,
    status: 'Paid',
    paymentDate: '2026-07-31'
  },
  {
    id: 'sh-002',
    employeeId: 'EMP001',
    month: 'June',
    year: 2026,
    grossSalary: 55000,
    deductions: 6800,
    netSalary: 48200,
    status: 'Paid',
    paymentDate: '2026-06-30'
  }
];

let MOCK_PAYROLL_DATA: EmployeePayroll[] = [
  {
    id: 'pay-001',
    employeeId: 'EMP001',
    employeeName: 'Sarah Jenkins',
    department: 'Engineering',
    role: 'Senior Developer',
    salaryStructure: { ...MOCK_SALARY_STRUCTURE },
    status: 'Processed',
    lastProcessed: '2026-07-31'
  },
  {
    id: 'pay-002',
    employeeId: 'EMP002',
    employeeName: 'Michael Chen',
    department: 'Design',
    role: 'UI/UX Lead',
    salaryStructure: {
      basic: 45000,
      allowances: 12000,
      deductions: 7500,
      grossSalary: 57000,
      netSalary: 49500
    },
    status: 'Pending'
  },
  {
    id: 'pay-003',
    employeeId: 'EMP003',
    employeeName: 'Emily Rodriguez',
    department: 'Marketing',
    role: 'Marketing Manager',
    salaryStructure: {
      basic: 38000,
      allowances: 10000,
      deductions: 5000,
      grossSalary: 48000,
      netSalary: 43000
    },
    status: 'Processed',
    lastProcessed: '2026-07-31'
  }
];

export const payrollService = {
  async getEmployeeSalary(_employeeId: string): Promise<SalaryStructure> {
    // In a real app, fetch from API. We return mock data here.
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_SALARY_STRUCTURE), 400));
  },

  async getSalaryHistory(_employeeId: string): Promise<SalaryHistory[]> {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_SALARY_HISTORY), 400));
  },

  async getAllEmployeeSalaries(): Promise<EmployeePayroll[]> {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_PAYROLL_DATA), 500));
  },

  async getPayrollSummary(): Promise<PayrollSummary> {
    const summary = MOCK_PAYROLL_DATA.reduce((acc, curr) => {
      acc.totalEmployees += 1;
      acc.totalGrossSalary += curr.salaryStructure.grossSalary;
      acc.totalDeductions += curr.salaryStructure.deductions;
      acc.totalNetSalary += curr.salaryStructure.netSalary;
      return acc;
    }, {
      totalEmployees: 0,
      totalGrossSalary: 0,
      totalDeductions: 0,
      totalNetSalary: 0
    });

    return new Promise((resolve) => setTimeout(() => resolve(summary), 300));
  },

  async updateSalaryStructure(employeeId: string, updates: Partial<SalaryStructure>): Promise<EmployeePayroll> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = MOCK_PAYROLL_DATA.findIndex(p => p.employeeId === employeeId);
        if (index === -1) return reject(new Error('Employee not found'));

        const existing = MOCK_PAYROLL_DATA[index].salaryStructure;
        const basic = updates.basic ?? existing.basic;
        const allowances = updates.allowances ?? existing.allowances;
        const deductions = updates.deductions ?? existing.deductions;
        const grossSalary = basic + allowances;
        const netSalary = grossSalary - deductions;

        MOCK_PAYROLL_DATA[index].salaryStructure = {
          basic,
          allowances,
          deductions,
          grossSalary,
          netSalary
        };

        resolve(MOCK_PAYROLL_DATA[index]);
      }, 500);
    });
  }
};
