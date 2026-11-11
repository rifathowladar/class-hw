import React, { useState } from 'react';
import { X, Plus, Check, ArrowRight, UserCheck } from 'lucide-react';

interface GoogleAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (name: string, email: string) => void;
  onDirectLogin: (name: string, email: string) => void;
  modeText?: string;
}

export const GoogleLogo = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const GoogleAccountModal: React.FC<GoogleAccountModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
  onDirectLogin,
  modeText = 'Insert Gmail into Registration Form',
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customError, setCustomError] = useState('');

  if (!isOpen) return null;

  const accounts = [
    {
      name: 'Mahdi Hasan',
      email: 'mahdihasansojip@gmail.com',
      avatar: 'MH',
      color: 'bg-blue-600',
    },
    {
      name: 'Developer Demo',
      email: 'demo.developer@gmail.com',
      avatar: 'DD',
      color: 'bg-emerald-600',
    },
  ];

  const handleCustomSubmit = (direct: boolean) => {
    if (!customEmail.trim() || !customEmail.includes('@')) {
      setCustomError('Please enter a valid Gmail address.');
      return;
    }
    const name = customName.trim() || customEmail.split('@')[0];
    if (direct) {
      onDirectLogin(name, customEmail.trim());
    } else {
      onSelectAccount(name, customEmail.trim());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shadow-xs">
              <GoogleLogo className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Choose a Google Account
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                to continue to TaskFlow
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Account List */}
        <div className="p-6 space-y-3">
          <p className="text-xs font-semibold text-slate-600 mb-2">
            Select an account to auto-fill or sign in:
          </p>

          {accounts.map((acc) => (
            <div
              key={acc.email}
              className="p-3.5 border border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full ${acc.color} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
                >
                  {acc.avatar}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 leading-tight truncate">
                    {acc.name}
                  </p>
                  <p className="text-xs text-slate-500 font-mono truncate">
                    {acc.email}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    onSelectAccount(acc.name, acc.email);
                    onClose();
                  }}
                  className="px-2.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 rounded-lg transition-colors flex items-center gap-1"
                  title="Insert this Gmail into form"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Insert Gmail</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDirectLogin(acc.name, acc.email);
                    onClose();
                  }}
                  className="px-2.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1"
                  title="Direct sign-in with Google"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {/* Add Another Account Toggle */}
          {!showCustomInput ? (
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="w-full py-2.5 px-3 border border-dashed border-slate-300 hover:border-indigo-400 rounded-xl text-xs font-medium text-slate-600 hover:text-indigo-600 flex items-center justify-center gap-2 transition-colors mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Use another Google / Gmail account</span>
            </button>
          ) : (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 mt-2">
              <span className="text-xs font-semibold text-slate-700 block">
                Enter Custom Gmail:
              </span>
              <input
                type="text"
                placeholder="Name (optional)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
              />
              <input
                type="email"
                placeholder="yourname@gmail.com"
                value={customEmail}
                onChange={(e) => {
                  setCustomEmail(e.target.value);
                  setCustomError('');
                }}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
              />
              {customError && (
                <p className="text-[11px] text-rose-600 font-medium">{customError}</p>
              )}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCustomInput(false)}
                  className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleCustomSubmit(false)}
                  className="px-3 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100"
                >
                  Insert Gmail
                </button>
                <button
                  type="button"
                  onClick={() => handleCustomSubmit(true)}
                  className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Sign In Directly
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500 leading-tight">
            Google will safely share your name and Gmail address with TaskFlow.
          </p>
        </div>
      </div>
    </div>
  );
};
