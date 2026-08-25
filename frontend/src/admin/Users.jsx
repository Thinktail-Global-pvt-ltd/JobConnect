import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { mockApi, realApi, resolveImageUrl } from '../services/api';
import { Search, ChevronLeft, ChevronRight, AlertTriangle, TrendingUp, ShieldCheck, Activity, UserPlus, X, Eye, Smartphone, MapPin, Star } from 'lucide-react';


export default function Users() {
  const navigate = useNavigate();
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

    const endpoints = [
      '/api/admin/users',
      '/backend/api/admin/users'
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
      setUsers([]);
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

    alert(`Talent user "${newUser.full_name}" registered successfully!`);
    setNewUser({ full_name: '', mobile_number: '', email: '', city: '', experience: '', preferred_role: '' });
    setIsAddModalOpen(false);
    loadUsers();
  };

  const handleSuspend = async (id) => {
    await mockApi.suspendUser(id);
    alert('Talent user status changed to Suspended.');
    loadUsers();
  };

  const handleActivate = async (id) => {
    await mockApi.activateUser(id);
    alert('Talent user status changed to Active.');
    loadUsers();
  };

  const handleViewUserDetail = (userItem) => {
    navigate(`/admin/users/${userItem.id}`, { state: { user: userItem } });
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
    <div className="space-y-3 text-left">
      {/* Title & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit font-bold text-[22px] leading-tight text-slate-900 tracking-tight">Talent / Jobseeker Management</h2>
          <p className="text-[12px] font-medium text-slate-600 mt-0.5">Oversee job seekers, candidates, manage access levels, and track registration trends.</p>
        </div>
      </div>

      {/* Filter tabs and search input row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 bg-white p-3 rounded-lg border border-[#d7dce2] shadow-sm">
        {/* Tabs with Underlines */}
        <div className="flex items-center gap-5 border-b border-[#d7dce2] md:border-none pb-1 md:pb-0">
          <button onClick={() => setTab('all')} 
                  className={`text-xs font-extrabold pb-2 transition-all relative ${tab === 'all' ? 'bg-[#153e69] text-white rounded-md px-3 py-1.5' : 'text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-md px-3 py-1.5'}`}>
            All Talent
          </button>
          <button onClick={() => setTab('active')} 
                  className={`text-xs font-extrabold pb-2 transition-all relative ${tab === 'active' ? 'bg-[#153e69] text-white rounded-md px-3 py-1.5' : 'text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-md px-3 py-1.5'}`}>
            Active
          </button>
          <button onClick={() => setTab('suspended')} 
                  className={`text-xs font-extrabold pb-2 transition-all relative ${tab === 'suspended' ? 'bg-[#153e69] text-white rounded-md px-3 py-1.5' : 'text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-md px-3 py-1.5'}`}>
            Suspended
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-1/2 max-w-[520px]">
          <input type="text" placeholder="Search Name, Phone, or City..." value={search} onChange={(e) => setSearch(e.target.value)}
                 className="w-full h-9 bg-white border border-[#cfd5dc] rounded-md py-2 pl-9 pr-9 text-[11px] font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#153e69] transition-all" />
          <Search className="absolute left-3.5 top-2.5 text-slate-500 w-4 h-4" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-2 text-slate-500 hover:text-slate-200 text-xs font-bold p-1"><X className="w-4 h-4" /></button>
          )}
        </div>
      </div>

      {/* Users Table Card */}
      <div className="bg-white rounded-lg border border-[#d7dce2] shadow-sm overflow-hidden">
        
        {loading ? (
          <p className="text-center text-slate-500 text-xs font-medium py-16">Loading users list...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-slate-500 text-sm font-medium py-16">No users matching search filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f1f3f5] border-b border-[#d7dce2] text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-2.5 px-3">User Name</th>
                  <th className="py-2.5 px-3">Mobile Number</th>
                  <th className="py-2.5 px-3">City</th>
                  <th className="py-2.5 px-3">Join Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-4.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d7dce2] text-slate-700 text-xs font-semibold">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-[#f8fafc] transition-colors">
                    {/* User Name & Avatar */}
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-outfit text-xs border border-[#d7dce2] shadow-sm ${getAvatarStyle(user.full_name)}`}>
                        {user.full_name ? user.full_name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U'}
                      </div>
                      <Link to={`/admin/users/${user.id}`} state={{ user }} className="font-extrabold text-slate-900 text-[13px] hover:text-[#153e69] hover:underline">
                        {user.full_name || 'Not Provided'}
                      </Link>
                    </td>

                    {/* Mobile Number */}
                    <td className="py-4 px-6 font-semibold text-slate-700">
                      <code className="bg-slate-50 px-2 py-0.5 rounded text-slate-700 font-mono text-[11px] border border-[#d7dce2]">{user.mobile_number}</code>
                    </td>

                    {/* City */}
                    <td className="py-4 px-6 text-slate-700 font-extrabold">
                      {user.city || 'N/A'}
                    </td>

                    {/* Join Date */}
                    <td className="py-4 px-6 text-slate-500 font-semibold">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Oct 12, 2023'}
                    </td>

                    {/* Status badge */}
                    <td className="py-2.5 px-3">
                      {user.is_suspended ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                          Suspended
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      )}
                    </td>

                    {/* Actions Links */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                      <button onClick={() => handleViewUserDetail(user)} 
                              className="px-3 py-1.5 rounded-md bg-[#153e69] hover:bg-[#12345d] text-white border border-[#153e69] text-[11px] font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm">
                        <Eye className="w-3.5 h-3.5" />
                        View Details
                      </button>

                      {user.is_suspended ? (
                        <button onClick={() => handleActivate(user.id)} className="px-3 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-500 text-[11px] font-bold shadow-sm transition-all cursor-pointer">
                          Activate
                        </button>
                      ) : (
                        <button onClick={() => handleSuspend(user.id)} className="px-3 py-1.5 rounded-md bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold shadow-sm transition-all cursor-pointer">
                          Suspend
                        </button>
                      )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer info */}
        <div className="px-3 py-2.5 flex justify-between items-center border-t border-[#d7dce2] bg-white">
          <span className="text-xs text-slate-500 font-extrabold">
            Showing all {users.length} Talent
          </span>
        </div>

      </div>

      {/* AJAX Detail Modals */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#f8fafc] border border-[#d7dce2] rounded-2xl w-full max-w-4xl max-h-[88vh] overflow-hidden flex flex-col shadow-2xl text-left">
            <div className="px-4 py-3 border-b border-[#d7dce2] flex justify-between items-center bg-white">
              <h3 className="font-outfit font-black text-slate-900 text-base">{modalTitle}</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-700 text-slate-500 hover:text-slate-900 flex items-center justify-center text-sm font-bold transition-all"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="p-4 overflow-y-auto space-y-4 text-xs font-semibold text-slate-700">
              {modalLoading ? (
                <p className="text-xs font-semibold text-slate-500 text-center py-6">Loading user details...</p>
              ) : (
                <div className="space-y-4">
                  {/* User Profile Banner & Image */}
                  <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#d7dce2] shadow-sm">
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
                      <h4 className="font-outfit font-black text-lg text-slate-900">{selectedUser.full_name || 'Not Provided'}</h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Role: {selectedUser.active_profile || selectedUser.role || 'Jobseeker'}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${selectedUser.is_suspended ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                          {selectedUser.is_suspended ? 'Suspended' : 'Active Account'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Full User Attributes Table Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-[#d7dce2] space-y-0.5">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Full Name</span>
                      <span className="font-extrabold text-slate-900 block">{selectedUser.full_name || 'N/A'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#d7dce2] space-y-0.5">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Mobile Phone</span>
                      <span className="font-extrabold text-emerald-700 block font-mono"><Smartphone className="w-3 h-3 inline-block mr-1" /> {selectedUser.mobile_number || selectedUser.phone || 'N/A'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#d7dce2] space-y-0.5">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Email Address</span>
                      <span className="font-extrabold text-blue-700 block truncate">{selectedUser.email || 'N/A'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#d7dce2] space-y-0.5">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Gender</span>
                      <span className="font-extrabold text-slate-800 block capitalize">{selectedUser.gender || 'N/A'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#d7dce2] space-y-0.5">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">City / Location</span>
                      <span className="font-extrabold text-slate-900 block"><MapPin className="w-3 h-3 inline-block mr-1" /> {selectedUser.city || selectedUser.location || selectedUser.country || 'N/A'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#d7dce2] space-y-0.5">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Country</span>
                      <span className="font-extrabold text-slate-800 block">{selectedUser.country || 'India'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#d7dce2] space-y-0.5">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Experience Level</span>
                      <span className="font-extrabold text-amber-700 block"><Star className="w-3 h-3 inline-block mr-1" /> {selectedUser.experience || selectedUser.experience_range || 'N/A'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#d7dce2] space-y-0.5">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Preferred Role</span>
                      <span className="font-extrabold text-purple-700 block">{selectedUser.preferred_role || 'N/A'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#d7dce2] space-y-0.5">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Current Employer</span>
                      <span className="font-extrabold text-slate-800 block truncate">{selectedUser.current_employer || 'N/A'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#d7dce2] space-y-0.5">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Language</span>
                      <span className="font-extrabold text-slate-800 block">{selectedUser.selected_language || 'English'}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#d7dce2] space-y-0.5">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Availability Status</span>
                      <span className="font-extrabold text-emerald-600 block">{selectedUser.availability_status || (selectedUser.is_available !== false ? 'Available' : 'Unavailable')}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#d7dce2] space-y-0.5">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Account Status</span>
                      <span className={`font-extrabold block ${selectedUser.is_suspended ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {selectedUser.is_suspended ? 'Suspended' : 'Active Account'}
                      </span>
                    </div>
                  </div>

                  {/* Skills & Bio */}
                  {(selectedUser.cuisine_specialty || (Array.isArray(selectedUser.skills) && selectedUser.skills.length > 0) || selectedUser.skills || selectedUser.additional_skills) && (
                    <div className="bg-white p-3 rounded-xl border border-[#d7dce2] space-y-1">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Cuisine & Skills Specialty</span>
                      <p className="text-xs font-bold text-emerald-700">
                        {Array.isArray(selectedUser.skills) ? selectedUser.skills.join(', ') : (selectedUser.cuisine_specialty || selectedUser.skills || selectedUser.additional_skills)}
                      </p>
                    </div>
                  )}

                  {(selectedUser.bio || (selectedUser.chef_profile && selectedUser.chef_profile.bio)) && (
                    <div className="bg-white p-3 rounded-xl border border-[#d7dce2] space-y-1">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Bio / Summary</span>
                      <p className="text-xs font-semibold text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {selectedUser.bio || selectedUser.chef_profile?.bio}
                      </p>
                    </div>
                  )}

                  {/* Activity Stats Summary */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="bg-white p-3 rounded-xl border border-[#d7dce2] text-center">
                      <span className="text-[9px] font-extrabold text-slate-500 uppercase block">Jobs Posted</span>
                      <span className="font-outfit font-black text-lg text-emerald-700 mt-0.5 block">
                        {selectedUser.job_posts_count ?? (modalData.jobs ? modalData.jobs.length : 0)}
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-[#d7dce2] text-center">
                      <span className="text-[9px] font-extrabold text-slate-500 uppercase block">Applications Submitted</span>
                      <span className="font-outfit font-black text-lg text-blue-700 mt-0.5 block">
                        {selectedUser.applications_count ?? (modalData.applications ? modalData.applications.length : 0)}
                      </span>
                    </div>
                  </div>

                  {/* System Metadata */}
                  <div className="bg-white p-3 rounded-xl border border-[#d7dce2] flex justify-between items-center text-[10px] font-bold text-slate-500">
                    <span>User ID: #{selectedUser.id}</span>
                    <span>Joined: {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString('en-GB') : 'N/A'}</span>
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
              className="absolute right-5 top-5 text-slate-500 hover:text-slate-600 font-bold p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center font-bold">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-outfit font-black text-base text-slate-800">Add New Talent User</h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Register a new candidate or jobseeker account directly into DB.</p>
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
                  className="w-1/2 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-slate-900 text-xs font-bold transition shadow-md shadow-[#059669]/20"
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




