import React, { useState } from "react";
import { api } from "../api";
import { useNavigate, Link } from "react-router-dom";
import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";
import NotificationSetupModal from "./NotificationSetupModal";
import PublicHeader from "./PublicHeader";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);

  const registerFcmToken = async () => {
    try {
      if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;
      }

      if (Notification.permission !== "granted") return;

      const fcmToken = await getToken(messaging, {
        vapidKey: "BGGz-kkJr4z0LD9VGaX237zZeg7SwZXqv7-TRsrwG7ljQV2ax0XKd-9LvKl4ObdhqWDfiO1wBFXeSnDWwetXuG4",
      });

      if (!fcmToken) return;

      await api.post(
        "/save-fcm-token",
        { token: fcmToken },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (err) {
      console.warn("FCM token registration failed:", err);
    }
  };

  const handleLoginSuccess = async () => {
    try {
      const res = await api.get("/notification-setting");
      if (!res.data) {
        setShowReminderModal(true);
      }
    } catch {
      setShowReminderModal(true);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/login", {
        name: name.trim(),
        password: password.trim(),
      });

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);

      await registerFcmToken();

      await handleLoginSuccess();
      navigate("/expenses");
    } catch (error) {
      if (error.response?.data?.errors) {
        setMessage(Object.values(error.response.data.errors).join(", "));
      } else if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Network error.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/forgot-password", { email: forgotEmail.trim() });
      setMessage("A reset link has been sent to your email!");
    } catch {
      setMessage("Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    < div className="l-container" >
    <PublicHeader />
    <div className="auth-container">
      <h2 className="page-title">Login</h2>
      {message && <p className="form-message">{message}</p>}

      {!showForgot ? (
        <form className="auth-form" onSubmit={handleLogin}>
          <input
            className="form-input"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="password-field">
            <input
              className="form-input"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p
            className="forgot-password-link"
            onClick={() => {
              setShowForgot(true);
              setMessage("");
            }}
          >
            Forgot Password?
          </p>
        </form>
      ) : (
        <form className="auth-form" onSubmit={handleForgotPassword}>
          <input
            className="form-input"
            type="email"
            placeholder="Enter your email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            required
          />
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <p
            className="forgot-password-link"
            onClick={() => {
              setShowForgot(false);
              setMessage("");
              setForgotEmail("");
            }}
          >
            Back to Login
          </p>
        </form>
      )}

      <p className="auth-footer">
        Dont have an account?{" "}
        <Link to="/register" className="primary-link">
          Register
        </Link>
      </p>

      {showReminderModal && (
        <NotificationSetupModal
          onClose={() => setShowReminderModal(false)}
        />
      )}
    </div>
    </div>
  );
}

export default Login;
