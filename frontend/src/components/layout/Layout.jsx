import React from 'react';
import { Navbar } from './Navbar';
import './Layout.css';

export const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content container">
        {children}
      </main>
      <footer className="footer">
        <p>&copy; 2024 User Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};
