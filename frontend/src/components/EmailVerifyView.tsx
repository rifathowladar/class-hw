import React, { useState, useEffect, useRef } from 'react';
import { AuthPage, User } from '../types';
import { authService } from '../services/authService';
import { Mail, CheckCircle2, RefreshCw, ArrowLeft, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface EmailVerifyViewProps {
  email: string;
  onNavigate: (page: AuthPage) => void;
  onVerified: (user: User) => void;
}

export const EmailVerifyView: React.FC<EmailVerifyViewProps> = ({
  email,
  onNavigate,
  onVerified,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [activeInput, setActiveInput] = useState<number>(0);
  const [timer, setTimer] = useState<number>(45);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Effective email (if entered directly without registering first, fallback to demo email)
  const displayEmail = email || authService.getPendingVerification()?.email || 'user@gmail.com';

  // Timer countdown
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Handle only single numeric digit
    const cleaned = value.replace(/[^0-9]/g, '');
    if (!cleaned) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    const digit = cleaned.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    // Auto advance focus to next input
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
      setActiveInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        setActiveInput(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveInput(index - 1);
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setActiveInput(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '');
    if (pastedData) {
      const newDigits = [...digits];
      for (let i = 0; i < 6; i++) {
        if (pastedData[i]) {
          newDigits[i] = pastedData[i];
        }
      }
      setDigits(newDigits);
      const nextFocus = Math.min(pastedData.length, 5);
      inputRefs.current[nextFocus]?.focus();
      setActiveInput(nextFocus);
    }
  };

  const handleQuickFill = () => {
    setDigits(['1', '2', '3', '4', '5', '6']);
    setError(null);
    inputRefs.current[5]?.focus();
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.resendVerificationCode(displayEmail);
      setTimer(45);
      setSuccessMsg('A new 6-digit verification code has been simulated for your email.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to resend code';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullCode = digits.join('');

    if (fullCode.length !== 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const user = await authService.verifyCode(displayEmail, fullCode);
      setSuccessMsg('Gmail verified successfully! Loading your dashboard...');
      setTimeout(() => {
        onVerified(user);
        onNavigate('todos');
      }, 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid verification code.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto py-8 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Mail className="w-7 h-7 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Verify Your Gmail
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            We sent a 6-digit confirmation code to
          </p>
          <div className="inline-flex items-center gap-1.5 mt-1.5 px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="truncate max-w-[260px]">{displayEmail}</span>
          </div>
        </div>

        {/* Realistic Gmail simulated inbox notice (per user instruction) */}
        <div className="mb-6 bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-left">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Simulated Gmail Inbox</span>
            </div>
            <span className="text-[11px] font-mono">Just now</span>
          </div>
          <p className="text-xs font-semibold text-slate-800">
            TaskFlow Security &lt;no-reply@taskflow.app&gt;
          </p>
          <p className="text-xs text-slate-600 mt-0.5">
            Subject: <span className="font-semibold text-indigo-600">123456</span> is your email verification code
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              For testing, click Quick Fill or type 123456:
            </span>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md transition-colors"
            >
              Quick Fill 123456
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 6 Digit Input Boxes */}
        <form onSubmit={handleVerify}>
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-700 text-center mb-3">
              Enter 6-Digit Verification Code
            </label>
            <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={() => setActiveInput(index)}
                  className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono rounded-xl border transition-all focus:outline-hidden ${
                    digit
                      ? 'border-indigo-600 bg-indigo-50/30 text-indigo-900 shadow-xs'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading || digits.join('').length !== 6}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Email & Open Todo App</span>
              </>
            )}
          </button>
        </form>

        {/* Resend & Timer */}
        <div className="mt-5 text-center">
          <p className="text-xs text-slate-500 mb-2">
            Didn't receive the email code?
          </p>
          {timer > 0 ? (
            <div className="text-xs text-slate-500 font-medium">
              Resend code in <span className="font-mono font-semibold text-slate-700 tabular-nums">0:{timer < 10 ? `0${timer}` : timer}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Resend Verification Code</span>
            </button>
          )}
        </div>

        {/* Footer nav */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            onClick={() => onNavigate('register')}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Change Email</span>
          </button>

          <button
            onClick={() => onNavigate('login')}
            className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};
