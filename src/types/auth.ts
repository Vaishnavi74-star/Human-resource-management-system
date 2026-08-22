import type { UserProfile } from './user';
import type { UserRole } from '../utils/constants';

export type { UserRole };

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupCredentials {
  employeeId: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  termsAccepted: boolean;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

export interface VerifyEmailPayload {
  email: string;
  code: string;
}

export interface PasswordValidationResult {
  isValid: boolean;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  score: number; // 0 to 4
}
