import React, { useEffect, useState } from 'react';
import { mockApi } from '../services/api';
import { Link } from 'react-router-dom';
import { Eye, Check, X, Filter, Briefcase, Clock, CheckCircle2, Pin } from 'lucide-react';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, pinned: 0 });
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  // Load real jobs and dynamic stats from backend API
  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getJobs(status, category);
      setJobs(data.jobs || []);
      if (data.stats) {
        setStats(data.stats);
      } else {
        // Fallback dynamic computation from jobs array if backend stats field is missing
        const allJobs = data.jobs || [];
        setStats({
          total: allJobs.length,
          pending: allJobs.filter(j => j.status === 'pending').length,
          approved: allJobs.filter(j => j.status === 'approved').length,
          rejected: allJobs.filter(j => j.status === 'rejected').length,
          pinned: allJobs.filter(j => j.is_pinned).length
        });
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [status, category]);

  const handleApprove = async (id) => {
    setJobs(prev => prev.map(j => (j.id === id) ? { ...j, status: 'approved' } : j));
    setStats(prev => ({
      ...prev,
      pending: Math.max(0, prev.pending - 1),
      approved: prev.approved + 1
    }));
    try {
      await mockApi.approveJob(id);
    } catch (err) {
      console.error('Approve job failed:', err);
    }
  };

  const handleReject = async (id) => {
    setJobs(prev => prev.map(j => (j.id === id) ? { ...j, status: 'rejected' } : j));
    setStats(prev => ({
      ...prev,
      pending: Math.max(0, prev.pending - 1),
      rejected: prev.rejected + 1
    }));
    try {
      await mockApi.rejectJob(id);
    } catch (err) {
      console.error('Reject job failed:', err);
    }
  };

  const handleTogglePin = async (id) => {
    const job = jobs.find(j => j.id === id);
    const newPinnedState = !job?.is_pinned;
    setJobs(prev => prev.map(j => (j.id === id) ? { ...j, is_pinned: newPinnedState } : j));
    setStats(prev => ({
      ...prev,
      pinned: newPinnedState ? prev.pinned + 1 : Math.max(0, prev.pinned - 1)
    }));
    try {
      await mockApi.togglePinJob(id);
    } catch (err) {
      console.error('Toggle pin failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Dynamic Status Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit font-extrabold text-2xl text-slate-800">Job Moderation</h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Review and approve hospitality job listings across India and overseas.</p>
        </div>

        {/* Dynamic Tab Filters with Live Badge Counts */}
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setStatus('')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${status === '' ? 'bg-[#065f46] text-white' : 'bg-white border border-[#e2e8f0] text-slate-600 hover:bg-slate-50'}`}>
            <span>All</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${status === '' ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-100 text-slate-500'}`}>{stats.total}</span>
          </button>
          <button onClick={() => setStatus('pending')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${status === 'pending' ? 'bg-[#065f46] text-white' : 'bg-white border border-[#e2e8f0] text-slate-600 hover:bg-slate-50'}`}>
            <span>Pending</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${status === 'pending' ? 'bg-emerald-700 text-emerald-100' : 'bg-amber-100 text-amber-700'}`}>{stats.pending}</span>
          </button>
          <button onClick={() => setStatus('approved')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${status === 'approved' ? 'bg-[#065f46] text-white' : 'bg-white border border-[#e2e8f0] text-slate-600 hover:bg-slate-50'}`}>
            <span>Approved</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${status === 'approved' ? 'bg-emerald-700 text-emerald-100' : 'bg-emerald-100 text-emerald-700'}`}>{stats.approved}</span>
          </button>
          <button onClick={() => setStatus('rejected')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${status === 'rejected' ? 'bg-[#065f46] text-white' : 'bg-white border border-[#e2e8f0] text-slate-600 hover:bg-slate-50'}`}>
            <span>Rejected</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${status === 'rejected' ? 'bg-emerald-700 text-emerald-100' : 'bg-rose-100 text-rose-700'}`}>{stats.rejected}</span>
          </button>

          {/* Category Dropdown */}
          <div className="relative">
            <select value={category} onChange={(e) => setCategory(e.target.value)}
                    className="appearance-none bg-white border border-[#e2e8f0] rounded-lg pl-3 pr-8 py-2 text-xs font-bold text-slate-600 focus:outline-none focus:border-[#065f46]">
              <option value="">Category</option>
              <option value="india">India</option>
              <option value="overseas">Overseas</option>
              <option value="community">Community</option>
            </select>
            <Filter className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 100% REAL DYNAMIC KPI STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        
        {/* Total Jobs */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[95px]">
          <div className="flex items-center gap-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
            <Briefcase className="w-3.5 h-3.5 text-blue-500" />
            <span>TOTAL LISTINGS</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-outfit font-extrabold text-2xl text-slate-800">{stats.total}</span>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">All categories</span>
          </div>
        </div>

        {/* Pending Review */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[95px]">
          <div className="flex items-center gap-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>PENDING REVIEW</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-outfit font-extrabold text-2xl text-amber-600">{stats.pending}</span>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Requires Approval</span>
          </div>
        </div>

        {/* Approved Jobs */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[95px]">
          <div className="flex items-center gap-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>APPROVED & LIVE</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-outfit font-extrabold text-2xl text-emerald-600">{stats.approved}</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Visible on Feed</span>
          </div>
        </div>

        {/* Pinned & Featured */}
        <div className="bg-gradient-to-br from-[#065f46] to-[#047857] p-5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[95px] text-white">
          <div className="flex items-center gap-2 text-[10px] font-extrabold text-emerald-200 uppercase tracking-widest">
            <Pin className="w-3.5 h-3.5 text-emerald-300" />
            <span>FEATURED & PINNED</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-outfit font-extrabold text-2xl text-white">{stats.pinned}</span>
            <span className="text-[11px] font-bold text-emerald-900 bg-emerald-200 px-2 py-0.5 rounded-full">Top Feed Priority</span>
          </div>
        </div>

      </div>

      {/* Jobs Submissions Table Card */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        
        {loading ? (
          <p className="text-center text-slate-400 text-xs font-medium py-16">Loading job submissions...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-slate-400 text-sm font-medium py-16">No job listings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-[#e2e8f0] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Job Title & Type</th>
                  <th className="py-4 px-6">Employer</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Submitted Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] text-xs font-medium">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Title */}
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-2">
                        {job.is_pinned && (
                          <span className="text-indigo-600 text-xs" title="Pinned to Top">📌</span>
                        )}
                        <div>
                          <span className="font-bold text-slate-800 block leading-tight">{job.title}</span>
                          <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block">
                            {job.job_type || 'Full-time'} • {job.category || 'india'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Employer */}
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-[10px]">
                          🏢
                        </div>
                        <span className="font-bold text-slate-700">{job.company || job.creator?.full_name || 'Employer'}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                        <span className="text-rose-500">📍</span>
                        <span>{job.location}</span>
                      </div>
                    </td>

                    {/* Submitted Date */}
                    <td className="py-4.5 px-6 text-slate-500 font-bold">
                      {job.created_at ? new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                    </td>

                    {/* Status badge */}
                    <td className="py-4.5 px-6">
                      {job.status === 'approved' ? (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-[#d1fae5] text-[#065f46]">
                          Approved
                        </span>
                      ) : job.status === 'rejected' ? (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-[#fee2e2] text-[#991b1b]">
                          Rejected
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-[#fff7ed] text-[#c2410c]">
                          Pending
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4.5 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`/admin/jobs/${job.id}`} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center border border-[#e2e8f0] transition-colors" title="Review">
                          <Eye className="w-4 h-4" />
                        </Link>

                        {job.status !== 'approved' && (
                          <button onClick={() => handleApprove(job.id)} className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white flex items-center justify-center border border-emerald-100 hover:border-emerald-500 transition-colors" title="Approve">
                            <Check className="w-4 h-4" />
                          </button>
                        )}

                        {job.status !== 'rejected' && (
                          <button onClick={() => handleReject(job.id)} className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white flex items-center justify-center border border-rose-100 hover:border-rose-500 transition-colors" title="Reject">
                            <X className="w-4 h-4" />
                          </button>
                        )}

                        {job.status === 'approved' && (
                          <button onClick={() => handleTogglePin(job.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${job.is_pinned ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-500 hover:text-white'}`} title="Pin">
                            📌
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer info (ALL LOADED AT ONCE - NO PAGINATION) */}
        <div className="px-6 py-4 flex justify-between items-center border-t border-[#e2e8f0] bg-slate-50/30">
          <span className="text-xs text-slate-500 font-bold">
            Showing all {jobs.length} Job Listings
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            All Jobs Loaded At Once
          </span>
        </div>

      </div>
    </div>
  );
}
