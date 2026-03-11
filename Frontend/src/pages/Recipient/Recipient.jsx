import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api, { ML_API_URL } from "../../utils/api";
import axios from "axios";
import "./Recipient.css";

const Recipient = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hospital = location.state?.hospital;
  const ngo = location.state?.ngo;
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
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
    HLA_DQ2: ""
  });

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Restore state from sessionStorage on mount
  useEffect(() => {
    const savedState = sessionStorage.getItem("recipientSearchState");
    if (savedState) {
      const { formData, donors, hasSearched } = JSON.parse(savedState);
      setFormData(formData);
      setDonors(donors);
      setHasSearched(hasSearched);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Donor Search with Data:", formData);
    setLoading(true);
    setHasSearched(true);

    try {
      // Normalize HLA values (uppercase, trim, remove colons/spaces)
      const normalize = (val) => val ? val.toString().trim().replace(/[\s:]/g, "").toUpperCase() : "";

      const normalizedData = {
        ...formData,
        HLA_A1: normalize(formData.HLA_A1),
        HLA_A2: normalize(formData.HLA_A2),
        HLA_B1: normalize(formData.HLA_B1),
        HLA_B2: normalize(formData.HLA_B2),
        HLA_C1: normalize(formData.HLA_C1),
        HLA_C2: normalize(formData.HLA_C2),
        HLA_DRB1_1: normalize(formData.HLA_DRB1_1),
        HLA_DRB1_2: normalize(formData.HLA_DRB1_2),
        HLA_DQ1: normalize(formData.HLA_DQ1),
        HLA_DQ2: normalize(formData.HLA_DQ2),
      };

      // Step 1: Query the Node Backend (MongoDB Atlas) for matched donors
      const res = await api.post("/api/donor/match", normalizedData);

      console.log("Backend Response:", res.data);

      if (res.data.error) {
        alert("Error from server: " + res.data.error);
        setDonors([]);
      } else {
        // Map Backend response
        let mappedDonors = res.data.map(d => ({
          ...d,
          matchScore: d.matchScore !== undefined ? `${d.matchScore} Matches` : "Match Found",
        }));

        // Step 2: Call Flask ML API for suitability predictions
        try {
          const mlRes = await axios.post(`${ML_API_URL}/ml-predict`, {
            recipient: {
              bloodGroup: formData.bloodGroup,
              HLA_A1: normalizedData.HLA_A1,
              HLA_A2: normalizedData.HLA_A2,
              HLA_B1: normalizedData.HLA_B1,
              HLA_B2: normalizedData.HLA_B2,
              HLA_C1: normalizedData.HLA_C1,
              HLA_C2: normalizedData.HLA_C2,
              HLA_DRB1_1: normalizedData.HLA_DRB1_1,
              HLA_DRB1_2: normalizedData.HLA_DRB1_2,
              HLA_DQ1: normalizedData.HLA_DQ1,
              HLA_DQ2: normalizedData.HLA_DQ2,
              age: formData.age
            },
            donors: mappedDonors.map(d => ({
              _id: d._id,
              bloodGroup: d.bloodGroup,
              HLA_A1: normalize(d.HLA_A1),
              HLA_A2: normalize(d.HLA_A2),
              HLA_B1: normalize(d.HLA_B1),
              HLA_B2: normalize(d.HLA_B2),
              HLA_C1: normalize(d.HLA_C1),
              HLA_C2: normalize(d.HLA_C2),
              HLA_DRB1_1: normalize(d.HLA_DRB1_1),
              HLA_DRB1_2: normalize(d.HLA_DRB1_2),
              HLA_DQ1: normalize(d.HLA_DQ1),
              HLA_DQ2: normalize(d.HLA_DQ2),
              age: d.age,
              weight: d.weight || 65
            }))
          });

          console.log("ML Predictions:", mlRes.data);

          // Merge ML predictions into donor data
          if (Array.isArray(mlRes.data)) {
            mappedDonors = mappedDonors.map((donor, idx) => {
              const mlPred = mlRes.data[idx];
              if (mlPred) {
                return {
                  ...donor,
                  mlSuitability: mlPred.suitability,
                  mlConfidence: mlPred.confidence,
                  mlProbabilities: mlPred.probabilities
                };
              }
              return donor;
            });
          }
        } catch (mlError) {
          console.warn("ML server not available, showing results without ML predictions:", mlError.message);
          // Continue without ML predictions - they're optional
        }

        setDonors(mappedDonors);
        sessionStorage.setItem("recipientSearchState", JSON.stringify({
          donors: mappedDonors,
          formData: formData,
          hasSearched: true
        }));
      }
    } catch (error) {
      console.error("Error connecting to server:", error);
      alert("Error finding donors. Please ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  // Helper: get CSS class for suitability badge
  const getSuitabilityClass = (suitability) => {
    switch (suitability) {
      case "High": return "suitability-high";
      case "Medium": return "suitability-medium";
      case "Low": return "suitability-low";
      default: return "";
    }
  };

  return (
    <div className="recipient-page">
      <h1 className="title">Request for Stem Cell Donor</h1>
      <p className="subtitle">Enter Patient Details to Find a Match</p>
      
      {hospital && (
        <div className="linked-hospital-badge">
          🏥 Search request for: <strong>{hospital.hospitalName}</strong>
        </div>
      )}

      <form className="recipient-card" onSubmit={handleSubmit}>
        <h2>Patient Details</h2>

        <div className="input-group">
          <input
            name="name"
            placeholder="Patient Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            type="tel"
            placeholder="WhatsApp Number (e.g. 919876543210)"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <input
            name="age"
            type="number"
            placeholder="Age"
            min="0"
            max="100"
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

          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
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
        </div>

        <h2>HLA Information</h2>
        <div className="input-group">
          <input
            name="HLA_A1"
            placeholder="HLA A1 Type"
            value={formData.HLA_A1}
            onChange={handleChange}
            required
          />
          <input
            name="HLA_A2"
            placeholder="HLA A2 Type"
            value={formData.HLA_A2}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <input
            name="HLA_B1"
            placeholder="HLA B1 Type"
            value={formData.HLA_B1}
            onChange={handleChange}
            required
          />
          <input
            name="HLA_B2"
            placeholder="HLA B2 Type"
            value={formData.HLA_B2}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <input
            name="HLA_C1"
            placeholder="HLA C1 Type"
            value={formData.HLA_C1}
            onChange={handleChange}
            required
          />
          <input
            name="HLA_C2"
            placeholder="HLA C2 Type"
            value={formData.HLA_C2}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <input
            name="HLA_DRB1_1"
            placeholder="HLA DRB1 (1) Type"
            value={formData.HLA_DRB1_1}
            onChange={handleChange}
            required
          />
          <input
            name="HLA_DRB1_2"
            placeholder="HLA DRB1 (2) Type"
            value={formData.HLA_DRB1_2}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <input
            name="HLA_DQ1"
            placeholder="HLA DQ1 Type"
            value={formData.HLA_DQ1}
            onChange={handleChange}
            required
          />
          <input
            name="HLA_DQ2"
            placeholder="HLA DQ2 Type"
            value={formData.HLA_DQ2}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "🔄 Analyzing with ML..." : "🔎 Search for Donors"}
        </button>
      </form>

      {hasSearched && (
        <div className="results">
          <h2>
            {donors.length > 0
              ? `Found ${donors.length} Potential Donors`
              : "No Direct Matches Found"}
          </h2>

          <div className="donor-results">
            {donors.map((d, index) => (
              <div
                key={d._id || index}
                className="donor-result-card"
                onClick={() => navigate(`/donor-details/${d._id}`, { state: { donor: d, hospital, ngo } })}
                style={{ cursor: "pointer" }}
              >
                <h3>Donor #{index + 1}</h3>

                {/* ML Suitability Badge */}
                {d.mlSuitability && (
                  <div className={`ml-badge ${getSuitabilityClass(d.mlSuitability)}`}>
                    <span className="ml-label">🤖 ML Prediction</span>
                    <span className="ml-suitability">{d.mlSuitability} Compatibility</span>
                    <span className="ml-confidence">{d.mlConfidence}% Confidence</span>
                  </div>
                )}

                <p><span>Blood Group:</span> <span className="highlight">{d.bloodGroup}</span></p>
                <p><span>Age:</span> <span>{d.age}</span></p>
                <p><span>Gender:</span> <span>{d.gender}</span></p>
                {d.matchScore && (
                  <p><span>HLA Match:</span> <span className="highlight">{d.matchScore}</span></p>
                )}

                {/* ML Probability Breakdown */}
                {d.mlProbabilities && (
                  <div className="ml-probabilities">
                    <p className="prob-title">Match Probability:</p>
                    <div className="prob-bars">
                      {Object.entries(d.mlProbabilities)
                        .filter(([label]) => label === d.mlSuitability)
                        .map(([label, pct]) => (
                          <div key={label} className="prob-row">
                            <span className="prob-label">{label}</span>
                            <div className="prob-bar-bg">
                              <div
                                className={`prob-bar-fill prob-${label.toLowerCase()}`}
                                style={{ width: `${pct}%` }}
                              ></div>
                            </div>
                            <span className="prob-value">{pct}%</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <p className="view-more" style={{ marginTop: '10px', color: '#007bff', fontSize: '0.9em' }}>Click to View Details</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipient;
