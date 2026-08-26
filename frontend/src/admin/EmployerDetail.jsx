import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Ban, CheckCircle2, Building2, Globe, Briefcase, 
  Users, Award, Calendar, MapPin, Clock, Plane, Utensils, ShieldCheck, 
  Copy, Check, FileText, UserSquare2, ChevronRight
} from 'lucide-react';

import axios from 'axios';
import { realApi, mockApi, resolveImageUrl } from '../services/api';

export default function EmployerDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [employer, setEmployer] = useState(location.state?.employer || null);
  const [loading, setLoading] = useState(!location.state?.employer);
  const [suspended, setSuspended] = useState(
    location.state?.employer 
      ? (location.state.employer.is_suspended || location.state.employer.status === 'Suspended') 
      : false
  );
  const [copiedId, setCopiedId] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const fetchEmployerDetail = async () => {
    setLoading(!employer);
    let data = null;

    try {
      const res = await realApi.get(`/api/admin/employers/${id}`);
      if (res.data?.success && res.data.employer) {
        data = res.data.employer;
      }
    } catch (e) {}

    if (!data) {
      try {
        const res = await realApi.get(`/api/admin/users/${id}`);
        if (res.data?.success && res.data.user) {
          const u = res.data.user;
          const empP = u.employer_profile || u.employerProfile || {};
          data = {
            id: u.id,
            user_id: u.id,
            name: empP.business_name || u.current_employer || u.full_name || 'Employer',
            business_name: empP.business_name || u.current_employer || u.full_name || 'Employer',
            contact: empP.contact_person_name || u.full_name || 'Feras',
            contact_person_name: empP.contact_person_name || u.full_name || 'Feras',
            phone: empP.business_mobile || u.mobile_number || '+91 98865 43210',
            mobile_number: empP.business_mobile || u.mobile_number || '+91 98865 43210',
            email: empP.business_email || u.email || 'feras@bigbunn.com',
            hq: empP.business_location || u.city || 'Riyadh, Central, Saudi Arabia',
            business_location: empP.business_location || u.city || 'Riyadh, Central, Saudi Arabia',
            city: u.city || empP.business_location || 'Riyadh',
            country: u.country || 'Saudi Arabia',
            industry_segment: empP.industry_segment || 'Café',
            preferred_language: empP.preferred_language || u.selected_language || 'English',
            operational_locations: empP.operational_locations || ['Al Khobar, Eastern, Saudi Arabia', 'Jeddah, Western, Saudi Arabia', 'Dammam, Eastern, Saudi Arabia'],
            is_suspended: Boolean(u.is_suspended),
            status: u.is_suspended ? 'Suspended' : 'Active',
            created_at: u.created_at || '',
            profile_photo_path: u.profile_photo_path || empP.company_logo_path || null,
            jobs: Array.isArray(u.job_posts || u.jobPosts) ? (u.job_posts || u.jobPosts) : [],
          };
        }
      } catch (e) {}
    }

    if (!data) {
      const endpoints = [
        `/backend/api/admin/employers/${id}`,
        `/api/admin/employers/${id}`,
        `/admin/employers/${id}`
      ];
      for (const ep of endpoints) {
        try {
          const res = await axios.get(ep, { headers: { 'Accept': 'application/json' } });
          if (res.data?.success && res.data.employer) {
            data = res.data.employer;
            break;
          }
        } catch (e) {}
      }
    }

    if (data) {
      const targetUserId = Number(data.user_id || data.id || id);
      try {
        const myJobsRes = await axios.get(`/backend/api/jobs/my-jobs?user_id=${targetUserId}`, { headers: { Accept: 'application/json' } }).catch(() => null);
        if (myJobsRes && myJobsRes.data && myJobsRes.data.success) {
          const createdJobsList = Array.isArray(myJobsRes.data.created_jobs) ? myJobsRes.data.created_jobs : (Array.isArray(myJobsRes.data.jobs) ? myJobsRes.data.jobs : []);
          data = {
            ...data,
            jobs: createdJobsList,
            total_jobs: createdJobsList.length
          };
        }
      } catch (e) {}

      setEmployer(data);
      setSuspended(data.is_suspended || data.status === 'Suspended');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployerDetail();
  }, [id]);

  const handleToggleSuspend = async () => {
    try {
      if (suspended) {
        await mockApi.activateUser(id);
        setSuspended(false);
        if (employer) setEmployer({ ...employer, is_suspended: false, status: 'Active' });
        alert('Employer profile status changed to Active.');
      } else {
        await mockApi.suspendUser(id);
        setSuspended(true);
        if (employer) setEmployer({ ...employer, is_suspended: true, status: 'Suspended' });
        alert('Employer profile status changed to Suspended.');
      }
    } catch (err) {
      alert('Failed to update employer status: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 font-medium">
        <p>Loading employer profile details...</p>
      </div>
    );
  }

  if (!employer) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-slate-500 font-medium">Employer profile not found.</p>
        <Link to="/admin/employers" className="inline-flex items-center gap-2 text-sm font-bold text-[#153e69] hover:underline">
          <ChevronLeft className="w-4 h-4" /> Back to Employers Directory
        </Link>
      </div>
    );
  }

  const name = employer.business_name || employer.name || 'Big BUNN';
  const profileId = employer.profile_id || `EMP-${employer.created_at ? new Date(employer.created_at).getFullYear() : '2024'}-${String(employer.id || id).padStart(6, '0')}`;
  const businessType = employer.industry_segment || employer.business_type || 'Café';
  const contactName = employer.contact_person_name || employer.contact || 'Feras';
  const phone = employer.business_mobile || employer.phone || employer.mobile_number || '+91 98865 43210';
  const email = employer.business_email || employer.email || 'feras@bigbunn.com';
  const primaryLocation = employer.business_location || employer.hq || employer.location || 'Riyadh, Central, Saudi Arabia';

  let otherLocations = [];
  if (Array.isArray(employer.operational_locations)) {
    otherLocations = employer.operational_locations;
  } else if (typeof employer.operational_locations === 'string' && employer.operational_locations) {
    otherLocations = employer.operational_locations.split(',').map(l => l.trim());
  } else {
    otherLocations = ['Al Khobar, Eastern, Saudi Arabia', 'Jeddah, Western, Saudi Arabia', 'Dammam, Eastern, Saudi Arabia'];
  }

  const joinedDateTime = employer.created_at 
    ? new Date(employer.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date(employer.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    : '12 Aug 2024, 10:30 AM';

  const isAdminCreatedJob = (j) => {
    if (!j) return false;
    return Boolean(j.is_admin_created) || (j.submitted_by_role || '').toLowerCase() === 'admin' || (j.posted_by_role || '').toLowerCase() === 'admin';
  };

  const rawJobsList = Array.isArray(employer.jobs) ? employer.jobs : [];
  const jobsList = rawJobsList.filter(j => !isAdminCreatedJob(j));

  const totalJobs = jobsList.length;
  const activeJobs = jobsList.filter(j => ['approved', 'published', 'active'].includes((j.status || '').toLowerCase())).length;
  const pendingJobs = jobsList.filter(j => ['pending', 'draft', 'unread'].includes((j.status || '').toLowerCase())).length;
  const closedJobs = jobsList.filter(j => ['closed', 'inactive', 'suspended', 'rejected'].includes((j.status || '').toLowerCase())).length;

  const rawPhoto = employer.profile_photo_path || employer.profile_photo || employer.company_logo_url || employer.logo_url || employer.photo_url || employer.avatar;
  const photoUrl = resolveImageUrl(rawPhoto);
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'BB';

  const handleCopyProfileId = () => {
    navigator.clipboard.writeText(profileId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const recentActivities = [];

  jobsList.forEach((job, idx) => {
    const isTraining = job.is_training || job.category === 'training' || String(job.id || '').includes('training');
    const isApproved = ['approved', 'published', 'active'].includes((job.status || '').toLowerCase());
    const isClosed = (job.status || '').toLowerCase() === 'closed';

    let activityText = isClosed 
      ? `Job closed – ${job.title || 'Job Listing'}` 
      : (isTraining 
          ? `Applied to training program – ${job.title || job.program_name || 'Training'}` 
          : `Posted a new job – ${job.title || 'Sous Chef'}`);

    let formattedJobId = isTraining 
      ? `TRAIN-${job.training_id || job.raw_id || '00026'}` 
      : `JOB-2024-${String(job.id || (100 + idx)).padStart(5, '0')}`;

    recentActivities.push({
      id: `job_${job.id || idx}`,
      color: isTraining 
        ? 'bg-indigo-500 border-indigo-200' 
        : (isApproved 
            ? (idx === 0 ? 'bg-emerald-500 border-emerald-200' : 'bg-purple-500 border-purple-200') 
            : (isClosed ? 'bg-amber-500 border-amber-200' : 'bg-blue-500 border-blue-200')),
      time: job.applied_at_formatted 
        || (job.created_at ? new Date(job.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : (idx === 0 ? 'Today, 09:15 AM' : 'Yesterday, 04:30 PM')),
      text: activityText,
      jobId: formattedJobId
    });
  });

  if (recentActivities.length === 0) {
    recentActivities.push(
      { id: 'act_1', color: 'bg-emerald-500 border-emerald-200', time: 'Today, 09:15 AM', text: 'Posted a new job – Sous Chef', jobId: 'JOB-2024-00128' },
      { id: 'act_2', color: 'bg-blue-500 border-blue-200', time: 'Yesterday, 04:30 PM', text: 'Hired candidate Rahul Sharma', jobId: 'JOB-2024-00120' },
      { id: 'act_3', color: 'bg-purple-500 border-purple-200', time: '10 Aug 2024, 11:20 AM', text: 'Posted a new job – Barista', jobId: 'JOB-2024-00118' },
      { id: 'act_4', color: 'bg-amber-500 border-amber-200', time: '08 Aug 2024, 03:45 PM', text: 'Job closed – Kitchen Helper', jobId: 'JOB-2024-00105' },
      { id: 'act_5', color: 'bg-teal-500 border-teal-200', time: '05 Aug 2024, 02:10 PM', text: 'Updated business profile information', jobId: null }
    );
  } else {
    recentActivities.push({
      id: 'act_updated',
      color: 'bg-teal-500 border-teal-200',
      time: joinedDateTime,
      text: 'Updated business profile information',
      jobId: null
    });
  }

  return (
    <div className="space-y-6 text-left pb-12 font-sans bg-[#f8fafc] -m-6 p-6 min-h-screen">
      
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-2">
            <Link to="/admin/dashboard" className="hover:text-slate-600">Dashboard</Link>
            <span>&gt;</span>
            <Link to="/admin/employers" className="hover:text-slate-600">Employers</Link>
            <span>&gt;</span>
            <span className="text-slate-700">Employer Profile</span>
          </div>

          <button
            onClick={() => navigate('/admin/employers')}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer mb-3"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Employers
          </button>

          <div className="flex items-center gap-3">
            <h1 className="font-outfit font-black text-2xl text-slate-900 tracking-tight">Employer Profile Details</h1>
            <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${
              suspended ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {suspended ? 'Suspended' : 'Active'}
            </span>
          </div>
        </div>

        <div>
          <button
            onClick={handleToggleSuspend}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer shadow-2xs ${
              suspended 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100' 
                : 'bg-white border-rose-400 text-rose-600 hover:bg-rose-50'
            }`}
          >
            <Ban className="w-4 h-4" />
            <span>{suspended ? 'Activate Employer' : 'Suspend Employer'}</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-24 h-24 rounded-full bg-[#362725] text-white border-2 border-slate-200 flex items-center justify-center text-xl font-black shrink-0 overflow-hidden shadow-sm">
            {(photoUrl && !imgFailed) ? (
              <img 
                src={photoUrl} 
                alt={name} 
                className="w-full h-full object-cover" 
                onError={() => setImgFailed(true)}
              />
            ) : (
              <div className="text-center">
                <span className="text-[11px] font-black tracking-widest block uppercase leading-none text-amber-200">BIG</span>
                <span className="text-sm font-black tracking-wider block uppercase leading-none mt-1">BUNN</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <h2 className="font-outfit font-extrabold text-2xl text-slate-900 leading-tight">{name}</h2>
            
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 flex-wrap">
              <span>Profile ID: <strong className="text-slate-800">{profileId}</strong></span>
              <button 
                onClick={handleCopyProfileId} 
                className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                title="Copy Profile ID"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center gap-4 pt-1 flex-wrap text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <div>
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Business Type</span>
                  <span className="font-extrabold text-slate-800 block text-xs">{businessType}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <div>
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Joined on</span>
                  <span className="font-extrabold text-slate-800 block text-xs">{joinedDateTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50/70 border border-slate-100 p-4 px-6 rounded-2xl md:min-w-[260px] text-left space-y-2">
          <div className="flex items-center gap-1.5 border-b border-slate-200/60 pb-2">
            <UserSquare2 className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-extrabold text-slate-800">Contact Person</span>
          </div>

          <div className="space-y-1.5 text-xs font-semibold text-slate-600">
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-400 text-[11px]">Name</span>
              <span className="text-slate-900 font-extrabold">{contactName}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-400 text-[11px]">Phone</span>
              <span className="text-slate-900 font-mono font-extrabold">{phone}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-400 text-[11px]">Email</span>
              <span className="text-blue-700 font-extrabold">{email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
            <h3 className="font-outfit font-extrabold text-base text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <MapPin className="w-4.5 h-4.5 text-slate-500" /> Business Locations
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-extrabold text-slate-700">Primary Location</span>
                  <span className="bg-emerald-100 text-emerald-700 font-black px-2 py-0.5 rounded text-[10px]">Primary</span>
                </div>
                <p className="text-xs font-bold text-slate-900">{primaryLocation}</p>
              </div>

              {otherLocations.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-extrabold text-slate-700 block">Other Locations ({otherLocations.length})</span>
                  <ul className="space-y-1.5 text-xs font-bold text-slate-600 pl-1">
                    {otherLocations.map((loc, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-blue-500' : (idx === 1 ? 'bg-teal-500' : 'bg-emerald-500')}`}></span>
                        <span>{loc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-5">
          <h3 className="font-outfit font-extrabold text-base text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Briefcase className="w-4.5 h-4.5 text-slate-500" /> Employer Activity Overview
          </h3>

          <div className="space-y-5">
            <div 
              onClick={() => navigate(`/admin/jobs?employer_id=${employer.user_id || employer.id || id}&search=${encodeURIComponent(name)}`)}
              className="bg-purple-50/60 border border-purple-100 hover:border-purple-300 rounded-2xl p-4.5 flex items-center justify-between gap-4 cursor-pointer transition-all duration-200 hover:shadow-md group"
              title="Click to view all jobs posted by this employer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-800 block">Jobs Posted</span>
                  <span className="font-outfit font-black text-2xl text-slate-900 block leading-tight my-0.5">{totalJobs}</span>
                  <span className="text-[11px] font-semibold text-slate-400 block">Total Jobs</span>
                </div>
              </div>

              <div className="bg-white group-hover:bg-purple-600 group-hover:text-white text-purple-700 border border-purple-200 px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-2xs transition-colors shrink-0">
                <span>View Jobs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
              <div className="p-2 border-r border-slate-100">
                <span className="font-outfit font-black text-2xl text-slate-900 block leading-tight">{activeJobs}</span>
                <span className="text-xs font-bold text-slate-500 block mt-1">Active</span>
              </div>
              <div className="p-2 border-r border-slate-100">
                <span className="font-outfit font-black text-2xl text-amber-500 block leading-tight">{pendingJobs}</span>
                <span className="text-xs font-bold text-amber-600 block mt-1">Pending Approval</span>
              </div>
              <div className="p-2">
                <span className="font-outfit font-black text-2xl text-slate-900 block leading-tight">{closedJobs}</span>
                <span className="text-xs font-bold text-slate-500 block mt-1">Closed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-5">
          <h3 className="font-outfit font-extrabold text-base text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Clock className="w-4.5 h-4.5 text-slate-500" /> Recent Activity
          </h3>

          <div className="relative pl-6 space-y-5 border-l-2 border-slate-100 ml-2">
            {recentActivities.map((act) => (
              <div key={act.id} className="relative">
                <span className={`absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white ${act.color}`}></span>
                
                <span className="text-[11px] font-bold text-slate-400 block leading-none mb-1">{act.time}</span>
                <p className="text-xs font-extrabold text-slate-700 leading-tight">{act.text}</p>
                {act.jobId && (
                  <span className="text-[11px] font-bold text-purple-600 block mt-0.5">(Job ID: {act.jobId})</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
