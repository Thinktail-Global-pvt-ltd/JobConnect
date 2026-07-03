import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Eye, ShieldCheck, Mail, AlertCircle, AlertTriangle } from 'lucide-react';

const RECENT_JOBS = [
  { id: 'JB-9021', title: 'Executive Sous Chef', date: 'Oct 24, 2023', status: 'Active', status_color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { id: 'JB-8842', title: 'Front Office Supervisor', date: 'Oct 22, 2023', status: 'Pending Approval', status_color: 'bg-orange-50 text-orange-700 border-orange-100' },
  { id: 'JB-8112', title: 'Night Auditor (Part-time)', date: 'Oct 19, 2023', status: 'Closed', status_color: 'bg-slate-50 text-slate-500 border-slate-100' },
  { id: 'JB-7554', title: 'Senior Mixologist', date: 'Oct 15, 2023', status: 'Active', status_color: 'bg-emerald-50 text-emerald-700 border-emerald-100' }
];

export default function EmployerDetail() {
  const { id } = useParams();
  const [suspended, setSuspended] = useState(false);
  const [approved, setApproved] = useState(false);

  return (
    <div className="space-y-6 text-left">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
        <Link to="/admin/employers" className="hover:text-slate-600">Employers</Link>
        <span>&gt;</span>
        <span className="text-slate-600">Employer Detail</span>
      </div>

      {/* Header Profile Summary block */}
      <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div className="flex items-center gap-4.5">
          {/* Logo square */}
          <div className="w-14 h-14 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-2xl shadow-sm">
            🏢
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-outfit font-extrabold text-xl text-slate-800 leading-none">The Grand Horizon Hotel</h2>
              <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider ${suspended ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-[#059669] border border-emerald-100'}`}>
                {suspended ? 'Suspended' : 'Active'}
              </span>
            </div>
            
            <p className="text-xs font-bold text-slate-400">
              📍 Central District, Singapore &nbsp;•&nbsp; Member since Jan 2023
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button onClick={() => setSuspended(true)} className="bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-lg px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm">
            <span>🚫</span>
            Suspend Employer
          </button>
          
          <button onClick={() => setSuspended(false)} className="bg-[#065f46] hover:bg-[#044e39] text-white rounded-lg px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm">
            <span>⚙️</span>
            Activate Employer
          </button>
        </div>
      </div>

      {/* Split grid sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Contact Information (1/3) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-5">
            <h3 className="font-outfit font-extrabold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-3">
              <span>📋</span> Contact Information
            </h3>

            {/* Info Items */}
            <div className="space-y-4 text-xs font-semibold text-slate-500">
              <div>
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Primary Contact</span>
                <span className="text-slate-800 font-extrabold mt-1 block">Benjamin Tan Wei-Ming</span>
                <span className="text-slate-400 text-[10px] block mt-0.5">General Manager - HR Operations</span>
              </div>
              <div className="border-t border-slate-50 pt-4">
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Mobile Number</span>
                <span className="text-slate-800 font-extrabold mt-1 block"><code>+65 8892 4412</code></span>
              </div>
              <div className="border-t border-slate-50 pt-4">
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Email Address</span>
                <span className="text-[#059669] font-extrabold mt-1 block">b.tan@grandhorizon.com.sg</span>
              </div>
            </div>

            <button className="w-full bg-white border border-[#e2e8f0] hover:bg-slate-50 text-slate-700 rounded-lg py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm">
              <Mail className="w-4 h-4 text-slate-400" />
              Send Direct Message
            </button>
          </div>
        </div>

        {/* Right Side: KPI boxes + Job Postings (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 3 columns Stats Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Box 1 */}
            <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[95px]">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Jobs Posted</span>
              <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-2">
                142 <span className="text-xs text-emerald-600 ml-1.5 font-bold">+12%</span>
              </span>
            </div>

            {/* Box 2 */}
            <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[95px]">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Active Jobs</span>
              <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-2">
                24 <span className="text-xs text-slate-400 ml-1.5 font-bold">Stable</span>
              </span>
            </div>

            {/* Box 3 */}
            <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[95px]">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Pending Jobs</span>
              <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-2">
                08 <span className="text-xs text-rose-500 ml-1.5 font-bold">Urgent</span>
              </span>
            </div>

          </div>

          {/* Recent Job Postings list card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#e2e8f0] flex justify-between items-center bg-slate-50/10">
              <h3 className="font-outfit font-extrabold text-sm text-slate-800">Recent Job Postings</h3>
              <a href="#" className="text-xs font-bold text-[#059669] hover:underline">View All Postings</a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/20 border-b border-[#e2e8f0] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-6">Job Title</th>
                    <th className="py-3 px-6">Posted Date</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0] text-slate-700 text-xs font-semibold">
                  {RECENT_JOBS.map(job => (
                    <tr key={job.id} className="hover:bg-slate-50/20 transition-colors">
                      <td className="py-3.5 px-6">
                        <span className="font-extrabold text-slate-800 block text-[13px]">{job.title}</span>
                        <span className="text-[9px] text-slate-400 font-bold block mt-0.5">ID: {job.id}</span>
                      </td>
                      <td className="py-3.5 px-6 text-slate-500 font-bold">
                        {job.date}
                      </td>
                      <td className="py-3.5 px-6">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider border ${job.status_color}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <Link to={`/admin/jobs`} className="text-slate-400 hover:text-slate-600">
                          <Eye className="w-4 h-4 inline-block" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Alert Banner Moderator Guidance */}
      <div className="bg-[#eff6ff] border border-blue-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-outfit font-extrabold text-sm text-slate-800">Moderator Guidance</h4>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed max-w-2xl">
              This employer has completed 100% of their mandatory verification steps. There are currently no outstanding complaints or reports against this entity. Verification for "The Grand Horizon Hotel" is recommended for premium job listing access.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 flex-shrink-0 self-end md:self-auto">
          <button onClick={() => { setApproved(true); alert("Profile approved successfully!"); }}
                  className="bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-4 py-2 text-xs font-bold transition-all shadow-sm">
            Approve Profile
          </button>
          <button className="text-slate-400 hover:text-slate-600 text-xs font-bold">
            Dismiss
          </button>
        </div>
      </div>

    </div>
  );
}
