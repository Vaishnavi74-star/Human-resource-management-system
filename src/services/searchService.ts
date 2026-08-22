import { MOCK_USERS_DB } from '../data/mockUser';
import { leaveService } from './leaveService';
import type { UserRole } from '../types/auth';

export interface SearchResult {
  id: string;
  type: 'employee' | 'leave_request' | 'department';
  title: string;
  subtitle?: string;
  link: string;
}

export const searchService = {
  async globalSearch(query: string, role: UserRole | undefined): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) return [];
    
    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search Employees (Admins can see more/navigate differently than standard users)
    const matchedUsers = MOCK_USERS_DB.filter(u => 
      u.name.toLowerCase().includes(lowerQuery) || 
      u.employeeId.toLowerCase().includes(lowerQuery) ||
      u.department.toLowerCase().includes(lowerQuery)
    );
    
    matchedUsers.forEach(u => {
      // Employees generally can't view other employees' full admin profiles
      // But we can route them to a directory if it exists, or just to admin pages if they are an admin
      const link = role === 'admin' || role === 'hr' ? `/admin/employees` : `#`; // Assuming no employee directory yet
      
      results.push({
        id: `emp-${u.id}`,
        type: 'employee',
        title: u.name,
        subtitle: `${u.employeeId} - ${u.department}`,
        link: link
      });
    });

    // Search Departments (Unique list from mock users)
    const departments = Array.from(new Set(MOCK_USERS_DB.map(u => u.department)));
    const matchedDepts = departments.filter(d => d.toLowerCase().includes(lowerQuery));
    
    matchedDepts.forEach(d => {
      results.push({
        id: `dept-${d}`,
        type: 'department',
        title: d,
        link: role === 'admin' || role === 'hr' ? `/admin/reports` : `#`
      });
    });

    // Search Leave Requests (Only Admins/HR can search all leaves globally here for simplicity)
    if (role === 'admin' || role === 'hr') {
      const allLeaves = await leaveService.getAllLeaveRequests();
      const matchedLeaves = allLeaves.filter(l => 
        l.employeeName.toLowerCase().includes(lowerQuery) ||
        l.leaveType.toLowerCase().includes(lowerQuery) ||
        l.status.toLowerCase().includes(lowerQuery)
      );

      matchedLeaves.forEach(l => {
        results.push({
          id: `leave-${l.id}`,
          type: 'leave_request',
          title: `${l.employeeName} — ${l.leaveType}`,
          subtitle: `${l.startDate} to ${l.endDate} (${l.status})`,
          link: `/admin/leave`
        });
      });
    }

    return results;
  }
};
