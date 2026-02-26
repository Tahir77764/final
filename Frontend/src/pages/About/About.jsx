import React from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-container">

      {/* Hero Section */}
      <section className="about-hero">
        <h1>About StemLife</h1>
        <p>Connecting hope with healing — Building India's most intelligent stem cell donor registry</p>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <h2>Our Story</h2>
        <p>
          StemLife was founded with a simple yet powerful mission:
          to ensure that no patient dies waiting for a stem cell donor.
          Every year, thousands of patients diagnosed with blood cancers
          and other life-threatening blood disorders need a stem cell transplant to survive.
        </p>
        <p>
          We bridge the gap between potential donors and patients,
          making the process of registration simple, the matching efficient
          through cutting-edge Machine Learning algorithms, and the transplant
          successful. Join us in our mission to save lives, one donation at a time.
        </p>
      </section>

      {/* What We Do Section */}
      <section className="whatwedo-section">
        <h2>What We Do</h2>
        <div className="whatwedo-grid">

          <div className="whatwedo-card">
            <span className="whatwedo-icon">🧬</span>
            <h3>Donor Registration</h3>
            <p>
              We allow stem cell donors to register with complete HLA typing information,
              blood group, and personal details. All data is securely stored in our encrypted database.
            </p>
          </div>

          <div className="whatwedo-card">
            <span className="whatwedo-icon">🤖</span>
            <h3>ML-Powered Matching</h3>
            <p>
              Our system uses a K-Nearest Neighbors (KNN) machine learning model trained on
              10,000+ donor-recipient pairs to predict compatibility as High, Medium, or Low with confidence scores.
            </p>
          </div>

          <div className="whatwedo-card">
            <span className="whatwedo-icon">🏥</span>
            <h3>Hospital Partnerships</h3>
            <p>
              We partner with accredited hospitals and transplant centers across India,
              giving them access to our growing database of compatible stem cell donors.
            </p>
          </div>

          <div className="whatwedo-card">
            <span className="whatwedo-icon">🤝</span>
            <h3>NGO Collaboration</h3>
            <p>
              We work with leading NGOs like DKMS Foundation, Gift of Life, and Be The Match
              to spread awareness about stem cell donation and expand our registry globally.
            </p>
          </div>

          <div className="whatwedo-card">
            <span className="whatwedo-icon">📧</span>
            <h3>Donor-Recipient Connect</h3>
            <p>
              When a match is found, our platform enables secure communication between recipients
              and donors through an email-based contact and response system.
            </p>
          </div>

          <div className="whatwedo-card">
            <span className="whatwedo-icon">📊</span>
            <h3>Smart Analytics</h3>
            <p>
              We employ Random Forest and Logistic Regression models to analyze feature importance,
              identifying that HLA matching and blood group are the strongest compatibility predictors.
            </p>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="howitworks-section">
        <h2>How It Works</h2>
        <div className="steps-container">

          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Register as a Donor</h3>
            <p>Sign up with your HLA type, blood group, age, and contact details through our secure registration form with OTP email verification.</p>
          </div>

          <div className="step-connector">→</div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Patient Searches</h3>
            <p>A patient in need enters their medical details. Our rule-based engine filters donors by blood group and HLA locus matching.</p>
          </div>

          <div className="step-connector">→</div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3>ML Predicts Compatibility</h3>
            <p>Our trained KNN model evaluates each potential match across 8 features and predicts suitability as High, Medium, or Low with probability scores.</p>
          </div>

          <div className="step-connector">→</div>

          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Contact & Save a Life</h3>
            <p>The recipient contacts the matched donor via email. The donor receives options to accept or decline, and the response is relayed back to the patient.</p>
          </div>

        </div>
      </section>

      {/* Technology Section */}
      <section className="tech-section">
        <h2>Our Technology Stack</h2>
        <p className="tech-subtitle">Built with modern, scalable technologies</p>

        <div className="tech-grid">
          <div className="tech-card">
            <h3>Frontend</h3>
            <div className="tech-tags">
              <span>React.js</span>
              <span>React Router</span>
              <span>Axios</span>
              <span>Lucide Icons</span>
            </div>
          </div>

          <div className="tech-card">
            <h3>Backend</h3>
            <div className="tech-tags">
              <span>Node.js</span>
              <span>Express.js</span>
              <span>MongoDB Atlas</span>
              <span>Mongoose</span>
            </div>
          </div>

          <div className="tech-card">
            <h3>Machine Learning</h3>
            <div className="tech-tags">
              <span>Python</span>
              <span>scikit-learn</span>
              <span>Flask API</span>
              <span>Pandas</span>
            </div>
          </div>

          <div className="tech-card">
            <h3>ML Models</h3>
            <div className="tech-tags">
              <span>KNN</span>
              <span>Random Forest</span>
              <span>Logistic Regression</span>
              <span>Cross-Validation</span>
            </div>
          </div>

          <div className="tech-card">
            <h3>Security</h3>
            <div className="tech-tags">
              <span>JWT Auth</span>
              <span>Bcrypt</span>
              <span>OTP Verification</span>
              <span>Nodemailer</span>
            </div>
          </div>

          <div className="tech-card">
            <h3>Dataset</h3>
            <div className="tech-tags">
              <span>2000+ Records</span>
              <span>HLA Typing</span>
              <span>Blood Groups</span>
              <span>Synthetic Pairs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <h2>Our Values</h2>

        <div className="values-grid">

          <div className="value-card">
            <span className="icon">❤️</span>
            <h3>Compassion</h3>
            <p>
              Every life matters. We work tirelessly to connect
              donors with patients in need.
            </p>
          </div>

          <div className="value-card">
            <span className="icon">🎯</span>
            <h3>Mission-Driven</h3>
            <p>
              Our goal is to eliminate deaths from blood cancers
              by building the world's largest donor registry.
            </p>
          </div>

          <div className="value-card">
            <span className="icon">👁️</span>
            <h3>Transparency</h3>
            <p>
              We maintain complete transparency in our processes
              and use of donations.
            </p>
          </div>

          <div className="value-card">
            <span className="icon">🏅</span>
            <h3>Excellence</h3>
            <p>
              We strive for excellence in matching donors and ensuring
              safe transplant procedures.
            </p>
          </div>

        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="contact-section">
        <h2>Get in Touch</h2>
        <div className="contact-details">
          <p>Have questions? We're here to help.</p>
          <div className="contact-cards">
            <div className="contact-card">
              <h3>📧 Email Us</h3>
              <p>support@stemlife.org</p>
            </div>
            <div className="contact-card">
              <h3>📞 Call Us</h3>
              <p>+91 1800-123-4567</p>
            </div>
            <div className="contact-card">
              <h3>📍 Visit Us</h3>
              <p>123 Health Avenue, New Delhi, India</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Be a Hero?</h2>

        <div className="cta-buttons">
          <button className="about-btn" onClick={() => navigate("/donorform")}>Become a Donor</button>
          <button className="secondary-btn" onClick={() => navigate("/recipient")}>Find a Donor</button>
          <button className="secondary-btn" onClick={() => document.getElementById('contact-section').scrollIntoView({ behavior: 'smooth' })}>Contact Us</button>
        </div>
      </section>

    </div>
  );
};

export default About;
