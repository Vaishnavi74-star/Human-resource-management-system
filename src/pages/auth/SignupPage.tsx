import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { Logo } from '../../assets/Logo';
import { Button } from '../../components/ui/Button';
import { validateEmail, validatePassword, validateEmployeeId } from '../../utils/validators';
import type { UserRole } from '../../utils/constants';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Shield,
  Check,
  X,
  AlertCircle,
  IdCard,
  Sparkles,
  Fingerprint,
  Activity,
  Layers,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { success, error: toastError } = useToast();

  // Form State
  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('employee');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passValidation = validatePassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required (e.g. DF-2041).';
    } else if (!validateEmployeeId(employeeId)) {
      newErrors.employeeId = 'Employee ID must be at least 3 characters.';
    }

    if (!email.trim()) {
      newErrors.email = 'Work email is required.';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid work email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (!passValidation.isValid) {
      newErrors.password = 'Password does not meet the security requirements.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!termsAccepted) {
      newErrors.terms = 'You must accept the terms and workplace data privacy policy.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await signup({
        employeeId,
        name,
        email,
        password,
        confirmPassword,
        role,
        termsAccepted,
      });

      success(
        'Account Registered!',
        `Verification code sent to ${res.user.email}. Demo code: ${res.verificationCode}`
      );

      navigate(`/verify-email?email=${encodeURIComponent(res.user.email)}`, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setFormError(message);
      toastError('Registration Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c18] text-slate-100 flex relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Cyber Grid & Radiant Ambient Glowing Flares */}
      <div className="absolute inset-0 bg-cyber-grid-dark opacity-35 pointer-events-none" />
      <div className="absolute -top-40 right-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-40 w-[450px] h-[450px] bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full min-h-screen items-center justify-center p-4 sm:p-6 lg:p-12 gap-8 lg:gap-16">
        
        {/* LEFT COLUMN: 3D Holographic AI Telemetry Showcase (Desktop) */}
        <div className="flex-1 w-full max-w-xl hidden lg:flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Instant Onboarding &bull; Neural ID Provisioning</span>
            </div>
            
            <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif] leading-tight">
              Create Your Digital <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-indigo-300 to-purple-400">
                Workplace Identity
              </span>
            </h1>
            
            <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
              Get an instant AI-powered employee profile, auto-calculated leave balances, dynamic attendance engine, and real-time ledger access.
            </p>
          </div>

          {/* 3D Perspective Hero Card with Holographic Badges */}
          <div className="relative perspective-1000">
            <div className="tilt-3d relative rounded-3xl overflow-hidden border border-indigo-500/30 bg-slate-900/80 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] group">
              <img
                src="/assets/ai_id_features.jpg"
                alt="3D Identity Telemetry"
                className="w-full h-72 object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#080c18] via-slate-950/40 to-transparent" />

              {/* Floating Hologram 1: Auto Leave Quota */}
              <div className="absolute top-4 left-4 p-3 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center gap-2.5 animate-float">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold">Quota Allocation</p>
                  <p className="text-xs font-bold text-white">18 Days Paid / 12 Sick</p>
                </div>
              </div>

              {/* Floating Hologram 2: Biometric Punch Core */}
              <div className="absolute bottom-4 right-4 p-3 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2.5 animate-float-reverse">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Punch Sync</p>
                  <p className="text-xs font-bold text-white">Live Stopwatch Ready</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Security Pillars */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-indigo-500/20 text-center">
              <p className="text-xl font-mono font-black text-cyan-400">SOC-2</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono mt-0.5">Compliant</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-indigo-500/20 text-center">
              <p className="text-xl font-mono font-black text-emerald-400">PostgreSQL</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono mt-0.5">Live Sync</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-indigo-500/20 text-center">
              <p className="text-xl font-mono font-black text-purple-400">Zero-Trust</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono mt-0.5">Architecture</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Glassmorphic Signup Form Portal */}
        <div className="w-full max-w-lg">
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
              Create your account
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline">
                Sign in to your workspace &rarr;
              </Link>
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-slate-900/90 backdrop-blur-2xl py-7 px-6 sm:px-8 rounded-3xl border border-indigo-500/30 shadow-[0_15px_50px_rgba(0,0,0,0.6)]">
            {formError && (
              <div className="mb-5 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-3 text-rose-300 text-xs animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-rose-200">Registration Failed</p>
                  <p className="mt-0.5">{formError}</p>
                </div>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              {/* Role Selection Tabs */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Workplace Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('employee')}
                    className={cn(
                      'p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer glitter-hover',
                      role === 'employee'
                        ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                        : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-slate-700'
                    )}
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border',
                        role === 'employee' ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold' : 'bg-slate-800 text-slate-400 border-slate-700'
                      )}
                    >
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Employee</p>
                      <p className="text-[10px] text-slate-400">Self-service & leaves</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={cn(
                      'p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer glitter-hover',
                      role === 'admin'
                        ? 'border-indigo-400 bg-indigo-950/40 shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                        : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-slate-700'
                    )}
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border',
                        role === 'admin' ? 'bg-indigo-600 text-white border-indigo-400 font-bold' : 'bg-slate-800 text-slate-400 border-slate-700'
                      )}
                    >
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">HR / Admin</p>
                      <p className="text-[10px] text-slate-400">Workforce & payroll</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Name & Employee ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Legal Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. Jordan Miller"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                      }}
                      disabled={isLoading}
                      className="w-full bg-slate-950/80 border border-indigo-500/30 text-xs text-white placeholder:text-slate-500 rounded-xl pl-10 pr-3.5 py-2.5 transition-all focus:bg-slate-950 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                  {errors.name && <p className="text-[10px] text-rose-400 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Employee ID</label>
                  <div className="relative">
                    <IdCard className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="DF-4089"
                      value={employeeId}
                      onChange={(e) => {
                        setEmployeeId(e.target.value);
                        if (errors.employeeId) setErrors((prev) => ({ ...prev, employeeId: '' }));
                      }}
                      disabled={isLoading}
                      className="w-full bg-slate-950/80 border border-indigo-500/30 text-xs text-white placeholder:text-slate-500 rounded-xl pl-10 pr-3.5 py-2.5 uppercase font-mono transition-all focus:bg-slate-950 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                  {errors.employeeId && <p className="text-[10px] text-rose-400 mt-1">{errors.employeeId}</p>}
                </div>
              </div>

              {/* Work Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="jordan@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    autoComplete="email"
                    disabled={isLoading}
                    className="w-full bg-slate-950/80 border border-indigo-500/30 text-xs text-white placeholder:text-slate-500 rounded-xl pl-10 pr-3.5 py-2.5 transition-all focus:bg-slate-950 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>
                {errors.email && <p className="text-[10px] text-rose-400 mt-1">{errors.email}</p>}
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                      }}
                      autoComplete="new-password"
                      disabled={isLoading}
                      className="w-full bg-slate-950/80 border border-indigo-500/30 text-xs text-white placeholder:text-slate-500 rounded-xl pl-10 pr-10 py-2.5 transition-all focus:bg-slate-950 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2 p-1"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[10px] text-rose-400 mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                      }}
                      autoComplete="new-password"
                      disabled={isLoading}
                      className="w-full bg-slate-950/80 border border-indigo-500/30 text-xs text-white placeholder:text-slate-500 rounded-xl pl-10 pr-10 py-2.5 transition-all focus:bg-slate-950 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2 p-1"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-[10px] text-rose-400 mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Password Requirement Indicators */}
              {password && (
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-indigo-500/20 text-[10px] space-y-1 font-mono">
                  <p className="text-slate-400 font-bold mb-1">Password Strength Checklist:</p>
                  <div className="grid grid-cols-2 gap-1">
                    <span className={cn('flex items-center gap-1', passValidation.hasMinLength ? 'text-emerald-400' : 'text-slate-500')}>
                      {passValidation.hasMinLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} 8+ characters
                    </span>
                    <span className={cn('flex items-center gap-1', passValidation.hasUppercase ? 'text-emerald-400' : 'text-slate-500')}>
                      {passValidation.hasUppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Uppercase letter
                    </span>
                    <span className={cn('flex items-center gap-1', passValidation.hasNumber ? 'text-emerald-400' : 'text-slate-500')}>
                      {passValidation.hasNumber ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Number digit
                    </span>
                    <span className={cn('flex items-center gap-1', passValidation.hasSpecialChar ? 'text-emerald-400' : 'text-slate-500')}>
                      {passValidation.hasSpecialChar ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Special character
                    </span>
                  </div>
                </div>
              )}

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => {
                      setTermsAccepted(e.target.checked);
                      if (errors.terms) setErrors((prev) => ({ ...prev, terms: '' }));
                    }}
                    className="w-4 h-4 mt-0.5 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-cyan-400"
                    disabled={isLoading}
                  />
                  <span className="text-xs text-slate-400 leading-relaxed">
                    I agree to the{' '}
                    <span className="text-cyan-400 hover:underline">DAYFLOW Terms of Service</span> and{' '}
                    <span className="text-cyan-400 hover:underline">Workplace Privacy Charter</span>.
                  </span>
                </label>
                {errors.terms && <p className="text-[10px] text-rose-400 mt-1">{errors.terms}</p>}
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
                  {isLoading ? 'Creating Account...' : 'Complete Registration'}
                </Button>
              </div>
            </form>
          </div>

          {/* Footer info */}
          <div className="flex items-center justify-center gap-2 text-center text-[11px] text-slate-500 mt-6 font-mono">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>DAYFLOW Identity Authority &bull; PostgreSQL & Supabase Cloud Sync</span>
          </div>
        </div>
      </div>
    </div>
  );
};
