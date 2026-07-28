import React, { useEffect, useState } from 'react';
import { realApi, mockApi } from '../services/api';
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
      // 1. Attempt fetching from real backend API feed
      const res = await realApi.get('/feed?filter=all');
      if (res.data && res.data.feed && res.data.feed.data) {
        const feedJobs = res.data.feed.data.map(j => ({
          id: j.id,
          title: j.title,
          company: j.company || j.creator?.current_employer || j.creator?.full_name || 'Hospitality Employer',
          salary: j.salary || (j.salary_min ? `${j.salary_currency || ''} ${j.salary_min} - ${j.salary_max}` : 'Negotiable'),
          location: j.location || 'India',
          category: j.category || 'india',
          job_type: j.job_type || 'Full-time',
          created_at: j.created_at,
          status: j.status || 'approved',
          is_pinned: Boolean(j.is_pinned),
          creator: j.creator || { full_name: j.company }
        }));

        let filtered = feedJobs;
        if (status) filtered = filtered.filter(j => j.status === status);
        if (category) filtered = filtered.filter(j => j.category === category);

        setJobs(filtered);
        setStats({
          total: feedJobs.length,
          pending: feedJobs.filter(j => j.status === 'pending').length,
          approved: feedJobs.filter(j => j.status === 'approved').length,
          rejected: feedJobs.filter(j => j.status === 'rejected').length,
          pinned: feedJobs.filter(j => j.is_pinned).length
        });
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error('Failed to fetch real feed jobs, using fallback:', err);
    }

    // 2. Fallback to mockApi
    try {
      const data = await mockApi.getJobs(status, category);
      const allJobs = data.jobs || [];
      setJobs(allJobs);
      setStats({
        total: data.stats?.total ?? allJobs.length,
        pending: data.stats?.pending ?? allJobs.filter(j => j.status === 'pending').length,
        approved: data.stats?.approved ?? allJobs.filter(j => j.status === 'approved').length,
        rejected: data.stats?.rejected ?? allJobs.filter(j => j.status === 'rejected').length,
        pinned: data.stats?.pinned ?? allJobs.filter(j => Boolean(j.is_pinned)).length
      });
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
    try {
      await mockApi.approveJob(id);
    } catch (err) {
      console.error('Approve job failed:', err);
    }
  };

  const handleReject = async (id) => {
    setJobs(prev => prev.map(j => (j.id === id) ? { ...j, status: 'rejected' } : j));
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
    try {
      await mockApi.togglePinJob(id);
    } catch (err) {
      console.error('Toggle pin failed:', err);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Title & Dynamic Status Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit font-extrabold text-2xl text-slate-800">Job Moderation</h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Review and approve hospitality job listings across India and overseas.</p>
        </div>

        {/* Dynamic Tab Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setStatus('')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${status === '' ? 'bg-[#065f46] text-white' : 'bg-white border border-[#e2e8f0] text-slate-600 hover:bg-slate-50'}`}>
            <span>All</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${status === '' ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-100 text-slate-500'}`}>{stats.total}</span>
          </button>
          
          <button onClick={() => setStatus('pending')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${status === 'pending' ? 'bg-[#065f46] text-white' : 'bg-white border border-[#e2e8f0] text-slate-600 hover:bg-slate-50'}`}>
            <span>Pending</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${status === 'pending' ? 'bg-emerald-700 text-emerald-100' : 'bg-amber-100 text-amber-700'}`}>{stats.pending}</span>
          </button>

          <button onClick={() => setStatus('approved')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${status === 'approved' ? 'bg-[#065f46] text-white' : 'bg-white border border-[#e2e8f0] text-slate-600 hover:bg-slate-50'}`}>
            <span>Approved</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${status === 'approved' ? 'bg-emerald-700 text-emerald-100' : 'bg-emerald-100 text-emerald-700'}`}>{stats.approved}</span>
          </button>

          <button onClick={() => setStatus('rejected')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${status === 'rejected' ? 'bg-[#065f46] text-white' : 'bg-white border border-[#e2e8f0] text-slate-600 hover:bg-slate-50'}`}>
            <span>Rejected</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${status === 'rejected' ? 'bg-emerald-700 text-emerald-100' : 'bg-rose-100 text-rose-700'}`}>{stats.rejected}</span>
          </button>

          {/* Category Dropdown */}
          <div className="relative ml-2">
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="bg-white border border-[#e2e8f0] text-slate-700 text-xs font-bold py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-[#065f46] appearance-none cursor-pointer"
            >
              <option value="">Category</option>
              <option value="india">India Jobs</option>
              <option value="overseas">Overseas Jobs</option>
              <option value="community">Referrals</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Listings</span>
            <Briefcase className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block">{stats.total}</span>
            <span className="text-[10px] font-bold text-slate-400">All categories</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-outfit font-extrabold text-2xl text-amber-600 block">{stats.pending}</span>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Requires Approval</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Approved & Live</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-outfit font-extrabold text-2xl text-emerald-600 block">{stats.approved}</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Visible on Feed</span>
          </div>
        </div>

        {/* Card 4 - Featured & Pinned */}
        <div className="bg-[#065f46] p-5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[105px] text-white">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-extrabold text-emerald-200 uppercase tracking-widest block">Featured & Pinned</span>
            <Pin className="w-4 h-4 text-emerald-200" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-outfit font-extrabold text-2xl block">{stats.pinned}</span>
            <span className="text-[10px] font-bold text-emerald-100 bg-emerald-800/80 px-2 py-0.5 rounded-full">Top Feed Priority</span>
          </div>
        </div>
      </div>

      {/* Main Table Board */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-center text-slate-400 text-xs font-medium py-16">Loading jobs moderation data...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-slate-400 text-sm font-medium py-16">No job listings found for this filter.</p>
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
              <tbody className="divide-y divide-[#e2e8f0] text-xs font-semibold">
                {jobs.map((job) => (
                  <tr key={job.id} className={`hover:bg-slate-50/80 transition-colors ${job.is_pinned ? 'bg-purple-50/40' : ''}`}>
                    {/* Job Title & Pin Badge */}
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-2">
                        {job.is_pinned && (
                          <span className="text-rose-500 text-sm shrink-0" title="Pinned to top feed priority">📌</span>
                        )}
                        <div>
                          <span className="font-extrabold text-slate-800 text-[13px] block leading-tight">{job.title}</span>
                          <span className="text-[11px] text-slate-400 font-semibold mt-0.5 block">
                            {job.job_type || 'Full-time'} • <span className="capitalize">{job.category || 'india'}</span>
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Employer */}
                    <td className="py-4.5 px-6 font-bold text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">🏢</span>
                        <span>{job.creator ? (job.creator.full_name || job.creator.company_name) : (job.company || 'Hospitality Employer')}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4.5 px-6 font-semibold text-slate-600">
                      <span className="flex items-center gap-1 text-slate-500">
                        <span className="text-rose-500">📍</span>
                        {job.location || 'India'}
                      </span>
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

                    {/* Actions: View Details, Approve, Reject, Toggle Pin */}
                    <td className="py-4.5 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`/admin/jobs/${job.id}`} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center border border-[#e2e8f0] transition-colors" title="Review Job Details">
                          <Eye className="w-4 h-4" />
                        </Link>

                        {job.status !== 'approved' && (
                          <button onClick={() => handleApprove(job.id)} className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white flex items-center justify-center border border-emerald-100 hover:border-emerald-500 transition-colors cursor-pointer" title="Approve Job">
                            <Check className="w-4 h-4" />
                          </button>
                        )}

                        {job.status !== 'rejected' && (
                          <button onClick={() => handleReject(job.id)} className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white flex items-center justify-center border border-rose-100 hover:border-rose-500 transition-colors cursor-pointer" title="Reject Job">
                            <X className="w-4 h-4" />
                          </button>
                        )}

                        {/* Toggle Pin Button */}
                        <button 
                          onClick={() => handleTogglePin(job.id)} 
                          className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${job.is_pinned ? 'bg-purple-600 text-white border-purple-600 shadow-xs' : 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-600 hover:text-white'}`} 
                          title={job.is_pinned ? "Unpin Job" : "Pin Job to Top Feed Priority"}
                        >
                          <Pin className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer info */}
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
