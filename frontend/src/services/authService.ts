/**
 * Authentication Service (Backend-Ready)
 * 
 * NOTE FOR BACKEND INTEGRATION:
 * When you connect your backend (Node.js/Express, PHP, Python/Django, Firebase, etc.),
 * you can replace the localStorage logic inside these functions with real fetch() or axios calls:
 * e.g., const res = await fetch('/api/auth/register', { method: 'POST', body: JSON.stringify(...) });
 */

import { User } from '../types';

const STORAGE_USERS_KEY = 'auth_app_users_db';
const STORAGE_CURRENT_USER_KEY = 'auth_app_current_user';
const STORAGE_PENDING_VERIFY_KEY = 'auth_app_pending_verify';

interface StoredUser extends User {
  passwordHash: string; // Simulated stored password
}

interface PendingVerification {
  email: string;
  name: string;
  code: string;
  sentAt: number;
}

// Helper to get registered users from localStorage
function getStoredUsers(): StoredUser[] {
  try {
    const data = localStorage.getItem(STORAGE_USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]) {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
}

// Generate demo 6-digit code
export function generateDemoCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const authService = {
  /**
   * Register a new user
   * Replace with: POST /api/auth/register
   */
  async register(name: string, email: string, password: string):Promise<{ success: boolean; message: string; code?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate network latency

    const users = getStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existing && existing.isVerified) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    // Generate a simulated verification code (e.g. 123456 or random)
    const code = '123456'; // Convenient default for testing, also allows custom typed codes

    const pending: PendingVerification = {
      email,
      name,
      code,
      sentAt: Date.now(),
    };
    localStorage.setItem(STORAGE_PENDING_VERIFY_KEY, JSON.stringify(pending));

    // If user didn't exist or wasn't verified, store/update pending record
    if (!existing) {
      users.push({
        id: 'usr_' + Date.now(),
        name,
        email,
        isVerified: false,
        createdAt: new Date().toISOString(),
        passwordHash: password, // In production backend, this is hashed on server
      });
      saveStoredUsers(users);
    }

    return {
      success: true,
      message: `A 6-digit verification code has been simulated for ${email}`,
      code,
    };
  },

  /**
   * Resend verification code
   * Replace with: POST /api/auth/resend-code
   */
  async resendVerificationCode(email: string): Promise<{ success: boolean; code: string }> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const code = '123456';
    const pendingData = localStorage.getItem(STORAGE_PENDING_VERIFY_KEY);
    let pending: PendingVerification = {
      email,
      name: email.split('@')[0],
      code,
      sentAt: Date.now(),
    };
    if (pendingData) {
      try {
        const parsed = JSON.parse(pendingData);
        pending = { ...parsed, code, sentAt: Date.now() };
      } catch {
        // ignore
      }
    }
    localStorage.setItem(STORAGE_PENDING_VERIFY_KEY, JSON.stringify(pending));
    return { success: true, code };
  },

  /**
   * Verify email with 6-digit code
   * Replace with: POST /api/auth/verify-email
   */
  async verifyCode(email: string, code: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Accepts '123456' or any 6-digit code for smooth demo experience
    if (!code || code.length !== 6) {
      throw new Error('Please enter a valid 6-digit verification code.');
    }

    const users = getStoredUsers();
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Create user if registering in fast-demo mode
      user = {
        id: 'usr_' + Date.now(),
        name: email.split('@')[0] || 'User',
        email,
        isVerified: true,
        createdAt: new Date().toISOString(),
        passwordHash: 'demo123',
      };
      users.push(user);
    } else {
      user.isVerified = true;
    }
    saveStoredUsers(users);

    const authenticatedUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      isVerified: true,
      createdAt: user.createdAt,
    };

    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(authenticatedUser));
    localStorage.removeItem(STORAGE_PENDING_VERIFY_KEY);
    return authenticatedUser;
  },

  /**
   * Login with email and password
   * Replace with: POST /api/auth/login
   */
  async login(email: string, password: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const users = getStoredUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error('No account found with this email. Please sign up first.');
    }

    if (user.passwordHash !== password) {
      throw new Error('Invalid password. Please check your credentials and try again.');
    }

    if (!user.isVerified) {
      throw new Error('Please verify your email before logging in.');
    }

    const authenticatedUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      isVerified: true,
      createdAt: user.createdAt,
    };

    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(authenticatedUser));
    return authenticatedUser;
  },

  /**
   * Quick Demo Login (for instant testing)
   */
  async loginWithDemo(): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const demoUser: User = {
      id: 'demo_user_1',
      name: 'Mahdi Hasan',
      email: 'mahdihasansojip@gmail.com',
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(demoUser));
    return demoUser;
  },

  /**
   * Google OAuth / Continue with Google login
   * Replace with: POST /api/auth/google
   */
  async loginWithGoogle(email: string, name: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const users = getStoredUsers();
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      user = {
        id: 'usr_g_' + Date.now(),
        name: name || email.split('@')[0],
        email,
        isVerified: true,
        createdAt: new Date().toISOString(),
        passwordHash: 'google_oauth_auth',
      };
      users.push(user);
    } else {
      user.isVerified = true;
    }
    saveStoredUsers(users);

    const authenticatedUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      isVerified: true,
      createdAt: user.createdAt,
    };

    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(authenticatedUser));
    return authenticatedUser;
  },

  /**
   * Send forgot password reset code / link
   * Replace with: POST /api/auth/forgot-password
   */
  async forgotPassword(email: string): Promise<{ success: boolean; message: string; code: string }> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const users = getStoredUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error('No account found with this email address.');
    }

    const resetCode = '123456';
    return {
      success: true,
      message: `Password reset code sent to ${email}`,
      code: resetCode,
    };
  },

  /**
   * Reset password with code and new password
   * Replace with: POST /api/auth/reset-password
   */
  async resetPassword(email: string, code: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!code || code.length !== 6) {
      throw new Error('Please provide the valid 6-digit reset code.');
    }

    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters.');
    }

    const users = getStoredUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error('User not found.');
    }

    user.passwordHash = newPassword;
    saveStoredUsers(users);

    return {
      success: true,
      message: 'Password has been reset successfully! You can now log in with your new password.',
    };
  },

  /**
   * Get active logged-in user from storage
   * Replace with: GET /api/auth/me
   */
  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  /**
   * Get pending verification info
   */
  getPendingVerification(): PendingVerification | null {
    try {
      const data = localStorage.getItem(STORAGE_PENDING_VERIFY_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  /**
   * Logout user
   * Replace with: POST /api/auth/logout
   */
  logout(): void {
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
  },
};
