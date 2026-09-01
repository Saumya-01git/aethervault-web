import React from 'react';
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
  Star
} from 'lucide-react';

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const getFileIcon = (mimeType = '') => {
  if (mimeType.startsWith('image/')) return ImageIcon;
  if (mimeType.startsWith('video/')) return Film;
  if (mimeType.startsWith('audio/')) return Music;
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return FileText;
  if (mimeType.includes('json') || mimeType.includes('javascript') || mimeType.includes('html')) return FileCode;
  if (mimeType.includes('sheet') || mimeType.includes('csv') || mimeType.includes('excel')) return FileSpreadsheet;
  if (mimeType.includes('zip') || mimeType.includes('tar') || mimeType.includes('rar')) return Archive;
  return File;
};

export default function FileCard({ file, onPreview, onDelete, onShare, onToggleStar, viewMode = 'grid' }) {
  const Icon = getFileIcon(file.mimeType);
  const isStarred = file.isStarred;

  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => onPreview(file)}
        className="flex items-center justify-between p-3 rounded-xl glass-card hover:bg-slate-800/60 cursor-pointer group border border-slate-800 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200 group-hover:text-white truncate max-w-[200px] sm:max-w-md">
              {file.name}
            </p>
            <p className="text-[10px] text-slate-500">{formatFileSize(file.sizeBytes)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onToggleStar && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleStar('file', file.id, isStarred); }}
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
              onClick={(e) => { e.stopPropagation(); onShare(file); }}
              title="Share"
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-700/50"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onPreview(file); }}
            title="Preview"
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-700/50"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {file.downloadUrl && (
            <a
              href={file.downloadUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Download"
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-700/50"
            >
              <Download className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(file.id); }}
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
      onClick={() => onPreview(file)}
      className="glass-card p-4 rounded-2xl hover:bg-slate-800/60 border border-slate-800/80 cursor-pointer group transition-all shadow-md flex flex-col justify-between"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-inner">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onToggleStar && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleStar('file', file.id, isStarred); }}
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
              onClick={(e) => { e.stopPropagation(); onShare(file); }}
              title="Share"
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-700/50"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onPreview(file); }}
            title="Preview"
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-700/50"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {file.downloadUrl && (
            <a
              href={file.downloadUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Download"
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-700/50"
            >
              <Download className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(file.id); }}
            title="Delete"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700/50"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-sm text-slate-200 group-hover:text-white truncate flex items-center justify-between" title={file.name}>
          <span>{file.name}</span>
          {isStarred && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 inline shrink-0" />}
        </h3>
        <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
          <span>{formatFileSize(file.sizeBytes)}</span>
          <span className="capitalize">{file.mimeType?.split('/')[1] || 'file'}</span>
        </div>
      </div>
    </div>
  );
}
