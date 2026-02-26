import React, { useState, useRef } from "react";
import api from "../../utils/api";
import { Users, Globe, Target, Handshake } from "lucide-react";
import "./NgoPartners.css";

export default function NgoPartners() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);

  // OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");

  const [formData, setFormData] = useState({
    ngoName: "",
    registrationNumber: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    focusArea: "",
    volunteerCount: "",
    website: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Reset OTP if email changes
    if (e.target.name === "email") {
      setOtpSent(false);
      setOtpVerified(false);
      setOtp("");
      setOtpMessage("");
    }
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setOtpMessage("Please enter your email first.");
      return;
    }
    setOtpLoading(true);
    setOtpMessage("");
    try {
      const res = await api.post("/api/partner/send-otp", {
        email: formData.email,
        type: "ngo"
      });
      setOtpSent(true);
      setOtpMessage(res.data.message);
    } catch (err) {
      setOtpMessage(err.response?.data?.error || "Failed to send OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setOtpMessage("Please enter the OTP.");
      return;
    }
    setOtpLoading(true);
    setOtpMessage("");
    try {
      const res = await api.post("/api/partner/verify-otp", {
        email: formData.email,
        otp: otp
      });
      setOtpVerified(true);
      setOtpMessage(res.data.message);
    } catch (err) {
      setOtpMessage(err.response?.data?.error || "Verification failed.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      alert("Please verify your email with OTP before submitting.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/api/partner/ngo", formData);
      alert(res.data.message);
      setSubmitted(true);
      setFormData({
        ngoName: "", registrationNumber: "", contactPerson: "",
        email: "", phone: "", address: "", city: "", state: "",
        focusArea: "", volunteerCount: "", website: "", message: ""
      });
      setOtpSent(false);
      setOtpVerified(false);
      setOtp("");
      setOtpMessage("");
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePartnerClick = () => {
    setShowForm(true);
    setSubmitted(false);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="ngo-page">

      {/* HERO SECTION */}
      <section className="ngo-hero">
        <h1>Our NGO Partners</h1>
        <p>
          Working together to save lives through stem cell donation awareness
          and support.
        </p>
      </section>

      {/* STATS SECTION */}
      <section className="ngo-stats">
        <div className="stat">
          <Users size={36} />
          <h3>10,000+ Volunteers</h3>
          <p>Active network across India</p>
        </div>

        <div className="stat">
          <Globe size={36} />
          <h3>50+ Countries</h3>
          <p>International partnerships</p>
        </div>

        <div className="stat">
          <Target size={36} />
          <h3>95% Match Rate</h3>
          <p>Finding compatible donors</p>
        </div>

        <div className="stat">
          <Handshake size={36} />
          <h3>200+ Partners</h3>
          <p>Hospitals and institutions</p>
        </div>
      </section>

      {/* FEATURED PARTNERS */}
      <section className="featured">
        <h2>Featured Partners</h2>

        <div className="partners-grid">
          <div className="partner-card">
            <h3>DKMS Foundation</h3>
            <span>International Donor Registry</span>
            <p>World's largest bone marrow donor center fighting blood cancer globally.</p>
          </div>

          <div className="partner-card">
            <h3>Gift of Life</h3>
            <span>Donor Recruitment</span>
            <p>Saving lives through stem cell and bone marrow transplants.</p>
          </div>

          <div className="partner-card">
            <h3>Be The Match</h3>
            <span>Patient Support</span>
            <p>Connecting patients with donors and providing financial assistance.</p>
          </div>

          <div className="partner-card">
            <h3>Marrow Donor Registry India</h3>
            <span>Indian Registry</span>
            <p>Building India's largest registry of potential stem cell donors.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Want to Partner With Us?</h2>
        <button onClick={handlePartnerClick}>Get In Touch</button>
      </section>

      {/* NGO PARTNERSHIP FORM */}
      {showForm && (
        <section className="ngo-form-section" ref={formRef}>
          {submitted ? (
            <div className="ngo-form-success">
              <div className="success-icon">✅</div>
              <h2>Application Submitted!</h2>
              <p>Thank you for your interest in partnering with us. Our team will review your application and reach out within 48 hours.</p>
              <button onClick={() => { setShowForm(false); setSubmitted(false); }}>Close</button>
            </div>
          ) : (
            <>
              <h2>NGO Partnership Registration</h2>
              <p className="ngo-form-subtitle">Join our mission to save lives. Verify your email and fill in the details below.</p>

              <form className="ngo-form" onSubmit={handleSubmit}>
                <div className="ngo-form-row">
                  <div className="ngo-form-group">
                    <label>NGO Name *</label>
                    <input name="ngoName" value={formData.ngoName} onChange={handleChange} placeholder="e.g. Gift of Life Foundation" required />
                  </div>
                  <div className="ngo-form-group">
                    <label>Registration Number *</label>
                    <input name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} placeholder="NGO Reg. No." required />
                  </div>
                </div>

                <div className="ngo-form-row">
                  <div className="ngo-form-group">
                    <label>Contact Person *</label>
                    <input name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="Full Name" required />
                  </div>
                  <div className="ngo-form-group">
                    <label>Focus Area</label>
                    <input name="focusArea" value={formData.focusArea} onChange={handleChange} placeholder="e.g. Blood Cancer, Awareness" />
                  </div>
                </div>

                {/* EMAIL + OTP VERIFICATION */}
                <div className="ngo-form-group ngo-full-width">
                  <label>Email Address *</label>
                  <div className="ngo-otp-email-row">
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="contact@ngo.org"
                      required
                      disabled={otpVerified}
                    />
                    {!otpVerified && (
                      <button
                        type="button"
                        className="ngo-otp-send-btn"
                        onClick={handleSendOtp}
                        disabled={otpLoading || !formData.email}
                      >
                        {otpLoading ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
                      </button>
                    )}
                    {otpVerified && <span className="ngo-verified-badge">✅ Verified</span>}
                  </div>
                </div>

                {otpSent && !otpVerified && (
                  <div className="ngo-form-group ngo-full-width ngo-otp-verify-section">
                    <label>Enter OTP sent to your email</label>
                    <div className="ngo-otp-email-row">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        maxLength="6"
                      />
                      <button
                        type="button"
                        className="ngo-otp-verify-btn"
                        onClick={handleVerifyOtp}
                        disabled={otpLoading || !otp}
                      >
                        {otpLoading ? "Verifying..." : "Verify OTP"}
                      </button>
                    </div>
                  </div>
                )}

                {otpMessage && (
                  <p className={`ngo-otp-message ${otpVerified ? "ngo-otp-success" : otpSent ? "ngo-otp-info" : "ngo-otp-error"}`}>
                    {otpMessage}
                  </p>
                )}

                <div className="ngo-form-group ngo-full-width">
                  <label>Phone *</label>
                  <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
                </div>

                <div className="ngo-form-group ngo-full-width">
                  <label>Address *</label>
                  <input name="address" value={formData.address} onChange={handleChange} placeholder="Full Address" required />
                </div>

                <div className="ngo-form-row">
                  <div className="ngo-form-group">
                    <label>City *</label>
                    <input name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
                  </div>
                  <div className="ngo-form-group">
                    <label>State *</label>
                    <input name="state" value={formData.state} onChange={handleChange} placeholder="State" required />
                  </div>
                </div>

                <div className="ngo-form-row">
                  <div className="ngo-form-group">
                    <label>Number of Volunteers</label>
                    <input name="volunteerCount" value={formData.volunteerCount} onChange={handleChange} placeholder="e.g. 50, 100, 500+" />
                  </div>
                  <div className="ngo-form-group">
                    <label>Website</label>
                    <input name="website" value={formData.website} onChange={handleChange} placeholder="https://www.yoursite.org" />
                  </div>
                </div>

                <div className="ngo-form-group ngo-full-width">
                  <label>Why do you want to partner with us?</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell us about your NGO and how you'd like to collaborate..." rows="4" />
                </div>

                <button type="submit" className="ngo-submit-btn" disabled={loading || !otpVerified}>
                  {!otpVerified ? "🔒 Verify Email to Submit" : loading ? "Submitting..." : "Submit Partnership Request"}
                </button>
              </form>
            </>
          )}
        </section>
      )}

    </div>
  );
}
