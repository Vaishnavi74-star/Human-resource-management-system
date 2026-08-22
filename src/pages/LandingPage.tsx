import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from '../assets/Logo';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Sparkles,
  ArrowRight,
  Clock,
  CalendarCheck,
  CreditCard,
  Lock,
  ChevronRight,
  Play,
  ShieldCheck,
  Cpu,
  Fingerprint,
  Zap,
  Activity,
  Award,
  Globe,
  Flame,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const [activeTab, setActiveTab] = useState<'employee' | 'admin'>('employee');
  const [activeFeatureTab, setActiveFeatureTab] = useState<number>(0);

  const handleEnterWorkspace = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (role === 'admin' || role === 'hr') {
      navigate('/admin/dashboard');
    } else {
      navigate('/employee/dashboard');
    }
  };

  const featureTabs = [
    {
      title: 'Neural Biometric Clock',
      desc: 'Real-time AI biometric punch verification with live millisecond duration tracking and automated timesheet reconciliation.',
      icon: Fingerprint,
      stat: '99.98% Accuracy',
    },
    {
      title: 'Autonomous Leave Engine',
      desc: 'Predictive leave approval queues with smart Mon–Fri holiday calculation, quota sync, and instant team calendar distribution.',
      icon: CalendarCheck,
      stat: '< 2s Processing',
    },
    {
      title: 'Real-Time Payroll Ledger',
      desc: 'Automated gross-to-net calculation, tax withholdings, dynamic allowances, and one-click PDF payslip dispatch.',
      icon: CreditCard,
      stat: '100% Automated',
    },
    {
      title: 'Zero-Trust Personnel Dossier',
      desc: 'Cryptographically protected employee directory with 7-tab compliance records and granular role-based access control.',
      icon: ShieldCheck,
      stat: 'Supabase RLS Protected',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Dynamic Background Ambient Light Grids */}
      <div className="absolute inset-0 bg-cyber-grid-dark opacity-30 pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-linear-to-b from-indigo-600/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 -right-48 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Futuristic Glassmorphic Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#070913]/80 backdrop-blur-xl border-b border-indigo-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Logo size="md" showTagline={false} />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-base font-black tracking-wider text-white font-['Plus_Jakarta_Sans',sans-serif]">DAYFLOW</span>
              <span className="text-[10px] block font-mono text-cyan-400 tracking-widest uppercase">Autonomous HRMS</span>
            </div>
          </Link>

          {/* Futuristic Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Core Modules</span>
            </a>
            <a href="#preview" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Engine</span>
            </a>
            <a href="#roles" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-purple-400" />
              <span>Role Portals</span>
            </a>
            <a href="#demo" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant Sandbox</span>
            </a>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleEnterWorkspace}
                className="bg-linear-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 border-none shadow-lg shadow-cyan-500/20 text-white font-bold"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Go to Workspace
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-linear-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 border-none shadow-lg shadow-indigo-500/30 text-white font-bold"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Launch Platform
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Ultra-Futuristic Hero Section */}
      <section className="relative pt-20 pb-20 lg:pt-28 lg:pb-36 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Holographic Glowing Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel-dark border border-indigo-500/40 text-xs font-semibold text-cyan-300 mb-8 shadow-xl shadow-indigo-950/50 animate-float">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="font-mono tracking-wide">Next-Gen Autonomous HR & Workforce Operating System</span>
          </div>

          {/* Main Hero Headline with Neon Glow */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif] max-w-5xl mx-auto leading-[1.08]">
            Every workday, <br />
            <span className="bg-linear-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(99,102,241,0.5)]">
              hyper-aligned.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-8 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            DAYFLOW merges neural biometric attendance, automated leave orchestration, real-time payroll ledger,
            and role-governed enterprise employee intelligence in a hyper-modern SaaS environment.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            <Link to="/signup">
              <button className="relative group overflow-hidden rounded-2xl p-px font-bold text-white shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer">
                <span className="absolute inset-0 bg-linear-to-r from-cyan-500 via-indigo-500 to-purple-600 animate-shimmer" />
                <span className="relative flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-slate-950/90 text-sm md:text-base font-extrabold tracking-wide transition-colors group-hover:bg-slate-950/70">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </Link>

            <Link to="/login">
              <button className="flex items-center gap-2.5 px-7 py-4 rounded-2xl glass-panel-dark border border-slate-700 hover:border-cyan-500/50 text-slate-200 hover:text-white text-sm md:text-base font-bold transition-all hover:bg-white/5 cursor-pointer shadow-lg">
                <Play className="w-4 h-4 text-cyan-400" />
                <span>Explore Live Demo</span>
              </button>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Supabase PostgreSQL + RLS Protected</span>
            </span>
            <span className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Biometric Timestamp Encryption</span>
            </span>
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Multi-Tenant Enterprise Architecture</span>
            </span>
          </div>

          {/* 3D Floating Holographic Perspective Mockup */}
          <div className="mt-16 sm:mt-24 relative perspective-1000">
            <div className="relative mx-auto max-w-6xl rounded-3xl p-3 sm:p-4 glass-panel-dark border border-indigo-500/30 shadow-[0_0_80px_-15px_rgba(99,102,241,0.35)] tilt-3d">
              {/* Outer Glowing Frame Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 text-xs font-mono text-slate-400 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 text-slate-300 font-semibold">DAYFLOW OS &bull; Live Telemetry Feed</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-400">
                  <span className="animate-pulse w-2 h-2 rounded-full bg-cyan-400" />
                  <span>SYSTEM ONLINE</span>
                </div>
              </div>

              {/* 3D Visual Rendering */}
              <div className="relative overflow-hidden rounded-2xl aspect-16/9 bg-slate-950">
                <img
                  src="/assets/hero_3d_mockup.jpg"
                  alt="DAYFLOW 3D Futuristic Command Interface"
                  className="w-full h-full object-cover rounded-2xl"
                />

                {/* Floating Hologram Micro-Card 1: Biometric Clock */}
                <div className="absolute top-6 left-6 p-4 rounded-2xl glass-panel-dark border border-cyan-500/40 shadow-2xl backdrop-blur-xl animate-float hidden md:block text-left">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-cyan-400" />
                    <span className="text-[11px] font-mono uppercase font-bold text-cyan-300">Biometric Punch Verified</span>
                  </div>
                  <p className="text-lg font-black font-mono text-white mt-1">09:02:14 AM</p>
                  <p className="text-[10px] text-slate-400">Live duration: 07h 42m &bull; Present</p>
                </div>

                {/* Floating Hologram Micro-Card 2: Payroll Engine */}
                <div className="absolute bottom-6 right-6 p-4 rounded-2xl glass-panel-dark border border-purple-500/40 shadow-2xl backdrop-blur-xl animate-float-reverse hidden md:block text-left">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-400" />
                    <span className="text-[11px] font-mono uppercase font-bold text-purple-300">August Payroll Ledger</span>
                  </div>
                  <p className="text-xl font-black font-mono text-emerald-400 mt-1">$428,500.00</p>
                  <p className="text-[10px] text-slate-400">105 active disbursements scheduled</p>
                </div>
              </div>
            </div>

            {/* Glowing background spotlight under mockup */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-28 bg-indigo-600/30 blur-3xl pointer-events-none rounded-full" />
          </div>
        </div>
      </section>

      {/* 3. Live Neural Engine Showcase */}
      <section id="preview" className="py-24 relative bg-slate-950/60 border-y border-indigo-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="purple" size="sm" dot>
              AI Telemetry & Architecture
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4 font-['Plus_Jakarta_Sans',sans-serif]">
              Engineered for absolute workforce clarity
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3">
              Explore how DAYFLOW powers high-trust enterprises with autonomous workflows, biometric precision, and automated compliance.
            </p>
          </div>

          {/* Interactive Feature Matrix with 3D Graphic */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Interactive Tab Controls */}
            <div className="lg:col-span-5 space-y-4">
              {featureTabs.map((f, i) => {
                const Icon = f.icon;
                const isActive = activeFeatureTab === i;
                return (
                  <div
                    key={i}
                    onClick={() => setActiveFeatureTab(i)}
                    className={`p-5 rounded-2xl transition-all cursor-pointer border ${
                      isActive
                        ? 'glass-panel-dark border-cyan-500/50 shadow-xl shadow-cyan-950/30 translate-x-2'
                        : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                            {f.title}
                          </h3>
                          <span className="text-[11px] font-mono text-cyan-400 font-bold">{f.stat}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: AI Hologram Graphic Preview */}
            <div className="lg:col-span-7 relative">
              <div className="relative rounded-3xl overflow-hidden glass-panel-dark border border-cyan-500/30 p-2 shadow-2xl">
                <img
                  src="/assets/ai_id_features.jpg"
                  alt="AI Biometric Workforce Hologram"
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl glass-panel-dark border border-white/10 backdrop-blur-xl flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-cyan-300">
                    <Fingerprint className="w-4 h-4 text-cyan-400" />
                    <span>NEURAL BIOMETRIC IDENTITY PROTOCOL</span>
                  </div>
                  <span className="text-emerald-400 font-bold">100% ENCRYPTED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Role Portals Comparison */}
      <section id="roles" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="primary" size="sm">
              Role-Based Experience
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4 font-['Plus_Jakarta_Sans',sans-serif]">
              Two specialized portals. One synchronized core.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3">
              Switch between the Employee Self-Service portal and the HR & Executive Command Center.
            </p>

            {/* Switcher Pill */}
            <div className="inline-flex p-1.5 glass-panel-dark rounded-2xl border border-indigo-500/30 mt-8">
              <button
                type="button"
                onClick={() => setActiveTab('employee')}
                className={`px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === 'employee'
                    ? 'bg-linear-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Employee Self-Service Portal
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className={`px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-linear-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                HR & Admin Command Console
              </button>
            </div>
          </div>

          {/* Interactive Screen Mockup Card */}
          <div className="relative rounded-3xl glass-panel-dark border border-indigo-500/30 p-6 sm:p-10 shadow-2xl">
            {activeTab === 'employee' ? (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Employee Banner */}
                <div className="rounded-2xl bg-linear-to-r from-indigo-950 via-indigo-900 to-slate-900 border border-indigo-500/30 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30">
                      Employee View &bull; Alex Morgan (DF-4089)
                    </span>
                    <h3 className="text-2xl font-black text-white mt-2">Good morning, Alex 👋</h3>
                    <p className="text-xs text-slate-300">Senior Software Engineer &bull; Product Engineering</p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-linear-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 border-none font-bold text-white shadow-md shadow-cyan-500/20"
                  >
                    Request Time Off
                  </Button>
                </div>

                {/* Employee Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400">Live Attendance</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                        &bull; Active Duty
                      </span>
                    </div>
                    <p className="text-3xl font-black font-mono text-cyan-400 mt-3">04h 28m 15s</p>
                    <p className="text-xs text-slate-400 mt-1">Clocked in at 09:02 AM</p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl">
                    <span className="text-xs font-semibold text-slate-400">Vacation Leave Balance</span>
                    <p className="text-3xl font-black font-mono text-indigo-400 mt-3">12 Days</p>
                    <p className="text-xs text-emerald-400 font-medium mt-1">+1.5 days accrued this cycle</p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl">
                    <span className="text-xs font-semibold text-slate-400">Latest Net Payslip</span>
                    <p className="text-3xl font-black font-mono text-purple-400 mt-3">$6,450.00</p>
                    <p className="text-xs text-slate-400 mt-1">Disbursed on Jul 31, 2026</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* HR Banner */}
                <div className="rounded-2xl bg-linear-to-r from-purple-950 via-indigo-950 to-slate-900 border border-purple-500/30 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-purple-400 bg-purple-950/80 px-2.5 py-1 rounded-full border border-purple-500/30">
                      HR & Executive Console &bull; Eleanor Vance (DF-1001)
                    </span>
                    <h3 className="text-2xl font-black text-white mt-2">Workforce Operations Command</h3>
                    <p className="text-xs text-slate-300">105 Active Team Members across 5 Departments</p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border-none font-bold text-white shadow-md shadow-purple-500/20"
                  >
                    Onboard New Staff
                  </Button>
                </div>

                {/* HR Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl">
                    <span className="text-xs font-semibold text-slate-400">Total Workforce</span>
                    <p className="text-3xl font-black font-mono text-white mt-2">105</p>
                    <p className="text-xs text-emerald-400 mt-1">+8 new hires this month</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl">
                    <span className="text-xs font-semibold text-slate-400">Attendance Rate</span>
                    <p className="text-3xl font-black font-mono text-cyan-400 mt-2">97.8%</p>
                    <p className="text-xs text-slate-400 mt-1">92 present today</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl">
                    <span className="text-xs font-semibold text-slate-400">Pending Approvals</span>
                    <p className="text-3xl font-black font-mono text-amber-400 mt-2">3 Leaves</p>
                    <p className="text-xs text-amber-400 mt-1">Review required</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl">
                    <span className="text-xs font-semibold text-slate-400">Monthly Payroll</span>
                    <p className="text-3xl font-black font-mono text-emerald-400 mt-2">$428.5k</p>
                    <p className="text-xs text-slate-400 mt-1">Cycle closes in 4 days</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Core Feature Grid (Bento Style) */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="primary" size="sm">
            Platform Capabilities
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4 font-['Plus_Jakarta_Sans',sans-serif]">
            Everything needed to power high-growth teams
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3">
            Constructed with rigorous TypeScript architecture, biometric accuracy, and resilient database synchronization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Bento 1 */}
          <div className="p-8 rounded-3xl glass-panel-dark border border-slate-800 hover:border-indigo-500/50 transition-all hover:-translate-y-1 shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Fingerprint className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Biometric Time & Attendance</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Live clock in/out tracking with active stopwatch ticker, 5-day weekly timesheets, and instant status synchronizations.
            </p>
          </div>

          {/* Bento 2 */}
          <div className="p-8 rounded-3xl glass-panel-dark border border-slate-800 hover:border-cyan-500/50 transition-all hover:-translate-y-1 shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Interactive Leave Calendar</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Full Month (7x5 matrix) & Week (7-day timeline) views with department, employee, and status filtering with detail inspection modals.
            </p>
          </div>

          {/* Bento 3 */}
          <div className="p-8 rounded-3xl glass-panel-dark border border-slate-800 hover:border-purple-500/50 transition-all hover:-translate-y-1 shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Payroll & Compensation</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Automated gross-to-net calculation, tax withholdings, dynamic benefits, and high-fidelity printable payslips.
            </p>
          </div>

          {/* Bento 4 */}
          <div className="p-8 rounded-3xl glass-panel-dark border border-slate-800 hover:border-emerald-500/50 transition-all hover:-translate-y-1 shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Leave Approvals Console</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Smart approvals queue with automatic quota deduction, mandatory rejection commentary, and instant employee notifications.
            </p>
          </div>

          {/* Bento 5 */}
          <div className="p-8 rounded-3xl glass-panel-dark border border-slate-800 hover:border-amber-500/50 transition-all hover:-translate-y-1 shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Strict Role Guarding (RBAC)</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Role-protected routes, permission-guarded profile editing, session caching, and two-factor email verification guards.
            </p>
          </div>

          {/* Bento 6 */}
          <div className="p-8 rounded-3xl glass-panel-dark border border-slate-800 hover:border-rose-500/50 transition-all hover:-translate-y-1 shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Supabase PostgreSQL Backend</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Live Supabase Authentication, PostgreSQL table schemas, automated triggers, and Row Level Security policies.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Instant Sandbox Test Accounts */}
      <section id="demo" className="py-20 relative bg-linear-to-b from-indigo-950/70 to-[#070913] border-t border-indigo-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="purple" size="sm">
            Instant Demo Sandbox
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4 font-['Plus_Jakarta_Sans',sans-serif]">
            Launch immediately with pre-loaded credentials
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mt-3">
            Experience both portals instantly without any setup or credit card required:
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
            {/* Employee Card */}
            <div className="p-6 rounded-3xl glass-panel-dark border border-cyan-500/30 shadow-2xl hover:border-cyan-400 transition-all group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-500/30">
                  Employee Persona
                </span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <p className="text-lg font-black text-white mt-3">Alex Morgan</p>
              <div className="mt-3 p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 font-mono text-xs text-slate-300">
                <p><span className="text-slate-500">email:</span> employee@dayflow.com</p>
                <p><span className="text-slate-500">password:</span> Employee@123</p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 mt-5 transition-transform group-hover:translate-x-1"
              >
                <span>Sign In as Employee</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* HR Card */}
            <div className="p-6 rounded-3xl glass-panel-dark border border-purple-500/30 shadow-2xl hover:border-purple-400 transition-all group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-purple-400 bg-purple-950 px-2.5 py-1 rounded-full border border-purple-500/30">
                  HR & Admin Persona
                </span>
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              </div>
              <p className="text-lg font-black text-white mt-3">Eleanor Vance</p>
              <div className="mt-3 p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 font-mono text-xs text-slate-300">
                <p><span className="text-slate-500">email:</span> hr@dayflow.com</p>
                <p><span className="text-slate-500">password:</span> HR@123456</p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-purple-300 mt-5 transition-transform group-hover:translate-x-1"
              >
                <span>Sign In as HR / Admin</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Futuristic Footer */}
      <footer className="bg-[#05070e] border-t border-indigo-500/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo size="sm" showTagline={false} />
            <span className="text-xs text-slate-400 font-mono">
              &copy; {new Date().getFullYear()} DAYFLOW Technologies. Every workday, hyper-aligned.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
            <a href="#features" className="hover:text-cyan-400 transition-colors">
              Features
            </a>
            <a href="#roles" className="hover:text-cyan-400 transition-colors">
              Role Portals
            </a>
            <Link to="/login" className="hover:text-cyan-400 transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="hover:text-cyan-400 transition-colors">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
