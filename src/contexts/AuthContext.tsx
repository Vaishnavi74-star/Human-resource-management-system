import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserProfile } from '../types/user';
import type { UserRole } from '../utils/constants';
import type {
  LoginCredentials,
  SignupCredentials,
  VerifyEmailPayload,
  AuthResponse,
} from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextValue {
  user: UserProfile | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  signup: (credentials: SignupCredentials) => Promise<{ user: UserProfile; verificationCode: string }>;
  verifyEmail: (payload: VerifyEmailPayload) => Promise<AuthResponse>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore saved session on mount
  useEffect(() => {
    try {
      const session = authService.getCurrentSession();
      if (session) {
        setUser(session.user);
        setToken(session.token);
      }
    } catch (err) {
      console.error('Failed to restore auth session', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await authService.login(credentials);
      setUser(res.user);
      setToken(res.token);
      return res;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(
    async (credentials: SignupCredentials): Promise<{ user: UserProfile; verificationCode: string }> => {
      setIsLoading(true);
      try {
        return await authService.signup(credentials);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const verifyEmail = useCallback(async (payload: VerifyEmailPayload): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await authService.verifyEmail(payload);
      setUser(res.user);
      setToken(res.token);
      return res;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
  }, []);

  const switchRole = useCallback((newRole: UserRole) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        role: newRole,
        title: newRole === 'admin' ? 'Head of People Operations' : 'Senior Software Engineer',
        department: newRole === 'admin' ? 'Human Resources' : 'Product Engineering',
      };
      localStorage.setItem('dayflow_auth_session', JSON.stringify({ user: updated, token: 'demo' }));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        verifyEmail,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
