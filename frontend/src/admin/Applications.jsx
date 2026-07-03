import React, { useEffect, useState } from 'react';
import { mockApi } from '../services/api';
import { Search, Eye, Check, X, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');

  // Selected detail modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadApps = async () => {
    setLoading(true);
    try {
      const res = await mockApi.getApplications();
      if (res.success) {
        setApps(res.applications);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    await mockApi.updateApplicationStatus(id, status);
    loadApps();
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp(prev => ({ ...prev, status }));
    }
  };

  const filteredApps = apps.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = 
      a.applicant?.full_name?.toLowerCase().includes(q) ||
      a.job_post?.title?.toLowerCase().includes(q) ||
      a.job_post?.company?.toLowerCase().includes(q);

    if (tab === 'all') return matchSearch;
    if (tab === 'new') return a.status === 'new' && matchSearch;
    if (tab === 'contacted') return a.status === 'contacted' && matchSearch;
    return matchSearch;
  });

  const getAvatarColor = (name) => {
    if (!name) return 'bg-[#dcfce7] text-[#15803d]';
    const char = name.charCodeAt(0) % 4;
    switch (char) {
      case 0: return 'bg-[#dcfce7] text-[#15803d]';
      case 1: return 'bg-[#eff6ff] text-[#1d4ed8]';
      case 2: return 'bg-[#fff7ed] text-[#c2410c]';
      default: return 'bg-[#f3e8ff] text-[#7e22ce]';
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Title & Floating Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit font-extrabold text-2xl text-slate-800">Job Applications</h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Review, moderate, and track candidates applying for hospitality listings.</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input type="text" placeholder="Search candidate, job, or company..." value={search} onChange={(e) => setSearch(e.target.value)}
                 className="w-full bg-white border border-[#e2e8f0] rounded-lg py-2 pl-10 pr-4 text-xs font-medium text-slate-600 focus:outline-none focus:border-[#059669] transition-all" />
          <Search className="absolute left-3.5 top-2.5 text-slate-400 w-4 h-4" />
        </div>
      </div>

      {/* Stats Cards Row (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[95px]">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Applications</span>
          <span className="font-outfit font-extrabold text-2xl text-slate-800 block mt-2">{apps.length}</span>
        </div>
        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[95px]">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Awaiting Review</span>
          <span className="font-outfit font-extrabold text-2xl text-orange-600 block mt-2">
            {apps.filter(a => a.status === 'new').length}
          </span>
        </div>
        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[95px]">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Contacted</span>
          <span className="font-outfit font-extrabold text-2xl text-emerald-600 block mt-2">
            {apps.filter(a => a.status === 'contacted').length}
          </span>
        </div>
      </div>

      {/* Main Table Directory Card */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        
        {/* Tabs and Filter row */}
        <div className="flex items-center gap-6 border-b border-[#e2e8f0] px-6 pt-4.5">
          <button onClick={() => setTab('all')} 
                  className={`text-xs font-bold pb-3 transition-all relative ${tab === 'all' ? 'text-[#065f46] border-b-2 border-[#10b981]' : 'text-slate-400 hover:text-slate-700'}`}>
            All Submissions
          </button>
          <button onClick={() => setTab('new')} 
                  className={`text-xs font-bold pb-3 transition-all relative ${tab === 'new' ? 'text-[#065f46] border-b-2 border-[#10b981]' : 'text-slate-400 hover:text-slate-700'}`}>
            New Applications
          </button>
          <button onClick={() => setTab('contacted')} 
                  className={`text-xs font-bold pb-3 transition-all relative ${tab === 'contacted' ? 'text-[#065f46] border-b-2 border-[#10b981]' : 'text-slate-400 hover:text-slate-700'}`}>
            Contacted
          </button>
        </div>

        {/* Directory table */}
        {loading ? (
          <p className="text-center text-slate-400 text-xs font-medium py-16">Loading applications list...</p>
        ) : filteredApps.length === 0 ? (
          <p className="text-center text-slate-400 text-sm font-medium py-16">No applications matching filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-[#e2e8f0] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Applicant</th>
                  <th className="py-4 px-6">Applied Listing</th>
                  <th className="py-4 px-6">Date Submitted</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] text-slate-700 text-xs font-semibold">
                {filteredApps.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50/30 transition-colors">
                    
                    {/* Applicant details */}
                    <td className="py-4.5 px-6 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-outfit text-xs border border-white shadow-sm ${getAvatarColor(a.applicant?.full_name)}`}>
                        {a.applicant?.full_name ? a.applicant.full_name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-800 text-[13px] block leading-tight">{a.applicant?.full_name}</span>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{a.applicant?.email}</span>
                      </div>
                    </td>

                    {/* Job post detail */}
                    <td className="py-4.5 px-6">
                      <span className="font-extrabold text-slate-800 block text-[13px]">{a.job_post?.title}</span>
                      <span className="text-[10px] text-[#059669] font-bold block mt-0.5">{a.job_post?.company}</span>
                    </td>

                    {/* Date Submitted */}
                    <td className="py-4.5 px-6 text-slate-400 font-bold">
                      {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4.5 px-6">
                      {a.status === 'contacted' ? (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
                          Contacted
                        </span>
                      ) : a.status === 'hired' ? (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Hired
                        </span>
                      ) : a.status === 'rejected' ? (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-100">
                          Rejected
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-100">
                          New
                        </span>
                      )}
                    </td>

                    {/* Actions links */}
                    <td className="py-4.5 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => { setSelectedApp(a); setModalOpen(true); }}
                                className="w-8 h-8 rounded-lg bg-[#f8f9fc] hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center border border-[#e2e8f0] transition-colors" title="Review Profile">
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button onClick={() => handleUpdateStatus(a.id, 'contacted')}
                                className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-500 text-blue-600 hover:text-white flex items-center justify-center border border-blue-100 hover:border-blue-500 transition-colors" title="Mark Contacted">
                          <span>📞</span>
                        </button>

                        <button onClick={() => handleUpdateStatus(a.id, 'hired')}
                                className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white flex items-center justify-center border border-emerald-100 hover:border-emerald-500 transition-colors" title="Hire Candidate">
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer pagination */}
        <div className="px-6 py-4 flex justify-between items-center border-t border-[#e2e8f0] bg-slate-50/10">
          <span className="text-xs text-slate-400 font-bold">Showing {filteredApps.length} of {apps.length} applications</span>
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-55 flex items-center justify-center text-slate-400"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-7 h-7 rounded-lg bg-[#065f46] text-white flex items-center justify-center text-xs font-bold">1</button>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-55 flex items-center justify-center text-slate-400"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

      </div>

      {/* Details Dialog Modal */}
      {modalOpen && selectedApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl">
            <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
              <h3 className="font-outfit font-extrabold text-slate-800 text-base">Candidate Profile Summary</h3>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm font-bold transition-all">✕</button>
            </div>

            <div className="p-6 space-y-5 text-xs font-semibold text-slate-500 text-left">
              
              {/* Profile details */}
              <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold font-outfit text-sm border ${getAvatarColor(selectedApp.applicant?.full_name)}`}>
                  {selectedApp.applicant?.full_name ? selectedApp.applicant.full_name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U'}
                </div>
                <div>
                  <h4 className="font-outfit font-extrabold text-slate-800 text-base leading-snug">{selectedApp.applicant?.full_name}</h4>
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">📞 {selectedApp.applicant?.mobile_number} &nbsp;•&nbsp; ✉️ {selectedApp.applicant?.email}</span>
                </div>
              </div>

              {/* Bio summary */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block">City</span>
                  <span className="text-slate-800 font-extrabold mt-1 block">{selectedApp.applicant?.city || 'New Delhi, India'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Experience</span>
                  <span className="text-slate-800 font-extrabold mt-1 block">{selectedApp.applicant?.experience_range || '6+ Years'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Preferred Role</span>
                  <span className="text-slate-800 font-extrabold mt-1 block">{selectedApp.applicant?.preferred_role || 'Executive Chef'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Current Employer</span>
                  <span className="text-slate-800 font-extrabold mt-1 block">{selectedApp.applicant?.current_employer || 'Grand Hyatt'}</span>
                </div>
              </div>

              {/* Skills list */}
              <div className="border-t border-slate-50 pt-4">
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-2">Key Specialties</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(selectedApp.applicant?.skills || ['Kitchen Management', 'Fine Dining', 'Safety Compliance']).map((s, idx) => (
                    <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-700 text-[9px] font-extrabold px-2 py-0.5 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Moderation actions inside modal */}
              <div className="border-t border-slate-50 pt-5 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block">Application Status</span>
                  <span className="text-slate-800 font-extrabold block capitalize">{selectedApp.status}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => handleUpdateStatus(selectedApp.id, 'rejected')}
                          className="bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-lg px-4 py-2 font-bold transition-all">
                    Reject
                  </button>
                  <button onClick={() => handleUpdateStatus(selectedApp.id, 'hired')}
                          className="bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-4 py-2 font-bold transition-all shadow-sm">
                    Hire Candidate
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
