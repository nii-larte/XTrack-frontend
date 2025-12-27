import React, { useState, useRef, useEffect } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import NotificationSetupModal from "./NotificationSetupModal";
import "./AddExpense.css";

function AddExpense() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    currency: "",
    amount: "",
    date: "",
    category: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState("monthly");
  const [firstExpenseDone, setFirstExpenseDone] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const descriptionRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "description") {
      const ta = descriptionRef.current;
      ta.style.height = "auto"; 
      ta.style.height = ta.scrollHeight + "px"; 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      is_recurring: isRecurring,
      recurring_frequency: isRecurring ? recurringFrequency : null,
    };

    try {
      await api.post("/expenses", payload);
      setMessage("Expense added successfully!");
      setFirstExpenseDone(true); 
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setMessage("Failed to add expense");
    }
  };

  useEffect(() => {
    if (descriptionRef.current) {
      const ta = descriptionRef.current;
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    }
  }, []);

  useEffect(() => {
    if (!firstExpenseDone) return;

    api.get("/notification-setting")
      .then(res => {
        if (!res.data) setShowNotificationModal(true);
      })
      .catch(err => console.error(err));
  }, [firstExpenseDone]);
  


  return (
    <div className="add-expense-container">
      <h2>Add Expense</h2>
      {showNotificationModal && (
        <NotificationSetupModal onClose={() => setShowNotificationModal(false)} />
      )}

      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} className="add-expense-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <select
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          required
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

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />

        <label>
          Date
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </label>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Transportation">Transportation</option>
          <option value="Bills">Bills</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Groceries">Groceries</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Utilities">Utilities</option>
          <option value="Insurance">Insurance</option>
          <option value="Subscriptions">Subscriptions</option>
          <option value="Gifts">Gifts</option>
          <option value="Personal Care">Personal Care</option>
          <option value="Investments">Investments</option>
          <option value="Taxes">Taxes</option>
          <option value="Charity">Charity</option>
          <option value="Business">Business</option>
          <option value="Others">Others</option>
        </select>

        <textarea
          ref={descriptionRef}
          name="description"
          placeholder="Description (optional)"
          value={formData.description}
          onChange={handleChange}
          style={{ overflow: "hidden", resize: "none" }}
        />

        <label>
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          />
          Make this a recurring expense
        </label>

        {isRecurring && (
          <select
            name="recurringFrequency"
            value={recurringFrequency}
            onChange={(e) => setRecurringFrequency(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        )}

        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
}

export default AddExpense;
