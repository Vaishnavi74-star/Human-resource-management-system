import type {
  LoginCredentials,
  SignupCredentials,
  AuthResponse,
  VerifyEmailPayload,
} from '../types/auth';
import type { UserProfile } from '../types/user';
import { MOCK_USERS_DB } from '../data/mockUser';
import type { MockUserRecord } from '../data/mockUser';

const SESSION_STORAGE_KEY = 'dayflow_auth_session';
const REGISTERED_USERS_KEY = 'dayflow_registered_users';
const PENDING_VERIFICATION_KEY = 'dayflow_pending_verifications';

// Helper to simulate realistic network delay
const delay = (ms: number = 600) => new Promise((resolve) => setTimeout(resolve, ms));

function getStoredUsers(): MockUserRecord[] {
  try {
    const customUsers = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!customUsers) return [...MOCK_USERS_DB];
    const parsed = JSON.parse(customUsers) as MockUserRecord[];
    return [...MOCK_USERS_DB, ...parsed];
  } catch {
    return [...MOCK_USERS_DB];
  }
}

function saveCustomUser(user: MockUserRecord) {
  try {
    const existing = localStorage.getItem(REGISTERED_USERS_KEY);
    const list: MockUserRecord[] = existing ? JSON.parse(existing) : [];
    list.push(user);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save user to local storage', err);
  }
}

export const authService = {
  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(700);

    const emailClean = credentials.email.trim().toLowerCase();
    const allUsers = getStoredUsers();

    const userMatch = allUsers.find(
      (u) => u.email.toLowerCase() === emailClean && u.passwordHash === credentials.password
    );

    if (!userMatch) {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    if (!userMatch.isEmailVerified) {
      throw new Error('Please verify your email address before signing in.');
    }

    // Strip passwordHash before creating auth response
    const { passwordHash: _, ...safeUser } = userMatch;
    const token = `df_jwt_${safeUser.id}_${Date.now()}`;

    const session: AuthResponse = {
      user: safeUser,
      token,
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

    return session;
  },

  /**
   * Register a new employee or HR user
   */
  async signup(credentials: SignupCredentials): Promise<{ user: UserProfile; verificationCode: string }> {
    await delay(800);

    const emailClean = credentials.email.trim().toLowerCase();
    const allUsers = getStoredUsers();

    if (allUsers.some((u) => u.email.toLowerCase() === emailClean)) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser: MockUserRecord = {
      id: `usr_${Date.now()}`,
      employeeId: credentials.employeeId.trim().toUpperCase(),
      name: credentials.name.trim(),
      email: emailClean,
      passwordHash: credentials.password,
      role: credentials.role,
      title: credentials.role === 'admin' ? 'HR Specialist' : 'Team Member',
      department: credentials.role === 'admin' ? 'Human Resources' : 'Operations',
      status: 'active',
      isEmailVerified: false,
      joinedDate: new Date().toISOString().split('T')[0],
      timezone: 'America/New_York (EST)',
    };

    saveCustomUser(newUser);

    // Generate simulated 6-digit verification code
    const verificationCode = '123456';
    try {
      const pending = JSON.parse(localStorage.getItem(PENDING_VERIFICATION_KEY) || '{}');
      pending[emailClean] = verificationCode;
      localStorage.setItem(PENDING_VERIFICATION_KEY, JSON.stringify(pending));
    } catch {
      // ignore
    }

    const { passwordHash: _, ...safeUser } = newUser;
    return { user: safeUser, verificationCode };
  },

  /**
   * Verify email with 6-digit code
   */
  async verifyEmail(payload: VerifyEmailPayload): Promise<AuthResponse> {
    await delay(600);

    const emailClean = payload.email.trim().toLowerCase();
    const codeClean = payload.code.trim();

    // In mock mode, '123456' or any 6-digit code matches
    if (codeClean.length !== 6) {
      throw new Error('Verification code must be 6 digits.');
    }

    const allUsers = getStoredUsers();
    const targetUser = allUsers.find((u) => u.email.toLowerCase() === emailClean);

    if (!targetUser) {
      throw new Error('No registration found for this email address.');
    }

    targetUser.isEmailVerified = true;

    // Update in local storage
    try {
      const existing = localStorage.getItem(REGISTERED_USERS_KEY);
      if (existing) {
        const list: MockUserRecord[] = JSON.parse(existing);
        const idx = list.findIndex((u) => u.email.toLowerCase() === emailClean);
        if (idx >= 0) {
          list[idx].isEmailVerified = true;
          localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(list));
        }
      }
    } catch (err) {
      console.error(err);
    }

    const { passwordHash: _, ...safeUser } = targetUser;
    const token = `df_jwt_${safeUser.id}_${Date.now()}`;
    const session: AuthResponse = { user: safeUser, token };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

    return session;
  },

  /**
   * Resend email verification code
   */
  async resendVerificationCode(_email: string): Promise<{ success: boolean; code: string }> {
    await delay(500);
    return { success: true, code: '123456' };
  },

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    await delay(600);
    const emailClean = email.trim().toLowerCase();
    const allUsers = getStoredUsers();
    const exists = allUsers.some((u) => u.email.toLowerCase() === emailClean);

    if (!exists) {
      throw new Error('No Dayflow account is registered with this email address.');
    }

    return {
      success: true,
      message: `Password reset instructions sent to ${emailClean}.`,
    };
  },

  /**
   * Retrieve active session from localStorage
   */
  getCurrentSession(): AuthResponse | null {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored) as AuthResponse;
    } catch {
      return null;
    }
  },

  /**
   * Terminate active session
   */
  logout(): void {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  },
};
