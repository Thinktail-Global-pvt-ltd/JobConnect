import React, { useEffect, useState } from 'react';
import { mockApi } from '../services/api';
import { Link } from 'react-router-dom';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

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
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Review Time</span>
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-1.5">14 Minutes</span>
          </div>
          <div className="text-xl p-3 bg-emerald-50 rounded-xl text-emerald-600">⏱️</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Approval Rate</span>
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-1.5">90.4%</span>
          </div>
          <div className="text-xl p-3 bg-blue-50 rounded-xl text-blue-600">📈</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Flagged Listings</span>
            <span className="font-outfit font-extrabold text-2xl text-rose-600 block mt-1.5">12</span>
          </div>
          <div className="text-xl p-3 bg-rose-50 rounded-xl text-rose-600">🚨</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Auto-Moderator</span>
            <span className="font-outfit font-extrabold text-2xl text-brand-600 block mt-1.5">Active Today</span>
          </div>
          <div className="text-xl p-3 bg-brand-50 rounded-xl text-brand-600">🤖</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 md:border-none pb-3 md:pb-0">
          <button onClick={() => setStatus('')} 
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${status === '' ? 'bg-[#eff6ff] text-[#0f172a]' : 'text-slate-500 hover:bg-slate-55 hover:bg-slate-50 hover:text-slate-800'}`}>
            All Jobs
          </button>
          <button onClick={() => setStatus('pending')} 
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${status === 'pending' ? 'bg-amber-50 text-amber-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
            Pending
          </button>
          <button onClick={() => setStatus('approved')} 
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
            Approved
          </button>
          <button onClick={() => setStatus('rejected')} 
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${status === 'rejected' ? 'bg-rose-50 text-rose-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
            Rejected
          </button>
        </div>

        <div className="flex items-center gap-3 self-stretch md:self-auto">
          <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 focus:outline-none focus:border-brand-500 focus:bg-white transition-all">
            <option value="">All Categories</option>
            <option value="india">India</option>
            <option value="overseas">Overseas</option>
            <option value="community">Community</option>
          </select>
          {(status || category) && (
            <button onClick={() => { setStatus(''); setCategory(''); }} 
                    className="bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-500 hover:text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all">
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/20">
          <h2 className="font-outfit font-extrabold text-base text-slate-800">Job Submissions</h2>
        </div>

        {loading ? (
          <p className="text-center text-slate-400 text-xs font-medium py-12">Loading job list...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-slate-400 text-sm font-medium py-12">No job listings found matching filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Job Title & Type</th>
                  <th className="py-4 px-6">Employer</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Submitted Date</th>
                  <th className="py-4 px-6">Featured</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                {jobs.map(job => (
                  <tr key={job.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-800 block leading-tight">{job.title}</span>
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-slate-400">
                        <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">{job.category}</span>
                        {job.job_type && (
                          <>
                            <span className="h-1 w-1 rounded-full bg-slate-200"></span>
                            <span>💼 {job.job_type}</span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-700 block leading-tight">{job.company}</span>
                      <span className="text-[11px] font-semibold text-slate-400 block mt-0.5">By: {job.creator?.mobile_number}</span>
                    </td>

                    <td className="py-4 px-6 font-semibold text-slate-600">
                      📍 {job.location}
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-500 font-semibold">
                      {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recently'}
                    </td>

                    <td className="py-4 px-6">
                      {job.is_pinned ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">
                          📌 Pinned
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-semibold">Standard</span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      {job.status === 'approved' ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                          Approved
                        </span>
                      ) : job.status === 'rejected' ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100">
                          Rejected
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100">
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <Link to={`/admin/jobs/${job.id}`} className="bg-slate-50 hover:bg-slate-100 text-slate-500 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-100 transition-colors">
                          Review
                        </Link>

                        {job.status !== 'approved' && (
                          <button onClick={() => handleApprove(job.id)} className="bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-emerald-100 hover:border-emerald-500 transition-colors">
                            ✓
                          </button>
                        )}

                        {job.status !== 'rejected' && (
                          <button onClick={() => handleReject(job.id)} className="bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-rose-100 hover:border-rose-500 transition-colors">
                            ✕
                          </button>
                        )}

                        {job.status === 'approved' && (
                          <button onClick={() => handleTogglePin(job.id)} className="bg-indigo-50 hover:bg-indigo-500 border border-indigo-100 text-indigo-600 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all">
                            {job.is_pinned ? 'Unpin' : 'Pin'}
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
      </div>
    </div>
  );
}
