import React, { useState } from "react";
import { api } from "../api";
import "./Login.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await api.post("/forgot-password", { email: email.trim() });
      setMessage(response.data.message || "A reset link has been sent to your email!");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <h2 className="page-title">Forgot Password</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? "Sending..." : "Send Reset Link"}</button>
      </form>
    </div>
  );
}

export default ForgotPassword;
