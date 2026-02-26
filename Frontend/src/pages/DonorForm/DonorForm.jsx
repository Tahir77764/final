import { useState, useEffect } from "react";
import axios from "axios";
import "./DonorForm.css";

const DonorForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    bloodGroup: "",
    HLA_A1: "",
    HLA_A2: "",
    HLA_B1: "",
    HLA_B2: "",
    HLA_C1: "",
    HLA_C2: "",
    HLA_DRB1_1: "",
    HLA_DRB1_2: "",
    HLA_DQ1: "",
    HLA_DQ2: "",
    email: "",
    phone: "",
    weight: "",
    noChronicIllness: false,
    noInfectiousDisease: false,
    noHighRiskLifestyle: false,
    notPregnant: false,
    hlaConsent: false,
    informedConsent: false,
    willingness: false,
    governmentId: ""
  });

  // Auto-fill Email from Logged In User
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Age Eligibility
    if (formData.age < 18 || formData.age > 50) {
      return alert("Eligibility Check Failed: Age must be between 18 and 50.");
    }
    // 2. Weight Requirement
    if (formData.weight < 50) {
      return alert("Eligibility Check Failed: Minimum weight of 50kg is required.");
    }
    // 3. Health Checks
    if (!formData.noChronicIllness || !formData.noInfectiousDisease || !formData.noHighRiskLifestyle) {
      return alert("Eligibility Check Failed: You must meet health criteria.");
    }
    // 4. Consent
    if (!formData.hlaConsent || !formData.informedConsent || !formData.willingness) {
      return alert("Consent Required: Please agree to all terms.");
    }

    try {
      // Direct Add - No OTP (User is already logged in & verified)
      await axios.post("http://localhost:5000/api/donor/add", formData);
      alert("✅ You are Eligible! Donor Registered Successfully.");

      // Clear Form (except email)
      const user = JSON.parse(localStorage.getItem("user"));
      setFormData({
        name: "", age: "", gender: "", bloodGroup: "",
        HLA_A1: "", HLA_A2: "", HLA_B1: "", HLA_B2: "",
        HLA_C1: "", HLA_C2: "", HLA_DRB1_1: "", HLA_DRB1_2: "",
        HLA_DQ1: "", HLA_DQ2: "",
        email: user?.email || "", phone: "", weight: "",
        noChronicIllness: false, noInfectiousDisease: false, noHighRiskLifestyle: false,
        notPregnant: false, hlaConsent: false, informedConsent: false, willingness: false,
        governmentId: ""
      });

    } catch (error) {
      alert(error.response?.data?.message || "Error submitting donor data");
      console.error(error);
    }
  };

  return (
    <div className="donor-page">
      <h1 className="title">Stem Cell Donor Registration</h1>
      <p className="subtitle">Eligibility Check & Registration</p>

      <form className="donor-card" onSubmit={handleSubmit}>
        <h2>Personal Details</h2>
        <div className="input-group">
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            name="age"
            type="number"
            placeholder="Age (18-50)"
            min="18"
            max="60"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            name="weight"
            type="number"
            placeholder="Weight (kg)"
            min="1"
            value={formData.weight}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          >
            <option value="">Blood Group</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
            <option>O+</option>
            <option>O-</option>
          </select>
          <input
            name="governmentId"
            placeholder="Government ID Number"
            value={formData.governmentId}
            onChange={handleChange}
            required
          />
        </div>

        <h2>Medical & Lifestyle Check</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', textAlign: 'left' }}>
          <label className="checkbox-label">
            <input type="checkbox" name="noChronicIllness" checked={formData.noChronicIllness} onChange={handleChange} />
            I do NOT have a history of Cancer, Heart Disease, or Autoimmune disorders.
          </label>
          <label className="checkbox-label">
            <input type="checkbox" name="noInfectiousDisease" checked={formData.noInfectiousDisease} onChange={handleChange} />
            I am negative for HIV, Hepatitis B & C, Syphilis, and Tuberculosis.
          </label>
          <label className="checkbox-label">
            <input type="checkbox" name="noHighRiskLifestyle" checked={formData.noHighRiskLifestyle} onChange={handleChange} />
            I do not engage in high-risk behaviors (drug abuse, etc).
          </label>
          {formData.gender === "Female" && (
            <label className="checkbox-label">
              <input type="checkbox" name="notPregnant" checked={formData.notPregnant} onChange={handleChange} />
              I am NOT currently pregnant.
            </label>
          )}
        </div>

        <h2>HLA Information</h2>
        <div className="input-group">
          <input name="HLA_A1" placeholder="HLA A1" value={formData.HLA_A1} onChange={handleChange} required />
          <input name="HLA_A2" placeholder="HLA A2" value={formData.HLA_A2} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <input name="HLA_B1" placeholder="HLA B1" value={formData.HLA_B1} onChange={handleChange} required />
          <input name="HLA_B2" placeholder="HLA B2" value={formData.HLA_B2} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <input name="HLA_C1" placeholder="HLA C1" value={formData.HLA_C1} onChange={handleChange} required />
          <input name="HLA_C2" placeholder="HLA C2" value={formData.HLA_C2} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <input name="HLA_DRB1_1" placeholder="HLA DRB1 (1)" value={formData.HLA_DRB1_1} onChange={handleChange} required />
          <input name="HLA_DRB1_2" placeholder="HLA DRB1 (2)" value={formData.HLA_DRB1_2} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <input name="HLA_DQ1" placeholder="HLA DQ1" value={formData.HLA_DQ1} onChange={handleChange} required />
          <input name="HLA_DQ2" placeholder="HLA DQ2" value={formData.HLA_DQ2} onChange={handleChange} required />
        </div>

        <div style={{ textAlign: "center", margin: "10px 0 20px" }}>
          <p style={{ fontSize: "14px", color: "#cbd5e1", marginBottom: "8px" }}>
            Don't have your bone marrow (HLA) information?
          </p>
          <a
            href="https://www.dkms-india.org/register-now?utm_source=google&utm_medium=cpc&utm_campaign=google_brand_keywords&gad_source=1&gad_campaignid=22474923569&gclid=Cj0KCQiA49XMBhDRARIsAOOKJHY5JzeXp1_HaqfcmhxOODxKAAdkarfv77HbJrucUU0-JVgdXBS6UIoaAn9vEALw_wcB"
            target="_blank"
            rel="noopener noreferrer"
            className="secondary-btn"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#2563eb",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "14px",
              border: "1px solid #3b82f6"
            }}
          >
            Register for HLA Kit
          </a>
        </div>

        <h2>Contact & Consent</h2>
        <div className="input-group">
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            readOnly // Make read-only
            style={{ backgroundColor: '#f0f0f0' }}
            required
          />
          <input name="phone" placeholder="Phone Number" pattern="[0-9]{10}" value={formData.phone} onChange={handleChange} required />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', textAlign: 'left' }}>
          <label className="checkbox-label">
            <input type="checkbox" name="hlaConsent" checked={formData.hlaConsent} onChange={handleChange} />
            I agree to HLA (Human Leukocyte Antigen) testing.
          </label>
          <label className="checkbox-label">
            <input type="checkbox" name="informedConsent" checked={formData.informedConsent} onChange={handleChange} />
            <b>Informed Consent:</b> I understand the donation process and risks, and donate voluntarily.
          </label>
          <label className="checkbox-label">
            <input type="checkbox" name="willingness" checked={formData.willingness} onChange={handleChange} />
            I am willing to donate when matched and available for follow-up.
          </label>
        </div>

        <button type="submit" className="primary-btn">
          Complete Registration
        </button>
      </form>
    </div>
  );
};

export default DonorForm;
