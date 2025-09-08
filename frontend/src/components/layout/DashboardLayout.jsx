import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Briefcase, Users, LogOut, Building } from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClasses = "flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-blue-100";
  const activeLinkClasses = "bg-blue-100 text-blue-600 font-semibold";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex-shrink-0">
        <div className="p-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">
                JobPortal
          </Link>
        </div>
        <nav className="p-4 space-y-2">
          <NavLink to="/recruiter-dashboard" end className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
            <LayoutDashboard size={20} className="mr-3" /> Dashboard
          </NavLink>
          <NavLink to="/recruiter-dashboard/manage-jobs" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
            <Briefcase size={20} className="mr-3" /> Manage Jobs
          </NavLink>
          <NavLink to="/post-job" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
             <Briefcase size={20} className="mr-3" /> Post Job
          </NavLink>
          <NavLink to="/recruiter-dashboard/profile" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
            <Building size={20} className="mr-3" /> Company Profile
          </NavLink>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 ">
            <button onClick={handleLogout} className={`${linkClasses} w-full text-red-500 hover:bg-red-50`}>
                <LogOut size={20} className="mr-3" /> Logout
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 ">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Welcome back, {user?.name}!</h2>
              <p className="text-sm text-gray-500">Here's what's happening with your jobs today.</p>
            </div>
            {/* User profile dropdown can be added here */}
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {/* Apply the shadow and white background to the OUTLET container */}
          <div className="bg-white p-6 rounded-lg shadow-md h-full"> 
            <Outlet /> {/* Child routes will render here */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;