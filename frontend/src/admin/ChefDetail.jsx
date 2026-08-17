import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Mail, Calendar, Phone, MapPin, Award, CheckCircle2, X } from 'lucide-react';
import axios from 'axios';
import { realApi, mockApi } from '../services/api';

export default function ChefDetail() {
  const { id } = useParams();
  const [chef, setChef] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('pending');

  const fetchChefDetail = async () => {
    setLoading(true);
    let data = null;

    // 1. Try fetching from mockApi getChefs list
    try {
      const res = await mockApi.getChefs();
      if (res && res.chefs && Array.isArray(res.chefs)) {
        const found = res.chefs.find(c => String(c.id) === String(id) || String(c.user_id) === String(id));
        if (found) data = found;
      }
    } catch (e) {
      console.warn("Failed to find chef in list:", e);
    }

    if (data) {
      setChef(data);
      setStatus(data.approval_status || data.status || 'pending');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChefDetail();
  }, [id]);

  const handleApprove = async () => {
    try {
      await mockApi.approveChef(id);
      setStatus('approved');
      alert("Chef profile published & approved successfully!");
      fetchChefDetail();
    } catch (err) {
      console.error('Approve failed:', err);
    }
  };

  const handleUnpublish = async () => {
    try {
      await mockApi.unpublishChef(id);
      setStatus('pending');
      alert("Chef profile unpublished successfully!");
      fetchChefDetail();
    } catch (err) {
      console.error('Unpublish failed:', err);
    }
  };

  const handleReject = async () => {
    try {
      await mockApi.rejectChef(id);
      setStatus('rejected');
      alert("Chef profile rejected successfully!");
      fetchChefDetail();
    } catch (err) {
      console.error('Reject failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 text-xs font-semibold">
        Loading chef details...
      </div>
    );
  }

  if (!chef) {
    return (
      <div className="py-20 text-center text-slate-400 text-xs font-semibold">
        Chef profile not found.
      </div>
    );
  }

  const name = chef.full_name || chef.name || 'Unnamed Chef';
  const email = chef.email || 'Not Provided';
  const phone = chef.mobile_number || chef.phone || 'Not Provided';
  const experience = chef.experience_range || chef.experience || '0 Years';
  const specialties = chef.cuisine_specialty || chef.specialties || 'Multi-Cuisine';
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CH';

  return (
    <div className="space-y-6 text-left">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
        <Link to="/admin/chefs" className="hover:text-slate-600">Chefs</Link>
        <span>&gt;</span>
        <span className="text-slate-600">Chef Detail</span>
      </div>

      {/* Header Profile Summary block */}
      <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div className="flex items-center gap-4.5">
          {/* Logo square / Photo */}
          <div className="w-14 h-14 bg-white border border-[#cfd5dc] rounded-xl flex items-center justify-center text-2xl shadow-sm font-outfit font-black text-[#173f70] shrink-0 overflow-hidden">
            {(chef.profile_photo_path || chef.profile_photo || chef.photo_url || chef.avatar || chef.avatar_url) ? (
              <img 
                src={chef.profile_photo_path || chef.profile_photo || chef.photo_url || chef.avatar || chef.avatar_url} 
                alt={name} 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              initials
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-outfit font-extrabold text-xl text-slate-800 leading-none">{name}</h2>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border-0 ${
                status === 'approved' 
                  ? 'bg-[#eff6ff] text-[#1d4b78]' 
                  : status === 'rejected' 
                    ? 'bg-rose-55 text-rose-700' 
                    : 'bg-amber-50 text-amber-700'
              }`}>
                {status === 'approved' ? 'Approved / Published' : status === 'rejected' ? 'Rejected' : 'Pending / Unpublished'}
              </span>
            </div>
            
            <p className="text-xs font-bold text-slate-400">
              📍 {[chef.city, chef.country].filter(Boolean).join(', ') || 'India'} &nbsp;•&nbsp; Preferred Role: {chef.preferred_role || 'Executive Chef'}
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5">
          {status !== 'rejected' && (
            <button 
              onClick={handleReject} 
              className="bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-lg px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>🚫</span>
              Reject Profile
            </button>
          )}
          {status === 'approved' ? (
            <button 
              onClick={handleUnpublish} 
              className="bg-white border border-amber-300 hover:bg-amber-50 text-amber-600 rounded-lg px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>👁️‍🗨️</span>
              Unpublish Profile
            </button>
          ) : (
            <button 
              onClick={handleApprove} 
              className="bg-[#f58220] hover:bg-[#df6d0f] text-white rounded-lg px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>⚙️</span>
              Approve Profile
            </button>
          )}
        </div>
      </div>

      {/* Split grid sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Contact Information (1/3) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-5">
            <h3 className="font-outfit font-extrabold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-55 pb-3">
              <span>📋</span> Profile & Contact Details
            </h3>

            {/* Info Items */}
            <div className="space-y-4 text-xs font-semibold text-slate-500">
              <div>
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Full Name</span>
                <span className="text-slate-800 font-extrabold mt-1 block">{name}</span>
              </div>
              <div className="border-t border-slate-50 pt-3">
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Preferred Role</span>
                <span className="text-slate-800 font-extrabold mt-1 block">{chef.preferred_role || 'Executive Chef'}</span>
              </div>
              <div className="border-t border-slate-50 pt-3">
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Experience Level</span>
                <span className="text-slate-850 font-black mt-1 block">⭐ {experience}</span>
              </div>
              <div className="border-t border-slate-50 pt-3">
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Mobile Number</span>
                <span className="text-emerald-600 font-extrabold mt-1 block font-mono">📱 {phone}</span>
              </div>
              <div className="border-t border-slate-50 pt-3">
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Email Address</span>
                <span className="text-blue-600 font-extrabold mt-1 block truncate">{email}</span>
              </div>
              <div className="border-t border-slate-50 pt-3">
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Current Location</span>
                <span className="text-slate-800 font-extrabold mt-1 block">📍 {[chef.city, chef.country].filter(Boolean).join(', ') || 'Not Specified'}</span>
              </div>
              <div className="border-t border-slate-50 pt-3">
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Languages</span>
                <span className="text-slate-800 font-extrabold mt-1 block">{chef.selected_language || chef.languages || 'Not Specified'}</span>
              </div>
              {chef.current_employer && (
                <div className="border-t border-slate-50 pt-3">
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Current Employer</span>
                  <span className="text-slate-800 font-extrabold mt-1 block">🏢 {chef.current_employer}</span>
                </div>
              )}
            </div>

            <button className="w-full bg-white border border-[#e2e8f0] hover:bg-slate-50 text-slate-700 rounded-lg py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm">
              <Mail className="w-4 h-4 text-slate-400" />
              Send Direct Message
            </button>
          </div>

          {chef.calendly_link && (
            <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-4">
              <h3 className="font-outfit font-extrabold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-55 pb-3">
                <span>📅</span> Calendly Booking
              </h3>
              <a 
                href={chef.calendly_link} 
                target="_blank" 
                rel="noreferrer" 
                className="block p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#173f70] font-semibold break-all underline"
              >
                {chef.calendly_link}
              </a>
              <div className="text-xs font-semibold text-slate-500">
                <span>Availability: </span>
                <span className="text-emerald-600 font-extrabold">{chef.availability || 'Available'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Specialties & Key Competencies (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* KPI Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[95px]">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Experience Profile</span>
              <span className="font-outfit font-black text-2xl text-slate-800 block mt-2">
                {experience}
              </span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[95px]">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Location Preference</span>
              <span className="font-outfit font-black text-xl text-[#1d4b78] block mt-2">
                {chef.location_preference === 'Both' ? 'Domestic & Overseas' : chef.location_preference || 'Both'}
              </span>
            </div>
          </div>

          {/* Cuisine Specialties */}
          <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-4">
            <h3 className="font-outfit font-extrabold text-sm text-slate-800">Cuisine Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {String(specialties).split(',').map((item, index) => (
                <span 
                  key={index} 
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-700 font-bold"
                >
                  {String(item).trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Key Competencies / Skills */}
          {chef.skills && (
            <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-4">
              <h3 className="font-outfit font-extrabold text-sm text-slate-800">Skills & Key Competencies</h3>
              <div className="flex flex-wrap gap-2">
                {String(chef.skills).split(',').map((item, index) => (
                  <span 
                    key={index} 
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-250 text-xs font-bold"
                  >
                    {String(item).trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bio Description */}
          <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-3">
            <h3 className="font-outfit font-extrabold text-sm text-slate-800">Bio / Professional Summary</h3>
            <p className="text-xs font-semibold text-slate-600 leading-relaxed whitespace-pre-wrap">
              {chef.bio || 'No bio description provided.'}
            </p>
          </div>

          {/* System metadata */}
          <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm grid grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Profile ID</span>
              <span className="font-semibold text-slate-700">#{chef.id}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Approval Status</span>
              <span className="font-semibold text-slate-700 capitalize">{status}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Created Date</span>
              <span className="font-semibold text-slate-700">{chef.created_at ? new Date(chef.created_at).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Alert Banner Moderator Guidance */}
      <div className="bg-[#eff6ff] border border-blue-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden text-left">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-outfit font-extrabold text-sm text-slate-800">Moderator Guidance</h4>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed max-w-2xl">
              This chef profile has completed 100% of their profile information. Review their culinary specialties, experience level, and verify contact info before publishing to candidate discovery feeds.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {status !== 'approved' ? (
            <button 
              onClick={handleApprove}
              className="px-5 py-2.5 bg-[#173f70] hover:bg-[#12345d] text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Approve Profile
            </button>
          ) : (
            <button 
              onClick={handleUnpublish}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Unpublish Profile
            </button>
          )}
          <button 
            onClick={(e) => { e.currentTarget.closest('.bg-\\[\\#eff6ff\\]').style.display = 'none'; }}
            className="text-slate-500 hover:text-slate-700 font-bold text-xs cursor-pointer px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      </div>

    </div>
  );
}
