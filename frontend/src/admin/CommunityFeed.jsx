import React, { useEffect, useState } from 'react';
import { Megaphone, FileText, Plus, Trash2, ArrowUpRight, RotateCcw, Eye, Sparkles, CheckCircle2, Bookmark } from 'lucide-react';
import { mockApi } from '../services/api';

export default function CommunityFeed() {
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, archived: 0 });
  const [tab, setTab] = useState('all');
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

  // Load posts from backend API
  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getCommunityPosts();
      if (data && data.posts && data.posts.length > 0) {
        const formatted = data.posts.map(p => ({
          id: p.id,
          uid: `CP-${p.id}`,
          title: p.title,
          body: p.body,
          post_type: p.post_type || 'Community Announcement',
          status: p.status === 'published' ? 'Published' : p.status === 'archived' ? 'Archived' : 'Draft',
          date: p.created_at ? new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
          cta_label: p.cta_label,
          cta_url: p.cta_url
        }));
        setPosts(formatted);
        if (data.stats) {
          setStats(data.stats);
        } else {
          setStats({
            total: formatted.length,
            published: formatted.filter(p => p.status === 'Published').length,
            drafts: formatted.filter(p => p.status === 'Draft').length,
            archived: formatted.filter(p => p.status === 'Archived').length,
          });
        }
      } else {
        // Fallback default list if no DB posts exist yet
        setPosts([
          {
            id: 1,
            uid: 'AN-2024-081',
            title: 'New Health Benefits Package 2024',
            body: 'We are introducing comprehensive medical cover for all hospitality staff.',
            post_type: 'Community Announcement',
            status: 'Published',
            date: 'Oct 12, 2023',
          },
          {
            id: 2,
            uid: 'TO-2024-112',
            title: 'Culinary Leadership Workshop - Bali',
            body: 'International workshop for aspiring sous chefs and executive chefs.',
            post_type: 'Training & Overseas',
            status: 'Draft',
            date: 'Nov 02, 2023',
          },
          {
            id: 3,
            uid: 'FB-2023-001',
            title: 'Annual Chef Excellence Awards 2023',
            body: 'Celebrating top culinary talents across India and abroad.',
            post_type: 'Featured Banner',
            status: 'Archived',
            date: 'Jan 15, 2023',
          }
        ]);
        setStats({ total: 3, published: 1, drafts: 1, archived: 1 });
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
      id: Date.now(),
      uid: `CP-${Date.now().toString().slice(-4)}`,
      title: formData.title,
      body: formData.body,
      post_type: formData.post_type || 'Community Announcement',
      status: formData.status === 'published' ? 'Published' : 'Draft',
      date: 'Just Now',
      cta_label: formData.cta_label,
      cta_url: formData.cta_url
    };

    // Optimistically insert post & close modal instantly
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

  const handleStatusChange = async (id, newStatus) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    try {
      await mockApi.updateCommunityPostStatus(id, newStatus.toLowerCase());
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this community post?")) {
      setPosts(prev => prev.filter(p => p.id !== id));
      try {
        await mockApi.deleteCommunityPost(id);
      } catch (err) {
        console.error('Delete post failed:', err);
      }
    }
  };

  const filteredPosts = posts.filter(p => {
    if (tab === 'published') return p.status === 'Published';
    if (tab === 'drafts') return p.status === 'Draft';
    if (tab === 'archived') return p.status === 'Archived';
    return true;
  });

  const getPostBadgeColor = (type) => {
    switch (type) {
      case 'Community Announcement': return 'bg-[#ccfbf1] text-[#0f766e] border-[#99f6e4]';
      case 'Training & Overseas': return 'bg-[#ffedd5] text-[#c2410c] border-[#fed7aa]';
      case 'Featured Banner': return 'bg-[#d1fae5] text-[#065f46] border-[#a7f3d0]';
      default: return 'bg-[#dbeafe] text-[#1d4ed8] border-[#bfdbfe]';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header section with WORKING CREATE BUTTON */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit font-extrabold text-2xl text-slate-800">Community Feed Manager</h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Manage announcements, workshops, and featured banners on the candidate feed.</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-5 py-2.5 text-xs font-bold shadow-sm shadow-[#059669]/10 transition-all hover:-translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New Post
        </button>
      </div>

      {/* KPI Stats Row (4 Dynamic Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4 text-left">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block leading-tight">{posts.filter(p => p.status === 'Published').length}</span>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1 block">Active Posts</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4 text-left">
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block leading-tight">{posts.filter(p => p.status === 'Draft').length}</span>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1 block">Drafts Pending</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4 text-left">
          <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block leading-tight">{posts.length}</span>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1 block">Total Feed Posts</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#065f46] p-5 rounded-2xl shadow-sm flex items-center gap-4 text-left text-white">
          <div className="w-11 h-11 rounded-xl bg-emerald-800/60 text-emerald-200 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-outfit font-extrabold text-2xl block leading-tight">{posts.filter(p => p.status === 'Archived').length}</span>
            <span className="text-[10px] font-extrabold text-emerald-200 uppercase tracking-widest mt-1 block">Archived Posts</span>
          </div>
        </div>

      </div>

      {/* Main Table Board */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        
        {/* Tabs Bar */}
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-2">
            <button onClick={() => setTab('all')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${tab === 'all' ? 'bg-[#065f46] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              All Posts ({posts.length})
            </button>
            <button onClick={() => setTab('published')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${tab === 'published' ? 'bg-[#065f46] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              Published ({posts.filter(p => p.status === 'Published').length})
            </button>
            <button onClick={() => setTab('drafts')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${tab === 'drafts' ? 'bg-[#065f46] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              Drafts ({posts.filter(p => p.status === 'Draft').length})
            </button>
            <button onClick={() => setTab('archived')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${tab === 'archived' ? 'bg-[#065f46] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              Archived ({posts.filter(p => p.status === 'Archived').length})
            </button>
          </div>
        </div>

        {/* Table List */}
        {loading ? (
          <p className="text-center text-slate-400 text-xs font-medium py-16">Loading community posts...</p>
        ) : filteredPosts.length === 0 ? (
          <p className="text-center text-slate-400 text-sm font-medium py-16">No community posts found for this tab filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-[#e2e8f0] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Title</th>
                  <th className="py-4 px-6">Post Type</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Publish Date</th>
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
                          📢
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
                          Draft
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
                            onClick={() => handleStatusChange(post.id, 'Published')} 
                            className="px-3 py-1 bg-[#059669] hover:bg-[#047857] text-white text-[10px] font-bold rounded-md transition-all shadow-xs"
                          >
                            Publish
                          </button>
                        )}

                        {post.status === 'Published' && (
                          <button 
                            onClick={() => handleStatusChange(post.id, 'Archived')} 
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Archive"
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {post.status === 'Archived' && (
                          <button 
                            onClick={() => handleStatusChange(post.id, 'Draft')} 
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
                            title="Restore to Draft"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button 
                          onClick={() => handleDelete(post.id)} 
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
            Showing all {filteredPosts.length} Community Posts
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            All Posts Loaded At Once
          </span>
        </div>

      </div>

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
