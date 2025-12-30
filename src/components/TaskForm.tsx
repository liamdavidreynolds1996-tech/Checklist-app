import { useState, useEffect } from 'react';
import type { Category, Task, Timeframe, Priority } from '../types';
import { CATEGORIES } from '../types';
import { parseNaturalLanguage } from '../services/nlp';
import { VoiceInput } from './VoiceInput';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  defaultCategory?: Category;
}

export function TaskForm({ onSubmit, defaultCategory = 'personal' }: TaskFormProps) {
  const [input, setInput] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [category, setCategory] = useState<Category>(defaultCategory);
  const [priority, setPriority] = useState<Priority>('medium');
  const [timeframe, setTimeframe] = useState<Timeframe>('daily');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');

  // Parse input for suggestions
  const [parsed, setParsed] = useState<ReturnType<typeof parseNaturalLanguage> | null>(null);

  useEffect(() => {
    if (input.length > 3) {
      const result = parseNaturalLanguage(input);
      setParsed(result);

      // Auto-update fields based on parsing
      if (result.category) setCategory(result.category);
      if (result.priority !== 'medium') setPriority(result.priority);
      if (result.timeframe !== 'once') setTimeframe(result.timeframe);
    } else {
      setParsed(null);
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const parsedTask = parseNaturalLanguage(input);

    // Default to today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    onSubmit({
      title: parsedTask.title || input.trim(),
      category: category,
      completed: false,
      dueDate: dueDate ? new Date(dueDate) : parsedTask.dueDate || today,
      dueTime: dueTime || parsedTask.dueTime,
      timeframe: timeframe,
      recurrence: parsedTask.recurrence,
      priority: priority,
    });

    // Reset form
    setInput('');
    setShowAdvanced(false);
    setPriority('medium');
    setTimeframe('daily');
    setDueDate('');
    setDueTime('');
  };

  const handleVoiceInput = (text: string) => {
    setInput(text);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative order-1 sm:order-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a task... (e.g., 'gym every Monday at 6am')"
            className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-800 rounded-xl text-sm sm:text-base text-white focus:outline-none focus:border-yellow-400 placeholder-zinc-600"
          />

          {/* Parsing preview */}
          {parsed && (
            <div className="absolute left-0 right-0 top-full mt-1 px-3 py-2 bg-zinc-900 rounded-lg text-xs border border-zinc-700 z-10">
              <div className="flex flex-wrap gap-2">
                {parsed.category && (
                  <span className="px-2 py-0.5 bg-yellow-400/20 text-yellow-400 rounded">
                    {parsed.category}
                  </span>
                )}
                {parsed.dueDate && (
                  <span className="px-2 py-0.5 bg-yellow-400/20 text-yellow-400 rounded">
                    {parsed.dueDate.toLocaleDateString()}
                    {parsed.dueTime && ` at ${parsed.dueTime}`}
                  </span>
                )}
                {parsed.recurrence && (
                  <span className="px-2 py-0.5 bg-yellow-400/20 text-yellow-400 rounded">
                    Recurring
                  </span>
                )}
                {parsed.priority !== 'medium' && (
                  <span className={`px-2 py-0.5 rounded ${
                    parsed.priority === 'high'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-zinc-500/20 text-zinc-400'
                  }`}>
                    {parsed.priority}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 order-2 sm:order-2">
          <VoiceInput onTranscript={handleVoiceInput} />

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`p-3 rounded-xl transition-colors border-2 flex-shrink-0 ${
              showAdvanced
                ? 'bg-yellow-400 text-black border-yellow-400'
                : 'bg-zinc-900 border-zinc-800 hover:border-yellow-400 text-white'
            }`}
            title="Advanced options"
            aria-label="Advanced options"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </button>

          <button
            type="submit"
            disabled={!input.trim()}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 disabled:bg-zinc-800 disabled:text-zinc-600 text-black rounded-xl text-sm font-medium transition-colors flex-1 sm:flex-initial"
          >
            Add
          </button>
        </div>
      </div>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          {/* Category */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3 py-2 bg-black border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-yellow-400"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-3 py-2 bg-black border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-yellow-400"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Timeframe */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Timeframe</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as Timeframe)}
              className="w-full px-3 py-2 bg-black border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-yellow-400"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="once">One-time</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 bg-black border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-yellow-400"
            />
          </div>

          {/* Due Time */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Time</label>
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="w-full px-3 py-2 bg-black border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>
      )}
    </form>
  );
}
