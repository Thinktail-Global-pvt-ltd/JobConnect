import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockApi, resolveImageUrl } from '../services/api';
import { Search, Eye, Check, ChevronLeft, ChevronRight, Plus, Send, User, Building2, ArrowLeft, Users, Briefcase, Calendar, MapPin, ChevronRight as ArrowRight, GraduationCap, Target, Mail, Wrench, Clock, FileText, X, Phone, Smartphone, Star, ExternalLink } from 'lucide-react';

export default function Applications() {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('jobs'); // 'jobs' (Grouped view default) or 'all_apps' (Flat list)
  const [selectedJob, setSelectedJob] = useState(null); // When set, shows applications for this job
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [appCategory, setAppCategory] = useState('all'); // 'all', 'job', 'training'

  const handleNavigateToCandidateProfile = (applicant, app) => {
    const candidateObj = applicant || app?.applicant || {};
    const targetId = candidateObj.chef_profile_id || candidateObj.chef_profile?.id || candidateObj.chef_id || candidateObj.id || candidateObj.user_id || app?.applicant_id || app?.user_id;

    if (!targetId) {
      alert("Candidate profile ID not available.");
      return;
    }

    const role = (candidateObj.role || candidateObj.active_profile || candidateObj.user_role || '').toLowerCase();
    
    if (role.includes('employer') || role.includes('agency')) {
      navigate(`/admin/employers/${targetId}`, { state: { employer: candidateObj } });
    } else {
      navigate(`/admin/chefs/${targetId}`, { state: { chef: candidateObj } });
    }
  };

  // Selected detail modal for Candidate Profile
  const [selectedApp, setSelectedApp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Test Apply Modal State
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [selectedApplicantId, setSelectedApplicantId] = useState('');
  const [testJobsList, setTestJobsList] = useState([]);
  const [testUsersList, setTestUsersList] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [submittingTest, setSubmittingTest] = useState(false);
  const [testMessage, setTestMessage] = useState({ type: '', text: '' });

  // Calculate Match Percentage between Job Post Requirements and Applicant Candidate
  const calculateMatchPercentage = (app) => {
    if (!app) return { score: 0, locationScore: 0, expScore: 0, roleScore: 0, skillScore: 0 };

    const applicant = app.applicant || {};
    const job = app.job_post || {};
    const chefProfile = applicant.chef_profile || applicant.chefProfile || {};
    const availability = chefProfile.availability_info || {};

    // 1. Role / Title Match (Weight: 35%)
    let roleScore = 0;
    const prefRole = (applicant.preferred_role || '').toLowerCase().trim();
    const jobTitle = (job.title || '').toLowerCase().trim();

    if (prefRole && jobTitle) {
      if (prefRole === jobTitle || jobTitle.includes(prefRole) || prefRole.includes(jobTitle)) {
        roleScore = 35;
      } else {
        const roleTokens = prefRole.split(/\s+/).filter(t => t.length > 2);
        const titleTokens = jobTitle.split(/\s+/).filter(t => t.length > 2);
        const matches = roleTokens.filter(t => titleTokens.some(jt => jt.includes(t) || t.includes(jt)));
        if (matches.length > 0) {
          roleScore = Math.round(35 * (matches.length / Math.max(roleTokens.length, 1)));
        } else {
          roleScore = 15;
        }
      }
    } else {
      roleScore = 15;
    }

    // 2. Location Match (Weight: 25%)
    let locationScore = 0;
    const userCity = (applicant.city || '').toLowerCase().trim();
    const userLocPref = (availability.location_preference || '').toLowerCase().trim();
    const jobLocation = (job.location || '').toLowerCase().trim();

    if (jobLocation.includes('remote') || userLocPref === 'both' || userLocPref === 'overseas') {
      locationScore = 25;
    } else if (userCity && jobLocation) {
      if (jobLocation.includes(userCity) || userCity.includes(jobLocation)) {
        locationScore = 25;
      } else {
        const cityTokens = userCity.split(/[\s,]+/);
        const locTokens = jobLocation.split(/[\s,]+/);
        const locMatch = cityTokens.some(c => locTokens.some(l => l.includes(c) || c.includes(l)));
        locationScore = locMatch ? 20 : 10;
      }
    } else {
      locationScore = 15;
    }

    // 3. Experience Match (Weight: 25%)
    let expScore = 0;
    const userExp = (applicant.experience_range || applicant.experience_years || '').toLowerCase().trim();
    const jobExp = (job.experience_range || '').toLowerCase().trim();

    if (userExp && jobExp) {
      if (userExp === jobExp) {
        expScore = 25;
      } else {
        const extractYears = (str) => {
          const nums = str.match(/\d+/g);
          if (!nums) return [0, 10];
          const val = nums.map(Number);
          return val.length === 1 ? [val[0], val[0] + 3] : [val[0], val[1]];
        };
        const [uMin, uMax] = extractYears(userExp);
        const [jMin, jMax] = extractYears(jobExp);

        if (uMax >= jMin && uMin <= jMax) {
          expScore = 25;
        } else if (Math.abs(uMin - jMin) <= 3) {
          expScore = 18;
        } else {
          expScore = 10;
        }
      }
    } else {
      expScore = 15;
    }

    // 4. Skills Match (Weight: 15%)
    let skillScore = 0;
    let userSkills = [];
    if (Array.isArray(applicant.skills)) {
      userSkills = applicant.skills;
    } else if (typeof applicant.skills === 'string') {
      userSkills = applicant.skills.split(/[\s,]+/);
    }
    const cuisineSpec = chefProfile.cuisine_specialty || '';
    if (cuisineSpec) {
      userSkills = [...userSkills, ...cuisineSpec.split(/[\s,]+/)];
    }
    skillScore = userSkills.length > 0 ? 15 : 8;

    const totalScore = Math.min(100, Math.max(0, roleScore + locationScore + expScore + skillScore));

    return {
      score: totalScore,
      roleScore,
      locationScore,
      expScore,
      skillScore,
    };
  };

  const loadApps = async () => {
    setLoading(true);
    try {
      const res = await mockApi.getApplications();
      if (res && res.success && Array.isArray(res.applications)) {
        setApps(res.applications);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleOpenTestModal = async () => {
    setIsTestModalOpen(true);
    setLoadingOptions(true);
    setTestMessage({ type: '', text: '' });
    try {
      const data = await mockApi.getTestApplyOptions();
      if (data) {
        if (data.jobs && data.jobs.length > 0) {
          setTestJobsList(data.jobs);
          setSelectedJobId(data.jobs[0].id);
        }
        if (data.users && data.users.length > 0) {
          setTestUsersList(data.users);
          setSelectedApplicantId(data.users[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load test apply options:', err);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleTestSubmit = async (e) => {
    e.preventDefault();
    if (!selectedJobId || !selectedApplicantId) {
      setTestMessage({ type: 'error', text: 'Please select both a job listing and a candidate user.' });
      return;
    }

    setSubmittingTest(true);
    setTestMessage({ type: '', text: '' });

    try {
      const res = await mockApi.createTestApplication(selectedJobId, selectedApplicantId);
      if (res && res.success) {
        setTestMessage({ type: 'success', text: res.message || 'Test application submitted successfully!' });
        setTimeout(() => {
          setIsTestModalOpen(false);
          loadApps();
        }, 1200);
      } else {
        setTestMessage({ type: 'error', text: res?.message || 'Failed to submit test application.' });
      }
    } catch (err) {
      console.error('Test apply failed:', err);
      setTestMessage({ type: 'error', text: 'Error submitting test application.' });
    } finally {
      setSubmittingTest(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    setApps(prev => prev.map(item => (item.id === id || item.application_id === id) ? { ...item, status } : item));
    if (selectedApp && (selectedApp.id === id || selectedApp.application_id === id)) {
      setSelectedApp(prev => ({ ...prev, status }));
    }
    try {
      await mockApi.updateApplicationStatus(id, status);
    } catch (err) {
      console.error('Update status failed:', err);
    } finally {
      loadApps();
    }
  };

  // Group applications by job_post_id or training_id
  const groupedJobsMap = apps.reduce((acc, app) => {
    const isTraining = app.is_training || app.type === 'training' || app.application_type === 'training' || app.job_post?.is_training || app.job_post?.category === 'training';
    const jobId = app.job_post_id || app.job_post?.id || (isTraining ? `training_${app.training_id || app.id}` : 'unknown');
    if (!acc[jobId]) {
      acc[jobId] = {
        id: jobId,
        real_id: app.training_id || app.job_post?.real_id || app.job_post_id,
        title: app.job_post?.title || (isTraining ? `Training Program #${app.training_id || app.id}` : `Job Listing #${jobId}`),
        company: app.job_post?.company || (isTraining ? 'Jobrito Academy' : 'Employer'),
        location: app.job_post?.location || 'India',
        category: app.job_post?.category || (isTraining ? 'training' : 'india'),
        is_training: isTraining,
        type_label: isTraining ? 'Training Opportunity' : 'Job Listing',
        applications: [],
        latestDate: app.created_at,
      };
    }
    acc[jobId].applications.push(app);
    return acc;
  }, {});

  const groupedJobsList = Object.values(groupedJobsMap);

  // Filter Jobs Grouped list by search query & appCategory
  const filteredJobsList = groupedJobsList.filter(j => {
    const q = search.toLowerCase();
    const matchSearch =
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q);

    if (appCategory === 'job') return !j.is_training && matchSearch;
    if (appCategory === 'training') return j.is_training && matchSearch;
    return matchSearch;
  });

  // Filter applications for specific selected job or flat view
  const getApplicationsForDisplay = () => {
    let source = selectedJob ? (selectedJob.applications || []) : apps;

    if (!selectedJob) {
      if (appCategory === 'job') {
        source = source.filter(a => !a.is_training && a.type !== 'training' && a.application_type !== 'training' && !a.job_post?.is_training);
      } else if (appCategory === 'training') {
        source = source.filter(a => a.is_training || a.type === 'training' || a.application_type === 'training' || a.job_post?.is_training);
      }
    }

    return source.filter(a => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        (a.applicant?.full_name && a.applicant.full_name.toLowerCase().includes(q)) ||
        (a.applicant?.mobile_number && a.applicant.mobile_number.toLowerCase().includes(q)) ||
        (a.applicant?.email && a.applicant.email.toLowerCase().includes(q)) ||
        (a.job_post?.title && a.job_post.title.toLowerCase().includes(q)) ||
        (a.job_post?.company && a.job_post.company.toLowerCase().includes(q));

      if (statusFilter === 'all') return matchSearch;
      return a.status === statusFilter && matchSearch;
    });
  };

  const currentDisplayApps = getApplicationsForDisplay();

  const getAvatarColor = (name) => {
    if (!name) return 'bg-[#dcfce7] text-[#15803d]';
    const char = name.charCodeAt(0) % 4;
    switch (char) {
      case 0: return 'bg-[#dcfce7] text-[#15803d]';
      case 1: return 'bg-[#eff6ff] text-[#1d4ed8]';
      case 2: return 'bg-[#fff7ed] text-[#c2410c]';
      default: return 'bg-[#f3e8ff] text-[#7e22ce]';
    }
  };

  return (
    <div className="space-y-3 text-left">
      
      {/* Header & Main Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          {selectedJob ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => { setSelectedJob(null); setStatusFilter('all'); }}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#153e69] border border-[#cfd5dc] transition-all flex items-center gap-1.5 text-xs font-extrabold shadow-2xs cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-4 h-4 text-[#153e69]" />
                <span>All Listings</span>
              </button>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-outfit font-bold text-[22px] leading-tight text-slate-900">
                    {selectedJob.title}
                  </h2>
                  {selectedJob.is_training ? (
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      <GraduationCap className="inline w-3 h-3 mr-1" /> TRAINING OPPORTUNITY
                    </span>
                  ) : (
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      <Briefcase className="inline w-3 h-3 mr-1" /> JOB LISTING
                    </span>
                  )}
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {selectedJob.applications.length} Applicant{selectedJob.applications.length > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedJob.company}</span>
                  <span aria-hidden="true">•</span>
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedJob.location}</span>
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="font-outfit font-bold text-[22px] leading-tight text-slate-900">Job & Training Applications Directory</h2>
              <p className="text-[12px] font-medium text-slate-600 mt-0.5">Select a job post or training opportunity to view applicants and review candidate profiles.</p>
            </div>
          )}
        </div>

        {/* Action Controls: Search Bar */}
        <div className="flex items-center gap-3 flex-wrap w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <input 
              type="text" 
              placeholder={selectedJob ? "Search applicants..." : "Search jobs, training or companies..."} 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 bg-white border border-[#cfd5dc] rounded-md py-2 pl-9 pr-3 text-[11px] font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#153e69] transition-all" 
            />
            <Search className="absolute left-3.5 top-2.5 text-slate-400 w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-lg border border-[#d7dce2] shadow-sm overflow-hidden text-left">
        
        {/* Top View Toggle Tabs */}
        {!selectedJob && (
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#d7dce2] px-6 pt-4 bg-white gap-4">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setViewMode('jobs')} 
                className={`text-xs font-extrabold pb-3.5 transition-all relative flex items-center gap-2 ${viewMode === 'jobs' ? 'text-[#153e69] border-b-2 border-[#153e69]' : 'text-slate-400 hover:text-slate-700'}`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Grouped by Listings ({groupedJobsList.length})</span>
              </button>

              <button 
                onClick={() => setViewMode('all_apps')} 
                className={`text-xs font-extrabold pb-3.5 transition-all relative flex items-center gap-2 ${viewMode === 'all_apps' ? 'text-[#153e69] border-b-2 border-[#153e69]' : 'text-slate-400 hover:text-slate-700'}`}
              >
                <Users className="w-4 h-4" />
                <span>All Applications ({apps.length})</span>
              </button>
            </div>

            {/* Category Filter Pills (All / Jobs / Training) */}
            <div className="flex items-center gap-2 pb-3.5">
              <button 
                onClick={() => setAppCategory('all')} 
                className={`px-3 py-1 rounded-xl text-[11px] font-black transition-all cursor-pointer ${appCategory === 'all' ? 'bg-[#153e69] text-white shadow-sm' : 'bg-white text-slate-600 hover:text-[#153e69] border border-[#d7dce2]'}`}
              >
                All ({apps.length})
              </button>
              <button 
                onClick={() => setAppCategory('job')} 
                className={`px-3 py-1 rounded-xl text-[11px] font-black transition-all cursor-pointer ${appCategory === 'job' ? 'bg-[#153e69] text-white shadow-sm' : 'bg-white text-slate-600 hover:text-[#153e69] border border-[#d7dce2]'}`}
              >
                <Briefcase className="inline w-3 h-3 mr-1" /> Jobs ({apps.filter(a => !a.is_training && a.type !== 'training' && a.application_type !== 'training' && !a.job_post?.is_training).length})
              </button>
              <button 
                onClick={() => setAppCategory('training')} 
                className={`px-3 py-1 rounded-xl text-[11px] font-black transition-all cursor-pointer ${appCategory === 'training' ? 'bg-[#153e69] text-white shadow-sm' : 'bg-white text-slate-600 hover:text-[#153e69] border border-[#d7dce2]'}`}
              >
                <GraduationCap className="inline w-3 h-3 mr-1" /> Training ({apps.filter(a => a.is_training || a.type === 'training' || a.application_type === 'training' || a.job_post?.is_training).length})
              </button>
            </div>
          </div>
        )}

        {/* Selected Job Filter Header (If in Job Detail View) */}
        {selectedJob && (
          <div className="bg-[#f8fafc] border-b border-[#e2e8f0] px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700">
              <span className="text-slate-500 font-semibold">Filter Applicants:</span>
            </div>

            {/* Status Filter Tabs for Job with counts */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { key: 'all', label: 'ALL', count: selectedJob.applications.length },
                { key: 'new', label: 'NEW', count: selectedJob.applications.filter(a => !a.status || a.status === 'new' || a.status === 'applied').length },
                { key: 'contacted', label: 'CONTACTED', count: selectedJob.applications.filter(a => a.status === 'contacted').length },
                { key: 'hired', label: 'HIRED', count: selectedJob.applications.filter(a => a.status === 'hired').length },
                { key: 'rejected', label: 'REJECTED', count: selectedJob.applications.filter(a => a.status === 'rejected').length },
              ].map(st => (
                <button
                  key={st.key}
                  onClick={() => setStatusFilter(st.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-[11px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                    statusFilter === st.key 
                      ? 'bg-[#153e69] text-white shadow-sm border border-[#153e69]' 
                      : 'bg-white text-slate-600 border border-[#cfd5dc] hover:bg-slate-50 hover:text-[#153e69]'
                  }`}
                >
                  <span>{st.label}</span>
                  <span className={`px-2 py-0.2 rounded-full text-[10px] font-extrabold ${
                    statusFilter === st.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {st.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW LEVEL 1: GROUPED BY JOBS LIST (DEFAULT LEVEL 1) */}
        {/* ------------------------------------------------------------- */}
        {!selectedJob && viewMode === 'jobs' && (
          <div>
            {loading ? (
              <p className="text-center text-slate-400 text-xs font-medium py-16">Loading listings and applications...</p>
            ) : filteredJobsList.length === 0 ? (
              <p className="text-center text-slate-400 text-sm font-medium py-16">No listings matching your search or category filter.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f1f3f5] border-b border-[#d7dce2] text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Program / Job Listing & Provider</th>
                      <th className="py-2.5 px-3">Type Badge</th>
                      <th className="py-2.5 px-3">Location</th>
                      <th className="py-4 px-6 text-center">Applicants</th>
                      <th className="py-2.5 px-3">Status Breakdown</th>
                      <th className="py-4 px-6 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d7dce2] text-slate-700 text-xs font-semibold">
                    {filteredJobsList.map(job => {
                      const newCount = job.applications.filter(a => a.status === 'new').length;
                      const contactedCount = job.applications.filter(a => a.status === 'contacted').length;
                      const hiredCount = job.applications.filter(a => a.status === 'hired').length;

                      return (
                        <tr 
                          key={job.id} 
                          onClick={() => setSelectedJob(job)}
                          className="hover:bg-[#f8fafc] transition-colors cursor-pointer group"
                        >
                          {/* Job Title & Company */}
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                                job.is_training ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}>
                                {job.is_training ? <GraduationCap className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                              </div>
                              <div>
                                <span className="font-extrabold text-slate-900 text-[13px] group-hover:text-[#153e69] transition-colors block">
                                  {job.title}
                                </span>
                                <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">
                                  {job.company}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Type Badge */}
                          <td className="py-2.5 px-3">
                            {job.is_training ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200 shadow-xs">
                                <GraduationCap className="inline w-3 h-3 mr-1" /> TRAINING OPPORTUNITY
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 shadow-xs">
                                <Briefcase className="inline w-3 h-3 mr-1" /> JOB LISTING
                              </span>
                            )}
                          </td>

                          {/* Location */}
                          <td className="py-2.5 px-3">
                            <span className="text-slate-700 font-extrabold block">{job.location}</span>
                            <span className="text-[10px] text-slate-400 font-semibold block capitalize">{job.category}</span>
                          </td>

                          {/* Number of Applicants Badge */}
                          <td className="py-4.5 px-6 text-center">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                              <Users className="w-3.5 h-3.5" />
                              <span>{job.applications.length} Candidate{job.applications.length > 1 ? 's' : ''}</span>
                            </span>
                          </td>

                          {/* Status Breakdown Pills */}
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              {newCount > 0 && (
                                <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
                                  {newCount} New
                                </span>
                              )}
                              {contactedCount > 0 && (
                                <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200">
                                  {contactedCount} Contacted
                                </span>
                              )}
                              {hiredCount > 0 && (
                                <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {hiredCount} Hired
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Action Button */}
                          <td className="py-4.5 px-6 text-center">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}
                              className="px-3 py-1.5 rounded-md bg-[#153e69] hover:bg-[#12345d] text-white font-bold text-[11px] transition-all flex items-center gap-1 mx-auto cursor-pointer"
                            >
                              <span>View Applications ({job.applications.length})</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW LEVEL 2: APPLICANTS UNDER SELECTED JOB OR FLAT LIST */}
        {/* ------------------------------------------------------------- */}
        {(selectedJob || viewMode === 'all_apps') && (
          <div>
            {loading ? (
              <p className="text-center text-slate-400 text-xs font-medium py-16">Loading applications...</p>
            ) : currentDisplayApps.length === 0 ? (
              <p className="text-center text-slate-400 text-sm font-medium py-16">No candidate applications found for this listing.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f1f3f5] border-b border-[#d7dce2] text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4">Applicant Candidate</th>
                      <th className="py-3 px-4 text-center">Match %</th>
                      {!selectedJob && <th className="py-3 px-4">Applied Post & Type</th>}
                      <th className="py-3 px-4">Contact / Mobile</th>
                      <th className="py-3 px-4">Date Submitted</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0] text-slate-700 text-xs font-semibold">
                    {currentDisplayApps.map(a => {
                      const match = calculateMatchPercentage(a);
                      const isTrainingApp = a.is_training || a.type === 'training' || a.application_type === 'training' || a.job_post?.is_training;

                      return (
                        <tr key={a.id} className="hover:bg-[#f8fafc] transition-colors">
                          
                          {/* Applicant details */}
                          <td 
                            onClick={() => handleNavigateToCandidateProfile(a.applicant, a)}
                            className="py-3.5 px-4 flex items-center gap-3 cursor-pointer group/cand"
                            title="Click to view candidate's complete profile page"
                          >
                            {resolveImageUrl(a.applicant?.profile_photo_path || a.applicant?.profile_photo || a.applicant?.avatar) ? (
                              <img 
                                src={resolveImageUrl(a.applicant?.profile_photo_path || a.applicant?.profile_photo || a.applicant?.avatar)} 
                                alt={a.applicant?.full_name} 
                                className="w-10 h-10 rounded-xl object-cover border border-emerald-500 shadow-sm shrink-0" 
                                onError={(e) => { e.target.style.display = 'none'; if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'; }}
                              />
                            ) : null}
                            <div 
                              className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold font-outfit text-xs border border-purple-200 bg-purple-50 text-purple-700 shadow-xs shrink-0`}
                              style={{ display: resolveImageUrl(a.applicant?.profile_photo_path || a.applicant?.profile_photo || a.applicant?.avatar) ? 'none' : 'flex' }}
                            >
                              {a.applicant?.full_name ? a.applicant.full_name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'C#'}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-[#153e69] group-hover/cand:text-[#0f2d4e] transition-colors text-sm block leading-tight">{a.applicant?.full_name || 'Candidate #' + a.id}</span>
                                {isTrainingApp && (
                                  <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[9px] font-black px-1.5 py-0.5 rounded shrink-0">
                                    <GraduationCap className="inline w-3 h-3 mr-1" /> Training
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">{a.applicant?.email || 'N/A'}</span>
                            </div>
                          </td>

                          {/* Match Percentage Badge */}
                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black shadow-2xs border ${
                              match.score >= 80 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : match.score >= 60 
                                  ? 'bg-amber-50 text-amber-700 border-amber-200' 
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}>
                              <Target className="w-3.5 h-3.5" />
                              <span>{match.score}%</span>
                            </span>
                          </td>

                          {/* Job/Training post detail (If in Flat List mode) */}
                          {!selectedJob && (
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                {isTrainingApp ? (
                                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
                                    <GraduationCap className="inline w-3 h-3 mr-1" /> TRAINING
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                                    <Briefcase className="inline w-3 h-3 mr-1" /> JOB
                                  </span>
                                )}
                                <span className="font-extrabold text-slate-900 block text-[13px]">{a.job_post?.title || 'Listing'}</span>
                              </div>
                              <span className="text-[10px] text-slate-500 font-bold block mt-0.5">{a.job_post?.company || 'Employer'}</span>
                            </td>
                          )}

                        {/* Contact info */}
                        <td className="py-3.5 px-4 text-slate-800 font-bold text-xs">
                          {a.applicant?.mobile_number || 'N/A'}
                        </td>

                        {/* Date Submitted */}
                        <td className="py-3.5 px-4 text-slate-400 font-bold text-xs">
                          {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4">
                          {a.status === 'shortlisted' ? (
                            <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Shortlisted
                            </span>
                          ) : a.status === 'contacted' ? (
                            <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                              Contacted
                            </span>
                          ) : a.status === 'hired' ? (
                            <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200">
                              Hired
                            </span>
                          ) : a.status === 'rejected' ? (
                            <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                              Rejected
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                              New
                            </span>
                          )}
                        </td>

                        {/* Actions link matching Screenshot 2 View Applications button */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleNavigateToCandidateProfile(a.applicant, a)}
                              className="bg-[#153e69] hover:bg-[#0f2d4e] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                              title="View Candidate's Complete Profile Page"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Profile</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                            
                            <a href={a.applicant?.mobile_number ? `tel:${a.applicant.mobile_number}` : '#'} 
                               onClick={() => handleUpdateStatus(a.id, 'contacted')}
                               className="p-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 border border-[#cfd5dc] transition-colors cursor-pointer" title="Call Candidate">
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Footer pagination */}
        <div className="px-3 py-2.5 flex justify-between items-center border-t border-[#d7dce2] bg-white">
          <span className="text-xs text-slate-400 font-bold">
            Showing {selectedJob ? currentDisplayApps.length : (viewMode === 'jobs' ? filteredJobsList.length : currentDisplayApps.length)} item(s)
          </span>
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] flex items-center justify-center text-slate-400"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-7 h-7 rounded-lg bg-[#065f46] text-white flex items-center justify-center text-xs font-bold">1</button>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] flex items-center justify-center text-slate-400"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

      </div>

      {/* TEST APPLY FOR CANDIDATE MODAL */}
      {isTestModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-150 text-left">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center"><FileText className="w-4 h-4" /></span>
                <h3 className="font-outfit font-extrabold text-slate-800 text-base">Submit Test Job Application</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsTestModalOpen(false)} 
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm font-bold transition-all"
              >
              <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            {loadingOptions ? (
              <p className="text-center text-slate-400 text-xs font-medium py-16">Loading registered jobs and users...</p>
            ) : (
              <form onSubmit={handleTestSubmit} className="p-6 space-y-4">
                
                {testMessage.text && (
                  <div className={`p-3 rounded-xl text-xs font-extrabold ${testMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                    {testMessage.text}
                  </div>
                )}

                {/* Step 1: Select Job Listing */}
                <div>
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#059669]" />
                    <span>Select Target Job Listing *</span>
                  </label>
                  <select 
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    required
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#059669]"
                  >
                    {testJobsList.map(job => (
                      <option key={job.id} value={job.id}>
                        {job.title} <span aria-hidden="true">—</span> {job.company} ({job.location})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Step 2: Select Candidate / Registered User */}
                <div>
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                    <User className="w-3.5 h-3.5 text-[#059669]" />
                    <span>Select Registered Candidate / Employer / User *</span>
                  </label>
                  <select 
                    value={selectedApplicantId}
                    onChange={(e) => setSelectedApplicantId(e.target.value)}
                    required
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#059669]"
                  >
                    {testUsersList.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email || user.mobile_number}) <span aria-hidden="true">—</span> {user.role}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Info Note */}
                <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-[11px] font-semibold text-emerald-800">
                  <Briefcase className="inline w-3 h-3 mr-1" /> job post, visible live on both the Admin Applications table and the Employer Dashboard!
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsTestModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingTest}
                    className="px-5 py-2 bg-[#f58220] hover:bg-[#df6d0f] text-white rounded-xl text-xs font-bold shadow-sm shadow-[#059669]/10 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingTest ? 'Submitting...' : 'Submit Test Application'}</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

      {/* LEVEL 3: CANDIDATE PROFILE SUMMARY DIALOG MODAL */}
      {modalOpen && selectedApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
              <h3 className="font-outfit font-extrabold text-slate-800 text-base">Applicant Candidate Profile</h3>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm font-bold transition-all"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-6 space-y-5 text-xs font-semibold text-slate-500 text-left">
              
              {/* Direct Link Button to Full Profile Page */}
              <button
                onClick={() => {
                  setModalOpen(false);
                  handleNavigateToCandidateProfile(selectedApp.applicant, selectedApp);
                }}
                className="w-full py-2.5 px-4 bg-[#153e69] hover:bg-[#12345d] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer border border-blue-900"
              >
                <User className="w-4 h-4" />
                <span>Open Candidate's Complete Profile Page &rarr;</span>
              </button>
              
              {/* Profile details */}
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold font-outfit text-sm border ${getAvatarColor(selectedApp.applicant?.full_name)}`}>
                  {selectedApp.applicant?.full_name ? selectedApp.applicant.full_name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U'}
                </div>
                <div>
                  <h4 className="font-outfit font-extrabold text-slate-800 text-base leading-snug">{selectedApp.applicant?.full_name}</h4>
                  <span className="text-[11px] text-slate-500 font-bold block mt-0.5"><Phone className="inline w-3 h-3 mr-1" /> {selectedApp.applicant?.mobile_number} <span aria-hidden="true">•</span> <Mail className="inline w-3 h-3 mx-1" /> {selectedApp.applicant?.email || 'N/A'}</span>
                </div>
              </div>

              {/* Bio summary */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block">City / Location</span>
                  <span className="text-slate-800 font-extrabold mt-1 block">{selectedApp.applicant?.city || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Experience Range</span>
                  <span className="text-slate-800 font-extrabold mt-1 block">{selectedApp.applicant?.experience_range || 'N/A'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Preferred Role</span>
                  <span className="text-slate-800 font-extrabold mt-1 block">{selectedApp.applicant?.preferred_role || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Current Employer</span>
                  <span className="text-slate-800 font-extrabold mt-1 block">{selectedApp.applicant?.current_employer || 'N/A'}</span>
                </div>
              </div>

              {/* Applied Job Info */}
              <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl text-left">
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Applied For Listing</span>
                <span className="font-extrabold text-emerald-900 text-xs block">{selectedApp.job_post?.title}</span>
                <span className="text-[10px] text-emerald-700 font-semibold">{selectedApp.job_post?.company} ({selectedApp.job_post?.location})</span>
              </div>

              {/* Detailed Candidate vs Job Match Breakdown Card */}
              {(() => {
                const modalMatch = calculateMatchPercentage(selectedApp);
                return (
                  <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Candidate Match Score</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
                        modalMatch.score >= 80 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                        modalMatch.score >= 60 ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                        'bg-slate-800 text-slate-700 border-slate-700'
                      }`}>
                        <Target className="inline w-3 h-3 mr-1" /> % Match
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/50">
                        <span className="text-slate-400 block text-[9px]"><MapPin className="inline w-3 h-3 mr-1" /> Location Match ({modalMatch.locationScore}/25)</span>
                        <span className="font-extrabold text-slate-700 mt-0.5 block truncate">{selectedApp.applicant?.city || 'N/A'} vs {selectedApp.job_post?.location || 'Remote'}</span>
                      </div>
                      <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/50">
                        <span className="text-slate-400 block text-[9px]"><Briefcase className="inline w-3 h-3 mr-1" /> Role Match ({modalMatch.roleScore}/35)</span>
                        <span className="font-extrabold text-slate-700 mt-0.5 block truncate">{selectedApp.applicant?.preferred_role || 'N/A'}</span>
                      </div>
                      <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/50">
                        <span className="text-slate-400 block text-[9px]"><Clock className="inline w-3 h-3 mr-1" /> Experience Match ({modalMatch.expScore}/25)</span>
                        <span className="font-extrabold text-slate-700 mt-0.5 block truncate">{selectedApp.applicant?.experience_range || 'N/A'}</span>
                      </div>
                      <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/50">
                        <span className="text-slate-400 block text-[9px]"><Wrench className="inline w-3 h-3 mr-1" /> Skills Match ({modalMatch.skillScore}/15)</span>
                        <span className="font-extrabold text-slate-700 mt-0.5 block truncate">{Array.isArray(selectedApp.applicant?.skills) ? selectedApp.applicant.skills.slice(0,2).join(', ') : 'General'}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Skills list */}
              <div className="border-t border-slate-100 pt-4">
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-2">Key Skills & Specialties</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(selectedApp.applicant?.skills && selectedApp.applicant.skills.length > 0 ? selectedApp.applicant.skills : ['Hospitality', 'Service']).map((s, idx) => (
                    <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-700 text-[9px] font-extrabold px-2 py-0.5 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Moderation actions inside modal */}
              <div className="border-t border-slate-100 pt-5 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block">Application Status</span>
                  <span className="text-slate-800 font-extrabold block capitalize">{selectedApp.status}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => handleUpdateStatus(selectedApp.id, 'rejected')}
                          className="bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-lg px-3.5 py-2 font-bold transition-all text-xs cursor-pointer">
                    Reject
                  </button>
                  <button onClick={() => handleUpdateStatus(selectedApp.id, 'shortlisted')}
                          className="bg-[#153e69] hover:bg-[#12345d] text-white rounded-lg px-3.5 py-2 font-bold transition-all text-xs shadow-sm flex items-center gap-1 cursor-pointer">
                    <Check className="w-3.5 h-3.5" />
                    Shortlist
                  </button>
                  <button onClick={() => handleUpdateStatus(selectedApp.id, 'hired')}
                          className="bg-[#f58220] hover:bg-[#df6d0f] text-white rounded-lg px-3.5 py-2 font-bold transition-all text-xs shadow-sm cursor-pointer">
                    Hire Candidate
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}





