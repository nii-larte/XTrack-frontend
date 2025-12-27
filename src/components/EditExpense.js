import React, { useState, useEffect } from "react";
import { api } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import HistoryTimeLine from "./HistoryTimeLine";
import "./EditExpense.css";

function EditExpense() {
  const [history, setHistory] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyPages, setHistoryPages] = useState(1);
  const historyPerPage = 5;

  const { id } = useParams();
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

  useEffect(() => {
    fetchExpense();
  }, [id]);

  useEffect(() => {
    fetchHistory();
  }, [id, historyPage]);

  const fetchExpense = async () => {
    try {
      const response = await api.get("/expenses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const expense = response.data.expenses.find(
        (exp) => exp.id === parseInt(id)
      );

      if (!expense) {
        setMessage("Expense not found");
        return;
      }

      setFormData({
        title: expense.title,
        currency: expense.currency,
        amount: expense.amount,
        date: expense.date.split("T")[0],
        category: expense.category,
        description: expense.description || "",
      });
    } catch (error) {
      console.error(error);
      setMessage("Failed to load expense");
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get(`/expenses/${id}/history`, {
        params: {
          page: historyPage,
          per_page: historyPerPage,
        },
      });

      setHistory(res.data.history);
      setHistoryPages(res.data.pages);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/expenses/${id}`, formData);
      setMessage("Expense updated successfully!");
      navigate("/expenses");
    } catch (error) {
      console.error(error);
      setMessage("Failed to update expense");
    }
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) return "None";
    if (!isNaN(value)) return Number(value).toString();
    return value;
  };

  return (
    <div className="edit-expense-container">
      <h2 className="page-title">Edit Expense</h2>

      {message && <p className="form-message">{message}</p>}

      <form className="expense-form" onSubmit={handleSubmit}>
        <input
          className="form-input"
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <select
          className="form-input"
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          required
        >
          <option value="" disabled>-- Select Currency --</option>
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
          className="form-input"
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />

        <input
          className="form-input"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <select
          className="form-input"
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
          className="form-textarea"
          name="description"
          placeholder="Description (optional)"
          value={formData.description}
          onChange={handleChange}
        />

        <button type="submit" className="primary-button">
          Update Expense
        </button>
      </form>

      <h3 className="section-title">Change History</h3>

      <HistoryTimeLine items={history} formatValue={formatValue} />

      {historyPages > 1 && (
        <div className="pagination">
          <button
            className="secondary-button"
            disabled={historyPage === 1}
            onClick={() => setHistoryPage(historyPage - 1)}
          >
            Previous
          </button>

          <span>
            Page {historyPage} of {historyPages}
          </span>

          <button
            className="secondary-button"
            disabled={historyPage === historyPages}
            onClick={() => setHistoryPage(historyPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default EditExpense;
