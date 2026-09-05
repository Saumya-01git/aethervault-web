import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HardDrive, Lock, Mail, User, ArrowRight, ShieldCheck, Eye, EyeOff, Check, Sparkles, Shield, Zap, Globe, Orbit } from 'lucide-react';
import { validateName, calculatePasswordStrength, validatePassword } from '../utils/validation';
import CosmicBackground from '../components/CosmicBackground';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('aether_background_mode') || 'earth');

  const handleSetThemeMode = (mode) => {
    setThemeMode(mode);
    localStorage.setItem('aether_background_mode', mode);
  };

  const { login, register } = useAuth();

  const strength = calculatePasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin) {
      // Validate Name (e.g. reject numeric names like "123")
      const nameVal = validateName(formData.name);
      if (!nameVal.isValid) {
        setError(nameVal.error);
        return;
      }

      // Validate Password
      const passVal = validatePassword(formData.password);
      if (!passVal.isValid) {
        setError(passVal.error);
        return;
      }

      if (strength.score < 2) {
        setError('Please choose a stronger password (at least 8 characters with numbers or letters).');
        return;
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name.trim(), formData.email, formData.password);
      }
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message || 'Authentication failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-slate-950">
      {/* Dynamic Interactive Cosmic Galaxy Canvas */}
      <CosmicBackground themeMode={themeMode} />

      {/* Top Right Background Theme Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <div className="flex items-center p-1 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-xs">
          <button
            onClick={() => handleSetThemeMode('earth')}
            title="Earth Horizon Background"
            className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              themeMode === 'earth'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-300" />
            <span>Earth</span>
          </button>
          <button
            onClick={() => handleSetThemeMode('stream')}
            title="Galactic Stream Background"
            className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              themeMode === 'stream'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Orbit className="w-3.5 h-3.5 text-purple-300" />
            <span>Stream</span>
          </button>
        </div>
      </div>

      {/* Ambient Glowing Cosmic Halos */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/20 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-600/20 blur-[120px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-md relative z-10 my-8">
        {/* Logo & Platform Branding */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600/30 via-indigo-600/20 to-purple-600/30 text-cyan-400 border border-cyan-500/30 mb-4 shadow-[0_0_30px_rgba(56,189,248,0.25)] group">
            <HardDrive className="w-10 h-10 transform group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 animate-ping opacity-75" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
            AetherVault
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-400 mt-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Next-Gen Encrypted Cloud Storage & Media Vault</span>
          </p>

          {/* Feature Badge Pills */}
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 shadow-sm">
              <Shield className="w-3 h-3 text-blue-400" />
              <span>256-bit Encrypted</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 shadow-sm">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>Instant Cloud Sync</span>
            </span>
          </div>
        </div>

        {/* Auth Glass Card */}
        <div className="glass-card-cosmic glass-card-glow rounded-3xl p-8 shadow-2xl">
          <div className="flex border-b border-slate-800/80 pb-4 mb-6">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold transition-all border-b-2 ${
                isLogin ? 'border-cyan-400 text-cyan-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold transition-all border-b-2 ${
                !isLogin ? 'border-cyan-400 text-cyan-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 shadow-lg shadow-red-500/5">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (error) setError('');
                    }}
                    className="w-full glass-input rounded-2xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Name must contain letters (cannot be purely numeric like '123').
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full glass-input rounded-2xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full glass-input rounded-2xl pl-10 pr-10 py-3 text-sm focus:ring-2 focus:ring-cyan-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-cyan-400 hover:scale-110 transition-all duration-200 cursor-pointer drop-shadow-[0_0_8px_rgba(56,189,248,0)] hover:drop-shadow-[0_0_10px_rgba(56,189,248,0.9)]"
                  title={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-cyan-400" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter on Registration */}
              {!isLogin && formData.password && (
                <div className="mt-3 space-y-2 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-slate-400">Password Strength:</span>
                    <span className={`capitalize font-bold ${strength.score >= 3 ? 'text-emerald-400' : strength.score === 2 ? 'text-amber-400' : 'text-red-400'}`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.percentage}%` }}
                    ></div>
                  </div>

                  {/* Criteria Checklist */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
                    <div className={`flex items-center gap-1 ${strength.criteria.minLength ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {strength.criteria.minLength ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 text-center">•</span>}
                      <span>At least 8 chars</span>
                    </div>
                    <div className={`flex items-center gap-1 ${strength.criteria.hasUppercase ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {strength.criteria.hasUppercase ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 text-center">•</span>}
                      <span>Uppercase (A-Z)</span>
                    </div>
                    <div className={`flex items-center gap-1 ${strength.criteria.hasNumber ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {strength.criteria.hasNumber ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 text-center">•</span>}
                      <span>Number (0-9)</span>
                    </div>
                    <div className={`flex items-center gap-1 ${strength.criteria.hasSpecial ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {strength.criteria.hasSpecial ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 text-center">•</span>}
                      <span>Special symbol (!@#)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-sm transition-all duration-300 shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:shadow-[0_0_35px_rgba(56,189,248,0.6)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In to Vault' : 'Create Vault Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
