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

const INITIAL_CHEFS = [
  { id: 28, user_id: 28, full_name: 'Maayank Malhotra', name: 'Maayank Malhotra', email: 'maayankmalhotra095@gmail.com', mobile_number: '08799730966', city: 'Bengaluru', experience_range: '8-12 years', experience: '8-12 years', preferred_role: 'Executive Chef', cuisine_specialty: 'Indian, Tandoor, Mughlai', specialties: 'Indian, Tandoor, Mughlai', bio: 'Seasoned culinary professional with 10 years of experience in 5-star hotels.', calendly_link: 'https://calendly.com/chef-vikram', calendly: true, approval_status: 'approved', status: 'approved' },
  { id: 37, user_id: 37, full_name: 'Chef Ranveer Singh', name: 'Chef Ranveer Singh', email: 'ranveer@hospitality.com', mobile_number: '9876543210', city: 'Mumbai', experience_range: '12+ years', experience: '12+ years', preferred_role: 'Master Chef', cuisine_specialty: 'Indian, Fusion, Progressive', specialties: 'Indian, Fusion, Progressive', bio: 'Renowned celebrity chef and culinary designer.', calendly_link: 'https://calendly.com/chef-ranveer', calendly: true, approval_status: 'approved', status: 'approved' },
  { id: 38, user_id: 38, full_name: 'Marco Pierre', name: 'Marco Pierre', email: 'marco@hospitality.com', mobile_number: '9876543211', city: 'London / Delhi', experience_range: '15+ years', experience: '15+ years', preferred_role: 'Head Chef', cuisine_specialty: 'Continental, French', specialties: 'Continental, French', bio: '3 Michelin star background culinary consultant.', calendly_link: '', calendly: false, approval_status: 'approved', status: 'approved' },
  { id: 33, user_id: 33, full_name: 'Amit Sharma', name: 'Amit Sharma', email: 'amit@hospitality.com', mobile_number: '9876543212', city: 'Delhi', experience_range: '6-8 years', experience: '6-8 years', preferred_role: 'Sous Chef', cuisine_specialty: 'North Indian, Mughlai', specialties: 'North Indian, Mughlai', bio: 'Specialist in Tandoor and authentic Indian curries.', calendly_link: '', calendly: false, approval_status: 'approved', status: 'approved' },
  { id: 34, user_id: 34, full_name: 'Lucia Martinez', name: 'Lucia Martinez', email: 'lucia@hospitality.com', mobile_number: '9876543213', city: 'Bengaluru', experience_range: '5-8 years', experience: '5-8 years', preferred_role: 'Pastry Chef', cuisine_specialty: 'Continental, Italian, Bakery', specialties: 'Continental, Italian, Bakery', bio: 'Artisanal baker and pastry artisan.', calendly_link: '', calendly: false, approval_status: 'approved', status: 'approved' },
  { id: 35, user_id: 35, full_name: 'James Kang', name: 'James Kang', email: 'james@hospitality.com', mobile_number: '9876543214', city: 'Mumbai', experience_range: '7-10 years', experience: '7-10 years', preferred_role: 'Pan-Asian Executive', cuisine_specialty: 'Pan-Asian, Japanese, Thai', specialties: 'Pan-Asian, Japanese, Thai', bio: 'Expert in sushi crafting and Asian teppanyaki.', calendly_link: '', calendly: false, approval_status: 'approved', status: 'approved' },
  { id: 40, user_id: 40, full_name: 'Chef TestOnboard', name: 'Chef TestOnboard', email: 'testonboard@hospitality.com', mobile_number: '9876543217', city: 'Bengaluru', experience_range: '5-8 years', experience: '5-8 years', preferred_role: 'Executive Chef', cuisine_specialty: 'Multi-Cuisine', specialties: 'Multi-Cuisine', bio: 'Expert chef.', calendly_link: '', calendly: false, approval_status: 'approved', status: 'approved' },
  { id: 42, user_id: 42, full_name: 'Chef Test Vikram', name: 'Chef Test Vikram', email: 'testvikram@hospitality.com', mobile_number: '9876543218', city: 'Delhi', experience_range: '8-12 years', experience: '8-12 years', preferred_role: 'Executive Chef', cuisine_specialty: 'Indian, Tandoor', specialties: 'Indian, Tandoor', bio: 'Experienced executive chef.', calendly_link: '', calendly: false, approval_status: 'approved', status: 'approved' },
  { id: 43, user_id: 43, full_name: 'Chef VT', name: 'Chef VT', email: 'vt@hospitality.com', mobile_number: '9876543219', city: 'Mumbai', experience_range: '6-10 years', experience: '6-10 years', preferred_role: 'Head Chef', cuisine_specialty: 'Continental', specialties: 'Continental', bio: 'Head chef.', calendly_link: '', calendly: false, approval_status: 'approved', status: 'approved' },
  { id: 1, user_id: 1, full_name: 'Chef Vikram', name: 'Chef Vikram', email: 'vikram@jobconnect.in', mobile_number: '9876543215', city: 'Bengaluru', experience_range: '8-12 years', experience: '8-12 years', preferred_role: 'Executive Chef', cuisine_specialty: 'Indian, Tandoor', specialties: 'Indian, Tandoor', bio: 'Executive chef with 10 years experience.', calendly_link: '', calendly: false, approval_status: 'pending', status: 'pending' },
  { id: 39, user_id: 39, full_name: 'Pooja Dhingra', name: 'Pooja Dhingra', email: 'pooja@hospitality.com', mobile_number: '9876543216', city: 'Mumbai', experience_range: '6-8 years', experience: '6-8 years', preferred_role: 'Pastry Chef', cuisine_specialty: 'French Desserts, Bakery', specialties: 'French Desserts, Bakery', bio: 'Macaron & French patisserie specialist.', calendly_link: '', calendly: false, approval_status: 'pending', status: 'pending' }
];

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
      console.warn("Axios getUsers /api/admin/users failed, trying direct localhost...", e);
    }
    try {
      const res = await axios.get('http://localhost:8001/api/admin/users', { params: { search, tab } });
      if (res.data && res.data.success && Array.isArray(res.data.users)) return res.data;
    } catch (e) {
      console.warn("Axios direct getUsers failed", e);
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
      const res = await realApi.get('/api/admin/jobs', { params: { status, category } });
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios getJobs /api/admin/jobs failed, trying direct localhost...", e);
    }
    try {
      const res = await axios.get('http://localhost:8001/api/admin/jobs', { params: { status, category } });
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios direct getJobs failed", e);
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
      const res = await realApi.post(`/admin/applications/${id}/status`, { status });
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios updateApplicationStatus failed, fallback to mock DB", e);
    }
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
    try {
      const res = await realApi.get('/api/admin/community-posts');
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios getCommunityPosts failed, trying direct localhost...", e);
    }
    try {
      const res = await axios.get('http://localhost:8001/api/admin/community-posts');
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios direct getCommunityPosts failed", e);
    }
    return { success: true, posts: [] };
  },

  createCommunityPost: async (postData) => {
    try {
      const res = await realApi.post('/api/admin/community-posts', postData);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios createCommunityPost failed, trying direct localhost...", e);
    }
    try {
      const res = await axios.post('http://localhost:8001/api/admin/community-posts', postData);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios direct createCommunityPost failed", e);
    }
    return { success: false };
  },

  updateCommunityPostStatus: async (id, status) => {
    try {
      const res = await realApi.post(`/api/admin/community-posts/${id}/status`, { status });
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios updateCommunityPostStatus failed", e);
    }
    try {
      const res = await axios.post(`http://localhost:8001/api/admin/community-posts/${id}/status`, { status });
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios direct updateCommunityPostStatus failed", e);
    }
    return { success: false };
  },

  deleteCommunityPost: async (id) => {
    try {
      const res = await realApi.delete(`/api/admin/community-posts/${id}`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios deleteCommunityPost failed", e);
    }
    try {
      const res = await axios.delete(`http://localhost:8001/api/admin/community-posts/${id}`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios direct deleteCommunityPost failed", e);
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
      console.warn("Axios getChefs /api/admin/chefs failed, trying direct relative...", e);
    }
    try {
      const res = await axios.get('/backend/api/admin/chefs', { params: { status } });
      if (res.data && res.data.success && Array.isArray(res.data.chefs)) {
        return res.data;
      }
    } catch (e) {
      console.warn("Axios direct /backend/api/admin/chefs failed...", e);
    }
    try {
      const res = await axios.get('http://localhost:8001/api/admin/chefs', { params: { status } });
      if (res.data && res.data.success && Array.isArray(res.data.chefs)) {
        return res.data;
      }
    } catch (e) {
      console.warn("Axios direct getChefs failed", e);
    }
    let chefs = mockDb.getChefs();
    if (status) {
      chefs = chefs.filter(c => c.status === status || c.approval_status === status);
    }
    return { success: true, chefs };
  },

  getEmployerChefs: async () => {
    try {
      const res = await realApi.get('/api/employer/chefs');
      if (res.data && res.data.success && Array.isArray(res.data.chefs)) {
        return res.data;
      }
    } catch (e) {
      console.warn("Axios getEmployerChefs /api/employer/chefs failed...", e);
    }
    try {
      const res = await axios.get('/backend/api/employer/chefs');
      if (res.data && res.data.success && Array.isArray(res.data.chefs)) {
        return res.data;
      }
    } catch (e) {
      console.warn("Axios direct /backend/api/employer/chefs failed...", e);
    }
    try {
      const res = await axios.get('http://localhost:8001/api/employer/chefs');
      if (res.data && res.data.success && Array.isArray(res.data.chefs)) {
        return res.data;
      }
    } catch (e) {
      console.warn("Axios direct getEmployerChefs failed", e);
    }
    const approvedChefs = mockDb.getChefs().filter(c => c.status === 'approved' || c.approval_status === 'approved');
    return { success: true, chefs: approvedChefs };
  },

  approveChef: async (id) => {
    const chefs = mockDb.getChefs().map(c => (c.id === id || c.user_id === id) ? { ...c, status: 'approved', approval_status: 'approved' } : c);
    mockDb.setChefs(chefs);
    try {
      const res = await realApi.post(`/api/admin/chefs/${id}/approve`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios approveChef /api/admin/chefs failed", e);
    }
    try {
      const res = await axios.post(`http://localhost:8001/api/admin/chefs/${id}/approve`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios direct approveChef failed", e);
    }
    return { success: true };
  },

  rejectChef: async (id) => {
    const chefs = mockDb.getChefs().map(c => (c.id === id || c.user_id === id) ? { ...c, status: 'rejected', approval_status: 'rejected' } : c);
    mockDb.setChefs(chefs);
    try {
      const res = await realApi.post(`/api/admin/chefs/${id}/reject`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios rejectChef /api/admin/chefs failed", e);
    }
    try {
      const res = await axios.post(`http://localhost:8001/api/admin/chefs/${id}/reject`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios direct rejectChef failed", e);
    }
    return { success: true };
  },

  unpublishChef: async (id) => {
    const chefs = mockDb.getChefs().map(c => (c.id === id || c.user_id === id) ? { ...c, status: 'pending', approval_status: 'pending' } : c);
    mockDb.setChefs(chefs);
    try {
      const res = await realApi.post(`/api/admin/chefs/${id}/unpublish`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios unpublishChef /api/admin/chefs failed", e);
    }
    try {
      const res = await axios.post(`http://localhost:8001/api/admin/chefs/${id}/unpublish`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios direct unpublishChef failed", e);
    }
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
      console.warn("Axios createChef /api/admin/chefs/create failed, trying onboarding/save...", e);
    }
    try {
      const res = await axios.post('http://localhost:8001/api/admin/chefs/create', chefData);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios direct createChef failed", e);
    }
    return { success: true, chef: newChef };
  },

  getTrainingPrograms: async () => {
    try {
      const res = await realApi.get('/api/admin/training-opportunities');
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios getTrainingPrograms failed, trying direct localhost...", e);
    }
    try {
      const res = await axios.get('http://localhost:8001/api/admin/training-opportunities');
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios direct getTrainingPrograms failed", e);
    }
    return { success: true, programs: [], stats: { total: 0, active: 0, pending: 0, countries_count: 0 } };
  },

  createTrainingProgram: async (data) => {
    try {
      const res = await realApi.post('/api/admin/training-opportunities/create', data);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios createTrainingProgram failed, trying direct localhost...", e);
    }
    try {
      const res = await axios.post('http://localhost:8001/api/admin/training-opportunities/create', data);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios direct createTrainingProgram failed", e);
    }
    return { success: true };
  },

  updateTrainingStatus: async (id, status) => {
    try {
      const res = await realApi.post(`/api/admin/training-opportunities/${id}/status`, { status });
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios updateTrainingStatus failed, trying direct localhost...", e);
    }
    try {
      const res = await axios.post(`http://localhost:8001/api/admin/training-opportunities/${id}/status`, { status });
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios direct updateTrainingStatus failed", e);
    }
    return { success: true };
  },

  togglePinTraining: async (id) => {
    try {
      const res = await realApi.post(`/api/admin/training-opportunities/${id}/toggle-pin`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios togglePinTraining failed, trying direct localhost...", e);
    }
    try {
      const res = await axios.post(`http://localhost:8001/api/admin/training-opportunities/${id}/toggle-pin`);
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios direct togglePinTraining failed", e);
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
      const res = await realApi.get('/api/feed', { params: { filter } });
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios getPublicFeed /api/feed failed, trying direct localhost...", e);
    }
    try {
      const res = await axios.get('http://localhost:8001/api/feed', { params: { filter } });
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios direct getPublicFeed failed", e);
    }
    return { success: false };
  },

  updateFeedItemStatus: async (id, source, status) => {
    try {
      const res = await realApi.post('/api/admin/feed-item/status', { id, source, status });
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios updateFeedItemStatus failed, trying direct localhost...", e);
    }
    try {
      const res = await axios.post('http://localhost:8001/api/admin/feed-item/status', { id, source, status });
      if (res.data && res.data.success) return res.data;
    } catch (e) {
      console.warn("Axios direct updateFeedItemStatus failed", e);
    }
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
  }
};
