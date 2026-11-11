import React, { useState } from 'react';
import { AuthPage, User } from '../types';
import { authService } from '../services/authService';
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { GoogleLogo, GoogleAccountModal } from './GoogleAccountModal';

interface LoginViewProps {
  onNavigate: (page: AuthPage) => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onNavigate,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    try {
      setLoading(true);
      const user = await authService.login(email.trim(), password);
      onLoginSuccess(user);
      onNavigate('todos');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const user = await authService.loginWithDemo();
      onLoginSuccess(user);
      onNavigate('todos');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Demo login failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleDirectLogin = async (selectedName: string, selectedEmail: string) => {
    try {
      setLoading(true);
      setError(null);
      const user = await authService.loginWithGoogle(selectedEmail, selectedName);
      onLoginSuccess(user);
      onNavigate('todos');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google login failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-8 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Log in to manage your tasks and projects
          </p>
        </div>

        {/* Continue with Google */}
        <button
          type="button"
          onClick={() => setIsGoogleModalOpen(true)}
          className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 hover:border-slate-400 shadow-2xs transition-all flex items-center justify-center gap-2.5 mb-3 group"
        >
          <GoogleLogo className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
          <span>Continue with Google</span>
        </button>

        {/* Quick Demo Shortcut */}
        <div className="mb-4 p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <div className="text-xs text-amber-900">
              <span className="font-semibold">Demo Account:</span> mahdi@...
            </div>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="text-xs font-semibold text-amber-800 bg-amber-200/60 hover:bg-amber-200 px-2 py-1 rounded-md transition-colors whitespace-nowrap"
          >
            One-Click Login
          </button>
        </div>

        {/* Visual Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-slate-400 font-medium">or with email</span>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-9 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-hidden"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 focus:ring-offset-0"
              />
              <span className="text-xs text-slate-600">Remember me</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>

      {/* Google Account Modal */}
      <GoogleAccountModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={(name, selectedEmail) => {
          setEmail(selectedEmail);
        }}
        onDirectLogin={handleGoogleDirectLogin}
      />
    </div>
  );
};
