import React from 'react';
import { XCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const ProblemSolution: React.FC = () => {
  return (
    <section id="problem-solution" className="py-20 border-t border-slate-800/80 bg-[#060a13]">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Heading */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-mono font-medium text-cyan-400 uppercase tracking-wider mb-2">
            The Fundamental Problem
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white text-balance">
            Why 90% of aspiring engineers stall in &ldquo;Tutorial Hell&rdquo;
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            Passive video watching gives a false illusion of competence. When learners face a blank code editor, panic sets in because cognitive muscle memory was never built.
          </p>
        </div>

        {/* Comparative 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Column 1: The Broken Status Quo */}
          <div className="rounded-2xl border border-rose-900/30 bg-rose-950/10 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-rose-900/20">
                <span className="text-xs font-mono font-medium text-rose-400 uppercase tracking-wide">
                  Traditional Online Courses
                </span>
                <span className="text-xs text-rose-300 font-semibold">92% Dropout Rate</span>
              </div>

              <h3 className="font-heading text-xl font-bold text-slate-100 mb-6">
                Passive Video Binging &amp; Fragile Knowledge
              </h3>

              <div className="space-y-5 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Spectator Mode Learning:</strong>
                    Students watch an instructor code for 40 hours without pressing a single key on their own keyboard.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Environment Setup Friction:</strong>
                    Path variables, conflicting Python versions, and OS quirks derail beginners before their first function runs.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">AI Cheating vs. Learning:</strong>
                    Public LLM chatbots regurgitate complete answers, robbing learners of the critical struggle where insight forms.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Zero Accountability:</strong>
                    No cohort momentum, no mentor code reviews, and no real verification of mastery.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-rose-900/20 text-xs text-rose-300/80 font-mono">
              Result: Weeks spent with zero deployable production projects.
            </div>
          </div>

          {/* Column 2: The Devashtra Solution */}
          <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-[#0b162c] to-[#07101f] p-8 shadow-xl shadow-cyan-950/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-cyan-800/40">
                <span className="text-xs font-mono font-medium text-cyan-400 uppercase tracking-wide">
                  The Devashtra Method
                </span>
                <span className="text-xs text-teal-300 font-semibold font-mono">Execution First</span>
              </div>

              <h3 className="font-heading text-xl font-bold text-white mb-6">
                Active In-Browser Sandboxes &amp; Socratic AI
              </h3>

              <div className="space-y-5 text-sm text-slate-200">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Zero-Install Cloud Lab:</strong>
                    Immediate access to isolated sandbox runners for Python and JavaScript directly in your browser.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Socratic Gemini AI Copilot:</strong>
                    Trained strictly to provide hints, mental models, and diagnostic questions—never copy-paste solutions.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Cohort-Based Mentorship Batches:</strong>
                    Structured sprints led by industry engineers with real project deadlines and live feedback.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Verified Skills &amp; GitHub Projects:</strong>
                    Every completed challenge saves to persistent database records with cryptographically verifiable badges.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-cyan-800/40 text-xs text-cyan-300 font-mono flex items-center justify-between">
              <span>Outcome: Confident problem solvers capable of building real systems.</span>
              <ArrowRight className="h-4 w-4 text-cyan-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
