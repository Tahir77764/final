import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "./DonorDetails.css";

const DonorDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { donor } = location.state || {};

    if (!donor) {
        return (
            <div className="donor-details-page">
                <div className="details-card">
                    <h2>No Donor Selected</h2>
                    <button onClick={() => navigate("/recipient")}>Back to Search</button>
                </div>
            </div>
        );
    }

    return (
        <div className="donor-details-page">
            <div className="details-card">
                <button onClick={() => navigate("/recipient")} className="back-btn">← Back to Results</button>

                <h1 className="donor-title">Donor Profile</h1>

                <div className="profile-header">
                    <div className="avatar-placeholder">
                        {(donor.name || donor.Name) ? (donor.name || donor.Name).charAt(0) : "D"}
                    </div>
                    <div className="header-info">
                        <h2>{donor.name || donor.Name || `Donor #${donor._id}`}</h2>
                        <p className="match-badge">Match Score: {donor.matchScore}</p>
                    </div>
                </div>

                <div className="info-grid">
                    <div className="info-section">
                        <h3>Personal Info</h3>
                        <p><strong>Age:</strong> {donor.age || donor.Age}</p>
                        <p><strong>Gender:</strong> {donor.gender || donor.Gender}</p>
                        <p><strong>Blood Group:</strong> <span className="highlight">{donor.bloodGroup || donor.Blood_Group}</span></p>
                    </div>

                    <div className="info-section">
                        <h3>Contact Info</h3>
                        <p><strong>Email:</strong> {donor.Email || "Restricted"}</p>
                        <p><strong>Phone:</strong> {donor.Mobile || "Restricted"}</p>
                        <p><strong>Location:</strong> {donor.Address || "Unknown"}</p>
                    </div>

                    <div className="info-section full-width">
                        <h3>HLA Typing</h3>
                        <div className="hla-grid">
                            <div className="hla-item"><strong>HLA-A1:</strong> {donor.HLA_A1}</div>
                            <div className="hla-item"><strong>HLA-A2:</strong> {donor.HLA_A2}</div>
                            <div className="hla-item"><strong>HLA-B1:</strong> {donor.HLA_B1}</div>
                            <div className="hla-item"><strong>HLA-B2:</strong> {donor.HLA_B2}</div>
                            <div className="hla-item"><strong>HLA-C1:</strong> {donor.HLA_C1}</div>
                            <div className="hla-item"><strong>HLA-C2:</strong> {donor.HLA_C2}</div>
                            <div className="hla-item"><strong>HLA-DRB1 (1):</strong> {donor.HLA_DRB1_1}</div>
                            <div className="hla-item"><strong>HLA-DRB1 (2):</strong> {donor.HLA_DRB1_2}</div>
                            <div className="hla-item"><strong>HLA-DQ1:</strong> {donor.HLA_DQ1}</div>
                            <div className="hla-item"><strong>HLA-DQ2:</strong> {donor.HLA_DQ2}</div>
                        </div>
                    </div>
                </div>

                <div className="action-buttons">
                    <button className="primary-btn" onClick={async () => {
                        const recipientState = JSON.parse(sessionStorage.getItem("recipientSearchState") || "{}");
                        const recipient = recipientState.formData || {};
                        const user = JSON.parse(localStorage.getItem("user") || "{}");

                        try {
                            const res = await api.post("/api/donor/contact", {
                                donorId: donor._id,
                                recipientName: recipient.name || user.username || "Anonymous Patient",
                                recipientEmail: user.email || "Not Provided",
                                recipientPhone: recipient.phone || "Not Provided",
                                recipientDetails: {
                                    age: recipient.age || "N/A",
                                    bloodGroup: recipient.bloodGroup || "N/A"
                                }
                            });

                            if (res.status === 200) {
                                alert("Request sent to donor! They will receive an email with options to accept or decline.");
                            } else {
                                alert("Failed to contact donor.");
                            }
                        } catch (err) {
                            console.error(err);
                            alert("Error sending request.");
                        }
                    }}>Request Contact (Save a Life)</button>
                </div>
            </div>
        </div>
    );
};

export default DonorDetails;
