import React, { useEffect, useState } from 'react';
import { Eye, Edit2, Globe, ShieldCheck, Clock, BookOpen, Plus, EyeOff, CheckCircle2, FileText, MapPin, Sparkles, Pin } from 'lucide-react';
import axios from 'axios';
import { realApi, mockApi } from '../services/api';

export default function Training() {
  const [programs, setPrograms] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, countries_count: 0, pinned: 0 });
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    curriculum: '',
    countries: '',
    duration: '12 Months',
    employer_details: '',
    skills_covered: '',
    benefits: '',
    placement_opportunities: '',
    status: 'Published'
  });

  const loadPrograms = async () => {
    setLoading(true);
    let data = null;

    try {
      data = await mockApi.getTrainingPrograms();
    } catch (err) {}

    if (!data || !data.programs || data.programs.length === 0) {
      try {
        const res = await axios.get('/backend/api/admin/training-opportunities');
        if (res.data?.success && Array.isArray(res.data.programs)) data = res.data;
      } catch (err) {}
    }

    if (data && Array.isArray(data.programs)) {
      setPrograms(data.programs);
      const allProgs = data.programs;
      const countries = new Set();
      allProgs.forEach(p => (p.countries || []).forEach(c => countries.add(c)));
      setStats({
        total: data.stats?.total ?? allProgs.length,
        active: data.stats?.active ?? allProgs.filter(p => p.status === 'Published' || p.status === 'Active').length,
        pending: data.stats?.pending ?? allProgs.filter(p => p.status === 'Draft' || p.status === 'Reviewing' || p.status === 'Pending').length,
        countries_count: data.stats?.countries_count ?? countries.size,
        pinned: data.stats?.pinned ?? allProgs.filter(p => p.is_pinned).length
      });
    } else {
      setPrograms([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  const handleStatusToggle = async (id, currentStatus) => {
    const isCurrentlyActive = currentStatus === 'Published' || currentStatus === 'Active';
    const newStatus = isCurrentlyActive ? 'Draft' : 'Published';

    setPrograms(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));

    try {
      await mockApi.updateTrainingStatus(id, newStatus);
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      loadPrograms();
    }
  };

  const handleTogglePin = async (id) => {
    setPrograms(prev => {
      const updated = prev.map(p => {
        if (p.id === id) {
          return { ...p, is_pinned: !p.is_pinned };
        }
        return p;
      });

      // Sort pinned top first
      return [...updated].sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));
    });

    try {
      await mockApi.togglePinTraining(id);
    } catch (err) {
      console.error('Toggle pin failed:', err);
    } finally {
      loadPrograms();
    }
  };

  const [errorMsg, setErrorMsg] = useState('');

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name || !formData.countries) {
      setErrorMsg('Please fill in both Program Name and Deployment Countries.');
      return;
    }
    setSubmitting(true);

    try {
      const res = await mockApi.createTrainingProgram(formData);
      if (res && (res.success || res.id || res.program)) {
        setIsModalOpen(false);
        setErrorMsg('');
        setFormData({
          name: '',
          curriculum: '',
          countries: '',
          duration: '12 Months',
          employer_details: '',
          skills_covered: '',
          benefits: '',
          placement_opportunities: '',
          status: 'Published'
        });
        loadPrograms();
      } else {
        setErrorMsg(res?.message || 'Failed to create training program record on server.');
      }
    } catch (err) {
      console.error('Create program failed:', err);
      setErrorMsg(err?.response?.data?.message || err?.message || 'Failed to create training program record.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPrograms = programs.filter(p => {
    const s = (p.status || 'Published').toLowerCase();
    if (tab === 'published') return s === 'published' || s === 'active';
    if (tab === 'drafts') return s === 'draft' || s === 'reviewing' || s === 'pending';
    if (tab === 'pinned') return Boolean(p.is_pinned);
    return true;
  });

  const getStatusBadgeClass = (status = '') => {
    const lower = status.toLowerCase();
    if (lower === 'published' || lower === 'active') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (lower === 'draft' || lower === 'pending') return 'bg-amber-50 text-amber-700 border-amber-100';
    if (lower === 'reviewing') return 'bg-blue-50 text-blue-700 border-blue-100';
    return 'bg-slate-50 text-slate-600 border-slate-200';
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Title Header with Action Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-outfit font-extrabold text-2xl text-slate-800">Training & Overseas Programs</h2>
            <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE PROGRAM STREAM
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400 mt-1">Manage international placement cycles and professional training curricula.</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#059669] hover:bg-[#047857] text-white rounded-xl px-4 py-2.5 text-xs font-bold shadow-sm shadow-[#059669]/10 transition-all hover:-translate-y-0.5 flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Program</span>
        </button>
      </div>

      {/* Dynamic KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        
        {/* Card 1: Active Programs */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4 text-left hover:border-emerald-200 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0 font-bold text-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-grow">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block truncate">Active Programs</span>
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-0.5">{stats.active}</span>
            <span className="text-[10px] font-bold text-emerald-600 block mt-0.5">Live on Candidate Feed</span>
          </div>
        </div>

        {/* Card 2: Overseas Deployment Destinations */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4 text-left hover:border-blue-200 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xl">
            <Globe className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-grow">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block truncate">Overseas Destinations</span>
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-0.5">{stats.countries_count} Countries</span>
            <span className="text-[10px] font-bold text-slate-400 block mt-0.5">Global Placement Network</span>
          </div>
        </div>

        {/* Card 3: Pinned / Priority Programs */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4 text-left hover:border-purple-200 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 font-bold text-xl">
            <Pin className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-grow">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block truncate">Pinned to Priority</span>
            <span className="font-outfit font-extrabold text-2xl text-purple-700 block mt-0.5">{stats.pinned}</span>
            <span className="text-[10px] font-bold text-purple-600 block mt-0.5">Featured Feed Top</span>
          </div>
        </div>

        {/* Card 4: Total Programs */}
        <div className="bg-gradient-to-br from-[#065f46] to-[#047857] p-5 rounded-2xl shadow-sm flex items-center gap-4 text-left text-white">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800/60 text-emerald-200 flex items-center justify-center shrink-0 font-bold text-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-grow">
            <span className="text-[10px] font-extrabold text-emerald-200 uppercase tracking-widest block truncate">Total Programs</span>
            <span className="font-outfit font-extrabold text-2xl block mt-0.5">{stats.total}</span>
            <span className="text-[10px] font-bold text-emerald-100 block mt-0.5">Loaded at once</span>
          </div>
        </div>

      </div>

      {/* Main Table Board */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        
        {/* Tabs Bar */}
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setTab('all')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${tab === 'all' ? 'bg-[#065f46] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              All Programs ({programs.length})
            </button>
            <button onClick={() => setTab('published')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${tab === 'published' ? 'bg-[#065f46] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              Active / Published ({stats.active})
            </button>
            <button onClick={() => setTab('pinned')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${tab === 'pinned' ? 'bg-purple-600 text-white' : 'text-purple-700 bg-purple-50 hover:bg-purple-100'}`}>
              📌 Pinned ({stats.pinned})
            </button>
            <button onClick={() => setTab('drafts')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${tab === 'drafts' ? 'bg-[#065f46] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              Drafts / In Review ({stats.pending})
            </button>
          </div>
        </div>

        {/* Table List */}
        {loading ? (
          <p className="text-center text-slate-400 text-xs font-medium py-16">Loading training opportunities...</p>
        ) : filteredPrograms.length === 0 ? (
          <p className="text-center text-slate-400 text-sm font-medium py-16">No training programs found for this tab filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-[#e2e8f0] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Program & Employer</th>
                  <th className="py-4 px-6">Deployment & Skills</th>
                  <th className="py-4 px-6">Benefits & Opportunities</th>
                  <th className="py-4 px-6">Duration</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] text-slate-700 text-xs font-semibold">
                {filteredPrograms.map(prog => {
                  const isActive = prog.status === 'Published' || prog.status === 'Active';

                  return (
                    <tr key={prog.id} className={`hover:bg-slate-50/50 transition-colors ${prog.is_pinned ? 'bg-purple-50/30' : ''}`}>
                      {/* Name, Provider & Employer */}
                      <td className="py-4.5 px-6 max-w-xs">
                        <div className="flex items-start gap-2">
                          {prog.is_pinned && (
                            <span className="text-purple-600 text-sm shrink-0 mt-0.5" title="Pinned to top feed priority">📌</span>
                          )}
                          <div>
                            <span className="font-extrabold text-slate-800 text-[13px] block leading-tight">{prog.name}</span>
                            <span className="text-[10px] text-slate-500 font-semibold block mt-1">
                              <strong>Provider:</strong> {prog.curriculum || 'Hospitality Curricula'}
                            </span>
                            {prog.employer_details && (
                              <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">
                                🏢 <strong>Employer:</strong> {prog.employer_details}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Deployment Countries & Skills Covered */}
                      <td className="py-4.5 px-6 max-w-xs">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1 flex-wrap">
                            {(prog.countries || []).map((c, idx) => (
                              <span key={idx} className="bg-slate-100 text-slate-700 text-[9px] font-extrabold px-2 py-0.5 rounded-md border border-slate-200 inline-flex items-center gap-0.5">
                                <MapPin className="w-2.5 h-2.5 text-rose-500" />
                                {c}
                              </span>
                            ))}
                          </div>
                          {prog.skills_covered && (
                            <span className="text-[10px] text-slate-500 font-medium block truncate" title={prog.skills_covered}>
                              💡 <strong>Skills:</strong> {prog.skills_covered}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Benefits & Placement Opportunities */}
                      <td className="py-4.5 px-6 max-w-xs">
                        <div className="space-y-1">
                          {prog.benefits ? (
                            <span className="text-[10px] text-emerald-700 font-semibold block truncate" title={prog.benefits}>
                              ✨ {prog.benefits}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium block italic">No specific benefits listed</span>
                          )}

                          {prog.placement_opportunities && (
                            <span className="text-[10px] text-purple-700 font-semibold block truncate" title={prog.placement_opportunities}>
                              🎯 {prog.placement_opportunities}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="py-4.5 px-6 text-slate-600 font-bold whitespace-nowrap">
                        {prog.duration || '12 Months'}
                      </td>

                      {/* Status badge */}
                      <td className="py-4.5 px-6 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider border ${getStatusBadgeClass(prog.status)}`}>
                          {prog.status}
                        </span>
                      </td>

                      {/* Actions buttons */}
                      <td className="py-4.5 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setSelectedProgram(prog)}
                            className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center border border-[#e2e8f0] transition-colors cursor-pointer" 
                            title="View Program Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {isActive ? (
                            <button 
                              onClick={() => handleStatusToggle(prog.id, prog.status)}
                              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-extrabold rounded-md transition-all shadow-xs flex items-center gap-1 cursor-pointer" 
                              title="Unpublish Program"
                            >
                              <EyeOff className="w-3 h-3" />
                              <span>Unpublish</span>
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleStatusToggle(prog.id, prog.status)}
                              className="px-3 py-1 bg-[#059669] hover:bg-[#047857] text-white text-[10px] font-extrabold rounded-md transition-all shadow-xs flex items-center gap-1 cursor-pointer font-bold" 
                              title="Publish Program"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Publish</span>
                            </button>
                          )}

                          {/* Pin / Unpin Button */}
                          <button 
                            onClick={() => handleTogglePin(prog.id)} 
                            className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                              prog.is_pinned 
                                ? 'bg-purple-600 text-white border-purple-600 shadow-xs' 
                                : 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-600 hover:text-white'
                            }`} 
                            title={prog.is_pinned ? "Unpin Program" : "Pin Program to Feed Top Priority"}
                          >
                            <Pin className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer info */}
        <div className="px-6 py-4 flex justify-between items-center border-t border-[#e2e8f0] bg-slate-50/30">
          <span className="text-xs text-slate-500 font-bold">
            Showing all {filteredPrograms.length} Training Programs
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            All Programs Loaded At Once
          </span>
        </div>

      </div>

      {/* CREATE NEW PROGRAM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-150 text-left">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">🎓</span>
                <h3 className="font-outfit font-extrabold text-slate-800 text-base">Create Training Program</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm font-bold transition-all"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                  <span>⚠️ {errorMsg}</span>
                </div>
              )}
              
              {/* Field 1: Training Program Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Training Program Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Advanced Culinary Arts & Overseas Deployment"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                />
              </div>

              {/* Field 2 & 3: Curriculum/Provider & Deployment Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Curriculum / Provider</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Michelin Prep Institute"
                    value={formData.curriculum}
                    onChange={(e) => setFormData(prev => ({ ...prev, curriculum: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Deployment Countries *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. UK, UAE, Saudi Arabia"
                    value={formData.countries}
                    onChange={(e) => setFormData(prev => ({ ...prev, countries: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              {/* Field 4 & 5: Employer Details & Training Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Employer Details</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Marriott International, Hyatt UK"
                    value={formData.employer_details}
                    onChange={(e) => setFormData(prev => ({ ...prev, employer_details: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Training Duration</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 12 Months (6m Training + 6m Placement)"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              {/* Field 6: Skills Covered */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Skills Covered</label>
                <input 
                  type="text" 
                  placeholder="e.g. Pastry & Bakery, Fine Dining Service, HACCP Safety, Tandoor"
                  value={formData.skills_covered}
                  onChange={(e) => setFormData(prev => ({ ...prev, skills_covered: e.target.value }))}
                  className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                />
              </div>

              {/* Field 7: Training Benefits */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Training Benefits</label>
                <input 
                  type="text" 
                  placeholder="e.g. UK Skilled Worker Visa Support, Free Accommodation, Paid Stipend"
                  value={formData.benefits}
                  onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
                  className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                />
              </div>

              {/* Field 8: Placement Opportunities */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Placement Opportunities</label>
                <input 
                  type="text" 
                  placeholder="e.g. Guaranteed 100% International Placement upon course completion"
                  value={formData.placement_opportunities}
                  onChange={(e) => setFormData(prev => ({ ...prev, placement_opportunities: e.target.value }))}
                  className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                />
              </div>

              {/* Field 9: Initial Status */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Initial Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#059669]"
                >
                  <option value="Published">Publish Immediately</option>
                  <option value="Draft">Save as Draft</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-xs font-bold shadow-sm shadow-[#059669]/10 transition-all cursor-pointer"
                >
                  {submitting ? 'Creating...' : 'Submit & Publish Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROGRAM DETAILS VIEW MODAL */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-slate-100 shadow-2xl space-y-4 text-left max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-outfit font-extrabold text-lg text-slate-800">
                  {selectedProgram.name}
                </h3>
                <p className="text-xs font-semibold text-slate-400">Training & Overseas Program Details</p>
              </div>
              <button 
                onClick={() => setSelectedProgram(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 font-medium">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Curriculum / Provider</span>
                  <span className="font-bold text-slate-700">{selectedProgram.curriculum || selectedProgram.provider_name || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Training Duration</span>
                  <span className="font-bold text-slate-700">{selectedProgram.duration || 'N/A'}</span>
                </div>
              </div>

              {selectedProgram.employer_details && (
                <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100">
                  <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider block mb-1">Employer Details</span>
                  <span className="font-semibold text-slate-800 text-xs block">{selectedProgram.employer_details}</span>
                </div>
              )}

              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Deployment Countries</span>
                <div className="flex items-center gap-1.5 flex-wrap bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {(selectedProgram.countries || []).map((c, i) => (
                    <span key={i} className="bg-white text-slate-700 text-xs font-extrabold px-2.5 py-1 rounded-md border border-slate-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {selectedProgram.skills_covered && (
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Skills Covered</span>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700 font-semibold">
                    {selectedProgram.skills_covered}
                  </div>
                </div>
              )}

              {selectedProgram.benefits && (
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Training Benefits</span>
                  <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-emerald-900 font-semibold">
                    ✨ {selectedProgram.benefits}
                  </div>
                </div>
              )}

              {selectedProgram.placement_opportunities && (
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Placement Opportunities</span>
                  <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-100 text-purple-900 font-semibold">
                    🎯 {selectedProgram.placement_opportunities}
                  </div>
                </div>
              )}

              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Status</span>
                <span className={`px-2.5 py-1 rounded-md text-xs font-extrabold uppercase border inline-block ${getStatusBadgeClass(selectedProgram.status)}`}>
                  {selectedProgram.status}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button 
                onClick={() => setSelectedProgram(null)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
