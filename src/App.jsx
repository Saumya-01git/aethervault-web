import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';

function MainApp() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto glass-card rounded-2xl p-8">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome, {user.name}</h1>
            <p className="text-sm text-slate-400">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-sm font-medium transition-all"
          >
            Sign Out
          </button>
        </div>
        <div className="mt-8 text-center text-slate-400">
          <p className="text-lg">☁️ AetherVault Dashboard Ready</p>
          <p className="text-xs text-slate-500 mt-2">Day 8 Frontend Setup initialized successfully</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
