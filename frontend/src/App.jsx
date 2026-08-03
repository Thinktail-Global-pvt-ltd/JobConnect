import { useEffect } from "react";
import PrivacyPolicy from "./PrivacyPolicy";

import FindANewJob from "./component/FindANewJob";
import HomeScreen from "./component/HomeScreen";
import HelpSupport from "./component/HelpSupport";
import DataDeletion from "./component/DataDeletion";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Term from "./Term";

// Admin Panel Components
import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/Dashboard";
import Users from "./admin/Users";
import Jobs from "./admin/Jobs";
import JobDetail from "./admin/JobDetail";
import Referrals from "./admin/Referrals";
import CommunityFeed from "./admin/CommunityFeed";
import LiveFeed from "./admin/LiveFeed";
import Training from "./admin/Training";
import EditTraining from "./admin/EditTraining";
import Chefs from "./admin/Chefs";
import Employers from "./admin/Employers";
import EmployerDetail from "./admin/EmployerDetail";
import Enquiries from "./admin/Enquiries";
import Settings from "./admin/Settings";
import Applications from "./admin/Applications";
import NotificationsLog from "./admin/NotificationsLog";
import Layout from "./admin/Layout";

// Protected Admin Route Guard
function ProtectedAdminRoute({ children }) {
  const isAuth = localStorage.getItem('admin_authenticated') === 'true' || sessionStorage.getItem('admin_authenticated') === 'true';

  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

// Layout & Pages
import Navbar from "@/component/layout/Navbar";
import Footer from "@/component/layout/Footer";
import Home from "@/pages/home";
import FindJobs from "@/pages/find-jobs";
import HireTalent from "@/pages/hire-talent";
import ChefConnect from "@/pages/chef-connect";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    if (!hash) {
      const scroll = () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        document.documentElement.scrollTo({ top: 0, behavior: 'instant' });
        document.body.scrollTo({ top: 0, behavior: 'instant' });
      };

      scroll();
      const t1 = setTimeout(scroll, 50);
      const t2 = setTimeout(scroll, 150);
      const t3 = setTimeout(scroll, 300);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [pathname, hash]);

  return null;
}

function PublicLayout({ children }) {
  return (
    <div className="min-h-[100dvh] flex flex-col selection:bg-accent selection:text-accent-foreground">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* original landing page */}
        {/* <Route path="/original-home" element={<HomeScreen />} />
        <Route path="/original-jobs" element={<FindANewJob />} /> */}

        {/* new pages with new layout wrapper */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/find-jobs" element={<PublicLayout><FindJobs /></PublicLayout>} />
        <Route path="/hire-talent" element={<PublicLayout><HireTalent /></PublicLayout>} />
        <Route path="/chef-connect" element={<PublicLayout><ChefConnect /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

        {/* policy & support routes */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms&conditions" element={<Term />} />
        <Route path="/help-support" element={<HelpSupport />} />
        <Route path="/data-deletion" element={<DataDeletion />} />

        {/* Admin Panel Authentication & Protected Control Mappings */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<ProtectedAdminRoute><Layout><Dashboard /></Layout></ProtectedAdminRoute>} />
        <Route path="/admin/users" element={<ProtectedAdminRoute><Layout><Users /></Layout></ProtectedAdminRoute>} />
        <Route path="/admin/jobs" element={<ProtectedAdminRoute><Layout><Jobs /></Layout></ProtectedAdminRoute>} />
        <Route path="/admin/jobs/:id" element={<ProtectedAdminRoute><Layout><JobDetail /></Layout></ProtectedAdminRoute>} />
        <Route path="/admin/referrals" element={<ProtectedAdminRoute><Layout><Referrals /></Layout></ProtectedAdminRoute>} />
        <Route path="/admin/community" element={<ProtectedAdminRoute><Layout><CommunityFeed /></Layout></ProtectedAdminRoute>} />
        <Route path="/admin/live-feed" element={<ProtectedAdminRoute><Layout><LiveFeed /></Layout></ProtectedAdminRoute>} />
        <Route path="/admin/training" element={<ProtectedAdminRoute><Layout><Training /></Layout></ProtectedAdminRoute>} />
        <Route path="/admin/training/edit" element={<ProtectedAdminRoute><Layout><EditTraining /></Layout></ProtectedAdminRoute>} />
        <Route path="/admin/chefs" element={<ProtectedAdminRoute><Layout><Chefs /></Layout></ProtectedAdminRoute>} />
        <Route path="/admin/employers" element={<ProtectedAdminRoute><Layout><Employers /></Layout></ProtectedAdminRoute>} />
        <Route path="/admin/employers/:id" element={<ProtectedAdminRoute><Layout><EmployerDetail /></Layout></ProtectedAdminRoute>} />
        <Route path="/admin/enquiries" element={<ProtectedAdminRoute><Layout><Enquiries /></Layout></ProtectedAdminRoute>} />
        <Route path="/admin/settings" element={<ProtectedAdminRoute><Layout><Settings /></Layout></ProtectedAdminRoute>} />
        <Route path="/admin/applications" element={<ProtectedAdminRoute><Layout><Applications /></Layout></ProtectedAdminRoute>} />
        <Route path="/admin/notifications" element={<ProtectedAdminRoute><Layout><NotificationsLog /></Layout></ProtectedAdminRoute>} />
        <Route path="/admin/activity-logs" element={<ProtectedAdminRoute><Layout><NotificationsLog /></Layout></ProtectedAdminRoute>} />

        {/* Fallback not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
