import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { 
  Phone, 
  MapPin, 
  Globe, 
  Calendar, 
  Ban, 
  CheckCircle2, 
  PauseCircle, 
  UtensilsCrossed, 
  CheckCircle 
} from 'lucide-react';
import axios from 'axios';
import { realApi, mockApi } from '../services/api';

export default function ChefDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [chef, setChef] = useState(location.state?.chef || null);
  const [loading, setLoading] = useState(!location.state?.chef);
  const [status, setStatus] = useState(
    location.state?.chef 
      ? (location.state.chef.approval_status || location.state.chef.status || 'pending') 
      : 'pending'
  );

  const fetchChefDetail = async () => {
    if (location.state?.chef) {
      setLoading(false);
      return;
    }
    setLoading(true);
    let data = null;

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
      console.error(err);
    }
  };

  const handleUnpublish = async () => {
    try {
      await mockApi.unpublishChef(id);
      setStatus('pending');
      alert("Chef profile unpublished successfully!");
      fetchChefDetail();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async () => {
    try {
      await mockApi.rejectChef(id);
      setStatus('rejected');
      alert("Chef profile rejected successfully!");
      fetchChefDetail();
    } catch (err) {
      console.error(err);
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

  // Mappings dynamically populated from API data
  const name = chef.full_name || chef.name || 'Chef Profile';
  const role = chef.preferred_role || 'Chef';
  const experience = chef.experience_range || chef.experience || 'Not specified';
  const phone = chef.mobile_number || chef.phone || 'Not provided';
  const locationText = [chef.city, chef.country].filter(Boolean).join(', ') || 'Not specified';
  const preference = chef.location_preference || chef.availability_info?.location_preference || 'Both';
  
  const rawCalendly = chef.calendly_link || '';
  const calendly = rawCalendly ? rawCalendly.replace(/^https?:\/\//, '') : null;

  const specialtiesList = chef.cuisine_specialty 
    ? String(chef.cuisine_specialty).split(',').map(s => s.trim()).filter(Boolean)
    : (chef.specialties ? String(chef.specialties).split(',').map(s => s.trim()).filter(Boolean) : []);

  const bioDescription = chef.bio || 'No bio provided.';
  const currentEmployer = chef.current_employer || chef.preferred_role || 'Independent Professional';

  const resolveImageUrl = (path) => {
    if (!path) return null;
    let clean = String(path).replace('/backend/storage/', '/storage/');
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
      return clean;
    }
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return `http://localhost:8000${clean.startsWith('/') ? '' : '/'}${clean}`;
      }
      return `${origin}${clean.startsWith('/') ? '' : '/'}${clean}`;
    }
    return clean;
  };

  const rawPhoto = chef.profile_photo_path || chef.profile_photo || chef.photo_url || chef.avatar || chef.avatar_url;
  const photoUrl = resolveImageUrl(rawPhoto);

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Header Breadcrumbs & Action Panel */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        
        {/* Left Side: Breadcrumbs and Page Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 flex-wrap">
            <Link to="/admin/chefs" className="hover:text-slate-600">Chefs</Link>
            <span className="text-slate-300">&gt;</span>
            <span className="text-slate-600">Chef Profile Review</span>
          </div>
          <h2 className="font-outfit font-extrabold text-2xl text-slate-800 tracking-tight">
            Review Chef Application
          </h2>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button 
            onClick={handleReject} 
            className="bg-white border border-[#153e69] hover:bg-slate-50 text-[#153e69] rounded-xl px-5 py-2.5 text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Ban className="w-4 h-4 text-[#153e69]" />
            Reject Profile
          </button>
          
          <button 
            onClick={handleUnpublish} 
            className="bg-[#eff6ff] hover:bg-blue-100 text-[#153e69] rounded-xl px-5 py-2.5 text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <PauseCircle className="w-4 h-4 text-[#153e69]" />
            Suspend Profile
          </button>

          <button 
            onClick={handleApprove} 
            className="bg-[#f58220] hover:bg-[#df6d0f] text-white rounded-xl px-5 py-2.5 text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            Approve Profile
          </button>
        </div>
      </div>

      {/* Grid Layout (Split screen) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column (1/3 width): Profile Card & Booking */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Card 1: Chef Profile card */}
          <div className="bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm flex flex-col items-center text-center">
            
            {/* Chef Profile Image */}
            <div className="w-32 h-32 rounded-3xl bg-slate-50 border border-slate-100 overflow-hidden shadow-xs relative mb-4">
              {photoUrl ? (
                <img 
                  src={photoUrl} 
                  alt={name} 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-outfit font-black text-slate-350 text-4xl bg-slate-50">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Name and Designation */}
            <h3 className="font-outfit font-extrabold text-xl text-slate-850">{name}</h3>
            <p className="text-xs font-bold text-slate-400 mt-1">{role}</p>

            {/* Badges Row */}
            <div className="flex items-center gap-2 mt-4.5">
              <span className="px-3 py-1 bg-[#eff6ff] text-[#1d4b78] rounded-xl text-xs font-bold">
                {experience.includes('Exp') ? experience : `${experience} Exp.`}
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold">
                Phone Verified
              </span>
            </div>

            {/* Divider */}
            <div className="w-full border-t border-slate-100 my-6" />

            {/* Left aligned metadata rows */}
            <div className="w-full space-y-4 text-left text-xs font-semibold text-slate-500">
              
              {/* Row 1 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-450 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Phone Number</span>
                  <span className="text-slate-800 font-extrabold mt-0.5 block">{phone}</span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-450 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Current Location</span>
                  <span className="text-slate-800 font-extrabold mt-0.5 block">{locationText}</span>
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-450 shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Job Location Preference</span>
                  <span className="text-slate-800 font-extrabold mt-0.5 block">{preference}</span>
                </div>
              </div>

            </div>

          </div>

          {/* Card 2: Booking & Availability */}
          <div className="bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm space-y-4">
            <h3 className="font-outfit font-extrabold text-sm text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#153e69]" /> Booking & Availability
            </h3>
            
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-150 space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Calendly URL</span>
              {calendly ? (
                <a 
                  href={`https://${calendly}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-xs text-blue-600 font-extrabold hover:underline block truncate"
                >
                  {calendly}
                </a>
              ) : (
                <span className="text-xs text-slate-400 font-semibold block">Not connected</span>
              )}
            </div>
          </div>

        </div>

        {/* Right Column (2/3 width): Cuisine, Work Exp, Activity Log */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Cuisine Specialities */}
          <div className="bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm space-y-4">
            <h3 className="font-outfit font-extrabold text-sm text-slate-800">Cuisine Specialities</h3>
            
            <div className="flex flex-wrap gap-3">
              {specialtiesList.length > 0 ? specialtiesList.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5 text-slate-500" />
                  <span>{item}</span>
                </div>
              )) : (
                <span className="text-xs text-slate-400 font-semibold">No specialties specified</span>
              )}
            </div>
          </div>

          {/* Card 2: Work Experience */}
          <div className="bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm space-y-5">
            <h3 className="font-outfit font-extrabold text-sm text-slate-800">Work Experience</h3>
            
            <div className="flex items-start gap-4">
              {/* Check Circle Icon wrapper */}
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-[#153e69] mt-0.5">
                <CheckCircle className="w-4 h-4" />
              </div>

              {/* Exp content */}
              <div className="flex-grow space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">{role}</h4>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">
                      {currentEmployer}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md shrink-0 self-start sm:self-auto">
                    {experience}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-650 leading-relaxed max-w-3xl">
                  {bioDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Profile Activity Log */}
          <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#e2e8f0]">
              <h3 className="font-outfit font-extrabold text-sm text-slate-800">Profile Activity Log</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/20 border-b border-[#e2e8f0] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-6">Action</th>
                    <th className="py-3 px-6">Admin</th>
                    <th className="py-3 px-6">Date</th>
                    <th className="py-3 px-6">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0] text-slate-650 text-xs font-semibold">
                  <tr className="hover:bg-slate-50/10 transition-colors">
                    <td className="py-3.5 px-6">
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-slate-200">
                        Application Started
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-bold text-slate-800">
                      System
                    </td>
                    <td className="py-3.5 px-6 font-bold text-slate-550">
                      {chef.created_at ? new Date(chef.created_at).toLocaleString() : 'Oct 24, 2023 14:30'}
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-slate-500">
                      User initiated onboarding process
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
