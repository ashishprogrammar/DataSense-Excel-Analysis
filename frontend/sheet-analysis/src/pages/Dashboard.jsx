import React, { useContext, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import FileUpload from "../components/FileUpload";
import UserInfo from "../components/UserInfo";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";
import DashboardAIInsights from "../components/DashboardAIInsights";
import { ThemeContext } from "../context/ThemeContext";

const Dashboard = () => {
  const { authData, logout } = useContext(AuthContext);
  const [currentFileId, setCurrentFileId] = useState(null);
  const [columnTypes, setColumnTypes] = useState({});

  const { darkMode, toggleTheme } = useContext(ThemeContext); 

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      console.log("Dropped file:", file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className={`dashboard ${darkMode ? "dark-theme" : "day-theme"}`}>
      <nav className="navbar">
        {/* Left Section - Logo & Links */}
        <div className="nav-left">
          <div className="logo-container">
            <span className="logo-icon"></span>
            <h2 className="logo-text">DataSense</h2>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/history" className="nav-link">
              History
            </Link>
          </div>
        </div>

        {/* Right Section - User + Theme + Logout */}
        <div className="nav-right">
          <div className="user-details">
            <span className="username">{authData?.username}</span>
            <span className="email">{authData?.email}</span>
          </div>

          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {darkMode ? "🌞 Light" : "🌙 Dark"}
          </button>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <h2 className="welcome-heading">
          Welcome, {authData?.username || "User"} 👋
        </h2>

        <UserInfo user={authData} />

        <section className="upload-section">
          <h3>Upload Your Data File</h3>
          <p className="section-description">
            Drag & drop your Excel or CSV file below, or use the upload button
            to get started.
          </p>

          <div
            className="drag-drop-zone"
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
          >
            <p className="drop-icon">📂</p>
            <p>Drag & Drop files here</p>
            <p>or</p>
            <FileUpload
              onUploadSuccess={(data) => {
                setCurrentFileId(data.fileId);
                setColumnTypes(data.columnTypes || {});
              }}
            />
          </div>
        </section>

        {/* Insights Section */}
        <section className="analytics-section">
          <h3>AI-Generated Insights</h3>
          {currentFileId ? (
            <DashboardAIInsights
              fileId={currentFileId}
              columnTypes={columnTypes}
            />
          ) : (
            <p className="placeholder-text">
              Please upload a file to see AI-generated insights.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
