import React, { useState, useEffect } from 'react';
import { Filter, Eye, Check, X, UserPlus, RefreshCw, Phone, Mail, MapPin, Briefcase, Calendar, FileText } from 'lucide-react';
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
    try {
      await mockApi.approveChef(id);
      loadChefs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await mockApi.rejectChef(id);
      loadChefs();
    } catch (err) {
      console.error(err);
    }
  };

  // Dynamic KPI Stats calculation
  const totalCount = chefs.length;
  const pendingCount = chefs.filter(c => c.status === 'pending' || c.approval_status === 'pending').length;
  const approvedCount = chefs.filter(c => c.status === 'approved' || c.approval_status === 'approved' || !c.approval_status).length;
  const calendlyCount = chefs.filter(c => c.calendly_link || c.calendly).length;
  const calendlyPercentage = totalCount > 0 ? Math.round((calendlyCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      
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
          <p className="text-xs font-semibold text-slate-400 mt-1">Review and manage professional chef applications for the platform.</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Filter Selector */}
          <div className="relative">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-[#e2e8f0] text-slate-700 text-xs font-bold py-2.5 pl-4 pr-8 rounded-xl focus:outline-none focus:border-brand-500 cursor-pointer appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending Only</option>
              <option value="approved">Approved Only</option>
              <option value="rejected">Rejected Only</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
          </div>

          <button 
            onClick={loadChefs}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-[#e2e8f0] rounded-xl text-slate-600 transition-colors"
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

      {/* KPI Cards (4 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[105px] text-left">
          <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Pending Review</div>
          <div className="mt-2">
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block">{pendingCount}</span>
            <span className="text-[10px] font-bold text-amber-500 block mt-0.5">Awaiting admin review</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[105px] text-left">
          <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Calendly Sync</div>
          <div className="mt-2">
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block">{calendlyPercentage}%</span>
            <span className="text-[10px] font-bold text-slate-400 block mt-0.5">Active synchronization</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[105px] text-left">
          <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Active Chefs</div>
          <div className="mt-2">
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block">{approvedCount}</span>
            <span className="text-[10px] font-bold text-slate-400 block mt-0.5">Global hospitality pool</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[105px] text-left">
          <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Applications</div>
          <div className="mt-2">
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block">{totalCount}</span>
            <span className="text-[10px] font-bold text-slate-400 block mt-0.5">Loaded at once</span>
          </div>
        </div>

      </div>

      {/* Chefs Submissions Table Card */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-semibold">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-500" />
            Loading dynamic chef applications...
          </div>
        ) : chefs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <div className="text-3xl mb-2">👨‍🍳</div>
            <div className="text-sm font-bold text-slate-600">No Chef Applications Found</div>
            <div className="text-xs mt-1">There are no chefs registered in the database matching your criteria.</div>
          </div>
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
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] text-slate-700 text-xs font-semibold">
                {chefs.map((chef, idx) => {
                  const name = chef.full_name || chef.name || 'Unnamed Chef';
                  const email = chef.email || 'No email';
                  const exp = chef.experience_range || chef.experience || 'N/A';
                  const cuisine = chef.cuisine_specialty || chef.specialties || 'Multi-Cuisine';
                  const hasCalendly = Boolean(chef.calendly_link || chef.calendly);
                  const status = chef.approval_status || chef.status || 'approved';
                  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

                  const avatarColors = [
                    'bg-emerald-50 text-emerald-600 border-emerald-200',
                    'bg-teal-50 text-teal-600 border-teal-200',
                    'bg-blue-50 text-blue-600 border-blue-200',
                    'bg-purple-50 text-purple-600 border-purple-200',
                    'bg-rose-50 text-rose-600 border-rose-200'
                  ];
                  const colorClass = avatarColors[idx % avatarColors.length];

                  return (
                    <tr key={chef.id || idx} className="hover:bg-slate-50/50 transition-colors">
                      {/* Name and avatar info */}
                      <td className="py-4 px-6 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-outfit text-xs border shadow-sm ${colorClass}`}>
                          {initials}
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-800 text-[13px] block leading-tight">{name}</span>
                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{email}</span>
                        </div>
                      </td>

                      {/* Experience */}
                      <td className="py-4 px-6 font-semibold text-slate-600">
                        {exp}
                      </td>

                      {/* Cuisine Specialties */}
                      <td className="py-4 px-6 text-slate-600 font-bold">
                        <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                          {cuisine}
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
                            Approved
                          </span>
                        ) : status === 'rejected' || status === 'suspended' ? (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-[#fee2e2] text-[#991b1b]">
                            Rejected
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-[#fff7ed] text-[#c2410c]">
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Actions buttons */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedChef(chef)}
                            className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center border border-[#e2e8f0] transition-colors" 
                            title="View Full Profile Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {status !== 'approved' && (
                            <button 
                              onClick={() => handleApprove(chef.id)} 
                              className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white flex items-center justify-center border border-emerald-100 transition-colors" 
                              title="Approve Chef"
                            >
                              <Check className="w-4 h-4" />
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
                <span className="text-xs text-slate-400 font-medium">
                  {selectedChef.email || 'No Email Linked'}
                </span>
              </div>
              <button 
                onClick={() => setSelectedChef(null)} 
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-medium text-slate-600">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Mobile</span>
                  <span className="font-bold text-slate-700">{selectedChef.mobile_number || 'N/A'}</span>
                </div>
                <div>
                  <span class="text-slate-400 block text-[10px] uppercase font-bold">City</span>
                  <span className="font-bold text-slate-700">{selectedChef.city || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Experience</span>
                  <span className="font-bold text-slate-700">{selectedChef.experience_range || selectedChef.experience || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Cuisine</span>
                  <span className="font-bold text-slate-700">{selectedChef.cuisine_specialty || selectedChef.specialties || 'Multi-Cuisine'}</span>
                </div>
              </div>

              {selectedChef.bio && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Bio / Profile Summary</span>
                  <p className="bg-slate-50 p-3 rounded-xl text-slate-700 leading-relaxed">{selectedChef.bio}</p>
                </div>
              )}

              {(selectedChef.calendly_link || selectedChef.calendly) && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Calendly Scheduling Link</span>
                  <a href={selectedChef.calendly_link || selectedChef.calendly} target="_blank" rel="noreferrer" class="text-blue-600 underline font-bold truncate block">
                    {selectedChef.calendly_link || selectedChef.calendly}
                  </a>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => setSelectedChef(null)} 
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
