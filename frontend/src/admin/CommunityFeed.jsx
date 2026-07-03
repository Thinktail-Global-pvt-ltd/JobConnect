import React, { useState } from 'react';
import { Megaphone, FileText, Eye, Clock, Plus, Edit3, FolderDown, Trash2, ArrowUpRight, RotateCcw, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const INITIAL_POSTS = [
  {
    id: '1',
    uid: 'AN-2024-081',
    title: 'New Health Benefits Package 2024',
    post_type: 'Community Announcement',
    post_type_color: 'bg-[#ccfbf1] text-[#0f766e] border-[#99f6e4]',
    status: 'Published',
    status_color: 'text-emerald-600 bg-emerald-500',
    date: 'Oct 12, 2023',
    icon_type: 'benefits'
  },
  {
    id: '2',
    uid: 'TO-2024-112',
    title: 'Culinary Leadership Workshop - Bali',
    post_type: 'Training & Overseas',
    post_type_color: 'bg-[#ffedd5] text-[#c2410c] border-[#fed7aa]',
    status: 'Draft',
    status_color: 'text-slate-400 bg-slate-300',
    date: '-',
    icon_type: 'workshop'
  },
  {
    id: '3',
    uid: 'FB-2023-001',
    title: 'Annual Chef Excellence Awards 2023',
    post_type: 'Featured Banner',
    post_type_color: 'bg-[#d1fae5] text-[#065f46] border-[#a7f3d0]',
    status: 'Archived',
    status_color: 'text-rose-500 bg-rose-500',
    date: 'Jan 15, 2023',
    icon_type: 'awards'
  },
  {
    id: '4',
    uid: 'CU-2024-002',
    title: 'Platform Maintenance Notice',
    post_type: 'Community Update',
    post_type_color: 'bg-[#dbeafe] text-[#1d4ed8] border-[#bfdbfe]',
    status: 'Published',
    status_color: 'text-emerald-600 bg-emerald-500',
    date: 'Nov 02, 2023',
    icon_type: 'maintenance'
  }
];

export default function CommunityFeed() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [tab, setTab] = useState('all');

  const handlePublish = (id) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'Published', status_color: 'text-emerald-600 bg-emerald-500', date: 'Just Now' } : p));
  };

  const handleArchive = (id) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'Archived', status_color: 'text-rose-500 bg-rose-500' } : p));
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to permanently delete this post?")) {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleRestore = (id) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'Draft', status_color: 'text-slate-400 bg-slate-300', date: '-' } : p));
  };

  const filteredPosts = posts.filter(p => {
    if (tab === 'published') return p.status === 'Published';
    if (tab === 'drafts') return p.status === 'Draft';
    if (tab === 'archived') return p.status === 'Archived';
    return true;
  });

  const getPlaceholderIcon = (type) => {
    switch (type) {
      case 'benefits': return '🏥';
      case 'workshop': return '🍳';
      case 'awards': return '🏆';
      default: return '📢';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit font-extrabold text-2xl text-slate-800">Community Feed Manager</h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Manage and schedule content across all community platforms.</p>
        </div>

        <button className="bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-5 py-2.5 text-xs font-bold shadow-sm shadow-[#059669]/10 transition-all hover:-translate-y-0.5 flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          Create New Post
        </button>
      </div>

      {/* KPI Stats Row (4 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4 text-left">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block leading-tight">124</span>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1 block">Active Posts</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4 text-left">
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block leading-tight">12</span>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1 block">Drafts Pending</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4 text-left">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block leading-tight">4.2k</span>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1 block">Total Engagement</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4 text-left">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block leading-tight">5</span>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1 block">Scheduled for Oct</span>
          </div>
        </div>

      </div>

      {/* Posts Table Board */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        
        {/* Navigation Tabs and Sorting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border-b border-[#e2e8f0] bg-slate-50/10">
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setTab('all')} 
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${tab === 'all' ? 'bg-[#eff6ff] text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}>
              All Posts
            </button>
            <button onClick={() => setTab('published')} 
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${tab === 'published' ? 'bg-[#eff6ff] text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}>
              Published
            </button>
            <button onClick={() => setTab('drafts')} 
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${tab === 'drafts' ? 'bg-[#eff6ff] text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}>
              Drafts
            </button>
            <button onClick={() => setTab('archived')} 
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${tab === 'archived' ? 'bg-[#eff6ff] text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}>
              Archived
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <span>Sort by:</span>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-[#e2e8f0] rounded-lg hover:bg-slate-50 text-slate-700">
              Newest First
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Table list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30 border-b border-[#e2e8f0] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Title</th>
                <th className="py-4 px-6">Post Type</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Publish Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0] text-slate-700 text-xs font-semibold">
              {filteredPosts.map(post => (
                <tr key={post.id} className="hover:bg-slate-50/20 transition-colors">
                  
                  {/* Title column with image preview square */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 border border-[#e2e8f0] flex items-center justify-center text-lg shadow-sm">
                        {getPlaceholderIcon(post.icon_type)}
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-800 text-[13px] block leading-tight">{post.title}</span>
                        <span className="text-[10px] text-slate-400 font-bold block mt-1">ID: {post.uid}</span>
                      </div>
                    </div>
                  </td>

                  {/* Post Type Badge */}
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border ${post.post_type_color}`}>
                      {post.post_type}
                    </span>
                  </td>

                  {/* Status Indicator */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${post.status_color}`} />
                      <span className="text-slate-600 font-bold">{post.status}</span>
                    </div>
                  </td>

                  {/* Publish Date */}
                  <td className="py-4 px-6 text-slate-500 font-bold">
                    {post.date}
                  </td>

                  {/* Actions buttons */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {post.status === 'Draft' && (
                        <button onClick={() => handlePublish(post.id)} className="bg-[#065f46] hover:bg-[#044e39] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors">
                          Publish
                        </button>
                      )}

                      {post.status === 'Archived' ? (
                        <>
                          <button onClick={() => handleRestore(post.id)} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 border border-[#e2e8f0] text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors" title="Restore to Draft">
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(post.id)} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-rose-50 border border-[#e2e8f0] text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 border border-[#e2e8f0] text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors" title="Edit">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleArchive(post.id)} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-amber-50 border border-[#e2e8f0] text-slate-400 hover:text-amber-600 flex items-center justify-center transition-colors" title="Archive">
                            <FolderDown className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer pagination */}
        <div className="px-6 py-4 flex justify-between items-center border-t border-[#e2e8f0] bg-slate-50/10">
          <span className="text-xs text-slate-400 font-bold">Showing 1-4 of 136 posts</span>
          
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-slate-400"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-7 h-7 rounded-lg bg-[#065f46] text-white flex items-center justify-center text-xs font-bold">1</button>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">2</button>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">3</button>
            <span className="text-slate-400 px-1 font-bold">...</span>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">34</button>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-slate-400"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

      </div>

    </div>
  );
}
