import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase, Users, BarChart } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="text-center py-24 px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800">
          Find Your Dream Job or <br />
          <span className="text-blue-600">Perfect Hire</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Connect talented professionals with innovative companies. Your next career move or perfect candidate is just one click away.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/jobs" className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
            <Search size={20} className="mr-2" /> Find Jobs
          </Link>
          <Link to="/post-job" className="flex items-center bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-300 transition-transform transform hover:scale-105">
            <Briefcase size={20} className="mr-2" /> Post a Job
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <Users size={48} className="mx-auto text-blue-600 mb-4" />
            <p className="text-4xl font-bold text-gray-800">2.4M+</p>
            <p className="text-gray-600">Active Users</p>
          </div>
          <div className="p-6">
            <Briefcase size={48} className="mx-auto text-blue-600 mb-4" />
            <p className="text-4xl font-bold text-gray-800">5K+</p>
            <p className="text-gray-600">Companies</p>
          </div>
          <div className="p-6">
            <BarChart size={48} className="mx-auto text-blue-600 mb-4" />
            <p className="text-4xl font-bold text-gray-800">150K+</p>
            <p className="text-gray-600">Jobs Posted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;