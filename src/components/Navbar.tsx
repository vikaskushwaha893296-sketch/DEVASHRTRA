import React, { useState } from 'react';
import { Terminal, Menu, X, Database, User, LogIn, LayoutDashboard, Code2, Gamepad2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface NavbarProps {
  onJoinWaitlistClick: () => void;
  onOpenAdminPreview: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onNavigateDashboard: () => void;
  onOpenLab?: () => void;
  onOpenGame?: () => void;
  onOpenStudio?: () => void;
  totalWaitlistCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onJoinWaitlistClick,
  onOpenAdminPreview,
  onOpenAuth,
  onNavigateDashboard,
  onOpenLab,
  onOpenGame,
  onOpenStudio,
  totalWaitlistCount,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const roleColors: Record<string, string> = {
    student: 'text-cyan-300 bg-cyan-950/60 border-cyan-800/40',
    parent: 'text-amber-300 bg-amber-950/60 border-amber-800/40',
    mentor: 'text-teal-300 bg-teal-950/60 border-teal-800/40',
    admin: 'text-purple-300 bg-purple-950/60 border-purple-800/40',
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#070b14]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Brand title wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 font-heading text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 text-slate-950 shadow-sm shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Terminal className="h-4 w-4 stroke-[2.5]" />
          </div>
          <span>Devashtra</span>
        </a>

        {/* Zone 2: Navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => scrollTo('features')}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            Platform
          </button>
          <button
            onClick={() => scrollTo('junior')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            Devashtra Junior
          </button>
          {onOpenLab && (
            <button
              onClick={onOpenLab}
              className="text-cyan-300 hover:text-cyan-200 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Code2 className="h-4 w-4" />
              <span>Cloud Lab</span>
            </button>
          )}
          {onOpenGame && (
            <button
              onClick={onOpenGame}
              className="text-teal-300 hover:text-teal-200 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Gamepad2 className="h-4 w-4" />
              <span>3D Cyber Rover</span>
            </button>
          )}
          {onOpenStudio && (
            <button
              onClick={onOpenStudio}
              className="text-purple-300 hover:text-purple-200 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Sparkles className="h-4 w-4" />
              <span>Multimodal AI Lab</span>
            </button>
          )}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAdminPreview}
            title="Inspect Waitlist Database & Stats"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-slate-400 hover:text-slate-200 bg-slate-900/80 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors whitespace-nowrap shrink-0"
          >
            <Database className="h-3.5 w-3.5 text-cyan-400" />
            <span>DB Records</span>
            {totalWaitlistCount !== undefined && totalWaitlistCount > 0 && (
              <span className="ml-1 text-[11px] text-cyan-300 font-bold tabular-nums">
                ({totalWaitlistCount})
              </span>
            )}
          </button>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onNavigateDashboard}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-cyan-500/20"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Dashboard</span>
              </button>

              <span
                className={`hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                  roleColors[user.role] || roleColors.student
                }`}
              >
                {user.role}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <LogIn className="h-3.5 w-3.5 text-cyan-400" />
                <span>Sign In</span>
              </button>

              <button
                onClick={onJoinWaitlistClick}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-lg hover:from-cyan-300 hover:to-teal-300 shadow-sm shadow-cyan-500/25 transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                Join Waitlist
              </button>
            </div>
          )}

          {/* Mobile menu hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#070e1b] px-6 py-5 flex flex-col gap-4 text-sm font-medium text-slate-300">
          <button
            onClick={() => scrollTo('features')}
            className="text-left py-1 hover:text-cyan-400"
          >
            Platform
          </button>
          <button
            onClick={() => scrollTo('problem-solution')}
            className="text-left py-1 hover:text-cyan-400"
          >
            Methodology
          </button>
          <button
            onClick={() => scrollTo('junior')}
            className="text-left py-1 text-amber-400 hover:text-amber-300"
          >
            Devashtra Junior (Ages 6-12)
          </button>
          <button
            onClick={() => scrollTo('parents')}
            className="text-left py-1 hover:text-cyan-400"
          >
            For Parents
          </button>
          {onOpenLab && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLab();
              }}
              className="text-left py-1 text-cyan-300 flex items-center gap-2"
            >
              <Code2 className="h-4 w-4" />
              <span>Cloud Lab IDE</span>
            </button>
          )}
          {onOpenGame && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenGame();
              }}
              className="text-left py-1 text-teal-300 flex items-center gap-2"
            >
              <Gamepad2 className="h-4 w-4" />
              <span>3D Cyber Rover Game</span>
            </button>
          )}
          {onOpenStudio && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenStudio();
              }}
              className="text-left py-1 text-purple-300 flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Multimodal AI Lab</span>
            </button>
          )}
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateDashboard();
                }}
                className="w-full text-center py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 rounded-lg"
              >
                Go to Dashboard ({user?.role})
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="w-full text-center py-2 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-800 rounded-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onJoinWaitlistClick();
                  }}
                  className="w-full text-center py-2.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-lg"
                >
                  Join Waitlist
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
