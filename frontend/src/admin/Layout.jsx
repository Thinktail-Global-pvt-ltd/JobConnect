import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, LogOut, ChevronDown, ChevronRight, Menu, PanelLeftClose, PanelLeftOpen, Sun, Moon, Sparkles, Palette, LayoutDashboard, UsersRound, BriefcaseBusiness, Share2, Radio, GraduationCap, Utensils, FileText, Building2, CircleHelp, Image, Settings2, CheckCircle2, CalendarCheck } from 'lucide-react';
import { useTheme, THEMES } from '../context/ThemeContext';
import { mockApi } from '../services/api';
import logoImg from '../assets/Jobrito full logo.png';
import orbLogo from '../assets/jobrito full logo.png';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme, THEMES } = useTheme();
  const [usersOpen, setUsersOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [counts, setCounts] = useState({
    users: 0,
    talent: 0,
    employers: 0,
    chefs: 0,
    jobs: 0,
    community: 0,
    training: 0,
    applications: 0,
    enquiries: 0,
  });

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await mockApi.getNotifications();
      if (res && res.success) {
        const rawList = res.notifications || [];
        // 1. Strictly filter out WhatsApp notifications & login_auth_code logs (Show only FCM Notifications)
        const fcmList = rawList.filter(item => {
          const type = String(item.type || '').toLowerCase();
          const title = String(item.title || '').toLowerCase();
          const body = String(item.body || item.message || '').toLowerCase();
          return !type.includes('whatsapp') && !title.includes('whatsapp') && !body.includes('whatsapp') && !type.includes('login_auth_code') && !title.includes('login_auth_code');
        });

        // 2. Deduplicate repeated identical notifications for the same recipient
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

        setNotifications(dedupedList);
        const unread = dedupedList.filter(item => !item.is_read).length;
        setUnreadCount(unread);
        setCounts(prev => ({ ...prev, notifications: unread }));
      }
    } catch (e) {
      console.error("Failed to fetch notifications:", e);
    }
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await mockApi.getSidebarStats();
        if (res && res.success && res.counts) {
          setCounts(res.counts);
        }
      } catch (e) {
        console.error("Failed to fetch sidebar counts:", e);
      }
    };
    fetchCounts();
    fetchNotifications();

    const timer = setInterval(() => {
      fetchCounts();
      fetchNotifications();
    }, 10000);

    return () => clearInterval(timer);
  }, [location.pathname]);

  const handleMarkRead = async (id) => {
    setNotifications(prev => prev.map(n => (n && n.id === id) ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    setCounts(prev => ({ ...prev, notifications: Math.max(0, (prev.notifications || 1) - 1) }));
    try {
      await mockApi.markNotificationRead(id);
      fetchNotifications();
    } catch (e) {}
  };

  const handleNotifClick = (item) => {
    if (!item) return;
    if (item.id) handleMarkRead(item.id);
    setNotifOpen(false);

    const deeplink = item.deeplink || item.target_url || item.url || item.path;
    if (deeplink) {
      if (deeplink.startsWith('http://') || deeplink.startsWith('https://')) {
        window.location.href = deeplink;
      } else {
        navigate(deeplink);
      }
    } else if (item.type === 'job_approved' || item.type === 'job_created') {
      navigate('/admin/jobs');
    } else if (item.type === 'chef_approved' || item.type === 'chef_onboarded') {
      navigate('/admin/chefs');
    } else if (item.type === 'application_received') {
      navigate('/admin/applications');
    } else {
      navigate('/admin/notifications');
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => (n ? { ...n, is_read: true } : n)));
    setUnreadCount(0);
    setCounts(prev => ({ ...prev, notifications: 0 }));
    try {
      await mockApi.markAllNotificationsRead();
      fetchNotifications();
    } catch (e) {}
  };

  const isActive = (path) => {
    return location.pathname === path || (path !== '/admin/dashboard' && location.pathname.startsWith(path));
  };

  const isUsersGroupActive = location.pathname.startsWith('/admin/users') || 
                             location.pathname.startsWith('/admin/employers') || 
                             location.pathname.startsWith('/admin/chefs');

  const mainNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: null, count: null },
  ];

  const userSubItems = [
    { name: 'Talent / Jobseeker', path: '/admin/users', icon: null, countKey: 'pending_talent' },
    { name: 'Employer', path: '/admin/employers', icon: null, countKey: 'pending_employers' },
    { name: 'Chef', path: '/admin/chefs', icon: null, countKey: 'pending_chefs' },
  ];

  const secondaryNavItems = [
    { name: 'Jobs', path: '/admin/jobs', icon: null, countKey: 'pending_jobs' },
    { name: 'Community Feed', path: '/admin/community', icon: null, countKey: 'community' },
    { name: 'Training & Placement', path: '/admin/training', icon: null, countKey: 'training' },
    { name: 'Applications', path: '/admin/applications', icon: null, countKey: 'applications' },
    { name: 'Appointment Request', path: '/admin/appointment-request', icon: null, countKey: null },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_user_id');
    sessionStorage.removeItem('admin_authenticated');
    window.location.href = '/admin/login';
  };

  const isLight = theme === THEMES.LIGHT;
  const isEmerald = theme === THEMES.EMERALD;
  const navIcon = (name, className = 'w-[21px] h-[21px]') => {
    const icons = {
      Dashboard: LayoutDashboard, Users: UsersRound, 'Talent / Jobseeker': UsersRound,
      Employer: Building2, Chef: Utensils, Jobs: BriefcaseBusiness, Referrals: Share2,
      'Community Feed': Radio, 'Training & Overseas': GraduationCap, 'Training & Placement': GraduationCap, Training: GraduationCap, Applications: FileText,
      'Appointment Request': CalendarCheck, Enquiries: CircleHelp, Banners: Image, Settings: Settings2, 'Notifications & Logs': Bell,
    };
    const Icon = icons[name] || LayoutDashboard;
    return <Icon className={className} strokeWidth={2.1} />;
  };

  const bgOuterClass = isLight ? 'admin-panel-root bg-[#F4F6F8] font-sans text-slate-900 min-h-screen flex w-full text-left overflow-x-hidden' : isEmerald ? 'admin-panel-root bg-[#011C14] font-sans text-emerald-100 min-h-screen flex w-full text-left overflow-x-hidden' : 'admin-panel-root bg-[#090D16] font-sans text-slate-100 min-h-screen flex w-full text-left overflow-x-hidden';
  
  // Custom deep blue/navy sidebar bg matching the screenshot for light theme
  const sidebarClass = isLight ? 'bg-[#153e69] border-r border-[#154172]' : isEmerald ? 'bg-[#01140E] border-r border-emerald-950/80' : 'bg-[#0B1120] border-r border-[#1E293B]';
  
  const headerClass = isLight ? 'bg-[#f8f9fb] border-b border-[#d9dde3] text-slate-800' : isEmerald ? 'bg-[#02281D] border-b border-emerald-900/60 text-emerald-100' : 'bg-[#090D16] border-b border-[#1E293B] text-slate-100';

  const mainClass = isLight ? 'flex-grow p-5 sm:p-6 md:p-8 bg-[#f8fafc] text-slate-900 w-full max-w-full overflow-x-auto' : isEmerald ? 'flex-grow p-3 sm:p-4 md:p-5 bg-[#011710] text-emerald-100 w-full max-w-full overflow-x-auto' : 'flex-grow p-3 sm:p-4 md:p-5 bg-[#070A13] text-slate-100 w-full max-w-full overflow-x-auto';

  // Helper variables for theme-aware sidebar elements
  const sidebarDividerClass = isLight ? 'border-[#2462a7]/25' : 'border-[#1E293B]';
  const subItemsContainerBg = isLight ? 'bg-[#0F355E]/50 py-1' : 'bg-[#090D16]/60 py-1';

  return (
    <div className={bgOuterClass}>
      
      {/* Responsive Collapsible Sidebar */}
      <aside className={`${isCollapsed ? 'w-16' : 'w-[250px]'} ${sidebarClass} flex flex-col fixed h-screen z-50 transition-all duration-300 ease-in-out`}>
        <div className={`py-3.5 flex items-center justify-between border-b ${sidebarDividerClass} ${isCollapsed ? 'px-2 justify-center' : 'px-5'}`}>
          {!isCollapsed ? (
            <>
              <Link to="/admin/dashboard" className="flex items-center gap-3 py-1 group">
                <div className="w-9 h-9 rounded-full bg-white/10 p-0.5 shadow-sm border border-white/20 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <img 
                    src={orbLogo} 
                    alt="Jobrito Orb" 
                    className="w-full h-full object-contain scale-110" 
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg tracking-tight text-white leading-none">
                    Jobrito
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium tracking-wide leading-tight mt-0.5">
                    Connecting Hospitality
                  </span>
                </div>
              </Link>
              <button 
                onClick={() => setIsCollapsed(true)}
                className="p-1.5 rounded-lg bg-[#1E293B] hover:bg-slate-700 text-slate-400 hover:text-white transition-all ml-auto"
                title="Collapse Sidebar"
              >
                <PanelLeftClose className="w-4 h-4 text-slate-400" />
              </button>
            </>
          ) : (
            <Link to="/admin/dashboard" title="Jobrito Dashboard" className="w-10 h-10 rounded-full bg-white/10 p-0.5 shadow-md border border-white/20 flex items-center justify-center overflow-hidden hover:scale-110 transition-all duration-200">
              <img 
                src={orbLogo} 
                alt="Jobrito" 
                className="w-full h-full object-contain scale-110" 
              />
            </Link>
          )}
        </div>

        <nav className="flex-grow py-3 space-y-1 overflow-y-auto custom-scrollbar">
          
          {/* Main Items before Users */}
          {mainNavItems.map((item) => {
            const active = isActive(item.path);
            if (isCollapsed) {
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center justify-center py-1 relative group transition-all"
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base transition-all ${
                    active
                      ? `admin-sidebar-active ${isLight ? 'bg-[#0E2643] text-white border-white' : 'bg-[#059669] text-white shadow-lg shadow-[#059669]/30'} font-bold scale-105`
                      : `admin-sidebar-item ${isLight ? 'text-slate-250 hover:bg-[#154675]/25 hover:text-white' : 'text-slate-400 hover:bg-[#1E293B] hover:text-white'}`
                  }`}>
                    {navIcon(item.name)}
                  </div>
                  <div className={`absolute left-16 ${isLight ? 'bg-[#123356] border-[#154675]/35' : 'bg-[#0B1120] border-[#1E293B]'} text-white text-xs font-extrabold px-3 py-1.5 rounded-xl shadow-2xl border opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap`}>
                    {item.name}
                  </div>
                </Link>
              );
            }
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between py-2.5 px-6 transition-all border-l-4 ${
                  active
                    ? `admin-sidebar-active ${isLight ? 'bg-[#0E2643] border-white' : 'bg-[#0F172A] border-[#059669]'} text-white font-extrabold shadow-md`
                    : `admin-sidebar-item border-transparent ${isLight ? 'text-slate-200 hover:bg-[#154675]/25 hover:text-white' : 'text-slate-400 hover:bg-[#1E293B]/60 hover:text-slate-200'}`
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-base leading-none">{navIcon(item.name)}</span>
                  <span className="text-xs font-semibold">{item.name}</span>
                </div>
              </Link>
            );
          })}

          {/* Group Header: Users with Sub-items */}
          <div>
            {isCollapsed ? (
              <button
                onClick={() => setIsCollapsed(false)}
                className="w-full flex items-center justify-center py-1 relative group transition-all"
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base transition-all ${
                  isUsersGroupActive
                    ? `admin-sidebar-active ${isLight ? 'bg-[#0E2643] text-white border-white' : 'bg-[#059669] text-white shadow-lg shadow-[#059669]/30'} font-bold scale-105`
                    : `admin-sidebar-item ${isLight ? 'text-slate-250 hover:bg-[#154675]/25 hover:text-white' : 'text-slate-400 hover:bg-[#1E293B] hover:text-white'}`
                }`}>
                  <UsersRound className="w-5 h-5" />
                </div>
                <div className={`absolute left-16 ${isLight ? 'bg-[#123356] border-[#154675]/35' : 'bg-[#0B1120] border-[#1E293B]'} text-white text-xs font-extrabold px-3 py-1.5 rounded-xl shadow-2xl border opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap`}>
                  Users Management
                </div>
              </button>
            ) : (
              <button
                onClick={() => setUsersOpen(!usersOpen)}
                className={`w-full flex items-center justify-between py-2.5 px-6 transition-all border-l-4 text-left ${
                  isUsersGroupActive
                    ? `admin-sidebar-active ${isLight ? 'bg-[#0E2643] border-white' : 'bg-[#0F172A] border-[#059669]'} text-white font-extrabold shadow-md`
                    : `admin-sidebar-item border-transparent ${isLight ? 'text-slate-200 hover:bg-[#154675]/25 hover:text-white' : 'text-slate-400 hover:bg-[#1E293B]/60 hover:text-slate-200'} font-semibold`
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-base leading-none"><UsersRound className="w-5 h-5" /></span>
                  <span className="text-xs font-bold uppercase tracking-wider">Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-xl text-[11px] font-black bg-[#059669] text-white shadow-sm border border-emerald-500">
                    {(counts.pending_talent ?? counts.talent ?? 0) + (counts.pending_employers ?? counts.employers ?? 0) + (counts.pending_chefs ?? counts.chefs ?? 0)}
                  </span>
                  {usersOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              </button>
            )}

            {/* Nested Sub-items (Talent/Jobseeker, Employer, Chef) */}
            {(!isCollapsed && usersOpen) && (
              <div className={`pl-6 space-y-0.5 ${subItemsContainerBg}`}>
                {userSubItems.map((sub) => {
                  const active = isActive(sub.path);
                  const countVal = counts[sub.countKey] ?? 0;
                  return (
                    <Link
                      key={sub.name}
                      to={sub.path}
                      className={`flex items-center justify-between px-5 py-2 transition-all rounded-r-xl border-l-2 ${
                        active
                          ? `admin-sidebar-active ${isLight ? 'bg-[#0E2643] border-white' : 'bg-[#0F172A] border-[#059669]'} text-white font-extrabold shadow-sm`
                          : `admin-sidebar-item border-transparent ${isLight ? 'text-slate-200 hover:bg-[#154675]/20 hover:text-white' : 'text-slate-400 hover:bg-[#1E293B]/50 hover:text-slate-200'} font-medium`
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm leading-none">{navIcon(sub.name, 'w-[17px] h-[17px]')}</span>
                        <span className="text-xs">{sub.name}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-xl text-[11px] font-black bg-slate-700 text-white border border-slate-500 shadow-sm">
                        {countVal}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Secondary Items after Users */}
          {secondaryNavItems.map((item) => {
            const active = isActive(item.path);
            const countVal = item.countKey ? (counts[item.countKey] ?? 0) : null;
            if (isCollapsed) {
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center justify-center py-1 relative group transition-all"
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base transition-all ${
                    active
                      ? `admin-sidebar-active ${isLight ? 'bg-[#0B2545] text-white border-white' : 'bg-[#059669] text-white shadow-lg shadow-[#059669]/30'} font-bold scale-105`
                      : `admin-sidebar-item ${isLight ? 'text-slate-250 hover:bg-[#154675]/40 hover:text-white' : 'text-slate-400 hover:bg-[#1E293B] hover:text-white'}`
                  }`}>
                    {navIcon(item.name)}
                  </div>
                  <div className={`absolute left-16 ${isLight ? 'bg-[#113A63] border-[#154675]/50' : 'bg-[#0B1120] border-[#1E293B]'} text-white text-xs font-extrabold px-3 py-1.5 rounded-xl shadow-2xl border opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap`}>
                    {item.name}
                  </div>
                </Link>
              );
            }
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between py-2.5 px-6 transition-all border-l-4 ${
                  active
                    ? `admin-sidebar-active ${isLight ? 'bg-[#0B2545] border-white' : 'bg-[#0F172A] border-[#059669]'} text-white font-extrabold shadow-md`
                    : `admin-sidebar-item border-transparent ${isLight ? 'text-slate-200 hover:bg-[#154675]/40 hover:text-white' : 'text-slate-400 hover:bg-[#1E293B]/60 hover:text-slate-200'}`
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-base leading-none">{navIcon(item.name)}</span>
                  <span className="text-xs font-semibold">{item.name}</span>
                </div>
                {countVal !== null && (
                  <span className="px-2.5 py-0.5 rounded-xl text-[11px] font-black bg-slate-700 text-white border border-slate-500 shadow-sm">
                    {countVal}
                  </span>
                )}
              </Link>
            );
          })}

        </nav>

      </aside>

      {/* Main Workspace with Dynamic Left Margin */}
      <div className={`flex-grow ${isCollapsed ? 'ml-16' : 'ml-[250px]'} transition-all duration-300 ease-in-out flex flex-col min-h-screen w-full min-w-0`}>
        {/* Header */}
        <header className={`${headerClass} h-16 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 transition-colors duration-300`}>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-2 rounded-lg transition-colors ${
                isLight 
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' 
                  : 'bg-[#1E293B] hover:bg-slate-700 text-slate-300'
              }`}
              title="Toggle Sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 relative">
            {/* Notification Bell Button */}
            <div className="relative">
              <button 
                onClick={() => { setNotifOpen(!notifOpen); }}
                className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                  isLight 
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' 
                    : 'bg-[#1E293B] hover:bg-slate-700 text-slate-200 border-slate-700/60'
                }`}
                title="View FCM Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-xl bg-rose-600 text-white font-black text-[9px] min-w-[18px] text-center shadow-md animate-pulse">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown Card */}
              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#0B1120] border border-[#1E293B] shadow-2xl rounded-3xl overflow-hidden z-50 text-left">
                  {/* Dropdown Header */}
                  <div className="px-5 py-3.5 bg-[#0F172A] border-b border-[#1E293B] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-white uppercase tracking-wider block">FCM Notifications & Logs</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-950 text-rose-400 border border-rose-800">
                          {unreadCount} New
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>

                  {/* Notification Items List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-[#1E293B]/60">
                    {(!Array.isArray(notifications) || notifications.filter(item => item && typeof item === 'object' && !item.is_read).length === 0) ? (
                      <div className="p-8 text-center text-slate-400 text-xs font-semibold flex flex-col items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-1" />
                        <span className="text-white font-bold">All caught up!</span>
                        <span className="text-[11px] text-slate-400">No unread notifications</span>
                      </div>
                    ) : (
                      notifications.filter(item => item && typeof item === 'object' && !item.is_read).map((item, idx) => (
                        <div 
                          key={item.id || idx} 
                          onClick={() => handleNotifClick(item)}
                          className="p-4 transition-colors cursor-pointer flex gap-3 items-start bg-[#0F172A]/70 hover:bg-[#1E293B]/80"
                        >
                          {/* Type Icon Badge */}
                          <div className="w-8 h-8 rounded-xl bg-[#1E293B] border border-slate-700/60 flex items-center justify-center text-sm shrink-0 mt-0.5">
                            {item.type === 'job_approved' ? <BriefcaseBusiness className="w-4 h-4 text-emerald-400" /> : item.type === 'chef_approved' ? <Utensils className="w-4 h-4 text-amber-400" /> : item.type === 'application_received' ? <UsersRound className="w-4 h-4 text-sky-400" /> : <Bell className="w-4 h-4 text-emerald-400" />}
                          </div>

                          <div className="flex-grow min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-extrabold text-white text-xs truncate block">{item.title || 'Notification'}</span>
                              <span className="text-[9px] font-bold text-slate-400 shrink-0">{item.time_ago || 'Now'}</span>
                            </div>

                            <p className="text-[11px] font-semibold text-slate-300 leading-snug line-clamp-2">
                              {item.body || item.message || ''}
                            </p>

                            {/* Recipient User Badge */}
                            <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-slate-400">
                              <span className="truncate">
                                To: <strong className="text-emerald-400">{item.recipient_name || 'User'}</strong> ({item.recipient_phone || ''})
                              </span>
                              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Dropdown Footer */}
                  <div className="px-5 py-2.5 bg-[#0F172A]/80 border-t border-[#1E293B] flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-slate-400">
                      Total {notifications.length} notifications
                    </span>
                    <Link 
                      to="/admin/notifications" 
                      onClick={() => setNotifOpen(false)}
                      className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      View All Logs &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className={`h-6 w-px ${isLight ? 'bg-slate-300' : 'bg-slate-800'} hidden sm:block`}></div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`w-8 h-8 rounded-full ${isLight ? 'bg-[#153e69] text-white' : isEmerald ? 'bg-[#059669] text-white' : 'bg-slate-700 text-white'} flex items-center justify-center font-black text-xs shrink-0 shadow-sm`}>
                JR
              </div>
              <div className="text-right hidden sm:block">
                <span className={`text-xs font-extrabold block ${isLight ? 'text-slate-800' : 'text-white'}`}>jobrito_admin</span>
                <span className="text-[10px] font-semibold text-[#F59E0B] block uppercase tracking-wider">Super Admin</span>
              </div>
              <button 
                onClick={handleLogout} 
                className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border ${
                  isLight 
                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200' 
                    : 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border-rose-800/40'
                }`}
                title="Logout Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className={`${mainClass} transition-colors duration-300`}>
          {children}
        </main>
      </div>

    </div>
  );
}
