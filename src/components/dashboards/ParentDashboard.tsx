import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { ShieldCheck, Clock, Eye, CheckCircle2, AlertCircle, Save, Loader2, Sparkles, User, Award } from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const parentDetails = user?.parentDetails;

  const [dailyMinutes, setDailyMinutes] = useState<number>(
    parentDetails?.allowedDailyMinutes || 45
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const modules = parentDetails?.modulesProgress || [
    { moduleName: 'Module 1: Space Rover Logic & Loops', progress: 100, status: 'completed' },
    { moduleName: 'Module 2: Secret Ciphers & Cyber-Safety', progress: 75, status: 'in_progress' },
    { moduleName: 'Module 3: AI Mini-Companion Training', progress: 20, status: 'in_progress' },
    { moduleName: 'Module 4: Web Space Station Mission', progress: 0, status: 'locked' },
  ];

  const auditLogs = parentDetails?.copilotAuditLogs || [
    {
      id: 'log-1',
      timestamp: 'Today at 4:18 PM',
      question: 'Why did my rover turn left twice instead of going forward?',
      copilotHint: 'Check line 6 inside your while loop! You have rover.turn_left() inside the loop block. What happens if you move it outside after the distance check?',
      safetyFlag: 'clean',
    },
    {
      id: 'log-2',
      timestamp: 'Yesterday at 5:02 PM',
      question: 'What is a Caesar cipher shift key?',
      copilotHint: 'Think of the alphabet as a circular dial with 26 letters! A shift of 3 turns A into D. Try shifting B by 3!',
      safetyFlag: 'clean',
    },
    {
      id: 'log-3',
      timestamp: 'Oct 30 at 3:45 PM',
      question: 'Can I write infinite loops in Python?',
      copilotHint: 'Yes with while True, but real rovers need a stopping condition like battery > 0 or distance > 0!',
      safetyFlag: 'clean',
    },
  ];

  const handleUpdateScreenTime = async () => {
    setIsSaving(true);
    setSaveSuccess(null);
    try {
      const res = await fetch('/api/dashboard/parent/screentime', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ minutes: dailyMinutes }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveSuccess(`Daily screen time successfully set to ${dailyMinutes} minutes.`);
      } else {
        throw new Error(data.error || 'Failed to update screen time');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating screen time';
      alert(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-[#0d1526] to-[#070e1c] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" />
            <span>Parental Oversight Portal</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Parent Dashboard: {user?.name}
          </h1>
          <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
            Linked to student account: <strong className="text-amber-300">{parentDetails?.childName || 'Aarav Chen'} (Age {parentDetails?.childAge || 10})</strong>. Full transparency into study habits, screen time budgets, and AI mentor conversations.
          </p>
        </div>

        {/* Linked Child Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shrink-0 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center font-bold font-mono">
            AC
          </div>
          <div>
            <div className="text-xs font-bold text-white">Aarav Chen</div>
            <div className="text-[11px] font-mono text-cyan-400">student@devashtra.com</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Status: Active in Cloud Lab</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 6 Cols: Screen Time & Module Progress */}
        <div className="lg:col-span-6 space-y-6">
          {/* Screen Time Budget Card */}
          <div className="rounded-2xl border border-slate-800 bg-[#091122] p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-400" />
                <h3 className="font-heading text-base font-bold text-white">
                  Daily Screen Time Budget
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                Used: {parentDetails?.usedMinutesToday || 28}m / {dailyMinutes}m
              </span>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              When your child reaches their allocated limit, interactive coding sandboxes gently pause, recommending a healthy screen break.
            </p>

            {/* Slider Control */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Configured Limit:</span>
                <span className="text-amber-400 font-bold tabular-nums text-sm">
                  {dailyMinutes} Minutes / Day
                </span>
              </div>

              <input
                type="range"
                min="15"
                max="120"
                step="15"
                value={dailyMinutes}
                onChange={(e) => {
                  setDailyMinutes(Number(e.target.value));
                  setSaveSuccess(null);
                }}
                className="w-full accent-amber-400 cursor-pointer"
              />

              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>15m</span>
                <span>30m</span>
                <span>45m</span>
                <span>60m</span>
                <span>90m</span>
                <span>120m</span>
              </div>
            </div>

            {saveSuccess && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{saveSuccess}</span>
              </div>
            )}

            <button
              onClick={handleUpdateScreenTime}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Screen Time Rule</span>
                </>
              )}
            </button>
          </div>

          {/* Module Progress Breakdown */}
          <div className="rounded-2xl border border-slate-800 bg-[#091122] p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-cyan-400" />
                <h3 className="font-heading text-base font-bold text-white">
                  Curriculum Competency Progress
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Devashtra Junior</span>
            </div>

            <div className="space-y-4">
              {modules.map((mod, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-medium">{mod.moduleName}</span>
                    <span
                      className={`font-mono font-bold tabular-nums ${
                        mod.status === 'completed'
                          ? 'text-teal-400'
                          : mod.status === 'in_progress'
                          ? 'text-cyan-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {mod.status === 'completed'
                        ? 'Mastered (100%)'
                        : mod.status === 'locked'
                        ? 'Locked'
                        : `${mod.progress}% In Progress`}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        mod.status === 'completed'
                          ? 'bg-teal-400'
                          : mod.status === 'in_progress'
                          ? 'bg-cyan-400'
                          : 'bg-slate-700'
                      }`}
                      style={{ width: `${mod.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Read-Only AI Copilot Chat Audit Logs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-[#091122] p-6 space-y-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-cyan-400" />
                  <h3 className="font-heading text-base font-bold text-white">
                    Socratic AI Copilot Audit History
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded">
                  Read-Only Transparency
                </span>
              </div>

              <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
                Review every coding inquiry your child submitted to the AI tutor, along with the educational questions and hints provided in return.
              </p>

              {/* Log Entries */}
              <div className="mt-4 space-y-3">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-xl border border-slate-800 bg-[#060a14] p-4 text-xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pb-1.5 border-b border-slate-800/60 font-mono">
                      <span>{log.timestamp}</span>
                      <span className="text-teal-400 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Socratic Safety Passed</span>
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[11px] font-mono text-slate-400">
                        {parentDetails?.childName || 'Aarav'} asked:
                      </div>
                      <p className="text-slate-200 bg-slate-900/60 p-2 rounded-lg border border-slate-800/50">
                        &ldquo;{log.question}&rdquo;
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[11px] font-mono text-cyan-400">
                        Devashtra AI Copilot responded:
                      </div>
                      <p className="text-slate-300 bg-cyan-950/20 p-2 rounded-lg border border-cyan-800/30 leading-relaxed">
                        &ldquo;{log.copilotHint}&rdquo;
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-400 shrink-0" />
              <span>Devashtra Copilot never allows open web search or unmoderated conversation.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
