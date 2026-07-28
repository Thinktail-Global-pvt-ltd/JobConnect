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

  // Fetch real employers from backend or mock fallback
  const fetchEmployers = async () => {
    try {
      setLoading(true);
      // Attempt real API call
      const res = await realApi.get('/feed?filter=all');
      if (res.data && res.data.feed && res.data.feed.data) {
        const feedJobs = res.data.feed.data;
        const employerMap = new Map();

        feedJobs.forEach(item => {
          if (item.creator && !employerMap.has(item.creator.id)) {
            employerMap.set(item.creator.id, {
              id: String(item.creator.id),
              name: item.company || item.creator.current_employer || item.creator.full_name || 'Employer Company',
              hq: item.location || item.creator.city || 'India',
              contact: item.creator.full_name || 'Main Contact',
              phone: item.creator.mobile_number || 'N/A',
              email: item.creator.email || '',
              posted_count: 1,
              status: item.creator.is_suspended ? 'Suspended' : 'Active',
              created_at: item.creator.created_at || new Date().toISOString()
            });
          } else if (item.creator && employerMap.has(item.creator.id)) {
            const existing = employerMap.get(item.creator.id);
            existing.posted_count += 1;
          }
        });

        const list = Array.from(employerMap.values());
        if (list.length > 0) {
          // Sort latest top-first
          list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setEmployers(list);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.log('Real API unavailable, using dynamic state');
    }

    // Fallback to local dynamic state
    const stored = mockDb.getUsers().filter(u => u.role_type === 'employer' || u.role_type === 'agency');
    const mapped = stored.map(u => ({
      id: u.id,
      name: u.current_employer || u.full_name || 'Company Name',
      hq: u.city || 'India',
      contact: u.full_name,
      phone: u.mobile_number,
      email: u.email || '',
      posted_count: 1,
      status: u.is_suspended ? 'Suspended' : 'Active',
      created_at: u.created_at || new Date().toISOString()
    }));
    // Sort latest top-first
    mapped.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setEmployers(mapped);
    setLoading(false);
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
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit font-extrabold text-2xl text-slate-800">Employers Management</h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Oversee platform employers, verification states, and job posting analytics.</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input 
            type="text" 
            placeholder="Search employers, regions, or status..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#e2e8f0] rounded-lg py-2 pl-10 pr-4 text-xs font-medium text-slate-600 focus:outline-none focus:border-[#059669] transition-all" 
          />
          <span className="absolute left-3.5 top-2.5 text-slate-400 text-xs">🔍</span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Growth Overview */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px] text-left">
          <div>
            <h3 className="font-outfit font-extrabold text-lg text-emerald-800 leading-none">Growth Overview</h3>
            <span className="text-[10px] font-bold text-slate-400 mt-1 block">Total active employers registered on JobConnect platform.</span>
          </div>

          <div className="flex items-center gap-12 mt-6">
            <div>
              <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block">Active Partners</span>
              <span className="font-outfit font-extrabold text-2xl text-slate-800 mt-0.5 block">{activePartnersCount}</span>
            </div>
            <div>
              <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Employers</span>
              <span className="font-outfit font-extrabold text-2xl text-slate-800 mt-0.5 block">{employers.length}</span>
            </div>
          </div>

          <div className="absolute right-6 bottom-4 text-[#e2e8f0]/40 text-7xl select-none font-extrabold font-mono pointer-events-none">
            📈
          </div>
        </div>

        {/* Right Priority Actions */}
        <div className="bg-[#22c55e] p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between min-h-[140px] text-left">
          <div>
            <h3 className="font-outfit font-extrabold text-base leading-none">Priority Actions</h3>
            <span className="text-[10px] font-bold text-emerald-100 mt-1 block">Platform employer verification active</span>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-[#064e3b] hover:bg-[#065f46] text-white rounded-lg py-2.5 text-xs font-bold transition-all mt-4 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>🛡️</span>
            + Onboard New Employer
          </button>
        </div>

      </div>

      {/* Employer Directory Table Card */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        
        {/* Table Header Filter & Add Button Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-3">
            <h3 className="font-outfit font-extrabold text-sm text-slate-800">Employer Directory</h3>
            <span className="bg-emerald-50 text-[#059669] border border-emerald-100 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase">Global Access</span>
            <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase">Premium Tier</span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-4 py-2 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
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
              {filteredEmployers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                    No matching employer accounts found. Click "+ Add Employer" to onboard a new company.
                  </td>
                </tr>
              ) : (
                filteredEmployers.map(emp => (
                  <tr key={emp.id} className="hover:bg-slate-50/30 transition-colors">
                    
                    {/* Business Name with avatar */}
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#eff6ff] text-blue-600 border border-blue-100 flex items-center justify-center font-bold font-outfit text-xs shadow-sm shrink-0">
                          {emp.name ? emp.name[0].toUpperCase() : 'E'}
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-800 text-[13px] block leading-tight">{emp.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5">📍 {emp.hq}</span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Person */}
                    <td className="py-4.5 px-6 font-bold text-slate-700">
                      {emp.contact}
                    </td>

                    {/* Mobile number */}
                    <td className="py-4.5 px-6 font-semibold text-slate-500">
                      <code>{emp.phone}</code>
                    </td>

                    {/* Jobs Posted count */}
                    <td className="py-4.5 px-6 text-emerald-600 font-bold">
                      📄 {emp.posted_count || 0}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4.5 px-6">
                      <span className={`px-2.5 py-1 rounded text-[9px] font-extrabold uppercase tracking-wider border ${
                        emp.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        {emp.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4.5 px-6 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => toggleSuspend(emp.id)}
                          className={`text-xs font-extrabold px-3 py-1 rounded transition-all cursor-pointer ${
                            emp.status === 'Active'
                              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          {emp.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer (Showing ALL entries — NO PAGINATION) */}
        <div className="px-6 py-4 flex justify-between items-center border-t border-[#e2e8f0] bg-slate-50/10">
          <span className="text-xs text-slate-500 font-bold">
            Showing all {filteredEmployers.length} registered employers (No Pagination)
          </span>
          <span className="text-xs text-slate-400 font-semibold">
            Latest Top-First Order
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
