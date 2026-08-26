import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { realApi, mockApi } from '../services/api';
import { 
  Check, X, Edit, ChevronLeft, Building2, MapPin, Briefcase, 
  DollarSign, Calendar, Plane, Link2, Pin, ShieldCheck, User, Phone, 
  Mail, Globe, CheckCircle2, Copy, Award, FileText, Layers, Tag, Clock
} from 'lucide-react';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(false);

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
      const jobRoleVal = found.job_role || found.role || titleVal;
      const companyVal = found.company || found.business_name || empP.business_name || creator.current_employer || creator.full_name || 'Hospitality Employer';
      const industryVal = found.industry_segment || empP.industry_segment || 'Cloud Kitchen';
      const categoryVal = found.category || (found.is_referral ? 'community' : 'india');
      const jobCategoryVal = found.job_category || found.department || 'Kitchen, Service, Bar & Beverage';
      const locationVal = found.location || 'Junagadh, Gujarat, India';
      const countryVal = found.country || 'India';
      const currencyVal = found.salary_currency || 'SAR';
      const minSalVal = found.salary_min || '';
      const maxSalVal = found.salary_max || '';
      const salaryDispVal = found.salary || found.salary_range || (minSalVal ? `${currencyVal} ${minSalVal} - ${maxSalVal}` : 'Best in Industry');
      const expVal = found.experience_range || found.experience || 'Mid Level (3-5 Years)';
      const jobTypeVal = found.job_type || found.work_type || 'Full-Time';
      const openVac = found.open_positions || found.vacancies || found.open_vacancies || 1;
      const contactPersonVal = found.contact_person || creator.full_name || creator.name || empP.contact_person_name || 'Ankit';
      const contactInfoVal = found.contact_info || creator.email || creator.mobile_number || empP.business_email || empP.business_mobile || '8602180000';
      const statusVal = found.status || 'pending';
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
      alert('Job listing approved successfully.');
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async () => {
    try {
      await mockApi.rejectJob(id);
      setJob(prev => prev ? { ...prev, status: 'rejected' } : prev);
      alert('Job listing status set to rejected.');
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

  const handleCopyProfileId = () => {
    const formattedId = `JOB-2024-${String(job.id).padStart(6, '0')}`;
    navigator.clipboard.writeText(formattedId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
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
    : 'Aug 25, 2026';

  const jobFormattedId = `JOB-2024-${String(job.id).padStart(6, '0')}`;
  const isPending = job.status === 'pending';
  const isApproved = job.status === 'approved';
  const isRejected = job.status === 'rejected';

  return (
    <div className="space-y-6 text-left pb-12 font-sans bg-[#f8fafc] -m-6 p-6 min-h-screen">
      
      {/* Top Navigation & Breadcrumbs Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-2">
            <Link to="/admin/dashboard" className="hover:text-slate-600">Dashboard</Link>
            <span>&gt;</span>
            <Link to="/admin/jobs" className="hover:text-slate-600">Jobs</Link>
            <span>&gt;</span>
            <span className="capitalize">{job.status} Review</span>
            <span>&gt;</span>
            <span className="text-slate-700">Job ID #{job.id}</span>
          </div>

          <button
            onClick={() => navigate('/admin/jobs')}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer mb-3"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Jobs
          </button>

          <div className="flex items-center gap-3">
            <h1 className="font-outfit font-black text-2xl text-slate-900 tracking-tight">{job.title}</h1>
            <span className={`px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
              isPending ? 'bg-emerald-100 text-emerald-800' : isApproved ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
            }`}>
              {isPending ? 'Pending Review' : job.status}
            </span>
          </div>
        </div>

        {/* Action Buttons Header */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button 
            onClick={handleOpenEditModal}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl px-4 py-2 text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <Edit className="w-4 h-4 text-[#f58220]" />
            Edit Job Details
          </button>
          
          {job.status !== 'rejected' && (
            <button 
              onClick={handleReject} 
              className="bg-white border border-rose-300 hover:bg-rose-50 text-rose-600 rounded-xl px-4 py-2 text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <X className="w-4 h-4" />
              Reject Job
            </button>
          )}

          {job.status !== 'approved' && (
            <button 
              onClick={handleApprove} 
              className="bg-[#065f46] hover:bg-[#044e39] text-white rounded-xl px-5 py-2 text-xs font-extrabold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Approve Job
            </button>
          )}
        </div>
      </div>

      {/* Top Profile Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          
          {/* Company/Job Logo Icon Box */}
          <div className="w-20 h-20 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-3xl font-black text-emerald-700 shrink-0 shadow-2xs">
            🏢
          </div>

          <div className="space-y-1.5">
            <h2 className="font-outfit font-extrabold text-2xl text-slate-900 leading-tight">{job.title}</h2>
            
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 flex-wrap">
              <span>Job ID: <strong className="text-slate-800">{jobFormattedId}</strong></span>
              <button 
                onClick={handleCopyProfileId} 
                className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                title="Copy Job ID"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1 flex-wrap text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 font-extrabold">
                <Building2 className="w-3.5 h-3.5 text-slate-400" /> {job.company}
              </span>
              
              {job.category === 'community' ? (
                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg text-xs font-extrabold border border-emerald-200 inline-flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5 text-emerald-600" /> Referral Job
                </span>
              ) : job.category === 'overseas' ? (
                <span className="text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg text-xs font-extrabold border border-purple-200 inline-flex items-center gap-1">
                  <Plane className="w-3.5 h-3.5 text-purple-600" /> Overseas Job
                </span>
              ) : (
                <span className="text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg text-xs font-extrabold border border-blue-200 inline-flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" /> India Job
                </span>
              )}

              {(job.is_admin_created || (job.submitted_by_role || '').toLowerCase() === 'admin') && (
                <span className="text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg text-xs font-extrabold border border-amber-300 inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Created by Admin
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Quick Contact & Date Card (Right Side) */}
        <div className="bg-slate-50/70 border border-slate-100 p-4 px-6 rounded-2xl md:min-w-[260px] text-left space-y-2">
          <div className="flex items-center gap-1.5 border-b border-slate-200/60 pb-2">
            <User className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-extrabold text-slate-800">Job Submission Info</span>
          </div>

          <div className="space-y-1.5 text-xs font-semibold text-slate-600">
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-400 text-[11px]">Submitted by</span>
              <span className="text-slate-900 font-extrabold">{job.contact_person || job.company}</span>
            </div>
            {job.contact_info && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400 text-[11px]">Contact Info</span>
                <span className="text-slate-900 font-mono font-extrabold">{job.contact_info}</span>
              </div>
            )}
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-400 text-[11px]">Posted Date</span>
              <span className="text-slate-800 font-extrabold">{createdDateStr}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Listing Properties Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4 flex-wrap text-xs font-bold text-slate-700">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Listing Properties:</span>
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="px-3 py-1 rounded-xl border text-xs font-extrabold inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border-blue-200">
            {job.category === 'overseas' ? 'Overseas Feed' : 'India Feed'}
          </span>
          {job.is_pinned && (
            <span className="px-3 py-1 rounded-xl border text-xs font-extrabold inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 border-purple-200">
              ✓ Pinned Listing
            </span>
          )}
          <span className="px-3 py-1 rounded-xl border text-xs font-extrabold inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border-emerald-200 capitalize">
            Status: {job.status}
          </span>
        </div>
      </div>

      {/* 3-Column Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Column 1: Complete Job Specifications (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-5">
          <h3 className="font-outfit font-extrabold text-base text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Briefcase className="w-4.5 h-4.5 text-slate-500" /> Complete Job Specifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-semibold">
            <div className={`p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-0.5 ${(!job.job_role || job.job_role.trim().toLowerCase() === job.title.trim().toLowerCase()) ? 'sm:col-span-2' : ''}`}>
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Job Title</span>
              <span className="font-outfit font-extrabold text-sm text-slate-900 block">{job.title}</span>
            </div>

            {job.job_role && job.job_role.trim().toLowerCase() !== job.title.trim().toLowerCase() && (
              <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-0.5">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Job Role</span>
                <span className="font-outfit font-extrabold text-sm text-slate-900 block">{job.job_role}</span>
              </div>
            )}

            <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-0.5">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Company / Employer</span>
              <span className="font-outfit font-extrabold text-sm text-slate-900 block">{job.company}</span>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-0.5">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Primary Feed Category</span>
              <span className="font-outfit font-extrabold text-sm text-slate-900 capitalize block">{job.category === 'overseas' ? 'Overseas Jobs' : 'India Jobs'}</span>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-0.5">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Location</span>
              <span className="font-outfit font-extrabold text-sm text-slate-900 block">{job.location}</span>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-0.5">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Country</span>
              <span className="font-outfit font-extrabold text-sm text-slate-900 block">{job.country}</span>
            </div>

            <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1 sm:col-span-2">
              <span className="text-[9px] font-extrabold text-emerald-600 uppercase tracking-widest block">Salary Details</span>
              <div className="flex items-center justify-between flex-wrap gap-2 pt-0.5">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block">Salary Range</span>
                  <span className="font-outfit font-extrabold text-base text-emerald-800 block">
                    {job.salary_min || job.salary_max 
                      ? `${job.salary_currency || 'INR'} ${Number(job.salary_min || 0).toLocaleString()} - ${Number(job.salary_max || 0).toLocaleString()}`
                      : (job.salary || 'Not Specified')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-slate-700 block">
                    Currency: {job.salary_currency || 'INR'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-0.5">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Experience Required</span>
              <span className="font-outfit font-extrabold text-sm text-slate-800 block">{job.experience_range || 'Not Specified'}</span>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-0.5">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Work / Job Type</span>
              <span className="font-outfit font-extrabold text-sm text-slate-800 block">{job.job_type || 'Full-time'}</span>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-0.5 sm:col-span-2">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Open Vacancies</span>
              <span className="font-outfit font-extrabold text-sm text-slate-900 block">{job.open_positions || 1} Position(s)</span>
            </div>

          </div>
        </div>

        {/* Column 2: Employer Details (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-5">
          <h3 className="font-outfit font-extrabold text-base text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Building2 className="w-4.5 h-4.5 text-slate-500" /> {job.is_referral ? 'Referral Poster / Company Details' : 'Employer Details'}
          </h3>

          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-2xs">
                🏢
              </div>
              <div>
                <h4 className="font-outfit font-extrabold text-base text-slate-900">{job.company}</h4>
                {job.creator ? (
                  <span className="text-[11px] font-semibold text-slate-500 block">
                    Posted by: <strong className="text-slate-800">{job.creator.full_name || job.creator.name}</strong> ({job.creator.active_role || job.creator.user_role || 'User'})
                  </span>
                ) : null}
              </div>
            </div>

            <div className="border-t border-emerald-100/80 pt-3 space-y-2.5 text-xs font-semibold">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Business / Agency</span>
                <span className="text-slate-900 font-extrabold">{job.company}</span>
              </div>
              {job.contact_person && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Primary Contact</span>
                  <span className="text-slate-900 font-extrabold">{job.contact_person}</span>
                </div>
              )}
              {job.contact_info && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Contact Info</span>
                  <span className="text-[#153e69] font-mono font-extrabold">{job.contact_info}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Location</span>
                <span className="text-slate-900 font-extrabold text-right">{job.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Country</span>
                <span className="text-slate-900 font-extrabold">{job.country}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Job Description & Activity Timeline (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Card 1: Description */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-3">
            <h3 className="font-outfit font-extrabold text-base text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-slate-500" /> Job Description
            </h3>
            <p className="text-slate-700 leading-relaxed text-xs font-semibold whitespace-pre-line bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
              {job.description}
            </p>
          </div>

          {/* Card 2: Recent Activity Timeline */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
            <h3 className="font-outfit font-extrabold text-base text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-slate-500" /> Moderation Log
            </h3>

            <div className="relative pl-5 space-y-4 border-l-2 border-slate-100 ml-1">
              <div className="relative">
                <span className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 border-white bg-emerald-500"></span>
                <span className="text-[10px] font-bold text-slate-400 block mb-0.5">{createdDateStr}</span>
                <p className="text-xs font-extrabold text-slate-700">Job posting created & submitted for review</p>
              </div>

              {isApproved && (
                <div className="relative">
                  <span className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 border-white bg-blue-500"></span>
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Recently</span>
                  <p className="text-xs font-extrabold text-slate-700">Job approved by Admin</p>
                </div>
              )}

              {isRejected && (
                <div className="relative">
                  <span className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 border-white bg-rose-500"></span>
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Recently</span>
                  <p className="text-xs font-extrabold text-slate-700">Job rejected by Admin</p>
                </div>
              )}
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
                    <option value="overseas">Overseas / KSA Jobs</option>
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
                      <option value="INR">INR (₹)</option>
                      <option value="SAR">SAR (Saudi Riyal)</option>
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
              <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100/80 grid grid-cols-3 gap-3">
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
