import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Shield, Users, Database, Layers, CheckCircle, Search, RefreshCw, UserCheck, AlertTriangle } from 'lucide-react';
import { UserRole } from '../../types/index.ts';

interface AdminUserRecord {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

interface WaitlistRecord {
  email: string;
  fullName: string;
  role: string;
  interestTrack: string;
  status: string;
  createdAt: string;
}

export const AdminDashboard: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'users' | 'waitlist'>('users');

  const [metrics, setMetrics] = useState<{
    totalRegisteredUsers: number;
    roleBreakdown: Record<string, number>;
    waitlistCount: number;
    isMongoConnected: boolean;
    databaseEngine: string;
  } | null>(null);

  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistRecord[]>([]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/admin', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMetrics(data.metrics);
          setUsers(data.users || []);
          setWaitlist(data.waitlist || []);
        }
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [token]);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredWaitlist = waitlist.filter((w) => {
    return (
      w.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.interestTrack.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleAdmitWaitlistEntry = (email: string) => {
    setWaitlist((prev) =>
      prev.map((entry) =>
        entry.email === email ? { ...entry, status: 'admitted' } : entry
      )
    );
    alert(`Entry ${email} has been admitted to Batch 1 and invited.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/20 via-[#0e1224] to-[#070e1c] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-wider">
            <Shield className="h-4 w-4" />
            <span>Root Operations &amp; Administration</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Devashtra System Command
          </h1>
          <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
            Manage user directory, review role privileges, control cohort seat admissions, and monitor live database telemetry.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white hover:border-slate-700 transition-colors self-start md:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync DB Records</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#091122]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Accounts</span>
            <Users className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-white tabular-nums">
            {metrics?.totalRegisteredUsers || users.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">4 Distinct Roles</div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-[#091122]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Waitlist Queue</span>
            <Layers className="h-4 w-4 text-amber-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-amber-300 tabular-nums">
            {metrics?.waitlistCount || waitlist.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Early Access Submissions</div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-[#091122]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Database Engine</span>
            <Database className="h-4 w-4 text-teal-400" />
          </div>
          <div className="font-mono text-sm font-bold text-teal-300 truncate">
            {metrics?.databaseEngine || 'MongoDB Mongoose'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            {metrics?.isMongoConnected ? 'Atlas Cluster Connected' : 'Resilient Active Store'}
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-[#091122]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Active Cohorts</span>
            <CheckCircle className="h-4 w-4 text-purple-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-purple-300 tabular-nums">
            2 Batches
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Python 3 &amp; Fullstack</div>
        </div>
      </div>

      {/* Directory Section with Tabs */}
      <div className="rounded-2xl border border-slate-800 bg-[#091122] overflow-hidden">
        {/* Navigation & Search Bar */}
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-start">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'users'
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Registered Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('waitlist')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'waitlist'
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Waitlist Registry ({waitlist.length})
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email..."
                className="pl-9 pr-4 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            {activeTab === 'users' && (
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-purple-400"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="parent">Parents</option>
                <option value="mentor">Mentors</option>
                <option value="admin">Admins</option>
              </select>
            )}
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          {activeTab === 'users' ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#070d1a] text-slate-400 border-b border-slate-800 font-mono">
                <tr>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Registered</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {filteredUsers.map((u) => (
                  <tr key={u.email} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold font-mono text-purple-300">
                        {u.name.charAt(0)}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-cyan-300">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-purple-950/60 text-purple-300 border border-purple-800/50'
                            : u.role === 'mentor'
                            ? 'bg-teal-950/60 text-teal-300 border border-teal-800/50'
                            : u.role === 'parent'
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-800/50'
                            : 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/50'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => alert(`Managing permissions for ${u.name}`)}
                        className="text-xs text-purple-400 hover:text-purple-300 underline"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#070d1a] text-slate-400 border-b border-slate-800 font-mono">
                <tr>
                  <th className="px-6 py-3.5">Candidate</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Interest Track</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Admit Seat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {filteredWaitlist.map((w, idx) => (
                  <tr key={w.email + idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{w.fullName}</td>
                    <td className="px-6 py-4 font-mono text-cyan-300">{w.email}</td>
                    <td className="px-6 py-4 capitalize text-slate-300">{w.role}</td>
                    <td className="px-6 py-4 text-slate-400 max-w-[220px] truncate">{w.interestTrack}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          w.status === 'admitted'
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {w.status === 'admitted' ? (
                        <span className="text-emerald-400 font-mono text-[11px] font-semibold">
                          Admitted
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAdmitWaitlistEntry(w.email)}
                          className="px-3 py-1 text-[11px] font-semibold text-slate-950 bg-purple-400 hover:bg-purple-300 rounded-lg transition-colors"
                        >
                          Admit to Batch
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
