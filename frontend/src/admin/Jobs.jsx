import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { realApi, mockApi } from '../services/api';
import { Link } from 'react-router-dom';
import { Eye, Check, X, Filter, Briefcase, Clock, CheckCircle2, Pin, Plus } from 'lucide-react';

export default function Jobs() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category') || '';

  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, pinned: 0 });
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    category: 'india',
    location: '',
    salary: '',
    job_type: 'Full-time',
    contact_info: '',
    description: '',
  });

  // Sync category when URL search query changes
  useEffect(() => {
    const cat = searchParams.get('category') || '';
    setCategory(cat);
  }, [location.search]);

  // Load real jobs directly from job_posts table via admin API
  const loadJobs = async () => {
    setLoading(true);
    let data = null;

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const endpoints = [
      '/backend/api/admin/jobs',
      `${origin}/backend/api/admin/jobs`,
      '/api/admin/jobs'
    ];

    for (const endpoint of endpoints) {
      try {
        const res = await axios.get(endpoint, {
          params: { status, category },
          headers: { 'Accept': 'application/json' }
        });
        if (res.data?.success && Array.isArray(res.data.jobs)) {
          data = res.data;
          break;
        }
      } catch (err) {}
    }

    if (!data || !data.jobs) {
      try {
        data = await mockApi.getJobs(status, category);
      } catch (err) {}
    }

    if (data && Array.isArray(data.jobs)) {
      const allJobs = data.jobs;
      setJobs(allJobs);
      setStats({
        total: data.stats?.total ?? allJobs.length,
        pending: data.stats?.pending ?? allJobs.filter(j => j.status === 'pending').length,
        approved: data.stats?.approved ?? allJobs.filter(j => j.status === 'approved').length,
        rejected: data.stats?.rejected ?? allJobs.filter(j => j.status === 'rejected').length,
        pinned: data.stats?.pinned ?? allJobs.filter(j => Boolean(j.is_pinned)).length
      });
    } else {
      setJobs([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
  }, [status, category]);

  const handleApprove = async (id) => {
    setJobs(prev => prev.map(j => (j.id === id) ? { ...j, status: 'approved' } : j));
    try {
      await axios.post(`/backend/api/admin/jobs/${id}/approve`);
    } catch (err) {
      try { await mockApi.approveJob(id); } catch (e) {}
    }
  };

  const handleReject = async (id) => {
    setJobs(prev => prev.map(j => (j.id === id) ? { ...j, status: 'rejected' } : j));
    try {
      await axios.post(`/backend/api/admin/jobs/${id}/reject`);
    } catch (err) {
      try { await mockApi.rejectJob(id); } catch (e) {}
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

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.description || !formData.contact_info) return;
    setSubmitting(true);

    try {
      await mockApi.createJob(formData);
      setIsModalOpen(false);
      setFormData({
        title: '',
        company: '',
        category: 'india',
        location: '',
        salary: '',
        job_type: 'Full-time',
        contact_info: '',
        description: '',
      });
      await loadJobs();
    } catch (err) {
      console.error('Create job failed:', err);
      alert(err?.message || 'Failed to create job listing. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-outfit font-black text-2xl text-white tracking-tight">Jobs & Referrals Moderation</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-900/30 transition-all cursor-pointer hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Add Job</span>
            </button>
          </div>
          <p className="text-xs font-semibold text-slate-400 mt-1">Manage India Jobs, Overseas Jobs, and Referral listings in a single unified view.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-[#059669] hover:bg-[#047857] text-white rounded-xl px-4 py-2.5 text-xs font-extrabold shadow-lg shadow-[#059669]/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Job</span>
          </button>

          {/* Status Filter Buttons */}
          <button onClick={() => setStatus('')}
                  className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${status === '' ? 'bg-[#059669] text-white shadow-lg shadow-[#059669]/20' : 'bg-[#1E293B] border border-slate-700 text-slate-300 hover:text-white'}`}>
            <span>All Statuses</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${status === '' ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>{stats.total}</span>
          </button>
          
          <button onClick={() => setStatus('pending')}
                  className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${status === 'pending' ? 'bg-[#059669] text-white shadow-lg shadow-[#059669]/20' : 'bg-[#1E293B] border border-slate-700 text-slate-300 hover:text-white'}`}>
            <span>Pending</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${status === 'pending' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>{stats.pending}</span>
          </button>

          <button onClick={() => setStatus('approved')}
                  className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${status === 'approved' ? 'bg-[#059669] text-white shadow-lg shadow-[#059669]/20' : 'bg-[#1E293B] border border-slate-700 text-slate-300 hover:text-white'}`}>
            <span>Approved</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${status === 'approved' ? 'bg-emerald-950 text-emerald-300' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'}`}>{stats.approved}</span>
          </button>

          <button onClick={() => setStatus('rejected')}
                  className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${status === 'rejected' ? 'bg-[#059669] text-white shadow-lg shadow-[#059669]/20' : 'bg-[#1E293B] border border-slate-700 text-slate-300 hover:text-white'}`}>
            <span>Rejected</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${status === 'rejected' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>{stats.rejected}</span>
          </button>
        </div>
      </div>

      {/* Merged Section Category Tabs (India Jobs, Overseas Jobs, Referrals) */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button 
          onClick={() => setCategory('')} 
          className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            category === '' ? 'bg-[#059669] text-white shadow-lg shadow-[#059669]/20' : 'bg-[#1E293B] border border-slate-700/60 text-slate-300 hover:text-white'
          }`}
        >
          <span>💼 All Job Listings</span>
        </button>

        <button 
          onClick={() => setCategory('india')} 
          className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            category === 'india' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-[#1E293B] border border-slate-700/60 text-slate-300 hover:text-white'
          }`}
        >
          <span>🇮🇳 India Jobs</span>
        </button>

        <button 
          onClick={() => setCategory('overseas')} 
          className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            category === 'overseas' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'bg-[#1E293B] border border-slate-700/60 text-slate-300 hover:text-white'
          }`}
        >
          <span>✈️ Overseas Jobs</span>
        </button>

        <button 
          onClick={() => setCategory('community')} 
          className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            category === 'community' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-[#1E293B] border border-slate-700/60 text-slate-300 hover:text-white'
          }`}
        >
          <span>🔗 Referrals & Community</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-[#0B1120] p-5 rounded-3xl border border-[#1E293B] shadow-2xl flex flex-col justify-between min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Total Listings</span>
            <Briefcase className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-outfit font-black text-3xl text-white block">{stats.total}</span>
            <span className="text-[10px] font-extrabold text-slate-400">Merged Categories</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#0B1120] p-5 rounded-3xl border border-[#1E293B] shadow-2xl flex flex-col justify-between min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-outfit font-black text-3xl text-amber-400 block">{stats.pending}</span>
            <span className="text-[10px] font-extrabold text-amber-400 bg-amber-950/80 border border-amber-800/60 px-2 py-0.5 rounded-full">Requires Approval</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#0B1120] p-5 rounded-3xl border border-[#1E293B] shadow-2xl flex flex-col justify-between min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Approved & Live</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-outfit font-black text-3xl text-emerald-400 block">{stats.approved}</span>
            <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full">Visible on Feed</span>
          </div>
        </div>

        {/* Card 4 - Featured & Pinned */}
        <div className="bg-[#059669] p-5 rounded-3xl shadow-2xl flex flex-col justify-between min-h-[105px] text-white">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-emerald-200 uppercase tracking-widest block">Featured & Pinned</span>
            <Pin className="w-4 h-4 text-emerald-200" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-outfit font-black text-3xl block">{stats.pinned}</span>
            <span className="text-[10px] font-black text-emerald-100 bg-[#064e3b] px-2.5 py-0.5 rounded-full">Top Feed Priority</span>
          </div>
        </div>
      </div>

      {/* Main Table Board */}
      <div className="bg-[#0B1120] rounded-3xl border border-[#1E293B] shadow-2xl overflow-hidden">
        {loading ? (
          <p className="text-center text-slate-400 text-xs font-medium py-16">Loading jobs and referrals moderation data...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-slate-400 text-sm font-medium py-16">No listings found for this category or filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0F172A] border-b border-[#1E293B] text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Job Title & Section</th>
                  <th className="py-4 px-6">Employer / Source</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Submitted Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/60 text-slate-200 text-xs font-semibold">
                {jobs.map((job) => (
                  <tr key={job.id} className={`hover:bg-[#1E293B]/50 transition-colors ${job.is_pinned ? 'bg-purple-950/20' : ''}`}>
                    {/* Job Title & Category Badge */}
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-2">
                        {job.is_pinned && (
                          <span className="text-purple-400 text-sm shrink-0" title="Pinned to top feed priority">📌</span>
                        )}
                        <div>
                          <span className="font-extrabold text-white text-[13px] block leading-tight">{job.title}</span>
                          <span className="text-[11px] font-semibold mt-0.5 block flex items-center gap-1.5">
                            <span className="text-slate-400">{job.job_type || 'Full-time'} •</span>
                            {job.category === 'community' ? (
                              <span className="text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded text-[10px] font-black border border-emerald-800/60">🔗 Referral</span>
                            ) : job.category === 'overseas' ? (
                              <span className="text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded text-[10px] font-black border border-purple-800/60">✈️ Overseas</span>
                            ) : (
                              <span className="text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded text-[10px] font-black border border-blue-800/60">🇮🇳 India</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Employer / Business Name */}
                    <td className="py-4.5 px-6 font-extrabold text-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-[#1E293B] text-slate-300 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-700">🏢</span>
                        <div className="flex flex-col">
                          <span className="text-white font-extrabold block">
                            {job.business_name || job.company_name || job.company || (job.creator ? (job.creator.business_name || job.creator.company_name || job.creator.full_name) : 'Hospitality Employer')}
                          </span>
                          {job.creator && job.creator.full_name && (job.business_name || job.company_name || job.company) && (
                            <span className="text-[10px] font-semibold text-slate-400 block">
                              By: {job.creator.full_name}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4.5 px-6 font-semibold text-slate-300">
                      <span className="flex items-center gap-1 text-slate-300">
                        <span className="text-rose-400">📍</span>
                        {job.location || 'India'}
                      </span>
                    </td>

                    {/* Submitted Date */}
                    <td className="py-4.5 px-6 text-slate-400 font-semibold">
                      {job.created_at ? new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                    </td>

                    {/* Status badge */}
                    <td className="py-4.5 px-6">
                      {job.status === 'approved' ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                          Approved
                        </span>
                      ) : job.status === 'rejected' ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-950/80 text-rose-400 border border-rose-800/60">
                          Rejected
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-950/80 text-amber-400 border border-amber-800/60">
                          Pending
                        </span>
                      )}
                    </td>

                    {/* Actions: View Details, Approve, Reject, Toggle Pin */}
                    <td className="py-4.5 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {Boolean(
                          (job.description && job.description.trim() !== '') || 
                          (job.requirements && Array.isArray(job.requirements) && job.requirements.length > 0) ||
                          (job.benefits && Array.isArray(job.benefits) && job.benefits.length > 0) ||
                          (job.details && job.details.trim() !== '')
                        ) && (
                          <Link to={`/admin/jobs/${job.id}`} className="w-8 h-8 rounded-lg bg-[#1E293B] hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition-colors" title="Review Job Details">
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}

                        {job.status !== 'approved' && (
                          <button onClick={() => handleApprove(job.id)} className="w-8 h-8 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 flex items-center justify-center border border-emerald-800/60 transition-colors cursor-pointer" title="Approve Listing">
                            <Check className="w-4 h-4" />
                          </button>
                        )}

                        {job.status !== 'rejected' && (
                          <button onClick={() => handleReject(job.id)} className="w-8 h-8 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-400 flex items-center justify-center border border-rose-800/60 transition-colors cursor-pointer" title="Reject Listing">
                            <X className="w-4 h-4" />
                          </button>
                        )}

                        {/* Toggle Pin Button */}
                        <button 
                          onClick={() => handleTogglePin(job.id)} 
                          className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${job.is_pinned ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-600/20' : 'bg-[#1E293B] text-purple-400 border-slate-700 hover:bg-purple-900 hover:text-white'}`} 
                          title={job.is_pinned ? "Unpin Listing" : "Pin Listing to Top Feed Priority"}
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
        <div className="px-6 py-4 flex justify-between items-center border-t border-[#1E293B] bg-[#0F172A]/40">
          <span className="text-xs text-slate-400 font-extrabold">
            Showing all {jobs.length} Merged Listings (India, Overseas & Referrals)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Unified Jobs & Referrals Board
          </span>
        </div>
      </div>

      {/* CREATE NEW JOB MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl text-left">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">💼</span>
                <h3 className="font-outfit font-extrabold text-slate-800 text-base">Add New Job Listing</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm font-bold transition-all"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Executive Chef - 5 Star Hotel"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Company / Employer *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Taj Hotels"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#059669]"
                  >
                    <option value="india">🇮🇳 India Jobs</option>
                    <option value="overseas">✈️ Overseas Jobs</option>
                    <option value="community">🔗 Referrals & Community</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, India"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Job Type</label>
                  <select
                    value={formData.job_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, job_type: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#059669]"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Salary</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹40,000 - ₹60,000/month"
                    value={formData.salary}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Contact Info *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. hr@company.com / +91 98765 43210"
                    value={formData.contact_info}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_info: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Job Description *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Enter role responsibilities, requirements, and benefits..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669] resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-xs font-bold shadow-sm shadow-[#059669]/10 transition-all cursor-pointer disabled:opacity-60"
                >
                  {submitting ? 'Creating...' : 'Submit Job Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


