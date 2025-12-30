import { useState } from 'react';
import type { Task, CategoryConfig, Category } from '../types';
import { TaskItem } from './TaskItem';

interface CategorySectionProps {
  category: CategoryConfig;
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string, updates: Partial<Task>) => void;
  onAddTask?: (task: { title: string; category: Category }) => void;
}

export function CategorySection({
  category,
  tasks,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onAddTask,
}: CategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showInput, setShowInput] = useState(false);

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  // Sort: incomplete first, then by priority, then by due date
  const sortedTasks = [...tasks].sort((a, b) => {
    // Completed status
    if (a.completed !== b.completed) return a.completed ? 1 : -1;

    // Priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    // Due date
    if (a.dueDate && b.dueDate) {
      return a.dueDate.getTime() - b.dueDate.getTime();
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;

    return 0;
  });

  const handleAddTask = () => {
    if (newTaskTitle.trim() && onAddTask) {
      onAddTask({
        title: newTaskTitle.trim(),
        category: category.id,
      });
      setNewTaskTitle('');
      setShowInput(false);
    }
  };

  return (
    <div className="rounded-2xl bg-zinc-900 border-2 border-yellow-400/30 hover:border-yellow-400 transition-colors overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-zinc-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.icon}</span>
          <div className="text-left">
            <h3 className="font-semibold text-yellow-400">{category.name}</h3>
            <p className="text-xs text-zinc-500">
              {completedCount}/{totalCount} completed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress bar */}
          {totalCount > 0 && (
            <div className="w-20 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          )}

          {/* Expand/Collapse icon */}
          <svg
            className={`w-5 h-5 text-zinc-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Task List */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-2">
          {/* Quick Add Input */}
          {onAddTask && (
            <div className="mb-3">
              {showInput ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddTask();
                      if (e.key === 'Escape') {
                        setShowInput(false);
                        setNewTaskTitle('');
                      }
                    }}
                    placeholder={`Add ${category.name.toLowerCase()} task...`}
                    className="flex-1 px-3 py-2 bg-black border border-yellow-400/50 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
                    autoFocus
                  />
                  <button
                    onClick={handleAddTask}
                    disabled={!newTaskTitle.trim()}
                    className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 disabled:bg-zinc-700 disabled:text-zinc-500 text-black rounded-lg text-sm font-medium transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowInput(false);
                      setNewTaskTitle('');
                    }}
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowInput(true)}
                  className="w-full py-2 border-2 border-dashed border-zinc-700 hover:border-yellow-400 rounded-lg text-sm text-zinc-500 hover:text-yellow-400 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add task to {category.name}
                </button>
              )}
            </div>
          )}

          {sortedTasks.length === 0 && !showInput ? (
            <p className="text-sm text-zinc-600 text-center py-4">
              No tasks yet
            </p>
          ) : (
            sortedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => onToggleTask(task.id)}
                onDelete={() => onDeleteTask(task.id)}
                onEdit={(updates) => onEditTask(task.id, updates)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
