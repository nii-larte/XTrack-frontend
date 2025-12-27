import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import "./Login.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Show error if token is missing
  useEffect(() => {
    if (!token) {
      setMessage(
        "Invalid or missing reset token. Please use the link sent to your email."
      );
    }
  }, [token]);

  // Clear old tokens after successful password reset
  useEffect(() => {
    if (success) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
    }
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("Cannot reset password: missing token.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post("/reset-password", { token, password });
      setMessage(
        "Password reset successfully! You can now log in with your new password."
      );
      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="page-title">Reset Password</h2>
      {message && <p className="form-message">{message}</p>}

      {/* Show form only if not successful yet */}
      {!success && (
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="form-input"
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className="form-input"
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="primary-button"
            disabled={loading || !token}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}

      {/* Show button to go to login only after success */}
      {success && (
        <button
          className="primary-button"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      )}
    </div>
  );
}

export default ResetPassword;

