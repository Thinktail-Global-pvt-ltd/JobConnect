import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { realApi, mockApi } from '../services/api';
import { Link } from 'react-router-dom';
import { Eye, Check, X, Filter, Briefcase, Clock, CheckCircle2, Pin, Plus, Sparkles } from 'lucide-react';

export default function Jobs() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category') || '';

  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, pinned: 0 });
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true);

  // Add Job Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    country: 'India',
    category: 'india',
    salary: '',
    experience_range: '1-3 Years',
    job_type: 'Full-Time',
    open_positions: 1,
    description: '',
    status: 'approved',
    is_pinned: false,
    is_referral: false,
    visa_assistance: false,
    accommodation_available: false,
    contact_person: '',
    contact_info: ''
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

    const endpoints = [
      '/backend/api/admin/jobs',
      '/api/admin/jobs',
      'http://178.16.138.159/backend/api/admin/jobs'
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
      await axios.post(`/backend/api/admin/jobs/${id}/toggle-pin`);
    } catch (err) {
      try { await mockApi.togglePinJob(id); } catch (e) {}
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location) {
      alert('Please fill in required fields (Job Title and Location).');
      return;
    }
    setIsSubmitting(true);
    let success = false;
    let errorMessage = '';

    const payload = {
      ...formData,
      company: formData.company || 'Jobrito Partner',
      contact_person: formData.contact_person || 'Recruitment Lead',
      contact_info: formData.contact_info || 'jobs@jobrito.com',
      description: formData.description || `Job Opportunity for ${formData.title} in ${formData.location}. Apply now on Jobrito.`
    };

    const endpoints = [
      '/backend/api/admin/jobs/store',
      '/backend/api/admin/jobs',
      '/api/admin/jobs/store',
      'http://178.16.138.159/backend/api/admin/jobs/store'
    ];

    let createdJob = null;

    for (const endpoint of endpoints) {
      try {
        const res = await axios.post(endpoint, payload, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        if (res.data?.success || res.status === 200 || res.status === 201) {
          success = true;
          createdJob = res.data?.job;
          break;
        }
      } catch (err) {
        console.error(`Failed posting to ${endpoint}:`, err);
        errorMessage = err.response?.data?.message || err.message || errorMessage;
      }
    }

    if (success) {
      setShowAddModal(false);
      setFormData({
        title: '',
        company: '',
        location: '',
        country: 'India',
        category: 'india',
        salary: '',
        experience_range: '1-3 Years',
        job_type: 'Full-Time',
        open_positions: 1,
        description: '',
        status: 'approved',
        is_pinned: false,
        is_referral: false,
        visa_assistance: false,
        accommodation_available: false,
        contact_person: '',
        contact_info: ''
      });

      if (createdJob) {
        setJobs(prev => [createdJob, ...prev.filter(j => j.id !== createdJob.id)]);
      }

      setStatus('');
      setCategory('');
      loadJobs();
    } else {
      alert('Failed to create job posting: ' + (errorMessage || 'Server response error'));
    }
    setIsSubmitting(false);
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

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
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

      {/* Add Job Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0F172A] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#1E293B]/80 border-b border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-outfit font-black text-lg text-white">Post New Job</h3>
                  <p className="text-[11px] font-semibold text-slate-400">Save new listing directly into job_posts table</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Executive Chef, Sous Chef"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Company / Restaurant Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Taj Hotels, Marriott"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Location / City */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Location / City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai, New Delhi, Dubai"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Country</label>
                  <input
                    type="text"
                    placeholder="e.g. India, UAE, Saudi Arabia"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Listing Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="india">🇮🇳 India Jobs</option>
                    <option value="overseas">✈️ Overseas Jobs</option>
                    <option value="community">🔗 Referrals & Community</option>
                  </select>
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Job Type</label>
                  <select
                    value={formData.job_type}
                    onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Salary Range</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹50,000 - ₹80,000 / month"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Experience Range */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Experience Required</label>
                  <select
                    value={formData.experience_range}
                    onChange={(e) => setFormData({ ...formData, experience_range: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Freshers">Freshers</option>
                    <option value="1-3 Years">1-3 Years</option>
                    <option value="3-5 Years">3-5 Years</option>
                    <option value="5-10 Years">5-10 Years</option>
                    <option value="10+ Years">10+ Years</option>
                  </select>
                </div>

                {/* Open Positions */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Open Vacancies</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.open_positions}
                    onChange={(e) => setFormData({ ...formData, open_positions: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Approval Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Approval Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="approved">Approved & Live</option>
                    <option value="pending">Pending Review</option>
                  </select>
                </div>
              </div>

              {/* Checkbox Options */}
              <div className="flex items-center gap-6 py-2 border-y border-slate-800/80 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.is_pinned}
                    onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                    className="w-4 h-4 rounded bg-[#1E293B] border-slate-700 text-emerald-500 focus:ring-0"
                  />
                  <span>📌 Pin to Top Feed</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.visa_assistance}
                    onChange={(e) => setFormData({ ...formData, visa_assistance: e.target.checked })}
                    className="w-4 h-4 rounded bg-[#1E293B] border-slate-700 text-emerald-500 focus:ring-0"
                  />
                  <span>✈️ Visa Assistance</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.accommodation_available}
                    onChange={(e) => setFormData({ ...formData, accommodation_available: e.target.checked })}
                    className="w-4 h-4 rounded bg-[#1E293B] border-slate-700 text-emerald-500 focus:ring-0"
                  />
                  <span>🏠 Accommodation</span>
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Job Description & Requirements</label>
                <textarea
                  rows="4"
                  placeholder="Enter detailed job description, duties, and candidate requirements..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              {/* Footer Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-900/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Saving Job...</span>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Save to Database</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


