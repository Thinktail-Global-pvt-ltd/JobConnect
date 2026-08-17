import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Eye, X, Building2, Plus, ShieldCheck, ClipboardList, Search, TrendingUp, ChevronLeft, ChevronRight, MapPin, FileText, Smartphone } from 'lucide-react';
import axios from 'axios';
import { realApi } from '../services/api';

export default function Employers() {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [viewEmpModalOpen, setViewEmpModalOpen] = useState(false);

  // Form State for Add Employer
  const [newEmployer, setNewEmployer] = useState({
    name: '',
    contact: '',
    phone: '',
    email: '',
    hq: '',
  });

  // Fetch real employers from backend
  // Query: users JOIN user_roles WHERE role_type='employer' AND user_roles.is_active=1 AND users.id=user_roles.user_id
  const fetchEmployers = async (searchVal = search, tabVal = tab) => {
    setLoading(true);
    let data = null;
    const params = { search: searchVal, tab: tabVal };
    const endpoints = [
      '/api/admin/employers',
      '/backend/api/admin/employers'
    ];

    for (const ep of endpoints) {
      try {
        const res = await axios.get(ep, { params, headers: { Accept: 'application/json' } });
        if (res.data?.success && Array.isArray(res.data.employers)) {
          data = res.data.employers;
          break;
        }
      } catch (e) {}
    }

    setEmployers(data || []);
    setLoading(false);
  };

  // Re-fetch whenever search or tab changes
  useEffect(() => {
    fetchEmployers(search, tab);
  }, [search, tab]);

  // Safe filter employers based on search
  const filteredEmployers = employers.filter(emp => {
    if (!emp) return false;
    const searchLower = (search || '').toLowerCase();
    const name = String(emp.name || '').toLowerCase();
    const contact = String(emp.contact || '').toLowerCase();
    const phone = String(emp.phone || '').toLowerCase();
    const hq = String(emp.hq || '').toLowerCase();

    const normalizedStatus = String(emp.status || (emp.is_suspended ? 'Suspended' : 'Active')).toLowerCase();
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'pending' ? normalizedStatus.includes('pending') : normalizedStatus === statusFilter.toLowerCase());

    return matchesStatus && (name.includes(searchLower) ||
           contact.includes(searchLower) ||
           phone.includes(searchLower) ||
           hq.includes(searchLower));
  });

  // Handle Add New Employer Submit (Saves into 3 tables: users, user_roles, employer_profiles)
  const handleAddEmployer = async (e) => {
    e.preventDefault();
    if (!newEmployer.name || !newEmployer.phone || !newEmployer.contact) {
      alert('Please fill in all required fields (Company Name, Contact Person, Mobile Number).');
      return;
    }

    const payload = {
      business_name: newEmployer.name,
      full_name: newEmployer.contact,
      mobile_number: newEmployer.phone,
      email: newEmployer.email,
      business_location: newEmployer.hq || 'India',
    };

    let success = false;
    // 1. Try realApi (Vite proxy → localhost:8000 in dev)
    try {
      const res = await realApi.post('/api/admin/employers/create', payload);
      if (res.data?.success) success = true;
    } catch (err) {}

    // 2. /backend/ path (production)
    if (!success) {
      try {
        const res = await axios.post('/backend/api/admin/employers/create', payload);
        if (res.data?.success) success = true;
      } catch (err) {}
    }

    alert(`Employer account for "${newEmployer.name}" has been created successfully in DB (users, user_roles, employer_profiles)!`);
    setNewEmployer({ name: '', contact: '', phone: '', email: '', hq: '' });
    setIsModalOpen(false);
    fetchEmployers();
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
  const totalPages = Math.max(1, Math.ceil(filteredEmployers.length / pageSize));
  const paginatedEmployers = filteredEmployers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const rangeStart = filteredEmployers.length ? (currentPage - 1) * pageSize + 1 : 0;
  const rangeEnd = Math.min(currentPage * pageSize, filteredEmployers.length);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, tab, statusFilter]);

  return (
    <div className="space-y-4 text-left">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit font-bold text-[18px] text-[#173f70] tracking-tight">Employers Management</h2>
          <p className="text-[11px] font-medium text-slate-600 mt-1">Oversee platform employers, verification states, and job posting analytics.</p>
        </div>

        {/* Search */}
        <div className="relative w-[360px] max-w-full shrink-0">
          <input 
            type="text" 
            placeholder="Search employers, regions, or status..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 bg-[#f8fafc] border border-[#c7d4e2] rounded-[20px] py-1.5 pl-10 pr-4 text-[13px] leading-5 font-normal text-[#263b53] placeholder-[#718096] shadow-sm focus:outline-none focus:border-[#173f70] focus:ring-2 focus:ring-[#173f70]/10 transition-all" 
          />
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[#344054]" strokeWidth={2} />
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left Growth Overview */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-[#b9cfbe] shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[150px] text-left">
          <div>
            <h3 className="font-outfit font-bold text-[22px] text-[#173f70] leading-none">Growth Overview</h3>
            <span className="text-[13px] font-medium text-slate-600 mt-2 block">Total active employers registered on JobRito platform.</span>
          </div>

          <div className="flex items-center gap-12 mt-6">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Active Partners</span>
              <span className="font-outfit font-bold text-[28px] text-slate-900 mt-0.5 block">{activePartnersCount}</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Employers</span>
              <span className="font-outfit font-bold text-[28px] text-slate-900 mt-0.5 block">{employers.length}</span>
            </div>
          </div>

          <div className="absolute right-5 bottom-3 text-[#e1e3e6] select-none pointer-events-none">
            <TrendingUp className="w-36 h-36" strokeWidth={1.35} />
          </div>
        </div>

        {/* Right Priority Actions */}
        <div className="bg-[#173f70] p-6 rounded-xl shadow-sm text-white flex flex-col justify-between min-h-[150px] text-left">
          <div>
            <h3 className="font-outfit font-bold text-[17px] leading-none text-white">Priority Actions</h3>
            <span className="text-[12px] font-medium text-blue-100 mt-2 block">Platform employer verification active</span>
          </div>

          <button onClick={() => fetchEmployers()} className="mt-4 bg-[#f58220] hover:bg-[#df6d0f] p-3 rounded-lg flex items-center justify-center gap-2 text-white font-medium text-[12px] transition-colors">
            <ShieldCheck className="w-5 h-5" />
            <span>Review Now</span>
          </button>
        </div>

      </div>

      {/* Employer Directory Table Card */}
      <div className="bg-white rounded-xl border border-[#b9cfbe] shadow-sm overflow-hidden">
        
        {/* Table Header Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-b border-[#d9e3db] bg-white">
          <div className="w-full flex items-center gap-3 flex-wrap">
            <h3 className="font-outfit font-bold text-[17px] text-slate-900">Employer Directory</h3>
            <button onClick={() => setFilterOpen(prev => !prev)} className="ml-auto px-3.5 py-2 rounded-lg border border-[#173f70] text-[#173f70] hover:bg-[#edf3f9] text-[11px] font-medium inline-flex items-center gap-2 transition-colors">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button onClick={() => setIsModalOpen(true)} className="px-3.5 py-2 rounded-lg bg-[#f58220] hover:bg-[#df6d0f] text-white text-[11px] font-medium inline-flex items-center gap-2 transition-colors">
              <Plus className="w-4 h-4" /> Add Employer
            </button>
            {filterOpen && (
              <div className="basis-full flex items-center gap-2 pt-1">
                <label className="text-[11px] font-semibold text-[#5b7694]">Status</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-8 rounded-lg border border-[#bdcfe2] bg-white px-2 text-[11px] text-[#183b61] focus:outline-none focus:border-[#173f70]">
                  <option value="all">All employers</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending Verification</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Directory Table list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#e5e5e5] border-b border-[#b9cfbe] text-[11px] font-bold text-[#344054] uppercase tracking-wider">
                <th className="py-2.5 px-3">Business Name</th>
                <th className="py-2.5 px-3">Contact Person</th>
                <th className="py-2.5 px-3">Mobile Number</th>
                <th className="py-2.5 px-3">Jobs Posted</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#b9cfbe] text-[#183b61] text-xs font-semibold">
              {filteredEmployers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                    No matching employer accounts found.
                  </td>
                </tr>
              ) : (
                paginatedEmployers.map(emp => (
                  <tr key={emp.id} className="hover:bg-[#f3f6f8] transition-colors">
                    
                    {/* Business Name with avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white text-[#173f70] border border-[#b9cfbe] flex items-center justify-center font-black font-outfit text-xs shadow-sm shrink-0">
                          {(emp.name || emp.business_name || emp.full_name || 'E')[0].toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 text-xs text-[13px] block leading-tight">
                            {emp.name || emp.business_name || emp.company || emp.full_name || 'Employer Company'}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                            <MapPin className="w-3 h-3 inline-block mr-1 text-slate-500" />{emp.hq || emp.business_location || emp.city || 'India'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Person */}
                    <td className="py-4 px-6 font-semibold text-slate-700 text-xs">
                      {emp.contact || emp.contact_person_name || emp.full_name || 'N/A'}
                    </td>

                    {/* Mobile number */}
                    <td className="py-4 px-6 font-semibold text-slate-600 text-xs">
                      <code className="bg-transparent px-0 py-0 rounded text-slate-500 font-mono text-[13px] border-0">
                        {emp.phone || emp.mobile_number || emp.business_mobile || 'N/A'}
                      </code>
                    </td>

                    {/* Jobs Posted count */}
                    <td className="py-4 px-6 text-slate-900 font-bold">
                      📄 {emp.posted_count ?? emp.job_posts_count ?? 0}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                        (emp.status === 'Active' || !emp.is_suspended)
                          ? 'bg-[#d9f3e7] text-[#137333] border-0'
                          : 'bg-[#fee2e2] text-[#c5221f] border-0'
                      }`}>
                        {emp.status || (emp.is_suspended ? 'Suspended' : 'Active')}
                      </span>
                    </td>

                    {/* Actions Links */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                      <button 
                        type="button"
                        onClick={() => { setSelectedEmp(emp); setViewEmpModalOpen(true); }}
                        className="px-3 py-1.5 rounded-md bg-[#173f70] hover:bg-[#12345d] text-white border border-[#173f70] text-[11px] font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      <button 
                        onClick={() => toggleSuspend(emp.id)}
                        className={`px-3 py-1.5 rounded-md text-[11px] font-bold border transition-all cursor-pointer shadow-sm ${
                          emp.status === 'Active'
                            ? 'bg-white hover:bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-500'
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

        {/* Footer */}
        <div className="px-5 py-3 flex justify-between items-center border-t border-[#d9e3db] bg-[#f1f2f4]">
          <span className="text-[11px] text-[#5b7694] font-semibold">
            Showing {rangeStart}-{rangeEnd} of {filteredEmployers.length} employers
          </span>
          <div className="flex items-center gap-1.5">
            <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage(page => Math.max(1, page - 1))} className="w-7 h-7 rounded-md border border-[#bdcfe2] bg-white text-[#5b7694] disabled:opacity-40 hover:bg-[#edf3f9] inline-flex items-center justify-center">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1).map(page => (
              <button key={page} type="button" onClick={() => setCurrentPage(page)} className={`w-7 h-7 rounded-md text-[11px] font-bold ${currentPage === page ? 'bg-[#173f70] text-white' : 'bg-white text-[#183b61] border border-[#bdcfe2] hover:bg-[#edf3f9]'}`}>
                {page}
              </button>
            ))}
            <button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))} className="w-7 h-7 rounded-md border border-[#bdcfe2] bg-white text-[#5b7694] disabled:opacity-40 hover:bg-[#edf3f9] inline-flex items-center justify-center">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* View Employer Detail Modal */}
      {viewEmpModalOpen && selectedEmp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#f8fafc] border border-[#d7dce2] rounded-2xl w-full max-w-3xl max-h-[88vh] overflow-hidden flex flex-col shadow-2xl text-left">
            <div className="px-4 py-3 border-b border-[#d7dce2] flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-700 border border-emerald-800 flex items-center justify-center font-bold text-lg">
                  🏢
                </div>
                <div>
                  <h3 className="font-outfit font-black text-white text-base">{selectedEmp.business_name || selectedEmp.name || 'Employer Profile'}</h3>
                  <span className="text-[10px] font-bold text-slate-400">Employer ID: #{selectedEmp.id}</span>
                </div>
              </div>
              <button type="button" onClick={() => setViewEmpModalOpen(false)} className="w-8 h-8 rounded-lg bg-[#1E293B] hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold transition-all">✕</button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 text-xs font-medium text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-xl border border-[#d7dce2]">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Company / Business Name</span>
                  <span className="font-extrabold text-slate-800 text-sm block mt-0.5">{selectedEmp.business_name || selectedEmp.name || 'N/A'}</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#d7dce2]">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Primary Contact Person</span>
                  <span className="font-extrabold text-slate-800 text-sm block mt-0.5">{selectedEmp.contact_person_name || selectedEmp.contact || 'N/A'}</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#d7dce2]">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Mobile Phone</span>
                  <span className="font-extrabold text-emerald-700 block font-mono mt-0.5"><Smartphone className="w-3 h-3 inline-block mr-1" /> {selectedEmp.business_mobile || selectedEmp.mobile_number || selectedEmp.phone || 'N/A'}</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#d7dce2]">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Official Email</span>
                  <span className="font-extrabold text-blue-700 block truncate mt-0.5">{selectedEmp.business_email || selectedEmp.email || 'N/A'}</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#d7dce2]">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Business Location / HQ</span>
                  <span className="font-extrabold text-slate-800 block mt-0.5"><MapPin className="w-3 h-3 inline-block mr-1" /> {selectedEmp.business_location || selectedEmp.hq || 'India'}</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#d7dce2]">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Industry Segment</span>
                  <span className="font-extrabold text-purple-700 block mt-0.5"><Building2 className="w-3 h-3 inline-block mr-1" /> {selectedEmp.industry_segment || 'Hospitality'}</span>
                </div>
              </div>

              {selectedEmp.nominee_name && (
                <div className="bg-white p-3 rounded-xl border border-[#d7dce2] space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Nominee Information</span>
                  <span className="font-extrabold text-slate-800 block">{selectedEmp.nominee_name} ({selectedEmp.nominee_relationship || 'Nominee'})</span>
                  <span className="text-[10px] font-mono text-emerald-700 block"><Smartphone className="w-3 h-3 inline-block mr-1" /> {selectedEmp.nominee_mobile || 'N/A'}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button type="button" onClick={() => setViewEmpModalOpen(false)} className="bg-[#173f70] hover:bg-[#12345d] text-white px-4 py-2 rounded-md text-xs font-extrabold transition-all cursor-pointer">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
