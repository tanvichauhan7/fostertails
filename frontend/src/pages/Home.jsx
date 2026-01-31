import { useState } from "react";
import "./Home.css";

const Home = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showStrayForm, setShowStrayForm] = useState(false);

  return (
    <div className="home">

      {/* ================= HERO ================= */}
      <section className="hero">

        {/* TOP RIGHT AUTH */}
        <div className="top-auth">
          <button
            onClick={() => {
              setShowAuth(true);
              setIsLogin(true);
            }}
          >
            Login
          </button>

          <button
            className="register"
            onClick={() => {
              setShowAuth(true);
              setIsLogin(false);
            }}
          >
            Register
          </button>
        </div>

        {/* LEFT CONTENT */}
        <div className="hero-text">
          <span className="badge">🐾 India’s Pet Adoption Network</span>

          <h1>
            Give Them a <br />
            <span>Second Chance</span> at Life
          </h1>

          <p>
            FosterTails connects rescued pets with loving humans.
            Adopt, foster, or support NGOs — all in one place.
          </p>

          <a href="/pets" className="primary-btn">
            Browse Pets
          </a>
        </div>

        {/* RIGHT ACTION CARDS */}
        <div className="hero-actions">

          <div
            className="action-card"
            onClick={() => setShowStrayForm(true)}
          >
            <span className="icon">🐶</span>
            <h3>Found a Stray?</h3>
            <p>Report a stray animal and help them get rescued.</p>
            <span className="link">Add a Stray</span>
          </div>

          <div className="action-card">
            <span className="icon">🏠</span>
            <h3>Adopt or Foster</h3>
            <p>Give a loving home to a rescued pet.</p>
            <a href="/pets">View Pets</a>
          </div>

          <div className="action-card">
            <span className="icon">🤝</span>
            <h3>Connect with NGOs</h3>
            <p>Partner with shelters & rescue groups.</p>
            <a href="/ngos">Explore NGOs</a>
          </div>

        </div>
      </section>

      {/* ================= MISSION SECTION ================= */}
      <section className="mission">
        <div className="mission-container">

          <div className="mission-image">
            <img
  src="/mission-dog.jpg"
  alt="Rescue dog with loving human"
/>

          </div>

          <div className="mission-text">
            <span className="badge">Our Mission 🐾</span>

            <h2>
              Every Rescue Deserves <br />
              <span>A Loving Home</span>
            </h2>

            <p>
              FosterTails is built to ensure that no rescued animal
              is left unseen or unheard. We work to connect strays,
              shelters, and compassionate humans across India.
            </p>

            <p>
              By enabling adoption, fostering, stray reporting, and
              NGO collaboration, we’re creating a safer future for
              every paw that needs help.
            </p>

            <a href="/about" className="primary-btn">
              Learn Our Story
            </a>
          </div>

        </div>
      </section>

      {/* ================= LOGIN / REGISTER MODAL ================= */}
      {showAuth && (
        <div className="modal-backdrop">
          <div className="modal">
            <button className="close" onClick={() => setShowAuth(false)}>
              ✕
            </button>

            <h2>{isLogin ? "Welcome Back 🐾" : "Join FosterTails"}</h2>

            {!isLogin && <input placeholder="Full Name" />}
            <input placeholder="Email" />
            <input type="password" placeholder="Password" />

            <button className="primary-btn">
              {isLogin ? "Login" : "Register"}
            </button>

            <p>
              {isLogin ? "New here?" : "Already have an account?"}
              <span onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? " Create one" : " Login"}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* ================= STRAY REPORT MODAL ================= */}
      {showStrayForm && (
        <div className="modal-backdrop">
          <div className="modal">
            <button className="close" onClick={() => setShowStrayForm(false)}>
              ✕
            </button>

            <h2>Report a Stray 🐾</h2>

            <select>
              <option value="">Animal Type</option>
              <option>Dog</option>
              <option>Cat</option>
              <option>Other</option>
            </select>

            <input placeholder="Breed (if known)" />
            <input placeholder="Color" />
            <input placeholder="Approximate Age" />

            <input placeholder="Area / Locality" />
            <input placeholder="City" />

            <input type="file" accept="image/*" />

            <button className="primary-btn">
              Submit Report
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
