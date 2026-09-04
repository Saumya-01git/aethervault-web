import React from 'react';
import { Folder, Share2, Trash2, Edit2, Star, ChevronRight } from 'lucide-react';

export default function FolderCard({ folder, onOpen, onRename, onDelete, onShare, onToggleStar, viewMode = 'grid' }) {
  const isStarred = Boolean(folder.isStarred);

  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => onOpen(folder.id)}
        className="flex items-center justify-between p-3.5 rounded-2xl glass-card hover:bg-slate-900/80 cursor-pointer group border border-slate-800/80 hover:border-blue-500/40 transition-all duration-300 shadow-sm hover:shadow-[0_4px_20px_rgba(59,130,246,0.1)]"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Folder className="w-4.5 h-4.5" />
          </div>
          <span className="text-sm font-semibold text-slate-200 group-hover:text-white truncate max-w-[200px] sm:max-w-md flex items-center gap-1.5">
            <span>{folder.name}</span>
            {isStarred && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 inline shrink-0" />}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onToggleStar && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleStar('folder', folder.id, isStarred); }}
              title={isStarred ? 'Unstar' : 'Star'}
              className={`p-1.5 rounded-xl transition-all ${
                isStarred 
                  ? 'text-amber-400 bg-amber-500/20 border border-amber-500/30 shadow-sm shadow-amber-500/20' 
                  : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          )}
          {onShare && (
            <button
              onClick={(e) => { e.stopPropagation(); onShare(folder); }}
              title="Share"
              className="p-1.5 rounded-xl text-slate-400 hover:text-blue-400 hover:bg-slate-800"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onRename(folder); }}
            title="Rename"
            className="p-1.5 rounded-xl text-slate-400 hover:text-blue-400 hover:bg-slate-800"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(folder.id); }}
            title="Delete"
            className="p-1.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onOpen(folder.id)}
      className={`glass-card p-4.5 rounded-3xl border cursor-pointer group transition-all duration-300 shadow-lg hover:-translate-y-1.5 flex flex-col justify-between ${
        isStarred 
          ? 'border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-slate-900/60 to-slate-900/80 shadow-[0_0_20px_rgba(245,158,11,0.15)]' 
          : 'border-slate-800/80 hover:border-blue-500/40 hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)]'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
          <Folder className="w-5.5 h-5.5" />
        </div>
        <div className="flex items-center gap-1 transition-opacity opacity-90 group-hover:opacity-100">
          {onToggleStar && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleStar('folder', folder.id, isStarred); }}
              title={isStarred ? 'Unstar' : 'Star'}
              className={`p-1.5 rounded-xl transition-all ${
                isStarred 
                  ? 'text-amber-400 bg-amber-500/20 border border-amber-500/30 shadow-sm shadow-amber-500/20' 
                  : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          )}
          {onShare && (
            <button
              onClick={(e) => { e.stopPropagation(); onShare(folder); }}
              title="Share"
              className="p-1.5 rounded-xl text-slate-400 hover:text-blue-400 hover:bg-slate-800"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onRename(folder); }}
            title="Rename"
            className="p-1.5 rounded-xl text-slate-400 hover:text-blue-400 hover:bg-slate-800"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(folder.id); }}
            title="Delete"
            className="p-1.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div>
        <h3 className="font-bold text-sm text-slate-200 group-hover:text-white truncate flex items-center justify-between gap-1">
          <span>{folder.name}</span>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
        </h3>
        <p className="text-[11px] font-medium text-slate-400 mt-1">Directory Folder</p>
      </div>
    </div>
  );
}
