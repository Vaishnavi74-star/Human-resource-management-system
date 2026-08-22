import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { Logo } from '../../assets/Logo';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
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

      // Navigate to verification screen with prefilled email
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="flex justify-center mb-5">
          <Logo size="lg" showTagline={true} />
        </div>

        <h2 className="text-center text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
          Create your DAYFLOW account
        </h2>
        <p className="mt-1.5 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
            Sign In to your workspace
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200/80">
          {formError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-xs animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-900">Registration Failed</p>
                <p className="mt-0.5">{formError}</p>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {/* Role Selection Tabs */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-2">
                Select Your Workplace Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('employee')}
                  className={cn(
                    'p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all',
                    role === 'employee'
                      ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-xl flex items-center justify-center shrink-0',
                      role === 'employee' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                    )}
                  >
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Employee</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Self-service, leaves, timesheets</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={cn(
                    'p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all',
                    role === 'admin'
                      ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-xl flex items-center justify-center shrink-0',
                      role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                    )}
                  >
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">HR / Admin</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Workforce ops, approvals & payroll</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Name & Employee ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Legal Name"
                placeholder="e.g. Jordan Miller"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                error={errors.name}
                leftIcon={<User className="w-4 h-4" />}
                disabled={isLoading}
              />

              <Input
                label="Employee ID"
                placeholder="e.g. DF-3094"
                value={employeeId}
                onChange={(e) => {
                  setEmployeeId(e.target.value);
                  if (errors.employeeId) setErrors((prev) => ({ ...prev, employeeId: '' }));
                }}
                error={errors.employeeId}
                leftIcon={<IdCard className="w-4 h-4" />}
                disabled={isLoading}
              />
            </div>

            {/* Email */}
            <Input
              label="Work Email Address"
              type="email"
              placeholder="jordan.miller@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
              hint="Must be an active company domain address"
              disabled={isLoading}
            />

            {/* Password */}
            <div className="space-y-2">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                }}
                error={errors.password}
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                disabled={isLoading}
              />

              {/* Password Strength Checklist */}
              {password && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-600">Password Security</span>
                    <span
                      className={cn(
                        'font-bold uppercase',
                        passValidation.score >= 4
                          ? 'text-emerald-600'
                          : passValidation.score >= 3
                          ? 'text-indigo-600'
                          : passValidation.score >= 2
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      )}
                    >
                      {passValidation.score >= 4
                        ? 'Strong'
                        : passValidation.score >= 3
                        ? 'Good'
                        : passValidation.score >= 2
                        ? 'Medium'
                        : 'Weak'}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex gap-1">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-300',
                        passValidation.score >= 1 ? 'bg-indigo-600 flex-1' : 'bg-transparent'
                      )}
                    />
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-300',
                        passValidation.score >= 2 ? 'bg-indigo-600 flex-1' : 'bg-transparent'
                      )}
                    />
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-300',
                        passValidation.score >= 3 ? 'bg-indigo-600 flex-1' : 'bg-transparent'
                      )}
                    />
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-300',
                        passValidation.score >= 4 ? 'bg-emerald-600 flex-1' : 'bg-transparent'
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-[11px]">
                    <span className="flex items-center gap-1.5">
                      {passValidation.hasMinLength ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <span className={passValidation.hasMinLength ? 'text-slate-800' : 'text-slate-400'}>
                        At least 8 characters
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      {passValidation.hasUppercase && passValidation.hasLowercase ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <span
                        className={
                          passValidation.hasUppercase && passValidation.hasLowercase
                            ? 'text-slate-800'
                            : 'text-slate-400'
                        }
                      >
                        Upper & lower letters
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      {passValidation.hasNumber ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <span className={passValidation.hasNumber ? 'text-slate-800' : 'text-slate-400'}>
                        At least 1 number (0-9)
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      {passValidation.hasSpecialChar ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <span className={passValidation.hasSpecialChar ? 'text-slate-800' : 'text-slate-400'}>
                        Special symbol (!@#$)
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
              }}
              error={errors.confirmPassword}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              disabled={isLoading}
            />

            {/* Terms checkbox */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    if (errors.terms) setErrors((prev) => ({ ...prev, terms: '' }));
                  }}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                  disabled={isLoading}
                />
                <span className="text-xs text-slate-600 leading-normal">
                  I agree to the{' '}
                  <span className="font-semibold text-slate-800 underline">Dayflow Terms of Service</span>,{' '}
                  <span className="font-semibold text-slate-800 underline">Workplace Privacy Policy</span>,
                  and consent to automated email verification.
                </span>
              </label>
              {errors.terms && <p className="text-xs text-rose-600 font-medium mt-1">{errors.terms}</p>}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-md shadow-indigo-200"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isLoading ? 'Creating Account...' : 'Register & Proceed to Verification'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
