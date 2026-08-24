import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Filter, Eye, EyeOff, Check, X, UserPlus, RefreshCw, Smartphone, Phone, List, Signal, Wifi, Battery, MapPin, Building2, Calendar, Star, ArrowUpRight, Award, CheckCircle2 } from 'lucide-react';
import { mockApi, resolveImageUrl } from '../services/api';

export default function Chefs() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialStatus = searchParams.get('status') || searchParams.get('tab') || '';

  const [viewMode, setViewMode] = useState('phone'); // 'phone' or 'table'
  const [chefs, setChefs] = useState([]);
  const [publishedChefs, setPublishedChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [phoneSpecialtyFilter, setPhoneSpecialtyFilter] = useState('');
  const [selectedChef, setSelectedChef] = useState(null);

  // Onboard Modal State
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    mobile_number: '',
    preferred_role: 'Executive Chef',
    city: 'Bengaluru',
    country: 'India',
    experience_range: '8-12 years',
    cuisine_specialty: 'Indian, Tandoor, Mughlai',
    bio: 'Seasoned culinary professional with 10 years of experience in 5-star hotels.',
    calendly_link: 'https://calendly.com/chef-vikram',
    location_preference: 'Both',
    availability: 'Full-time',
    languages: 'English, Hindi',
    skills: 'Kitchen Management, Menu Engineering',
    regional_experience: 'South India',
    employment_preference: 'Permanent',
    approval_status: 'approved',
  });

  // Fetch Public Employer Discovery Chefs (GET /api/employer/chefs)
  const fetchPublishedEmployerChefs = async () => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const endpoints = [
        '/api/employer/chefs',
        '/backend/api/employer/chefs',
        `${origin}/api/employer/chefs`
      ];
      for (const ep of endpoints) {
        try {
          const res = await axios.get(ep, { headers: { Accept: 'application/json' } });
          if (res.data && (res.data.success || res.data.status === 'success') && Array.isArray(res.data.chefs)) {
            setPublishedChefs(res.data.chefs);
            break;
          }
        } catch (e) {}
      }
    } catch (err) {
      console.error('Failed to load employer published chefs feed:', err);
    }
  };

  // Load real chefs directly from backend database API (/api/admin/chefs)
  const loadChefs = async () => {
    setLoading(true);
    let data = null;

    const endpoints = [
      '/api/admin/chefs',
      '/backend/api/admin/chefs'
    ];

    for (const endpoint of endpoints) {
      try {
        const res = await axios.get(endpoint, {
          params: { status: statusFilter },
          headers: { Accept: 'application/json' }
        });
        if (res.data && (res.data.success || res.data.status === 'success') && (Array.isArray(res.data.chefs) || Array.isArray(res.data.profiles) || Array.isArray(res.data.data))) {
          data = res.data;
          break;
        }
      } catch (err) {}
    }

    if (data) {
      const rawList = data.chefs || data.profiles || data.items || data.data || data.results || [];
      setChefs(rawList);
    } else {
      setChefs([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadChefs();
    fetchPublishedEmployerChefs();
  }, [statusFilter]);

  const handleApprove = async (id) => {
    setChefs(prev => prev.map(c => (c.id === id || c.user_id === id) ? { ...c, status: 'approved', approval_status: 'approved' } : c));
    try {
      const endpoints = [
        `/api/admin/chefs/${id}/approve`,
        `/backend/api/admin/chefs/${id}/approve`
      ];
      for (const ep of endpoints) {
        try {
          const res = await axios.post(ep, {}, { headers: { Accept: 'application/json' } });
          if (res.data && res.data.success) break;
        } catch (e) {}
      }
    } catch (err) {
      console.error('Approve failed:', err);
    } finally {
      await loadChefs();
      await fetchPublishedEmployerChefs();
    }
  };

  const handleUnpublish = async (id) => {
    setChefs(prev => prev.map(c => (c.id === id || c.user_id === id) ? { ...c, status: 'rejected', approval_status: 'rejected' } : c));
    try {
      const endpoints = [
        `/api/admin/chefs/${id}/unpublish`,
        `/api/admin/chefs/${id}/reject`,
        `/backend/api/admin/chefs/${id}/unpublish`,
        `/backend/api/admin/chefs/${id}/reject`
      ];
      for (const ep of endpoints) {
        try {
          const res = await axios.post(ep, {}, { headers: { Accept: 'application/json' } });
          if (res.data && res.data.success) break;
        } catch (e) {}
      }
    } catch (err) {
      console.error('Unpublish failed:', err);
    } finally {
      await loadChefs();
      await fetchPublishedEmployerChefs();
    }
  };

  const handleReject = async (id) => {
    setChefs(prev => prev.map(c => (c.id === id || c.user_id === id) ? { ...c, status: 'rejected', approval_status: 'rejected' } : c));
    try {
      const endpoints = [
        `/api/admin/chefs/${id}/reject`,
        `/backend/api/admin/chefs/${id}/reject`
      ];
      for (const ep of endpoints) {
        try {
          const res = await axios.post(ep, {}, { headers: { Accept: 'application/json' } });
          if (res.data && res.data.success) break;
        } catch (e) {}
      }
    } catch (err) {
      console.error('Reject failed:', err);
    } finally {
      await loadChefs();
      await fetchPublishedEmployerChefs();
    }
  };

  const handleOnboardSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.city || !formData.cuisine_specialty) {
      alert("Please fill in all required fields: Full Name, City, and Cuisine Specialties.");
      return;
    }
    setSubmitting(true);

    let success = false;
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const endpoints = [
        '/backend/api/admin/chefs/create',
        `${origin}/backend/api/admin/chefs/create`,
        '/api/admin/chefs/create'
      ];
      for (const ep of endpoints) {
        try {
          const res = await axios.post(ep, formData, { headers: { Accept: 'application/json' } });
          if (res.data && res.data.success) {
            success = true;
            break;
          }
        } catch (e) {}
      }
    } catch (err) {
      console.error('Onboard chef failed:', err);
    }

    if (success) {
      alert("Chef Onboarded Successfully!");
      setIsOnboardModalOpen(false);
      await loadChefs();
    } else {
      alert("Onboarding failed. Please check backend connection.");
    }
    setSubmitting(false);
  };

  // Dynamic KPI Stats calculation
  const totalCount = chefs.length;
  const pendingCount = chefs.filter(c => c.status !== 'approved' && c.approval_status !== 'approved').length;
  const approvedCount = chefs.filter(c => c.status === 'approved' || c.approval_status === 'approved').length;
  const calendlyCount = chefs.filter(c => c.calendly_link || c.calendly).length;
  const calendlyPercentage = totalCount > 0 ? Math.round((calendlyCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-3 text-left">
      
      {/* ADMIN CHEF MODERATION TABLE VIEW DIRECTLY */}
      <div className="space-y-3">
          
          {/* Header Bar Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-outfit font-bold text-[22px] leading-tight text-slate-900">Chef Moderation Directory</h2>
              </div>
              <p className="text-[12px] font-medium text-slate-600 mt-0.5">Review, publish or unpublish professional chef profiles for candidate & employer discovery.</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Status Filter Selector */}
              <div className="relative">
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-[#cfd5dc] text-slate-700 text-[11px] font-bold py-2 pl-3 pr-8 rounded-md focus:outline-none focus:border-[#153e69] cursor-pointer appearance-none"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending / Unpublished Only</option>
                  <option value="approved">Approved / Published Only</option>
                  <option value="rejected">Rejected Only</option>
                </select>
                <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>

              <button 
                onClick={loadChefs}
                className="p-2 bg-white hover:bg-slate-50 border border-[#d7dce2] rounded-md text-[#153e69] transition-colors cursor-pointer"
                title="Refresh Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Chefs List Table Card */}
          <div className="bg-white rounded-lg border border-[#d7dce2] shadow-sm overflow-hidden">
            {loading ? (
              <p className="text-center text-slate-400 text-xs font-medium py-16">Loading chef profiles...</p>
            ) : chefs.length === 0 ? (
              <p className="text-center text-slate-400 text-sm font-medium py-16">No chef profiles found for this filter.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f1f3f5] border-b border-[#d7dce2] text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Chef Name</th>
                      <th className="py-2.5 px-3">Mobile Number</th>
                      <th className="py-2.5 px-3">Experience</th>
                      <th className="py-2.5 px-3">Cuisine Specialties</th>
                      <th className="py-4 px-6 text-center">Calendly</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d7dce2] text-slate-700 text-xs font-semibold">
                    {chefs.filter(c => {
                      if (!statusFilter) return true;
                      const st = (c.approval_status || c.status || 'pending').toLowerCase();
                      if (statusFilter === 'pending') return st !== 'approved' && st !== 'published';
                      if (statusFilter === 'approved') return st === 'approved' || st === 'published';
                      if (statusFilter === 'rejected') return st === 'rejected';
                      return true;
                    }).map((chef) => {
                      const name = chef.full_name || chef.name || 'Unnamed Chef';
                      const email = chef.email || '';
                      const mobile = chef.mobile_number || chef.phone || chef.phone_number || chef.mobile || chef.user?.mobile_number || null;
                      const experience = chef.experience_range || chef.experience || '0 Years';
                      const specialties = chef.cuisine_specialty || chef.specialties || 'Multi-Cuisine';
                      const status = chef.approval_status || chef.status || 'pending';
                      const hasCalendly = chef.calendly || Boolean(chef.calendly_link);
                      const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CH';

                      return (
                        <tr key={chef.id} className="hover:bg-[#f8fafc] transition-colors">
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                                {resolveImageUrl(chef.profile_photo_path || chef.profile_photo || chef.photo_url || chef.avatar || chef.avatar_url) ? (
                                  <img 
                                    src={resolveImageUrl(chef.profile_photo_path || chef.profile_photo || chef.photo_url || chef.avatar || chef.avatar_url)} 
                                    alt={name} 
                                    className="w-full h-full object-cover rounded-full"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                  />
                                ) : (
                                  initials
                                )}
                              </div>
                              <div>
                                <span className="font-extrabold text-slate-900 text-[13px] block leading-tight">{name}</span>
                                <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">{email}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-2.5 px-3">
                            {mobile ? (
                              <a 
                                href={`tel:${mobile}`}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-800 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors font-mono"
                              >
                                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{mobile}</span>
                              </a>
                            ) : (
                              <span className="text-[11px] text-slate-400 font-semibold font-mono">Not Provided</span>
                            )}
                          </td>

                          <td className="py-4 px-6 text-slate-800 font-black">
                            {experience}
                          </td>

                          <td className="py-2.5 px-3">
                            <span className="bg-slate-50 text-slate-700 text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-slate-700 inline-block">
                              {specialties}
                            </span>
                          </td>

                          <td className="py-4 px-6 text-center">
                            {hasCalendly ? (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black px-2.5 py-0.5 rounded-full">
                                ✓ Yes
                              </span>
                            ) : (
                              <span className="bg-slate-50 text-slate-600 border border-slate-200 text-[9px] font-black px-2.5 py-0.5 rounded-full">
                                × No
                              </span>
                            )}
                          </td>

                          <td className="py-2.5 px-3">
                            {status === 'approved' ? (
                              <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Approved / Published
                              </span>
                            ) : status === 'rejected' || status === 'suspended' ? (
                              <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                                Rejected
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                                Unpublished / Pending
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Link 
                                to={`/admin/chefs/${chef.id || chef.user_id}`}
                                state={{ chef: chef }}
                                className="w-7 h-7 rounded-md bg-white hover:bg-slate-50 text-slate-700 hover:text-[#153e69] flex items-center justify-center border border-[#d7dce2] transition-colors cursor-pointer" 
                                title="View Full Profile Details"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>

                              {status === 'approved' ? (
                                <button 
                                  onClick={() => handleUnpublish(chef.id)} 
                                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-black rounded-lg transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                                  title="Unpublish Chef from Employer API"
                                >
                                  <EyeOff className="w-3 h-3" />
                                  <span>Unpublish</span>
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleApprove(chef.id)} 
                                  className="px-3 py-1 bg-[#059669] hover:bg-[#047857] text-white text-[10px] font-black rounded-lg transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                                  title="Publish & Approve Chef for Employer API"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Publish</span>
                                </button>
                              )}

                              {status !== 'rejected' && status !== 'suspended' && (
                                <button 
                                  onClick={() => handleReject(chef.id)} 
                                  className="w-8 h-8 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-400 flex items-center justify-center border border-rose-800/60 transition-colors cursor-pointer" 
                                  title="Reject Chef"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="px-6 py-4 flex justify-between items-center border-t border-[#e2e8f0] bg-slate-50/30">
              <span className="text-xs text-slate-500 font-bold">
                Showing all {chefs.length} chef application(s)
              </span>
            </div>
          </div>
        </div>

      {/* ONBOARD NEW CHEF MODAL */}
      {isOnboardModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/40 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm"><UserPlus className="w-4 h-4" /></span>
                <h3 className="font-outfit font-extrabold text-slate-800 text-base">Onboard New Professional Chef</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsOnboardModalOpen(false)} 
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm font-bold transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleOnboardSubmit} className="flex flex-col flex-grow overflow-hidden text-left">
              <div className="p-6 space-y-4 overflow-y-auto flex-grow custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Chef Vikram"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Role *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Executive Chef"
                    value={formData.preferred_role}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferred_role: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="e.g. chef.vikram@hospitality.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 9876543210"
                    value={formData.mobile_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, mobile_number: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">City *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Bengaluru"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Country</label>
                  <input 
                    type="text" 
                    placeholder="e.g. India"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Experience *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 8-12 years"
                    value={formData.experience_range}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience_range: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Cuisine Specialties *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Indian, Tandoor, Mughlai"
                    value={formData.cuisine_specialty}
                    onChange={(e) => setFormData(prev => ({ ...prev, cuisine_specialty: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Calendly Link</label>
                  <input 
                    type="text" 
                    placeholder="e.g. https://calendly.com/chef-vikram"
                    value={formData.calendly_link}
                    onChange={(e) => setFormData(prev => ({ ...prev, calendly_link: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Bio / Professional Summary</label>
                <textarea 
                  rows="3"
                  placeholder="Seasoned culinary professional with 10 years of experience in 5-star hotels..."
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669] resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Location Preference</label>
                  <select 
                    value={formData.location_preference}
                    onChange={(e) => setFormData(prev => ({ ...prev, location_preference: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-2.5 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#059669]"
                  >
                    <option value="Both">Both (Domestic & Overseas)</option>
                    <option value="Domestic">Domestic Only</option>
                    <option value="Overseas">Overseas Only</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Availability</label>
                  <select 
                    value={formData.availability}
                    onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-2.5 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#059669]"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract Consultant</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Initial Status</label>
                  <select 
                    value={formData.approval_status}
                    onChange={(e) => setFormData(prev => ({ ...prev, approval_status: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-2.5 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#059669]"
                  >
                    <option value="approved">Approve & Publish Immediately</option>
                    <option value="pending">Keep Pending (Unpublished)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Skills (Comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="Kitchen Management, Menu Engineering"
                    value={formData.skills}
                    onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Languages (Comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="English, Hindi"
                    value={formData.languages}
                    onChange={(e) => setFormData(prev => ({ ...prev, languages: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsOnboardModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-xs font-bold shadow-md shadow-[#059669]/20 transition-all cursor-pointer"
                >
                  {submitting ? 'Onboarding...' : 'Submit & Onboard Chef'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



    </div>
  );
}

// Inline helper for empty check
function empty(val) {
  return !val || val === '' || val === 'null' || val === null;
}

