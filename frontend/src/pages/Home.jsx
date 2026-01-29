import { useState } from "react";
import "./Home.css";

const Home = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="home">

      {/* HERO */}
      <section className="hero">

        {/* TOP RIGHT AUTH (HOVER) */}
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

        {/* HERO TEXT */}
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

        {/* HERO IMAGE */}
        <div className="hero-image">
          <img src="/hero-pet.png" alt="Pet" />
        </div>
      </section>

      {/* AUTH MODAL */}
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
    </div>
  );
};

export default Home;
