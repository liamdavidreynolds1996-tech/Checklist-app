import { useState } from 'react';
import type { Task, Category } from '../types';
import { CATEGORIES } from '../types';
import { formatRecurrence } from '../services/nlp';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (updates: Partial<Task>) => void;
}

// Strip markdown syntax from text
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1') // Bold **text**
    .replace(/\*(.+?)\*/g, '$1')     // Italic *text*
    .replace(/__(.+?)__/g, '$1')     // Bold __text__
    .replace(/_(.+?)_/g, '$1')       // Italic _text_
    .replace(/~~(.+?)~~/g, '$1')     // Strikethrough
    .replace(/`(.+?)`/g, '$1')       // Inline code
    .replace(/\[(.+?)\]\(.+?\)/g, '$1'); // Links
}

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const currentCategory = CATEGORIES.find(c => c.id === task.category);
  const displayTitle = stripMarkdown(task.title);

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      onEdit({ title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleCategoryChange = (newCategory: Category) => {
    if (newCategory !== task.category) {
      onEdit({ category: newCategory });
    }
    setShowCategoryMenu(false);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete();
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      // Auto-dismiss after 3 seconds
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const formatDueDate = (date?: Date, time?: string) => {
    if (!date) return null;

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    let dateStr = '';
    if (isToday) dateStr = 'Today';
    else if (isTomorrow) dateStr = 'Tomorrow';
    else dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (time) {
      const [hours, minutes] = time.split(':').map(Number);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      dateStr += ` at ${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }

    return dateStr;
  };

  const priorityColors = {
    high: 'text-red-400',
    medium: 'text-zinc-500',
    low: 'text-zinc-600',
  };

  return (
    <div
      className={`group flex items-start gap-3 p-3 rounded-xl transition-all ${
        task.completed
          ? 'bg-zinc-800/30 opacity-60'
          : 'bg-zinc-800 hover:bg-zinc-700'
      }`}
    >
      {/* Checkbox - Square style */}
      <button
        onClick={onToggle}
        aria-label={task.completed ? `Mark "${displayTitle}" as incomplete` : `Mark "${displayTitle}" as complete`}
        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 transition-all ${
          task.completed
            ? 'bg-yellow-400 border-yellow-400'
            : 'border-zinc-500 hover:border-yellow-400'
        }`}
      >
        {task.completed && (
          <svg
            className="w-full h-full text-black task-complete"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveEdit();
              if (e.key === 'Escape') {
                setEditTitle(task.title);
                setIsEditing(false);
              }
            }}
            className="w-full bg-black px-2 py-1 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            autoFocus
          />
        ) : (
          <p
            className={`text-sm cursor-pointer ${
              task.completed ? 'line-through text-zinc-500' : 'text-white'
            }`}
            onClick={() => setIsEditing(true)}
            title="Click to edit"
          >
            {displayTitle}
          </p>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {/* Due date */}
          {task.dueDate && (
            <span className="text-xs text-zinc-500">
              {formatDueDate(task.dueDate, task.dueTime)}
            </span>
          )}

          {/* Recurrence */}
          {task.recurrence && (
            <span className="text-xs text-yellow-400">
              {formatRecurrence(task.recurrence)}
            </span>
          )}

          {/* Priority - only show if not medium */}
          {task.priority !== 'medium' && (
            <span className={`text-xs ${priorityColors[task.priority]}`}>
              {task.priority === 'high' ? '! ' : ''}
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          )}
        </div>
      </div>

      {/* Category Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowCategoryMenu(!showCategoryMenu)}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-xs transition-colors"
          aria-label={`Change category, currently ${currentCategory?.name}`}
        >
          <span aria-hidden="true">{currentCategory?.icon}</span>
          <svg className="w-3 h-3 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showCategoryMenu && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowCategoryMenu(false)}
            />
            {/* Menu */}
            <div className="absolute right-0 top-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-20 py-1 min-w-[140px]">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-zinc-700 transition-colors ${
                    cat.id === task.category ? 'text-yellow-400' : 'text-white'
                  }`}
                >
                  <span aria-hidden="true">{cat.icon}</span>
                  <span>{cat.name}</span>
                  {cat.id === task.category && (
                    <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete Button - visible on mobile, hover on desktop */}
      {showDeleteConfirm ? (
        <button
          onClick={handleDelete}
          className="px-2 py-1 rounded-lg bg-red-500 text-white text-xs font-medium animate-pulse"
          aria-label="Confirm delete"
        >
          Confirm?
        </button>
      ) : (
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-lg hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
          aria-label={`Delete "${displayTitle}"`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
