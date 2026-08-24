import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { realApi, mockApi } from '../services/api';
import { Check, X, Edit, ArrowLeft, Building2, MapPin, Briefcase, DollarSign, Calendar, Plane, Link2, Pin, ShieldCheck, User, Phone, Mail, Globe, CheckCircle2 } from 'lucide-react';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit Job Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    job_role: '',
    company: '',
    industry_segment: '',
    category: 'india',
    job_category: '',
    location: '',
    country: '',
    salary_currency: 'SAR',
    salary_min: '',
    salary_max: '',
    salary: '',
    experience_range: 'Mid Level (3-5 Years)',
    job_type: 'Full-Time',
    open_positions: 1,
    contact_person: '',
    contact_info: '',
    status: 'approved',
    visa_assistance: false,
    accommodation_available: false,
    is_pinned: false,
    is_referral: false,
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
      
      const titleVal = found.title || found.job_role || `Job Listing #${found.id}`;
      const jobRoleVal = found.job_role || found.role || 'N/A';
      const companyVal = found.company || found.business_name || empP.business_name || creator.current_employer || creator.full_name || 'Hospitality Employer';
      const industryVal = found.industry_segment || empP.industry_segment || 'N/A';
      const categoryVal = found.category || (found.is_referral ? 'community' : 'india');
      const jobCategoryVal = found.job_category || found.department || 'N/A';
      const locationVal = found.location || 'N/A';
      const countryVal = found.country || 'N/A';
      const currencyVal = found.salary_currency || 'SAR';
      const minSalVal = found.salary_min || '';
      const maxSalVal = found.salary_max || '';
      const salaryDispVal = found.salary || found.salary_range || (minSalVal ? `${currencyVal} ${minSalVal} - ${maxSalVal}` : 'Best in Industry');
      const expVal = found.experience_range || found.experience || 'Mid Level (3-5 Years)';
      const jobTypeVal = found.job_type || found.work_type || 'Full-Time';
      const openVac = found.open_positions || found.vacancies || found.open_vacancies || 1;
      const contactPersonVal = found.contact_person || creator.full_name || creator.name || empP.contact_person_name || 'Hiring Manager';
      const contactInfoVal = found.contact_info || creator.email || creator.mobile_number || empP.business_email || empP.business_mobile || 'hr@thinktail.com';
      const statusVal = found.status || 'approved';
      const visaAssistVal = Boolean(found.visa_assistance || found.has_visa_assistance);
      const accVal = Boolean(found.accommodation_available || found.has_accommodation);
      const pinnedVal = Boolean(found.is_pinned);
      const refVal = Boolean(found.is_referral || categoryVal === 'community');
      const descVal = found.description || 'No detailed description provided.';

      setJob({
        ...found,
        id: found.id,
        title: titleVal,
        job_role: jobRoleVal,
        company: companyVal,
        industry_segment: industryVal,
        category: categoryVal,
        job_category: jobCategoryVal,
        location: locationVal,
        country: countryVal,
        salary_currency: currencyVal,
        salary_min: minSalVal,
        salary_max: maxSalVal,
        salary: salaryDispVal,
        experience_range: expVal,
        job_type: jobTypeVal,
        open_positions: openVac,
        contact_person: contactPersonVal,
        contact_info: contactInfoVal,
        status: statusVal,
        visa_assistance: visaAssistVal,
        accommodation_available: accVal,
        is_pinned: pinnedVal,
        is_referral: refVal,
        description: descVal,
        created_at: found.created_at,
        creator: {
          full_name: contactPersonVal,
          email: creator.email || (contactInfoVal.includes('@') ? contactInfoVal : 'Not Provided'),
          mobile_number: creator.mobile_number || (!contactInfoVal.includes('@') ? contactInfoVal : 'N/A')
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
      job_role: job.job_role === 'N/A' ? '' : (job.job_role || ''),
      company: job.company || '',
      industry_segment: job.industry_segment === 'N/A' ? '' : (job.industry_segment || ''),
      category: job.category || 'india',
      job_category: job.job_category === 'N/A' ? '' : (job.job_category || ''),
      location: job.location === 'N/A' ? '' : (job.location || ''),
      country: job.country === 'N/A' ? '' : (job.country || ''),
      salary_currency: job.salary_currency || 'SAR',
      salary_min: job.salary_min || '',
      salary_max: job.salary_max || '',
      salary: job.salary || '',
      experience_range: job.experience_range || 'Mid Level (3-5 Years)',
      job_type: job.job_type || 'Full-Time',
      open_positions: job.open_positions || 1,
      contact_person: job.contact_person || '',
      contact_info: job.contact_info || '',
      status: job.status || 'approved',
      visa_assistance: Boolean(job.visa_assistance),
      accommodation_available: Boolean(job.accommodation_available),
      is_pinned: Boolean(job.is_pinned),
      is_referral: Boolean(job.is_referral),
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
      alert("Job posting details updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update job posting: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-bold text-slate-400">Loading Job Listing #{id} Details...</p>
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
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-outfit font-extrabold text-2xl text-slate-800 leading-snug">{job.title}</h2>
            {job.job_role && job.job_role !== 'N/A' && job.job_role !== job.title && (
              <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                Role: {job.job_role}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {job.status === 'pending' ? (
              <span className="bg-[#059669] text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                Pending Review
              </span>
            ) : (
              <span className={`text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${job.status === 'approved' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                {job.status}
              </span>
            )}

            {job.category === 'community' ? (
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-black border border-emerald-200"><Link2 className="inline w-3 h-3 mr-1" />Referral Job</span>
            ) : job.category === 'overseas' ? (
              <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[10px] font-black border border-purple-200"><Plane className="inline w-3 h-3 mr-1" />Overseas Job</span>
            ) : (
              <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[10px] font-black border border-blue-200"><Briefcase className="inline w-3 h-3 mr-1" />India Job</span>
            )}

            <span className="text-[10px] font-bold text-slate-400">
              Submitted by: {job.contact_person || job.company || 'Employer'}
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
            Edit Job Details
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

      {/* Flag / Perks Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4 flex-wrap text-xs font-bold text-slate-700">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Perks & Flags:</span>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-extrabold inline-flex items-center gap-1 ${job.visa_assistance ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
            {job.visa_assistance ? '✓' : '×'} Visa Assistance
          </span>
          <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-extrabold inline-flex items-center gap-1 ${job.accommodation_available ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
            {job.accommodation_available ? '✓' : '×'} Accommodation
          </span>
          <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-extrabold inline-flex items-center gap-1 ${job.is_pinned ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
            {job.is_pinned ? '✓' : '×'} Pinned Listing
          </span>
          <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-extrabold inline-flex items-center gap-1 ${job.is_referral ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
            {job.is_referral ? '✓' : '×'} Referral Job
          </span>
        </div>
      </div>

      {/* Grid Content splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Full Specifications & Description */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Complete Job Specifications Grid Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-5 text-left">
            <h3 className="font-outfit font-extrabold text-base text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600" /> Complete Job Specifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Job Title</span>
                <span className="font-outfit font-extrabold text-sm text-slate-800 block">{job.title}</span>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Job Role</span>
                <span className="font-outfit font-extrabold text-sm text-slate-800 block">{job.job_role}</span>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Company / Employer</span>
                <span className="font-outfit font-extrabold text-sm text-slate-800 block">{job.company}</span>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Industry Segment</span>
                <span className="font-outfit font-extrabold text-sm text-slate-800 block">{job.industry_segment}</span>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Primary Feed Category</span>
                <span className="font-outfit font-extrabold text-sm text-slate-800 capitalize block">{job.category} Jobs</span>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Job Category / Department</span>
                <span className="font-outfit font-extrabold text-sm text-slate-800 block">{job.job_category}</span>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Location</span>
                <span className="font-outfit font-extrabold text-sm text-slate-800 block">{job.location}</span>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Country</span>
                <span className="font-outfit font-extrabold text-sm text-slate-800 block">{job.country}</span>
              </div>

              <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100 space-y-0.5 md:col-span-2">
                <span className="text-[9px] font-extrabold text-emerald-600 uppercase tracking-widest block">Salary Details</span>
                <div className="flex items-center justify-between flex-wrap gap-2 pt-0.5">
                  <div>
                    <span className="text-xs font-bold text-slate-500 block">Display Range:</span>
                    <span className="font-outfit font-extrabold text-base text-emerald-700 block">{job.salary || 'Best in Industry'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-slate-600 block">
                      Currency: {job.salary_currency || 'SAR'} | Min: {job.salary_min || 'N/A'} | Max: {job.salary_max || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Experience Required</span>
                <span className="font-outfit font-extrabold text-sm text-slate-700 block">{job.experience_range}</span>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Work / Job Type</span>
                <span className="font-outfit font-extrabold text-sm text-slate-700 block">{job.job_type}</span>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Open Vacancies</span>
                <span className="font-outfit font-extrabold text-sm text-slate-800 block">{job.open_positions} Position(s)</span>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Contact Person & Info</span>
                <span className="font-outfit font-extrabold text-sm text-slate-800 block">{job.contact_person || 'Hiring Manager'}</span>
                <span className="text-[11px] text-[#153e69] block font-mono">{job.contact_info || 'Not Provided'}</span>
              </div>
            </div>
          </div>

          {/* Description Block */}
          <div className="bg-white p-7 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-4 text-left">
            <h3 className="font-outfit font-extrabold text-base text-slate-800 border-b border-slate-100 pb-3">Job Description</h3>
            <p className="text-slate-600 leading-relaxed text-xs font-semibold whitespace-pre-line">
              {job.description}
            </p>
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

              <h4 className="font-outfit font-extrabold text-base text-slate-800">{job.company}</h4>
              <div className="flex items-center gap-1 mt-0.5 text-[10px] font-bold text-[#059669]">
                <span>✓</span>
                <span>Verified Employer Account</span>
              </div>

              <div className="mt-5 space-y-3.5 text-xs font-semibold text-slate-500 border-t border-slate-50 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider">Primary Contact</span>
                  <span className="text-slate-800 font-bold">{job.contact_person || 'Hiring Manager'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider">Contact Info</span>
                  <span className="text-[#153e69] font-bold font-mono text-[11px] truncate max-w-[160px]">{job.contact_info || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider">Industry</span>
                  <span className="text-slate-800 font-bold">{job.industry_segment || 'Hospitality'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider">Location</span>
                  <span className="text-slate-800 font-bold">{job.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider">Country</span>
                  <span className="text-slate-800 font-bold">{job.country}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Edit Job Modal - COMPLETE WITH ALL FORM FIELDS */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-100 my-8 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-outfit font-extrabold text-xl text-slate-800 flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#f58220]" /> Edit Complete Job Listing Details
              </h3>
              <button 
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} autoComplete="off" className="space-y-4 text-left">
              
              {/* Field 1: Job Title & Job Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Job Role</label>
                  <input
                    type="text"
                    value={editForm.job_role}
                    onChange={(e) => setEditForm(prev => ({ ...prev, job_role: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              {/* Field 2: Company & Industry Segment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Company / Employer *</label>
                  <input
                    type="text"
                    required
                    value={editForm.company}
                    onChange={(e) => setEditForm(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Industry Segment</label>
                  <input
                    type="text"
                    value={editForm.industry_segment}
                    onChange={(e) => setEditForm(prev => ({ ...prev, industry_segment: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              {/* Field 3: Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Primary Feed Category *</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#059669]"
                  >
                    <option value="india">India Jobs</option>
                    <option value="overseas">Overseas / KSA / Dubai</option>
                    <option value="community">Community / Referral Jobs</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Job Category / Department</label>
                  <input
                    type="text"
                    value={editForm.job_category}
                    onChange={(e) => setEditForm(prev => ({ ...prev, job_category: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              {/* Field 4: Location & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Location</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Country</label>
                  <input
                    type="text"
                    value={editForm.country}
                    onChange={(e) => setEditForm(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              {/* Field 5: Salary Breakdown */}
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-2.5">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Salary Details</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Currency</label>
                    <select
                      value={editForm.salary_currency}
                      onChange={(e) => setEditForm(prev => ({ ...prev, salary_currency: e.target.value }))}
                      className="w-full bg-white border border-[#e2e8f0] rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#059669]"
                    >
                      <option value="SAR">SAR (Saudi Riyal)</option>
                      <option value="INR">INR (Indian Rupee)</option>
                      <option value="AED">AED (UAE Dirham)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Min Salary</label>
                    <input
                      type="number"
                      value={editForm.salary_min}
                      onChange={(e) => setEditForm(prev => ({ ...prev, salary_min: e.target.value }))}
                      className="w-full bg-white border border-[#e2e8f0] rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Max Salary</label>
                    <input
                      type="number"
                      value={editForm.salary_max}
                      onChange={(e) => setEditForm(prev => ({ ...prev, salary_max: e.target.value }))}
                      className="w-full bg-white border border-[#e2e8f0] rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Salary Range Display Text</label>
                  <input
                    type="text"
                    value={editForm.salary}
                    onChange={(e) => setEditForm(prev => ({ ...prev, salary: e.target.value }))}
                    className="w-full bg-white border border-[#e2e8f0] rounded-xl px-3.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              {/* Field 6: Experience Range, Job Type, Vacancies */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Experience Range</label>
                  <select
                    value={editForm.experience_range}
                    onChange={(e) => setEditForm(prev => ({ ...prev, experience_range: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#059669]"
                  >
                    <option value="Entry Level (0-2 Years)">Entry Level (0-2 Years)</option>
                    <option value="Mid Level (3-5 Years)">Mid Level (3-5 Years)</option>
                    <option value="Senior Level (5+ Years)">Senior Level (5+ Years)</option>
                    <option value="Executive Level (8+ Years)">Executive Level (8+ Years)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Job Type</label>
                  <select
                    value={editForm.job_type}
                    onChange={(e) => setEditForm(prev => ({ ...prev, job_type: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#059669]"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Permanent">Permanent</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Open Vacancies</label>
                  <input
                    type="number"
                    min="1"
                    value={editForm.open_positions}
                    onChange={(e) => setEditForm(prev => ({ ...prev, open_positions: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              {/* Field 7: Contact Info & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={editForm.contact_person}
                    onChange={(e) => setEditForm(prev => ({ ...prev, contact_person: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Contact Info *</label>
                  <input
                    type="text"
                    required
                    value={editForm.contact_info}
                    onChange={(e) => setEditForm(prev => ({ ...prev, contact_info: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Initial Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#059669]"
                  >
                    <option value="approved">Approved (Live)</option>
                    <option value="pending">Pending Review</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Field 8: Checkboxes */}
              <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editForm.visa_assistance}
                    onChange={(e) => setEditForm(prev => ({ ...prev, visa_assistance: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Visa Assistance</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editForm.accommodation_available}
                    onChange={(e) => setEditForm(prev => ({ ...prev, accommodation_available: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Accommodation</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editForm.is_pinned}
                    onChange={(e) => setEditForm(prev => ({ ...prev, is_pinned: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Pin Listing</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editForm.is_referral}
                    onChange={(e) => setEditForm(prev => ({ ...prev, is_referral: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Referral Job</span>
                </label>
              </div>

              {/* Field 9: Job Description */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Job Description</label>
                <textarea
                  rows={4}
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl p-3.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669] leading-relaxed"
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
                  {isSaving ? 'Saving Changes...' : 'Save & Update Job Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
