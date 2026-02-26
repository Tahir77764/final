import { useNavigate } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      {/* Top Section */}
      <div className="footer-top">
        {/* Left */}
        <div className="footer-col">
          <h2 className="footer-logo" onClick={() => navigate("/")}>StemLife</h2>
          <p className="footer-text">
            Connecting stem cell donors with patients in need. Every donation is
            a chance to save a life.
          </p>
          <p className="footer-location">📍 New Delhi, India</p>
        </div>

        {/* Middle */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <div className="footer-links">
            <button onClick={() => navigate("/donorform")}>❤️ Become a Donor</button>
            <button onClick={() => navigate("/hospital")}>🏥 Find Hospital</button>
            <button onClick={() => navigate("/ngos")}>🤝 Partner NGOs</button>
            <button onClick={() => navigate("/about")}>ℹ️ About Us</button>
          </div>
        </div>

        {/* Right */}
        <div className="footer-col">
          <h3>Contact Us</h3>
          <div className="footer-contact">
            <div className="contact-box" onClick={() => window.location.href = "tel:+911800123456"} style={{ cursor: "pointer" }}>📞 +91 1800-123-4567</div>
            <div className="contact-box" onClick={() => window.location.href = "mailto:support@stemlife.org"} style={{ cursor: "pointer" }}>✉️ support@stemlife.org</div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="footer-divider" />

      {/* Bottom */}
      <div className="footer-bottom">
        <span>© 2025 StemLife. All rights reserved.</span>
        <div className="footer-policies">
          <button onClick={() => navigate("/about")}>Privacy Policy</button>
          <button onClick={() => navigate("/about")}>Terms of Service</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
