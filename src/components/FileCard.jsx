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

const getFileMeta = (mimeType = '', fileName = '') => {
  const name = fileName || '';
  if (mimeType.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(name)) {
    return {
      icon: ImageIcon,
      iconColor: 'text-cyan-300 bg-cyan-500/30 border-cyan-400',
      badgeColor: 'bg-cyan-500/30 text-cyan-200 border-cyan-400',
      cardStyle: 'bg-[#0b1329] border-2 border-cyan-400 shadow-[0_4px_25px_rgba(56,189,248,0.25)] hover:border-cyan-300 hover:shadow-[0_8px_35px_rgba(56,189,248,0.45)]',
    };
  }
  if (mimeType.startsWith('video/') || /\.(mp4|webm|mkv|mov|avi)$/i.test(name)) {
    return {
      icon: Film,
      iconColor: 'text-purple-300 bg-purple-500/30 border-purple-400',
      badgeColor: 'bg-purple-500/30 text-purple-200 border-purple-400',
      cardStyle: 'bg-[#0b1329] border-2 border-purple-400 shadow-[0_4px_25px_rgba(168,85,247,0.25)] hover:border-purple-300 hover:shadow-[0_8px_35px_rgba(168,85,247,0.45)]',
    };
  }
  if (mimeType.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|flac)$/i.test(name)) {
    return {
      icon: Music,
      iconColor: 'text-pink-300 bg-pink-500/30 border-pink-400',
      badgeColor: 'bg-pink-500/30 text-pink-200 border-pink-400',
      cardStyle: 'bg-[#0b1329] border-2 border-pink-400 shadow-[0_4px_25px_rgba(236,72,153,0.25)] hover:border-pink-300 hover:shadow-[0_8px_35px_rgba(236,72,153,0.45)]',
    };
  }
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text') || /\.(pdf|doc|docx|txt|md)$/i.test(name)) {
    return {
      icon: FileText,
      iconColor: 'text-blue-300 bg-blue-500/30 border-blue-400',
      badgeColor: 'bg-blue-500/30 text-blue-200 border-blue-400',
      cardStyle: 'bg-[#0b1329] border-2 border-blue-400 shadow-[0_4px_25px_rgba(59,130,246,0.25)] hover:border-blue-300 hover:shadow-[0_8px_35px_rgba(59,130,246,0.45)]',
    };
  }
  if (mimeType.includes('json') || mimeType.includes('javascript') || mimeType.includes('html') || /\.(js|jsx|ts|tsx|json|html|css|py)$/i.test(name)) {
    return {
      icon: FileCode,
      iconColor: 'text-amber-300 bg-amber-500/30 border-amber-400',
      badgeColor: 'bg-amber-500/30 text-amber-200 border-amber-400',
      cardStyle: 'bg-[#0b1329] border-2 border-amber-400 shadow-[0_4px_25px_rgba(245,158,11,0.25)] hover:border-amber-300 hover:shadow-[0_8px_35px_rgba(245,158,11,0.45)]',
    };
  }
  if (mimeType.includes('sheet') || mimeType.includes('csv') || mimeType.includes('excel') || /\.(xls|xlsx|csv)$/i.test(name)) {
    return {
      icon: FileSpreadsheet,
      iconColor: 'text-emerald-300 bg-emerald-500/30 border-emerald-400',
      badgeColor: 'bg-emerald-500/30 text-emerald-200 border-emerald-400',
      cardStyle: 'bg-[#0b1329] border-2 border-emerald-400 shadow-[0_4px_25px_rgba(16,185,129,0.25)] hover:border-emerald-300 hover:shadow-[0_8px_35px_rgba(16,185,129,0.45)]',
    };
  }
  if (mimeType.includes('zip') || mimeType.includes('tar') || mimeType.includes('rar') || /\.(zip|rar|7z|tar|gz)$/i.test(name)) {
    return {
      icon: Archive,
      iconColor: 'text-orange-300 bg-orange-500/30 border-orange-400',
      badgeColor: 'bg-orange-500/30 text-orange-200 border-orange-400',
      cardStyle: 'bg-[#0b1329] border-2 border-orange-400 shadow-[0_4px_25px_rgba(249,115,22,0.25)] hover:border-orange-300 hover:shadow-[0_8px_35px_rgba(249,115,22,0.45)]',
    };
  }
  return {
    icon: File,
    iconColor: 'text-indigo-300 bg-indigo-500/30 border-indigo-400',
    badgeColor: 'bg-indigo-500/30 text-indigo-200 border-indigo-400',
    cardStyle: 'bg-[#0b1329] border-2 border-indigo-400 shadow-[0_4px_25px_rgba(99,102,241,0.25)] hover:border-indigo-300 hover:shadow-[0_8px_35px_rgba(99,102,241,0.45)]',
  };
};

