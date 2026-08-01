import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Eye, ShieldCheck, Mail } from 'lucide-react';
import axios from 'axios';
import { realApi, mockApi } from '../services/api';

export default function EmployerDetail() {
  const { id } = useParams();
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [suspended, setSuspended] = useState(false);

  const fetchEmployerDetail = async () => {
    setLoading(true);
    let data = null;

    // 1. Try realApi (/api/admin/employers/:id)
    try {
      const res = await realApi.get(`/api/admin/employers/${id}`);
      if (res.data?.success && res.data.employer) data = res.data.employer;
    } catch (e) {}

    // 2. Try /backend/ path
    if (!data) {
      try {
        const res = await axios.get(`/backend/api/admin/employers/${id}`);
        if (res.data?.success && res.data.employer) data = res.data.employer;
      } catch (e) {}
    }

    if (data) {
      setEmployer(data);
      setSuspended(data.is_suspended || data.status === 'Suspended');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployerDetail();
  }, [id]);

  const handleSuspend = async () => {
    await mockApi.suspendUser(id);
    setSuspended(true);
    fetchEmployerDetail();
  };

  const handleActivate = async () => {
    await mockApi.activateUser(id);
    setSuspended(false);
    fetchEmployerDetail();
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 text-xs font-semibold">
        Loading employer details...
      </div>
    );
  }

  if (!employer) {
    return (
      <div className="py-20 text-center text-slate-400 text-xs font-semibold">
        Employer profile not found.
      </div>
    );
  }

  const jobsList = employer.jobs || [];

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
          <div className="w-14 h-14 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-2xl shadow-sm font-outfit font-black text-slate-700">
            {employer.name ? employer.name.charAt(0).toUpperCase() : '🏢'}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-outfit font-extrabold text-xl text-slate-800 leading-none">{employer.name}</h2>
              <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider ${suspended ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-[#059669] border border-emerald-100'}`}>
                {suspended ? 'Suspended' : 'Active'}
              </span>
            </div>
            
            <p className="text-xs font-bold text-slate-400">
              📍 {employer.hq || 'India'} &nbsp;•&nbsp; Member since {employer.created_at || 'Jan 2023'}
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5">
          {suspended ? (
            <button onClick={handleActivate} className="bg-[#065f46] hover:bg-[#044e39] text-white rounded-lg px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm">
              <span>⚙️</span>
              Activate Employer
            </button>
          ) : (
            <button onClick={handleSuspend} className="bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-lg px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm">
              <span>🚫</span>
              Suspend Employer
            </button>
          )}
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
                <span className="text-slate-800 font-extrabold mt-1 block">{employer.contact || 'N/A'}</span>
                <span className="text-slate-400 text-[10px] block mt-0.5">HR / Account Manager</span>
              </div>
              <div className="border-t border-slate-50 pt-4">
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Mobile Number</span>
                <span className="text-slate-800 font-extrabold mt-1 block"><code>{employer.phone || 'N/A'}</code></span>
              </div>
              <div className="border-t border-slate-50 pt-4">
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Email Address</span>
                <span className="text-[#059669] font-extrabold mt-1 block">{employer.email || 'N/A'}</span>
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
                {employer.total_jobs ?? 0}
              </span>
            </div>

            {/* Box 2 */}
            <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[95px]">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Active Jobs</span>
              <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-2">
                {employer.active_jobs ?? 0}
              </span>
            </div>

            {/* Box 3 */}
            <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[95px]">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Pending Jobs</span>
              <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-2">
                {employer.pending_jobs ?? 0}
              </span>
            </div>

          </div>

          {/* Recent Job Postings list card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#e2e8f0] flex justify-between items-center bg-slate-50/10">
              <h3 className="font-outfit font-extrabold text-sm text-slate-800">Recent Job Postings</h3>
              <Link to="/admin/jobs" className="text-xs font-bold text-[#059669] hover:underline">View All Postings</Link>
            </div>

            {jobsList.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs font-semibold">
                No job postings created by this employer yet.
              </div>
            ) : (
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
                    {jobsList.map(job => (
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
                          <Link to="/admin/jobs" className="text-slate-400 hover:text-slate-600">
                            <Eye className="w-4 h-4 inline-block" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
              Employer "{employer.name}" registered in {employer.hq || 'India'}. You can review their posted jobs, verify contact numbers, and toggle account access state.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

