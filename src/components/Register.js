import React, { useState } from "react";
import { api } from "../api";
import { useNavigate, Link } from "react-router-dom";
import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";
import PublicHeader from "./PublicHeader";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // 1. Register user
      const res = await api.post("/register", formData);

      // 2. Store tokens
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);

      setFormData({ name: "", email: "", number: "", password: "" });
      setMessage("Registration successful!");

      // 3. Register FCM token
      try {
        if (Notification.permission === "default") {
          const permission = await Notification.requestPermission();
          if (permission !== "granted") return;
        }

        if (Notification.permission === "granted") {
          const fcmToken = await getToken(messaging, {
            vapidKey: "YOUR_VAPID_KEY_HERE",
          });

          if (fcmToken) {
            await api.post(
              "/save-fcm-token",
              { token: fcmToken },
              {
                headers: {
                  Authorization: `Bearer ${res.data.access_token}`,
                },
              }
            );
          }
        }
      } catch (err) {
        console.warn("FCM token registration failed:", err);
      }

      // 4. Navigate to expenses
      navigate("/expenses");
    } catch (error) {
      if (error.response?.data?.errors) {
        setMessage(Object.values(error.response.data.errors).join(", "));
      } else if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Network error.");
      }
    }
  };

  return (
    <div className="r-container">
      <PublicHeader />

      <div className="auth-container">
        <h2 className="page-title">Create Account</h2>

        {message && <p className="form-message">{message}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="form-input"
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            className="form-input"
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            className="form-input"
            type="text"
            name="number"
            placeholder="Phone number"
            value={formData.number}
            onChange={handleChange}
          />

          <div className="password-field">
            <input
              className="form-input"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button className="primary-button" type="submit">
            Register
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

