import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Briefcase, Users, FileCode, CheckCircle, Clock, Video, ArrowRight, X, MessageSquare } from 'lucide-react';

export const MentorDashboard: React.FC = () => {
  const { user } = useAuth();
  const mentorDetails = user?.mentorDetails;

  const [activeReview, setActiveReview] = useState<{
    id: string;
    studentName: string;
    taskTitle: string;
    language: string;
    submittedAt: string;
  } | null>(null);

  const [mentorFeedback, setMentorFeedback] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const assignedBatches = mentorDetails?.assignedBatches || [
    { id: 'batch-py-101', name: 'Algorithmic Systems in Python 3', studentCount: 28, nextOfficeHours: 'Tomorrow at 6:00 PM IST' },
    { id: 'batch-fullstack-201', name: 'Fullstack Execution & Express Sandboxes', studentCount: 34, nextOfficeHours: 'Friday at 7:30 PM IST' },
  ];

  const pendingSubmissions = mentorDetails?.pendingSubmissions || [
    { id: 'sub-101', studentName: 'Aarav Chen', taskTitle: 'Heap-based Cluster Allocator', language: 'python', submittedAt: '2 hours ago' },
    { id: 'sub-102', studentName: 'Priya Verma', taskTitle: 'JWT Authorization Middleware', language: 'javascript', submittedAt: '4 hours ago' },
    { id: 'sub-103', studentName: 'Liam Davis', taskTitle: 'Binary Search Tree Balancing', language: 'python', submittedAt: '1 day ago' },
  ];

  const handleSendFeedback = () => {
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setActiveReview(null);
      setMentorFeedback('');
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-r from-teal-950/20 via-[#0a1526] to-[#070e1c] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 uppercase tracking-wider">
            <Briefcase className="h-4 w-4" />
            <span>Mentor Portal</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Welcome, {user?.name}
          </h1>
          <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
            Leading 2 active cohort tracks with <strong className="text-teal-300">62 total students</strong>. Guide aspiring engineers through code reviews and live office hours.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 text-center min-w-[120px]">
            <div className="text-xl font-bold font-mono text-teal-300 tabular-nums">
              {pendingSubmissions.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Pending Reviews</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 text-center min-w-[120px]">
            <div className="text-xl font-bold font-mono text-cyan-400 tabular-nums">62</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Active Mentees</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 6: Assigned Batches & Office Hours */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-400" />
              <h2 className="font-heading text-lg font-bold text-white">
                Assigned Cohort Batches
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">2 Cohorts</span>
          </div>

          <div className="space-y-4">
            {assignedBatches.map((batch) => (
              <div
                key={batch.id}
                className="rounded-2xl border border-slate-800 bg-[#091122] p-6 hover:border-slate-700 transition-colors space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="font-heading text-base font-bold text-white">
                    {batch.name}
                  </h3>
                  <span className="text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-1 rounded-md self-start sm:self-auto tabular-nums">
                    {batch.studentCount} Students Enrolled
                  </span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-[#060a14] p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="h-4 w-4 text-teal-400" />
                    <span>Office Hours: <strong className="text-white">{batch.nextOfficeHours}</strong></span>
                  </div>
                  <button
                    onClick={() => alert(`Starting virtual office hour room for ${batch.name}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/30 font-semibold transition-colors text-[11px]"
                  >
                    <Video className="h-3 w-3" />
                    <span>Join Room</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 6: Pending Student Code Submissions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileCode className="h-5 w-5 text-cyan-400" />
              <h2 className="font-heading text-lg font-bold text-white">
                Student Submissions to Review
              </h2>
            </div>
            <span className="text-xs text-amber-400 font-mono tabular-nums">
              {pendingSubmissions.length} Tasks in Queue
            </span>
          </div>

          <div className="space-y-3">
            {pendingSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="rounded-xl border border-slate-800 bg-[#091122] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{sub.studentName}</h4>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {sub.language}
                    </span>
                  </div>
                  <p className="text-xs text-cyan-300 mt-1 font-medium">{sub.taskTitle}</p>
                  <span className="text-[10px] font-mono text-slate-500 block mt-1">
                    Submitted: {sub.submittedAt}
                  </span>
                </div>

                <button
                  onClick={() => setActiveReview(sub)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors shadow-sm self-start sm:self-auto shrink-0"
                >
                  Review Code
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {activeReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#091122] shadow-2xl p-6 text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-heading text-base font-bold text-white">
                  Review Submission: {activeReview.taskTitle}
                </h3>
                <p className="text-xs text-slate-400">
                  Student: {activeReview.studentName} · Language: {activeReview.language}
                </p>
              </div>
              <button
                onClick={() => setActiveReview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Simulated code snippet */}
            <div className="rounded-xl border border-slate-800 bg-[#05080f] p-4 font-mono text-xs text-slate-300 overflow-x-auto">
              <div className="text-slate-500 text-[10px] pb-2 border-b border-slate-800 mb-2">
                SUBMISSION CODE (main.py):
              </div>
              <pre className="leading-relaxed">
{`import heapq

def balance_clusters(nodes, traffic_units):
    heap = [(0, node) for node in nodes]
    heapq.heapify(heap)
    allocated = {n: 0 for n in nodes}
    for unit in traffic_units:
        current_load, node = heapq.heappop(heap)
        new_load = current_load + unit
        allocated[node] = new_load
        heapq.heappush(heap, (new_load, node))
    return allocated`}
              </pre>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-300">
                Mentor Feedback &amp; Grade:
              </label>
              <textarea
                rows={3}
                value={mentorFeedback}
                onChange={(e) => setMentorFeedback(e.target.value)}
                placeholder="e.g. Excellent use of min-heap to achieve O(M log N) complexity! All test cases pass cleanly."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-400"
              />
            </div>

            {feedbackSent ? (
              <div className="p-3 rounded-lg bg-teal-950/40 border border-teal-800/40 text-teal-300 text-xs flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Review approved! Grade and badge progress recorded.</span>
              </div>
            ) : (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setActiveReview(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendFeedback}
                  className="px-5 py-2 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors"
                >
                  Submit Review &amp; Award XP
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
