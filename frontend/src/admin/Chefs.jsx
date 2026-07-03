import React, { useState } from 'react';
import { Filter, Eye, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';

const INITIAL_CHEFS = [
  {
    id: '1',
    name: 'Amit Sharma',
    email: 'amit.s@chefconnect.com',
    experience: '10 Years',
    specialties: 'Indian & Chinese',
    calendly: true,
    status: 'pending',
    avatar_color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
  },
  {
    id: '2',
    name: 'Lucia Martinez',
    email: 'lucia.m@cuisine.net',
    experience: '15 Years',
    specialties: 'Spanish & Mediterranean',
    calendly: true,
    status: 'approved',
    avatar_color: 'bg-teal-50 text-teal-600 border-teal-200'
  },
  {
    id: '3',
    name: 'James Kang',
    email: 'jamesk@fusion.com',
    experience: '8 Years',
    specialties: 'Korean & Japanese Fusion',
    calendly: false,
    status: 'pending',
    avatar_color: 'bg-blue-50 text-blue-600 border-blue-200'
  },
  {
    id: '4',
    name: 'Sarah Bloom',
    email: 's.bloom@pastry.com',
    experience: '12 Years',
    specialties: 'Pastry & French Cuisine',
    calendly: true,
    status: 'suspended',
    avatar_color: 'bg-rose-50 text-rose-600 border-rose-200'
  }
];

export default function Chefs() {
  const [chefs, setChefs] = useState(INITIAL_CHEFS);

  const handleApprove = (id) => {
    setChefs(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c));
  };

  const handleReject = (id) => {
    setChefs(prev => prev.map(c => c.id === id ? { ...c, status: 'suspended' } : c));
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit font-extrabold text-2xl text-slate-800">ChefConnect Moderation</h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Review and manage professional chef applications for the platform.</p>
        </div>

        <div className="flex items-center gap-3.5 flex-wrap">
          <span className="bg-[#f8f9fc] border border-[#e2e8f0] rounded-full px-3 py-1.5 text-[9px] font-extrabold text-[#059669] flex items-center gap-1.5 shadow-sm leading-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
            OPERATIONAL STATUS
          </span>

          <button className="bg-white border border-[#e2e8f0] rounded-xl px-4 py-2 text-xs font-bold text-slate-600 flex items-center gap-1.5 hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Filters
          </button>
          
          <button className="bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-5 py-2.5 text-xs font-bold shadow-sm shadow-[#059669]/10 transition-all">
            + Onboard New Chef
          </button>
        </div>
      </div>

      {/* KPI Cards (4 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[105px] text-left">
          <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Pending Review</div>
          <div className="mt-2">
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block">24</span>
            <span className="text-[10px] font-bold text-[#059669] block mt-0.5">↗ +12% from last week</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[105px] text-left">
          <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Calendly Sync</div>
          <div className="mt-2">
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block">88%</span>
            <span className="text-[10px] font-bold text-slate-400 block mt-0.5">Active synchronization</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[105px] text-left">
          <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Active Chefs</div>
          <div className="mt-2">
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block">1,240</span>
            <span className="text-[10px] font-bold text-slate-400 block mt-0.5">Global hospitality pool</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[105px] text-left">
          <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Moderation Rate</div>
          <div className="mt-2">
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block">4.2h</span>
            <span className="text-[10px] font-bold text-slate-400 block mt-0.5">Average response time</span>
          </div>
        </div>

      </div>

      {/* Chefs Submissions Table Card */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        
        {/* Table list */}
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
              {chefs.map(chef => (
                <tr key={chef.id} className="hover:bg-slate-50/30 transition-colors">
                  {/* Name and avatar info */}
                  <td className="py-4 px-6 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-outfit text-xs border border-white shadow-sm ${chef.avatar_color}`}>
                      {chef.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-800 text-[13px] block leading-tight">{chef.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{chef.email}</span>
                    </div>
                  </td>

                  {/* Experience */}
                  <td className="py-4 px-6 font-semibold text-slate-600">
                    {chef.experience}
                  </td>

                  {/* Cuisine Specialties */}
                  <td className="py-4 px-6 text-slate-500 font-bold">
                    {chef.specialties}
                  </td>

                  {/* Calendly synced badge */}
                  <td className="py-4 px-6 text-center">
                    {chef.calendly ? (
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
                    {chef.status === 'approved' ? (
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-[#d1fae5] text-[#065f46]">
                        Approved
                      </span>
                    ) : chef.status === 'suspended' ? (
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-[#fee2e2] text-[#991b1b]">
                        Suspended
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
                      <button className="w-8 h-8 rounded-lg bg-slate-55 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center border border-[#e2e8f0] transition-colors" title="Review">
                        <Eye className="w-4 h-4" />
                      </button>

                      {chef.status !== 'approved' && (
                        <button onClick={() => handleApprove(chef.id)} className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-55 hover:bg-emerald-500 text-emerald-600 hover:text-white flex items-center justify-center border border-emerald-100 hover:border-emerald-500 transition-colors" title="Approve">
                          <Check className="w-4 h-4" />
                        </button>
                      )}

                      {chef.status !== 'suspended' && (
                        <button onClick={() => handleReject(chef.id)} className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-55 hover:bg-rose-500 text-rose-600 hover:text-white flex items-center justify-center border border-rose-100 hover:border-rose-500 transition-colors" title="Reject">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer pagination */}
        <div className="px-6 py-4 flex justify-between items-center border-t border-[#e2e8f0] bg-slate-50/10">
          <span className="text-xs text-slate-400 font-bold">Showing 1-4 of 24 applications</span>
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-slate-400"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-7 h-7 rounded-lg bg-[#065f46] text-white flex items-center justify-center text-xs font-bold">1</button>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">2</button>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">3</button>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-slate-400"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

      </div>

    </div>
  );
}
