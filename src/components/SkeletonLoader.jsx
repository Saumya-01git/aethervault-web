import React from 'react';

export default function SkeletonLoader({ viewMode = 'grid', count = 4 }) {
  const items = Array.from({ length: count });

  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {items.map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl glass-card animate-pulse border border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800"></div>
              <div className="space-y-1.5">
                <div className="w-32 h-3.5 bg-slate-800 rounded"></div>
                <div className="w-16 h-2.5 bg-slate-800/60 rounded"></div>
              </div>
            </div>
            <div className="w-12 h-4 bg-slate-800/60 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((_, i) => (
        <div key={i} className="glass-card p-4 rounded-2xl animate-pulse border border-slate-800/80 space-y-3">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-slate-800"></div>
            <div className="w-6 h-6 rounded bg-slate-800/60"></div>
          </div>
          <div className="space-y-2">
            <div className="w-3/4 h-4 bg-slate-800 rounded"></div>
            <div className="w-1/2 h-3 bg-slate-800/60 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
