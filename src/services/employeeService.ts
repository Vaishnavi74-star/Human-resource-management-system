import { apiClient } from './apiClient';
import type { UserProfile } from '../types/user';

export const employeeService = {
  async getEmployees(): Promise<UserProfile[]> {
    const res = await apiClient.get<UserProfile[]>('/employees');
    return res.data;
  },

  async getEmployeeById(id: string): Promise<UserProfile | null> {
    const res = await apiClient.get<UserProfile>(`/employees/${id}`);
    return res.data;
  },
};
