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
        `Logged in successfully as ${res.user.role.toUpperCase()}.`
      );

      // Redirect based on role or previous attempted path
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

  // Quick autofill demo credentials helper
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex justify-center mb-6">
          <Logo size="lg" showTagline={true} />
        </div>

        <h2 className="text-center text-2xl font-black tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
          Sign in to your workplace
        </h2>
        <p className="mt-1.5 text-center text-xs text-slate-500">
          Or{' '}
          <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
            create a new Dayflow account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200/80">
          {/* Form Error Alert */}
          {formError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-xs animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-900">Sign In Failed</p>
                <p className="mt-0.5">{formError}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <Input
              label="Work Email"
              type="email"
              placeholder="alex@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              error={emailError}
              leftIcon={<Mail className="w-4 h-4" />}
              autoComplete="email"
              disabled={isLoading}
            />

            <div className="space-y-1.5">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                error={passwordError}
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  disabled={isLoading}
                />
                <span className="text-xs text-slate-600 font-medium">Remember me for 30 days</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setResetEmail(email || '');
                  setResetSent(false);
                  forgotPasswordModal.open();
                }}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-md shadow-indigo-200"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isLoading ? 'Authenticating...' : 'Sign In to Workspace'}
            </Button>
          </form>

          {/* Demo Account Quick Switcher Box */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Demo Test Accounts</span>
              </p>
              <span className="text-[10px] text-slate-400">Click to fill</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleFillDemo('employee')}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-indigo-50/60 hover:border-indigo-200 text-left transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-700 truncate">Employee</p>
                  <p className="text-[10px] text-slate-500 truncate">employee@dayflow.com</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('hr')}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-indigo-50/60 hover:border-indigo-200 text-left transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-700 truncate">HR / Admin</p>
                  <p className="text-[10px] text-slate-500 truncate">hr@dayflow.com</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-400 mt-6">
          DAYFLOW Secure Workplace Authentication &bull; AES-256 Cloud Encryption
        </p>
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
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Check your inbox</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
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
