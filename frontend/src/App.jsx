import PrivacyPolicy from "./PrivacyPolicy";
import "./App.css";
import FindANewJob from "./component/FindANewJob";
import Home from "./component/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Term from "./Term";

// Admin Panel Components
import Dashboard from "./admin/Dashboard";
import Users from "./admin/Users";
import Jobs from "./admin/Jobs";
import JobDetail from "./admin/JobDetail";
import Referrals from "./admin/Referrals";
import CommunityFeed from "./admin/CommunityFeed";
import Training from "./admin/Training";
import EditTraining from "./admin/EditTraining";
import Chefs from "./admin/Chefs";
import Employers from "./admin/Employers";
import EmployerDetail from "./admin/EmployerDetail";
import Enquiries from "./admin/Enquiries";
import Settings from "./admin/Settings";
import Layout from "./admin/Layout";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Customer Facing Web Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<FindANewJob />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
          <Route path="/terms&conditions" element={<Term/>}/>

          {/* Admin Panel Control Mappings */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/admin/users" element={<Layout><Users /></Layout>} />
          <Route path="/admin/jobs" element={<Layout><Jobs /></Layout>} />
          <Route path="/admin/jobs/:id" element={<Layout><JobDetail /></Layout>} />
          <Route path="/admin/referrals" element={<Layout><Referrals /></Layout>} />
          <Route path="/admin/community" element={<Layout><CommunityFeed /></Layout>} />
          <Route path="/admin/training" element={<Layout><Training /></Layout>} />
          <Route path="/admin/training/edit" element={<Layout><EditTraining /></Layout>} />
          <Route path="/admin/chefs" element={<Layout><Chefs /></Layout>} />
          <Route path="/admin/employers" element={<Layout><Employers /></Layout>} />
          <Route path="/admin/employers/:id" element={<Layout><EmployerDetail /></Layout>} />
          <Route path="/admin/enquiries" element={<Layout><Enquiries /></Layout>} />
          <Route path="/admin/settings" element={<Layout><Settings /></Layout>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
