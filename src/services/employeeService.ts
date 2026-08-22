import type { Employee, EmployeeFilterOptions } from '../types/employee';

const STORAGE_KEY = 'dayflow_employees_data';

const DEFAULT_EMPLOYEES: Employee[] = [
  {
    id: 'DF-4089',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    personal: {
      fullName: 'Alex Morgan',
      email: 'employee@dayflow.com',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace, San Francisco, CA 94107',
      dateOfBirth: '1992-06-14',
      gender: 'Female',
      emergencyContact: 'David Morgan (Spouse) - +1 (555) 234-9988',
    },
    job: {
      employeeId: 'DF-4089',
      department: 'Engineering',
      designation: 'Senior Software Engineer',
      joiningDate: '2022-03-15',
      employmentStatus: 'Active',
      workLocation: 'San Francisco HQ (Hybrid)',
      manager: 'Marcus Chen',
      employmentType: 'Full-Time',
    },
    salary: {
      basic: 115000,
      allowances: 15000,
      deductions: 12500,
      netSalary: 117500,
      currency: 'USD',
      payFrequency: 'Monthly',
    },
    documents: [
      { id: 'doc_1', name: 'Employment_Agreement_2022.pdf', fileType: 'PDF', uploadDate: '2022-03-15', size: '2.4 MB' },
      { id: 'doc_2', name: 'W4_Tax_Withholding_Form.pdf', fileType: 'PDF', uploadDate: '2022-03-16', size: '540 KB' },
      { id: 'doc_3', name: 'Annual_Performance_Review_2025.pdf', fileType: 'PDF', uploadDate: '2025-12-18', size: '1.1 MB' },
    ],
  },
  {
    id: 'DF-1002',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    personal: {
      fullName: 'Eleanor Vance',
      email: 'hr@dayflow.com',
      phone: '+1 (555) 432-8765',
      address: '120 Market Street, Suite 400, San Francisco, CA 94105',
      dateOfBirth: '1988-11-20',
      gender: 'Female',
      emergencyContact: 'Robert Vance (Father) - +1 (555) 432-1122',
    },
    job: {
      employeeId: 'DF-1002',
      department: 'Human Resources',
      designation: 'Head of People Operations',
      joiningDate: '2020-01-10',
      employmentStatus: 'Active',
      workLocation: 'San Francisco HQ',
      manager: 'Executive Board',
      employmentType: 'Full-Time',
    },
    salary: {
      basic: 135000,
      allowances: 18000,
      deductions: 15000,
      netSalary: 138000,
      currency: 'USD',
      payFrequency: 'Monthly',
    },
    documents: [
      { id: 'doc_4', name: 'HR_Executive_Contract.pdf', fileType: 'PDF', uploadDate: '2020-01-10', size: '3.1 MB' },
      { id: 'doc_5', name: 'Confidentiality_NDA.pdf', fileType: 'PDF', uploadDate: '2020-01-11', size: '820 KB' },
    ],
  },
  {
    id: 'DF-4090',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    personal: {
      fullName: 'Marcus Chen',
      email: 'marcus.chen@dayflow.com',
      phone: '+1 (555) 345-6789',
      address: '450 Mission Bay Blvd, San Francisco, CA 94158',
      dateOfBirth: '1990-04-22',
      gender: 'Male',
      emergencyContact: 'Jenny Chen (Sister) - +1 (555) 345-0011',
    },
    job: {
      employeeId: 'DF-4090',
      department: 'Engineering',
      designation: 'Staff Backend Architect',
      joiningDate: '2021-08-01',
      employmentStatus: 'Active',
      workLocation: 'San Francisco HQ (Hybrid)',
      manager: 'Sarah Jenkins',
      employmentType: 'Full-Time',
    },
    salary: {
      basic: 140000,
      allowances: 20000,
      deductions: 16500,
      netSalary: 143500,
      currency: 'USD',
      payFrequency: 'Monthly',
    },
    documents: [
      { id: 'doc_6', name: 'Engineering_Offer_Letter.pdf', fileType: 'PDF', uploadDate: '2021-08-01', size: '1.8 MB' },
    ],
  },
  {
    id: 'DF-3011',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    personal: {
      fullName: 'Sofia Rodriguez',
      email: 'sofia.rodriguez@dayflow.com',
      phone: '+1 (555) 456-7890',
      address: '890 Valencia St, Apt 3B, San Francisco, CA 94110',
      dateOfBirth: '1994-09-03',
      gender: 'Female',
      emergencyContact: 'Carlos Rodriguez (Brother) - +1 (555) 456-9922',
    },
    job: {
      employeeId: 'DF-3011',
      department: 'Marketing',
      designation: 'Growth Marketing Lead',
      joiningDate: '2023-01-16',
      employmentStatus: 'Active',
      workLocation: 'Remote (California)',
      manager: 'Jessica Taylor',
      employmentType: 'Full-Time',
    },
    salary: {
      basic: 98000,
      allowances: 12000,
      deductions: 10500,
      netSalary: 99500,
      currency: 'USD',
      payFrequency: 'Monthly',
    },
    documents: [
      { id: 'doc_7', name: 'Employment_Contract_Sofia.pdf', fileType: 'PDF', uploadDate: '2023-01-16', size: '2.1 MB' },
    ],
  },
  {
    id: 'DF-2045',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    personal: {
      fullName: 'David Kim',
      email: 'david.kim@dayflow.com',
      phone: '+1 (555) 567-8901',
      address: '155 5th Street, Oakland, CA 94607',
      dateOfBirth: '1991-12-05',
      gender: 'Male',
      emergencyContact: 'Eunice Kim (Mother) - +1 (555) 567-3344',
    },
    job: {
      employeeId: 'DF-2045',
      department: 'Finance',
      designation: 'Senior Financial Analyst',
      joiningDate: '2022-11-01',
      employmentStatus: 'Active',
      workLocation: 'San Francisco HQ',
      manager: 'Richard Sterling',
      employmentType: 'Full-Time',
    },
    salary: {
      basic: 108000,
      allowances: 14000,
      deductions: 11800,
      netSalary: 110200,
      currency: 'USD',
      payFrequency: 'Monthly',
    },
    documents: [
      { id: 'doc_8', name: 'Financial_Analyst_Contract.pdf', fileType: 'PDF', uploadDate: '2022-11-01', size: '1.9 MB' },
    ],
  },
  {
    id: 'DF-5012',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    personal: {
      fullName: 'Maya Lin',
      email: 'maya.lin@dayflow.com',
      phone: '+1 (555) 678-9012',
      address: '320 Fremont St, San Francisco, CA 94105',
      dateOfBirth: '1995-02-18',
      gender: 'Female',
      emergencyContact: 'Kevin Lin (Brother) - +1 (555) 678-7711',
    },
    job: {
      employeeId: 'DF-5012',
      department: 'Marketing',
      designation: 'Product Marketing Manager',
      joiningDate: '2024-04-01',
      employmentStatus: 'Active',
      workLocation: 'San Francisco HQ (Hybrid)',
      manager: 'Sofia Rodriguez',
      employmentType: 'Full-Time',
    },
    salary: {
      basic: 95000,
      allowances: 11000,
      deductions: 9800,
      netSalary: 96200,
      currency: 'USD',
      payFrequency: 'Monthly',
    },
    documents: [
      { id: 'doc_9', name: 'Offer_Letter_Maya_Lin.pdf', fileType: 'PDF', uploadDate: '2024-04-01', size: '1.4 MB' },
    ],
  },
  {
    id: 'DF-6088',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    personal: {
      fullName: 'Lucas Wright',
      email: 'lucas.wright@dayflow.com',
      phone: '+1 (555) 789-0123',
      address: '200 Brannan St, San Francisco, CA 94107',
      dateOfBirth: '1987-08-30',
      gender: 'Male',
      emergencyContact: 'Anna Wright (Spouse) - +1 (555) 789-8899',
    },
    job: {
      employeeId: 'DF-6088',
      department: 'Operations',
      designation: 'Director of Business Operations',
      joiningDate: '2019-06-15',
      employmentStatus: 'Active',
      workLocation: 'San Francisco HQ',
      manager: 'Executive Board',
      employmentType: 'Full-Time',
    },
    salary: {
      basic: 155000,
      allowances: 22000,
      deductions: 18500,
      netSalary: 158500,
      currency: 'USD',
      payFrequency: 'Monthly',
    },
    documents: [
      { id: 'doc_10', name: 'Executive_Agreement_Lucas.pdf', fileType: 'PDF', uploadDate: '2019-06-15', size: '2.7 MB' },
    ],
  },
  {
    id: 'DF-4091',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    personal: {
      fullName: 'Zara Patel',
      email: 'zara.patel@dayflow.com',
      phone: '+1 (555) 890-1234',
      address: '610 2nd St, San Francisco, CA 94107',
      dateOfBirth: '1996-07-25',
      gender: 'Female',
      emergencyContact: 'Vikram Patel (Father) - +1 (555) 890-5544',
    },
    job: {
      employeeId: 'DF-4091',
      department: 'Engineering',
      designation: 'Frontend UI/UX Engineer',
      joiningDate: '2023-08-15',
      employmentStatus: 'Active',
      workLocation: 'San Francisco HQ (Hybrid)',
      manager: 'Alex Morgan',
      employmentType: 'Full-Time',
    },
    salary: {
      basic: 92000,
      allowances: 10000,
      deductions: 9200,
      netSalary: 92800,
      currency: 'USD',
      payFrequency: 'Monthly',
    },
    documents: [
      { id: 'doc_11', name: 'Contract_Zara_Patel.pdf', fileType: 'PDF', uploadDate: '2023-08-15', size: '1.6 MB' },
    ],
  },
  {
    id: 'DF-6089',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    personal: {
      fullName: 'Carlos Mendes',
      email: 'carlos.mendes@dayflow.com',
      phone: '+1 (555) 901-2345',
      address: '770 Harrison St, San Francisco, CA 94107',
      dateOfBirth: '1993-01-14',
      gender: 'Male',
      emergencyContact: 'Maria Mendes (Spouse) - +1 (555) 901-6677',
    },
    job: {
      employeeId: 'DF-6089',
      department: 'Operations',
      designation: 'Logistics & Facilities Specialist',
      joiningDate: '2021-04-12',
      employmentStatus: 'On Leave',
      workLocation: 'San Francisco HQ',
      manager: 'Lucas Wright',
      employmentType: 'Full-Time',
    },
    salary: {
      basic: 78000,
      allowances: 8500,
      deductions: 7900,
      netSalary: 78600,
      currency: 'USD',
      payFrequency: 'Monthly',
    },
    documents: [
      { id: 'doc_12', name: 'Facilities_Contract_Carlos.pdf', fileType: 'PDF', uploadDate: '2021-04-12', size: '1.2 MB' },
    ],
  },
  {
    id: 'DF-2046',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    personal: {
      fullName: 'Chloe Bennett',
      email: 'chloe.bennett@dayflow.com',
      phone: '+1 (555) 012-3456',
      address: '1020 Pine St, San Francisco, CA 94109',
      dateOfBirth: '1990-10-11',
      gender: 'Female',
      emergencyContact: 'James Bennett (Father) - +1 (555) 012-9988',
    },
    job: {
      employeeId: 'DF-2046',
      department: 'Finance',
      designation: 'Payroll & Tax Compliance Specialist',
      joiningDate: '2022-05-18',
      employmentStatus: 'Active',
      workLocation: 'San Francisco HQ',
      manager: 'David Kim',
      employmentType: 'Full-Time',
    },
    salary: {
      basic: 88000,
      allowances: 9500,
      deductions: 8800,
      netSalary: 88700,
      currency: 'USD',
      payFrequency: 'Monthly',
    },
    documents: [
      { id: 'doc_13', name: 'Payroll_Specialist_Agreement.pdf', fileType: 'PDF', uploadDate: '2022-05-18', size: '1.7 MB' },
    ],
  },
  {
    id: 'DF-1003',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    personal: {
      fullName: 'Aiden Brooks',
      email: 'aiden.brooks@dayflow.com',
      phone: '+1 (555) 123-4567',
      address: '500 Howard St, San Francisco, CA 94105',
      dateOfBirth: '1989-05-29',
      gender: 'Male',
      emergencyContact: 'Claire Brooks (Spouse) - +1 (555) 123-8877',
    },
    job: {
      employeeId: 'DF-1003',
      department: 'Human Resources',
      designation: 'Talent Acquisition Partner',
      joiningDate: '2021-09-01',
      employmentStatus: 'Active',
      workLocation: 'San Francisco HQ (Hybrid)',
      manager: 'Eleanor Vance',
      employmentType: 'Full-Time',
    },
    salary: {
      basic: 84000,
      allowances: 9000,
      deductions: 8400,
      netSalary: 84600,
      currency: 'USD',
      payFrequency: 'Monthly',
    },
    documents: [
      { id: 'doc_14', name: 'Recruiter_Employment_Doc.pdf', fileType: 'PDF', uploadDate: '2021-09-01', size: '1.5 MB' },
    ],
  },
  {
    id: 'DF-4092',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    personal: {
      fullName: 'Rachel Green',
      email: 'rachel.green@dayflow.com',
      phone: '+1 (555) 234-5670',
      address: '400 Beale St, San Francisco, CA 94105',
      dateOfBirth: '1992-03-21',
      gender: 'Female',
      emergencyContact: 'Monica Geller (Friend) - +1 (555) 234-1111',
    },
    job: {
      employeeId: 'DF-4092',
      department: 'Engineering',
      designation: 'Quality Assurance Lead',
      joiningDate: '2022-07-10',
      employmentStatus: 'Inactive',
      workLocation: 'Remote',
      manager: 'Marcus Chen',
      employmentType: 'Full-Time',
    },
    salary: {
      basic: 90000,
      allowances: 9500,
      deductions: 9000,
      netSalary: 90500,
      currency: 'USD',
      payFrequency: 'Monthly',
    },
    documents: [
      { id: 'doc_15', name: 'QA_Lead_Contract.pdf', fileType: 'PDF', uploadDate: '2022-07-10', size: '1.3 MB' },
    ],
  },
];

