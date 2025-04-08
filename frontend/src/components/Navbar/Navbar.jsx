import React from 'react';
import { Link } from 'react-router-dom';
import { getUserSession, destroyUserSession } from '../../services/session.service';
import { useAuth } from '../../authContext';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  return (
    <nav className="navbar">
      <div className="navbarOptions">
        <div className="navbar-logo">
          <Link to="/">OverCloud</Link>
        </div>
        <ul className="navbar-links">
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/features">Features</Link></li>
          <li><Link to="/pricing">Pricing</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
        <div className="navbar-auth">
          {isAuthenticated ? (
            <button onClick={logout}>
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="auth-link">Login</Link>
              <Link to="/register" className="auth-link signup-btn">Register</Link>
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