import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { realApi, mockApi } from '../services/api';
import { Link } from 'react-router-dom';
import { Eye, Check, X, Filter, Briefcase, Clock, CheckCircle2, Pin, Plus, AlertOctagon, Zap, Building2, MapPin, Plane, Link2, UserCheck } from 'lucide-react';

export default function Jobs() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category') || '';

  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, pinned: 0 });
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [roleFilter, setRoleFilter] = useState(''); // '', 'chef', 'job_seeker', 'employer'
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const employerIdFilter = searchParams.get('employer_id') || searchParams.get('employer') || '';
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
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

  // Sync category & search query when URL parameters change
  useEffect(() => {
    const cat = searchParams.get('category') || '';
    setCategory(cat);
    const q = searchParams.get('search') || '';
    if (q) setSearchQuery(q);
  }, [location.search]);

  // Load real jobs directly from job_posts table via admin API
  const loadJobs = async () => {
    setLoading(true);
    let data = null;

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const endpoints = [
      'http://178.16.138.159/backend/api/admin/jobs',
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
    setCurrentPage(1);
    loadJobs();
  }, [status, category]);

  const chefCount = jobs.filter(j => {
    const r = (j.posted_by_role || j.submitted_by_role || j.creator?.active_profile || j.creator?.user_role || '').toLowerCase();
    return r === 'chef' || r === 'cook';
  }).length;

  const jobseekerCount = jobs.filter(j => {
    const r = (j.posted_by_role || j.submitted_by_role || j.creator?.active_profile || j.creator?.user_role || '').toLowerCase();
    return r === 'jobseeker' || r === 'job_seeker' || r === 'talent' || r === 'candidate';
  }).length;

  const employerCount = jobs.filter(j => {
    const r = (j.posted_by_role || j.submitted_by_role || j.creator?.active_profile || j.creator?.user_role || '').toLowerCase();
    return r === 'employer' || r === 'agency' || r === 'recruiter' || r === 'hirer' || r === 'administrator' || r === 'admin';
  }).length;

  const filteredJobs = jobs.filter(job => {
    // 1. Role Filter
    if (roleFilter) {
      const r = (job.posted_by_role || job.submitted_by_role || job.creator?.active_profile || job.creator?.user_role || '').toLowerCase();
      if (roleFilter === 'chef' && !(r === 'chef' || r === 'cook')) return false;
      if (roleFilter === 'job_seeker' && !(r === 'jobseeker' || r === 'job_seeker' || r === 'talent' || r === 'candidate')) return false;
      if (roleFilter === 'employer' && !(r === 'employer' || r === 'agency' || r === 'recruiter' || r === 'hirer' || r === 'administrator' || r === 'admin')) return false;
    }

    // 2. Employer ID filter (if specified)
    if (employerIdFilter) {
      const createdBy = String(job.created_by || job.user_id || job.creator?.id || '');
      if (createdBy && createdBy === String(employerIdFilter)) {
        return true;
      }
    }

    // 3. Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const title = (job.title || job.job_title || '').toLowerCase();
      const company = (job.company || '').toLowerCase();
      const creatorName = (job.creator?.full_name || job.creator?.name || '').toLowerCase();
      const contactPerson = (job.contact_person || '').toLowerCase();
      const locationStr = (job.location || '').toLowerCase();
      const createdBy = String(job.created_by || job.user_id || '');

      return title.includes(q) || 
             company.includes(q) || 
             creatorName.includes(q) || 
             contactPerson.includes(q) || 
             locationStr.includes(q) || 
             createdBy === q;
    }

    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
    <div className="space-y-3 text-left">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-outfit font-bold text-[20px] leading-tight text-slate-900 tracking-tight">Job Moderation</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden"
            >
              <Plus className="w-4 h-4" />
              <span>Add Job</span>
            </button>
          </div>
          <p className="text-[11px] font-medium text-slate-600 mt-0.5">Review and approve hospitality job listings across India.</p>
        </div>

        <div className="flex items-center gap-1 flex-wrap justify-end bg-white border border-[#d7dce2] rounded-lg p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-[#f58220] hover:bg-[#df6d0f] text-white rounded-md px-3.5 py-2 text-[11px] font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Job</span>
          </button>

          {/* Status Filter Buttons */}
          <button onClick={() => setStatus('')}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${status === '' ? 'bg-[#153e69] text-white' : 'bg-white border border-[#d1d5db] text-slate-700 hover:bg-[#f3f4f6]'}`}>
            <span>All Statuses</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${status === '' ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-600'}`}>{stats.total}</span>
          </button>
          
          <button onClick={() => setStatus('pending')}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${status === 'pending' ? 'bg-[#153e69] text-white' : 'bg-white border border-[#d1d5db] text-slate-700 hover:bg-[#f3f4f6]'}`}>
            <span>Pending</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${status === 'pending' ? 'bg-white/15 text-white' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>{stats.pending}</span>
          </button>

          <button onClick={() => setStatus('approved')}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${status === 'approved' ? 'bg-[#153e69] text-white' : 'bg-white border border-[#d1d5db] text-slate-700 hover:bg-[#f3f4f6]'}`}>
            <span>Approved</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${status === 'approved' ? 'bg-white/15 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>{stats.approved}</span>
          </button>

          <button onClick={() => setStatus('rejected')}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${status === 'rejected' ? 'bg-[#153e69] text-white' : 'bg-white border border-[#d1d5db] text-slate-700 hover:bg-[#f3f4f6]'}`}>
            <span>Rejected</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${status === 'rejected' ? 'bg-white/15 text-white' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>{stats.rejected}</span>
          </button>
        </div>
      </div>

      {/* Posted By Filter Bar */}
      <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-xl border border-[#d7dce2] shadow-2xs flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider px-1 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-[#153e69]" /> Posted By:
          </span>

          <button
            type="button"
            onClick={() => { setRoleFilter(''); setCurrentPage(1); }}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              roleFilter === '' 
                ? 'bg-[#153e69] text-white shadow-xs' 
                : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>All Roles</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${roleFilter === '' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {jobs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => { setRoleFilter('chef'); setCurrentPage(1); }}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              roleFilter === 'chef' 
                ? 'bg-purple-700 text-white shadow-xs' 
                : 'bg-white border border-purple-200 text-purple-800 hover:bg-purple-50'
            }`}
          >
            <span>Chef</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${roleFilter === 'chef' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-800 border border-purple-200'}`}>
              {chefCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => { setRoleFilter('job_seeker'); setCurrentPage(1); }}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              roleFilter === 'job_seeker' 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'bg-white border border-blue-200 text-blue-800 hover:bg-blue-50'
            }`}
          >
            <span>Jobseeker</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${roleFilter === 'job_seeker' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800 border border-blue-200'}`}>
              {jobseekerCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => { setRoleFilter('employer'); setCurrentPage(1); }}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              roleFilter === 'employer' 
                ? 'bg-emerald-700 text-white shadow-xs' 
                : 'bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            <span>Employer</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${roleFilter === 'employer' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}`}>
              {employerCount}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-[#153e69] border border-blue-200 text-xs font-black">
              <span>Filtered by: "{searchQuery}"</span>
              <button 
                onClick={() => setSearchQuery('')}
                className="hover:text-rose-600 font-extrabold cursor-pointer ml-1 text-sm"
                title="Clear filter"
              >
                ✕
              </button>
            </span>
          )}
          <span className="text-[11px] font-bold text-slate-500 px-2">
            Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
          </span>
        </div>
      </div>

          <span><MapPin className="w-3.5 h-3.5" /> India Jobs</span>
      <div className="hidden items-center gap-2 border-b border-[#d9dee4] pb-3 overflow-x-auto">
        <button 
          onClick={() => setCategory('')} 
          className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            category === '' ? 'bg-[#153e69] text-white' : 'bg-[#1E293B] border border-slate-700/60 text-slate-700 hover:text-white'
          }`}
        >
          <span><Briefcase className="w-3.5 h-3.5" /> All Job Listings</span>
        </button>

        <button 
          onClick={() => setCategory('india')} 
          className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            category === 'india' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-[#1E293B] border border-slate-700/60 text-slate-700 hover:text-white'
          }`}
        >
          <span><MapPin className="w-3.5 h-3.5" /> India Jobs</span>
        </button>

        <button 
          onClick={() => setCategory('overseas')} 
          className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            category === 'overseas' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'bg-[#1E293B] border border-slate-700/60 text-slate-700 hover:text-white'
          }`}
        >
          <span><Plane className="w-3.5 h-3.5" /> Overseas Jobs</span>
        </button>

        <button 
          onClick={() => setCategory('community')} 
          className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            category === 'community' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-[#1E293B] border border-slate-700/60 text-slate-700 hover:text-white'
          }`}
        >
          <span><Link2 className="w-3.5 h-3.5" /> Referrals & Community</span>
        </button>
      </div>

      {/* Main Table Board */}
      <div className="bg-white rounded-xl border border-[#d7dce2] shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-center text-slate-500 text-xs font-medium py-16">Loading jobs and referrals moderation data...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-slate-500 text-sm font-medium py-16">No listings found for this category or filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#e5e5e5] border-b border-[#cfd5dc] text-[11px] font-bold text-[#344054] uppercase tracking-wider">
                  <th className="py-2.5 px-4">Job Title & Section</th>
                  <th className="py-2.5 px-4">Employer / Source</th>
                  <th className="py-2.5 px-4">Location</th>
                  <th className="py-2.5 px-4">Submitted Date</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d9dee4] text-[#183b61] text-xs font-semibold">
                {paginatedJobs.map((job) => (
                  <tr key={job.id} className={`hover:bg-[#f3f6f8] transition-colors ${job.is_pinned ? 'bg-purple-50' : ''}`}>
                    {/* Job Title & Category Badge */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        {job.is_pinned && (
                          <Pin className="w-3.5 h-3.5 text-purple-600 shrink-0" title="Pinned to top feed priority" />
                        )}
                        <div>
                          <span className="font-bold text-slate-900 text-[12px] block leading-tight">{job.title}</span>
                          <span className="text-[9px] font-semibold mt-0.5 block flex items-center gap-1">
                            <span className="text-slate-500">{job.job_type || 'Full-time'} <span aria-hidden="true">•</span></span>
                            {job.category === 'community' ? (
                              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-black border border-emerald-200"><Link2 className="inline w-3 h-3 mr-1" />Referral</span>
                            ) : job.category === 'overseas' ? (
                              <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[10px] font-black border border-purple-200"><Plane className="inline w-3 h-3 mr-1" />Overseas</span>
                            ) : (
                              <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[10px] font-black border border-blue-200"><Briefcase className="inline w-3 h-3 mr-1" />India</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Employer / Business Name */}
                    <td className="py-4.5 px-6 font-extrabold text-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-slate-100 text-[#153e69] flex items-center justify-center shrink-0 border border-[#d7dce2]"><Building2 className="w-3 h-3" /></span>
                        <div className="flex flex-col">
                          <span className="text-slate-800 font-bold block">
                            {job.business_name || job.company_name || job.company || (job.creator ? (job.creator.business_name || job.creator.company_name || job.creator.full_name) : 'Hospitality Employer')}
                          </span>
                          {job.creator && job.creator.full_name && (job.business_name || job.company_name || job.company) && (
                            <span className="text-[10px] font-semibold text-slate-500 block">
                              By: {job.creator.full_name}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4.5 px-6 font-semibold text-slate-700">
                      <span className="flex items-center gap-1 text-slate-700">
                        <span className="text-slate-500">{job.job_type || 'Full-time'} <span aria-hidden="true">•</span></span>
                        {job.location || 'India'}
                      </span>
                    </td>

                    {/* Submitted Date */}
                    <td className="py-4.5 px-6 text-slate-500 font-semibold">
                      {job.created_at ? new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                    </td>

                    {/* Status badge */}
                    <td className="py-2.5 px-3">
                      {job.status === 'approved' ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#d9f3e7] text-[#137333] border-0">
                          Approved
                        </span>
                      ) : job.status === 'rejected' ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#fee2e2] text-[#c5221f] border-0">
                          Rejected
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#fce7b2] text-[#9a6700] border-0">
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
                          <Link to={`/admin/jobs/${job.id}`} className="w-6 h-6 rounded-md bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center border border-[#d7dce2] transition-colors" title="Review Job Details">
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}

                        {job.status !== 'approved' && (
                          <button onClick={() => handleApprove(job.id)} className="w-6 h-6 rounded-md bg-white hover:bg-emerald-50 text-[#137333] flex items-center justify-center border border-[#d7dce2] transition-colors cursor-pointer" title="Approve Listing">
                            <Check className="w-4 h-4" />
                          </button>
                        )}

                        {job.status !== 'rejected' && (
                          <button onClick={() => handleReject(job.id)} className="w-6 h-6 rounded-md bg-white hover:bg-rose-50 text-[#c5221f] flex items-center justify-center border border-[#d7dce2] transition-colors cursor-pointer" title="Reject Listing">
                            <X className="w-4 h-4" />
                          </button>
                        )}

                        {/* Toggle Pin Button */}
                        <button 
                          onClick={() => handleTogglePin(job.id)} 
                          className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${job.is_pinned ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-white text-purple-600 border-[#d7dce2] hover:bg-purple-50'}`} 
                          title={job.is_pinned ? "Unpin Listing" : "Pin Listing to Jobs Today"}
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

        {/* Pagination footer */}
        <div className="px-3 py-2.5 flex flex-wrap justify-between items-center gap-2 border-t border-[#d9dee4] bg-white">
          <span className="text-[10px] text-slate-600 font-semibold">
            Showing {filteredJobs.length === 0 ? 0 : ((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredJobs.length)} of {filteredJobs.length} results
          </span>
          <div className="flex items-center gap-1">
            <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage(page => Math.max(1, page - 1))} className="w-6 h-6 rounded-md border border-[#d7dce2] bg-white text-slate-500 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">‹</button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
              <button key={page} type="button" onClick={() => setCurrentPage(page)} className={`w-6 h-6 rounded-md border text-[10px] font-bold cursor-pointer ${currentPage === page ? 'bg-[#153e69] border-[#153e69] text-white' : 'bg-white border-[#d7dce2] text-slate-700 hover:bg-slate-50'}`}>{page}</button>
            ))}
            <button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))} className="w-6 h-6 rounded-md border border-[#d7dce2] bg-white text-slate-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">›</button>
          </div>
        </div>
      </div>

      {/* CREATE NEW JOB MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl text-left">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center"><Briefcase className="w-4 h-4" /></span>
                <h3 className="font-outfit font-extrabold text-slate-800 text-base">Add New Job Listing</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-600 flex items-center justify-center text-sm font-bold transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Job Title *</label>
                <input
                  type="text"
                  required
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
                    <option value="india">India</option>
                    <option value="ksa">KSA</option>
                    <option value="dubai">Dubai</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Location</label>
                  <input
                    type="text"
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













