import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, Ban, CheckCircle2, Building2, Globe, Briefcase, 
  Users, Award, Calendar, MapPin, Clock, Plane, Utensils, ShieldCheck, 
  Copy, Check, FileText, UserSquare2
} from 'lucide-react';

import axios from 'axios';
import { realApi, mockApi, resolveImageUrl } from '../services/api';

export default function ChefDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [chef, setChef] = useState(location.state?.chef || null);
  const [loading, setLoading] = useState(!location.state?.chef);
  const [status, setStatus] = useState(
    location.state?.chef 
      ? (location.state.chef.approval_status || location.state.chef.status || 'approved') 
      : 'approved'
  );
  const [postedJobs, setPostedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [copiedId, setCopiedId] = useState(false);

  const fetchChefDetail = async () => {
    setLoading(!chef);
    let data = location.state?.chef || null;

    try {
      const res = await mockApi.getChefs();
      if (res && res.chefs && Array.isArray(res.chefs)) {
        const found = res.chefs.find(c => String(c.id) === String(id) || String(c.user_id) === String(id) || String(c.chef_id) === String(id));
        if (found) {
          data = data ? { ...found, ...data } : found;
        }
      }
    } catch (e) {}

    if (!data) {
      try {
        const userRes = await realApi.get(`/api/admin/users/${id}`);
        if (userRes.data?.success && userRes.data.user) {
          data = userRes.data.user;
        }
      } catch (e) {}
    }

    if (data) {
      setChef(data);
      setStatus(data.approval_status || data.status || 'approved');
    }

    try {
      const targetUserId = chef?.user_id || chef?.id || id;
      const realAppsRes = await axios.get(`/backend/api/admin/users/${targetUserId}/applications`, { headers: { Accept: 'application/json' } }).catch(() => null);
      if (realAppsRes && realAppsRes.data && Array.isArray(realAppsRes.data.applications)) {
        setAppliedJobs(realAppsRes.data.applications);
      } else {
        const appsRes = await mockApi.getUserApplications(targetUserId).catch(() => ({ applications: [] }));
        setAppliedJobs(appsRes.applications || []);
      }
      const jobsRes = await mockApi.getUserJobs(targetUserId).catch(() => ({ jobs: [] }));
      setPostedJobs(jobsRes.jobs || []);
    } catch (err) {}

    setLoading(false);
  };

  useEffect(() => {
    fetchChefDetail();
  }, [id]);

  const handleToggleSuspend = async () => {
    try {
      if (status === 'suspended' || status === 'rejected') {
        await mockApi.activateUser(id);
        setStatus('approved');
        if (chef) setChef({ ...chef, approval_status: 'approved', status: 'approved' });
        alert('Chef profile status changed to Active.');
      } else {
        await mockApi.suspendUser(id);
        setStatus('suspended');
        if (chef) setChef({ ...chef, approval_status: 'suspended', status: 'suspended' });
        alert('Chef profile status changed to Suspended.');
      }
    } catch (err) {
      alert('Failed to update chef status: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 font-medium">
        <p>Loading chef profile details...</p>
      </div>
    );
  }

  if (!chef) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-slate-500 font-medium">Chef profile not found.</p>
        <Link to="/admin/chefs" className="inline-flex items-center gap-2 text-sm font-bold text-[#153e69] hover:underline">
          <ChevronLeft className="w-4 h-4" /> Back to Chefs Directory
        </Link>
      </div>
    );
  }

  const fullName = chef.full_name || chef.name || chef.mobile_number || 'Nisha Chef';
  const profileId = chef.profile_id || `CHF-${chef.created_at ? new Date(chef.created_at).getFullYear() : '2024'}-${String(chef.id || id).padStart(6, '0')}`;
  const age = chef.age || (chef.dob ? (new Date().getFullYear() - new Date(chef.dob).getFullYear()) : 26);
  const gender = chef.gender || 'Female';
  const experience = chef.experience_range || chef.experience || '1-2 Years Exp.';
  const pastEmployer = chef.past_employer || chef.previous_company || chef.current_employer || 'Taj Hotels, Oberoi';
  const employmentType = chef.employment_preference || chef.employment_type || chef.job_type || 'Full Time';
  const regionalExp = chef.regional_experience || chef.regions_worked || 'India & Overseas';
  const locationPref = chef.location_preference || chef.city || 'Both (India & Overseas)';
  const jobRole = chef.preferred_role || chef.job_role || chef.role || 'Sous Chef';

  const specialtiesList = chef.cuisine_specialty 
    ? String(chef.cuisine_specialty).split(',').map(s => s.trim()).filter(Boolean)
    : (chef.specialties ? String(chef.specialties).split(',').map(s => s.trim()).filter(Boolean) : ['Italian', 'Indian', 'Chinese']);

  const businessTypes = specialtiesList.join(', ') || 'Italian, Indian, Chinese';

  const totalPosted = postedJobs.length || chef.job_posts_count || 0;
  const totalApplied = appliedJobs.length || chef.applications_count || 0;

  const isSuspended = ['suspended', 'rejected', 'inactive'].includes((status || '').toLowerCase());

  const joinedDateTime = chef.created_at 
    ? new Date(chef.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date(chef.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    : '12 Aug 2024, 10:30 AM';

  const initials = fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'NC';

  const handleCopyProfileId = () => {
    navigator.clipboard.writeText(profileId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Build Dynamic Recent Activity Timeline from REAL events only
  const recentActivities = [];

  appliedJobs.forEach((app, idx) => {
    const isTr = app.is_training || app.type === 'training';
    recentActivities.push({
      id: `app_${app.id || idx}`,
      color: isTr ? 'bg-amber-500 border-amber-200' : (idx === 0 ? 'bg-blue-500 border-blue-200' : 'bg-purple-500 border-purple-200'),
      time: app.created_at ? new Date(app.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date(app.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Recent Application',
      text: isTr 
        ? `Applied for training – ${app.job_title || app.title || app.job_post?.title || 'Training Opportunity'} at ${app.company || app.job_post?.company || 'Jobrito Academy'}`
        : `Applied for job – ${app.job_title || app.title || app.job_post?.title || 'Job Position'} at ${app.company || app.job_post?.company || 'Employer'}`
    });
  });

  postedJobs.forEach((job, idx) => {
    recentActivities.push({
      id: `job_${job.id || idx}`,
      color: 'bg-purple-600 border-purple-200',
      time: job.created_at ? new Date(job.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently',
      text: `Posted a referral job – ${job.title || 'Job Listing'}`
    });
  });

  if (chef?.updated_at && chef.updated_at !== chef.created_at) {
    const updatedDate = new Date(chef.updated_at);
    if (!isNaN(updatedDate.getTime())) {
      recentActivities.push({
        id: 'act_updated',
        color: 'bg-emerald-500 border-emerald-200',
        time: updatedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + updatedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        text: 'Profile details updated by candidate'
      });
    }
  }

  recentActivities.push({
    id: 'act_created',
    color: 'bg-teal-500 border-teal-200',
    time: joinedDateTime,
    text: 'Profile created by candidate'
  });

  return (
    <div className="space-y-6 text-left pb-12 font-sans bg-[#f8fafc] -m-6 p-6 min-h-screen">
      
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-2">
            <Link to="/admin/dashboard" className="hover:text-slate-600">Dashboard</Link>
            <span>&gt;</span>
            <Link to="/admin/chefs" className="hover:text-slate-600">Chefs</Link>
            <span>&gt;</span>
            <span className="text-slate-700">Chef Profile</span>
          </div>

          <button
            onClick={() => navigate('/admin/chefs')}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer mb-3"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Chefs
          </button>

          <div className="flex items-center gap-3">
            <h1 className="font-outfit font-black text-2xl text-slate-900 tracking-tight">Chef Profile Details</h1>
            <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${
              isSuspended ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {isSuspended ? 'Suspended' : 'Active'}
            </span>
          </div>
        </div>

        {/* Suspend Action Button */}
        <div>
          <button
            onClick={handleToggleSuspend}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer shadow-2xs ${
              isSuspended 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100' 
                : 'bg-white border-rose-400 text-rose-600 hover:bg-rose-50'
            }`}
          >
            <Ban className="w-4 h-4" />
            <span>{isSuspended ? 'Activate User' : 'Suspend User'}</span>
          </button>
        </div>
      </div>

      {/* Top Profile Card Header */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          
          {/* Avatar with Online/Active Badge */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-2xl font-black text-[#153e69] overflow-hidden shadow-sm">
              {resolveImageUrl(chef.profile_photo_path || chef.profile_photo || chef.avatar) ? (
                <img 
                  src={resolveImageUrl(chef.profile_photo_path || chef.profile_photo || chef.avatar)} 
                  alt={fullName} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                initials
              )}
            </div>
            {!isSuspended && (
              <span className="w-4.5 h-4.5 bg-emerald-500 border-2 border-white rounded-full absolute bottom-1 right-1 shadow-2xs"></span>
            )}
          </div>

          <div className="space-y-1.5">
            <h2 className="font-outfit font-extrabold text-2xl text-slate-900 leading-tight">{fullName}</h2>
            
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

            <div className="flex items-center gap-3 pt-1 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> {age} Years
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                <span className="text-slate-400">⚥</span> {gender}
              </span>
            </div>
          </div>

        </div>

        {/* Account Status Card (Right Side) */}
        <div className="bg-slate-50/70 border border-slate-100 p-4 px-6 rounded-2xl md:min-w-[240px] text-left space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-700">Account Status</span>
            <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-black ${
              isSuspended ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {isSuspended ? 'Suspended' : 'Active'}
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-500">
            <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Joined on</span>
            <span className="text-slate-800 font-extrabold block mt-0.5">{joinedDateTime}</span>
          </div>
        </div>

      </div>

      {/* 3-Column Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Column 1: Professional Information */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-5">
          <h3 className="font-outfit font-extrabold text-base text-slate-800 border-b border-slate-100 pb-3">
            Professional Information
          </h3>

          <div className="space-y-4 text-xs font-semibold">
            
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-slate-400" /> Experience
              </span>
              <span className="text-slate-900 font-extrabold">{experience}</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-400" /> Past Employer
              </span>
              <span className="text-slate-900 font-extrabold text-right">{pastEmployer}</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-400" /> Employment Type
              </span>
              <span className="bg-emerald-50 text-emerald-700 font-extrabold px-2.5 py-0.5 rounded-md text-[11px] border border-emerald-100">
                {employmentType}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Plane className="w-4 h-4 text-slate-400" /> Past Overseas Experience
              </span>
              <span className="bg-emerald-50 text-emerald-700 font-extrabold px-2.5 py-0.5 rounded-md text-[11px] border border-emerald-100">
                {regionalExp}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" /> Job Location Preference
              </span>
              <span className="text-slate-900 font-extrabold">{locationPref}</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-slate-400" /> Cuisine Specialities
              </span>
              <span className="text-slate-900 font-extrabold text-right">{businessTypes}</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-400" /> Job Role
              </span>
              <span className="text-slate-900 font-extrabold">{jobRole}</span>
            </div>

          </div>
        </div>

        {/* Column 2: Activity Overview */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-5">
          <h3 className="font-outfit font-extrabold text-base text-slate-800 border-b border-slate-100 pb-3">
            Activity Overview
          </h3>

          <div className="space-y-4">
            
            {/* Box 1: Referral Jobs Posted */}
            <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-4.5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-800 block">Referral Jobs Posted</span>
                <span className="font-outfit font-black text-2xl text-slate-900 block leading-tight my-0.5">{totalPosted}</span>
                <span className="text-[11px] font-semibold text-slate-400 block">Total Jobs</span>
              </div>
            </div>

            {/* Box 2: Jobs Applied For */}
            <div 
              onClick={() => {
                const uid = chef?.user_id || chef?.id || id;
                const candName = name || chef?.full_name || 'Chef';
                navigate(`/admin/applications?userId=${uid}&userName=${encodeURIComponent(candName)}`, { state: { userId: uid, userName: candName } });
              }}
              className="bg-blue-50/60 border border-blue-100 hover:border-blue-300 hover:bg-blue-50 transition-all rounded-2xl p-4.5 flex items-center justify-between gap-4 cursor-pointer group shadow-2xs"
              title="Click to view all applications submitted by this candidate"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 group-hover:bg-blue-600 group-hover:text-white text-blue-700 flex items-center justify-center shrink-0 transition-colors">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-800 group-hover:text-blue-950 block">Jobs Applied For</span>
                  <span className="font-outfit font-black text-2xl text-slate-900 group-hover:text-blue-950 block leading-tight my-0.5">{totalApplied}</span>
                  <span className="text-[11px] font-semibold text-slate-400 block">Total Applications</span>
                </div>
              </div>
              <div className="flex items-center text-xs font-black text-blue-600 group-hover:text-blue-800 bg-white px-3 py-1.5 rounded-xl border border-blue-200 shadow-2xs gap-1.5 transition-all shrink-0">
                <span>View Applications</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

          </div>
        </div>

        {/* Column 3: Recent Activity */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-5">
          <h3 className="font-outfit font-extrabold text-base text-slate-800 border-b border-slate-100 pb-3">
            Recent Activity
          </h3>

          <div className="relative pl-6 space-y-5 border-l-2 border-slate-100 ml-2">
            {recentActivities.map((act) => (
              <div key={act.id} className="relative">
                {/* Status Color Circle */}
                <span className={`absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white ${act.color}`}></span>
                
                <span className="text-[11px] font-bold text-slate-400 block leading-none mb-1">{act.time}</span>
                <p className="text-xs font-extrabold text-slate-700 leading-tight">{act.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
