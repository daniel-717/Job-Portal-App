import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Mail, Lock } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user } = await register(formData.name, formData.email, formData.password, formData.role);
      toast.success('Account Created! Please complete your profile.');
      navigate('/');
      if (user.role === 'recruiter') {
        navigate('/create-profile'); 
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error('Registration Failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Create Account</h2>
        <p className="text-gray-600 text-center mb-8">Join thousands of professionals finding their dream jobs</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" name="name" placeholder="Enter your full name" onChange={handleChange} required className="w-full pl-10 pr-3 py-2 border rounded-lg"/>
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="email" name="email" placeholder="Enter your email" onChange={handleChange} required className="w-full pl-10 pr-3 py-2 border rounded-lg"/>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="password" name="password" placeholder="Create a strong password" onChange={handleChange} required className="w-full pl-10 pr-3 py-2 border rounded-lg"/>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">I am a:</label>
            <div className="flex gap-4">
              <label className={`flex-1 p-4 border rounded-lg cursor-pointer text-center ${formData.role === 'user' ? 'border-blue-600 ring-2 ring-blue-500' : 'border-gray-300'}`}>
                <input type="radio" name="role" value="user" checked={formData.role === 'user'} onChange={handleChange} className="hidden" />
                <span className="font-semibold">Job Seeker</span>
              </label>
              <label className={`flex-1 p-4 border rounded-lg cursor-pointer text-center ${formData.role === 'recruiter' ? 'border-blue-600 ring-2 ring-blue-500' : 'border-gray-300'}`}>
                <input type="radio" name="role" value="recruiter" checked={formData.role === 'recruiter'} onChange={handleChange} className="hidden" />
                <span className="font-semibold">Recruiter</span>
              </label>
            </div>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:opacity-90">
            Create Account
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;