import React, { useEffect, useState } from 'react';
import { mockApi } from '../services/api';
import { Link } from 'react-router-dom';
import { Eye, Check, X, ShieldAlert, Sparkles, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  // Load real/mock jobs
  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getJobs(status, category);
      setJobs(data.jobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [status, category]);

  const handleApprove = async (id) => {
    await mockApi.approveJob(id);
    loadJobs();
  };

  const handleReject = async (id) => {
    await mockApi.rejectJob(id);
    loadJobs();
  };

  const handleTogglePin = async (id) => {
    await mockApi.togglePinJob(id);
    loadJobs();
  };

  return (
    <div className="space-y-6">
      {/* Title & Floating Status Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit font-extrabold text-2xl text-slate-800">Job Moderation</h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Review and approve hospitality job listings across India.</p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setStatus('')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${status === '' ? 'bg-[#065f46] text-white' : 'bg-white border border-[#e2e8f0] text-slate-600 hover:bg-slate-50'}`}>
            All (128)
          </button>
          <button onClick={() => setStatus('pending')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${status === 'pending' ? 'bg-[#065f46] text-white' : 'bg-white border border-[#e2e8f0] text-slate-600 hover:bg-slate-50'}`}>
            Pending (42)
          </button>
          <button onClick={() => setStatus('approved')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${status === 'approved' ? 'bg-[#065f46] text-white' : 'bg-white border border-[#e2e8f0] text-slate-600 hover:bg-slate-50'}`}>
            Approved
          </button>
          <button onClick={() => setStatus('rejected')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${status === 'rejected' ? 'bg-[#065f46] text-white' : 'bg-white border border-[#e2e8f0] text-slate-600 hover:bg-slate-50'}`}>
            Rejected
          </button>

          {/* Category Dropdown styled as filters */}
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

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[105px]">
          <div className="flex items-center gap-1.5 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
            <span>⏱️</span>
            <span>Average Review Time</span>
          </div>
          <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-2">14 Minutes</span>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[105px]">
          <div className="flex items-center gap-1.5 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
            <span>📈</span>
            <span>Approval Rate</span>
          </div>
          <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-2">86.4%</span>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[105px]">
          <div className="flex items-center gap-1.5 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
            <span>🚨</span>
            <span>Flagged Listings</span>
          </div>
          <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-2">12</span>
        </div>

        {/* Card 4 (Dark Green Solid Background) */}
        <div className="bg-[#065f46] p-5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[105px] text-white">
          <div className="flex items-center gap-1.5 text-[9px] font-extrabold text-emerald-200 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Moderated</span>
          </div>
          <span className="font-outfit font-extrabold text-2xl block mt-2">248 Jobs Today</span>
        </div>

      </div>

      {/* Jobs Submissions Table Card */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        
        {loading ? (
          <p className="text-center text-slate-400 text-xs font-medium py-16">Loading jobs submissions...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-slate-400 text-sm font-medium py-16">No job listings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-[#e2e8f0] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-4.5 px-6">Job Title & Type</th>
                  <th className="py-4.5 px-6">Employer</th>
                  <th className="py-4.5 px-6">Location</th>
                  <th className="py-4.5 px-6">Submitted Date</th>
                  <th className="py-4.5 px-6">Status</th>
                  <th className="py-4.5 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] text-slate-700 text-xs font-semibold">
                {jobs.map(job => (
                  <tr key={job.id} className="hover:bg-slate-50/30 transition-colors">
                    {/* Title */}
                    <td className="py-4.5 px-6">
                      <span className="font-extrabold text-slate-800 block text-[13px] leading-snug">{job.title}</span>
                      <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{job.job_type || 'Full-time'} • {job.category}</span>
                    </td>

                    {/* Employer */}
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-[#eff6ff] flex items-center justify-center text-xs">🏢</div>
                        <span className="text-slate-700 font-bold">{job.company}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span>📍</span>
                        <span>{job.location}</span>
                      </div>
                    </td>

                    {/* Submitted Date */}
                    <td className="py-4.5 px-6 text-slate-500 font-bold">
                      {job.created_at ? new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Oct 24, 2023'}
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

        {/* Footer Pagination */}
        <div className="px-6 py-4 flex justify-between items-center border-t border-[#e2e8f0] bg-slate-50/10">
          <span className="text-xs text-slate-400 font-bold">Showing 1-10 of 128 results</span>
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-slate-400"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-7 h-7 rounded-lg bg-[#065f46] text-white flex items-center justify-center text-xs font-bold">1</button>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">2</button>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">3</button>
            <span className="text-slate-400 px-1 font-bold">...</span>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">13</button>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-slate-400"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

      </div>
    </div>
  );
}
