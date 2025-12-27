import React, { useState } from "react";
import ReminderTimePicker from "./ReminderTimePicker";
import "./Modal.css";

function NotificationSetupModal({ token, onClose }) {
  const [reminderSaved, setReminderSaved] = useState(false);

  const handleReminderSaved = () => {
    setReminderSaved(true);
  };

  const handleDone = () => {
    if (reminderSaved) {
      onClose(); 
    } else {
      alert("Please save your reminder before continuing.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Set Your Daily Expense Reminder</h2>
        <p>Choose a time you want to receive a daily reminder to add expenses.</p>
        <ReminderTimePicker token={token} onSave={handleReminderSaved} />
        <button
          className="primary-button"
          onClick={handleDone}
          disabled={!reminderSaved} 
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default NotificationSetupModal;
