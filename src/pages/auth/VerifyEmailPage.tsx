import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { Logo } from '../../assets/Logo';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authService } from '../../services/authService';
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const { success, error: toastError, info } = useToast();

  const queryEmail = searchParams.get('email') || '';
  const [email, setEmail] = useState(queryEmail);
  const [code, setCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(45);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim()) {
      setFormError('Email address is required.');
      return;
    }

    if (code.trim().length !== 6) {
      setFormError('Please enter the 6-digit verification code.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await verifyEmail({
        email: email.trim(),
        code: code.trim(),
      });

      setIsVerified(true);
      success(
        'Email Verified Successfully!',
        `Welcome to Dayflow, ${res.user.name}. Your workspace account is activated.`
      );

      // Auto redirect after 1.5s
      setTimeout(() => {
        if (res.user.role === 'admin' || res.user.role === 'hr') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/employee/dashboard', { replace: true });
        }
      }, 1200);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Verification failed. Invalid or expired code.';
      setFormError(message);
      toastError('Verification Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await authService.resendVerificationCode(email);
      setResendCooldown(45);
      info('Code Dispatched', `A new 6-digit security code was dispatched to ${email}. Demo code: 123456`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to resend code';
      toastError('Resend Error', msg);
    }
  };

  const handleAutofillDemoCode = () => {
    setCode('123456');
    setFormError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <Logo size="lg" showTagline={true} />
        </div>

        <h2 className="text-center text-2xl font-black tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
          Verify your email address
        </h2>
        <p className="mt-1.5 text-center text-xs text-slate-500">
          Enter the 6-digit verification code sent to your company inbox
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200/80">
          {isVerified ? (
            <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Verification Complete!</h3>
                <p className="text-xs text-slate-500 mt-1">Redirecting you to your workplace dashboard...</p>
              </div>
            </div>
          ) : (
            <>
              {formError && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-xs animate-in fade-in duration-200">
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-rose-900">Verification Failed</p>
                    <p className="mt-0.5">{formError}</p>
                  </div>
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <Input
                  label="Registered Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                  placeholder="name@company.com"
                  disabled={isLoading}
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 tracking-wide">
                    6-Digit Security Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full text-center tracking-[0.5em] font-mono text-2xl font-bold py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    disabled={isLoading}
                    autoFocus
                  />
                </div>

                {/* Auto-fill demo code helper pill */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleAutofillDemoCode}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-fill Demo Code (123456)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || isLoading}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}</span>
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
                  {isLoading ? 'Validating Code...' : 'Verify & Enter Workplace'}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5"
                >
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>DAYFLOW Two-Factor Verification Guard</span>
        </div>
      </div>
    </div>
  );
};
