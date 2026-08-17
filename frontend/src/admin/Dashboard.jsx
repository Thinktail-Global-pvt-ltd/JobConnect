import React, { useEffect, useState } from 'react';
import { Users, Briefcase, FileText, Share2, ClipboardList, Clock, ArrowUpRight, ArrowDownRight, Award, Bell, Utensils, CalendarRange, Download, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockApi } from '../services/api';
import { useTheme, THEMES } from '../context/ThemeContext';

// Helper to extract initials from notification titles or recipient names (for dark mode fallback)
const getInitials = (name) => {
  if (!name) return '🔔';
  const clean = name.replace(/^(Chef|Employer|Super\s+Admin|System)\s+/i, '').trim();
  const parts = clean.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  if (parts[0] && parts[0].length > 0) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return '🔔';
};

// Helper to assign a color scheme to user avatars in dark mode
const getAvatarColors = (index, isLight) => {
  const lightColors = [
    'bg-blue-50 text-blue-600 border-blue-100',
    'bg-emerald-50 text-emerald-600 border-emerald-100',
    'bg-amber-50 text-amber-600 border-amber-100',
    'bg-rose-50 text-rose-600 border-rose-100',
    'bg-purple-50 text-purple-600 border-purple-100'
  ];
  const darkColors = [
    'bg-blue-950/40 text-blue-400 border-blue-800/40',
    'bg-emerald-950/40 text-emerald-400 border-emerald-800/40',
    'bg-amber-950/40 text-amber-400 border-amber-800/40',
    'bg-rose-950/40 text-rose-400 border-rose-800/40',
    'bg-purple-950/40 text-purple-400 border-purple-800/40'
  ];
  const list = isLight ? lightColors : darkColors;
  return list[index % list.length];
};

