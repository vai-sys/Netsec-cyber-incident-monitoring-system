import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { User, Mail, ShieldCheck, Edit, Save, RefreshCw } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        password: ''
      });
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch profile. Please try again later.';
      setError(errorMessage);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Optional password strength check
    if (formData.password && formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/auth/profile',
        {
          name: formData.name,
          email: formData.email,
          password: formData.password || undefined
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setProfile(response.data.user);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-green-500 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="animate-spin" />
          <span>Loading Profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 p-8">
      <div className="max-w-2xl mx-auto bg-green-900/20 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold mb-8 text-green-500 text-center">
          User Profile
        </h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/30 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-900/30 text-green-400 p-4 rounded-lg mb-6">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="relative">
              <label className="block mb-2 text-green-500 flex items-center">
                <User className="mr-2" />
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-green-800 text-green-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-all"
                />
              ) : (
                <div className="bg-green-900/30 p-3 rounded-lg text-green-300">
                  {profile.name}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="relative">
              <label className=" mb-2 text-green-500 flex items-center">
                <Mail className="mr-2" />
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-green-800 text-green-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-all"
                />
              ) : (
                <div className="bg-green-900/30 p-3 rounded-lg text-green-300">
                  {profile.email}
                </div>
              )}
            </div>
          </div>

          {/* Role Field */}
          <div className="relative">
            <label className="block mb-2 text-green-500 flex items-center">
              <ShieldCheck className="mr-2" />
              Role
            </label>
            <div className="bg-green-900/30 p-3 rounded-lg text-green-300 capitalize">
              {profile.role}
            </div>
          </div>

          {/* Password Field */}
          {isEditing && (
            <div className="relative">
              <label className="block mb-2 text-green-500">
                New Password (Optional)
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Leave blank if no change"
                className="w-full bg-black border border-green-800 text-green-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-all"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  className="bg-green-700 text-white px-6 py-3 rounded-lg 
                  hover:bg-green-600 transition-all transform hover:scale-105 active:scale-95
                  flex items-center space-x-2"
                >
                  <Save className="mr-2" /> Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-red-900/50 text-red-400 px-6 py-3 rounded-lg 
                  hover:bg-red-900/70 transition-all transform hover:scale-105 active:scale-95"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-green-700 text-white px-6 py-3 rounded-lg 
                hover:bg-green-600 transition-all transform hover:scale-105 active:scale-95
                flex items-center space-x-2"
              >
                <Edit className="mr-2" /> Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;