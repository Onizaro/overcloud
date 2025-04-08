import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import DocumentPage from './components/DocumentPage/DocumentPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import Features from './components/Features/Features';
import Pricing from './components/PricingPage/Pricing';
import About from './components/AboutPage/About'; // Importez le composant About
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="Navbar">
          <Navbar />
        </div>
        <div className="main-content">
          <div className="Sidebar">
            <Sidebar />
          </div>
          <div className="content-area">
            <Routes>
              <Route path="/" element={<DocumentPage />} />
              <Route path="/documents" element={<DocumentPage />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} /> {/* Ajout de la route pour About */}
              <Route
                path="/login"
                element={<div className="top-container"><LoginPage /></div>}
              />
              <Route
                path="/register"
                element={<div className="top-container"><RegisterPage /></div>}
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;