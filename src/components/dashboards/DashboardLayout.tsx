import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Terminal, LogOut, ArrowLeft, Shield, User, Heart, Briefcase, RefreshCw, Gamepad2, Sparkles, Code2 } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onBackToLanding: () => void;
  onOpenLab?: () => void;
  onOpenGame?: () => void;
  onOpenStudio?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  onBackToLanding,
  onOpenLab,
  onOpenGame,
  onOpenStudio,
}) => {
  const { user, logout, loginAsDemoRole } = useAuth();

  const roleColors: Record<string, { bg: string; text: string; border: string }> = {
    student: { bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/30' },
    parent: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
    mentor: { bg: 'bg-teal-500/15', text: 'text-teal-300', border: 'border-teal-500/30' },
    admin: { bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30' },
  };

  const currentRoleStyle = user?.role ? roleColors[user.role] : roleColors.student;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      {/* Top Bar Contract for Dashboard */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/90 bg-[#070e1b]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3.5">
          {/* Zone 1: Breadcrumbs & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-slate-800"
              title="Return to Landing Page"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Landing</span>
            </button>
            <span className="text-slate-700">/</span>
            <div className="flex items-center gap-2 font-heading font-bold text-white text-base">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-cyan-400 to-teal-500 text-slate-950 font-mono text-[11px] font-bold">
                <Terminal className="h-3.5 w-3.5 stroke-[2.5]" />
              </div>
              <span>Devashtra</span>
            </div>
            <span className="text-slate-700">/</span>
            <span className="text-xs font-mono uppercase tracking-wide text-slate-300">
              {user?.role} workspace
            </span>
          </div>

          {/* Zone 2: Role Switcher Shortcut */}
          <div className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800/80 rounded-xl text-xs">
            <span className="text-[11px] font-mono text-slate-500 px-2">Switch View:</span>
            <button
              onClick={() => loginAsDemoRole('student')}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                user?.role === 'student' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="h-3 w-3" />
              <span>Student</span>
            </button>
            <button
              onClick={() => loginAsDemoRole('parent')}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                user?.role === 'parent' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Heart className="h-3 w-3" />
              <span>Parent</span>
            </button>
            <button
              onClick={() => loginAsDemoRole('mentor')}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                user?.role === 'mentor' ? 'bg-teal-500/20 text-teal-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="h-3 w-3" />
              <span>Mentor</span>
            </button>
            <button
              onClick={() => loginAsDemoRole('admin')}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                user?.role === 'admin' ? 'bg-purple-500/20 text-purple-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="h-3 w-3" />
              <span>Admin</span>
            </button>
          </div>

          {/* Zone 3: User Profile & Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {onOpenGame && (
              <button
                onClick={onOpenGame}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-300 bg-teal-950/80 hover:bg-teal-900/80 border border-teal-800/60 rounded-lg transition-colors"
                title="Launch 3D Three.js Rover Game"
              >
                <Gamepad2 className="h-3.5 w-3.5" />
                <span>3D Rover</span>
              </button>
            )}

            {onOpenStudio && (
              <button
                onClick={onOpenStudio}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-300 bg-purple-950/80 hover:bg-purple-900/80 border border-purple-800/60 rounded-lg transition-colors"
                title="Open Multimodal AI & Bioscience Studio"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Lab</span>
              </button>
            )}

            {onOpenLab && (
              <button
                onClick={onOpenLab}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-lg transition-colors shadow-sm"
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>Cloud Lab</span>
              </button>
            )}

            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-white truncate max-w-[140px]">
                  {user?.name}
                </div>
                <div className="text-[10px] font-mono text-slate-400 truncate">
                  {user?.email}
                </div>
              </div>

              <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${currentRoleStyle.bg} ${currentRoleStyle.text} border ${currentRoleStyle.border}`}>
                {user?.role}
              </div>

              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors ml-1"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  );
};
