import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, IndianRupee, Briefcase } from 'lucide-react';

const JobCard = ({ job }) => {
  const fallbackLogo = 'https://via.placeholder.com/150';

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col">
      <div className="flex items-start mb-4">
        <img
          src={job.postedBy?.companyLogo?.url || fallbackLogo}
          alt={`${job.postedBy?.companyName} logo`}
          className="w-16 h-16 object-contain rounded-md mr-4"
        />
        <div>
          <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
          <p className="text-md text-gray-600">{job.postedBy?.companyName}</p>
        </div>
      </div>
      <div className="space-y-2 text-gray-700 mb-4 flex-grow">
        <div className="flex items-center">
          <MapPin size={16} className="mr-2 text-gray-500" /> <span>{job.location}</span>
        </div>
        <div className="flex items-center">
          <IndianRupee size={16} className="mr-2 text-gray-500" /> <span>{job.salary.toLocaleString()}</span>
        </div>
        <div className="flex items-center">
          <Briefcase size={16} className="mr-2 text-gray-500" /> <span>{job.jobType}</span>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        {job.description.substring(0, 100)}...
      </p>
      <Link to={`/job/${job._id}`} className="mt-auto block text-center w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
        View Details
      </Link>
    </div>
  );
};

export default JobCard;