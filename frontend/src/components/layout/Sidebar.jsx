import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaChartLine, FaBriefcase, FaSearch, FaEye, FaHistory,
  FaGraduationCap, FaBell, FaUser, FaSignOutAlt, FaBars,
  FaTachometerAlt
} from 'react-icons/fa';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/stocks', label: 'Stock Market', icon: <FaSearch /> },
    { path: '/portfolio', label: 'Portfolio', icon: <FaBriefcase /> },
    { path: '/watchlist', label: 'Watchlist', icon: <FaEye /> },
    { path: '/transactions', label: 'Transactions', icon: <FaHistory /> },
    { path: '/learning', label: 'Learning Center', icon: <FaGraduationCap /> },
    { path: '/notifications', label: 'Notifications', icon: <FaBell /> },
    { path: '/profile', label: 'Profile', icon: <FaUser /> },
  ];

  return (
    <>
      <button
        className="btn btn-dark d-md-none position-fixed"
        style={{ top: '10px', left: '10px', zIndex: 1001 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars />
      </button>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <FaChartLine />
          Paper Trading
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
          <button className="sidebar-nav-item" onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;