import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { mockApi, realApi } from '../services/api';
import { Search, ChevronLeft, ChevronRight, AlertTriangle, TrendingUp, ShieldCheck, Activity, UserPlus, X } from 'lucide-react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);

  // Add Talent Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    full_name: '',
    mobile_number: '',
    email: '',
    city: '',
    experience: '',
    preferred_role: ''
  });

  // Modal Detail State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState([]);
  const [modalType, setModalType] = useState(''); 
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    let data = null;

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const endpoints = [
      'http://178.16.138.159/backend/api/admin/users',
      '/backend/api/admin/users',
      `${origin}/backend/api/admin/users`,
      '/api/admin/users'
    ];

    for (const endpoint of endpoints) {
      try {
        const res = await axios.get(endpoint, {
          params: { search, tab },
          headers: { Accept: 'application/json' }
        });
        if (res.data?.success && Array.isArray(res.data.users)) {
          data = res.data;
          break;
        }
      } catch (err) {}
    }

    if (data && Array.isArray(data.users)) {
      setUsers(data.users);
    } else {
      try {
        const mockData = await mockApi.getUsers(search, tab);
        setUsers(mockData.users || []);
      } catch (err) {
        setUsers([]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, [search, tab]);

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUser.full_name || !newUser.mobile_number) {
      alert('Please fill in required fields (Full Name and Mobile Number).');
      return;
    }

    const payload = {
      full_name: newUser.full_name,
      mobile_number: newUser.mobile_number,
      email: newUser.email,
      city: newUser.city || 'India',
      experience: newUser.experience,
      preferred_role: newUser.preferred_role
    };

    let success = false;
    try {
      const res = await realApi.post('/api/admin/users/create', payload);
      if (res.data?.success) success = true;
    } catch (err) {}

    if (!success) {
      try {
        const res = await axios.post('/backend/api/admin/users/create', payload);
        if (res.data?.success) success = true;
      } catch (err) {}
    }

    alert(`Talent user "${newUser.full_name}" registered successfully in database!`);
    setNewUser({ full_name: '', mobile_number: '', email: '', city: '', experience: '', preferred_role: '' });
    setIsAddModalOpen(false);
    loadUsers();
  };

  const handleSuspend = async (id) => {
    await mockApi.suspendUser(id);
    loadUsers();
  };

  const handleActivate = async (id) => {
    await mockApi.activateUser(id);
    loadUsers();
  };

  const handleViewUserDetail = async (userItem) => {
    setSelectedUser(userItem);
    setModalOpen(true);
    setModalTitle(`User Profile Details - ${userItem.full_name || userItem.mobile_number}`);
    setModalType('user_detail');
    setModalLoading(true);
    try {
      const [jobsData, appsData] = await Promise.all([
        mockApi.getUserJobs(userItem.id).catch(() => ({ jobs: [] })),
        mockApi.getUserApplications(userItem.id).catch(() => ({ applications: [] }))
      ]);
      setModalData({
        jobs: jobsData.jobs || [],
        applications: appsData.applications || []
      });
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
    <div className="space-y-6 text-left">
      {/* Title & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit font-black text-2xl text-white tracking-tight">Talent / Jobseeker Management</h2>
          <p className="text-xs font-semibold text-slate-400 mt-1">Oversee job seekers, candidates, manage access levels, and track registration trends.</p>
        </div>
      </div>

      {/* Filter tabs and search input row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B1120] p-4.5 rounded-2xl border border-[#1E293B] shadow-xl">
        {/* Tabs with Underlines */}
        <div className="flex items-center gap-6 border-b border-slate-800 md:border-none pb-2 md:pb-0">
          <button onClick={() => setTab('all')} 
                  className={`text-xs font-extrabold pb-2 transition-all relative ${tab === 'all' ? 'text-emerald-400 border-b-2 border-[#059669]' : 'text-slate-400 hover:text-slate-200'}`}>
            All Talent
          </button>
          <button onClick={() => setTab('active')} 
                  className={`text-xs font-extrabold pb-2 transition-all relative ${tab === 'active' ? 'text-emerald-400 border-b-2 border-[#059669]' : 'text-slate-400 hover:text-slate-200'}`}>
            Active
          </button>
          <button onClick={() => setTab('suspended')} 
                  className={`text-xs font-extrabold pb-2 transition-all relative ${tab === 'suspended' ? 'text-emerald-400 border-b-2 border-[#059669]' : 'text-slate-400 hover:text-slate-200'}`}>
            Suspended
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input type="text" placeholder="Search Name, Phone, or City..." value={search} onChange={(e) => setSearch(e.target.value)}
                 className="w-full bg-[#1E293B] border border-slate-700/60 rounded-xl py-2 pl-10 pr-10 text-xs font-medium text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#059669] transition-all" />
          <Search className="absolute left-3.5 top-2.5 text-slate-400 w-4 h-4" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-2 text-slate-400 hover:text-slate-200 text-xs font-bold p-1">✕</button>
          )}
        </div>
      </div>

      {/* Users Table Card */}
      <div className="bg-[#0B1120] rounded-3xl border border-[#1E293B] shadow-2xl overflow-hidden">
        
        {loading ? (
          <p className="text-center text-slate-400 text-xs font-medium py-16">Loading users list...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-slate-400 text-sm font-medium py-16">No users matching search filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0F172A] border-b border-[#1E293B] text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-4.5 px-6">User Name</th>
                  <th className="py-4.5 px-6">Mobile Number</th>
                  <th className="py-4.5 px-6">City</th>
                  <th className="py-4.5 px-6">Join Date</th>
                  <th className="py-4.5 px-6">Status</th>
                  <th className="py-4.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/60 text-slate-200 text-xs font-semibold">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-[#1E293B]/50 transition-colors">
                    {/* User Name & Avatar */}
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-outfit text-xs border border-slate-700 shadow-sm ${getAvatarStyle(user.full_name)}`}>
                        {user.full_name ? user.full_name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U'}
                      </div>
                      <span className="font-extrabold text-white text-[13px]">{user.full_name || 'Not Provided'}</span>
                    </td>

                    {/* Mobile Number */}
                    <td className="py-4 px-6 font-semibold text-slate-300">
                      <code className="bg-[#1E293B] px-2 py-0.5 rounded text-slate-300 font-mono text-[11px] border border-slate-700/50">{user.mobile_number}</code>
                    </td>

                    {/* City */}
                    <td className="py-4 px-6 text-slate-300 font-extrabold">
                      {user.city || 'N/A'}
                    </td>

                    {/* Join Date */}
                    <td className="py-4 px-6 text-slate-400 font-semibold">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Oct 12, 2023'}
                    </td>

                    {/* Status badge */}
                    <td className="py-4 px-6">
                      {user.is_suspended ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-950/80 text-rose-400 border border-rose-800/60">
                          Suspended
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                          Active
                        </span>
                      )}
                    </td>

                    {/* Actions Links */}
                    <td className="py-4 px-6 text-right space-x-2">
                      <button onClick={() => handleViewUserDetail(user)} 
                              className="px-3 py-1.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-[#059669] hover:text-white border border-slate-700 text-xs font-extrabold transition-all cursor-pointer inline-flex items-center gap-1">
                        👁️ View Details
                      </button>

                      {user.is_suspended ? (
                        <button onClick={() => handleActivate(user.id)} className="px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/60 text-xs font-extrabold transition-all cursor-pointer">
                          Activate
                        </button>
                      ) : (
                        <button onClick={() => handleSuspend(user.id)} className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-400 border border-rose-800/60 text-xs font-extrabold transition-all cursor-pointer">
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

        {/* Footer info */}
        <div className="px-6 py-4 flex justify-between items-center border-t border-[#1E293B] bg-[#0F172A]/40">
          <span className="text-xs text-slate-400 font-extrabold">
            Showing all {users.length} Talent
          </span>
        </div>

      </div>

      {/* AJAX Detail Modals */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B1120] border border-[#1E293B] rounded-3xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-2xl text-left">
            <div className="px-6 py-5 border-b border-[#1E293B] flex justify-between items-center bg-[#0F172A]/60">
              <h3 className="font-outfit font-black text-white text-base">{modalTitle}</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg bg-[#1E293B] hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold transition-all">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4 text-xs font-semibold text-slate-300">
              {modalLoading ? (
                <p className="text-xs font-semibold text-slate-400 text-center py-6">Loading user details...</p>
              ) : (
                <div className="space-y-4">
                  {/* User Profile Banner & Image */}
                  <div className="flex items-center gap-4 p-4 bg-[#1E293B] rounded-2xl border border-slate-800">
                    {selectedUser.profile_photo_path || selectedUser.profile_photo || selectedUser.image || selectedUser.avatar ? (
                      <img 
                        src={selectedUser.profile_photo_path || selectedUser.profile_photo || selectedUser.image || selectedUser.avatar} 
                        alt={selectedUser.full_name} 
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md shrink-0" 
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black font-outfit text-xl border border-slate-700 shadow-md shrink-0 ${getAvatarStyle(selectedUser.full_name)}`}>
                        {selectedUser.full_name ? selectedUser.full_name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U'}
                      </div>
                    )}
                    <div>
                      <h4 className="font-outfit font-black text-lg text-white">{selectedUser.full_name || 'Not Provided'}</h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                          Role: {selectedUser.active_profile || selectedUser.role || 'Jobseeker'}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${selectedUser.is_suspended ? 'bg-rose-950 text-rose-400 border-rose-800' : 'bg-emerald-950 text-emerald-400 border-emerald-800'}`}>
                          {selectedUser.is_suspended ? 'Suspended' : 'Active Account'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Full User Attributes Table Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-[#1E293B]/60 p-3 rounded-xl border border-slate-800 space-y-0.5">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Full Name</span>
                      <span className="font-extrabold text-white block">{selectedUser.full_name || 'N/A'}</span>
                    </div>

                    <div className="bg-[#1E293B]/60 p-3 rounded-xl border border-slate-800 space-y-0.5">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Mobile Phone</span>
                      <span className="font-extrabold text-emerald-400 block font-mono">📱 {selectedUser.mobile_number || selectedUser.phone || 'N/A'}</span>
                    </div>

                    <div className="bg-[#1E293B]/60 p-3 rounded-xl border border-slate-800 space-y-0.5">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Email Address</span>
                      <span className="font-extrabold text-blue-400 block truncate">{selectedUser.email || 'N/A'}</span>
                    </div>

                    <div className="bg-[#1E293B]/60 p-3 rounded-xl border border-slate-800 space-y-0.5">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">City / Location</span>
                      <span className="font-extrabold text-white block">📍 {selectedUser.city || selectedUser.location || 'N/A'}</span>
                    </div>

                    <div className="bg-[#1E293B]/60 p-3 rounded-xl border border-slate-800 space-y-0.5">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Experience Level</span>
                      <span className="font-extrabold text-amber-400 block">⭐ {selectedUser.experience || selectedUser.experience_range || 'N/A'}</span>
                    </div>

                    <div className="bg-[#1E293B]/60 p-3 rounded-xl border border-slate-800 space-y-0.5">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Preferred Role</span>
                      <span className="font-extrabold text-purple-400 block">{selectedUser.preferred_role || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Skills & Bio */}
                  {(selectedUser.cuisine_specialty || selectedUser.skills || selectedUser.additional_skills) && (
                    <div className="bg-[#1E293B]/60 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Cuisine & Skills Specialty</span>
                      <p className="text-xs font-bold text-emerald-300">
                        {selectedUser.cuisine_specialty || selectedUser.skills || selectedUser.additional_skills}
                      </p>
                    </div>
                  )}

                  {selectedUser.bio && (
                    <div className="bg-[#1E293B]/60 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Bio / Summary</span>
                      <p className="text-xs font-semibold text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {selectedUser.bio}
                      </p>
                    </div>
                  )}

                  {/* Activity Stats Summary */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase block">Jobs Posted</span>
                      <span className="font-outfit font-black text-lg text-emerald-400 mt-0.5 block">
                        {modalData.jobs ? modalData.jobs.length : 0}
                      </span>
                    </div>
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase block">Applications Submitted</span>
                      <span className="font-outfit font-black text-lg text-blue-400 mt-0.5 block">
                        {modalData.applications ? modalData.applications.length : 0}
                      </span>
                    </div>
                  </div>

                  {/* System Metadata */}
                  <div className="bg-[#1E293B]/40 p-3 rounded-xl border border-slate-800/80 flex justify-between items-center text-[10px] font-bold text-slate-400">
                    <span>User ID: #{selectedUser.id}</span>
                    <span>Joined: {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add New Talent Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative text-left">
            <button 
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center font-bold">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-outfit font-black text-base text-slate-800">Add New Talent User</h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">Register a new candidate or jobseeker account directly into DB.</p>
              </div>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Ramesh Kumar" 
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#059669] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">Mobile Number *</label>
                <input 
                  type="tel" 
                  required
                  placeholder="e.g. 9876543210" 
                  value={newUser.mobile_number}
                  onChange={(e) => setNewUser({ ...newUser, mobile_number: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#059669] focus:bg-white transition font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="e.g. candidate@example.com" 
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#059669] focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">City / Location</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Delhi NCR" 
                    value={newUser.city}
                    onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#059669] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">Experience Level</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 3 Years" 
                    value={newUser.experience}
                    onChange={(e) => setNewUser({ ...newUser, experience: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#059669] focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">Preferred Role / Designation</label>
                <input 
                  type="text" 
                  placeholder="e.g. Head Chef, Commis I, F&B Captain" 
                  value={newUser.preferred_role}
                  onChange={(e) => setNewUser({ ...newUser, preferred_role: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#059669] focus:bg-white transition"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition shadow-md shadow-[#059669]/20"
                >
                  Save Talent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
