import React, { useState, useEffect } from 'react';
import { Filter, Eye, EyeOff, Check, X, UserPlus, RefreshCw, Phone, Mail, MapPin, Briefcase, Calendar, FileText } from 'lucide-react';
import { mockApi } from '../services/api';

export default function Chefs() {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedChef, setSelectedChef] = useState(null);

  const loadChefs = async () => {
    setLoading(true);
    try {
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
    }
  };

  const handleUnpublish = async (id) => {
    setChefs(prev => prev.map(c => (c.id === id || c.user_id === id) ? { ...c, status: 'pending', approval_status: 'pending' } : c));
    try {
      await mockApi.unpublishChef(id);
    } catch (err) {
      console.error('Unpublish failed:', err);
    }
  };

  const handleReject = async (id) => {
    setChefs(prev => prev.map(c => (c.id === id || c.user_id === id) ? { ...c, status: 'rejected', approval_status: 'rejected' } : c));
    try {
      await mockApi.rejectChef(id);
    } catch (err) {
      console.error('Reject failed:', err);
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
      
      {/* Header bar section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-outfit font-extrabold text-2xl text-slate-800">ChefConnect Moderation</h2>
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
              className="bg-slate-50 border border-[#e2e8f0] text-slate-700 text-xs font-bold py-2.5 pl-4 pr-8 rounded-xl focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none"
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
            className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-[#e2e8f0] rounded-xl text-slate-600 transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <a 
            href="/chef/onboarding" 
            target="_blank" 
            rel="noreferrer"
            className="bg-[#059669] hover:bg-[#047857] text-white rounded-xl px-4 py-2.5 text-xs font-bold shadow-sm shadow-[#059669]/10 transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            + Onboard New Chef
          </a>
        </div>
      </div>

      {/* KPI Cards (2 Columns on Half-Screen, 4 on Full-Screen) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[105px]">
          <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Pending / Unpublished</div>
          <div className="mt-2">
            <span className="font-outfit font-extrabold text-2xl text-amber-600 block">{pendingCount}</span>
            <span className="text-[10px] font-bold text-amber-500 block mt-0.5">Hidden from Employer API</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[105px]">
          <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Calendly Sync</div>
          <div className="mt-2">
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block">{calendlyPercentage}%</span>
            <span className="text-[10px] font-bold text-slate-400 block mt-0.5">Active synchronization</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[105px]">
          <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Active Published Chefs</div>
          <div className="mt-2">
            <span className="font-outfit font-extrabold text-2xl text-emerald-600 block">{approvedCount}</span>
            <span className="text-[10px] font-bold text-emerald-600 block mt-0.5">Visible on Employer API</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[105px]">
          <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Applications</div>
          <div className="mt-2">
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block">{totalCount}</span>
            <span className="text-[10px] font-bold text-slate-400 block mt-0.5">Loaded at once</span>
          </div>
        </div>

      </div>

      {/* Chefs List Table Card */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        
        {loading ? (
          <p className="text-center text-slate-400 text-xs font-medium py-16">Loading chef profiles...</p>
        ) : chefs.length === 0 ? (
          <p className="text-center text-slate-400 text-sm font-medium py-16">No chef profiles found for this filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-[#e2e8f0] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Chef Name</th>
                  <th className="py-4 px-6">Experience</th>
                  <th className="py-4 px-6">Cuisine Specialties</th>
                  <th className="py-4 px-6 text-center">Calendly</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] text-xs font-semibold">
                {chefs.map((chef) => {
                  const name = chef.full_name || chef.name || 'Unnamed Chef';
                  const email = chef.email || '';
                  const experience = chef.experience_range || chef.experience || '0 Years';
                  const specialties = chef.cuisine_specialty || chef.specialties || 'Multi-Cuisine';
                  const status = chef.approval_status || chef.status || 'pending';
                  const hasCalendly = chef.calendly || !empty(chef.calendly_link);
                  
                  // Extract initials for avatar
                  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CH';

                  return (
                    <tr key={chef.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                            {initials}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-800 text-[13px] block leading-tight">{name}</span>
                            <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">{email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Experience */}
                      <td className="py-4 px-6 text-slate-600 font-bold">
                        {experience}
                      </td>

                      {/* Specialties */}
                      <td className="py-4 px-6">
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-slate-200 inline-block">
                          {specialties}
                        </span>
                      </td>

                      {/* Calendly synced badge */}
                      <td className="py-4 px-6 text-center">
                        {hasCalendly ? (
                          <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                            ✓ Yes
                          </span>
                        ) : (
                          <span className="bg-slate-50 text-slate-400 border border-slate-100 text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                            ✕ No
                          </span>
                        )}
                      </td>

                      {/* Status badge */}
                      <td className="py-4 px-6">
                        {status === 'approved' ? (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-[#d1fae5] text-[#065f46]">
                            Approved / Published
                          </span>
                        ) : status === 'rejected' || status === 'suspended' ? (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-[#fee2e2] text-[#991b1b]">
                            Rejected
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-[#fff7ed] text-[#c2410c]">
                            Unpublished / Pending
                          </span>
                        )}
                      </td>

                      {/* Actions: Explicit Publish / Unpublish Buttons */}
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setSelectedChef(chef)}
                            className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center border border-[#e2e8f0] transition-colors" 
                            title="View Full Profile Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {status === 'approved' ? (
                            <button 
                              onClick={() => handleUnpublish(chef.id)} 
                              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-extrabold rounded-lg transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                              title="Unpublish Chef from Employer API"
                            >
                              <EyeOff className="w-3 h-3" />
                              <span>Unpublish</span>
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleApprove(chef.id)} 
                              className="px-3 py-1 bg-[#059669] hover:bg-[#047857] text-white text-[10px] font-extrabold rounded-lg transition-all shadow-xs flex items-center gap-1 cursor-pointer font-bold"
                              title="Publish & Approve Chef for Employer API"
                            >
                              <Check className="w-3 h-3" />
                              <span>Publish</span>
                            </button>
                          )}

                          {status !== 'rejected' && status !== 'suspended' && (
                            <button 
                              onClick={() => handleReject(chef.id)} 
                              className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white flex items-center justify-center border border-rose-100 transition-colors" 
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

        {/* Footer info (ALL LOADED AT ONCE - NO PAGINATION) */}
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

      {/* Chef Details View Modal */}
      {selectedChef && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-100 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-outfit font-extrabold text-lg text-slate-800">
                  {selectedChef.full_name || selectedChef.name || 'Chef Profile'}
                </h3>
                <p className="text-xs font-semibold text-slate-400">Onboarded Chef Profile Details</p>
              </div>
              <button 
                onClick={() => setSelectedChef(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 font-medium">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Email</span>
                  <span className="font-bold text-slate-700">{selectedChef.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Phone</span>
                  <span className="font-bold text-slate-700">{selectedChef.mobile_number || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">City</span>
                  <span className="font-bold text-slate-700">{selectedChef.city || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Experience</span>
                  <span className="font-bold text-slate-700">{selectedChef.experience_range || selectedChef.experience || '0 Years'}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Cuisine Specialties</span>
                <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-semibold text-slate-700">
                  {selectedChef.cuisine_specialty || selectedChef.specialties || 'Multi-Cuisine'}
                </p>
              </div>

              {selectedChef.bio && (
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Bio / Profile Description</span>
                  <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed text-slate-700">
                    {selectedChef.bio}
                  </p>
                </div>
              )}

              {selectedChef.calendly_link && (
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Calendly Scheduling Link</span>
                  <a 
                    href={selectedChef.calendly_link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-emerald-700 font-bold underline break-all block bg-emerald-50 p-2.5 rounded-xl border border-emerald-100"
                  >
                    {selectedChef.calendly_link}
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
