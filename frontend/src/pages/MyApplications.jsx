import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { toast } from 'react-toastify';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import { Link } from 'react-router-dom';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await API.get('/jobs/my-applications');
        setApplications(data.applications);
      } catch (error) {
        toast.error('Failed to load your applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-700';
      case 'In Review':
        return 'bg-yellow-100 text-yellow-700';
      case 'Accepted':
        return 'bg-green-100 text-green-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Applications</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Job Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Company</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Date Applied</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.jobId} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-800">
                      <Link to={`/job/${app.jobId}`} className="hover:underline">{app.jobTitle}</Link>
                    </td>
                    <td className="py-4 px-4">{app.company}</td>
                    <td className="py-4 px-4 text-gray-600">{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="You haven't applied to any jobs yet." />
        )}
      </div>
    </div>
  );
};

export default MyApplications;