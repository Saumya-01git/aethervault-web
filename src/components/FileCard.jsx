import React, { useState } from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  FileCode, 
  FileSpreadsheet, 
  Film, 
  Music, 
  Archive, 
  File, 
  Download, 
  Trash2, 
  Eye,
  Share2,
  Star,
  Loader2
} from 'lucide-react';

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const getFileIcon = (mimeType = '') => {
  if (mimeType.startsWith('image/')) return { icon: ImageIcon, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' };
  if (mimeType.startsWith('video/')) return { icon: Film, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
  if (mimeType.startsWith('audio/')) return { icon: Music, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' };
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return { icon: FileText, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
  if (mimeType.includes('json') || mimeType.includes('javascript') || mimeType.includes('html')) return { icon: FileCode, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
  if (mimeType.includes('sheet') || mimeType.includes('csv') || mimeType.includes('excel')) return { icon: FileSpreadsheet, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
  if (mimeType.includes('zip') || mimeType.includes('tar') || mimeType.includes('rar')) return { icon: Archive, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' };
  return { icon: File, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' };
};

export default function FileCard({ file, onPreview, onDelete, onShare, onToggleStar, viewMode = 'grid' }) {
  const fileMeta = getFileIcon(file.mimeType);
  const Icon = fileMeta.icon;
  const isStarred = Boolean(file.isStarred);
  const resolveFileUrl = (url, storageKey) => {
    if (url && !url.includes('localhost:8080') && !url.includes('localhost:10000')) {
      return url;
    }
    if (!storageKey) return url;
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    const serverRoot = apiBase.replace(/\/api\/?$/, '');
    return `${serverRoot}/uploads/${storageKey}`;
  };

  const downloadUrl = resolveFileUrl(file.downloadUrl, file.storageKey);
  const [downloading, setDownloading] = useState(false);

  const ext = file.name ? file.name.split('.').pop().toUpperCase() : 'FILE';

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (!downloadUrl) return;

    setDownloading(true);
    try {
      const response = await fetch(downloadUrl);
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
      console.error('Download error, fallback opening:', err);
      window.open(downloadUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => onPreview(file)}
        className="flex items-center justify-between p-3.5 rounded-2xl glass-card hover:bg-slate-900/80 cursor-pointer group border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300 shadow-sm hover:shadow-[0_4px_20px_rgba(56,189,248,0.1)]"
      >
        <div className="flex items-center gap-3.5">
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-sm ${fileMeta.color}`}>
            <Icon className="w-4.5 h-4.5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200 group-hover:text-white truncate max-w-[200px] sm:max-w-md flex items-center gap-1.5">
              <span>{file.name}</span>
              {isStarred && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 inline shrink-0" />}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-medium text-slate-400">{formatFileSize(file.sizeBytes)}</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">{ext}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onToggleStar && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleStar('file', file.id, isStarred); }}
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
              onClick={(e) => { e.stopPropagation(); onShare(file); }}
              title="Share"
              className="p-1.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onPreview(file); }}
            title="Preview"
            className="p-1.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {downloadUrl && (
            <button
              onClick={handleDownload}
              disabled={downloading}
              title="Download File"
              className="p-1.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800 disabled:opacity-50"
            >
              {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" /> : <Download className="w-3.5 h-3.5" />}
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(file.id); }}
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
      onClick={() => onPreview(file)}
      className={`glass-card p-4.5 rounded-3xl border cursor-pointer group transition-all duration-300 shadow-lg hover:-translate-y-1.5 flex flex-col justify-between ${
        isStarred 
          ? 'border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-slate-900/60 to-slate-900/80 shadow-[0_0_20px_rgba(245,158,11,0.15)]' 
          : 'border-slate-800/80 hover:border-cyan-500/40 hover:shadow-[0_8px_30px_rgba(56,189,248,0.15)]'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shadow-md transition-transform group-hover:scale-105 ${fileMeta.color}`}>
          <Icon className="w-5.5 h-5.5" />
        </div>
        <div className={`flex items-center gap-1 transition-opacity ${isStarred ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          {onToggleStar && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleStar('file', file.id, isStarred); }}
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
              onClick={(e) => { e.stopPropagation(); onShare(file); }}
              title="Share"
              className="p-1.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onPreview(file); }}
            title="Preview"
            className="p-1.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {downloadUrl && (
            <button
              onClick={handleDownload}
              disabled={downloading}
              title="Download File"
              className="p-1.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800 disabled:opacity-50"
            >
              {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" /> : <Download className="w-3.5 h-3.5" />}
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(file.id); }}
            title="Delete"
            className="p-1.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="font-bold text-sm text-slate-200 group-hover:text-white truncate flex-1" title={file.name}>
            {file.name}
          </h3>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-cyan-500/20 shrink-0">
            {ext}
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>{formatFileSize(file.sizeBytes)}</span>
          <span className="capitalize text-[10px] text-slate-500">{file.mimeType?.split('/')[1] || 'file'}</span>
        </div>
      </div>
    </div>
  );
}
