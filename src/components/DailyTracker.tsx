import { useMemo } from 'react';
import type { Task } from '../types';
import { CATEGORIES } from '../types';
import { TaskItem } from './TaskItem';

interface DailyTrackerProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string, updates: Partial<Task>) => void;
}

export function DailyTracker({
  tasks,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}: DailyTrackerProps) {
  const today = new Date();
  const todayStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Get today's tasks (due today or daily recurring)
  const todaysTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Daily recurring tasks
      if (task.timeframe === 'daily') return true;

      // Tasks due today
      if (task.dueDate) {
        return task.dueDate.toDateString() === today.toDateString();
      }

      return false;
    });
  }, [tasks]);

  // Get tasks completed today (by updatedAt date)
  const completedToday = useMemo(() => {
    return tasks.filter((task) => {
      if (!task.completed) return false;
      return task.updatedAt.toDateString() === today.toDateString();
    });
  }, [tasks]);

  // Calculate streak (consecutive days with completed tasks)
  const streak = useMemo(() => {
    const completedDates = new Set<string>();
    tasks.forEach((task) => {
      if (task.completed) {
        completedDates.add(task.updatedAt.toDateString());
      }
    });

    let currentStreak = 0;
    const checkDate = new Date();

    while (true) {
      const dateStr = checkDate.toDateString();
      if (completedDates.has(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (checkDate.toDateString() === today.toDateString()) {
        // Today hasn't been completed yet, check yesterday
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return currentStreak;
  }, [tasks]);

  // Progress for today
  const todayProgress = todaysTasks.length > 0
    ? Math.round((todaysTasks.filter(t => t.completed).length / todaysTasks.length) * 100)
    : 0;

  // Group today's tasks by category
  const tasksByCategory = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    todaysTasks.forEach((task) => {
      if (!grouped[task.category]) {
        grouped[task.category] = [];
      }
      grouped[task.category].push(task);
    });
    return grouped;
  }, [todaysTasks]);

  return (
    <div className="space-y-6">
      {/* Header with date and stats */}
      <div className="bg-zinc-900 border-2 border-yellow-400 rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">{todayStr}</h2>
            <p className="text-yellow-400 mt-1 text-sm sm:text-base">Your daily checklist</p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {/* Streak */}
            <div className="bg-black border border-zinc-800 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-yellow-400">{streak}</div>
              <div className="text-[10px] sm:text-xs text-zinc-500">Day Streak</div>
            </div>

            {/* Today's Progress */}
            <div className="bg-black border border-zinc-800 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-yellow-400">{todayProgress}%</div>
              <div className="text-[10px] sm:text-xs text-zinc-500">Complete</div>
            </div>

            {/* Completed Today */}
            <div className="bg-black border border-zinc-800 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-white">{completedToday.length}</div>
              <div className="text-[10px] sm:text-xs text-zinc-500">Done Today</div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-zinc-400 mb-1">
            <span>Daily Progress</span>
            <span>{todaysTasks.filter(t => t.completed).length} / {todaysTasks.length} tasks</span>
          </div>
          <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 transition-all duration-500"
              style={{ width: `${todayProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Today's Tasks */}
      {todaysTasks.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="text-lg font-medium text-white mb-2">No tasks for today</h3>
          <p className="text-zinc-500">
            Add tasks with due dates or set them as "Daily" to see them here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {CATEGORIES.map((category) => {
            const catTasks = tasksByCategory[category.id];
            if (!catTasks || catTasks.length === 0) return null;

            const completedCount = catTasks.filter(t => t.completed).length;

            return (
              <div
                key={category.id}
                className="rounded-2xl bg-zinc-900 border-2 border-yellow-400/30 overflow-hidden"
              >
                <div className="px-4 py-3 flex items-center justify-between border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{category.icon}</span>
                    <span className="font-medium text-yellow-400">{category.name}</span>
                  </div>
                  <span className="text-sm text-zinc-500">
                    {completedCount}/{catTasks.length}
                  </span>
                </div>

                <div className="p-3 space-y-2">
                  {catTasks
                    .sort((a, b) => {
                      if (a.completed !== b.completed) return a.completed ? 1 : -1;
                      return 0;
                    })
                    .map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={() => onToggleTask(task.id)}
                        onDelete={() => onDeleteTask(task.id)}
                        onEdit={(updates) => onEditTask(task.id, updates)}
                      />
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Completed Today Section */}
      {completedToday.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
            <span className="text-yellow-400">✓</span>
            Completed Today ({completedToday.length})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {completedToday.map((task) => {
              const category = CATEGORIES.find(c => c.id === task.category)!;
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-2 bg-zinc-800 rounded-lg opacity-70"
                >
                  <span className="text-yellow-400">✓</span>
                  <span className="text-lg">{category.icon}</span>
                  <span className="line-through text-zinc-500 flex-1">{task.title}</span>
                  <span className="text-xs text-zinc-600">
                    {task.updatedAt.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
