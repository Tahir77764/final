import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <section className="home">
      {/* HERO SECTION */}
      <div className="hero">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1>Stem Cell Donors are Legends</h1>

          <p>
            Aged 18-35? You could be the only person in the world who could save
            the life of someone with blood cancer.
          </p>

          <p>
            Stem cell donation is simple and life-changing. Help give someone a
            second chance at life.
          </p>

          <p>
            Help save the life of someone with blood cancer. Sign up to be a stem
            cell donor today.
          </p>

          <Link to="/user-selection"><button className="hero-btn">Get Started</button></Link>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="stats">
        <div className="stat-card">
          <h2>50,000+</h2>
          <span>Registered Donors</span>
        </div>

        <div className="stat-card">
          <h2>1,200+</h2>
          <span>Lives Saved</span>
        </div>

        <div className="stat-card">
          <h2>100+</h2>
          <span>Partner Hospitals</span>
        </div>
      </div>
    </section>
  );
};

export default Home;
