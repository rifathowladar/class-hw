import React from 'react';
import { AuthPage, User } from '../types';
import { CheckSquare, LogOut, User as UserIcon, Code2 } from 'lucide-react';

interface NavbarProps {
  currentPage: AuthPage;
  onNavigate: (page: AuthPage) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate(currentUser ? 'todos' : 'login')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:bg-indigo-700 transition-colors">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                  TaskFlow
                </span>
                <span className="text-[11px] font-medium text-slate-500 block leading-none">
                  Auth & Task System
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation & Dev Page Switcher (Single-line, whitespace-nowrap) */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => onNavigate('register')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                currentPage === 'register'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Register
            </button>
            <button
              onClick={() => onNavigate('verify-email')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                currentPage === 'verify-email'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Gmail Verify
            </button>
            <button
              onClick={() => onNavigate('login')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                currentPage === 'login'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Login
            </button>
            <button
              onClick={() => onNavigate('forgot-password')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                currentPage === 'forgot-password'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              4. Forgot
            </button>
            <button
              onClick={() => onNavigate('reset-password')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                currentPage === 'reset-password'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              5. Reset
            </button>
            <button
              onClick={() => onNavigate('todos')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                currentPage === 'todos'
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-slate-700 hover:text-slate-900 font-semibold'
              }`}
            >
              6. Todo Manager
            </button>
          </nav>

          {/* Zone 3: User status & primary action */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pl-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs flex items-center justify-center border border-indigo-200">
                    {currentUser.name
                      ? currentUser.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()
                      : 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[120px]">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-tight truncate max-w-[130px]">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-lg transition-colors whitespace-nowrap"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile quick page selector */}
        <div className="md:hidden py-2 border-t border-slate-100 flex items-center justify-between overflow-x-auto gap-2 text-xs no-scrollbar">
          <button
            onClick={() => onNavigate('register')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentPage === 'register' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600'}`}
          >
            Register
          </button>
          <button
            onClick={() => onNavigate('verify-email')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentPage === 'verify-email' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600'}`}
          >
            Verify Gmail
          </button>
          <button
            onClick={() => onNavigate('login')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentPage === 'login' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600'}`}
          >
            Login
          </button>
          <button
            onClick={() => onNavigate('forgot-password')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentPage === 'forgot-password' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600'}`}
          >
            Forgot
          </button>
          <button
            onClick={() => onNavigate('reset-password')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentPage === 'reset-password' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600'}`}
          >
            Reset
          </button>
          <button
            onClick={() => onNavigate('todos')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentPage === 'todos' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-800 font-medium'}`}
          >
            Todo App
          </button>
        </div>
      </div>
    </header>
  );
};