export default function FileCard({ file, onPreview, onDelete, onShare, onToggleStar, viewMode = 'grid' }) {
  const meta = getFileMeta(file.mimeType, file.name);
  const Icon = meta.icon;
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
        className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer group transition-all duration-300 ${
          isStarred 
            ? 'bg-[#0b1329] border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
            : meta.cardStyle
        }`}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${meta.iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white group-hover:text-cyan-300 truncate flex items-center gap-1.5">
              <span className="truncate">{file.name}</span>
              {isStarred && <Star className="w-4 h-4 text-amber-400 fill-amber-400 inline shrink-0" />}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] font-semibold text-slate-300">{formatFileSize(file.sizeBytes)}</span>
              <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border ${meta.badgeColor}`}>{ext}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {onToggleStar && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleStar('file', file.id, isStarred); }}
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
              onClick={(e) => { e.stopPropagation(); onShare(file); }}
              title="Share"
              className="p-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-slate-800"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onPreview(file); }}
            title="Preview"
            className="p-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-slate-800"
          >
            <Eye className="w-4 h-4" />
          </button>
          {downloadUrl && (
            <button
              onClick={handleDownload}
              disabled={downloading}
              title="Download File"
              className="p-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-slate-800 disabled:opacity-50"
            >
              {downloading ? <Loader2 className="w-4 h-4 animate-spin text-cyan-400" /> : <Download className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(file.id); }}
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
      onClick={() => onPreview(file)}
      className={`p-5 rounded-3xl cursor-pointer group transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 ${
        isStarred 
          ? 'bg-[#0b1329] border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.35)]' 
          : meta.cardStyle
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shadow-md transition-transform group-hover:scale-105 ${meta.iconColor}`}>
          <Icon className="w-5.5 h-5.5" />
        </div>
        <div className="flex items-center gap-1">
          {onToggleStar && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleStar('file', file.id, isStarred); }}
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
              onClick={(e) => { e.stopPropagation(); onShare(file); }}
              title="Share"
              className="p-1.5 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-slate-800"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onPreview(file); }}
            title="Preview"
            className="p-1.5 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-slate-800"
          >
            <Eye className="w-4 h-4" />
          </button>
          {downloadUrl && (
            <button
              onClick={handleDownload}
              disabled={downloading}
              title="Download File"
              className="p-1.5 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-slate-800 disabled:opacity-50"
            >
              {downloading ? <Loader2 className="w-4 h-4 animate-spin text-cyan-400" /> : <Download className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(file.id); }}
            title="Delete"
            className="p-1.5 rounded-xl text-slate-300 hover:text-red-400 hover:bg-slate-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 truncate flex-1" title={file.name}>
            {file.name}
          </h3>
          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border shrink-0 ${meta.badgeColor}`}>
            {ext}
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
          <span>{formatFileSize(file.sizeBytes)}</span>
          <span className="capitalize text-[10px] text-slate-400">{file.mimeType?.split('/')[1] || 'file'}</span>
        </div>
      </div>
    </div>
  );
}
