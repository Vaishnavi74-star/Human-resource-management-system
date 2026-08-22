import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AppShell } from '../layouts/AppShell';
import {
  LoginPage,
  SignupPage,
  VerifyEmailPage,
  EmployeeDashboardPage,
  AdminDashboardPage,
  ComponentShowcasePage,
  FoundationOverviewPage,
} from '../pages';
import {
  ProtectedRoute,
  EmployeeRoute,
  AdminRoute,
  PublicOnlyRoute,
} from './guards';
import { EmptyState } from '../components/ui/EmptyState';
import { Card } from '../components/ui/Card';
import {
  Users,
  CalendarCheck,
  Building2,
  CreditCard,
  FileBadge,
  LifeBuoy,
} from 'lucide-react';

const PagePlaceholder: React.FC<{
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}> = ({ title, subtitle, icon }) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
        {title}
      </h1>
      <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
    </div>

    <Card>
      <EmptyState
        icon={icon}
        title={`${title} Module`}
        description="Foundation and authentication architecture are active. Business domain logic will connect here."
        actionLabel="Back to Dashboard"
        onAction={() => {
          window.location.href = '/';
        }}
      />
    </Card>
  </div>
);

// Intelligent root redirect based on authenticated role
const RootRedirect: React.FC = () => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin' || role === 'hr') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/employee/dashboard" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes (Guest Only) */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <SignupPage />
          </PublicOnlyRoute>
        }
      />
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      {/* Root Path Dispatcher */}
      <Route path="/" element={<RootRedirect />} />

      {/* Protected Workplace Routes with Global AppShell */}
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        {/* Role-Specific Dashboards */}
        <Route
          path="/employee/dashboard"
          element={
            <EmployeeRoute>
              <EmployeeDashboardPage />
            </EmployeeRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />

        {/* Shared System Pages */}
        <Route path="/architecture" element={<FoundationOverviewPage />} />
        <Route path="/components" element={<ComponentShowcasePage />} />

        {/* Role-Protected Business Module Placeholders */}
        <Route
          path="/employees"
          element={
            <AdminRoute>
              <PagePlaceholder
                title="Employee Directory"
                subtitle="Staff profiles, organizational hierarchy, and team assignments."
                icon={<Users className="w-7 h-7 text-indigo-600" />}
              />
            </AdminRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <PagePlaceholder
              title="Time & Attendance"
              subtitle="Biometric logs, clock-in records, overtime and leaves."
              icon={<CalendarCheck className="w-7 h-7 text-indigo-600" />}
            />
          }
        />
        <Route
          path="/organization"
          element={
            <PagePlaceholder
              title="Organization Structure"
              subtitle="Departmental hierarchy and reporting line visualization."
              icon={<Building2 className="w-7 h-7 text-indigo-600" />}
            />
          }
        />
        <Route
          path="/payroll"
          element={
            <AdminRoute>
              <PagePlaceholder
                title="Payroll & Compensation"
                subtitle="Salary disbursements, tax withholdings, and benefits overview."
                icon={<CreditCard className="w-7 h-7 text-indigo-600" />}
              />
            </AdminRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <PagePlaceholder
              title="Document Hub"
              subtitle="Employee contracts, policy handbooks, and compliance archives."
              icon={<FileBadge className="w-7 h-7 text-indigo-600" />}
            />
          }
        />
        <Route
          path="/help"
          element={
            <PagePlaceholder
              title="Help & Knowledge Base"
              subtitle="User guides, HR policies, and ticket submission."
              icon={<LifeBuoy className="w-7 h-7 text-indigo-600" />}
            />
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
