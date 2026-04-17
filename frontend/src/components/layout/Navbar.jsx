import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container flex-between">
        <Link to="/" className="navbar-brand">
          <span className="logo-icon">👥</span>
          <span className="logo-text">UserHub</span>
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="navbar-nav">
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <Link to="/users" className="nav-link">
                Users
              </Link>
            )}
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
          </div>

          <div className="navbar-user">
            <div className="user-info">
              <span className="user-avatar">{user?.firstName?.charAt(0)}</span>
              <div className="user-details">
                <p className="user-name">{user?.fullName}</p>
                <p className="user-role">{user?.role}</p>
              </div>
            </div>
            <button className="btn btn-secondary btn-small" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
