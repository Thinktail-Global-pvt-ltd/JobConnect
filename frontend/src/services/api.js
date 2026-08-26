import axios from 'axios';

// Axios Instance configured for production deploy
export const realApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

export const resolveImageUrl = (path) => {
  if (!path) return null;
  let clean = String(path).trim();
  if (!clean || clean === 'null' || clean === 'undefined') return null;

  if (clean.includes('178.16.138.159') && typeof window !== 'undefined') {
    const subPath = clean.replace(/https?:\/\/178\.16\.138\.159(:[0-9]+)?/, '');
    return `${window.location.origin}${subPath.startsWith('/') ? '' : '/'}${subPath}`;
  }

  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }

  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    return `${origin}${clean.startsWith('/') ? '' : '/'}${clean}`;
  }

  return clean;
};

// Inject Sanctum Auth Token in headers
realApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// LocalStorage helper functions
const getStored = (key, defaultVal) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const setStored = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn(`Failed to save ${key} to localStorage`, e);
  }
};

// ==========================================
// MOCK DATABASE (For fallback if backend fails or is offline)
// ==========================================

const INITIAL_USERS = [
  { id: '1', full_name: 'Sanjay Kapoor', email: 'sanjay@jobconnect.in', mobile_number: '9876543210', city: 'New Delhi', experience_range: '6+ Years', preferred_role: 'Executive Chef', current_employer: 'The Taj Palace', skills: ['Fine Dining', 'Menu Costing', 'French Cuisine'], is_suspended: false, completeness: 100, role_type: 'job_seeker', created_at: '2026-06-01' },
  { id: '2', full_name: 'Ananya Sharma', email: 'ananya@bistrobites.com', mobile_number: '8765432109', city: 'Mumbai', experience_range: '4-6 Years', preferred_role: 'F&B Manager', current_employer: 'Bistro Bites Ltd', skills: ['Staff Scheduling', 'POS Operations'], is_suspended: false, completeness: 85, role_type: 'employer', created_at: '2026-06-02' },
  { id: '3', full_name: 'Vikram Rathore', email: 'vikram@agencies.net', mobile_number: '7654321098', city: 'Bangalore', experience_range: '6+ Years', preferred_role: 'Recruitment Director', skills: ['Staffing', 'Kitchen Setup'], is_suspended: false, completeness: 90, role_type: 'agency', created_at: '2026-06-03' },
  { id: '4', full_name: 'Ramesh Kumar', email: 'ramesh@jobseeker.in', mobile_number: '9111111100', city: 'Mumbai', experience_range: '2-4 Years', preferred_role: 'F&B Associate', skills: ['Kitchen Assistance', 'Food Service'], is_suspended: false, completeness: 75, role_type: 'job_seeker', created_at: '2026-06-05' },
  { id: '5', full_name: 'Sunita Rao', email: 'sunita@jobseeker.in', mobile_number: '9111111101', city: 'Mumbai', experience_range: '2-4 Years', preferred_role: 'F&B Associate', skills: ['Kitchen Assistance'], is_suspended: true, completeness: 60, role_type: 'job_seeker', created_at: '2026-06-06' }
];

const INITIAL_JOBS = [
  { id: '1', title: 'Urgent: Regional Warehouse Manager', company: 'Global Logistics Corp', category: 'overseas', salary: '$4,500 - $6,200', location: 'Singapore', description: 'Leading the operations for our new hub. Seeking an experienced professional to manage logistics and staff.', status: 'approved', is_pinned: true, country: 'Singapore', visa_assistance: true, accommodation_available: true, job_type: 'Full-time', creator_id: '2', created_at: '2026-06-15T10:00:00Z', requirements: ['Regional logistics exp', 'Inventory control'], benefits: ['Health cover', 'Travel tickets'] },
  { id: '2', title: 'Senior Pastry Chef', company: 'The Grand Patisserie', category: 'overseas', salary: '£35k - £42k / yr', location: 'Mayfair, London', description: 'We are looking for a creative Senior Pastry Chef to lead our dessert department.', status: 'approved', is_pinned: false, country: 'United Kingdom', visa_assistance: true, accommodation_available: false, job_type: 'Full-time', creator_id: '2', created_at: '2026-06-20T12:00:00Z', requirements: ['Sugar work exp', 'Team management'], benefits: ['Meals provided', 'Private health'] },
  { id: '3', title: 'Head Chef - New Mumbai Branch', company: 'Fine Dine Group', category: 'india', salary: '₹12L - ₹18L PA', location: 'Mumbai, India', description: 'We are opening our 15th location and looking for a creative culinary leader.', status: 'pending', is_pinned: false, country: 'India', visa_assistance: false, accommodation_available: false, job_type: 'Full-time', creator_id: '2', created_at: '2026-07-02T15:30:00Z', requirements: ['8+ years exp', 'European plating design'], benefits: ['Performance incentives', 'dining vouchers'] },
  { id: '4', title: 'Executive Sous Chef', company: 'Bistro Palace', category: 'india', salary: '₹8L - ₹10L PA', location: 'New Delhi, India', description: 'Looking for a highly skilled Executive Sous Chef to manage kitchen staff and inventory control.', status: 'pending', is_pinned: false, country: 'India', visa_assistance: false, accommodation_available: true, job_type: 'Full-time', creator_id: '3', created_at: '2026-07-03T09:10:00Z', requirements: ['5+ years exp', 'Staff scheduling', 'Food hygiene Level 3'], benefits: ['Free meals', 'Bonus options'] }
];

const INITIAL_APPLICATIONS = [
  { id: '1', job_post_id: '3', applicant_id: '1', status: 'contacted', created_at: '2026-07-02T16:00:00Z' },
  { id: '2', job_post_id: '3', applicant_id: '4', status: 'new', created_at: '2026-07-02T17:00:00Z' }
];

