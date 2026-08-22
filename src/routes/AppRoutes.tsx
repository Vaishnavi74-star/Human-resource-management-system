import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '../layouts/AppShell';
import { DashboardPage } from '../pages/DashboardPage';
import { ComponentShowcasePage } from '../pages/ComponentShowcasePage';
import { FoundationOverviewPage } from '../pages/FoundationOverviewPage';
import { EmptyState } from '../components/ui/EmptyState';
import { Card } from '../components/ui/Card';
import { Users, CalendarCheck, Building2, CreditCard, FileBadge, LifeBuoy } from 'lucide-react';

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
        description="Foundation and architecture are ready. Business domain logic and interactive tables will be attached in the upcoming development phase."
        actionLabel="Back to Dashboard"
        onAction={() => {
          window.location.href = '/';
        }}
      />
    </Card>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {/* Main Routes */}
        <Route path="/" element={<DashboardPage />} />
        <Route path="/architecture" element={<FoundationOverviewPage />} />
        <Route path="/components" element={<ComponentShowcasePage />} />

        {/* Future Business Module Route Placeholders */}
        <Route
          path="/employees"
          element={
            <PagePlaceholder
              title="Employee Directory"
              subtitle="Staff profiles, organizational hierarchy, and team assignments."
              icon={<Users className="w-7 h-7 text-indigo-600" />}
            />
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
            <PagePlaceholder
              title="Payroll & Compensation"
              subtitle="Salary disbursements, tax withholdings, and benefits overview."
              icon={<CreditCard className="w-7 h-7 text-indigo-600" />}
            />
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

        {/* Catch-all redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
