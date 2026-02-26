import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Hospital.css";

const defaultHospitals = [
  {
    hospitalName: "AIIMS Delhi",
    specialties: "Bone Marrow Transplant Center",
    city: "New Delhi",
    state: "Delhi",
    facilityType: "Government",
    isDefault: true,
  },
  {
    hospitalName: "Tata Memorial Hospital",
    specialties: "Cancer Research & Treatment",
    city: "Mumbai",
    state: "Maharashtra",
    facilityType: "Government",
    isDefault: true,
  },
  {
    hospitalName: "CMC Vellore",
    specialties: "Hematology & BMT",
    city: "Vellore",
    state: "Tamil Nadu",
    facilityType: "Private",
    isDefault: true,
  },
  {
    hospitalName: "Apollo Hospitals",
    specialties: "Multi-speciality Healthcare",
    city: "Multiple Locations",
    state: "India",
    facilityType: "Private",
    isDefault: true,
  },
  {
    hospitalName: "Medanta",
    specialties: "Advanced Cancer Care",
    city: "Gurugram",
    state: "Haryana",
    facilityType: "Private",
    isDefault: true,
  },
  {
    hospitalName: "Max Healthcare",
    specialties: "Stem Cell Transplant",
    city: "Delhi NCR",
    state: "Delhi",
    facilityType: "Private",
    isDefault: true,
  },
];