// High quality Unsplash profile images to match the timeline activity in the screenshot
const getAvatarUrl = (index) => {
  const urls = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80', // Jordan Smith
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80', // Sarah Chen
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80', // Marcus Thorne
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80', // Elena Vance
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&h=100&q=80'  // System
  ];
  return urls[index % urls.length];
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [notificationsList, setNotificationsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Theme context integration
  const { theme, THEMES: ctxTHEMES } = useTheme();
  const currentTheme = theme || 'light';
  const THEMES_LOCAL = ctxTHEMES || { LIGHT: 'light', DARK: 'dark', EMERALD: 'emerald' };
  const isLight = currentTheme === THEMES_LOCAL.LIGHT;
  const isEmerald = currentTheme === THEMES_LOCAL.EMERALD;

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
      colorClass: 'text-[#137333] bg-[#E6F4EA] border-emerald-100',
      barClass: 'bg-[#137333] w-[75%]',
      link: '/admin/users'
    },
    {
      title: 'TOTAL EMPLOYERS',
      count: Number(stats.employers_count || 0).toLocaleString(),
      change: '+5%',
      isPositive: true,
      icon: <Building className="w-5 h-5" />, // Swapped to Building to match the screenshot
      colorClass: 'text-[#00796B] bg-[#E0F2F1] border-teal-100',
      barClass: 'bg-[#00796B] w-[55%]',
      link: '/admin/employers'
    },
    {
      title: 'TOTAL JOBS',
      count: Number(stats.jobs_total || 0).toLocaleString(),
      change: '-2%',
      isPositive: false,
      icon: <Briefcase className="w-5 h-5" />, // Swapped to Briefcase to match the screenshot
      colorClass: 'text-[#C5221F] bg-[#FCE8E6] border-blue-100',
      barClass: 'bg-[#C5221F] w-[60%]',
      link: '/admin/jobs'
    },
    {
      title: 'TOTAL REFERRALS',
      count: Number(stats.referrals_count || 0).toLocaleString(),
      change: '+18%',
      isPositive: true,
      icon: <Share2 className="w-5 h-5" />,
      colorClass: 'text-[#137333] bg-[#E6F4EA] border-emerald-100',
      barClass: 'bg-[#137333] w-[40%]',
      link: '/admin/referrals'
    },
    {
      title: 'CHEF PROFILES',
      count: Number(stats.chefs_total || 0).toLocaleString(),
      change: '+8%',
      isPositive: true,
      icon: <Award className="w-5 h-5" />,
      colorClass: 'text-[#00796B] bg-[#E0F2F1] border-teal-100',
      barClass: 'bg-[#00796B] w-[65%]',
      link: '/admin/chefs'
    },
    {
      title: 'TOTAL APPLICATIONS',
      count: Number(stats.applications_count || 0).toLocaleString(),
      change: '+15%',
      isPositive: true,
      icon: <FileText className="w-5 h-5" />, // Swapped to FileText to match the screenshot
      colorClass: 'text-[#C5221F] bg-[#FCE8E6] border-blue-100',
      barClass: 'bg-[#C5221F] w-[50%]',
      link: '/admin/applications'
    },
  ];

  // Dynamic panel style helper
  const containerClass = isLight 
    ? 'bg-[#f1f2f4] border border-[#d0d5db] shadow-sm rounded-xl overflow-hidden' 
    : isEmerald 
      ? 'bg-[#01241A] border border-emerald-900/60 shadow-2xl rounded-2xl overflow-hidden' 
      : 'bg-[#0B1120] border border-[#1E293B] shadow-2xl rounded-2xl overflow-hidden';

  return (
    <div className="space-y-3 text-left">
      {/* Title Header Section */}
      <div className={`py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isLight ? 'bg-transparent' : 'bg-[#0B1120] p-6 rounded-2xl border border-[#1E293B] shadow-2xl'
      }`}>
        <div>
          <h2 className={`font-outfit font-black text-[32px] tracking-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>Dashboard Overview</h2>
          <p className={`text-[16px] font-semibold mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Real-time performance metrics for the JobConnect platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/notifications"
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer text-xs font-extrabold ${
              isLight 
                ? 'bg-white hover:bg-slate-55 text-slate-700 border border-slate-200 shadow-sm' 
                : 'bg-[#1E293B] hover:bg-slate-800 text-slate-200 border border-slate-700'
            }`}
          >
            <Bell className="w-4 h-4 text-[#059669]" />
            <span>Audit Logs ({notificationsList.length})</span>
          </Link>

          {/* Visual controls from screenshot */}
          {isLight && (
            <>
              <button
                className="px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm"
              >
                <CalendarRange className="w-4 h-4 text-slate-500" />
                <span>Last 30 Days</span>
              </button>

              <button
                className="px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer text-xs font-semibold bg-[#E27226] hover:bg-[#C95F1B] text-white shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* KPI Stats Grid - Top Row (3 Columns for Detailed Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {kpiMetrics.slice(0, 3).map((kpi, idx) => {
          let cardBg = isLight 
            ? 'relative overflow-hidden bg-[#f1f2f4] border-[#d0d5db] hover:border-[#b8c0ca] shadow-sm' 
            : isEmerald 
              ? 'relative overflow-hidden bg-[#01241A] border-emerald-900/60 hover:border-emerald-500/60 shadow-2xl' 
              : 'relative overflow-hidden bg-[#0B1120] border-[#1E293B] hover:border-[#059669]/60 shadow-2xl';

          let iconWrapperClass = '';
          let badgeClass = '';
          let bottomProgressClass = '';

          if (idx === 0) {
            iconWrapperClass = isLight ? 'text-[#137333] bg-[#E6F4EA] border border-[#D1E7DD]' : 'text-emerald-500 bg-emerald-950/40 border border-emerald-900/60';
            badgeClass = isLight ? 'bg-[#E6F4EA] text-[#137333] border border-[#D1E7DD] font-black' : 'bg-emerald-950 text-emerald-400 border border-emerald-800';
            bottomProgressClass = 'w-[45%] bg-[#137333]';
          } else if (idx === 1) {
            iconWrapperClass = isLight ? 'text-[#00796B] bg-[#E0F2F1] border border-[#B2DFDB]' : 'text-teal-400 bg-teal-950/40 border border-teal-900/60';
            badgeClass = isLight ? 'bg-[#E0F2F1] text-[#00796B] border border-[#B2DFDB] font-black' : 'bg-teal-950 text-teal-400 border border-teal-800';
            bottomProgressClass = 'w-[30%] bg-[#00796B]';
          } else { // idx === 2
            iconWrapperClass = isLight ? 'text-[#C5221F] bg-[#FCE8E6] border border-[#F8D7DA]' : 'text-blue-400 bg-blue-950/40 border border-blue-900/60';
            badgeClass = isLight ? 'bg-[#FCE8E6] text-[#C5221F] border border-[#F8D7DA] font-black' : 'bg-rose-950 text-rose-400 border border-rose-800';
            bottomProgressClass = 'w-[35%] bg-[#C5221F]';
          }

          return (
            <Link
              key={kpi.title}
              to={kpi.link}
              className={`${cardBg} p-4 rounded-xl border flex flex-col justify-between transition-all group min-h-[140px]`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold shadow-sm ${iconWrapperClass}`}>
                  {kpi.icon}
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-md flex items-center gap-0.5 ${badgeClass}`}>
                  {kpi.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {kpi.change}
                </span>
              </div>

              <div className="mt-4 mb-2">
                <span className={`text-[9px] font-black uppercase tracking-widest block truncate ${isLight ? 'text-slate-400' : 'text-slate-400'}`}>{kpi.title}</span>
                <span className={`font-outfit font-black text-2xl mt-0.5 block leading-none ${isLight ? 'text-slate-800' : 'text-white'}`}>{kpi.count}</span>
              </div>

              {/* Progress Line touching the bottom-left edge to match the screenshot exactly */}
              <div className="absolute bottom-5 left-5 right-5 h-[4px] bg-[#e1e5e9]"><div className={`h-full rounded-r-full ${bottomProgressClass}`}></div></div>
            </Link>
          );
        })}
      </div>

      {/* KPI Stats Grid - Bottom Row (3 Columns for Simple Inline Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {kpiMetrics.slice(3, 6).map((kpi, idx) => {
          let cardBg = isLight 
            ? 'bg-[#f1f2f4] border-[#d0d5db] hover:border-[#b8c0ca] shadow-sm' 
            : isEmerald 
              ? 'bg-[#01241A] border-emerald-900/60 hover:border-emerald-500/60 shadow-2xl' 
              : 'bg-[#0B1120] border-[#1E293B] hover:border-[#059669]/60 shadow-2xl';

          let iconWrapperClass = '';
          if (idx === 0) {
            // Referrals — matches Users green tone from top row
            iconWrapperClass = isLight ? 'text-[#137333] bg-[#E6F4EA] border border-[#D1E7DD]' : 'text-purple-400 bg-purple-950/40 border border-purple-900/60';
          } else if (idx === 1) {
            // Chef Profiles — matches Employers teal tone from top row
            iconWrapperClass = isLight ? 'text-[#00796B] bg-[#E0F2F1] border border-[#B2DFDB]' : 'text-amber-400 bg-amber-950/40 border border-amber-900/60';
          } else {
            // Applications — matches Jobs coral tone from top row
            iconWrapperClass = isLight ? 'text-[#C5221F] bg-[#FCE8E6] border border-[#F8D7DA]' : 'text-rose-400 bg-rose-950/40 border border-rose-900/60';
          }

          // Use Utensils icon for chef profiles to match fork/knife in screenshot
          const displayIcon = (idx === 1) ? <Utensils className="w-5 h-5" /> : kpi.icon;

          return (
            <Link
              key={kpi.title}
              to={kpi.link}
              className={`${cardBg} p-3 rounded-xl border flex items-center gap-3 transition-all group min-h-[72px]`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${iconWrapperClass}`}>
                {displayIcon}
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-[9px] font-black uppercase tracking-widest block truncate ${isLight ? 'text-slate-400' : 'text-slate-400'}`}>{kpi.title}</span>
                <span className={`font-outfit font-black text-2xl mt-0.5 block leading-none ${isLight ? 'text-slate-800' : 'text-white'}`}>{kpi.count}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Split Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        
        {/* Left: Pending Actions (3/5) */}
        <div className="lg:col-span-3">
          <div className={`${containerClass} h-full flex flex-col justify-between`}>
            <div>
              <div className={`p-3 border-b flex justify-between items-center ${
                isLight ? 'border-slate-200 bg-transparent' : 'border-[#1E293B] bg-[#0F172A]/40'
              }`}>
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">📋</span>
                  <h3 className={`font-outfit font-black text-base ${isLight ? 'text-[#1d4b78]' : 'text-white'}`}>Pending Actions</h3>
                </div>
                <Link to="/admin/jobs" className={`text-xs font-black hover:underline ${isLight ? 'text-slate-500' : 'text-[#059669]'}`}>
                  View All Actions →
                </Link>
              </div>

              <div className="p-3 space-y-2">
                {/* Item 1 */}
                <Link 
                  to="/admin/jobs" 
                  className={`p-4 border rounded-2xl flex items-center gap-4 transition-all ${
                    isLight 
                      ? 'bg-white border-[#d0d5db] hover:border-[#b8c0ca] hover:shadow-sm' 
                      : 'bg-[#0F172A]/60 border-[#1E293B] hover:border-emerald-600/40'
                  }`}
                >
                  <div className="w-11 h-11 rounded-xl bg-[#34A853] text-white flex items-center justify-center font-black font-outfit text-base shadow-sm shrink-0">
                    {pendingJobs.length || stats.jobs_pending || 0}
                  </div>
                  <div className="flex-grow min-w-0">
                    <span className={`text-xs font-black block ${isLight ? 'text-slate-800' : 'text-white'}`}>Jobs Awaiting Approval</span>
                    <span className={`text-[11px] font-semibold mt-0.5 block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Review required for new hospitality job listings.</span>
                  </div>
                </Link>

                {/* Item 2 */}
                <Link 
                  to="/admin/chefs" 
                  className={`p-4 border rounded-2xl flex items-center gap-4 transition-all ${
                    isLight 
                      ? 'bg-white border-[#d0d5db] hover:border-[#b8c0ca] hover:shadow-sm' 
                      : 'bg-[#0F172A]/60 border-[#1E293B] hover:border-emerald-600/40'
                  }`}
                >
                  <div className="w-11 h-11 rounded-xl bg-[#00ACC1] text-white flex items-center justify-center font-black font-outfit text-base shadow-sm shrink-0">
                    {stats.chefs_pending || 0}
                  </div>
                  <div className="flex-grow min-w-0">
                    <span className={`text-xs font-black block ${isLight ? 'text-slate-800' : 'text-white'}`}>Chef Profiles Awaiting Approval</span>
                    <span className={`text-[11px] font-semibold mt-0.5 block ${isLight ? 'text-slate-550' : 'text-slate-400'}`}>Portfolio validation for registered chefs.</span>
                  </div>
                </Link>

                {/* Item 3 */}
                <Link 
                  to="/admin/training" 
                  className={`p-4 border rounded-2xl flex items-center gap-4 transition-all ${
                    isLight 
                      ? 'bg-white border-[#d0d5db] hover:border-[#b8c0ca] hover:shadow-sm' 
                      : 'bg-[#0F172A]/60 border-[#1E293B] hover:border-emerald-600/40'
                  }`}
                >
                  <div className="w-11 h-11 rounded-xl bg-[#FF5722] text-white flex items-center justify-center font-black font-outfit text-base shadow-sm shrink-0">
                    {stats.training_opportunities || 0}
                  </div>
                  <div className="flex-grow min-w-0">
                    <span className={`text-xs font-black block ${isLight ? 'text-slate-800' : 'text-white'}`}>Training & Overseas Drafts</span>
                    <span className={`text-[11px] font-semibold mt-0.5 block ${isLight ? 'text-slate-550' : 'text-slate-400'}`}>Update and publish international programs.</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recent Activity Feed (2/5) */}
        <div className="lg:col-span-2">
          <div className={`${containerClass} flex flex-col justify-between h-full`}>
            <div>
              <div className={`p-3 border-b flex items-center justify-between ${
                isLight ? 'border-slate-200 bg-transparent' : 'border-[#1E293B] bg-[#0F172A]/40'
              }`}>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-[#059669]" />
                  <h3 className={`font-outfit font-black text-base ${isLight ? 'text-[#1d4b78]' : 'text-white'}`}>Recent Activity Feed</h3>
                </div>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                  isLight 
                    ? 'bg-slate-100 text-slate-500 border-slate-200' 
                    : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                }`}>
                  {notificationsList.length} Total Logs
                </span>
              </div>

              <div className="p-3 space-y-3">
                {notificationsList.length > 0 ? (
                  notificationsList.slice(0, 5).map((notif, index) => (
                    <div key={notif.id || index} className="flex gap-4 relative">
                      {/* Vertical timeline line */}
                      {index < Math.min(notificationsList.slice(0, 5).length - 1, 4) && (
                        <div className={`absolute left-[18px] top-9 bottom-[-16px] w-[2px] ${
                          isLight ? 'bg-[#cbd5df]' : 'bg-[#1E293B]/40'
                        }`} />
                      )}

                      {/* Avatar initials badge or Unsplash profile photos in light mode */}
                      {isLight ? (
                        <img 
                          src={getAvatarUrl(index)} 
                          alt="Avatar" 
                          className="w-9 h-9 rounded-full object-cover relative z-10 border-2 border-white shadow-sm shrink-0" 
                        />
                      ) : (
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs shrink-0 font-bold relative z-10 border-2 ${
                          isLight ? 'border-white shadow-sm' : 'border-[#0B1120]'
                        } ${getAvatarColors(index, isLight)}`}>
                          {getInitials(notif.recipient_name || notif.title || 'Sys')}
                        </div>
                      )}

                      <div className="space-y-0.5 flex-1 min-w-0">
                        <p className={`text-xs font-bold leading-snug truncate ${isLight ? 'text-slate-800' : 'text-white'}`} title={notif.title}>
                          {notif.title || 'System Notification'}
                        </p>
                        <p className={`text-[11px] font-semibold line-clamp-2 leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          {notif.body || notif.message || 'No details provided.'}
                        </p>
                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                          {(notif.recipient_name || notif.user_id) && (
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded border truncate max-w-[120px] ${
                              isLight 
                                ? 'text-slate-500 bg-slate-50 border-slate-200' 
                                : 'text-emerald-400 bg-emerald-950 border-emerald-800'
                            }`}>
                              To: {notif.recipient_name || notif.user_id}
                            </span>
                          )}
                          <span className={`text-[10px] font-semibold ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                            {notif.created_at || notif.time || 'Recently'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={`text-xs font-semibold text-center py-6 ${isLight ? 'text-slate-400' : 'text-slate-400'}`}>No recent actions logged.</p>
                )}
              </div>
            </div>

            <div className={`px-6 py-4 border-t text-center ${
              isLight ? 'border-slate-200 bg-white' : 'border-[#1E293B] bg-[#0F172A]/40'
            }`}>
              <Link to="/admin/notifications" className="text-xs font-black text-[#1E3A8A] hover:underline flex items-center justify-center gap-1.5 w-full">
                Full Audit Log
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}