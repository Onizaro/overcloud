import React from 'react';
import './Pricing.css';
import { Link } from 'react-router-dom';

function Pricing() {
  return (
    <div className="pricing-container">
      <div className="pricing-content">
        <div className="pricing-header">
          <h1>OverCloud Pricing</h1>
          <p>Choose the plan that best fits your legacy needs</p>
        </div>
        
        <div className="pricing-intro">
          <h2>Secure your digital legacy with our flexible pricing options</h2>
        </div>
        
        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="pricing-tier">Basic</div>
            <div className="pricing-price">
              <span>€</span>9.99<span>/month</span>
            </div>
            <div className="pricing-features">
              <ul>
                <li><span className="check-mark">✓</span> 10GB Storage</li>
                <li><span className="check-mark">✓</span> 5 Beneficiaries</li>
                <li><span className="check-mark">✓</span> Basic Document Templates</li>
                <li><span className="check-mark">✓</span> Email Support</li>
                <li><span className="check-mark">✓</span> Secure Encryption</li>
                <li className="disabled"><span className="cross-mark">✗</span> Advanced Sharing Rules</li>
                <li className="disabled"><span className="cross-mark">✗</span> Legal Document Analysis</li>
              </ul>
            </div>
            <Link to="/register" className="pricing-btn">Get Started</Link>
          </div>
          
          <div className="pricing-card featured">
            <div className="pricing-popular">Most Popular</div>
            <div className="pricing-tier">Premium</div>
            <div className="pricing-price">
              <span>€</span>24.99<span>/month</span>
            </div>
            <div className="pricing-features">
              <ul>
                <li><span className="check-mark">✓</span> 50GB Storage</li>
                <li><span className="check-mark">✓</span> 15 Beneficiaries</li>
                <li><span className="check-mark">✓</span> Advanced Document Templates</li>
                <li><span className="check-mark">✓</span> Priority Email Support</li>
                <li><span className="check-mark">✓</span> Enhanced Encryption</li>
                <li><span className="check-mark">✓</span> Advanced Sharing Rules</li>
                <li className="disabled"><span className="cross-mark">✗</span> 24/7 Phone Support</li>
              </ul>
            </div>
            <Link to="/register" className="pricing-btn">Get Started</Link>
          </div>
          
          <div className="pricing-card">
            <div className="pricing-tier">Enterprise</div>
            <div className="pricing-price">
              <span>€</span>49.99<span>/month</span>
            </div>
            <div className="pricing-features">
              <ul>
                <li><span className="check-mark">✓</span> 250GB Storage</li>
                <li><span className="check-mark">✓</span> Unlimited Beneficiaries</li>
                <li><span className="check-mark">✓</span> Custom Document Templates</li>
                <li><span className="check-mark">✓</span> 24/7 Priority Support</li>
                <li><span className="check-mark">✓</span> Military-grade Encryption</li>
                <li><span className="check-mark">✓</span> Advanced Sharing Rules</li>
                <li><span className="check-mark">✓</span> Dedicated Account Manager</li>
              </ul>
            </div>
            <Link to="/register" className="pricing-btn">Get Started</Link>
          </div>
        </div>
        
        <div className="pricing-faq">
          <h2>Frequently Asked Questions</h2>
          
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How does the document sharing work after death?</h3>
              <p>Our platform uses a robust verification system to ensure your documents are shared with your designated beneficiaries only when the time comes.</p>
            </div>
            
            <div className="faq-item">
              <h3>Can I upgrade or downgrade my plan?</h3>
              <p>Yes, you can change your plan at any time. When upgrading, you'll be charged the prorated difference.</p>
            </div>
            
            <div className="faq-item">
              <h3>How secure is my data?</h3>
              <p>We employ end-to-end encryption for all documents. Your data is stored in secure servers with multiple layers of protection.</p>
            </div>
            
            <div className="faq-item">
              <h3>Do you offer refunds?</h3>
              <p>Yes, we offer a 30-day money-back guarantee for all new subscriptions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;