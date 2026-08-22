import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from '../assets/Logo';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import {
  Users,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  CalendarCheck,
  CreditCard,
  Layers,
  Lock,
  ChevronRight,
  Play,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const [activeTab, setActiveTab] = useState<'employee' | 'admin'>('employee');

  const handleEnterWorkspace = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (role === 'admin' || role === 'hr') {
      navigate('/admin/dashboard');
    } else {
      navigate('/employee/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* 1. Global Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Logo size="md" showTagline={true} />
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">
              Platform Features
            </a>
            <a href="#roles" className="hover:text-indigo-600 transition-colors">
              Role Portals
            </a>
            <a href="#preview" className="hover:text-indigo-600 transition-colors">
              Workspace Experience
            </a>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleEnterWorkspace}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Go to Workspace
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
        {/* Subtle geometric light orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-blue-200/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-semibold text-indigo-700 mb-8 shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Modern SaaS Human Resource Management System</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] max-w-4xl mx-auto leading-[1.1]">
            Every workday, <br />
            <span className="bg-linear-to-r from-indigo-700 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              perfectly aligned.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            DAYFLOW unites workforce operations, self-service employee attendance, seamless leave approvals,
            and automated payroll workflows in one unified, modern SaaS platform.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/signup">
              <Button
                variant="primary"
                size="lg"
                className="shadow-lg shadow-indigo-200 px-7 py-3.5 text-base"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Create Free Account
              </Button>
            </Link>

            <Link to="/login">
              <Button
                variant="outline"
                size="lg"
                className="bg-white border-slate-300 hover:border-slate-400 px-6 py-3.5 text-base"
                leftIcon={<Play className="w-4 h-4 text-indigo-600" />}
              >
                Sign In with Demo Accounts
              </Button>
            </Link>
          </div>

          {/* Trust points */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Role-Based Access Control (Employee & HR)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Instant Biometric Attendance Sync</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Two-Factor Email Verification Guard</span>
            </span>
          </div>
        </div>
      </section>

      {/* 3. Interactive Product View Showcase */}
      <section id="roles" className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="primary" size="sm">
              Role-Driven Experience
            </Badge>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3 font-['Plus_Jakarta_Sans',sans-serif]">
              Tailored workspaces for both Employees & HR Operations
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Switch between the Employee Self-Service portal and the HR & Admin Command Center to preview the
              interfaces.
            </p>

            {/* Switcher Pill */}
            <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200 mt-6">
              <button
                type="button"
                onClick={() => setActiveTab('employee')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'employee'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Employee Portal View
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                HR & Admin Command Center
              </button>
            </div>
          </div>

          {/* Interactive Screen Mockup Card */}
          <div className="relative rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4 sm:p-8 shadow-2xl shadow-slate-300/40">
            {activeTab === 'employee' ? (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Employee Mockup Banner */}
                <div className="rounded-2xl bg-linear-to-r from-indigo-900 to-indigo-700 text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <Badge variant="primary" size="xs" className="bg-white/10 text-indigo-200 border-white/20">
                      Employee View &bull; Alex Morgan (DF-4089)
                    </Badge>
                    <h3 className="text-xl font-bold mt-2">Good morning, Alex 👋</h3>
                    <p className="text-xs text-indigo-100">Product Engineering &bull; Senior Software Engineer</p>
                  </div>
                  <Button variant="white" size="sm">
                    Request Time Off
                  </Button>
                </div>

                {/* Employee Mockup Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">Live Attendance</span>
                      <Badge variant="success" size="xs" dot>
                        On Duty
                      </Badge>
                    </div>
                    <p className="text-2xl font-black font-mono text-slate-900 mt-2">04h 28m 15s</p>
                    <p className="text-xs text-slate-400 mt-1">Clocked in at 09:02 AM</p>
                  </div>

                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-xs font-semibold text-slate-500">Vacation Leave Balance</span>
                    <p className="text-2xl font-black text-slate-900 mt-2">16 Days</p>
                    <p className="text-xs text-emerald-600 font-medium mt-1">+1.5 days accrued this month</p>
                  </div>

                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-xs font-semibold text-slate-500">Latest Payslip</span>
                    <p className="text-2xl font-black text-slate-900 mt-2">$6,450.00</p>
                    <p className="text-xs text-slate-400 mt-1">Disbursed on Jul 31, 2026</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* HR Mockup Banner */}
                <div className="rounded-2xl bg-linear-to-r from-indigo-950 to-indigo-800 text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <Badge variant="primary" size="xs" className="bg-white/10 text-indigo-200 border-white/20">
                      HR & Admin Console &bull; Eleanor Vance (DF-1001)
                    </Badge>
                    <h3 className="text-xl font-bold mt-2">People Operations Command Center</h3>
                    <p className="text-xs text-indigo-100">148 Active Employees across 8 Departments</p>
                  </div>
                  <Button variant="white" size="sm">
                    Onboard New Hire
                  </Button>
                </div>

                {/* HR Mockup Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-xs font-semibold text-slate-500">Total Headcount</span>
                    <p className="text-2xl font-black text-slate-900 mt-1">148</p>
                    <p className="text-xs text-emerald-600 font-medium">+12 new hires</p>
                  </div>
                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-xs font-semibold text-slate-500">Attendance Today</span>
                    <p className="text-2xl font-black text-slate-900 mt-1">98.2%</p>
                    <p className="text-xs text-slate-400">142 present on site/remote</p>
                  </div>
                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-xs font-semibold text-slate-500">Pending Leave Approvals</span>
                    <p className="text-2xl font-black text-slate-900 mt-1">4 Requests</p>
                    <p className="text-xs text-amber-600 font-medium">Action required</p>
                  </div>
                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-xs font-semibold text-slate-500">August Payroll</span>
                    <p className="text-2xl font-black text-slate-900 mt-1">$428.5k</p>
                    <p className="text-xs text-slate-400">Cycle closes in 3 days</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Core Capabilities Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="primary" size="sm">
            Core Modules
          </Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3 font-['Plus_Jakarta_Sans',sans-serif]">
            Everything needed to run modern HR operations
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Built from first principles for modern SaaS companies and high-performing remote/hybrid teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card className="hover:border-indigo-300 transition-all p-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Workforce & Directory</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Complete organizational chart, department mapping, employee profiles, reporting lines, and
              identity management with unique employee IDs.
            </p>
          </Card>

          {/* Card 2 */}
          <Card className="hover:border-indigo-300 transition-all p-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Time & Attendance Engine</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Real-time clock in/out tracking, live workday counter, timesheet verification, and automated
              attendance rate calculation.
            </p>
          </Card>

          {/* Card 3 */}
          <Card className="hover:border-indigo-300 transition-all p-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Leave & Time-Off Approvals</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Annual vacation, medical sick leave, floating holidays, and one-click approvals or rejections
              with instant employee notifications.
            </p>
          </Card>

          {/* Card 4 */}
          <Card className="hover:border-indigo-300 transition-all p-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Payroll & Compensation</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Disbursement cycle management, gross-to-net calculation, tax withholdings, and downloadable
              payslip summaries.
            </p>
          </Card>

          {/* Card 5 */}
          <Card className="hover:border-indigo-300 transition-all p-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Security & Role Guarding</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Strict client-side and service-level RBAC route protection. Employees cannot access administrative
              tools, with email verification for all signups.
            </p>
          </Card>

          {/* Card 6 */}
          <Card className="hover:border-indigo-300 transition-all p-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-5">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">12+ Modular UI Components</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Production-grade atomic UI component system: Buttons, Inputs, Modals, Confirm Dialogs, Badges,
              Avatars, Toasts, and Error States.
            </p>
          </Card>
        </div>
      </section>

      {/* 5. Quick Test Account Access Section */}
      <section className="py-16 bg-linear-to-b from-indigo-900 to-indigo-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="primary" size="sm" className="bg-white/10 text-indigo-200 border-white/20">
            Instant Demo Sandbox
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 font-['Plus_Jakarta_Sans',sans-serif]">
            Try DAYFLOW immediately with pre-configured accounts
          </h2>
          <p className="text-sm text-indigo-200 max-w-xl mx-auto mt-2">
            No signup or credit card required. Use our pre-loaded credentials to test both portals:
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Employee Account</p>
              <p className="text-base font-bold text-white mt-1">Alex Morgan</p>
              <p className="text-xs font-mono text-indigo-100 mt-2">email: employee@dayflow.com</p>
              <p className="text-xs font-mono text-indigo-100">password: Employee@123</p>
              <Link to="/login" className="inline-flex items-center gap-1 text-xs font-bold text-white underline mt-4 hover:text-indigo-200">
                <span>Sign in as Employee</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider">HR / Admin Account</p>
              <p className="text-base font-bold text-white mt-1">Eleanor Vance</p>
              <p className="text-xs font-mono text-indigo-100 mt-2">email: hr@dayflow.com</p>
              <p className="text-xs font-mono text-indigo-100">password: HR@123456</p>
              <Link to="/login" className="inline-flex items-center gap-1 text-xs font-bold text-white underline mt-4 hover:text-indigo-200">
                <span>Sign in as HR / Admin</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Logo size="sm" showTagline={true} />

          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} DAYFLOW Technologies Inc. Every workday, perfectly aligned.
          </p>

          <div className="flex items-center gap-6 text-xs text-slate-600 font-medium">
            <a href="#features" className="hover:text-indigo-600">
              Features
            </a>
            <a href="#roles" className="hover:text-indigo-600">
              Role Portals
            </a>
            <Link to="/login" className="hover:text-indigo-600">
              Sign In
            </Link>
            <Link to="/signup" className="hover:text-indigo-600">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
