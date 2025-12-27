import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    currency: "",
    monthly_budget: "",
    profile_picture: "",
  });

  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      setProfile(res.data);

      if (res.data.profile_picture) {
        setImagePreview(
          `${API_URL}/uploads/profile_pictures/${res.data.profile_picture}`
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const saveProfile = async () => {
    setLoading(true);
    try {
      await api.put("/user/profile", {
        ...profile,
        monthly_budget: parseFloat(profile.monthly_budget),
      });
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const oldPreview = imagePreview;
    setImagePreview(URL.createObjectURL(file));
    if (oldPreview) URL.revokeObjectURL(oldPreview);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/user/profile/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfile((prev) => ({
        ...prev,
        profile_picture: res.data.filename,
      }));

      setImagePreview(
        `${API_URL}/uploads/profile_pictures/${res.data.filename}`
      );

      setMessage("Profile picture updated!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to upload image.");
    }
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  const handleWheelZoom = (e) => {
    e.preventDefault();

    setZoomLevel((prev) => {
      const step = 0.1;
      const next = e.deltaY < 0 ? prev + step : prev - step;
      return Math.min(Math.max(next, 0.5), 3);
    });
  };

  const handleMouseDown = (e) => {
    if (zoomLevel <= 1) return; 
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="profile-container">
      <h2 className="page-title">My Profile</h2>
      {message && <p className="form-message">{message}</p>}

      <div className="profile-image-section">
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Profile"
            className="profile-image"
            onClick={() => setIsImageModalOpen(true)}
            style={{ cursor: "pointer" }}
          />
        )}

        <label className="upload-button">
          Change Photo
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
          />
        </label>
      </div>

      {isImageModalOpen && (
        <div
          className="image-modal-overlay"
          onClick={closeImageModal}
        >
          <div
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheelZoom}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={imagePreview}
              alt="Full Profile"
              onMouseDown={handleMouseDown}
              style={{
                transform: `scale(${zoomLevel}) translate(${pan.x}px, ${pan.y}px)`,
                transition: isDragging.current ? "none" : "transform 0.2s ease",
                cursor: zoomLevel > 1 ? "grab" : "default",
              }}
            />

            <div className="zoom-controls">
              <button onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 3))}>
                +
              </button>
              <button onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.5))}>
                −
              </button>
              <button
                onClick={() => {
                  setZoomLevel(1);
                  setPan({ x: 0, y: 0 });
                }}
              >
                Reset
              </button>
            </div>

            <button
              className="image-modal-close"
              onClick={closeImageModal}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="profile-form">
        <input
          className="form-input"
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          placeholder="Name"
        />

        <input
          className="form-input"
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          placeholder="Email"
        />

        <select
          className="form-input"
          name="currency"
          value={profile.currency}
          onChange={handleChange}
        >
          <option value="" disabled>
            -- Select Currency --
          </option>
          <option value="USD">USD - US Dollar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="GBP">GBP - British Pound</option>
          <option value="NGN">NGN - Nigerian Naira</option>
          <option value="GHS">GHS - Ghana Cedi</option>
          <option value="ZAR">ZAR - South African Rand</option>
          <option value="KES">KES - Kenyan Shilling</option>
          <option value="JPY">JPY - Japanese Yen</option>
          <option value="INR">INR - Indian Rupee</option>
          <option value="CAD">CAD - Canadian Dollar</option>
          <option value="AUD">AUD - Australian Dollar</option>
          <option value="CNY">CNY - Chinese Yuan</option>
          <option value="SAR">SAR - Saudi Riyal</option>
          <option value="AED">AED - Emirati Dirham</option>
          <option value="CHF">CHF - Swiss Franc</option>
          <option value="BRL">BRL - Brazilian Real</option>
          <option value="MXN">MXN - Mexican Peso</option>
          <option value="TRY">TRY - Turkish Lira</option>
          <option value="RUB">RUB - Russian Ruble</option>
          <option value="KRW">KRW - South Korean Won</option>
          <option value="SGD">SGD - Singapore Dollar</option>
          <option value="MYR">MYR - Malaysian Ringgit</option>
          <option value="THB">THB - Thai Baht</option>
          <option value="IDR">IDR - Indonesian Rupiah</option>
          <option value="VND">VND - Vietnamese Dong</option>
          <option value="NZD">NZD - New Zealand Dollar</option>
          <option value="PHP">PHP - Philippine Peso</option>
          <option value="PLN">PLN - Polish Zloty</option>
          <option value="SEK">SEK - Swedish Krona</option>
          <option value="NOK">NOK - Norwegian Krone</option>
          <option value="DKK">DKK - Danish Krone</option>
          <option value="HUF">HUF - Hungarian Forint</option>
          <option value="CZK">CZK - Czech Koruna</option>
          <option value="ILS">ILS - Israeli Shekel</option>
          <option value="EGP">EGP - Egyptian Pound</option>
          <option value="PKR">PKR - Pakistani Rupee</option>
          <option value="BDT">BDT - Bangladeshi Taka</option>
          <option value="LKR">LKR - Sri Lankan Rupee</option>
          <option value="CLP">CLP - Chilean Peso</option>
          <option value="COP">COP - Colombian Peso</option>
          <option value="ARS">ARS - Argentine Peso</option>
        </select>

        <div>
          <label>Monthly Budget</label>
          <input
            className="form-input"
            type="number"
            name="monthly_budget"
            value={profile.monthly_budget}
            onChange={handleChange}
            placeholder="Monthly Budget"
          />
        </div>

        <button
          className="primary-button"
          onClick={saveProfile}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="settings-link">
        <p>
          Want to manage account?{" "}
          <span className="link" onClick={() => navigate("/settings")}>
            Go to Settings
          </span>
        </p>
      </div>
    </div>
  );
}

export default Profile;
