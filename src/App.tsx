import { useState, useCallback } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTasks } from './hooks/useTasks';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { CategorySection } from './components/CategorySection';
import { DailyTracker } from './components/DailyTracker';
import { DailyPrompt } from './components/DailyPrompt';
import { ShoppingList } from './components/ShoppingList';
import { CATEGORIES, type Task, type Category, type Timeframe } from './types';

type ViewMode = 'today' | 'categories' | 'timeframe' | 'all' | 'shopping';

export default function App() {
  const { user, loading: authLoading, isFirebaseConfigured, signIn, signOut } = useAuth();
  const {
    tasks,
    loading: tasksLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    getTasksByCategory,
    getTasksByTimeframe,
  } = useTasks(user?.uid || null, isFirebaseConfigured);

  const [viewMode, setViewMode] = useState<ViewMode>('today');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [localModeNoticeHidden, setLocalModeNoticeHidden] = useState(() => {
    return localStorage.getItem('localModeNoticeDismissed') === 'true';
  });

  const dismissLocalModeNotice = useCallback(() => {
    setLocalModeNoticeHidden(true);
    localStorage.setItem('localModeNoticeDismissed', 'true');
  }, []);

  const handleAddMultipleTasks = useCallback(async (
    newTasks: Array<Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>
  ) => {
    for (const task of newTasks) {
      await addTask({
        ...task,
        dueDate: task.dueDate || new Date(),
      });
    }
  }, [addTask]);

  const handleAddTask = useCallback(async (
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
  ) => {
    // Auto-set today's date if not specified
    const taskWithDate = {
      ...task,
      dueDate: task.dueDate || new Date(),
      timeframe: task.timeframe || 'daily' as Timeframe,
    };
    await addTask(taskWithDate);
  }, [addTask]);

  // Quick add from category section - auto sets today's date
  const handleQuickAddTask = useCallback(async (
    { title, category }: { title: string; category: Category }
  ) => {
    await addTask({
      title,
      category,
      completed: false,
      dueDate: new Date(), // Always today
      timeframe: 'daily',
      priority: 'medium',
    });
  }, [addTask]);

  // Export tasks to CSV
  const exportToCSV = useCallback(() => {
    const csv = [
      ['Title', 'Category', 'Status', 'Due Date', 'Timeframe', 'Priority'],
      ...tasks.map(t => [
        t.title,
        t.category,
        t.completed ? 'Completed' : 'Pending',
        t.dueDate?.toLocaleDateString() || '',
        t.timeframe,
        t.priority
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [tasks]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header
        user={user}
        isFirebaseConfigured={isFirebaseConfigured}
        onSignIn={signIn}
        onSignOut={signOut}
        onExportCSV={tasks.length > 0 ? exportToCSV : undefined}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Task Input - Hidden on Shopping view */}
        {viewMode !== 'shopping' && (
          <div className="mb-6">
            <TaskForm
              onSubmit={handleAddTask}
              defaultCategory={selectedCategory || 'personal'}
            />
          </div>
        )}

        {/* View Mode Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'today', label: 'Today' },
            { id: 'categories', label: 'By Category' },
            { id: 'timeframe', label: 'By Timeframe' },
            { id: 'all', label: 'All Tasks' },
            { id: 'shopping', label: 'Shopping' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id as ViewMode)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                viewMode === tab.id
                  ? 'bg-yellow-400 text-black'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-yellow-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category Filter - Hidden on Shopping view */}
        {viewMode !== 'shopping' && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                selectedCategory === null
                  ? 'bg-yellow-400 text-black'
                  : 'bg-zinc-900 text-zinc-400 hover:text-yellow-400 border border-zinc-800'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-yellow-400 text-black'
                    : 'bg-zinc-900 text-zinc-400 hover:text-yellow-400 border border-zinc-800'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {tasksLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Today View */}
            {viewMode === 'today' && (
              <>
                <DailyPrompt onAddTasks={handleAddMultipleTasks} />
                <DailyTracker
                  tasks={selectedCategory ? tasks.filter(t => t.category === selectedCategory) : tasks}
                  onToggleTask={toggleTask}
                  onDeleteTask={deleteTask}
                  onEditTask={updateTask}
                />
              </>
            )}

            {/* Categories View */}
            {viewMode === 'categories' && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {CATEGORIES
                  .filter(cat => !selectedCategory || cat.id === selectedCategory)
                  .map((category) => (
                    <CategorySection
                      key={category.id}
                      category={category}
                      tasks={getTasksByCategory(category.id)}
                      onToggleTask={toggleTask}
                      onDeleteTask={deleteTask}
                      onEditTask={updateTask}
                      onAddTask={handleQuickAddTask}
                    />
                  ))}
              </div>
            )}

            {/* Timeframe View */}
            {viewMode === 'timeframe' && (
              <div className="space-y-6">
                {(['daily', 'weekly', 'monthly', 'once'] as Timeframe[]).map((timeframe) => {
                  let timeframeTasks = getTasksByTimeframe(timeframe);
                  if (selectedCategory) {
                    timeframeTasks = timeframeTasks.filter(t => t.category === selectedCategory);
                  }
                  if (timeframeTasks.length === 0) return null;

                  const labels: Record<Timeframe, string> = {
                    daily: 'Daily',
                    weekly: 'Weekly',
                    monthly: 'Monthly',
                    once: 'One-time',
                  };

                  return (
                    <div key={timeframe}>
                      <h3 className="text-lg font-semibold mb-3 text-yellow-400">
                        {labels[timeframe]} ({timeframeTasks.length})
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {CATEGORIES.map((category) => {
                          const catTasks = timeframeTasks.filter(t => t.category === category.id);
                          if (catTasks.length === 0) return null;

                          return (
                            <CategorySection
                              key={`${timeframe}-${category.id}`}
                              category={category}
                              tasks={catTasks}
                              onToggleTask={toggleTask}
                              onDeleteTask={deleteTask}
                              onEditTask={updateTask}
                              onAddTask={handleQuickAddTask}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* All Tasks View */}
            {viewMode === 'all' && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-2">
                {tasks.length === 0 ? (
                  <p className="text-center text-zinc-500 py-8">
                    No tasks yet. Add your first task above!
                  </p>
                ) : (
                  [...tasks]
                    .filter(t => !selectedCategory || t.category === selectedCategory)
                    .sort((a, b) => {
                      if (a.completed !== b.completed) return a.completed ? 1 : -1;
                      const priorityOrder = { high: 0, medium: 1, low: 2 };
                      return priorityOrder[a.priority] - priorityOrder[b.priority];
                    })
                    .map((task) => {
                      const category = CATEGORIES.find(c => c.id === task.category)!;
                      return (
                        <div
                          key={task.id}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                            task.completed
                              ? 'bg-zinc-800/50 opacity-60'
                              : 'bg-zinc-800 hover:bg-zinc-700'
                          }`}
                        >
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all ${
                              task.completed
                                ? 'bg-yellow-400 border-yellow-400'
                                : 'border-zinc-500 hover:border-yellow-400'
                            }`}
                          >
                            {task.completed && (
                              <svg className="w-full h-full text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          <span className="text-lg">{category.icon}</span>
                          <span className={task.completed ? 'line-through text-zinc-500' : 'text-white'}>
                            {task.title}
                          </span>
                          <div className="ml-auto flex items-center gap-2">
                            <span className="text-xs text-yellow-400">{category.name}</span>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            )}

            {/* Shopping View */}
            {viewMode === 'shopping' && (
              <ShoppingList />
            )}
          </>
        )}
      </main>

      {/* Firebase Setup Notice - Dismissible */}
      {!isFirebaseConfigured && !localModeNoticeHidden && (
        <div className="fixed bottom-6 left-6 max-w-sm bg-zinc-900 border-2 border-yellow-400 rounded-xl p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm text-zinc-300">
              <strong className="text-yellow-400">Local Mode:</strong> Data saved to browser only.
            </p>
            <button
              onClick={dismissLocalModeNotice}
              className="text-zinc-500 hover:text-white transition-colors flex-shrink-0"
              aria-label="Dismiss notification"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
