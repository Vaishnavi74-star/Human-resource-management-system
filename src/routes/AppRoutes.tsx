import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AppShell } from '../layouts/AppShell';
import {
  LandingPage,
  LoginPage,
  SignupPage,
  VerifyEmailPage,
  EmployeeDashboardPage,
  EmployeeAttendancePage,
  EmployeeLeavePage,
  AdminDashboardPage,
  AdminAttendancePage,
  AdminLeavePage,
  AdminEmployeesPage,
  AdminEmployeeDetailPage,
  LeaveCalendarPage,
  EmployeeSalaryPage,
  AdminPayrollPage,
  EmployeeDocumentsPage,
  AdminDocumentsPage,
  AdminReportsPage,
  SettingsPage,
} from '../pages';
import {
  ProtectedRoute,
  EmployeeRoute,
  AdminRoute,
  PublicOnlyRoute,
} from './guards';

// Intelligent root redirect: shows Landing page if guest, or user dashboard if logged in
const RootDispatcher: React.FC = () => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  if (role === 'admin' || role === 'hr') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/employee/dashboard" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root Landing / Dispatcher */}
      <Route path="/" element={<RootDispatcher />} />
      <Route path="/landing" element={<LandingPage />} />

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

      {/* Protected Workplace Routes with Global AppShell */}
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        {/* Shared Calendar & Settings Routes */}
        <Route path="/calendar" element={<LeaveCalendarPage />} />
        <Route path="/leave/calendar" element={<LeaveCalendarPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Employee Role Routes */}
        <Route
          path="/employee/dashboard"
          element={
            <EmployeeRoute>
              <EmployeeDashboardPage />
            </EmployeeRoute>
          }
        />
        <Route
          path="/employee/attendance"
          element={
            <EmployeeRoute>
              <EmployeeAttendancePage />
            </EmployeeRoute>
          }
        />
        <Route
          path="/employee/leave"
          element={
            <EmployeeRoute>
              <EmployeeLeavePage />
            </EmployeeRoute>
          }
        />
        <Route
          path="/employee/salary"
          element={
            <EmployeeRoute>
              <EmployeeSalaryPage />
            </EmployeeRoute>
          }
        />
        <Route
          path="/employee/documents"
          element={
            <EmployeeRoute>
              <EmployeeDocumentsPage />
            </EmployeeRoute>
          }
        />

        {/* HR / Admin Role Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/attendance"
          element={
            <AdminRoute>
              <AdminAttendancePage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/leave"
          element={
            <AdminRoute>
              <AdminLeavePage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <AdminReportsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/employees"
          element={
            <AdminRoute>
              <AdminEmployeesPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/employees/:id"
          element={
            <AdminRoute>
              <AdminEmployeeDetailPage />
            </AdminRoute>
          }
        />
        <Route
          path="/employees"
          element={<Navigate to="/admin/employees" replace />}
        />

        {/* Role-Protected Business Modules */}
        <Route
          path="/admin/payroll"
          element={
            <AdminRoute>
              <AdminPayrollPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/documents"
          element={
            <AdminRoute>
              <AdminDocumentsPage />
            </AdminRoute>
          }
        />

        {/* Generic redirects based on role */}
        <Route
          path="/attendance"
          element={<Navigate to="/employee/attendance" replace />}
        />
        <Route
          path="/leave"
          element={<Navigate to="/employee/leave" replace />}
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
