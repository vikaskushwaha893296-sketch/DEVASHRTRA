import React from 'react';
import { Eye, ShieldCheck, Clock, Award, CheckCircle } from 'lucide-react';

export const ParentSection: React.FC = () => {
  return (
    <section id="parents" className="py-24 border-t border-slate-800/80 bg-[#060b15]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Parental Value Proposition */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-cyan-400 uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" />
              <span>Parental Control &amp; Transparency</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white text-balance">
              Total visibility into your child&apos;s digital growth
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We know parents worry about unmonitored screen time and unsupervised AI chats. Devashtra gives you a dedicated Parental Dashboard linked directly to your child&apos;s account.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                  <Eye className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Read-Only AI Copilot Logs</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Review every question your child asked and how the AI guided them. Zero hidden chats, zero unmonitored browsing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Healthy Screen Time Budgets</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Set daily active coding minutes (e.g., 45 minutes/day). Sandboxes automatically pause when the session budget finishes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Weekly Competency Reports</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Receive plain-English summaries detailing which computational concepts, math principles, and badges your child achieved.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Parental Dashboard Preview Card */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-800 bg-[#091122] p-6 sm:p-8 shadow-2xl shadow-cyan-950/20 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-cyan-600/30 text-cyan-300 font-bold flex items-center justify-center text-sm border border-cyan-500/30">
                    AK
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-bold text-white">
                      Aarav&apos;s Learning Tracker (Age 10)
                    </h3>
                    <p className="text-xs text-slate-400">Linked to parent: Sarah K.</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                    Active Session: 28 / 45 min
                  </span>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Module 1: Space Rover Logic</span>
                  <span className="font-mono text-cyan-400 font-bold tabular-nums">100% Completed</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 w-full rounded-full" />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-300 font-medium">Module 2: Secret Ciphers &amp; Cyber Safety</span>
                  <span className="font-mono text-cyan-400 font-bold tabular-nums">65% In Progress</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-amber-300 w-[65%] rounded-full" />
                </div>
              </div>

              {/* AI Copilot Read-Only Audit Transcript */}
              <div className="rounded-xl border border-slate-800/80 bg-[#05080f] p-4 text-xs space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800/60">
                  <span className="font-semibold text-slate-300">Live Copilot Transcript (Read-Only)</span>
                  <span className="font-mono text-slate-500">Today at 4:18 PM</span>
                </div>

                <div className="space-y-2">
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/50">
                    <span className="text-[10px] font-mono text-slate-400 block mb-0.5">Aarav:</span>
                    <p className="text-slate-200 text-[11px]">
                      &quot;Why did my rover turn left twice instead of going forward?&quot;
                    </p>
                  </div>

                  <div className="bg-cyan-950/20 p-2.5 rounded-lg border border-cyan-800/30">
                    <span className="text-[10px] font-mono text-cyan-400 block mb-0.5">Devashtra AI Copilot:</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      &quot;Check line 6 inside your while loop! You have rover.turn_left() inside the loop block. What happens if you move it outside after the distance check?&quot;
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-teal-400 font-mono">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Socratic safety policy enforced: Zero spoiler code provided.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
