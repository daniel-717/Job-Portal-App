import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import { Briefcase, Users, CheckCircle } from 'lucide-react';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';

const RecruiterDashboard = () => {
  const [stats, setStats] = useState({ activeJobs: 0, totalApplicants: 0 });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get('/jobs/my-jobs');
        const totalApplicants = data.jobs.reduce((acc, job) => acc + job.applicants.length, 0);
        setStats({ activeJobs: data.jobs.length, totalApplicants });
        setRecentJobs(data.jobs.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Briefcase size={24} />} title="Active Jobs" value={stats.activeJobs} color="blue" />
        <StatCard icon={<Users size={24} />} title="Total Applicants" value={stats.totalApplicants} color="green" />
        <StatCard icon={<CheckCircle size={24} />} title="Hired" value="0" color="purple" />
      </div>

      {/* Recent Job Posts */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Job Posts</h3>
          <Link to="manage-jobs" className="text-sm text-blue-600 hover:underline">View all</Link>
        </div>
        <div className="space-y-4">
          {recentJobs.length > 0 ? (
            recentJobs.map(job => (
              <div key={job._id} className="p-4 bg-white shadow-sm rounded-lg flex justify-between items-center hover:shadow-md transition-shadow duration-200">
                {/* --- THIS IS THE UPDATED SECTION --- */}
                <div className="flex items-center gap-4">
                  <Briefcase size={28} className="text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-800">{job.title}</p>
                    <p className="text-sm text-gray-500">{job.location}</p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">Active</span>
              </div>
            ))
          ) : (
            <EmptyState message="You haven't posted any jobs yet." />
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => {
  const backgroundColors = {
    blue: 'from-blue-500 to-indigo-500',
    green: 'from-green-500 to-teal-500',
    purple: 'from-purple-500 to-pink-500',
  };
  const iconTextColors = {
    blue: 'text-blue-700',
    green: 'text-green-700',
    purple: 'text-purple-700',
  };

  return (
    <div className={`bg-gradient-to-br ${backgroundColors[color]} text-white p-6 rounded-lg shadow-lg flex items-center`}>
      <div className={`mr-4 bg-white p-3 rounded-full ${iconTextColors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm opacity-90">{title}</p>
      </div>
    </div>
  );
};

export default RecruiterDashboard;