import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import "../styles/Navbar.css";

function Navbar() {
  const { authData, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-brand">
          DataSense
        </Link>
      </div>
      <div className="nav-right">
        
        {authData && (
          <button onClick={toggleTheme} className="nav-link btn-theme">
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>
        )}

        
        {authData ? (
          <>
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            {authData.role === "admin" && (
              <Link to="/admin" className="nav-link">
                Admin Panel
              </Link>
            )}
            <button onClick={logout} className="nav-link btn-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

