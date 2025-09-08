import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import PostJob from './pages/PostJob';
import RecruiterDashboard from './pages/RecruiterDashboard';
import ManageJobs from './pages/ManageJobs';
import Applicants from './pages/Applicants';
import CompanyProfile from './pages/CompanyProfile';
import MyApplications from './pages/MyApplications';
import CreateProfile from './pages/CreateProfile';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// A component to conditionally render the Navbar and main layout
const AppLayout = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/recruiter-dashboard') || location.pathname.startsWith('/post-job');

  return (
    <>
      {!isDashboardRoute && <Navbar />}
      {/* Apply container styling ONLY if it's NOT a dashboard route */}
      <main className={!isDashboardRoute ? "container mx-auto px-4 py-8" : "p-6 w-full"}> {/* ADD p-6 and w-full */}
        <Outlet />
      </main>
    </>
  );
};


function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Routes>
        {/* Public Routes with Navbar */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetails />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/my-applications" element={<MyApplications />} />
        </Route>

        {/* Recruiter Routes with Dashboard Layout */}
        <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route element={<DashboardLayout />}>
            <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
            <Route path="/recruiter-dashboard/manage-jobs" element={<ManageJobs />} />
            <Route path="/recruiter-dashboard/job/:id/applicants" element={<Applicants />} />
            <Route path="/recruiter-dashboard/profile" element={<CompanyProfile />} />
            <Route path="/post-job" element={<PostJob />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;