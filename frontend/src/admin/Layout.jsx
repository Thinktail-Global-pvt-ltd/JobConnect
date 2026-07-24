import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, LogOut } from 'lucide-react';

export default function Layout({ children }) {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Users', path: '/admin/users', icon: '👤' },
    { name: 'Jobs', path: '/admin/jobs', icon: '💼' },
    { name: 'Referrals', path: '/admin/referrals', icon: '🔗' },
    { name: 'Community Feed', path: '/admin/community', icon: '📶' },
    { name: 'Training & Overseas', path: '/admin/training', icon: '🎓' },
    { name: 'ChefConnect', path: '/admin/chefs', icon: '🍴' },
    { name: 'Applications', path: '/admin/applications', icon: '📄' },
    { name: 'Employers', path: '/admin/employers', icon: '🏢' },
    { name: 'Enquiries', path: '/admin/enquiries', icon: '❓' },
    { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <div className="bg-[#f8f9fc] font-sans text-slate-800 min-h-screen flex w-full text-left">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#e2e8f0] flex flex-col fixed h-screen z-50">
        <div className="px-6 py-5 flex flex-col justify-start">
          <span className="font-sans font-extrabold text-xl text-[#059669] leading-none">JobConnect</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Admin Console</span>
        </div>

        <nav className="flex-grow py-3 space-y-0.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3.5 px-6 py-2.5 transition-all border-l-4 ${
                  active
                    ? 'bg-[#eff6ff] border-[#10b981] text-[#0f172a] font-semibold'
                    : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                <span className="text-xs font-semibold">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">
            AR
          </div>
          <div className="overflow-hidden flex-grow">
            <span className="text-xs font-bold text-slate-700 block truncate">Alex Rivera</span>
            <span className="text-[10px] font-semibold text-slate-400 block truncate">Super Admin</span>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-grow ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-[#e2e8f0] h-16 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search data, users, or jobs..."
              className="w-full bg-[#f1f5f9] border-none rounded-full py-2 pl-10 pr-4 text-xs font-medium text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#10b981] transition-all"
            />
            <Search className="absolute left-3.5 top-2.5 text-slate-400 w-4 h-4" />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative w-8 h-8 rounded-full bg-slate-55 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500"></span>
            </button>

            <div className="h-6 w-px bg-slate-200"></div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs font-bold text-slate-700 block">Alex Rivera</span>
                <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">Super Admin</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#eff6ff] flex items-center justify-center text-[#1e40af] font-bold text-xs border border-blue-100">
                AR
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow p-8 bg-[#f8f9fc]">
          {children}
        </main>
      </div>

    </div>
  );
}
