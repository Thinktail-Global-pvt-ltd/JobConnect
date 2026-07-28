import React, { useEffect, useState } from 'react';
import { Eye, Edit2, Globe, ShieldCheck, Clock, BookOpen, Plus, EyeOff, CheckCircle2, FileText, MapPin, Sparkles, Pin } from 'lucide-react';
import { mockApi } from '../services/api';

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
    status: 'Published'
  });

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getTrainingPrograms();
      if (data && data.programs) {
        setPrograms(data.programs);
        const allProgs = data.programs;
        const countries = new Set();
        allProgs.forEach(p => (p.countries || []).forEach(c => countries.add(c)));
        setStats({
          total: allProgs.length,
          active: allProgs.filter(p => p.status === 'Published' || p.status === 'Active').length,
          pending: allProgs.filter(p => p.status === 'Draft' || p.status === 'Reviewing' || p.status === 'Pending').length,
          countries_count: countries.size,
          pinned: allProgs.filter(p => p.is_pinned).length
        });
      }
    } catch (err) {
      console.error('Failed to load training programs:', err);
    } finally {
      setLoading(false);
    }
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

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.countries) return;
    setSubmitting(true);

    const tempNewProg = {
      id: Date.now(),
      name: formData.name,
      curriculum: formData.curriculum || 'Hospitality Curriculum',
      countries: formData.countries.split(',').map(c => c.trim()),
      duration: formData.duration || '12 Months',
      status: formData.status,
      date: 'Just Now',
      is_pinned: false
    };

    setPrograms(prev => [tempNewProg, ...prev]);
    setIsModalOpen(false);

    try {
      await mockApi.createTrainingProgram(formData);
    } catch (err) {
      console.error('Create program failed:', err);
    } finally {
      setSubmitting(false);
      setFormData({
        name: '',
        curriculum: '',
        countries: '',
        duration: '12 Months',
        status: 'Published'
      });
      loadPrograms();
    }
  };

  const filteredPrograms = programs.filter(p => {
    if (tab === 'published') return p.status === 'Published' || p.status === 'Active';
    if (tab === 'drafts') return p.status === 'Draft' || p.status === 'Reviewing' || p.status === 'Pending';
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
                  <th className="py-4 px-6">Program Name</th>
                  <th className="py-4 px-6">Deployment Countries</th>
                  <th className="py-4 px-6">Duration</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Created Date</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] text-slate-700 text-xs font-semibold">
                {filteredPrograms.map(prog => {
                  const isActive = prog.status === 'Published' || prog.status === 'Active';

                  return (
                    <tr key={prog.id} className={`hover:bg-slate-50/50 transition-colors ${prog.is_pinned ? 'bg-purple-50/30' : ''}`}>
                      {/* Name & Curriculum with Pin Indicator */}
                      <td className="py-4.5 px-6">
                        <div className="flex items-center gap-2">
                          {prog.is_pinned && (
                            <span className="text-purple-600 text-sm shrink-0" title="Pinned to top feed priority">📌</span>
                          )}
                          <div>
                            <span className="font-extrabold text-slate-800 text-[13px] block leading-tight">{prog.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold block mt-1">Curriculum: {prog.curriculum}</span>
                          </div>
                        </div>
                      </td>

                      {/* Countries badges */}
                      <td className="py-4.5 px-6">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(prog.countries || []).map((c, idx) => (
                            <span key={idx} className="bg-slate-100 text-slate-700 text-[9px] font-extrabold px-2.5 py-0.5 rounded-md border border-slate-200 inline-flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5 text-rose-500" />
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="py-4.5 px-6 text-slate-600 font-bold">
                        {prog.duration}
                      </td>

                      {/* Status badge */}
                      <td className="py-4.5 px-6">
                        <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider border ${getStatusBadgeClass(prog.status)}`}>
                          {prog.status}
                        </span>
                      </td>

                      {/* Created date */}
                      <td className="py-4.5 px-6 text-slate-400 font-bold">
                        {prog.date}
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

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Program Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Advanced Culinary Arts - London"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Curriculum / Provider</label>
                <input 
                  type="text" 
                  placeholder="e.g. Michelin Prep"
                  value={formData.curriculum}
                  onChange={(e) => setFormData(prev => ({ ...prev, curriculum: e.target.value }))}
                  className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Deployment Countries *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. UK, Ireland"
                    value={formData.countries}
                    onChange={(e) => setFormData(prev => ({ ...prev, countries: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Duration</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 12 Months"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

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
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-100 shadow-2xl space-y-4 text-left">
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
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Curriculum</span>
                  <span className="font-bold text-slate-700">{selectedProgram.curriculum}</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Duration</span>
                  <span className="font-bold text-slate-700">{selectedProgram.duration}</span>
                </div>
              </div>

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
