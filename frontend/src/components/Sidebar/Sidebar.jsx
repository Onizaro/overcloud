import React from 'react';
import './Sidebar.css';
import { useAuth } from '../../authContext';

function Sidebar() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;
  return (
    <div className="sidebar">
      <ul className="sidebar-options">
        <li><a href="/sharing">Sharing</a></li>
        <li><a href="/documents">Documents</a></li>
        <li><a href="/passwords">Passwords</a></li>
        <li><a href="/notebook">Notebook</a></li>
        <li><a href="/will">Will</a></li>
        <li><a href="/Credit Card">Credit Card</a></li>
        <li><a href="/Financial_Cartography">Financial Cartography</a></li>
      </ul>
    </div>
  );
}

export default Sidebar;
