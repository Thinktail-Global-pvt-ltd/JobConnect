import React, { useState, useEffect, useCallback, useRef } from 'react';
import { mockApi, realApi } from '../services/api';
import {
  RefreshCw, MapPin, Briefcase, Megaphone, ExternalLink,
  ChevronLeft, ChevronRight, Radio, Clock, Building2,
  CheckCircle, XCircle, Pin, Sparkles, Filter
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const categoryColor = (cat) => {
  switch (cat) {
    case 'overseas':  return 'bg-blue-50 text-blue-700 border-blue-100';
    case 'community': return 'bg-purple-50 text-purple-700 border-purple-100';
    default:          return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  }
};

const postTypeColor = (type) => {
  switch (type) {
    case 'announcement': return { bg: 'bg-amber-50 border-amber-200',   badge: 'bg-amber-100 text-amber-700',   icon: '📢' };
    case 'training':     return { bg: 'bg-blue-50 border-blue-200',     badge: 'bg-blue-100 text-blue-700',     icon: '🎓' };
    case 'banner':       return { bg: 'bg-purple-50 border-purple-200', badge: 'bg-purple-100 text-purple-700', icon: '🎯' };
    case 'update':       return { bg: 'bg-teal-50 border-teal-200',     badge: 'bg-teal-100 text-teal-700',     icon: '🔔' };
    default:             return { bg: 'bg-slate-50 border-slate-200',   badge: 'bg-slate-100 text-slate-600',   icon: '📋' };
  }
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   return 'Just now';
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

// ─────────────────────────────────────────────────────────────
// Job Card
// ─────────────────────────────────────────────────────────────
function JobCard({ item, onApprove, onReject }) {
  const isPinned   = item.is_pinned;
  const isReferral = item.is_referral;

  return (
    <div className={`relative bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md
      ${isPinned ? 'border-emerald-300 ring-1 ring-emerald-100' : 'border-[#e2e8f0]'}`}>

      {/* Pinned ribbon */}
      {isPinned && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400" />
      )}

      {/* Referral red left border */}
      {isReferral && (
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-rose-400 rounded-l-2xl" />
      )}

      <div className={`p-5 ${isReferral ? 'pl-6' : ''}`}>
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            {isPinned && (
              <span className="flex items-center gap-1 text-[9px] font-extrabold text-emerald-600 uppercase tracking-wider bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                <Pin className="w-2.5 h-2.5" /> Pinned
              </span>
            )}
            {isReferral && (
              <span className="text-[9px] font-extrabold text-rose-600 uppercase tracking-wider bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                Referral Post
              </span>
            )}
            <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${categoryColor(item.category)}`}>
              {item.category}
            </span>
            <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded border
              ${item.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                item.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                'bg-orange-50 text-orange-700 border-orange-100'}`}>
              {item.status}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 shrink-0">
            <Clock className="w-3 h-3" />
            {timeAgo(item.created_at)}
          </span>
        </div>

        {/* Company + title */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex-grow min-w-0">
            <p className="text-[10px] font-extrabold text-[#059669] truncate">{item.company}</p>
            <h3 className="font-outfit font-extrabold text-slate-800 text-[15px] leading-snug mt-0.5 truncate">{item.title}</h3>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-4 mt-3 flex-wrap">
          {item.location && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
              <MapPin className="w-3 h-3 text-slate-400" /> {item.location}
            </span>
          )}
          {item.salary && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
              💰 {item.salary}
            </span>
          )}
          {item.job_type && (
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              {item.job_type}
            </span>
          )}
        </div>

        {/* Description preview */}
        {item.description && (
          <p className="text-[11px] text-slate-400 font-medium mt-3 line-clamp-2">{item.description}</p>
        )}

        {/* Action buttons for pending */}
        {item.status === 'pending' && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
            <button onClick={() => onApprove(item.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm">
              <CheckCircle className="w-3.5 h-3.5" /> Approve
            </button>
            <button onClick={() => onReject(item.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all">
              <XCircle className="w-3.5 h-3.5" /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Admin Post Card
// ─────────────────────────────────────────────────────────────
function AdminPostCard({ item }) {
  const meta = postTypeColor(item.post_type);

  return (
    <div className={`relative bg-white rounded-2xl border-2 shadow-sm overflow-hidden ${meta.bg}`}>
      {/* Top gradient bar */}
      <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">{meta.icon}</span>
            <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full ${meta.badge}`}>
              Admin Post · {item.post_type}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo(item.created_at)}
          </span>
        </div>

        {/* Divider line — like WhatsApp referral left border */}
        <div className="flex gap-3">
          <div className="w-1 rounded-full bg-gradient-to-b from-amber-400 to-orange-400 shrink-0" />
          <div className="flex-grow">
            <h3 className="font-outfit font-extrabold text-slate-800 text-[15px] leading-snug">{item.title}</h3>
            <p className="text-[12px] text-slate-500 font-medium mt-1.5 leading-relaxed">{item.body}</p>
          </div>
        </div>

        {/* CTA Button */}
        {item.cta_label && item.cta_url && (
          <div className="mt-4 pt-4 border-t border-slate-100/60">
            <a href={item.cta_url} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all">
              {item.cta_label}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Inject frequency badge */}
        <div className="mt-3 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span className="text-[9px] font-extrabold text-amber-600">
            Injected every {item.inject_every ?? 2} jobs
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main LiveFeed Page
// ─────────────────────────────────────────────────────────────
export default function LiveFeed() {
  const [feedItems, setFeedItems]       = useState([]);
  const [stats, setStats]               = useState({ total: 0, jobs: 0, admin_posts: 0, pending: 0 });
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [page, setPage]                 = useState(1);
  const [lastPage, setLastPage]         = useState(1);
  const [filter, setFilter]             = useState('all');  // all | job | admin_post | pending
  const [categoryFilter, setCategoryFilter] = useState('');
  const autoTimer = useRef(null);

  // ── Fetch interleaved feed from Laravel ──────────────────
  const loadFeed = useCallback(async (pg = 1, silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      const params = { page: pg };
      if (categoryFilter) params.category = categoryFilter;

      const res = await realApi.get('/backend/api/feed', { params });
      const data = res.data;

      if (data.success) {
        const items = data.feed.data || [];
        setFeedItems(items);
        setLastPage(data.feed.last_page ?? 1);
        setPage(pg);

        const jobs       = items.filter(i => i._type === 'job');
        const adminPosts = items.filter(i => i._type === 'admin_post');
        setStats({
          total:       items.length,
          jobs:        jobs.length,
          admin_posts: adminPosts.length,
          pending:     jobs.filter(j => j.status === 'pending').length,
        });
      }
    } catch {
      // Fallback: load from mockApi for job data + fake admin post mix
      const jobsRes = await mockApi.getJobs();
      const items   = (jobsRes.jobs || []).map(j => ({ ...j, _type: 'job' }));
      setFeedItems(items);
      setStats({ total: items.length, jobs: items.length, admin_posts: 0, pending: items.filter(j => j.status === 'pending').length });
    }

    setLoading(false);
    setRefreshing(false);
  }, [categoryFilter]);

  useEffect(() => { loadFeed(1); }, [loadFeed]);

  // ── Auto-refresh every 30s ────────────────────────────────
  useEffect(() => {
    autoTimer.current = setInterval(() => loadFeed(page, true), 30000);
    return () => clearInterval(autoTimer.current);
  }, [loadFeed, page]);

  // ── Moderation actions ────────────────────────────────────
  const handleApprove = async (id) => {
    await mockApi.approveJob(id);
    loadFeed(page, true);
  };
  const handleReject = async (id) => {
    await mockApi.rejectJob(id);
    loadFeed(page, true);
  };

  // ── Client-side filter ────────────────────────────────────
  const displayed = feedItems.filter(item => {
    if (filter === 'job')        return item._type === 'job';
    if (filter === 'admin_post') return item._type === 'admin_post';
    if (filter === 'pending')    return item._type === 'job' && item.status === 'pending';
    return true;
  });

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="space-y-6 text-left">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm">
            <Radio className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-outfit font-extrabold text-2xl text-slate-800">Live Feed</h2>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Real-time interleaved view of job posts and admin community posts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Category filter */}
          <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
                  className="bg-white border border-[#e2e8f0] rounded-xl px-3 py-2 text-xs font-bold text-slate-600 focus:outline-none focus:border-emerald-400 transition-all">
            <option value="">All Categories</option>
            <option value="india">India</option>
            <option value="overseas">Overseas</option>
            <option value="community">Community</option>
          </select>

          <button onClick={() => loadFeed(page, true)}
                  className="bg-white border border-[#e2e8f0] rounded-xl px-4 py-2 text-xs font-bold text-slate-600 flex items-center gap-1.5 hover:bg-slate-50 transition-all shadow-sm">
            <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Items',    value: stats.total,       color: 'text-slate-800', bg: 'bg-slate-50',   icon: '📋' },
          { label: 'Job Posts',      value: stats.jobs,        color: 'text-emerald-700', bg: 'bg-emerald-50', icon: '💼' },
          { label: 'Admin Posts',    value: stats.admin_posts, color: 'text-amber-700',  bg: 'bg-amber-50',   icon: '📢' },
          { label: 'Pending Review', value: stats.pending,     color: 'text-orange-700', bg: 'bg-orange-50',  icon: '⏳' },
        ].map(card => (
          <div key={card.label} className={`${card.bg} rounded-2xl border border-white shadow-sm p-4 flex items-center gap-3`}>
            <span className="text-xl">{card.icon}</span>
            <div>
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">{card.label}</span>
              <span className={`font-outfit font-extrabold text-2xl block mt-0.5 ${card.color}`}>
                {loading ? '—' : card.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter Tabs ── */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="flex items-center gap-6 px-6 pt-4 border-b border-[#e2e8f0]">
          {[
            { key: 'all',        label: 'All Items' },
            { key: 'job',        label: 'Job Posts Only' },
            { key: 'admin_post', label: 'Admin Posts Only' },
            { key: 'pending',    label: 'Pending Jobs' },
          ].map(t => (
            <button key={t.key} onClick={() => setFilter(t.key)}
                    className={`text-xs font-bold pb-3 transition-all relative whitespace-nowrap
                      ${filter === t.key
                        ? 'text-[#065f46] border-b-2 border-[#10b981]'
                        : 'text-slate-400 hover:text-slate-700'}`}>
              {t.label}
            </button>
          ))}
          <span className="ml-auto pb-3 text-[10px] font-bold text-slate-400">
            {displayed.length} items
          </span>
        </div>

        {/* ── Feed Cards ── */}
        <div className="p-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
              <div className="w-7 h-7 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold">Loading live feed…</span>
            </div>
          ) : displayed.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <p className="text-3xl mb-3">📭</p>
              <p className="text-sm font-bold">No items in this feed yet</p>
              <p className="text-xs mt-1 text-slate-300">Post a job or create an admin community post to see the live feed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {displayed.map((item, idx) => (
                item._type === 'admin_post'
                  ? <AdminPostCard key={`ap-${item.id}-${idx}`} item={item} />
                  : <JobCard key={`job-${item.id}-${idx}`} item={item} onApprove={handleApprove} onReject={handleReject} />
              ))}
            </div>
          )}
        </div>

        {/* ── Pagination ── */}
        {!loading && lastPage > 1 && (
          <div className="px-6 py-4 flex justify-between items-center border-t border-[#e2e8f0] bg-slate-50/20">
            <span className="text-xs font-bold text-slate-400">Page {page} of {lastPage}</span>
            <div className="flex items-center gap-1.5">
              <button disabled={page === 1} onClick={() => loadFeed(page - 1)}
                      className="w-8 h-8 rounded-xl border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-slate-400 disabled:opacity-40 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(lastPage, 5) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => loadFeed(p)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all
                          ${p === page
                            ? 'bg-[#065f46] text-white shadow-sm'
                            : 'border border-[#e2e8f0] hover:bg-slate-50 text-slate-500'}`}>
                  {p}
                </button>
              ))}
              <button disabled={page === lastPage} onClick={() => loadFeed(page + 1)}
                      className="w-8 h-8 rounded-xl border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-slate-400 disabled:opacity-40 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
