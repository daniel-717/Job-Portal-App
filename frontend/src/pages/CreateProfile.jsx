import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { Building, Image } from 'lucide-react';

const CreateProfile = () => {
    const [companyName, setCompanyName] = useState('');
    const [companyLogo, setCompanyLogo] = useState(null);
    const { updateUser } = useAuth();
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setCompanyLogo(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const profileData = new FormData();
        profileData.append('companyName', companyName);
        if (companyLogo) {
            profileData.append('companyLogo', companyLogo);
        }

        try {
            const { data } = await API.post('/auth/create-profile', profileData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            updateUser(data.user); // Update the user in the global context
            toast.success('Profile created successfully!');
            navigate('/recruiter-dashboard'); 
        } catch (error) {
            toast.error('Failed to create profile. Please try again.');
            console.error(error);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12">
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 text-center">Create Company Profile</h2>
                <p className="text-gray-600 text-center mb-8">Complete this final step to start posting jobs.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="text" 
                                name="companyName" 
                                placeholder="Enter your company name" 
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)} 
                                required 
                                className="w-full pl-10 pr-3 py-2 border rounded-lg"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
                        <div className="relative">
                             <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                             <input 
                                type="file" 
                                name="companyLogo" 
                                onChange={handleFileChange}
                                required
                                className="w-full pl-10 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                        Save and Continue
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateProfile;