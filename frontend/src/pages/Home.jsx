import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <p className="eyebrow">YOUR PERSONAL JOURNAL</p>

        <h1>
          Every day
          <br />
          has a <span>story.</span>
        </h1>

        <p className="hero-text">
          A little place to collect your thoughts,
          capture your memories, and keep the
          beautiful moments of everyday life.
        </p>

        <Link to="/write" className="primary-btn">
          Write Today's Journal →
        </Link>
      </section>

      <section className="home-info">
        <div>
          <span className="info-icon">✎</span>
          <h3>Write Freely</h3>
          <p>Give your thoughts a place to belong.</p>
        </div>

        <div>
          <span className="info-icon">♡</span>
          <h3>Keep Memories</h3>
          <p>Save your favourite moments and photos.</p>
        </div>

        <div>
          <span className="info-icon">❀</span>
          <h3>Look Back</h3>
          <p>Return to the little things that matter.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;