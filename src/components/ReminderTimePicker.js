import React, { useState, useEffect } from "react";
import { api } from "../api";

function ReminderTimePicker({ token, onSave }) {
  const [reminderTime, setReminderTime] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/notification-setting", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      if (res.data) {
        setReminderTime(res.data.reminder_time);
        setEnabled(res.data.enabled);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post("/notification-setting",
      { reminder_time: reminderTime, enabled },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => {
      alert("Reminder time saved!");
      if (onSave) onSave();
    })
    .catch(err => {
      console.error(err);
      alert("Failed to save reminder");
    });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Daily Reminder Time:
        <input
          type="time"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
        />
      </label>
      <div><label>
        Enabled:
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
      </label>
      <button type="submit">Save</button></div>
    </form>
  );
}

export default ReminderTimePicker;
