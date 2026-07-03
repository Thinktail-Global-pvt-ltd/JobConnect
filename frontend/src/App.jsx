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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
