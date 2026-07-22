import { useEffect } from "react";
import PrivacyPolicy from "./PrivacyPolicy";

import FindANewJob from "./component/FindANewJob";
import HomeScreen from "./component/HomeScreen";
import HelpSupport from "./component/HelpSupport";
import DataDeletion from "./component/DataDeletion";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Term from "./Term";

// Admin Panel Components
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
import Layout from "./admin/Layout";

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

function App() {
  return (
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

        {/* Admin Panel Control Mappings */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/admin/users" element={<Layout><Users /></Layout>} />
        <Route path="/admin/jobs" element={<Layout><Jobs /></Layout>} />
        <Route path="/admin/jobs/:id" element={<Layout><JobDetail /></Layout>} />
        <Route path="/admin/referrals" element={<Layout><Referrals /></Layout>} />
        <Route path="/admin/community" element={<Layout><CommunityFeed /></Layout>} />
        <Route path="/admin/live-feed" element={<Layout><LiveFeed /></Layout>} />
        <Route path="/admin/training" element={<Layout><Training /></Layout>} />
        <Route path="/admin/training/edit" element={<Layout><EditTraining /></Layout>} />
        <Route path="/admin/chefs" element={<Layout><Chefs /></Layout>} />
        <Route path="/admin/employers" element={<Layout><Employers /></Layout>} />
        <Route path="/admin/employers/:id" element={<Layout><EmployerDetail /></Layout>} />
        <Route path="/admin/enquiries" element={<Layout><Enquiries /></Layout>} />
        <Route path="/admin/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/admin/applications" element={<Layout><Applications /></Layout>} />

        {/* Fallback not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
