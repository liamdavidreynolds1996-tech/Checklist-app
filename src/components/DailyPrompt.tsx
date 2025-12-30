import { useState } from 'react';
import type { Task, Category } from '../types';
import { CATEGORIES } from '../types';

interface DailyPromptProps {
  onAddTasks: (tasks: Array<Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>) => void;
}

interface ParsedTask {
  title: string;
  category: Category;
  priority: 'low' | 'medium' | 'high';
  selected: boolean;
}

// Auto-detect category based on keywords
function detectCategory(text: string): Category {
  const lower = text.toLowerCase();

  // Work keywords - check first for work-specific terms
  if (/\b(work|office|meeting|email|project|deadline|boss|client|report|presentation|call with|zoom|teams|standup|sprint|jira|slack)\b/.test(lower)) {
    return 'work';
  }

  // Health keywords
  if (/\b(gym|exercise|workout|run|walk|jog|doctor|dentist|health|yoga|meditat|sleep|vitamin|medicine|appointment|checkup|therapy|physio)\b/.test(lower)) {
    return 'health';
  }

  // Finance keywords
  if (/\b(pay|bill|bank|money|budget|tax|invoice|rent|mortgage|insurance|invest|salary|expense|transfer|savings)\b/.test(lower)) {
    return 'finance';
  }

  // Social keywords - check before learning to catch "meet friend" etc
  if (/\b(call mom|call dad|call friend|visit|party|dinner with|lunch with|meet up|friend|family|birthday|wedding|event|drinks with|coffee with)\b/.test(lower)) {
    return 'social';
  }

  // Learning keywords - be more specific, exclude "book" when followed by travel/appointment words
  // "book" as a verb (booking something) should not trigger learning
  const isBookingAction = /\b(book|reserve|schedule)\s+(a\s+)?(train|flight|ticket|hotel|appointment|table|restaurant|cab|uber|taxi|room)\b/.test(lower);
  if (!isBookingAction && /\b(study|learn|read\s+a?\s*book|course|class|practice|tutorial|lesson|homework|research|exam|textbook|library|reading)\b/.test(lower)) {
    return 'learning';
  }

  // Personal - catch travel, errands, and home tasks
  if (/\b(clean|laundry|grocery|shop|cook|errand|home|house|car|fix|repair|organize|book\s|reserve|ticket|travel|pack|trip|airport|train|flight)\b/.test(lower)) {
    return 'personal';
  }

  return 'personal';
}

// Detect priority based on keywords
function detectPriority(text: string): 'low' | 'medium' | 'high' {
  const lower = text.toLowerCase();

  if (/\b(urgent|asap|important|critical|must|deadline today|high priority)\b/.test(lower)) {
    return 'high';
  }
  if (/\b(maybe|later|when possible|low priority|sometime|eventually)\b/.test(lower)) {
    return 'low';
  }

  return 'medium';
}

// Clean up task text
function cleanTaskText(text: string): string {
  return text
    // Remove common prefixes
    .replace(/^(i need to|i have to|i want to|i should|i must|i gotta|gotta|need to|have to|want to|should|must|going to|gonna|will|i'll|i will)\s+/i, '')
    // Remove leading/trailing punctuation and whitespace
    .replace(/^[\s,.\-–—]+|[\s,.\-–—]+$/g, '')
    // Capitalize first letter
    .replace(/^./, c => c.toUpperCase())
    .trim();
}

// Parse input into individual tasks
function parseInput(input: string): ParsedTask[] {
  // Split on common delimiters
  const segments = input
    .split(/(?:,\s*(?:and\s+)?|(?:\s+and\s+)|\.\s+|\n+|;\s*|then\s+)/i)
    .map(s => s.trim())
    .filter(s => s.length > 2); // Filter out very short segments

  const tasks: ParsedTask[] = [];
  const seen = new Set<string>();

  for (const segment of segments) {
    const cleaned = cleanTaskText(segment);
    if (cleaned.length < 3) continue;

    // Skip duplicates
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    tasks.push({
      title: cleaned,
      category: detectCategory(segment),
      priority: detectPriority(segment),
      selected: true,
    });
  }

  return tasks;
}

export function DailyPrompt({ onAddTasks }: DailyPromptProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState<ParsedTask[]>([]);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    const parsed = parseInput(prompt);
    if (parsed.length > 0) {
      setSuggestions(parsed);
    }
  };

  const toggleSuggestion = (index: number) => {
    setSuggestions(prev =>
      prev.map((s, i) => (i === index ? { ...s, selected: !s.selected } : s))
    );
  };

  const addSelectedTasks = () => {
    const selected = suggestions.filter(s => s.selected);
    onAddTasks(
      selected.map(s => ({
        title: s.title,
        category: s.category,
        completed: false,
        dueDate: new Date(),
        timeframe: 'daily' as const,
        priority: s.priority,
      }))
    );
    setSuggestions([]);
    setPrompt('');
  };

  return (
    <div className="bg-zinc-900 border-2 border-yellow-400 rounded-2xl mb-6 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
        aria-expanded={isExpanded}
        aria-controls="daily-planner-content"
      >
        <h3 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Quick Daily Planner
        </h3>
        <svg
          className={`w-5 h-5 text-yellow-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div id="daily-planner-content" className="px-4 pb-4">
          <p className="text-sm text-zinc-400 mb-3">
            Describe your day and I'll create tasks automatically (separate with commas or "and")
          </p>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
            placeholder="e.g., Go to the gym, finish the project report, call mom, pay electric bill, pick up groceries..."
            className="w-full px-3 py-2 bg-black border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 resize-none mb-3"
            rows={2}
          />

          {suggestions.length === 0 ? (
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className="w-full py-2 bg-yellow-400 hover:bg-yellow-300 disabled:bg-zinc-800 disabled:text-zinc-600 text-black rounded-lg text-sm font-medium transition-colors"
            >
              Generate Tasks
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-white">Generated Tasks:</h4>
                <span className="text-xs text-zinc-500">{suggestions.filter(s => s.selected).length} selected</span>
              </div>
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 bg-black border border-zinc-700 rounded-lg hover:border-yellow-400 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={suggestion.selected}
                    onChange={() => toggleSuggestion(index)}
                    className="mt-1 rounded border-zinc-600 text-yellow-400 focus:ring-yellow-400 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{suggestion.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs ${
                        suggestion.priority === 'high' ? 'text-red-400' :
                        suggestion.priority === 'low' ? 'text-zinc-500' : 'text-zinc-400'
                      }`}>
                        {suggestion.priority}
                      </span>
                    </div>
                  </div>
                  <select
                    value={suggestion.category}
                    onChange={(e) => {
                      setSuggestions(prev =>
                        prev.map((s, i) => i === index ? { ...s, category: e.target.value as Category } : s)
                      );
                    }}
                    className="px-2 py-1 bg-zinc-700 border border-zinc-600 rounded text-xs text-white focus:outline-none focus:border-yellow-400 cursor-pointer"
                    aria-label="Select category"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={addSelectedTasks}
                  disabled={!suggestions.some(s => s.selected)}
                  className="flex-1 py-2 bg-yellow-400 hover:bg-yellow-300 disabled:bg-zinc-800 disabled:text-zinc-600 text-black rounded-lg text-sm font-medium transition-colors"
                >
                  Add Selected Tasks
                </button>
                <button
                  onClick={() => {
                    setSuggestions([]);
                    setPrompt('');
                  }}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
