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
  UserCheck
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onOpenCreateFolder, onOpenUploadModal, onOpenProfile }) {
  const navItems = [
    { id: 'my-drive', label: 'My Drive', icon: HardDrive },
    { id: 'shared', label: 'Shared with me', icon: Users },
    { id: 'starred', label: 'Starred', icon: Star },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'trash', label: 'Trash', icon: Trash2 },
  ];

  return (
    <aside className="w-64 glass-card border-r border-slate-800 flex flex-col justify-between p-4 shrink-0 hidden md:flex min-h-screen">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/10">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white leading-none">AetherVault</h1>
            <span className="text-[10px] text-blue-400 font-medium tracking-wider uppercase">Cloud Storage</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 mb-6">
          <button
            onClick={onOpenUploadModal}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload File</span>
          </button>
          <button
            onClick={onOpenCreateFolder}
            className="w-full py-2 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-medium text-xs border border-slate-700/50 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3">
        {/* Profile & Settings Trigger */}
        <button
          onClick={onOpenProfile}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 border border-slate-800/60 transition-all"
        >
          <UserCheck className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Profile & Settings</span>
        </button>

        {/* Storage Quota Footer */}
        <div className="p-4 rounded-xl glass-card bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium mb-2">
            <Database className="w-4 h-4 text-blue-400" />
            <span>Storage Usage</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-1/4 rounded-full"></div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>2.5 GB used</span>
            <span>15 GB total</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
