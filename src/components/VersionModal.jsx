import React, { useState, useEffect } from 'react';
import { History, X, Download, FileText, Clock } from 'lucide-react';
import api from '../api/client';

export default function VersionModal({ file, isOpen, onClose }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && file) {
      fetchVersions();
    }
  }, [isOpen, file]);

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/files/${file.id}/versions`);
      setVersions(res.data.versions || []);
    } catch (err) {
      console.error('Failed to fetch versions:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-800 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2 text-white font-semibold">
            <History className="w-5 h-5 text-blue-400" />
            <span className="truncate max-w-[280px]">Version History: {file.name}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {versions.map((ver, idx) => (
              <div key={ver.id || idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    v{ver.versionNumber || (versions.length - idx)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">
                      {idx === 0 ? 'Current Version' : `Version ${ver.versionNumber || (versions.length - idx)}`}
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{new Date(ver.createdAt || file.createdAt).toLocaleString()}</span>
                    </p>
                  </div>
                </div>

                {file.downloadUrl && (
                  <a
                    href={file.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    title="Download Version"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
