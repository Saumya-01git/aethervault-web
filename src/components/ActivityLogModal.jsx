import React, { useState, useEffect } from 'react';
import { X, History, UploadCloud, FolderPlus, Trash2, RotateCcw, Star, ShieldCheck, Share2, FileText, Loader2, Sparkles } from 'lucide-react';
import api from '../api/client';

const getActionBadge = (action = '') => {
  switch (action) {
    case 'UPLOAD_FILE':
      return { icon: UploadCloud, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', label: 'File Upload' };
    case 'CREATE_FOLDER':
      return { icon: FolderPlus, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', label: 'New Folder' };
    case 'DELETE_FILE':
    case 'DELETE_FOLDER':
      return { icon: Trash2, color: 'text-red-400 bg-red-500/10 border-red-500/20', label: 'Moved to Trash' };
    case 'RESTORE_ITEM':
      return { icon: RotateCcw, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', label: 'Restored' };
    case 'STAR_ITEM':
      return { icon: Star, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', label: 'Starred' };
    case 'SHARE_RESOURCE':
      return { icon: Share2, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', label: 'Shared' };
    case 'UPDATE_PROFILE':
    case 'UPDATE_PASSWORD':
      return { icon: ShieldCheck, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', label: 'Security' };
    default:
      return { icon: FileText, color: 'text-slate-400 bg-slate-500/10 border-slate-500/20', label: 'Activity' };
  }
};

const formatRelativeTime = (isoString) => {
  if (!isoString) return 'recently';
  const now = new Date();
  const date = new Date(isoString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 30) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const mins = Math.floor(diffInSeconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default function ActivityLogModal({ isOpen, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.get('/activity')
        .then(res => setLogs(res.data?.logs || []))
        .catch(err => console.error('Failed to load activity logs:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="glass-card w-full max-w-xl max-h-[85vh] rounded-3xl p-6 shadow-2xl border border-slate-800 flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-purple-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Activity & Audit History</span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </h2>
              <p className="text-xs text-slate-400">Real-time timeline of your cloud storage actions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Logs Timeline */}
        <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-1">
          {loading ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-2">
              <Loader2 className="w-7 h-7 animate-spin text-cyan-400" />
              <span className="text-xs">Loading activity timeline...</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-16 text-center text-slate-400 glass-card rounded-2xl p-6 border border-slate-800">
              <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-white">No activity logged yet</p>
              <p className="text-xs text-slate-500 mt-1">Actions like file uploads, folder creation, and stars will appear here.</p>
            </div>
          ) : (
            logs.map((log) => {
              const badge = getActionBadge(log.action);
              const Icon = badge.icon;
              return (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl glass-card border border-slate-800/80 hover:bg-slate-900/60 transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${badge.color}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white truncate max-w-[220px] sm:max-w-xs">
                          {log.resourceName || log.action}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      {log.details && (
                        <p className="text-xs text-slate-400 mt-0.5 leading-snug">{log.details}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 shrink-0 mt-1">
                    {formatRelativeTime(log.timestamp)}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Showing latest {logs.length} events</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
