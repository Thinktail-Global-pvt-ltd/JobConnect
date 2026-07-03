import React, { useEffect, useState } from 'react';
import { mockApi } from '../services/api';
import { Search, ChevronLeft, ChevronRight, AlertTriangle, TrendingUp, ShieldCheck, Activity } from 'lucide-react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);

  // Modal Detail State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState([]);
  const [modalType, setModalType] = useState(''); 
  const [modalLoading, setModalLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getUsers(search, tab);
      setUsers(data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [search, tab]);

  const handleSuspend = async (id) => {
    await mockApi.suspendUser(id);
    loadUsers();
  };

  const handleActivate = async (id) => {
    await mockApi.activateUser(id);
    loadUsers();
  };

  const handleShowPosted = async (id, name) => {
    setModalOpen(true);
    setModalTitle(`Jobs Posted by ${name}`);
    setModalType('posted');
    setModalLoading(true);
    try {
      const data = await mockApi.getUserJobs(id);
      setModalData(data.jobs);
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleShowApplied = async (id, name) => {
    setModalOpen(true);
    setModalTitle(`Jobs Applied by ${name}`);
    setModalType('applied');
    setModalLoading(true);
    try {
      const data = await mockApi.getUserApplications(id);
      setModalData(data.applications);
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const getAvatarStyle = (name) => {
    if (!name) return 'bg-[#dcfce7] text-[#15803d]';
    const char = name.charCodeAt(0) % 4;
    switch (char) {
      case 0: return 'bg-[#dcfce7] text-[#15803d]'; // green
      case 1: return 'bg-[#eff6ff] text-[#1d4ed8]'; // blue
      case 2: return 'bg-[#fff7ed] text-[#c2410c]'; // orange
      default: return 'bg-[#f3e8ff] text-[#7e22ce]'; // purple
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Floating Right Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit font-extrabold text-2xl text-slate-800">User Management</h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Oversee system users, manage access levels, and track registration trends.</p>
        </div>
        <button className="bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-5 py-2.5 text-xs font-bold shadow-sm shadow-[#059669]/10 transition-all hover:-translate-y-0.5 flex items-center gap-2">
          👤 Add New User
        </button>
      </div>

      {/* Filter tabs and search input row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5.5 rounded-2xl border border-[#e2e8f0] shadow-sm">
        {/* Tabs with Underlines */}
        <div className="flex items-center gap-6 border-b border-slate-100 md:border-none pb-2 md:pb-0">
          <button onClick={() => setTab('all')} 
                  className={`text-xs font-bold pb-2 transition-all relative ${tab === 'all' ? 'text-[#065f46] border-b-2 border-[#10b981]' : 'text-slate-400 hover:text-slate-700'}`}>
            All Users
          </button>
          <button onClick={() => setTab('active')} 
                  className={`text-xs font-bold pb-2 transition-all relative ${tab === 'active' ? 'text-[#065f46] border-b-2 border-[#10b981]' : 'text-slate-400 hover:text-slate-700'}`}>
            Active
          </button>
          <button onClick={() => setTab('suspended')} 
                  className={`text-xs font-bold pb-2 transition-all relative ${tab === 'suspended' ? 'text-[#065f46] border-b-2 border-[#10b981]' : 'text-slate-400 hover:text-slate-700'}`}>
            Suspended
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input type="text" placeholder="Search Name, Phone, or City..." value={search} onChange={(e) => setSearch(e.target.value)}
                 className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-lg py-2 pl-10 pr-10 text-xs font-medium text-slate-600 focus:outline-none focus:border-[#065f46] focus:bg-white transition-all" />
          <Search className="absolute left-3.5 top-2.5 text-slate-400 w-4 h-4" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-2 text-slate-400 hover:text-slate-600 text-xs font-bold p-1">✕</button>
          )}
        </div>
      </div>

      {/* Users Table Card */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        
        {loading ? (
          <p className="text-center text-slate-400 text-xs font-medium py-16">Loading users list...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-slate-400 text-sm font-medium py-16">No users matching search filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-[#e2e8f0] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-4.5 px-6">User Name</th>
                  <th className="py-4.5 px-6">Mobile Number</th>
                  <th className="py-4.5 px-6">City</th>
                  <th className="py-4.5 px-6">Join Date</th>
                  <th className="py-4.5 px-6">Status</th>
                  <th className="py-4.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] text-slate-700 text-xs font-semibold">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/30 transition-colors">
                    {/* User Name & Avatar */}
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-outfit text-xs border border-white shadow-sm ${getAvatarStyle(user.full_name)}`}>
                        {user.full_name ? user.full_name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U'}
                      </div>
                      <span className="font-extrabold text-slate-800 text-[13px]">{user.full_name || 'Not Provided'}</span>
                    </td>

                    {/* Mobile Number */}
                    <td className="py-4 px-6 font-semibold text-slate-500">
                      <code>{user.mobile_number}</code>
                    </td>

                    {/* City */}
                    <td className="py-4 px-6 text-slate-600 font-bold">
                      {user.city || 'N/A'}
                    </td>

                    {/* Join Date */}
                    <td className="py-4 px-6 text-slate-400 font-bold">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Oct 12, 2023'}
                    </td>

                    {/* Status badge */}
                    <td className="py-4 px-6">
                      {user.is_suspended ? (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-[#fee2e2] text-[#991b1b]">
                          Suspended
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-[#d1fae5] text-[#065f46]">
                          Active
                        </span>
                      )}
                    </td>

                    {/* Actions Links */}
                    <td className="py-4 px-6 text-right space-x-3">
                      <button onClick={() => handleShowPosted(user.id, user.full_name || user.mobile_number)} 
                              className="text-slate-500 hover:text-brand-600 transition-colors">
                        View Profile
                      </button>

                      {user.is_suspended ? (
                        <button onClick={() => handleActivate(user.id)} className="text-[#059669] hover:underline">
                          Activate
                        </button>
                      ) : (
                        <button onClick={() => handleSuspend(user.id)} className="text-rose-600 hover:underline">
                          Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Pagination */}
        <div className="px-6 py-4 flex justify-between items-center border-t border-[#e2e8f0] bg-slate-50/10">
          <span className="text-xs text-slate-400 font-bold">Showing 5 of 1,248 Users</span>
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-slate-400"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-7 h-7 rounded-lg bg-[#065f46] text-white flex items-center justify-center text-xs font-bold">1</button>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">2</button>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">3</button>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-slate-400"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

      </div>

      {/* KPI indicator cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
        
        {/* Growth */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[90px]">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Growth (MoM)</span>
          <span className="font-outfit font-extrabold text-2xl text-emerald-600 block mt-2">+12.5%</span>
        </div>

        {/* Verified */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[90px]">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Verified</span>
          <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-2">88%</span>
        </div>

        {/* Active Today */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[90px]">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Active Today</span>
          <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-2">432</span>
        </div>

        {/* Safety Flag */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[90px]">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Safety Flag</span>
          <span className="font-outfit font-extrabold text-2xl text-rose-600 block mt-2">2</span>
        </div>

      </div>

      {/* AJAX Detail Modals */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
              <h3 className="font-outfit font-extrabold text-slate-800 text-base">{modalTitle}</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm font-bold transition-all">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              {modalLoading ? (
                <p className="text-xs font-semibold text-slate-400 text-center py-6">Loading details...</p>
              ) : modalData.length === 0 ? (
                <p className="text-xs font-semibold text-slate-400 text-center py-6">No records found.</p>
              ) : modalType === 'posted' ? (
                modalData.map(job => (
                  <div key={job.id} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-left space-y-3">
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{job.title}</div>
                      <div className="text-[11px] font-semibold text-slate-400 mt-1">📍 {job.location} • 💼 {job.job_type}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-600 font-extrabold text-xs">{job.salary}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border ${job.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                modalData.map(app => (
                  <div key={app.id} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-left space-y-2">
                    <div className="font-bold text-slate-800 text-sm">{app.job_post?.title || 'Unknown Job'}</div>
                    <div className="text-[11px] font-semibold text-slate-400">📍 {app.job_post?.location} • 💼 {app.job_post?.company}</div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100/60 text-[10px] font-bold">
                      <span className="text-slate-400">Status</span>
                      <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider border bg-blue-50 text-blue-600 border-blue-100">
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
