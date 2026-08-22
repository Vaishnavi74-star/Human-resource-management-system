import React, { createContext, useContext, useState } from 'react';
import type { UserProfile } from '../types/user';
import type { UserRole } from '../utils/constants';
import { CURRENT_USER } from '../data/mockUser';

interface AuthContextValue {
  user: UserProfile;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(CURRENT_USER);

  const switchRole = (newRole: UserRole) => {
    setUser((prev) => ({
      ...prev,
      role: newRole,
      title: newRole === 'admin' ? 'Head of People Operations' : 'Senior Product Designer',
      department: newRole === 'admin' ? 'Human Resources' : 'Product Design',
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user.role,
        setRole: switchRole,
        isAuthenticated: true,
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
