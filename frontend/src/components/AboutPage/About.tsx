import React from 'react';
import './About.css';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        <div className="about-header">
          <h1>About OverCloud</h1>
          <p>Preserving digital legacies for future generations</p>
        </div>
        
        <div className="about-intro">
          <h2>Our mission is to ensure your digital memories and important documents reach your loved ones when they need them most</h2>
        </div>
        
        <div className="about-story">
          <div className="about-section">
            <h3>Our Story</h3>
            <p>OverCloud was founded in 2025 with a simple yet powerful mission: to help people share their digital legacy with loved ones after they're gone. We recognized a growing problem in our increasingly digital world—when someone passes away, their important documents, precious memories, and heartfelt messages often become inaccessible to those who need them.</p>
            <p>Our founder experienced this firsthand when a close family member passed away unexpectedly, leaving behind a wealth of digital information that couldn't be accessed. This personal experience sparked the creation of OverCloud, a platform designed to securely store and transfer your digital legacy exactly how and when you want it.</p>
          </div>
        </div>
        
        <div className="about-grid">
          <div className="about-card">
            <div className="about-icon">
              <div className="icon-number">01</div>
            </div>
            <h3>Our Vision</h3>
            <p>We envision a world where your digital legacy is preserved and shared with future generations, where your stories, wisdom, and important documents continue to benefit your loved ones long after you're gone.</p>
          </div>
          
          <div className="about-card">
            <div className="about-icon">
              <div className="icon-number">02</div>
            </div>
            <h3>Our Values</h3>
            <p>Security, empathy, and innovation drive everything we do. We believe in creating technology that serves human needs with compassion and understanding while maintaining the highest standards of data protection.</p>
          </div>
          
          <div className="about-card">
            <div className="about-icon">
              <div className="icon-number">03</div>
            </div>
            <h3>Our Promise</h3>
            <p>We promise to safeguard your digital legacy with the utmost care and deliver it exactly according to your wishes. Your trust is the foundation of our service, and we're committed to earning it every day.</p>
          </div>
        </div>
        
        <div className="about-team"> 
  <h3>Our Team</h3>
  <p>OverCloud is built by a dedicated team of full stack developers passionate about digital legacy preservation. Our diverse backgrounds unite under a common purpose: helping people maintain control over their digital afterlife.</p>

  <div className="team-grid">
    <div className="team-member">
      <div className="member-photo placeholder-photo">
        <span role="img" aria-label="developer" style={{ fontSize: "48px", lineHeight: "150px", display: "inline-block" }}>👨‍💻</span>
      </div>
      <h4>Yann PATE</h4>
      <p>Full Stack Developer</p>
    </div>

    <div className="team-member">
      <div className="member-photo placeholder-photo">
        <span role="img" aria-label="developer" style={{ fontSize: "48px", lineHeight: "150px", display: "inline-block" }}>👨‍💻</span>
      </div>
      <h4>Anton NOMED</h4>
      <p>Full Stack Developer</p>
    </div>

    <div className="team-member">
      <div className="member-photo placeholder-photo">
        <span role="img" aria-label="developer" style={{ fontSize: "48px", lineHeight: "150px", display: "inline-block" }}>👨‍💻</span>
      </div>
      <h4>Romain PARADA</h4>
      <p>Full Stack Developer</p>
    </div>

    <div className="team-member">
      <div className="member-photo placeholder-photo">
        <span role="img" aria-label="developer" style={{ fontSize: "48px", lineHeight: "150px", display: "inline-block" }}>👨‍💻</span>
      </div>
      <h4>Elias NIERES-TAVERNIER</h4>
      <p>Full Stack Developer</p>
    </div>

    <div className="team-member">
      <div className="member-photo placeholder-photo">
        <span role="img" aria-label="developer" style={{ fontSize: "48px", lineHeight: "150px", display: "inline-block" }}>👨‍💻</span>
      </div>
      <h4>Aymen SI-SABER</h4>
      <p>Full Stack Developer</p>
    </div>

    <div className="team-member">
      <div className="member-photo placeholder-photo">
        <span role="img" aria-label="developer" style={{ fontSize: "48px", lineHeight: "150px", display: "inline-block" }}>👨‍💻</span>
      </div>
      <h4>Nizar OUMEHDI</h4>
      <p>Full Stack Developer</p>
    </div>
  </div>
</div>
        
        <div className="about-cta">
          <h2>Ready to preserve your digital legacy?</h2>
          <p>Join thousands of users who trust OverCloud with their most important documents and memories</p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-button primary">Get Started</Link>
            <Link to="/features" className="cta-button secondary">Learn More</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;