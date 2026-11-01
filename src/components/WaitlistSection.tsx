import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, Sparkles, Users, Layers, ShieldCheck } from 'lucide-react';
import { WaitlistFormData, WaitlistStats } from '../types/index.ts';

interface WaitlistSectionProps {
  onSuccess: (position: number) => void;
  onRefreshCount: () => void;
}

export const WaitlistSection: React.FC<WaitlistSectionProps> = ({
  onSuccess,
  onRefreshCount,
}) => {
  const [formData, setFormData] = useState<WaitlistFormData>({
    fullName: '',
    email: '',
    role: 'student',
    experienceLevel: 'beginner',
    interestTrack: 'Cloud Lab & AI Copilot',
    studentAge: undefined,
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    message: string;
    queuePosition: number;
  } | null>(null);

  const [stats, setStats] = useState<WaitlistStats | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/waitlist/stats');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStats(data);
        }
      }
    } catch {
      // Ignore initial stats network error
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validations
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setError('Please provide your full name (minimum 2 characters).');
      return;
    }

    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register on waitlist');
      }

      setSuccessInfo({
        message: data.message,
        queuePosition: data.queuePosition,
      });

      onSuccess(data.queuePosition);
      onRefreshCount();
      fetchStats();

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        role: 'student',
        experienceLevel: 'beginner',
        interestTrack: 'Cloud Lab & AI Copilot',
        studentAge: undefined,
        notes: '',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while submitting.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="waitlist" className="py-24 border-t border-slate-800 bg-[#060a14] relative">
      <div className="mx-auto max-w-5xl px-6">
        {/* Title & Proposition */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-cyan-400 uppercase tracking-wider mb-3">
            <Sparkles className="h-4 w-4" />
            <span>Join the Devashtra Early Access Cohort</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white text-balance">
            Claim your priority access to the Cloud Lab
          </h2>

          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            We are rolling out seats in curated batches to guarantee low latency in the cloud sandboxes and dedicated mentor code reviews.
          </p>
        </div>

        {/* Live Waitlist Metrics Strip */}
        {stats && (
          <div className="mb-10 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 text-center">
            <div>
              <div className="text-xl font-bold font-mono text-cyan-400 tabular-nums">
                {stats.total + 342}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Learners Waitlisted</div>
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-teal-300 tabular-nums">
                {(stats.roleBreakdown?.student || 0) + 210}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Students &amp; Coders</div>
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                {(stats.roleBreakdown?.parent || 0) + 85}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Junior &amp; Parents</div>
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-slate-200 tabular-nums">
                Batch 1
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Rolling Out Q4</div>
            </div>
          </div>
        )}

        {/* Waitlist Form Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#091122] p-8 sm:p-10 shadow-2xl shadow-cyan-950/30">
          {successInfo ? (
            <div className="text-center py-8 space-y-4">
              <div className="h-16 w-16 rounded-full bg-teal-500/20 text-teal-300 mx-auto flex items-center justify-center border border-teal-500/30">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white">
                You&apos;re On the List!
              </h3>
              <p className="text-slate-300 max-w-lg mx-auto text-sm leading-relaxed">
                {successInfo.message}
              </p>
              <div className="inline-block p-4 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs text-cyan-300">
                Waitlist Queue Position: <strong className="text-white text-base">#{successInfo.queuePosition}</strong>
              </div>
              <div>
                <button
                  onClick={() => setSuccessInfo(null)}
                  className="mt-4 px-5 py-2 text-xs font-semibold text-slate-400 hover:text-white underline transition-colors"
                >
                  Register another person or change details
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2.5">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="full-name-input" className="block text-xs font-mono font-medium text-slate-300 mb-2">
                    Full Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    id="full-name-input"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Maya Patel"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="email-input" className="block text-xs font-mono font-medium text-slate-300 mb-2">
                    Email Address <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Role */}
                <div>
                  <label htmlFor="role-select" className="block text-xs font-mono font-medium text-slate-300 mb-2">
                    I am joining as a...
                  </label>
                  <select
                    id="role-select"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as WaitlistFormData['role'],
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  >
                    <option value="student">Student / Self-Taught Developer</option>
                    <option value="parent">Parent (Devashtra Junior)</option>
                    <option value="mentor">Technical Mentor / Engineer</option>
                    <option value="educator">School / University Educator</option>
                    <option value="other">Tech Enthusiast</option>
                  </select>
                </div>

                {/* Track of Interest */}
                <div>
                  <label htmlFor="track-select" className="block text-xs font-mono font-medium text-slate-300 mb-2">
                    Primary Interest Track
                  </label>
                  <select
                    id="track-select"
                    value={formData.interestTrack}
                    onChange={(e) => setFormData({ ...formData, interestTrack: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  >
                    <option value="Cloud Lab & AI Copilot">Cloud Lab &amp; AI Copilot (Python/JS)</option>
                    <option value="Devashtra Junior (Ages 6-12)">Devashtra Junior (Ages 6–12 Missions)</option>
                    <option value="Fullstack Engineering Cohort">Fullstack Engineering &amp; Batches</option>
                    <option value="Algorithms & System Design">Algorithms &amp; System Execution</option>
                  </select>
                </div>
              </div>

              {/* Conditional child age if parent */}
              {formData.role === 'parent' && (
                <div>
                  <label htmlFor="student-age-input" className="block text-xs font-mono font-medium text-amber-300 mb-2">
                    Child&apos;s Age (Ages 6–16)
                  </label>
                  <input
                    id="student-age-input"
                    type="number"
                    min="4"
                    max="18"
                    value={formData.studentAge || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        studentAge: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="e.g. 9"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-amber-500/40 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                  />
                </div>
              )}

              {/* Experience level */}
              <div>
                <label className="block text-xs font-mono font-medium text-slate-300 mb-2">
                  Coding Experience Level
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'beginner', label: 'Beginner (0-6 mo)' },
                    { id: 'intermediate', label: 'Intermediate' },
                    { id: 'advanced', label: 'Advanced' },
                    { id: 'curious_child', label: 'Curious Kid / Junior' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          experienceLevel: lvl.id as WaitlistFormData['experienceLevel'],
                        })
                      }
                      className={`p-2.5 rounded-xl text-xs font-medium border text-left transition-colors ${
                        formData.experienceLevel === lvl.id
                          ? 'border-cyan-400 bg-cyan-950/30 text-cyan-200'
                          : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label htmlFor="notes-textarea" className="block text-xs font-mono font-medium text-slate-400 mb-2">
                  What would you like to build or learn first? (Optional)
                </label>
                <textarea
                  id="notes-textarea"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Building microservices with Python, or teaching my daughter cipher logic..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors resize-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/25"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Securing Position in Database...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Join Exclusive Waitlist</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 text-center">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
                <span>Zero spam guarantee. You will only receive early access invites.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
