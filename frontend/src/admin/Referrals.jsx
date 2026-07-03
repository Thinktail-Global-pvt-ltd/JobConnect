import React, { useState } from 'react';
import { Filter, Download, Plus, Check, X, Trash2, MapPin, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

const INITIAL_REFERRALS = [
  {
    id: '1',
    posted_by: { name: 'Sarah Miller', badge: 'Top Contributor', avatar_txt: 'SM', avatar_color: 'bg-emerald-50 text-emerald-600' },
    employer: 'Global Hospitality Group',
    job_type: 'Full-Time',
    job_type_color: 'bg-emerald-50 text-[#065f46] border-emerald-100',
    title: 'Executive Head Chef',
    location: 'London, UK',
    date: 'Oct 24, 2023 10:45 AM',
    status: 'pending'
  },
  {
    id: '2',
    posted_by: { name: 'James Wilson', badge: 'Verified Member', avatar_txt: 'JW', avatar_color: 'bg-blue-50 text-blue-600' },
    employer: 'The Ritz-Carlton',
    job_type: 'Contract',
    job_type_color: 'bg-orange-50 text-orange-600 border-orange-100',
    title: 'Front Desk Manager',
    location: 'Dubai, UAE',
    date: 'Oct 24, 2023 09:12 AM',
    status: 'pending'
  },
  {
    id: '3',
    posted_by: { name: 'Anonymous User', badge: 'New Account', alert: true, avatar_txt: 'AJ', avatar_color: 'bg-rose-50 text-rose-600' },
    employer: 'FastFood Pros',
    job_type: 'Part-Time',
    job_type_color: 'bg-blue-50 text-blue-600 border-blue-100',
    title: 'Quick Service Associate',
    location: 'Multiple (Remote)',
    date: 'Oct 23, 2023 11:58 PM',
    status: 'pending'
  },
  {
    id: '4',
    posted_by: { name: 'Robert King', badge: 'Community Moderator', avatar_txt: 'RK', avatar_color: 'bg-purple-50 text-purple-600' },
    employer: 'Hilton Worldwide',
    job_type: 'Full-Time',
    job_type_color: 'bg-emerald-50 text-[#065f46] border-emerald-100',
    title: 'Sustainability Coordinator',
    location: 'Berlin, Germany',
    date: 'Oct 23, 2023 04:20 PM',
    status: 'pending'
  }
];

export default function Referrals() {
  const [referrals, setReferrals] = useState(INITIAL_REFERRALS);
  const [tab, setTab] = useState('all');

  const handleApprove = (id) => {
    setReferrals(prev => prev.map(ref => ref.id === id ? { ...ref, status: 'approved' } : ref));
  };

  const handleReject = (id) => {
    setReferrals(prev => prev.map(ref => ref.id === id ? { ...ref, status: 'rejected' } : ref));
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this referral?")) {
      setReferrals(prev => prev.filter(ref => ref.id !== id));
    }
  };

  const filteredReferrals = referrals.filter(ref => {
    if (tab === 'flagged') return ref.posted_by.alert === true;
    if (tab === 'archived') return ref.status === 'rejected';
    return true;
  });

  return (
    <div className="space-y-6 relative min-h-[80vh]">
      
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit font-extrabold text-2xl text-slate-800">Referral Moderation</h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Review and manage community-shared career opportunities.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button className="bg-white border border-[#e2e8f0] rounded-xl px-4 py-2 text-xs font-bold text-slate-600 flex items-center gap-1.5 hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Filters
          </button>
          <button className="bg-white border border-[#e2e8f0] rounded-xl px-4 py-2 text-xs font-bold text-slate-600 flex items-center gap-1.5 hover:bg-slate-50 transition-all shadow-sm">
            <Download className="w-3.5 h-3.5 text-slate-400" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#065f46] flex items-center justify-center text-lg">
            📁
          </div>
          <div>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Pending Review</span>
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-1">24</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#065f46] flex items-center justify-center text-lg">
            ✓
          </div>
          <div>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Approved Today</span>
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-1">142</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-lg">
            ⚠️
          </div>
          <div>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Flagged Items</span>
            <span className="font-outfit font-extrabold text-2xl text-rose-600 block mt-1">3</span>
          </div>
        </div>
      </div>

      {/* Main Referral Board Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        
        {/* Filter bar and Showing count */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-6">
            <button onClick={() => setTab('all')} 
                    className={`text-xs font-bold pb-1 transition-all relative ${tab === 'all' ? 'text-[#065f46] border-b-2 border-[#10b981]' : 'text-slate-400 hover:text-slate-700'}`}>
              All Referrals
            </button>
            <button onClick={() => setTab('flagged')} 
                    className={`text-xs font-bold pb-1 transition-all relative ${tab === 'flagged' ? 'text-[#065f46] border-b-2 border-[#10b981]' : 'text-slate-400 hover:text-slate-700'}`}>
              Flagged
            </button>
            <button onClick={() => setTab('archived')} 
                    className={`text-xs font-bold pb-1 transition-all relative ${tab === 'archived' ? 'text-[#065f46] border-b-2 border-[#10b981]' : 'text-slate-400 hover:text-slate-700'}`}>
              Archived
            </button>
          </div>
          <span className="text-xs text-slate-400 font-bold">Showing 1-10 of 24 items</span>
        </div>

        {/* Table list */}
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
              {filteredReferrals.map(ref => (
                <tr key={ref.id} className="hover:bg-slate-50/30 transition-colors">
                  {/* Posted By with Custom Badges */}
                  <td className="py-4.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-outfit text-xs border border-white shadow-sm ${ref.posted_by.avatar_color}`}>
                        {ref.posted_by.avatar_txt}
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-800 text-[13px] block leading-tight">{ref.posted_by.name}</span>
                        {ref.posted_by.alert ? (
                          <span className="text-[10px] text-rose-600 font-bold flex items-center gap-0.5 mt-0.5">
                            <AlertTriangle className="w-3 h-3" />
                            {ref.posted_by.badge}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{ref.posted_by.badge}</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Employer Name */}
                  <td className="py-4.5 px-6 text-slate-700 font-bold">
                    {ref.employer}
                  </td>

                  {/* Job Title & badge */}
                  <td className="py-4.5 px-6">
                    <div className="space-y-1">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider border ${ref.job_type_color}`}>
                        {ref.job_type}
                      </span>
                      <span className="font-extrabold text-slate-800 block text-[13px]">{ref.title}</span>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-4.5 px-6">
                    <div className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ref.location}</span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-4.5 px-6 text-slate-400 font-bold">
                    {ref.date}
                  </td>

                  {/* Actions buttons */}
                  <td className="py-4.5 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {ref.status === 'pending' ? (
                        <>
                          <button onClick={() => handleApprove(ref.id)} className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white flex items-center justify-center border border-emerald-100 hover:border-emerald-500 transition-colors" title="Approve">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleReject(ref.id)} className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white flex items-center justify-center border border-rose-100 hover:border-rose-500 transition-colors" title="Reject">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-extrabold uppercase tracking-wider border ${ref.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                          {ref.status}
                        </span>
                      )}
                      
                      <button onClick={() => handleDelete(ref.id)} className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center border border-[#e2e8f0] hover:border-rose-200 transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer row */}
        <div className="px-6 py-4 flex justify-between items-center border-t border-[#e2e8f0] bg-slate-50/10">
          <div>
            <select className="bg-white border border-[#e2e8f0] rounded-lg px-2 py-1 text-xs font-bold text-slate-500 focus:outline-none">
              <option>10 per page</option>
              <option>20 per page</option>
              <option>50 per page</option>
            </select>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-slate-400"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-7 h-7 rounded-lg bg-[#065f46] text-white flex items-center justify-center text-xs font-bold">1</button>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">2</button>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">3</button>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-slate-400"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

      </div>

      {/* Floating Green Plus Button */}
      <button className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[#059669] hover:bg-[#047857] text-white flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 z-40">
        <Plus className="w-6 h-6" />
      </button>

    </div>
  );
}