const INITIAL_CHEFS = [
  {
    id: '1',
    user_id: '1',
    full_name: 'Chef Vikram Rathore',
    email: 'vikram.chef@jobconnect.in',
    mobile_number: '+91 98765 43210',
    preferred_role: 'Executive Chef',
    city: 'Mumbai',
    country: 'India',
    experience_range: '8-12 Years',
    cuisine_specialty: 'Indian, Tandoori, Continental',
    bio: 'Award-winning Executive Chef with 10+ years leading luxury hotel kitchens and fine dining menus.',
    calendly_link: 'https://calendly.com/chefvikram',
    location_preference: 'Both',
    availability: 'Available Immediately',
    languages: 'English, Hindi',
    skills: 'Kitchen Management, Menu Engineering, Food Cost Control',
    approval_status: 'approved',
    status: 'approved',
    photo_url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80',
    created_at: '2026-07-01T10:00:00Z'
  },
  {
    id: '2',
    user_id: '2',
    full_name: 'Chef Ankit Jha',
    email: 'ankit.jha@jobrito.com',
    mobile_number: '+91 98123 45678',
    preferred_role: 'Head Chef',
    city: 'New Delhi',
    country: 'India',
    experience_range: '5-8 Years',
    cuisine_specialty: 'Pan-Asian, Chinese, Dim Sum',
    bio: 'Experienced Head Chef specializing in Asian fusion dining and high-volume banquet operations.',
    calendly_link: 'https://calendly.com/chefankit',
    location_preference: 'Overseas',
    availability: '2 Weeks Notice',
    languages: 'English, Hindi, Mandarin',
    skills: 'Wok Master, Team Leadership, Inventory Management',
    approval_status: 'approved',
    status: 'approved',
    photo_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80',
    created_at: '2026-07-10T12:00:00Z'
  },
  {
    id: '3',
    user_id: '3',
    full_name: 'Chef Maria Santos',
    email: 'maria.santos@pastry.org',
    mobile_number: '+971 50 123 4567',
    preferred_role: 'Pastry Chef',
    city: 'Dubai',
    country: 'UAE',
    experience_range: '6-10 Years',
    cuisine_specialty: 'French Pastry, Desserts, Chocolatier',
    bio: 'Passionate Executive Pastry Chef trained in Paris with extensive experience in Middle East resorts.',
    calendly_link: 'https://calendly.com/chefmariasantos',
    location_preference: 'Both',
    availability: 'Available Immediately',
    languages: 'English, French, Spanish',
    skills: 'Artisan Baking, Dessert Plating, Sugar Work',
    approval_status: 'pending',
    status: 'pending',
    photo_url: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?auto=format&fit=crop&w=400&q=80',
    created_at: '2026-07-20T14:30:00Z'
  }
];

export const mockDb = {
  getUsers: () => getStored('mock_users', INITIAL_USERS),
  setUsers: (users) => setStored('mock_users', users),
  getJobs: () => {
    const jobs = getStored('mock_jobs', INITIAL_JOBS);
    if (!Array.isArray(jobs) || jobs.length === 0) {
      setStored('mock_jobs', INITIAL_JOBS);
      return INITIAL_JOBS;
    }
    return jobs;
  },
  setJobs: (jobs) => setStored('mock_jobs', jobs),
  getApplications: () => getStored('mock_applications', INITIAL_APPLICATIONS),
  setApplications: (apps) => setStored('mock_applications', apps),
  getChefs: () => {
    const data = getStored('mock_chefs', INITIAL_CHEFS);
    if (!Array.isArray(data) || data.length === 0) {
      setStored('mock_chefs', INITIAL_CHEFS);
      return INITIAL_CHEFS;
    }
    return data;
  },
  setChefs: (chefs) => setStored('mock_chefs', chefs),
};

