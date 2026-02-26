import './Awareness.css';

function Awareness() {
  return (
    <div className="awareness-container">
      <div className="awareness-hero">
        <h1>Spreading Awareness</h1>
        <p>One donor can save a life. Watch and share.</p>
      </div>

      <div className="video-section">
        <div className="video-wrapper">
          <iframe
            src="https://www.youtube.com/embed/O2HbYRf_NZI?si=yfxGxvPFf5Zx5XGh&amp;start=315&end=387&mute=1"
            title="Stem Cell Awareness Clip"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>

        <div className="awareness-text">
          <h2>Why It Matters</h2>
          <p>
            Thousands of patients wait for a matching stem cell donor.
            Awareness saves lives.
          </p>
        </div>
      </div>
    </div>
  )
}
export default Awareness;