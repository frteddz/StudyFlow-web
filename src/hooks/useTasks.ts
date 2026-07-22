import { useState, useCallback, useEffect, useMemo } from 'react';
import { storage, type Task } from '../services/storageService';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    setTasks(storage.getTasks());
  }, []);

  const persist = useCallback((updated: Task[]) => {
    setTasks(updated);
    storage.setTasks(updated);
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const q = task.title.toLowerCase().includes(search.toLowerCase());
      const subj = subjectFilter === 'all' || task.subjectId === subjectFilter;
      const status =
        statusFilter === 'all' ||
        (statusFilter === 'completed' ? task.completed : !task.completed);
      return q && subj && status;
    });
  }, [tasks, search, subjectFilter, statusFilter]);

  const addTask = useCallback(
    (data: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
      const task: Task = {
        ...data,
        id: crypto.randomUUID(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      persist([...tasks, task]);
      return task;
    },
    [tasks, persist]
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<Task>) => {
      persist(tasks.map(t => (t.id === id ? { ...t, ...updates } : t)));
    },
    [tasks, persist]
  );

  const deleteTask = useCallback(
    (id: string) => {
      persist(tasks.filter(t => t.id !== id));
    },
    [tasks, persist]
  );

  const toggleComplete = useCallback(
    (id: string) => {
      persist(tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
    },
    [tasks, persist]
  );

  const getTasksByDate = useCallback(
    (date: string) => tasks.filter(t => t.dueDate === date),
    [tasks]
  );

  const getUpcomingTasks = useCallback(
    (days = 7) => {
      const now = new Date();
      const deadline = new Date(now.getTime() + days * 86400000);
      return tasks
        .filter(t => {
          if (t.completed) return false;
          const d = new Date(t.dueDate);
          return d >= now && d <= deadline;
        })
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    },
    [tasks]
  );

  return {
    tasks,
    filteredTasks,
    search,
    setSearch,
    subjectFilter,
    setSubjectFilter,
    statusFilter,
    setStatusFilter,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    getTasksByDate,
    getUpcomingTasks,
  };
}
