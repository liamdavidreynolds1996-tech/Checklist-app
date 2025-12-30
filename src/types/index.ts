export type Category = 'work' | 'health' | 'personal' | 'finance' | 'learning' | 'social';

export type Timeframe = 'daily' | 'weekly' | 'monthly' | 'once';

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  category: Category;
  completed: boolean;
  dueDate?: Date;
  dueTime?: string;
  timeframe: Timeframe;
  recurrence?: RecurrencePattern;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  notes?: string;
}

export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly';
  days?: number[]; // 0-6 for weekly (Sunday-Saturday)
  dayOfMonth?: number; // 1-31 for monthly
  interval?: number; // every N days/weeks/months
}

export interface CategoryConfig {
  id: Category;
  name: string;
  color: string;
  bgColor: string;
  icon: string;
}

export const CATEGORIES: CategoryConfig[] = [
  { id: 'work', name: 'Work', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10', icon: '💼' },
  { id: 'health', name: 'Health', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10', icon: '🏃' },
  { id: 'personal', name: 'Personal', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10', icon: '🏠' },
  { id: 'finance', name: 'Finance', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10', icon: '💰' },
  { id: 'learning', name: 'Learning', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10', icon: '📚' },
  { id: 'social', name: 'Social', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10', icon: '👥' },
];

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AppSettings {
  defaultCategory: Category;
  defaultTimeframe: Timeframe;
}
