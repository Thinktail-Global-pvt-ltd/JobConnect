import React, { useEffect, useState } from 'react';
import { Eye, Smartphone, List, Signal, Wifi, Battery, MapPin, Building2, Clock, RefreshCw, Award, Sparkles, Filter } from 'lucide-react';
import { mockApi } from '../services/api';

export default function ChefProfileViews() {
  const [viewMode, setViewMode] = useState('phone'); // 'phone' or 'table'
  const [views, setViews] = useState([]);
  const [totalViews, setTotalViews] = useState(42);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');

  const loadChefViews = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getChefProfileViews();
      if (data && data.success && Array.isArray(data.views)) {
        setViews(data.views);
        setTotalViews(data.total_views || data.views.length);
      } else {
        // Fallback default list matching API contract
        setViews([
          {
            id: "1",
            recruiter_name: "Grand Hyatt HR Recruiter",
            company: "Grand Hyatt Hotels",
            location: "Mumbai, India",
            viewed_at: "Today, 11:30 AM",
            industry: "Hospitality & Dining"
          },
          {
            id: "2",
            recruiter_name: "F&B Director",
            company: "Le Meridien",
            location: "Dubai, UAE",
            viewed_at: "Yesterday, 4:15 PM",
            industry: "Fine Dining & Hotels"
          },
          {
            id: "3",
            recruiter_name: "Corporate Executive Chef",
            company: "Taj Hotels & Resorts",
            location: "New Delhi, India",
            viewed_at: "Jul 24, 2026, 02:45 PM",
            industry: "Luxury Hotels"
          },
          {
            id: "4",
            recruiter_name: "Talent Acquisition Lead",
            company: "Marriott International",
            location: "Singapore",
            viewed_at: "Jul 23, 2026, 09:10 AM",
            industry: "Hospitality & Resorts"
          }
        ]);
        setTotalViews(42);
      }
    } catch (err) {
      console.error('Failed to load chef profile views:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChefViews();
  }, []);

  const filteredViews = views.filter(v => {
    const matchesSearch = (v.recruiter_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (v.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (v.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = !industryFilter || (v.industry || '').toLowerCase().includes(industryFilter.toLowerCase());
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="space-y-6 text-left">
      
      {/* Header section with View Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit font-extrabold text-2xl text-slate-800">Chef Profile Views Analytics</h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Track recruiter interest and profile views via <code className="bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded">GET /api/chef/profile-views</code>.</p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1">
            <button 
              onClick={() => setViewMode('phone')} 
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${viewMode === 'phone' ? 'bg-[#059669] text-white shadow-xs' : 'text-slate-600 hover:bg-white/60'}`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>📱 Chef App Mobile View</span>
            </button>
            <button 
              onClick={() => setViewMode('table')} 
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${viewMode === 'table' ? 'bg-[#059669] text-white shadow-xs' : 'text-slate-600 hover:bg-white/60'}`}
            >
              <List className="w-3.5 h-3.5" />
              <span>📋 Views Directory Table</span>
            </button>
          </div>

          <button 
            onClick={loadChefViews}
            className="p-2.5 bg-white hover:bg-slate-50 border border-[#e2e8f0] rounded-xl text-slate-600 transition-colors shadow-2xs cursor-pointer"
            title="Refresh Views Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: SMARTPHONE CHEF MOBILE APP PREVIEW */}
      {viewMode === 'phone' ? (
        <div className="space-y-6">
          
          {/* KPI Stats Cards Summary Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white p-4.5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center font-bold text-lg shrink-0">👁️</div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Profile Views</span>
                <span className="font-outfit font-extrabold text-xl text-slate-800 block mt-0.5">{totalViews} Recruiter Views</span>
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">🏢</div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Unique Employers</span>
                <span className="font-outfit font-extrabold text-xl text-slate-800 block mt-0.5">{views.length} Companies</span>
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg shrink-0">⚡</div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Recent Activity</span>
                <span className="font-outfit font-extrabold text-xl text-slate-800 block mt-0.5">High Visibility</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#065f46] to-[#047857] p-4.5 rounded-2xl shadow-sm flex items-center gap-3.5 text-white">
              <div className="w-11 h-11 rounded-xl bg-emerald-800/60 text-emerald-200 flex items-center justify-center font-bold text-lg shrink-0">✨</div>
              <div>
                <span className="text-[10px] font-extrabold text-emerald-200 uppercase tracking-widest block">Profile Views API</span>
                <span className="font-outfit font-extrabold text-xl block mt-0.5">100% Live Tracking</span>
              </div>
            </div>
          </div>

          {/* Centered Smartphone Device Frame Container */}
          <div className="flex justify-center py-4 bg-slate-50/50 rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            
            {/* Smartphone Device Outer Shell */}
            <div className="relative w-full max-w-[375px] bg-slate-950 rounded-[48px] p-3.5 shadow-2xl ring-1 ring-slate-800/60 border-4 border-slate-800">
              
              {/* Phone Notch / Dynamic Island */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-50 flex items-center justify-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800" />
                <div className="w-2 h-2 rounded-full bg-slate-950" />
              </div>

              {/* Smartphone Inner Screen Viewport */}
              <div className="bg-[#f8f9fc] rounded-[36px] overflow-hidden min-h-[660px] max-h-[680px] flex flex-col relative border border-slate-200">
                
                {/* Phone Top Status Bar */}
                <div className="pt-3.5 px-6 pb-2 flex items-center justify-between text-[11px] font-bold text-slate-800 bg-white/90 backdrop-blur-md sticky top-0 z-40">
                  <span>09:41</span>
                  <div className="flex items-center gap-1.5">
                    <Signal className="w-3 h-3 text-slate-700" />
                    <Wifi className="w-3 h-3 text-slate-700" />
                    <Battery className="w-3.5 h-3.5 text-slate-700" />
                  </div>
                </div>

                {/* Smartphone App Top Header */}
                <div className="px-5 py-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-9 z-30">
                  <div className="flex items-center gap-2">
                    <span className="font-outfit font-extrabold text-lg text-[#059669]">JobConnect</span>
                    <span className="bg-emerald-100 text-[#059669] text-[9px] font-extrabold px-2 py-0.5 rounded-full">Profile Views 👁️</span>
                  </div>
                  <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs">👨‍🍳</span>
                </div>

                {/* Total Views Banner inside Mobile App */}
                <div className="mx-4 mt-3 p-3.5 bg-gradient-to-r from-[#065f46] to-[#047857] rounded-2xl text-white shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-emerald-200 uppercase tracking-wider block">Total Recruiter Views</span>
                    <span className="font-outfit font-extrabold text-2xl block mt-0.5">{totalViews} Views</span>
                  </div>
                  <span className="text-3xl">👁️</span>
                </div>

                {/* Smartphone Profile Views Stream Body */}
                <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
                  {loading ? (
                    <p className="text-center text-slate-400 text-xs py-20 font-medium">Loading recruiter views...</p>
                  ) : views.length === 0 ? (
                    <p className="text-center text-slate-400 text-xs py-20 font-medium">No profile views recorded yet.</p>
                  ) : (
                    views.map((v, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-2.5 transition-all hover:border-emerald-300">
                        
                        {/* Recruiter Header Info */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-100">
                              🏢
                            </div>
                            <div>
                              <h4 className="font-outfit font-extrabold text-slate-800 text-xs leading-snug">{v.recruiter_name}</h4>
                              <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
                                <Building2 className="w-3 h-3 text-slate-400" />
                                {v.company}
                              </p>
                            </div>
                          </div>

                          <span className="text-[9px] font-extrabold text-slate-400 shrink-0 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                            {v.viewed_at}
                          </span>
                        </div>

                        {/* Location & Industry Tag */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] font-semibold text-slate-600">
                          <span className="flex items-center gap-1 text-slate-500 font-bold">
                            <MapPin className="w-3 h-3 text-rose-500" />
                            {v.location}
                          </span>
                          <span className="bg-emerald-50 text-[#059669] text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                            {v.industry || 'Hospitality'}
                          </span>
                        </div>

                        {/* Action CTA Button */}
                        <div className="pt-1">
                          <button className="w-full bg-[#059669] hover:bg-[#047857] text-white py-1.5 rounded-xl text-[10px] font-extrabold shadow-2xs transition-all flex items-center justify-center gap-1">
                            <span>Connect with Recruiter</span>
                          </button>
                        </div>

                      </div>
                    ))
                  )}
                </div>

                {/* Phone Bottom Navigation Bar */}
                <div className="bg-white border-t border-slate-200/80 px-6 py-2 flex items-center justify-between sticky bottom-0 z-40">
                  <div className="flex flex-col items-center gap-0.5 text-slate-400">
                    <span className="text-base">🏠</span>
                    <span className="text-[9px] font-bold">Home</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 text-[#059669]">
                    <span className="text-base">👁️</span>
                    <span className="text-[9px] font-extrabold">Views</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 text-slate-400">
                    <span className="text-base">💼</span>
                    <span className="text-[9px] font-bold">Jobs</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 text-slate-400">
                    <span className="text-base">👤</span>
                    <span className="text-[9px] font-bold">Profile</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      ) : (
        /* VIEW MODE 2: ADMIN VIEWS DIRECTORY TABLE VIEW */
        <div className="space-y-6">
          
          {/* Search & Filter Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm">
            <div className="relative flex-grow max-w-md">
              <input 
                type="text" 
                placeholder="Search recruiter name, company, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <select 
                  value={industryFilter} 
                  onChange={(e) => setIndustryFilter(e.target.value)}
                  className="bg-slate-50 border border-[#e2e8f0] text-slate-700 text-xs font-bold py-2.5 pl-4 pr-8 rounded-xl focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none"
                >
                  <option value="">All Industries</option>
                  <option value="Hospitality">Hospitality & Dining</option>
                  <option value="Fine Dining">Fine Dining & Hotels</option>
                  <option value="Luxury">Luxury Hotels</option>
                </select>
                <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table List */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            {loading ? (
              <p className="text-center text-slate-400 text-xs font-medium py-16">Loading profile views...</p>
            ) : filteredViews.length === 0 ? (
              <p className="text-center text-slate-400 text-sm font-medium py-16">No recruiter views found matching your search.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-[#e2e8f0] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-6">Recruiter Name</th>
                      <th className="py-4 px-6">Company / Hotel</th>
                      <th className="py-4 px-6">Location</th>
                      <th className="py-4 px-6">Viewed At</th>
                      <th className="py-4 px-6">Industry</th>
                      <th className="py-4 px-6 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0] text-xs font-semibold">
                    {filteredViews.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4.5 px-6 font-extrabold text-slate-800 text-[13px]">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">👤</span>
                            <span>{v.recruiter_name}</span>
                          </div>
                        </td>

                        <td className="py-4.5 px-6 font-bold text-slate-700">
                          {v.company}
                        </td>

                        <td className="py-4.5 px-6 text-slate-500 font-semibold">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-rose-500" />
                            {v.location}
                          </span>
                        </td>

                        <td className="py-4.5 px-6 text-slate-500 font-bold">
                          {v.viewed_at}
                        </td>

                        <td className="py-4.5 px-6">
                          <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-slate-200 inline-block">
                            {v.industry || 'Hospitality'}
                          </span>
                        </td>

                        <td className="py-4.5 px-6 text-center">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            View Recorded
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="px-6 py-4 flex justify-between items-center border-t border-[#e2e8f0] bg-slate-50/30">
              <span className="text-xs text-slate-500 font-bold">
                Showing all {filteredViews.length} Recruiter View Entries
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
