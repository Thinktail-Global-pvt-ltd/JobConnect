import React, { useEffect, useState } from 'react';
import { Users, Briefcase, FileText, Share2, ClipboardList, Clock, ArrowUpRight, ArrowDownRight, Award, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockApi } from '../services/api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [notificationsList, setNotificationsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [res, notifRes] = await Promise.all([
          mockApi.getStats(),
          mockApi.getNotifications()
        ]);

        setData(res);

        if (notifRes && notifRes.success) {
          const rawList = notifRes.notifications || [];
          
          // Filter out WhatsApp & login_auth_code logs
          const fcmList = rawList.filter(item => {
            const type = String(item.type || '').toLowerCase();
            const title = String(item.title || '').toLowerCase();
            const body = String(item.body || item.message || '').toLowerCase();
            return !type.includes('whatsapp') && !title.includes('whatsapp') && !body.includes('whatsapp') && !type.includes('login_auth_code') && !title.includes('login_auth_code');
          });

          // Deduplicate
          const dedupedList = [];
          const seenMap = new Map();

          for (const notif of fcmList) {
            const recipientId = notif.user_id || notif.recipient_phone || notif.recipient_name || 'anon';
            const cleanTitle = (notif.title || '').trim().toLowerCase();
            const cleanBody = (notif.body || notif.message || '').trim().toLowerCase();
            const key = `${recipientId}_${cleanTitle}_${cleanBody}`;

            if (!seenMap.has(key)) {
              seenMap.set(key, true);
              dedupedList.push(notif);
            }
          }

          setNotificationsList(dedupedList);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-3 border-[#059669] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-extrabold text-slate-400">Loading Dashboard Analytics...</p>
      </div>
    );
  }

  const stats = data.stats;
  const pendingJobs = data.pendingJobs || [];

  const kpiMetrics = [
    {
      title: 'TOTAL USERS',
      count: Number(stats.users_count || 0).toLocaleString(),
      change: '+12%',
      isPositive: true,
      icon: <Users className="w-5 h-5" />,
      colorClass: 'text-emerald-500 bg-emerald-50 border-emerald-100',
      barClass: 'bg-emerald-500 w-[75%]',
      link: '/admin/users'
    },
    {
      title: 'TOTAL EMPLOYERS',
      count: Number(stats.employers_count || 0).toLocaleString(),
      change: '+5%',
      isPositive: true,
      icon: <Briefcase className="w-5 h-5" />,
      colorClass: 'text-teal-600 bg-teal-50 border-teal-100',
      barClass: 'bg-teal-600 w-[55%]',
      link: '/admin/employers'
    },
    {
      title: 'ACTIVE JOBS',
      count: Number(stats.jobs_total || 0).toLocaleString(),
      change: '-2%',
      isPositive: false,
      icon: <FileText className="w-5 h-5" />,
      colorClass: 'text-blue-600 bg-blue-50 border-blue-100',
      barClass: 'bg-blue-600 w-[60%]',
      link: '/admin/jobs'
    },
    {
      title: 'TOTAL REFERRALS',
      count: Number(stats.referrals_count || 0).toLocaleString(),
      change: '+18%',
      isPositive: true,
      icon: <Share2 className="w-5 h-5" />,
      colorClass: 'text-purple-600 bg-purple-50 border-purple-100',
      barClass: 'bg-purple-600 w-[40%]',
      link: '/admin/referrals'
    },
    {
      title: 'CHEF PROFILES',
      count: Number(stats.chefs_total || 0).toLocaleString(),
      change: '+8%',
      isPositive: true,
      icon: <Award className="w-5 h-5" />,
      colorClass: 'text-amber-600 bg-amber-50 border-amber-100',
      barClass: 'bg-amber-600 w-[65%]',
      link: '/admin/chefs'
    },
    {
      title: 'APPLICATIONS',
      count: Number(stats.applications_count || 0).toLocaleString(),
      change: '+15%',
      isPositive: true,
      icon: <ClipboardList className="w-5 h-5" />,
      colorClass: 'text-rose-600 bg-rose-50 border-rose-100',
      barClass: 'bg-rose-600 w-[50%]',
      link: '/admin/applications'
    },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Title Header Card */}
      <div className="bg-[#0B1120] p-6 rounded-3xl border border-[#1E293B] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit font-black text-2xl text-white tracking-tight">Dashboard Overview</h2>
          <p className="text-xs font-semibold text-slate-400 mt-1">Real-time performance metrics and live operational audit for the JobConnect platform.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/notifications"
            className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Bell className="w-4 h-4 text-[#059669]" />
            <span>Audit Logs ({notificationsList.length})</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid (6 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiMetrics.map((kpi) => (
          <Link
            key={kpi.title}
            to={kpi.link}
            className="bg-[#0B1120] p-5 rounded-3xl border border-[#1E293B] shadow-2xl flex flex-col justify-between hover:border-[#059669]/60 transition-all group min-h-[145px]"
          >
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border font-bold ${kpi.colorClass}`}>
                {kpi.icon}
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                kpi.isPositive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
              }`}>
                {kpi.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.change}
              </span>
            </div>

            <div className="mt-4">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block truncate">{kpi.title}</span>
              <span className="font-outfit font-black text-2xl text-white mt-0.5 block leading-none">{kpi.count}</span>
            </div>

            <div className="mt-3 h-1.5 w-full bg-[#1E293B] rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${kpi.barClass}`}></div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Split Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left: Pending Actions (3/5) */}
        <div className="lg:col-span-3">
          <div className="bg-[#0B1120] rounded-3xl border border-[#1E293B] shadow-2xl overflow-hidden h-full flex flex-col justify-between">
            <div>
              <div className="p-6 border-b border-[#1E293B] flex justify-between items-center bg-[#0F172A]/40">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">📋</span>
                  <h3 className="font-outfit font-black text-base text-white">Pending Actions</h3>
                </div>
                <Link to="/admin/jobs" className="text-xs font-black text-[#059669] hover:underline">
                  View All Actions →
                </Link>
              </div>

              <div className="p-6 space-y-4">
                {/* Item 1 */}
                <div className="p-4 bg-[#0F172A]/60 border border-[#1E293B] rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-[#059669] text-white flex items-center justify-center font-black font-outfit text-base shadow-md shrink-0">
                      {pendingJobs.length || stats.jobs_pending || 0}
                    </div>
                    <div>
                      <span className="text-xs font-black text-white block">Jobs Awaiting Approval</span>
                      <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block">Review required for new hospitality job listings.</span>
                    </div>
                  </div>
                  <Link to="/admin/jobs" className="bg-[#059669] hover:bg-[#047857] text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-md shrink-0">
                    Manage
                  </Link>
                </div>

                {/* Item 2 */}
                <div className="p-4 bg-[#0F172A]/60 border border-[#1E293B] rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-cyan-600 text-white flex items-center justify-center font-black font-outfit text-base shadow-md shrink-0">
                      {stats.chefs_pending || 0}
                    </div>
                    <div>
                      <span className="text-xs font-black text-white block">Chef Profiles Awaiting Approval</span>
                      <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block">Portfolio validation for registered chefs.</span>
                    </div>
                  </div>
                  <Link to="/admin/chefs" className="bg-[#059669] hover:bg-[#047857] text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-md shrink-0">
                    Manage
                  </Link>
                </div>

                {/* Item 3 */}
                <div className="p-4 bg-[#0F172A]/60 border border-[#1E293B] rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-black font-outfit text-base shadow-md shrink-0">
                      {stats.training_opportunities || 0}
                    </div>
                    <div>
                      <span className="text-xs font-black text-white block">Training & Overseas Drafts</span>
                      <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block">Update and publish international programs.</span>
                    </div>
                  </div>
                  <Link to="/admin/training" className="bg-[#059669] hover:bg-[#047857] text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-md shrink-0">
                    Manage
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recent Activity Feed (2/5) */}
        <div className="lg:col-span-2">
          <div className="bg-[#0B1120] rounded-3xl border border-[#1E293B] shadow-2xl overflow-hidden flex flex-col justify-between h-full">
            <div>
              <div className="p-6 border-b border-[#1E293B] flex items-center justify-between bg-[#0F172A]/40">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-[#059669]" />
                  <h3 className="font-outfit font-black text-base text-white">Recent Activity Feed</h3>
                </div>
                <span className="text-[10px] font-black bg-emerald-950 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-800">
                  {notificationsList.length} Total Logs
                </span>
              </div>

              <div className="p-6 space-y-4">
                {notificationsList.length > 0 ? (
                  notificationsList.slice(0, 5).map((notif, index) => (
                    <div key={notif.id || index} className="flex gap-3 pb-3.5 border-b border-[#1E293B]/60 last:border-0 last:pb-0">
                      <div className="w-9 h-9 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center text-xs shrink-0 font-bold">
                        🔔
                      </div>
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <p className="text-xs font-extrabold text-white leading-snug truncate" title={notif.title}>
                          {notif.title || 'System Notification'}
                        </p>
                        <p className="text-[11px] font-semibold text-slate-400 line-clamp-2 leading-relaxed">
                          {notif.body || notif.message || 'No details provided.'}
                        </p>
                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                          {(notif.recipient_name || notif.user_id) && (
                            <span className="text-[9px] font-black text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 truncate max-w-[120px]">
                              To: {notif.recipient_name || notif.user_id}
                            </span>
                          )}
                          <span className="text-[10px] font-semibold text-slate-400">
                            {notif.created_at || notif.time || 'Recently'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs font-semibold text-slate-400 text-center py-6">No recent actions logged.</p>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#1E293B] bg-[#0F172A]/40 text-center">
              <Link to="/admin/notifications" className="text-xs font-black text-[#059669] hover:underline flex items-center justify-center gap-1.5 w-full">
                View Full Audit Logs & Notifications →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
