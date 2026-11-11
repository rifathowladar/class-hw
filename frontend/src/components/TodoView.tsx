import React, { useState, useEffect, useMemo } from 'react';
import { User, TodoItem, TodoPriority, TodoCategory, FilterStatus, SortField, SortOrder } from '../types';
import { todoService } from '../services/todoService';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  AlertTriangle,
  Trash2,
  Edit3,
  X,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  Code,
  Tag,
  ArrowUpDown,
  ListTodo,
  CheckCheck,
  Check,
  FileText
} from 'lucide-react';

interface TodoViewProps {
  currentUser: User | null;
  onLogout: () => void;
}

const CATEGORIES: TodoCategory[] = ['Work', 'Personal', 'Study', 'Finance', 'Health', 'Other'];
const PRIORITIES: { value: TodoPriority; label: string; color: string; border: string; bg: string }[] = [
  { value: 'urgent', label: 'Urgent', color: 'text-rose-700', border: 'border-rose-200', bg: 'bg-rose-50' },
  { value: 'high', label: 'High', color: 'text-amber-700', border: 'border-amber-200', bg: 'bg-amber-50' },
  { value: 'medium', label: 'Medium', color: 'text-indigo-700', border: 'border-indigo-200', bg: 'bg-indigo-50' },
  { value: 'low', label: 'Low', color: 'text-slate-700', border: 'border-slate-200', bg: 'bg-slate-100' },
];

