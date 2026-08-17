import React, { useState, useEffect } from 'react';
import { Download, Plus, Eye, Phone, MoreVertical, Check, X, ShieldAlert, Sparkles, ChevronLeft, ChevronRight, UserPlus, Filter, FileText } from 'lucide-react';
import { mockApi } from '../services/api';

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeEnquiry, setActiveEnquiry] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  // Dynamic stats calculated from real database entries
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    contacted: 0,
    highPriority: 0,
  });

  // Modal State for Manual Entry
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    program: 'Chef Internship - Dubai',
    query: '',
    priority: 'STANDARD',
    status: 'New Enquiry'
  });

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const res = await mockApi.getEnquiries(filterStatus);
      if (res && res.success && Array.isArray(res.enquiries)) {
        setEnquiries(res.enquiries);
        const total = res.enquiries.length;
        const pending = res.enquiries.filter(e => e.status === 'New Enquiry' || e.status === 'Urgent Follow-up').length;
        const contacted = res.enquiries.filter(e => e.status === 'Contacted').length;
        const highPriority = res.enquiries.filter(e => e.priority === 'HIGH PRIORITY' || e.priority === 'CRITICAL').length;

        setStats({
          total: res.stats?.total ?? total,
          pending: res.stats?.pending ?? pending,
          contacted: res.stats?.contacted ?? contacted,
          highPriority,
        });
      }
    } catch (e) {
      console.error('Failed to load enquiries:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    loadEnquiries();
  }, [filterStatus]);

  const totalPages = Math.max(1, Math.ceil(enquiries.length / pageSize));
  const paginatedEnquiries = enquiries.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenDrawer = (enquiry) => {
    setActiveEnquiry(enquiry);
    setDrawerOpen(true);
  };

  const handleMarkContacted = async (id) => {
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: 'Contacted' } : e));
    if (activeEnquiry?.id === id) {
      setActiveEnquiry(prev => ({ ...prev, status: 'Contacted' }));
    }
    try {
      await mockApi.updateEnquiryStatus(id, 'Contacted');
      loadEnquiries();
    } catch (e) {
      console.error('Failed to update enquiry status:', e);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name || !formData.phone || !formData.program) {
      setFormError('Please fill in Full Name, Phone Number, and Program.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await mockApi.createEnquiry(formData);
      if (res && res.success) {
        setIsModalOpen(false);
        setFormData({
          name: '',
          phone: '',
          email: '',
          program: 'Chef Internship - Dubai',
          query: '',
          priority: 'STANDARD',
          status: 'New Enquiry'
        });
        await loadEnquiries();
      } else {
        setFormError(res.message || 'Failed to save enquiry.');
      }
    } catch (err) {
      console.error('Manual entry failed:', err);
      setFormError('Error connecting to backend database.');
    } finally {
      setSubmitting(false);
    }
  };

  const exportCSV = () => {
    if (!enquiries.length) return;
    const headers = 'ID,Name,Email,Phone,Program,Status,Priority,Date,Query\n';
    const rows = enquiries.map(e => `"${e.id}","${e.name}","${e.email}","${e.phone}","${e.program}","${e.status}","${e.priority}","${e.date}","${(e.query || '').replace(/"/g, '""')}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enquiries_export_${Date.now()}.csv`;
    a.click();
  };

  const getAvatarColor = (name) => {
    const char = (name || 'E')[0].toUpperCase();
    if (['A','B','C','D'].includes(char)) return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    if (['E','F','G','H','M'].includes(char)) return 'bg-orange-50 text-orange-600 border-orange-200';
    if (['I','J','K','L'].includes(char)) return 'bg-[#ccfbf1] text-[#0f766e] border-[#99f6e4]';
    return 'bg-blue-50 text-blue-600 border-blue-200';
  };

  return (
    <div className="space-y-3 text-left relative overflow-hidden">
      
      {/* Breadcrumbs and Top Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-0.5">
          <div className="hidden">
            <span>Training & Overseas</span>
            <span>&gt;</span>
            <span className="text-slate-600">Enquiries</span>
          </div>
          <h2 className="font-outfit font-bold text-[22px] leading-tight text-slate-900">Enquiries Management</h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={exportCSV}
            className="bg-white border border-[#cfd5dc] rounded-md px-3 py-2 text-[11px] font-bold text-slate-700 flex items-center gap-1.5 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            Export CSV
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#f58220] hover:bg-[#df6d0f] text-white rounded-md px-3.5 py-2 text-[11px] font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Manual Entry</span>
          </button>
        </div>
      </div>

      {/* Dynamic KPI Cards Row (Calculated live from DB) */}
      <div className="grid grid-cols-4 gap-2.5">
        
        {/* Card 1: Total Enquiries */}
        <div className="bg-white p-3 rounded-lg border border-[#d7dce2] shadow-sm flex flex-col justify-between h-[82px]">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Enquiries</span>
          <div className="flex items-center justify-between mt-2">
            <span className="font-outfit font-bold text-xl text-slate-900 block">{stats.total}</span>
            <span className="bg-emerald-50 text-[#059669] border border-emerald-100 text-[9px] font-extrabold px-2 py-0.5 rounded-md">Live Records</span>
          </div>
        </div>

        {/* Card 2: Pending Response */}
        <div className="bg-white p-3 rounded-lg border border-[#d7dce2] shadow-sm flex flex-col justify-between h-[82px]">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Pending Response</span>
          <div className="flex items-center justify-between mt-2">
            <span className="font-outfit font-bold text-xl text-slate-900 block">{stats.pending}</span>
            <span className="bg-rose-50 text-rose-600 border border-rose-100 text-[8px] font-extrabold px-2 py-0.5 rounded-md">Needs Follow-up</span>
          </div>
        </div>

        {/* Card 3: Contacted Enquiries */}
        <div className="bg-white p-3 rounded-lg border border-[#d7dce2] shadow-sm flex flex-col justify-between h-[82px]">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Contacted</span>
          <div className="flex items-center justify-between mt-2">
            <span className="font-outfit font-bold text-xl text-slate-900 block">{stats.contacted}</span>
            <span className="bg-emerald-50 text-[#059669] border border-emerald-100 text-[8px] font-extrabold px-2 py-0.5 rounded-md">Completed</span>
          </div>
        </div>

        {/* Card 4: High Priority */}
        <div className="bg-white p-3 rounded-lg border border-[#d7dce2] shadow-sm flex flex-col justify-between h-[82px]">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">High Priority</span>
          <div className="flex items-center justify-between mt-2">
            <span className="font-outfit font-extrabold text-2xl text-purple-700 block">{stats.highPriority}</span>
            <span className="bg-purple-50 text-purple-600 border border-purple-100 text-[9px] font-extrabold px-2 py-0.5 rounded-md">Priority</span>
          </div>
        </div>

      </div>

      {/* Main Enquiries Table Card */}
      <div className="bg-white rounded-lg border border-[#d7dce2] shadow-sm overflow-hidden">
        
        {/* Navigation Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 border-b border-[#d7dce2] bg-white">
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border border-[#cfd5dc] rounded-md px-3 py-1.5 text-[11px] font-bold text-slate-700 focus:outline-none focus:border-[#173f70]"
            >
              <option value="all">Filter Status: All</option>
              <option value="New Enquiry">New Enquiry</option>
              <option value="Contacted">Contacted</option>
              <option value="Urgent Follow-up">Urgent Follow-up</option>
            </select>
          </div>

          <span className="text-xs text-slate-400 font-bold">Showing {enquiries.length} live database results</span>
        </div>

        {/* Directory Table list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-[#e2e8f0] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Mobile Number</th>
                <th className="py-2.5 px-3">Program Interested In</th>
                <th className="py-2.5 px-3">Date Submitted</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0] text-slate-700 text-xs font-semibold">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">Loading enquiries from database...</td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">No enquiries found in database. Click <b>+ Manual Entry</b> to add one.</td>
                </tr>
              ) : paginatedEnquiries.map(enq => (
                <tr key={enq.id} className="hover:bg-slate-50/30 transition-colors">
                  
                  {/* Name column */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-outfit text-xs border border-white shadow-sm ${getAvatarColor(enq.name)}`}>
                        {(enq.name || 'E').split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-800 text-[13px] block leading-tight">{enq.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{enq.email || 'No email provided'}</span>
                      </div>
                    </div>
                  </td>

                  {/* Mobile number */}
                  <td className="py-4.5 px-6 font-semibold text-slate-500">
                    <code>{enq.phone}</code>
                  </td>

                  {/* Program interested in */}
                  <td className="py-2.5 px-3">
                    <span className="bg-[#ccfbf1] text-[#0f766e] border border-[#99f6e4] text-[10px] font-extrabold px-2.5 py-0.5 rounded-xl">
                      {enq.program}
                    </span>
                  </td>

                  {/* Submitted Date */}
                  <td className="py-4.5 px-6 text-slate-400 font-bold">
                    {enq.date}
                  </td>

                  {/* Status Indicator */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${enq.status === 'Contacted' ? 'bg-slate-400' : (enq.status === 'Urgent Follow-up' ? 'bg-rose-500' : 'bg-emerald-500')}`} />
                      <span className={`${enq.status === 'Urgent Follow-up' ? 'text-rose-600' : 'text-slate-600'} font-bold`}>{enq.status}</span>
                    </div>
                  </td>

                  {/* Actions buttons */}
                  <td className="py-4.5 px-6 text-center">
                    <div className="flex items-center justify-center gap-3.5">
                      <button onClick={() => handleOpenDrawer(enq)} className="text-slate-400 hover:text-slate-600 cursor-pointer" title="Review">
                        <Eye className="w-4 h-4" />
                      </button>

                      {enq.status !== 'Contacted' ? (
                        <button onClick={() => handleMarkContacted(enq.id)} className="text-slate-400 hover:text-[#059669] cursor-pointer" title="Mark Contacted">
                          <Phone className="w-4 h-4" />
                        </button>
                      ) : (
                        <Check className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="px-3 py-2.5 flex flex-wrap justify-between items-center gap-2 border-t border-[#d7dce2] bg-white">
          <span className="text-[10px] text-slate-600 font-semibold">Showing {enquiries.length === 0 ? 0 : ((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, enquiries.length)} of {enquiries.length} enquiries</span>
          <div className="flex items-center gap-1">
            <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage(page => Math.max(1, page - 1))} className="w-6 h-6 rounded-md border border-[#d7dce2] bg-white text-slate-500 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">‹</button>
            {Array.from({ length: Math.min(totalPages, 3) }, (_, index) => index + 1).map(page => (
              <button key={page} type="button" onClick={() => setCurrentPage(page)} className={`w-6 h-6 rounded-md border text-[10px] font-bold cursor-pointer ${currentPage === page ? 'bg-[#173f70] border-[#173f70] text-white' : 'bg-white border-[#d7dce2] text-slate-700 hover:bg-slate-50'}`}>{page}</button>
            ))}
            {totalPages > 3 && <span className="px-1 text-[10px] text-slate-500">…</span>}
            {totalPages > 3 && <button type="button" onClick={() => setCurrentPage(totalPages)} className={`w-6 h-6 rounded-md border text-[10px] font-bold cursor-pointer ${currentPage === totalPages ? 'bg-[#173f70] border-[#173f70] text-white' : 'bg-white border-[#d7dce2] text-slate-700 hover:bg-slate-50'}`}>{totalPages}</button>}
            <button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))} className="w-6 h-6 rounded-md border border-[#d7dce2] bg-white text-slate-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">›</button>
          </div>
        </div>

      </div>
      {/* MANUAL ENTRY MODAL DIALOG */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-150 text-left">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center"><FileText className="w-4 h-4" /></span>
                <h3 className="font-outfit font-extrabold text-slate-800 text-base">New Enquiry Manual Entry</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleManualSubmit} className="p-6 space-y-4">
              
              {formError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                  <span>{formError}</span>
                </div>
              )}

              {/* Name & Phone Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Vikram Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mobile / Phone *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Email & Program Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="e.g. vikram@hospitality.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Program Interested In *</label>
                  <select 
                    value={formData.program}
                    onChange={(e) => setFormData(prev => ({ ...prev, program: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#059669]"
                  >
                    <option value="Chef Internship - Dubai">Chef Internship - Dubai</option>
                    <option value="Culinary Arts Training">Culinary Arts Training</option>
                    <option value="Overseas Placement - USA">Overseas Placement - USA</option>
                    <option value="Hospitality Management">Hospitality Management</option>
                    <option value="Sommelier Masterclass">Sommelier Masterclass</option>
                    <option value="General Placement Enquiry">General Placement Enquiry</option>
                  </select>
                </div>
              </div>

              {/* Priority & Status Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Priority</label>
                  <select 
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#059669]"
                  >
                    <option value="STANDARD">STANDARD</option>
                    <option value="HIGH PRIORITY">HIGH PRIORITY</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Initial Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#059669]"
                  >
                    <option value="New Enquiry">New Enquiry</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Urgent Follow-up">Urgent Follow-up</option>
                  </select>
                </div>
              </div>

              {/* Query / Details */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Query / Message Details</label>
                <textarea 
                  rows="3"
                  placeholder="Enter candidate's specific query or notes..."
                  value={formData.query}
                  onChange={(e) => setFormData(prev => ({ ...prev, query: e.target.value }))}
                  className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669] focus:bg-white transition-all resize-none"
                ></textarea>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-xs font-bold shadow-sm shadow-[#059669]/10 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {submitting ? 'Saving to Database...' : 'Save Enquiry to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Centered details modal matching the requested card UI */}
      {drawerOpen && activeEnquiry && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0" onClick={() => setDrawerOpen(false)}></div>
          
          <div className="bg-[#f8f9fb] border border-[#d7dce2] rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl relative z-10 p-5 space-y-4 animate-in fade-in zoom-in duration-150 text-left">
            
            {/* Close Button */}
            <button 
              onClick={() => setDrawerOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg p-1.5 transition-all cursor-pointer font-bold text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Profile Header Row */}
            <div className="flex items-center gap-3.5 pt-2">
              <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-slate-200 bg-slate-100 flex items-center justify-center">
                {activeEnquiry.name.includes("Adrian") ? (
                  <img 
                    src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=150&q=80" 
                    alt={activeEnquiry.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center font-bold text-base ${getAvatarColor(activeEnquiry.name)}`}>
                    {(activeEnquiry.name || 'E').split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-outfit font-extrabold text-slate-850 text-base leading-none">{activeEnquiry.name}</h4>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                    activeEnquiry.priority === 'HIGH PRIORITY' || activeEnquiry.priority === 'CRITICAL'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {activeEnquiry.priority}
                  </span>
                </div>
                <p className="text-xs font-bold text-[#1d4b78] flex items-center gap-1">
                  <span>🎓</span> {activeEnquiry.program}
                </p>
              </div>
            </div>

            {/* Query details text box */}
            {activeEnquiry.query && (
              <div className="bg-[#f1f5f9]/60 border border-slate-200 rounded-2xl p-4 mt-2">
                <p className={`text-xs text-slate-650 leading-relaxed font-semibold ${
                  activeEnquiry.status === 'Contacted' ? 'italic' : ''
                }`}>
                  "{activeEnquiry.query}"
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-slate-200 my-4" />

            {/* Actions Button panel */}
            {activeEnquiry.status !== 'Contacted' ? (
              <div className="grid grid-cols-2 gap-3.5 pt-1">
                <a 
                  href={`tel:${activeEnquiry.phone}`} 
                  className="bg-[#f58220] hover:bg-[#df6d0f] text-white rounded-xl py-2.5 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 fill-white" />
                  Call
                </a>
                <button 
                  onClick={() => { handleMarkContacted(activeEnquiry.id); setDrawerOpen(false); }}
                  className="bg-white border border-[#cfd5dc] hover:bg-slate-50 text-[#173f70] rounded-xl py-2.5 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Check className="w-4 h-4 text-[#173f70]" />
                  Contacted
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center py-2 text-slate-400 text-xs font-bold gap-1">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Enquiry Already Contacted</span>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}





