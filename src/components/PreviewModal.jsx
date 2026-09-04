import React, { useState, useEffect } from 'react';
import { X, Download, FileText, ExternalLink, Loader2 } from 'lucide-react';
import api from '../api/client';

export default function PreviewModal({ file: initialFile, isOpen, onClose }) {
  const [fileDetails, setFileDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (initialFile && isOpen) {
      setFileDetails(initialFile);
      
      // If downloadUrl is missing, fetch full file details from API
      if (!initialFile.downloadUrl && initialFile.id) {
        setLoading(true);
        api.get(`/files/${initialFile.id}`)
          .then(res => {
            if (res.data?.file) {
              setFileDetails(res.data.file);
            }
          })
          .catch(err => {
            console.error('Failed to fetch file details:', err);
          })
          .finally(() => setLoading(false));
      }
    }
  }, [initialFile, isOpen]);

  if (!isOpen || !initialFile) return null;

  const file = fileDetails || initialFile;
  const fileName = file.name || '';
  const mimeType = file.mimeType || '';

  // Determine file format category
  const isImage = mimeType.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg)$/i.test(fileName);
  const isPdf = mimeType.includes('pdf') || /\.pdf$/i.test(fileName);
  const isAudio = mimeType.startsWith('audio/') || /\.(mp3|wav|ogg|aac|m4a)$/i.test(fileName);
  const isVideo = mimeType.startsWith('video/') || /\.(mp4|webm|mkv|mov)$/i.test(fileName);

  // Construct absolute URL fallback for local development if downloadUrl missing
  const activeUrl = file.downloadUrl || (file.storageKey ? `http://localhost:8080/uploads/${file.storageKey}` : null);

  // Direct File Download Trigger
  const handleDownload = async (e) => {
    if (e) e.stopPropagation();
    if (!activeUrl) return;

    setDownloading(true);
    try {
      const response = await fetch(activeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name || 'download';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Direct download error, opening fallback window:', err);
      window.open(activeUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

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
              <p className="text-[10px] text-slate-400">
                {file.mimeType || 'Unknown format'} • {file.sizeBytes ? (file.sizeBytes / 1024).toFixed(1) + ' KB' : 'Size unknown'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeUrl && (
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-lg shadow-blue-600/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                {downloading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>{downloading ? 'Downloading...' : 'Download'}</span>
              </button>
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
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
              <span className="text-xs">Loading media preview...</span>
            </div>
          ) : isImage && activeUrl ? (
            <img
              src={activeUrl}
              alt={file.name}
              className="max-h-[60vh] object-contain rounded-lg shadow-2xl border border-slate-800"
              onError={(e) => {
                console.error('Image preview failed to load:', activeUrl);
                e.target.style.display = 'none';
              }}
            />
          ) : isPdf && activeUrl ? (
            <iframe
              src={activeUrl}
              title={file.name}
              className="w-full h-[60vh] rounded-lg border-0"
            />
          ) : isVideo && activeUrl ? (
            <video controls className="max-h-[60vh] rounded-lg shadow-lg">
              <source src={activeUrl} type={file.mimeType || 'video/mp4'} />
              Your browser does not support the video tag.
            </video>
          ) : isAudio && activeUrl ? (
            <audio controls className="w-full max-w-md">
              <source src={activeUrl} type={file.mimeType || 'audio/mpeg'} />
              Your browser does not support the audio element.
            </audio>
          ) : (
            <div className="text-center p-8 text-slate-400">
              <FileText className="w-16 h-16 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-300">No inline preview available</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">Click download to view this file format.</p>
              {activeUrl && (
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:underline cursor-pointer"
                >
                  <span>Download file directly</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
