import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Briefcase, 
  FileText, 
  Megaphone, 
  ChefHat, 
  GraduationCap, 
  TrendingUp, 
  CheckCircle, 
  User, 
  Clock, 
  Calendar, 
  Download, 
  ChevronDown, 
  Utensils 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockApi } from '../services/api';
import { useTheme } from '../context/ThemeContext';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme, THEMES } = useTheme();
  
  const currentTheme = theme || 'light';
  const isLight = currentTheme === (THEMES?.LIGHT || 'light');
  const isEmerald = currentTheme === (THEMES?.EMERALD || 'emerald');

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await mockApi.getStats();
        if (res && res.stats) {
          setData(res);
        }
      } catch (e) {
        console.error("Dashboard stats error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-2 border-[#059669] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-extrabold text-slate-400">Loading Dashboard Analytics...</p>
      </div>
    );
  }

  const stats = data.stats || {};
  const usersTotal = stats.users_total ?? (stats.users_count || 0);
  const chefCount = stats.chef_count ?? (stats.chefs_total || stats.chefs_count || 0);
  const employerCount = stats.employer_count ?? (stats.employers_count || 0);
  const talentCount = stats.talent_count ?? Math.max(0, usersTotal - (chefCount + employerCount));

  // Theme-aware styles
  const cardBgClass = isLight 
    ? 'bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-xl p-5 flex flex-col justify-between min-h-[270px]' 
    : isEmerald 
      ? 'bg-[#01241A] border border-emerald-900/60 shadow-2xl rounded-xl p-5 flex flex-col justify-between min-h-[270px]' 
      : 'bg-[#0B1120] border border-[#1E293B] shadow-2xl rounded-xl p-5 flex flex-col justify-between min-h-[270px]';

  const kpiCardBgClass = isLight 
    ? 'bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-xl p-3.5 flex flex-col justify-between min-h-[270px]' 
    : isEmerald 
      ? 'bg-[#01241A] border border-emerald-900/60 shadow-2xl rounded-xl p-3.5 flex flex-col justify-between min-h-[270px]' 
      : 'bg-[#0B1120] border border-[#1E293B] shadow-2xl rounded-xl p-3.5 flex flex-col justify-between min-h-[270px]';

  const sectionBgClass = isLight 
    ? 'bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-xl p-4' 
    : isEmerald 
      ? 'bg-[#01241A] border border-emerald-900/60 shadow-2xl rounded-xl p-4' 
      : 'bg-[#0B1120] border border-[#1E293B] shadow-2xl rounded-xl p-4';

  const textPrimaryClass = isLight ? 'text-slate-800' : 'text-white';
  const textSecondaryClass = isLight ? 'text-slate-500' : 'text-slate-400';
  const textMutedClass = isLight ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-6 text-left">
      {/* Title Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`font-outfit font-black text-[32px] tracking-tight ${textPrimaryClass}`}>
            Dashboard Overview
          </h2>
          <p className={`text-[14px] font-medium mt-1.5 ${textSecondaryClass}`}>
            Monitor your platform performance and take action on important tasks.
          </p>
        </div>


      </div>

      {/* KPI Stats Grid - 6 Columns Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Card 1: Total Users */}
        <div className={kpiCardBgClass}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                isLight ? 'bg-blue-50 text-blue-600' : 'bg-blue-950/40 text-blue-400 border border-blue-900/60'
              }`}>
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className={`text-[11px] font-bold block ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  Total Users
                </span>
                <span className={`font-outfit font-black text-2xl leading-none mt-0.5 block ${textPrimaryClass}`}>
                  {usersTotal}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className={textSecondaryClass}>Talent / Jobseeker</span>
                <span className={`font-bold ${textPrimaryClass}`}>{talentCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className={textSecondaryClass}>Chef</span>
                <span className={`font-bold ${textPrimaryClass}`}>{chefCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className={textSecondaryClass}>Employer</span>
                <span className={`font-bold ${textPrimaryClass}`}>{employerCount}</span>
              </div>
            </div>
          </div>

          <Link 
            to="/admin/users" 
            className="text-[11px] font-black text-blue-600 hover:text-blue-700 hover:underline mt-auto pt-4 text-center block w-full"
          >
            View All Users &rarr;
          </Link>
        </div>

        {/* Card 2: Total Jobs */}
        <div className={kpiCardBgClass}>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                isLight ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/60'
              }`}>
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className={`text-[11px] font-bold block ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  Total Jobs
                </span>
                <span className={`font-outfit font-black text-2xl leading-none mt-0.5 block ${textPrimaryClass}`}>
                  {stats.jobs_total ?? 24}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto pt-1">
              <table className="w-full text-[10px] border-collapse text-left">
                <thead>
                  <tr className={`border-b ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
                    <th className={`font-bold pb-1 text-[9px] ${textMutedClass}`}>Posted By</th>
                    <th className={`font-bold pb-1 text-center text-[9px] ${textMutedClass}`}>Active Jobs</th>
                    <th className={`font-bold pb-1 text-center text-[9px] ${textMutedClass}`}>Pending Approval</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isLight ? 'divide-slate-100' : 'divide-slate-800'}`}>
                  <tr>
                    <td className={`py-1 font-semibold ${textSecondaryClass}`}>Employer</td>
                    <td className="py-1 text-center font-bold text-emerald-600">{stats.jobs_emp_active ?? 2}</td>
                    <td className="py-1 text-center font-bold text-orange-500">{stats.jobs_emp_pending ?? 2}</td>
                  </tr>
                  <tr>
                    <td className={`py-1 font-semibold ${textSecondaryClass}`}>Chef</td>
                    <td className="py-1 text-center font-bold text-emerald-600">{stats.jobs_chef_active ?? 0}</td>
                    <td className="py-1 text-center font-bold text-orange-500">{stats.jobs_chef_pending ?? 0}</td>
                  </tr>
                  <tr>
                    <td className={`py-1 font-semibold ${textSecondaryClass}`}>Talent</td>
                    <td className="py-1 text-center font-bold text-emerald-600">{stats.jobs_talent_active ?? 0}</td>
                    <td className="py-1 text-center font-bold text-orange-500">{stats.jobs_talent_pending ?? 0}</td>
                  </tr>
                  <tr className="font-extrabold">
                    <td className={`py-1 ${textPrimaryClass}`}>Total</td>
                    <td className="py-1 text-center text-emerald-600">{stats.jobs_active ?? (stats.jobs_approved || 2)}</td>
                    <td className="py-1 text-center text-orange-500">{stats.jobs_pending ?? (stats.jobs_pending || 2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <Link 
            to="/admin/jobs" 
            className="text-[11px] font-black text-emerald-600 hover:text-emerald-700 hover:underline mt-auto pt-3 text-center block w-full"
          >
            View All Jobs &rarr;
          </Link>
        </div>

        {/* Card 3: Job Applications */}
        <div className={kpiCardBgClass}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                isLight ? 'bg-purple-50 text-purple-600' : 'bg-purple-950/40 text-purple-400 border border-purple-900/60'
              }`}>
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className={`text-[11px] font-bold block ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  Job Applications
                </span>
                <span className={`font-outfit font-black text-2xl leading-none mt-0.5 block ${textPrimaryClass}`}>
                  {stats.applications_total ?? (stats.applications_count || 10)}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                  <span className={`truncate ${textSecondaryClass}`}>New</span>
                </div>
                <span className={`font-bold ${textPrimaryClass}`}>{stats.applications_new ?? 3}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>
                  <span className={`truncate ${textSecondaryClass}`}>Applied</span>
                </div>
                <span className={`font-bold ${textPrimaryClass}`}>{stats.applications_applied ?? 5}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                  <span className={`truncate ${textSecondaryClass}`}>Contacted Emp.</span>
                </div>
                <span className={`font-bold ${textPrimaryClass}`}>{stats.applications_contacted ?? 2}</span>
              </div>
            </div>
          </div>

          <Link 
            to="/admin/applications" 
            className="text-[11px] font-black text-purple-600 hover:text-purple-700 hover:underline mt-auto pt-4 text-center block w-full"
          >
            View Applications &rarr;
          </Link>
        </div>

        {/* Card 4: Chef Profiles */}
        <div className={kpiCardBgClass}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                isLight ? 'bg-orange-50 text-orange-600' : 'bg-amber-950/40 text-amber-400 border border-amber-900/60'
              }`}>
                <ChefHat className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className={`text-[11px] font-bold block ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  Chef Profiles
                </span>
                <span className={`font-outfit font-black text-2xl leading-none mt-0.5 block ${textPrimaryClass}`}>
                  {stats.chefs_total ?? 5}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className={`truncate ${textSecondaryClass}`}>Approved</span>
                </div>
                <span className={`font-bold ${textPrimaryClass}`}>{stats.chefs_approved ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0"></span>
                  <span className={`truncate ${textSecondaryClass}`}>Pending Approval</span>
                </div>
                <span className={`font-bold ${textPrimaryClass}`}>{stats.chefs_pending ?? 5}</span>
              </div>
            </div>
          </div>

          <Link 
            to="/admin/chefs" 
            className="text-[11px] font-black text-orange-600 hover:text-orange-700 hover:underline mt-auto pt-4 text-center block w-full"
          >
            View Chef Profiles &rarr;
          </Link>
        </div>

        {/* Card 5: Community Posts */}
        <div className={kpiCardBgClass}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                isLight ? 'bg-sky-50 text-[#0284c7]' : 'bg-[#1E293B] text-sky-400 border border-slate-700/60'
              }`}>
                <Megaphone className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className={`text-[11px] font-bold block ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  Community Posts
                </span>
                <span className={`font-outfit font-black text-2xl leading-none mt-0.5 block ${textPrimaryClass}`}>
                  {stats.community_total ?? 29}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className={`truncate ${textSecondaryClass}`}>Published / Active</span>
                </div>
                <span className={`font-bold ${textPrimaryClass}`}>{stats.community_active ?? 17}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0"></span>
                  <span className={`truncate ${textSecondaryClass}`}>Pinned Posts</span>
                </div>
                <span className={`font-bold ${textPrimaryClass}`}>{stats.community_pinned ?? 4}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0"></span>
                  <span className={`truncate ${textSecondaryClass}`}>Drafts / Unpublished</span>
                </div>
                <span className={`font-bold ${textPrimaryClass}`}>{stats.community_drafts ?? 12}</span>
              </div>
            </div>
          </div>

          <Link 
            to="/admin/community" 
            className="text-[11px] font-black text-blue-600 hover:text-blue-700 hover:underline mt-auto pt-4 text-center block w-full"
          >
            View Community &rarr;
          </Link>
        </div>

        {/* Card 6: Training & Overseas */}
        <div className={kpiCardBgClass}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                isLight ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/60'
              }`}>
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className={`text-[11px] font-bold block ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  Training & Overseas
                </span>
                <span className={`font-outfit font-black text-2xl leading-none mt-0.5 block ${textPrimaryClass}`}>
                  {stats.training_total ?? 6}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0"></span>
                  <span className={`truncate ${textSecondaryClass}`}>India</span>
                </div>
                <span className={`font-bold ${textPrimaryClass}`}>{stats.training_india ?? 1}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
                  <span className={`truncate ${textSecondaryClass}`}>Overseas</span>
                </div>
                <span className={`font-bold ${textPrimaryClass}`}>{stats.training_overseas ?? 2}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className={`truncate ${textSecondaryClass}`}>Both (India & Overseas)</span>
                </div>
                <span className={`font-bold ${textPrimaryClass}`}>{stats.training_both ?? 0}</span>
              </div>
            </div>
          </div>

          <Link 
            to="/admin/training" 
            className="text-[11px] font-black text-emerald-600 hover:text-emerald-700 hover:underline mt-auto pt-4 text-center block w-full"
          >
            View Programs &rarr;
          </Link>
        </div>

      </div>

      {/* Main Split Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Column: Pending Actions (3/5 Width) */}
        <div className="lg:col-span-3">
          <div className={`${sectionBgClass} space-y-4 h-full flex flex-col justify-between`}>
            <div>
              <div className="flex items-start gap-3 pb-3 border-b border-slate-100/80">
                <div className={`p-2 rounded-xl ${isLight ? 'bg-slate-100 text-slate-500' : 'bg-slate-800 text-slate-400'}`}>
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-outfit font-black text-[18px] leading-tight ${textPrimaryClass}`}>
                    Pending Actions
                  </h3>
                  <p className={`text-xs mt-0.5 ${textSecondaryClass}`}>
                    Items requiring your attention
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 pt-3">
                {/* Action Row 1: Jobs Awaiting Approval */}
                <div className={`p-3 border rounded-xl flex items-center justify-between gap-4 transition-all hover:shadow-sm ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#0f172a]/60 border-[#1E293B]'
                }`}>
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-black text-rose-500 min-w-[24px]">{stats.pending_jobs ?? stats.jobs_pending ?? 0}</span>
                    <div className="min-w-0">
                      <span className={`text-xs font-black block ${textPrimaryClass}`}>
                        Jobs Awaiting Approval
                      </span>
                      <span className={`text-[11px] font-semibold mt-0.5 block truncate ${textSecondaryClass}`}>
                        Review and approve newly submitted jobs.
                      </span>
                    </div>
                  </div>
                  <Link 
                    to="/admin/jobs?status=pending" 
                    className="px-3.5 py-1.5 text-xs font-bold border border-rose-200 text-rose-500 bg-white hover:bg-rose-50 rounded-xl transition-all shadow-sm shrink-0"
                  >
                    Review &rarr;
                  </Link>
                </div>

                {/* Action Row 2: Chef Profiles Awaiting Approval */}
                <div className={`p-3 border rounded-xl flex items-center justify-between gap-4 transition-all hover:shadow-sm ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#0f172a]/60 border-[#1E293B]'
                }`}>
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                      <ChefHat className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-black text-orange-500 min-w-[24px]">{stats.pending_chefs ?? stats.chefs_pending ?? 0}</span>
                    <div className="min-w-0">
                      <span className={`text-xs font-black block ${textPrimaryClass}`}>
                        Chef Profiles Awaiting Approval
                      </span>
                      <span className={`text-[11px] font-semibold mt-0.5 block truncate ${textSecondaryClass}`}>
                        Review submitted chef profiles.
                      </span>
                    </div>
                  </div>
                  <Link 
                    to="/admin/chefs?status=pending" 
                    className="px-3.5 py-1.5 text-xs font-bold border border-orange-200 text-orange-500 bg-white hover:bg-orange-50 rounded-xl transition-all shadow-sm shrink-0"
                  >
                    Review &rarr;
                  </Link>
                </div>

                {/* Action Row 3: Training & Overseas Drafts */}
                <div className={`p-3 border rounded-xl flex items-center justify-between gap-4 transition-all hover:shadow-sm ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#0f172a]/60 border-[#1E293B]'
                }`}>
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-black text-purple-500 min-w-[24px]">{stats.pending_training ?? stats.training_pending ?? 0}</span>
                    <div className="min-w-0">
                      <span className={`text-xs font-black block ${textPrimaryClass}`}>
                        Training & Overseas Drafts
                      </span>
                      <span className={`text-[11px] font-semibold mt-0.5 block truncate ${textSecondaryClass}`}>
                        Review and publish draft programs.
                      </span>
                    </div>
                  </div>
                  <Link 
                    to="/admin/training?status=pending" 
                    className="px-3.5 py-1.5 text-xs font-bold border border-purple-200 text-purple-500 bg-white hover:bg-purple-50 rounded-xl transition-all shadow-sm shrink-0"
                  >
                    Review &rarr;
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Daily Registrations (2/5 Width) */}
        <div className="lg:col-span-2">
          <div className={`${sectionBgClass} space-y-4 h-full flex flex-col justify-between`}>
            <div>
              <div className="flex items-start gap-3 pb-3 border-b border-slate-100/80">
                <div className={`p-2 rounded-xl ${isLight ? 'bg-slate-50 text-slate-500' : 'bg-slate-800 text-slate-400'}`}>
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-outfit font-black text-[18px] leading-tight ${textPrimaryClass}`}>
                    Daily Registrations
                  </h3>
                  <p className={`text-xs mt-0.5 ${textSecondaryClass}`}>
                    New registrations today
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-3">
                {/* Talent Registrations */}
                <div className={`p-2.5 border rounded-xl flex items-center justify-between hover:shadow-sm ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#0f172a]/60 border-[#1E293B]'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <span className={`text-xs font-bold ${textPrimaryClass}`}>Talent Registrations</span>
                  </div>
                  <span className={`text-sm font-extrabold ${textPrimaryClass}`}>{stats.reg_talent_today ?? 0}</span>
                </div>

                {/* Chef Registrations */}
                <div className={`p-2.5 border rounded-xl flex items-center justify-between hover:shadow-sm ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#0f172a]/60 border-[#1E293B]'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <span className={`text-xs font-bold ${textPrimaryClass}`}>Chef Registrations</span>
                  </div>
                  <span className={`text-sm font-extrabold ${textPrimaryClass}`}>{stats.reg_chef_today ?? 0}</span>
                </div>

                {/* Employer Registrations */}
                <div className={`p-2.5 border rounded-xl flex items-center justify-between hover:shadow-sm ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#0f172a]/60 border-[#1E293B]'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <span className={`text-xs font-bold ${textPrimaryClass}`}>Employer Registrations</span>
                  </div>
                  <span className={`text-sm font-extrabold ${textPrimaryClass}`}>{stats.reg_employer_today ?? 0}</span>
                </div>
              </div>
            </div>

            {/* Total Highlighted Card */}
            <div className={`p-3 rounded-xl flex items-center justify-between mt-4 border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#1E293B]/40 border-slate-700'
            }`}>
              <span className={`text-xs font-bold ${isLight ? 'text-blue-900' : 'text-blue-300'}`}>
                Total Registrations Today
              </span>
              <span className={`text-base font-extrabold ${isLight ? 'text-blue-900' : 'text-blue-400'}`}>
                {stats.reg_total_today ?? 0}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Third Section: Recent Activity Log */}
      <div className={sectionBgClass}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100/80 mb-3">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl ${isLight ? 'bg-slate-100 text-slate-500' : 'bg-slate-800 text-slate-400'}`}>
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-outfit font-black text-[18px] leading-tight ${textPrimaryClass}`}>
                Recent Activity Log
              </h3>
              <p className={`text-xs mt-0.5 ${textSecondaryClass}`}>
                Latest activities on the platform
              </p>
            </div>
          </div>
          <Link 
            to="/admin/notifications" 
            className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
          >
            View All Activity &rarr;
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {(data.recent_activity && data.recent_activity.length > 0) ? (
            data.recent_activity.map((act, index) => (
              <div key={index} className="py-2.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className={`text-xs font-extrabold ${textPrimaryClass}`}>
                      {act.title || 'Platform Event'}
                    </h4>
                    <p className={`text-[11px] font-semibold mt-0.5 ${textSecondaryClass}`}>
                      {act.description || act.body || ''}
                    </p>
                  </div>
                </div>
                <span className={`text-[11px] font-semibold shrink-0 ${textMutedClass}`}>
                  {act.time || 'Recently'}
                </span>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-xs font-bold text-slate-400">
              No recent activity logs recorded today.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}