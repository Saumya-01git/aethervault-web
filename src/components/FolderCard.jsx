import React from 'react';
import { Folder, Share2, Trash2, Edit2, Star, ChevronRight } from 'lucide-react';

export default function FolderCard({ folder, onOpen, onRename, onDelete, onShare, onToggleStar, viewMode = 'grid' }) {
  const isStarred = Boolean(folder.isStarred);

  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => onOpen(folder.id)}
        className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer group transition-all duration-300 border-2 shadow-md ${
          isStarred 
            ? 'bg-slate-900/95 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
            : 'bg-slate-900/95 border-indigo-500/40 hover:border-cyan-400 shadow-[0_4px_20px_rgba(99,102,241,0.15)] hover:shadow-[0_8px_30px_rgba(56,189,248,0.3)]'
        }`}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600/30 to-indigo-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
            <Folder className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-sm font-bold text-white group-hover:text-cyan-300 truncate flex items-center gap-1.5">
              <span className="truncate">{folder.name}</span>
              {isStarred && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 inline shrink-0" />}
            </span>
            <p className="text-[11px] font-medium text-slate-300 mt-0.5">Directory Folder</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {onToggleStar && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleStar('folder', folder.id, isStarred); }}
              title={isStarred ? 'Unstar' : 'Star'}
              className={`p-2 rounded-xl transition-all ${
                isStarred 
                  ? 'text-amber-400 bg-amber-500/20 border border-amber-500/40 shadow-sm shadow-amber-500/20' 
                  : 'text-slate-300 hover:text-amber-400 hover:bg-slate-800'
              }`}
            >
              <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          )}
          {onShare && (
            <button
              onClick={(e) => { e.stopPropagation(); onShare(folder); }}
              title="Share"
              className="p-2 rounded-xl text-slate-300 hover:text-blue-400 hover:bg-slate-800"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onRename(folder); }}
            title="Rename"
            className="p-2 rounded-xl text-slate-300 hover:text-blue-400 hover:bg-slate-800"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(folder.id); }}
            title="Delete"
            className="p-2 rounded-xl text-slate-300 hover:text-red-400 hover:bg-slate-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onOpen(folder.id)}
      className={`p-4.5 rounded-3xl cursor-pointer group transition-all duration-300 border-2 flex flex-col justify-between hover:-translate-y-1.5 ${
        isStarred 
          ? 'bg-slate-900/95 border-amber-500/60 shadow-[0_0_25px_rgba(245,158,11,0.25)]' 
          : 'bg-slate-900/95 border-indigo-500/40 hover:border-cyan-400 shadow-[0_4px_20px_rgba(99,102,241,0.15)] hover:shadow-[0_8px_30px_rgba(56,189,248,0.3)]'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600/30 to-indigo-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
          <Folder className="w-5.5 h-5.5" />
        </div>
        <div className="flex items-center gap-1 transition-all">
          {onToggleStar && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleStar('folder', folder.id, isStarred); }}
              title={isStarred ? 'Unstar' : 'Star'}
              className={`p-1.5 rounded-xl transition-all ${
                isStarred 
                  ? 'text-amber-400 bg-amber-500/20 border border-amber-500/40 shadow-sm shadow-amber-500/20' 
                  : 'text-slate-300 hover:text-amber-400 hover:bg-slate-800'
              }`}
            >
              <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          )}
          {onShare && (
            <button
              onClick={(e) => { e.stopPropagation(); onShare(folder); }}
              title="Share"
              className="p-1.5 rounded-xl text-slate-300 hover:text-blue-400 hover:bg-slate-800"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onRename(folder); }}
            title="Rename"
            className="p-1.5 rounded-xl text-slate-300 hover:text-blue-400 hover:bg-slate-800"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(folder.id); }}
            title="Delete"
            className="p-1.5 rounded-xl text-slate-300 hover:text-red-400 hover:bg-slate-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div>
        <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 truncate flex items-center justify-between gap-1">
          <span>{folder.name}</span>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 transition-colors" />
        </h3>
        <p className="text-[11px] font-medium text-slate-300 mt-1">Directory Folder</p>
      </div>
    </div>
  );
}
