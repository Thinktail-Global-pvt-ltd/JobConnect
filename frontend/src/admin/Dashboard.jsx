import React from 'react';
import { Users, Briefcase, FileText, ArrowRight, Share2, ClipboardList, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Title & Topbar Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit font-extrabold text-2xl text-slate-800">Dashboard Overview</h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Real-time performance metrics for the JobConnect platform.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="bg-white border border-[#e2e8f0] rounded-xl px-4 py-2 text-xs font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
            📅 Last 30 Days
          </button>
          <button className="bg-[#059669] hover:bg-[#047857] text-white rounded-xl px-5 py-2.5 text-xs font-bold shadow-sm shadow-[#059669]/10 flex items-center gap-2 transition-all hover:-translate-y-0.5">
            📥 Export Report
          </button>
        </div>
      </div>

      {/* Row 1 Stats: Large KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Users */}
        <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <div className="w-9 h-9 rounded-xl bg-[#e8f5e9] flex items-center justify-center text-[#2e7d32]">
              <Users className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#e8f5e9] text-[#2e7d32] flex items-center gap-0.5">
              ↗ 12%
            </span>
          </div>
          <div className="mt-4">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Users</span>
            <span className="font-outfit font-extrabold text-3xl text-slate-800 mt-1 block">12,450</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-[#f1f5f9] rounded-full overflow-hidden">
            <div className="bg-[#10b981] h-full rounded-full w-[70%]"></div>
          </div>
        </div>

        {/* Total Employers */}
        <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <div className="w-9 h-9 rounded-xl bg-[#e0f2f1] flex items-center justify-center text-[#00695c]">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#e0f2f1] text-[#00695c] flex items-center gap-0.5">
              ↗ 5%
            </span>
          </div>
          <div className="mt-4">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Employers</span>
            <span className="font-outfit font-extrabold text-3xl text-slate-800 mt-1 block">840</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-[#f1f5f9] rounded-full overflow-hidden">
            <div className="bg-[#0f766e] h-full rounded-full w-[45%]"></div>
          </div>
        </div>

        {/* Total Jobs */}
        <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <div className="w-9 h-9 rounded-xl bg-[#ffebee] flex items-center justify-center text-[#c62828]">
              <FileText className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ffebee] text-[#c62828] flex items-center gap-0.5">
              ↘ 2%
            </span>
          </div>
          <div className="mt-4">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Jobs</span>
            <span className="font-outfit font-extrabold text-3xl text-slate-800 mt-1 block">1,200</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-[#f1f5f9] rounded-full overflow-hidden">
            <div className="bg-[#b91c1c] h-full rounded-full w-[60%]"></div>
          </div>
        </div>

      </div>

      {/* Row 2 Stats: Horizontal Indicator Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Referrals */}
        <div className="bg-white p-4.5 rounded-xl border border-[#e2e8f0] shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#f8f9fc] flex items-center justify-center text-[#10b981] border border-slate-100">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Referrals</span>
            <span className="font-outfit font-extrabold text-lg text-slate-800 mt-0.5 block">450</span>
          </div>
        </div>

        {/* Chef Profiles */}
        <div className="bg-white p-4.5 rounded-xl border border-[#e2e8f0] shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#f8f9fc] flex items-center justify-center text-[#0f766e] border border-slate-100 text-lg">
            🍴
          </div>
          <div>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Chef Profiles</span>
            <span className="font-outfit font-extrabold text-lg text-slate-800 mt-0.5 block">2,100</span>
          </div>
        </div>

        {/* Total Applications */}
        <div className="bg-white p-4.5 rounded-xl border border-[#e2e8f0] shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#f8f9fc] flex items-center justify-center text-[#b91c1c] border border-slate-100">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Applications</span>
            <span className="font-outfit font-extrabold text-lg text-slate-800 mt-0.5 block">5,600</span>
          </div>
        </div>

      </div>

      {/* Main Split Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left: Pending Actions (3/5) */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden h-full flex flex-col justify-between">
            <div>
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/10">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📋</span>
                  <h3 className="font-outfit font-extrabold text-base text-slate-800">Pending Actions</h3>
                </div>
                <Link to="/admin/jobs" className="text-xs font-bold text-[#059669] hover:underline">
                  View All
                </Link>
              </div>

              <div className="p-6 space-y-4">
                {/* Item 1 */}
                <div className="p-4 bg-[#eff6ff]/60 border border-[#dbeafe] rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#10b981] flex items-center justify-center text-white font-extrabold font-outfit text-sm">
                      14
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Jobs Awaiting Approval</span>
                      <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block">Review required for new hospitality listings.</span>
                    </div>
                  </div>
                  <Link to="/admin/jobs" className="bg-white border border-[#e2e8f0] text-slate-500 hover:bg-slate-50 px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm">
                    Manage
                  </Link>
                </div>

                {/* Item 2 */}
                <div className="p-4 bg-[#eff6ff]/60 border border-[#dbeafe] rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#06b6d4] flex items-center justify-center text-white font-extrabold font-outfit text-sm">
                      8
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Chef Profiles Awaiting Approval</span>
                      <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block">Portfolio validation for high-tier chefs.</span>
                    </div>
                  </div>
                  <Link to="/admin/chefs" className="bg-white border border-[#e2e8f0] text-slate-500 hover:bg-slate-50 px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm">
                    Manage
                  </Link>
                </div>

                {/* Item 3 */}
                <div className="p-4 bg-[#eff6ff]/60 border border-[#dbeafe] rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#f97316] flex items-center justify-center text-white font-extrabold font-outfit text-sm">
                      3
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Training & Overseas Drafts</span>
                      <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block">Update and publish international programs.</span>
                    </div>
                  </div>
                  <a href="#" className="bg-white border border-[#e2e8f0] text-slate-500 hover:bg-slate-50 px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm">
                    Manage
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recent Activity Feed (2/5) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="p-6 border-b border-slate-100 flex items-center gap-2 bg-slate-50/10">
                <Clock className="w-4 h-4 text-slate-500" />
                <h3 className="font-outfit font-extrabold text-base text-slate-800">Recent Activity Feed</h3>
              </div>

              <div className="p-6 space-y-6">
                {/* Item 1 */}
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                    JS
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                      Jordan Smith approved a new job listing: <span className="font-bold text-[#059669]">Executive Chef at Grand Plaza</span>
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 block mt-1">2 minutes ago</span>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                    SC
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                      Sarah Chen rejected a Chef Profile application: <span className="font-bold text-rose-500">ID #22409 (Missing Docs)</span>
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 block mt-1">15 minutes ago</span>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                    MT
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                      Marcus Thorne updated the <span className="font-bold text-amber-600">Overseas Hospitality Internship</span> banner.
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 block mt-1">1 hour ago</span>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                    EV
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                      Elena Vance flagged a community post for <span className="font-bold text-slate-700">Policy Violation #882</span>.
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 block mt-1">3 hours ago</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4.5 border-t border-slate-100 bg-[#eff6ff]/30 text-center">
              <button className="text-xs font-bold text-[#1d4ed8] hover:underline w-full">
                Full Audit Log
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