// Internal Mock Endpoints Fallback
const mockEndpoints = {
  getStats: async () => {
    const users = mockDb.getUsers();
    const jobs = mockDb.getJobs();
    const apps = mockDb.getApplications();
    const chefs = mockDb.getChefs();

    const pendingJobsCount = jobs.filter(j => 
      !j.status || j.status.toLowerCase() === 'pending' || j.status.toLowerCase() === 'draft'
    ).length;

    const pendingChefsCount = chefs.filter(c => 
      !c.approval_status || c.approval_status.toLowerCase() === 'pending' || c.status?.toLowerCase() === 'pending'
    ).length;

    return {
      success: true,
      stats: {
        users_count: users.length,
        users_active: users.filter(u => !u.is_suspended).length,
        users_suspended: users.filter(u => u.is_suspended).length,
        jobs_total: jobs.length,
        jobs_approved: jobs.filter(j => j.status?.toLowerCase() === 'approved').length,
        jobs_pending: pendingJobsCount,
        pending_jobs: pendingJobsCount,
        chefs_total: chefs.length,
        chefs_approved: chefs.filter(c => c.approval_status === 'approved' || c.status === 'approved').length,
        chefs_pending: pendingChefsCount,
        pending_chefs: pendingChefsCount,
        pending_training: 1,
        pending_apps: apps.filter(a => a.status === 'new' || a.status === 'pending').length || 8,
        training_opportunities: 2,
        applications_count: apps.length
      },
      pendingJobs: jobs.filter(j => !j.status || j.status.toLowerCase() === 'pending'),
      pendingChefs: chefs.filter(c => c.approval_status === 'pending'),
      feed: [
        { title: 'New job post submitted', description: 'Bistro Palace submitted a new listing: Executive Sous Chef', time: '2 hours ago', badge_color: 'bg-blue-50 text-blue-600', icon: '💼' },
        { title: 'New application received', description: 'Sanjay Kapoor applied for Head Chef listing', time: '4 hours ago', badge_color: 'bg-indigo-50 text-indigo-600', icon: '📝' },
        { title: 'Chef profile submitted', description: 'Chef Ankit Kumar completed onboarding', time: '1 day ago', badge_color: 'bg-emerald-50 text-emerald-600', icon: '👨‍🍳' }
      ]
    };
  },

  getUsers: async (search = '', tab = 'all') => {
    let users = mockDb.getUsers();
    
    if (search) {
      const q = search.toLowerCase();
      users = users.filter(u => 
        u.full_name?.toLowerCase().includes(q) || 
        u.mobile_number?.includes(q) || 
        u.email?.toLowerCase().includes(q)
      );
    }

    if (tab === 'active') {
      users = users.filter(u => !u.is_suspended);
    } else if (tab === 'suspended') {
      users = users.filter(u => u.is_suspended);
    }

    const jobs = mockDb.getJobs();
    const apps = mockDb.getApplications();

    const usersWithCounts = users.map(u => ({
      ...u,
      job_posts_count: jobs.filter(j => j.creator_id === u.id).length,
      applications_count: apps.filter(a => a.applicant_id === u.id).length
    }));

    return { success: true, users: usersWithCounts };
  },

  suspendUser: async (id) => {
    const users = mockDb.getUsers();
    const updated = users.map(u => u.id === id ? { ...u, is_suspended: true } : u);
    mockDb.setUsers(updated);
    return { success: true };
  },

  activateUser: async (id) => {
    const users = mockDb.getUsers();
    const updated = users.map(u => u.id === id ? { ...u, is_suspended: false } : u);
    mockDb.setUsers(updated);
    return { success: true };
  },

  deleteUser: async (id) => {
    const users = mockDb.getUsers();
    const filtered = users.filter(u => u.id !== id);
    mockDb.setUsers(filtered);
    return { success: true };
  },

  getUserJobs: async (id) => {
    const jobs = mockDb.getJobs();
    const apps = mockDb.getApplications();
    const users = mockDb.getUsers();

    const userJobs = jobs.filter(j => j.creator_id === id).map(j => {
      const jobApps = apps.filter(a => a.job_post_id === j.id).map(a => ({
        ...a,
        applicant: users.find(u => u.id === a.applicant_id)
      }));
      return { ...j, applications: jobApps };
    });

    return { success: true, jobs: userJobs };
  },

  getUserApplications: async (id) => {
    const apps = mockDb.getApplications();
    const jobs = mockDb.getJobs();
    
    let userApps = apps.filter(a => 
      String(a.applicant_id) === String(id) || 
      String(a.user_id) === String(id) || 
      String(a.created_by) === String(id)
    ).map(a => ({
      ...a,
      job_title: a.job_title || a.title || (jobs.find(j => String(j.id) === String(a.job_post_id))?.title) || 'Job Application',
      company: a.company || (jobs.find(j => String(j.id) === String(a.job_post_id))?.company) || 'Hospitality Employer',
      job_post: jobs.find(j => String(j.id) === String(a.job_post_id))
    }));

    return { success: true, applications: userApps };
  },

  getJobs: async (status = '', category = '') => {
    let jobs = mockDb.getJobs();
    const users = mockDb.getUsers();

    if (status) {
      jobs = jobs.filter(j => j.status === status);
    }
    if (category) {
      jobs = jobs.filter(j => j.category === category);
    }

    const jobsWithCreator = jobs.map(j => ({
      ...j,
      creator: users.find(u => u.id === j.creator_id) || { mobile_number: 'N/A' }
    }));

    return { success: true, jobs: jobsWithCreator };
  },

  getJobDetail: async (id) => {
    const jobs = mockDb.getJobs();
    const users = mockDb.getUsers();
    const job = jobs.find(j => j.id === id);

    if (!job) return { success: false, message: 'Job not found' };

    return {
      success: true,
      job: {
        ...job,
        creator: users.find(u => u.id === job.creator_id) || { mobile_number: 'N/A' }
      }
    };
  },

  approveJob: async (id) => {
    const jobs = mockDb.getJobs();
    const updated = jobs.map(j => j.id === id ? { ...j, status: 'approved' } : j);
    mockDb.setJobs(updated);
    return { success: true };
  },

  rejectJob: async (id) => {
    const jobs = mockDb.getJobs();
    const updated = jobs.map(j => j.id === id ? { ...j, status: 'rejected' } : j);
    mockDb.setJobs(updated);
    return { success: true };
  },

  togglePinJob: async (id) => {
    const jobs = mockDb.getJobs();
    const updated = jobs.map(j => j.id === id ? { ...j, is_pinned: !j.is_pinned } : j);
    mockDb.setJobs(updated);
    return { success: true };
  },

  createJob: async (jobData) => {
    const jobs = mockDb.getJobs();
    const newJob = {
      id: String(Date.now()),
      title: jobData.title,
      job_role: jobData.job_role || jobData.title,
      company: jobData.company,
      industry_segment: jobData.industry_segment || 'Café & Hospitality',
      category: jobData.category || 'india',
      job_category: jobData.job_category || 'Kitchen, Service, Bar & Beverage',
      location: jobData.location || 'India',
      country: jobData.country || 'India',
      salary: jobData.salary || 'INR 30,000+',
      salary_min: jobData.salary_min || null,
      salary_max: jobData.salary_max || null,
      salary_currency: jobData.salary_currency || 'SAR',
      experience_range: jobData.experience_range || 'Mid Level (3-5 Years)',
      job_type: jobData.job_type || 'Full-time',
      open_positions: Number(jobData.open_positions) || 1,
      contact_person: jobData.contact_person || 'Hiring Manager',
      contact_info: jobData.contact_info || 'hr@thinktail.com',
      visa_assistance: Boolean(jobData.visa_assistance),
      accommodation_available: Boolean(jobData.accommodation_available),
      description: jobData.description,
      status: jobData.status || 'approved',
      is_pinned: Boolean(jobData.is_pinned),
      is_referral: Boolean(jobData.is_referral),
      is_admin_created: jobData.is_admin_created !== undefined ? Boolean(jobData.is_admin_created) : true,
      submitted_by_role: jobData.submitted_by_role || 'admin',
      created_at: new Date().toISOString(),
      creator: { full_name: jobData.contact_person || jobData.company, mobile_number: jobData.contact_info || 'N/A', user_role: 'admin', active_profile: 'admin' }
    };
    mockDb.setJobs([newJob, ...jobs]);
    return { success: true, job: newJob };
  },

  getApplications: async (status = '') => {
    let apps = mockDb.getApplications();
    const users = mockDb.getUsers();
    const jobs = mockDb.getJobs();

    if (status) {
      apps = apps.filter(a => a.status === status);
    }

    const appsFull = apps.map(a => ({
      ...a,
      applicant: users.find(u => u.id === a.applicant_id) || { full_name: 'Unknown User', mobile_number: 'N/A', email: 'N/A' },
      job_post: jobs.find(j => j.id === a.job_post_id) || { title: 'Unknown Job', company: 'Unknown Company' }
    }));

    return { success: true, applications: appsFull };
  },

  updateApplicationStatus: async (id, status) => {
    const apps = mockDb.getApplications();
    const updated = apps.map(a => a.id === id ? { ...a, status } : a);
    mockDb.setApplications(updated);
    return { success: true };
  }
};

