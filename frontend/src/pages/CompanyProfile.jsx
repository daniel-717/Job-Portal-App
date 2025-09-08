import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { toast } from 'react-toastify';
import Spinner from '../components/common/Spinner';
import { Mail, Building, User, Edit } from 'lucide-react';

const CompanyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/auth/me');
        setProfile(data.user);
      } catch (error) {
        toast.error('Could not load profile data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <Spinner />;
  if (!profile) return <div>Could not load profile.</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Employer Profile</h2>
        <button className="flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 text-sm font-semibold">
          <Edit size={16} className="mr-2" /> Edit Profile
        </button>
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow-sm space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center">
          <img 
            src={profile.companyLogo?.url || 'https://via.placeholder.com/150'} 
            alt="Company Logo" 
            className="w-24 h-24 rounded-full mr-0 sm:mr-6 mb-4 sm:mb-0 object-cover border-4 border-gray-100"
          />
          <div>
            <p className="text-2xl font-bold text-gray-800">{profile.companyName}</p>
            <p className="text-gray-500">Company</p>
          </div>
        </div>

        {/* Personal and Company Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <User size={20} className="mr-3 text-gray-400"/>
                <span className="text-gray-800">{profile.name}</span>
              </div>
              <div className="flex items-center">
                <Mail size={20} className="mr-3 text-gray-400"/>
                <span className="text-gray-800">{profile.email}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">About Company</h3>
            <p className="text-gray-600 leading-relaxed">
              Company description and details can be added and edited here. This section provides potential candidates with insights into your company's mission, values, and culture.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyProfile;