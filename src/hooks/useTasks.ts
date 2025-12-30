import { useState, useEffect, useCallback } from 'react';
import {
  addTask as firebaseAddTask,
  updateTask as firebaseUpdateTask,
  deleteTask as firebaseDeleteTask,
  subscribeToTasks,
} from '../services/firebase';
import type { Task, Category, Timeframe } from '../types';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  getTasksByCategory: (category: Category) => Task[];
  getTasksByTimeframe: (timeframe: Timeframe) => Task[];
  reorderTasks: (taskIds: string[]) => void;
}

const LOCAL_STORAGE_KEY = 'checklistTasks';

function loadLocalTasks(): Task[] {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    const tasks = JSON.parse(stored);
    return tasks.map((t: Task) => ({
      ...t,
      dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt),
    }));
  }
  return [];
}

function saveLocalTasks(tasks: Task[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
}

export function useTasks(userId: string | null, isFirebaseConfigured: boolean): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    if (isFirebaseConfigured) {
      setLoading(true);
      const unsubscribe = subscribeToTasks(userId, (newTasks) => {
        setTasks(newTasks);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Local storage mode
      const localTasks = loadLocalTasks().filter(t => t.userId === userId);
      setTasks(localTasks);
      setLoading(false);
    }
  }, [userId, isFirebaseConfigured]);

  const addTask = useCallback(async (
    taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
  ) => {
    if (!userId) return;

    const now = new Date();
    const newTask: Omit<Task, 'id'> = {
      ...taskData,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    if (isFirebaseConfigured) {
      await firebaseAddTask(newTask);
    } else {
      const task: Task = {
        ...newTask,
        id: `local_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      };
      setTasks(prev => {
        const updated = [task, ...prev];
        saveLocalTasks(updated);
        return updated;
      });
    }
  }, [userId, isFirebaseConfigured]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    const updatedData = { ...updates, updatedAt: new Date() };

    if (isFirebaseConfigured) {
      await firebaseUpdateTask(taskId, updatedData);
    } else {
      setTasks(prev => {
        const updated = prev.map(t =>
          t.id === taskId ? { ...t, ...updatedData } : t
        );
        saveLocalTasks(updated);
        return updated;
      });
    }
  }, [isFirebaseConfigured]);

  const deleteTask = useCallback(async (taskId: string) => {
    if (isFirebaseConfigured) {
      await firebaseDeleteTask(taskId);
    } else {
      setTasks(prev => {
        const updated = prev.filter(t => t.id !== taskId);
        saveLocalTasks(updated);
        return updated;
      });
    }
  }, [isFirebaseConfigured]);

  const toggleTask = useCallback(async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await updateTask(taskId, { completed: !task.completed });
    }
  }, [tasks, updateTask]);

  const getTasksByCategory = useCallback((category: Category) => {
    return tasks.filter(t => t.category === category);
  }, [tasks]);

  const getTasksByTimeframe = useCallback((timeframe: Timeframe) => {
    return tasks.filter(t => t.timeframe === timeframe);
  }, [tasks]);

  const reorderTasks = useCallback((taskIds: string[]) => {
    setTasks(prev => {
      const taskMap = new Map(prev.map(t => [t.id, t]));
      const reordered = taskIds.map(id => taskMap.get(id)!).filter(Boolean);
      const remaining = prev.filter(t => !taskIds.includes(t.id));
      const updated = [...reordered, ...remaining];
      if (!isFirebaseConfigured) {
        saveLocalTasks(updated);
      }
      return updated;
    });
  }, [isFirebaseConfigured]);

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    getTasksByCategory,
    getTasksByTimeframe,
    reorderTasks,
  };
}
