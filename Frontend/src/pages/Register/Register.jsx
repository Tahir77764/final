import React, { useState } from "react";
import api from "../../utils/api";
import "./Register.css";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || "donor"; // Default to donor

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    otp: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const register = async () => {
    try {
      await api.post("/api/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: role // Send role to backend
      });

      alert("OTP sent to your email");
      setStep(2);

    } catch (error) {
      alert(error.response?.data?.message || "Server error");
    }
  };

  const verifyOtp = async () => {
    try {
      await api.post("/api/auth/verify-otp", {
        email: formData.email,
        otp: formData.otp
      });
      alert("Registration Successful! Please Login.");
      // Redirect to Login page with same role state
      navigate("/login", { state: { role: role } });
    } catch (error) {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {step === 1 && (
          <>
            <h1>Create Account</h1>
            <p className="subtitle">Register as {role}</p>

            <label>Username</label>
            <div className="input-box">
              <input
                name="username"
                placeholder="Enter your username"
                onChange={handleChange}
                required
              />
            </div>

            <label>Email</label>
            <div className="input-box">
              <input
                name="email"
                placeholder="Enter your email"
                onChange={handleChange}
                required
              />
            </div>

            <label>Password</label>
            <div className="input-box">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create password"
                onChange={handleChange}
                required
              />
              <span
                className="eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁
              </span>
            </div>

            <button className="auth-btn" onClick={register}>
              Send OTP
            </button>

            <p className="switch-text">
              Already have an account? <Link to="/login" state={{ role: role }}><span>Login</span></Link>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h1>Verify OTP</h1>
            <p className="subtitle">Check your email for OTP</p>

            <label>OTP</label>
            <div className="input-box">
              <input
                name="otp"
                placeholder="Enter OTP"
                onChange={handleChange}
                required
              />
            </div>

            <button className="auth-btn" onClick={verifyOtp}>
              Verify & Register
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
