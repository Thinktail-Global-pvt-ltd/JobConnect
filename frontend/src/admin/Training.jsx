import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit2, ArrowUp, ArrowDown, Globe, ShieldCheck, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const INITIAL_PROGRAMS = [
  {
    id: '1',
    name: 'Advanced Culinary Arts - London',
    curriculum: 'Michelin Prep',
    countries: ['UK', 'Ireland'],
    duration: '12 Months',
    status: 'Published',
    status_color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    date: 'Oct 12, 2023'
  },
  {
    id: '2',
    name: 'Hospitality Leadership - Dubai',
    curriculum: 'Operations Mgmt',
    countries: ['UAE', 'Qatar'],
    duration: '24 Months',
    status: 'Active',
    status_color: 'bg-teal-50 text-teal-700 border-teal-100',
    date: 'Sep 28, 2023'
  },
  {
    id: '3',
    name: 'Luxury Resort Management',
    curriculum: 'Guest Experience',
    countries: ['Maldives', 'Seychelles'],
    duration: '18 Months',
    status: 'Draft',
    status_color: 'bg-orange-50 text-orange-600 border-orange-100',
    date: 'Nov 05, 2023'
  },
  {
    id: '4',
    name: 'Sommelier Certification',
    curriculum: 'Wine Science',
    countries: ['France', 'Italy'],
    duration: '6 Months',
    status: 'Reviewing',
    status_color: 'bg-blue-50 text-blue-700 border-blue-100',
    date: 'Oct 30, 2023'
  }
];

export default function Training() {
  const [programs, setPrograms] = useState(INITIAL_PROGRAMS);

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit font-extrabold text-2xl text-slate-800">Training & Overseas Programs</h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Manage international placement cycles and professional training curricula.</p>
        </div>

        <Link to="/admin/training/edit" className="bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-5 py-2.5 text-xs font-bold shadow-sm shadow-[#059669]/10 transition-all hover:-translate-y-0.5">
          + Create New Program
        </Link>
      </div>

      {/* KPI stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#059669] flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Active Placements</span>
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-1">1,284</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#059669] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Success Rate</span>
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-1">94.2%</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Avg. Processing Time</span>
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-1">18 Days</span>
          </div>
        </div>

      </div>

      {/* Programs List Table Board */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        
        {/* Table list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-[#e2e8f0] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Program Name</th>
                <th className="py-4 px-6">Deployment Countries</th>
                <th className="py-4 px-6">Duration</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Created Date</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0] text-slate-700 text-xs font-semibold">
              {programs.map(prog => (
                <tr key={prog.id} className="hover:bg-slate-50/30 transition-colors">
                  {/* Name & Curriculum */}
                  <td className="py-4.5 px-6">
                    <span className="font-extrabold text-slate-800 text-[13px] block leading-tight">{prog.name}</span>
                    <span className="text-[10px] text-slate-400 font-bold block mt-1">Curriculum: {prog.curriculum}</span>
                  </td>

                  {/* Countries badges */}
                  <td className="py-4.5 px-6">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {prog.countries.map((c, idx) => (
                        <span key={idx} className="bg-[#f1f5f9] text-[#475569] text-[9px] font-extrabold px-2 py-0.5 rounded border border-[#e2e8f0]">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Duration */}
                  <td className="py-4.5 px-6 text-slate-600 font-bold">
                    {prog.duration}
                  </td>

                  {/* Status badge */}
                  <td className="py-4.5 px-6">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border ${prog.status_color}`}>
                      {prog.status}
                    </span>
                  </td>

                  {/* Created date */}
                  <td className="py-4.5 px-6 text-slate-400 font-bold">
                    {prog.date}
                  </td>

                  {/* Actions buttons */}
                  <td className="py-4.5 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link to={`/admin/training/edit`} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center border border-[#e2e8f0] transition-colors" title="Review">
                        <Eye className="w-4 h-4" />
                      </Link>

                      <Link to={`/admin/training/edit`} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center border border-[#e2e8f0] transition-colors" title="Edit">
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>

                      <button className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 flex items-center justify-center border border-[#e2e8f0] transition-colors" title="Publish">
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center border border-[#e2e8f0] transition-colors" title="Archive">
                        <ArrowDown className="w-3.5 h-3.5" />
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
          <span className="text-xs text-slate-400 font-bold">Showing 1-4 of 124 programs</span>
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-slate-400"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-7 h-7 rounded-lg bg-[#065f46] text-white flex items-center justify-center text-xs font-bold">1</button>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">2</button>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">3</button>
            <span className="text-slate-400 px-1 font-bold">...</span>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">31</button>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-slate-400"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

      </div>

    </div>
  );
}
