import React from 'react';
import { Search, LayoutGrid, List, LogOut, User as UserIcon, ArrowUpDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ searchQuery, setSearchQuery, viewMode, setViewMode, sortBy, setSortBy }) {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-slate-800 glass-card px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Search Input */}
      <div className="flex-1 max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search files, folders, documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full glass-input rounded-xl pl-9 pr-4 py-2 text-sm"
        />
      </div>

      {/* Controls & Profile */}
      <div className="flex items-center gap-3">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <ArrowUpDown className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-xs text-slate-200 outline-none cursor-pointer"
          >
            <option value="name" className="bg-slate-900 text-slate-200">Sort by Name</option>
            <option value="date" className="bg-slate-900 text-slate-200">Sort by Date</option>
            <option value="size" className="bg-slate-900 text-slate-200">Sort by Size</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setViewMode('grid')}
            title="Grid View"
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'grid' ? 'bg-blue-600/30 text-blue-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            title="List View"
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'list' ? 'bg-blue-600/30 text-blue-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* User Profile & Sign Out */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">{user?.name || 'User'}</p>
            <p className="text-[10px] text-slate-400 leading-tight">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
