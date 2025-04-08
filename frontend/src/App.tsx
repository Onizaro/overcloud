import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import DocumentPage from './components/DocumentPage/DocumentPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="Navbar">
        <Navbar />
      </div>
      <div className="main-content">
  <div className="Sidebar">
    <Sidebar />
  </div>
  <div className="content-area">
    <Router>
      <Routes>
        <Route path="/documents" element={<DocumentPage />} />
        <Route
          path="/login"
          element={<div className="top-container"><LoginPage /></div>}
        />
        <Route
          path="/register"
          element={<div className="top-container"><RegisterPage /></div>}
        />
      </Routes>
    </Router>
  </div>
</div>

    </div>
  );
}

export default App;
