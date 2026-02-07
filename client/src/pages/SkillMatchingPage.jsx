import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPaperPlane, FaSearch, FaStar, FaCalendarAlt, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/navbar/Navbar';
import Footer from "../components/footer/Footer";

const SkillMatchingPage = () => {
  const [matches, setMatches] = useState([]);
  const [ratings, setRatings] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sessionDetails, setSessionDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMessages, setErrorMessages] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/matches', {
          headers: { 'x-auth-token': token },
        });

        setMatches(response.data || []);

        // Fetch ratings for each match
        const ratingsPromises = response.data.map(async (match) => {
          // Use match._id as a fallback if user._id is missing to ensure uniqueness
          const userId = match.user?._id || match._id;
          if (!userId) return null;
          
          try {
            const ratingResponse = await axios.get(`http://localhost:5000/api/sessions/ratings/${userId}`, {
              headers: { 'x-auth-token': token },
            });
            const rating = parseFloat(ratingResponse.data?.averageRating) || 0;
            return { userId, averageRating: rating };
          } catch (err) {
            return { userId, averageRating: 0 };
          }
        });

        const ratingsData = await Promise.all(ratingsPromises);
        const ratingsMap = ratingsData.reduce((acc, item) => {
          if (item && item.userId) {
            acc[item.userId] = item.averageRating;
          }
          return acc;
        }, {});
        
        setRatings(ratingsMap);
      } catch (err) {
        console.error('Error fetching matches:', err);
        toast.error('Failed to load matches. Please try again.');
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [navigate]);

  const validateSessionDetails = (uniqueId) => {
    const { date, time } = sessionDetails[uniqueId] || {};
    const errors = {};

    if (!date) {
      errors.date = 'Please select a date';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(date);
      if (selectedDate < today) {
        errors.date = 'Date cannot be in the past';
      }
    }

    if (!time) {
      errors.time = 'Please select a time';
    } else if (date) {
      const now = new Date();
      const sessionDateTime = new Date(`${date}T${time}`);
      if (sessionDateTime < now) {
        errors.time = 'Time cannot be in the past';
      }
    }

    return errors;
  };

  const sendSessionRequest = async (uniqueId) => {
    const token = localStorage.getItem('token');
    const { date, time } = sessionDetails[uniqueId] || {};
    
    // Find the match again to get skill name based on the uniqueId
    // We check both user._id and match._id to be safe
    const match = matches.find(m => (m.user?._id === uniqueId) || (m._id === uniqueId));
    const skill = match?.teachSkill || 'Unknown Skill';

    const errors = validateSessionDetails(uniqueId);
    
    if (Object.keys(errors).length > 0) {
      setErrorMessages(prev => ({
        ...prev,
        [uniqueId]: errors
      }));
      toast.error('Please fix the errors before sending');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/sessions/request',
        { userId2: uniqueId, sessionDate: date, sessionTime: time, skill },
        { headers: { 'x-auth-token': token } }
      );

      await axios.post(
        'http://localhost:5000/api/notifications/send',
        {
          userId: uniqueId,
          message: `New session request for ${skill} on ${date} at ${time}`,
          type: 'session_request',
        },
        { headers: { 'x-auth-token': token } }
      );

      // Clear form ONLY for this specific card
      setSessionDetails(prev => ({
        ...prev,
        [uniqueId]: { date: '', time: '' }
      }));
      setErrorMessages(prev => ({
        ...prev,
        [uniqueId]: {}
      }));

      toast.success('Session request sent successfully!');
    } catch (err) {
      console.error('Error sending session request:', err);
      toast.error(err.response?.data?.message || 'Error sending session request');
    }
  };

  const handleInputChange = (uniqueId, field, value) => {
    setSessionDetails(prev => ({
      ...prev,
      [uniqueId]: {
        ...prev[uniqueId], // Preserve other fields for this specific card
        [field]: value      // Update the specific field
      }
    }));

    // Clear error when user starts typing for this specific card
    if (value && errorMessages[uniqueId]?.[field]) {
      setErrorMessages(prev => ({
        ...prev,
        [uniqueId]: {
          ...prev[uniqueId],
          [field]: ''
        }
      }));
    }
  };

  const filteredMatches = matches.filter((match) => {
    const userName = match.user?.name?.toLowerCase() || '';
    const skill = match.teachSkill?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    
    return userName.includes(query) || skill.includes(query);
  });

  const formatRating = (rating) => {
    if (typeof rating === 'number' && !isNaN(rating)) {
      return rating.toFixed(1);
    }
    return '0.0';
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 font-sans selection:bg-cyan-500/30">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-20 min-h-[80vh] relative overflow-hidden">
        {/* Rich Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
        <div className="absolute top-[20%] left-[50%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

        {/* Header Section */}
        <div className="text-center mb-16 max-w-4xl mx-auto relative z-10">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-8 text-xs font-bold tracking-[0.2em] text-cyan-300 uppercase rounded-full bg-cyan-950/30 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                Mentor Network
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                Master New Skills <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-sm">
                    With Experts
                </span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
                Connect with professionals who excel in your areas of interest. Schedule sessions, exchange knowledge, and grow faster.
            </p>
        </div>

        {/* Search Bar */}
        <div className="mb-20 max-w-2xl mx-auto relative z-10 group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl opacity-30 group-focus-within:opacity-100 transition duration-500 blur-sm"></div>
          <div className="relative flex items-center bg-[#12161F] rounded-2xl border border-white/5">
            <div className="pl-6 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
              <FaSearch />
            </div>
            <input
              type="text"
              placeholder="Search mentors by name or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-4 px-4 bg-transparent border-0 text-white placeholder-slate-500 focus:ring-0 text-lg"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 relative z-10">
            <div className="relative w-20 h-20 mb-8">
              <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-transparent border-t-purple-500 rounded-full animate-spin reverse"></div>
            </div>
            <p className="text-slate-300 font-medium tracking-wide animate-pulse">Scanning network...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && matches.length === 0 && (
          <div className="text-center py-24 bg-gradient-to-b from-white/5 to-transparent rounded-3xl border border-white/5 max-w-2xl mx-auto backdrop-blur-md relative z-10">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-500 shadow-inner">
              <FaExclamationTriangle className="text-4xl" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">No Matches Found</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              We couldn't find any compatible mentors. Update your skills to help our algorithm find the best match for you.
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(6,182,212,0.4)] font-medium"
            >
              Update Profile
            </button>
          </div>
        )}

        {/* Matches Grid */}
        {!loading && matches.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-10 px-2 relative z-10">
              <h2 className="text-2xl font-bold text-white">Top Mentors</h2>
              <span className="text-sm text-slate-400 font-medium bg-white/5 px-3 py-1 rounded-full border border-white/5">
                <span className="text-cyan-400">{filteredMatches.length}</span> matches found
              </span>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMatches.map((match) => {
                // FIX: Use a robust unique ID strategy to prevent state leaking between cards
                const uniqueId = match.user?._id || match._id;
                
                const userName = match.user?.name || 'Unknown User';
                const userStatus = match.user?.status || 'Available';
                const userSkill = match.teachSkill || 'No skill specified';
                const userRating = ratings[uniqueId] || 0;
                const currentErrors = errorMessages[uniqueId] || {};
                const isAvailable = userStatus.toLowerCase() === 'available';
                
                // Check if form is filled for THIS SPECIFIC card
                const isFormFilled = sessionDetails[uniqueId]?.date && sessionDetails[uniqueId]?.time;
                
                return (
                  <div
                    key={`${uniqueId}-${userSkill}`} // Use combined key to ensure React uniqueness
                    className="group relative bg-[#13161C]/90 backdrop-blur-2xl rounded-3xl border border-white/5 p-7 
                               hover:border-cyan-500/30 hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.15)] 
                               transition-all duration-300 flex flex-col h-full overflow-hidden"
                  >
                    {/* Subtle Card Background Gradient */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/5 to-transparent rounded-bl-full pointer-events-none"></div>

                    {/* User Header */}
                    <div className="flex items-start gap-5 mb-6 relative z-10">
                      <div className="relative flex-shrink-0">
                        <div className="w-18 h-18 rounded-full p-[3px] bg-gradient-to-br from-gray-700 to-gray-900 group-hover:from-cyan-500 group-hover:to-blue-600 transition-colors duration-500">
                          <div className="w-full h-full rounded-full bg-[#0B0E14] overflow-hidden flex items-center justify-center relative border-2 border-[#0B0E14]">
                            {match.user?.profilePicture ? (
                              <img
                                className="w-full h-full object-cover"
                                src={`http://localhost:5000/uploads/profile-pictures/${match.user.profilePicture}`}
                                alt={userName}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = `<span class="text-xl font-bold text-slate-400">${userName.charAt(0)}</span>`;
                                }}
                              />
                            ) : (
                              <span className="text-xl font-bold text-slate-400">{userName.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                        </div>
                        <span className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#0B0E14] shadow-sm ${isAvailable ? 'bg-gradient-to-tr from-emerald-400 to-teal-500' : 'bg-gradient-to-tr from-amber-400 to-orange-500'}`}></span>
                      </div>

                      <div className="flex-1 min-w-0 pt-1">
                        <h3 className="text-xl font-bold truncate text-white mb-1">{userName}</h3>
                        
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center text-amber-300 text-xs space-x-0.5">
                                {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className={`text-[10px] ${i < Math.round(userRating) ? 'drop-shadow-[0_0_2px_rgba(251,191,36,0.5)]' : 'text-slate-700'}`} />
                                ))}
                                <span className="ml-2 text-slate-400 text-xs font-bold">{formatRating(userRating)}</span>
                            </div>
                        </div>
                      </div>
                    </div>

                    {/* Skill Badge */}
                    <div className="mb-6 relative z-10">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-900/40 to-blue-900/40 text-cyan-300 border border-cyan-500/20 text-sm font-semibold shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                            {userSkill}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            isAvailable 
                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                            : 'text-orange-400 bg-orange-500/10 border-orange-500/20'
                        }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-orange-400'}`}></span>
                            {userStatus}
                        </span>
                    </div>

                    {/* Session Scheduling Form */}
                    <div className="mt-auto space-y-4 pt-6 border-t border-white/5 relative z-10">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5 ml-1 uppercase tracking-wider">Session Date</label>
                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <FaCalendarAlt className="text-slate-600 text-xs group-focus-within/input:text-cyan-400 transition-colors" />
                            </div>
                            <input
                            type="date"
                            // FIX: Use uniqueId in state
                            value={sessionDetails[uniqueId]?.date || ''}
                            onChange={(e) => handleInputChange(uniqueId, 'date', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className={`w-full pl-9 pr-3 py-3 bg-[#0B0E14] border rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none transition-all
                                ${currentErrors.date 
                                    ? 'border-red-500/50 text-red-300 focus:ring-1 focus:ring-red-500/50' 
                                    : 'border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20'}`}
                            />
                        </div>
                        {currentErrors.date && (
                          <p className="mt-1.5 text-xs text-red-400 ml-1.5 flex items-center gap-1.5 font-medium">
                            <FaExclamationTriangle className="text-[10px]" />
                            {currentErrors.date}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5 ml-1 uppercase tracking-wider">Session Time</label>
                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <FaClock className="text-slate-600 text-xs group-focus-within/input:text-cyan-400 transition-colors" />
                            </div>
                            <input
                            type="time"
                            // FIX: Use uniqueId in state
                            value={sessionDetails[uniqueId]?.time || ''}
                            onChange={(e) => handleInputChange(uniqueId, 'time', e.target.value)}
                            className={`w-full pl-9 pr-3 py-3 bg-[#0B0E14] border rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none transition-all
                                ${currentErrors.time 
                                    ? 'border-red-500/50 text-red-300 focus:ring-1 focus:ring-red-500/50' 
                                    : 'border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20'}`}
                            />
                        </div>
                        {currentErrors.time && (
                          <p className="mt-1.5 text-xs text-red-400 ml-1.5 flex items-center gap-1.5 font-medium">
                            <FaExclamationTriangle className="text-[10px]" />
                            {currentErrors.time}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => sendSessionRequest(uniqueId)}
                        // FIX: Disabled based on THIS card's uniqueId state only
                        disabled={!isFormFilled}
                        className={`w-full mt-2 py-3.5 px-4 text-sm font-bold rounded-xl tracking-wide transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden
                                     ${!isFormFilled
                                       ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                                       : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-transparent transform hover:-translate-y-0.5'}`}
                      >
                        <span>Send Request</span>
                        <FaPaperPlane className="text-xs" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="!bg-[#13161C] !text-slate-100 !border !border-white/10 !shadow-2xl !rounded-xl !font-sans"
        progressClassName="!bg-gradient-to-r from-cyan-500 to-blue-500"
      />
    </div>
  );
};

export default SkillMatchingPage;