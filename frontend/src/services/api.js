import axios from 'axios';

// Axios Instance configured for production deploy
export const realApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/backend',
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

const getStored = (key, fallback) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  return JSON.parse(data);
};

const setStored = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const mockDb = {
  getUsers: () => getStored('mock_users', INITIAL_USERS),
  setUsers: (users) => setStored('mock_users', users),
  getJobs: () => getStored('mock_jobs', INITIAL_JOBS),
  setJobs: (jobs) => setStored('mock_jobs', jobs),
  getApplications: () => getStored('mock_applications', INITIAL_APPLICATIONS),
  setApplications: (apps) => setStored('mock_applications', apps),
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
      const res = await realApi.get('/admin/dashboard');
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios getStats failed, fallback to mock DB", e);
    }
    return mockEndpoints.getStats();
  },

  getUsers: async (search = '', tab = 'all') => {
    try {
      const res = await realApi.get('/admin/users', { params: { search, tab } });
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios getUsers failed, fallback to mock DB", e);
    }
    return mockEndpoints.getUsers(search, tab);
  },

  suspendUser: async (id) => {
    try {
      const res = await realApi.post(`/admin/users/${id}/suspend`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios suspendUser failed, fallback to mock DB", e);
    }
    return mockEndpoints.suspendUser(id);
  },

  activateUser: async (id) => {
    try {
      const res = await realApi.post(`/admin/users/${id}/activate`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios activateUser failed, fallback to mock DB", e);
    }
    return mockEndpoints.activateUser(id);
  },

  deleteUser: async (id) => {
    try {
      const res = await realApi.delete(`/admin/users/${id}`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios deleteUser failed, fallback to mock DB", e);
    }
    return mockEndpoints.deleteUser(id);
  },

  getUserJobs: async (id) => {
    try {
      const res = await realApi.get(`/admin/users/${id}/posted-jobs`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios getUserJobs failed, fallback to mock DB", e);
    }
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
      const res = await realApi.get('/admin/jobs', { params: { status, category } });
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios getJobs failed, fallback to mock DB", e);
    }
    return mockEndpoints.getJobs(status, category);
  },

  getJobDetail: async (id) => {
    try {
      const res = await realApi.get(`/admin/jobs/${id}`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios getJobDetail failed, fallback to mock DB", e);
    }
    return mockEndpoints.getJobDetail(id);
  },

  approveJob: async (id) => {
    try {
      const res = await realApi.post(`/admin/jobs/${id}/approve`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios approveJob failed, fallback to mock DB", e);
    }
    return mockEndpoints.approveJob(id);
  },

  rejectJob: async (id) => {
    try {
      const res = await realApi.post(`/admin/jobs/${id}/reject`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios rejectJob failed, fallback to mock DB", e);
    }
    return mockEndpoints.rejectJob(id);
  },

  togglePinJob: async (id) => {
    try {
      const res = await realApi.post(`/admin/jobs/${id}/toggle-pin`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios togglePinJob failed, fallback to mock DB", e);
    }
    return mockEndpoints.togglePinJob(id);
  },

  getApplications: async (status = '') => {
    try {
      const res = await realApi.get('/admin/applications', { params: { status } });
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios getApplications failed, fallback to mock DB", e);
    }
    return mockEndpoints.getApplications(status);
  },

  updateApplicationStatus: async (id, status) => {
    try {
      const res = await realApi.post(`/admin/applications/${id}/status`, { status });
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios updateApplicationStatus failed, fallback to mock DB", e);
    }
    return mockEndpoints.updateApplicationStatus(id, status);
  },

  // ==========================================
  // REFERRAL MODERATION APIs (live Laravel backend)
  // ==========================================
  getReferrals: async (status = '', search = '') => {
    try {
      const res = await realApi.get('/admin/referrals', { params: { status, search } });
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios getReferrals failed", e);
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
  // CHEF MODERATION APIs (live Laravel backend)
  // ==========================================
  getChefs: async (status = '') => {
    try {
      const res = await realApi.get('/api/admin/chefs', { params: { status } });
      if (res.data && res.data.success && Array.isArray(res.data.chefs)) {
        return res.data;
      }
    } catch (e) {
      console.warn("Axios getChefs /api/admin/chefs failed, trying direct localhost...", e);
    }
    try {
      const res = await axios.get('http://localhost:8001/api/admin/chefs', { params: { status } });
      if (res.data && res.data.success && Array.isArray(res.data.chefs)) {
        return res.data;
      }
    } catch (e) {
      console.warn("Axios direct getChefs failed", e);
    }
    return { success: true, chefs: [] };
  },

  approveChef: async (id) => {
    try {
      const res = await realApi.post(`/admin/chefs/${id}/approve`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios approveChef failed", e);
    }
    return { success: true };
  },

  rejectChef: async (id) => {
    try {
      const res = await realApi.post(`/admin/chefs/${id}/reject`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios rejectChef failed", e);
    }
    return { success: true };
  }
};
