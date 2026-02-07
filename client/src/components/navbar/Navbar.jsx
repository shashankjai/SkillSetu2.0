import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Home, User, Users, MessageSquare, Info, Shield, LogOut, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(localStorage.getItem('user')) : null;
  const isAdmin = user?.role === 'admin';
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium ${
      isActive
        ? 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-500 shadow-inner'
        : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
      isActive
        ? 'bg-blue-900/30 text-blue-300 border-l-4 border-blue-500'
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/95 border-b border-gray-800 backdrop-blur-sm shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink 
            to="/" 
            className="flex items-center gap-3 text-xl font-bold"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">SS</span>
            </div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              SkillSetu
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" className={navLinkClass}>
              <Home size={18} className="opacity-80" />
              <span>Home</span>
            </NavLink>

            {token ? (
              <>
                <NavLink to="/profile" className={navLinkClass}>
                  <User size={18} className="opacity-80" />
                  <span>Profile</span>
                </NavLink>
                
                <NavLink to="/skill-matching" className={navLinkClass}>
                  <Users size={18} className="opacity-80" />
                  <span>Matching</span>
                </NavLink>
                
                <NavLink to="/chat" className={navLinkClass}>
                  <MessageSquare size={18} className="opacity-80" />
                  <span>Chat</span>
                </NavLink>
                
                <NavLink to="/about-us" className={navLinkClass}>
                  <Info size={18} className="opacity-80" />
                  <span>About</span>
                </NavLink>

                {isAdmin && (
                  <NavLink to="/admin" className={navLinkClass}>
                    <Shield size={18} className="opacity-80" />
                    <span>Admin</span>
                  </NavLink>
                )}

                <div className="h-6 w-px bg-gray-700 mx-2"></div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600/90 to-red-700/90 text-white rounded-lg hover:from-red-700 hover:to-red-800 font-medium transition-all duration-200 shadow-lg hover:shadow-red-900/30 border border-red-800/30"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  <LogIn size={18} className="opacity-80" />
                  <span>Login</span>
                </NavLink>
                
                <NavLink 
                  to="/register" 
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 font-medium transition-all duration-200 shadow-lg hover:shadow-blue-900/30 border border-blue-500/30"
                >
                  <UserPlus size={18} />
                  <span>Sign Up</span>
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none transition-colors duration-200 border border-gray-700"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden mt-2 pb-4 border-t border-gray-800 pt-4 bg-gray-900/95 backdrop-blur-sm rounded-b-lg">
            <div className="flex flex-col space-y-2">
              <NavLink to="/" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
                <Home size={20} />
                <span>Home</span>
              </NavLink>

              {token ? (
                <>
                  <NavLink to="/profile" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
                    <User size={20} />
                    <span>Profile</span>
                  </NavLink>
                  
                  <NavLink to="/skill-matching" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
                    <Users size={20} />
                    <span>Skill Matching</span>
                  </NavLink>
                  
                  <NavLink to="/chat" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
                    <MessageSquare size={20} />
                    <span>Chat</span>
                  </NavLink>
                  
                  <NavLink to="/about-us" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
                    <Info size={20} />
                    <span>About Us</span>
                  </NavLink>

                  {isAdmin && (
                    <NavLink to="/admin" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
                      <Shield size={20} />
                      <span>Admin Dashboard</span>
                    </NavLink>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 bg-red-900/20 text-red-300 rounded-lg hover:bg-red-900/30 font-medium transition-colors duration-200 mt-4 border border-red-800/30"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
                    <LogIn size={20} />
                    <span>Login</span>
                  </NavLink>
                  
                  <NavLink 
                    to="/register" 
                    className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium transition-colors duration-200 mt-2 border border-blue-500/30"
                    onClick={() => setMenuOpen(false)}
                  >
                    <UserPlus size={20} />
                    <span>Sign Up</span>
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;