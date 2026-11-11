/**
 * Todo Service (Backend-Ready)
 * 
 * NOTE FOR BACKEND INTEGRATION:
 * When connecting your backend API, replace these functions with:
 * - GET /api/todos
 * - POST /api/todos
 * - PUT /api/todos/:id
 * - DELETE /api/todos/:id
 * - PATCH /api/todos/bulk
 */

import { TodoItem } from '../types';

const STORAGE_TODOS_KEY = 'auth_app_todos_db';

const INITIAL_SAMPLE_TODOS: TodoItem[] = [
  {
    id: 'td_1',
    title: 'Connect Node.js / Express backend endpoints',
    description: 'Hook up auth routes (register, verify, login) and todo REST API endpoints.',
    completed: false,
    priority: 'urgent',
    category: 'Work',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'td_2',
    title: 'Configure PostgreSQL or MongoDB database schema',
    description: 'Set up tables for users, tokens, and user-specific todo items.',
    completed: false,
    priority: 'high',
    category: 'Work',
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'td_3',
    title: 'Implement JWT token & bcrypt password hashing',
    description: 'Secure passwords with bcrypt and issue bearer JWT tokens upon verification.',
    completed: true,
    priority: 'medium',
    category: 'Study',
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'td_4',
    title: 'Review Tailwind CSS responsive layout on mobile',
    description: 'Ensure touch targets >= 44px and smooth keyboard input navigation.',
    completed: true,
    priority: 'low',
    category: 'Personal',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
  },
  {
    id: 'td_5',
    title: 'Set up automated email verification service (Nodemailer/SendGrid)',
    description: 'Switch from simulated Gmail verification code to real SMTP delivery.',
    completed: false,
    priority: 'high',
    category: 'Work',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

function getStoredTodos(): TodoItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_TODOS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_TODOS_KEY, JSON.stringify(INITIAL_SAMPLE_TODOS));
      return INITIAL_SAMPLE_TODOS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SAMPLE_TODOS;
  }
}

function saveStoredTodos(todos: TodoItem[]): void {
  localStorage.setItem(STORAGE_TODOS_KEY, JSON.stringify(todos));
}

export const todoService = {
  /**
   * Fetch all todos
   * Replace with: GET /api/todos
   */
  async getTodos(): Promise<TodoItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return getStoredTodos();
  },

  /**
   * Create a new todo
   * Replace with: POST /api/todos
   */
  async addTodo(data: Omit<TodoItem, 'id' | 'createdAt'>): Promise<TodoItem> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const todos = getStoredTodos();
    const newTodo: TodoItem = {
      ...data,
      id: 'td_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
    };
    todos.unshift(newTodo);
    saveStoredTodos(todos);
    return newTodo;
  },

  /**
   * Update an existing todo
   * Replace with: PUT /api/todos/:id
   */
  async updateTodo(id: string, updates: Partial<Omit<TodoItem, 'id' | 'createdAt'>>): Promise<TodoItem> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const todos = getStoredTodos();
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error('Todo item not found.');
    }
    const updated: TodoItem = {
      ...todos[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    todos[index] = updated;
    saveStoredTodos(todos);
    return updated;
  },

  /**
   * Toggle completed status
   * Replace with: PATCH /api/todos/:id/toggle
   */
  async toggleComplete(id: string): Promise<TodoItem> {
    const todos = getStoredTodos();
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error('Todo item not found.');
    }
    todos[index].completed = !todos[index].completed;
    todos[index].updatedAt = new Date().toISOString();
    saveStoredTodos(todos);
    return todos[index];
  },

  /**
   * Delete a todo item
   * Replace with: DELETE /api/todos/:id
   */
  async deleteTodo(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const todos = getStoredTodos();
    const filtered = todos.filter((t) => t.id !== id);
    saveStoredTodos(filtered);
    return true;
  },

  /**
   * Clear all completed todos
   * Replace with: DELETE /api/todos/completed
   */
  async clearCompleted(): Promise<void> {
    const todos = getStoredTodos();
    const activeOnly = todos.filter((t) => !t.completed);
    saveStoredTodos(activeOnly);
  },

  /**
   * Toggle all todos to completed or uncompleted
   * Replace with: PATCH /api/todos/batch-complete
   */
  async setAllCompleted(completed: boolean): Promise<void> {
    const todos = getStoredTodos();
    const updated = todos.map((t) => ({ ...t, completed }));
    saveStoredTodos(updated);
  },

  /**
   * Reset sample data for testing
   */
  async resetSampleData(): Promise<TodoItem[]> {
    saveStoredTodos(INITIAL_SAMPLE_TODOS);
    return INITIAL_SAMPLE_TODOS;
  },
};
