import React from 'react';
import { 
  HardDrive, 
  Users, 
  Star, 
  Clock, 
  Trash2, 
  Plus, 
  UploadCloud,
  Database,
  UserCheck,
  History,
  ShieldCheck
} from 'lucide-react';

const formatBytesShort = (bytes = 0) => {
  if (bytes === 0) return '0 MB';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function Sidebar({ activeTab, setActiveTab, onOpenCreateFolder, onOpenUploadModal, onOpenProfile, onOpenActivity, totalBytes = 0 }) {
  const navItems = [
    { id: 'my-drive', label: 'My Drive', icon: HardDrive },
    { id: 'shared', label: 'Shared with me', icon: Users },
    { id: 'starred', label: 'Starred', icon: Star },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'trash', label: 'Trash', icon: Trash2 },
  ];

  // Total Quota = 15 GB (15 * 1024 * 1024 * 1024 bytes)
  const maxQuotaBytes = 15 * 1024 * 1024 * 1024;
  const usedPercentage = Math.min(100, Math.max(1, (totalBytes / maxQuotaBytes) * 100));

  return (
    <aside className="w-64 bg-slate-950/70 backdrop-blur-2xl border-r border-slate-800/80 flex flex-col justify-between p-4 shrink-0 hidden md:flex min-h-screen z-10 select-none">
      <div>
        {/* Brand Logo & Cosmic Status */}
        <div className="flex items-center gap-3 px-2 py-3 mb-5 group cursor-pointer" onClick={() => setActiveTab('my-drive')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600/30 to-blue-600/30 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white leading-none tracking-tight group-hover:text-cyan-400 transition-colors">
              AetherVault
            </h1>
            <div className="flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] text-cyan-400 font-bold tracking-wider uppercase">Encrypted Cloud</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 mb-6">
          <button
            onClick={onOpenUploadModal}
            className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <UploadCloud className="w-4 h-4 animate-bounce" />
            <span>Upload File</span>
          </button>
          <button
            onClick={onOpenCreateFolder}
            className="w-full py-2 px-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs border border-slate-800 hover:border-cyan-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>New Folder</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer relative group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 to-blue-600/10 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-cyan-400 rounded-r-full shadow-[0_0_10px_#38bdf8]"></span>
                )}
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="space-y-2.5">
        {/* Security Vault Indicator */}
        <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 flex items-center gap-2.5 text-slate-300">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="text-[11px]">
            <p className="font-bold text-white leading-tight">AES-256 Shield</p>
            <p className="text-[10px] text-slate-400">Zero-Knowledge Cloud</p>
          </div>
        </div>

        {/* Activity Audit Log Trigger */}
        {onOpenActivity && (
          <button
            onClick={onOpenActivity}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-medium text-slate-400 hover:text-cyan-400 hover:bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/30 transition-all cursor-pointer"
          >
            <History className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Activity Audit Log</span>
          </button>
        )}

        {/* Profile & Settings Trigger */}
        <button
          onClick={onOpenProfile}
          className="w-full flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900/80 border border-slate-800/80 transition-all cursor-pointer"
        >
          <UserCheck className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Profile & Settings</span>
        </button>

        {/* Storage Quota Footer */}
        <div className="p-4 rounded-2xl glass-card-cosmic">
          <div className="flex items-center justify-between text-xs text-slate-200 font-bold mb-2">
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Storage Used</span>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono">{usedPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-950/80 rounded-full overflow-hidden mb-2.5 p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(56,189,248,0.5)]"
              style={{ width: `${Math.max(2, usedPercentage)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>{formatBytesShort(totalBytes)} used</span>
            <span>15 GB total</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

