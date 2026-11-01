import React, { useState } from 'react';
import { X, LogIn, UserPlus, AlertCircle, Loader2, Sparkles, Shield, User, Heart, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserRole } from '../../types/index.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { login, signup, loginAsDemoRole } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'parent' | 'mentor' | 'admin'>('student');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!name.trim() || name.trim().length < 2) {
          throw new Error('Please enter your full name (minimum 2 characters).');
        }
        await signup(name, email, password, role);
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (demoRole: 'student' | 'parent' | 'mentor' | 'admin') => {
    setError(null);
    setLoading(true);
    try {
      await loginAsDemoRole(demoRole);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Demo login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-[#091122] shadow-2xl text-slate-100 overflow-hidden">
        {/* Header Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#070d1a] px-6 py-4">
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                mode === 'login'
                  ? 'bg-cyan-500/20 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                mode === 'signup'
                  ? 'bg-cyan-500/20 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 1-Click Fast Role Switcher */}
        <div className="px-6 py-3.5 bg-gradient-to-r from-slate-900 via-[#0a1428] to-slate-900 border-b border-slate-800/80">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Fast Test Demo Accounts (1-Click Switch):</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoClick('student')}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/40 text-cyan-300 text-left transition-colors flex items-center gap-1.5"
            >
              <User className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Student</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoClick('parent')}
              className="px-2.5 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/40 text-amber-300 text-left transition-colors flex items-center gap-1.5"
            >
              <Heart className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Parent</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoClick('mentor')}
              className="px-2.5 py-1.5 rounded-lg bg-teal-950/40 hover:bg-teal-900/50 border border-teal-800/40 text-teal-300 text-left transition-colors flex items-center gap-1.5"
            >
              <Briefcase className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Mentor</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoClick('admin')}
              className="px-2.5 py-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/40 text-purple-300 text-left transition-colors flex items-center gap-1.5"
            >
              <Shield className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Admin</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                  Account Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'student' | 'parent' | 'mentor' | 'admin')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                >
                  <option value="student">Student (Cloud Lab, Batches &amp; AI Copilot)</option>
                  <option value="parent">Parent (Devashtra Junior, Screen Time Controls)</option>
                  <option value="mentor">Mentor (Review Submissions &amp; Batches)</option>
                  <option value="admin">Operations Admin</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@devashtra.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 disabled:opacity-50 transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Authenticating with JWT...</span>
              </>
            ) : mode === 'login' ? (
              <>
                <LogIn className="h-4 w-4" />
                <span>Sign In to Devashtra</span>
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>Create Role Account</span>
              </>
            )}
          </button>
        </form>

        <div className="px-6 py-3.5 border-t border-slate-800 bg-[#070d1a] text-center text-xs text-slate-500">
          Passkeys hashed with bcrypt · Stateless JWT bearer authentication
        </div>
      </div>
    </div>
  );
};
