import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || "donor"; // Default to donor if no role specified

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      // Save token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("auth-change")); // Trigger update in same tab

      alert("Login successful");

      const userRole = res.data.user.role || role; // Prefer response role, then state role

      if (userRole === "donor") {
        navigate("/donorform");
      } else {
        navigate("/recipient");
      }

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>{role === "donor" ? "Donor Login" : "Recipient Login"}</h2>
        <p className="subtitle">Sign in to your account</p>

        <label>Email</label>
        <div className="input-box">
          <span className="icon">📧</span>
          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <label>Password</label>
        <div className="input-box">
          <span className="icon">🔒</span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="toggle" onClick={() => setShowPassword(!showPassword)}>
            👁️
          </span>
        </div>

        <button className="login-button" onClick={handleLogin}>
          Sign In
        </button>

        <p className="register-text">
          Don't have an account?
          <Link to="/register" state={{ role: role }}><span> Register as {role}</span></Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
