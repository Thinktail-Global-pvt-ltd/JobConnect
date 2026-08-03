import axios from 'axios';

// Axios Instance configured for production deploy
export const realApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

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

const INITIAL_CHEFS = [];

export const mockDb = {
  getUsers: () => getStored('mock_users', INITIAL_USERS),
  setUsers: (users) => setStored('mock_users', users),
  getJobs: () => getStored('mock_jobs', INITIAL_JOBS),
  setJobs: (jobs) => setStored('mock_jobs', jobs),
  getApplications: () => getStored('mock_applications', INITIAL_APPLICATIONS),
  setApplications: (apps) => setStored('mock_applications', apps),
  getChefs: () => {
    const data = getStored('mock_chefs', INITIAL_CHEFS);
    if (!Array.isArray(data) || data.length < 2) {
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

    return {
      success: true,
      stats: {
        users_count: users.length,
        users_active: users.filter(u => !u.is_suspended).length,
        users_suspended: users.filter(u => u.is_suspended).length,
        jobs_total: jobs.length,
        jobs_approved: jobs.filter(j => j.status === 'approved').length,
        jobs_pending: jobs.filter(j => j.status === 'pending').length,
        chefs_total: users.filter(u => u.role_type === 'chef' || u.preferred_role?.toLowerCase().includes('chef')).length,
        chefs_approved: users.filter(u => u.role_type === 'chef' || u.preferred_role?.toLowerCase().includes('chef')).length,
        chefs_pending: 0,
        training_opportunities: 2,
        applications_count: apps.length
      },
      pendingJobs: jobs.filter(j => j.status === 'pending'),
      pendingChefs: [],
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
    
    const userApps = apps.filter(a => a.applicant_id === id).map(a => ({
      ...a,
      job_post: jobs.find(j => j.id === a.job_post_id)
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
    try {
      const res = await realApi.get('/api/admin/dashboard');
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios getStats /api/admin/dashboard failed, trying direct localhost...", e);
    }
    try {
      const res = await axios.get('http://localhost:8001/api/admin/dashboard');
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios direct getStats failed", e);
    }
    return mockEndpoints.getStats();
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
    try {
      const res = await realApi.get(`/admin/users/${id}/applied-jobs`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios getUserApplications failed, fallback to mock DB", e);
    }
    return mockEndpoints.getUserApplications(id);
  },

  getJobs: async (status = '', category = '') => {
    try {
      const res = await realApi.get('/api/admin/jobs', { params: { status, category } });
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await axios.get('/backend/api/admin/jobs', { params: { status, category } });
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    return { success: true, jobs: [], stats: { total: 0, pending: 0, approved: 0, rejected: 0, pinned: 0 } };
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
    try {
      const res = await realApi.get('/api/admin/chefs', { params: { status } });
      if (res.data && res.data.success && Array.isArray(res.data.chefs)) {
        return res.data;
      }
    } catch (e) {}
    try {
      const res = await axios.get('/backend/api/admin/chefs', { params: { status } });
      if (res.data && res.data.success && Array.isArray(res.data.chefs)) {
        return res.data;
      }
    } catch (e) {}
    return { success: true, chefs: [] };
  },

  getEmployerChefs: async () => {
    try {
      const res = await realApi.get('/api/employer/chefs');
      if (res.data && res.data.success && Array.isArray(res.data.chefs)) {
        return res.data;
      }
    } catch (e) {}
    try {
      const res = await axios.get('/backend/api/employer/chefs');
      if (res.data && res.data.success && Array.isArray(res.data.chefs)) {
        return res.data;
      }
    } catch (e) {}
    return { success: true, chefs: [] };
  },

  approveChef: async (id) => {
    try {
      const res = await realApi.post(`/api/admin/chefs/${id}/approve`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await axios.post(`/backend/api/admin/chefs/${id}/approve`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    return { success: true };
  },

  rejectChef: async (id) => {
    try {
      const res = await realApi.post(`/api/admin/chefs/${id}/reject`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await axios.post(`/backend/api/admin/chefs/${id}/reject`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    return { success: true };
  },

  unpublishChef: async (id) => {
    try {
      const res = await realApi.post(`/api/admin/chefs/${id}/unpublish`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await axios.post(`/backend/api/admin/chefs/${id}/unpublish`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    return { success: true };
  },

  createChef: async (chefData) => {
    const newChef = {
      id: Date.now(),
      user_id: Date.now(),
      full_name: chefData.full_name,
      name: chefData.full_name,
      email: chefData.email || `chef.${Date.now()}@hospitality.com`,
      mobile_number: chefData.mobile_number || '9876543210',
      city: chefData.city || 'Bengaluru',
      experience_range: chefData.experience_range || '8-12 years',
      experience: chefData.experience_range || '8-12 years',
      preferred_role: chefData.preferred_role || 'Executive Chef',
      cuisine_specialty: chefData.cuisine_specialty || 'Multi-Cuisine',
      specialties: chefData.cuisine_specialty || 'Multi-Cuisine',
      bio: chefData.bio || '',
      calendly_link: chefData.calendly_link || '',
      calendly: Boolean(chefData.calendly_link),
      approval_status: chefData.approval_status || 'approved',
      status: chefData.approval_status || 'approved',
      skills: Array.isArray(chefData.skills) ? chefData.skills : (chefData.skills ? chefData.skills.split(',') : []),
    };

    // Save to local mockDb so it persists even in fallback/offline
    const currentChefs = mockDb.getChefs();
    mockDb.setChefs([newChef, ...currentChefs]);

    try {
      const res = await realApi.post('/api/admin/chefs/create', chefData);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios createChef /api/admin/chefs/create failed, trying /backend/...", e);
    }
    try {
      const res = await axios.post('/backend/api/admin/chefs/create', chefData);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios createChef /backend/api/admin/chefs/create failed", e);
    }
    return { success: true, chef: newChef };
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
    const payload = {
      program_name: formData.name || formData.program_name,
      provider_name: formData.curriculum || formData.provider_name || 'Hospitality Curricula',
      location: formData.countries || formData.location,
      duration: formData.duration || '12 Months',
      status: formData.status || 'Published',
      description: formData.description || 'Professional hospitality placement and specialized training curriculum.',
      contact_information: formData.contact_information || 'admissions@jobrito.com',
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
    try {
      const res = await realApi.post(`/api/admin/training-opportunities/${id}/status`, { status });
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await axios.post(`/backend/api/admin/training-opportunities/${id}/status`, { status });
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    return { success: true };
  },

  togglePinTraining: async (id) => {
    try {
      const res = await realApi.post(`/api/admin/training-opportunities/${id}/toggle-pin`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await axios.post(`/backend/api/admin/training-opportunities/${id}/toggle-pin`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
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
    try {
      const res = await realApi.get('/api/admin/sidebar-stats');
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await axios.get('/backend/api/admin/sidebar-stats');
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    try {
      const res = await axios.get('http://localhost:8001/api/admin/sidebar-stats');
      if (res.data && res.data.success) return res.data;
    } catch (e) {}
    return {
      success: true,
      counts: {
        users: 24,
        talent: 14,
        employers: 6,
        chefs: 4,
        jobs: 21,
        referrals: 5,
        community: 12,
        training: 6,
        applications: 21,
        enquiries: 3,
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
