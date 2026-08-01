import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Eye, X, Building2, Plus } from 'lucide-react';
import { realApi, mockDb } from '../services/api';

export default function Employers() {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for Add Employer
  const [newEmployer, setNewEmployer] = useState({
    name: '',
    contact: '',
    phone: '',
    email: '',
    hq: '',
  });

  // Fetch real employers from backend — GET /api/admin/employers
  const fetchEmployers = async () => {
    try {
      setLoading(true);
      // Try via Vite proxy first (local dev), then /backend/ fallback (production)
      let res = null;
      try {
        res = await realApi.get('/api/admin/employers', { params: { search, tab } });
      } catch (e) {}
      if (!res || !res.data || !res.data.success) {
        try {
          const axios = (await import('axios')).default;
          res = await axios.get('/backend/api/admin/employers', { params: { search, tab } });
        } catch (e) {}
      }
      if (!res || !res.data || !res.data.success) {
        try {
          const axios = (await import('axios')).default;
          res = await axios.get('http://178.16.138.159/backend/api/admin/employers', { params: { search, tab } });
        } catch (e) {}
      }

      if (res && res.data && res.data.success && Array.isArray(res.data.employers)) {
        setEmployers(res.data.employers);
        return;
      }
    } catch (e) {
      console.error('fetchEmployers failed:', e);
    } finally {
      setLoading(false);
    }
    setEmployers([]);
  };

  useEffect(() => {
    fetchEmployers();
  }, []);

  // Filter employers based on search
  const filteredEmployers = employers.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.contact.toLowerCase().includes(search.toLowerCase()) ||
    emp.phone.includes(search) ||
    emp.hq.toLowerCase().includes(search.toLowerCase())
  );

  // Handle Add New Employer Submit
  const handleAddEmployer = (e) => {
    e.preventDefault();
    if (!newEmployer.name || !newEmployer.phone || !newEmployer.contact) {
      alert('Please fill in all required fields (Company Name, Contact Person, Mobile Number).');
      return;
    }

    const createdItem = {
      id: String(Date.now()),
      name: newEmployer.name,
      hq: newEmployer.hq || 'India',
      contact: newEmployer.contact,
      phone: newEmployer.phone,
      email: newEmployer.email,
      posted_count: 0,
      status: 'Active',
      created_at: new Date().toISOString()
    };

    // Add at VERY TOP (Index 0)
    setEmployers([createdItem, ...employers]);

    // Also persist to mockDb for continuity
    const currentUsers = mockDb.getUsers();
    mockDb.setUsers([
      {
        id: createdItem.id,
        full_name: createdItem.contact,
        email: createdItem.email,
        mobile_number: createdItem.phone,
        city: createdItem.hq,
        current_employer: createdItem.name,
        role_type: 'employer',
        is_suspended: false,
        created_at: createdItem.created_at
      },
      ...currentUsers
    ]);

    // Reset Form & Close Modal
    setNewEmployer({ name: '', contact: '', phone: '', email: '', hq: '' });
    setIsModalOpen(false);
    alert(`Employer account for "${createdItem.name}" has been created successfully!`);
  };

  // Toggle Suspend / Activate
  const toggleSuspend = (id) => {
    setEmployers(employers.map(emp => {
      if (emp.id === id) {
        const nextStatus = emp.status === 'Active' ? 'Suspended' : 'Active';
        return { ...emp, status: nextStatus };
      }
      return emp;
    }));
  };

  const activePartnersCount = employers.filter(e => e.status === 'Active').length;

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit font-black text-2xl text-white tracking-tight">Employers Management</h2>
          <p className="text-xs font-semibold text-slate-400 mt-1">Oversee platform employers, verification states, and job posting analytics.</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input 
            type="text" 
            placeholder="Search employers, regions, or status..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1E293B] border border-slate-700/60 rounded-xl py-2 pl-10 pr-4 text-xs font-medium text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#059669] transition-all" 
          />
          <span className="absolute left-3.5 top-2.5 text-slate-400 text-xs">🔍</span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Growth Overview */}
        <div className="lg:col-span-2 bg-[#0B1120] p-6 rounded-3xl border border-[#1E293B] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[140px] text-left">
          <div>
            <h3 className="font-outfit font-black text-lg text-emerald-400 leading-none">Growth Overview</h3>
            <span className="text-[10px] font-bold text-slate-400 mt-1 block">Total active employers registered on JobRito platform.</span>
          </div>

          <div className="flex items-center gap-12 mt-6">
            <div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Active Partners</span>
              <span className="font-outfit font-black text-3xl text-white mt-0.5 block">{activePartnersCount}</span>
            </div>
            <div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Total Employers</span>
              <span className="font-outfit font-black text-3xl text-white mt-0.5 block">{employers.length}</span>
            </div>
          </div>

          <div className="absolute right-6 bottom-4 text-[#1E293B]/60 text-7xl select-none font-black font-mono pointer-events-none">
            📈
          </div>
        </div>

        {/* Right Priority Actions */}
        <div className="bg-[#059669] p-6 rounded-3xl shadow-2xl text-white flex flex-col justify-between min-h-[140px] text-left">
          <div>
            <h3 className="font-outfit font-black text-base leading-none">Priority Actions</h3>
            <span className="text-[10px] font-bold text-emerald-100 mt-1 block">Platform employer verification active</span>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-[#064e3b] hover:bg-[#065f46] text-white rounded-xl py-2.5 text-xs font-black transition-all mt-4 flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            <span>🛡️</span>
            + Onboard New Employer
          </button>
        </div>

      </div>

      {/* Employer Directory Table Card */}
      <div className="bg-[#0B1120] rounded-3xl border border-[#1E293B] shadow-2xl overflow-hidden">
        
        {/* Table Header Filter & Add Button Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border-b border-[#1E293B] bg-[#0F172A]/40">
          <div className="flex items-center gap-3">
            <h3 className="font-outfit font-black text-sm text-white">Employer Directory</h3>
            <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Global Access</span>
            <span className="bg-blue-950/80 text-blue-400 border border-blue-800/60 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Premium Tier</span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#059669] hover:bg-[#047857] text-white rounded-xl px-4 py-2 text-xs font-extrabold shadow-lg shadow-[#059669]/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Employer
            </button>
          </div>
        </div>

        {/* Directory Table list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F172A] border-b border-[#1E293B] text-[11px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Business Name</th>
                <th className="py-4 px-6">Contact Person</th>
                <th className="py-4 px-6">Mobile Number</th>
                <th className="py-4 px-6">Jobs Posted</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60 text-slate-200 text-xs font-semibold">
              {filteredEmployers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                    No matching employer accounts found. Click "+ Add Employer" to onboard a new company.
                  </td>
                </tr>
              ) : (
                filteredEmployers.map(emp => (
                  <tr key={emp.id} className="hover:bg-[#1E293B]/50 transition-colors">
                    
                    {/* Business Name with avatar */}
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-950 text-blue-400 border border-blue-800/60 flex items-center justify-center font-black font-outfit text-xs shadow-sm shrink-0">
                          {emp.name ? emp.name[0].toUpperCase() : 'E'}
                        </div>
                        <div>
                          <span className="font-extrabold text-white text-[13px] block leading-tight">{emp.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5">📍 {emp.hq}</span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Person */}
                    <td className="py-4.5 px-6 font-extrabold text-slate-200">
                      {emp.contact}
                    </td>

                    {/* Mobile number */}
                    <td className="py-4.5 px-6 font-semibold text-slate-300">
                      <code className="bg-[#1E293B] px-2 py-0.5 rounded text-slate-300 font-mono text-[11px] border border-slate-700/50">{emp.phone}</code>
                    </td>

                    {/* Jobs Posted count */}
                    <td className="py-4.5 px-6 text-emerald-400 font-extrabold">
                      📄 {emp.posted_count || 0}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4.5 px-6">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                        emp.status === 'Active'
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                          : 'bg-rose-950/80 text-rose-400 border-rose-800/60'
                      }`}>
                        {emp.status}
                      </span>
                    </td>

                    {/* Actions Links */}
                    <td className="py-4.5 px-6 text-center space-x-2">
                      <Link 
                        to={`/admin/employers/${emp.id}`}
                        className="px-3 py-1.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-extrabold transition-all inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>

                      <button 
                        onClick={() => toggleSuspend(emp.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                          emp.status === 'Active'
                            ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-400 border-rose-800/60'
                            : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 border-emerald-800/60'
                        }`}
                      >
                        {emp.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer (Showing ALL entries — NO PAGINATION) */}
        <div className="px-6 py-4 flex justify-between items-center border-t border-[#1E293B] bg-[#0F172A]/40">
          <span className="text-xs text-slate-400 font-extrabold">
            Showing all {filteredEmployers.length} Employers
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            All Employers Loaded At Once
          </span>
        </div>
      </div>

      {/* Add Employer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative text-left">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 font-bold"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-outfit font-extrabold text-base text-slate-800">Add New Employer</h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">Onboard a new employer account directly.</p>
              </div>
            </div>

            <form onSubmit={handleAddEmployer} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Company / Business Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Taj Hotels & Resorts" 
                  value={newEmployer.name}
                  onChange={(e) => setNewEmployer({ ...newEmployer, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#059669] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Contact Person Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Rahul Sharma" 
                  value={newEmployer.contact}
                  onChange={(e) => setNewEmployer({ ...newEmployer, contact: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#059669] focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Mobile Number *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 9876543210" 
                    value={newEmployer.phone}
                    onChange={(e) => setNewEmployer({ ...newEmployer, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#059669] focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Location / HQ City</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Mumbai, India" 
                    value={newEmployer.hq}
                    onChange={(e) => setNewEmployer({ ...newEmployer, hq: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#059669] focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="e.g. hr@company.com" 
                  value={newEmployer.email}
                  onChange={(e) => setNewEmployer({ ...newEmployer, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#059669] focus:bg-white transition"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs shadow transition cursor-pointer"
                >
                  Create Employer Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
