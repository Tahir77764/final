import { Link } from "react-router-dom";
import "./Donor.css";

const Donor = () => {
  return (
    <section className="donor">

      {/* HERO */}
      <div className="donor-hero">
        <h1>Become a Donor</h1>
        <p>
          Join thousands of heroes who have registered to save lives through
          stem cell donation.
        </p>
      </div>

      {/* WHY SECTION */}
      <div className="donor-why">
        <h2>Why Become a Donor?</h2>

        <div className="donor-cards">
          <div className="donor-card">
            <span>❤️</span>
            <h3>Save Lives</h3>
            <p>
              Your donation could be the perfect match for someone fighting
              blood cancer.
            </p>
          </div>

          <div className="donor-card">
            <span>✅</span>
            <h3>Safe & Simple</h3>
            <p>
              The donation process is painless and takes only a few hours.
            </p>
          </div>

          <div className="donor-card">
            <span>👥</span>
            <h3>Join Community</h3>
            <p>
              Become part of a global network of lifesavers.
            </p>
          </div>

          <div className="donor-card">
            <span>⏱️</span>
            <h3>Quick Process</h3>
            <p>
              Registration takes just 10 minutes online.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="donor-cta">
        <h2>Ready to Make a Difference?</h2>
        <Link to="/donorform"><button>Register Now</button></Link>
      </div>
    </section>
  );
};

export default Donor;
