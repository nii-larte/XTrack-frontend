import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./api";


const IDLE_LIMIT = 25 * 60 * 1000; 
const WARNING_TIME = 5 * 60 * 1000; 

export default function IdleSessionManager() {
  const navigate = useNavigate();

  const idleTimer = useRef(null);
  const warningTimer = useRef(null);
  const countdownInterval = useRef(null);

  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(WARNING_TIME / 1000);

  const resetTimers = () => {
    if (!localStorage.getItem("token")) return;

    clearTimeout(idleTimer.current);
    clearTimeout(warningTimer.current);
    clearInterval(countdownInterval.current);
    setShowWarning(false);
    setTimeLeft(WARNING_TIME / 1000);

    warningTimer.current = setTimeout(() => {
      setShowWarning(true);
      startCountdown();
    }, IDLE_LIMIT - WARNING_TIME);

    idleTimer.current = setTimeout(() => {
      logout();
    }, IDLE_LIMIT);
  };

  const startCountdown = () => {
    countdownInterval.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setShowWarning(false);
    navigate("/login");
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimers));

    resetTimers();

    window.addEventListener("force-logout", logout);

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetTimers)
      );
      window.removeEventListener("force-logout", logout);
      clearTimeout(idleTimer.current);
      clearTimeout(warningTimer.current);
      clearInterval(countdownInterval.current);
    };
  }, []);

  if (!showWarning) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const stayLoggedIn = async () => {
    resetTimers();

    try {
      const refreshToken = localStorage.getItem("refresh_token");
      const res = await api.post(
        "/refresh",
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      localStorage.setItem("token", res.data.access_token);
    } catch {
      logout();
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Session Expiring</h3>
        <p>
          You will be logged out in {" "} due to inactivity 
          <strong>
            {minutes}:{seconds < 10 ? "0" : ""}
            {seconds}
          </strong>
        </p>
        <button style={styles.button} onClick={stayLoggedIn}>
          Stay Logged In
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  modal: {
    background: "#fff",
    padding: 24,
    borderRadius: 8,
    maxWidth: 320,
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  button: {
    marginTop: 16,
    padding: "10px 16px",
    border: "none",
    borderRadius: 6,
    backgroundColor: "#2563eb",
    color: "#fff",
    cursor: "pointer",
  },
};
