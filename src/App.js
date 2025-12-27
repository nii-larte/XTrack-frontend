import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import IdleSessionManager from "./IdleSessionManager";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Expenses from "./components/Expenses";
import AddExpense from "./components/AddExpense";
import EditExpense from "./components/EditExpense";
import Dashboard from "./components/Chart";
import Profile from "./components/Profile";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ChangePassword from "./components/ChangePassword";
import Settings from "./components/Settings";
import { api } from "./api";

function AppContent() {
  const [theme, setTheme] = useState("light");
  const location = useLocation();
  const navigate = useNavigate();

  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    setTheme(theme);
  };

  useEffect(() => {
    const publicRoutes = [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
    ];

    // Skip auth check for public routes
    if (publicRoutes.includes(location.pathname)) return;

    const checkAuth = async () => {
      try {
        const res = await api.get("/user/profile"); // fetch profile to check login
        const userTheme = res.data.theme || "light";
        applyTheme(userTheme);
      } catch (err) {
        // Redirect to login if protected page and not logged in
        navigate("/login");
      }
    };

    checkAuth();
  }, [location.pathname, navigate]);

  return (
    <div style={{ paddingTop: "60px" }}>
      <Navbar theme={theme} />
      <IdleSessionManager />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/expenses/edit/:id" element={<EditExpense />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/change-password" element={<ChangePassword />} />
        <Route
          path="/settings"
          element={<Settings theme={theme} setTheme={applyTheme} />}
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
