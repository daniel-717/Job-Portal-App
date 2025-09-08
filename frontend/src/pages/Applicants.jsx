import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Download } from 'lucide-react';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';

const Applicants = () => {
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id: jobId } = useParams();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const { data } = await API.get(`/jobs/job/${jobId}/applicants`);
        setApplicants(data.applicants);
        const jobRes = await API.get(`/jobs/job/${jobId}`);
        setJob(jobRes.data.job);
      } catch (error) {
        toast.error('Failed to fetch applicants.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId]);

  const handleStatusChange = async (applicantId, newStatus) => {
    try {
        await API.patch(`/jobs/job/${jobId}/applicant/${applicantId}/status`, { status: newStatus });
        setApplicants(applicants.map(app => 
            app._id === applicantId ? { ...app, status: newStatus } : app
        ));
        toast.success("Applicant status updated!");
    } catch (error) {
        toast.error("Failed to update status.");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
        <Link to="/recruiter-dashboard/manage-jobs" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft size={20} className="mr-2" /> Back to Jobs
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-1">Applications Overview</h2>
            <p className="text-lg text-gray-700 mb-6">{job?.title}</p>
            
            <div className="space-y-4">
                {applicants.length > 0 ? (
                    applicants.map(applicant => (
                        <div key={applicant._id} className="p-4 bg-white shadow-sm rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-shadow duration-200">
                            <div>
                                <p className="font-semibold text-lg">{applicant.user.name}</p>
                                <p className="text-sm text-gray-500">{applicant.user.email}</p>
                                <p className="text-xs text-gray-400 mt-1">Applied on {new Date(applicant.appliedAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-4 md:mt-0">
                                <a href={applicant.resume.url} target="_blank" rel="noopener noreferrer" className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-200 text-sm flex items-center">
                                    <Download size={16} className="mr-1.5" /> Resume
                                </a>
                                <select 
                                    value={applicant.status} 
                                    onChange={(e) => handleStatusChange(applicant._id, e.target.value)}
                                    className="border-gray-300 rounded-md text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option>Applied</option>
                                    <option>In Review</option>
                                    <option>Accepted</option>
                                    <option>Rejected</option>
                                </select>
                            </div>
                        </div>
                    ))
                ) : (
                    <EmptyState message="There are no applicants for this job yet." />
                )}
            </div>
        </div>
    </div>
  );
};

export default Applicants;