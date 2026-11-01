import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Award, BookOpen, Flame, Zap, Play, CheckCircle2, ArrowRight, Code2, Bot, Trophy } from 'lucide-react';

interface StudentDashboardProps {
  onLaunchTaskInLab?: (taskTitle: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onLaunchTaskInLab }) => {
  const { user } = useAuth();
  const student = user?.studentDetails;

  const defaultBatches = [
    {
      id: 'batch-py-101',
      title: 'Algorithmic Systems in Python 3',
      progress: 68,
      mentor: 'Dr. Vikram Patel',
      nextLesson: 'Lesson 5: Heaps & Priority Queues in Cloud Load Balancing',
    },
    {
      id: 'batch-fullstack-201',
      title: 'Fullstack Execution & Express Sandboxes',
      progress: 42,
      mentor: 'Dr. Vikram Patel',
      nextLesson: 'Lesson 3: JWT Verification & Bearer Protocol',
    },
  ];

  const batches = student?.enrolledBatches && student.enrolledBatches.length > 0
    ? student.enrolledBatches
    : defaultBatches;

  const badges = student?.badges && student.badges.length > 0
    ? student.badges
    : [
        { id: 'b1', name: 'Async Pilot', earnedAt: 'Yesterday', icon: 'zap' },
        { id: 'b2', name: 'Cipher Guard', earnedAt: '3 days ago', icon: 'shield' },
        { id: 'b3', name: 'Memory Optimizer', earnedAt: 'Last week', icon: 'cpu' },
      ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome & KPI Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-[#0c162c] via-[#091224] to-[#070e1c] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
            <span>Student Command Center</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Batch Autumn 2026</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Welcome back, {user?.name || 'Engineer'}
          </h1>
          <p className="text-slate-300 text-sm max-w-xl">
            You are 1 lesson away from earning your <strong className="text-cyan-300">Heap Architect</strong> badge in Algorithmic Systems!
          </p>
        </div>

        {/* Gamified KPI Strip */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/80 text-center min-w-[90px]">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
              <Flame className="h-4 w-4 fill-current" />
              <span className="font-mono text-lg font-bold tabular-nums">
                {student?.currentStreak || 6}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Day Streak</div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/80 text-center min-w-[90px]">
            <div className="flex items-center justify-center gap-1 text-cyan-400 mb-1">
              <Zap className="h-4 w-4 fill-current" />
              <span className="font-mono text-lg font-bold tabular-nums">
                {student?.xp || 1450}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Earned XP</div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/80 text-center min-w-[90px]">
            <div className="flex items-center justify-center gap-1 text-teal-400 mb-1">
              <Trophy className="h-4 w-4" />
              <span className="font-mono text-lg font-bold tabular-nums">
                Lvl {student?.level || 4}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Architect</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Enrolled Batches + Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Enrolled Batches & Today's Task */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyan-400" />
              <h2 className="font-heading text-lg font-bold text-white">
                Enrolled Cohort Batches
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {batches.length} Active Courses
            </span>
          </div>

          <div className="space-y-4">
            {batches.map((batch) => (
              <div
                key={batch.id}
                className="rounded-2xl border border-slate-800 bg-[#091122] p-6 hover:border-slate-700 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-heading text-base font-bold text-white">
                      {batch.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Cohort Mentor: <span className="text-slate-200">{batch.mentor}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-cyan-400 tabular-nums">
                      {batch.progress}% Complete
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full transition-all"
                    style={{ width: `${batch.progress}%` }}
                  />
                </div>

                {/* Next lesson prompt */}
                <div className="rounded-xl border border-slate-800/80 bg-[#060a14] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 block uppercase">
                      Next Coding Task:
                    </span>
                    <span className="text-slate-200 font-medium">{batch.nextLesson}</span>
                  </div>

                  <button
                    onClick={() => onLaunchTaskInLab && onLaunchTaskInLab(batch.nextLesson)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300 transition-colors shrink-0 self-start sm:self-auto shadow-sm"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>Launch in Cloud Lab</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Today's Recommended Practice Sandbox Card */}
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/10 p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase">
              <Code2 className="h-4 w-4" />
              <span>Daily Practice Sandbox (Python 3.12)</span>
            </div>

            <div>
              <h3 className="font-heading text-base font-bold text-white">
                Task: Implement Minimum Heap Allocator for Cloud Nodes
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
                Build a function that ingests server metrics and dynamically assigns load to the lightest container. Validate with 3 test cases.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-teal-300 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>+120 XP &amp; Badge Progress upon passing all assertions</span>
              </span>

              <button
                onClick={() => onLaunchTaskInLab && onLaunchTaskInLab('Minimum Heap Allocator')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
              >
                <span>Open Editor</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Verified Skill Badges */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              <h2 className="font-heading text-lg font-bold text-white">
                Earned Badges
              </h2>
            </div>
            <span className="text-xs text-amber-400 font-mono tabular-nums">
              {badges.length} Unlocked
            </span>
          </div>

          <div className="space-y-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="rounded-xl border border-slate-800 bg-[#091122] p-4 flex items-start gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-white">
                    {badge.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Verified competence in system logic and code assertions.
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-mono text-slate-500">
                    Earned: {badge.earnedAt}
                  </span>
                </div>
              </div>
            ))}

            {/* Next badge lock preview */}
            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/30 p-4 flex items-start gap-3 opacity-70">
              <div className="p-2.5 rounded-xl bg-slate-800 text-slate-500 shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-heading text-sm font-semibold text-slate-400">
                  Heap Architect (Locked)
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Complete Lesson 5 in Python Systems to unlock this verifiable credential.
                </p>
              </div>
            </div>
          </div>

          {/* Socratic Copilot Quick Tip */}
          <div className="rounded-xl border border-cyan-800/40 bg-cyan-950/20 p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold">
              <Bot className="h-4 w-4" />
              <span>Copilot Socratic Note:</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              &ldquo;Stuck on a test case? Remember that you can ask me questions about algorithm complexity in the Cloud Lab chat without worrying about spoilers!&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
