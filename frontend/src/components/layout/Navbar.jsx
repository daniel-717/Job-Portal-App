import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out.');
    navigate('/');
  };

  return (
    <header className="bg-white sticky top-0 z-40 shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          JobPortal
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/jobs" className="text-gray-600 hover:text-blue-600">Find Jobs</Link>
          
          {/* Conditional link for Recruiters */}
          {isAuthenticated && user?.role === 'recruiter' && (
            <Link to="/recruiter-dashboard" className="text-gray-600 hover:text-blue-600">For Employers</Link>
          )}

          {/* Conditional link for Job Seekers */}
          {isAuthenticated && user?.role === 'user' && (
            <Link to="/my-applications" className="text-gray-600 hover:text-blue-600">My Applications</Link>
          )}
        </div>
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <span className="text-gray-700 hidden sm:block">Welcome, {user.name}</span>
              <button onClick={handleLogout} className="flex items-center p-2 text-red-500 hover:text-red-700">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600">Login</Link>
              <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;