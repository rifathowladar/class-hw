export type AuthPage =
  | 'register'
  | 'verify-email'
  | 'login'
  | 'forgot-password'
  | 'reset-password'
  | 'todos';

export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
}

export type TodoPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TodoCategory =
  | 'Work'
  | 'Personal'
  | 'Study'
  | 'Finance'
  | 'Health'
  | 'Other';

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TodoPriority;
  category: TodoCategory;
  dueDate?: string; // YYYY-MM-DD format
  createdAt: string; // ISO date
  updatedAt?: string;
}

export type FilterStatus = 'all' | 'active' | 'completed';

export type SortField = 'createdAt' | 'dueDate' | 'priority' | 'title';
export type SortOrder = 'asc' | 'desc';
