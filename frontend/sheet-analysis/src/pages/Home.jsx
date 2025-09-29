import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials";
import "../styles/Home.css";
import WhyChoose from "../components/WhyChoose";
import ThreeAnimation from "../components/ThreeAnimation";

function Home() {
  const { authData } = useContext(AuthContext);

  return (
    <div className="home-container">
      <Navbar />

      <div className="hero-section">
        <div className="hero-text">
          <h1>
            Unlock the Power of Your <span className="highlight">Data</span>{" "}
            with DataSense
          </h1>
          <p className="sub-hero-text">
            AI-powered analytics & secure file management to help you make
            smarter, faster decisions.
          </p>

          <div className="hero-buttons">
            {authData ? (
              <Link to="/dashboard">
                <button className="btn-primary">🚀 Go to Dashboard</button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <button className="btn-primary">Login</button>
                </Link>
                <Link to="/register">
                  <button className="btn-secondary">Register</button>
                </Link>
                <a href="#features">
                  <button className="btn-outline">📊 View Demo</button>
                </a>
              </>
            )}
          </div>

          <p className="trust-text">
            ✅ Trusted by 100+ professionals worldwide
          </p>
        </div>

        <div className="hero-right">
          <ThreeAnimation />
        </div>
      </div>

      {/* HOW IT WORKS SECTION */}
      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <span>1️⃣</span>
            <h3>Upload Data</h3>
            <p>Drag & drop Excel or CSV files into our platform.</p>
          </div>
          <div className="step-card">
            <span>2️⃣</span>
            <h3>Select Columns</h3>
            <p>Choose your X and Y axes for visualization.</p>
          </div>
          <div className="step-card">
            <span>3️⃣</span>
            <h3>Generate Charts</h3>
            <p>AI-powered charts are created instantly.</p>
          </div>
          <div className="step-card">
            <span>4️⃣</span>
            <h3>Save & Share</h3>
            <p>Download charts or revisit them in your history.</p>
          </div>
        </div>
      </div>

      
      <div className="features-section" id="features">
        <h2>Explore Our Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img
              src="https://img.icons8.com/color/96/upload.png"
              alt="Upload"
            />
            <h3>Seamless Upload</h3>
            <p>Drag and drop your files easily with our smart interface.</p>
          </div>
          <div className="feature-card">
            <img
              src="https://img.icons8.com/color/96/combo-chart--v1.png"
              alt="Charts"
            />
            <h3>Smart Insights</h3>
            <p>AI-driven charts that predict trends and improve decisions.</p>
          </div>
          <div className="feature-card">
            <img
              src="https://img.icons8.com/color/96/lock--v1.png"
              alt="Security"
            />
            <h3>Secure Storage</h3>
            <p>Your data is encrypted and safely backed up in the cloud.</p>
          </div>
        </div>
      </div>

      <WhyChoose />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default Home;
