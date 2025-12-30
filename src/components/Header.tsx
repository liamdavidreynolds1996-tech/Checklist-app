import { useState } from 'react';
import type { User } from '../types';

interface HeaderProps {
  user: User | null;
  isFirebaseConfigured: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  onExportCSV?: () => void;
}

export function Header({
  user,
  isFirebaseConfigured,
  onSignIn,
  onSignOut,
  onExportCSV,
}: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="bg-black border-b-2 border-yellow-400 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">Daily Checklist</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* CSV Export - Desktop */}
          {onExportCSV && (
            <button
              onClick={onExportCSV}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-sm text-zinc-400 hover:text-yellow-400 transition-colors"
              aria-label="Export tasks to CSV"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </button>
          )}

          {/* User Info / Sign In */}
          {user ? (
            <div className="flex items-center gap-2">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-8 h-8 rounded-full border-2 border-yellow-400"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                  <span className="text-sm font-medium text-black">
                    {user.displayName?.[0] || user.email?.[0] || 'U'}
                  </span>
                </div>
              )}
              {isFirebaseConfigured && (
                <button
                  onClick={onSignOut}
                  className="hidden sm:block text-sm text-zinc-400 hover:text-yellow-400 transition-colors"
                >
                  Sign Out
                </button>
              )}
            </div>
          ) : isFirebaseConfigured ? (
            <button
              onClick={onSignIn}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black rounded-lg text-sm font-medium transition-colors"
            >
              Sign In
            </button>
          ) : null}

          {/* Menu Button for mobile */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-zinc-900 border border-zinc-800 hover:border-yellow-400 transition-colors sm:hidden"
            aria-label="Open menu"
            aria-expanded={showMenu}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {showMenu ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="sm:hidden border-t border-zinc-800 bg-zinc-900">
          <div className="px-4 py-3 space-y-2">
            {onExportCSV && (
              <button
                onClick={() => {
                  onExportCSV();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export to CSV
              </button>
            )}
            {user && isFirebaseConfigured && (
              <button
                onClick={() => {
                  onSignOut();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            )}
            {!isFirebaseConfigured && (
              <p className="px-3 py-2 text-xs text-zinc-500">
                Local Mode - Data saved to this browser only
              </p>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
