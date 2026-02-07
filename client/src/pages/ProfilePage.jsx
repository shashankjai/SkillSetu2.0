// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom'; // Import ReactDOM for Portal
import axios from "axios";
import Navbar from "../components/navbar/Navbar";
import NotificationBell from "../components/NotificationBell";
import { FiEdit, FiCalendar, FiClock, FiLoader } from "react-icons/fi";
import { FaLinkedin, FaGithub, FaTwitter, FaInstagram, FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { setNotifications } from "../redux/slices/notificationSlice";
import Background from "../components/background/Background";
import "../components/background/background.css";
import Footer from "../components/footer/Footer";
import defaultAvatar from "../assets/avatar.jpeg";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [skillsToTeach, setSkillsToTeach] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]);
  const [modalTeach, setModalTeach] = useState("");
  const [modalLearn, setModalLearn] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingSessions, setPendingSessions] = useState([]);
  const [acceptedSessions, setAcceptedSessions] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [canceledSessions, setCanceledSessions] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Formatters
  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });

  // Fetch profile & notifications
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/users/profile",
          { headers: { "x-auth-token": token } }
        );
        setUser(data);
        setSkillsToTeach(data.skillsToTeach || []);
        setSkillsToLearn(data.skillsToLearn || []);

        const notifRes = await axios.get(
          `http://localhost:5000/api/notifications/${data._id}`,
          { headers: { "x-auth-token": token } }
        );
        dispatch(setNotifications(notifRes.data));
      } catch (err) {
        console.error(err);
        setError("Failed to load profile or notifications.");
      }
    };
    fetchUserProfile();
  }, [dispatch]);

  // Fetch sessions
  useEffect(() => {
    const fetchSessions = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const [p, a, co, c] = await Promise.all([
          axios.get("http://localhost:5000/api/sessions/pending", {
            headers: { "x-auth-token": token },
          }),
          axios.get("http://localhost:5000/api/sessions/acceptedOnly", {
            headers: { "x-auth-token": token },
          }),
          axios.get("http://localhost:5000/api/sessions/completed", {
            headers: { "x-auth-token": token },
          }),
          axios.get("http://localhost:5000/api/sessions/canceled", {
            headers: { "x-auth-token": token },
          }),
        ]);

        const now = new Date();
        setPendingSessions(
          p.data.filter((session) => new Date(session.sessionDate) >= now)
        );
        setAcceptedSessions(a.data);
        setCompletedSessions(co.data);
        setCanceledSessions(c.data);
      } catch (err) {
        console.error(err);
        setError("Error fetching sessions");
      }
    };
    fetchSessions();
  }, []);

  // Modal handlers
  const openModal = () => {
    setModalTeach(skillsToTeach.join(", "));
    setModalLearn(skillsToLearn.join(", "));
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError("");
    setSuccess("");
  };

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/users/profile",
        {
          name: user.name,
          status: user.status,
          socials: user.socials,
          skillsToTeach: modalTeach.split(",").map((s) => s.trim()).filter(s => s !== ""),
          skillsToLearn: modalLearn.split(",").map((s) => s.trim()).filter(s => s !== ""),
        },
        { headers: { "x-auth-token": token } }
      );
      setUser(data);
      setSkillsToTeach(data.skillsToTeach);
      setSkillsToLearn(data.skillsToLearn);
      setSuccess("Profile updated successfully!");
      closeModal();
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
    }
  };

  // Session actions
  const handleAccept = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/sessions/accept",
        { sessionId: id },
        { headers: { "x-auth-token": token } }
      );
      setPendingSessions((ps) => ps.filter((s) => s._id !== id));
      setAcceptedSessions((as) => [...as, res.data.session]);
      setSuccess("Session accepted");
    } catch {
      setError("Failed to accept session.");
    }
  };
  const handleStartChat = (id) => navigate(`/chat/${id}`);

  const getSessionPartnerName = (session) => {
    const partner =
      session.userId1?._id === user?._id ? session.userId2 : session.userId1;
    return partner?.name ?? "Unknown User";
  };

  // Calculate total stats for percentages
  const totalSessions = 
    pendingSessions.length + 
    acceptedSessions.length + 
    completedSessions.length + 
    canceledSessions.length;

  // Show loading state
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
        <Background />
        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <FiLoader size={48} className="text-violet-500 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
          </motion.div>
          <p className="mt-4 text-slate-400 font-medium">Loading Profile...</p>
        </div>
      </div>
    );
  }

  // --- Notification Component (Will be rendered via Portal) ---
  const NotificationToast = () => (
    <AnimatePresence>
      {(success || error) && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          // Updated styles: White background, removed 'text-white' from container
          className={`fixed top-28 right-6 z-[99999] min-w-[320px] max-w-sm p-4 rounded-xl shadow-2xl border-l-4 flex items-start gap-3 backdrop-blur-xl bg-white ${
            success 
              ? "border-emerald-500" 
              : "border-red-500"
          }`}
        >
          <div className={`p-2 rounded-full text-white shadow-md ${
            success ? 'bg-emerald-500' : 'bg-red-500'
          }`}>
             {success ? "✓" : "!"}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm mb-1 text-slate-900">
              {success ? "Success" : "Error"}
            </h4>
            <p className="text-sm text-slate-600 leading-snug">
              {success || error}
            </p>
          </div>
          <button 
            onClick={() => { setSuccess(""); setError(""); }}
            className="text-slate-400 hover:text-slate-900 transition"
          >
            <FiEdit className="rotate-45" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen text-slate-200 bg-slate-950 selection:bg-fuchsia-500 selection:text-white">
      <Background />
      <div className="relative z-10">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* --- SECTION 1: PROFILE HEADER & STATS --- */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* User Card */}
              <div className="lg:col-span-1 bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700 p-8 flex flex-col items-center text-center relative overflow-hidden group">
                {/* Decorative gradient blob */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-violet-600 to-indigo-600 opacity-90 shadow-[0_4px_20px_rgba(124,58,237,0.3)]"></div>
                
                <div className="absolute top-4 right-4 flex space-x-2">
                   <NotificationBell />
                </div>

                <div className="relative mt-16 mb-4">
                  <div className="w-32 h-32 rounded-full p-1 bg-slate-950 shadow-[0_0_20px_rgba(99,102,241,0.3)] border-2 border-slate-700">
                    <img
                      src={
                        user?.profilePicture
                          ? `http://localhost:5000/uploads/profile-pictures/${user.profilePicture}`
                          : defaultAvatar
                      }
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <button
                    onClick={() => navigate("/profile-settings")}
                    className="absolute bottom-0 right-0 bg-slate-700 text-cyan-400 p-2 rounded-full shadow-md hover:bg-slate-600 transition border border-slate-600"
                    title="Edit Profile Details"
                  >
                    <FiEdit size={16} />
                  </button>
                </div>

                <h2 className="text-2xl font-bold text-white mt-2 tracking-tight">
                  {user?.name}
                </h2>
                
                {user?.status && (
                  <p className="text-cyan-300 font-medium text-sm bg-cyan-950/50 px-3 py-1 rounded-full mt-2 inline-block border border-cyan-800/50 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                    {user.status}
                  </p>
                )}

                <div className="flex space-x-4 mt-6 justify-center">
                  {user?.socials?.linkedin && (
                    <a href={user.socials.linkedin} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-[#0077b5] transition transform hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(0,119,181,0.6)]">
                      <FaLinkedin size={24} />
                    </a>
                  )}
                  {user?.socials?.facebook && (
                    <a href={user.socials.facebook} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-600 transition transform hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(37,99,235,0.6)]">
                      <FaFacebook size={24} />
                    </a>
                  )}
                  {user?.socials?.twitter && (
                    <a href={user.socials.twitter} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-pink-500 transition transform hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]">
                      <FaTwitter size={24} />
                    </a>
                  )}
                  {user?.socials?.github && (
                    <a href={user.socials.github} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition transform hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                      <FaGithub size={24} />
                    </a>
                  )}
                </div>
              </div>

              {/* Stats Dashboard */}
              <div className="lg:col-span-2 bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700 p-6 flex flex-col justify-center">
                <h3 className="text-lg font-semibold text-slate-200 mb-6 border-b pb-2 border-slate-800 flex items-center gap-2">
                    <span className="w-2 h-6 bg-violet-500 rounded-full"></span>
                    Session Overview
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
                  {/* Completed */}
                  <div className="flex flex-col items-center group">
                    <div className="w-20 h-20 md:w-24 md:h-24 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                      <CircularProgressbar
                        value={totalSessions ? (completedSessions.length / totalSessions) * 100 : 0}
                        text={`${completedSessions.length}`}
                        styles={buildStyles({
                          textSize: "28px",
                          textColor: "#e2e8f0", 
                          pathColor: "#10b981", 
                          trailColor: "#1e293b",
                        })}
                      />
                    </div>
                    <span className="mt-2 text-sm font-medium text-slate-400 group-hover:text-emerald-400 transition">Completed</span>
                  </div>

                  {/* Pending */}
                  <div className="flex flex-col items-center group">
                    <div className="w-20 h-20 md:w-24 md:h-24 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">
                      <CircularProgressbar
                        value={totalSessions ? (pendingSessions.length / totalSessions) * 100 : 0}
                        text={`${pendingSessions.length}`}
                        styles={buildStyles({
                          textSize: "28px",
                          textColor: "#e2e8f0",
                          pathColor: "#f59e0b", 
                          trailColor: "#1e293b",
                        })}
                      />
                    </div>
                    <span className="mt-2 text-sm font-medium text-slate-400 group-hover:text-amber-400 transition">Pending</span>
                  </div>

                  {/* Upcoming */}
                  <div className="flex flex-col items-center group">
                    <div className="w-20 h-20 md:w-24 md:h-24 filter drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">
                      <CircularProgressbar
                        value={totalSessions ? (acceptedSessions.length / totalSessions) * 100 : 0}
                        text={`${acceptedSessions.length}`}
                        styles={buildStyles({
                          textSize: "28px",
                          textColor: "#e2e8f0",
                          pathColor: "#3b82f6", 
                          trailColor: "#1e293b",
                        })}
                      />
                    </div>
                    <span className="mt-2 text-sm font-medium text-slate-400 group-hover:text-blue-400 transition">Upcoming</span>
                  </div>

                  {/* Canceled */}
                  <div className="flex flex-col items-center group">
                    <div className="w-20 h-20 md:w-24 md:h-24 filter drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]">
                      <CircularProgressbar
                        value={totalSessions ? (canceledSessions.length / totalSessions) * 100 : 0}
                        text={`${canceledSessions.length}`}
                        styles={buildStyles({
                          textSize: "28px",
                          textColor: "#e2e8f0",
                          pathColor: "#ef4444", 
                          trailColor: "#1e293b",
                        })}
                      />
                    </div>
                    <span className="mt-2 text-sm font-medium text-slate-400 group-hover:text-red-400 transition">Canceled</span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- SECTION 2: SKILLS & SESSIONS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Skills Card */}
              <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700 p-6 flex flex-col h-[500px]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-6 bg-fuchsia-500 rounded-full"></span>
                    Skills & Interests
                  </h3>
                  <button 
                    onClick={openModal}
                    className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-fuchsia-400 transition"
                  >
                    <FiEdit size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                  
                  {/* Teaching */}
                  <div>
                    <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3 drop-shadow-[0_0_2px_rgba(34,211,238,0.5)]">Teaching</h4>
                    <div className="flex flex-wrap gap-2">
                      {skillsToTeach.length > 0 ? (
                        skillsToTeach.flatMap((skill) => skill.split(",").map((s) => s.trim()))
                        .filter(s => s)
                        .map((s, i) => (
                          <span
                            key={i}
                            className="relative overflow-hidden px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-bold border border-cyan-400/30 shadow-[0_4px_10px_rgba(6,182,212,0.3)] hover:scale-105 hover:shadow-[0_6px_15px_rgba(6,182,212,0.5)] transition duration-300"
                          >
                            {s}
                          </span>
                        ))
                      ) : (
                        <p className="text-slate-500 text-sm italic">No skills added yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Learning */}
                  <div>
                    <h4 className="text-sm font-bold text-fuchsia-400 uppercase tracking-wider mb-3 drop-shadow-[0_0_2px_rgba(232,121,249,0.5)]">Learning</h4>
                    <div className="flex flex-wrap gap-2">
                      {skillsToLearn.length > 0 ? (
                        skillsToLearn.flatMap((skill) => skill.split(",").map((s) => s.trim()))
                        .filter(s => s)
                        .map((s, i) => (
                          <span
                            key={i}
                            className="relative overflow-hidden px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-xl text-sm font-bold border border-fuchsia-400/30 shadow-[0_4px_10px_rgba(217,70,239,0.3)] hover:scale-105 hover:shadow-[0_6px_15px_rgba(217,70,239,0.5)] transition duration-300"
                          >
                            {s}
                          </span>
                        ))
                      ) : (
                        <p className="text-slate-500 text-sm italic">No interests added yet.</p>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              {/* Sessions Card */}
              <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700 p-6 flex flex-col h-[500px]">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                    Sessions Manager
                </h3>
                
                {/* Tabs */}
                <div className="flex p-1 bg-slate-800 rounded-lg mb-4 border border-slate-700">
                  {["pending", "upcoming", "completed", "canceled"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${
                        activeTab === tab
                          ? "bg-slate-700 text-white shadow-md ring-1 ring-white/10"
                          : "text-slate-500 hover:text-slate-300 hover:bg-slate-700/50"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {(activeTab === "pending"
                    ? pendingSessions
                    : activeTab === "upcoming"
                    ? acceptedSessions
                    : activeTab === "completed"
                    ? completedSessions
                    : canceledSessions
                  ).length > 0 ? (
                    (activeTab === "pending"
                      ? pendingSessions
                      : activeTab === "upcoming"
                      ? acceptedSessions
                      : activeTab === "completed"
                      ? completedSessions
                      : canceledSessions
                    ).map((s) => (
                      <motion.div
                        key={s._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`bg-slate-800/50 border-b-4 rounded-xl p-4 shadow-sm hover:bg-slate-800 transition border-l-0 ${
                           activeTab === "pending" ? "border-yellow-500" :
                           activeTab === "upcoming" ? "border-blue-500" :
                           activeTab === "completed" ? "border-emerald-500" : "border-red-500"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-3">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md border border-white/10 ${
                               activeTab === "pending" ? "bg-gradient-to-br from-yellow-400 to-orange-500" :
                               activeTab === "upcoming" ? "bg-gradient-to-br from-blue-400 to-indigo-500" :
                               activeTab === "completed" ? "bg-gradient-to-br from-emerald-400 to-green-500" : "bg-gradient-to-br from-red-400 to-rose-500"
                            }`}>
                              {getSessionPartnerName(s)
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-100">
                                {getSessionPartnerName(s)}
                              </p>
                              <p className="text-xs text-blue-300 font-medium bg-blue-900/30 px-2 py-0.5 rounded inline-block mt-0.5 border border-blue-500/20">
                                {s.skill}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-700">
                            {formatDate(s.sessionDate)}
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 text-xs text-slate-400 mb-3 ml-11">
                          <div className="flex items-center space-x-1">
                            <FiClock size={12} />
                            <span>{formatTime(s.sessionDate)}</span>
                          </div>
                        </div>

                        <div className="ml-11">
                          <button
                            onClick={() =>
                              activeTab === "pending"
                                ? handleAccept(s._id)
                                : handleStartChat(s._id)
                            }
                            className={`w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition transform active:scale-95 shadow-lg ${
                              activeTab === "pending"
                                ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white"
                                : activeTab === "upcoming"
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white"
                                : "bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600"
                            }`}
                          >
                            {activeTab === "pending"
                              ? "Accept Request"
                              : activeTab === "upcoming"
                              ? "Open Chat Room"
                              : "View Details"}
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                      <FiCalendar size={32} className="mb-2 opacity-30" />
                      <p className="text-sm">No {activeTab} sessions found.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </main>

        {/* Edit Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-700"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", duration: 0.3 }}
              >
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-white">Update Skills</h2>
                  <button onClick={closeModal} className="text-white/80 hover:text-white transition bg-black/20 hover:bg-black/30 rounded-full p-1">
                    ✕
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-cyan-300 mb-2">
                      Skills to Teach <span className="text-xs font-normal text-slate-500">(comma separated)</span>
                    </label>
                    <input
                      type="text"
                      value={modalTeach}
                      onChange={(e) => setModalTeach(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition text-white placeholder-slate-500 shadow-inner"
                      placeholder="e.g. JavaScript, Guitar, Cooking"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-fuchsia-300 mb-2">
                      Skills to Learn <span className="text-xs font-normal text-slate-500">(comma separated)</span>
                    </label>
                    <input
                      type="text"
                      value={modalLearn}
                      onChange={(e) => setModalLearn(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition text-white placeholder-slate-500 shadow-inner"
                      placeholder="e.g. React, Piano, French"
                    />
                  </div>
                </div>

                <div className="bg-slate-900 px-6 py-4 flex justify-end space-x-3 border-t border-slate-800">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-slate-300 font-medium hover:bg-slate-800 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-900/40 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Footer />
      </div>
      
      {/* --- PORTAL FOR NOTIFICATION --- */}
      {/* This renders the notification outside the app structure to ensure visibility */}
      {ReactDOM.createPortal(
        <NotificationToast />,
        document.body
      )}

      {/* Custom scrollbar styles for Dark Mode */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(100, 116, 139, 0.5); /* Slate-500 with opacity */
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(148, 163, 184, 0.8); /* Slate-400 with opacity */
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
