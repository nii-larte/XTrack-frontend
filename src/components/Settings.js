import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import ReminderTimePicker from "../components/ReminderTimePicker";
import { ThemeContext } from "../context/ThemeContext";
import "./Settings.css";

function Settings() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handlePasswordChange = (e) =>
    setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const changePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      setMessage("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/change-password", {
        current_password: passwords.current,
        new_password: passwords.new,
      });
      setMessage("Password updated successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;

    try {
      await api.delete("/user/delete");
      localStorage.removeItem("token");

      document.body.setAttribute("data-theme", "light");

      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAllExpenses = async () => {
    if (!window.confirm("This will permanently delete ALL your expenses. Continue?")) return;

    try {
      const res = await api.delete("/expenses");
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete expenses.");
    }
  };

  return (
    <div className="settings-container">
      <h2 className="page-title">Settings</h2>
      {message && <p className="form-message">{message}</p>}

      <section className="settings-section">
        <h3>Appearance</h3>

        <div className="darkmode-toggle">
          <span>Dark Mode</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
            <span className="slider"></span>
          </label>
        </div>
      </section>

      <section className="settings-section">
        <h3>Daily Expense Reminder</h3>
        <ReminderTimePicker token={token} />
      </section>

      <section className="settings-section">
        <h3>Change Password</h3>

        <input
          type="password"
          name="current"
          value={passwords.current}
          onChange={handlePasswordChange}
          placeholder="Current Password"
        />

        <div><input
          type="password"
          name="new"
          value={passwords.new}
          onChange={handlePasswordChange}
          placeholder="New Password"
        /></div>

        <input
          type="password"
          name="confirm"
          value={passwords.confirm}
          onChange={handlePasswordChange}
          placeholder="Confirm New Password"
        />

        <div><button
          className="primary-button"
          onClick={changePassword}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </button></div>
      </section>

      <section className="settings-section">
        <button className="danger-button" onClick={deleteAllExpenses}>
          Delete All Expenses
        </button>
        <div>
        <button className="danger-button" onClick={deleteAccount}>
          Delete Account
        </button></div>
      </section>
    </div>
  );
}

export default Settings;

