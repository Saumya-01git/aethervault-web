import React from 'react';
import { Folder, Share2, Trash2, Edit2, Star } from 'lucide-react';

export default function FolderCard({ folder, onOpen, onRename, onDelete, onShare, onToggleStar, viewMode = 'grid' }) {
  const isStarred = folder.isStarred;

  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => onOpen(folder.id)}
        className="flex items-center justify-between p-3 rounded-xl glass-card hover:bg-slate-800/60 cursor-pointer group border border-slate-800 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Folder className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-slate-200 group-hover:text-white truncate max-w-[200px] sm:max-w-md">
            {folder.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onToggleStar && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleStar('folder', folder.id, isStarred); }}
              title={isStarred ? 'Unstar' : 'Star'}
              className={`p-1.5 rounded-lg transition-colors ${
                isStarred ? 'text-amber-400 hover:bg-slate-700/50' : 'text-slate-400 hover:text-amber-400 hover:bg-slate-700/50'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400' : ''}`} />
            </button>
          )}
          {onShare && (
            <button
              onClick={(e) => { e.stopPropagation(); onShare(folder); }}
              title="Share"
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-700/50"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onRename(folder); }}
            title="Rename"
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-700/50"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(folder.id); }}
            title="Delete"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700/50"
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
      className="glass-card p-4 rounded-2xl hover:bg-slate-800/60 border border-slate-800/80 cursor-pointer group transition-all shadow-md flex flex-col justify-between"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shadow-inner">
          <Folder className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onToggleStar && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleStar('folder', folder.id, isStarred); }}
              title={isStarred ? 'Unstar' : 'Star'}
              className={`p-1.5 rounded-lg transition-colors ${
                isStarred ? 'text-amber-400 hover:bg-slate-700/50' : 'text-slate-400 hover:text-amber-400 hover:bg-slate-700/50'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400' : ''}`} />
            </button>
          )}
          {onShare && (
            <button
              onClick={(e) => { e.stopPropagation(); onShare(folder); }}
              title="Share"
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-700/50"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onRename(folder); }}
            title="Rename"
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-700/50"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(folder.id); }}
            title="Delete"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700/50"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-sm text-slate-200 group-hover:text-white truncate flex items-center justify-between">
          <span>{folder.name}</span>
          {isStarred && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 inline shrink-0" />}
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5">Folder</p>
      </div>
    </div>
  );
}
