import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Navbar.module.css';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/dashboard" className={styles.brand}>
          <span className={styles.brandIcon}>👥</span> User Management
        </Link>

        <ul className={styles.navLinks}>
          <li>
            <Link to="/dashboard" className={styles.link}>
              Dashboard
            </Link>
          </li>

          {user?.role === 'Admin' && (
            <>
              <li>
                <Link to="/users" className={styles.link}>
                  Users
                </Link>
              </li>
              <li>
                <Link to="/users/create" className={styles.link}>
                  Create User
                </Link>
              </li>
            </>
          )}

          {user?.role === 'Manager' && (
            <li>
              <Link to="/users" className={styles.link}>
                Users
              </Link>
            </li>
          )}

          <li className={styles.dropdown}>
            <button
              className={styles.dropdownToggle}
              onClick={toggleDropdown}
            >
              {user?.name} ▼
            </button>
            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                <Link
                  to="/profile"
                  className={styles.dropdownItem}
                  onClick={() => setDropdownOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  to="/change-password"
                  className={styles.dropdownItem}
                  onClick={() => setDropdownOpen(false)}
                >
                  Change Password
                </Link>
                <button
                  className={styles.logoutBtn}
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};
