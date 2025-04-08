import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import DocumentPage from './components/DocumentPage/DocumentPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import Features from './components/Features/Features'; // Importez le composant Features
import './App.css';

function App() {
  return (
    <Router> {/* Le Router doit envelopper toute l'application */}
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
              <Route path="/" element={<DocumentPage />} /> {/* Page d'accueil */}
              <Route path="/documents" element={<DocumentPage />} />
              <Route path="/features" element={<Features />} /> {/* Nouvelle route pour Features */}
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