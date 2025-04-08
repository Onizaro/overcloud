import React from 'react';
import './Features.css';

function Features() {
  return (
    <div className="features-container">
      <div className="features-content">
        <div className="features-header">
          <h1>OverCloud Features</h1>
          <p>A digital legacy platform that transfers your data when you need it most</p>
        </div>
        
        <div className="features-main">
          <div className="feature-intro">
            <h2>A Web / Mobile app platform where users can create their own folders which will be transferred in case something happened to them</h2>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-number">01</div>
              <h3>Emotional Dimension</h3>
              <p>Adds the <em>emotional dimension</em> that is missing in a simple will. Express your feelings and personal messages to loved ones.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-number">02</div>
              <h3>Complete Control</h3>
              <p>Allows you to <em>keep control on your last data</em>, your secrets, your feelings to leave an <em>honest, authentic</em> message that truly represents you.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-number">03</div>
              <h3>Time Capsules</h3>
              <p>A possibility to <em>transfer more than just documents</em> but also to setup at a specific date to create <em>time capsules</em>.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-number">04</div>
              <h3>User-Friendly</h3>
              <p><em>Easy to use, affordable, accessible</em>. Our platform is designed to be intuitive for users of all technical levels.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-number">05</div>
              <h3>Adaptable</h3>
              <p><em>Ergonomic and adaptable at any time</em>. Modify your content whenever you want, from any device.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-number">06</div>
              <h3>Secure Storage</h3>
              <p>Your sensitive documents and personal messages are encrypted and protected with the highest security standards.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Features;