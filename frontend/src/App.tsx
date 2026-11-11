/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthPage, User } from './types';
import { authService } from './services/authService';
import { Navbar } from './components/Navbar';
import { RegisterView } from './components/RegisterView';
import { EmailVerifyView } from './components/EmailVerifyView';
import { LoginView } from './components/LoginView';
import { ForgotPasswordView } from './components/ForgotPasswordView';
import { ResetPasswordView } from './components/ResetPasswordView';
import { TodoView } from './components/TodoView';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AuthPage>('register');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string>('mahdihasansojip@gmail.com');

  // Check persisted user on initial load
  useEffect(() => {
    const existingUser = authService.getCurrentUser();
    if (existingUser) {
      setCurrentUser(existingUser);
    }
  }, []);

  const handleNavigate = (page: AuthPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegistered = (email: string) => {
    setPendingEmail(email);
    setCurrentPage('verify-email');
  };

  const handleVerified = (user: User) => {
    setCurrentUser(user);
    setCurrentPage('todos');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentPage('todos');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setCurrentPage('login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center p-3 sm:p-6 lg:p-8">
        {currentPage === 'register' && (
          <RegisterView
            onNavigate={handleNavigate}
            onRegistered={handleRegistered}
            onGoogleSuccess={handleLoginSuccess}
          />
        )}

        {currentPage === 'verify-email' && (
          <EmailVerifyView
            email={pendingEmail}
            onNavigate={handleNavigate}
            onVerified={handleVerified}
          />
        )}

        {currentPage === 'login' && (
          <LoginView
            onNavigate={handleNavigate}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {currentPage === 'forgot-password' && (
          <ForgotPasswordView
            onNavigate={handleNavigate}
            onCodeSent={(email) => {
              setPendingEmail(email);
              setCurrentPage('reset-password');
            }}
          />
        )}

        {currentPage === 'reset-password' && (
          <ResetPasswordView
            email={pendingEmail}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'todos' && (
          <TodoView
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="py-4 border-t border-slate-200 text-center text-xs text-slate-500 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} TaskFlow · Built with React & Tailwind CSS</p>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Ready for Express / REST API integration</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
