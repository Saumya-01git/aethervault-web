import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ path = [], onNavigate }) {
  return (
    <nav className="flex items-center gap-1 text-xs text-slate-400 py-3">
      <button
        onClick={() => onNavigate(null)}
        className="flex items-center gap-1.5 hover:text-blue-400 transition-colors font-medium"
      >
        <Home className="w-3.5 h-3.5" />
        <span>My Drive</span>
      </button>

      {path.map((item, index) => (
        <React.Fragment key={item.id}>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <button
            onClick={() => onNavigate(item.id)}
            className={`hover:text-blue-400 transition-colors max-w-[150px] truncate ${
              index === path.length - 1 ? 'text-white font-semibold' : 'font-medium'
            }`}
          >
            {item.name}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}
