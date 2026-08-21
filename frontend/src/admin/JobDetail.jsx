import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { realApi, mockApi } from '../services/api';
import { Check, X, Edit, ArrowLeft, CheckSquare, Square, Building2, MapPin, Briefcase, DollarSign, Calendar } from 'lucide-react';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Approval Checklist State
  const [checklist, setChecklist] = useState({
    status: false,
    salary: false,
    content: false,
    contact: false,
  });

  // Edit Job Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    company: '',
    salary: '',
    experience_range: '',
    job_type: '',
    location: '',
    description: '',
  });

  const loadJob = async () => {
    setLoading(true);
    let found = null;

    try {
      const res = await realApi.get(`/api/admin/jobs/${id}`);
      if (res.data?.success && res.data.job) {
        found = res.data.job;
      }
    } catch (e) {}

    if (!found) {
      const endpoints = [
        `/backend/api/admin/jobs/${id}`,
        `/api/admin/jobs/${id}`,
        `/admin/jobs/${id}`
      ];
      for (const ep of endpoints) {
        try {
          const res = await axios.get(ep, { headers: { 'Accept': 'application/json' } });
          if (res.data?.job || res.data?.success) {
            found = res.data.job || res.data;
            break;
          }
        } catch (e) {}
      }
    }

    if (!found) {
      try {
        const data = await mockApi.getJobDetail(id);
        if (data && (data.job || data.id)) {
          found = data.job || data;
        }
      } catch (e) {}
    }

    if (found) {
      const creator = found.creator || {};
      const empP = creator.employer_profile || creator.employerProfile || {};
      setJob({
        ...found,
        id: found.id,
        title: found.title || found.job_role || `Job Listing #${found.id}`,
        company: found.company || empP.business_name || creator.current_employer || creator.full_name || 'Hospitality Employer',
        salary: found.salary || found.salary_range || (found.salary_min ? `${found.salary_currency || 'SAR'} ${found.salary_min} - ${found.salary_max}` : 'Best in Industry'),
        experience_range: found.experience_range || '1-3 Years',
        job_type: found.job_type || found.work_type || 'Full-time',
        location: found.location || 'India',
        country: found.country || 'India',
        open_positions: found.open_positions || found.vacancies || 1,
        category: found.category || found.job_category || 'india',
        industry_segment: found.industry_segment || empP.industry_segment || 'Hospitality / F&B',
        description: found.description || 'No detailed description provided.',
        requirements: Array.isArray(found.requirements) ? found.requirements : (found.requirements ? [found.requirements] : []),
        benefits: Array.isArray(found.benefits) ? found.benefits : (found.benefits ? [found.benefits] : []),
        visa_assistance: Boolean(found.visa_assistance),
        accommodation_available: Boolean(found.accommodation_available),
        status: found.status || 'approved',
        created_at: found.created_at,
        creator: {
          full_name: found.contact_person || creator.full_name || creator.name || empP.contact_person_name || 'Hiring Manager',
          email: creator.email || empP.business_email || (str => str && str.includes('@') ? str : null)(found.contact_info) || 'Not Provided',
          mobile_number: creator.mobile_number || empP.business_mobile || found.contact_info || 'N/A'
        }
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadJob();
  }, [id]);

  const handleApprove = async () => {
    try {
      await mockApi.approveJob(id);
      setJob(prev => prev ? { ...prev, status: 'approved' } : prev);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async () => {
    try {
      await mockApi.rejectJob(id);
      setJob(prev => prev ? { ...prev, status: 'rejected' } : prev);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenEditModal = () => {
    if (!job) return;
    setEditForm({
      title: job.title || '',
      company: job.company || '',
      salary: job.salary || '',
      experience_range: job.experience_range || '',
      job_type: job.job_type || job.work_type || 'Full-time',
      location: job.location || '',
      description: job.description || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let updatedData = null;
      try {
        const res = await realApi.post(`/api/admin/jobs/${id}/update`, editForm);
        if (res && res.data && (res.data.job || res.data.success)) {
          updatedData = res.data.job;
        }
      } catch (err) {
        console.warn("Backend API update notice (updating local state):", err);
      }

      setJob(prev => ({
        ...prev,
        ...editForm,
        ...(updatedData || {})
      }));

      setIsEditModalOpen(false);
      alert("Job posting updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update job posting: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCheck = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-bold text-slate-400">Loading Job Submission #{id} Details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="space-y-4 text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm p-8 max-w-md mx-auto my-12">
        <div className="text-4xl mb-2">📋</div>
        <p className="text-base font-extrabold text-slate-800">Job Listing #{id} Not Found</p>
        <p className="text-xs font-medium text-slate-400">The requested job listing may have been removed or does not exist.</p>
        <div className="pt-2">
          <Link to="/admin/jobs" className="inline-flex items-center gap-2 text-xs font-bold bg-[#065f46] text-white px-5 py-2.5 rounded-xl hover:bg-[#044e39] transition">
            ← Back to Job Moderation
          </Link>
        </div>
      </div>
    );
  }

  const createdDateStr = job.created_at 
    ? new Date(job.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Recently';

  return (
    <div className="space-y-6 text-left">
      {/* Breadcrumbs & Back arrow */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
        <Link to="/admin/jobs" className="hover:text-slate-600">Jobs</Link>
        <span>&gt;</span>
        <span className="capitalize">{job.status} Review</span>
        <span>&gt;</span>
        <span className="text-slate-600">Job ID #{job.id}</span>
      </div>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h2 className="font-outfit font-extrabold text-2xl text-slate-800 leading-snug">{job.title}</h2>
          <div className="flex items-center gap-2 flex-wrap">
            {job.status === 'pending' ? (
              <span className="bg-[#059669] text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                New Request
              </span>
            ) : (
              <span className={`text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${job.status === 'approved' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                {job.status}
              </span>
            )}
            <span className="text-[10px] font-bold text-slate-400">
              Submitted by {job.creator?.full_name || job.company || 'Employer'}
            </span>
            <span className="text-[10px] font-bold text-slate-400">• Posted Date: {createdDateStr}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button 
            onClick={handleOpenEditModal}
            className="bg-white border border-[#e2e8f0] hover:bg-slate-50 text-slate-600 rounded-lg px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Edit className="w-3.5 h-3.5 text-[#f58220]" />
            Edit Before Publishing
          </button>
          
          {job.status !== 'rejected' && (
            <button onClick={handleReject} className="bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-lg px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
              <X className="w-3.5 h-3.5" />
              Reject Job
            </button>
          )}

          {job.status !== 'approved' && (
            <button onClick={handleApprove} className="bg-[#065f46] hover:bg-[#044e39] text-white rounded-lg px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer">
              <Check className="w-3.5 h-3.5" />
              Approve Job
            </button>
          )}
        </div>
      </div>

      {/* Grid Content splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Summary & Description */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stats & Key Information Bar */}
          <div className="bg-white grid grid-cols-2 md:grid-cols-3 gap-4 p-5 rounded-2xl border border-[#e2e8f0] shadow-sm text-left">
            <div className="space-y-0.5">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Salary Range</span>
              <span className="font-outfit font-extrabold text-sm text-emerald-600 block">{job.salary || 'Best in Industry'}</span>
            </div>
            <div className="border-l border-slate-100 pl-4 space-y-0.5">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Experience Required</span>
              <span className="font-outfit font-extrabold text-sm text-slate-700 block">{job.experience_range || '1-3 Years'}</span>
            </div>
            <div className="border-l border-slate-100 pl-4 space-y-0.5">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Work / Job Type</span>
              <span className="font-outfit font-extrabold text-sm text-slate-700 block">{job.job_type || 'Full-time'}</span>
            </div>
            <div className="border-t border-slate-100 pt-3 space-y-0.5">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Location</span>
              <span className="font-outfit font-extrabold text-sm text-slate-700 block">{job.location || 'India'}</span>
            </div>
            <div className="border-t border-l border-slate-100 pt-3 pl-4 space-y-0.5">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Open Vacancies</span>
              <span className="font-outfit font-extrabold text-sm text-slate-800 block">{job.open_positions || 1} Position(s)</span>
            </div>
            <div className="border-t border-l border-slate-100 pt-3 pl-4 space-y-0.5">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Category & Segment</span>
              <span className="font-outfit font-extrabold text-sm text-slate-800 uppercase block">{job.category || 'India'} ({job.industry_segment || 'Hospitality'})</span>
            </div>
          </div>

          {/* Description Block */}
          <div className="bg-white p-7 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-4 text-left">
            <h3 className="font-outfit font-extrabold text-base text-slate-800 border-b border-slate-100 pb-3">Job Description</h3>
            <p className="text-slate-600 leading-relaxed text-xs font-semibold whitespace-pre-line">
              {job.description || 'No detailed description provided for this job post.'}
            </p>
          </div>

          {/* Additional Features & Benefits Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-4 text-left">
            <h3 className="font-outfit font-extrabold text-sm text-slate-800 border-b border-slate-100 pb-3">Job Features & Perks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-bold">Visa Assistance</span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-black ${job.visa_assistance ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                  {job.visa_assistance ? 'Provided' : 'Not Specified'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-bold">Accommodation Provided</span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-black ${job.accommodation_available ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                  {job.accommodation_available ? 'Provided' : 'Not Specified'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Cards */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Card 1: Employer profile summary */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden text-left">
            <div className="h-16 bg-[#a7f3d0]/60 relative"></div>
            <div className="px-6 pb-6 relative">
              
              {/* Overlapping logo square */}
              <div className="w-14 h-14 bg-white border border-[#e2e8f0] rounded-xl flex items-center justify-center p-2 shadow-sm -mt-7 mb-3 overflow-hidden">
                <span className="text-xl">🏢</span>
              </div>

              <h4 className="font-outfit font-extrabold text-base text-slate-800">{job.company || 'Employer Company'}</h4>
              <div className="flex items-center gap-1 mt-0.5 text-[10px] font-bold text-[#059669]">
                <span>✓</span>
                <span>Verified Employer Account</span>
              </div>

              <div className="mt-5 space-y-3.5 text-xs font-semibold text-slate-500 border-t border-slate-50 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider">Primary Contact</span>
                  <span className="text-slate-800 font-bold">{job.creator?.full_name || 'Hiring Manager'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider">Contact Phone</span>
                  <span className="text-slate-800 font-bold font-mono text-[11px]">{job.creator?.mobile_number || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider">Contact Email</span>
                  <span className="text-[#153e69] font-bold truncate max-w-[150px]">{job.creator?.email || 'Not Provided'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider">Location</span>
                  <span className="text-slate-800 font-bold">{job.location || 'India'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Edit Job Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-outfit font-extrabold text-xl text-slate-800 flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#f58220]" /> Edit Job Details Before Publishing
              </h3>
              <button 
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#f58220]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Company / Brand Name</label>
                  <input
                    type="text"
                    value={editForm.company}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#f58220]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Location</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#f58220]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={editForm.salary}
                    onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#f58220]"
                    placeholder="e.g. INR 30,000 - 50,000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Experience Range</label>
                  <input
                    type="text"
                    value={editForm.experience_range}
                    onChange={(e) => setEditForm({ ...editForm, experience_range: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#f58220]"
                    placeholder="e.g. Mid-Level (3-5 years)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Work Type</label>
                  <select
                    value={editForm.job_type}
                    onChange={(e) => setEditForm({ ...editForm, job_type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#f58220]"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Consultation">Consultation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Job Description</label>
                <textarea
                  rows={4}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#f58220] leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#f58220] hover:bg-[#df6d0f] text-white text-xs font-bold shadow-md transition cursor-pointer"
                >
                  {isSaving ? 'Saving Changes...' : 'Save & Update Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
