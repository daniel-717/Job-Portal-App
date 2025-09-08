import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';
import { Briefcase, MapPin, IndianRupee, Type, FileText } from 'lucide-react';

const PostJob = () => {
    const [formData, setFormData] = useState({ title: '', description: '', salary: '', location: '', jobType: 'Full-time' });
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/jobs/create-job', formData);
            toast.success('Job posted successfully!');
            navigate('/recruiter-dashboard/manage-jobs');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to post job.');
        }
    };
    
    return (
        <div className="pb-10">
            <h2 className="text-2xl font-bold mb-1">Post a New Job</h2>
            <p className="text-gray-600 mb-6">Fill out the form below to create your job posting.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <InputField icon={<Briefcase/>} name="title" placeholder="e.g. Senior Frontend Developer" label="Job Title" onChange={handleChange} required/>
                <InputField icon={<MapPin/>} name="location" placeholder="e.g. New York, NY" label="Location" onChange={handleChange} required/>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Annual Salary</label>
                    <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type='text' 
                            name="salary" 
                            placeholder="e.g. 10 LPA" 
                            onChange={handleChange} 
                            required 
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                    <div className="relative">
                        <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <select name="jobType" value={formData.jobType} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Remote</option>
                            <option>Internship</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-4 text-gray-400" size={20} />
                        <textarea name="description" placeholder="Describe the role and responsibilities..." onChange={handleChange} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg h-36 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105">
                    Post Job
                </button>
            </form>
        </div>
    );
};

const InputField = ({ icon, label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
            <input {...props} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
    </div>
);

export default PostJob;