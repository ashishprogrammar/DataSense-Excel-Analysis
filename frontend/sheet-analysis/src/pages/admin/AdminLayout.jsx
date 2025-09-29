
import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./Admin.css";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  
  const getPageTitle = () => {
    if (location.pathname.includes("overview")) return "Dashboard Overview";
    if (location.pathname.includes("users")) return "User Management";
    if (location.pathname.includes("files")) return "File Management";
    return "Admin Dashboard";
  };

  
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login"); 
  };

  
  const goHome = () => {
    navigate("/");
  };

  
  const isRootAdmin = location.pathname === "/admin";

  return (
    <div className="admin-layout">
      
      <aside className="admin-sidebar">
        <h2>Admin</h2>
        <ul>
          <li><Link to="/admin/overview">Overview</Link></li>
          <li><Link to="/admin/users">Manage Users</Link></li>
          <li><Link to="/admin/files"> Files</Link></li>
        </ul>
      </aside>

      
      <div className="admin-main">
        
        <header className="admin-navbar">
          <h3>{getPageTitle()}</h3>
          <div className="admin-navbar-right">
            <input
              type="text"
              placeholder="Search..."
              className="navbar-search"
            />
            <div className="admin-profile">
              <img
                src="https://i.pravatar.cc/40"
                alt="admin"
                className="admin-avatar"
              />
              <span className="admin-name">Admin</span>
              <button className="home-btn" onClick={goHome}>Home</button>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </header>

        
        <main className="admin-content">
          {isRootAdmin ? (
            <div className="welcome-box">
              <h1>👋 Welcome, Admin!</h1>
              <p>Select an option from the sidebar to manage the dashboard.</p>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

