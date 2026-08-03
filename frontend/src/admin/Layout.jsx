import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, LogOut, ChevronDown, ChevronRight, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { mockApi } from '../services/api';
import logoImg from '../assets/Jobrito full logo.png';
import logoWhiteImg from '../assets/jobrito-logo-white-text.png';

export default function Layout({ children }) {
  const location = useLocation();
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
      fetchNotifications();
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await mockApi.markNotificationRead(id);
      fetchNotifications();
    } catch (e) {}
  };

  const handleMarkAllRead = async () => {
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
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊', count: null },
  ];

  const userSubItems = [
    { name: 'Talent / Jobseeker', path: '/admin/users', icon: '👤', countKey: 'talent' },
    { name: 'Employer', path: '/admin/employers', icon: '🏢', countKey: 'employers' },
    { name: 'Chef', path: '/admin/chefs', icon: '👨‍🍳', countKey: 'chefs' },
  ];

  const secondaryNavItems = [
    { name: 'Jobs', path: '/admin/jobs', icon: '💼', countKey: 'jobs' },
    { name: 'Community Feed', path: '/admin/community', icon: '📶', countKey: 'community' },
    { name: 'Training & Overseas', path: '/admin/training', icon: '🎓', countKey: 'training' },
    { name: 'Applications', path: '/admin/applications', icon: '📄', countKey: 'applications' },
    { name: 'Enquiries', path: '/admin/enquiries', icon: '❓', countKey: 'enquiries' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_user_id');
    sessionStorage.removeItem('admin_authenticated');
    window.location.href = '/admin/login';
  };

  return (
    <div className="bg-[#090D16] font-sans text-slate-100 min-h-screen flex w-full text-left overflow-x-hidden">
      
      {/* Responsive Collapsible Sidebar */}
      <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-[#0B1120] border-r border-[#1E293B] flex flex-col fixed h-screen z-50 transition-all duration-300 ease-in-out`}>
        <div className={`px-4 py-3.5 flex items-center justify-between border-b border-[#1E293B] ${isCollapsed ? 'justify-center' : 'px-5'}`}>
          {!isCollapsed ? (
            <Link to="/admin/dashboard" className="flex items-center gap-2.5 group py-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-outfit font-black text-lg flex items-center justify-center shadow-lg shadow-emerald-950/40 border border-emerald-400/30 shrink-0">
                J
              </div>
              <div>
                <span className="font-outfit font-black text-xl text-white tracking-tight leading-none block group-hover:text-slate-200 transition-colors">
                  Jobrito
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                  Connecting Talent
                </span>
              </div>
            </Link>
          ) : (
            <Link to="/admin/dashboard" className="flex items-center justify-center">
              <div className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-400 font-black text-sm flex items-center justify-center border border-emerald-800">
                J
              </div>
            </Link>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg bg-[#1E293B] hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen className="w-5 h-5 text-[#059669]" /> : <PanelLeftClose className="w-4 h-4 text-slate-400" />}
          </button>
        </div>

        <nav className="flex-grow py-3 space-y-0.5 overflow-y-auto custom-scrollbar">
          
          {/* Main Items before Users */}
          {mainNavItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                title={isCollapsed ? item.name : ''}
                className={`flex items-center justify-between py-2.5 transition-all border-l-4 ${
                  isCollapsed ? 'px-0 justify-center' : 'px-6'
                } ${
                  active
                    ? 'bg-[#1E293B] border-[#059669] text-white font-bold'
                    : 'border-transparent text-slate-400 hover:bg-[#1E293B]/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-base leading-none">{item.icon}</span>
                  {!isCollapsed && <span className="text-xs font-semibold">{item.name}</span>}
                </div>
              </Link>
            );
          })}

          {/* Group Header: Users with Sub-items */}
          <div>
            <button
              onClick={() => {
                if (isCollapsed) setIsCollapsed(false);
                setUsersOpen(!usersOpen);
              }}
              title={isCollapsed ? "Users Management" : ""}
              className={`w-full flex items-center justify-between py-2.5 transition-all border-l-4 text-left ${
                isCollapsed ? 'px-0 justify-center' : 'px-6'
              } ${
                isUsersGroupActive
                  ? 'bg-[#1E293B] border-[#059669] text-white font-bold'
                  : 'border-transparent text-slate-400 hover:bg-[#1E293B]/60 hover:text-slate-200 font-semibold'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className="text-base leading-none">👥</span>
                {!isCollapsed && <span className="text-xs font-bold uppercase tracking-wider">Users</span>}
              </div>
              {!isCollapsed && (
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#059669] text-white shadow-sm border border-emerald-500">
                    {counts.users ?? (counts.talent + counts.employers + counts.chefs)}
                  </span>
                  {usersOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              )}
            </button>

            {/* Nested Sub-items (Talent/Jobseeker, Employer, Chef) */}
            {(!isCollapsed && usersOpen) && (
              <div className="pl-6 space-y-0.5 bg-[#090D16]/60 py-1">
                {userSubItems.map((sub) => {
                  const active = isActive(sub.path);
                  const countVal = counts[sub.countKey] ?? 0;
                  return (
                    <Link
                      key={sub.name}
                      to={sub.path}
                      className={`flex items-center justify-between px-5 py-2 transition-all rounded-r-xl border-l-2 ${
                        active
                          ? 'bg-[#1E293B] border-[#059669] text-white font-extrabold shadow-2xs'
                          : 'border-transparent text-slate-400 hover:bg-[#1E293B]/50 hover:text-slate-200 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm leading-none">{sub.icon}</span>
                        <span className="text-xs">{sub.name}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-slate-700 text-white border border-slate-500 shadow-sm">
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
            return (
              <Link
                key={item.name}
                to={item.path}
                title={isCollapsed ? item.name : ''}
                className={`flex items-center justify-between py-2.5 transition-all border-l-4 ${
                  isCollapsed ? 'px-0 justify-center' : 'px-6'
                } ${
                  active
                    ? 'bg-[#1E293B] border-[#059669] text-white font-bold'
                    : 'border-transparent text-slate-400 hover:bg-[#1E293B]/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-base leading-none">{item.icon}</span>
                  {!isCollapsed && <span className="text-xs font-semibold">{item.name}</span>}
                </div>
                {(!isCollapsed && countVal !== null) && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-slate-700 text-white border border-slate-500 shadow-sm">
                    {countVal}
                  </span>
                )}
              </Link>
            );
          })}

        </nav>

        {/* Admin User Footer Profile */}
        <div className={`p-4 border-t border-[#1E293B] flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3'}`}>
          <div className="w-8 h-8 rounded-full bg-[#059669] flex items-center justify-center text-white font-black text-xs shrink-0 shadow-sm">
            JR
          </div>
          {!isCollapsed && (
            <>
              <div className="overflow-hidden flex-grow">
                <span className="text-xs font-extrabold text-white block truncate">jobrito_admin</span>
                <span className="text-[10px] font-semibold text-slate-400 block truncate">Super Admin</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-1.5 rounded-lg bg-[#1E293B] hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 transition-colors"
                title="Sign Out Admin"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Main Workspace with Dynamic Left Margin */}
      <div className={`flex-grow ${isCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300 ease-in-out flex flex-col min-h-screen w-full min-w-0`}>
        {/* Header */}
        <header className="bg-[#090D16] border-b border-[#1E293B] h-16 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg bg-[#1E293B] hover:bg-slate-700 text-slate-300 transition-colors"
              title="Toggle Sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 relative">
            {/* Notification Bell Button */}
            <div className="relative">
              <button 
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative w-9 h-9 rounded-xl bg-[#1E293B] hover:bg-slate-700 flex items-center justify-center text-slate-200 transition-all cursor-pointer border border-slate-700/60"
                title="View FCM Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-rose-600 text-white font-black text-[9px] min-w-[18px] text-center shadow-md animate-pulse">
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
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs font-semibold">
                        🔔 No system notifications recorded yet.
                      </div>
                    ) : (
                      notifications.map(item => (
                        <div 
                          key={item.id} 
                          onClick={() => handleMarkRead(item.id)}
                          className={`p-4 transition-colors cursor-pointer flex gap-3 items-start ${!item.is_read ? 'bg-[#0F172A]/70 hover:bg-[#1E293B]/80' : 'hover:bg-[#1E293B]/40 opacity-85'}`}
                        >
                          {/* Type Icon Badge */}
                          <div className="w-8 h-8 rounded-xl bg-[#1E293B] border border-slate-700/60 flex items-center justify-center text-sm shrink-0 mt-0.5">
                            {item.type === 'job_approved' ? '💼' : item.type === 'chef_approved' ? '🌟' : item.type === 'consultation_booked' ? '📅' : item.type === 'application_received' ? '👤' : '🔔'}
                          </div>

                          <div className="flex-grow min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-extrabold text-white text-xs truncate block">{item.title}</span>
                              <span className="text-[9px] font-bold text-slate-400 shrink-0">{item.time_ago}</span>
                            </div>

                            <p className="text-[11px] font-semibold text-slate-300 leading-snug line-clamp-2">
                              {item.body}
                            </p>

                            {/* Recipient User Badge */}
                            <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-slate-400">
                              <span className="truncate">
                                To: <strong className="text-emerald-400">{item.recipient_name}</strong> ({item.recipient_phone})
                              </span>
                              {!item.is_read && (
                                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Dropdown Footer */}
                  <div className="px-5 py-2.5 bg-[#0F172A]/80 border-t border-[#1E293B] text-center">
                    <span className="text-[10px] font-extrabold text-slate-400">
                      Total {notifications.length} FCM notifications recorded in database
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-extrabold text-white block">jobrito_admin</span>
                <span className="text-[10px] font-semibold text-[#F59E0B] block uppercase tracking-wider">Super Admin</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 font-black text-xs shrink-0">
                JR
              </div>
              <button 
                onClick={handleLogout} 
                className="px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                title="Logout Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-grow p-4 sm:p-6 md:p-8 bg-[#070A13] w-full max-w-full overflow-x-auto text-slate-100">
          {children}
        </main>
      </div>

    </div>
  );
}
