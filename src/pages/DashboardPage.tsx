import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { useDisclosure } from '../hooks/useDisclosure';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import {
  Sparkles,
  Users,
  ShieldCheck,
  Building,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Layers,
  Code2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user, role, switchRole } = useAuth();
  const { success, warning, error, info } = useToast();

  const testModal = useDisclosure();
  const confirmDialog = useDisclosure();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleConfirmAction = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setConfirmLoading(false);
      confirmDialog.close();
      success('Action Executed', 'The simulated administrative action was completed successfully.');
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-900 via-indigo-800 to-indigo-700 text-white p-6 sm:p-8 shadow-lg shadow-indigo-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Foundation Architecture Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Welcome back, {user.name.split(' ')[0]} 👋
            </h1>
            <p className="text-sm text-indigo-100/90 leading-relaxed">
              Every workday, perfectly aligned. You are currently viewing the system in{' '}
              <strong className="text-white underline underline-offset-2">{role.toUpperCase()}</strong>{' '}
              mode.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="white"
              size="md"
              onClick={() => {
                const next = role === 'admin' ? 'employee' : 'admin';
                switchRole(next);
                info(`Switched Role`, `Switched active viewpoint to ${next.toUpperCase()}.`);
              }}
              leftIcon={<ShieldCheck className="w-4 h-4 text-indigo-600" />}
            >
              Switch to {role === 'admin' ? 'Employee' : 'Admin'} Mode
            </Button>
            <Link to="/components">
              <Button
                variant="outline"
                size="md"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                UI Components
              </Button>
            </Link>
          </div>
        </div>

        {/* Subtle decorative background circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-600/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Workforce</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900">148</p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12 new hires this quarter</span>
            </div>
          </div>
        </Card>

        <Card className="hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Departments</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900">8 Divisions</p>
            <p className="text-xs text-slate-500 mt-1">HR, Eng, Product, Design, Sales</p>
          </div>
        </Card>

        <Card className="hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">System State</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <p className="text-2xl font-black text-slate-900">Online</p>
              <Badge variant="success" size="xs" dot>
                Stable
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">TypeScript 6.0 + React 19</p>
          </div>
        </Card>

        <Card className="hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">UI Architecture</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900">12 UI Blocks</p>
            <p className="text-xs text-indigo-600 font-medium mt-1">Production-ready modular set</p>
          </div>
        </Card>
      </div>

      {/* Quick Interactive Testing Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Foundation Component & Feedback Testbench</CardTitle>
              <CardDescription>
                Test the global toast notifications, modal dialogs, and confirm prompts.
              </CardDescription>
            </div>
            <Badge variant="primary" size="sm">
              Interactive
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Trigger Global Toasts
              </p>
              <div className="flex flex-wrap gap-2.5">
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => success('Profile Synchronized', 'Your HR credentials were successfully validated.')}
                >
                  Success Toast
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => info('Information Notice', 'Dayflow release v1.0 foundation is loaded.')}
                >
                  Info Toast
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => warning('Leave Balance Low', 'You have 2 remaining floating leaves this quarter.')}
                >
                  Warning Toast
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => error('Validation Error', 'Failed to update employee department profile.')}
                >
                  Error Toast
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Trigger Dialogs & Overlays
              </p>
              <div className="flex flex-wrap gap-2.5">
                <Button variant="outline" size="sm" onClick={testModal.open}>
                  Open Interactive Modal
                </Button>
                <Button variant="danger" size="sm" onClick={confirmDialog.open}>
                  Open Confirm Dialog
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Identity Checklist Card */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Dayflow Design System</CardTitle>
              <CardDescription>Color tokens & visual rules</CardDescription>
            </div>
            <Code2 className="w-5 h-5 text-slate-400" />
          </CardHeader>
          <CardContent className="space-y-3.5">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-lg bg-indigo-800 shadow-2xs" />
                <span className="text-xs font-medium text-slate-800">Primary Deep Indigo</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">#3730A3</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-lg bg-emerald-600 shadow-2xs" />
                <span className="text-xs font-medium text-slate-800">Success Emerald</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">#059669</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-lg bg-amber-500 shadow-2xs" />
                <span className="text-xs font-medium text-slate-800">Warning Amber</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">#F59E0B</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-lg bg-rose-600 shadow-2xs" />
                <span className="text-xs font-medium text-slate-800">Error Rose</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">#DC2626</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Example */}
      <Modal
        isOpen={testModal.isOpen}
        onClose={testModal.close}
        title="DAYFLOW Form Dialog"
        description="A reusable modal window with keyboard escape and click-outside dismissal."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={testModal.close}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                testModal.close();
                success('Saved Successfully', 'Employee record was saved.');
              }}
            >
              Save Changes
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Employee Full Name"
            placeholder="e.g. Liam Anderson"
            defaultValue="Liam Anderson"
          />
          <Select
            label="Assigned Department"
            options={[
              { value: 'eng', label: 'Engineering' },
              { value: 'hr', label: 'Human Resources' },
              { value: 'prod', label: 'Product Design' },
              { value: 'finance', label: 'Finance & Legal' },
            ]}
          />
          <Input
            label="Work Email"
            type="email"
            placeholder="liam.anderson@dayflow.hr"
            defaultValue="liam.anderson@dayflow.hr"
          />
        </div>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.close}
        onConfirm={handleConfirmAction}
        title="Confirm Department Archival"
        message="Are you sure you want to archive this organization unit? Employees assigned will be notified."
        confirmLabel="Yes, Archive Unit"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={confirmLoading}
      />
    </div>
  );
};
