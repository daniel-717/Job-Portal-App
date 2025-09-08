import { useState, useEffect } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, Trash2 } from 'lucide-react';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import ConfirmModal from '../components/common/ConfirmModal';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await API.get('/jobs/my-jobs');
        setJobs(data.jobs);
      } catch (error) {
        toast.error('Could not fetch jobs.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);
  
  const openConfirmModal = (jobId) => {
    setJobToDelete(jobId);
    setIsModalOpen(true);
  };
  
  const closeConfirmModal = () => {
    setJobToDelete(null);
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    if (jobToDelete) {
      try {
        await API.delete(`/jobs/delete-job/${jobToDelete}`);
        setJobs(jobs.filter(job => job._id !== jobToDelete));
        toast.success('Job deleted successfully');
      } catch (error) {
        toast.error('Failed to delete job.');
      } finally {
        closeConfirmModal();
      }
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Job Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-sm">Job Title</th>
              <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-sm">Applicants</th>
              <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length > 0 ? (
              jobs.map(job => (
                <tr key={job._id} className="border-b">
                  <td className="py-3 px-4">{job.title}</td>
                  <td className="py-3 px-4"><span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">Active</span></td>
                  <td className="py-3 px-4">{job.applicants.length}</td>
                  <td className="py-3 px-4 flex items-center gap-2">
                    <Link to={`/recruiter-dashboard/job/${job._id}/applicants`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                       View
                    </Link>
                    <button onClick={() => openConfirmModal(job._id)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                       Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                    <td colSpan="4">
                        <EmptyState message="You have not posted any jobs yet." />
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmDelete}
        title="Delete Job"
        message="Are you sure you want to delete this job posting? This action cannot be undone."
      />
    </>
  );
};

export default ManageJobs;