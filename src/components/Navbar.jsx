import React, { useRef, useEffect } from 'react';
import { Search, LayoutGrid, List, LogOut, User as UserIcon, ArrowUpDown, X, History, Sparkles, Globe, Orbit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ searchQuery, setSearchQuery, viewMode, setViewMode, sortBy, setSortBy, themeMode = 'earth', setThemeMode, onOpenProfile, onOpenActivity }) {
  const { user, logout } = useAuth();
  const searchInputRef = useRef(null);

  // Keyboard shortcut listener (Ctrl + K or / to focus search)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="min-h-16 py-2 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-20 transition-all flex-wrap sm:flex-nowrap">
      {/* Search Input with Clear Button & Shortcut Badge */}
      <div className="flex-1 min-w-[140px] max-w-xs sm:max-w-md relative group">
        <Search className="w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search files, folders, documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full glass-input rounded-xl pl-9 pr-14 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500/50 focus:shadow-[0_0_20px_rgba(56,189,248,0.15)] transition-all"
        />
        {searchQuery ? (
          <button
            onClick={() => setSearchQuery('')}
            title="Clear Search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5 rounded-full hover:bg-slate-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-900 border border-slate-700/60 rounded shadow-inner">
              Ctrl K
            </kbd>
          </div>
        )}
      </div>

      {/* Controls & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Background Theme Mode Switcher */}
        {setThemeMode && (
          <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            <button
              onClick={() => setThemeMode('earth')}
              title="Earth Horizon Background"
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                themeMode === 'earth'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden md:inline">Earth</span>
            </button>
            <button
              onClick={() => setThemeMode('stream')}
              title="Galactic Stream S-Curve Background"
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                themeMode === 'stream'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Orbit className="w-3.5 h-3.5 text-purple-300" />
              <span className="hidden md:inline">Stream</span>
            </button>
          </div>
        )}

        {/* Activity Audit Log Trigger Button */}
        {onOpenActivity && (
          <button
            onClick={onOpenActivity}
            title="Activity Audit Log"
            className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 border border-slate-800 hover:border-cyan-500/30 transition-all flex items-center gap-1.5 cursor-pointer text-xs font-medium group"
          >
            <History className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform" />
            <span className="hidden lg:inline">Activity Log</span>
          </button>
        )}

        {/* Sort Dropdown */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 hover:border-slate-700 transition-colors">
          <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-xs text-slate-200 outline-none cursor-pointer"
          >
            <option value="date" className="bg-slate-900 text-slate-200">Sort by Date (Newest)</option>
            <option value="name" className="bg-slate-900 text-slate-200">Sort by Name</option>
            <option value="size" className="bg-slate-900 text-slate-200">Sort by Size</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-800">
          <button
            onClick={() => setViewMode('grid')}
            title="Grid View"
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            title="List View"
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'list' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* User Profile & Sign Out */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <button
            onClick={onOpenProfile}
            title="Open Profile & Settings"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer group"
          >
            <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-cyan-600/30 to-blue-600/30 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold text-sm group-hover:scale-105 transition-transform shadow-md shadow-cyan-500/10">
              {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-white leading-tight group-hover:text-cyan-400 transition-colors flex items-center gap-1">
                <span>{user?.name || 'User'}</span>
                <Sparkles className="w-3 h-3 text-cyan-400 inline" />
              </p>
              <p className="text-[10px] text-slate-400 leading-tight">{user?.email}</p>
            </div>
          </button>

          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}


