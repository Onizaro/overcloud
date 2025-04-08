import React, { useState, useEffect } from 'react';
import { getUserSession, destroyUserSession } from '../../services/session.service';
import { useAuth } from '../../authContext';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  return (
    <nav className="navbar">
      <div className="navbarOptions">
        <div className="navbar-logo">
          <a href="/">OverCloud</a>
        </div>
        <ul className="navbar-links">
          <li><a href="/">Dashboard</a></li>
          <li><a href="/features">Features</a></li>
          <li><a href="/pricing">Pricing</a></li>
          <li><a href="/about">About</a></li>
        </ul>
        <div className="navbar-auth">
          {isAuthenticated ? (
            <button onClick={logout}>
              Logout
            </button>
          ) : (
            <>
              <a href="/login" className="auth-link">Login</a>
              <a href="/register" className="auth-link signup-btn">Register</a>
            </>
          )}
        </div>
      </div>
      
      {isAuthenticated && (
        <div className="navbar-search">
          <span className="search-label">Search a Document:</span>
          <input type="text" placeholder="Search..." className="search-input" />
        </div>
      )}
    </nav>
  );
}

export default Navbar;

