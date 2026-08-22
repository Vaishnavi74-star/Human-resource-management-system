import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { useDisclosure } from '../../hooks/useDisclosure';
import { Logo } from '../../assets/Logo';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { validateEmail } from '../../utils/validators';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  User,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Activity,
  Cpu,
  Fingerprint,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { success, error: toastError } = useToast();

  const forgotPasswordModal = useDisclosure();
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Validation & Loading Errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fromPath = (location.state as { from?: { pathname?: string } })?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setEmailError('');
    setPasswordError('');

    let hasError = false;
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setEmailError('Email is required.');
      hasError = true;
    } else if (!validateEmail(cleanEmail)) {
      setEmailError('Please enter a valid work email address.');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Password is required.');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      const res = await login({
        email: cleanEmail,
        password,
        rememberMe,
      });

      success(
        `Welcome back, ${res.user.name.split(' ')[0]}!`,
        `Authenticated as ${res.user.role.toUpperCase()} with high-security clearance.`
      );

      if (fromPath && !fromPath.includes('/login') && !fromPath.includes('/signup')) {
        navigate(fromPath, { replace: true });
      } else if (res.user.role === 'admin' || res.user.role === 'hr') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/employee/dashboard', { replace: true });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials. Please try again.';
      setFormError(message);
      toastError('Authentication Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (type: 'employee' | 'hr') => {
    setFormError('');
    setEmailError('');
    setPasswordError('');

    if (type === 'employee') {
      setEmail('employee@dayflow.com');
      setPassword('Employee@123');
    } else {
      setEmail('hr@dayflow.com');
      setPassword('HR@123456');
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || !validateEmail(resetEmail)) {
      toastError('Invalid Email', 'Please enter a valid registered email address.');
      return;
    }

    setResetLoading(true);
    setTimeout(() => {
      setResetLoading(false);
      setResetSent(true);
      success('Reset Link Dispatched', `Password instructions sent to ${resetEmail}.`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#080c18] text-slate-100 flex relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Cyber Grid & 3D Ambient Glowing Flares */}
      <div className="absolute inset-0 bg-cyber-grid-dark opacity-35 pointer-events-none" />
      <div className="absolute -top-40 right-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-40 w-[450px] h-[450px] bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full min-h-screen items-center justify-center p-4 sm:p-6 lg:p-12 gap-8 lg:gap-16">
        
        {/* LEFT COLUMN: 3D Holographic Showcase & Floating Telemetry (Desktop) */}
        <div className="flex-1 w-full max-w-xl hidden lg:flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Dayflow Workspace OS &bull; Quantum Security</span>
            </div>
            
            <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif] leading-tight">
              Sign In to Your <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-indigo-300 to-purple-400">
                Workforce Command
              </span>
            </h1>
            
            <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
              Next-generation personnel orchestration, biometric time tracking, automated payroll ledger, and AI leave analytics in one unified portal.
            </p>
          </div>

          {/* 3D Perspective Hero Card with Holographic Badges */}
          <div className="relative perspective-1000">
            <div className="tilt-3d relative rounded-3xl overflow-hidden border border-indigo-500/30 bg-slate-900/80 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] group">
              <img
                src="/assets/hero_3d_mockup.jpg"
                alt="3D Dayflow Command Center"
                className="w-full h-72 object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#080c18] via-slate-950/40 to-transparent" />

              {/* Floating Hologram 1: Biometric Verification */}
              <div className="absolute top-4 left-4 p-3 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2.5 animate-float">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Biometric Auth</p>
                  <p className="text-xs font-bold text-white">Live Verified</p>
                </div>
              </div>

              {/* Floating Hologram 2: Quantum Payroll Core */}
              <div className="absolute bottom-4 right-4 p-3 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center gap-2.5 animate-float-reverse">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">Ledger Status</p>
                  <p className="text-xs font-bold text-white">Zero Error Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-indigo-500/20 text-center">
              <p className="text-xl font-mono font-black text-cyan-400">99.98%</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono mt-0.5">Uptime SLA</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-indigo-500/20 text-center">
              <p className="text-xl font-mono font-black text-emerald-400">&lt; 0.1s</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono mt-0.5">Sync Latency</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-indigo-500/20 text-center">
              <p className="text-xl font-mono font-black text-purple-400">AES-256</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono mt-0.5">Encryption</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Glassmorphic Auth Portal */}
        <div className="w-full max-w-md">
          {/* Mobile Brand Header */}
          <div className="text-center mb-6 lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
              <Logo size="lg" showTagline={false} />
              <div>
                <span className="text-xl font-black tracking-wider text-white font-['Plus_Jakarta_Sans',sans-serif]">DAYFLOW</span>
                <span className="text-[10px] block font-mono text-cyan-400 tracking-widest uppercase">WORKSPACE OS</span>
              </div>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Sign in to your workplace
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Or{' '}
              <Link to="/signup" className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline">
                create a new Dayflow account &rarr;
              </Link>
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-slate-900/90 backdrop-blur-2xl py-8 px-6 sm:px-8 rounded-3xl border border-indigo-500/30 shadow-[0_15px_50px_rgba(0,0,0,0.6)]">
            {/* Form Error Alert */}
            {formError && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-3 text-rose-300 text-xs animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-rose-200">Sign In Failed</p>
                  <p className="mt-0.5">{formError}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="alex@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    autoComplete="email"
                    disabled={isLoading}
                    className="w-full bg-slate-950/80 border border-indigo-500/30 text-xs text-white placeholder:text-slate-500 rounded-xl pl-10 pr-4 py-2.5 transition-all focus:bg-slate-950 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 focus:shadow-[0_0_20px_rgba(6,182,212,0.25)]"
                  />
                </div>
                {emailError && <p className="text-[11px] text-rose-400 mt-1">{emailError}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="w-full bg-slate-950/80 border border-indigo-500/30 text-xs text-white placeholder:text-slate-500 rounded-xl pl-10 pr-10 py-2.5 transition-all focus:bg-slate-950 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 focus:shadow-[0_0_20px_rgba(6,182,212,0.25)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2 p-1"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordError && <p className="text-[11px] text-rose-400 mt-1">{passwordError}</p>}
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-cyan-400"
                    disabled={isLoading}
                  />
                  <span className="text-xs text-slate-400 font-medium">Remember for 30 days</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email || '');
                    setResetSent(false);
                    forgotPasswordModal.open();
                  }}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full shadow-lg shadow-indigo-500/30"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {isLoading ? 'Authenticating...' : 'Sign In to Workspace'}
                </Button>
              </div>
            </form>

            {/* Demo Account Quick Switcher Box */}
            <div className="mt-6 pt-6 border-t border-indigo-500/20">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Instant Demo Credentials</span>
                </p>
                <span className="text-[10px] text-cyan-400 font-mono">Click to fill</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleFillDemo('employee')}
                  className="flex items-center gap-2.5 p-3 rounded-2xl border border-indigo-500/20 bg-slate-950/60 hover:bg-slate-800/80 hover:border-cyan-400 text-left transition-all group cursor-pointer glitter-hover"
                >
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white group-hover:text-cyan-400 truncate">Employee</p>
                    <p className="text-[10px] text-slate-400 truncate font-mono">employee@dayflow.com</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleFillDemo('hr')}
                  className="flex items-center gap-2.5 p-3 rounded-2xl border border-indigo-500/20 bg-slate-950/60 hover:bg-slate-800/80 hover:border-emerald-400 text-left transition-all group cursor-pointer glitter-hover"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white group-hover:text-emerald-400 truncate">HR / Admin</p>
                    <p className="text-[10px] text-slate-400 truncate font-mono">hr@dayflow.com</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Footer info */}
          <div className="flex items-center justify-center gap-2 text-center text-[11px] text-slate-500 mt-6 font-mono">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>DAYFLOW Secure Gateway &bull; AES-256 Cloud Sync</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotPasswordModal.isOpen}
        onClose={forgotPasswordModal.close}
        title="Reset your password"
        description="Enter your registered work email to receive password reset instructions."
        footer={
          resetSent ? (
            <Button variant="primary" size="sm" onClick={forgotPasswordModal.close}>
              Done
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={forgotPasswordModal.close}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleForgotPasswordSubmit}
                isLoading={resetLoading}
              >
                Send Instructions
              </Button>
            </>
          )
        }
      >
        {resetSent ? (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Check your inbox</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              We have sent an email to <strong>{resetEmail}</strong> with a secure link to reset your
              DAYFLOW access credentials.
            </p>
          </div>
        ) : (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <Input
              label="Registered Work Email"
              type="email"
              placeholder="alex@company.com"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              autoFocus
            />
          </form>
        )}
      </Modal>
    </div>
  );
};
