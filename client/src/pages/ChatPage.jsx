import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/navbar/Navbar';
import MessageInput from '../components/chat/MessageInput';
import { useNavigate, useParams } from 'react-router-dom';
import { FiCalendar, FiClock, FiX, FiMenu, FiCheck, FiUser, FiPaperclip, FiSend, FiMoreVertical, FiMessageSquare } from 'react-icons/fi';
import { IoMdWarning, IoMdStar, IoMdVideocam, IoMdCall } from 'react-icons/io';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
import Footer from "../components/footer/Footer";
import Background from "../components/background/Background";
import "../components/background/Background.css";

const ChatPage = () => {
  const { sessionId } = useParams();
  const [connections, setConnections] = useState([]);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // FIX: Helper to find timestamp from different possible field names
  const getSafeTimestamp = (data) => {
    if (!data) return new Date().toISOString();
    // Try common backend field names
    if (data.createdAt) return data.createdAt;
    if (data.timestamp) return data.timestamp;
    if (data.date) return data.date;
    if (data.time) return data.time;
    // Fallback to current time if nothing exists
    return new Date().toISOString();
  };

  // FIX: Formatter that always tries to show time
  const formatMessageTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Check for Invalid Date
    if (isNaN(date.getTime())) return ""; 
    
    // Return HH:MM AM/PM
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Fetch connections
  useEffect(() => {
    const fetchConnections = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/sessions/accepted', {
          headers: { 'x-auth-token': token },
        });
        setConnections(response.data);

        if (sessionId) {
          const connection = response.data.find(
            (conn) => conn._id === sessionId
          );
          setSelectedConnection(connection);
        }
      } catch (err) {
        console.error('Error fetching connections:', err);
      }
    };
    fetchConnections();
  }, [sessionId]);

  // Setup socket
  useEffect(() => {
    if (!sessionId) return;

    const socketIo = io('http://localhost:5000/sessions', {
      transports: ['websocket'],
      query: { sessionId },
    });

    socketIo.on('receive_message', (data) => {
      if (data.sender && data.receiver) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...data,
            // FIX: Use helper to get correct timestamp
            createdAt: getSafeTimestamp(data),
            senderName: data.sender.name,
            receiverName: data.receiver.name,
          },
        ]);
      }
    });

    setSocket(socketIo);
    return () => socketIo.disconnect();
  }, [sessionId]);

  // Fetch messages
  useEffect(() => {
    if (selectedConnection) {
      const fetchMessages = async () => {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get(
            `http://localhost:5000/api/sessions/message/${selectedConnection._id}`,
            { headers: { 'x-auth-token': token } }
          );

          const updatedMessages = response.data.map((msg) => ({
            ...msg,
            // FIX: Ensure we capture the timestamp from loaded messages
            createdAt: getSafeTimestamp(msg),
            senderName: msg.senderId?.name || 'Unknown',
            receiverName: msg.receiverId?.name || 'Unknown',
          }));

          setMessages(updatedMessages);
        } catch (err) {
          console.error('Error fetching messages:', err);
        }
      };
      fetchMessages();
    }
  }, [selectedConnection]);

  const handleSelectConnection = (connection) => {
    setSelectedConnection(connection);
    navigate(`/chat/${connection._id}`);
    setIsMenuOpen(false);
  };

  const handleSendMessage = (message, file) => {
    if (selectedConnection?.status === 'completed' || selectedConnection?.status === 'canceled') {
      alert('Cannot send messages for completed/canceled sessions.');
      return;
    }

    if (message.trim() === '' && !file) return;

    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));

    const formData = new FormData();
    formData.append('sessionId', selectedConnection._id);
    formData.append('content', message);
    if (file) formData.append('file', file);

    socket?.emit('send_message', {
      sessionId: selectedConnection._id,
      content: message,
      senderId: userData?._id,
      receiverId: selectedConnection.userId1._id === userData?._id 
        ? selectedConnection.userId2._id 
        : selectedConnection.userId1._id,
      file: file,
    });

    axios.post('http://localhost:5000/api/sessions/message', formData, {
      headers: { 'x-auth-token': token },
    }).catch(err => console.error('Error sending message:', err));
  };

  const openScheduleModal = () => setIsScheduleModalOpen(true);
  const closeScheduleModal = () => setIsScheduleModalOpen(false);
  const openFeedbackModal = () => setIsFeedbackModalOpen(true);
  const closeFeedbackModal = () => setIsFeedbackModalOpen(false);
  const openReportModal = () => setIsReportModalOpen(true);
  const closeReportModal = () => setIsReportModalOpen(false);

  const handleScheduleSession = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/sessions/schedule', {
        sessionId,
        newMeetingDate: scheduledDate,
        newMeetingTime: scheduledTime,
      }, { headers: { 'x-auth-token': token } });
      closeScheduleModal();
      alert('Meeting scheduled successfully!');
    } catch (error) {
      console.error('Error scheduling session:', error);
      alert('Failed to schedule meeting.');
    }
  };

  const handleMarkSession = async (status) => {
    try {
      const token = localStorage.getItem('token');
      if (!feedback) {
        alert('Please provide feedback before marking session.');
        return;
      }

      await axios.post('http://localhost:5000/api/sessions/mark-session', {
        sessionId,
        status,
        rating,
        feedback,
      }, { headers: { 'x-auth-token': token } });

      setIsFeedbackModalOpen(false);
      alert(`Session marked as ${status}`);
    } catch (error) {
      console.error('Error marking session:', error);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const sessionId = selectedConnection._id;
    const targetUser = selectedConnection.userId1._id === loggedInUser._id
      ? selectedConnection.userId2._id
      : selectedConnection.userId1._id;

    const formData = new FormData();
    formData.append('reason', reason);
    formData.append('description', description);
    formData.append('reporter', loggedInUser._id);
    formData.append('targetUser', targetUser);
    formData.append('session', sessionId);
    if (screenshot) formData.append('screenshot', screenshot);

    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/reports', formData, {
        headers: { 'x-auth-token': token },
      });
      alert('Report submitted successfully!');
      closeReportModal();
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error submitting report.');
    }
  };

  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const isUser1 = selectedConnection?.userId1?._id === loggedInUser?._id;
  const isUser2 = selectedConnection?.userId2?._id === loggedInUser?._id;
  const isFeedbackGivenByLoggedInUser = isUser1
    ? selectedConnection?.feedbackByUser1
    : isUser2
    ? selectedConnection?.feedbackByUser2
    : false;

  const bothUsersProvidedFeedback = selectedConnection?.feedbackByUser1 && selectedConnection?.feedbackByUser2;
  const isSessionCompletedOrCanceled = selectedConnection?.status === 'completed' || selectedConnection?.status === 'canceled';
  const isChatBlocked = isSessionCompletedOrCanceled && bothUsersProvidedFeedback;
  const shouldShowFeedbackModal = !isFeedbackGivenByLoggedInUser && !isChatBlocked;
  const shouldShowScheduleButton = !isSessionCompletedOrCanceled && !bothUsersProvidedFeedback;

  const getOtherUserName = (connection) => {
    if (!connection) return 'Unknown';
    const user1Name = connection.userId1?.name || 'Unknown';
    const user2Name = connection.userId2?.name || 'Unknown';
    return connection.userId1?._id === loggedInUser._id ? user2Name : user1Name;
  };

  const getChatUserName = () => {
    if (!selectedConnection || !selectedConnection.userId1 || !selectedConnection.userId2) return 'Unknown';
    const user1Name = selectedConnection.userId1?.name || 'Unknown';
    const user2Name = selectedConnection.userId2?.name || 'Unknown';
    return selectedConnection.userId1._id === loggedInUser._id ? user2Name : user1Name;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-emerald-500';
      case 'completed': return 'bg-blue-500';
      case 'canceled': return 'bg-rose-500';
      default: return 'bg-slate-500';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      case 'canceled': return 'Canceled';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-hidden relative">
      <Background />
      
      <div className="relative z-10 flex flex-col h-screen">
        <Navbar />
        
        {/* Mobile Header */}
        <div className="md:hidden bg-slate-900/80 backdrop-blur-md border-b border-white/5 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition"
            >
              <FiMenu size={24} />
            </button>
            {selectedConnection && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold">
                  {getChatUserName().charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{getChatUserName()}</h3>
                  <p className="text-xs text-emerald-400">Online</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar (Connections) */}
          <AnimatePresence>
            {(isMenuOpen || window.innerWidth >= 768) && (
              <>
                {/* Backdrop for mobile */}
                {isMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMenuOpen(false)}
                  />
                )}
                
                <motion.aside 
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className={`
                    fixed md:relative top-0 left-0 h-full w-80 z-50
                    bg-slate-900/80 backdrop-blur-xl border-r border-white/5
                    flex flex-col transition-transform duration-300
                  `}
                >
                  {/* Sidebar Header */}
                  <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                      Messages
                    </h2>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  </div>

                  {/* Connections List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {connections.length > 0 ? (
                      connections.map((connection) => {
                        const isSelected = selectedConnection && selectedConnection._id === connection._id;
                        return (
                          <motion.div
                            key={connection._id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelectConnection(connection)}
                            className={`
                              p-4 rounded-xl cursor-pointer transition-all duration-200 group relative overflow-hidden
                              ${isSelected 
                                ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30' 
                                : 'bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/10'
                              }
                            `}
                          >
                            {isSelected && <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none"></div>}
                            
                            <div className="flex items-center gap-3 relative z-10">
                              <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-lg font-bold text-white group-hover:border-blue-500/50 transition-colors">
                                  {getOtherUserName(connection).charAt(0)}
                                </div>
                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${getStatusColor(connection.status)}`}></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                  <h3 className={`font-semibold truncate ${isSelected ? 'text-blue-100' : 'text-slate-200'}`}>
                                    {getOtherUserName(connection)}
                                  </h3>
                                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-blue-500/20 text-blue-300' : 'bg-white/10 text-slate-400'}`}>
                                    {getStatusText(connection.status)}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 truncate">
                                  Skill: <span className="text-slate-400">{connection.skill}</span>
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    ) : (
                      <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                        <FiUser size={32} className="mb-3 opacity-50" />
                        <p className="text-sm">No active connections</p>
                      </div>
                    )}
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-slate-900/40 backdrop-blur-sm relative">
            {selectedConnection ? (
              <>
                {/* Chat Header */}
                <div className="h-20 px-6 border-b border-white/5 bg-slate-900/80 flex items-center justify-between backdrop-blur-md sticky top-0 z-30">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/20">
                        {getChatUserName().charAt(0)}
                      </div>
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight">{getChatUserName()}</h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                          {selectedConnection.skill}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(selectedConnection.status)} bg-opacity-20`}>
                          {getStatusText(selectedConnection.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {shouldShowScheduleButton && (
                      <button
                        onClick={openScheduleModal}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                        title="Schedule Meeting"
                      >
                        <FiCalendar />
                      </button>
                    )}
                    <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-emerald-400 transition-all">
                      <IoMdVideocam size={20} />
                    </button>
                    <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-emerald-400 transition-all">
                      <IoMdCall size={20} />
                    </button>
                    <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all">
                      <FiMoreVertical />
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  {messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((msg, index) => {
                        const isOwnMessage = msg.senderId?._id === loggedInUser._id;
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`
                              max-w-[70%] relative group
                              ${isOwnMessage ? 'order-1' : 'order-2'}
                            `}>
                              <div className={`
                                px-5 py-3 shadow-lg text-[15px] leading-relaxed
                                ${isOwnMessage
                                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl rounded-tr-sm border border-blue-500/20'
                                  : 'bg-slate-800 text-slate-200 rounded-2xl rounded-tl-sm border border-white/5'
                                }
                              `}>
                                {!isOwnMessage && (
                                  <p className="text-xs font-bold text-blue-400 mb-1">{msg.senderName}</p>
                                )}
                                <div className="break-words">
                                  <span dangerouslySetInnerHTML={{ __html: msg.content }} />
                                </div>
                                
                                {/* Media Attachments */}
                                {msg.mediaType === 'image' && (
                                  <img 
                                    src={msg.mediaUrl} 
                                    alt="shared" 
                                    className="mt-2 rounded-lg max-w-[200px] border border-white/10 shadow-sm"
                                  />
                                )}
                                {msg.mediaType === 'audio' && (
                                  <div className="mt-2">
                                    <audio controls className="h-8">
                                      <source src={msg.mediaUrl} />
                                    </audio>
                                  </div>
                                )}
                                {msg.mediaType === 'video' && (
                                  <video controls className="mt-2 rounded-lg w-full max-w-[250px] border border-white/10 shadow-sm">
                                    <source src={msg.mediaUrl} />
                                  </video>
                                )}
                                
                                {/* Timestamp & Status - Shows Time Only */}
                                <div className={`flex items-center gap-1 mt-1 opacity-60 text-[10px] ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                                  {formatMessageTime(msg.createdAt)}
                                  {isOwnMessage && <FiCheck size={10} className="text-blue-200" />}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500">
                      <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-white/5">
                        <FiPaperclip size={32} className="opacity-50" />
                      </div>
                      <p className="text-lg font-medium text-slate-400">No messages yet</p>
                      <p className="text-sm mt-1 opacity-60">Start the conversation by saying hello!</p>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                {!isChatBlocked && (
                  <div className="p-6 bg-slate-900/60 backdrop-blur-xl border-t border-white/5">
                    <MessageInput sendMessage={handleSendMessage} />
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      {/* Quick Actions Row */}
                      {shouldShowScheduleButton && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={openScheduleModal}
                          className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 border border-white/10 rounded-full text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
                        >
                          <FiCalendar size={14} />
                          Schedule Meeting
                        </motion.button>
                      )}
                      {!isSessionCompletedOrCanceled && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={openFeedbackModal}
                            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 border border-white/10 rounded-full text-sm text-slate-300 hover:bg-slate-700 hover:text-yellow-400 transition-all shadow-sm"
                            >
                            <IoMdStar size={14} />
                            Leave Feedback
                          </motion.button>
                        </>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={openReportModal}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 border border-white/10 rounded-full text-sm text-slate-300 hover:bg-slate-700 hover:text-rose-400 transition-all shadow-sm"
                      >
                        <IoMdWarning size={14} />
                        Report User
                      </motion.button>
                    </div>
                  </div>
                )}

                {isChatBlocked && (
                  <div className="p-8 bg-slate-900/80 backdrop-blur-xl border-t border-white/5 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-800 rounded-full mb-3">
                      <FiCheck className="text-emerald-500" size={20} />
                    </div>
                    <h3 className="font-semibold text-white">Session Completed</h3>
                    <p className="text-sm text-slate-400 mt-1">This conversation has ended.</p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full flex items-center justify-center mb-6 border border-white/5">
                  <FiMessageSquare className="text-slate-400" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-300 mb-2">Select a Connection</h3>
                <p className="text-sm text-center max-w-md text-slate-500">
                  Choose a skill exchange session from your sidebar to start chatting.
                </p>
                <button 
                  onClick={() => navigate('/')}
                  className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors"
                >
                  Back to Home
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Feedback Modal */}
      <AnimatePresence>
        {isFeedbackModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeFeedbackModal}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-amber-500"></div>
              
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-white">Rate Experience</h3>
                <button onClick={closeFeedbackModal} className="p-1 text-slate-400 hover:text-white transition"><FiX size={20} /></button>
              </div>

              <div className="flex justify-center gap-3 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(star)}
                    className="text-3xl focus:outline-none transition-colors duration-200"
                  >
                    {star <= rating ? (
                      <IoMdStar className="text-yellow-400 fill-current drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
                    ) : (
                      <IoMdStar className="text-slate-600 hover:text-slate-400" />
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Your thoughts</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="How was the session?"
                  rows="3"
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/50 outline-none transition resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeFeedbackModal}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleMarkSession('completed')}
                  className="flex-1 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white rounded-xl font-bold shadow-lg shadow-yellow-900/20 transition"
                >
                  Submit & Complete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Schedule Modal */}
      <AnimatePresence>
        {isScheduleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeScheduleModal}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-6">Schedule Meeting</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Time</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={closeScheduleModal}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScheduleSession}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Report Modal */}
      <AnimatePresence>
        {isReportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeReportModal}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-rose-400 mb-6">Report User</h3>
              
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Reason</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 outline-none transition appearance-none"
                  >
                    <option value="" className="bg-slate-900">Select a reason</option>
                    <option value="Spam" className="bg-slate-900">Spam or harassment</option>
                    <option value="Inappropriate Content" className="bg-slate-900">Inappropriate content</option>
                    <option value="Safety Concerns" className="bg-slate-900">Safety concerns</option>
                    <option value="Other" className="bg-slate-900">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the issue..."
                    required
                    rows="3"
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 outline-none transition resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Screenshot (Optional)</label>
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer relative">
                    <input
                      type="file"
                      onChange={(e) => setScreenshot(e.target.files[0])}
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    {screenshot ? (
                      <p className="text-emerald-400 text-sm font-medium">{screenshot.name}</p>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <FiPaperclip className="text-slate-400" />
                        <p className="text-xs text-slate-500">Click to upload screenshot</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={closeReportModal}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-900/20 transition"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default ChatPage;