const Hospital = () => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);

  // Dynamic hospitals from DB
  const [dbHospitals, setDbHospitals] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  // OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");

  const [formData, setFormData] = useState({
    hospitalName: "",
    registrationNumber: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    specialties: "",
    facilityType: "Private",
    message: "",
  });

  // Fetch hospitals from DB on mount
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/partner/hospitals");
        setDbHospitals(res.data);
      } catch (err) {
        console.error("Failed to fetch hospitals:", err);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchHospitals();
  }, [submitted]); // Re-fetch after a new submission

  // Combine defaults + DB hospitals
  const allHospitals = [
    ...defaultHospitals,
    ...dbHospitals.map(h => ({ ...h, isDefault: false }))
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      const res = await axios.post("http://localhost:5000/api/partner/send-otp", {
        email: formData.email,
        type: "hospital"
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
      const res = await axios.post("http://localhost:5000/api/partner/verify-otp", {
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
      const res = await axios.post("http://localhost:5000/api/partner/hospital", formData);
      alert(res.data.message);
      setSubmitted(true);
      setFormData({
        hospitalName: "", registrationNumber: "", contactPerson: "",
        email: "", phone: "", address: "", city: "", state: "",
        specialties: "", facilityType: "Private", message: ""
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

  // Badge color based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved": return "status-approved";
      case "Pending": return "status-pending";
      case "Rejected": return "status-rejected";
      default: return "";
    }
  };

  // Badge color based on facility type
  const getFacilityBadge = (type) => {
    switch (type) {
      case "Government": return "facility-govt";
      case "Private": return "facility-private";
      case "Trust": return "facility-trust";
      default: return "facility-private";
    }
  };

  return (
    <div className="hospital-page">
      {/* HERO */}
      <section className="hospital-hero">
        <h1>Partner Hospitals</h1>
        <p>Find accredited hospitals and transplant centers near you.</p>
        <div className="hospital-counter">
          <span>{allHospitals.length}</span> Hospitals & Counting
        </div>
      </section>

      {/* HOSPITAL GRID */}
      <section className="hospital-container">
        {fetchLoading ? (
          <div className="loading-text">Loading hospitals...</div>
        ) : (
          allHospitals.map((item, index) => (
            <div className={`hospital-card ${!item.isDefault ? "hospital-card-db" : ""}`} key={item._id || index}>
              <div className="hospital-icon">🏥</div>

              {/* Facility Type Badge */}
              <div className={`hospital-facility-badge ${getFacilityBadge(item.facilityType)}`}>
                {item.facilityType || "Private"}
              </div>

              {/* Status Badge for DB hospitals */}
              {!item.isDefault && item.status && (
                <div className={`hospital-status-badge ${getStatusBadge(item.status)}`}>
                  {item.status}
                </div>
              )}

              <h3>{item.hospitalName}</h3>
              <p className="specialty">{item.specialties || "General Healthcare"}</p>
              <p className="location">📍 {item.city}{item.state ? `, ${item.state}` : ""}</p>

              {/* Extra info for DB hospitals */}
              {!item.isDefault && item.contactPerson && (
                <p className="contact-info">👤 {item.contactPerson}</p>
              )}

              {item.isDefault && (
                <div className="featured-tag">⭐ Featured</div>
              )}
              {!item.isDefault && (
                <div className="registered-tag">✅ Registered Partner</div>
              )}
            </div>
          ))
        )}
      </section>

      {/* CTA */}
      <section className="hospital-cta">
        <h2>Are You a Hospital?</h2>
        <p>Partner with us to access our database of registered stem cell donors.</p>
        <button onClick={handlePartnerClick}>Partner With Us</button>
      </section>

      {/* PARTNERSHIP FORM */}
      {showForm && (
        <section className="partner-form-section" ref={formRef}>
          {submitted ? (
            <div className="form-success">
              <div className="success-icon">✅</div>
              <h2>Application Submitted!</h2>
              <p>Thank you for your interest. Our team will review your application and contact you within 48 hours.</p>
              <button onClick={() => { setShowForm(false); setSubmitted(false); }}>Close</button>
            </div>
          ) : (
            <>
              <h2>Hospital Partnership Registration</h2>
              <p className="form-subtitle">Fill in the details below and verify your email to submit.</p>

              <form className="partner-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Hospital Name *</label>
                    <input name="hospitalName" value={formData.hospitalName} onChange={handleChange} placeholder="e.g. AIIMS Delhi" required />
                  </div>
                  <div className="form-group">
                    <label>Registration Number *</label>
                    <input name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} placeholder="Hospital Reg. No." required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Contact Person *</label>
                    <input name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="Dr. Name" required />
                  </div>
                  <div className="form-group">
                    <label>Facility Type</label>
                    <select name="facilityType" value={formData.facilityType} onChange={handleChange}>
                      <option value="Government">Government</option>
                      <option value="Private">Private</option>
                      <option value="Trust">Trust / Non-Profit</option>
                    </select>
                  </div>
                </div>

                {/* EMAIL + OTP VERIFICATION */}
                <div className="form-group full-width">
                  <label>Email Address *</label>
                  <div className="otp-email-row">
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="contact@hospital.com"
                      required
                      disabled={otpVerified}
                    />
                    {!otpVerified && (
                      <button
                        type="button"
                        className="otp-send-btn"
                        onClick={handleSendOtp}
                        disabled={otpLoading || !formData.email}
                      >
                        {otpLoading ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
                      </button>
                    )}
                    {otpVerified && <span className="verified-badge">✅ Verified</span>}
                  </div>
                </div>

                {otpSent && !otpVerified && (
                  <div className="form-group full-width otp-verify-section">
                    <label>Enter OTP sent to your email</label>
                    <div className="otp-email-row">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        maxLength="6"
                      />
                      <button
                        type="button"
                        className="otp-verify-btn"
                        onClick={handleVerifyOtp}
                        disabled={otpLoading || !otp}
                      >
                        {otpLoading ? "Verifying..." : "Verify OTP"}
                      </button>
                    </div>
                  </div>
                )}

                {otpMessage && (
                  <p className={`otp-message ${otpVerified ? "otp-success" : otpSent ? "otp-info" : "otp-error"}`}>
                    {otpMessage}
                  </p>
                )}

                <div className="form-group full-width">
                  <label>Phone *</label>
                  <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
                </div>

                <div className="form-group full-width">
                  <label>Address *</label>
                  <input name="address" value={formData.address} onChange={handleChange} placeholder="Full Address" required />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input name="state" value={formData.state} onChange={handleChange} placeholder="State" required />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Specialties</label>
                  <input name="specialties" value={formData.specialties} onChange={handleChange} placeholder="e.g. Oncology, BMT, Hematology" />
                </div>

                <div className="form-group full-width">
                  <label>Additional Message</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell us about your facility and why you'd like to partner..." rows="4" />
                </div>

                <button type="submit" className="form-submit-btn" disabled={loading || !otpVerified}>
                  {!otpVerified ? "🔒 Verify Email to Submit" : loading ? "Submitting..." : "Submit Partnership Request"}
                </button>
              </form>
            </>
          )}
        </section>
      )}
    </div>
  );
};

export default Hospital;
