import { useState, useEffect } from "react";
import "./Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check login status on mount and when localStorage changes
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkLogin();
    window.addEventListener("storage", checkLogin);
    window.addEventListener("auth-change", checkLogin); // Listen for same-tab updates

    return () => {
      window.removeEventListener("storage", checkLogin);
      window.removeEventListener("auth-change", checkLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("auth-change"));
    setIsLoggedIn(false);
    navigate("/");
    alert("Logged out successfully");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <NavLink to="/">StemLife</NavLink></div>

      {/* Links */}
      <ul className={`navbar-links ${open ? "active" : ""}`}>
        <li><NavLink to="/recipient">Recipient</NavLink></li>
        <li><NavLink to="/donor">Donor</NavLink></li>
        <li><NavLink to="/hospital">Hospital</NavLink></li>
        <li><NavLink to="/ngos">NGO</NavLink></li>
        <li><NavLink to="/awareness">Awareness</NavLink></li>
        <li className="mobile-login">
          {isLoggedIn ? (
            <button className="login-btn" onClick={handleLogout}>Log out</button>
          ) : (
            <NavLink to="/login" className="login-btn">Log in</NavLink>
          )}
        </li>
      </ul>

      {/* Desktop Login */}
      {
        isLoggedIn ? (
          <button className="login-btn desktop-login" onClick={handleLogout}>Log out</button>
        ) : (
          <NavLink to="/login" className="login-btn desktop-login">Log in</NavLink>
        )
      }

      {/* Hamburger */}
      <div className="hamburger" onClick={() => setOpen(!open)}>
        ☰
      </div>
    </nav >
  );
};

export default Navbar;
