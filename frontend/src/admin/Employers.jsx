import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Eye, AlertTriangle, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';

const INITIAL_EMPLOYERS = [
  {
    id: '1',
    name: 'The Taj Mahal Palace',
    hq: 'Mumbai, India',
    contact: 'Rohan Malhotra',
    phone: '+91 98765 43210',
    posted_count: 42,
    status: 'Active',
    status_color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  },
  {
    id: '2',
    name: 'Marriott International',
    hq: 'Global Headquarters',
    contact: 'Sarah J. Miller',
    phone: '+1 (555) 012-3456',
    posted_count: 156,
    status: 'Active',
    status_color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  },
  {
    id: '3',
    name: 'Hyatt Regency',
    hq: 'Dubai, UAE',
    contact: 'Ahmed Al-Sayed',
    phone: '+971 4 209 1234',
    posted_count: 18,
    status: 'Suspended',
    status_color: 'bg-rose-50 text-rose-700 border-rose-100'
  },
  {
    id: '4',
    name: 'ITC Hotels',
    hq: 'New Delhi, India',
    contact: 'Sanjay Kapoor',
    phone: '+91 11 4133 9000',
    posted_count: 89,
    status: 'Pending Verification',
    status_color: 'bg-orange-50 text-orange-700 border-orange-100'
  },
  {
    id: '5',
    name: 'Four Seasons',
    hq: 'Toronto, Canada',
    contact: 'Isabelle Fontaine',
    phone: '+1 (416) 964-0411',
    posted_count: 31,
    status: 'Active',
    status_color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  }
];

export default function Employers() {
  const [employers, setEmployers] = useState(INITIAL_EMPLOYERS);
  const [search, setSearch] = useState('');

  const filteredEmployers = employers.filter(emp => 
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.contact.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Title / Search header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit font-extrabold text-2xl text-slate-800 font-sans">Employers Management</h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Oversee platform employers, verification states, and job posting analytics.</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input type="text" placeholder="Search employers, regions, or status..." value={search} onChange={(e) => setSearch(e.target.value)}
                 className="w-full bg-white border border-[#e2e8f0] rounded-lg py-2 pl-10 pr-4 text-xs font-medium text-slate-600 focus:outline-none focus:border-[#059669] transition-all" />
          <span className="absolute left-3.5 top-2.5 text-slate-400 text-xs">🔍</span>
        </div>
      </div>

      {/* KPI stats section (Growth overview + Priority actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Growth Overview (2/3 width) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px] text-left">
          <div>
            <h3 className="font-outfit font-extrabold text-lg text-emerald-75 text-emerald-800 leading-none">Growth Overview</h3>
            <span className="text-[10px] font-bold text-slate-400 mt-1 block">Total active employers have increased by 12% this month.</span>
          </div>

          <div className="flex items-center gap-12 mt-6">
            <div>
              <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block">Active Partners</span>
              <span className="font-outfit font-extrabold text-2xl text-slate-800 mt-0.5 block">1,284</span>
            </div>
            <div>
              <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block">New Postings</span>
              <span className="font-outfit font-extrabold text-2xl text-slate-800 mt-0.5 block">342</span>
            </div>
          </div>

          {/* Trend graph mock vector */}
          <div className="absolute right-6 bottom-4 text-[#e2e8f0]/40 text-7xl select-none font-extrabold font-mono pointer-events-none">
            📈
          </div>
        </div>

        {/* Right Priority Actions (1/3 width) */}
        <div className="bg-[#22c55e] p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between min-h-[140px] text-left">
          <div>
            <h3 className="font-outfit font-extrabold text-base leading-none">Priority Actions</h3>
            <span className="text-[10px] font-bold text-emerald-100 mt-1 block">4 employers pending verification</span>
          </div>

          <button className="w-full bg-[#064e3b] hover:bg-[#065f46] text-white rounded-lg py-2.5 text-xs font-bold transition-all mt-4 flex items-center justify-center gap-1.5 shadow-sm">
            <span>🛡️</span>
            Review Now
          </button>
        </div>

      </div>

      {/* Employer Directory Table Card */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        
        {/* Table Header Filter bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-3">
            <h3 className="font-outfit font-extrabold text-sm text-slate-800">Employer Directory</h3>
            <span className="bg-emerald-50 text-[#059669] border border-emerald-100 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase">Global Access</span>
            <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase">Premium Tier Only</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="bg-white border border-[#e2e8f0] rounded-lg px-4 py-2 text-xs font-bold text-slate-600 flex items-center gap-1.5 hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Filter
            </button>
            <button className="bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-4 py-2 text-xs font-bold shadow-sm transition-all">
              + Add Employer
            </button>
          </div>
        </div>

        {/* Directory Table list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-[#e2e8f0] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Business Name</th>
                <th className="py-4 px-6">Contact Person</th>
                <th className="py-4 px-6">Mobile Number</th>
                <th className="py-4 px-6">Jobs Posted</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0] text-slate-700 text-xs font-semibold">
              {filteredEmployers.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50/30 transition-colors">
                  
                  {/* Business Name with avatar */}
                  <td className="py-4.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#eff6ff] text-blue-600 border border-blue-100 flex items-center justify-center font-bold font-outfit text-xs shadow-sm">
                        {emp.name[0]}
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-800 text-[13px] block leading-tight">{emp.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{emp.hq}</span>
                      </div>
                    </div>
                  </td>

                  {/* Contact Person */}
                  <td className="py-4.5 px-6 font-bold text-slate-75 text-slate-800">
                    {emp.contact}
                  </td>

                  {/* Mobile number */}
                  <td className="py-4.5 px-6 font-semibold text-slate-500">
                    <code>{emp.phone}</code>
                  </td>

                  {/* Jobs Posted count */}
                  <td className="py-4.5 px-6 text-emerald-600 font-bold">
                    📄 {emp.posted_count}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4.5 px-6">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border ${emp.status_color}`}>
                      {emp.status}
                    </span>
                  </td>

                  {/* Eye review action link */}
                  <td className="py-4.5 px-6 text-center">
                    <div className="flex items-center justify-center gap-3.5">
                      <Link to={`/admin/employers/${emp.id}`} className="text-slate-400 hover:text-slate-600" title="View Details">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button className="text-rose-400 hover:text-rose-600" title="Suspend Employer">
                        🚫
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer pagination */}
        <div className="px-6 py-4 flex justify-between items-center border-t border-[#e2e8f0] bg-slate-50/10">
          <span className="text-xs text-slate-400 font-bold">Showing 1 to 5 of 1,284 entries</span>
          
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-slate-400"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-7 h-7 rounded-lg bg-[#065f46] text-white flex items-center justify-center text-xs font-bold">1</button>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-55 flex items-center justify-center text-xs font-bold text-slate-500">2</button>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-55 flex items-center justify-center text-xs font-bold text-slate-500">3</button>
            <span className="text-slate-400 px-1 font-bold">...</span>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-55 flex items-center justify-center text-xs font-bold text-slate-500">257</button>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-slate-400"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

      </div>

    </div>
  );
}
