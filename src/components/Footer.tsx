import React from 'react';
import { Terminal, Github, Heart } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#040810] py-14 text-slate-400 text-xs">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/60">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 font-heading text-lg font-bold text-white">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 text-slate-950 font-mono font-bold text-xs">
                <Terminal className="h-4 w-4 stroke-[2.5]" />
              </div>
              <span>Devashtra</span>
            </div>
            <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
              Bridging the gap between passive learning and real-world tech execution. Browser-based Cloud Labs, cohort mentorship, and Socratic AI guidance.
            </p>
            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-mono">
              <span>Stack: React · Node.js · Express · MongoDB · Gemini AI</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-semibold uppercase tracking-wider text-slate-200">
              Platform Modules
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="hover:text-cyan-400 transition-colors">
                  In-Browser Cloud Lab
                </a>
              </li>
              <li>
                <a href="#junior" className="hover:text-amber-400 transition-colors">
                  Devashtra Junior (6-12)
                </a>
              </li>
              <li>
                <a href="#problem-solution" className="hover:text-cyan-400 transition-colors">
                  Socratic AI Copilot
                </a>
              </li>
              <li>
                <a href="#parents" className="hover:text-cyan-400 transition-colors">
                  Parental Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Development / System */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-semibold uppercase tracking-wider text-slate-200">
              Engineering Status
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Inspect Database Records
                </button>
              </li>
              <li>
                <a
                  href="/api/health"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-400 transition-colors"
                >
                  API Health Status
                </a>
              </li>
              <li>
                <span className="text-slate-500">Phase 1 Complete (Waiting for Phase 2 Auth)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Devashtra Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Built for aspiring engineers, mentors &amp; young creators</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
