import React, { useState, useEffect, useCallback } from 'react';
import { Filter, Download, Plus, Check, X, Trash2, MapPin, RefreshCw, Pin, Sparkles, CheckCircle2, Clock, FileText } from 'lucide-react';
import { mockApi } from '../services/api';

// Avatar color based on role
const getRoleColor = (role) => {
  switch (role) {
    case 'chef':      return 'bg-orange-50 text-orange-600';
    case 'employer':  return 'bg-blue-50 text-blue-600';
    case 'agency':    return 'bg-purple-50 text-purple-600';
    default:          return 'bg-emerald-50 text-emerald-600'; // jobseeker
  }
};

// Get initials from full name
const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

// Job type badge color
const getJobTypeMeta = (type) => {
  switch ((type || '').toLowerCase()) {
    case 'contract':   return 'bg-orange-50 text-orange-600 border-orange-100';
    case 'part-time':  return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'internship': return 'bg-purple-50 text-purple-600 border-purple-100';
    default:           return 'bg-emerald-50 text-[#065f46] border-emerald-100'; // Full-time
  }
};

export default function Referrals() {
  const [referrals, setReferrals]   = useState([]);
  const [stats, setStats]           = useState({ total: 0, pending: 0, approved: 0, rejected: 0, pinned: 0 });
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab]               = useState('all');

  // Load referrals from real backend
  const loadReferrals = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    const res = await mockApi.getReferrals();
    if (res.success) {
      const allRefs = res.referrals || [];
      setReferrals(allRefs);
      setStats({
        total: res.stats?.total ?? allRefs.length,
        pending: res.stats?.pending ?? allRefs.filter(r => r.status === 'pending').length,
        approved: res.stats?.approved ?? allRefs.filter(r => r.status === 'approved').length,
        rejected: res.stats?.rejected ?? allRefs.filter(r => r.status === 'rejected').length,
        pinned: res.stats?.pinned ?? allRefs.filter(r => Boolean(r.is_pinned)).length,
      });
    }

    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { loadReferrals(); }, [loadReferrals]);

  const handleApprove = async (id) => {
    setReferrals(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    await mockApi.approveReferral(id);
    loadReferrals(true);
  };

  const handleReject = async (id) => {
    setReferrals(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    await mockApi.rejectReferral(id);
    loadReferrals(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this referral?')) {
      setReferrals(prev => prev.filter(r => r.id !== id));
      await mockApi.deleteReferral(id);
      loadReferrals(true);
    }
  };

  const handleTogglePin = async (id) => {
    const ref = referrals.find(r => r.id === id);
    const newPinnedState = !ref?.is_pinned;

    // 1. Optimistic state mutation
    setReferrals(prev => prev.map(r => (r.id === id) ? { ...r, is_pinned: newPinnedState } : r));
    setStats(prev => ({
      ...prev,
      pinned: newPinnedState ? prev.pinned + 1 : Math.max(0, prev.pinned - 1)
    }));

    // 2. Call backend toggle pin API
    try {
      await mockApi.togglePinJob(id);
    } catch (err) {
      console.error('Toggle referral pin failed:', err);
    } finally {
      loadReferrals(true);
    }
  };

  // Client-side tab filter
  const filteredReferrals = referrals.filter(ref => {
    if (tab === 'pending')  return ref.status === 'pending';
    if (tab === 'archived') return ref.status === 'rejected';
    return true; // 'all'
  });

  return (
    <div className="space-y-6 relative min-h-[80vh] text-left">

      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit font-extrabold text-2xl text-slate-800">Referral Moderation</h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Review and manage community-shared career opportunities.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadReferrals(true)}
            className="bg-white border border-[#e2e8f0] rounded-xl px-4 py-2 text-xs font-bold text-slate-600 flex items-center gap-1.5 hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards (4 Columns cleanly wrapped for half-screen) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Pending Review</span>
            <span className="font-outfit font-extrabold text-2xl text-amber-600 block mt-0.5">
              {loading ? '—' : stats.pending}
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Approved Total</span>
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-0.5">
              {loading ? '—' : stats.approved}
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Referrals</span>
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-0.5">
              {loading ? '—' : stats.total}
            </span>
          </div>
        </div>

        {/* Card 4 - Featured & Pinned */}
        <div className="bg-[#065f46] p-5 rounded-2xl shadow-sm flex items-center gap-4 text-white">
          <div className="w-11 h-11 rounded-xl bg-emerald-800/60 text-emerald-200 flex items-center justify-center shrink-0">
            <Pin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-extrabold text-emerald-200 uppercase tracking-widest block">Featured & Pinned</span>
            <span className="font-outfit font-extrabold text-2xl block mt-0.5">
              {loading ? '—' : (stats.pinned || referrals.filter(r => r.is_pinned).length)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Referral Board Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">

        {/* Tab bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 pt-5 pb-0 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-6">
            {[
              { key: 'all',      label: `All Referrals (${referrals.length})` },
              { key: 'pending',  label: `Pending (${referrals.filter(r => r.status === 'pending').length})` },
              { key: 'archived', label: `Archived (${referrals.filter(r => r.status === 'rejected').length})` },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                      className={`text-xs font-bold pb-3 transition-all relative cursor-pointer ${tab === t.key ? 'text-[#065f46] border-b-2 border-[#10b981]' : 'text-slate-400 hover:text-slate-700'}`}>
                {t.label}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-400 font-bold pb-4">
            Showing {filteredReferrals.length} of {stats.total} items
          </span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
            <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold">Loading referrals from database...</span>
          </div>
        ) : filteredReferrals.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <p className="text-2xl mb-2">📭</p>
            <p className="text-sm font-bold">No referrals found</p>
            <p className="text-xs mt-1">Post a job with <code className="bg-slate-100 px-1 rounded">is_referral: true</code> via the API to see it here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-[#e2e8f0] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Posted By</th>
                  <th className="py-4 px-6">Employer Name</th>
                  <th className="py-4 px-6">Job Title</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Submitted Date</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] text-slate-700 text-xs font-semibold">
                {filteredReferrals.map(ref => {
                  const creatorName = ref.creator?.name || ref.creator?.full_name || 'Chef / Jobseeker';
                  const role = ref.submitted_by_role || 'jobseeker';
                  const initials = getInitials(creatorName);
                  const avatarColor = getRoleColor(role);
                  const jobTypeMeta = getJobTypeMeta(ref.job_type);

                  return (
                    <tr key={ref.id} className={`hover:bg-slate-50/50 transition-colors ${ref.is_pinned ? 'bg-purple-50/40' : ''}`}>

                      {/* Posted By */}
                      <td className="py-4.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-outfit text-xs border border-white shadow-sm ${avatarColor}`}>
                            {initials}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-800 text-[13px] block leading-tight">{creatorName}</span>
                            <span className="text-[10px] font-bold block mt-0.5 capitalize" style={{ color: role === 'chef' ? '#ea580c' : role === 'employer' ? '#2563eb' : '#059669' }}>
                              {role}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Employer / Company */}
                      <td className="py-4.5 px-6 text-slate-700 font-bold">{ref.company || 'Hospitality Referral'}</td>

                      {/* Job Title + Pin Badge + type badge */}
                      <td className="py-4.5 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider border ${jobTypeMeta}`}>
                              {ref.job_type || 'Full-time'}
                            </span>
                            {ref.is_pinned && (
                              <span className="text-rose-500 text-xs" title="Pinned to top feed priority">📌 Pinned</span>
                            )}
                          </div>
                          <span className="font-extrabold text-slate-800 block text-[13px]">{ref.title}</span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4.5 px-6">
                        <div className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{ref.location || '—'}</span>
                        </div>
                      </td>

                      {/* Submitted Date */}
                      <td className="py-4.5 px-6 text-slate-400 font-bold">
                        {new Date(ref.created_at).toLocaleString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </td>

                      {/* Actions (Approve, Reject, Delete, and PIN) */}
                      <td className="py-4.5 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {ref.status === 'pending' ? (
                            <>
                              <button onClick={() => handleApprove(ref.id)}
                                      className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white flex items-center justify-center border border-emerald-100 hover:border-emerald-500 transition-colors cursor-pointer"
                                      title="Approve Referral">
                                <Check className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleReject(ref.id)}
                                      className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white flex items-center justify-center border border-rose-100 hover:border-rose-500 transition-colors cursor-pointer"
                                      title="Reject Referral">
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-extrabold uppercase tracking-wider border ${ref.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                              {ref.status}
                            </span>
                          )}

                          {/* Toggle Pin Button */}
                          <button 
                            onClick={() => handleTogglePin(ref.id)} 
                            className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${ref.is_pinned ? 'bg-purple-600 text-white border-purple-600 shadow-xs' : 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-600 hover:text-white'}`} 
                            title={ref.is_pinned ? "Unpin Referral" : "Pin Referral to Top Feed Priority"}
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>

                          <button onClick={() => handleDelete(ref.id)}
                                  className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center border border-[#e2e8f0] hover:border-rose-200 transition-colors cursor-pointer"
                                  title="Delete Referral">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer info */}
        <div className="px-6 py-4 flex justify-between items-center border-t border-[#e2e8f0] bg-slate-50/30">
          <span className="text-xs text-slate-500 font-bold">
            Showing all {filteredReferrals.length} Referral Entries
          </span>
        </div>

      </div>

    </div>
  );
}
