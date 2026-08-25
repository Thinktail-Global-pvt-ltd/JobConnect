import React, { useEffect, useState } from 'react';
import { Megaphone, FileText, FileEdit, Trash2, RotateCcw, CheckCircle2, Bookmark, Eye, EyeOff, Pin, Plus, CalendarClock, Clock3, Briefcase, GraduationCap, Award, Radio, X, Search } from 'lucide-react';
import axios from 'axios';
import { mockApi } from '../services/api';

const BACKEND = 'http://178.16.138.159/backend';

export default function CommunityFeed() {
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, archived: 0, pinned: 0 });
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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
    is_pinned: false
  });

  const triggerAlert = (msg) => {
    alert(msg);
  };

  // Load unified admin stream
  const loadPosts = async () => {
    setLoading(true);
    setError(null);

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const endpoints = [
      '/backend/api/admin/community-posts',
      `${origin}/backend/api/admin/community-posts`,
      '/api/admin/community-posts',
      'http://178.16.138.159/backend/api/admin/community-posts'
    ];

    let data = null;
    for (const url of endpoints) {
      try {
        const res = await axios.get(url, { headers: { Accept: 'application/json' } });
        if (res.data && res.data.success) {
          data = res.data;
          break;
        }
      } catch (e) {
        // Continue fallback
      }
    }

    if (!data || !data.posts) {
      try {
        data = await mockApi.getCommunityPosts();
      } catch (err) {}
    }

    if (data && (data.posts || Array.isArray(data))) {
      let rawPosts = [];
      if (Array.isArray(data.posts)) {
        rawPosts = data.posts;
      } else if (data.posts && Array.isArray(data.posts.data)) {
        rawPosts = data.posts.data;
      } else if (Array.isArray(data.data)) {
        rawPosts = data.data;
      } else if (Array.isArray(data)) {
        rawPosts = data;
      }

      const postData = rawPosts.map(p => ({
        id: p.id || `post_${p.raw_id || Math.random()}`,
        raw_id: p.raw_id || p.id,
        source: p.source || 'admin_post',
        uid: p.uid || `AN-${p.id}`,
        title: p.title || p.program_name || 'Community Announcement',
        body: p.body || p.description || '',
        post_type: p.post_type || 'Community Announcement',
        status: p.status === 'published' ? 'Published' : (p.status === 'archived' ? 'Archived' : (p.status || 'Published')),
        is_pinned: Boolean(p.is_pinned),
        created_at: p.created_at,
        date: p.date || (p.created_at ? String(p.created_at).slice(0, 10) : 'Recently')
      }));

      postData.sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));
      setPosts(postData);
      setStats({
        total: postData.length,
        published: postData.filter(p => p.status === 'Published').length,
        drafts: postData.filter(p => p.status === 'Draft' || p.status === 'Pending').length,
        archived: postData.filter(p => p.status === 'Archived').length,
        pinned: postData.filter(p => Boolean(p.is_pinned)).length
      });
    } else {
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // Toggle pin â€” optimistic UI update, then persist to backend
  const handleTogglePin = async (id) => {
    const target = posts.find(p => p.id === id);
    const nextPinned = !target?.is_pinned;

    setPosts(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, is_pinned: nextPinned } : p);
      return [...updated].sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));
    });
    setStats(prev => ({
      ...prev,
      pinned: nextPinned ? prev.pinned + 1 : Math.max(0, prev.pinned - 1)
    }));
    triggerAlert(nextPinned ? 'Stream post pinned to top feed!' : 'Stream post unpinned.');

    try {
      await mockApi.togglePinCommunityPost(id, nextPinned);
    } catch (err) {
      console.error('Toggle pin failed:', err);
    } finally {
      loadPosts();
    }
  };

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
      cta_url: formData.cta_url,
      is_pinned: Boolean(formData.is_pinned)
    };

    setPosts(prev => {
      const updated = [tempNewPost, ...prev];
      return [...updated].sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));
    });

    setIsModalOpen(false);
    triggerAlert('New community feed post created successfully!');

    try {
      await axios.post(`${BACKEND}/api/admin/community-posts`, formData, {
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
      });
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
        is_pinned: false
      });
      loadPosts();
    }
  };

  // Status toggle handler: Publish / Archive / Restore
  const handleStatusChange = async (id, newStatus) => {
    const post = posts.find(p => p.id === id);
    const targetStatus = (newStatus === 'Published' || newStatus === 'published' || newStatus === 'approved') ? 'Published' : newStatus;

    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: targetStatus } : p));
    triggerAlert(`Post status changed to ${targetStatus}!`);

    const rawId = post?.raw_id || String(id).replace('job_', '').replace('post_', '');
    const isJob = post?.source === 'job_post' || String(id).startsWith('job_');

    if (isJob) {
      try {
        await mockApi.approveJob(rawId);
      } catch (e) {}

      const endpoints = [
        `/backend/api/admin/jobs/${rawId}/approve`,
        `/api/admin/jobs/${rawId}/approve`,
        `/backend/api/admin/community-posts/${id}`,
        `/api/admin/community-posts/${id}`,
        `/backend/api/admin/community-posts/${rawId}`,
        `/api/admin/community-posts/${rawId}`
      ];
      for (const ep of endpoints) {
        try {
          if (ep.includes('/approve')) {
            await axios.post(ep);
          } else {
            await axios.patch(ep, { status: 'published' }, { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } });
          }
        } catch (e) {}
      }
    } else {
      try {
        await mockApi.updateCommunityPostStatus(rawId, 'published');
      } catch (e) {}

      const endpoints = [
        `/backend/api/admin/community-posts/${id}`,
        `/api/admin/community-posts/${id}`,
        `/backend/api/admin/community-posts/${rawId}`,
        `/api/admin/community-posts/${rawId}`
      ];
      for (const ep of endpoints) {
        try {
          await axios.patch(ep, { status: targetStatus.toLowerCase() }, { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } });
        } catch (e) {}
      }
    }

    setTimeout(() => {
      loadPosts();
    }, 500);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this stream entry?")) {
      setPosts(prev => prev.filter(p => p.id !== id));
      alert('Stream entry deleted.');

      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const endpoints = [
        `/backend/api/admin/community-posts/${id}`,
        `${origin}/backend/api/admin/community-posts/${id}`,
        `/api/admin/community-posts/${id}`,
        `http://178.16.138.159/backend/api/admin/community-posts/${id}`
      ];

      for (const endpoint of endpoints) {
        try {
          const res = await axios.delete(endpoint, { headers: { Accept: 'application/json' } });
          if (res.data?.success) break;
        } catch (e) {
          try {
            const res = await axios.post(`${endpoint}/delete`, {}, { headers: { Accept: 'application/json' } });
            if (res.data?.success) break;
          } catch (err) {}
        }
      }

      if (String(id).startsWith('job_')) {
        const jobId = String(id).replace('job_', '');
        try {
          await axios.delete(`/backend/api/admin/jobs/${jobId}`);
        } catch (e) {
          try { await mockApi.deleteJob(jobId); } catch (err) {}
        }
      }

      try {
        await mockApi.deleteCommunityPost(id);
      } catch (e) {}

      setTimeout(() => {
        loadPosts();
      }, 300);
    }
  };

  const filteredPosts = posts.filter(p => {
    if (tab === 'published') return p.status === 'Published';
    if (tab === 'drafts') return p.status === 'Draft' || p.status === 'Pending';
    if (tab === 'pinned') return Boolean(p.is_pinned);
    if (tab === 'archived') return p.status === 'Archived';
    return true;
  }).filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.body && p.body.toLowerCase().includes(q)) ||
      (p.post_type && p.post_type.toLowerCase().includes(q)) ||
      (p.uid && p.uid.toLowerCase().includes(q))
    );
  });

  const getPostBadgeColor = (type = '') => {
    if (type.includes('REFERRAL') || type.includes('Referral')) return 'bg-purple-100 text-purple-800 border-purple-300';
    if (type.includes('Job Listing')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (type.includes('Training')) return 'bg-[#ffedd5] text-[#c2410c] border-[#fed7aa]';
    if (type.includes('Announcement')) return 'bg-[#ccfbf1] text-[#0f766e] border-[#99f6e4]';
    if (type.includes('Featured')) return 'bg-[#d1fae5] text-[#065f46] border-[#a7f3d0]';
    return 'bg-[#dbeafe] text-[#1d4ed8] border-[#bfdbfe]';
  };

  const getSourceIcon = (source, type = '') => {
    const iconClass = "w-4 h-4";
    if (source === 'job_post' || type.includes('Job Listing')) return <Briefcase className={iconClass} />;
    if (source === 'training' || type.includes('Training')) return <GraduationCap className={iconClass} />;
    if (type.includes('Announcement')) return <Megaphone className={iconClass} />;
    if (type.includes('Featured')) return <Award className={iconClass} />;
    return <Radio className={iconClass} />;
  };
  return (
    <div className="space-y-4 text-left">

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="shrink-0">
          <h2 className="font-outfit font-bold text-[20px] tracking-tight text-slate-900">Community Feed Manager</h2>
          <p className="text-[12px] font-medium text-slate-500 mt-0.5">Manage and schedule content across all community platforms.</p>
        </div>

        {/* Centered Search Bar */}
        <div className="relative flex-grow max-w-sm mx-auto md:mx-6 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search feed content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#cfd5dc] text-slate-700 text-xs py-2 pl-3.5 pr-9 rounded-xl focus:outline-none focus:border-[#f58220] shadow-sm transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {actionAlert && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl px-4 py-3 flex items-center justify-between shadow-xs transition-all">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionAlert}</span>
          </div>
          <button onClick={() => setActionAlert(null)} className="text-emerald-600 hover:text-emerald-800 font-extrabold text-sm cursor-pointer">✕</button>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl px-4 py-3">
          Could not load data: {error}. Check that the backend URL is reachable from your browser (CORS / mixed-content on an http endpoint can block this).
        </div>
      )}

      <div className="space-y-4">

        {/* Main Table Board */}
        <div className="bg-[#f4f5f6] rounded-xl border border-[#d9dee4] shadow-sm overflow-hidden">

          {/* Tabs Bar */}
          <div className="px-4 py-4 border-b border-[#d0d5db] flex items-center justify-between bg-[#f1f2f4]">
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setTab('all')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${tab === 'all' ? 'bg-[#e5e7eb] text-slate-900' : 'text-slate-700 hover:bg-[#e5e7eb]'}`}>
                All Stream Posts ({stats.total})
              </button>
              <button onClick={() => setTab('published')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${tab === 'published' ? 'bg-[#e5e7eb] text-slate-900' : 'text-slate-700 hover:bg-[#e5e7eb]'}`}>
                Published ({stats.published})
              </button>
              <button onClick={() => setTab('pinned')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${tab === 'pinned' ? 'bg-[#e5e7eb] text-slate-900' : 'text-slate-700 hover:bg-[#e5e7eb]'}`}>
                <Pin className="inline w-3 h-3 mr-1" /> Pinned ({stats.pinned})
              </button>
              <button onClick={() => setTab('drafts')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${tab === 'drafts' ? 'bg-[#e5e7eb] text-slate-900' : 'text-slate-700 hover:bg-[#e5e7eb]'}`}>
                Drafts / Unpublished ({stats.drafts})
              </button>
            </div>
            <button onClick={loadPosts} className="text-[10px] font-bold text-[#8aa0b9] hover:text-[#1d4b78] flex items-center gap-1 transition-colors cursor-pointer">
              <RotateCcw className="w-3 h-3" /> Refresh
            </button>
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
                  <tr className="bg-slate-50/50 border-b border-[#e2e8f0] text-[10px] font-bold text-[#8aa0b9] uppercase tracking-wider">
                    <th className="py-3 px-4">Entry Title & Details</th>
                    <th className="py-3 px-4">Post Type & Source</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Publish Date</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dce2e8] text-xs font-medium text-[#183b61]">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className={`hover:bg-[#eef3f7] transition-colors ${post.is_pinned ? 'bg-purple-50/30' : ''}`}>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {post.is_pinned && (
                            <Pin className="w-3.5 h-3.5 text-purple-600 shrink-0" title="Pinned to top feed priority" />
                          )}
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

                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-md text-[9px] font-extrabold uppercase tracking-wider border ${getPostBadgeColor(post.post_type)}`}>
                          {post.post_type}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        {post.status === 'Published' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-transparent text-[#006b57] border-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Published
                          </span>
                        ) : post.status === 'Archived' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-transparent text-[#c5221f] border-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            Archived
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-transparent text-[#b45309] border-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            Unpublished / Draft
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-[#5b7694] font-semibold">
                        {post.date}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {post.status !== 'Published' && (
                            <button
                              onClick={() => handleStatusChange(post.id, 'Published')}
                              className="px-3 py-1 bg-[#1d4b78] hover:bg-[#163b61] text-white text-[10px] font-extrabold rounded-md transition-all shadow-sm flex items-center gap-1 cursor-pointer font-bold"
                              title="Publish item to live feed"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Publish</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleTogglePin(post.id)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                              post.is_pinned
                                ? 'bg-[#8b35e8] text-white border-[#8b35e8] shadow-xs'
                                : 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-600 hover:text-white'
                            }`}
                            title={post.is_pinned ? "Unpin Post" : "Pin Post to Candidate Feed Top Priority"}
                          >
                            <Pin className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-1.5 rounded-lg bg-[#f1f4f7] hover:bg-[#fee2e2] text-[#8aa0b9] hover:text-[#c5221f] transition-colors cursor-pointer"
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

          <div className="px-4 py-4 flex justify-between items-center border-t border-[#e2e8f0] bg-[#f1f2f4]">
            <span className="text-xs text-[#5b7694] font-semibold">
              Showing all {filteredPosts.length} Combined Stream Posts (Jobs, Announcements & Training)
            </span>
          </div>
        </div>
      </div>

      {/* CREATE NEW COMMUNITY POST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-[#f1f2f4]">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center"><Megaphone className="w-4 h-4" /></span>
                <h3 className="font-outfit font-extrabold text-slate-800 text-base">Create New Community Post</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm font-bold transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Post Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JobConnect 10,000 Placements Achieved!"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#059669] focus:bg-white transition-all"
                />
              </div>

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

              <div className="flex items-center justify-between p-3.5 bg-purple-50/70 border border-purple-200/80 rounded-2xl">
                <div className="flex items-center gap-2.5">
                  <Pin className="w-4 h-4 text-purple-700" />
                  <div>
                    <span className="text-xs font-extrabold text-purple-900 block">Pin to Feed Top Priority</span>
                    <span className="text-[10px] font-semibold text-purple-600 block">Feature this post at the very top of candidate feeds</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  id="modal_is_pinned"
                  checked={formData.is_pinned}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_pinned: e.target.checked }))}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
                />
              </div>

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

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#f1f2f4] hover:bg-[#dfe5eb] text-[#506b89] rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-xs font-bold shadow-sm shadow-[#059669]/10 transition-all cursor-pointer"
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

