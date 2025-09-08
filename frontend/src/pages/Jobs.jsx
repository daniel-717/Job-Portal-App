import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import JobCard from '../components/JobCard';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import { toast } from 'react-toastify';
import { Search, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [jobType, setJobType] = useState('all');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (jobType !== 'all') params.append('jobType', jobType);
        params.append('page', currentPage);
        
        const { data } = await API.get(`/jobs/get-jobs?${params.toString()}`);
        setJobs(data.jobs);
        setTotalPages(data.totalPages);
        setTotalJobs(data.totalJobs);
      } catch (err) {
        toast.error('Could not load job listings.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [search, jobType, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchParams({ search, jobType });
  };
  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* --- THIS IS THE MISSING SEARCH BAR --- */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search by Title</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="e.g., React Developer"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
             <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select onChange={(e) => setJobType(e.target.value)} defaultValue={jobType} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg appearance-none">
                <option value="all">All Types</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Remote</option>
                <option>Internship</option>
              </select>
            </div>
          </div>
          {/* A separate search button can be added if you remove the form's onSubmit */}
        </form>
      </div>

      {/* Job Listings */}
      <div>
        <h1 className="text-3xl font-bold mb-8">Available Jobs ({totalJobs})</h1>
        {loading ? (
          <Spinner />
        ) : jobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center px-4 py-2 mx-1 text-gray-700 bg-white rounded-md border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} /> Previous
                </button>
                
                <span className="px-4 py-2 text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-4 py-2 mx-1 text-gray-700 bg-white rounded-md border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState message="No jobs found matching your criteria. Try adjusting your search." />
        )}
      </div>
    </div>
  );
};

export default Jobs;