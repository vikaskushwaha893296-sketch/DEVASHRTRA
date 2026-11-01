import React, { useState, useEffect } from 'react';
import { X, Database, RefreshCw, CheckCircle2, ShieldCheck, Clock, UserCheck } from 'lucide-react';
import { WaitlistEntry } from '../types/index.ts';

interface WaitlistAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaitlistAdminModal: React.FC<WaitlistAdminModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [healthInfo, setHealthInfo] = useState<{
    database?: string;
    uptime?: number;
    phase?: string;
  } | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const [resList, resHealth] = await Promise.all([
        fetch('/api/waitlist'),
        fetch('/api/health'),
      ]);

      if (resList.ok) {
        const data = await resList.json();
        if (data.entries) {
          setEntries(data.entries);
        }
      }

      if (resHealth.ok) {
        const health = await resHealth.json();
        setHealthInfo(health);
      }
    } catch (err) {
      console.error('Failed to load DB inspection data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRecords();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl border border-slate-800 bg-[#091120] shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#070d1a]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white">
                Database Records: Waitlist Registry
              </h3>
              <p className="text-xs text-slate-400">
                Live inspection of registered early-access records and backend status
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchRecords}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Refresh Records"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Database & Service Health Banner */}
        <div className="px-6 py-3 bg-[#060a14] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Database Driver:</span>
            <span className="text-cyan-300 font-semibold">
              {healthInfo?.database || 'MongoDB Mongoose Driver'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Active Phase:</span>
            <span className="text-teal-300">Phase 1 (Setup + Landing + Waitlist)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Records in DB:</span>
            <span className="text-white font-bold tabular-nums">{entries.length}</span>
          </div>
        </div>

        {/* Body: Records Table */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-cyan-400" />
              <span>Querying database records...</span>
            </div>
          ) : entries.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No entries found. Submit the waitlist form on the landing page to record the first entry!
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-mono">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Full Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Track</th>
                    <th className="px-4 py-3">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {entries.map((item, idx) => (
                    <tr key={item.email + idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-500 tabular-nums">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 font-medium text-white">
                        {item.fullName}
                      </td>
                      <td className="px-4 py-3 text-cyan-300 font-mono">
                        {item.email}
                      </td>
                      <td className="px-4 py-3">
                        <span className="capitalize text-slate-300">
                          {item.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 max-w-[200px] truncate">
                        {item.interestTrack}
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-mono whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#070d1a] flex items-center justify-between text-xs text-slate-400">
          <span>Devashtra Mongoose &amp; Express API · Ready for Phase 2 Auth</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
