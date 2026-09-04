import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HardDrive, Lock, Mail, User, ArrowRight, ShieldCheck, Eye, EyeOff, Check } from 'lucide-react';
import { validateName, calculatePasswordStrength, validatePassword } from '../utils/validation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950 to-slate-950">
      <div className="w-full max-w-md">
        {/* Logo Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 mb-4 shadow-lg shadow-blue-500/10">
            <HardDrive className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent">
            AetherVault
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Cloud Media File Storage & Sharing Platform
          </p>
        </div>

        {/* Auth Glass Card */}
        <div className="glass-card rounded-2xl p-8 shadow-2xl">
          <div className="flex border-b border-slate-800 pb-4 mb-6">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold transition-all border-b-2 ${
                isLogin ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold transition-all border-b-2 ${
                !isLogin ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (error) setError('');
                    }}
                    className="w-full glass-input rounded-xl pl-9 pr-4 py-2.5 text-sm"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Name must contain letters (cannot be only numbers like '123').
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full glass-input rounded-xl pl-9 pr-4 py-2.5 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full glass-input rounded-xl pl-9 pr-10 py-2.5 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter on Registration */}
              {!isLogin && formData.password && (
                <div className="mt-2.5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-slate-400">Password Strength:</span>
                    <span className={`capitalize ${strength.score >= 3 ? 'text-emerald-400' : strength.score === 2 ? 'text-amber-400' : 'text-red-400'}`}>
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
              className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
