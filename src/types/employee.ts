export type EmploymentStatus = 'Active' | 'On Leave' | 'Inactive';

export interface EmployeeDocument {
  id: string;
  name: string;
  fileType: 'PDF' | 'DOCX' | 'PNG' | 'ZIP';
  uploadDate: string;
  size: string;
}

export interface EmployeeSalary {
  basic: number;
  allowances: number;
  deductions: number;
  netSalary: number; // basic + allowances - deductions
  currency: string;
  payFrequency: 'Monthly' | 'Bi-Weekly';
}

export interface EmployeePersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth?: string;
  gender?: 'Female' | 'Male' | 'Other' | 'Prefer not to say';
  emergencyContact?: string;
}

export interface EmployeeJobInfo {
  employeeId: string;
  department: string;
  designation: string;
  joiningDate: string;
  employmentStatus: EmploymentStatus;
  workLocation: string;
  manager: string;
  employmentType: 'Full-Time' | 'Part-Time' | 'Contract';
}

export interface Employee {
  id: string; // usually same as employeeId (e.g., 'DF-4089')
  personal: EmployeePersonalInfo;
  job: EmployeeJobInfo;
  salary: EmployeeSalary;
  documents: EmployeeDocument[];
  avatarUrl: string;
}

export interface EmployeeFilterOptions {
  search?: string;
  department?: string;
  status?: string;
  sortBy?: 'name' | 'joiningDate' | 'department' | 'id';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}