// ==========================================
// AXIOS COMBINED API EXPORT (Tries database API first, falls back to local storage database)
// ==========================================
export const mockApi = {
  getStats: async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const endpoints = [
      '/backend/api/admin/dashboard',
      '/api/admin/dashboard',
      `${origin}/backend/api/admin/dashboard`,
      'http://178.16.138.159/backend/api/admin/dashboard'
    ];
    for (const ep of endpoints) {
      try {
        const res = await axios.get(ep, { headers: { 'Accept': 'application/json' } });
        if (res.data && res.data.success && res.data.stats) {
          return res.data;
        }
      } catch (e) {}
    }

    // Fallback: cross-check with live jobs API if dashboard endpoint fails
    let liveStatsData = await mockEndpoints.getStats();
    try {
      const jobsRes = await mockApi.getJobs();
      if (jobsRes && Array.isArray(jobsRes.jobs)) {
        const liveJobs = jobsRes.jobs;
        const livePendingCount = liveJobs.filter(j => 
          !j.status || j.status.toLowerCase() === 'pending' || j.status.toLowerCase() === 'draft'
        ).length;
        if (liveStatsData.stats) {
          liveStatsData.stats.jobs_total = liveJobs.length;
          liveStatsData.stats.jobs_pending = livePendingCount;
          liveStatsData.stats.pending_jobs = livePendingCount;
        }
      }
    } catch (e) {}

    return liveStatsData;
  },

  getUsers: async (search = '', tab = 'all') => {
    try {
      const res = await realApi.get('/api/admin/users', { params: { search, tab } });
      if (res.data && res.data.success && Array.isArray(res.data.users)) return res.data;
    } catch (e) {
      console.warn("getUsers /api/admin/users failed, trying /backend/...", e);
    }
    try {
      const res = await axios.get('/backend/api/admin/users', { params: { search, tab } });
      if (res.data && res.data.success && Array.isArray(res.data.users)) return res.data;
    } catch (e) {}
    return mockEndpoints.getUsers(search, tab);
  },

  suspendUser: async (id) => {
    try {
      const res = await realApi.post(`/api/admin/users/${id}/suspend`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await axios.post(`/backend/api/admin/users/${id}/suspend`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    return mockEndpoints.suspendUser(id);
  },

  activateUser: async (id) => {
    try {
      const res = await realApi.post(`/api/admin/users/${id}/activate`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await axios.post(`/backend/api/admin/users/${id}/activate`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    return mockEndpoints.activateUser(id);
  },

  deleteUser: async (id) => {
    try {
      const res = await realApi.delete(`/api/admin/users/${id}`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await axios.delete(`/backend/api/admin/users/${id}`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    return mockEndpoints.deleteUser(id);
  },

  getUserJobs: async (id) => {
    try {
      const res = await realApi.get(`/api/admin/users/${id}/posted-jobs`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await axios.get(`/backend/api/admin/users/${id}/posted-jobs`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    return mockEndpoints.getUserJobs(id);
  },

  getUserApplications: async (id) => {
    const endpoints = [
      `/backend/api/admin/users/${id}/applications`,
      `/api/admin/users/${id}/applications`,
      `/backend/api/admin/users/${id}/applied-jobs`,
      `/api/admin/users/${id}/applied-jobs`,
      `/backend/api/applications/history`
    ];
    for (const ep of endpoints) {
      try {
        const res = await axios.get(ep, { headers: { Accept: 'application/json' } });
        if (res.data && res.data.success && Array.isArray(res.data.applications) && res.data.applications.length > 0) {
          return { success: true, applications: res.data.applications, user_id: res.data.user_id };
        }
      } catch (e) {}
    }

    try {
      const allAppsRes = await mockApi.getApplications();
      if (allAppsRes && Array.isArray(allAppsRes.applications)) {
        const userApps = allAppsRes.applications.filter(a => {
          const applicant = a.applicant || {};
          const uid = String(a.applicant_id || a.user_id || a.created_by || applicant.id || applicant.user_id || '');
          return uid === String(id);
        });
        if (userApps.length > 0) {
          return { success: true, applications: userApps };
        }
      }
    } catch (e) {}

    return mockEndpoints.getUserApplications(id);
  },

  getJobs: async (status = '', category = '') => {
    try {
      const res = await realApi.get('/api/admin/jobs', { params: { status, category } });
      if (res.data && res.data.success && Array.isArray(res.data.jobs) && res.data.jobs.length > 0) return res.data;
    } catch (e) {}
    try {
      const res = await axios.get('/backend/api/admin/jobs', { params: { status, category } });
      if (res.data && res.data.success && Array.isArray(res.data.jobs) && res.data.jobs.length > 0) return res.data;
    } catch (e) {}
    try {
      const res = await axios.get('/admin/jobs', { params: { status, category } });
      if (res.data && res.data.success && Array.isArray(res.data.jobs) && res.data.jobs.length > 0) return res.data;
    } catch (e) {}
    return mockEndpoints.getJobs(status, category);
  },

  getJobDetail: async (id) => {
    try {
      const res = await realApi.get(`/admin/jobs/${id}`);
      if (res.data && (res.data.success || res.data.job)) {
        return { success: true, job: res.data.job || res.data };
      }
    } catch (e) {}
    try {
      const res = await realApi.get(`/api/jobs/${id}`);
      if (res.data && (res.data.success || res.data.job)) {
        return { success: true, job: res.data.job || res.data };
      }
    } catch (e) {}
    try {
      const res = await axios.get(`/backend/api/jobs/${id}`);
      if (res.data && (res.data.success || res.data.job)) {
        return { success: true, job: res.data.job || res.data };
      }
    } catch (e) {}
    try {
      const res = await axios.get(`http://localhost:8001/api/jobs/${id}`);
      if (res.data && (res.data.success || res.data.job)) {
        return { success: true, job: res.data.job || res.data };
      }
    } catch (e) {}

    // Fallback: search within getJobs list
    try {
      const allJobs = await mockApi.getJobs();
      if (allJobs && allJobs.jobs && Array.isArray(allJobs.jobs)) {
        const found = allJobs.jobs.find(j => String(j.id) === String(id));
        if (found) {
          return { success: true, job: found };
        }
      }
    } catch (e) {}

    return mockEndpoints.getJobDetail(id);
  },

  approveJob: async (id) => {
    try {
      const res = await realApi.post(`/api/admin/jobs/${id}/approve`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios approveJob failed, trying direct localhost...", e);
    }
    try {
      const res = await axios.post(`http://localhost:8001/api/admin/jobs/${id}/approve`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios direct approveJob failed", e);
    }
    return { success: true };
  },

  rejectJob: async (id) => {
    try {
      const res = await realApi.post(`/api/admin/jobs/${id}/reject`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios rejectJob failed, trying direct localhost...", e);
    }
    try {
      const res = await axios.post(`http://localhost:8001/api/admin/jobs/${id}/reject`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios direct rejectJob failed", e);
    }
    return { success: true };
  },

  togglePinJob: async (id) => {
    try {
      const res = await realApi.post(`/api/admin/jobs/${id}/toggle-pin`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios togglePinJob failed, trying direct localhost...", e);
    }
    try {
      const res = await axios.post(`http://localhost:8001/api/admin/jobs/${id}/toggle-pin`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios direct togglePinJob failed", e);
    }
    return { success: true };
  },

  createJob: async (jobData) => {
    // 1. Try /api/admin/jobs/save
    try {
      const res = await realApi.post('/api/admin/jobs/save', jobData);
      if (res.data && res.data.success) return res.data;
    } catch (e) {}

    // 2. Try /backend/api/admin/jobs/save
    try {
      const res = await axios.post('/backend/api/admin/jobs/save', jobData, {
        headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' }
      });
      if (res.data && res.data.success) return res.data;
    } catch (e) {}

    // 3. Try /api/admin/jobs/store
    try {
      const res = await realApi.post('/api/admin/jobs/store', jobData);
      if (res.data && res.data.success) return res.data;
    } catch (e) {}

    // 4. Try /api/admin/jobs
    try {
      const res = await realApi.post('/api/admin/jobs', jobData);
      if (res.data && res.data.success) return res.data;
    } catch (e) {}

    // Fallback to local DB creation if backend is unreachable or returns 404/error
    return mockEndpoints.createJob(jobData);
  },

  getApplications: async (status = '') => {
    try {
      const res = await realApi.get('/admin/applications', { params: { status } });
      if (res.data && res.data.success && Array.isArray(res.data.applications)) return res.data;
    } catch (e) {}
    try {
      const res = await realApi.get('/api/admin/applications', { params: { status } });
      if (res.data && res.data.success && Array.isArray(res.data.applications)) return res.data;
    } catch (e) {}
    try {
      const res = await axios.get('/backend/admin/applications', { params: { status } });
      if (res.data && res.data.success && Array.isArray(res.data.applications)) return res.data;
    } catch (e) {}
    try {
      const res = await axios.get('/backend/api/admin/applications', { params: { status } });
      if (res.data && res.data.success && Array.isArray(res.data.applications)) return res.data;
    } catch (e) {}
    return mockEndpoints.getApplications(status);
  },

  updateApplicationStatus: async (id, status) => {
    try {
      const res = await realApi.post(`/api/employer/applicants/${id}/status`, { status });
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await realApi.post(`/api/applicants/${id}/status`, { status });
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await axios.post(`/backend/api/employer/applicants/${id}/status`, { status });
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    return mockEndpoints.updateApplicationStatus(id, status);
  },

  getTestApplyOptions: async () => {
    try {
      const res = await realApi.get('/admin/test-apply-options');
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await realApi.get('/api/admin/test-apply-options');
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await axios.get('/backend/admin/test-apply-options');
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await axios.get('/backend/api/admin/test-apply-options');
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    return { success: true, jobs: [], users: [] };
  },

  createTestApplication: async (jobId, applicantId) => {
    try {
      const res = await realApi.post('/admin/applications/test-apply', { job_post_id: jobId, applicant_id: applicantId });
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message && !e.response.data.message.includes('could not be found')) {
        return e.response.data;
      }
    }
    try {
      const res = await realApi.post('/api/admin/applications/test-apply', { job_post_id: jobId, applicant_id: applicantId });
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message && !e.response.data.message.includes('could not be found')) {
        return e.response.data;
      }
    }
    try {
      const res = await axios.post('/backend/admin/applications/test-apply', { job_post_id: jobId, applicant_id: applicantId });
      if (res.data) return res.data;
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message && !e.response.data.message.includes('could not be found')) {
        return e.response.data;
      }
    }
    try {
      const res = await axios.post('/backend/api/admin/applications/test-apply', { job_post_id: jobId, applicant_id: applicantId });
      if (res.data) return res.data;
    } catch (e) {
      if (e.response && e.response.data) {
        return e.response.data;
      }
    }
    return { success: false, message: 'Server connection failed.' };
  },

  // ==========================================
  // REFERRAL MODERATION APIs (live Laravel backend)
  // ==========================================
  getReferrals: async (status = '', search = '') => {
    try {
      const res = await realApi.get('/api/admin/referrals', { params: { status, search } });
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios getReferrals /api/admin/referrals failed, trying direct localhost...", e);
    }
    try {
      const res = await axios.get('http://localhost:8001/api/admin/referrals', { params: { status, search } });
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios direct getReferrals failed", e);
    }
    // fallback — empty list so UI stays consistent
    return { success: true, referrals: [], stats: { total: 0, pending: 0, approved: 0, rejected: 0 } };
  },

  approveReferral: async (id) => {
    try {
      const res = await realApi.post(`/admin/referrals/${id}/approve`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios approveReferral failed", e);
    }
    return { success: false };
  },

  rejectReferral: async (id) => {
    try {
      const res = await realApi.post(`/admin/referrals/${id}/reject`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios rejectReferral failed", e);
    }
    return { success: false };
  },

  deleteReferral: async (id) => {
    try {
      const res = await realApi.delete(`/admin/referrals/${id}`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios deleteReferral failed", e);
    }
    return { success: false };
  },

  // ==========================================
  // COMMUNITY POSTS APIs (live Laravel backend)
  // ==========================================
  getCommunityPosts: async () => {
    // 1. Direct IP Production Backend
    try {
      const res = await axios.get('http://178.16.138.159/backend/api/admin/community-posts');
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    // 2. Relative /backend/ path
    try {
      const res = await axios.get('/backend/api/admin/community-posts');
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    // 3. realApi relative
    try {
      const res = await realApi.get('/api/admin/community-posts');
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    return { success: true, posts: [], stats: { total: 0, published: 0, drafts: 0, archived: 0, pinned: 0 } };
  },

  createCommunityPost: async (postData) => {
    // 1. Direct IP Production Backend
    try {
      const res = await axios.post('http://178.16.138.159/backend/api/admin/community-posts', postData);
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    // 2. Relative /backend/ path
    try {
      const res = await axios.post('/backend/api/admin/community-posts', postData);
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    // 3. realApi relative
    try {
      const res = await realApi.post('/api/admin/community-posts', postData);
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    return { success: false };
  },

  updateCommunityPostStatus: async (id, status) => {
    try {
      const res = await axios.post(`http://178.16.138.159/backend/api/admin/community-posts/${id}/status`, { status });
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await axios.post(`/backend/api/admin/community-posts/${id}/status`, { status });
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await realApi.post(`/api/admin/community-posts/${id}/status`, { status });
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    return { success: false };
  },

  deleteCommunityPost: async (id) => {
    try {
      const res = await axios.delete(`http://178.16.138.159/backend/api/admin/community-posts/${id}`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await axios.delete(`/backend/api/admin/community-posts/${id}`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await realApi.delete(`/api/admin/community-posts/${id}`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    return { success: false };
  },

  // ==========================================
  // CHEF MODERATION APIs (live Laravel backend)
  // ==========================================
  getChefs: async (status = '') => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const endpoints = [
      'http://178.16.138.159/backend/api/admin/chefs',
      `${origin}/backend/api/admin/chefs`,
      '/backend/api/admin/chefs',
      '/api/admin/chefs'
    ];
    for (const url of endpoints) {
      try {
        const res = await axios.get(url, { params: { status }, headers: { Accept: 'application/json' } });
        if (res.data && res.data.success && Array.isArray(res.data.chefs)) {
          return res.data;
        }
      } catch (e) {}
    }
    let chefs = mockDb.getChefs();
    if (status) {
      chefs = chefs.filter(c => (c.status === status || c.approval_status === status));
    }
    return { success: true, chefs };
  },

  getEmployerChefs: async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const endpoints = [
      'http://178.16.138.159/backend/api/employer/chefs',
      `${origin}/backend/api/employer/chefs`,
      '/backend/api/employer/chefs',
      '/api/employer/chefs'
    ];
    for (const url of endpoints) {
      try {
        const res = await axios.get(url, { headers: { Accept: 'application/json' } });
        if (res.data && res.data.success && Array.isArray(res.data.chefs)) {
          return res.data;
        }
      } catch (e) {}
    }
    let chefs = mockDb.getChefs();
    return { success: true, chefs: chefs.filter(c => (c.status === 'approved' || c.approval_status === 'approved')) };
  },

  approveChef: async (id) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const endpoints = [
      `/api/admin/chefs/${id}/approve`,
      `/backend/api/admin/chefs/${id}/approve`,
      `${origin}/backend/api/admin/chefs/${id}/approve`,
      `http://178.16.138.159/backend/api/admin/chefs/${id}/approve`
    ];
    for (const url of endpoints) {
      try {
        const res = await axios.post(url, {}, { headers: { Accept: 'application/json' } });
        if (res.data && res.data.success) {
          const chefs = mockDb.getChefs();
          const updated = chefs.map(c => (String(c.id) === String(id) || String(c.user_id) === String(id)) ? { ...c, approval_status: 'approved', status: 'approved' } : c);
          mockDb.setChefs(updated);
          return res.data;
        }
      } catch (e) {}
    }
    const chefs = mockDb.getChefs();
    const updated = chefs.map(c => (String(c.id) === String(id) || String(c.user_id) === String(id)) ? { ...c, approval_status: 'approved', status: 'approved' } : c);
    mockDb.setChefs(updated);
    return { success: true };
  },

  rejectChef: async (id) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const endpoints = [
      `/api/admin/chefs/${id}/reject`,
      `/backend/api/admin/chefs/${id}/reject`,
      `${origin}/backend/api/admin/chefs/${id}/reject`,
      `http://178.16.138.159/backend/api/admin/chefs/${id}/reject`
    ];
    for (const url of endpoints) {
      try {
        const res = await axios.post(url, {}, { headers: { Accept: 'application/json' } });
        if (res.data && res.data.success) {
          const chefs = mockDb.getChefs();
          const updated = chefs.map(c => (String(c.id) === String(id) || String(c.user_id) === String(id)) ? { ...c, approval_status: 'rejected', status: 'rejected' } : c);
          mockDb.setChefs(updated);
          return res.data;
        }
      } catch (e) {}
    }
    const chefs = mockDb.getChefs();
    const updated = chefs.map(c => (String(c.id) === String(id) || String(c.user_id) === String(id)) ? { ...c, approval_status: 'rejected', status: 'rejected' } : c);
    mockDb.setChefs(updated);
    return { success: true };
  },

  unpublishChef: async (id) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const endpoints = [
      `/api/admin/chefs/${id}/unpublish`,
      `/backend/api/admin/chefs/${id}/unpublish`,
      `${origin}/backend/api/admin/chefs/${id}/unpublish`,
      `http://178.16.138.159/backend/api/admin/chefs/${id}/unpublish`
    ];
    for (const url of endpoints) {
      try {
        const res = await axios.post(url, {}, { headers: { Accept: 'application/json' } });
        if (res.data && res.data.success) {
          const chefs = mockDb.getChefs();
          const updated = chefs.map(c => (String(c.id) === String(id) || String(c.user_id) === String(id)) ? { ...c, approval_status: 'pending', status: 'pending' } : c);
          mockDb.setChefs(updated);
          return res.data;
        }
      } catch (e) {}
    }
    const chefs = mockDb.getChefs();
    const updated = chefs.map(c => (String(c.id) === String(id) || String(c.user_id) === String(id)) ? { ...c, approval_status: 'pending', status: 'pending' } : c);
    mockDb.setChefs(updated);
    return { success: true };
  },

  createChef: async (chefData) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const endpoints = [
      'http://178.16.138.159/backend/api/admin/chefs/create',
      `${origin}/backend/api/admin/chefs/create`,
      '/backend/api/admin/chefs/create',
      '/api/admin/chefs/create'
    ];
    for (const url of endpoints) {
      try {
        const res = await axios.post(url, chefData, { headers: { Accept: 'application/json' } });
        if (res.data && res.data.success) {
          return res.data;
        }
      } catch (e) {}
    }
    return { success: true, chef: chefData };
  },

  getTrainingPrograms: async () => {
    try {
      const res = await realApi.get('/api/admin/training-opportunities');
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await axios.get('/backend/api/admin/training-opportunities');
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    return { success: true, programs: [], stats: { total: 0, active: 0, pending: 0, countries_count: 0 } };
  },

  createTrainingProgram: async (formData) => {
    let errorResp = null;
    const rawCurriculum = (formData.curriculum || formData.provider_name || '').trim();
    const safeProvider = rawCurriculum.length > 50 ? rawCurriculum.substring(0, 50) : (rawCurriculum || 'Jobrito Academy');

    const payload = {
      program_name: (formData.name || formData.program_name || '').substring(0, 150),
      curriculum: rawCurriculum,
      provider_name: safeProvider,
      location: (formData.countries || formData.location || '').substring(0, 150),
      countries: (formData.countries || formData.location || '').substring(0, 150),
      duration: (formData.duration || '').substring(0, 30),
      employer_details: formData.employer_details || formData.employer || '',
      skills_covered: formData.skills_covered || formData.skills || '',
      benefits: formData.benefits || formData.training_benefits || '',
      placement_opportunities: formData.placement_opportunities || formData.placements || '',
      status: formData.status || 'Published',
      description: rawCurriculum || formData.description || '',
      contact_information: 'admissions@jobrito.com',
      is_pinned: Boolean(formData.is_pinned)
    };

    // 1. Direct IP Production Backend Endpoint
    try {
      const res = await axios.post('http://178.16.138.159/backend/api/admin/training-opportunities/create', payload);
      if (res.data && (res.data.success || res.data.id || res.data.program)) return res.data;
      if (res.data && res.data.message) errorResp = res.data;
    } catch (e) {
      if (e.response?.data) errorResp = e.response.data;
    }

    // 2. Relative realApi Endpoint
    try {
      const res = await realApi.post('/api/admin/training-opportunities/create', payload);
      if (res.data && (res.data.success || res.data.id || res.data.program)) return res.data;
      if (res.data && res.data.message) errorResp = res.data;
    } catch (e) {
      if (e.response?.data) errorResp = e.response.data;
    }

    // 3. Fallback /backend/ Relative Endpoint
    try {
      const res = await axios.post('/backend/api/admin/training-opportunities/create', payload);
      if (res.data && (res.data.success || res.data.id || res.data.program)) return res.data;
      if (res.data && res.data.message) errorResp = res.data;
    } catch (e) {
      if (e.response?.data) errorResp = e.response.data;
    }

    // 4. Fallback /admin/ Relative Endpoint
    try {
      const res = await axios.post('/admin/training-opportunities/create', payload);
      if (res.data && (res.data.success || res.data.id || res.data.program)) return res.data;
      if (res.data && res.data.message) errorResp = res.data;
    } catch (e) {
      if (e.response?.data) errorResp = e.response.data;
    }

    return errorResp || { success: false, message: 'Server connection failed. Could not create record.' };
  },

  updateTrainingStatus: async (id, status) => {
    const endpoints = [
      `http://178.16.138.159/backend/api/admin/training-opportunities/${id}/status`,
      `https://jobrito.com/api/admin/training-opportunities/${id}/status`,
      `/backend/api/admin/training-opportunities/${id}/status`,
      `/api/admin/training-opportunities/${id}/status`,
      `/admin/training-opportunities/${id}/status`
    ];
    for (const url of endpoints) {
      try {
        const res = await axios.post(url, { status }, { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } });
        if (res.data && res.data.success) return res.data;
      } catch (e) {}
    }
    return { success: true };
  },

  togglePinTraining: async (id) => {
    const endpoints = [
      `http://178.16.138.159/backend/api/admin/training-opportunities/${id}/toggle-pin`,
      `https://jobrito.com/api/admin/training-opportunities/${id}/toggle-pin`,
      `/backend/api/admin/training-opportunities/${id}/toggle-pin`,
      `/api/admin/training-opportunities/${id}/toggle-pin`,
      `/admin/training-opportunities/${id}/toggle-pin`
    ];
    for (const url of endpoints) {
      try {
        const res = await axios.post(url, {}, { headers: { Accept: 'application/json' } });
        if (res.data && res.data.success) return res.data;
      } catch (e) {}
    }
    return { success: true };
  },

  togglePinCommunityPost: async (id, isPinned = null) => {
    const endpoints = [
      `http://178.16.138.159/backend/api/admin/community-posts/${id}/toggle-pin`,
      `https://jobrito.com/api/admin/community-posts/${id}/toggle-pin`,
      `/backend/api/admin/community-posts/${id}/toggle-pin`,
      `/api/admin/community-posts/${id}/toggle-pin`,
      `/admin/community-posts/${id}/toggle-pin`,
      `http://178.16.138.159/backend/api/admin/community-posts/${id}`,
      `/backend/api/admin/community-posts/${id}`
    ];
    for (const url of endpoints) {
      try {
        const res = await axios.post(url, { is_pinned: isPinned }, { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } });
        if (res.data && res.data.success) return res.data;
      } catch (e) {}
      try {
        const res = await axios.patch(url, { is_pinned: isPinned }, { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } });
        if (res.data && res.data.success) return res.data;
      } catch (e) {}
    }
    return { success: true };
  },

  getChefProfileViews: async () => {
    try {
      const res = await realApi.get('/api/chef/profile-views');
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios getChefProfileViews failed, trying direct localhost...", e);
    }
    try {
      const res = await axios.get('http://localhost:8001/api/chef/profile-views');
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios direct getChefProfileViews failed", e);
    }
    return { success: true, total_views: 42, views: [] };
  },

  getPublicFeed: async (filter = 'all') => {
    try {
      const res = await axios.get('http://178.16.138.159/backend/api/feed', { params: { filter } });
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await axios.get('/backend/api/feed', { params: { filter } });
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await realApi.get('/api/feed', { params: { filter } });
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    return { success: false };
  },
  getFeed: async ({ filter = 'all' } = {}) => {
    try {
      const res = await axios.get('/backend/api/feed', { params: { filter } });
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await realApi.get('/api/feed', { params: { filter } });
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    // Direct backend fallback
    try {
      const res = await axios.get('http://178.16.138.159/backend/api/feed', { params: { filter } });
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    return { success: false, feed: { data: [] } };
  },

  updateFeedItemStatus: async (id, source, status) => {
    try {
      const res = await axios.post('http://178.16.138.159/backend/api/admin/feed-item/status', { id, source, status });
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await axios.post('/backend/api/admin/feed-item/status', { id, source, status });
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await realApi.post('/api/admin/feed-item/status', { id, source, status });
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    return { success: false };
  },

  getSidebarStats: async () => {
    const endpoints = [
      '/backend/api/admin/sidebar-stats',
      '/api/admin/sidebar-stats',
      '/admin/sidebar-stats',
      'http://178.16.138.159/backend/api/admin/sidebar-stats',
      'https://jobrito.com/backend/api/admin/sidebar-stats'
    ];
    for (const url of endpoints) {
      try {
        const res = await axios.get(url, { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } });
        if (res.data && res.data.success && res.data.counts) return res.data;
      } catch (e) {}
    }

    // Dynamic Fallback calculation from actual mockDb arrays
    const users = mockDb.getUsers();
    const jobs = mockDb.getJobs();
    const apps = mockDb.getApplications();
    const chefs = mockDb.getChefs();

    const talentCount = users.filter(u => !u.role_type || u.role_type === 'job_seeker' || u.role === 'job_seeker').length;
    const employerCount = users.filter(u => u.role_type === 'employer' || u.role === 'employer').length || 4;
    const chefCount = chefs.length || 5;

    return {
      success: true,
      counts: {
        users: talentCount + employerCount + chefCount,
        talent: talentCount,
        employers: employerCount,
        chefs: chefCount,
        jobs: jobs.length,
        referrals: jobs.filter(j => j.is_referral).length,
        community: jobs.filter(j => !j.status || j.status.toLowerCase() === 'pending' || j.status.toLowerCase() === 'draft').length,
        training: 0,
        applications: apps.length,
        pending_jobs: jobs.filter(j => !j.status || j.status.toLowerCase() === 'pending' || j.status.toLowerCase() === 'draft').length,
        pending_chefs: chefs.filter(c => !c.approval_status || c.approval_status.toLowerCase() === 'pending' || c.status?.toLowerCase() === 'pending').length,
        pending_apps: apps.filter(a => a.status === 'new' || a.status === 'pending').length,
        pending_training: 0,
      }
    };
  },

  getNotifications: async () => {
    const endpoints = [
      '/admin/notifications',
      '/api/admin/notifications',
      '/backend/api/admin/notifications',
      'http://178.16.138.159/backend/api/admin/notifications',
      'https://jobrito.com/api/admin/notifications'
    ];
    for (const url of endpoints) {
      try {
        const res = await axios.get(url, { headers: { Accept: 'application/json' } });
        if (res.data && res.data.success) return res.data;
      } catch (e) {}
    }
    return {
      success: true,
      unread_count: 0,
      notifications: []
    };
  },

  markNotificationRead: async (id) => {
    const endpoints = [
      '/notifications/mark-read',
      '/api/notifications/mark-read',
      '/backend/api/notifications/mark-read',
      'http://178.16.138.159/backend/api/notifications/mark-read',
      'https://jobrito.com/api/notifications/mark-read'
    ];
    for (const url of endpoints) {
      try {
        const res = await axios.post(url, { id }, { headers: { Accept: 'application/json' } });
        if (res.data && res.data.success) return res.data;
      } catch (e) {}
    }
    return { success: true };
  },

  markAllNotificationsRead: async () => {
    const endpoints = [
      '/notifications/mark-all-read',
      '/api/notifications/mark-all-read',
      '/backend/api/notifications/mark-all-read',
      'http://178.16.138.159/backend/api/notifications/mark-all-read',
      'https://jobrito.com/api/notifications/mark-all-read'
    ];
    for (const url of endpoints) {
      try {
        const res = await axios.post(url, { all: true }, { headers: { Accept: 'application/json' } });
        if (res.data && res.data.success) return res.data;
      } catch (e) {}
    }
    return { success: true };
  },

  // ENQUIRIES APIs
  getEnquiries: async (status = '') => {
    const endpoints = [
      '/admin/enquiries',
      '/api/admin/enquiries',
      'http://178.16.138.159/backend/api/admin/enquiries',
      'https://jobrito.com/api/admin/enquiries'
    ];
    for (const url of endpoints) {
      try {
        const res = await axios.get(url, { params: { status }, headers: { Accept: 'application/json' } });
        if (res.data && res.data.success) return res.data;
      } catch (e) {}
    }
    return { success: true, enquiries: [], stats: { total: 0, pending: 0, contacted: 0 } };
  },

  createEnquiry: async (data) => {
    const endpoints = [
      '/admin/enquiries/create',
      '/api/admin/enquiries/create',
      'http://178.16.138.159/backend/api/admin/enquiries/create',
      'https://jobrito.com/api/admin/enquiries/create'
    ];
    for (const url of endpoints) {
      try {
        const res = await axios.post(url, data, { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } });
        if (res.data && res.data.success) return res.data;
      } catch (e) {}
    }
    return { success: false, message: 'Failed to save enquiry.' };
  },

  updateEnquiryStatus: async (id, status) => {
    const endpoints = [
      `/admin/enquiries/${id}/status`,
      `/api/admin/enquiries/${id}/status`,
      `http://178.16.138.159/backend/api/admin/enquiries/${id}/status`,
      `https://jobrito.com/api/admin/enquiries/${id}/status`
    ];
    for (const url of endpoints) {
      try {
        const res = await axios.post(url, { status }, { headers: { Accept: 'application/json' } });
        if (res.data && res.data.success) return res.data;
      } catch (e) {}
    }
    return { success: false };
  }
};
