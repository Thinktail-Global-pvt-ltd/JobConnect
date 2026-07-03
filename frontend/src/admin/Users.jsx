import React, { useEffect, useState } from 'react';
import { mockApi } from '../services/api';
import { Search, Shield, Activity, AlertTriangle, TrendingUp, X } from 'lucide-react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id, name) => {
    if (confirm(`Are you sure you want to permanently delete user ${name}? This action is irreversible.`)) {
      await mockApi.deleteUser(id);
      loadUsers();
    }
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 md:border-none pb-3 md:pb-0">
          <button onClick={() => setTab('all')} 
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${tab === 'all' ? 'bg-[#eff6ff] text-[#0f172a]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
            All Users
          </button>
          <button onClick={() => setTab('active')} 
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${tab === 'active' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
            Active
          </button>
          <button onClick={() => setTab('suspended')} 
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${tab === 'suspended' ? 'bg-rose-50 text-rose-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
            Suspended
          </button>
        </div>

        <div className="flex items-center gap-3 self-stretch md:self-auto">
          <div className="relative flex-grow md:flex-grow-0 md:w-72">
            <input type="text" placeholder="Search by name, phone..." value={search} onChange={(e) => setSearch(e.target.value)}
                   className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-10 text-xs font-medium text-slate-600 focus:outline-none focus:border-brand-500 focus:bg-white transition-all" />
            <Search className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold p-1">✕</button>
            )}
          </div>
          <button className="bg-[#059669] hover:bg-[#047857] text-white rounded-xl px-5 py-2.5 text-xs font-bold shadow-sm shadow-[#059669]/10 transition-all hover:-translate-y-0.5 whitespace-nowrap">
            + Add New User
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/20">
          <h2 className="font-outfit font-extrabold text-base text-slate-800">Platform Users</h2>
        </div>

        {loading ? (
          <p className="text-center text-slate-400 text-xs font-medium py-12">Loading user accounts...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-slate-400 text-sm font-medium py-12">No registered users matching filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">User Details</th>
                  <th className="py-4 px-6">Mobile</th>
                  <th className="py-4 px-6">Registered Roles</th>
                  <th className="py-4 px-6 text-center">Activity Stats</th>
                  <th className="py-4 px-6">Profile Completeness</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-4.5 px-6 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold font-outfit text-xs border border-slate-100">
                        {user.full_name ? user.full_name.substring(0, 2).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block leading-tight">{user.full_name || 'Not Provided'}</span>
                        <span className="text-[11px] font-semibold text-slate-400 block mt-0.5">{user.email || 'No email linked'}</span>
                      </div>
                    </td>

                    <td className="py-4.5 px-6 font-semibold text-slate-600">
                      <code>{user.mobile_number}</code>
                    </td>

                    <td className="py-4.5 px-6">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border bg-slate-50 text-slate-500 border-slate-100">
                        {user.role_type || 'job_seeker'}
                      </span>
                    </td>

                    <td className="py-4.5 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleShowPosted(user.id, user.full_name || user.mobile_number)} 
                                className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold hover:bg-indigo-500 hover:text-white transition-all flex items-center gap-1">
                          Posted: {user.job_posts_count || 0}
                        </button>
                        <button onClick={() => handleShowApplied(user.id, user.full_name || user.mobile_number)} 
                                className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold hover:bg-blue-500 hover:text-white transition-all flex items-center gap-1">
                          Applied: {user.applications_count || 0}
                        </button>
                      </div>
                    </td>

                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex-grow bg-slate-100 h-2 rounded-full overflow-hidden max-w-[100px]">
                          <div className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full rounded-full" style={{ width: `${user.completeness || 50}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-slate-600">{user.completeness || 50}%</span>
                      </div>
                    </td>

                    <td className="py-4.5 px-6">
                      {user.is_suspended ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100">
                          Suspended
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="py-4.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.is_suspended ? (
                          <button onClick={() => handleActivate(user.id)} className="bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-emerald-100 hover:border-emerald-500 transition-colors">
                            Activate
                          </button>
                        ) : (
                          <button onClick={() => handleSuspend(user.id)} className="bg-slate-50 hover:bg-rose-500 text-slate-500 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-100 hover:border-rose-500 transition-colors">
                            Suspend
                          </button>
                        )}
                        <button onClick={() => handleDelete(user.id, user.full_name || user.mobile_number)} className="bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-rose-100 hover:border-rose-500 transition-colors">
                          Hard Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Growth (MoM)</span>
            <span className="font-outfit font-extrabold text-2xl text-emerald-600 block mt-1.5">+12.5%</span>
          </div>
          <div className="text-xl p-3 bg-emerald-50 rounded-xl text-emerald-600"><TrendingUp className="w-5 h-5" /></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Verified Users</span>
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-1.5">88%</span>
          </div>
          <div className="text-xl p-3 bg-blue-50 rounded-xl text-blue-600"><Shield className="w-5 h-5" /></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Today</span>
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-1.5">432</span>
          </div>
          <div className="text-xl p-3 bg-indigo-50 rounded-xl text-indigo-600"><Activity className="w-5 h-5" /></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Safety Flags</span>
            <span className="font-outfit font-extrabold text-2xl text-rose-600 block mt-1.5">2</span>
          </div>
          <div className="text-xl p-3 bg-rose-50 rounded-xl text-rose-600"><AlertTriangle className="w-5 h-5" /></div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
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
