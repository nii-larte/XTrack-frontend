import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "../api";
import "./Navbar.css";


function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({});
  const token = localStorage.getItem("token");
  const API_URL = process.env.REACT_APP_API_URL

  useEffect(() => {
    if (token) {
      const fetchUser = async () => {
        try {
          const res = await api.get("/user/profile");
          setUser(res.data);

          const userTheme = res.data.theme || "light";
          document.documentElement.setAttribute("data-theme", userTheme);
          localStorage.setItem("theme", userTheme);
        } catch (err) {
          console.error(err);
          document.documentElement.setAttribute("data-theme", "light");
          localStorage.setItem("theme", "light");
        }
      };
      fetchUser();
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [token]);


  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("theme"); 
    document.documentElement.setAttribute("data-theme", "light"); 
    navigate("/login");
  };


  const profileImage = user.profile_picture
    ? `${API_URL}/uploads/profile_pictures/${user.profile_picture}`
    : null;

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          Home
        </Link>

        {token && (
          <div className="nav-dropdown">
            <button className="nav-link"> Menu ▾</button>
            <div className="dropdown-menu">
              <Link to="/expenses">All Expenses</Link>
              <Link to="/add-expense">Add Expense</Link>
              <Link to="/dashboard">Dashboard</Link>
            </div>
          </div>
        )}
      </div>

      <div className="nav-right">
        {token && user.name && (
          <div className="nav-dropdown">
            <button className="nav-profile">
              {profileImage && (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="profile-avatar"
                />
              )}
              <span>{user.name}</span> ▾
            </button>

            <div className="dropdown-menu dropdown-right">
              <Link to="/profile">Profile</Link>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          </div>
        )}

        {!token && (
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
