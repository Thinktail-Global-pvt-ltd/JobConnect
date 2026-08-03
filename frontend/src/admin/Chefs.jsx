import React, { useState, useEffect } from 'react';
import { Filter, Eye, EyeOff, Check, X, UserPlus, RefreshCw, Smartphone, List, Signal, Wifi, Battery, MapPin, Building2, Calendar, Star, ArrowUpRight, Award, CheckCircle2 } from 'lucide-react';
import { mockApi } from '../services/api';

export default function Chefs() {
  const [viewMode, setViewMode] = useState('phone'); // 'phone' or 'table'
  const [chefs, setChefs] = useState([]);
  const [publishedChefs, setPublishedChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
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
      const data = await mockApi.getEmployerChefs();
      if (data && data.success && Array.isArray(data.chefs)) {
        setPublishedChefs(data.chefs);
      }
    } catch (err) {
      console.error('Failed to load employer published chefs feed:', err);
    }
  };

  const loadChefs = async () => {
    setLoading(true);
    try {
      await fetchPublishedEmployerChefs();
      const data = await mockApi.getChefs(statusFilter);
      if (data && Array.isArray(data.chefs)) {
        setChefs(data.chefs);
      } else {
        setChefs([]);
      }
    } catch (err) {
      console.error('Failed to load chefs:', err);
      setChefs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChefs();
  }, [statusFilter]);

  const handleApprove = async (id) => {
    setChefs(prev => prev.map(c => (c.id === id || c.user_id === id) ? { ...c, status: 'approved', approval_status: 'approved' } : c));
    try {
      await mockApi.approveChef(id);
    } catch (err) {
      console.error('Approve failed:', err);
    } finally {
      await loadChefs();
    }
  };

  const handleUnpublish = async (id) => {
    // Optimistic UI: instantly flip status to pending and show Publish button
    setChefs(prev => prev.map(c => (c.id === id || c.user_id === id) ? { ...c, status: 'pending', approval_status: 'pending' } : c));
    try {
      await mockApi.unpublishChef(id);
    } catch (err) {
      console.error('Unpublish failed:', err);
    } finally {
      // Refresh both admin table and employer preview
      await loadChefs();
    }
  };

  const handleReject = async (id) => {
    setChefs(prev => prev.map(c => (c.id === id || c.user_id === id) ? { ...c, status: 'rejected', approval_status: 'rejected' } : c));
    try {
      await mockApi.rejectChef(id);
    } catch (err) {
      console.error('Reject failed:', err);
    } finally {
      await loadChefs();
    }
  };

  const handleOnboardSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.city || !formData.cuisine_specialty) {
      alert("Please fill in all required fields: Full Name, City, and Cuisine Specialties.");
      return;
    }
    setSubmitting(true);

    const tempNewChef = {
      id: Date.now(),
      user_id: Date.now(),
      full_name: formData.full_name,
      name: formData.full_name,
      email: formData.email || `chef.${Date.now()}@hospitality.com`,
      mobile_number: formData.mobile_number || '9876543210',
      city: formData.city,
      experience_range: formData.experience_range,
      cuisine_specialty: formData.cuisine_specialty,
      specialties: formData.cuisine_specialty,
      bio: formData.bio,
      calendly_link: formData.calendly_link,
      calendly: Boolean(formData.calendly_link),
      approval_status: formData.approval_status || 'approved',
      status: formData.approval_status || 'approved',
    };

    // Optimistic UI state update
    setChefs(prev => [tempNewChef, ...prev.filter(c => c.id !== tempNewChef.id)]);
    if (tempNewChef.approval_status === 'approved') {
      setPublishedChefs(prev => [tempNewChef, ...prev.filter(c => c.id !== tempNewChef.id)]);
    }

    try {
      const res = await mockApi.createChef(formData);
      if (res && res.success === false) {
        alert("Onboarding failed: " + (res.message || "Unknown error"));
      } else {
        alert("Chef Onboarded Successfully!");
        setIsOnboardModalOpen(false);
      }
    } catch (err) {
      console.error('Chef onboarding failed:', err);
      alert("Error onboarding chef: " + err.message);
    } finally {
      setSubmitting(false);
      await loadChefs();
    }
  };

  // Dynamic KPI Stats calculation
  const totalCount = chefs.length;
  const pendingCount = chefs.filter(c => c.status === 'pending' || c.approval_status === 'pending').length;
  const approvedCount = chefs.filter(c => c.status === 'approved' || c.approval_status === 'approved').length;
  const calendlyCount = chefs.filter(c => c.calendly_link || c.calendly).length;
  const calendlyPercentage = totalCount > 0 ? Math.round((calendlyCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 text-left">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm">
        <div>
          <h2 className="font-outfit font-extrabold text-2xl text-slate-800">ChefConnect Moderation</h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Review, publish or unpublish professional chef profiles for candidate & employer discovery.</p>
        </div>
      </div>

      {/* ADMIN CHEF MODERATION TABLE VIEW DIRECTLY */}
      <div className="space-y-6">
          
          {/* Header Bar Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-outfit font-extrabold text-2xl text-slate-800">Chef Moderation Directory</h2>
                <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  OPERATIONAL STATUS
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-400 mt-1">Review, publish or unpublish professional chef profiles for candidate & employer discovery.</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Status Filter Selector */}
              <div className="relative">
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#1E293B] border border-slate-700/60 text-white text-xs font-extrabold py-2.5 pl-4 pr-8 rounded-xl focus:outline-none focus:border-[#059669] cursor-pointer appearance-none"
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
                className="p-2.5 bg-[#1E293B] hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 transition-colors cursor-pointer"
                title="Refresh Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* KPI Cards (2 Columns on Half-Screen, 4 on Full-Screen) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-[#0B1120] p-5 rounded-3xl border border-[#1E293B] shadow-2xl flex flex-col justify-between min-h-[105px]">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Pending / Unpublished</div>
              <div className="mt-2">
                <span className="font-outfit font-black text-3xl text-amber-400 block">{pendingCount}</span>
                <span className="text-[10px] font-extrabold text-amber-500/90 block mt-0.5">Hidden from Employer API</span>
              </div>
            </div>

            <div className="bg-[#0B1120] p-5 rounded-3xl border border-[#1E293B] shadow-2xl flex flex-col justify-between min-h-[105px]">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Calendly Sync</div>
              <div className="mt-2">
                <span className="font-outfit font-black text-3xl text-white block">{calendlyPercentage}%</span>
                <span className="text-[10px] font-extrabold text-slate-400 block mt-0.5">Active synchronization</span>
              </div>
            </div>

            <div className="bg-[#0B1120] p-5 rounded-3xl border border-[#1E293B] shadow-2xl flex flex-col justify-between min-h-[105px]">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Active Published Chefs</div>
              <div className="mt-2">
                <span className="font-outfit font-black text-3xl text-emerald-400 block">{approvedCount}</span>
                <span className="text-[10px] font-extrabold text-emerald-400 block mt-0.5">Visible on Employer API</span>
              </div>
            </div>

            <div className="bg-[#0B1120] p-5 rounded-3xl border border-[#1E293B] shadow-2xl flex flex-col justify-between min-h-[105px]">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Total Applications</div>
              <div className="mt-2">
                <span className="font-outfit font-black text-3xl text-white block">{totalCount}</span>
                <span className="text-[10px] font-extrabold text-slate-400 block mt-0.5">Loaded at once</span>
              </div>
            </div>
          </div>

          {/* Chefs List Table Card */}
          <div className="bg-[#0B1120] rounded-3xl border border-[#1E293B] shadow-2xl overflow-hidden">
            {loading ? (
              <p className="text-center text-slate-400 text-xs font-medium py-16">Loading chef profiles...</p>
            ) : chefs.length === 0 ? (
              <p className="text-center text-slate-400 text-sm font-medium py-16">No chef profiles found for this filter.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#0F172A] border-b border-[#1E293B] text-[11px] font-black text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-6">Chef Name</th>
                      <th className="py-4 px-6">Experience</th>
                      <th className="py-4 px-6">Cuisine Specialties</th>
                      <th className="py-4 px-6 text-center">Calendly</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B]/60 text-slate-200 text-xs font-semibold">
                    {chefs.map((chef) => {
                      const name = chef.full_name || chef.name || 'Unnamed Chef';
                      const email = chef.email || '';
                      const experience = chef.experience_range || chef.experience || '0 Years';
                      const specialties = chef.cuisine_specialty || chef.specialties || 'Multi-Cuisine';
                      const status = chef.approval_status || chef.status || 'pending';
                      const hasCalendly = chef.calendly || Boolean(chef.calendly_link);
                      const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CH';

                      return (
                        <tr key={chef.id} className="hover:bg-[#1E293B]/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                                {(chef.profile_photo_path || chef.profile_photo || chef.photo_url || chef.avatar || chef.avatar_url) ? (
                                  <img 
                                    src={chef.profile_photo_path || chef.profile_photo || chef.photo_url || chef.avatar || chef.avatar_url} 
                                    alt={name} 
                                    className="w-full h-full object-cover rounded-full"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                  />
                                ) : (
                                  initials
                                )}
                              </div>
                              <div>
                                <span className="font-extrabold text-white text-[13px] block leading-tight">{name}</span>
                                <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">{email}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6 text-slate-300 font-extrabold">
                            {experience}
                          </td>

                          <td className="py-4 px-6">
                            <span className="bg-[#1E293B] text-slate-200 text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-slate-700 inline-block">
                              {specialties}
                            </span>
                          </td>

                          <td className="py-4 px-6 text-center">
                            {hasCalendly ? (
                              <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-[9px] font-black px-2.5 py-0.5 rounded-full">
                                ✓ Yes
                              </span>
                            ) : (
                              <span className="bg-slate-900 text-slate-400 border border-slate-800 text-[9px] font-black px-2.5 py-0.5 rounded-full">
                                ✕ No
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-6">
                            {status === 'approved' ? (
                              <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                                Approved / Published
                              </span>
                            ) : status === 'rejected' || status === 'suspended' ? (
                              <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-950/80 text-rose-400 border border-rose-800/60">
                                Rejected
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-950/80 text-amber-400 border border-amber-800/60">
                                Unpublished / Pending
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => setSelectedChef(chef)}
                                className="w-8 h-8 rounded-lg bg-[#1E293B] hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition-colors cursor-pointer" 
                                title="View Full Profile Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                All Chefs Loaded At Once
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
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">👨‍🍳</span>
                <h3 className="font-outfit font-extrabold text-slate-800 text-base">Onboard New Professional Chef</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsOnboardModalOpen(false)} 
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm font-bold transition-all"
              >
                ✕
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

      {/* CHEF DETAILS MODAL */}
      {selectedChef && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-100 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800/80 flex items-center justify-center font-black text-xl shadow-sm shrink-0 overflow-hidden">
                  {(selectedChef.profile_photo_path || selectedChef.profile_photo || selectedChef.photo_url || selectedChef.avatar || selectedChef.avatar_url) ? (
                    <img 
                      src={selectedChef.profile_photo_path || selectedChef.profile_photo || selectedChef.photo_url || selectedChef.avatar || selectedChef.avatar_url} 
                      alt={selectedChef.full_name || selectedChef.name} 
                      className="w-full h-full object-cover rounded-2xl"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    (selectedChef.full_name || selectedChef.name || 'C')[0].toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="font-outfit font-black text-lg text-slate-800 leading-tight">
                    {selectedChef.full_name || selectedChef.name || 'Chef Profile'}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    {selectedChef.preferred_role || 'Executive Chef'} • {selectedChef.city || 'Location N/A'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedChef(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold text-xs shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 font-medium max-h-[75vh] overflow-y-auto pr-1">
              
              {/* Core User Details Grid */}
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">User Account Information</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Email</span>
                    <span className="font-bold text-slate-700 break-all">{selectedChef.email || 'Not Provided'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                    <span className="font-bold text-slate-700">{selectedChef.mobile_number || selectedChef.phone || 'Not Provided'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Location (City, Country)</span>
                    <span className="font-bold text-slate-700">{[selectedChef.city, selectedChef.country].filter(Boolean).join(', ') || 'Not Specified'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Experience</span>
                    <span className="font-bold text-slate-700">{selectedChef.experience_range || selectedChef.experience || '0 Years'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Gender</span>
                    <span className="font-bold text-slate-700 capitalize">{selectedChef.gender || 'Not Specified'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Current Employer</span>
                    <span className="font-bold text-slate-700">{selectedChef.current_employer || 'Not Provided'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Availability Status</span>
                    <span className="font-bold text-emerald-700">{selectedChef.availability_status || (selectedChef.is_available ? 'Available' : 'Not Available')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Spoken Languages</span>
                    <span className="font-bold text-slate-700">{selectedChef.selected_language || 'Not Specified'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Approval Status</span>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide ${
                      selectedChef.approval_status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {selectedChef.approval_status || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chef Profile Details */}
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Cuisine Specialties (Chef Profile)</span>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 font-semibold text-slate-700">
                  {selectedChef.cuisine_specialty || selectedChef.specialties || 'Multi-Cuisine'}
                </div>
              </div>

              {/* Skills */}
              {selectedChef.skills && (
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Skills & Key Competencies (User Account)</span>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 font-semibold text-slate-700 flex flex-wrap gap-1.5">
                    {Array.isArray(selectedChef.skills) ? (
                      selectedChef.skills.map((sk, idx) => (
                        <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-0.5 rounded-md text-[11px] font-bold">
                          {sk}
                        </span>
                      ))
                    ) : (
                      <span>{selectedChef.skills}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Bio */}
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Bio / Profile Description (Chef Profile)</span>
                <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed text-slate-700">
                  {selectedChef.bio || 'No bio description provided.'}
                </p>
              </div>

              {/* Calendly */}
              {selectedChef.calendly_link && (
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Calendly Scheduling Link</span>
                  <a 
                    href={selectedChef.calendly_link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-emerald-700 font-bold underline break-all block bg-emerald-50 p-2.5 rounded-xl border border-emerald-100"
                  >
                    🔗 {selectedChef.calendly_link}
                  </a>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button 
                onClick={() => setSelectedChef(null)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
              >
                Close
              </button>

              {selectedChef.approval_status === 'approved' ? (
                <button 
                  onClick={() => {
                    handleUnpublish(selectedChef.id || selectedChef.user_id);
                    setSelectedChef(null);
                  }}
                  className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-all"
                >
                  Unpublish Chef
                </button>
              ) : (
                <button 
                  onClick={() => {
                    handleApprove(selectedChef.id || selectedChef.user_id);
                    setSelectedChef(null);
                  }}
                  className="px-4 py-2 bg-[#059669] text-white rounded-xl text-xs font-bold hover:bg-[#047857] transition-all"
                >
                  Publish & Approve
                </button>
              )}
            </div>
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
