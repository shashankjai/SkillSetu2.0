// src/pages/ProfileSettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/profileSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import { FaEdit, FaLinkedin, FaFacebook, FaTwitter, FaSave, FaLock } from 'react-icons/fa';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineCloudUpload } from 'react-icons/ai';
import { HiOutlineStatusOnline } from 'react-icons/hi';
import { MdOutlineManageAccounts, MdOutlinePassword } from 'react-icons/md';
import { GiSkills } from 'react-icons/gi';
import defaultAvatar from '../assets/avatar.jpeg';
import Footer from '../components/footer/Footer';

const ProfileSettingsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    profilePicture: '',
    status: '',
    socials: { linkedin: '', facebook: '', twitter: '' },
    skillsToTeach: '',
    skillsToLearn: ''
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    currentPasswordVisible: false,
    newPasswordVisible: false,
    confirmNewPasswordVisible: false
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(
          'http://localhost:5000/api/users/profile',
          { headers: { 'x-auth-token': token } }
        );
        const data = res.data;
        setFormData({
          name: data.name || '',
          profilePicture: data.profilePicture || '',
          status: data.status || '',
          socials: data.socials || { linkedin: '', facebook: '', twitter: '' },
          skillsToTeach: data.skillsToTeach ? data.skillsToTeach.join(', ') : '',
          skillsToLearn: data.skillsToLearn ? data.skillsToLearn.join(', ') : ''
        });
        if (data.profilePicture) {
          setImagePreview(
            `http://localhost:5000/uploads/profile-pictures/${data.profilePicture}`
          );
        }
      } catch {
        setMessage({ text: 'Failed to load profile data.', type: 'error' });
      }
    };
    fetchProfile();
  }, []);

  // Determine which avatar to show
  const avatarSrc = imagePreview
    ? imagePreview
    : formData.profilePicture
    ? `http://localhost:5000/uploads/profile-pictures/${formData.profilePicture}`
    : defaultAvatar;

  // Handle profile update
  const handleUpdate = async () => {
    setIsSubmitting(true);
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('status', formData.status);

    const skillsToTeachArray = formData.skillsToTeach.split(',').map((s) => s.trim()).filter((s) => s !== '');
    const skillsToLearnArray = formData.skillsToLearn.split(',').map((s) => s.trim()).filter((s) => s !== '');

    skillsToTeachArray.forEach((skill) => {
      payload.append('skillsToTeach[]', skill);
    });

    skillsToLearnArray.forEach((skill) => {
      payload.append('skillsToLearn[]', skill);
    });

    payload.append('socials[linkedin]', formData.socials.linkedin);
    payload.append('socials[facebook]', formData.socials.facebook);
    payload.append('socials[twitter]', formData.socials.twitter);

    if (formData.profilePicture instanceof File) {
      payload.append('profilePicture', formData.profilePicture);
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:5000/api/users/profile', payload, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch(setUser(res.data));
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch {
      setMessage({ text: 'Update failed. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setMessage({ text: "Passwords don't match!", type: 'error' });
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/users/change-password',
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        },
        { headers: { 'x-auth-token': token } }
      );
      setMessage({ text: 'Password updated successfully!', type: 'success' });
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        currentPasswordVisible: false,
        newPasswordVisible: false,
        confirmNewPasswordVisible: false
      });
    } catch {
      setMessage({ text: 'Password update failed. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image upload & preview
  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
            <p className="text-gray-400">Manage your profile and security settings</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 sticky top-24">
                <div className="mb-8 flex flex-col items-center">
                  <div className="relative group mb-4">
                    <div className="w-32 h-32 rounded-full border-4 border-gray-700 overflow-hidden">
                      <img
                        src={avatarSrc}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label 
                      htmlFor="profilePicture" 
                      className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <AiOutlineCloudUpload className="text-2xl text-white" />
                    </label>
                    <input
                      type="file"
                      id="profilePicture"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                  <h2 className="text-xl font-semibold text-white">{formData.name || 'Your Name'}</h2>
                  <p className="text-gray-400 text-sm">{formData.status || 'Update your status'}</p>
                </div>

                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center w-full p-3 rounded-xl transition-all ${
                      activeTab === 'profile'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <MdOutlineManageAccounts className="mr-3" />
                    Profile Information
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`flex items-center w-full p-3 rounded-xl transition-all ${
                      activeTab === 'security'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <FaLock className="mr-3" />
                    Security
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Message Alert */}
              {message.text && (
                <div className={`mb-6 p-4 rounded-xl border ${
                  message.type === 'success'
                    ? 'bg-green-900/20 border-green-800 text-green-400'
                    : 'bg-red-900/20 border-red-800 text-red-400'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex items-center mb-8">
                      <div className="p-3 rounded-xl bg-blue-900/30 mr-4">
                        <MdOutlineManageAccounts className="text-2xl text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                        <p className="text-gray-400">Update your personal details and preferences</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Personal Info */}
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Full Name
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="John Doe"
                              value={formData.name}
                              onChange={e => setFormData({ ...formData, name: e.target.value })}
                              className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                            <HiOutlineStatusOnline className="mr-2" />
                            Status
                          </label>
                          <input
                            type="text"
                            placeholder="What's on your mind?"
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                            className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Social Links */}
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                            <FaLinkedin className="mr-2 text-blue-400" />
                            LinkedIn
                          </label>
                          <input
                            type="text"
                            placeholder="https://linkedin.com/in/username"
                            value={formData.socials.linkedin}
                            onChange={e =>
                              setFormData({
                                ...formData,
                                socials: { ...formData.socials, linkedin: e.target.value }
                              })
                            }
                            className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                            <FaFacebook className="mr-2 text-blue-500" />
                            Facebook
                          </label>
                          <input
                            type="text"
                            placeholder="https://facebook.com/username"
                            value={formData.socials.facebook}
                            onChange={e =>
                              setFormData({
                                ...formData,
                                socials: { ...formData.socials, facebook: e.target.value }
                              })
                            }
                            className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                            <FaTwitter className="mr-2 text-blue-400" />
                            Twitter
                          </label>
                          <input
                            type="text"
                            placeholder="https://twitter.com/username"
                            value={formData.socials.twitter}
                            onChange={e =>
                              setFormData({
                                ...formData,
                                socials: { ...formData.socials, twitter: e.target.value }
                              })
                            }
                            className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Skills Section */}
                    <div className="mt-8 pt-8 border-t border-gray-700">
                      <div className="flex items-center mb-6">
                        <div className="p-3 rounded-xl bg-purple-900/30 mr-4">
                          <GiSkills className="text-2xl text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Skills Configuration</h3>
                          <p className="text-gray-400">List your skills separated by commas</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Skills You Can Teach
                          </label>
                          <textarea
                            placeholder="JavaScript, React, UI/UX Design, Python, etc."
                            value={formData.skillsToTeach}
                            onChange={e =>
                              setFormData({ ...formData, skillsToTeach: e.target.value })
                            }
                            rows="4"
                            className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Skills You Want to Learn
                          </label>
                          <textarea
                            placeholder="Machine Learning, Go, Blockchain, etc."
                            value={formData.skillsToLearn}
                            onChange={e =>
                              setFormData({ ...formData, skillsToLearn: e.target.value })
                            }
                            rows="4"
                            className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleUpdate}
                      disabled={isSubmitting}
                      className="mt-8 w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaSave className="mr-2" />
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div>
                    <div className="flex items-center mb-8">
                      <div className="p-3 rounded-xl bg-red-900/30 mr-4">
                        <MdOutlinePassword className="text-2xl text-red-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Security Settings</h2>
                        <p className="text-gray-400">Update your password and security preferences</p>
                      </div>
                    </div>

                    <div className="space-y-6 max-w-2xl">
                      {[
                        {
                          key: 'currentPassword',
                          placeholder: 'Enter current password',
                          visibleKey: 'currentPasswordVisible',
                          label: 'Current Password'
                        },
                        {
                          key: 'newPassword',
                          placeholder: 'Enter new password',
                          visibleKey: 'newPasswordVisible',
                          label: 'New Password'
                        },
                        {
                          key: 'confirmNewPassword',
                          placeholder: 'Confirm new password',
                          visibleKey: 'confirmNewPasswordVisible',
                          label: 'Confirm Password'
                        }
                      ].map(({ key, placeholder, visibleKey, label }) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            {label}
                          </label>
                          <div className="relative">
                            <input
                              type={passwords[visibleKey] ? 'text' : 'password'}
                              placeholder={placeholder}
                              value={passwords[key]}
                              onChange={e =>
                                setPasswords(prev => ({
                                  ...prev,
                                  [key]: e.target.value
                                }))
                              }
                              className="w-full p-4 pr-12 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setPasswords(prev => ({
                                  ...prev,
                                  [visibleKey]: !prev[visibleKey]
                                }))
                              }
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {passwords[visibleKey] ? (
                                <AiOutlineEyeInvisible className="text-xl" />
                              ) : (
                                <AiOutlineEye className="text-xl" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="pt-6">
                        <button
                          onClick={handlePasswordChange}
                          disabled={isSubmitting}
                          className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaLock className="mr-2" />
                          {isSubmitting ? 'Updating...' : 'Update Password'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfileSettingsPage;