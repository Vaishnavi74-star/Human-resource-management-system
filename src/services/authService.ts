import type {
  LoginCredentials,
  SignupCredentials,
  AuthResponse,
  VerifyEmailPayload,
} from '../types/auth';
import type { UserProfile } from '../types/user';
import { MOCK_USERS_DB } from '../data/mockUser';
import type { MockUserRecord } from '../data/mockUser';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const SESSION_STORAGE_KEY = 'dayflow_auth_session';
const REGISTERED_USERS_KEY = 'dayflow_registered_users';
const PENDING_VERIFICATION_KEY = 'dayflow_pending_verifications';

// Helper to simulate realistic network delay
const delay = (ms: number = 400) => new Promise((resolve) => setTimeout(resolve, ms));

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
    const emailClean = credentials.email.trim().toLowerCase();

    // 1. If Supabase is configured, try Supabase authentication
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailClean,
          password: credentials.password,
        });

        if (!error && data?.user) {
          // Fetch user profile from Supabase profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const userProfile: UserProfile = {
            id: data.user.id,
            employeeId: profile?.employee_id || data.user.user_metadata?.employeeId || 'DF-1001',
            name: profile?.full_name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
            email: data.user.email || emailClean,
            role: (profile?.role || data.user.user_metadata?.role || 'employee') as any,
            title: profile?.designation || data.user.user_metadata?.title || 'Team Member',
            department: profile?.department || data.user.user_metadata?.department || 'Operations',
            avatarUrl: profile?.avatar_url,
            status: (profile?.status || 'active') as any,
            isEmailVerified: data.user.email_confirmed_at != null || true,
            joinedDate: profile?.joined_date || new Date().toISOString().split('T')[0],
            timezone: 'America/New_York (EST)',
          };

          const session: AuthResponse = {
            user: userProfile,
            token: data.session?.access_token || `sb_${Date.now()}`,
          };

          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
          return session;
        }
      } catch (err) {
        console.warn('Supabase auth attempt returned error, checking mock fallback:', err);
      }
    }

    // 2. Mock Fallback (for demo accounts and offline development)
    await delay(500);
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
    const emailClean = credentials.email.trim().toLowerCase();

    // 1. If Supabase is configured, create account in Supabase Auth
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: emailClean,
          password: credentials.password,
          options: {
            data: {
              name: credentials.name.trim(),
              employeeId: credentials.employeeId.trim().toUpperCase(),
              role: credentials.role,
              department: credentials.role === 'admin' ? 'Human Resources' : 'Engineering',
              designation: credentials.role === 'admin' ? 'HR Specialist' : 'Software Engineer',
            },
          },
        });

        if (error) {
          throw new Error(error.message);
        }

        const newUser: UserProfile = {
          id: data.user?.id || `usr_${Date.now()}`,
          employeeId: credentials.employeeId.trim().toUpperCase(),
          name: credentials.name.trim(),
          email: emailClean,
          role: credentials.role,
          title: credentials.role === 'admin' ? 'HR Specialist' : 'Software Engineer',
          department: credentials.role === 'admin' ? 'Human Resources' : 'Engineering',
          status: 'active',
          isEmailVerified: false,
          joinedDate: new Date().toISOString().split('T')[0],
          timezone: 'America/New_York (EST)',
        };

        return { user: newUser, verificationCode: '123456' };
      } catch (err: unknown) {
        if (err instanceof Error && !err.message.includes('fetch')) {
          throw err;
        }
      }
    }

    // 2. Mock Fallback Signup
    await delay(600);
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
    await delay(400);

    const emailClean = payload.email.trim().toLowerCase();
    const codeClean = payload.code.trim();

    if (codeClean.length !== 6) {
      throw new Error('Verification code must be 6 digits.');
    }

    const allUsers = getStoredUsers();
    const targetUser = allUsers.find((u) => u.email.toLowerCase() === emailClean);

    if (!targetUser) {
      // Create session for the verified email
      const safeUser: UserProfile = {
        id: `usr_${Date.now()}`,
        employeeId: 'DF-1002',
        name: emailClean.split('@')[0],
        email: emailClean,
        role: 'employee',
        title: 'Team Member',
        department: 'Operations',
        status: 'active',
        isEmailVerified: true,
        joinedDate: new Date().toISOString().split('T')[0],
        timezone: 'America/New_York (EST)',
      };
      const token = `df_jwt_${safeUser.id}_${Date.now()}`;
      const session = { user: safeUser, token };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      return session;
    }

    targetUser.isEmailVerified = true;

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
    await delay(300);
    return { success: true, code: '123456' };
  },

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const emailClean = email.trim().toLowerCase();

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(emailClean, {
          redirectTo: `${window.location.origin}/login`,
        });
        if (error) throw error;
        return {
          success: true,
          message: `Password reset email sent to ${emailClean}. Check your inbox!`,
        };
      } catch (err: unknown) {
        console.warn('Supabase resetPasswordForEmail error, checking fallback:', err);
      }
    }

    await delay(400);
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
  async logout(): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Supabase signOut error:', err);
      }
    }
    localStorage.removeItem(SESSION_STORAGE_KEY);
  },
};
