import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useDisclosure } from '../hooks/useDisclosure';
import { useToast } from '../hooks/useToast';
import {
  Mail,
  Send,
  Trash2,
  CheckCircle,
} from 'lucide-react';

export const ComponentShowcasePage: React.FC = () => {
  const { success, warning, info } = useToast();
  const demoModal = useDisclosure();
  const demoConfirm = useDisclosure();

  const [inputVal, setInputVal] = useState('');
  const [selectVal, setSelectVal] = useState('full-time');
  const [btnLoading, setBtnLoading] = useState(false);

  const simulateLoading = () => {
    setBtnLoading(true);
    setTimeout(() => {
      setBtnLoading(false);
      success('Operation Finished', 'Async button action simulated.');
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Reusable Component Library
            </h1>
            <Badge variant="success" size="sm">
              12 Production Blocks
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Modular, typed, accessible UI components built for the DAYFLOW HRMS ecosystem.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={demoModal.open}>
            Preview Modal
          </Button>
          <Button variant="danger" size="sm" onClick={demoConfirm.open}>
            Preview Confirm Dialog
          </Button>
        </div>
      </div>

      {/* Grid of components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. Buttons */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>1. Button Component</CardTitle>
              <CardDescription>Variants, sizes, loading states, and icon attachments.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2.5">
              <Button variant="primary" size="sm">
                Primary
              </Button>
              <Button variant="secondary" size="sm">
                Secondary
              </Button>
              <Button variant="outline" size="sm">
                Outline
              </Button>
              <Button variant="ghost" size="sm">
                Ghost
              </Button>
              <Button variant="danger" size="sm" leftIcon={<Trash2 className="w-3.5 h-3.5" />}>
                Danger
              </Button>
              <Button variant="success" size="sm" leftIcon={<CheckCircle className="w-3.5 h-3.5" />}>
                Success
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100">
              <Button size="xs" variant="primary">
                Size XS
              </Button>
              <Button size="sm" variant="primary">
                Size SM
              </Button>
              <Button size="md" variant="primary">
                Size MD
              </Button>
              <Button size="lg" variant="primary">
                Size LG
              </Button>
              <Button
                size="sm"
                variant="primary"
                isLoading={btnLoading}
                onClick={simulateLoading}
                rightIcon={<Send className="w-3.5 h-3.5" />}
              >
                {btnLoading ? 'Processing...' : 'Click to Load'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 2. Inputs & Selects */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>2. Input & Select Fields</CardTitle>
              <CardDescription>Labels, icons, error handling, and hint text.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Employee Email"
              placeholder="alexandra@dayflow.hr"
              leftIcon={<Mail className="w-4 h-4" />}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              hint="We will send attendance and payroll summaries here."
            />

            <Select
              label="Employment Type"
              value={selectVal}
              onChange={(e) => setSelectVal(e.target.value)}
              options={[
                { value: 'full-time', label: 'Full-time Employee' },
                { value: 'contract', label: 'Fixed Term Contractor' },
                { value: 'intern', label: 'Apprenticeship / Intern' },
              ]}
            />

            <Input
              label="Invalid Input Example"
              defaultValue="invalid-email-format"
              error="Please enter a valid company email address."
            />
          </CardContent>
        </Card>

        {/* 3. Badges */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>3. Badge Component</CardTitle>
              <CardDescription>Status tags with pulsing indicators and color mappings.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">Primary Badge</Badge>
              <Badge variant="success" dot>
                Active On Duty
              </Badge>
              <Badge variant="warning" dot>
                Pending Approval
              </Badge>
              <Badge variant="error" dot>
                Leave of Absence
              </Badge>
              <Badge variant="info">Informational</Badge>
              <Badge variant="neutral">Archived</Badge>
              <Badge variant="purple">Engineering</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <Badge size="xs" variant="primary">
                Extra Small
              </Badge>
              <Badge size="sm" variant="primary">
                Small Default
              </Badge>
              <Badge size="md" variant="primary">
                Medium Size
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* 4. Avatars */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>4. Avatar Component</CardTitle>
              <CardDescription>Image avatars, fallback initials, status dots, and sizes.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop"
                name="Eleanor Vance"
                size="xl"
                status="active"
                ring
              />
              <Avatar
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop"
                name="Marcus Chen"
                size="lg"
                status="away"
                ring
              />
              <Avatar name="Sofia Rodriguez" size="md" status="active" />
              <Avatar name="David Kim" size="sm" status="offline" />
              <Avatar name="Zara Patel" size="xs" status="on-leave" />
            </div>
            <p className="text-xs text-slate-500">
              Notice the automatic color generation and initials fallback when no image is provided.
            </p>
          </CardContent>
        </Card>

        {/* 5. Loading State */}
        <Card>
          <CardHeader>
            <CardTitle>5. Loading State</CardTitle>
            <CardDescription>Standardized asynchronous loader.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoadingState
              message="Fetching Employee Timesheets..."
              description="Connecting to Dayflow biometric payroll gateway."
            />
          </CardContent>
        </Card>

        {/* 6. Empty State */}
        <Card>
          <CardHeader>
            <CardTitle>6. Empty State</CardTitle>
            <CardDescription>Clean placeholders for zero-data views.</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              title="No Pending Leave Requests"
              description="All submitted vacation and sick leave requests for this payroll cycle have been processed."
              actionLabel="Create Request"
              onAction={() => info('Action Clicked', 'Opened new leave request flow.')}
            />
          </CardContent>
        </Card>
      </div>

      {/* 7. Error State */}
      <Card>
        <CardHeader>
          <CardTitle>7. Error State Component</CardTitle>
          <CardDescription>Graceful failure recovery display.</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorState
            title="Failed to Load Performance Reviews"
            message="The HR feedback service responded with a temporary network timeout. Check your connection or retry."
            onRetry={() => success('Retry Request Sent', 'Re-established connection.')}
          />
        </CardContent>
      </Card>

      {/* Modal Dialog */}
      <Modal
        isOpen={demoModal.isOpen}
        onClose={demoModal.close}
        title="Dayflow Modal Component"
        description="Encapsulated dialog with backdrop blur, focus trap, and clean layout."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={demoModal.close}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                demoModal.close();
                success('Modal Confirmed', 'Action performed from modal.');
              }}
            >
              Confirm
            </Button>
          </>
        }
      >
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
          <p className="text-sm font-semibold text-slate-800">Production-Ready Architecture</p>
          <p className="text-xs text-slate-600 leading-relaxed">
            All components are typed with TypeScript interfaces, accept custom class names via clsx/tailwind-merge,
            and respect the Dayflow design tokens.
          </p>
        </div>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={demoConfirm.isOpen}
        onClose={demoConfirm.close}
        onConfirm={() => {
          demoConfirm.close();
          warning('Item Removed', 'The test record was deleted.');
        }}
        title="Revoke System Access?"
        message="Are you sure you want to revoke HR Admin permissions for this account? This takes effect immediately."
        confirmLabel="Revoke Access"
        cancelLabel="Cancel"
        variant="danger"
      />
    </div>
  );
};
