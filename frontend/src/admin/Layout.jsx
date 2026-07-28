import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, LogOut, ChevronDown, ChevronRight, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export default function Layout({ children }) {
  const location = useLocation();
  const [usersOpen, setUsersOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path) => {
    return location.pathname === path || (path !== '/admin/dashboard' && location.pathname.startsWith(path));
  };

  const isUsersGroupActive = location.pathname.startsWith('/admin/users') || 
                             location.pathname.startsWith('/admin/employers') || 
                             location.pathname.startsWith('/admin/chefs');

  const mainNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
  ];

  const userSubItems = [
    { name: 'Talent / Jobseeker', path: '/admin/users', icon: '👤' },
    { name: 'Employer', path: '/admin/employers', icon: '🏢' },
    { name: 'Chef', path: '/admin/chefs', icon: '👨‍🍳' },
  ];

  const secondaryNavItems = [
    { name: 'Jobs', path: '/admin/jobs', icon: '💼' },
    { name: 'Referrals', path: '/admin/jobs?category=community', icon: '🔗' },
    { name: 'Community Feed', path: '/admin/community', icon: '📶' },
    { name: 'Training & Overseas', path: '/admin/training', icon: '🎓' },
    { name: 'Applications', path: '/admin/applications', icon: '📄' },
    { name: 'Enquiries', path: '/admin/enquiries', icon: '❓' },
    { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
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
        {/* Brand Header */}
        <div className={`px-4 py-5 flex items-center justify-between border-b border-[#1E293B] ${isCollapsed ? 'justify-center' : 'px-6'}`}>
          {!isCollapsed && (
            <div className="flex flex-col justify-start">
              <span className="font-outfit font-black text-2xl text-white tracking-tight leading-none">
                Jobrito
              </span>
              <span className="text-[9px] font-bold text-[#F59E0B] tracking-wide mt-1.5">
                Connecting hospitality talent.
              </span>
            </div>
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
                className={`flex items-center gap-3.5 py-2.5 transition-all border-l-4 ${
                  isCollapsed ? 'px-0 justify-center' : 'px-6'
                } ${
                  active
                    ? 'bg-[#1E293B] border-[#059669] text-white font-bold'
                    : 'border-transparent text-slate-400 hover:bg-[#1E293B]/60 hover:text-slate-200'
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                {!isCollapsed && <span className="text-xs font-semibold">{item.name}</span>}
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
                usersOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )
              )}
            </button>

            {/* Nested Sub-items (Talent/Jobseeker, Employer, Chef) */}
            {(!isCollapsed && usersOpen) && (
              <div className="pl-6 space-y-0.5 bg-[#090D16]/60 py-1">
                {userSubItems.map((sub) => {
                  const active = isActive(sub.path);
                  return (
                    <Link
                      key={sub.name}
                      to={sub.path}
                      className={`flex items-center gap-3 px-5 py-2 transition-all rounded-r-xl border-l-2 ${
                        active
                          ? 'bg-[#1E293B] border-[#059669] text-[#059669] font-extrabold shadow-2xs'
                          : 'border-transparent text-slate-400 hover:bg-[#1E293B]/50 hover:text-slate-200 font-medium'
                      }`}
                    >
                      <span className="text-sm leading-none">{sub.icon}</span>
                      <span className="text-xs">{sub.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Secondary Items after Users */}
          {secondaryNavItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                title={isCollapsed ? item.name : ''}
                className={`flex items-center gap-3.5 py-2.5 transition-all border-l-4 ${
                  isCollapsed ? 'px-0 justify-center' : 'px-6'
                } ${
                  active
                    ? 'bg-[#1E293B] border-[#059669] text-white font-bold'
                    : 'border-transparent text-slate-400 hover:bg-[#1E293B]/60 hover:text-slate-200'
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                {!isCollapsed && <span className="text-xs font-semibold">{item.name}</span>}
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

            <div className="relative w-44 sm:w-64 md:w-80">
              <input
                type="text"
                placeholder="Search JobRito database, candidates, or jobs..."
                className="w-full bg-[#1E293B] border border-slate-700/50 rounded-full py-2 pl-9 pr-3 text-xs font-medium text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#059669] transition-all"
              />
              <Search className="absolute left-3 top-2.5 text-slate-400 w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <button className="relative w-8 h-8 rounded-full bg-[#1E293B] hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            </button>

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