class EmployeeService {
  private getStoredEmployees(): Employee[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to parse stored employees', e);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_EMPLOYEES));
    return DEFAULT_EMPLOYEES;
  }

  private saveEmployees(list: Employee[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('dayflow_employees_updated'));
  }

  async getAllEmployees(): Promise<Employee[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getStoredEmployees());
      }, 150);
    });
  }

  async getEmployeeById(id: string): Promise<Employee | null> {
    const list = this.getStoredEmployees();
    const cleanId = id.toUpperCase().trim();
    const found = list.find((e) => e.id.toUpperCase() === cleanId || e.job.employeeId.toUpperCase() === cleanId);
    return found || null;
  }

  async filterEmployees(options: EmployeeFilterOptions = {}): Promise<{
    employees: Employee[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const list = this.getStoredEmployees();
    let filtered = [...list];

    // Search query
    if (options.search && options.search.trim()) {
      const q = options.search.toLowerCase().trim();
      filtered = filtered.filter(
        (e) =>
          e.personal.fullName.toLowerCase().includes(q) ||
          e.personal.email.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q) ||
          e.job.employeeId.toLowerCase().includes(q) ||
          e.job.department.toLowerCase().includes(q) ||
          e.job.designation.toLowerCase().includes(q)
      );
    }

    // Department filter
    if (options.department && options.department !== 'all') {
      filtered = filtered.filter(
        (e) => e.job.department.toLowerCase() === options.department!.toLowerCase()
      );
    }

    // Status filter
    if (options.status && options.status !== 'all') {
      filtered = filtered.filter(
        (e) => e.job.employmentStatus.toLowerCase() === options.status!.toLowerCase()
      );
    }

    // Sorting
    const sortBy = options.sortBy || 'name';
    const sortOrder = options.sortOrder || 'asc';

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.personal.fullName.localeCompare(b.personal.fullName);
      } else if (sortBy === 'joiningDate') {
        comparison = new Date(a.job.joiningDate).getTime() - new Date(b.job.joiningDate).getTime();
      } else if (sortBy === 'department') {
        comparison = a.job.department.localeCompare(b.job.department);
      } else if (sortBy === 'id') {
        comparison = a.id.localeCompare(b.id);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    const total = filtered.length;
    const page = options.page || 1;
    const pageSize = options.pageSize || 8;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    return {
      employees: paginated,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  async updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee> {
    const list = this.getStoredEmployees();
    const cleanId = id.toUpperCase().trim();
    const idx = list.findIndex((e) => e.id.toUpperCase() === cleanId || e.job.employeeId.toUpperCase() === cleanId);

    if (idx === -1) {
      throw new Error(`Employee with ID ${id} not found.`);
    }

    // Recompute net salary if salary fields changed
    let updatedSalary = updates.salary ? { ...list[idx].salary, ...updates.salary } : list[idx].salary;
    if (updates.salary) {
      updatedSalary.netSalary = updatedSalary.basic + updatedSalary.allowances - updatedSalary.deductions;
    }

    const updatedEmployee: Employee = {
      ...list[idx],
      ...updates,
      personal: updates.personal ? { ...list[idx].personal, ...updates.personal } : list[idx].personal,
      job: updates.job ? { ...list[idx].job, ...updates.job } : list[idx].job,
      salary: updatedSalary,
      documents: updates.documents || list[idx].documents,
    };

    list[idx] = updatedEmployee;
    this.saveEmployees(list);
    return updatedEmployee;
  }

  async createEmployee(newEmp: Omit<Employee, 'id'> & { id?: string }): Promise<Employee> {
    const list = this.getStoredEmployees();
    const employeeId = newEmp.id || newEmp.job.employeeId || `DF-${Math.floor(1000 + Math.random() * 9000)}`;

    const fullEmp: Employee = {
      ...newEmp,
      id: employeeId,
      job: {
        ...newEmp.job,
        employeeId,
      },
      salary: {
        ...newEmp.salary,
        netSalary: newEmp.salary.basic + newEmp.salary.allowances - newEmp.salary.deductions,
      },
      documents: newEmp.documents || [],
      avatarUrl:
        newEmp.avatarUrl ||
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    };

    list.unshift(fullEmp);
    this.saveEmployees(list);
    return fullEmp;
  }

  async deleteEmployee(id: string): Promise<boolean> {
    const list = this.getStoredEmployees();
    const cleanId = id.toUpperCase().trim();
    const filtered = list.filter((e) => e.id.toUpperCase() !== cleanId && e.job.employeeId.toUpperCase() !== cleanId);
    this.saveEmployees(filtered);
    return true;
  }
}

export const employeeService = new EmployeeService();
