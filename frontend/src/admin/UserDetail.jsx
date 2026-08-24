import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  Eye, Mail, MapPin, Smartphone, UserSquare2, Ban, CheckCircle2, 
  Building2, Globe, FileText, Briefcase, Languages, Phone, Calendar, 
  ChevronLeft, AlertCircle, Award, ShieldCheck, Trash2, Clock
} from 'lucide-react';
import axios from 'axios';
import { realApi, mockApi, resolveImageUrl } from '../services/api';

export default function UserDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(location.state?.user || null);
  const [loading, setLoading] = useState(!location.state?.user);
  const [suspended, setSuspended] = useState(
    location.state?.user ? Boolean(location.state.user.is_suspended) : false
  );
  const [postedJobs, setPostedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);

  const fetchUserDetail = async () => {
    setLoading(!user);
    let userData = null;

    // 1. Try realApi /api/admin/users/:id
    try {
      const res = await realApi.get(`/api/admin/users/${id}`);
      if (res.data?.success && res.data.user) {
        userData = res.data.user;
      }
    } catch (e) {}

    // 2. Try axios backend endpoints
    if (!userData) {
      const endpoints = [
        `/backend/api/admin/users/${id}`,
        `/api/admin/users/${id}`,
        `/admin/users/${id}`
      ];
      for (const ep of endpoints) {
        try {
          const res = await axios.get(ep, { headers: { 'Accept': 'application/json' } });
          if (res.data?.success && res.data.user) {
            userData = res.data.user;
            break;
          }
        } catch (e) {}
      }
    }

    if (userData) {
      setUser(userData);
      setSuspended(Boolean(userData.is_suspended));
    }

    // Fetch user posted jobs & applications
    try {
      const [jobsRes, appsRes] = await Promise.all([
        mockApi.getUserJobs(id).catch(() => ({ jobs: [] })),
        mockApi.getUserApplications(id).catch(() => ({ applications: [] }))
      ]);
      setPostedJobs(jobsRes.jobs || []);
      setAppliedJobs(appsRes.applications || []);
    } catch (err) {}

    setLoading(false);
  };

  useEffect(() => {
    fetchUserDetail();
  }, [id]);

  const handleToggleSuspend = async () => {
    try {
      if (suspended) {
        await mockApi.activateUser(id);
        setSuspended(false);
        if (user) setUser({ ...user, is_suspended: false, status: 'Active' });
      } else {
        await mockApi.suspendUser(id);
        setSuspended(true);
        if (user) setUser({ ...user, is_suspended: true, status: 'Suspended' });
      }
    } catch (err) {
      alert("Failed to update user status: " + err.message);
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this user profile?")) return;
    try {
      await mockApi.deleteUser(id);
      navigate('/admin/users');
    } catch (err) {
      alert("Failed to delete user: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 font-medium">
        <p>Loading candidate profile details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-slate-500 font-medium">User profile not found.</p>
        <Link to="/admin/users" className="inline-flex items-center gap-2 text-sm font-bold text-[#153e69] hover:underline">
          <ChevronLeft className="w-4 h-4" /> Back to Users Directory
        </Link>
      </div>
    );
  }

  const fullName = user.full_name || user.name || user.mobile_number || 'Candidate User';
  const role = user.active_profile || user.role || 'job_seeker';
  const email = user.email || 'N/A';
  const phone = user.mobile_number || user.phone || 'N/A';
  const gender = user.gender || 'N/A';
  const city = user.city || user.location || 'N/A';
  const country = user.country || 'India';
  const experience = user.experience_range || user.experience_years || user.experience || 'N/A';
  const preferredRole = user.preferred_role || 'N/A';
  const currentEmployer = user.current_employer || 'N/A';
  const language = user.selected_language || user.language || 'en';
  const availability = user.availability_status || (user.is_available ? 'Available' : 'Available');
  const joinedDate = user.created_at ? new Date(user.created_at).toLocaleDateString('en-GB') : 'N/A';

  // Format skills/specialties
  let skillsList = [];
  if (Array.isArray(user.skills)) {
    skillsList = user.skills;
  } else if (typeof user.skills === 'string' && user.skills) {
    try {
      skillsList = JSON.parse(user.skills);
    } catch (e) {
      skillsList = user.skills.split(',').map(s => s.trim());
    }
  } else if (user.cuisine_specialty) {
    skillsList = [user.cuisine_specialty];
  }

  const initials = fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'US';

  const hasProfessionalDetails = 
    (preferredRole && preferredRole !== 'N/A') || 
    (experience && experience !== 'N/A') || 
    (currentEmployer && currentEmployer !== 'N/A') || 
    skillsList.length > 0;

  const totalApplied = appliedJobs.length || user.applications_count || 0;
  const totalPosted = postedJobs.length || user.job_posts_count || 0;
  const hasActivityData = totalApplied > 0 || totalPosted > 0;

  return (
    <div className="space-y-6 text-left pb-12">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 flex-wrap">
        <Link to="/admin/users" className="hover:text-slate-600">Talent / Jobseeker</Link>
        <span className="text-slate-300">&gt;</span>
        <span className="text-slate-600">User Detail</span>
      </div>

      {/* Header Profile Summary Block */}
      <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4.5">
          {/* Avatar square */}
          <div className="w-14 h-14 bg-slate-50 border border-[#cfd5dc] rounded-xl flex items-center justify-center text-xl shadow-xs font-outfit font-black text-[#153e69] shrink-0 overflow-hidden">
            {resolveImageUrl(user.profile_photo_path || user.profile_photo || user.avatar) ? (
              <img 
                src={resolveImageUrl(user.profile_photo_path || user.profile_photo || user.avatar)} 
                alt={fullName} 
                className="w-full h-full object-cover" 
              />
            ) : (
              initials
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="font-outfit font-extrabold text-xl text-slate-800 leading-none">{fullName}</h2>
              <span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                suspended ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-[#eff6ff] text-[#1d4b78]'
              }`}>
                {suspended ? 'Suspended' : 'Active'}
              </span>
            </div>
            
            <p className="text-xs font-bold text-slate-400">
              📍 {city !== 'N/A' ? `${city}, ` : ''}{country} &nbsp;•&nbsp; Member since {joinedDate}
            </p>
          </div>
        </div>

        {/* Header Action Buttons (Single Toggle Button) */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button 
            onClick={handleToggleSuspend} 
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-xs cursor-pointer ${
              suspended 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-white border border-[#f0a9a9] hover:bg-rose-50 text-[#d32f2f]'
            }`}
          >
            {suspended ? <CheckCircle2 className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
            <span>{suspended ? 'Activate User' : 'Suspend User'}</span>
          </button>
          
          <button
            onClick={handleDeleteUser}
            className="p-2.5 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-[#d7dce2] rounded-xl transition-colors cursor-pointer"
            title="Delete User"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left / Primary Information Column */}
        <div className={hasActivityData ? "lg:col-span-1 space-y-6" : (hasProfessionalDetails ? "lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 space-y-0" : "lg:col-span-3 max-w-2xl")}>
          
          {/* Card 1: Account & Contact Info */}
          <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-5">
            <h3 className="font-outfit font-extrabold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <UserSquare2 className="w-4 h-4 text-[#153e69]" /> Account & Contact Info
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
              <div>
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Full Name</span>
                <span className="text-slate-900 font-extrabold mt-0.5 block text-sm">{fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Mobile Number</span>
                <span className="text-slate-900 font-extrabold mt-0.5 block font-mono">{phone}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Email Address</span>
                <span className="text-blue-700 font-extrabold mt-0.5 block">{email}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">City & Country</span>
                <span className="text-slate-900 font-extrabold mt-0.5 block">{city !== 'N/A' ? `${city}, ` : ''}{country}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Account Role</span>
                <span className="text-purple-700 font-extrabold mt-0.5 block uppercase">{role}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Registration Date</span>
                <span className="text-slate-700 font-extrabold mt-0.5 block">{joinedDate}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Professional & Skills Details (Only show if available) */}
          {hasProfessionalDetails && (
            <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-4">
              <h3 className="font-outfit font-extrabold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Briefcase className="w-4 h-4 text-[#153e69]" /> Professional Details
              </h3>

              <div className="space-y-3.5 text-xs font-semibold text-slate-600">
                {preferredRole !== 'N/A' && (
                  <div>
                    <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Role & Preference</span>
                    <span className="text-purple-700 font-extrabold mt-0.5 block capitalize">{role} • {preferredRole}</span>
                  </div>
                )}
                {experience !== 'N/A' && (
                  <div>
                    <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Experience Level</span>
                    <span className="text-amber-700 font-extrabold mt-0.5 block">☆ {experience}</span>
                  </div>
                )}
                {currentEmployer !== 'N/A' && (
                  <div>
                    <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Current Employer</span>
                    <span className="text-slate-900 font-extrabold mt-0.5 block">{currentEmployer}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Gender & Language</span>
                  <span className="text-slate-800 font-extrabold mt-0.5 block capitalize">{gender} • {language.toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Availability</span>
                  <span className="text-emerald-700 font-extrabold mt-0.5 block">{availability}</span>
                </div>
                {skillsList.length > 0 && (
                  <div>
                    <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-1.5">Cuisine & Skills</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {skillsList.map((skill, idx) => (
                        <span key={idx} className="bg-slate-50 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-md border border-slate-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Stats & Activity Table (Only show if activity data exists) */}
        {hasActivityData && (
          <div className="lg:col-span-2 space-y-6">
            
            {/* Top 3 KPI Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Card 1: Applications Submitted */}
              <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">APPLICATIONS SUBMITTED</span>
                <span className="font-outfit font-black text-3xl text-slate-900 block leading-none">{totalApplied}</span>
                <div className="w-full h-1 bg-blue-500 rounded-full"></div>
              </div>

              {/* Card 2: Jobs Posted */}
              <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">JOBS POSTED</span>
                <span className="font-outfit font-black text-3xl text-slate-900 block leading-none">{totalPosted}</span>
                <div className="w-full h-1 bg-emerald-500 rounded-full"></div>
              </div>

              {/* Card 3: Account Status */}
              <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">ACCOUNT STATUS</span>
                <span className={`font-outfit font-black text-xl block leading-none uppercase ${suspended ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {suspended ? 'SUSPENDED' : 'ACTIVE'}
                </span>
                <div className={`w-full h-1 rounded-full ${suspended ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
              </div>

            </div>

            {/* Activity / Applications Table Card */}
            {totalApplied > 0 && (
              <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-outfit font-extrabold text-sm text-slate-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#153e69]" /> Applied Job Applications
                  </h3>
                  <Link 
                    to={`/admin/applications?userId=${user.id}&userName=${encodeURIComponent(fullName)}`} 
                    className="text-xs font-bold text-[#153e69] hover:underline flex items-center gap-1"
                  >
                    View All Applications &rarr;
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#e2e8f0] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        <th className="py-2.5 px-3">Job Title</th>
                        <th className="py-2.5 px-3">Applied Date</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9] text-xs font-semibold text-slate-700">
                      {appliedJobs.map(app => (
                        <tr key={app.id} className="hover:bg-[#f8fafc]">
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-900 block">{app.job_title || app.title || 'Listing'}</span>
                            <span className="text-[10px] text-slate-400 font-medium block">{app.company || 'Employer'}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-400 font-medium">
                            {app.created_at ? new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {app.status || 'Applied'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
