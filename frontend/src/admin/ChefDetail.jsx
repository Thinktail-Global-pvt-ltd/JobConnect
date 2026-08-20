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
  CheckCircle,
  Languages,
  Briefcase,
  Share2,
  ExternalLink,
  Clock,
  Compass,
  Layers,
  Globe2,
  Link2
} from 'lucide-react';
import axios from 'axios';
import { realApi, mockApi, resolveImageUrl } from '../services/api';

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
  const [imgFailed, setImgFailed] = useState(false);

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
    } catch (e) {
      console.warn("Failed to find chef in list:", e);
    }

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
  
  // 6 Newly Added / Extracted Fields
  const language = chef.selected_language || chef.languages || chef.language || 'English';
  const operationalExpertise = chef.operational_expertise || chef.operational_experties || chef.availability_info?.operational_expertise || 'Kitchen Operations, Menu Management';
  const regionalExperience = chef.regional_experience || chef.regions_worked || chef.availability_info?.regional_experience || [chef.city, chef.country].filter(Boolean).join(', ') || 'Both (Global & Domestic)';
  const employmentPreference = chef.employment_preference || chef.employment_type || chef.preferred_role || 'Full-time / Permanent';
  const availabilityStatus = chef.availability_status || (chef.is_available !== false ? 'Available' : 'Unavailable');
  
  const socials = chef.socials || chef.social_links || {};
  
  const rawCalendly = chef.calendly_link || '';
  const calendly = rawCalendly ? rawCalendly.replace(/^https?:\/\//, '') : null;

  const specialtiesList = chef.cuisine_specialty 
    ? String(chef.cuisine_specialty).split(',').map(s => s.trim()).filter(Boolean)
    : (chef.specialties ? String(chef.specialties).split(',').map(s => s.trim()).filter(Boolean) : []);

  const opExpertiseList = operationalExpertise
    ? String(operationalExpertise).split(',').map(s => s.trim()).filter(Boolean)
    : ['Kitchen Operations', 'Menu Management', 'Staff Leadership'];

  const bioDescription = chef.bio || 'No bio provided.';
  const currentEmployer = chef.current_employer || chef.preferred_role || 'Independent Professional';

  const skillsList = Array.isArray(chef.skills) 
    ? chef.skills 
    : (chef.skills ? String(chef.skills).split(',').map(s => s.trim()).filter(Boolean) : []);

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
              {(photoUrl && !imgFailed) ? (
                <img 
                  src={photoUrl} 
                  alt={name} 
                  className="w-full h-full object-cover"
                  onError={() => setImgFailed(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-outfit font-black text-slate-350 text-4xl bg-slate-100">
                  {(name || 'C').charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Name and Designation */}
            <h3 className="font-outfit font-extrabold text-xl text-slate-850">{name}</h3>
            <p className="text-xs font-bold text-slate-400 mt-1">{role}</p>

            {/* Badges Row */}
            <div className="flex items-center gap-2 mt-4.5 flex-wrap justify-center">
              <span className="px-3 py-1 bg-[#eff6ff] text-[#1d4b78] rounded-xl text-xs font-bold">
                {experience.includes('Exp') ? experience : `${experience} Exp.`}
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {availabilityStatus}
              </span>
            </div>

            {/* Divider */}
            <div className="w-full border-t border-slate-100 my-6" />

            {/* Left aligned metadata rows */}
            <div className="w-full space-y-4 text-left text-xs font-semibold text-slate-500">
              
              {/* Phone Number */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-450 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Phone Number</span>
                  <span className="text-slate-800 font-extrabold mt-0.5 block">{phone}</span>
                </div>
              </div>

              {/* Current Location */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-450 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Current Location</span>
                  <span className="text-slate-800 font-extrabold mt-0.5 block">{locationText}</span>
                </div>
              </div>

              {/* Language */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-450 shrink-0">
                  <Languages className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Language</span>
                  <span className="text-slate-800 font-extrabold mt-0.5 block">{language}</span>
                </div>
              </div>

              {/* Regional Experience */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-450 shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Regional Experience</span>
                  <span className="text-slate-800 font-extrabold mt-0.5 block">{regionalExperience}</span>
                </div>
              </div>

              {/* Employment Preference */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-450 shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Employment Preference</span>
                  <span className="text-slate-800 font-extrabold mt-0.5 block">{employmentPreference}</span>
                </div>
              </div>

              {/* Job Location Preference */}
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

            <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1">
              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest block">Current Status</span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs text-emerald-800 font-extrabold block">{availabilityStatus}</span>
              </div>
            </div>
            
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

        {/* Right Column (2/3 width): Cuisine, Operational Expertise, Work Exp, Socials, Activity Log */}
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

          {/* Card 2: Operational Expertise */}
          <div className="bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm space-y-4">
            <h3 className="font-outfit font-extrabold text-sm text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#153e69]" /> Operational Expertise
            </h3>
            
            <div className="flex flex-wrap gap-2.5">
              {opExpertiseList.length > 0 ? opExpertiseList.map((item, idx) => (
                <div 
                  key={idx} 
                  className="px-3.5 py-1.5 bg-blue-50/70 border border-blue-200 text-[#1d4b78] rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#153e69]"></span>
                  <span>{item}</span>
                </div>
              )) : (
                <span className="text-xs text-slate-400 font-semibold">Kitchen Operations & Management</span>
              )}
            </div>
          </div>



          {/* Card 4: Social Profiles & Links */}
          <div className="bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm space-y-4">
            <h3 className="font-outfit font-extrabold text-sm text-slate-800 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#153e69]" /> Social Links & Profiles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {socials.linkedin && (
                <a href={socials.linkedin.startsWith('http') ? socials.linkedin : `https://${socials.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 p-3 rounded-2xl bg-blue-50/50 border border-blue-100 hover:bg-blue-100/50 transition-colors">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <div className="truncate text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">LinkedIn</span>
                    <span className="font-extrabold text-blue-700 truncate block">{socials.linkedin}</span>
                  </div>
                </a>
              )}
              {socials.instagram && (
                <a href={socials.instagram.startsWith('http') ? socials.instagram : `https://${socials.instagram}`} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 p-3 rounded-2xl bg-pink-50/50 border border-pink-100 hover:bg-pink-100/50 transition-colors">
                  <Share2 className="w-4 h-4 text-pink-600" />
                  <div className="truncate text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Instagram</span>
                    <span className="font-extrabold text-pink-700 truncate block">{socials.instagram}</span>
                  </div>
                </a>
              )}
              {socials.facebook && (
                <a href={socials.facebook.startsWith('http') ? socials.facebook : `https://${socials.facebook}`} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 p-3 rounded-2xl bg-blue-50/50 border border-blue-100 hover:bg-blue-100/50 transition-colors">
                  <Link2 className="w-4 h-4 text-blue-800" />
                  <div className="truncate text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Facebook</span>
                    <span className="font-extrabold text-blue-900 truncate block">{socials.facebook}</span>
                  </div>
                </a>
              )}
              {socials.youtube && (
                <a href={socials.youtube.startsWith('http') ? socials.youtube : `https://${socials.youtube}`} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 p-3 rounded-2xl bg-red-50/50 border border-red-100 hover:bg-red-100/50 transition-colors">
                  <ExternalLink className="w-4 h-4 text-red-600" />
                  <div className="truncate text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">YouTube</span>
                    <span className="font-extrabold text-red-700 truncate block">{socials.youtube}</span>
                  </div>
                </a>
              )}
              {socials.website && (
                <a href={socials.website.startsWith('http') ? socials.website : `https://${socials.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                  <Globe2 className="w-4 h-4 text-slate-600" />
                  <div className="truncate text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Website</span>
                    <span className="font-extrabold text-slate-800 truncate block">{socials.website}</span>
                  </div>
                </a>
              )}
              {(!socials.linkedin && !socials.instagram && !socials.facebook && !socials.youtube && !socials.website) && (
                <div className="col-span-full p-4 bg-slate-50 rounded-2xl border border-slate-150 text-center text-xs font-semibold text-slate-400">
                  No social profiles connected
                </div>
              )}
            </div>
          </div>

          {/* Card 5: Profile Activity Log */}
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

