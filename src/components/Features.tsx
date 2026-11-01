import React from 'react';
import { Terminal, Bot, Users, Award, ShieldCheck, Zap } from 'lucide-react';

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 border-t border-slate-800/80 bg-[#070c18]">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-mono font-medium text-cyan-400 uppercase tracking-wider mb-2">
            The Engine Behind Devashtra
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white text-balance">
            Engineered for real-world software competence
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            Every feature in Devashtra is designed around cognitive retention, continuous hands-on typing, and immediate runtime verification.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Cloud Lab (2 columns span) */}
          <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-[#0a1222] p-8 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-cyan-500/15 text-cyan-300 flex items-center justify-center">
                  <Terminal className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-white">
                    In-Browser Cloud Lab
                  </h3>
                  <p className="text-xs text-slate-400">Zero install · Python 3.12 &amp; Node.js</p>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Code instantly in Monaco editor with full syntax highlighting, auto-completion, and sub-second code execution. Output streams back from isolated sandbox containers with formatted stdout, stderr, and execution benchmarks.
              </p>

              {/* Lab Visual Preview */}
              <div className="rounded-xl border border-slate-800 bg-[#050912] p-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                  <span className="text-cyan-300 font-semibold">main.py (Autosaved)</span>
                  <span className="text-emerald-400">Runtime: 142ms · Exit Code: 0</span>
                </div>
                <div className="text-slate-400 space-y-1">
                  <div><span className="text-teal-400">import</span> asyncio</div>
                  <div><span className="text-teal-400">async def</span> <span className="text-cyan-300">fetch_stream</span>():</div>
                  <div className="pl-4 text-slate-300">await asyncio.sleep(0.1)</div>
                  <div className="pl-4 text-slate-300">return {`{"status": "ready", "packet_loss": 0.0}`}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Zap className="h-4 w-4 text-cyan-400" /> Instant execution
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="h-4 w-4 text-teal-400" /> Isolated sandbox
              </span>
            </div>
          </div>

          {/* Card 2: Socratic AI Copilot */}
          <div className="rounded-2xl border border-slate-800 bg-[#0a1222] p-8 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-teal-500/15 text-teal-300 flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-white">
                    Socratic AI Copilot
                  </h3>
                  <p className="text-xs text-slate-400">Powered by Gemini</p>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Unlike generic LLMs that spit out completed code snippets, Devashtra Copilot acts like a patient senior engineer. It spots your syntax and logic errors, explains edge-cases in simple terms, and asks questions that unlock the solution.
              </p>

              <div className="rounded-xl border border-teal-900/30 bg-teal-950/20 p-3.5 text-xs text-slate-300">
                <p className="font-semibold text-teal-300 mb-1">Copilot Diagnostic:</p>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  &ldquo;Your loop terminates at index N-1, leaving the final edge unvisited. What happens if you inspect range(len(arr))?&rdquo;
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
              Zero spoiler code · 100% conceptual mastery
            </div>
          </div>

          {/* Card 3: Structured Batches & Mentorship */}
          <div className="rounded-2xl border border-slate-800 bg-[#0a1222] p-8 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/15 text-indigo-300 flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-white">
                    Cohort-Based Batches
                  </h3>
                  <p className="text-xs text-slate-400">Accountability &amp; Community</p>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                Join live or self-paced batches led by vetted mentors. Each lesson pairs tight conceptual reading with immediate interactive practice tasks inside the Cloud Lab.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
              Peer code reviews · Weekly live office hours
            </div>
          </div>

          {/* Card 4: Verified Mastery & Badges (2 columns span) */}
          <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-[#0a1222] p-8 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-amber-500/15 text-amber-300 flex items-center justify-center">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-white">
                    Mastery Progression &amp; Verified Badges
                  </h3>
                  <p className="text-xs text-slate-400">Gamified XP · Portfolio Proof</p>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Track your real software journey. Earn XP for clean tests, maintain daily coding streaks, and unlock verifiable badges that validate algorithms, API architecture, and asynchronous execution to employers or parents.
              </p>

              {/* Sample Badges Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 text-center">
                  <div className="text-xs font-semibold text-white">Async Pilot</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Concurrency Mastered</div>
                </div>
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 text-center">
                  <div className="text-xs font-semibold text-white">Cipher Guard</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Cryptography Basics</div>
                </div>
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 text-center">
                  <div className="text-xs font-semibold text-white">Memory Guard</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">O(1) Optimization</div>
                </div>
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 text-center">
                  <div className="text-xs font-semibold text-white">7-Day Streak</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Consistent Hacker</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
              Direct export to GitHub and LinkedIn portfolios
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
