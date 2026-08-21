import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { Eye, ShieldCheck, Mail, MapPin, Smartphone, UserSquare2, Ban, CheckCircle2, Building2, Globe, FileText, Layers, Briefcase, UserCheck, Languages, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { realApi, mockApi, resolveImageUrl } from '../services/api';

export default function EmployerDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [employer, setEmployer] = useState(location.state?.employer || null);
  const [imgFailed, setImgFailed] = useState(false);
  const [loading, setLoading] = useState(!location.state?.employer);
  const [suspended, setSuspended] = useState(
    location.state?.employer 
      ? (location.state.employer.is_suspended || location.state.employer.status === 'Suspended') 
      : false
  );

  const fetchEmployerDetail = async () => {
    setLoading(!employer);
    let data = null;

    // 1. Try realApi (/api/admin/employers/:id)
    try {
      const res = await realApi.get(`/api/admin/employers/${id}`);
      if (res.data?.success && res.data.employer) data = res.data.employer;
    } catch (e) {}

    // 2. Try /backend/ path
    if (!data) {
      try {
        const res = await axios.get(`/backend/api/admin/employers/${id}`);
        if (res.data?.success && res.data.employer) data = res.data.employer;
      } catch (e) {}
    }

    if (data) {
      setEmployer(data);
      setSuspended(data.is_suspended || data.status === 'Suspended');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployerDetail();
  }, [id]);

  const handleSuspend = async () => {
    try {
      await mockApi.suspendUser(id);
      setSuspended(true);
      alert("Employer profile suspended successfully!");
      fetchEmployerDetail();
    } catch (err) {
      console.error(err);
    }
  };

  const handleActivate = async () => {
    try {
      await mockApi.activateUser(id);
      setSuspended(false);
      alert("Employer profile activated successfully!");
      fetchEmployerDetail();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 text-xs font-semibold">
        Loading employer details...
      </div>
    );
  }

  if (!employer) {
    return (
      <div className="py-20 text-center text-slate-400 text-xs font-semibold">
        Employer profile not found.
      </div>
    );
  }

  // Pure data from backend endpoints only
  const name = employer.business_name || employer.name || '';
  const contact = employer.contact_person_name || employer.contact || '';
  const role = employer.contact_role || '';
  const phone = employer.business_mobile || employer.phone || '';
  const email = employer.business_email || employer.email || '';
  const locationText = employer.business_location || employer.hq || '';
  const created = employer.created_at || '';

  const totalJobs = employer.total_jobs ?? 0;
  const activeJobs = employer.active_jobs ?? 0;
  const pendingJobs = employer.pending_jobs ?? 0;

  const jobsList = employer.jobs || [];

  const rawPhoto = employer.profile_photo_path || employer.profile_photo || employer.company_logo_url || employer.logo_url || employer.photo_url || employer.avatar;
  const photoUrl = resolveImageUrl(rawPhoto);

  return (
    <div className="space-y-6 text-left">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 flex-wrap">
        <Link to="/admin/employers" className="hover:text-slate-600">Employers</Link>
        <span className="text-slate-300">&gt;</span>
        <span className="text-slate-600">Employer Detail</span>
      </div>

      {/* Header Profile Summary Block */}
      <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div className="flex items-center gap-4.5">
          {/* Logo square */}
          <div className="w-14 h-14 bg-white border border-[#cfd5dc] rounded-xl flex items-center justify-center text-2xl shadow-xs font-outfit font-black text-[#153e69] shrink-0 overflow-hidden">
            {(photoUrl && !imgFailed) ? (
              <img 
                src={photoUrl} 
                alt={name} 
                className="w-full h-full object-cover" 
                onError={() => setImgFailed(true)}
              />
            ) : (
              (name || 'E').charAt(0).toUpperCase()
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-outfit font-extrabold text-xl text-slate-800 leading-none">{name}</h2>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                suspended ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-[#eff6ff] text-[#1d4b78]'
              }`}>
                {suspended ? 'Suspended' : 'Active'}
              </span>
            </div>
            
            <p className="text-xs font-bold text-slate-400">
              📍 {locationText} &nbsp;•&nbsp; Member since {created}
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button 
            onClick={handleSuspend} 
            disabled={suspended}
            className={`border rounded-lg px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2 shadow-xs ${
              suspended 
                ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-50' 
                : 'bg-white border-[#f0a9a9] hover:bg-rose-50 text-[#d32f2f] cursor-pointer'
            }`}
          >
            <Ban className="w-4 h-4" />
            Suspend Employer
          </button>
          <button 
            onClick={handleActivate} 
            disabled={!suspended}
            className={`rounded-lg px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2 shadow-xs ${
              !suspended 
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50' 
                : 'bg-[#f58220] hover:bg-[#df6d0f] text-white cursor-pointer'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Activate Employer
          </button>
        </div>
      </div>

      {/* Split grid sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Account Contact & Business Information (1/3) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Card 1: Account Information (Users Table) */}
          <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-4">
            <h3 className="font-outfit font-extrabold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <UserSquare2 className="w-4 h-4 text-[#153e69]" /> Account & Contact Info (Users Table)
            </h3>

            <div className="space-y-3.5 text-xs font-semibold text-slate-600">
              <div>
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Primary Contact Person</span>
                <span className="text-slate-900 font-extrabold mt-0.5 block text-sm">{contact || 'N/A'}</span>
              </div>
              <div className="border-t border-slate-50 pt-2.5">
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Mobile Number</span>
                <span className="text-slate-800 font-extrabold mt-0.5 block font-mono">{phone || 'N/A'}</span>
              </div>
              <div className="border-t border-slate-50 pt-2.5">
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Email Address</span>
                <span className="text-[#153e69] font-extrabold mt-0.5 block truncate">{email || 'Not Provided'}</span>
              </div>
              <div className="border-t border-slate-50 pt-2.5">
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">City & Country</span>
                <span className="text-slate-800 font-extrabold mt-0.5 block">{employer.city || employer.hq || 'India'}, {employer.country || 'India'}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Business Profile (Employer Profiles Table) */}
          <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-4">
            <h3 className="font-outfit font-extrabold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="w-4 h-4 text-[#153e69]" /> Business Details (Employer Profile)
            </h3>

            <div className="space-y-3.5 text-xs font-semibold text-slate-600">
              <div>
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Registered Business Name</span>
                <span className="text-slate-900 font-extrabold mt-0.5 block text-sm">{name || 'N/A'}</span>
              </div>
              <div className="border-t border-slate-50 pt-2.5">
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Industry Segment</span>
                <span className="text-slate-800 font-extrabold mt-0.5 block">{employer.industry_segment || employer.employer_profile?.industry_segment || 'Hospitality / F&B'}</span>
              </div>
              <div className="border-t border-slate-50 pt-2.5">
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Business HQ / Location</span>
                <span className="text-slate-800 font-extrabold mt-0.5 block">{locationText || 'India'}</span>
              </div>
              <div className="border-t border-slate-50 pt-2.5">
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Preferred Language</span>
                <span className="text-slate-800 font-extrabold mt-0.5 block">{employer.preferred_language || employer.employer_profile?.preferred_language || 'English'}</span>
              </div>
              <div className="border-t border-slate-50 pt-2.5">
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Operational Locations</span>
                <span className="text-slate-800 font-extrabold mt-0.5 block">
                  {Array.isArray(employer.operational_locations || employer.employer_profile?.operational_locations) 
                    ? (employer.operational_locations || employer.employer_profile?.operational_locations).join(', ') 
                    : (employer.operational_locations || employer.employer_profile?.operational_locations || locationText || 'Delhi')}
                </span>
              </div>
              {(employer.nominee_name || employer.employer_profile?.nominee_name) && (
                <div className="border-t border-slate-50 pt-2.5">
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Nominee Details</span>
                  <span className="text-slate-800 font-extrabold mt-0.5 block">{employer.nominee_name || employer.employer_profile?.nominee_name} ({employer.nominee_relationship || employer.employer_profile?.nominee_relationship || 'Contact'})</span>
                  <span className="text-slate-500 font-mono text-[11px] block mt-0.5">{employer.nominee_mobile || employer.employer_profile?.nominee_mobile}</span>
                </div>
              )}
              <div className="border-t border-slate-50 pt-2.5 flex items-center justify-between">
                <span className="text-slate-400 text-[9px] uppercase tracking-wider">Profile Verification</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black">
                  {employer.is_completed !== false ? 'Verified (100%)' : 'Incomplete'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: KPI boxes + Job Postings (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 3 columns Stats Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Box 1 */}
            <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[105px]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Jobs Posted</span>
              </div>
              <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-2">
                {totalJobs}
              </span>
              <div className="w-full bg-slate-100 h-1.5 rounded-[9999px] mt-2 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-[9999px] w-[70%]" />
              </div>
            </div>

            {/* Box 2 */}
            <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[105px]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Active Jobs</span>
              </div>
              <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-2">
                {activeJobs}
              </span>
              <div className="w-full bg-slate-100 h-1.5 rounded-[9999px] mt-2 overflow-hidden">
                <div className="bg-teal-600 h-full rounded-[9999px] w-[45%]" />
              </div>
            </div>

            {/* Box 3 */}
            <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[105px]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Pending Jobs</span>
              </div>
              <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-2">
                {pendingJobs < 10 ? `0${pendingJobs}` : pendingJobs}
              </span>
              <div className="w-full bg-slate-100 h-1.5 rounded-[9999px] mt-2 overflow-hidden">
                <div className="bg-red-600 h-full rounded-[9999px] w-[15%]" />
              </div>
            </div>

          </div>

          {/* Recent Job Postings list card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#e2e8f0] flex justify-between items-center bg-slate-50/10">
              <h3 className="font-outfit font-extrabold text-sm text-slate-800">Recent Job Postings</h3>
              <Link to="/admin/jobs" className="text-xs font-bold text-[#153e69] hover:underline">View All Postings</Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/20 border-b border-[#e2e8f0] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-6">Job Title</th>
                    <th className="py-3 px-6">Posted Date</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0] text-slate-700 text-xs font-semibold">
                  {jobsList.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-slate-400 font-bold">
                        No job postings found for this employer.
                      </td>
                    </tr>
                  ) : (
                    jobsList.map(job => {
                      const statusStr = (job.status || 'pending').toLowerCase();
                      const isAppr = ['approved', 'published', 'active'].includes(statusStr);
                      const isRej = statusStr === 'rejected';
                      const badgeClass = isAppr 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : (isRej ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200');

                      return (
                        <tr key={job.id} className="hover:bg-slate-50/20 transition-colors">
                          <td className="py-3.5 px-6">
                            <span className="font-extrabold text-slate-850 block text-[13px]">{job.title || job.job_title}</span>
                            <span className="text-[9px] text-slate-400 font-bold block mt-0.5">ID: #{job.id} &nbsp;•&nbsp; Location: {job.location || 'India'}</span>
                          </td>
                          <td className="py-3.5 px-6 text-slate-500 font-bold">
                            {job.posted_date || job.created_at_formatted || job.date || 'Recently'}
                          </td>
                          <td className="py-3.5 px-6">
                            <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-wider ${badgeClass}`}>
                              {job.status || 'Pending'}
                            </span>
                          </td>
                          <td className="py-3.5 px-6 text-right">
                            <Link to="/admin/jobs" className="text-slate-400 hover:text-[#153e69] inline-block mr-2" title="View Job Details">
                              <Eye className="w-4 h-4" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>


    </div>
  );
}
