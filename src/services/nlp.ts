import * as chrono from 'chrono-node';
import type { Category, Timeframe, Priority, RecurrencePattern } from '../types';

interface ParsedTask {
  title: string;
  category?: Category;
  dueDate?: Date;
  dueTime?: string;
  timeframe: Timeframe;
  recurrence?: RecurrencePattern;
  priority: Priority;
}

// Keywords for category detection
const categoryKeywords: Record<Category, string[]> = {
  work: ['work', 'meeting', 'email', 'project', 'deadline', 'client', 'report', 'presentation', 'office', 'boss', 'colleague'],
  health: ['gym', 'workout', 'exercise', 'run', 'yoga', 'doctor', 'medicine', 'walk', 'sleep', 'diet', 'meditate', 'stretch'],
  personal: ['home', 'clean', 'laundry', 'grocery', 'cook', 'organize', 'declutter', 'fix', 'repair'],
  finance: ['pay', 'bill', 'budget', 'invest', 'bank', 'tax', 'expense', 'savings', 'money', 'rent', 'mortgage'],
  learning: ['read', 'study', 'learn', 'course', 'book', 'practice', 'tutorial', 'class', 'lesson', 'skill'],
  social: ['call', 'visit', 'meet', 'friend', 'family', 'party', 'dinner', 'lunch', 'birthday', 'event'],
};

// Keywords for priority detection
const priorityKeywords: Record<Priority, string[]> = {
  high: ['urgent', 'important', 'critical', 'asap', 'immediately', 'priority', 'must'],
  medium: ['should', 'need to', 'plan to'],
  low: ['maybe', 'could', 'sometime', 'eventually', 'when possible'],
};

// Recurrence patterns
const recurrencePatterns = [
  { pattern: /every\s+day/i, type: 'daily' as const, interval: 1 },
  { pattern: /daily/i, type: 'daily' as const, interval: 1 },
  { pattern: /every\s+week/i, type: 'weekly' as const, interval: 1 },
  { pattern: /weekly/i, type: 'weekly' as const, interval: 1 },
  { pattern: /every\s+month/i, type: 'monthly' as const, interval: 1 },
  { pattern: /monthly/i, type: 'monthly' as const, interval: 1 },
  { pattern: /every\s+(\d+)\s+days?/i, type: 'daily' as const },
  { pattern: /every\s+(\d+)\s+weeks?/i, type: 'weekly' as const },
];

const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function detectCategory(text: string): Category | undefined {
  const lowerText = text.toLowerCase();

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        return category as Category;
      }
    }
  }

  return undefined;
}

function detectPriority(text: string): Priority {
  const lowerText = text.toLowerCase();

  for (const [priority, keywords] of Object.entries(priorityKeywords)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        return priority as Priority;
      }
    }
  }

  return 'medium';
}

function detectRecurrence(text: string): RecurrencePattern | undefined {
  const lowerText = text.toLowerCase();

  // Check for specific days (e.g., "every Monday and Wednesday")
  const everyDaysMatch = lowerText.match(/every\s+((?:(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)(?:\s*(?:,|and)\s*)?)+)/i);
  if (everyDaysMatch) {
    const daysText = everyDaysMatch[1].toLowerCase();
    const days: number[] = [];

    dayNames.forEach((day, index) => {
      if (daysText.includes(day)) {
        days.push(index);
      }
    });

    if (days.length > 0) {
      return { type: 'weekly', days, interval: 1 };
    }
  }

  // Check for interval patterns
  for (const { pattern, type } of recurrencePatterns) {
    const match = lowerText.match(pattern);
    if (match) {
      const interval = match[1] ? parseInt(match[1]) : 1;
      return { type, interval };
    }
  }

  return undefined;
}

function detectTimeframe(text: string, hasRecurrence: boolean, dueDate?: Date): Timeframe {
  if (hasRecurrence) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('daily') || lowerText.includes('every day')) {
      return 'daily';
    }
    if (lowerText.includes('weekly') || lowerText.includes('every week') || /every\s+\w+day/i.test(lowerText)) {
      return 'weekly';
    }
    if (lowerText.includes('monthly') || lowerText.includes('every month')) {
      return 'monthly';
    }
  }

  if (dueDate) {
    const now = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return 'daily';
    if (diffDays <= 7) return 'weekly';
    if (diffDays <= 30) return 'monthly';
  }

  return 'once';
}

function cleanTitle(text: string): string {
  // Remove date/time phrases that chrono would have parsed
  let cleaned = text;

  // Remove common patterns
  const patternsToRemove = [
    /\b(at|on|by|before|after)\s+\d{1,2}(:\d{2})?\s*(am|pm)?\b/gi,
    /\b(today|tomorrow|tonight|this\s+\w+|next\s+\w+)\b/gi,
    /\bevery\s+(day|week|month|\w+day(?:\s*(?:,|and)\s*\w+day)*)\b/gi,
    /\b(daily|weekly|monthly)\b/gi,
    /\b(urgent|important|asap)\b/gi,
    /\b\d{1,2}\/\d{1,2}(?:\/\d{2,4})?\b/g,
  ];

  for (const pattern of patternsToRemove) {
    cleaned = cleaned.replace(pattern, '');
  }

  // Clean up extra spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Capitalize first letter
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return cleaned;
}

export function parseNaturalLanguage(input: string): ParsedTask {
  // Parse date/time using chrono
  const parsed = chrono.parse(input);
  let dueDate: Date | undefined;
  let dueTime: string | undefined;

  if (parsed.length > 0) {
    const result = parsed[0];
    dueDate = result.start.date();

    // Extract time if specified
    if (result.start.isCertain('hour')) {
      const hours = result.start.get('hour') || 0;
      const minutes = result.start.get('minute') || 0;
      dueTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  }

  // Detect recurrence
  const recurrence = detectRecurrence(input);

  // Detect other properties
  const category = detectCategory(input);
  const priority = detectPriority(input);
  const timeframe = detectTimeframe(input, !!recurrence, dueDate);

  // Clean title
  const title = cleanTitle(input);

  return {
    title,
    category,
    dueDate,
    dueTime,
    timeframe,
    recurrence,
    priority,
  };
}

export function formatRecurrence(recurrence: RecurrencePattern): string {
  if (recurrence.type === 'daily') {
    return recurrence.interval === 1 ? 'Daily' : `Every ${recurrence.interval} days`;
  }

  if (recurrence.type === 'weekly') {
    if (recurrence.days && recurrence.days.length > 0) {
      const dayLabels = recurrence.days.map(d => dayNames[d].slice(0, 3)).join(', ');
      return `Every ${dayLabels}`;
    }
    return recurrence.interval === 1 ? 'Weekly' : `Every ${recurrence.interval} weeks`;
  }

  if (recurrence.type === 'monthly') {
    return recurrence.interval === 1 ? 'Monthly' : `Every ${recurrence.interval} months`;
  }

  return '';
}
