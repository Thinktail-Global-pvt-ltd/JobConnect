import React, { useEffect, useState } from 'react';
import { Megaphone, FileText, Plus, Trash2, ArrowUpRight, RotateCcw, Sparkles, CheckCircle2, Bookmark, Briefcase, Signal, Wifi, Battery, MapPin, Building2, Clock, RefreshCw, Smartphone, List, Eye } from 'lucide-react';
import { mockApi } from '../services/api';

export default function CommunityFeed() {
  const [viewMode, setViewMode] = useState('phone'); // 'phone' or 'table'
  const [posts, setPosts] = useState([]);
  const [publicFeed, setPublicFeed] = useState([]);
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, archived: 0 });
  const [tab, setTab] = useState('all');
  const [phoneCategory, setPhoneCategory] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    post_type: 'Community Announcement',
    body: '',
    cta_label: '',
    cta_url: '',
    status: 'published',
  });

  // Fetch Public Candidate Feed (GET /api/feed)
  const fetchPublicCandidateFeed = async () => {
    try {
      const data = await mockApi.getPublicFeed('all');
      if (data && data.success && data.feed) {
        setPublicFeed(data.feed.data || []);
      }
    } catch (err) {
      console.error('Failed to load candidate public feed:', err);
    }
  };

  // Load unified admin stream
  const loadPosts = async () => {
    setLoading(true);
    try {
      await fetchPublicCandidateFeed();
      const data = await mockApi.getCommunityPosts();
      if (data && data.posts && data.posts.length > 0) {
        setPosts(data.posts);
        if (data.stats) {
          setStats(data.stats);
        } else {
          setStats({
            total: data.posts.length,
            published: data.posts.filter(p => p.status === 'Published').length,
            drafts: data.posts.filter(p => p.status === 'Draft').length,
            archived: data.posts.filter(p => p.status === 'Archived').length,
          });
        }
      }
    } catch (err) {
      console.error('Failed to load community posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.body) return;
    setSubmitting(true);

    const tempNewPost = {
      id: `post_${Date.now()}`,
      uid: `AN-${Date.now().toString().slice(-4)}`,
      source: 'admin_post',
      title: formData.title,
      body: formData.body,
      post_type: formData.post_type || 'Community Announcement',
      status: formData.status === 'published' ? 'Published' : 'Draft',
      date: 'Just Now',
      cta_label: formData.cta_label,
      cta_url: formData.cta_url
    };

    setPosts(prev => [tempNewPost, ...prev]);
    setIsModalOpen(false);

    try {
      await mockApi.createCommunityPost(formData);
    } catch (err) {
      console.error('Create post failed:', err);
    } finally {
      setSubmitting(false);
      setFormData({
        title: '',
        post_type: 'Community Announcement',
        body: '',
        cta_label: '',
        cta_url: '',
        status: 'published',
      });
      loadPosts();
    }
  };

  const handleStatusChange = async (id, newStatus, source = 'admin_post') => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    if (source === 'admin_post') {
      try {
        const rawId = String(id).replace('post_', '');
        await mockApi.updateCommunityPostStatus(rawId, newStatus.toLowerCase());
      } catch (err) {
        console.error('Status update failed:', err);
      }
    }
  };

  const handleDelete = async (id, source = 'admin_post') => {
    if (window.confirm("Are you sure you want to delete this stream entry?")) {
      setPosts(prev => prev.filter(p => p.id !== id));
      if (source === 'admin_post') {
        try {
          const rawId = String(id).replace('post_', '');
          await mockApi.deleteCommunityPost(rawId);
        } catch (err) {
          console.error('Delete post failed:', err);
        }
      }
    }
  };

  const filteredPosts = posts.filter(p => {
    if (tab === 'published') return p.status === 'Published';
    if (tab === 'drafts') return p.status === 'Draft';
    if (tab === 'archived') return p.status === 'Archived';
    return true;
  });

  const filteredPhoneFeed = publicFeed.filter(item => {
    if (!phoneCategory) return true;
    if (item._type === 'job') return item.category === phoneCategory;
    return true;
  });

  const getPostBadgeColor = (type = '') => {
    if (type.includes('Job Listing')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (type.includes('Training')) return 'bg-[#ffedd5] text-[#c2410c] border-[#fed7aa]';
    if (type.includes('Announcement')) return 'bg-[#ccfbf1] text-[#0f766e] border-[#99f6e4]';
    if (type.includes('Featured')) return 'bg-[#d1fae5] text-[#065f46] border-[#a7f3d0]';
    return 'bg-[#dbeafe] text-[#1d4ed8] border-[#bfdbfe]';
  };

  const getSourceIcon = (source, type = '') => {
    if (source === 'job_post' || type.includes('Job Listing')) return '💼';
    if (source === 'training' || type.includes('Training')) return '🎓';
    if (type.includes('Announcement')) return '📢';
    if (type.includes('Featured')) return '🏆';
    return '📶';
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header section with View Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit font-extrabold text-2xl text-slate-800">Community Feed Manager</h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Manage announcements, job posts, and preview live candidate mobile view.</p>
        </div>

        {/* View Mode Switcher + Create Post Button */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1">
            <button 
              onClick={() => setViewMode('phone')} 
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${viewMode === 'phone' ? 'bg-[#059669] text-white shadow-xs' : 'text-slate-600 hover:bg-white/60'}`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>📱 Phone Interface Preview</span>
            </button>
            <button 
              onClick={() => setViewMode('table')} 
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${viewMode === 'table' ? 'bg-[#059669] text-white shadow-xs' : 'text-slate-600 hover:bg-white/60'}`}
            >
              <List className="w-3.5 h-3.5" />
              <span>📋 Feed Stream Table</span>
            </button>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#059669] hover:bg-[#047857] text-white rounded-xl px-4 py-2 text-xs font-bold shadow-sm shadow-[#059669]/10 transition-all hover:-translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create New Post
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: CLEAN SMARTPHONE PHONE INTERFACE PREVIEW (NO RAW CODE) */}
      {viewMode === 'phone' ? (
        <div className="space-y-6">
          
          {/* KPI Stats Cards Summary Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white p-4.5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center font-bold text-lg shrink-0">📱</div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Live Candidate View</span>
                <span className="font-outfit font-extrabold text-xl text-slate-800 block mt-0.5">{filteredPhoneFeed.length} Items Visible</span>
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">💼</div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Approved Jobs</span>
                <span className="font-outfit font-extrabold text-xl text-slate-800 block mt-0.5">{filteredPhoneFeed.filter(i => i._type === 'job').length} Active</span>
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-lg shrink-0">📢</div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Announcements</span>
                <span className="font-outfit font-extrabold text-xl text-slate-800 block mt-0.5">{filteredPhoneFeed.filter(i => i._type === 'admin_post').length} Published</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#065f46] to-[#047857] p-4.5 rounded-2xl shadow-sm flex items-center gap-3.5 text-white">
              <div className="w-11 h-11 rounded-xl bg-emerald-800/60 text-emerald-200 flex items-center justify-center font-bold text-lg shrink-0">✨</div>
              <div>
                <span className="text-[10px] font-extrabold text-emerald-200 uppercase tracking-widest block">Operational Status</span>
                <span className="font-outfit font-extrabold text-xl block mt-0.5">100% Live Sync</span>
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
                    <span className="bg-emerald-100 text-[#059669] text-[9px] font-extrabold px-2 py-0.5 rounded-full">Candidate Feed</span>
                  </div>
                  <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs">👤</span>
                </div>

                {/* Category Pills Bar inside Phone */}
                <div className="px-4 py-2.5 bg-slate-50 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200/60">
                  <button 
                    onClick={() => setPhoneCategory('')}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all ${phoneCategory === '' ? 'bg-[#059669] text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
                  >
                    All Feed
                  </button>
                  <button 
                    onClick={() => setPhoneCategory('india')}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all ${phoneCategory === 'india' ? 'bg-[#059669] text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
                  >
                    🇮🇳 India Jobs
                  </button>
                  <button 
                    onClick={() => setPhoneCategory('overseas')}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all ${phoneCategory === 'overseas' ? 'bg-[#059669] text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
                  >
                    ✈️ Overseas
                  </button>
                </div>

                {/* Smartphone Feed Stream Body */}
                <div className="flex-grow overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
                  {loading ? (
                    <p className="text-center text-slate-400 text-xs py-20 font-medium">Loading candidate feed...</p>
                  ) : filteredPhoneFeed.length === 0 ? (
                    <p className="text-center text-slate-400 text-xs py-20 font-medium">No published feed items visible.</p>
                  ) : (
                    filteredPhoneFeed.map((item, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-2.5 transition-all hover:border-emerald-300">
                        
                        {/* Item Source & Type Badge */}
                        <div className="flex items-center justify-between">
                          {item._type === 'job' ? (
                            <span className="px-2 py-0.5 rounded-md text-[8px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
                              <Briefcase className="w-2.5 h-2.5" />
                              {item.category || 'india'} job
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[8px] font-extrabold uppercase bg-teal-50 text-teal-700 border border-teal-100 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              {item.post_type || 'Announcement'}
                            </span>
                          )}

                          <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            Published
                          </span>
                        </div>

                        {/* Title & Body */}
                        <div>
                          <h4 className="font-outfit font-extrabold text-slate-800 text-xs leading-snug">{item.title}</h4>
                          {item._type === 'job' ? (
                            <p className="text-[11px] font-semibold text-slate-500 mt-1 flex items-center gap-1">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              {item.company || 'Hospitality Employer'}
                            </p>
                          ) : (
                            <p className="text-[11px] font-medium text-slate-500 mt-1 line-clamp-2">{item.body}</p>
                          )}
                        </div>

                        {/* Job Meta (Location & Salary) */}
                        {item._type === 'job' && (
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] font-semibold text-slate-600">
                            <span className="flex items-center gap-1 text-slate-500">
                              <MapPin className="w-3 h-3 text-rose-500" />
                              {item.location || 'India'}
                            </span>
                            <span className="font-bold text-[#059669] bg-emerald-50 px-2 py-0.5 rounded-full">
                              {item.salary || 'Competitive Pay'}
                            </span>
                          </div>
                        )}

                        {/* Action Button inside Mobile Screen */}
                        <div className="pt-1">
                          <button className="w-full bg-[#059669] hover:bg-[#047857] text-white py-2 rounded-xl text-[10px] font-extrabold shadow-2xs transition-all flex items-center justify-center gap-1">
                            <span>{item._type === 'job' ? 'Apply Now' : 'Read Full Announcement'}</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>

                      </div>
                    ))
                  )}
                </div>

                {/* Phone Bottom Navigation Bar */}
                <div className="bg-white border-t border-slate-200/80 px-6 py-2 flex items-center justify-between sticky bottom-0 z-40">
                  <div className="flex flex-col items-center gap-0.5 text-[#059669]">
                    <span className="text-base">🏠</span>
                    <span className="text-[9px] font-extrabold">Feed</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 text-slate-400">
                    <span className="text-base">💼</span>
                    <span className="text-[9px] font-bold">Jobs</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 text-slate-400">
                    <span className="text-base">🎓</span>
                    <span className="text-[9px] font-bold">Overseas</span>
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
        /* VIEW MODE 2: ADMIN FEED STREAM TABLE VIEW */
        <div className="space-y-6">
          {/* KPI Stats Row (2 Columns on Half-Screen, 4 on Full-Screen) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            
            {/* Card 1 */}
            <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4 text-left">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <span className="font-outfit font-extrabold text-2xl text-slate-800 block leading-tight">{posts.filter(p => p.status === 'Published').length}</span>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1 block">Active / Published</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4 text-left">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="font-outfit font-extrabold text-2xl text-slate-800 block leading-tight">{posts.filter(p => p.status === 'Draft').length}</span>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1 block">Drafts / Pending</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4 text-left">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-outfit font-extrabold text-2xl text-slate-800 block leading-tight">{posts.length}</span>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1 block">Total Stream Entries</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#065f46] p-5 rounded-2xl shadow-sm flex items-center gap-4 text-left text-white">
              <div className="w-11 h-11 rounded-xl bg-emerald-800/60 text-emerald-200 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-outfit font-extrabold text-2xl block leading-tight">{posts.filter(p => p.status === 'Archived').length}</span>
                <span className="text-[10px] font-extrabold text-emerald-200 uppercase tracking-widest mt-1 block">Archived Entries</span>
              </div>
            </div>

          </div>

          {/* Main Table Board */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            
            {/* Tabs Bar */}
            <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => setTab('all')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${tab === 'all' ? 'bg-[#065f46] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                  All Stream Posts ({posts.length})
                </button>
                <button onClick={() => setTab('published')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${tab === 'published' ? 'bg-[#065f46] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                  Published ({posts.filter(p => p.status === 'Published').length})
                </button>
                <button onClick={() => setTab('drafts')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${tab === 'drafts' ? 'bg-[#065f46] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                  Drafts / Pending ({posts.filter(p => p.status === 'Draft').length})
                </button>
                <button onClick={() => setTab('archived')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${tab === 'archived' ? 'bg-[#065f46] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                  Archived ({posts.filter(p => p.status === 'Archived').length})
                </button>
              </div>
            </div>

            {/* Table List */}
            {loading ? (
              <p className="text-center text-slate-400 text-xs font-medium py-16">Loading community stream entries...</p>
            ) : filteredPosts.length === 0 ? (
              <p className="text-center text-slate-400 text-sm font-medium py-16">No feed entries found for this tab filter.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-[#e2e8f0] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-6">Entry Title & Details</th>
                      <th className="py-4 px-6">Post Type & Source</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6">Created Date</th>
                      <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0] text-xs font-medium">
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Title */}
                        <td className="py-4.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0">
                              {getSourceIcon(post.source, post.post_type)}
                            </div>
                            <div>
                              <span className="font-extrabold text-slate-800 text-[13px] block leading-tight">{post.title}</span>
                              {post.body && (
                                <span className="text-[11px] text-slate-400 font-medium line-clamp-1 mt-0.5">{post.body}</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Post Type */}
                        <td className="py-4.5 px-6">
                          <span className={`px-2.5 py-1 rounded-md text-[9px] font-extrabold uppercase tracking-wider border ${getPostBadgeColor(post.post_type)}`}>
                            {post.post_type}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4.5 px-6">
                          {post.status === 'Published' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Published
                            </span>
                          ) : post.status === 'Archived' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              Archived
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                              Draft / Pending
                            </span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="py-4.5 px-6 text-slate-500 font-bold">
                          {post.date}
                        </td>

                        {/* Actions */}
                        <td className="py-4.5 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {post.status !== 'Published' && (
                              <button 
                                onClick={() => handleStatusChange(post.id, 'Published', post.source)} 
                                className="px-3 py-1 bg-[#059669] hover:bg-[#047857] text-white text-[10px] font-bold rounded-md transition-all shadow-xs font-bold"
                              >
                                Publish
                              </button>
                            )}

                            {post.status === 'Published' && (
                              <button 
                                onClick={() => handleStatusChange(post.id, 'Archived', post.source)} 
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                                title="Archive"
                              >
                                <Bookmark className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {post.status === 'Archived' && (
                              <button 
                                onClick={() => handleStatusChange(post.id, 'Draft', post.source)} 
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
                                title="Restore to Draft"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button 
                              onClick={() => handleDelete(post.id, post.source)} 
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer info (ALL LOADED AT ONCE - NO PAGINATION) */}
            <div className="px-6 py-4 flex justify-between items-center border-t border-[#e2e8f0] bg-slate-50/30">
              <span className="text-xs text-slate-500 font-bold">
                Showing all {filteredPosts.length} Combined Stream Posts (Jobs, Announcements & Training)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                All Stream Entries Loaded Chronologically
              </span>
            </div>

          </div>
        </div>
      )}

      {/* CREATE NEW COMMUNITY POST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">📢</span>
                <h3 className="font-outfit font-extrabold text-slate-800 text-base">Create New Community Post</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm font-bold transition-all"
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-left">
              {/* Title */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Post Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 🎉 JobConnect 10,000 Placements Achieved!"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669] focus:bg-white transition-all"
                />
              </div>

              {/* Category & Status Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Post Category</label>
                  <select 
                    value={formData.post_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, post_type: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#059669]"
                  >
                    <option value="Community Announcement">Community Announcement</option>
                    <option value="Training & Overseas">Training & Overseas</option>
                    <option value="Featured Banner">Featured Banner</option>
                    <option value="Community Update">Community Update</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Initial Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#059669]"
                  >
                    <option value="published">Publish Immediately</option>
                    <option value="draft">Save as Draft</option>
                  </select>
                </div>
              </div>

              {/* Body / Description */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Post Content / Description *</label>
                <textarea 
                  rows="4"
                  required
                  placeholder="Enter detailed description of the community announcement or update..."
                  value={formData.body}
                  onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                  className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669] focus:bg-white transition-all resize-none"
                ></textarea>
              </div>

              {/* CTA Link Optional */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">CTA Label (Optional)</label>
                  <input 
                    type="text"
                    placeholder="e.g. Read Full Story"
                    value={formData.cta_label}
                    onChange={(e) => setFormData(prev => ({ ...prev, cta_label: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">CTA URL (Optional)</label>
                  <input 
                    type="text"
                    placeholder="e.g. https://jobrito.com/blog/..."
                    value={formData.cta_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, cta_url: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669]"
                  />
                </div>
              </div>

              {/* Actions Footer */}
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
                  className="px-5 py-2 bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-xs font-bold shadow-sm shadow-[#059669]/10 transition-all"
                >
                  {submitting ? 'Creating...' : 'Submit & Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
