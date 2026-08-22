import type { UserRole } from '../utils/constants';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  title: string;
  department: string;
  status: 'active' | 'away' | 'offline' | 'on-leave';
  joinedDate: string;
  timezone: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