export const TodoView: React.FC<TodoViewProps> = ({ currentUser, onLogout }) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick Add state
  const [quickTitle, setQuickTitle] = useState('');
  const [quickPriority, setQuickPriority] = useState<TodoPriority>('medium');
  const [quickCategory, setQuickCategory] = useState<TodoCategory>('Work');
  const [quickDueDate, setQuickDueDate] = useState<string>('');
  const [isAddingDetails, setIsAddingDetails] = useState(false);
  const [quickDescription, setQuickDescription] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Edit Modal state
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);

  // Developer Backend panel toggle
  const [showBackendGuide, setShowBackendGuide] = useState(false);

  // Toast / Undo notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load todos
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await todoService.getTodos();
      setTodos(data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Add Task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    try {
      const newTodo = await todoService.addTodo({
        title: quickTitle.trim(),
        description: quickDescription.trim() || undefined,
        priority: quickPriority,
        category: quickCategory,
        dueDate: quickDueDate || undefined,
        completed: false,
      });

      setTodos((prev) => [newTodo, ...prev]);
      setQuickTitle('');
      setQuickDescription('');
      setIsAddingDetails(false);
      showToast('Task added successfully!');
    } catch (err: unknown) {
      showToast('Failed to add task.');
    }
  };

  // Toggle complete
  const handleToggle = async (id: string) => {
    try {
      const updated = await todoService.toggleComplete(id);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch {
      showToast('Failed to toggle status.');
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    try {
      await todoService.deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
      showToast('Task deleted.');
    } catch {
      showToast('Failed to delete task.');
    }
  };

  // Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTodo) return;

    try {
      const updated = await todoService.updateTodo(editingTodo.id, {
        title: editingTodo.title,
        description: editingTodo.description,
        priority: editingTodo.priority,
        category: editingTodo.category,
        dueDate: editingTodo.dueDate,
        completed: editingTodo.completed,
      });

      setTodos((prev) => prev.map((t) => (t.id === editingTodo.id ? updated : t)));
      setEditingTodo(null);
      showToast('Task updated successfully!');
    } catch {
      showToast('Failed to update task.');
    }
  };

  // Batch actions
  const handleClearCompleted = async () => {
    await todoService.clearCompleted();
    setTodos((prev) => prev.filter((t) => !t.completed));
    showToast('Completed tasks cleared.');
  };

  const handleMarkAllComplete = async () => {
    const allDone = todos.every((t) => t.completed);
    await todoService.setAllCompleted(!allDone);
    setTodos((prev) => prev.map((t) => ({ ...t, completed: !allDone })));
    showToast(!allDone ? 'All marked as completed!' : 'All unmarked.');
  };

  const handleResetSampleData = async () => {
    const samples = await todoService.resetSampleData();
    setTodos(samples);
    showToast('Reset to default sample tasks.');
  };

  // Computed statistics
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const pending = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const urgentCount = todos.filter((t) => !t.completed && (t.priority === 'urgent' || t.priority === 'high')).length;
    return { total, completed, pending, percent, urgentCount };
  }, [todos]);

  // Filter and sort todos
  const filteredTodos = useMemo(() => {
    return todos
      .filter((item) => {
        // Status filter
        if (statusFilter === 'active' && item.completed) return false;
        if (statusFilter === 'completed' && !item.completed) return false;

        // Priority filter
        if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;

        // Category filter
        if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;

        // Search keyword
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortField === 'title') {
          comp = a.title.localeCompare(b.title);
        } else if (sortField === 'dueDate') {
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 9999999999999;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 9999999999999;
          comp = dateA - dateB;
        } else if (sortField === 'priority') {
          const weight: Record<TodoPriority, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
          comp = weight[b.priority] - weight[a.priority];
        } else {
          // createdAt
          comp = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [todos, statusFilter, priorityFilter, categoryFilter, searchQuery, sortField, sortOrder]);

  const isOverdue = (dateStr?: string) => {
    if (!dateStr) return false;
    const today = new Date().toISOString().split('T')[0];
    return dateStr < today;
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-slate-800 flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="space-y-6">
        {/* Header Title & Quick Profile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                My Tasks & Todos
              </h1>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                Backend Ready
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Logged in as <span className="font-semibold text-slate-700">{currentUser?.name || 'Mahdi Hasan'}</span> ({currentUser?.email || 'mahdihasansojip@gmail.com'})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBackendGuide(!showBackendGuide)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors"
            >
              <Code className="w-3.5 h-3.5 text-indigo-600" />
              <span>{showBackendGuide ? 'Hide API Guide' : 'Backend API Guide'}</span>
            </button>
            <button
              onClick={handleResetSampleData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors"
              title="Reset sample tasks"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          </div>
        </div>

        {/* Developer Backend Guide Banner (Collapsible) */}
        {showBackendGuide && (
          <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 border border-slate-800 shadow-sm transition-all">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-emerald-400" />
                  REST API Backend Integration Guide (React + Tailwind)
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  This application is built with a separate service layer in <code className="text-indigo-300">src/services/authService.ts</code> and <code className="text-indigo-300">src/services/todoService.ts</code>. Simply replace the mock functions with your Express / Node.js backend routes:
                </p>
              </div>
              <button
                onClick={() => setShowBackendGuide(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-xs font-mono">
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <span className="text-indigo-400 font-bold block mb-1">Auth Endpoints:</span>
                <p className="text-slate-300">POST /api/auth/register</p>
                <p className="text-slate-300">POST /api/auth/verify-email</p>
                <p className="text-slate-300">POST /api/auth/login</p>
                <p className="text-slate-300">POST /api/auth/forgot-password</p>
                <p className="text-slate-300">POST /api/auth/reset-password</p>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">Todo REST Endpoints:</span>
                <p className="text-slate-300">GET /api/todos (Fetch all user todos)</p>
                <p className="text-slate-300">POST /api/todos (Create new todo)</p>
                <p className="text-slate-300">PUT /api/todos/:id (Update title/details)</p>
                <p className="text-slate-300">PATCH /api/todos/:id/toggle (Complete)</p>
                <p className="text-slate-300">DELETE /api/todos/:id (Delete item)</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-medium text-slate-500 block">Total Tasks</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">{stats.total}</span>
              <ListTodo className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-medium text-slate-500 block">Completed</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">{stats.completed}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-medium text-slate-500 block">Pending</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold font-mono text-amber-600 tabular-nums">{stats.pending}</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Progress</span>
              <span className="text-xs font-mono font-bold text-indigo-600 tabular-nums">{stats.percent}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.percent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Add Todo Input Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
          <form onSubmit={handleAddTask} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                required
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                placeholder="What needs to be done? e.g. Build backend API endpoints..."
                className="flex-1 px-4 py-2.5 text-sm bg-slate-50 sm:bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors placeholder:text-slate-400"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingDetails(!isAddingDetails)}
                  className={`px-3 py-2.5 text-xs font-medium rounded-xl border transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    isAddingDetails
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                  title="Add description & due date"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Details</span>
                </button>

                <button
                  type="submit"
                  disabled={!quickTitle.trim()}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Task</span>
                </button>
              </div>
            </div>

            {/* Quick Priority & Category selectors */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">Priority:</span>
                <select
                  value={quickPriority}
                  onChange={(e) => setQuickPriority(e.target.value as TodoPriority)}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs font-medium focus:outline-hidden focus:border-indigo-600"
                >
                  <option value="urgent">🔴 Urgent</option>
                  <option value="high">🟠 High</option>
                  <option value="medium">🔵 Medium</option>
                  <option value="low">⚪ Low</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">Category:</span>
                <select
                  value={quickCategory}
                  onChange={(e) => setQuickCategory(e.target.value as TodoCategory)}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs font-medium focus:outline-hidden focus:border-indigo-600"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">Due Date:</span>
                <input
                  type="date"
                  value={quickDueDate}
                  onChange={(e) => setQuickDueDate(e.target.value)}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs focus:outline-hidden focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Expandable Description Area */}
            {isAddingDetails && (
              <div className="pt-2 border-t border-slate-100 animate-fadeIn">
                <textarea
                  value={quickDescription}
                  onChange={(e) => setQuickDescription(e.target.value)}
                  placeholder="Optional notes or details for this task..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 placeholder:text-slate-400"
                />
              </div>
            )}
          </form>
        </div>

        {/* Filter, Search, and Sort Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks by title or notes..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Segmented Buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  statusFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({todos.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('active')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  statusFilter === 'active'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active ({todos.filter((t) => !t.completed).length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('completed')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  statusFilter === 'completed'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Done ({todos.filter((t) => t.completed).length})
              </button>
            </div>
          </div>

          {/* Sub Filters: Priority, Category, Sorting */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              {/* Priority filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden"
              >
                <option value="all">Priority: All</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              {/* Category filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden"
              >
                <option value="all">Category: All</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* Sort field */}
              <div className="flex items-center gap-1">
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value as SortField)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden"
                >
                  <option value="createdAt">Sort: Created Date</option>
                  <option value="dueDate">Sort: Due Date</option>
                  <option value="priority">Sort: Priority</option>
                  <option value="title">Sort: Title</option>
                </select>

                <button
                  type="button"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition-colors"
                  title={`Toggle order: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bulk Toolbar */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleMarkAllComplete}
                className="text-slate-600 hover:text-indigo-600 text-xs font-medium px-2 py-1 hover:bg-slate-50 rounded transition-colors"
              >
                Toggle All
              </button>
              <button
                type="button"
                onClick={handleClearCompleted}
                disabled={!todos.some((t) => t.completed)}
                className="text-slate-600 hover:text-rose-600 disabled:opacity-40 disabled:hover:text-slate-600 text-xs font-medium px-2 py-1 hover:bg-slate-50 rounded transition-colors"
              >
                Clear Completed
              </button>
            </div>
          </div>
        </div>

        {/* Todo List Items */}
        <div className="space-y-2.5">
          {filteredTodos.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <CheckSquare className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No tasks found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {searchQuery || priorityFilter !== 'all' || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'No tasks match your current search or filter criteria. Try resetting filters.'
                  : 'Your task list is empty. Add a task above to get started!'}
              </p>
              {(searchQuery || priorityFilter !== 'all' || categoryFilter !== 'all' || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setPriorityFilter('all');
                    setCategoryFilter('all');
                  }}
                  className="mt-3 text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            filteredTodos.map((todo) => {
              const overdue = !todo.completed && isOverdue(todo.dueDate);
              const priorityObj = PRIORITIES.find((p) => p.value === todo.priority) || PRIORITIES[2];

              return (
                <div
                  key={todo.id}
                  className={`group bg-white rounded-xl border transition-all p-3.5 sm:p-4 flex items-start gap-3.5 ${
                    todo.completed
                      ? 'border-slate-200 bg-slate-50/50 opacity-75'
                      : 'border-slate-200 hover:border-indigo-300 hover:shadow-xs'
                  }`}
                >
                  {/* Checkbox */}
                  <button
                    type="button"
                    onClick={() => handleToggle(todo.id)}
                    className="mt-0.5 text-slate-400 hover:text-indigo-600 focus:outline-hidden transition-colors shrink-0"
                    title={todo.completed ? 'Mark incomplete' : 'Mark completed'}
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                    ) : (
                      <Circle className="w-5 h-5 hover:text-indigo-600" />
                    )}
                  </button>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`text-sm font-semibold transition-all break-words ${
                          todo.completed
                            ? 'line-through text-slate-400'
                            : 'text-slate-900'
                        }`}
                      >
                        {todo.title}
                      </span>
                    </div>

                    {todo.description && (
                      <p
                        className={`text-xs mt-1 leading-relaxed line-clamp-2 ${
                          todo.completed ? 'line-through text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        {todo.description}
                      </p>
                    )}

                    {/* Metadata strip (Clean, unboxed typography per design guidelines) */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-2">
                      {/* Priority indicator */}
                      <span className={`font-semibold ${priorityObj.color}`}>
                        {priorityObj.label}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>

                      {/* Category */}
                      <span>{todo.category}</span>

                      {/* Due date */}
                      {todo.dueDate && (
                        <>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className={`inline-flex items-center gap-1 font-mono tabular-nums ${
                            overdue ? 'text-rose-600 font-semibold' : 'text-slate-500'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            <span>{todo.dueDate}</span>
                            {overdue && <span className="text-[10px] font-bold uppercase">(Overdue)</span>}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons (Edit / Delete) */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingTodo({ ...todo })}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit task"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(todo.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Edit Task Modal */}
      {editingTodo && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Task
              </h3>
              <button
                onClick={() => setEditingTodo(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 mt-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={editingTodo.title}
                  onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-600"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description / Notes
                </label>
                <textarea
                  rows={3}
                  value={editingTodo.description || ''}
                  onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-600"
                />
              </div>

              {/* Priority & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={editingTodo.priority}
                    onChange={(e) => setEditingTodo({ ...editingTodo, priority: e.target.value as TodoPriority })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-600"
                  >
                    <option value="urgent">🔴 Urgent</option>
                    <option value="high">🟠 High</option>
                    <option value="medium">🔵 Medium</option>
                    <option value="low">⚪ Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={editingTodo.category}
                    onChange={(e) => setEditingTodo({ ...editingTodo, category: e.target.value as TodoCategory })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-600"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Due Date & Completed status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={editingTodo.dueDate || ''}
                    onChange={(e) => setEditingTodo({ ...editingTodo, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-600"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingTodo.completed}
                      onChange={(e) => setEditingTodo({ ...editingTodo, completed: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600 border-slate-300"
                    />
                    <span className="text-xs font-semibold text-slate-700">Completed</span>
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTodo(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

function CheckSquare(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}
