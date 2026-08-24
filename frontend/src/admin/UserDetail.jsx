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

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link to="/admin/users" className="hover:text-[#153e69] transition-colors">Talent / Jobseeker</Link>
            <span>&gt;</span>
            <span className="text-slate-800 font-bold">User Detail</span>
          </div>
          <h1 className="text-2xl font-bold font-outfit text-slate-900">User Profile Details</h1>
        </div>

        <Link 
          to="/admin/users" 
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#d7dce2] rounded-md text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm self-start sm:self-auto"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Users</span>
        </Link>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-xl border border-[#d7dce2] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 border-2 border-emerald-200 flex items-center justify-center font-extrabold text-xl shrink-0 overflow-hidden shadow-inner">
            {resolveImageUrl(user.profile_photo_path || user.profile_photo || user.avatar) ? (
              <img 
                src={resolveImageUrl(user.profile_photo_path || user.profile_photo || user.avatar)} 
                alt={fullName} 
                className="w-full h-full object-cover rounded-2xl"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              initials
            )}
          </div>

          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900 font-outfit">{fullName}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                Role: {role}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                suspended ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                {suspended ? 'Suspended' : 'Active Account'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">User ID: #{user.id} • Registered on {joinedDate}</p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleSuspend}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-extrabold transition-colors border shadow-sm cursor-pointer ${
              suspended
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                : 'bg-white hover:bg-rose-50 text-rose-600 border-rose-200'
            }`}
          >
            {suspended ? <CheckCircle2 className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
            <span>{suspended ? 'Activate User' : 'Suspend User'}</span>
          </button>

          <button
            onClick={handleDeleteUser}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-rose-100 hover:text-rose-700 text-slate-600 border border-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            title="Delete User"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* User Information Grid (3 Columns Box Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Full Name */}
        <div className="bg-white p-4 rounded-xl border border-[#d7dce2] shadow-sm">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Full Name</span>
          <span className="text-xs font-extrabold text-slate-900 block mt-1">{fullName}</span>
        </div>

        {/* Mobile Phone */}
        <div className="bg-white p-4 rounded-xl border border-[#d7dce2] shadow-sm">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Mobile Phone</span>
          <div className="flex items-center gap-1.5 mt-1 font-mono text-xs font-extrabold text-emerald-700">
            <Smartphone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            {phone !== 'N/A' ? (
              <a href={`tel:${phone}`} className="hover:underline">{phone}</a>
            ) : (
              <span className="text-slate-400 font-semibold">N/A</span>
            )}
          </div>
        </div>

        {/* Email Address */}
        <div className="bg-white p-4 rounded-xl border border-[#d7dce2] shadow-sm">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Email Address</span>
          <span className={`text-xs font-extrabold block mt-1 ${email !== 'N/A' ? 'text-blue-700' : 'text-blue-600'}`}>{email}</span>
        </div>

        {/* Gender */}
        <div className="bg-white p-4 rounded-xl border border-[#d7dce2] shadow-sm">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Gender</span>
          <span className="text-xs font-extrabold text-slate-800 block mt-1 capitalize">{gender}</span>
        </div>

        {/* City / Location */}
        <div className="bg-white p-4 rounded-xl border border-[#d7dce2] shadow-sm">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">City / Location</span>
          <div className="flex items-center gap-1 mt-1 text-xs font-extrabold text-slate-900">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{city}</span>
          </div>
        </div>

        {/* Country */}
        <div className="bg-white p-4 rounded-xl border border-[#d7dce2] shadow-sm">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Country</span>
          <span className="text-xs font-extrabold text-slate-900 block mt-1">{country}</span>
        </div>

        {/* Experience Level */}
        <div className="bg-white p-4 rounded-xl border border-[#d7dce2] shadow-sm">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Experience Level</span>
          <span className={`text-xs font-extrabold block mt-1 ${experience !== 'N/A' ? 'text-amber-700' : 'text-amber-600'}`}>
            {experience !== 'N/A' ? `☆ ${experience}` : 'N/A'}
          </span>
        </div>

        {/* Preferred Role */}
        <div className="bg-white p-4 rounded-xl border border-[#d7dce2] shadow-sm">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Preferred Role</span>
          <span className={`text-xs font-extrabold block mt-1 ${preferredRole !== 'N/A' ? 'text-purple-700' : 'text-purple-600'}`}>{preferredRole}</span>
        </div>

        {/* Current Employer */}
        <div className="bg-white p-4 rounded-xl border border-[#d7dce2] shadow-sm">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Current Employer</span>
          <span className="text-xs font-extrabold text-slate-800 block mt-1">{currentEmployer}</span>
        </div>

        {/* Language */}
        <div className="bg-white p-4 rounded-xl border border-[#d7dce2] shadow-sm">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Language</span>
          <span className="text-xs font-extrabold text-slate-800 block mt-1 uppercase">{language}</span>
        </div>

        {/* Availability Status */}
        <div className="bg-white p-4 rounded-xl border border-[#d7dce2] shadow-sm">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Availability Status</span>
          <span className="text-xs font-extrabold text-emerald-700 block mt-1">{availability}</span>
        </div>

        {/* Account Status */}
        <div className="bg-white p-4 rounded-xl border border-[#d7dce2] shadow-sm">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Account Status</span>
          <span className={`text-xs font-extrabold block mt-1 ${suspended ? 'text-rose-600' : 'text-emerald-700'}`}>
            {suspended ? 'Suspended Account' : 'Active Account'}
          </span>
        </div>
      </div>

      {/* Cuisine & Skills Specialty Box */}
      <div className="bg-white p-5 rounded-xl border border-[#d7dce2] shadow-sm space-y-3">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Cuisine & Skills Specialty</span>
        {skillsList.length > 0 ? (
          <div className="flex items-center gap-2 flex-wrap">
            {skillsList.map((skill, idx) => (
              <span key={idx} className="bg-slate-50 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 font-medium">No specialized skills listed.</p>
        )}
      </div>

      {/* Stats Summary KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl border border-[#d7dce2] shadow-sm text-center">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Jobs Posted</span>
          <span className="text-3xl font-extrabold text-emerald-600 block mt-1 font-outfit">{postedJobs.length || user.job_posts_count || 0}</span>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#d7dce2] shadow-sm text-center">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Applications Submitted</span>
          <span className="text-3xl font-extrabold text-blue-600 block mt-1 font-outfit">{appliedJobs.length || user.applications_count || 0}</span>
        </div>
      </div>

      {/* Footer Info Metadata Bar */}
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-2 py-1">
        <span>User ID: #{user.id}</span>
        <span>Joined: {joinedDate}</span>
      </div>
    </div>
  );
}
