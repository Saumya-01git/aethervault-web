import React from 'react';
import { X, Download, FileText, ExternalLink } from 'lucide-react';

export default function PreviewModal({ file, isOpen, onClose }) {
  if (!isOpen || !file) return null;

  const mimeType = file.mimeType || '';
  const isImage = mimeType.startsWith('image/');
  const isPdf = mimeType.includes('pdf');
  const isAudio = mimeType.startsWith('audio/');
  const isVideo = mimeType.startsWith('video/');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="glass-card w-full max-w-4xl max-h-[90vh] rounded-2xl p-6 shadow-2xl border border-slate-800 flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white truncate max-w-md">{file.name}</h2>
              <p className="text-[10px] text-slate-400">{file.mimeType} • {(file.sizeBytes / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {file.downloadUrl && (
              <a
                href={file.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Preview Container */}
        <div className="flex-1 overflow-auto bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-center p-4 min-h-[350px]">
          {isImage && file.downloadUrl ? (
            <img
              src={file.downloadUrl}
              alt={file.name}
              className="max-h-[60vh] object-contain rounded-lg shadow-lg"
            />
          ) : isPdf && file.downloadUrl ? (
            <iframe
              src={file.downloadUrl}
              title={file.name}
              className="w-full h-[60vh] rounded-lg border-0"
            />
          ) : isVideo && file.downloadUrl ? (
            <video controls className="max-h-[60vh] rounded-lg shadow-lg">
              <source src={file.downloadUrl} type={file.mimeType} />
              Your browser does not support the video tag.
            </video>
          ) : isAudio && file.downloadUrl ? (
            <audio controls className="w-full max-w-md">
              <source src={file.downloadUrl} type={file.mimeType} />
              Your browser does not support the audio element.
            </audio>
          ) : (
            <div className="text-center p-8 text-slate-400">
              <FileText className="w-16 h-16 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-300">No inline preview available</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">Click download to view this file format.</p>
              {file.downloadUrl && (
                <a
                  href={file.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:underline"
                >
                  <span>Open in external viewer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
