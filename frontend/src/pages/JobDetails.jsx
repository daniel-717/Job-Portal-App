import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';
import { MapPin, IndianRupee, Briefcase, X, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';

const JobDetails = () => {
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [hasApplied, setHasApplied] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                const { data } = await API.get(`/jobs/job/${id}`);
                setJob(data.job);
            } catch (error) {
                toast.error('Could not load job details.');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    useEffect(() => {
        if (user && job) {
            const alreadyApplied = job.applicants.some((applicant) => applicant.user === user._id);
            setHasApplied(alreadyApplied);
        }
    }, [job, user]);

    const handleFileChange = (e) => setResumeFile(e.target.files[0]);

    const handleApplySubmit = async (e) => {
        e.preventDefault();
        if (!resumeFile) {
            toast.error('Please upload your resume to apply.');
            return;
        }

        const formData = new FormData();
        formData.append('resume', resumeFile);

        try {
            await API.post(`/jobs/apply-to-job/${job._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Application submitted successfully!');
            setIsModalOpen(false);
            setHasApplied(true);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to submit application.';
            toast.error(errorMessage);
        }
    };

    if (loading) return <Spinner />;
    if (!job) return <div className="text-center mt-10 text-red-500">Job not found.</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row items-start mb-6">
                    <img src={job.postedBy?.companyLogo?.url || 'https://via.placeholder.com/150'} alt={`${job.postedBy?.companyName} logo`} className="w-24 h-24 object-contain rounded-md mr-6 mb-4 md:mb-0"/>
                    <div>
                        <h1 className="text-3xl font-bold">{job.title}</h1>
                        <p className="text-xl text-gray-600">{job.postedBy?.companyName}</p>
                    </div>
                </div>
                
                <hr className="my-6 border-gray-200" />
                
                <div className="flex flex-wrap gap-x-8 gap-y-4 mb-6 text-gray-700">
                    <div className="flex items-center"><MapPin size={20} className="mr-2 text-gray-500"/> {job.location}</div>
                    <div className="flex items-center"><IndianRupee size={20} className="mr-2 text-gray-500"/> {job.salary.toLocaleString()}</div>
                    <div className="flex items-center"><Briefcase size={20} className="mr-2 text-gray-500"/> {job.jobType}</div>
                </div>

                <hr className="my-6 border-gray-200" />

                <h2 className="text-2xl font-bold mb-4">Job Description</h2>
                <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</div>

                <div className="mt-8">
                    {isAuthenticated && user?.role === 'user' && !hasApplied ? (
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                        >
                            Apply Now
                        </button>
                    ) : isAuthenticated && user?.role === 'user' && hasApplied ? (
                        <button 
                            className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold cursor-not-allowed flex items-center" disabled
                        >
                            <CheckCircle size={20} className="mr-2"/> Applied
                        </button>
                    ) : (
                        <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300">
                            Login to Apply
                        </Link>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-8 shadow-xl relative w-full max-w-md">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900">
                            <X size={24}/>
                        </button>
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">Apply for {job.title}</h3>
                        <form onSubmit={handleApplySubmit} className="space-y-6">
                            <div>
                                <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">Upload Resume (PDF only)</label>
                                <input 
                                    type="file" id="resume" name="resume" accept=".pdf" onChange={handleFileChange} required 
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300">
                                Submit Application
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobDetails;