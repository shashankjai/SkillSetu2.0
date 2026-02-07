import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUsers, FaChartBar, FaFlag, FaUserShield, FaBolt, FaSignOutAlt } from 'react-icons/fa';

const AdminSideBar = () => {
  const navigate = useNavigate();
  
  const navItems = [
    { to: 'users', label: 'Users', icon: FaUsers },
    { to: 'reports', label: 'Reports', icon: FaFlag },
    { to: 'analytics', label: 'Analytics', icon: FaChartBar },
    { to: 'engagement-analytics', label: 'Engagement Stats', icon: FaBolt },
    { to: 'profile', label: 'Profile', icon: FaUserShield },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-700 p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        <p className="text-slate-400 text-sm">SkillSetu Administration</p>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`
            }
          >
            <item.icon />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="mt-8 pt-6 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 w-full text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <FaSignOutAlt />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSideBar;
