import React, { Component } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught React Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-red-500/30 text-white space-y-4">
            <h2 className="text-2xl font-bold text-red-400">AetherVault Notice</h2>
            <p className="text-sm text-slate-300">
              An unexpected error occurred while rendering the page.
            </p>
            {this.state.error?.message && (
              <p className="text-xs font-mono bg-slate-900 p-3 rounded-xl border border-slate-800 text-red-300 overflow-x-auto text-left">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-2xl shadow-lg transition-all"
            >
              Reset Session & Reload Vault
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function MainApp() {
  const { user, loading } = useAuth();

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

  return <Dashboard />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ErrorBoundary>
  );
}
